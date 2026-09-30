# IoT Knowledge Portal

A comprehensive, production-quality educational and technical reference platform designed for electronics engineering students, hardware developers, and IoT architects. Browse IoT devices category-wise and learn about each device, including its electrical symbols, physical working principles, verified specifications, real-world applications, step-by-step usage, pin configurations, connection diagrams, advantages, limitations, and example projects.

---

## 🌟 Key Features

* **32+ Verified IoT Hardware Catalog**: Deep technical specifications and pinout tables across sensors, actuators, microcontrollers, single-board computers, and communication transceivers.
* **18 Database-Driven Hardware Categories**: Sensors, Actuators, Microcontrollers, Development Boards, LPWAN Modules, Edge Computing, Industrial Gateways, Agriculture IoT, and more.
* **Working Principle & Physical Signal Flow**: Explains transducer physics from raw environmental stimulus through internal ADCs to host microcontroller communication.
* **Pin Configuration & Connection Diagrams**: Pinout tables categorized by signal type (Power, Ground, Analog, Digital, PWM, I2C, SPI, UART) and breadboard connection steps.
* **Dual Authentication System**:
  * Secure Email/Password registration with bcrypt (12 rounds) and password complexity enforcement.
  * Google OAuth 2.0 integration with server-side identity verification.
  * Short-lived access JWTs (15 min) kept in memory.
  * HTTP-only, secure, SameSite refresh token rotation (7 days) with database-backed token revocation.
* **Role-Based Access Control (RBAC)**: Distinguishes standard users from platform administrators (`USER` vs `ADMIN`).
* **Personalized Dashboard & Bookmarks**: Authenticated users can save devices to their personal technical library and review recently viewed hardware (capped at 20).
* **Multi-Filter & Debounced Search**: Fast filtering by category, communication protocol (I2C, SPI, UART, Wi-Fi, BLE, LoRa, CAN), difficulty level, and keywords.
* **Administrative Control Center**:
  * Add, edit, publish, and delete devices with an organized multi-section tabbed editor.
  * Full category management (CRUD with dynamic icon selection).
  * User permission management (promote/demote roles, delete accounts).
  * System metrics and communication protocol distribution breakdowns.
* **Adaptive Dark & Light Mode**: User preference persisted in `localStorage` with sleek technical styling.
* **Mobile-First Responsive Design**: Touch-friendly navigation drawers, responsive tables, and collapsible filters.

---

## 🛠️ Technology Stack

### Frontend
* **React 18** with **TypeScript** (Strict Mode)
* **Vite** for fast HMR and optimized production bundles
* **Tailwind CSS** with dark mode support and custom brand typography
* **React Router v6** for client-side routing and protected routes
* **Axios** with request/response interceptors for silent token refresh
* **Lucide React** for technical iconography

### Backend
* **Node.js** & **Express.js** with **TypeScript**
* **MongoDB** with **Mongoose** (indexing, TTL token cleanup, compound text search)
* **JSON Web Tokens (JWT)** for access and refresh tokens
* **bcryptjs** for cryptographic password hashing
* **Google Auth Library** for server-side Google ID token validation
* **Security Suite**: Helmet, CORS with credentials, express-rate-limit, cookie-parser, Zod schema validation

---

## 📁 Monorepo Project Structure

