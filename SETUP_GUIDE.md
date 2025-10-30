# 🚀 Complete Setup Guide - Run on Local System

## ✅ Prerequisites

Before running the system, ensure you have:

1. **Node.js** (v18 or higher)
   - Check: `node --version`
   - Download: https://nodejs.org/

2. **MongoDB** (Community Edition)
   - Check: `mongod --version`
   - Download: https://www.mongodb.com/try/download/community

3. **Git** (optional, for version control)
   - Check: `git --version`
   - Download: https://git-scm.com/

---

## 📦 One-Time Setup

### Step 1: Install Dependencies

Open Command Prompt or PowerShell in the project folder:

```bash
# Install backend dependencies
cd server
npm install
cd ..

# Install frontend dependencies
npm install
```

### Step 2: Start MongoDB

**Option A: Windows Service (Recommended)**
```bash
net start MongoDB
```

**Option B: Manual Start**
```bash
mongod --dbpath "C:\data\db"
```

### Step 3: Verify MongoDB
```bash
# Should show MongoDB version
mongod --version
```

---

## 🎯 Quick Start (Easy Method)

### Windows Users:

**Double-click**: `START_SYSTEM.bat`

This will:
1. ✅ Check if MongoDB is running
2. ✅ Start backend server (port 5000)
3. ✅ Start frontend server (port 3000)
4. ✅ Open browser automatically

### To Stop:

**Double-click**: `STOP_SYSTEM.bat`

---

## 🔧 Manual Start (Alternative Method)

### Step 1: Start Backend

Open Terminal 1:
```bash
cd server
npm run dev
```

Expected output:
```
Server is running on port 5000
Environment: development
MongoDB Connected: 127.0.0.1
```

### Step 2: Start Frontend

Open Terminal 2:
```bash
npm run dev
```

Expected output:
```
VITE v6.3.6  ready in XXX ms
➜  Local:   http://localhost:3000/
```

### Step 3: Open Browser

Go to: **http://localhost:3000**

---

## 🔐 Login Credentials

### Admin Account:
- **Email**: `admin@hrms.com`
- **Password**: `password123`
- **Verification Code**: `123456` (demo mode)

### Other Demo Accounts:
- `hr@hrms.com` / `password123`
- `manager@hrms.com` / `password123`
- `employee@hrms.com` / `password123`

---

## 📊 System URLs

| Service | URL | Status |
|---------|-----|--------|
| Frontend | http://localhost:3000 | Main Application |
| Backend API | http://localhost:5000 | REST API |
| API Health | http://localhost:5000/api/health | Health Check |
| MongoDB | mongodb://127.0.0.1:27017 | Database |

---

## 🧪 Verify Installation

### Test 1: Backend Health Check
```bash
curl http://localhost:5000/api/health
```

Expected: `{"status":"ok","message":"HR Management API is running"}`

### Test 2: Database Connection
```bash
node check-db.js
```

Expected: Shows departments in database

### Test 3: Complete System Test
```bash
node test-all-operations-final.js
```

Expected: All tests pass ✅

---

## 🎯 First Time Login

### Step 1: Open Application
- URL: http://localhost:3000
- You'll see the login page

### Step 2: Enter Credentials
- Email: `admin@hrms.com`
- Password: `password123`
- Click "Sign In"

### Step 3: Email Verification
- You'll see email verification page
- **NEW**: Checkbox "Reset MFA Setup"
  - Check it if you want a new QR code
  - Leave unchecked for normal login
- Enter code: `123456`
- Click "Verify Code"

### Step 4: MFA Setup (First Time Only)
- Scan QR code with authenticator app (Google Authenticator, Authy, etc.)
- Enter 6-digit code from app
- Save backup codes

### Step 5: Dashboard
- ✅ You're in!
- Explore all features

---

## 📁 Project Structure

```
HR_app-main/
├── server/                 # Backend (Node.js + Express)
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── middleware/        # Auth middleware
│   ├── utils/             # Utilities
│   ├── .env               # Environment variables
│   └── server.js          # Entry point
│
├── src/                   # Frontend (React + TypeScript)
│   ├── components/        # React components
│   ├── services/          # API services
│   ├── hooks/             # Custom hooks
│   └── types.ts           # TypeScript types
│
├── START_SYSTEM.bat       # Quick start script
├── STOP_SYSTEM.bat        # Quick stop script
└── package.json           # Frontend dependencies
```

