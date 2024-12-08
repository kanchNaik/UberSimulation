from rest_framework import status, viewsets
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from rest_framework.decorators import action
from .models import Driver, Vehicle
from .serializers import DriverRegistrationSerializer, DriverListSerializer, \
    DriverLocationSerializer, NearbyDriverSerializer, DriverIntroVideoSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.decorators import authentication_classes, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.views import APIView
from rides.models import Ride
from Billing.models import Bill
from django.db.models import Sum, Avg, Count
from django.utils.timezone import now, timedelta
from django.db.models import Q

class DriverViewSet(viewsets.ModelViewSet):
    """
    ViewSet for handling CRUD operations for Driver.
    """
    queryset = Driver.objects.all()
    
    def get_serializer_class(self):
        """
        Dynamically switch serializer classes based on the action.
        """
        if self.action == 'create':
            return DriverRegistrationSerializer
        elif self.action in ['list', 'retrieve']:
            return DriverListSerializer
        elif self.action == 'set_location':
            return DriverLocationSerializer
        elif self.action == 'nearby_drivers':
            return NearbyDriverSerializer
        elif self.action == 'upload_intro_video':
            return DriverIntroVideoSerializer
        return super().get_serializer_class()

    def get_permissions(self):
        if self.action == 'create' or self.action == 'list':
            return [AllowAny()]
        return [IsAuthenticated()]

    def get_authentication_classes(self):
        if self.action == 'create' or self.action == 'list':
            return []
        return [JWTAuthentication()]
    
    def list(self, request, *args, **kwargs):
        """
        List all drivers.
        """
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def retrieve(self, request, *args, **kwargs):
        """
        Retrieve a single driver by ID.
        """
        driver = get_object_or_404(Driver, pk=kwargs.get('pk'))
        serializer = self.get_serializer(driver)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def create(self, request, *args, **kwargs):
        """
        Handles driver registration.
        """
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            driver = serializer.save()
            return Response(
                {
                    "message": "Driver registered successfully!",
                    "user_id": driver.user.id,
                    "driver_id": driver.id
                },
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, *args, **kwargs):
        """
        Handles both PUT (full update) and PATCH (partial update).
        """
        partial = kwargs.pop('partial', False)
        driver = get_object_or_404(Driver, pk=kwargs.get('pk'))
        serializer = DriverRegistrationSerializer(driver, data=request.data, partial=partial)

        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Driver updated successfully!"}, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, *args, **kwargs):
        """
        Handles driver deletion.
        """
        driver = get_object_or_404(Driver, pk=kwargs.get('pk'))
        driver.user.delete()  # Deletes the related User as well
        driver.delete()
        return Response({"message": "Driver deleted successfully!"}, status=status.HTTP_200_OK)
    

    @action(detail=True, methods=['put'], url_path='set-location')
    def set_location(self, request, pk=None):
        """
        Custom action to set the latitude and longitude of a customer.
        """
        try:
            driver = self.get_object()
        except Driver.DoesNotExist:
            return Response({"error": "Driver not found."}, status=status.HTTP_404_NOT_FOUND)

        serializer = DriverLocationSerializer(driver, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['get'], url_path='search')
    def search_drivers(self, request):
        """
        Search for drivers based on any combination of attributes.
        """
        # Get query parameters
        filters = {}
        allowed_fields = [
            'user__username', 'user__email', 'first_name', 'last_name', 
            'phone_number', 'address', 'city', 'state', 'zip_code', 
            'license_number', 'rating', 'is_available'
        ]

        for field in allowed_fields:
            value = request.query_params.get(field)
            if value:
                # Build a filter for the query
                filters[field] = value

        if not filters:
            return Response({"error": "No filters provided."}, status=400)

        # Query the database with the filters
        drivers = Driver.objects.filter(**filters)

        # Serialize and return the results
        serializer = DriverListSerializer(drivers, many=True)
        return Response(serializer.data, status=200)
    
    @action(detail=True, methods=['post'], url_path='upload-video')
    def upload_intro_video(self, request, pk=None):
        """
        API to upload an introductory video for a driver.
        """
        try:
            # Get the driver object
            driver = self.get_object()

            # Serialize and validate the data
            serializer = self.get_serializer(driver, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=200)
            return Response(serializer.errors, status=400)

        except Driver.DoesNotExist:
            return Response({"error": "Driver not found."}, status=404)
    
    @action(detail=True, methods=['get'], url_path='stats')
    def get_driver_stats(self, request, pk=None):
        try:
            # Fetch the driver
            driver = Driver.objects.get(id=pk)
            print(driver)
            # Total trips
            total_trips = Ride.objects.filter(driver=driver).count()

            # Total earnings
            total_earnings = Bill.objects.filter(driver=driver, status='paid').aggregate(Sum('amount'))['amount__sum'] or 0

            # Average rating
            average_rating = driver.rating or 0

            # Recent trips
            recent_trips = Ride.objects.filter(driver=driver).order_by('-date_time')[:5]
            recent_trips_data = [
                {
                    'ride_id': str(ride.ride_id),
                    'pickup': str(ride.pickup_location), 
                    'dropoff': str(ride.dropoff_location),
                    'fare': ride.fare,
                    'date': ride.date_time,
                }
                for ride in recent_trips
            ]

            # Earnings breakdown
            today = now().date()
            daily_earnings = Bill.objects.filter(driver=driver, status='paid', date=today).aggregate(Sum('amount'))['amount__sum'] or 0
            weekly_earnings = Bill.objects.filter(driver=driver, status='paid', date__gte=today - timedelta(days=7)).aggregate(Sum('amount'))['amount__sum'] or 0
            monthly_earnings = Bill.objects.filter(driver=driver, status='paid', date__gte=today - timedelta(days=30)).aggregate(Sum('amount'))['amount__sum'] or 0

            # Response data
            data = {
                'total_trips': total_trips,
                'total_earnings': total_earnings,
                'average_rating': average_rating,
                'recent_trips': recent_trips_data,
                'earnings_breakdown': {
                    'daily': daily_earnings,
                    'weekly': weekly_earnings,
                    'monthly': monthly_earnings,
                },
            }

            return Response(data)

        except Driver.DoesNotExist:
            return Response({'error': 'Driver not found'}, status=404)
    
    @action(detail=True, methods=['get'], url_path='getstatus')
    def get_driveractivestatus(self, request, pk=None):
        try:
            driver = Driver.objects.get(pk=pk)
            return Response(driver.is_available)
        except Driver.DoesNotExist:
            return Response({"error": "Driver not found"}, status=status.HTTP_404_NOT_FOUND)
    
    @action(detail=True, methods=['get'], url_path='setactive')
    def set_active(self, request, pk=None):
        try:
            driver = Driver.objects.get(pk=pk)
            driver.is_available = True
            driver.save()
            return Response({"message": "Driver activated successfully"}, status=status.HTTP_200_OK)
        except Driver.DoesNotExist:
            return Response({"error": "Driver not found"}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=True, methods=['get'], url_path='setdeactive')
    def set_deactive(self, request, pk=None):
        try:
            driver = Driver.objects.get(pk=pk)
            driver.is_available = False
            driver.save()
            return Response({"message": "Driver de-activated successfully"}, status=status.HTTP_200_OK)
        except Driver.DoesNotExist:
            return Response({"error": "Driver not found"}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=False, methods=['get'], url_path='search')
    def search(self, request):
        # Get search parameters from query params
        username = request.query_params.get('username')
        first_name = request.query_params.get('first_name')
        last_name = request.query_params.get('last_name')
        city = request.query_params.get('city')
        state = request.query_params.get('state')
        zip_code = request.query_params.get('zip_code')
        license_number = request.query_params.get('license_number')
        license_plate = request.query_params.get('license_plate')
        vehicle_make = request.query_params.get('vehicle_make')
        vehicle_model = request.query_params.get('vehicle_model')
        vehicle_year = request.query_params.get('vehicle_year')

        # Start with all drivers
        queryset = Driver.objects.all()

        # Apply filters based on provided parameters
        if username:
            queryset = queryset.filter(user__username__icontains=username)
        if first_name:
            queryset = queryset.filter(first_name__icontains=first_name)
        if last_name:
            queryset = queryset.filter(last_name__icontains=last_name)
        if city:
            queryset = queryset.filter(city__icontains=city)
        if state:
            queryset = queryset.filter(state__icontains=state)
        if zip_code:
            queryset = queryset.filter(zip_code=zip_code)
        if license_number:
            queryset = queryset.filter(license_number=license_number)
        
        # Vehicle related filters
        vehicle_filters = Q()
        if license_plate:
            vehicle_filters &= Q(vehicle__license_plate=license_plate)
        if vehicle_make:
            vehicle_filters &= Q(vehicle__make__icontains=vehicle_make)
        if vehicle_model:
            vehicle_filters &= Q(vehicle__model__icontains=vehicle_model)
        if vehicle_year:
            vehicle_filters &= Q(vehicle__year=vehicle_year)
        
        if vehicle_filters:
            queryset = queryset.filter(vehicle_filters)

        # Serialize the results
        results = [{
            'id': driver.id,
            'username': driver.user.username,
            'first_name': driver.first_name,
            'last_name': driver.last_name,
            'city': driver.city,
            'state': driver.state,
            'zip_code': driver.zip_code,
            'license_number': driver.license_number,
            'vehicle': {
                'make': driver.vehicle.make,
                'model': driver.vehicle.model,
                'year': driver.vehicle.year,
                'license_plate': driver.vehicle.license_plate
            } if driver.vehicle else None
        } for driver in queryset]

        return Response({
            'count': len(results),
            'results': results
        }, status=status.HTTP_200_OK)