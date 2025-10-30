# 📧 Email Verification & MFA Reset Guide

## ✅ New Features Added

### 1. **Email Configuration Control**
- Toggle between Demo Mode (123456) and Real Email sending
- Easy configuration via environment variable

### 2. **MFA Reset Functionality**
- Reset MFA setup from Profile page
- Generate new QR code on next login
- Secure with confirmation dialog

---

## 📧 Email Verification Setup

### Demo Mode (Default - Current Setup)

**Status**: ✅ Active  
**Verification Code**: **123456** (works for all users)  
**Configuration**: `ENABLE_REAL_EMAIL=false` in `server/.env`

**How it works**:
1. User logs in
2. Clicks "Send Verification Code"
3. Purple box shows: "Use code: 123456"
4. User enters 123456
5. Access granted ✅

**Perfect for**:
- Development and testing
- Demo presentations
- When email server isn't configured

---

### Real Email Mode (For Production)

**Status**: ⚠️ Not configured (requires SMTP setup)  
**Configuration**: Set `ENABLE_REAL_EMAIL=true` in `server/.env`

#### Step 1: Get Gmail App Password

1. **Enable 2-Factor Authentication**:
   - Go to https://myaccount.google.com/security
   - Enable 2-Step Verification

2. **Generate App Password**:
   - Go to https://myaccount.google.com/apppasswords
   - Select "Mail" and "Other (Custom name)"
   - Name it "HR Management System"
   - Copy the 16-character password

#### Step 2: Configure Environment

Edit `server/.env`:

```env
# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your.email@gmail.com          # Your Gmail address
SMTP_PASS=xxxx xxxx xxxx xxxx           # 16-char app password
SMTP_FROM=noreply@hrms.com

# Enable real email sending
ENABLE_REAL_EMAIL=true                   # Change to true
```

#### Step 3: Restart Backend

```bash
# Stop the backend (Ctrl+C in terminal)
cd server
npm run dev
```

#### Step 4: Test Real Email

1. Login at http://localhost:3000
2. Click "Send Verification Code"
3. Check your email inbox
4. Enter the 6-digit code from email
5. Access granted ✅

---

## 🔐 MFA Reset Feature

### How to Reset MFA Setup

#### From Profile Page:

1. **Login** to the application
2. Click **"Profile"** in the sidebar
3. Click **"Security & MFA"** tab
4. Click **"Reset MFA Setup"** button
5. Confirm the action
6. ✅ MFA reset successfully

#### What Happens:

```
Before Reset:
- isMfaSetup: true
- mfaSecret: "JBSWY3DPEHPK3PXP"
- User sees MFA verification page

After Reset:
- isMfaSetup: false
- mfaSecret: null
- User sees MFA setup page (new QR code)
```

#### Next Login After Reset:

1. Enter email/password
2. See **MFA Setup Page** (not verification)
3. Scan **NEW QR code** with authenticator app
4. Enter code from app
5. MFA re-enabled with new secret ✅

---

## 🧪 Testing Both Modes

### Test Demo Mode (123456):

```bash
# Ensure demo mode is enabled
# In server/.env:
ENABLE_REAL_EMAIL=false

# Restart backend
cd server
npm run dev

# Test login
# Use code: 123456
```

### Test Real Email Mode:

```bash
# Configure Gmail credentials in server/.env
SMTP_USER=your.email@gmail.com
SMTP_PASS=your_app_password
ENABLE_REAL_EMAIL=true

# Restart backend
cd server
npm run dev

# Test login
# Check email for real code
```

---

## 🎯 Use Cases

### Demo Mode (123456):
- ✅ Development and testing
- ✅ Demo presentations
- ✅ Quick testing without email setup
- ✅ Offline development
- ✅ Team testing without email access

### Real Email Mode:
- ✅ Production deployment
- ✅ User acceptance testing
- ✅ Security audits
- ✅ Real-world scenarios
- ✅ Client demonstrations

---

## 🔧 API Endpoints

### Reset MFA:
```
POST /api/auth/mfa/reset
Authorization: Bearer <token>

Response:
{
  "message": "MFA has been reset...",
  "user": {
    "id": "...",
    "isMfaSetup": false
  }
}
```

### Email Verification Request:
```
POST /api/auth/mfa/email-verification-request
Body: { "email": "user@example.com" }

Response:
{
  "message": "Verification code sent to your email."
}
```

### Verify Email Code:
```
POST /api/auth/mfa/verify-email-code
Body: {
  "email": "user@example.com",
  "verificationCode": "123456"
}

Response:
{
  "token": "jwt_token...",
  "user": { ... },
  "message": "Email verification successful..."
}
```

---

## 📊 Configuration Summary

### Current Setup:
```
✅ Demo Mode: Active (123456)
✅ MFA Reset: Available in Profile
✅ Email Service: Configured for demo
⚠️ Real Email: Not configured (optional)
```

### Environment Variables:
```env
# server/.env

# Demo Mode (Current)
ENABLE_REAL_EMAIL=false

# Real Email Mode (Optional)
ENABLE_REAL_EMAIL=true
SMTP_USER=your.email@gmail.com
SMTP_PASS=your_app_password
```

---

## 🎉 Features Summary

### ✅ What's Working:

1. **Demo Mode Email Verification**
   - Code: 123456
   - No email setup required
   - Perfect for testing

2. **Real Email Support**
   - Configure SMTP credentials
   - Send real verification codes
   - Production-ready

3. **MFA Reset**
   - Reset from Profile page
   - Generate new QR code
   - Secure confirmation

4. **Flexible Configuration**
   - Toggle between demo/real email
   - Environment variable control
   - Easy to switch modes

---

## 🚀 Quick Start

### For Development (Demo Mode):
```bash
# Already configured!
# Just use code: 123456
# No changes needed
```

### For Production (Real Email):
```bash
# 1. Get Gmail app password
# 2. Edit server/.env:
SMTP_USER=your.email@gmail.com
SMTP_PASS=your_app_password
ENABLE_REAL_EMAIL=true

# 3. Restart backend
cd server
npm run dev

# 4. Test with real emails!
```

---

## 📝 Notes

- **Demo code (123456)** works in both modes if email sending fails
- **MFA reset** requires user to be logged in
- **Email verification** is alternative to TOTP authenticator
- **Real emails** require valid SMTP configuration
- **Security**: Demo bypass only works in development mode

---

**Status**: ✅ All features implemented and working  
**Demo Mode**: ✅ Active (code: 123456)  
**Real Email**: ⚠️ Ready to configure  
**MFA Reset**: ✅ Available in Profile → Security & MFA

🎉 **Everything is ready to use!**
