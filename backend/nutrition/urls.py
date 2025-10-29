from django.urls import path
from . import views

urlpatterns = [
    path('foods/', views.FoodListView.as_view(), name='food-list'),
    path('foods/<uuid:pk>/', views.FoodDetailView.as_view(), name='food-detail'),
    path('foods/season/<str:season>/', views.SeasonalFoodsView.as_view(), name='seasonal-foods'),
    path('recommendations/', views.MealRecommendationListView.as_view(), name='meal-recommendations'),
    path('recommendations/generate/', views.GenerateMealRecommendationView.as_view(), name='generate-recommendations'),
    path('plans/', views.NutritionPlanListView.as_view(), name='nutrition-plans'),
    path('plans/create/', views.CreateNutritionPlanView.as_view(), name='create-plan'),
]