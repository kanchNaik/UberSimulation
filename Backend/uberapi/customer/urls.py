from django.urls import path
from customer.views import CustomerView

urlpatterns = [
    path('', CustomerView.as_view(), name='customer_view'),
    path('<int:id>/', CustomerView.as_view(), name='customer_detail'),
]