```text
iot-knowledge-portal/
├── client/
│   ├── public/
│   │   └── favicon.svg
│   ├── src/
│   │   ├── components/
│   │   │   ├── category/     # CategoryCard
│   │   │   ├── common/       # Modals, Badges, Loaders
│   │   │   ├── device/       # DeviceCard, DeviceSymbol, PinoutTable, SpecificationTable, WorkingPrincipleFlow, ConnectionDiagramView
│   │   │   └── layout/       # Navbar, Footer, MainLayout, ProtectedRoute
│   │   ├── context/          # AuthContext, ThemeContext
│   │   ├── pages/            # Home, Categories, CategoryDetail, DevicesBrowse, DeviceDetail, SearchPage, About, Login, Register, ForgotPassword, ResetPassword, OAuthCallback, UserDashboard, Profile, Bookmarks
│   │   │   └── admin/        # AdminDashboard, AdminDevicesList, AdminDeviceForm, AdminCategoriesList, AdminUsersList
│   │   ├── services/         # Axios instance (api.ts), authService, deviceService, categoryService, userService, statsService
│   │   ├── types/            # TypeScript interfaces
│   │   ├── App.tsx           # Route configurations
│   │   ├── index.css         # Tailwind directives & scrollbar styles
│   │   └── main.tsx          # Application entry point
│   ├── package.json
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   └── vite.config.ts
│
├── server/
│   ├── src/
│   │   ├── config/           # db.ts (Mongoose), env.ts (Typed ENV)
│   │   ├── controllers/      # authController, userController, deviceController, categoryController, statsController
│   │   ├── middleware/       # auth (JWT & RBAC), errorHandler, rateLimiter, validate (Zod)
│   │   ├── models/           # User, Category, Device, RefreshToken
│   │   ├── routes/           # authRoutes, userRoutes, categoryRoutes, deviceRoutes, statsRoutes
│   │   ├── seed/             # categoriesData.ts (18 cats), devicesData.ts (32 devices), seed.ts
│   │   ├── services/         # authService, googleAuthService
│   │   ├── tests/            # api.test.ts (Vitest test suite)
│   │   ├── utils/            # jwt.ts, slugify.ts
│   │   ├── app.ts            # Express setup with middleware
│   │   └── index.ts          # Server entry point
│   ├── package.json
│   ├── tsconfig.json
│   └── vitest.config.ts
│
├── .env.example              # Sample environment configuration
├── package.json              # Monorepo root with concurrent scripts
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
* **Node.js**: `v18.0.0` or higher (tested on Node v22)
* **npm**: `v9.0.0` or higher
* **MongoDB**: A running local MongoDB instance on port `27017` or a MongoDB Atlas URI

### 1. Installation

Clone or open the project repository directory:

```bash
cd iot-knowledge-portal
npm install
```

This installs dependencies for both `server` and `client` workspaces concurrently.

---

### 2. Environment Configuration

Copy the example environment file into `server/.env`:

```bash
cp .env.example server/.env
```

Ensure `server/.env` contains the required settings:

```env
# Server Configuration
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# Database
MONGODB_URI=mongodb://127.0.0.1:27017/iot_knowledge_portal

# JWT Secrets (Minimum 32 random characters in production)
JWT_ACCESS_SECRET=iot_portal_super_secure_access_token_secret_2026_xYz987
JWT_REFRESH_SECRET=iot_portal_super_secure_refresh_token_secret_2026_aBc123
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Google OAuth (Optional in local development)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

# Initial Administrator Account (automatically provisioned during seed)
ADMIN_EMAIL=admin@iotportal.com
ADMIN_PASSWORD=AdminPass123!
ADMIN_NAME=Portal Administrator
```

---

### 3. Database Seeding

Populate the database with all 18 categories, 32 comprehensive IoT devices, and the initial administrator account:

```bash
npm run seed
```

Output:
```text
[Database] MongoDB Connected: 127.0.0.1/iot_knowledge_portal
[Seed] Starting database seeding process...
[Seed] Processing 18 categories...
[Seed] Successfully synchronized 18 categories.
[Seed] Processing 32 devices...
[Seed] Successfully synchronized 32 devices.
[Seed] Updating category device counts...
[Seed] Administrator account successfully created: admin@iotportal.com
[Seed] Database seeding completed successfully! ✨
```

---

### 4. Running in Development Mode

To start both the backend API server (`http://localhost:5000`) and the Vite client application (`http://localhost:5173`) simultaneously:

```bash
npm run dev
```

Alternatively, you can start each service individually:

```bash
# Terminal 1: Backend
npm run dev:server

# Terminal 2: Frontend
npm run dev:client
```

Open your browser at `http://localhost:5173`.

---

## 🔑 Default Credentials (Development)

