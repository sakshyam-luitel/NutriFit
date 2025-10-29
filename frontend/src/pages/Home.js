import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary to-secondary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-4">Welcome to NutriFit</h1>
            <p className="text-xl mb-8">
              AI-Powered Personalized Nutrition and Disease-Aware Meal Recommendations
            </p>
            <p className="text-lg mb-8">
              Get personalized meal plans based on your health data, medical reports, and seasonal Nepali foods
            </p>
            {!user && (
              <div className="space-x-4">
                <Link
                  to="/register"
                  className="bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 inline-block"
                >
                  Get Started
                </Link>
                <Link
                  to="/login"
                  className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary inline-block"
                >
                  Login
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="text-4xl mb-4">🤖</div>
            <h3 className="text-xl font-bold mb-2">AI-Powered Recommendations</h3>
            <p className="text-gray-600">
              Get personalized meal plans using advanced ML algorithms based on your health profile
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="text-4xl mb-4">📄</div>
            <h3 className="text-xl font-bold mb-2">Medical Report Scanning</h3>
            <p className="text-gray-600">
              Upload your medical reports and our AI extracts health insights using computer vision
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="text-4xl mb-4">🌿</div>
            <h3 className="text-xl font-bold mb-2">Seasonal Nepali Foods</h3>
            <p className="text-gray-600">
              Meal recommendations featuring locally available seasonal foods from Nepal
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="text-4xl mb-4">🏥</div>
            <h3 className="text-xl font-bold mb-2">Disease-Aware Planning</h3>
            <p className="text-gray-600">
              Specialized meal plans for diabetes, hypertension, anemia, and other conditions
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="text-4xl mb-4">🛒</div>
            <h3 className="text-xl font-bold mb-2">Local Marketplace</h3>
            <p className="text-gray-600">
              Shop for ingredients directly from local vendors based on your meal plan
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-bold mb-2">Health Tracking</h3>
            <p className="text-gray-600">
              Track your BMI, BMR, daily calorie needs, and nutritional goals
            </p>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-primary text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="font-bold mb-2">Create Profile</h3>
              <p className="text-gray-600">Enter your health data, goals, and medical conditions</p>
            </div>

            <div className="text-center">
              <div className="bg-primary text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="font-bold mb-2">Upload Reports</h3>
              <p className="text-gray-600">Upload medical reports for AI analysis</p>
            </div>

            <div className="text-center">
              <div className="bg-primary text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="font-bold mb-2">Get Meal Plans</h3>
              <p className="text-gray-600">Receive personalized AI-generated meal recommendations</p>
            </div>

            <div className="text-center">
              <div className="bg-primary text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                4
              </div>
              <h3 className="font-bold mb-2">Shop & Cook</h3>
              <p className="text-gray-600">Order ingredients and follow meal instructions</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;