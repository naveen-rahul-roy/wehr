# Quick Login Guide 🚀

## ✅ Login is Working!

The backend server is running and login is functional.

## How to Login

### Step 1: Start the System

**Option A - Use the Batch File (Easiest)**
```
Double-click: START_BOTH.bat
```

**Option B - Manual Start**
```bash
# Terminal 1 - Backend (Already Running)
cd server
npm start

# Terminal 2 - Frontend
npm run dev
```

### Step 2: Open Browser
Navigate to: **http://localhost:5173**

### Step 3: Login
```
Email: admin@hrms.com
Password: password123
```

### Step 4: MFA Verification
When prompted for MFA code, enter: **123456**

### Step 5: You're In! 🎉

## Test Accounts

| Role     | Email                | Password     | MFA Code |
|----------|---------------------|--------------|----------|
| Admin    | admin@hrms.com      | password123  | 123456   |
| HR       | hr@hrms.com         | password123  | 123456   |
| Manager  | manager@hrms.com    | password123  | 123456   |
| Employee | employee@hrms.com   | password123  | 123456   |

## Why MFA Code is Needed

The system has Multi-Factor Authentication (MFA) enabled for security. In demo mode, the code is always **123456**.

## If You Want to Skip MFA

Run this command to reset MFA for any account:
```bash
node server/unlock-user.js admin@hrms.com
```

Then login again and you'll be prompted to set up MFA fresh (or skip it).

## Troubleshooting

### "Cannot connect to server"
- Make sure backend is running: `cd server && npm start`
- Check if port 5000 is in use

### "Invalid credentials"
- Use the exact credentials above
- Email is case-insensitive
- Password is case-sensitive

### "Account locked"
```bash
node server/unlock-user.js admin@hrms.com
```

## Current Status

✅ Backend Server: **RUNNING** on port 5000
✅ MongoDB: **CONNECTED**
✅ Login API: **WORKING**
✅ MFA: **ENABLED** (Demo code: 123456)

## Quick Test

Run this to verify login is working:
```bash
node test-login-quick.js
```

Expected output:
```
✅ Login successful!
User: Alex Admin (admin@hrms.com)
```

---

**Everything is working! Just start the frontend and login.** 🎉
