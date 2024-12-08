from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from decimal import Decimal
from .models import Driver, Vehicle
from .serializers import DriverRegistrationSerializer, VehicleSerializer

User = get_user_model()

class VehicleModelTest(TestCase):
    def setUp(self):
        self.vehicle_data = {
            'make': 'Toyota',
            'model': 'Camry',
            'year': 2020,
            'license_plate': 'ABC123'
        }
        self.vehicle = Vehicle.objects.create(**self.vehicle_data)

    def test_vehicle_creation(self):
        self.assertEqual(self.vehicle.make, self.vehicle_data['make'])
        self.assertEqual(self.vehicle.model, self.vehicle_data['model'])
        self.assertEqual(self.vehicle.year, self.vehicle_data['year'])
        self.assertEqual(self.vehicle.license_plate, self.vehicle_data['license_plate'])

    def test_vehicle_str_representation(self):
        expected_str = f"Toyota Camry ({self.vehicle.id})"
        self.assertEqual(str(self.vehicle), expected_str)

class DriverModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='testdriver',
            email='driver@test.com',
            password='testpass123'
        )
        self.vehicle = Vehicle.objects.create(
            make='Honda',
            model='Civic',
            year=2019,
            license_plate='XYZ789'
        )
        self.driver_data = {
            'user': self.user,
            'first_name': 'Test',
            'last_name': 'Driver',
            'phone_number': '1234567890',
            'city': 'Test City',
            'state': 'Test State',
            'zip_code': '12345',
            'license_number': 'DL123456',
            'vehicle': self.vehicle
        }
        self.driver = Driver.objects.create(**self.driver_data)

    def test_driver_creation(self):
        self.assertEqual(self.driver.user, self.user)
        self.assertEqual(self.driver.first_name, self.driver_data['first_name'])
        self.assertEqual(self.driver.vehicle, self.vehicle)
        self.assertTrue(self.driver.is_available)

    def test_driver_str_representation(self):
        expected_str = f"testdriver ({self.driver.id})"
        self.assertEqual(str(self.driver), expected_str)

    def test_unique_id_generation(self):
        self.assertIsNotNone(self.driver.id)
        self.assertRegex(self.driver.id, r'^\d{3}-\d{2}-\d{4}$')

class DriverAPITest(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.vehicle_data = {
            'make': 'Toyota',
            'model': 'Camry',
            'year': 2020,
            'license_plate': 'ABC123'
        }
        self.driver_data = {
            'username': 'testdriver',
            'email': 'driver@test.com',
            'password': 'testpass123',
            'first_name': 'Test',
            'last_name': 'Driver',
            'phone_number': '1234567890',
            'city': 'Test City',
            'state': 'Test State',
            'zip_code': '12345',
            'license_number': 'DL123456',
            'vehicle': self.vehicle_data,
            'locationName': 'Test Location',
            'locationCity': 'Test City'
        }

    def test_driver_registration(self):
        response = self.client.post('/api/drivers/', self.driver_data, format='json')
        if response.status_code != status.HTTP_201_CREATED:
            print(response.data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('message', response.data)
        self.assertIn('user_id', response.data)
        self.assertIn('driver_id', response.data)

    def test_driver_location_update(self):
        # First create a driver
        registration_response = self.client.post('/api/drivers/', self.driver_data, format='json')
        self.assertEqual(registration_response.status_code, status.HTTP_201_CREATED)
        
        driver_id = registration_response.data.get('driver_id')
        self.assertIsNotNone(driver_id, "Driver ID not found in response")
        
        # Login the driver
        login_response = self.client.post('/api/token/', {
            'username': 'testdriver',
            'password': 'testpass123'
        }, format='json')
        self.assertEqual(login_response.status_code, status.HTTP_200_OK)
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {login_response.data['access']}")

        # Update location
        location_data = {
            'latitude': '37.7749',
            'longitude': '-122.4194',
            'locationName': 'San Francisco',
            'locationCity': 'San Francisco'
        }
        response = self.client.put(f'/api/drivers/{driver_id}/set-location/', location_data, format='json')
        if response.status_code != status.HTTP_200_OK:
            print(response.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(Decimal(response.data['latitude']), Decimal('37.7749'))
        self.assertEqual(Decimal(response.data['longitude']), Decimal('-122.4194'))

class SerializerTests(TestCase):
    def test_vehicle_serializer(self):
        vehicle_data = {
            'make': 'Toyota',
            'model': 'Camry',
            'year': 2020,
            'license_plate': 'ABC123'
        }
        serializer = VehicleSerializer(data=vehicle_data)
        self.assertTrue(serializer.is_valid())

    def test_driver_registration_serializer(self):
        # Create vehicle data
        vehicle_data = {
            'make': 'Toyota',
            'model': 'Camry',
            'year': 2020,
            'license_plate': 'ABC123'
        }

        data = {
            'username': 'testdriver',
            'email': 'driver@test.com',
            'password': 'testpass123',
            'first_name': 'Test',
            'last_name': 'Driver',
            'phone_number': '1234567890',
            'city': 'Test City',
            'state': 'Test State',
            'zip_code': '12345',
            'license_number': 'DL123456',
            'vehicle': vehicle_data,
            'locationName': 'Test Location',
            'locationCity': 'Test City'
        }
        serializer = DriverRegistrationSerializer(data=data)
        self.assertTrue(serializer.is_valid())