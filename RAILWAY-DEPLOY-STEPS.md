# Deploy desOline Backend to Railway - Step by Step

## Step 1: Create a New Project in Railway

1. Go to https://railway.app
2. Click **"+ New Project"** (top right)
3. Click **"Deploy from GitHub repo"**
4. You'll see your GitHub repositories
5. Find and click **"desOline"** repository

---

## Step 2: Railway Detects Your Services

Railway will automatically scan your repo and find:
- ✅ **Backend** (Node.js/Express)
- ✅ **PostgreSQL** (from docker-compose.yml)

You'll see options for what to deploy.

---

## Step 3: Select Services to Deploy

Make sure both are checked:
- ✅ **backend** folder
- ✅ **postgres** service

Click **"Deploy"** or **"Next"**

---

## Step 4: Railway Creates Services

Railway will now create two services in your project:
1. **PostgreSQL** database
2. **Backend** Node.js app

You can watch the deployment progress in the logs.

---

## Step 5: Configure Environment Variables

Once services are created:

### For PostgreSQL (if needed):
1. Click **"PostgreSQL"** service
2. Go to **"Variables"** tab
3. Railway auto-creates these (you just view them)

### For Backend:
1. Click **"backend"** service
2. Go to **"Variables"** tab
3. Set these variables:

```
NODE_ENV=production
JWT_SECRET=your-secret-key-change-this-to-something-strong-32chars
PORT=5000
MAX_FILE_SIZE=52428800
UPLOAD_DIR=./uploads
VIDEO_UPLOAD_LIMIT=52428800
PDF_UPLOAD_LIMIT=10485760
THUMBNAIL_UPLOAD_LIMIT=5242880
VIDEO_STORAGE_TYPE=YOUTUBE # Options: YOUTUBE, LOCAL, CLOUDINARY, AWS
LOG_LEVEL=info
```

**IMPORTANT:** Railway automatically creates `DATABASE_URL` - you'll see it in the Variables tab linked from PostgreSQL!

---

## Step 6: Wait for Build & Deployment

1. Click **"Deployments"** tab on backend service
2. Watch the status:
   - 🔵 **Building** - Railway is building your Docker image
   - 🟡 **Deploying** - Starting your app
   - 🟢 **Running** - Your app is live!

Look in the **"Logs"** tab. You should see:
```
✅ Schema synced!
🌱 Starting dev server...
✓ Server running on port 5000
```

---

## Step 7: Get Your Live API URL

1. Click **"backend"** service
2. Go to **"Settings"** tab
3. Look for **"Public URL"** or **"Domain"**
4. Copy it - this is your live API URL!
   
Example: `https://desonline-backend-production.railway.app`

---

## Step 8: Test Your Deployment

### Test the health endpoint:
```bash
curl https://your-railway-url/api/auth/health
```

Should return:
```json
{"status":"ok"}
```

### Test login with sample credentials:
```bash
curl -X POST https://your-railway-url/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@desonline.com","password":"admin123"}'
```

Should return a JWT token (long string starting with `eyJ...`)

---

## 🎉 Success! Your Backend is Live!

Now you can:
- ✅ Use the Railway API URL in your frontend
- ✅ Push new code to GitHub → Railway auto-deploys
- ✅ Monitor logs and performance in Railway dashboard

---

## 📋 Troubleshooting

### Build fails?
- Check **"Build Logs"** tab
- Make sure `package.json` exists in `/backend` folder
- Verify `Dockerfile` is correct

### Database not connecting?
- Go to **Backend** service → **"Variables"** tab
- Check if `DATABASE_URL` is shown
- Look in **"Logs"** for connection errors

### App crashes on startup?
- Check **"Logs"** tab for error messages
- Verify all environment variables are set
- Make sure `prisma db push` command succeeds

### Can't find public URL?
- Go to **Backend** service
- Click **"Settings"** tab
- Scroll down to find **"Public URL"** or **"Domain"**

---

## 🔄 Update Code (Easy!)

After deployment, to update your app:

```bash
# Make changes locally
git add .
git commit -m "my changes"
git push origin main
```

**That's it!** Railway automatically:
1. Detects the push to GitHub
2. Rebuilds your Docker image
3. Deploys the new version
4. Shows progress in dashboard

No manual deployment needed! 🚀

---

## 📊 View Your Project

Always go to: https://railway.app/project/[your-project-id]

From here you can:
- View logs in real-time
- Monitor CPU/Memory usage
- Manage environment variables
- Check deployment history
- Scale services

---

## Next Steps

1. ✅ Wait for deployment to complete
2. ✅ Test the API endpoints
3. ✅ Copy the Railway URL
4. ✅ Update frontend to use this URL (see next guide)
5. ✅ Deploy frontend to Vercel/Netlify (also free!)
