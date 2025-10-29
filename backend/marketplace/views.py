from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from .models import Cart, Order
from .serializers import CartSerializer, OrderSerializer
from nutrition.models import Food

class CartListView(generics.ListAPIView):
    serializer_class = CartSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Cart.objects.filter(user=self.request.user)

class AddToCartView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        try:
            food_id = request.data.get('food_id')
            quantity = request.data.get('quantity', 1)
            
            food = Food.objects.get(id=food_id)
            
            # Mock price calculation (100 NPR per 100g)
            unit_price = food.calories * 0.5  # Simple price calculation
            
            cart_item, created = Cart.objects.get_or_create(
                user=request.user,
                food=food,
                defaults={'quantity': quantity, 'unit_price': unit_price}
            )
            
            if not created:
                cart_item.quantity += quantity
                cart_item.save()
            
            serializer = CartSerializer(cart_item)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        except Food.DoesNotExist:
            return Response(
                {'error': 'Food not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

class UpdateCartView(generics.UpdateAPIView):
    serializer_class = CartSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Cart.objects.filter(user=self.request.user)

class DeleteCartItemView(generics.DestroyAPIView):
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Cart.objects.filter(user=self.request.user)

class OrderListView(generics.ListAPIView):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Order.objects.filter(user=self.request.user)

class CreateOrderView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        try:
            delivery_address = request.data.get('delivery_address')
            notes = request.data.get('notes', '')
            
            if not delivery_address:
                return Response(
                    {'error': 'Delivery address is required'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Get cart items
            cart_items = Cart.objects.filter(user=request.user)
            
            if not cart_items.exists():
                return Response(
                    {'error': 'Cart is empty'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Calculate total and prepare order items
            order_items = []
            total_amount = 0
            
            for item in cart_items:
                order_items.append({
                    'food_name': item.food.name,
                    'quantity': item.quantity,
                    'unit_price': item.unit_price,
                    'subtotal': item.subtotal
                })
                total_amount += item.subtotal
            
            # Create order
            order = Order.objects.create(
                user=request.user,
                order_items=order_items,
                total_amount=total_amount,
                delivery_address=delivery_address,
                notes=notes
            )
            
            # Clear cart
            cart_items.delete()
            
            serializer = OrderSerializer(order)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )