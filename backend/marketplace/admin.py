from django.contrib import admin
from .models import Cart, Order

@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):
    list_display = ('user', 'food', 'quantity', 'created_at')
    search_fields = ('user__email', 'food__name')

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('user', 'total_amount', 'status', 'created_at')
    list_filter = ('status', 'created_at')
    search_fields = ('user__email',)