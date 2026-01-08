<div align="center">
  <h1>🚀 Lead Sync Flow</h1>
  
  <p>
    <strong>A high-performance, enterprise-grade lead management system featuring a cutting-edge dark-themed UI and robust role-based access control.</strong>
  </p>
  
  <div>
    <img src="https://img.shields.io/badge/React-18.2+-61DAFB?style=for-the-badge&logo=react&logoColor=white" alt="React" />
    <img src="https://img.shields.io/badge/Vite-5.0+-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
    <img src="https://img.shields.io/badge/TailwindCSS-3.0+-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="TailwindCSS" />
    <img src="https://img.shields.io/badge/Node.js-18.0+-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js" />
    <img src="https://img.shields.io/badge/MongoDB-Latest-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
  </div>
  
  <p>
    <a href="#-features">✨ Features</a> •
    <a href="#-architecture">🏗️ Architecture</a> •
    <a href="#-dashboards">📊 Dashboards</a> •
    <a href="#-getting-started">🚀 Quick Start</a>
  </p>
</div>

---

## 💡 Overview

**Lead Sync Flow** is a sophisticated platform designed to streamline lead acquisition, management, and conversion. It features a modern design system with a premium "Glassmorphism" aesthetic, providing a seamless user experience across multiple administrative and operational roles.

---

## ✨ Features

### 🔐 Advanced Authentication & Security
- **Multi-Role System**: Support for Super Admin, Admin, Manager, Lead Qualifier, Data Minor, and more.
- **Request-Based Signup**: New users register with a department; accounts must be approved by Super Admin before access is granted.
- **JWT Session Management**: Secure token-based authentication with automatic expiry monitoring and auto-logout.
- **Middleware Protection**: Robust server-side verification with detailed audit logging for security events.

### 🎨 Premium UI/UX
- **Modern Aesthetic**: High-contrast dark mode with vibrant glassmorphism effects and fluid gradients.
- **Responsive Layout**: Fully optimized for Desktop, Tablet, and Mobile devices.
- **Micro-interactions**: Smooth transitions, hover effects, and loading states for an elite user experience.
- **Real-time Feedback**: Interactive notifications and status badges.

### 🛠️ Operation Features
- **Centralized Dashboard Configuration**: Easily manageable dynamic routing system.
- **Lead Pipeline**: Visual tracking of leads across different stages.
- **User Management**: Comprehensive tools for approving, rejecting, and promoting users.
- **Analytics Engine**: Visual data representation for performance tracking.

---

## 🏗️ Directory Structure

```
leadsyncflow/
├── 📁 leadsyncflow/           # 🔙 Backend (Node.js/Express)
│   ├── 📁 config/             # Database & environment config
│   ├── 📁 controllers/        # Business logic for auth & admin
│   ├── 📁 middlewares/        # Auth guards & Super Admin verification
│   ├── 📁 models/             # Mongoose schemas (User, etc.)
│   └── 📁 routes/             # API endpoint definitions
└── 📁 src/                    # 🔜 Frontend (React/Vite)
    ├── 📁 api/                # Axios instance & centralized API calls
    ├── 📁 auth/               # Signup/Login flows with approval logic
    ├── 📁 components/         # Reusable UI & Token Status monitoring
    ├── 📁 dashboards/         # Role-specific dashboard pages
    │   ├── 📁 super-admin/    # Master control panel
    │   ├── 📁 data-minor/     # Data entry & file management
    │   └── 📁 lead-qualifier/ # Lead verification workflows
    ├── 📁 layouts/            # Shared Dashboard Layout with sidebar/header
    ├── 📁 routes/             # Dynamic and Protected route management
    └── 📁 utils/              # Token manager & role-based helpers
```

---

## 📊 Dashboards & Roles

The system is built on a modular configuration allowing dedicated environments for each role:

| Dashboard | Key Responsibilities | Primary Features |
|-----------|----------------------|------------------|
| **Super Admin** | Platform Governance | User Approval, Role Assignment, Global Analytics |
| **Admin** | Operations Oversight | Reporting, Team Management, Data Review |
| **Manager** | Team Leadership | Performance Tracking, Team Coordination |
| **Lead Qualifier** | Lead Validation | Qualification Pipeline, Status Updates |
| **Data Minor** | Data Management | Bulk File Uploads, Lead Entry, Employee Lists |
| **Support** | System Assistance | Ticket Management, User Support |

---

## 🚀 Quick Start

### 📋 Prerequisites
- **Node.js**: v18.0+
- **MongoDB**: Account or local installation
- **npm**: v9.0+

### ⚡ Installation

#### 1️⃣ Environment Configuration
Create a `.env` file in both `leadsyncflow/` (Backend) and the root (Frontend) directories based on the project requirements.

#### 2️⃣ Backend Setup
```bash
cd leadsyncflow
npm install
npm run start # Typically runs on port 5000
```

#### 3️⃣ Frontend Setup
```bash
# In the root directory
npm install
npm run dev # Typically runs on port 5173
```

---

## 🛠️ Technology Stack

- **Frontend**: React 18, Vite, TailwindCSS, React Router 6, Axios
- **Backend**: Node.js, Express, Mongoose, JWT (JsonWebToken)
- **State Management**: React Hooks & Context
- **Icons**: Lucide React / Custom SVG
- **Styling**: Modern CSS Variables & Utility-first CSS

---

<div align="center">
  <h3>🚀 High-Performance Lead Management</h3>
  <p>Built for scale. Designed for speed. Secured for enterprise.</p>
</div>
