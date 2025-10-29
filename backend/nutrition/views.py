from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from django.db import models as django_models
from datetime import datetime, timedelta
from .models import Food, MealRecommendation, NutritionPlan
from .serializers import FoodSerializer, MealRecommendationSerializer, NutritionPlanSerializer
from .ai_engine import NutritionAI

class FoodListView(generics.ListAPIView):
    queryset = Food.objects.filter(is_available=True)
    serializer_class = FoodSerializer
    permission_classes = [IsAuthenticated]

class FoodDetailView(generics.RetrieveAPIView):
    queryset = Food.objects.all()
    serializer_class = FoodSerializer
    permission_classes = [IsAuthenticated]

class SeasonalFoodsView(generics.ListAPIView):
    serializer_class = FoodSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        season = self.kwargs.get('season', 'all')
        return Food.objects.filter(is_available=True).filter(
            django_models.Q(season=season) | django_models.Q(season='all')
        )

class MealRecommendationListView(generics.ListAPIView):
    serializer_class = MealRecommendationSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return MealRecommendation.objects.filter(user=self.request.user)

class GenerateMealRecommendationView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        try:
            user = request.user
            meal_type = request.data.get('meal_type', 'lunch')
            date = request.data.get('date', timezone.now().date())
            
            # Initialize AI engine
            ai_engine = NutritionAI()
            
            # Generate meal recommendation
            recommendation = ai_engine.generate_meal_recommendation(
                user=user,
                meal_type=meal_type,
                date=date
            )
            
            serializer = MealRecommendationSerializer(recommendation)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

class NutritionPlanListView(generics.ListAPIView):
    serializer_class = NutritionPlanSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return NutritionPlan.objects.filter(user=self.request.user)

class CreateNutritionPlanView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        try:
            user = request.user
            duration_days = request.data.get('duration_days', 7)
            
            # Initialize AI engine
            ai_engine = NutritionAI()
            
            # Generate nutrition plan
            plan = ai_engine.create_nutrition_plan(
                user=user,
                duration_days=duration_days
            )
            
            serializer = NutritionPlanSerializer(plan)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )