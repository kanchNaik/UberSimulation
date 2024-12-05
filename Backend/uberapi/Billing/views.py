from rest_framework import viewsets, status
from rest_framework.response import Response
from .models import Bill
from .serializers import BillSerializer, BillSearchSerializer
from django.utils.timezone import now
from rest_framework.decorators import action
from datetime import timedelta,datetime
from django.db.models import Q
from django.utils.timezone import now

class BillViewSet(viewsets.ModelViewSet):
    """
    A ViewSet for viewing, creating, updating, and deleting bills.
    """
    queryset = Bill.objects.all()
    serializer_class = BillSerializer

    def list(self, request):
        """
        List all bills or filter by driver_id and/or customer_id.
        """
        driver_id = request.query_params.get('driver_id')
        customer_id = request.query_params.get('customer_id')

        queryset = Bill.objects.all()
        if driver_id:
            queryset = queryset.filter(driver__id=driver_id)
        if customer_id:
            queryset = queryset.filter(customer__id=customer_id)

        serializer = BillSerializer(queryset, many=True)
        return Response(serializer.data)

    def retrieve(self, request, pk=None):
        """
        Retrieve a single bill by its primary key.
        """
        try:
            bill = Bill.objects.get(pk=pk)
        except Bill.DoesNotExist:
            return Response({"error": "Bill not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = BillSerializer(bill)
        return Response(serializer.data)

    def create(self, request):
        """
        Create a new bill.
        """
        serializer = BillSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, *args, **kwargs):
        """
        Update an existing bill. Supports both PUT (full update) and PATCH (partial update).
        """
        pk=kwargs.get('pk')
        try:
            bill = Bill.objects.get(pk=pk)
        except Bill.DoesNotExist:
            return Response({"error": "Bill not found"}, status=status.HTTP_404_NOT_FOUND)

        partial = kwargs.pop('partial', False)
        serializer = self.get_serializer(bill, data=request.data, partial=partial)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



    def destroy(self, request, pk=None):
        """
        Delete a bill by its primary key.
        """
        try:
            bill = Bill.objects.get(pk=pk)
        except Bill.DoesNotExist:
            return Response({"error": "Bill not found"}, status=status.HTTP_404_NOT_FOUND)

        bill.delete()
        return Response({"message": "Bill deleted successfully"}, status=status.HTTP_204_NO_CONTENT)


    @action(detail=False, methods=['get'], url_path='search')
    def search_bills(self, request):
        """
        Custom API to search bills by Bill ID, Ride ID, Driver Name, Customer Name, 
        Amount, Status, and Date Range.
        """
        # Extract query parameters
        bill_id = request.query_params.get('bill_id')
        ride_id = request.query_params.get('ride_id')
        driver_name = request.query_params.get('driver_name')
        customer_name = request.query_params.get('customer_name')
        amount = request.query_params.get('amount')
        billstatus = request.query_params.get('status')
        date_range = request.query_params.get('date_range')
        start_date = request.query_params.get('start_date')
        end_date = request.query_params.get('end_date')

        # Start with all bills
        bills = Bill.objects.all()

        # Apply filters based on search criteria
        if bill_id:
            bills = bills.filter(id=bill_id)

        if ride_id:
            bills = bills.filter(ride__id=ride_id)

        if driver_name:
            bills = bills.filter(
                Q(driver__first_name__icontains=driver_name) |
                Q(driver__last_name__icontains=driver_name)
            )

        if customer_name:
            bills = bills.filter(
                Q(customer__first_name__icontains=customer_name) |
                Q(customer__last_name__icontains=customer_name)
            )

        if amount:
            bills = bills.filter(amount=amount)

        if billstatus:
            bills = bills.filter(status__iexact=billstatus)

        # Date range filtering
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
            bills = bills.filter(date__gte=start_date)
        elif start_date and end_date:
            # Custom date range
            try:
                start = datetime.strptime(start_date, '%Y-%m-%d').date()
                end = datetime.strptime(end_date, '%Y-%m-%d').date()
                bills = bills.filter(date__range=[start, end])
            except ValueError:
                return Response(
                    {"error": "Invalid date format. Use YYYY-MM-DD"},
                    status=status.HTTP_400_BAD_REQUEST
                )

        # Serialize the filtered bills
        serializer = BillSearchSerializer(bills, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)