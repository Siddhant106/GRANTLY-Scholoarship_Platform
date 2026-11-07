# 🎓 Grantly — AI-Powered Smart Scholarship Discovery & Management Platform

[![MERN Stack](https://img.shields.io/badge/Stack-MERN-blue.svg)](https://mongodb.com)
[![Vite](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-646CFF.svg)](https://vitejs.dev)
[![TailwindCSS](https://img.shields.io/badge/Styling-Tailwind%20CSS-38B2AC.svg)](https://tailwindcss.com)
[![Redis Cloud](https://img.shields.io/badge/Caching-Redis%20Cloud-DC382D.svg)](https://redis.io)
[![Google Gemini](https://img.shields.io/badge/AI-Google%20Gemini-8E75B2.svg)](https://deepmind.google/technologies/gemini/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**Grantly** is a modern, full-stack web platform engineered to eliminate the friction in higher-education financial aid discovery and application management. By combining a high-performance **MERN** architecture with **Redis Cloud** caching and **Google Gemini AI**, Grantly empowers students to discover tailored scholarships, track real-time application statuses, and receive intelligent, personalized advisory support.

---

## 📖 Table of Contents
1. [Problem Statement & Solution Alignment](#-problem-statement--solution-alignment)
2. [Key Features & Innovation](#-key-features--innovation)
3. [System Architecture & Data Flow](#-system-architecture--data-flow)
4. [Tech Stack Deep Dive](#-tech-stack-deep-dive)
5. [Database Schema Design](#-database-schema-design)
6. [Performance, Accessibility & Security](#-performance-accessibility--security)
7. [Comprehensive API Reference](#-comprehensive-api-reference)
8. [Project Directory Structure](#-project-directory-structure)
9. [Local Development & Installation Guide](#-local-development--installation-guide)
10. [Deployment & Production Readiness](#-deployment--production-readiness)
11. [Troubleshooting & FAQ](#-troubleshooting--faq)

---

## 🎯 Problem Statement & Solution Alignment

### The Challenge
Every year, billions of dollars in educational grants and scholarships go unclaimed due to fragmented information, complex eligibility criteria, and the absence of centralized application tracking. Students struggle to identify which opportunities match their specific academic profile and often miss critical deadlines.

### The Grantly Solution
Grantly provides a unified, student-centric ecosystem that solves these challenges through three core pillars:
1. **Precision Discovery:** Multi-dimensional filtering (Education Level, Field of Study) paired with instant client-side keyword search across scholarship titles and providers.
2. **Executive Application Tracking:** A centralized Student Dashboard featuring real-time status metrics (`Total Applied`, `Approved`, `Under Review`) to give applicants complete visibility into their financial aid pipeline.
3. **Contextual AI Advisory:** An embedded **AI Scholarship Advisor** powered by Google Gemini (`@google/genai`) with interactive quick-prompt suggestion pills that analyze student queries against their academic profile to deliver actionable guidance.

---

## ✨ Key Features & Innovation

### 🔍 1. Smart Scholarship Discovery Engine
- **Instant Keyword Search:** Real-time filtering by scholarship title or provider organization without page reloads.
- **Granular Academic Filters:** Filter dynamically by `Undergraduate` or `Postgraduate` levels and specific fields of study (e.g., Computer Science, Engineering, Arts).
- **Graceful Loading States:** Custom skeleton loaders that prevent Cumulative Layout Shift (CLS) while data is being fetched.

### 📊 2. Executive Student Dashboard
- **Real-Time KPI Metrics:** Instant visual summary cards calculating total applications submitted, approved grants, and pending reviews.
- **Status Badge System:** Color-coded, accessible status indicators (`Approved` in Emerald, `Pending` in Amber, `Rejected` in Rose) with Lucide iconography.
- **Academic Profile Badge:** Displays the student's verified education level directly in the dashboard header.

### 🤖 3. Gemini AI Scholarship Advisor
- **One-Click Quick Prompts:** Pre-configured interactive prompt pills (*"Undergraduate CS scholarships"*, *"Merit-based financial aid"*, *"Deadlines coming up this month"*) for zero-friction AI interaction.
- **Lazy SDK Initialization:** Resilient backend integration with Google Gemini AI that initializes on-demand and gracefully handles API fallbacks.

### ⚡ 4. Cloud-Native Redis Caching
- **Sub-Millisecond Reads:** Frequently requested scholarship listings are cached via **Redis Cloud** (`cast-unruffled-brass-82799.db.redis.io`), drastically reducing MongoDB Atlas read operations.
- **Fault-Tolerant Fallback:** Engineered with non-blocking connection logic—if the cache layer is unreachable, the server seamlessly falls back to primary MongoDB queries without downtime.

---

## 🏗️ System Architecture & Data Flow

```text
+-----------------------------------------------------------------------+
|                        CLIENT LAYER (React 18 + Vite)                 |
|  +--------------------+  +-------------------+  +------------------+  |
|  | ScholarshipListing |  | Student Dashboard |  | Auth Context/JWT |  |
|  +---------+----------+  +---------+---------+  +--------+---------+  |
+------------|-----------------------|---------------------|------------+
             | REST API (/api/*)     | Axios Interceptor   |
             v                       v                     v
+-----------------------------------------------------------------------+
|                     APPLICATION SERVER (Node.js + Express)            |
|  +--------------------+  +-------------------+  +------------------+  |
|  | Auth & RBAC Mdw    |  | Cache Middleware  |  | AI Controller    |  |
|  +---------+----------+  +---------+---------+  +--------+---------+  |
+------------|-----------------------|---------------------|------------+
             |                       |                     |
             v                       v                     v
    +----------------+      +-----------------+   +------------------+
    | MongoDB Atlas  |      |   Redis Cloud   |   | Google Gemini AI |
    | (Primary DB)   |      | (In-Memory KV)  |   | (@google/genai)  |
    +----------------+      +-----------------+   +------------------+
```

---

## 🛠️ Tech Stack Deep Dive

| Layer | Technology | Purpose & Justification |
| :--- | :--- | :--- |
| **Frontend UI** | React 18, Vite | Fast HMR, modular component architecture, and optimized production bundling. |
| **Styling** | Tailwind CSS | Utility-first responsive design, consistent spacing, and accessible color contrast. |
| **Icons** | Lucide React | Lightweight, consistent, and accessible SVG iconography. |
| **State & Routing** | React Context API, React Router v6 | Clean authentication state management and protected client-side routing. |
| **Backend API** | Node.js, Express.js | Scalable, event-driven RESTful API architecture. |
| **Database** | MongoDB Atlas, Mongoose | Flexible document schemas ideal for varying scholarship eligibility criteria. |
| **Caching** | Redis Cloud (`redis` v4+) | High-speed caching layer for public scholarship queries. |
| **AI Engine** | Google Gemini (`@google/genai`) | Context-aware natural language advising and scholarship matching. |
| **Security** | `jsonwebtoken`, `bcryptjs`, `cors` | Stateless JWT authentication, salted password hashing, and cross-origin protection. |

---

## 🗄️ Database Schema Design

### 1. User Model (`User.js`)
Stores student and administrator credentials along with academic profile metadata used for scholarship matching.
```javascript
{
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true }, // Hashed via bcryptjs
  role: { type: String, enum: ['student', 'admin'], default: 'student' },
  profile: {
    educationLevel: { type: String, enum: ['Undergraduate', 'Postgraduate'] },
    fieldOfStudy: { type: String },
    gpa: { type: Number }
  },
  createdAt: { type: Date, default: Date.now }
}
```

### 2. Scholarship Model (`Scholarship.js`)
Represents financial aid opportunities, funding amounts, deadlines, and eligibility rules.
```javascript
{
  title: { type: String, required: true, index: true },
  provider: { type: String, required: true },
  description: { type: String, required: true },
  amount: { type: Number, required: true },
  deadline: { type: Date, required: true },
  eligibility: {
    educationLevel: { type: String, enum: ['Undergraduate', 'Postgraduate', 'All'] },
    fieldOfStudy: { type: String },
    minGpa: { type: Number, default: 0.0 }
  },
  createdAt: { type: Date, default: Date.now }
}
```

### 3. Application Model (`Application.js`)
Tracks the many-to-many relationship between Students and Scholarships.
```javascript
{
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  scholarship: { type: mongoose.Schema.Types.ObjectId, ref: 'Scholarship', required: true },
  status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
  statementOfPurpose: { type: String },
  createdAt: { type: Date, default: Date.now }
}
```

---

## 🛡️ Performance, Accessibility & Security

- **Performance Optimization:**
  - **Redis Caching:** Reduces database query latency on `/api/scholarships` endpoints.
  - **Skeleton UI:** Eliminates layout jank during asynchronous API calls.
  - **Vite Code Splitting:** Minimizes initial JavaScript payload size.
- **Accessibility (a11y) & Responsive Design:**
  - Semantic HTML5 landmarks (`nav`, `main`, `section`, `form`, `label`).
  - Mobile-first responsive grid layouts (`grid-cols-1 md:grid-cols-2 lg:grid-cols-3`).
  - High-contrast status badges accompanied by descriptive icons and text labels (not relying on color alone).
- **Security Best Practices:**
  - Passwords hashed with `bcryptjs` (10 salt rounds) prior to database persistence.
  - Protected routes verified via custom `protect` JWT middleware (`Bearer <token>`).
  - Sensitive credentials isolated via `dotenv` environment variables.

---

## 📡 Comprehensive API Reference

### Authentication Endpoints
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `POST` | `/api/auth/register` | Register a new student account & return JWT | ❌ Public |
| `POST` | `/api/auth/login` | Authenticate existing user & return JWT | ❌ Public |
| `GET` | `/api/auth/me` | Retrieve current logged-in user profile | ✅ Bearer Token |

### Scholarship Endpoints
| Method | Endpoint | Query Params | Description | Auth Required |
| :--- | :--- | :--- | :--- | :---: |
| `GET` | `/api/scholarships` | `educationLevel`, `fieldOfStudy` | Get all scholarships (Redis cached) | ❌ Public |
| `GET` | `/api/scholarships/:id` | None | Get single scholarship details by ID | ❌ Public |
| `POST` | `/api/scholarships` | None | Create a new scholarship listing | 🔒 Admin |

### Application & AI Endpoints
| Method | Endpoint | Payload | Description | Auth Required |
| :--- | :--- | :--- | :--- | :---: |
| `POST` | `/api/applications` | `{ scholarshipId, statement }` | Submit a scholarship application | ✅ Student |
| `GET` | `/api/applications/my-applications` | None | Fetch all applications for logged-in student | ✅ Student |
| `POST` | `/api/ai/recommendations` | `{ studentQuery }` | Generate personalized Gemini AI advice | ✅ Student |

---

## 📂 Project Directory Structure

```text
GRANTLY-Scholoarship_Platform/
├── client/                                 # React + Vite Frontend Application
│   ├── public/                             # Static assets
│   ├── src/
│   │   ├── components/                     # Reusable UI components (Navbar, Cards, ProtectedRoute)
│   │   ├── context/
│   │   │   └── AuthContext.jsx             # Global authentication & user state provider
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx               # Student KPI metrics, application tracker & AI Advisor
│   │   │   ├── ScholarshipListing.jsx      # Searchable & filterable scholarship directory
│   │   │   ├── ScholarshipDetail.jsx       # Detailed view & one-click application submission
│   │   │   ├── Login.jsx                   # User login view
│   │   │   └── Register.jsx                # New student registration & profile onboarding
│   │   ├── services/
│   │   │   └── api.js                      # Pre-configured Axios instance with JWT interceptors
│   │   ├── App.jsx                         # Main router configuration
│   │   ├── main.jsx                        # React DOM entry point
│   │   └── index.css                       # Tailwind CSS directives & custom utilities
│   ├── index.html                          # HTML template
│   ├── vite.config.js                      # Vite build & /api proxy configuration
│   ├── tailwind.config.js                  # Tailwind theme customization
│   └── package.json                        # Frontend dependencies & scripts
│
├── server/                                 # Node.js + Express Backend API
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.js                       # MongoDB Atlas connection setup
│   │   │   └── redis.js                    # Redis Cloud client & fault-tolerant connector
│   │   ├── controllers/
│   │   │   ├── authController.js           # Registration, login, and profile handlers
│   │   │   ├── scholarshipController.js    # CRUD & filtered query handlers
│   │   │   ├── applicationController.js    # Student application submission & tracking
│   │   │   └── aiController.js             # Google Gemini AI recommendation logic
│   │   ├── middleware/
│   │   │   └── authMiddleware.js           # JWT verification & role-based access control
│   │   ├── models/
│   │   │   ├── User.js                     # Mongoose User schema
│   │   │   ├── Scholarship.js              # Mongoose Scholarship schema
│   │   │   └── Application.js              # Mongoose Application schema
│   │   ├── routes/
│   │   │   ├── authRoutes.js               # /api/auth routes
│   │   │   ├── scholarshipRoutes.js        # /api/scholarships routes
│   │   │   ├── applicationRoutes.js        # /api/applications routes
│   │   │   └── aiRoutes.js                 # /api/ai routes
│   │   └── server.js                       # Express app initialization & server entry point
│   ├── .env.example                        # Template for required environment variables
│   └── package.json                        # Backend dependencies & scripts
│
└── README.md                               # Comprehensive Project Documentation
```

---

## 🚀 Local Development & Installation Guide

### Prerequisites
Ensure you have the following installed on your machine:
- **Node.js** (v18.x or v22.x LTS recommended)
- **npm** (v9+ or v10+)
- **MongoDB Atlas** account (or local MongoDB instance running on port `27017`)
- **Redis Cloud** instance (optional; server continues gracefully if omitted)
- **Google Gemini API Key** (from Google AI Studio)

### Step 1: Clone the Repository
```bash
git clone https://github.com/Siddhant106/GRANTLY-Scholoarship_Platform.git
cd GRANTLY-Scholoarship_Platform
```

### Step 2: Configure & Start the Backend Server
```bash
cd server
npm install
```

Create a `.env` file in the `server/` root directory (do **not** wrap values in quotes):
```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/grantly?retryWrites=true&w=majority
JWT_SECRET=grantly_super_secure_jwt_key_2026_xyz987
REDIS_PASSWORD=your_redis_cloud_password
GEMINI_API_KEY=your_google_gemini_api_key
```

Start the backend in development mode:
```bash
npm run dev
```
*Expected Terminal Output:*
```text
🚀 Server running smoothly on port 5000
📦 MongoDB Connected: ac-efoevgg-shard-00-00.mufhgka.mongodb.net
🚀 Redis Connected Successfully to Cloud Endpoint!
```

### Step 3: Configure & Start the Frontend Client
Open a **second terminal window** at the project root:
```bash
cd client
npm install
npm run dev
```
The Vite development server will launch at **`http://localhost:5173`** with automatic `/api` proxying to `http://localhost:5000`.

---

## 🌐 Deployment & Production Readiness

### Frontend Deployment (Vercel)
1. Import the `GRANTLY-Scholoarship_Platform` repository into **Vercel**.
2. Set the **Root Directory** to `client`.
3. Set the **Framework Preset** to `Vite`.
4. Build Command: `npm run build` | Output Directory: `dist`.
5. Add Environment Variable `VITE_API_URL` pointing to your deployed backend URL.

### Backend Deployment (Render / Railway)
1. Create a new **Web Service** pointing to the `server` directory.
2. Build Command: `npm install` | Start Command: `npm start` (or `node src/server.js`).
3. Configure all environment variables (`MONGO_URI`, `JWT_SECRET`, `REDIS_PASSWORD`, `GEMINI_API_KEY`) in the hosting dashboard.

---

## 🔧 Troubleshooting & FAQ

1. **Vite Proxy Error (`AggregateError [ECONNREFUSED] /api/...`)**
   - **Cause:** The frontend Vite server is running, but the backend Express server on port `5000` is stopped or crashed.
   - **Fix:** Ensure a separate terminal is actively running `npm run dev` inside the `server/` folder.

2. **Redis Error (`WRONGPASS invalid username-password pair`)**
   - **Cause:** `dotenv.config()` was either not invoked at the top of `server/src/server.js` or the password in `.env` contains extra quotes/spaces.
   - **Fix:** Verify `require('dotenv').config();` is the very first line in `server.js` and remove quotes around `REDIS_PASSWORD` in `.env`.

---

## 👤 Author & Maintainer

**Siddhant Shukla**  
- **GitHub:** [@Siddhant106](https://github.com/Siddhant106)  
- **Live Demo:** [grantly-scholoarship-platform.vercel.app](https://grantly-scholoarship-platform.vercel.app)

---
*Built with ❤️ to make higher education accessible for everyone.*
