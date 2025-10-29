import uuid
from django.db import models
from users.models import User

class Food(models.Model):
    CATEGORY_CHOICES = [
        ('vegetable', 'Vegetable'),
        ('fruit', 'Fruit'),
        ('grain', 'Grain'),
        ('protein', 'Protein'),
        ('dairy', 'Dairy'),
        ('nuts', 'Nuts & Seeds'),
        ('spices', 'Spices'),
        ('beverage', 'Beverage'),
    ]
    
    SEASON_CHOICES = [
        ('spring', 'Spring (Chaitra-Jeth)'),
        ('summer', 'Summer (Asadh-Shrawan)'),
        ('autumn', 'Autumn (Bhadra-Ashwin)'),
        ('winter', 'Winter (Kartik-Falgun)'),
        ('all', 'All Seasons'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=200)
    name_nepali = models.CharField(max_length=200, blank=True)
    description = models.TextField(blank=True)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    season = models.CharField(max_length=20, choices=SEASON_CHOICES, default='all')
    
    # Nutritional Information (per 100g)
    calories = models.FloatField(help_text='Calories per 100g')
    protein = models.FloatField(help_text='Protein in grams')
    carbohydrates = models.FloatField(help_text='Carbohydrates in grams')
    fat = models.FloatField(help_text='Fat in grams')
    fiber = models.FloatField(default=0, help_text='Fiber in grams')
    
    # Micronutrients (optional)
    vitamin_a = models.FloatField(default=0, help_text='Vitamin A in mcg')
    vitamin_c = models.FloatField(default=0, help_text='Vitamin C in mg')
    calcium = models.FloatField(default=0, help_text='Calcium in mg')
    iron = models.FloatField(default=0, help_text='Iron in mg')
    
    # Health benefits
    health_benefits = models.TextField(blank=True, help_text='Health benefits and properties')
    suitable_for = models.TextField(blank=True, help_text='Suitable for conditions (e.g., diabetes, hypertension)')
    avoid_in = models.TextField(blank=True, help_text='Conditions to avoid this food')
    
    # Availability
    is_available = models.BooleanField(default=True)
    image_url = models.URLField(blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'foods'
        verbose_name = 'Food'
        verbose_name_plural = 'Foods'
        ordering = ['name']
    
    def __str__(self):
        return self.name

class MealRecommendation(models.Model):
    MEAL_TYPE_CHOICES = [
        ('breakfast', 'Breakfast'),
        ('lunch', 'Lunch'),
        ('dinner', 'Dinner'),
        ('snack', 'Snack'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='meal_recommendations')
    foods = models.ManyToManyField(Food, related_name='recommendations')
    meal_type = models.CharField(max_length=20, choices=MEAL_TYPE_CHOICES)
    date = models.DateField()
    
    # Meal details
    meal_name = models.CharField(max_length=200)
    instructions = models.TextField(blank=True)
    portion_size = models.CharField(max_length=100, blank=True)
    
    # Nutritional totals
    total_calories = models.FloatField()
    total_protein = models.FloatField()
    total_carbs = models.FloatField()
    total_fat = models.FloatField()
    
    # AI summary
    ai_summary = models.TextField(blank=True, help_text='AI-generated meal description')
    ai_reasoning = models.TextField(blank=True, help_text='Why this meal was recommended')
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'meal_recommendations'
        verbose_name = 'Meal Recommendation'
        verbose_name_plural = 'Meal Recommendations'
        ordering = ['-date', 'meal_type']
    
    def __str__(self):
        return f"{self.user.email} - {self.meal_name} ({self.date})"

class NutritionPlan(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='nutrition_plans')
    start_date = models.DateField()
    end_date = models.DateField()
    
    # Plan details
    daily_calorie_target = models.FloatField()
    daily_protein_target = models.FloatField()
    daily_carbs_target = models.FloatField()
    daily_fat_target = models.FloatField()
    
    # Plan summary
    plan_description = models.TextField()
    health_focus = models.TextField(help_text='Health conditions being addressed')
    
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'nutrition_plans'
        verbose_name = 'Nutrition Plan'
        verbose_name_plural = 'Nutrition Plans'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.user.email} - Plan {self.start_date} to {self.end_date}"