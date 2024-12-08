from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from accounts.models import User

class UserModelTests(TestCase):
    def setUp(self):
        self.user_data = {
            'username': 'testuser',
            'email': 'test@example.com',
            'password': 'testpass123',
            'first_name': 'Test',
            'last_name': 'User'
        }
        self.user = User.objects.create_user(**self.user_data)

    def test_create_user(self):
        """Test creating a new user"""
        self.assertEqual(self.user.username, self.user_data['username'])
        self.assertEqual(self.user.email, self.user_data['email'])
        self.assertFalse(self.user.is_customer)
        self.assertFalse(self.user.is_driver)

    def test_str_representation(self):
        """Test string representation of user"""
        self.assertEqual(str(self.user), self.user_data['username'])

class LoginViewSetTests(APITestCase):
    def setUp(self):
        self.login_url = "/api/accounts/login/"
        self.user_data = {
            'username': 'testuser',
            'email': 'test@example.com',
            'password': 'testpass123',
            'first_name': 'Test',
            'last_name': 'User'
        }
        self.user = User.objects.create_user(**self.user_data)
        
        # Create a customer user
        self.customer_data = {
            'username': 'customer',
            'email': 'customer@example.com',
            'password': 'testpass123',
            'first_name': 'Customer',
            'is_customer': True
        }
        self.customer = User.objects.create_user(**self.customer_data)
        
        # Create a driver user
        self.driver_data = {
            'username': 'driver',
            'email': 'driver@example.com',
            'password': 'testpass123',
            'first_name': 'Driver',
            'is_driver': True
        }
        self.driver = User.objects.create_user(**self.driver_data)

    def test_login_success(self):
        """Test successful login"""
        data = {
            'username': self.user_data['username'],
            'password': self.user_data['password']
        }
        response = self.client.post(self.login_url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)
        self.assertEqual(response.data['user']['username'], self.user_data['username'])

    def test_login_invalid_credentials(self):
        """Test login with invalid credentials"""
        data = {
            'username': self.user_data['username'],
            'password': 'wrongpassword'
        }
        response = self.client.post(self.login_url, data)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertIn('error', response.data)

    def test_login_missing_fields(self):
        """Test login with missing fields"""
        data = {'username': self.user_data['username']}
        response = self.client.post(self.login_url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_login_customer(self):
        """Test login for customer user"""
        data = {
            'username': self.customer_data['username'],
            'password': self.customer_data['password']
        }
        response = self.client.post(self.login_url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['user']['is_customer'])
        self.assertFalse(response.data['user']['is_driver'])

    def test_login_driver(self):
        """Test login for driver user"""
        data = {
            'username': self.driver_data['username'],
            'password': self.driver_data['password']
        }
        response = self.client.post(self.login_url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['user']['is_driver'])
        self.assertFalse(response.data['user']['is_customer'])
