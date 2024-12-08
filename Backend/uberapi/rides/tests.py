from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from datetime import datetime, timedelta
from django.contrib.auth import get_user_model
from .models import Ride, Location, RideEventImage, Review
from customer.models import Customer
from driver.models import Driver
from decimal import Decimal
from django.utils import timezone

User = get_user_model()

class LocationModelTest(TestCase):
    def setUp(self):
        self.location_data = {
            'latitude': 40.7128,
            'longitude': -74.0060,
            'locationName': 'Times Square',
            'locationCity': 'New York'
        }
        self.location = Location.objects.create(**self.location_data)

    def test_location_creation(self):
        self.assertEqual(self.location.latitude, 40.7128)
        self.assertEqual(self.location.longitude, -74.0060)
        self.assertEqual(self.location.locationName, 'Times Square')
        self.assertEqual(self.location.locationCity, 'New York')

    def test_location_str_representation(self):
        expected_str = f"Lat: {self.location.latitude}, Lon: {self.location.longitude}"
        self.assertEqual(str(self.location), expected_str)

class RideModelTest(TestCase):
    def setUp(self):
        # Create test user, customer, and driver
        # Create test user, customer, and driver with unique emails
        self.user1 = User.objects.create_user(
            username='customer1', 
            password='pass123',
            email='customer1@test.com'
        )
        self.user2 = User.objects.create_user(
            username='driver1', 
            password='pass123',
            email='driver1@test.com'
        )
        self.customer = Customer.objects.create(user=self.user1, first_name='John', last_name='Doe')
        self.driver = Driver.objects.create(user=self.user2, first_name='Jane', last_name='Smith')
        
        # Create locations
        self.pickup = Location.objects.create(
            latitude=40.7128, longitude=-74.0060,
            locationName='Times Square', locationCity='New York'
        )
        self.dropoff = Location.objects.create(
            latitude=40.7614, longitude=-73.9776,
            locationName='Central Park', locationCity='New York'
        )

        # Create ride
        self.ride = Ride.objects.create(
            pickup_location=self.pickup,
            dropoff_location=self.dropoff,
            date_time=timezone.now(),
            pickup_time=timezone.now(),
            dropoff_time=timezone.now() + timedelta(hours=1),
            customer=self.customer,
            driver=self.driver,
            fare=25.50,
            distance=3.2,
            status='active'
        )

    def test_ride_creation(self):
        self.assertIsNotNone(self.ride.ride_id)
        self.assertEqual(self.ride.status, 'active')
        self.assertEqual(self.ride.customer, self.customer)
        self.assertEqual(self.ride.driver, self.driver)

    def test_ride_id_format(self):
        # Check if ride_id matches SSN format (XXX-XX-XXXX)
        self.assertRegex(self.ride.ride_id, r'^\d{3}-\d{2}-\d{4}$')

class RideAPITest(APITestCase):
    def setUp(self):
        self.client = APIClient()
        # Create test users and profiles
        self.user1 = User.objects.create_user(
            username='customer1', 
            password='pass123',
            email='customer1@test.com'
        )
        self.user2 = User.objects.create_user(
            username='driver1', 
            password='pass123',
            email='driver1@test.com'
        )
        self.customer = Customer.objects.create(user=self.user1, first_name='John', last_name='Doe')
        self.driver = Driver.objects.create(user=self.user2, first_name='Jane', last_name='Smith')

        # Create test locations
        self.pickup = Location.objects.create(
            latitude=40.7128, longitude=-74.0060,
            locationName='Times Square', locationCity='New York'
        )
        self.dropoff = Location.objects.create(
            latitude=40.7614, longitude=-73.9776,
            locationName='Central Park', locationCity='New York'
        )

    def test_create_ride(self):
        url = reverse('rides-list')
        data = {
            'pickup_location': {
                'latitude': 40.7128,
                'longitude': -74.0060,
                'locationName': 'Times Square',
                'locationCity': 'New York'
            },
            'dropoff_location': {
                'latitude': 40.7614,
                'longitude': -73.9776,
                'locationName': 'Central Park',
                'locationCity': 'New York'
            },
            'date_time': timezone.now().isoformat(),
            'pickup_time': timezone.now().isoformat(),
            'dropoff_time': (timezone.now() + timedelta(hours=1)).isoformat(),
            'customer': self.customer.id,
            'driver': self.driver.id,
            'fare': 25.50,
            'distance': 3.2,
            'status': 'active'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('ride_id', response.data)

    def test_ride_search(self):
        # Create a test ride first
        ride = Ride.objects.create(
            pickup_location=self.pickup,
            dropoff_location=self.dropoff,
            date_time=timezone.now(),
            pickup_time=timezone.now(),
            dropoff_time=timezone.now() + timedelta(hours=1),
            customer=self.customer,
            driver=self.driver,
            fare=25.50,
            distance=3.2,
            status='active'
        )

        url = reverse('rides-ride-search-api')
        response = self.client.get(url, {
            'customer': 'John',
            'driver': 'Jane',
            'validate': 'true'
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(len(response.data) > 0)

class ReviewModelTest(TestCase):
    def setUp(self):
        # Create test users and profiles
        self.user1 = User.objects.create_user(username='customer1', password='pass123')
        self.user2 = User.objects.create_user(username='driver1', password='pass123')
        self.customer = Customer.objects.create(user=self.user1, first_name='John', last_name='Doe')
        self.driver = Driver.objects.create(user=self.user2, first_name='Jane', last_name='Smith')

        # Create test locations and ride
        self.pickup = Location.objects.create(
            latitude=40.7128, longitude=-74.0060,
            locationName='Times Square', locationCity='New York'
        )
        self.dropoff = Location.objects.create(
            latitude=40.7614, longitude=-73.9776,
            locationName='Central Park', locationCity='New York'
        )
        self.ride = Ride.objects.create(
            pickup_location=self.pickup,
            dropoff_location=self.dropoff,
            date_time=timezone.now(),
            pickup_time=timezone.now(),
            dropoff_time=timezone.now() + timedelta(hours=1),
            customer=self.customer,
            driver=self.driver,
            fare=25.50,
            distance=3.2,
            status='completed'
        )

    def test_create_driver_review(self):
        review = Review.objects.create(
            customer=self.customer,
            driver=self.driver,
            review_text="Great service!",
            rating=5
        )
        self.assertEqual(review.rating, 5)
        self.assertEqual(review.review_text, "Great service!")

    def test_create_ride_review(self):
        review = Review.objects.create(
            customer=self.customer,
            ride=self.ride,
            review_text="Smooth ride!",
            rating=4
        )
        self.assertEqual(review.rating, 4)
        self.assertEqual(review.review_text, "Smooth ride!")
   