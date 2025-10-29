# NutriFit - AI-Powered Personalized Nutrition System

## Project Overview

NutriFit is a full-stack AI-powered web application that provides personalized meal plans based on user health data, scanned medical reports, and local seasonal foods in Nepal. The system uses Django for backend, React for frontend, MySQL as the database, and integrates OpenCV for disease detection from scanned reports.

## Tech Stack

### Backend
- **Framework**: Django 4.2.7 + Django REST Framework
- **Database**: MySQL
- **AI/ML**: TensorFlow, PyTorch, scikit-learn
- **Computer Vision**: OpenCV, Pytesseract
- **Authentication**: JWT (Simple JWT)

### Frontend
- **Framework**: React 18.2
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Routing**: React Router DOM

### AI/ML Components
- Custom ML model for nutrition recommendations
- OpenCV for medical document scanning
- Google Gemini API for enhanced recommendations (optional)

## Core Features

1. **User Management**
   - User registration and authentication
   - Profile setup (age, gender, weight, height, medical history)
   - Health metrics calculation (BMI, BMR, daily calorie needs)

2. **AI-Based Meal Recommendations**
   - Personalized meal plans based on health profile
   - Disease-aware food recommendations
   - Seasonal Nepali food integration
   - Macronutrient tracking

3. **Medical Document Scanning**
   - Upload and scan medical documents (blood reports, prescriptions)
   - OpenCV-based text extraction
   - Disease detection and insight extraction
   - Automated dietary recommendations based on health conditions

4. **Nutrition Planning**
   - Multi-day nutrition plans
   - Daily meal recommendations (breakfast, lunch, dinner, snacks)
   - Nutritional breakdown and tracking

5. **Local Marketplace**
   - Browse seasonal Nepali foods
   - Shopping cart functionality
   - Order placement for ingredients

6. **Admin Dashboard**
   - Django admin for managing users, foods, and medical data
   - AI logs and system monitoring

## Database Schema

### Tables

1. **users** - User authentication and basic info
2. **user_profiles** - Detailed health profile data
3. **foods** - Food database with nutritional information
4. **meal_recommendations** - AI-generated meal plans
5. **nutrition_plans** - Multi-day nutrition plans
6. **medical_reports** - Uploaded medical documents and analysis
7. **diseases** - Disease database with dietary guidelines
8. **cart** - Shopping cart items
9. **orders** - Order history

## Project Structure

```
nuTrifit/
├── backend/
│   ├── nutrifit/              # Django project settings
│   ├── users/                 # User management app
│   ├── nutrition/             # Nutrition and meal recommendations
│   ├── medical/               # Medical report scanning
│   ├── marketplace/           # Shopping functionality
│   ├── ml_models/             # ML models and AI engine
│   ├── manage.py
│   ├── requirements.txt
│   └── .env
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/       # Reusable React components
│   │   ├── pages/            # Page components
│   │   ├── api.js            # API service layer
│   │   ├── AuthContext.js    # Authentication context
│   │   ├── App.js
│   │   └── index.js
│   ├── package.json
│   ├── tailwind.config.js
│   └── .env
└── README.md
```

## Installation & Setup

### Prerequisites

- Python 3.11+
- Node.js 18+
- MySQL 8.0+
- Tesseract OCR (for medical document scanning)

### Backend Setup

1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Create and activate virtual environment**:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install system dependencies** (for MySQL and OpenCV):
   ```bash
   # Ubuntu/Debian
   sudo apt-get install python3-dev default-libmysqlclient-dev build-essential
   sudo apt-get install tesseract-ocr
   
   # macOS
   brew install mysql-client
   brew install tesseract
   
   # Windows
   # Download and install Tesseract from: https://github.com/UB-Mannheim/tesseract/wiki
   ```

4. **Install Python dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

5. **Setup MySQL database**:
   ```bash
   mysql -u root -p
   ```
   ```sql
   CREATE DATABASE nutrifit_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   CREATE USER 'nutrifit_user'@'localhost' IDENTIFIED BY 'your_password';
   GRANT ALL PRIVILEGES ON nutrifit_db.* TO 'nutrifit_user'@'localhost';
   FLUSH PRIVILEGES;
   EXIT;
   ```

6. **Configure environment variables**:
   - Copy `.env.example` to `.env`
   - Update database credentials in `.env`
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   ```

7. **Run migrations**:
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

8. **Create superuser**:
   ```bash
   python manage.py createsuperuser
   ```

9. **Seed database with Nepali foods**:
   ```bash
   python manage.py seed_data
   ```

10. **Run development server**:
    ```bash
    python manage.py runserver
    ```

### Frontend Setup

1. **Navigate to frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Configure environment**:
   - Update `.env` if needed
   ```
   REACT_APP_API_URL=http://localhost:8000/api
   ```

4. **Run development server**:
   ```bash
   npm start
   # or
   yarn start
   ```

   The application will open at `http://localhost:3000`

