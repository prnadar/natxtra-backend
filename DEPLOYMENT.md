# Natxtra Backend - Render Deployment Guide

This guide will help you deploy the Natxtra Backend to [Render.com](https://render.com).

## Prerequisites
1.  **Render Account**: Sign up at [dashboard.render.com](https://dashboard.render.com/).
2.  **GitHub Repository**: You need to push this code to a new GitHub repository.
3.  **MongoDB Atlas Account**: Render does not host databases. You need a cloud database.

---

## Step 1: Push Code to GitHub
1.  Initialize Git in your project folder (if not done):
    ```bash
    git init
    git add .
    git commit -m "Initial commit for Render deployment"
    ```
2.  Create a new repository on GitHub.
3.  Push your code:
    ```bash
    git remote add origin <your-repo-url>
    git branch -M main
    git push -u origin main
    ```

---

## Step 2: Setup MongoDB Atlas (Database)
1.  Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2.  Create a free **M0 Cluster**.
3.  Create a **Database User** (username/password).
4.  In "Network Access", allow access from **Anywhere (0.0.0.0/0)** (required for Render).
5.  Get your **Connection String** (Driver: Node.js):
    *   Format: `mongodb+srv://<username>:<password>@cluster0.mongodb.net/natxtra?retryWrites=true&w=majority`

---

## Step 3: Create Render Web Service
1.  Log in to [Render Dashboard](https://dashboard.render.com/).
2.  Click **New +** -> **Web Service**.
3.  Connect your **GitHub account** and select the **natxtra-backend** repository.
4.  **Configure Service**:
    *   **Name**: `natxtra-backend`
    *   **Region**: Singapore (or nearest to you)
    *   **Branch**: `main`
    *   **Runtime**: `Node`
    *   **Build Command**: `npm install`
    *   **Start Command**: `npm start`
    *   **Instance Type**: `Free`

---

## Step 4: Configure Environment Variables
Scroll down to **Environment Variables** and add the following:

| Key | Value | Description |
| :--- | :--- | :--- |
| `DB_CONNECT` | `mongodb+srv://...` | Your MongoDB Atlas connection string. |
| `TOKEN_SECRET` | `somelongrandomstring` | Secret for JWT tokens (make this secure). |
| `SESSION_SECRET` | `anotherlongrandomstring` | Secret for sessions. |
| `URL` | `https://your-app-name.onrender.com` | The URL Render assigns you (update this after deploy). |
| `BaseURL` | `https://your-app-name.onrender.com` | Base URL for the app. |
| `NODE_ENV` | `production` | Optimizes the app for production. |

> **Note**: Render automatically handles the `PORT` variable. Do not set `PORT` manually.

---

## Step 5: Deploy
1.  Click **Create Web Service**.
2.  Render will start building your app. Watch the logs.
3.  Once it says **"Live"**, your backend is deployed!

---

## ⚠️ Important Note on File Uploads
**Render's Free Tier has an Ephemeral File System.**
Any images you upload (Products, User Profiles) will be **deleted** every time the server restarts or deploys.

**Solution**:
To persist images, you must either:
1.  Upgrade to a paid Render plan and add a **Render Disk** (mount it to `./public/uploads`).
2.  Or, refactor the code to use **AWS S3** or **Cloudinary** for storage.
