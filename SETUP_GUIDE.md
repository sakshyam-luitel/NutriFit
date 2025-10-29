# NutriFit - Complete Setup Guide

## Quick Start Guide

### System Requirements
- Python 3.11 or higher
- Node.js 18 or higher  
- MySQL 8.0 or higher
- 4GB RAM minimum
- 10GB free disk space

### Step 1: Install System Dependencies

#### On Ubuntu/Debian:
```bash
sudo apt-get update
sudo apt-get install -y python3 python3-pip python3-venv
sudo apt-get install -y nodejs npm
sudo apt-get install -y mysql-server
sudo apt-get install -y python3-dev default-libmysqlclient-dev build-essential
sudo apt-get install -y tesseract-ocr
sudo apt-get install -y libgl1-mesa-glx  # For OpenCV
```

#### On macOS:
```bash
brew install python3
brew install node
brew install mysql
brew install mysql-client
brew install tesseract
```

#### On Windows:
1. Install Python from https://www.python.org/downloads/
2. Install Node.js from https://nodejs.org/
3. Install MySQL from https://dev.mysql.com/downloads/installer/
4. Install Tesseract from https://github.com/UB-Mannheim/tesseract/wiki
5. Add Tesseract to PATH

### Step 2: Clone and Setup Project

```bash
# Navigate to your project directory
cd /path/to/nutrifit

# Verify structure
ls -la
# You should see: backend/, frontend/, README.md
```

### Step 3: Database Setup

```bash
# Start MySQL service
# Ubuntu/Debian:
sudo systemctl start mysql

# macOS:
brew services start mysql

# Windows:
# Start MySQL from Services

# Login to MySQL
mysql -u root -p

# Create database
CREATE DATABASE nutrifit_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# Create user (optional, for security)
CREATE USER 'nutrifit_user'@'localhost' IDENTIFIED BY 'StrongPassword123!';
GRANT ALL PRIVILEGES ON nutrifit_db.* TO 'nutrifit_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### Step 4: Backend Setup

```bash
cd backend

# Create virtual environment
python3 -m venv venv

# Activate virtual environment
# Linux/macOS:
source venv/bin/activate

# Windows:
venv\Scripts\activate

# Install dependencies
pip install --upgrade pip
pip install -r requirements.txt

# Configure environment
cp .env.example .env

# Edit .env file with your database credentials
# Update these lines:
# DB_NAME=nutrifit_db
# DB_USER=nutrifit_user  # or 'root' if not created separate user
# DB_PASSWORD=StrongPassword123!  # your MySQL password
# DB_HOST=localhost
# DB_PORT=3306

# Run migrations
python manage.py makemigrations
python manage.py migrate

# Create superuser for admin access
python manage.py createsuperuser
# Follow prompts to create admin user

# Seed database with sample Nepali foods
python manage.py seed_data

# Test the server
python manage.py runserver
# Server should start at http://127.0.0.1:8000/
```

### Step 5: Frontend Setup

```bash
# Open new terminal
cd frontend

# Install dependencies
npm install
# or if you prefer yarn:
yarn install

# Verify .env configuration
# Check that .env contains:
# REACT_APP_API_URL=http://localhost:8000/api

# Start development server
npm start
# or
yarn start

# Browser should automatically open http://localhost:3000/
```

### Step 6: Verify Installation

1. **Backend Health Check**:
   - Visit http://localhost:8000/admin/
   - Login with superuser credentials
   - You should see Django admin dashboard

2. **Frontend Health Check**:
   - Visit http://localhost:3000/
   - You should see NutriFit homepage

3. **API Test**:
   ```bash
   curl http://localhost:8000/api/nutrition/foods/
   # Should return JSON response (may show authentication error, which is normal)
   ```

### Step 7: Test Complete Flow

1. **Register User**:
   - Go to http://localhost:3000/register
   - Create a new account
   - Fill in name, email, password

2. **Complete Profile**:
   - Go to Profile page
   - Enter health data (age, weight, height, etc.)
   - Add any diseases or dietary preferences

3. **Generate Meal Plan**:
   - Go to Meal Recommendations
   - Click "Generate Meal Plan"
   - View AI-generated recommendations

4. **Upload Medical Report**:
   - Go to Medical Reports
   - Upload a sample medical document
   - Click "Analyze Report"
   - View extracted insights

## Common Issues and Solutions

### Issue 1: MySQL Connection Error
**Error**: `Can't connect to MySQL server`

