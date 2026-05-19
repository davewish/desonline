# Troubleshooting Guide

Common issues and their solutions.

## 🔧 Installation & Setup Issues

### Issue: npm install fails

**Error:**
```
npm ERR! code ERESOLVE
npm ERR! ERESOLVE unable to resolve dependency tree
```

**Solution:**
```bash
# Use legacy peer deps flag
npm install --legacy-peer-deps

# Or clear npm cache
npm cache clean --force
npm install
```

### Issue: `node-gyp` compilation errors

**Error:**
```
gyp ERR! build error
gyp ERR! stack Error: `make` failed with exit code
```

**Solution:**
```bash
# On macOS
xcode-select --install

# On Ubuntu
sudo apt-get install build-essential python3

# On Windows
# Install Microsoft C++ Build Tools from Microsoft's website
```

---

## 📦 Backend Issues

### Issue: Backend won't start

**Symptoms:**
- Server doesn't listen
- Port already in use
- Module not found errors

**Solutions:**

1. **Check Node version**
   ```bash
   node --version
   # Should be 16.0.0 or higher
   ```

2. **Check if port is in use**
   ```bash
   # macOS/Linux
   lsof -i :5000
   kill -9 <PID>
   
   # Windows
   netstat -ano | findstr :5000
   taskkill /PID <PID> /F
   ```

3. **Verify .env file**
   ```bash
   cat .env
   # Check DATABASE_URL exists
   ```

4. **Reinstall dependencies**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

### Issue: Cannot find module '@prisma/client'

**Error:**
```
Error: Cannot find module '@prisma/client'
```

**Solution:**
```bash
# Generate Prisma client
npm run prisma:generate

# If still fails
rm -rf node_modules/.prisma
npm run prisma:generate
```

### Issue: Prisma migration fails

**Error:**
```
Error: P3001 - Migration already applied or conflicting
```

**Solutions:**

1. **Check existing migrations**
   ```bash
   npm run prisma:migrate status
   ```

2. **Skip failed migration**
   ```bash
   npm run prisma:migrate deploy
   ```

3. **Reset database (⚠️ WARNING: Deletes all data)**
   ```bash
   npm run prisma:migrate reset
   npm run seed
   ```

### Issue: Database connection error

**Error:**
```
Error: getaddrinfo ENOTFOUND localhost
Can't reach database server
```

**Solutions:**

1. **Verify PostgreSQL is running**
   ```bash
   # macOS
   brew services list
   
   # Linux
   systemctl status postgresql
   
   # Windows
   # Check Services app
   ```

2. **Check DATABASE_URL format**
   ```
   postgresql://username:password@localhost:5432/desonline
   ```

3. **Test database connection**
   ```bash
   psql postgresql://user:password@localhost:5432/desonline
   ```

4. **Check firewall**
   ```bash
   # macOS/Linux
   lsof -i :5432  # Check if Postgres is listening
   ```

### Issue: File upload not working

**Error:**
```
TypeError: Cannot read property 'filename' of undefined
```

**Solutions:**

1. **Check uploads directory exists**
   ```bash
   ls -la uploads/
   ls -la uploads/videos/
   ls -la uploads/pdfs/
   ls -la uploads/thumbnails/
   ```

2. **Check file permissions**
   ```bash
   chmod -R 755 uploads/
   ```

3. **Verify Multer configuration**
   - Check middleware/uploadMiddleware.js
   - Verify file size limits

4. **Test file size**
   - Videos: Check < 50MB
   - PDFs: Check < 10MB
   - Thumbnails: Check < 5MB

### Issue: JWT token errors

**Error:**
```
JsonWebTokenError: invalid signature
```

**Solutions:**

1. **Verify JWT_SECRET matches**
   - Check .env file
   - Must be same on all token operations

2. **Check token format**
   - Token should start with "eyJ"
   - Contains exactly 3 parts separated by dots

3. **Generate new secret**
   ```bash
   # In .env
   JWT_SECRET=new_random_secret_key_12345
   ```

4. **Clear localStorage and login again**

---

## 🎨 Frontend Issues

### Issue: Frontend won't start

**Error:**
```
Error: ENOENT: no such file or directory
```

