# Environment Variables Setup

## Required Environment Variables

For the backend to work properly, you need to set the following environment variables:

### 1. JWT_SECRET (Optional but Recommended)
- **Purpose**: Secret key for signing and verifying JWT tokens
- **Default**: Falls back to 'your-secret-key-change-in-production' if not set
- **How to set**: 
  ```bash
  JWT_SECRET=your-secure-random-string-here
  ```
- **For Render.com**: Add this in your Render dashboard under Environment Variables

### 2. FIREBASE_CREDENTIALS (Optional)
- **Purpose**: Firebase service account credentials as JSON string
- **Alternative**: FIREBASE_CREDENTIALS_BASE64 (base64 encoded version)
- **Default**: Falls back to hardcoded credentials if not set
- **How to set**: 
  ```bash
  FIREBASE_CREDENTIALS='{"type":"service_account",...}'
  ```
  OR
  ```bash
  FIREBASE_CREDENTIALS_BASE64=<base64-encoded-json>
  ```

### 3. PORT (Optional)
- **Purpose**: Port number for the server to listen on
- **Default**: 3000
- **How to set**: 
  ```bash
  PORT=3000
  ```
- **For Render.com**: Usually set automatically, but you can override if needed

## Deployment Checklist

- [ ] Set JWT_SECRET in your deployment platform (Render.com)
- [ ] Set FIREBASE_CREDENTIALS or FIREBASE_CREDENTIALS_BASE64 (or use fallback)
- [ ] Ensure PORT is set (usually auto-set by Render.com)
- [ ] Verify backend is accessible at: https://g-tech-backend-1.onrender.com
- [ ] Test health endpoint: https://g-tech-backend-1.onrender.com/health

## Testing

After deployment, test these endpoints:
1. Health check: `GET /health`
2. Get products: `GET /api/product`
3. Login: `POST /api/auth/login`
4. Get orders (admin): `GET /api/orders/allorders` (requires admin token)

