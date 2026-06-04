# Quick Start: Deploy to Railway (Free)

## 🚀 5-Minute Setup

### Step 1: Prepare Your Repository
Your code should already be on GitHub. If not:
```bash
# Make sure all changes are committed
git add .
git commit -m "Ready for deployment"
git push origin main
```

### Step 2: Create Railway Account
1. Go to https://railway.app
2. Click "Login" → "Sign up with GitHub"
3. Authorize Railway to access your repos

### Step 3: Create New Project
1. In Railway dashboard, click **"New Project"**
2. Select **"Deploy from GitHub repo"**
3. Choose your `desOline` repository
4. Select the `backend` directory as the root

### Step 4: Add PostgreSQL Database
1. Click **"Add Service"** → **"Add from Marketplace"**
2. Search for **"PostgreSQL"**
3. Click **"PostgreSQL"** → **"Add"**

Railway automatically creates database credentials!

### Step 5: Configure Backend Service
1. Click on your backend service
2. Go to **"Variables"** tab
3. Set these environment variables:

```
NODE_ENV=production
JWT_SECRET=your-super-secret-key-min-32-chars-long-here
PORT=5000
MAX_FILE_SIZE=52428800
UPLOAD_DIR=./uploads
VIDEO_UPLOAD_LIMIT=52428800
PDF_UPLOAD_LIMIT=10485760
THUMBNAIL_UPLOAD_LIMIT=5242880
LOG_LEVEL=info
```

**Note:** Railway automatically generates `DATABASE_URL` - no need to set it manually!

### Step 6: Configure PostgreSQL Service
1. Click on PostgreSQL service
2. Go to **"Variables"** tab
3. Railway auto-creates these (view only):
   - `DATABASE_URL` (automatically shared with backend)
   - `PGPASSWORD`
   - `POSTGRES_DB`
   - `POSTGRES_USER`

### Step 7: Deploy!
1. Click **"Deploy"** button
2. Watch the logs - should see:
   ```
   ✅ Schema synced!
   🌱 Starting dev server...
   ✓ Server running on port 5000
   ```
3. Go to **"Settings"** → copy your public URL
4. Test it: `https://your-app-name.railway.app`

---

## ✅ Post-Deployment Verification

### Test Health Endpoint
```bash
curl https://your-app.railway.app/api/auth/health
```

Should return: `{"status":"ok"}`

### Test Auth Endpoint
```bash
curl -X POST https://your-app.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@desonline.com","password":"admin123"}'
```

Should return a JWT token.

---

## 🔄 How Updates Work

After initial deployment, just push to GitHub:
```bash
git add .
git commit -m "my changes"
git push origin main
```

**Railway auto-deploys** within 1-2 minutes! 🎉

---

## 📊 Monitor Your Deployment

In Railway dashboard:
- **Logs** tab: See real-time server logs
- **Metrics** tab: CPU, memory, network usage
- **Deployments** tab: Deployment history

---

## 🚨 Troubleshooting

### Database connection error?
- Go to PostgreSQL service → check **"Variables"**
- Click **"DATABASE_URL"** and copy the full connection string
- Add to backend **"Variables"** as backup

### Build fails?
- Check **"Build Logs"** tab
- Ensure `package.json` scripts are correct
- Verify `.env.docker` is in `/backend` folder

### Port issues?
- Railway assigns port automatically
- Set `PORT=5000` in variables (it will map correctly)

---

## 💰 Costs

- **Backend**: Free tier (~$2/month worth of credits per month)
- **PostgreSQL**: Free tier included
- **Total**: ~$0-5/month for MVP

When you scale beyond free tier, you pay only for what you use (~$0.0001 per compute hour)

---

## 🎯 Next Steps

1. ✅ Deploy backend to Railway
2. Update frontend API base URL to Railway URL
3. Test full app (frontend + backend)
4. Deploy frontend to Vercel/Netlify (also free!)

---

## 📞 Support

- Railway docs: https://docs.railway.app
- Contact Railway support in dashboard
