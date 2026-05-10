from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator
from django.views import View
from .models import Order, OrderItem
from ecommerce.apps.cart.models import Cart


@method_decorator(login_required, name='dispatch')
class CheckoutView(View):
    def get(self, request):
        cart = Cart.objects.filter(user=request.user).first()
        if not cart or not cart.items.exists():
            return redirect('home')

        # 计算购物车总价
        cart_total = sum(item.product.price * item.quantity for item in cart.items.all())

        context = {
            'cart': cart,
            'cart_total': cart_total
        }
        return render(request, 'checkout.html', context)

    def post(self, request):
        cart = Cart.objects.get(user=request.user)
        order = Order.objects.create(
            user=request.user,
            full_name=request.POST.get('full_name'),
            email=request.POST.get('email'),
            phone=request.POST.get('phone'),
            address=request.POST.get('address'),
            city=request.POST.get('city'),
            country=request.POST.get('country'),
            postal_code=request.POST.get('postal_code'),
        )
        for item in cart.items.all():
            OrderItem.objects.create(
                order=order,
                product=item.product,
                product_name=item.product.name,
                price=item.product.price,
                quantity=item.quantity
            )
        cart.items.all().delete()
        return redirect('order-success', order_id=order.id)


@login_required
def order_success(request, order_id):
    order = get_object_or_404(Order, id=order_id, user=request.user)
    return render(request, 'order_success.html', {'order': order})