---

## 🔧 Configuration

### Backend Configuration (server/.env)

```env
# Server
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:3000

# Database
MONGODB_URI=mongodb://127.0.0.1:27017/hr_management_system

# Authentication
JWT_SECRET=your_jwt_secret_key_change_in_production
JWT_EXPIRE=7d

# Email (Optional - Demo mode works without this)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
SMTP_FROM=noreply@hrms.com
ENABLE_REAL_EMAIL=false
```

### Frontend Configuration (.env)

```env
VITE_API_URL=http://localhost:5000/api
```

---

## 🐛 Troubleshooting

### Issue: "MongoDB not running"

**Solution**:
```bash
# Start MongoDB service
net start MongoDB

# Or manually
mongod --dbpath "C:\data\db"
```

### Issue: "Port 3000 already in use"

**Solution**: Frontend will automatically use port 3001
- Access at: http://localhost:3001

### Issue: "Cannot connect to backend"

**Solution**:
1. Check backend is running: http://localhost:5000/api/health
2. Restart backend: `cd server && npm run dev`
3. Check MongoDB is running

### Issue: "Login failed"

**Solution**:
1. Verify backend is running
2. Check browser console (F12)
3. Use correct credentials: admin@hrms.com / password123
4. Use verification code: 123456

### Issue: "Module not found"

**Solution**:
```bash
# Reinstall dependencies
cd server
npm install
cd ..
npm install
```

---

## 🔄 Daily Usage

### Starting the System:

**Easy Way**: Double-click `START_SYSTEM.bat`

**Manual Way**:
1. Start MongoDB: `net start MongoDB`
2. Start Backend: `cd server && npm run dev`
3. Start Frontend: `npm run dev`
4. Open: http://localhost:3000

### Stopping the System:

**Easy Way**: Double-click `STOP_SYSTEM.bat`

**Manual Way**: Press `Ctrl+C` in both terminal windows

---

## 📚 Available Scripts

### Backend Scripts:
```bash
cd server
npm run dev          # Start development server
npm start            # Start production server
node check-db.js     # Check database connection
```

### Frontend Scripts:
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
```

### Test Scripts:
```bash
node test-all-operations-final.js    # Test all CRUD operations
node test-update-delete.js           # Test update/delete
node test-mfa-reset.js               # Test MFA reset
node check-db.js                     # Check database
```

---

## 🎯 Features Available

### ✅ Authentication & Security:
- Login with email/password
- Multi-Factor Authentication (MFA)
- Email verification (demo mode)
- MFA reset functionality
- JWT token authentication

### ✅ CRUD Operations:
- **Departments**: Create, Read, Update, Delete
- **Employees**: Create, Read, Update, Delete
- **Leaves**: Create, Read, Update, Delete
- **Attendance**: Read, Track, Calendar view

### ✅ Dashboard:
- Real-time statistics
- Employee overview
- Department distribution
- Leave requests
- Attendance calendar

### ✅ Profile Management:
- Update personal information
- Change password
- Security & MFA settings
- Reset MFA setup

---

## 📖 Documentation

- **QUICK_START.md** - Quick start guide
- **LOGIN_FIX_GUIDE.md** - Login troubleshooting
- **MFA_RESET_AND_DATA_SYNC_FIX.md** - MFA reset guide
- **EMAIL_AND_MFA_SETUP_GUIDE.md** - Email setup
- **FINAL_SUMMARY.md** - Complete system overview

---

## 🎉 You're Ready!

### Quick Checklist:
- ✅ Node.js installed
- ✅ MongoDB installed and running
- ✅ Dependencies installed (`npm install`)
- ✅ Backend running (port 5000)
- ✅ Frontend running (port 3000)
- ✅ Browser open at http://localhost:3000

### Login and Explore:
1. Email: admin@hrms.com
2. Password: password123
3. Code: 123456
4. Enjoy! 🚀

---

**Need Help?** Check the troubleshooting section or documentation files.

**Everything Working?** Start exploring the features!
