from rest_framework import viewsets, status
from rest_framework.response import Response
from .models import Ride, RideEventImage, Review
from .serializers import RideSerializer, RideEventImageSerializer, ReviewSerializer, RideSearchSerializer
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from customer.models import Customer
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.decorators import authentication_classes, permission_classes
from rest_framework.permissions import AllowAny
from datetime import datetime
from django.db.models import Q
from accounts.models import User

class RideViewSet(viewsets.ModelViewSet):
    """
    A ViewSet for viewing, creating, updating, and deleting rides.
    """
    queryset = Ride.objects.all()
    serializer_class = RideSerializer
    def get_permissions(self):
        if self.action == 'create' or self.action == 'list':
            return [AllowAny()]
        return [IsAuthenticated()]

    def get_authentication_classes(self):
        if self.action == 'create' or self.action == 'list':
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
    

    @action(detail=False, methods=["get"], url_path="ride-search")
    def ride_search_api(self, request):
        queryset = Ride.objects.all()

        # Filter by driver or customer
        driver_name = request.query_params.get('driver')
        customer_name = request.query_params.get('customer')
        if driver_name:
            queryset = queryset.filter(
                Q(driver__first_name__icontains=driver_name) |
                Q(driver__last_name__icontains=driver_name)
            )

        if customer_name:
            queryset = queryset.filter(
                Q(customer__first_name__icontains=customer_name) |
                Q(customer__last_name__icontains=customer_name)
            )

        # Filter by validation status
        validate = request.query_params.get('validate')
        if validate is not None:
            queryset = queryset.filter(validate=validate.lower() == 'true')

        # Filter by pickup and dropoff times
        pickup_start = request.query_params.get('pickup_start')
        pickup_end = request.query_params.get('pickup_end')
        dropoff_start = request.query_params.get('dropoff_start')
        dropoff_end = request.query_params.get('dropoff_end')

        if pickup_start:
            queryset = queryset.filter(pickup_time__gte=datetime.fromisoformat(pickup_start))
        if pickup_end:
            queryset = queryset.filter(pickup_time__lte=datetime.fromisoformat(pickup_end))
        if dropoff_start:
            queryset = queryset.filter(dropoff_time__gte=datetime.fromisoformat(dropoff_start))
        if dropoff_end:
            queryset = queryset.filter(dropoff_time__lte=datetime.fromisoformat(dropoff_end))

        # Filter by distance
        distance_min = request.query_params.get('distance_min')
        distance_max = request.query_params.get('distance_max')
        if distance_min:
            queryset = queryset.filter(distance__gte=float(distance_min))
        if distance_max:
            queryset = queryset.filter(distance__lte=float(distance_max))

        # Filter by fare
        fare_min = request.query_params.get('fare_min')
        fare_max = request.query_params.get('fare_max')
        if fare_min:
            queryset = queryset.filter(fare__gte=float(fare_min))
        if fare_max:
            queryset = queryset.filter(fare__lte=float(fare_max))

        # Filter by pickup and dropoff location name or city
        pickup_name = request.query_params.get('pickup_name')
        pickup_city = request.query_params.get('pickup_city')
        dropoff_name = request.query_params.get('dropoff_name')
        dropoff_city = request.query_params.get('dropoff_city')

        if pickup_name:
            print(pickup_name)
            serializer = RideSearchSerializer(queryset, many=True)
            print(serializer.data)
            queryset = queryset.filter(pickup_location__locationName__icontains=pickup_name)
        if pickup_city:
            queryset = queryset.filter(pickup_location__locationCity__icontains=pickup_city)

        if dropoff_name:
            queryset = queryset.filter(dropoff_location__locationName__icontains=dropoff_name)
        if dropoff_city:
            queryset = queryset.filter(dropoff_location__locationCity__icontains=dropoff_city)

        # Ordering
        ordering = request.query_params.get('ordering', '-pickup_time')
        queryset = queryset.order_by(ordering)

        # Serialize and return the results
        serializer = RideSearchSerializer(queryset, many=True)
        return Response(serializer.data)


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


    