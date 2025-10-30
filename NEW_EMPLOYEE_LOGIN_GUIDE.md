# 👤 New Employee Login Guide

## ✅ Issues Fixed

### 1. **Duplicate Email Error** ✅
**Problem**: Creating employee with existing email caused error  
**Solution**: Now checks if user exists and reuses account if available

### 2. **Unknown Password** ✅
**Problem**: Admin didn't know new employee's password  
**Solution**: Password now shown in success message and dialog

### 3. **New Employee Can't Login** ✅
**Problem**: New employees don't have MFA setup  
**Solution**: System guides them through MFA setup on first login

---

## 🔐 How New Employee Login Works

### Step 1: Admin Creates Employee
1. Admin goes to Employees page
2. Clicks "Add Employee"
3. Fills in employee details
4. Clicks "Save"

### Step 2: Admin Gets Credentials
After creation, admin sees:
```
✅ Employee added! 
Login: employee@example.com
Password: password
```

**Dialog shows**:
- Email: employee@example.com
- Password: password (or custom password)

### Step 3: New Employee Logs In
1. Go to http://localhost:3000
2. Enter email and password
3. System detects first login
4. Shows MFA Setup page

### Step 4: MFA Setup
1. Scan QR code with authenticator app
2. Enter 6-digit code
3. Save backup codes
4. ✅ Account activated!

### Step 5: Subsequent Logins
1. Enter email and password
2. Enter MFA code from authenticator app
3. ✅ Logged in!

**Alternative**: Use email verification (code: 123456 in demo mode)

---

## 🔧 Default Credentials

### New Employees Get:
- **Email**: As entered by admin
- **Password**: `password` (default)
- **MFA**: Not set up (required on first login)
- **Role**: Employee

### First Login Requirements:
1. ✅ Email and password
2. ✅ MFA setup (scan QR code)
3. ✅ Save backup codes
4. ✅ Ready to use!

---

## 🎯 Testing New Employee Login

### Test Scenario:

**Step 1**: Create Employee (as Admin)
```
Name: Test Employee
Email: test@example.com
Employee ID: EMP001
Department: Engineering
Role: Developer
```

**Step 2**: Note Credentials
```
Email: test@example.com
Password: password
```

**Step 3**: Logout from Admin

**Step 4**: Login as New Employee
1. Email: test@example.com
2. Password: password
3. ✅ See MFA Setup page

**Step 5**: Setup MFA
1. Scan QR code
2. Enter code from app
3. ✅ Logged in!

---

## 🐛 Troubleshooting

### Error: "Employee with this email already exists"
**Cause**: Email already used by another employee  
**Solution**: Use different email or check existing employees

### Error: "Invalid email or password"
**Cause**: Wrong credentials  
**Solution**: 
- Check email is correct
- Default password is: `password`
- Ask admin for correct password

### Error: "User not found"
**Cause**: Employee record not created properly  
**Solution**: Admin should recreate the employee

### Can't Setup MFA
**Solution**: Use email verification instead
- Click "Use Email Verification"
- Enter code: 123456 (demo mode)
- ✅ Logged in!

---

## 📝 Admin Checklist

When creating new employee:

- ✅ Fill all required fields
- ✅ Use unique email
- ✅ Use unique employee ID
- ✅ Note the password shown
- ✅ Share credentials with employee
- ✅ Inform about MFA setup requirement

---

## 🔐 Security Notes

### Default Password:
- Default: `password`
- Should be changed after first login
- Admin can specify custom password

### MFA Requirement:
- All users must set up MFA
- Protects account security
- Can use authenticator app or email verification

### Email Verification:
- Alternative to authenticator app
- Demo code: 123456
- Real emails: Configure SMTP in server/.env

---

## ✅ Summary

**Fixed Issues**:
- ✅ Duplicate email handling
- ✅ Password visibility for admin
- ✅ New employee login flow
- ✅ MFA setup guidance

**New Employee Flow**:
1. Admin creates employee
2. Admin gets credentials
3. Employee logs in
4. Employee sets up MFA
5. Employee can use system

**Default Credentials**:
- Password: `password`
- MFA: Setup required on first login
- Email verification: Code 123456 (demo)

---

## 🎉 Test It Now!

1. **Login as Admin**: admin@hrms.com / password123
2. **Create Employee**: Add new employee
3. **Note Password**: Check success message
4. **Logout**: Logout from admin
5. **Login as Employee**: Use new credentials
6. **Setup MFA**: Scan QR or use email verification
7. **Success**: Employee can now use system!

---

**Status**: ✅ New employee login fully working!
