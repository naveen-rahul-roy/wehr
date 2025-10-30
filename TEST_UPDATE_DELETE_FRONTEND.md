# Testing Update & Delete Operations in Frontend

## ✅ Backend Status
All backend Update & Delete operations are now working correctly!

## 🧪 How to Test in Frontend

### 1. Login to the Application
1. Go to http://localhost:3000
2. Login with:
   - Email: `admin@hrms.com`
   - Password: `password123`
3. Email verification code: **123456**

---

### 2. Test Departments Update & Delete

#### Update Department:
1. Click **"Departments"** in the left sidebar
2. Find any department in the list
3. Click the **Edit** button (pencil icon)
4. Change the department name
5. Click **"Save"**
6. ✅ The department name should update immediately in the list

#### Delete Department:
1. Click **"Departments"** in the left sidebar
2. Find any department in the list
3. Click the **Delete** button (trash icon)
4. Confirm the deletion
5. ✅ The department should disappear from the list

---

### 3. Test Employees Update & Delete

#### Update Employee:
1. Click **"Employees"** in the left sidebar
2. Find any employee in the list
3. Click the **Edit** button (pencil icon)
4. Change employee details (name, salary, etc.)
5. Click **"Save"**
6. ✅ The employee details should update immediately in the list

#### Delete Employee:
1. Click **"Employees"** in the left sidebar
2. Find any employee in the list
3. Click the **Delete** button (trash icon)
4. Confirm the deletion
5. ✅ The employee should disappear from the list

---

### 4. Test Leaves Update & Delete

#### Update Leave (Approve/Reject):
1. Click **"Leave Requests"** in the left sidebar (Admin only)
2. Find a pending leave request
3. Click **"Approve"** or **"Reject"** button
4. ✅ The leave status should update immediately

#### Delete Leave:
1. Click **"My Leaves"** in the left sidebar
2. Find a **pending** leave request
3. Click the **Delete** button (trash icon)
4. Confirm the deletion
5. ✅ The leave should disappear from the list

**Note**: Approved or Rejected leaves cannot be deleted (by design)

---

## 🔍 Troubleshooting

### Updates Not Showing?
1. **Check Browser Console** (F12):
   - Look for any error messages
   - Check if API calls are successful (200 status)

2. **Refresh the Page**:
   - Sometimes the UI needs a refresh
   - Data should persist after refresh

3. **Check Backend Logs**:
   - Look at the terminal running the backend
   - Check for any error messages

### Deletes Not Working?
1. **Check if item is protected**:
   - Approved/Rejected leaves cannot be deleted
   - Departments with employees might be protected

2. **Check Browser Console**:
   - Look for 400 or 403 errors
   - Read the error message

3. **Verify Authentication**:
   - Make sure you're logged in as Admin/HR
   - Some operations require specific roles

---

## 🎯 Expected Behavior

### Departments:
- ✅ Create: New department appears in list
- ✅ Update: Name changes immediately
- ✅ Delete: Department disappears from list
- ✅ Data persists after page refresh

### Employees:
- ✅ Create: New employee appears in list
- ✅ Update: Details change immediately
- ✅ Delete: Employee disappears from list
- ✅ Data persists after page refresh

### Leaves:
- ✅ Create: New leave request appears
- ✅ Update: Status changes (Pending → Approved/Rejected)
- ✅ Delete: Only pending leaves can be deleted
- ✅ Data persists after page refresh

---

## 📊 Backend Test Results

All backend operations tested and verified:
```
✅ Departments: Create, Read, Update, Delete
✅ Employees: Create, Read, Update, Delete
✅ Leaves: Create, Read, Update, Delete (with protection)
✅ ID Transformation: _id → id (working)
✅ Data Persistence: MongoDB (working)
```

---

## 🔧 What Was Fixed

1. **ID Transformation**: Added `id` field to all models (alongside `_id`)
2. **JSON Serialization**: Models now return both `id` and `_id`
3. **Frontend Compatibility**: Frontend can now use `department.id`, `employee.id`, etc.
4. **Backend Routes**: All routes properly handle updates and deletes

---

## 🚀 Test Now!

Open http://localhost:3000 and test all CRUD operations!

**Everything should work perfectly now!** 🎉
