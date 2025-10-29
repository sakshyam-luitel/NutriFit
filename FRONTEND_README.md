# NutriFit - Complete React (Vite) + Django Application

## ✅ What's Complete

This is a **fully functional** AI-powered nutrition and meal recommendation system with:

### Backend (Django + MySQL)
- ✅ Complete REST API with Django REST Framework
- ✅ JWT Authentication
- ✅ User profile management with health metrics (BMI, BMR, calories)
- ✅ AI-powered meal recommendation engine
- ✅ OpenCV-based medical document scanner
- ✅ Disease detection from medical reports
- ✅ 15 Nepali foods seeded with nutritional data
- ✅ Marketplace with cart and orders

### Frontend (React + Vite + Tailwind)
- ✅ Modern Vite-based React app
- ✅ All components in .jsx format
- ✅ Complete authentication flow (Login/Register)
- ✅ User profile with health data management
- ✅ Interactive dashboard with health metrics
- ✅ Meal recommendation generator
- ✅ Medical report upload and analysis
- ✅ Full marketplace with cart and checkout
- ✅ Responsive design with Tailwind CSS

## 🚀 Quick Start

### Prerequisites
- Python 3.11+
- Node.js 18+
- MySQL 8.0+
- Tesseract OCR

### 1. Backend Setup

```bash
# Navigate to backend
cd /app/backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install system dependencies (Ubuntu/Debian)
sudo apt-get install python3-dev default-libmysqlclient-dev build-essential tesseract-ocr

# Install Python packages
pip install -r requirements.txt

# Setup MySQL database
mysql -u root -p
CREATE DATABASE nutrifit_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;

# Update .env file with your database credentials
# Edit backend/.env and set:
# DB_NAME=nutrifit_db
# DB_USER=root
# DB_PASSWORD=your_mysql_password

# Run migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Seed database with Nepali foods
python manage.py seed_data

# Start backend server
python manage.py runserver
# Backend runs at http://localhost:8000
```

### 2. Frontend Setup

```bash
# Navigate to frontend
cd /app/frontend

# Install dependencies
yarn install
# or: npm install

# Start development server
yarn dev
# or: npm run dev

# Frontend runs at http://localhost:3000
```

## 📁 Project Structure

```
/app/
├── backend/                    # Django Backend
│   ├── nutrifit/              # Project settings
│   ├── users/                 # User management & JWT auth
│   ├── nutrition/             # Meal recommendations & AI engine
│   │   ├── ai_engine.py      # AI recommendation logic
│   │   └── management/commands/seed_data.py
│   ├── medical/               # Medical report scanning
│   │   └── scanner.py        # OpenCV document scanner
│   ├── marketplace/           # Shopping cart & orders
│   ├── manage.py
│   ├── requirements.txt
│   └── .env
│
├── frontend/                   # React Frontend (Vite)
│   ├── src/
│   │   ├── components/
│   │   │   └── Navbar.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── MealRecommendations.jsx
│   │   │   ├── MedicalReports.jsx
│   │   │   └── Marketplace.jsx
│   │   ├── api.js             # Axios API service
│   │   ├── AuthContext.jsx   # Auth context provider
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── package.json
│   └── .env
│
├── README.md
└── SETUP_GUIDE.md
```

## 🎯 Features

### 1. User Authentication
- Register with email and password
- JWT-based authentication
- Protected routes
- Auto token refresh

### 2. Health Profile
- Age, gender, weight, height
- Activity level and health goals
- Disease and allergy tracking
- Automatic BMI, BMR, and calorie calculation

### 3. AI Meal Recommendations
- Generate single meal recommendations
- Create 7-day nutrition plans
- Disease-aware food selection
- Seasonal Nepali food integration
- Macronutrient tracking

### 4. Medical Document Analysis
- Upload medical reports (blood tests, prescriptions)
- OpenCV-based OCR text extraction
- Automatic disease detection
- Health metrics extraction
- AI-generated dietary recommendations

### 5. Local Food Marketplace
- Browse seasonal Nepali foods
- Filter by season
- Shopping cart functionality
- Order placement and tracking
- Nutritional information for each food

## 🔌 API Endpoints

### Authentication
```
POST /api/users/register/       - Register new user
POST /api/users/login/          - Login (get JWT tokens)
POST /api/users/token/refresh/  - Refresh access token
GET  /api/users/me/             - Get current user
GET  /api/users/profile/        - Get user profile
PATCH /api/users/profile/update/ - Update profile
```

