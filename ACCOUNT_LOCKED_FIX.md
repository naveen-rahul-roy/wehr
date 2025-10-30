# 🔓 Account Locked - Fix Guide

## ✅ Issue Resolved!

The account `naveenrahulroy7@gmail.com` has been unlocked.

---

## 🔐 What Happened

### Account Lock Security Feature:
- After **5 failed login attempts**, accounts are automatically locked
- Lock duration: **30 minutes**
- This protects against brute force attacks

### Why It Happened:
1. User tried to login with wrong password multiple times
2. After 5 failed attempts, account was locked
3. System shows: "Account locked due to multiple failed login attempts"

---

## ✅ Solution Applied

### Account Unlocked:
```
✅ User: nagaraju
✅ Email: naveenrahulroy7@gmail.com
✅ Login Attempts: Reset to 0
✅ Lock: Removed
✅ Status: Can login now
```

---

## 🔐 Correct Login Credentials

### For This User:
- **Email**: `naveenrahulroy7@gmail.com` (Note: ends with 7, not 1)
- **Password**: `password` (default for new employees)
- **MFA**: Already set up (will need authenticator app code)

### Important:
- ⚠️ Email is `naveenrahulroy7@gmail.com` (with 7)
- ⚠️ NOT `naveenrahulroy1@gmail.com` (with 1)
- Make sure to use the correct email!

---

## 🎯 How to Login Now

### Step 1: Use Correct Email
```
Email: naveenrahulroy7@gmail.com
```

### Step 2: Use Correct Password
```
Password: password
```

### Step 3: MFA Verification
Since MFA is already set up, you'll need:
- **Option A**: 6-digit code from authenticator app
- **Option B**: Use email verification (code: 123456 in demo mode)

---

## 🔧 If Account Gets Locked Again

### Option 1: Wait 30 Minutes
- Account automatically unlocks after 30 minutes
- Then try logging in again

### Option 2: Unlock Manually (Admin)
```bash
# Run this command
node server/unlock-user.js <email>

# Example
node server/unlock-user.js naveenrahulroy7@gmail.com
```

### Option 3: Reset Password
- Use "Forgot Password" link
- Follow password reset process

---

## 💡 Tips to Avoid Account Lock

### 1. Use Correct Credentials:
- ✅ Double-check email spelling
- ✅ Use correct password
- ✅ Check caps lock is off

### 2. Password Reminders:
- Default for new employees: `password`
- Admin should share password when creating employee
- Change password after first login

### 3. MFA Setup:
- Set up authenticator app properly
- Save backup codes
- Use email verification as backup

---

## 🔍 Check User Email

If unsure about email, admin can check:

```bash
# List all users
node server/check-users.js
```

This shows all registered users and their emails.

---

## 📝 For Admins

### When Creating New Employee:

1. **Note the email carefully**
2. **Share correct credentials**:
   ```
   Email: (exact email from system)
   Password: password (or custom)
   ```
3. **Inform about MFA setup**
4. **Provide backup: Email verification code 123456**

### If Employee Can't Login:

1. **Verify email is correct**
2. **Check if account is locked**
3. **Unlock if needed**: `node server/unlock-user.js <email>`
4. **Confirm password**: Default is `password`
5. **Help with MFA setup**

---

## 🛠️ Unlock Script Usage

### Syntax:
```bash
node server/unlock-user.js <email>
```

### Examples:
```bash
# Unlock specific user
node server/unlock-user.js naveenrahulroy7@gmail.com

# Unlock admin
node server/unlock-user.js admin@hrms.com

# Unlock any user
node server/unlock-user.js user@example.com
```

### What It Does:
- ✅ Resets login attempts to 0
- ✅ Removes account lock
- ✅ Shows user details
- ✅ Displays login credentials

---

## 🎯 Current Status

```
✅ Account: naveenrahulroy7@gmail.com
✅ Status: UNLOCKED
✅ Login Attempts: 0
✅ Can Login: YES
✅ Password: password
✅ MFA: Set up (need authenticator or code 123456)
```

---

## 🔐 Login Now

### Step-by-Step:

1. **Go to**: http://localhost:3000

2. **Enter Email**: `naveenrahulroy7@gmail.com`

3. **Enter Password**: `password`

4. **Click Sign In**

5. **MFA Verification**:
   - Enter code from authenticator app
   - OR use email verification (code: 123456)

6. **✅ Logged In!**

---

## 📞 Quick Reference

### Correct Credentials:
```
Email:    naveenrahulroy7@gmail.com
Password: password
MFA Code: (from app) or 123456
```

### Unlock Command:
```bash
node server/unlock-user.js naveenrahulroy7@gmail.com
```

### Check Users:
```bash
node server/check-users.js
```

---

## ✅ Summary

**Problem**: Account locked after failed login attempts  
**Cause**: Wrong password entered 5+ times  
**Solution**: Account unlocked using unlock script  
**Status**: ✅ Can login now  
**Credentials**: naveenrahulroy7@gmail.com / password / 123456  

---

**The account is now unlocked and ready to use!** 🎉

**Login at http://localhost:3000 with the correct email!** 🚀
