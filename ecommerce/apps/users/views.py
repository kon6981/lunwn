from django.shortcuts import render, redirect
from django.contrib.auth import login, authenticate, logout
from django.contrib.auth.forms import AuthenticationForm
from django.views import View
from rest_framework import generics, permissions
from .serializers import RegisterSerializer, UserSerializer

class RegisterView(View):
    def get(self, request):
        return render(request, 'register.html')

    def post(self, request):
        serializer = RegisterSerializer(data=request.POST)
        if serializer.is_valid():
            user = serializer.save()
            login(request, user)
            return redirect('home')
        return render(request, 'register.html', {'errors': serializer.errors})

class LoginView(View):
    def get(self, request):
        return render(request, 'login.html')

    def post(self, request):
        form = AuthenticationForm(data=request.POST)
        if form.is_valid():
            user = form.get_user()
            login(request, user)
            return redirect('home')
        return render(request, 'login.html', {'errors': form.errors})

def logout_view(request):
    logout(request)
    return redirect('home')

# API 注册接口
class RegisterAPIView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]