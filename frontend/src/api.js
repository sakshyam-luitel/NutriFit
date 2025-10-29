import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        const response = await axios.post(`${API_BASE_URL}/users/token/refresh/`, {
          refresh: refreshToken,
        });

        const { access } = response.data;
        localStorage.setItem('access_token', access);

        originalRequest.headers.Authorization = `Bearer ${access}`;
        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  register: (data) => api.post('/users/register/', data),
  login: (data) => api.post('/users/login/', data),
  getCurrentUser: () => api.get('/users/me/'),
  getProfile: () => api.get('/users/profile/'),
  updateProfile: (data) => api.patch('/users/profile/update/', data),
};

// Nutrition APIs
export const nutritionAPI = {
  getFoods: () => api.get('/nutrition/foods/'),
  getFood: (id) => api.get(`/nutrition/foods/${id}/`),
  getSeasonalFoods: (season) => api.get(`/nutrition/foods/season/${season}/`),
  getMealRecommendations: () => api.get('/nutrition/recommendations/'),
  generateRecommendation: (data) => api.post('/nutrition/recommendations/generate/', data),
  getNutritionPlans: () => api.get('/nutrition/plans/'),
  createNutritionPlan: (data) => api.post('/nutrition/plans/create/', data),
};

// Medical APIs
export const medicalAPI = {
  getMedicalReports: () => api.get('/medical/reports/'),
  getReport: (id) => api.get(`/medical/reports/${id}/`),
  uploadReport: (data) => {
    const formData = new FormData();
    formData.append('file', data.file);
    formData.append('report_type', data.report_type);
    return api.post('/medical/reports/upload/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  analyzeReport: (id) => api.post(`/medical/reports/${id}/analyze/`),
  getDiseases: () => api.get('/medical/diseases/'),
};

// Marketplace APIs
export const marketplaceAPI = {
  getCart: () => api.get('/marketplace/cart/'),
  addToCart: (data) => api.post('/marketplace/cart/add/', data),
  updateCart: (id, data) => api.patch(`/marketplace/cart/${id}/update/`, data),
  removeFromCart: (id) => api.delete(`/marketplace/cart/${id}/delete/`),
  getOrders: () => api.get('/marketplace/orders/'),
  createOrder: (data) => api.post('/marketplace/orders/create/', data),
};

export default api;