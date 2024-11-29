from rest_framework import viewsets, status
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Administrator
from .serializers import AdministratorSerializer, AdministratorRegistrationSerializer, AdministratorListSerializer

class AdministratorViewSet(viewsets.ModelViewSet):
    queryset = Administrator.objects.all()
    serializer_class = AdministratorSerializer

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
