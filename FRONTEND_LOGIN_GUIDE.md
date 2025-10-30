# Frontend Login & Testing Guide

## ✅ System Status
- **Backend**: Running on http://localhost:5000 ✅
- **Frontend**: Running on http://localhost:3000 ✅
- **Database**: MongoDB Connected ✅
- **All APIs**: Working ✅

## 🔐 Login Instructions

### Step 1: Access the Application
Open your browser and go to: **http://localhost:3000**

### Step 2: Login
- **Email**: `admin@hrms.com`
- **Password**: `password123`

### Step 3: Email Verification (Development Mode)
After login, you'll see the Email Verification page with an error message about email not being configured. This is expected!

**Use the Development Bypass Code:**
1. Click "Send Verification Code" button
2. You'll see a purple box that says "Development Mode"
3. Enter the code: **123456**
4. Click "Verify Code"

### Step 4: Access the Dashboard
You should now be logged in and see the full HR Management System dashboard!

---

## 🧪 Testing CRUD Operations

Once logged in, test each module:

### 1. **Departments** (Left sidebar → Departments)
- ✅ View all departments
- ✅ Create new department
- ✅ Edit department name
- ✅ Delete department

### 2. **Employees** (Left sidebar → Employees)
- ✅ View all employees
- ✅ Add new employee
- ✅ Edit employee details
- ✅ Delete employee

### 3. **Leaves** (Left sidebar → My Leaves)
- ✅ View your leave balance
- ✅ Apply for leave
- ✅ View leave history

### 4. **Leave Management** (Left sidebar → Leave Requests - Admin only)
- ✅ View all leave requests
- ✅ Approve/Reject leaves

### 5. **Attendance** (Left sidebar → Attendance)
- ✅ View attendance records
- ✅ Filter by date range
- ✅ View calendar view

### 6. **Dashboard** (Left sidebar → Dashboard)
- ✅ View real-time statistics
- ✅ See employee count
- ✅ See department count
- ✅ See pending leaves
- ✅ View attendance calendar

---

## 🔧 Development Notes

### Email Configuration (Optional)
If you want to enable real email sending:

1. Edit `server/.env`
2. Update these values:
   ```
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your_email@gmail.com
   SMTP_PASS=your_app_specific_password
   SMTP_FROM=noreply@hrms.com
   ```

3. For Gmail, you need to:
   - Enable 2-Factor Authentication
   - Generate an App-Specific Password
   - Use that password in SMTP_PASS

### Development Bypass Code
- The code **123456** will always work in development mode
- This bypasses the email requirement
- In production, remove this bypass from `server/routes/auth.js`

---

## 🐛 Troubleshooting

### Login Shows "Login Failed"
- Check browser console (F12) for errors
- Verify backend is running: http://localhost:5000/api/health
- Check backend logs in terminal

### Email Verification Error
- This is expected! Use the bypass code: **123456**
- The purple box on the verification page shows this code

### CRUD Operations Not Working
- Check browser console for errors
- Verify you're logged in (token in localStorage)
- Check backend logs for API errors

### Data Not Showing
- Refresh the page
- Check browser console for API errors
- Verify backend is connected to MongoDB

---

## 📊 Test Results

All backend APIs have been tested and verified:
- ✅ Authentication & MFA
- ✅ Email Verification (Dev Mode)
- ✅ Departments CRUD
- ✅ Employees CRUD
- ✅ Leaves CRUD
- ✅ Attendance Read

Run `node test-complete-flow-fixed.js` to verify backend APIs anytime.

---

## 🚀 Next Steps

1. Test the frontend login flow
2. Test all CRUD operations in the UI
3. Verify data persistence (refresh page, data should remain)
4. Test different user roles if needed
5. Configure email if you want real email notifications

---

**Happy Testing! 🎉**
