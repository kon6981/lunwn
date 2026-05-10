from django.shortcuts import render
from ecommerce.apps.products.models import Product

def home(request):
    # 从数据库获取所有可用产品，按最新创建排序
    products = Product.objects.filter(available=True).order_by('-created_at')[:8]
    
    # 如果数据库中没有产品，前端将显示提示，不会报错
    context = {'products': products}
    return render(request, 'home.html', context)