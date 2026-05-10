from django.urls import path
from . import views

urlpatterns = [
    path('api/', views.CartDetailView.as_view(), name='api-cart-detail'),
    path('api/add/', views.AddToCartView.as_view(), name='api-cart-add'),
    path('api/remove/', views.RemoveFromCartView.as_view(), name='api-cart-remove'),
]