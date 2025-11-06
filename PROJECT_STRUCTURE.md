# 📁 Project Structure Guide

## Overview

This is a **monorepo** structure with frontend and backend in the same repository but clearly separated.

---

## 🎨 Frontend (Root Directory)

**Location**: Root directory  
**Framework**: React 19.2.0 + TypeScript + Vite  
**Deploy to**: Vercel

### Frontend Files & Folders

```
/ (root)
├── components/              ← React components
│   ├── common/             ← Reusable components (Button, Card, Input, etc.)
│   ├── dashboard/          ← Dashboard-specific components
│   ├── layout/             ← Layout components (Sidebar, Topbar)
│   ├── leave/              ← Leave management components
│   ├── mfa/                ← MFA/authentication components
│   └── pages/              ← Page components
│
├── services/               ← API service layer
│   ├── api.ts             ← Axios instance & interceptors
│   ├── authService.ts     ← Authentication API calls
│   └── notificationService.ts ← Notification API calls
│
├── utils/                  ← Utility functions
│   ├── dateUtils.ts       ← Date formatting utilities
│   └── timeAgo.ts         ← Time ago display
│
├── types/                  ← TypeScript type definitions
│   └── index.ts           ← All type definitions
│
├── hooks/                  ← Custom React hooks
│   └── useToast.ts        ← Toast notification hook
│
├── App.tsx                 ← Main application component
├── main.tsx                ← Application entry point
├── index.html              ← HTML template
│
├── package.json            ← Frontend dependencies
├── vite.config.ts          ← Vite build configuration
├── tsconfig.json           ← TypeScript configuration
├── tailwind.config.js      ← Tailwind CSS configuration
│
├── .env                    ← Local development config
├── .env.production         ← Production config
└── vercel.json             ← Vercel deployment config
```

### Frontend Environment Variables

**File**: `.env` (local) or `.env.production` (production)

```env
VITE_API_URL=http://localhost:5000/api  # Local
# OR
VITE_API_URL=https://your-backend.onrender.com/api  # Production
```

### Frontend Deployment (Vercel)

**Build Command**: `npm run build`  
**Output Directory**: `dist`  
**Install Command**: `npm install`

---

## 🖥️ Backend (server/ Directory)

**Location**: `server/` directory  
**Framework**: Node.js + Express  
**Deploy to**: Render

### Backend Files & Folders

```
server/
├── config/                 ← Configuration files
│   └── database.js        ← MongoDB connection
│
├── models/                 ← Mongoose models (Database schemas)
│   ├── User.js            ← User model
│   ├── Employee.js        ← Employee model
│   ├── Department.js      ← Department model
│   ├── Attendance.js      ← Attendance model
│   ├── Leave.js           ← Leave model
│   ├── Payroll.js         ← Payroll model
│   ├── Task.js            ← Task model
│   └── Notification.js    ← Notification model
│
├── routes/                 ← API route handlers
│   ├── auth.js            ← Authentication routes
│   ├── users.js           ← User management routes
│   ├── employees.js       ← Employee routes
│   ├── departments.js     ← Department routes
│   ├── attendance.js      ← Attendance routes
│   ├── leaves.js          ← Leave management routes
│   ├── payroll.js         ← Payroll routes
│   ├── tasks.js           ← Task routes
│   ├── notifications.js   ← Notification routes
│   └── reports.js         ← Reports routes
│
├── middleware/             ← Express middleware
│   └── auth.js            ← JWT authentication middleware
│
├── utils/                  ← Utility functions
│   ├── generateToken.js   ← JWT token generation
│   └── emailService.js    ← Email sending utilities
│
├── jobs/                   ← Scheduled jobs
│   └── dailyAttendanceJob.js ← Daily attendance automation
│
├── scripts/                ← Maintenance scripts
│   ├── test-login.js      ← Test login system
│   ├── enable-mfa-for-all.js ← Enable MFA
│   ├── fix-all-login-issues.js ← Disable MFA
│   ├── test-notifications.js ← Test notifications
│   └── cleanup-old-notifications.js ← Cleanup
│
├── server.js               ← Main server entry point
├── package.json            ← Backend dependencies
│
├── .env                    ← Local development config
├── .env.production         ← Production config template
└── .env.example            ← Example configuration
```

### Backend Environment Variables

**File**: `server/.env` (local) or set in Render dashboard (production)

```env
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:5173

MONGODB_URI=mongodb://127.0.0.1:27017/hr_management_system
JWT_SECRET=your-secret-key
JWT_EXPIRE=7d

MFA_ISSUER=HR Management System
```

### Backend Deployment (Render)

**Build Command**: `cd server && npm install`  
**Start Command**: `cd server && npm start`  
**Root Directory**: `server/`

---

## 📚 Documentation (docs/ Directory)

```
docs/
├── ARCHITECTURE.md         ← System architecture
├── API_REFERENCE.md        ← API documentation
├── DATABASE_SCHEMA.md      ← Database structure
├── DEPLOYMENT_GUIDE.md     ← General deployment
└── PROFILE_SETTINGS_GUIDE.md ← Profile settings
```

---

## 📄 Root Level Documentation