## API Documentation

### Authentication Endpoints

- `POST /api/users/register/` - User registration
- `POST /api/users/login/` - User login (returns JWT tokens)
- `POST /api/users/token/refresh/` - Refresh access token
- `GET /api/users/me/` - Get current user
- `GET /api/users/profile/` - Get user profile
- `PATCH /api/users/profile/update/` - Update user profile

### Nutrition Endpoints

- `GET /api/nutrition/foods/` - List all foods
- `GET /api/nutrition/foods/{id}/` - Get food details
- `GET /api/nutrition/foods/season/{season}/` - Get seasonal foods
- `GET /api/nutrition/recommendations/` - List meal recommendations
- `POST /api/nutrition/recommendations/generate/` - Generate new recommendation
- `GET /api/nutrition/plans/` - List nutrition plans
- `POST /api/nutrition/plans/create/` - Create nutrition plan

### Medical Endpoints

- `GET /api/medical/reports/` - List medical reports
- `GET /api/medical/reports/{id}/` - Get report details
- `POST /api/medical/reports/upload/` - Upload medical report
- `POST /api/medical/reports/{id}/analyze/` - Analyze uploaded report
- `GET /api/medical/diseases/` - List diseases

### Marketplace Endpoints

- `GET /api/marketplace/cart/` - Get cart items
- `POST /api/marketplace/cart/add/` - Add item to cart
- `PATCH /api/marketplace/cart/{id}/update/` - Update cart item
- `DELETE /api/marketplace/cart/{id}/delete/` - Remove cart item
- `GET /api/marketplace/orders/` - List orders
- `POST /api/marketplace/orders/create/` - Create order

## AI/ML Components

### Nutrition AI Engine (`nutrition/ai_engine.py`)

The NutritionAI class provides:
- User health analysis
- Disease-based food recommendations
- Seasonal food selection
- Meal composition optimization
- Macronutrient calculation

**Future Enhancements**:
- Train custom TensorFlow/PyTorch model
- Integrate larger nutritional datasets
- Implement collaborative filtering
- Add meal preference learning

### Medical Document Scanner (`medical/scanner.py`)

The MedicalDocumentScanner class provides:
- Image preprocessing with OpenCV
- OCR text extraction with Pytesseract
- Pattern-based condition detection
- Health metrics extraction
- Automated dietary recommendations

**Future Enhancements**:
- Deep learning models for better accuracy
- Support for more document types
- Handwritten text recognition
- Multi-language support

## Data Sources

### Recommended Datasets

1. **FoodData Central (USDA)** - https://fdc.nal.usda.gov/
2. **Indian Food Composition Table (IFCT)** - For South Asian foods
3. **Nepal Agricultural Research Council (NARC)** - Local food data
4. **Medical Diagnosis Dataset (Kaggle)** - Disease-diet correlation

### Current Mock Data

The application includes mock data for:
- 15 common Nepali foods with nutritional info
- 5 common diseases with dietary guidelines
- Seasonal food mapping

## Testing

### Backend Testing
```bash
cd backend
python manage.py test
```

### Frontend Testing
```bash
cd frontend
npm test
```

## Deployment

### Production Checklist

1. **Backend**:
   - Set `DEBUG=False` in `.env`
   - Use production database
   - Configure allowed hosts
   - Set up HTTPS
   - Configure static/media file serving
   - Use gunicorn for production server

2. **Frontend**:
   - Build production bundle: `npm run build`
   - Update API URL to production endpoint
   - Configure CDN for static assets

3. **Database**:
   - Regular backups
   - Optimize indexes
   - Monitor query performance

4. **Security**:
   - Change SECRET_KEY
   - Use environment variables for sensitive data
   - Enable CORS only for trusted origins
   - Implement rate limiting
   - Regular security audits

## Admin Access

Access Django admin at: `http://localhost:8000/admin/`

Use the superuser credentials created during setup.

## Troubleshooting

### MySQL Connection Issues
- Ensure MySQL service is running
- Verify database credentials in `.env`
- Check MySQL user permissions

### OpenCV/Tesseract Issues
- Ensure Tesseract is installed and in PATH
- Install required system dependencies
- Check file permissions for uploaded files

### React Build Issues
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Clear cache: `npm cache clean --force`

## Contributing

This is a competition project. For the full version:
1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## License

This project was developed for the Vibe Coding competition.

## Contact

For questions or support, please contact the development team.

## Acknowledgments

- Nepal Agricultural Research Council for local food data
- USDA FoodData Central
- OpenAI for AI assistance
- Open source community

---

**Note**: This is an MVP (Minimum Viable Product). The AI models use basic algorithms and can be enhanced with proper ML model training using TensorFlow/PyTorch for production use.