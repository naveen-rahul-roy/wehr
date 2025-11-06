# 🚀 Quick Start Guide

## ⚡ Fastest Way to Start

### Windows Users
Double-click `START_APP.bat` - This will:
- Start MongoDB
- Start Backend Server
- Start Frontend
- Open both in separate windows

### Manual Start
```bash
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend  
npm run dev
```

---

## 🔐 Login Credentials

| Role | Email | Password | MFA Code (Dev) |
|------|-------|----------|----------------|
| Admin | admin@hrms.com | admin123 | 123456 |
| HR | hr@hrms.com | admin123 | 123456 |
| Manager | manager@hrms.com | admin123 | 123456 |
| Employee | employee@hrms.com | admin123 | 123456 |

**Note**: MFA is now enabled. Use code `123456` for development testing.

---

## 🌐 URLs

### Local Development
- Frontend: http://localhost:5173
- Backend: http://localhost:5000
- API Health: http://localhost:5000/api/health

### Production
- Frontend: https://hr-sigma-two.vercel.app
- Backend: https://hr-backend-osmz.onrender.com/api

---

## ✅ What's Been Configured

1. ✅ **API URL** - Fixed frontend to backend connection
2. ✅ **CORS** - Added Vercel URL to allowed origins
3. ✅ **MFA** - Enabled for all users (use code `123456` in dev)
4. ✅ **Account Locks** - Removed all locks and reset attempts
5. ✅ **Login Flow** - MFA required for enhanced security

---

## 🔧 MFA Management

**Enable MFA for all users:**
```bash
cd server
node scripts/enable-mfa-for-all.js
```

**Disable MFA for easier testing:**
```bash
cd server
node scripts/fix-all-login-issues.js
```

**Development Bypass**: Use code `123456` to skip authenticator app

---

## 📚 Documentation

- **MFA_ENABLED_GUIDE.md** - MFA setup and usage guide
- **LOGIN_FIX_COMPLETE.md** - Detailed fix information
- **TROUBLESHOOTING.md** - Common issues and solutions
- **README.md** - Full project documentation
- **DEPLOYMENT_GUIDE_FOR_NEW_COMPANY.md** - Deployment guide

---

## 🎯 Next Steps

1. Start the application
2. Login with admin credentials
3. Explore the features:
   - Dashboard
   - Employee Management
   - Attendance Tracking
   - Leave Management
   - Payroll
   - Reports

---

**Need help? Check LOGIN_FIX_COMPLETE.md for detailed instructions!**
