from rest_framework import viewsets, status
from rest_framework.response import Response
from django.core.cache import cache  # Added for caching
from django.shortcuts import get_object_or_404
from .models import Bill
from .serializers import BillSerializer
from rest_framework.decorators import action
from django.utils.timezone import now
from datetime import timedelta

class BillViewSet(viewsets.ModelViewSet):
    """
    A ViewSet for viewing, creating, updating, and deleting bills with manual cache management.
    """
    queryset = Bill.objects.all()
    serializer_class = BillSerializer

    def list(self, request, *args, **kwargs):
        """
        List all bills or filter by driver_id and/or customer_id with caching.
        """
        driver_id = request.query_params.get('driver_id')
        customer_id = request.query_params.get('customer_id')
        cache_key = f"bills_list_driver_{driver_id}_customer_{customer_id}"

        # Fetch from cache if available
        cached_data = cache.get(cache_key)
        if cached_data:
            return Response(cached_data, status=status.HTTP_200_OK)

        # Fetch from database if not cached
        queryset = self.get_queryset()
        if driver_id:
            queryset = queryset.filter(driver__id=driver_id)
        if customer_id:
            queryset = queryset.filter(customer__id=customer_id)

        serializer = self.get_serializer(queryset, many=True)
        cache.set(cache_key, serializer.data, timeout=300)  # Cache for 5 minutes
        return Response(serializer.data, status=status.HTTP_200_OK)

    def retrieve(self, request, pk=None):
        """
        Retrieve a single bill by ID with caching.
        """
        cache_key = f"bill_{pk}"

        # Fetch from cache if available
        cached_data = cache.get(cache_key)
        if cached_data:
            return Response(cached_data, status=status.HTTP_200_OK)

        # Fetch from database if not cached
        bill = get_object_or_404(Bill, pk=pk)
        serializer = self.get_serializer(bill)
        cache.set(cache_key, serializer.data, timeout=300)  # Cache for 5 minutes
        return Response(serializer.data, status=status.HTTP_200_OK)

    def create(self, request, *args, **kwargs):
        """
        Create a new bill and manually manage cache invalidation.
        """
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            bill = serializer.save()

            # Invalidate all relevant list caches
            self._invalidate_bill_list_caches()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, *args, **kwargs):
        """
        Update an existing bill and manually manage cache invalidation.
        """
        pk = kwargs.get('pk')
        bill = get_object_or_404(Bill, pk=pk)

        partial = kwargs.pop('partial', False)
        serializer = self.get_serializer(bill, data=request.data, partial=partial)
        if serializer.is_valid():
            serializer.save()

            # Invalidate caches
            cache.delete(f"bill_{pk}")  # Individual bill cache
            self._invalidate_bill_list_caches()  # Clear all cached bill lists
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, pk=None):
        """
        Delete a bill by its primary key and manually manage cache invalidation.
        """
        bill = get_object_or_404(Bill, pk=pk)
        bill.delete()

        # Invalidate caches
        cache.delete(f"bill_{pk}")  # Individual bill cache
        self._invalidate_bill_list_caches()  # Clear all cached bill lists
        return Response({"message": "Bill deleted successfully"}, status=status.HTTP_204_NO_CONTENT)

    @action(detail=False, methods=['get'], url_path='search')
    def search_bills(self, request):
        """
        Search bills by customer ID, driver ID, ride ID, or date range with caching.
        """
        # Extract query parameters
        customer_id = request.query_params.get('customer')
        driver_id = request.query_params.get('driver')
        ride_id = request.query_params.get('ride')
        date_range = request.query_params.get('date_range')  # e.g., "week", "month", etc.

        # Generate cache key based on search parameters
        cache_key = f"search_bills_customer_{customer_id}_driver_{driver_id}_ride_{ride_id}_range_{date_range}"
        cached_data = cache.get(cache_key)
        if cached_data:
            return Response(cached_data, status=status.HTTP_200_OK)

        # Fetch from database if not cached
        bills = Bill.objects.all()
        if customer_id:
            bills = bills.filter(customer__id=customer_id)
        if driver_id:
            bills = bills.filter(driver__id=driver_id)
        if ride_id:
            bills = bills.filter(ride__id=ride_id)

        # Apply date range filtering
        today = now().date()
        if date_range:
            if date_range == "day":
                start_date = today
            elif date_range == "week":
                start_date = today - timedelta(weeks=1)
            elif date_range == "month":
                start_date = today - timedelta(days=30)
            elif date_range == "6months":
                start_date = today - timedelta(days=182)
            elif date_range == "year":
                start_date = today - timedelta(days=365)
            else:
                start_date = today - timedelta(days=30)
            bills = bills.filter(date__gte=start_date)

        serializer = self.get_serializer(bills, many=True)
        cache.set(cache_key, serializer.data, timeout=300)  # Cache for 5 minutes
        return Response(serializer.data, status=status.HTTP_200_OK)

    def _invalidate_bill_list_caches(self):
        """
        Manually clear all list caches for bills.
        """
        cache_keys = ["bills_list_driver_None_customer_None"]
        for key in cache_keys:
            cache.delete(key)
