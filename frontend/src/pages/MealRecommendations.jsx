import React, { useState, useEffect } from 'react';
import { nutritionAPI } from '../api';

const MealRecommendations = () => {
  const [meals, setMeals] = useState([]);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [generatingPlan, setGeneratingPlan] = useState(false);
  const [selectedMealType, setSelectedMealType] = useState('lunch');
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [mealsRes, plansRes] = await Promise.all([
        nutritionAPI.getMealRecommendations(),
        nutritionAPI.getNutritionPlans(),
      ]);
      setMeals(mealsRes.data);
      setPlans(plansRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateMeal = async () => {
    setGenerating(true);
    setMessage('');

    try {
      await nutritionAPI.generateRecommendation({
        meal_type: selectedMealType,
        date: new Date().toISOString().split('T')[0],
      });
      setMessage('Meal recommendation generated successfully!');
      await fetchData();
    } catch (error) {
      setMessage('Error generating meal recommendation');
    } finally {
      setGenerating(false);
    }
  };

  const handleGeneratePlan = async () => {
    setGeneratingPlan(true);
    setMessage('');

    try {
      await nutritionAPI.createNutritionPlan({
        duration_days: 7,
      });
      setMessage('7-day nutrition plan created successfully!');
      await fetchData();
    } catch (error) {
      setMessage('Error creating nutrition plan');
    } finally {
      setGeneratingPlan(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading meal recommendations...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Meal Recommendations</h1>

        {message && (
          <div className={`mb-6 p-4 rounded ${
            message.includes('success')
              ? 'bg-green-100 border border-green-400 text-green-700'
              : 'bg-red-100 border border-red-400 text-red-700'
          }`}>
            {message}
          </div>
        )}

        {/* Action Buttons */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">Generate Single Meal</h2>
            <div className="space-y-4">
              <select
                value={selectedMealType}
                onChange={(e) => setSelectedMealType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-primary focus:border-primary"
              >
                <option value="breakfast">Breakfast</option>
                <option value="lunch">Lunch</option>
                <option value="dinner">Dinner</option>
                <option value="snack">Snack</option>
              </select>
              <button
                onClick={handleGenerateMeal}
                disabled={generating}
                className="w-full bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-secondary disabled:opacity-50"
              >
                {generating ? 'Generating...' : 'Generate Meal'}
              </button>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">Create 7-Day Plan</h2>
            <p className="text-gray-600 mb-4">
              Generate a complete week of personalized meal recommendations
            </p>
            <button
              onClick={handleGeneratePlan}
              disabled={generatingPlan}
              className="w-full bg-secondary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary disabled:opacity-50"
            >
              {generatingPlan ? 'Creating Plan...' : 'Create 7-Day Plan'}
            </button>
          </div>
        </div>

        {/* Nutrition Plans */}
        {plans.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Your Nutrition Plans</h2>
            <div className="space-y-4">
              {plans.map((plan) => (
                <div key={plan.id} className="bg-white p-6 rounded-lg shadow">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-semibold mb-2">
                        {new Date(plan.start_date).toLocaleDateString()} - {new Date(plan.end_date).toLocaleDateString()}
                      </h3>
                      <p className="text-gray-600 mb-2">{plan.plan_description}</p>
                      <div className="flex space-x-4 text-sm">
                        <span className="text-primary font-semibold">
                          {Math.round(plan.daily_calorie_target)} cal/day
                        </span>
                        <span>Protein: {Math.round(plan.daily_protein_target)}g</span>
                        <span>Carbs: {Math.round(plan.daily_carbs_target)}g</span>
                        <span>Fat: {Math.round(plan.daily_fat_target)}g</span>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      plan.is_active
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {plan.is_active ? 'Active' : 'Completed'}
                    </span>
                  </div>
                  <div className="mt-4 p-4 bg-blue-50 rounded">
                    <p className="text-sm font-semibold text-blue-900">Health Focus:</p>
                    <p className="text-sm text-blue-700">{plan.health_focus}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Meal Recommendations */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Your Meal Recommendations</h2>
          {meals.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-6">
              {meals.map((meal) => (
                <div key={meal.id} className="bg-white rounded-lg shadow overflow-hidden">
                  <div className="bg-gradient-to-r from-primary to-secondary p-4">
                    <h3 className="text-xl font-bold text-white">{meal.meal_name}</h3>
                    <p className="text-white/90 capitalize">{meal.meal_type}</p>
                  </div>
                  
                  <div className="p-6">
                    <div className="mb-4">
                      <p className="text-sm text-gray-600 mb-2">Date: {new Date(meal.date).toLocaleDateString()}</p>
                      <p className="text-gray-700">{meal.ai_summary}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="bg-green-50 p-3 rounded">
                        <div className="text-sm text-gray-600">Calories</div>
                        <div className="text-xl font-bold text-primary">{Math.round(meal.total_calories)}</div>
                      </div>
                      <div className="bg-blue-50 p-3 rounded">
                        <div className="text-sm text-gray-600">Protein</div>
                        <div className="text-xl font-bold text-blue-600">{Math.round(meal.total_protein)}g</div>
                      </div>
                      <div className="bg-yellow-50 p-3 rounded">
                        <div className="text-sm text-gray-600">Carbs</div>
                        <div className="text-xl font-bold text-yellow-600">{Math.round(meal.total_carbs)}g</div>
                      </div>
                      <div className="bg-red-50 p-3 rounded">
                        <div className="text-sm text-gray-600">Fat</div>
                        <div className="text-xl font-bold text-red-600">{Math.round(meal.total_fat)}g</div>
                      </div>
                    </div>

                    {meal.foods && meal.foods.length > 0 && (
                      <div className="mb-4">
                        <h4 className="font-semibold mb-2">Ingredients:</h4>
                        <div className="flex flex-wrap gap-2">
                          {meal.foods.map((food) => (
                            <span
                              key={food.id}
                              className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm"
                            >
                              {food.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {meal.instructions && (
                      <div className="border-t pt-4">
                        <h4 className="font-semibold mb-2">Instructions:</h4>
                        <p className="text-sm text-gray-600">{meal.instructions}</p>
                      </div>
                    )}

                    {meal.ai_reasoning && (
                      <div className="mt-4 p-3 bg-purple-50 rounded">
                        <p className="text-xs font-semibold text-purple-900">AI Reasoning:</p>
                        <p className="text-xs text-purple-700">{meal.ai_reasoning}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white p-12 rounded-lg shadow text-center">
              <p className="text-gray-500 mb-4">No meal recommendations yet</p>
              <p className="text-sm text-gray-400">Generate your first meal recommendation above</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MealRecommendations;