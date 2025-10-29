import random
from datetime import datetime, timedelta
from django.db.models import Q
from .models import Food, MealRecommendation, NutritionPlan

class NutritionAI:
    """
    AI Engine for personalized nutrition recommendations.
    This is a basic ML model that will be enhanced with TensorFlow/PyTorch.
    """
    
    def __init__(self):
        self.disease_food_map = {
            'diabetes': {
                'recommended': ['vegetable', 'protein', 'nuts'],
                'avoid': ['grain'],
                'keywords': ['low glycemic', 'high fiber', 'protein']
            },
            'hypertension': {
                'recommended': ['vegetable', 'fruit', 'nuts'],
                'avoid': [],
                'keywords': ['low sodium', 'potassium', 'magnesium']
            },
            'anemia': {
                'recommended': ['protein', 'vegetable', 'nuts'],
                'avoid': [],
                'keywords': ['iron', 'vitamin c', 'folate']
            },
            'obesity': {
                'recommended': ['vegetable', 'fruit', 'protein'],
                'avoid': ['grain'],
                'keywords': ['low calorie', 'high fiber', 'protein']
            },
        }
    
    def get_current_nepali_season(self):
        """Determine current Nepali season based on month"""
        current_month = datetime.now().month
        
        # Approximate mapping of Gregorian to Nepali months
        if current_month in [3, 4, 5]:  # Spring
            return 'spring'
        elif current_month in [6, 7, 8]:  # Summer
            return 'summer'
        elif current_month in [9, 10]:  # Autumn
            return 'autumn'
        else:  # Winter
            return 'winter'
    
    def analyze_user_health(self, user):
        """Analyze user's health profile and return dietary requirements"""
        profile = user.profile
        requirements = {
            'calories': profile.daily_calories or 2000,
            'protein': 0,
            'carbs': 0,
            'fat': 0,
            'focus_areas': [],
            'avoid_categories': [],
            'preferred_categories': []
        }
        
        # Calculate macronutrient targets
        if profile.goal == 'lose':
            requirements['calories'] *= 0.8
            requirements['protein'] = requirements['calories'] * 0.30 / 4
            requirements['carbs'] = requirements['calories'] * 0.40 / 4
            requirements['fat'] = requirements['calories'] * 0.30 / 9
        elif profile.goal == 'gain':
            requirements['calories'] *= 1.15
            requirements['protein'] = requirements['calories'] * 0.25 / 4
            requirements['carbs'] = requirements['calories'] * 0.50 / 4
            requirements['fat'] = requirements['calories'] * 0.25 / 9
        else:
            requirements['protein'] = requirements['calories'] * 0.25 / 4
            requirements['carbs'] = requirements['calories'] * 0.50 / 4
            requirements['fat'] = requirements['calories'] * 0.25 / 9
        
        # Analyze diseases
        if profile.diseases:
            diseases = [d.strip().lower() for d in profile.diseases.split(',')]
            for disease in diseases:
                if disease in self.disease_food_map:
                    disease_info = self.disease_food_map[disease]
                    requirements['preferred_categories'].extend(disease_info['recommended'])
                    requirements['avoid_categories'].extend(disease_info['avoid'])
                    requirements['focus_areas'].append(disease)
        
        return requirements
    
    def select_foods_for_meal(self, meal_type, user, target_calories):
        """Select appropriate foods for a meal based on user profile"""
        profile = user.profile
        requirements = self.analyze_user_health(user)
        current_season = self.get_current_nepali_season()
        
        # Build query for suitable foods
        query = Q(is_available=True) & (Q(season=current_season) | Q(season='all'))
        
        # Filter by preferred categories if any
        if requirements['preferred_categories']:
            query &= Q(category__in=requirements['preferred_categories'])
        
        # Exclude avoided categories
        if requirements['avoid_categories']:
            query &= ~Q(category__in=requirements['avoid_categories'])
        
        # Get suitable foods
        suitable_foods = list(Food.objects.filter(query))
        
        if not suitable_foods:
            # Fallback to all available foods
            suitable_foods = list(Food.objects.filter(is_available=True))
        
        # Select foods to meet calorie target
        selected_foods = []
        total_calories = 0
        
        # Ensure variety
        categories_used = set()
        random.shuffle(suitable_foods)
        
        for food in suitable_foods:
            if len(selected_foods) >= 5:  # Max 5 ingredients per meal
                break
            
            if food.category not in categories_used or len(selected_foods) < 3:
                selected_foods.append(food)
                total_calories += food.calories * 0.5  # Assume 50g portion
                categories_used.add(food.category)
                
                if total_calories >= target_calories * 0.9:
                    break
        
        return selected_foods
    
    def generate_meal_recommendation(self, user, meal_type, date):
        """Generate AI-powered meal recommendation"""
        requirements = self.analyze_user_health(user)
        
        # Determine calorie target for meal type
        daily_calories = requirements['calories']
        meal_calorie_distribution = {
            'breakfast': 0.25,
            'lunch': 0.35,
            'dinner': 0.30,
            'snack': 0.10,
        }
        
        target_calories = daily_calories * meal_calorie_distribution.get(meal_type, 0.30)
        
        # Select foods
        selected_foods = self.select_foods_for_meal(meal_type, user, target_calories)
        
        # Calculate nutritional totals
        total_calories = sum(f.calories * 0.5 for f in selected_foods)
        total_protein = sum(f.protein * 0.5 for f in selected_foods)
        total_carbs = sum(f.carbohydrates * 0.5 for f in selected_foods)
        total_fat = sum(f.fat * 0.5 for f in selected_foods)
        
        # Generate meal name and instructions
        food_names = [f.name for f in selected_foods]
        meal_name = f"Healthy {meal_type.title()} Bowl"
        
        instructions = f"Combine {', '.join(food_names[:-1])} and {food_names[-1]} for a nutritious {meal_type}. "
        
        if requirements['focus_areas']:
            instructions += f"This meal is specially designed for managing {', '.join(requirements['focus_areas'])}."
        
        ai_summary = f"A balanced {meal_type} with {int(total_calories)} calories, featuring seasonal Nepali ingredients."
        ai_reasoning = f"Selected based on your health profile: {user.profile.goal} goal"
        
        if requirements['focus_areas']:
            ai_reasoning += f" and {', '.join(requirements['focus_areas'])} management"
        
        # Create meal recommendation
        meal = MealRecommendation.objects.create(
            user=user,
            meal_type=meal_type,
            date=date,
            meal_name=meal_name,
            instructions=instructions,
            portion_size="Standard serving",
            total_calories=round(total_calories, 2),
            total_protein=round(total_protein, 2),
            total_carbs=round(total_carbs, 2),
            total_fat=round(total_fat, 2),
            ai_summary=ai_summary,
            ai_reasoning=ai_reasoning
        )
        
        meal.foods.set(selected_foods)
        return meal
    
    def create_nutrition_plan(self, user, duration_days=7):
        """Create a comprehensive nutrition plan"""
        requirements = self.analyze_user_health(user)
        profile = user.profile
        
        start_date = datetime.now().date()
        end_date = start_date + timedelta(days=duration_days)
        
        plan_description = f"""Personalized {duration_days}-day nutrition plan designed for your {profile.goal} goal.
        This plan provides approximately {int(requirements['calories'])} calories per day with balanced macronutrients.
        """
        
        health_focus = "General wellness"
        if requirements['focus_areas']:
            health_focus = f"Managing {', '.join(requirements['focus_areas'])}"
        
        # Create plan
        plan = NutritionPlan.objects.create(
            user=user,
            start_date=start_date,
            end_date=end_date,
            daily_calorie_target=requirements['calories'],
            daily_protein_target=requirements['protein'],
            daily_carbs_target=requirements['carbs'],
            daily_fat_target=requirements['fat'],
            plan_description=plan_description,
            health_focus=health_focus,
            is_active=True
        )
        
        # Generate meal recommendations for the plan
        for day in range(duration_days):
            meal_date = start_date + timedelta(days=day)
            for meal_type in ['breakfast', 'lunch', 'dinner']:
                self.generate_meal_recommendation(user, meal_type, meal_date)
        
        return plan