| Role | Email | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@iotportal.com` | `AdminPass123!` | Full admin console (`/admin`), manage devices, categories, users |
| **Student / User** | Any registered email | Min. 8 characters | Dashboard (`/dashboard`), bookmarks (`/bookmarks`), profile |

---

## 🧪 Automated Testing

Run the Vitest backend test suite:

```bash
npm test
```

Test coverage includes:
* User registration and duplicate email rejection
* Password verification and bcrypt validation
* JWT issuance and HTTP-only cookie configuration
* Silent refresh token rotation and revocation
* Role-based authorization (403 verification for non-admins)
* Device CRUD, search indexing, and pagination
* User bookmark addition, removal, and listing

---

## 📡 REST API Reference

### Authentication (`/api/auth`)
* `POST /api/auth/register` — Register a new user account.
* `POST /api/auth/login` — Sign in with email and password.
* `POST /api/auth/refresh` — Exchange refresh token cookie for a new access token.
* `POST /api/auth/logout` — Invalidate refresh token and clear cookie.
* `GET /api/auth/me` — Retrieve current authenticated user (`Bearer token required`).
* `GET /api/auth/google` — Retrieve Google OAuth consent URL.
* `GET /api/auth/google/callback` — Google OAuth code exchange handler.
* `POST /api/auth/google/token` — Verify Google credential token.
* `POST /api/auth/forgot-password` — Request password reset instructions.
* `POST /api/auth/reset-password` — Set new password using reset token.

### User Workspace (`/api/users`)
* `GET /api/users/profile` — Get profile information.
* `PUT /api/users/profile` — Update name or avatar URL.
* `GET /api/users/bookmarks` — List bookmarked devices.
* `POST /api/users/bookmarks/:deviceId` — Add device to bookmarks.
* `DELETE /api/users/bookmarks/:deviceId` — Remove device from bookmarks.
* `GET /api/users/recently-viewed` — List up to 20 recently viewed devices.
* `POST /api/users/recently-viewed/:deviceId` — Record device view timestamp.
* `GET /api/users/admin/all` — List all registered users (`Admin only`).
* `PUT /api/users/admin/:id/role` — Update user role (`Admin only`).
* `DELETE /api/users/admin/:id` — Delete user account (`Admin only`).

### Hardware Categories (`/api/categories`)
* `GET /api/categories` — List all 18 categories with dynamic device counts.
* `GET /api/categories/:slug` — Retrieve single category details by slug.
* `POST /api/categories` — Create category (`Admin only`).
* `PUT /api/categories/:id` — Update category (`Admin only`).
* `DELETE /api/categories/:id` — Delete category (`Admin only`, checks device associations).

### Hardware Devices (`/api/devices`)
* `GET /api/devices` — Paginated catalog with multi-filters (`category`, `protocol`, `difficulty`, `search`, `sort`).
* `GET /api/devices/search` — Text search query across names, descriptions, tags, and protocols.
* `GET /api/devices/featured` — Curated featured devices.
* `GET /api/devices/:slug` — Full technical device specification, pinout, and diagram by slug.
* `POST /api/devices` — Create new device (`Admin only`).
* `PUT /api/devices/:id` — Update device specifications (`Admin only`).
* `DELETE /api/devices/:id` — Delete device (`Admin only`).
* `PATCH /api/devices/:id/publish` — Toggle published state (`Admin only`).

### Platform Metrics (`/api/stats`)
* `GET /api/stats/overview` — Platform metrics, protocol breakdowns, and counts (`Admin only`).

---

## 🔒 Security Best Practices

1. **No LocalStorage Token Leakage**: Sensitive refresh tokens are stored exclusively in `httpOnly`, `SameSite: Lax` (or `None` over SSL), `secure` cookies. Access tokens reside solely in memory and refresh silently via Axios interceptors.
2. **Password Cryptography**: Passwords hashed with `bcryptjs` using 12 salt rounds.
3. **Helmet Security Headers**: Applies DNS prefetch control, frameguard, HSTS, and XSS filtering.
4. **Rate Limiting**: Authentication endpoints are rate-limited to prevent brute-force attacks.
5. **MongoDB Injection Protection**: ObjectIDs are validated and queries sanitized.
6. **Input Validation**: Strict Zod schema parsing on all user-supplied request payloads.

---

## 🌐 Production Deployment

1. Set `NODE_ENV=production` in the production environment.
2. Generate cryptographically strong random secrets for `JWT_ACCESS_SECRET` and `JWT_REFRESH_SECRET` (at least 64 random characters).
3. Build the frontend: `npm run build --workspace=client`.
4. Build the backend: `npm run build --workspace=server`.
5. Serve the backend with a process manager like **PM2**:
   ```bash
   pm2 start server/dist/index.js --name "iot-portal-api"
   ```
6. Serve the `client/dist` static assets via **Nginx** or **Caddy** with SSL/TLS termination and reverse proxy `/api` requests to `http://127.0.0.1:5000`.

---

## 📄 License
This project is licensed under the MIT License.
