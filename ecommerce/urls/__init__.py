from django.contrib import admin
from django.urls import path, include
from ecommerce.views import home
from django.conf import settings
from django.conf.urls.static import static
urlpatterns = [
    path('admin/', admin.site.urls),
    path('', home, name='home'),
    path('', include('ecommerce.apps.users.urls')),
    path('products/', include('ecommerce.apps.products.urls')),
    path('cart/', include('ecommerce.apps.cart.urls')),
    path('orders/', include('ecommerce.apps.orders.urls')),
    path('payments/', include('ecommerce.apps.payments.urls')),
]
if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATICFILES_DIRS[0])