**Solution:**
```bash
# Make sure you're in frontend directory
cd frontend

# Verify Node modules
npm install

# Start dev server
npm run dev
```

### Issue: VITE_API_URL not working

**Error:**
```
fetch failed
Network error
Cannot reach backend
```

**Solutions:**

1. **Check .env.local exists**
   ```bash
   cat .env.local
   # Should contain: VITE_API_URL=http://localhost:5000/api
   ```

2. **Restart dev server after .env change**
   ```bash
   # Stop (Ctrl+C)
   # Start again
   npm run dev
   ```

3. **Verify backend is actually running**
   ```bash
   curl http://localhost:5000/api/health
   ```

4. **Check browser console**
   - DevTools → Console
   - Look for CORS or fetch errors

### Issue: "Cannot read property of undefined" errors

**Error:**
```
TypeError: Cannot read property 'id' of undefined
```

**Solutions:**

1. **Check API response**
   - Open DevTools → Network tab
   - Check API response is valid JSON

2. **Add error boundaries**
   ```jsx
   {data && data.id ? data.id : 'Loading...'}
   ```

3. **Check token expiration**
   - Look in localStorage
   - Try logging out and back in

### Issue: Styles not applying

**Symptoms:**
- Tailwind CSS not working
- CSS file appears empty

**Solutions:**

1. **Rebuild CSS**
   ```bash
   npm run dev
   # Wait for Vite to rebuild
   ```

2. **Check tailwind.config.js**
   - Verify content paths are correct
   - Should include "src/**/*.{js,jsx}"

3. **Clear browser cache**
   - Hard refresh: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)
   - Or Ctrl+F5

### Issue: Routes not working

**Error:**
```
Cannot find route
Page not found
```

**Solutions:**

1. **Check React Router setup**
   - Verify routes in App.jsx
   - Check route paths match

2. **Verify component imports**
   - Check file paths are correct
   - Check components export default

3. **Test route directly**
   ```
   http://localhost:3000/courses
   http://localhost:3000/login
   ```

---

## 🔒 Authentication Issues

### Issue: Login fails

**Error:**
```
Invalid credentials
Login failed
```

**Solutions:**

1. **Verify user exists in database**
   ```bash
   npm run prisma:studio
   # Check Users table
   ```

2. **Test credentials**
   ```bash
   curl -X POST http://localhost:5000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"user@example.com","password":"password"}'
   ```

3. **Check password hashing**
   - Password must be at least 6 characters
   - Check for spaces/special characters

4. **Check JWT_SECRET**
   - Must be set in .env
   - Must be non-empty string

### Issue: Token not saving

**Error:**
```
Token not in localStorage
Logout immediately after login
```

**Solutions:**

1. **Check browser localStorage**
   - DevTools → Application → Local Storage
   - Look for "token" key

2. **Verify setToken function**
   - Check AuthContext.jsx
   - Ensure localStorage.setItem is called

3. **Check for errors**
   - DevTools → Console
   - Look for error messages

### Issue: Protected routes showing login page

**Error:**
```
Redirected to /login
Cannot access /courses
```

**Solutions:**

1. **Check token is stored**
   - DevTools → Application
   - Verify token exists in localStorage

2. **Check token validity**
   - Token expires after 24 hours
   - Try logging out and in again

3. **Verify ProtectedRoute component**
   - Check src/components/ProtectedRoute.jsx
   - Ensure proper error handling

---

## 📊 Database Issues

### Issue: Cannot create database

**Error:**
```
createdb: error: could not connect to database
```

**Solutions:**

1. **Check PostgreSQL is installed**
   ```bash
   psql --version
   ```

2. **Check PostgreSQL is running**
   ```bash
   # macOS
   brew services start postgresql
   
   # Linux
   sudo systemctl start postgresql
   ```

3. **Create with specific user**
   ```bash
   createdb -U postgres desonline
   ```

### Issue: Data lost after migration

**Error:**
```
Data is gone after npm run prisma:migrate
```

**Solutions:**

1. **Never did reset?**
   - Check if reset was accidentally run
   - Restore from backup if available

2. **Export data before reset**
   ```bash
   pg_dump -U postgres desonline > backup.sql
   ```

3. **Restore from backup**
   ```bash
   psql -U postgres desonline < backup.sql
   ```

