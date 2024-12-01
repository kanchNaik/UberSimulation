from rest_framework import viewsets, status
from rest_framework.response import Response
from django.core.cache import cache
from .models import Bill
from .serializers import BillSerializer

class BillViewSet(viewsets.ModelViewSet):
    """
    A ViewSet for viewing, creating, updating, and deleting bills with caching.
    """
    queryset = Bill.objects.all()
    serializer_class = BillSerializer

    def list(self, request):
        """
        List all bills or filter by driver_id and/or customer_id with caching.
        """
        cache_key = 'bills_list'
        bills_data = cache.get(cache_key)

        if not bills_data:
            driver_id = request.query_params.get('driver_id')
            customer_id = request.query_params.get('customer_id')

            queryset = Bill.objects.all()
            if driver_id:
                queryset = queryset.filter(driver__id=driver_id)
            if customer_id:
                queryset = queryset.filter(customer__id=customer_id)

            serializer = BillSerializer(queryset, many=True)
            bills_data = serializer.data
            cache.set(cache_key, bills_data, timeout=3600) 

        return Response(bills_data)

    def retrieve(self, request, pk=None):
        """
        Retrieve a single bill by its primary key with caching.
        """
        cache_key = f'bill_{pk}'
        bill_data = cache.get(cache_key)

        if not bill_data:
            try:
                bill = Bill.objects.get(pk=pk)
                serializer = BillSerializer(bill)
                bill_data = serializer.data
                cache.set(cache_key, bill_data, timeout=3600)  # Cache for 1 hour
            except Bill.DoesNotExist:
                return Response({"error": "Bill not found"}, status=status.HTTP_404_NOT_FOUND)

        return Response(bill_data)

    def create(self, request):
        """
        Create a new bill and clear relevant caches.
        """
        serializer = BillSerializer(data=request.data)
        if serializer.is_valid():
            bill = serializer.save()

            # Clear the bills list cache
            cache.delete('bills_list')

            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, *args, **kwargs):
        """
        Update an existing bill and clear relevant caches.
        """
        pk = kwargs.get('pk')
        try:
            bill = Bill.objects.get(pk=pk)
        except Bill.DoesNotExist:
            return Response({"error": "Bill not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = self.get_serializer(bill, data=request.data, partial=kwargs.get('partial', False))
        if serializer.is_valid():
            bill = serializer.save()

            # Clear the cache for this bill and the bill list
            cache.delete(f'bill_{pk}')
            cache.delete('bills_list')

            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, pk=None):
        """
        Delete a bill by its primary key and clear relevant caches.
        """
        try:
            bill = Bill.objects.get(pk=pk)
            bill.delete()

            # Clear the cache for this bill and the bill list
            cache.delete(f'bill_{pk}')
            cache.delete('bills_list')

            return Response({"message": "Bill deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
        except Bill.DoesNotExist:
            return Response({"error": "Bill not found"}, status=status.HTTP_404_NOT_FOUND)
