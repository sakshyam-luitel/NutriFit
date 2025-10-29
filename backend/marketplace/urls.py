from django.urls import path
from . import views

urlpatterns = [
    path('cart/', views.CartListView.as_view(), name='cart-list'),
    path('cart/add/', views.AddToCartView.as_view(), name='add-to-cart'),
    path('cart/<uuid:pk>/update/', views.UpdateCartView.as_view(), name='update-cart'),
    path('cart/<uuid:pk>/delete/', views.DeleteCartItemView.as_view(), name='delete-cart-item'),
    path('orders/', views.OrderListView.as_view(), name='order-list'),
    path('orders/create/', views.CreateOrderView.as_view(), name='create-order'),
]