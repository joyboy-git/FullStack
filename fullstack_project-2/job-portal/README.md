# Full Stack Job Portal Architecture & Implementation Guide

This document serves as a comprehensive guide explaining the architecture, the purpose of every module, and why each component was implemented in this Job Portal project.

---

## 🏗️ 1. Overall Architecture

This application is built using the **MERN Stack** (MongoDB, Express, React, Node.js) and is split into two distinct parts:
1. **Frontend (`client/`)**: A React Single Page Application (SPA) built with Vite and Tailwind CSS.
2. **Backend (`server/`)**: A Node.js API built with Express that talks to a MongoDB database.

The purpose of this separation is to allow the frontend to run independently and communicate with the backend purely through RESTful API requests. This is the industry standard for modern web applications.

---

## ⚙️ 2. Backend Implementation (`server/`)

The backend is responsible for data storage, business logic, security, and authentication.

### `server.js` (The Entry Point)
**Purpose:** This is the heart of the backend. It initializes the Express application, connects to the database, sets up middleware (like CORS and JSON parsing), and maps URL routes to their respective handlers.

### `config/db.js` (Database Connection)
**Purpose:** Manages the connection to the MongoDB database. 
- **Implementation:** Initially, this used an in-memory test database, but we upgraded it to use **MongoDB Atlas** so your data (users, jobs, etc.) is permanently and securely stored in the cloud.

### `models/` (Data Structure)
**Purpose:** Defines the blueprint (Schema) for how data is stored in the database using Mongoose.
- **`User.js`**: Stores user credentials, roles (seeker vs recruiter), profile information, and OTP reset fields. It also hashes the password using `bcrypt` before saving it to the database for security.
- **`Job.js`**: Stores job postings created by recruiters.
- **`Application.js`**: Links a Seeker to a Job they applied for, tracking the application status.

### `routes/` (API Endpoints)
**Purpose:** Defines the URLs that the frontend can call.
- **`authRoutes.js`**: Handles Login, Register, Forgot Password, and Reset Password.
- **`userRoutes.js`**: Handles fetching and updating profile information.
- **`jobRoutes.js`**: Handles fetching, creating, updating, and deleting jobs.

### `controllers/` (Business Logic)
**Purpose:** Contains the actual logic that executes when a route is called.
- **`authController.js`**: Verifies passwords, generates JWT tokens, and handles the OTP email generation logic.
- **`userController.js`**: Updates the user profile and handles the extra security logic (requiring OTP verification) when changing a password from the profile.

### `middlewares/` (Gatekeepers)
**Purpose:** Functions that run *before* the controller logic to intercept and check requests.
- **`authMiddleware.js`**: Protects private routes by checking if the user sent a valid JWT token.
- **`uploadMiddleware.js`**: Uses `multer` to handle resume file uploads from the frontend and safely save them to the `server/uploads/` directory.

### `utils/` (Helper Functions)
- **`sendEmail.js`**: Uses `nodemailer` to send OTP emails. Configured to use Ethereal for safe local testing without requiring real email credentials.

---

## 💻 3. Frontend Implementation (`client/`)

The frontend is responsible for the User Interface, managing state, and communicating with the backend.

### `src/context/AuthContext.jsx` (Global State)
**Purpose:** Acts as the central brain for user authentication on the frontend.
- **Implementation:** When a user logs in, this context stores their user data and token in `localStorage`. This allows the entire app to instantly know if the user is logged in, what their role is, and ensures they stay logged in even after refreshing the page.

### `src/services/api.js` (API Interceptor)
**Purpose:** A centralized Axios instance used to make HTTP requests to the backend.
- **Implementation:** Instead of manually attaching the JWT token to every single request, this service uses an interceptor to automatically add the `Authorization: Bearer <token>` header to all outgoing requests.

### `src/components/` (Reusable UI)
**Purpose:** Small, reusable pieces of the interface.
- **`Navbar.jsx`**: The navigation menu that dynamically changes based on whether the user is logged in or out, and whether they are a seeker or recruiter.
- **`ProtectedRoute.jsx`**: A wrapper component that forces users back to the login page if they try to access private pages (like the Dashboard or Profile) without being logged in.

### `src/pages/` (Application Views)
**Purpose:** The main screens of the application.
- **`Login.jsx` & `Register.jsx`**: Handles user onboarding.
- **`ForgotPassword.jsx`**: A 2-step flow allowing users to reset their passwords using an emailed OTP.
- **`Profile.jsx`**: Allows users to update their details and upload a resume. Implements extra security by requesting an OTP if the user attempts to change their password.
- **`Dashboard.jsx`**: Dynamic dashboard. Seekers see their applied jobs; Recruiters see the jobs they posted and can review applicants.

---

## 🚀 4. Summary of Key Upgrades We Implemented

1. **Persistent Cloud Storage:** Transitioned from a volatile memory database to MongoDB Atlas, ensuring credentials and data are permanently saved across server restarts.
2. **File Upload Fixes:** Automated the creation of the `uploads/` directory on the server to prevent `ENOENT` crashes when saving resumes.
3. **Mongoose Version Fix:** Updated outdated callback patterns (`next`) in the Mongoose `User` model to modern `async/await` patterns, preventing "next is not a function" crashes during user creation and profile updates.
4. **OTP Security:** Added full end-to-end OTP email verification using NodeMailer for resetting passwords (both from the login screen and the profile page).
