# 🔐 MFA Enabled - Login Guide

MFA (Multi-Factor Authentication) is now **ENABLED** for all users for enhanced security.

---

## 🔑 How to Login with MFA

### Step 1: Enter Email & Password
- Email: `admin@hrms.com`
- Password: `admin123`
- Click "Sign In"

### Step 2: Setup MFA (First Time Only)
1. You'll see a QR code
2. Open your authenticator app:
   - Google Authenticator (iOS/Android)
   - Microsoft Authenticator (iOS/Android)
   - Authy (iOS/Android/Desktop)
   - Any TOTP-compatible app
3. Scan the QR code
4. Enter the 6-digit code from your app
5. Click "Verify & Complete Setup"

### Step 3: Login with MFA (Subsequent Logins)
1. Enter email and password
2. Enter the 6-digit code from your authenticator app
3. Click "Verify"
4. You're logged in!

---

## 🔓 Development Bypass (For Testing)

During development, you can use the bypass code:

**MFA Code**: `123456`

This works in development mode only and bypasses the authenticator app requirement.

---

## 📧 Alternative Login Methods

### Option 1: Email Verification
If you don't have access to your authenticator app:

1. On the MFA screen, click "Use Email Verification"
2. Enter your email address
3. Click "Send Verification Code"
4. Check your email for the 6-digit code
5. Enter the code and verify

**Note**: In development mode, use code `123456` for email verification too.

### Option 2: CAPTCHA Reset
If you need to reset MFA:

1. On the MFA screen, click "Reset MFA"
2. Solve the CAPTCHA
3. Your MFA will be reset
4. Login again and setup MFA from scratch

### Option 3: Recovery Codes
If you saved recovery codes during MFA setup:

1. On the MFA screen, click "Use Recovery Code"
2. Enter one of your recovery codes
3. You'll be logged in
4. **Important**: Each recovery code can only be used once

---

## 🔐 Login Credentials

| Role | Email | Password | MFA Code (Dev) |
|------|-------|----------|----------------|
| Admin | admin@hrms.com | admin123 | 123456 |
| HR | hr@hrms.com | admin123 | 123456 |
| Manager | manager@hrms.com | admin123 | 123456 |
| Employee | employee@hrms.com | admin123 | 123456 |

---

## 📱 Recommended Authenticator Apps

### Mobile Apps
- **Google Authenticator** (Free, iOS/Android)
  - Simple and reliable
  - No account required
  
- **Microsoft Authenticator** (Free, iOS/Android)
  - Cloud backup support
  - Biometric authentication
  
- **Authy** (Free, iOS/Android)
  - Multi-device sync
  - Cloud backup
  - Desktop app available

### Desktop Apps
- **Authy Desktop** (Free, Windows/Mac/Linux)
- **WinAuth** (Free, Windows only)

---

## 🔄 MFA Setup Process

### First Login After MFA Enable:

```
1. Login Page
   ↓ Enter email & password
   
2. MFA Setup Page
   ↓ Scan QR code with authenticator app
   ↓ Enter 6-digit code from app
   
3. MFA Verification
   ↓ Code verified
   
4. Dashboard (Logged In!)
```

### Subsequent Logins:

```
1. Login Page
   ↓ Enter email & password
   
2. MFA Verification Page
   ↓ Enter 6-digit code from app
   
3. Dashboard (Logged In!)
```

---

## 🛠️ Troubleshooting

### "Invalid MFA token" Error

**Solution 1**: Use development bypass code
- Enter: `123456`

**Solution 2**: Check time sync
- Authenticator apps rely on accurate time
- Ensure your device time is correct
- Enable automatic time sync

**Solution 3**: Try email verification
- Click "Use Email Verification"
- Use code `123456` in development

**Solution 4**: Reset MFA
- Click "Reset MFA"
- Solve CAPTCHA
- Setup MFA again

### QR Code Not Scanning

**Solution 1**: Manual entry
- Click "Can't scan? Enter manually"
- Copy the secret key
- Add manually in your authenticator app

**Solution 2**: Use different app
- Try a different authenticator app
- Some apps scan better than others

### Lost Access to Authenticator App

**Solution 1**: Email verification
- Use email verification method
- Code: `123456` (development)

**Solution 2**: CAPTCHA reset
- Reset MFA using CAPTCHA
- Setup MFA again with new device

**Solution 3**: Recovery codes
- Use saved recovery codes
- Each code works once

**Solution 4**: Admin reset
- Contact system administrator
- Admin can disable MFA for your account

---

## 🔧 Disable MFA (If Needed)

### For Testing/Development:

Run this command to disable MFA for all users:
```bash
cd server
node scripts/fix-all-login-issues.js
```

This will:
- Disable MFA for all users
- Reset login attempts
- Remove account locks
- Allow direct login without MFA

### For Individual User:

Admin can disable MFA from user management:
1. Login as Admin
2. Go to User Management
3. Select user
4. Click "Disable MFA"

---

## 🔐 Security Best Practices

### DO:
✅ Use a reputable authenticator app
✅ Save recovery codes in a secure location
✅ Enable cloud backup (if available)
✅ Use biometric authentication on your phone
✅ Keep your authenticator app updated

### DON'T:
❌ Share your MFA codes
❌ Screenshot QR codes and share them
❌ Use the same MFA secret on multiple accounts
❌ Disable MFA in production
❌ Share recovery codes

---

## 📊 MFA Status

Current status for all users:

| User | Email | MFA Status | Can Login |
|------|-------|------------|-----------|
| Alex Admin | admin@hrms.com | ✅ Enabled | Yes (with MFA) |
| Harriet HR | hr@hrms.com | ✅ Enabled | Yes (with MFA) |
| Mandy Manager | manager@hrms.com | ✅ Enabled | Yes (with MFA) |
| Eva Employee | employee@hrms.com | ✅ Enabled | Yes (with MFA) |
| naveen | n@gmail.com | ✅ Enabled | Yes (with MFA) |
| Nagaraju | a@gmail.com | ✅ Enabled | Yes (with MFA) |
| Manohar | m@gmail.com | ✅ Enabled | Yes (with MFA) |

---

## 🎯 Quick Test

To test MFA is working:

1. Start the application
2. Login with: `admin@hrms.com` / `admin123`
3. You should see MFA setup screen
4. Use bypass code: `123456`
5. You should be logged in!

---

## 📞 Need Help?

- **Development bypass not working?** Check `NODE_ENV=development` in `server/.env`
- **Can't receive email codes?** Check email configuration in `server/.env`
- **Need to disable MFA?** Run `node scripts/fix-all-login-issues.js`
- **Other issues?** Check `TROUBLESHOOTING.md`

---

**MFA is now active! Use code `123456` for development testing.** 🔐
