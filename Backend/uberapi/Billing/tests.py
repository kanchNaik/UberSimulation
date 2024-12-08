from django.test import TestCase
from django.utils import timezone
from rest_framework.test import APITestCase
from rest_framework import status
from datetime import datetime, timedelta
from django.urls import reverse
from .models import Bill
from driver.models import Driver
from customer.models import Customer
from rides.models import Ride
from accounts.models import User

class BillModelTests(TestCase):
    def setUp(self):
        # Create test users with unique emails
        self.user1 = User.objects.create_user(
            username='driver1',
            password='pass123',
            email='driver1@test.com',
            user_type='DRIVER',
            first_name="John",
            last_name="Doe"
        )
        self.user2 = User.objects.create_user(
            username='customer1',
            password='pass123',
            email='customer1@test.com',
            user_type='CUSTOMER',
            first_name="Jane",
            last_name="Smith"
        )
        
        # Create test driver and customer
        self.driver = Driver.objects.create(
            user=self.user1,
            first_name="John",
            last_name="Doe",
            phone_number="1234567890"
        )
        self.customer = Customer.objects.create(
            user=self.user2,
            first_name="Jane",
            last_name="Smith",
            phone_number="0987654321"
        )
        
        # Create test ride
        self.ride = Ride.objects.create(
            driver=self.driver,
            customer=self.customer,
            pickup_location="Location A",
            dropoff_location="Location B",
            status="completed",
            distance=10.5
        )
        
        # Create test bill
        self.bill = Bill.objects.create(
            driver=self.driver,
            customer=self.customer,
            ride=self.ride,
            date=timezone.now(),
            distance=10.5,
            amount=25.00,
            status='unpaid'
        )

    def test_bill_creation(self):
        bill = Bill.objects.create(
            driver=self.driver,
            customer=self.customer,
            ride=self.ride,
            date=timezone.now(),
            distance=10.5,
            amount=25.00,
            status='unpaid'
        )
        self.assertTrue(isinstance(bill, Bill))
        self.assertTrue(bill.bill_id)  # Verify bill_id is generated
        self.assertEqual(bill.status, 'unpaid')

    def test_bill_id_format(self):
        bill = Bill.objects.create(
            driver=self.driver,
            customer=self.customer,
            ride=self.ride,
            date=timezone.now(),
            distance=10.5,
            amount=25.00,
            status='unpaid'
        )
        # Check if bill_id matches the format XXX-XX-XXXX
        parts = bill.bill_id.split('-')
        self.assertEqual(len(parts), 3)
        self.assertEqual(len(parts[0]), 3)
        self.assertEqual(len(parts[1]), 2)
        self.assertEqual(len(parts[2]), 4)

class BillAPITests(APITestCase):
    def setUp(self):
        # Create test users
        self.user1 = User.objects.create_user(username='driver1', password='pass123')
        self.user2 = User.objects.create_user(username='customer1', password='pass123')
        
        # Create test driver and customer
        self.driver = Driver.objects.create(
            user=self.user1,
            first_name="John",
            last_name="Doe",
            phone_number="1234567890"
        )
        self.customer = Customer.objects.create(
            user=self.user2,
            first_name="Jane",
            last_name="Smith",
            phone_number="0987654321"
        )
        
        # Create test ride
        self.ride = Ride.objects.create(
            driver=self.driver,
            customer=self.customer,
            pickup_location="Location A",
            dropoff_location="Location B",
            status="completed",
            distance=10.5
        )
        
        # Create test bill
        self.bill = Bill.objects.create(
            driver=self.driver,
            customer=self.customer,
            ride=self.ride,
            date=timezone.now(),
            distance=10.5,
            amount=25.00,
            status='unpaid'
        )

    def test_list_bills(self):
        url = reverse('bill-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_create_bill(self):
        url = reverse('bill-list')
        data = {
            'driver': self.driver.id,
            'customer': self.customer.id,
            'ride': self.ride.id,
            'date': timezone.now(),
            'distance': 15.5,
            'amount': 35.00,
            'status': 'unpaid'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Bill.objects.count(), 2)

    def test_retrieve_bill(self):
        url = reverse('bill-detail', args=[self.bill.bill_id])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['amount'], 25.00)

    def test_update_bill(self):
        url = reverse('bill-detail', args=[self.bill.bill_id])
        data = {
            'status': 'paid',
            'amount': 30.00
        }
        response = self.client.patch(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['status'], 'paid')
        self.assertEqual(response.data['amount'], 30.00)

    def test_delete_bill(self):
        url = reverse('bill-detail', args=[self.bill.bill_id])
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Bill.objects.count(), 0)

    def test_search_bills(self):
        url = reverse('bill-search-bills')
        
        # Test search by driver name
        response = self.client.get(f"{url}?driver_name=John")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        
        # Test search by date range
        response = self.client.get(f"{url}?date_range=day")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        
        # Test search by status
        response = self.client.get(f"{url}?status=unpaid")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)