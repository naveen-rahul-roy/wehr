# 🔧 Port Already in Use - Fix Guide

## ❌ Error Message

```
Error: listen EADDRINUSE: address already in use :::5000
```

This means port 5000 is already being used by another Node.js process.

---

## ✅ Quick Fix (Easiest)

### Option 1: Use Updated Startup Script

**Double-click**: `START_SYSTEM.bat`

The updated script now:
1. ✅ Automatically stops all existing Node.js processes
2. ✅ Checks MongoDB is running
3. ✅ Starts backend on port 5000
4. ✅ Starts frontend on port 3000

### Option 2: Manual Fix

**Step 1**: Stop all Node.js processes
```bash
taskkill /F /IM node.exe /T
```

**Step 2**: Start backend
```bash
cd server
npm run dev
```

**Step 3**: Start frontend (in new terminal)
```bash
npm run dev
```

---

## 🔍 Check What's Using the Port

### Find process using port 5000:
```bash
netstat -ano | findstr :5000
```

### Kill specific process:
```bash
taskkill /F /PID <process_id>
```

Example:
```bash
# If netstat shows PID 12345
taskkill /F /PID 12345
```

---

## 🛠️ Alternative Solutions

### Solution 1: Change Backend Port

Edit `server/.env`:
```env
PORT=5001
```

Then update frontend `.env`:
```env
VITE_API_URL=http://localhost:5001/api
```

### Solution 2: Use Different Port Temporarily

Edit `server/server.js`:
```javascript
const PORT = process.env.PORT || 5001;
```

---

## 🎯 Prevention

### Always Stop Servers Properly

**Good**:
- Use `STOP_SYSTEM.bat`
- Press `Ctrl+C` in terminal
- Close terminal windows

**Bad**:
- Force closing terminals
- Killing processes abruptly
- Not stopping before restarting

---

## ✅ Verify System is Running

### Check Backend:
```bash
curl http://localhost:5000/api/health
```

Expected: `{"status":"ok","message":"HR Management API is running"}`

### Check Frontend:
Open browser: http://localhost:3000

### Check Processes:
```bash
tasklist | findstr node.exe
```

---

## 🚀 Current Status

After running the fix:
- ✅ Backend: http://localhost:5000 (Running)
- ✅ Frontend: http://localhost:3000 (Running)
- ✅ MongoDB: Connected
- ✅ All ports clear

---

## 📝 Common Scenarios

### Scenario 1: Multiple Terminals Open
**Problem**: Started servers multiple times  
**Solution**: Close all terminals, run `STOP_SYSTEM.bat`, then `START_SYSTEM.bat`

### Scenario 2: Previous Crash
**Problem**: Server crashed but process still running  
**Solution**: `taskkill /F /IM node.exe /T`

### Scenario 3: Different Application
**Problem**: Another app using port 5000  
**Solution**: Change backend port in `.env`

---

## 🎉 Summary

**Problem**: Port 5000 already in use  
**Cause**: Previous Node.js process still running  
**Solution**: Kill all Node processes first  
**Prevention**: Use START_SYSTEM.bat (now includes cleanup)  
**Status**: ✅ Fixed and running  

---

## 🔐 Login Now

**URL**: http://localhost:3000  
**Email**: admin@hrms.com  
**Password**: password123  
**Code**: 123456  

**Everything is working!** 🚀
