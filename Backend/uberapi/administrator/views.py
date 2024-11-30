from rest_framework import viewsets, status
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Administrator
from rides.models import Ride
from Billing.models import Bill
from datetime import datetime, timedelta
import matplotlib.pyplot as plt
import io
import base64
from django.db.models import Sum, Count
from django.db.models.functions import TruncDate
from rest_framework.decorators import action
from .serializers import AdministratorSerializer, AdministratorRegistrationSerializer, AdministratorListSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.decorators import authentication_classes, permission_classes
from rest_framework.permissions import AllowAny

class AdministratorViewSet(viewsets.ModelViewSet):
    queryset = Administrator.objects.all()
    serializer_class = AdministratorSerializer

    def get_permissions(self):
        if self.action == 'create':
            return [AllowAny()]
        return [IsAuthenticated()]

    def get_authentication_classes(self):
        if self.action == 'create':
            return []
        return [JWTAuthentication()]
    
    def get_serializer_class(self):
        """
        Dynamically switch serializer classes based on the action.
        """
        if self.action == 'create':
            return AdministratorRegistrationSerializer
        elif self.action in ['list', 'retrieve']:
            return AdministratorListSerializer
        return super().get_serializer_class()

    def list(self, request, *args, **kwargs):
        """
        List all administrators.
        """
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @authentication_classes([JWTAuthentication])
    @permission_classes([IsAuthenticated])
    def retrieve(self, request, *args, **kwargs):
        """
        Retrieve a single administrator by ID.
        """
        administrator = get_object_or_404(Administrator, pk=kwargs.get('pk'))
        serializer = self.get_serializer(administrator)
        return Response(serializer.data, status=status.HTTP_200_OK)


    def create(self, request, *args, **kwargs):
        """
        Handles administrator registration.
        """
    
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            administrator = serializer.save()
            return Response(
                {
                    "message": "Administrator registered successfully!",
                    "user_id": administrator.user.id,
                    "administrator_id": administrator.id
                },
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, *args, **kwargs):
        """
        Handles both PUT (full update) and PATCH (partial update).
        """
        partial = kwargs.pop('partial', False)
        administrator = get_object_or_404(Administrator, pk=kwargs.get('pk'))
        serializer = AdministratorRegistrationSerializer(administrator, data=request.data, partial=partial)

        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Administrator updated successfully!"}, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, *args, **kwargs):
        """
        Handles administrator deletion.
        """
        administrator = get_object_or_404(Administrator, pk=kwargs.get('pk'))
        administrator.user.delete()  # Deletes the related User as well
        administrator.delete()
        return Response({"message": "Administrator deleted successfully!"}, status=status.HTTP_200_OK)


class StatisticsView(viewsets.ModelViewSet):
    """
    API View to generate statistics report for revenue and rides.
    """
    queryset = Bill.objects.all()

    @action(detail=False, methods=['get'], url_path='report')
    def statistics(self, request, *args, **kwargs):
        """
        Custom action to retrieve statistics.
        """
        # Parse date range from request, default to last 30 days if not specified
        start_date = request.query_params.get('start_date')
        end_date = request.query_params.get('end_date')

        print(start_date, end_date)

        if not start_date or not end_date:
            end_date = datetime.now().date()
            start_date = end_date - timedelta(days=30)
        else:
            try:
                start_date = datetime.strptime(start_date.strip(), '%Y-%m-%d').date()
                end_date = datetime.strptime(end_date.strip(), '%Y-%m-%d').date()
            except ValueError:
                return Response({"error": "Invalid date format. Use YYYY-MM-DD."}, status=400)

        # 1. Revenue per day
        revenue_per_day = (
            Bill.objects
            .filter(date__range=(start_date, end_date))
            .values('date')  # Group by date
            .annotate(total_revenue=Sum('amount'))  # Sum up the revenue for each day
            .order_by('date')  # Optional: Order by date
        )


#         print(revenue_per_day)

#         # 2. Total rides per area
        rides_per_area = (
            Ride.objects
            .filter(date_time__range=(start_date, end_date))
            .values('pickup_location__latitude', 'pickup_location__longitude')  # Group by area
            .annotate(total_rides=Count('ride_id'))
            .order_by('-total_rides')
        )

#         # 3. Rides per driver
        rides_per_driver = (
            Ride.objects
            .filter(date_time__range=(start_date, end_date))
            .values('driver__first_name', 'driver__last_name')
            .annotate(total_rides=Count('ride_id'))
            .order_by('-total_rides')
        )

#         # Generate a bar chart for rides per driver
        # plt.figure(figsize=(10, 6))
        # driver_names = [f"{driver['driver__first_name']} {driver['driver__last_name']}" for driver in rides_per_driver]
        # ride_counts = [driver['total_rides'] for driver in rides_per_driver]
        # plt.bar(driver_names, ride_counts, color='blue')
        # plt.xlabel('Driver')
        # plt.ylabel('Number of Rides')
        # plt.title('Number of Rides per Driver')

        # # Save the chart to an in-memory file and convert to base64
        # buf = io.BytesIO()
        # plt.savefig(buf, format='png')
        # buf.seek(0)
        # chart_base64 = base64.b64encode(buf.getvalue()).decode('utf-8')
        # buf.close()
        # plt.close()

        return Response({
            "revenue_per_day": list(revenue_per_day),
            "rides_per_area": list(rides_per_area),
            #"rides_per_driver_chart": chart_base64  # Base64-encoded chart image
        }, status=status.HTTP_200_OK)