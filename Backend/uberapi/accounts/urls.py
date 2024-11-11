from django.urls import path
from accounts.views import CustomerRegisterView

urlpatterns = [
    path('customers/signup', CustomerRegisterView.as_view(), name='customer_register'),
]
