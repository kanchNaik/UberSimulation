from rest_framework import viewsets, status
from rest_framework.response import Response
from .models import Bill
from .serializers import BillSerializer

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