### Nutrition
```
GET  /api/nutrition/foods/                    - List all foods
GET  /api/nutrition/foods/{id}/              - Get food details
GET  /api/nutrition/foods/season/{season}/   - Get seasonal foods
GET  /api/nutrition/recommendations/         - List recommendations
POST /api/nutrition/recommendations/generate/ - Generate meal
GET  /api/nutrition/plans/                   - List nutrition plans
POST /api/nutrition/plans/create/            - Create plan
```

### Medical
```
GET  /api/medical/reports/          - List medical reports
POST /api/medical/reports/upload/   - Upload report
POST /api/medical/reports/{id}/analyze/ - Analyze report
```

### Marketplace
```
GET    /api/marketplace/cart/           - Get cart
POST   /api/marketplace/cart/add/       - Add to cart
PATCH  /api/marketplace/cart/{id}/update/ - Update quantity
DELETE /api/marketplace/cart/{id}/delete/ - Remove item
GET    /api/marketplace/orders/         - List orders
POST   /api/marketplace/orders/create/  - Create order
```

## 🛠️ Technologies

### Backend
- **Django 4.2.7** - Web framework
- **Django REST Framework** - API development
- **MySQL** - Database
- **JWT** - Authentication
- **OpenCV** - Image processing
- **Pytesseract** - OCR
- **TensorFlow/PyTorch** - ML (ready for integration)

### Frontend
- **React 18** - UI library
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **React Router** - Routing

## 🧪 Testing

### Test User Flow

1. **Register**: Go to http://localhost:3000/register
2. **Complete Profile**: Add age, weight, height, diseases
3. **Generate Meal**: Click "Generate Meal" on Meals page
4. **Upload Report**: Upload a medical document on Medical page
5. **Shop**: Browse foods and add to cart on Marketplace

### Test API with cURL

```bash
# Register user
curl -X POST http://localhost:8000/api/users/register/ \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","password2":"password123","first_name":"Test","last_name":"User"}'

# Login
curl -X POST http://localhost:8000/api/users/login/ \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Get foods (use token from login)
curl http://localhost:8000/api/nutrition/foods/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## 🐛 Troubleshooting

### MySQL Connection Error
```bash
# Check MySQL is running
sudo systemctl status mysql

# Verify credentials in backend/.env
DB_NAME=nutrifit_db
DB_USER=root
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=3306
```

### CORS Errors
Make sure `backend/.env` has:
```
CORS_ORIGIN_WHITELIST=http://localhost:3000,http://127.0.0.1:3000
```

### Vite Not Starting
```bash
cd frontend
rm -rf node_modules
yarn install
yarn dev
```

### Migrations Errors
```bash
cd backend
python manage.py flush
find . -path "*/migrations/*.py" -not -name "__init__.py" -delete
python manage.py makemigrations
python manage.py migrate
python manage.py seed_data
```

## 📝 Environment Variables

### Backend (.env)
```bash
SECRET_KEY=your-secret-key
DEBUG=True
DB_NAME=nutrifit_db
DB_USER=root
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=3306
GEMINI_API_KEY=optional
CORS_ORIGIN_WHITELIST=http://localhost:3000
```

### Frontend (.env)
```bash
VITE_API_URL=http://localhost:8000/api
```

## 🚀 Production Deployment

### Backend
```bash
# Install gunicorn
pip install gunicorn

# Run with gunicorn
gunicorn nutrifit.wsgi:application --bind 0.0.0.0:8000

# Set DEBUG=False in .env
# Configure static files
python manage.py collectstatic
```

### Frontend
```bash
# Build for production
yarn build

# Preview production build
yarn preview
```

## 📚 Next Steps

1. **Enhance AI Models**: Train custom ML models with TensorFlow/PyTorch
2. **Add More Foods**: Expand the Nepali food database
3. **Image Generation**: Integrate Gemini API for food images
4. **Mobile App**: Create React Native mobile version
5. **Payment Gateway**: Add payment integration for marketplace
6. **Advanced Analytics**: Add nutrition tracking charts

## 🎉 Features Highlights

- ✅ All components in .jsx format
- ✅ Vite for fast development
- ✅ Complete CRUD operations
- ✅ Real-time validation
- ✅ Responsive design
- ✅ Error handling
- ✅ Loading states
- ✅ Success messages
- ✅ Professional UI/UX

## 📞 Support

For issues or questions:
1. Check the SETUP_GUIDE.md
2. Review the troubleshooting section
3. Check Django admin at http://localhost:8000/admin/
4. Check browser console for frontend errors
5. Check Django logs for backend errors

---

**Project Status**: ✅ Complete and Ready to Run!

Run with `npm run dev` in frontend and `python manage.py runserver` in backend.
