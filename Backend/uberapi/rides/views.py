from rest_framework import viewsets, status
from rest_framework.response import Response

from .consumers import RideAssignmentConsumer
from .models import Ride, RideEventImage, Review, RideRequest
from .serializers import RideSerializer, RideEventImageSerializer, ReviewSerializer, RideRequestSerializer
from .models import Ride, RideEventImage, Review, Location
from .serializers import RideSerializer, RideEventImageSerializer, ReviewSerializer
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from customer.models import Customer
from tasks import process_ride_request
from django.db import transaction
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.authentication import JWTAuthentication

class RideViewSet(viewsets.ModelViewSet):
    """
    A ViewSet for viewing, creating, updating, and deleting rides.
    """
    queryset = Ride.objects.all()
    serializer_class = RideSerializer

    def get_permissions(self):
        if self.action == 'create' or self.action == 'bulk_register' or self.action == 'list':
            return [AllowAny()]
        return [IsAuthenticated()]

    def get_authentication_classes(self):
        if self.action == 'create' or self.action == 'bulk_register' or self.action == 'list':
            return []
        return [JWTAuthentication()]

    def list(self, request):
        """
        List all rides or filter by customer_id and/or driver_id.
        """
        customer_id = request.query_params.get('customer_id')
        driver_id = request.query_params.get('driver_id')

        queryset = Ride.objects.all()
        if customer_id:
            queryset = queryset.filter(customer__id=customer_id)
        if driver_id:
            queryset = queryset.filter(driver__id=driver_id)

        serializer = RideSerializer(queryset, many=True)
        return Response(serializer.data)

    def retrieve(self, request, pk=None):
        """
        Retrieve a single ride by its primary key.
        """
        try:
            ride = Ride.objects.get(pk=pk)
        except Ride.DoesNotExist:
            return Response({"error": "Ride not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = RideSerializer(ride)
        return Response(serializer.data)

    def create(self, request):
        """
        Create a new ride.
        """
        serializer = RideSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, pk=None):
        """
        Update an existing ride. Supports both PUT (full update) and PATCH (partial update).
        """
        try:
            ride = Ride.objects.get(pk=pk)
        except Ride.DoesNotExist:
            return Response({"error": "Ride not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = RideSerializer(ride, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

    def destroy(self, request, pk=None):
        """
        Delete a ride by its primary key.
        """
        try:
            ride = Ride.objects.get(pk=pk)
        except Ride.DoesNotExist:
            return Response({"error": "Ride not found"}, status=status.HTTP_404_NOT_FOUND)

        ride.delete()
        return Response({"message": "Ride deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
    
    
    @action(detail=False, methods=["post"], url_path="bulk-register")
    def bulk_register(self, request, *args, **kwargs):
        """
        Handles bulk ride registration using bulk_create.
        """
        ride_data = request.data

        if not isinstance(ride_data, list):
            return Response(
                {"error": "Input must be a list of ride objects."},
                status=status.HTTP_400_BAD_REQUEST
            )

        rides_to_create = []
        errors = []

        # Track created locations to avoid duplicates
        location_cache = {}

        def get_or_create_location(location_data):
            # Use a tuple of latitude and longitude as a key for caching
            loc_key = (location_data['latitude'], location_data['longitude'])
            if loc_key not in location_cache:
                location, created = Location.objects.get_or_create(
                    latitude=location_data['latitude'],
                    longitude=location_data['longitude']
                )
                location_cache[loc_key] = location
            return location_cache[loc_key]

        for ride in ride_data:
            serializer = self.get_serializer(data=ride)
            if serializer.is_valid():
                ride_data_valid = serializer.validated_data

                # Create or get the locations
                pickup_location_data = ride_data_valid.pop('pickup_location')
                dropoff_location_data = ride_data_valid.pop('dropoff_location')
                pickup_location = get_or_create_location(pickup_location_data)
                dropoff_location = get_or_create_location(dropoff_location_data)

                ride = Ride(
                        pickup_location=pickup_location,
                        dropoff_location=dropoff_location,
                        **ride_data_valid
                    )
                
                ride.ride_id = ride.generate_ride_id()
                # Prepare the Ride instance
                rides_to_create.append(
                    ride
                )
            else:
                errors.append({"data": ride, "errors": serializer.errors})

        if errors:
            return Response(
                {"error": "Validation errors occurred.", "details": errors},
                status=status.HTTP_400_BAD_REQUEST,
            )

        with transaction.atomic():
            Ride.objects.bulk_create(rides_to_create)

        return Response(
            {"message": f"Successfully registered {len(rides_to_create)} rides."},
            status=status.HTTP_201_CREATED,
        )

class RideEventImageViewSet(viewsets.ModelViewSet):
    queryset = RideEventImage.objects.all()
    serializer_class = RideEventImageSerializer
    #permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """
        Restrict the images to those uploaded by the authenticated customer.
        """
        if self.request.user.customer_profile:
            return RideEventImage.objects.filter(customer=self.request.user.customer_profile)
        return RideEventImage.objects.none()

    @action(detail=False, methods=['post'], url_path='upload')
    def upload_image(self, request):
        """
        API to upload a new ride event image.
        """
        # Extract customer ID and ride ID from the request body
        customer_id = request.data.get('customer')
        ride_id = request.data.get('ride')

        if not customer_id or not ride_id:
            return Response({"error": "Customer ID and Ride ID are required."}, status=400)

        # Check if the customer exists
        try:
            customer = Customer.objects.get(id=customer_id)
        except Customer.DoesNotExist:
            return Response({"error": "Customer not found."}, status=404)

        # Check if the ride exists and is associated with the given customer
        try:
            ride = Ride.objects.get(ride_id=ride_id, customer=customer)
        except Ride.DoesNotExist:
            return Response({"error": "Ride not found or not associated with the customer."}, status=404)

        # Prepare data for serializer
        data = request.data.copy()
        data['customer'] = customer.id  # Ensure customer ID is properly set

        # Serialize and validate data
        serializer = self.get_serializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)

        # Handle validation errors
        return Response(serializer.errors, status=400)
    


class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer

    def perform_create(self, serializer):
        """
        Automatically associate the review with the logged-in customer.
        """
        serializer.save(customer=self.request.user)

    @action(detail=False, methods=["get"], url_path="driver-reviews/(?P<driver_id>[^/.]+)")
    def driver_reviews(self, request, driver_id=None):
        """
        Retrieve all reviews for a specific driver.
        """
        reviews = Review.objects.filter(driver_id=driver_id)
        serializer = self.get_serializer(reviews, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=["get"], url_path="ride-reviews/(?P<ride_id>[^/.]+)")
    def ride_reviews(self, request, ride_id=None):
        """
        Retrieve all reviews for a specific ride.
        """
        reviews = Review.objects.filter(ride_id=ride_id)
        serializer = self.get_serializer(reviews, many=True)
        return Response(serializer.data)

class RideRequestViewSet(viewsets.ModelViewSet):
    queryset = RideRequest.objects.all()
    serializer_class = RideRequestSerializer

    def post(self, request):
        serializer = RideRequestSerializer(data=request.data)

        if serializer.is_valid():
            # Async task to process ride request
            ride_request = serializer.save()

            # Schedule a background task to process the ride request
            process_ride_request.delay(ride_request.id)

            return Response({
                'ride_request_id': ride_request.id,
                'status': 'Processing'
            }, status=status.HTTP_202_ACCEPTED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