**Solution**:
```bash
# Check if MySQL is running
sudo systemctl status mysql  # Linux
brew services list  # macOS

# Start MySQL if not running
sudo systemctl start mysql  # Linux
brew services start mysql  # macOS

# Verify credentials in backend/.env
# Make sure DB_NAME, DB_USER, DB_PASSWORD are correct
```

### Issue 2: mysqlclient Installation Error
**Error**: `error: command 'gcc' failed` or `mysql_config not found`

**Solution**:
```bash
# Ubuntu/Debian:
sudo apt-get install python3-dev default-libmysqlclient-dev build-essential

# macOS:
brew install mysql-client
export PATH="/usr/local/opt/mysql-client/bin:$PATH"

# Then retry:
pip install mysqlclient
```

### Issue 3: Tesseract Not Found
**Error**: `TesseractNotFoundError`

**Solution**:
```bash
# Install Tesseract
# Ubuntu/Debian:
sudo apt-get install tesseract-ocr

# macOS:
brew install tesseract

# Windows:
# Download from: https://github.com/UB-Mannheim/tesseract/wiki
# Add to PATH: C:\Program Files\Tesseract-OCR

# Verify installation:
tesseract --version
```

### Issue 4: Port Already in Use
**Error**: `Port 8000 is already in use` or `Port 3000 is already in use`

**Solution**:
```bash
# Find and kill process using port
# Linux/macOS:
sudo lsof -i :8000
sudo kill -9 <PID>

# Windows:
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# Or use different port
# Backend:
python manage.py runserver 0.0.0.0:8001

# Frontend: Update package.json scripts
"start": "PORT=3001 react-scripts start"
```

### Issue 5: CORS Errors
**Error**: `Access to XMLHttpRequest blocked by CORS policy`

**Solution**:
1. Check backend/.env has correct CORS settings:
   ```
   CORS_ORIGIN_WHITELIST=http://localhost:3000,http://127.0.0.1:3000
   ```

2. Verify Django settings.py has corsheaders middleware

3. Restart Django server:
   ```bash
   python manage.py runserver
   ```

### Issue 6: React Build Errors
**Error**: Various npm/yarn errors

**Solution**:
```bash
cd frontend

# Clear cache and reinstall
rm -rf node_modules
rm package-lock.json  # or yarn.lock
npm cache clean --force

# Reinstall
npm install

# If still issues, try:
npm install --legacy-peer-deps
```

### Issue 7: Migration Errors
**Error**: `No such table` or migration issues

**Solution**:
```bash
cd backend

# Reset migrations (CAUTION: Deletes all data)
python manage.py flush
find . -path "*/migrations/*.py" -not -name "__init__.py" -delete
find . -path "*/migrations/*.pyc" -delete

# Recreate migrations
python manage.py makemigrations
python manage.py migrate

# Reseed data
python manage.py seed_data
```

## Production Deployment

### Using Gunicorn and Nginx

1. **Install Gunicorn**:
   ```bash
   pip install gunicorn
   ```

2. **Run with Gunicorn**:
   ```bash
   gunicorn nutrifit.wsgi:application --bind 0.0.0.0:8000
   ```

3. **Configure Nginx**:
   ```nginx
   server {
       listen 80;
       server_name your_domain.com;

       location /api/ {
           proxy_pass http://127.0.0.1:8000;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
       }

       location / {
           root /path/to/frontend/build;
           try_files $uri /index.html;
       }

       location /media/ {
           alias /path/to/backend/media/;
       }
   }
   ```

4. **Build Frontend**:
   ```bash
   cd frontend
   npm run build
   ```

## Environment Variables Reference

### Backend (.env)
```bash
SECRET_KEY=your-secret-key-here
DEBUG=True  # Set to False in production
ALLOWED_HOSTS=localhost,127.0.0.1,your_domain.com

DB_NAME=nutrifit_db
DB_USER=nutrifit_user
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=3306

GEMINI_API_KEY=your_gemini_key  # Optional

CORS_ORIGIN_WHITELIST=http://localhost:3000
```

### Frontend (.env)
```bash
REACT_APP_API_URL=http://localhost:8000/api
```

## Support

If you encounter issues not covered here:
1. Check error logs: `backend/logs/` or browser console
2. Verify all dependencies are installed
3. Ensure all services (MySQL, Django, React) are running
4. Check firewall settings

## Next Steps

After successful setup:
1. Explore the Django admin at http://localhost:8000/admin/
2. Add more foods to the database
3. Upload and test medical report scanning
4. Generate meal recommendations
5. Customize the AI engine for better recommendations
6. Train custom ML models with real datasets

---

**Setup Complete!** 🎉

Your NutriFit application should now be running successfully!
