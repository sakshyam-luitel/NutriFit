from rest_framework import serializers
from .models import Cart, Order
from nutrition.serializers import FoodSerializer

class CartSerializer(serializers.ModelSerializer):
    food = FoodSerializer(read_only=True)
    food_id = serializers.UUIDField(write_only=True)
    subtotal = serializers.ReadOnlyField()
    
    class Meta:
        model = Cart
        fields = ['id', 'user', 'food', 'food_id', 'quantity', 'unit_price', 'subtotal', 'created_at', 'updated_at']
        read_only_fields = ['id', 'user', 'created_at', 'updated_at']

class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = ['id', 'user', 'order_items', 'total_amount', 'status', 'delivery_address', 'notes', 'created_at', 'updated_at']
        read_only_fields = ['id', 'user', 'created_at', 'updated_at']