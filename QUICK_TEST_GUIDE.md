# 🚀 Quick Test Guide - HR Management System

## How to Run Complete System Tests

### Prerequisites
- Backend server running on port 5000
- Frontend running on port 3001
- MongoDB running on localhost:27017

---

## 🎯 Quick Start - Run All Tests

### Option 1: Automated Backend Test (Recommended)
```bash
# From project root
cd server
node test-final-comprehensive.js
```

**Expected Output:**
```
✅ All 15 tests passed
✅ 100% success rate
✅ System production ready
```

---

### Option 2: Original Comprehensive Test
```bash
# From project root
cd server
node test-complete-application.js
```

---

### Option 3: Frontend Visual Test
1. Open browser
2. Navigate to: `http://localhost:3001`
3. Open file: `test-complete-frontend-crud.html`
4. Click "Start Complete Test"
5. Watch all tests execute visually

---

## 📋 What Gets Tested

### ✅ Authentication (3 tests)
- Admin login
- MFA verification
- Token validation

### ✅ Department CRUD (4 tests)
- Create new department
- Read all departments
- Update department
- Delete department

### ✅ Employee CRUD (4 tests)
- Create new employee
- Read all employees
- Update employee
- Delete employee

### ✅ Leave CRUD (4 tests)
- Create leave request
- Read leave requests
- Update leave status
- Delete protection test

### ✅ Attendance (1 test)
- Read attendance records

### ✅ System Integration (2 tests)
- API health check
- Database connectivity

**Total: 15 comprehensive tests**

---

## 🔧 Manual Testing Steps

### 1. Start Backend
```bash
cd server
npm run dev
```
Wait for: "Server is running on port 5000"

### 2. Start Frontend
```bash
npm run dev
```
Wait for: "Local: http://localhost:3001/"

### 3. Run Tests
```bash
cd server
node test-final-comprehensive.js
```

---

## 📊 Expected Results

```
Total Tests:   15
Passed:        15 ✅
Failed:         0 ❌
Success Rate:  100.0%
```

---

## 🎯 Test Coverage

| Module | Operations | Status |
|--------|-----------|--------|
| Departments | CREATE, READ, UPDATE, DELETE | ✅ |
| Employees | CREATE, READ, UPDATE, DELETE | ✅ |
| Leaves | CREATE, READ, UPDATE, DELETE | ✅ |
| Attendance | READ | ✅ |
| Auth & MFA | LOGIN, VERIFY, TOKEN | ✅ |
| System | HEALTH, DATABASE | ✅ |

---

## 🐛 Troubleshooting

### Backend Not Running
```bash
cd server
npm start
# or
npm run dev
```

### Frontend Not Running
```bash
npm run dev
```

### MongoDB Not Connected
```bash
# Check if MongoDB is running
# Windows: Check Services
# Mac/Linux: sudo systemctl status mongod
```

### Port Already in Use
- Backend: Change PORT in server/.env
- Frontend: Vite will auto-select next available port

---

## 📝 Test Files

- `test-final-comprehensive.js` - Main test script (recommended)
- `test-complete-application.js` - Original comprehensive test
- `test-complete-frontend-crud.html` - Visual browser test
- `test-all-crud-comprehensive.js` - Alternative test script

---

## ✅ Success Indicators

When tests pass, you'll see:
```
🎉 ALL TESTS PASSED!
✨ All CRUD operations working perfectly
🚀 System is production ready
```

---

## 📞 Quick Commands Reference

```bash
# Start everything
npm run dev:fullstack

# Backend only
cd server && npm run dev

# Frontend only
npm run dev

# Run tests
cd server && node test-final-comprehensive.js

# Check API health
curl http://localhost:5000/api/health

# Check frontend
curl http://localhost:3001
```

---

## 🎊 Current Test Status

**Last Run:** October 29, 2025  
**Result:** ✅ ALL TESTS PASSED  
**Success Rate:** 100%  
**Status:** 🟢 PRODUCTION READY

---

## 📚 More Information

- See `TEST_RESULTS_REPORT.md` for detailed results
- See `COMPLETE_TEST_SUMMARY.md` for comprehensive summary
- See `SYSTEM_STATUS_DASHBOARD.md` for live status
- See `TESTING_INSTRUCTIONS.md` for detailed testing guide

---

**Quick Test Guide** | Last Updated: October 29, 2025