```
/ (root)
├── START_HERE.md                      ← Entry point
├── SYSTEM_GUIDE.md                    ← Quick reference
├── QUICK_START_GUIDE.md               ← Fast reference
├── README.md                          ← Full documentation
├── MFA_ENABLED_GUIDE.md               ← MFA guide
├── NOTIFICATION_SYSTEM_GUIDE.md       ← Notifications
├── DEPLOYMENT_GUIDE_FOR_NEW_COMPANY.md ← Deployment
├── TROUBLESHOOTING.md                 ← Problem solving
├── DOCUMENTATION_INDEX.md             ← Doc index
└── PROJECT_STRUCTURE.md               ← This file
```

---

## 🚀 Deployment Configuration Files

### Vercel (Frontend)

**File**: `vercel.json`
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### Render (Backend)

**File**: `render.yaml`
```yaml
services:
  - type: web
    name: your-backend-name
    env: node
    buildCommand: cd server && npm install
    startCommand: cd server && npm start
```

---

## 🔄 How Frontend & Backend Connect

### Development (Local)

```
Frontend (localhost:5173)
    ↓ API calls to
Backend (localhost:5000)
    ↓ Queries
MongoDB (localhost:27017)
```

**Frontend config** (`.env`):
```env
VITE_API_URL=http://localhost:5000/api
```

**Backend config** (`server/.env`):
```env
FRONTEND_URL=http://localhost:5173
MONGODB_URI=mongodb://127.0.0.1:27017/hr_management_system
```

### Production (Deployed)

```
Frontend (Vercel: hr-sigma-two.vercel.app)
    ↓ API calls to
Backend (Render: app-hr.onrender.com)
    ↓ Queries
MongoDB Atlas (cloud.mongodb.com)
```

**Frontend config** (Vercel env vars):
```env
VITE_API_URL=https://app-hr.onrender.com/api
```

**Backend config** (Render env vars):
```env
FRONTEND_URL=https://hr-sigma-two.vercel.app
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/db
```

---

## 📦 Package Management

### Frontend Dependencies

**File**: `package.json` (root)

```json
{
  "dependencies": {
    "react": "^19.2.0",
    "react-dom": "^19.2.0",
    "axios": "^1.6.2"
  },
  "devDependencies": {
    "vite": "^6.2.0",
    "typescript": "~5.8.2"
  }
}
```

**Install**: `npm install` (in root directory)

### Backend Dependencies

**File**: `server/package.json`

```json
{
  "dependencies": {
    "express": "^4.18.2",
    "mongoose": "^8.0.0",
    "jsonwebtoken": "^9.0.2",
    "bcryptjs": "^2.4.3"
  }
}
```

**Install**: `cd server && npm install`

---

## 🎯 Quick Commands

### Install All Dependencies
```bash
npm run install:all
```
This installs both frontend and backend dependencies.

### Start Development
```bash
# Both frontend & backend
npm run dev:fullstack

# OR separately:
npm run dev          # Frontend only
npm run server:dev   # Backend only
```

### Build for Production
```bash
# Frontend
npm run build

# Backend (no build needed, runs directly)
cd server && npm start
```

---

## 📊 Project Statistics

- **Frontend Files**: ~100+ React components
- **Backend Files**: ~50+ route handlers, models, utilities
- **Total Lines of Code**: ~15,000+
- **Dependencies**: 
  - Frontend: ~20 packages
  - Backend: ~25 packages

---

## ✅ Why This Structure?

### Advantages

1. **Clear Separation**: Frontend and backend are clearly separated
2. **Independent Deployment**: Deploy frontend and backend separately
3. **Shared Repository**: Easy to manage in one repo
4. **Standard Pattern**: Common in modern web development
5. **Easy to Understand**: Clear folder names and organization

### Common Alternative (Not Recommended for This Project)

```
project/
├── frontend/    ← All frontend files
└── backend/     ← All backend files
```

**Why we don't use this**:
- Would require moving 100+ files
- Would break all import paths
- Would require updating all configurations
- Current structure is already clear and working

---

## 🔍 Finding Files

### Frontend Files
- **Components**: Look in `components/`
- **API Calls**: Look in `services/`
- **Types**: Look in `types/`
- **Config**: Root directory (`.env`, `vite.config.ts`)

### Backend Files
- **API Routes**: Look in `server/routes/`
- **Database Models**: Look in `server/models/`
- **Config**: `server/` directory (`.env`, `server.js`)
- **Scripts**: Look in `server/scripts/`

---

## 📝 For New Developers

When you clone this project:

1. **Frontend is in root** - All React components, services, utils
2. **Backend is in server/** - All Express routes, models, config
3. **Documentation is in docs/** - Technical documentation
4. **Guides are in root** - User-facing documentation

**This is intentional and follows monorepo best practices!**

---

## 🎉 Summary

- ✅ **Frontend**: Root directory (React + Vite)
- ✅ **Backend**: `server/` directory (Node.js + Express)
- ✅ **Clear separation** for deployment
- ✅ **Easy to understand** folder structure
- ✅ **Standard monorepo** pattern

**No restructuring needed - the current structure is optimal for deployment!**
