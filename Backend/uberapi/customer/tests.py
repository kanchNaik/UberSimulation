from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from django.contrib.auth import get_user_model
from customer.models import Customer, PaymentMethod
from decimal import Decimal

User = get_user_model()

class CustomerTests(APITestCase):
    def setUp(self):
        # Create a test user and customer for authentication tests
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
        self.customer = Customer.objects.create(
            user=self.user,
            first_name='Test',
            last_name='User',
            city='Test City',
            state='TS',
            zip_code='12345',
            phone_number='123-456-7890',
            credit_card='4111-1111-1111-1111'
        )
        
        # Create client and get tokens
        self.client = APIClient()
        response = self.client.post(reverse('token_obtain_pair'), {
            'username': 'testuser',
            'password': 'testpass123'
        })
        self.token = response.data['access']
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.token}')

    def test_register_customer(self):
        """Test customer registration"""
        url = reverse('customer-list')
        self.client.credentials()  # Clear auth for registration
        data = {
            'username': 'newuser',
            'email': 'new@example.com',
            'password': 'newpass123',
            'first_name': 'New',
            'last_name': 'User',
            'city': 'New City',
            'state': 'NS',
            'zip_code': '54321',
            'phone_number': '987-654-3210',
            'credit_card': '4111-1111-1111-1111'
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(Customer.objects.filter(user__username='newuser').exists())

    def test_get_customer_list(self):
        """Test retrieving customer list"""
        url = reverse('customer-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_get_customer_detail(self):
        """Test retrieving customer detail"""
        url = reverse('customer-detail', kwargs={'pk': self.customer.id})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['first_name'], 'Test')

    def test_update_customer(self):
        """Test updating customer information"""
        url = reverse('customer-detail', kwargs={'pk': self.customer.id})
        data = {
            'username': 'testuser',  # Required field
            'email': 'test@example.com',  # Required field
            'first_name': 'Updated',
            'last_name': 'Name'
        }
        response = self.client.patch(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.customer.refresh_from_db()
        self.assertEqual(self.customer.first_name, 'Updated')

    def test_set_customer_location(self):
        """Test setting customer location"""
        url = reverse('customer-set-location', kwargs={'pk': self.customer.id})
        data = {
            'latitude': '40.7128',
            'longitude': '-74.0060',
            'locationName': 'New York',
            'locationCity': 'New York City'
        }
        response = self.client.put(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.customer.refresh_from_db()
        self.assertEqual(self.customer.latitude, Decimal('40.7128'))

    def test_search_customers(self):
        """Test customer search functionality"""
        url = reverse('customer-search-customers')
        response = self.client.get(url, {'city': 'Test City'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

class PaymentMethodTests(APITestCase):
    def setUp(self):
        # Set up user, customer, and authentication
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
        self.customer = Customer.objects.create(
            user=self.user,
            first_name='Test',
            last_name='User',
            city='Test City',
            state='TS',
            zip_code='12345',
            phone_number='123-456-7890',
            credit_card='4111-1111-1111-1111'
        )
        
        # Create a payment method
        self.payment_method = PaymentMethod.objects.create(
            customer=self.customer,
            card_number='4111-1111-1111-1111',
            card_holder_name='Test User',
            expiration_date='12/25',
            card_type='Visa'
        )

        # Set up authentication
        self.client = APIClient()
        response = self.client.post(reverse('token_obtain_pair'), {
            'username': 'testuser',
            'password': 'testpass123'
        })
        self.token = response.data['access']
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.token}')

    def test_get_payment_methods(self):
        """Test retrieving payment methods"""
        url = reverse('customer-payment-methods', kwargs={'pk': self.customer.id})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_add_payment_method(self):
        """Test adding a new payment method"""
        url = reverse('customer-payment-methods', kwargs={'pk': self.customer.id})
        data = {
            'card_number': '4222-2222-2222-2222',
            'card_holder_name': 'Test User',
            'expiration_date': '12/25',
            'card_type': 'Mastercard'
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(PaymentMethod.objects.count(), 2)

    def test_delete_payment_method(self):
        """Test deleting a payment method"""
        url = reverse('customer-delete-payment-method', 
                     kwargs={'pk': self.customer.id, 'payment_id': self.payment_method.id})
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(PaymentMethod.objects.count(), 0)

    def test_set_default_payment_method(self):
        """Test setting a payment method as default"""
        url = reverse('customer-set-default-payment-method', 
                     kwargs={'pk': self.customer.id, 'payment_id': self.payment_method.id})
        response = self.client.patch(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.payment_method.refresh_from_db()
        self.assertTrue(self.payment_method.is_default)