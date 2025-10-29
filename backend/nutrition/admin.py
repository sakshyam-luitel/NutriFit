from django.contrib import admin
from .models import Food, MealRecommendation, NutritionPlan

@admin.register(Food)
class FoodAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'season', 'calories', 'is_available')
    list_filter = ('category', 'season', 'is_available')
    search_fields = ('name', 'description')

@admin.register(MealRecommendation)
class MealRecommendationAdmin(admin.ModelAdmin):
    list_display = ('user', 'meal_type', 'date', 'created_at')
    list_filter = ('meal_type', 'date')
    search_fields = ('user__email',)

@admin.register(NutritionPlan)
class NutritionPlanAdmin(admin.ModelAdmin):
    list_display = ('user', 'start_date', 'end_date', 'is_active')
    list_filter = ('is_active', 'start_date')
    search_fields = ('user__email',)