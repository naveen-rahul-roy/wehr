# 🚀 HR Management System - Complete Guide

## 📋 Quick Reference

### Login Credentials
| Role | Email | Password | MFA Code (Dev) |
|------|-------|----------|----------------|
| Admin | admin@hrms.com | admin123 | 123456 |
| HR | hr@hrms.com | admin123 | 123456 |
| Manager | manager@hrms.com | admin123 | 123456 |
| Employee | employee@hrms.com | admin123 | 123456 |

### URLs
- **Local Frontend**: http://localhost:5173
- **Local Backend**: http://localhost:5000
- **Production Frontend**: https://hr-sigma-two.vercel.app
- **Production Backend**: https://hr-backend-osmz.onrender.com

---

## 🚀 Quick Start

### Start Application
```bash
# Start both frontend and backend
npm run dev:fullstack

# OR start separately:
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend
npm run dev
```

### First Time Setup
1. Ensure MongoDB is running
2. Install dependencies: `npm run install:all`
3. Start the application
4. Login with admin credentials
5. Use MFA code `123456` for development

---

## 🔐 Security Features

### Multi-Factor Authentication (MFA)
- **Status**: Enabled for all users
- **Development Bypass**: Use code `123456`
- **Production**: Requires authenticator app (Google Authenticator, Microsoft Authenticator, Authy)

### Manage MFA
```bash
# Enable MFA for all users
cd server
node scripts/enable-mfa-for-all.js

# Disable MFA (for testing)
cd server
node scripts/fix-all-login-issues.js
```

---

## 🔔 Notification System

### Features
- Real-time badge showing unread count
- Dropdown in topbar for quick view
- Full notifications page with filters
- Auto-refresh every 5 seconds
- Mark as read / Delete functionality

### Test Notifications
```bash
cd server
node scripts/test-notifications.js
```

### Cleanup Old Notifications
```bash
cd server
node scripts/cleanup-old-notifications.js
```

---

## 🛠️ Maintenance Scripts

### Test Login System
```bash
cd server
node scripts/test-login.js
```
Shows all users and tests password authentication.

### Enable MFA
```bash
cd server
node scripts/enable-mfa-for-all.js
```
Enables MFA for all users with generated secrets.

### Disable MFA
```bash
cd server
node scripts/fix-all-login-issues.js
```
Disables MFA, resets login attempts, unlocks accounts.

### Test Notifications
```bash
cd server
node scripts/test-notifications.js
```
Creates test notifications for all users.

### Cleanup Notifications
```bash
cd server
node scripts/cleanup-old-notifications.js
```
Removes old read notifications (30+ days) and very old notifications (90+ days).

---

## 📚 Documentation

### Essential Guides
- **README.md** - Project overview and setup
- **START_HERE.md** - Entry point for new companies
- **QUICK_START_GUIDE.md** - Quick reference
- **SYSTEM_GUIDE.md** - This file

### Feature Guides
- **MFA_ENABLED_GUIDE.md** - MFA setup and usage
- **NOTIFICATION_SYSTEM_GUIDE.md** - Notification system details

### Deployment
- **DEPLOYMENT_GUIDE_FOR_NEW_COMPANY.md** - Complete deployment guide
- **TROUBLESHOOTING.md** - Common issues and solutions

### Technical Documentation
- **docs/ARCHITECTURE.md** - System architecture
- **docs/API_REFERENCE.md** - API endpoints
- **docs/DATABASE_SCHEMA.md** - Database structure
- **docs/DEPLOYMENT_GUIDE.md** - General deployment info
- **docs/PROFILE_SETTINGS_GUIDE.md** - Profile settings

---

## 🔧 Configuration Files

### Frontend
- `.env` - Local development API URL
- `.env.production` - Production API URL
- `vercel.json` - Vercel deployment config

### Backend
- `server/.env` - Local development config
- `server/.env.production` - Production config
- `server/.env.example` - Example configuration
- `render.yaml` - Render deployment config

---

## ✅ System Status

### Features Working
- ✅ User Authentication (JWT + MFA)
- ✅ Employee Management
- ✅ Department Management
- ✅ Attendance Tracking (Auto clock-in)
- ✅ Leave Management
- ✅ Payroll Processing
- ✅ Task Management
- ✅ Notifications (Badge, Dropdown, Page)
- ✅ Reports & Analytics
- ✅ Profile Settings

### Security
- ✅ MFA enabled for all users
- ✅ Password hashing (bcrypt)
- ✅ JWT token authentication
- ✅ Account lockout (5 failed attempts)
- ✅ CORS protection
- ✅ Role-based access control

---

## 🐛 Troubleshooting

### Can't Login?
1. Use MFA code `123456` in development
2. Check MongoDB is running
3. Verify backend is running on port 5000
4. Check browser console for errors

### Backend Won't Start?
```bash
# Check MongoDB
net start MongoDB  # Windows

# Check port 5000
netstat -ano | findstr :5000
```

### Frontend Can't Connect?
1. Check `.env` has correct API URL
2. Restart frontend after changing .env
3. Verify backend is running
4. Check CORS settings in `server/server.js`

### Notifications Not Showing?
1. Check you're logged in
2. Run test script: `node scripts/test-notifications.js`
3. Check browser console for errors
4. Verify auto-refresh is working

---

## 📞 Support

For detailed help, see:
- **TROUBLESHOOTING.md** - Common issues
- **MFA_ENABLED_GUIDE.md** - MFA help
- **NOTIFICATION_SYSTEM_GUIDE.md** - Notification help
- **DEPLOYMENT_GUIDE_FOR_NEW_COMPANY.md** - Deployment help

---

## 🎯 Next Steps

1. **Start the application**: `npm run dev:fullstack`
2. **Login**: admin@hrms.com / admin123 / MFA: 123456
3. **Explore features**: Dashboard, Employees, Attendance, Leaves, etc.
4. **Test notifications**: Click bell icon in top right
5. **Configure for your company**: See DEPLOYMENT_GUIDE_FOR_NEW_COMPANY.md

---

**System is ready to use! 🎉**
