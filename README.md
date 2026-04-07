# Agri Value

Full-stack Agri marketplace with:

- React + Vite frontend
- Express backend
- MySQL database
- JWT authentication for `admin`, `farmer`, and `buyer`

## Project structure

- `src/` - React frontend
- `server/` - Express API and MySQL bootstrap

## Setup

### 1. Frontend env

Create `D:\Agri Value\.env` from `D:\Agri Value\.env.example`

```env
VITE_API_URL=http://localhost:5000/api
```

### 2. Backend env

Create `D:\Agri Value\server\.env` from `D:\Agri Value\server\.env.example`

```env
PORT=5000
CLIENT_URL=http://localhost:5173
JWT_SECRET=change-this-secret
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=5616
DB_NAME=agri_value
```

### 3. Install dependencies

Frontend:

```powershell
cd "D:\Agri Value"
npm.cmd install
```

Backend:

```powershell
cd "D:\Agri Value\server"
npm.cmd install
```

### 4. Start MySQL

Make sure your MySQL server is running and that the configured user can create databases.

The backend auto-creates the `agri_value` database, tables, and seed data on first start.

### 5. Run backend

```powershell
cd "D:\Agri Value\server"
npm.cmd start
```

### 6. Run frontend

```powershell
cd "D:\Agri Value"
npm.cmd run dev
```

## Seeded accounts

- Admin: `admin@agrivalue.com` / `Admin@123`
- Farmer: `farmer@agrivalue.com` / `Farmer@123`
- Buyer: `buyer@agrivalue.com` / `Buyer@123`

## Implemented backend features

- user registration and login
- JWT session authentication
- profile update API
- product listing and farmer product management
- file upload for product images
- buyer cart, wishlist, and checkout
- buyer, farmer, and admin dashboards
- orders, transactions, analytics, and reports endpoints

## Build check

Frontend production build passes with:

```powershell
cd "D:\Agri Value"
npm.cmd run build
```

## Deployment notes

Recommended production setup:

- Frontend: Vercel or Netlify
- Backend API: Railway or Render web service
- Database: hosted MySQL such as Railway MySQL, Aiven, PlanetScale, or Hostinger MySQL
- Product images: S3-compatible object storage in production for reliable persistence

Frontend environment variables:

```env
VITE_API_URL=https://your-backend-domain.example.com/api
```

Backend environment variables:

```env
PORT=5000
CLIENT_URL=https://your-frontend-domain.example.com
CLIENT_URLS=https://your-frontend-domain.example.com,https://your-preview-domain.example.com
JWT_SECRET=replace-with-a-long-random-secret
DB_HOST=your-mysql-host
DB_PORT=3306
DB_USER=your-mysql-user
DB_PASSWORD=your-mysql-password
DB_NAME=agri_value
DB_SSL=false
STORAGE_PROVIDER=s3
S3_BUCKET=your-bucket
S3_REGION=your-region
S3_ENDPOINT=https://your-s3-endpoint.example.com
S3_ACCESS_KEY_ID=your-access-key
S3_SECRET_ACCESS_KEY=your-secret-key
S3_PUBLIC_BASE_URL=https://your-public-bucket-url.example.com
S3_FORCE_PATH_STYLE=false
```

Extra deployment details:

- `public/_redirects` is included for Netlify SPA routing.
- `netlify.toml` is included for Netlify build + SPA routing.
- `vercel.json` is included for Vercel SPA routing.
- `.node-version` pins Node `22.22.0` for consistent deploys.
- `server/Dockerfile` is included for Docker-based backend deploys on Railway or similar platforms.
- The backend now accepts multiple frontend origins through `CLIENT_URLS`.
- If your hosted MySQL provider requires SSL, set `DB_SSL=true`.
- If you keep `STORAGE_PROVIDER=local`, uploads stay on local disk and may not persist across some hosted deployments. Use S3-compatible storage in production.
