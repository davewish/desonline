# API Configuration Guide

## Base URL

```
Development: http://localhost:5000/api
Production: https://your-domain.com/api
```

## Authentication

All protected endpoints require a JWT token in the `Authorization` header:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Getting a Token

1. Register or login to get a token
2. Store it in localStorage (frontend handles this)
3. Send it with every protected request

## HTTP Status Codes

- `200`: Success
- `201`: Created
- `400`: Bad Request (validation error)
- `401`: Unauthorized (missing/invalid token)
- `403`: Forbidden (insufficient permission)
- `404`: Not Found
- `500`: Server Error

## Response Format

Success Response:
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    "id": 1,
    "name": "Example"
  }
}
```

Error Response:
```json
{
  "success": false,
  "message": "Error description"
}
```

## Rate Limiting

Currently not implemented. Consider adding for production:
- 100 requests per minute per IP
- 1000 requests per hour per user

## CORS Configuration

Configured to allow:
- Frontend development: http://localhost:3000
- Update in `backend/src/index.js` for production

```javascript
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}))
```

## API Consumers

### Web Frontend
- Requests from: http://localhost:3000
- Sends JWT in Authorization header
- Uses multipart/form-data for file uploads

### Mobile App (Future)
- Same API endpoints
- Same authentication method
- Mobile-specific endpoints can be added

## Testing API with cURL

### Register
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Get Courses (with pagination)
```bash
curl http://localhost:5000/api/courses?page=1&limit=10
```

### Get Protected Resource
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:5000/api/auth/profile
```

## Testing API with Postman

1. Import endpoints into Postman collection
2. Set environment variables:
   - `base_url`: http://localhost:5000/api
   - `token`: (obtained from login endpoint)
3. Use `{{base_url}}` in request URLs
4. Add token to Authorization tab

## Environment Variables Checklist

### Backend
- [ ] `DATABASE_URL` - PostgreSQL connection string
- [ ] `JWT_SECRET` - Random secret for signing tokens
- [ ] `PORT` - Server port (default: 5000)
- [ ] `NODE_ENV` - development/production
- [ ] `MAX_FILE_SIZE` - Max upload size (default: 50MB)
- [ ] `FRONTEND_URL` - Frontend origin for CORS (production)

### Frontend
- [ ] `VITE_API_URL` - Backend API URL

## Security Considerations

### Implemented
- ✅ JWT token authentication
- ✅ Password hashing with bcrypt
- ✅ CORS protection
- ✅ Role-based authorization
- ✅ File upload validation

### Recommended for Production
- [ ] HTTPS/SSL encryption
- [ ] Rate limiting
- [ ] Request validation
- [ ] SQL injection prevention (Prisma handles this)
- [ ] XSS protection
- [ ] CSRF tokens
- [ ] Input sanitization
- [ ] API key rotation
- [ ] Audit logging
- [ ] DDoS protection

## Monitoring & Logging

### Backend Logs
- All requests are logged to console
- Error stack traces are shown in development
- Production: Use services like:
  - Datadog
  - New Relic
  - CloudWatch
  - ELK Stack

### Frontend Logs
- Console logs for debugging
- Error boundary for crash reporting
- Use services like:
  - Sentry
  - LogRocket
  - Bugsnag

## API Versioning

Current version: v1 (implied in `/api` prefix)

Future versions can be implemented as:
- `/api/v1/courses` - Current
- `/api/v2/courses` - Future breaking changes

## Backwards Compatibility

All responses include `success` field for consistent error handling.

Breaking changes will be indicated in version numbers.

## Webhooks (Feature Request)

Potential webhooks for future implementation:
- User registration
- Course creation
- Lesson completion
- Enrollment events

## Analytics

Track these metrics:
- Active users
- Course popularity
- Lesson completion rates
- User retention
- Enrollment trends

## Support

For API issues:
1. Check error response message
2. Verify token validity
3. Check request format
4. Review console logs
5. Contact support with request/response details
