from django.shortcuts import get_object_or_404
from django.contrib.auth.decorators import login_required
from django.views.decorators.http import require_POST
from django.views.decorators.csrf import csrf_protect
from django.http import JsonResponse
from .models import Payment
from ecommerce.apps.orders.models import Order

@login_required
@require_POST               # 只允许 POST
@csrf_protect                # 强制 CSRF 校验（其实默认就校验，这里显式声明）
def simulate_payment(request, order_id):
    order = get_object_or_404(Order, id=order_id, user=request.user)
    payment, created = Payment.objects.get_or_create(
        order=order,
        defaults={'amount': order.total_price(), 'method': 'credit_card'}
    )
    # 模拟支付成功
    payment.paid = True
    payment.transaction_id = f'SIM_{order.id}_{payment.id}'
    payment.save()
    order.status = 'paid'
    order.save()
    return JsonResponse({'success': True, 'message': 'Payment successful'})