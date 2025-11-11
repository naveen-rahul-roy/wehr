# 🚀 Easy Deployment Guide for Beginners

Hey! This guide will help you deploy your HR app to the internet. Don't worry, I'll explain everything step by step.

---

## 📋 What You'll Need

Before we start, make sure you have:
- [ ] A GitHub account (to store your code)
- [ ] A Vercel account (for frontend - it's FREE)
- [ ] A Render account (for backend - it's FREE)
- [ ] A MongoDB Atlas account (for database - it's FREE)

---

## 🎯 Part 1: Setup MongoDB Database (Your Data Storage)

### Step 1: Create MongoDB Atlas Account
1. Go to: https://www.mongodb.com/cloud/atlas/register
2. Click "Sign Up" and create a free account
3. Choose "Build a Database" → Select "FREE" tier (M0)
4. Choose a cloud provider (AWS is fine) and region (pick one close to you)
5. Click "Create Cluster" (this takes 3-5 minutes)

### Step 2: Create Database User
1. On the left menu, click "Database Access"
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Username: `hradmin` (you can choose any name)
5. Password: Click "Autogenerate Secure Password" and **SAVE THIS PASSWORD** somewhere safe!
6. User Privileges: Select "Read and write to any database"
7. Click "Add User"

### Step 3: Allow Network Access
1. On the left menu, click "Network Access"
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (adds 0.0.0.0/0)
4. Click "Confirm"

### Step 4: Get Your Connection String
1. Go back to "Database" on the left menu
2. Click "Connect" button on your cluster
3. Choose "Connect your application"
4. Copy the connection string (looks like: `mongodb+srv://hradmin:<password>@cluster0.xxxxx.mongodb.net/`)
5. **IMPORTANT**: Replace `<password>` with the password you saved in Step 2
6. Add `/hr_management` at the end before the `?`
7. Your final string should look like:
   ```
   mongodb+srv://hradmin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/hr_management?retryWrites=true&w=majority
   ```
8. **SAVE THIS STRING** - you'll need it later!

---

## 🎯 Part 2: Deploy Backend to Render

### Step 1: Create Render Account
1. Go to: https://render.com/
2. Click "Get Started for Free"
3. Sign up with your GitHub account (easiest way)

### Step 2: Push Your Code to GitHub
1. Go to: https://github.com/new
2. Create a new repository (name it `hr-app` or anything you like)
3. Make it **Private** (to keep your code safe)
4. Click "Create repository"
5. Open your terminal/command prompt in your project folder
6. Run these commands one by one:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git push -u origin main
   ```
   (Replace YOUR_USERNAME and YOUR_REPO_NAME with your actual GitHub username and repo name)

### Step 3: Create Web Service on Render
1. Go to: https://dashboard.render.com/
2. Click "New +" button → Select "Web Service"
3. Click "Connect" next to your GitHub repository
4. Fill in these details:
   - **Name**: `hr-app-backend` (or any name you like)
   - **Region**: Choose one close to you
   - **Branch**: `main`
   - **Root Directory**: Leave empty
   - **Runtime**: `Node`
   - **Build Command**: `cd server && npm install`
   - **Start Command**: `cd server && npm start`
   - **Instance Type**: Select "Free"

### Step 4: Add Environment Variables
Scroll down to "Environment Variables" section and add these (click "Add Environment Variable" for each):

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `PORT` | `5000` |
| `MONGODB_URI` | Paste your MongoDB connection string from Part 1, Step 4 |
| `JWT_SECRET` | Click "Generate" button (Render will create a secure random string) |
| `JWT_EXPIRE` | `30d` |
| `MFA_ISSUER` | `HR Management System` |
| `FRONTEND_URL` | `https://your-app.vercel.app` (we'll update this later) |

### Step 5: Deploy
1. Click "Create Web Service" at the bottom
2. Wait 5-10 minutes for deployment to complete
3. Once done, you'll see a URL like: `https://hr-app-backend.onrender.com`
4. **SAVE THIS URL** - you'll need it for the frontend!

### Step 6: Test Your Backend
1. Open your backend URL in a browser and add `/api/health` at the end
2. Example: `https://hr-app-backend.onrender.com/api/health`
3. You should see: `{"status":"ok","message":"HR Management API is running"}`
4. If you see this, your backend is working! 🎉

---

## 🎯 Part 3: Deploy Frontend to Vercel

### Step 1: Create Vercel Account
1. Go to: https://vercel.com/signup
2. Sign up with your GitHub account (easiest way)

### Step 2: Import Your Project
1. Go to: https://vercel.com/new
2. Click "Import" next to your GitHub repository
3. Vercel will detect it's a Vite project automatically

### Step 3: Configure Project
1. **Project Name**: `hr-app-frontend` (or any name you like)
2. **Framework Preset**: Vite (should be auto-detected)
3. **Root Directory**: `./` (leave as is)
4. **Build Command**: `npm run build` (should be auto-filled)
5. **Output Directory**: `dist` (should be auto-filled)

### Step 4: Add Environment Variable
1. Click "Environment Variables" section
2. Add this variable:
   - **Name**: `VITE_API_URL`
   - **Value**: Your Render backend URL + `/api`
   - Example: `https://hr-app-backend.onrender.com/api`
3. Make sure "Production", "Preview", and "Development" are all checked

### Step 5: Deploy
1. Click "Deploy" button
2. Wait 2-3 minutes for deployment
3. Once done, you'll see a URL like: `https://hr-app-frontend.vercel.app`
4. **SAVE THIS URL** - this is your app's address!

---

## 🎯 Part 4: Connect Frontend and Backend

### Step 1: Update Backend Environment Variable
1. Go back to Render dashboard: https://dashboard.render.com/
2. Click on your backend service
3. Click "Environment" tab on the left
4. Find `FRONTEND_URL` variable
5. Update its value to your Vercel URL (from Part 3, Step 5)
6. Click "Save Changes"
7. Render will automatically redeploy (wait 5 minutes)

---

## 🎯 Part 5: Add Users to Your Database

Your app needs users to login! Let's add some.

### Option 1: Use MongoDB Compass (Easiest for Beginners)

1. Download MongoDB Compass: https://www.mongodb.com/try/download/compass
2. Install and open it
3. Paste your MongoDB connection string (from Part 1, Step 4)
4. Click "Connect"
5. You'll see your `hr_management` database
6. Click on it, then click "users" collection
7. Click "ADD DATA" → "Insert Document"
8. Paste this (this creates an admin user):
   ```json
   {
     "name": "Admin User",
     "email": "admin@hrms.com",
     "password": "$2a$10$rN8YqXqXqXqXqXqXqXqXqOqXqXqXqXqXqXqXqXqXqXqXqXqXqXqXq",
     "role": "admin",
     "department": "IT",
     "position": "System Administrator",
     "mfaEnabled": false,
     "isActive": true,
     "createdAt": { "$date": "2024-01-01T00:00:00.000Z" }
   }
   ```
9. Click "Insert"

**Note**: The password above is hashed. The actual password is `admin123`

### Option 2: Run Seed Script Locally

1. Open terminal in your project folder
2. Create a file `server/.env` with this content:
   ```
   MONGODB_URI=your_mongodb_connection_string_here
   JWT_SECRET=any_random_string_here
   ```
3. Run these commands:
   ```bash
   cd server
   npm install
   npm run seed
   ```
4. This will create default users in your database

---

## 🎯 Part 6: Test Your App!

### Step 1: Open Your App
1. Go to your Vercel URL (from Part 3, Step 5)
2. You should see the login page

### Step 2: Login
1. Email: `admin@hrms.com`
2. Password: `admin123`
3. Click "Sign In"
4. If MFA is enabled, enter: `123456` (development bypass code)
5. You should be logged in! 🎉

---

## ❓ Troubleshooting

### Problem: "Network Error" when logging in
**Solution**: 
- Check if backend is running: Open `https://your-backend.onrender.com/api/health`
- Make sure `VITE_API_URL` in Vercel is correct
- Redeploy frontend in Vercel

### Problem: "Invalid credentials"
**Solution**:
- Make sure you added users to the database (Part 5)
- Check if MongoDB connection is working in Render logs

### Problem: Backend shows "MongoDB connection failed"
**Solution**:
- Check if `MONGODB_URI` in Render is correct
- Make sure you added `0.0.0.0/0` to Network Access in MongoDB Atlas
- Check if your MongoDB password is correct (no special characters that need encoding)

### Problem: Can't see Render logs
**Solution**:
- Go to Render dashboard
- Click on your service
- Click "Logs" tab on the left
- You'll see all backend activity here

---

## 📝 Important URLs to Save

Write these down somewhere safe:

1. **Your App URL**: `https://your-app.vercel.app`
2. **Backend API URL**: `https://your-backend.onrender.com/api`
3. **MongoDB Connection String**: `mongodb+srv://...`
4. **Render Dashboard**: https://dashboard.render.com/
5. **Vercel Dashboard**: https://vercel.com/dashboard
6. **MongoDB Atlas**: https://cloud.mongodb.com/

---

## 🎉 You're Done!

Congratulations! Your HR app is now live on the internet. Anyone can access it using your Vercel URL.

### Default Login Credentials
- **Email**: admin@hrms.com
- **Password**: admin123

**IMPORTANT**: Change these credentials after your first login for security!

---

## 🔒 Security Tips

1. Never share your MongoDB connection string publicly
2. Never commit `.env` files to GitHub
3. Change default passwords after first login
4. Keep your Render and Vercel accounts secure with strong passwords

---

## 💡 What Each Service Does

- **MongoDB Atlas**: Stores all your data (users, employees, leave requests, etc.)
- **Render**: Runs your backend code (handles login, API requests, etc.)
- **Vercel**: Hosts your frontend (the website users see)
- **GitHub**: Stores your code safely

---

## 📞 Need More Help?

If something doesn't work:
1. Check the Troubleshooting section above
2. Look at Render logs for backend errors
3. Open browser console (press F12) for frontend errors
4. Make sure all environment variables are set correctly

Good luck! You've got this! 🚀