### Issue: Too many connections error

**Error:**
```
Error: too many clients for database
```

**Solutions:**

1. **Restart database**
   ```bash
   # macOS
   brew services restart postgresql
   ```

2. **Kill idle connections**
   ```bash
   PGPASSWORD=password psql -U postgres -d desonline \
     -c "SELECT pg_terminate_backend(pid) 
         FROM pg_stat_activity 
         WHERE datname='desonline' AND state='idle';"
   ```

---

## 🌐 Network & CORS Issues

### Issue: CORS error

**Error:**
```
Access to XMLHttpRequest blocked by CORS policy
```

**Solutions:**

1. **Check CORS middleware**
   - Verify backend/src/index.js has cors()
   - Check CORS configuration

2. **Verify frontend URL matches**
   - Backend should allow http://localhost:3000
   - Production: update to actual frontend URL

3. **Check request headers**
   - DevTools → Network → Headers
   - Look for Origin header

4. **Update CORS for production**
   ```javascript
   app.use(cors({
     origin: process.env.FRONTEND_URL || 'http://localhost:3000',
     credentials: true
   }))
   ```

### Issue: Cannot reach API from different machine

**Error:**
```
Network error
Failed to fetch
```

**Solutions:**

1. **Use machine IP instead of localhost**
   ```bash
   # Get IP
   ipconfig getifaddrs | grep inet  # macOS
   ifconfig | grep inet             # Linux
   
   # Update VITE_API_URL
   VITE_API_URL=http://192.168.1.100:5000/api
   ```

2. **Check firewall**
   - Allow port 5000 and 3000
   - Check router settings

3. **Test connectivity**
   ```bash
   curl http://192.168.1.100:5000/api/health
   ```

---

## 🐛 Common Build Errors

### Issue: "dev" script not found

**Error:**
```
npm ERR! Missing script: "dev"
```

**Solution:**
```bash
# Verify package.json has scripts
cat package.json | grep -A 5 '"scripts"'

# Should show "dev" entry
```

### Issue: Build folder not created

**Error:**
```
npm ERR! Failed to build
```

**Solutions:**

1. **Check Node version**
   ```bash
   node --version  # Should be 16+
   ```

2. **Clear cache**
   ```bash
   npm cache clean --force
   npm run build
   ```

3. **Check for syntax errors**
   - Look for red squiggles in VS Code
   - Run linter if available

---

## 📱 Mobile/Responsive Issues

### Issue: Navbar not responsive

**Solutions:**

1. **Check Tailwind breakpoints**
   - Verify hidden/block classes
   - Test on actual mobile device

2. **Check viewport meta tag**
   - Should be in index.html
   - `<meta name="viewport" content="width=device-width">`

3. **Test with DevTools**
   - DevTools → Toggle Device Toolbar
   - Try different screen sizes

---

## 🚀 Deployment Issues

### Issue: Deployment fails

**Error:**
```
Build failed
Deployment error
```

**Solutions:**

1. **Check environment variables**
   - Verify all required vars are set
   - Check VITE_API_URL is correct

2. **Check Node version compatibility**
   - Verify deployment platform Node version
   - Must be 16+

3. **Check database connection**
   - Production DATABASE_URL must be valid
   - Test connection before deploying

---

## 💡 Pro Tips

### Enable Debug Mode
```bash
# Backend
DEBUG=* npm run dev

# Frontend
# DevTools → Console
console.log(data)
```

### Check Network Tab
- Open DevTools → Network
- Filter by XHR
- View request/response
- Check headers and timing

### Use Postman
- Import API endpoints
- Test without frontend
- Debug API issues

### Read Error Messages
- Error messages are usually very specific
- Search the exact error online
- Check official documentation

---

## 🆘 Still Stuck?

1. **Check documentation**
   - README.md
   - ARCHITECTURE.md
   - API-CONFIG.md

2. **Search online**
   - Stack Overflow
   - GitHub Issues
   - Official docs

3. **Test components individually**
   - Isolate the problem
   - Test backend separately
   - Test frontend separately

4. **Use debugging tools**
   - console.log()
   - DevTools
   - Postman
   - Prisma Studio

---

**Remember**: Most issues have been solved before. Google the error message!
