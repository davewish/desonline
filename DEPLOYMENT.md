# Deployment Guide

Complete guide to deploying DesOnline to production.

## Overview

DesOnline can be deployed across multiple cloud platforms:

- **Frontend**: Vercel, Netlify, or AWS
- **Backend**: Railway, Render, or AWS
- **Database**: Railway, Render, AWS RDS, or Azure Database

## Option 1: Railway (Recommended for Beginners)

Railway makes deployment super easy with automatic git deployment.

### Prerequisites
- Railway account (free tier available)
- GitHub account
- PostgreSQL database

### Step 1: Prepare Repository

```bash
# Ensure code is in git repository
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/desonline.git
git push -u origin main
```

### Step 2: Deploy Backend

1. Go to https://railway.app
2. Click "New Project"
3. Select "Deploy from GitHub"
4. Choose your repository
5. Select the `backend` directory
6. Set root directory to `backend`
7. Add environment variables:
   - `JWT_SECRET`: Generate a random string
   - `NODE_ENV`: production
   - `PORT`: 8080 (Railway default)

8. Click Deploy

### Step 3: Deploy PostgreSQL

1. In your Railway project
2. Click "Add a Service"
3. Select "PostgreSQL"
4. Railway creates database automatically
5. Get `DATABASE_URL` from variables

### Step 4: Update Backend Environment

1. Copy the PostgreSQL connection string
2. Add to backend environment variables in Railway
3. Update `DATABASE_URL` value

### Step 5: Run Migrations

In Railway dashboard, go to backend plugin:

```bash
npm run prisma:migrate -- --skip-generate
npm run seed
```

### Step 6: Deploy Frontend

1. Create a new Railway project (or add to existing)
2. Connect GitHub repository
3. Set root directory to `frontend`
4. Add environment variable:
   - `VITE_API_URL`: `https://your-backend-url.railway.app/api`
5. Build command: `npm run build`
6. Start command: Leave blank
7. Click Deploy

## Option 2: Vercel (Frontend) + Render (Backend)

### Deploy Frontend to Vercel

1. Go to https://vercel.com
2. Sign up with GitHub
3. Click "Add New Project"
4. Import your repository
5. Configure project:
   - Framework: Vite
   - Root Directory: frontend
6. Add environment variable:
   - `VITE_API_URL`: `https://your-render-api.onrender.com/api`
7. Click Deploy

### Deploy Backend to Render

1. Go to https://render.com
2. Click "New +"
3. Select "Web Service"
4. Connect GitHub
5. Select repository
6. Configure:
   - Name: desonline-backend
   - Environment: Node
   - Region: Choose closest region
   - Build Command: `npm install && npm run prisma:generate`
   - Start Command: `npm start`
   - Root Directory: backend
7. Add environment variables:
   - `DATABASE_URL`: PostgreSQL connection string
   - `JWT_SECRET`: Random secret
   - `NODE_ENV`: production
   - `PORT`: 3000 (Render default)
8. Click Create Web Service

### Add PostgreSQL to Render

1. In your Render account
2. Click "New +"
3. Select "PostgreSQL"
4. Create database
5. Copy connection string to backend environment

## Option 3: AWS Deployment

### Setup AWS Services

**1. EC2 for Backend**
```bash
# Launch Ubuntu instance
# Connect and run:
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Clone repo and deploy
git clone https://github.com/yourusername/desonline.git
cd desonline/backend
npm install
npm run prisma:generate
npm run prisma:migrate
npm start
```

**2. RDS for Database**
- Create PostgreSQL instance
- Update security groups
- Get connection string
- Add to backend `.env`

**3. S3 + CloudFront for Frontend**
```bash
cd frontend
npm run build

# Upload dist folder to S3
aws s3 sync dist/ s3://your-bucket-name/

# CloudFront for CDN
# Set origin to S3 bucket
```

## Post-Deployment

### 1. Update DNS

For custom domain (e.g., desonline.com):

```bash
# Update A record to point to your server
# Or CNAME to platform's domain
```

### 2. SSL Certificate

- Railway/Render: Automatic HTTPS
- AWS: Use ACM (AWS Certificate Manager)
- Custom servers: Use Let's Encrypt with Certbot

### 3. Environment Variables

Update `.env` files for production:

**Backend:**
```
DATABASE_URL=postgresql://...production...
JWT_SECRET=your-long-random-secret-key
NODE_ENV=production
FRONTEND_URL=https://yourdomain.com
```

**Frontend:**
```
VITE_API_URL=https://api.yourdomain.com/api
```

### 4. Database Backup

Schedule automatic backups:
- Railway: Built-in
- Render: Built-in
- AWS RDS: Enable automated backups
- Manual: Regular `pg_dump` backups

### 5. Monitoring

Set up uptime monitoring:
- https://upptime.js.org
- https://www.updown.io
- https://www.statuspage.io

## Scaling Considerations

### Horizontal Scaling
- Use load balancer
- Run multiple backend instances
- Railway/Render handle this automatically

### Database Optimization
- Add indexes for frequently queried fields
- Use connection pooling (PgBouncer)
- Archive old data

### Caching
- Implement Redis for session storage
- Cache course listings
- Cache user enrollments

### CDN for Files
- CloudFront for thumbnails
- CloudFront for video streaming
- S3 for file storage

## Monitoring & Maintenance

### Health Checks
```bash
# Backend health endpoint
curl https://api.yourdomain.com/api/health
```

### Logs
- Check server logs regularly
- Set up email alerts for errors
- Use centralized logging

### Security Updates
- Keep Node.js updated
- Update npm packages monthly
- Monitor security advisories

## Troubleshooting Deployment

### Connection Timeout
- Check firewall rules
- Verify environment variables
- Check database connectivity

### Build Failures
- Check log output
- Verify Node version compatibility
- Ensure all dependencies installed

### Database Migration Errors
- Check existing schema
- Verify migration files
- Roll back if needed

### CORS Issues
- Update `FRONTEND_URL` in backend
- Check if frontend sending correct origin
- Verify CORS middleware config

## Rollback Plan

If deployment fails:

```bash
# Git rollback
git revert <commit-hash>
git push

# Railway/Render auto-deploys from git

# Database rollback
# Use backup from before deployment
```

## Performance Tips

### Frontend
- Enable minification
- Compress images
- Use code splitting
- Lazy load routes

### Backend
- Enable caching headers
- Compress responses
- Use pagination
- Optimize database queries

### Database
- Create indexes on foreign keys
- Archive old data
- Regular maintenance (VACUUM)

## Continuous Deployment

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Railway
        run: |
          npm install -g railway
          railway up --service backend --detach
          railway up --service frontend --detach
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}
```

## Cost Estimation

### Railway (Recommended)
- Database: $5-50/month
- Backend: $5-50/month
- Frontend: Free (included)
- Total: ~$10-100/month

### Vercel + Render
- Frontend: $0-20/month
- Backend: $7+/month
- Database: $15+/month
- Total: ~$22+/month

### AWS
- EC2: $10-50/month
- RDS: $15-100/month
- S3: $1-10/month
- Total: ~$26-160/month

## Support & Documentation

- Railway Docs: https://docs.railway.app
- Render Docs: https://render.com/docs
- AWS Docs: https://docs.aws.amazon.com
- PostgreSQL Docs: https://www.postgresql.org/docs

---

Choose a platform that suits your needs and budget!
