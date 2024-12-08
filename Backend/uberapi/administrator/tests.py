from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from django.contrib.auth import get_user_model
from .models import Administrator
from .serializers import AdministratorSerializer, AdministratorRegistrationSerializer

User = get_user_model()

class AdministratorModelTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='testadmin',
            email='testadmin@example.com',
            password='testpass123'
        )
        
    def test_create_administrator(self):
        admin = Administrator.objects.create(
            user=self.user,
            first_name='Test',
            last_name='Admin',
            phone_number='123-456-7890',
            city='Test City',
            state='Test State',
            zip_code='12345'
        )
        
        self.assertEqual(admin.first_name, 'Test')
        self.assertEqual(admin.last_name, 'Admin')
        self.assertTrue(len(admin.id) == 11)  # SSN format: XXX-XX-XXXX
        self.assertTrue('-' in admin.id)
        
    def test_administrator_str_method(self):
        admin = Administrator.objects.create(
            user=self.user,
            first_name='Test',
            last_name='Admin',
            phone_number='123-456-7890',
            city='Test City',
            state='Test State',
            zip_code='12345'
        )
        expected_str = f"Test Admin ({admin.id})"
        self.assertEqual(str(admin), expected_str)

class AdministratorViewSetTests(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.admin_data = {
            'username': 'testadmin',
            'email': 'testadmin@example.com',
            'password': 'testpass123',
            'first_name': 'Test',
            'last_name': 'Admin',
            'phone_number': '123-456-7890',
            'city': 'Test City',
            'state': 'Test State',
            'zip_code': '12345'
        }
        
    def test_create_administrator(self):
        url = reverse('administrator-list')
        response = self.client.post(url, self.admin_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Administrator.objects.count(), 1)
        self.assertEqual(User.objects.count(), 1)
        
    def test_create_administrator_invalid_data(self):
        url = reverse('administrator-list')
        invalid_data = self.admin_data.copy()
        invalid_data.pop('email')  # Remove required field
        response = self.client.post(url, invalid_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        
    def test_list_administrators(self):
        # Create an administrator first
        url = reverse('administrator-list')
        self.client.post(url, self.admin_data, format='json')
        
        # Test listing
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        
    def test_retrieve_administrator(self):
        # Create an administrator first
        create_url = reverse('administrator-list')
        response = self.client.post(create_url, self.admin_data, format='json')
        admin_id = response.data['administrator_id']
        
        # Test retrieval
        url = reverse('administrator-detail', args=[admin_id])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['first_name'], 'Test')

class AdministratorSerializerTests(TestCase):
    def setUp(self):
        self.admin_data = {
            'username': 'testadmin',
            'email': 'testadmin@example.com',
            'password': 'testpass123',
            'first_name': 'Test',
            'last_name': 'Admin',
            'phone_number': '123-456-7890',
            'city': 'Test City',
            'state': 'Test State',
            'zip_code': '12345'
        }
        
    def test_valid_registration_serializer(self):
        serializer = AdministratorRegistrationSerializer(data=self.admin_data)
        self.assertTrue(serializer.is_valid())
        
    def test_invalid_registration_serializer(self):
        invalid_data = self.admin_data.copy()
        invalid_data.pop('password')  # Remove required field
        serializer = AdministratorRegistrationSerializer(data=invalid_data)
        self.assertFalse(serializer.is_valid())
        
    def test_duplicate_email_validation(self):
        # Create first administrator
        serializer1 = AdministratorRegistrationSerializer(data=self.admin_data)
        self.assertTrue(serializer1.is_valid())
        serializer1.save()
        
        # Try to create another administrator with same email
        duplicate_data = self.admin_data.copy()
        duplicate_data['username'] = 'different_username'
        serializer2 = AdministratorRegistrationSerializer(data=duplicate_data)
        self.assertFalse(serializer2.is_valid())
        self.assertIn('email', serializer2.errors)

class StatisticsViewTests(APITestCase):
    def setUp(self):
        # Create test data for statistics
        pass
        
    def test_statistics_report_day(self):
        url = reverse('statistics-report')
        response = self.client.get(f"{url}?timePeriod=day")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('revenue_per_unit', response.data)
        self.assertIn('rides_per_area', response.data)
        self.assertIn('total_rides', response.data)
        
    def test_statistics_invalid_time_period(self):
        url = reverse('statistics-report')
        response = self.client.get(f"{url}?timePeriod=invalid")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)