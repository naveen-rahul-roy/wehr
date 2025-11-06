# 📚 Documentation Index

Complete guide to all documentation files in the HR Management System.

---

## 🚀 Getting Started (Start Here!)

### **START_HERE.md**
Main entry point for all users. Directs you to the right documentation based on your needs.

### **SYSTEM_GUIDE.md** ⭐ NEW
Quick reference guide with:
- Login credentials
- Quick start commands
- Maintenance scripts
- Common troubleshooting
- All essential information in one place

### **QUICK_START_GUIDE.md**
Fast reference for:
- Starting the application
- Login credentials
- URLs
- MFA management

### **README.md**
Complete project documentation:
- Features overview
- Tech stack
- Local setup
- Project structure
- Build commands

---

## 🔐 Security & Authentication

### **MFA_ENABLED_GUIDE.md**
Complete MFA guide:
- How to login with MFA
- Setup process
- Development bypass (code: 123456)
- Alternative login methods
- Troubleshooting MFA issues

---

## 🔔 Features

### **NOTIFICATION_SYSTEM_GUIDE.md**
Notification system documentation:
- How notifications work
- Badge, dropdown, and page features
- API endpoints
- Testing notifications
- Maintenance scripts

---

## 🚀 Deployment

### **DEPLOYMENT_GUIDE_FOR_NEW_COMPANY.md**
Complete deployment guide for new companies:
- What to change (3 files)
- MongoDB setup
- Render backend deployment
- Vercel frontend deployment
- Testing and verification

### **TROUBLESHOOTING.md**
Common issues and solutions:
- Backend issues
- Frontend issues
- Database issues
- CORS errors
- Performance issues
- Debugging tools

---

## 📖 Technical Documentation

### **docs/ARCHITECTURE.md**
System architecture:
- Component overview
- Data flow
- Technology stack
- Design patterns

### **docs/API_REFERENCE.md**
API documentation:
- All endpoints
- Request/response formats
- Authentication
- Error handling

### **docs/DATABASE_SCHEMA.md**
Database structure:
- Collections
- Schemas
- Relationships
- Indexes

### **docs/DEPLOYMENT_GUIDE.md**
General deployment information:
- Deployment options
- Environment variables
- Production considerations

### **docs/PROFILE_SETTINGS_GUIDE.md**
Profile settings documentation:
- User profile features
- Settings options
- Password management

---

## 🔧 Configuration Files

### Frontend
- `.env` - Local development
- `.env.production` - Production
- `vercel.json` - Vercel config

### Backend
- `server/.env` - Local development
- `server/.env.production` - Production
- `server/.env.example` - Example template
- `render.yaml` - Render deployment

---

## 🛠️ Maintenance Scripts

Located in `server/scripts/`:

### **test-login.js**
Test login system and view all users with their credentials.

### **enable-mfa-for-all.js**
Enable MFA for all users with generated secrets.

### **fix-all-login-issues.js**
Disable MFA, reset login attempts, unlock accounts.

### **test-notifications.js**
Create test notifications for all users.

### **cleanup-old-notifications.js**
Remove old read notifications (30+ days) and very old (90+ days).

---

## 📋 Documentation Structure

```
Root Documentation:
├── START_HERE.md                          ← Start here!
├── SYSTEM_GUIDE.md                        ← Quick reference (NEW)
├── QUICK_START_GUIDE.md                   ← Fast reference
├── README.md                              ← Full project docs
├── MFA_ENABLED_GUIDE.md                   ← MFA guide
├── NOTIFICATION_SYSTEM_GUIDE.md           ← Notifications
├── DEPLOYMENT_GUIDE_FOR_NEW_COMPANY.md    ← Deployment
├── TROUBLESHOOTING.md                     ← Problem solving
└── DOCUMENTATION_INDEX.md                 ← This file

Technical Documentation (docs/):
├── ARCHITECTURE.md                        ← System design
├── API_REFERENCE.md                       ← API docs
├── DATABASE_SCHEMA.md                     ← Database
├── DEPLOYMENT_GUIDE.md                    ← General deployment
└── PROFILE_SETTINGS_GUIDE.md              ← Profile settings

Configuration:
├── .env                                   ← Frontend local
├── .env.production                        ← Frontend production
├── vercel.json                            ← Vercel config
├── render.yaml                            ← Render config
├── server/.env                            ← Backend local
├── server/.env.production                 ← Backend production
└── server/.env.example                    ← Example template

Maintenance Scripts (server/scripts/):
├── test-login.js                          ← Test login
├── enable-mfa-for-all.js                  ← Enable MFA
├── fix-all-login-issues.js                ← Disable MFA
├── test-notifications.js                  ← Test notifications
└── cleanup-old-notifications.js           ← Cleanup notifications
```

---

## 🎯 Quick Navigation

### I want to...

**Start using the system**
→ Read **SYSTEM_GUIDE.md**

**Deploy for my company**
→ Read **DEPLOYMENT_GUIDE_FOR_NEW_COMPANY.md**

**Understand MFA**
→ Read **MFA_ENABLED_GUIDE.md**

**Learn about notifications**
→ Read **NOTIFICATION_SYSTEM_GUIDE.md**

**Fix an issue**
→ Read **TROUBLESHOOTING.md**

**Understand the architecture**
→ Read **docs/ARCHITECTURE.md**

**See API endpoints**
→ Read **docs/API_REFERENCE.md**

**Understand the database**
→ Read **docs/DATABASE_SCHEMA.md**

---

## 📊 Documentation Stats

- **Total Documentation Files**: 13
- **Getting Started Guides**: 4
- **Feature Guides**: 2
- **Technical Docs**: 5
- **Configuration Files**: 7
- **Maintenance Scripts**: 5

---

## ✅ Documentation Quality

All documentation includes:
- ✅ Clear structure
- ✅ Step-by-step instructions
- ✅ Code examples
- ✅ Troubleshooting sections
- ✅ Quick reference tables
- ✅ Visual indicators (✅ ❌ ⚠️)

---

## 🔄 Keeping Documentation Updated

When making changes:
1. Update relevant documentation files
2. Update this index if adding/removing docs
3. Keep examples and screenshots current
4. Test all commands and scripts
5. Update version numbers if applicable

---

**Need help finding something? Start with START_HERE.md or SYSTEM_GUIDE.md!**
