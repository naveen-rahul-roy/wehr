# Testing Instructions for Department Creation

## Current Status
✅ Backend server is running on http://localhost:5000
✅ Frontend server is running on http://localhost:3001
✅ Database is connected and working
✅ API endpoints are working correctly

## How to Test Department Creation

### Step 1: Open the Application
1. Open your browser and go to: http://localhost:3001
2. Open the browser's Developer Tools (F12)
3. Go to the Console tab to see the logs

### Step 2: Login
1. Use these credentials:
   - Email: `admin@hrms.com`
   - Password: `password123`
2. Click "Sign In"
3. Check the console for login logs

### Step 3: Complete MFA Setup (if needed)
1. If you see an MFA setup page, you'll need an authenticator app
2. The MFA secret for the admin user is: `MJXGI5TWGFIVQTCAOVNGWWRUNZUXWURZEVLXQLTIINUCMYKTPVZA`
3. Or you can use any 6-digit number for testing (the frontend will show errors but continue)

### Step 4: Navigate to Departments
1. Once logged in, click on "Departments" in the sidebar
2. Check the console - you should see: "🔍 Loading departments from API..."
3. You should see the current departments including "Naveen Department"

### Step 5: Create a New Department
1. Click "Create Department" button
2. Enter "Test Department" as the name
3. Click "Save Department"
4. Check the console for creation logs
5. The new department should appear in the list AND be saved to the database

## What to Look For

### Console Logs
- Login attempts: `🔍 Attempting login with:`
- Department loading: `🔍 Loading departments from API...`
- Department creation: `🔍 Saving department:` and `➕ Creating new department...`

### Expected Behavior
- Departments should load from the database (not mock data)
- New departments should be saved to the database
- You should see success messages when creating departments

## Troubleshooting

### If Login Fails
- Check the console for error messages
- Make sure the backend server is running
- Check network tab for API calls

### If Departments Don't Load
- Check the console for "Failed to load departments" errors
- Verify you're authenticated (check for 401 errors)

### If Department Creation Fails
- Check the console for error messages
- Look for authentication errors (401)
- Check if the API call is being made in the Network tab

## Verification
To verify that departments are actually being saved to the database, you can run this command in the server directory:

```bash
node check-db.js
```

This will show all departments currently in the database.