from django.urls import path
from . import views

urlpatterns = [
    path('api/', views.ProductListAPIView.as_view(), name='api-product-list'),
    path('api/<slug:slug>/', views.ProductDetailAPIView.as_view(), name='api-product-detail'),
    path('api/categories/', views.CategoryListAPIView.as_view(), name='api-category-list'),
]