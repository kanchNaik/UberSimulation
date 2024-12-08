from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from accounts.models import User
from customer.models import Customer
from driver.models import Driver

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
        
        # For customer test
        self.customer_user = User.objects.create_user(
            username='testcustomer',
            password='testpass123',
            email='customer@test.com'
        )
        # Create associated customer profile
        self.customer_profile = Customer.objects.create(
            user=self.customer_user,
            first_name='Test',
            last_name='Customer'
            # Add other required fields
        )

        # For driver test
        self.driver_user = User.objects.create_user(
            username='testdriver',
            password='testpass123',
            email='driver@test.com'
        )
        # Create associated driver profile
        self.driver_profile = Driver.objects.create(
            user=self.driver_user,
            first_name='Test',
            last_name='Driver'
            # Add other required fields
        )
    
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

    # def test_login_customer(self):
    #     data = {
    #         'username': 'testcustomer',
    #         'password': 'testpass123'
    #     }
    #     response = self.client.post(self.login_url, data)
    #     self.assertEqual(response.status_code, status.HTTP_200_OK)
    #     self.assertTrue(response.data['user']['is_customer'])
    #     self.assertFalse(response.data['user']['is_driver'])

    # def test_login_driver(self):
    #     data = {
    #         'username': 'testdriver',
    #         'password': 'testpass123'
    #     }
    #     response = self.client.post(self.login_url, data)
    #     self.assertEqual(response.status_code, status.HTTP_200_OK)
    #     self.assertTrue(response.data['user']['is_driver'])
    #     self.assertFalse(response.data['user']['is_customer'])