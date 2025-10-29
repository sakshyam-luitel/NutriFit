import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../AuthContext.jsx';
import { authAPI, nutritionAPI, medicalAPI } from '../api';

const Dashboard = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [recentMeals, setRecentMeals] = useState([]);
  const [recentReports, setRecentReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [profileRes, mealsRes, reportsRes] = await Promise.all([
        authAPI.getProfile(),
        nutritionAPI.getMealRecommendations(),
        medicalAPI.getMedicalReports(),
      ]);

      setProfile(profileRes.data);
      setRecentMeals(mealsRes.data.slice(0, 3));
      setRecentReports(reportsRes.data.slice(0, 3));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-primary to-secondary text-white rounded-lg p-8 mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.first_name}!</h1>
          <p className="text-lg">Here's your nutrition overview</p>
        </div>

        {/* Health Metrics */}
        {profile && (
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="text-sm text-gray-600 mb-1">BMI</div>
              <div className="text-3xl font-bold text-primary">{profile.bmi || 'N/A'}</div>
              <div className="text-xs text-gray-500 mt-1">Body Mass Index</div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="text-sm text-gray-600 mb-1">BMR</div>
              <div className="text-3xl font-bold text-primary">{profile.bmr || 'N/A'}</div>
              <div className="text-xs text-gray-500 mt-1">Basal Metabolic Rate</div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="text-sm text-gray-600 mb-1">Daily Calories</div>
              <div className="text-3xl font-bold text-primary">{profile.daily_calories || 'N/A'}</div>
              <div className="text-xs text-gray-500 mt-1">Recommended intake</div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="text-sm text-gray-600 mb-1">Goal</div>
              <div className="text-2xl font-bold text-primary capitalize">
                {profile.goal?.replace('_', ' ') || 'Not Set'}
              </div>
              <div className="text-xs text-gray-500 mt-1">Current health goal</div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Link
            to="/meals"
            className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow"
          >
            <div className="text-4xl mb-4">🍽️</div>
            <h3 className="text-xl font-bold mb-2">Generate Meal Plan</h3>
            <p className="text-gray-600">Get AI-powered meal recommendations</p>
          </Link>

          <Link
            to="/medical"
            className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow"
          >
            <div className="text-4xl mb-4">📄</div>
            <h3 className="text-xl font-bold mb-2">Upload Medical Report</h3>
            <p className="text-gray-600">Scan and analyze health reports</p>
          </Link>

          <Link
            to="/marketplace"
            className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow"
          >
            <div className="text-4xl mb-4">🛒</div>
            <h3 className="text-xl font-bold mb-2">Shop Ingredients</h3>
            <p className="text-gray-600">Buy local seasonal foods</p>
          </Link>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Recent Meals */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Recent Meal Plans</h2>
              <Link to="/meals" className="text-primary hover:text-secondary text-sm">
                View All
              </Link>
            </div>

            {recentMeals.length > 0 ? (
              <div className="space-y-4">
                {recentMeals.map((meal) => (
                  <div key={meal.id} className="border-l-4 border-primary pl-4 py-2">
                    <div className="font-semibold">{meal.meal_name}</div>
                    <div className="text-sm text-gray-600">
                      {meal.meal_type} • {meal.total_calories} cal
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {new Date(meal.date).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-gray-500 text-center py-8">
                <p>No meal plans yet</p>
                <Link to="/meals" className="text-primary hover:text-secondary">
                  Generate your first meal plan
                </Link>
              </div>
            )}
          </div>

          {/* Recent Medical Reports */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Medical Reports</h2>
              <Link to="/medical" className="text-primary hover:text-secondary text-sm">
                View All
              </Link>
            </div>

            {recentReports.length > 0 ? (
              <div className="space-y-4">
                {recentReports.map((report) => (
                  <div key={report.id} className="border-l-4 border-secondary pl-4 py-2">
                    <div className="font-semibold capitalize">
                      {report.report_type.replace('_', ' ')}
                    </div>
                    <div className="text-sm text-gray-600 capitalize">
                      Status: {report.status}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {new Date(report.scan_date).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-gray-500 text-center py-8">
                <p>No medical reports uploaded</p>
                <Link to="/medical" className="text-primary hover:text-secondary">
                  Upload your first report
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Health Tips */}
        <div className="mt-8 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4">💡 Health Tips</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Stay Hydrated</h3>
              <p className="text-sm text-gray-600">Drink at least 8 glasses of water daily</p>
            </div>
            <div className="bg-white p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Eat Seasonal</h3>
              <p className="text-sm text-gray-600">Choose locally available seasonal foods</p>
            </div>
            <div className="bg-white p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Regular Exercise</h3>
              <p className="text-sm text-gray-600">Aim for 30 minutes of activity daily</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;