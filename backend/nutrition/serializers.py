from rest_framework import serializers
from .models import Food, MealRecommendation, NutritionPlan

class FoodSerializer(serializers.ModelSerializer):
    class Meta:
        model = Food
        fields = '__all__'

class MealRecommendationSerializer(serializers.ModelSerializer):
    foods = FoodSerializer(many=True, read_only=True)
    food_ids = serializers.ListField(
        child=serializers.UUIDField(),
        write_only=True,
        required=False
    )
    
    class Meta:
        model = MealRecommendation
        fields = [
            'id', 'user', 'foods', 'food_ids', 'meal_type', 'date',
            'meal_name', 'instructions', 'portion_size',
            'total_calories', 'total_protein', 'total_carbs', 'total_fat',
            'ai_summary', 'ai_reasoning', 'created_at'
        ]
        read_only_fields = ['id', 'user', 'created_at']
    
    def create(self, validated_data):
        food_ids = validated_data.pop('food_ids', [])
        validated_data['user'] = self.context['request'].user
        meal = MealRecommendation.objects.create(**validated_data)
        if food_ids:
            meal.foods.set(food_ids)
        return meal

class NutritionPlanSerializer(serializers.ModelSerializer):
    meal_recommendations = MealRecommendationSerializer(many=True, read_only=True, source='user.meal_recommendations')
    
    class Meta:
        model = NutritionPlan
        fields = [
            'id', 'user', 'start_date', 'end_date',
            'daily_calorie_target', 'daily_protein_target',
            'daily_carbs_target', 'daily_fat_target',
            'plan_description', 'health_focus', 'is_active',
            'created_at', 'updated_at', 'meal_recommendations'
        ]
        read_only_fields = ['id', 'user', 'created_at', 'updated_at']