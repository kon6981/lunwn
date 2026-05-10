from django.urls import path
from . import views

urlpatterns = [
    path('simulate/<int:order_id>/', views.simulate_payment, name='simulate-payment'),
]