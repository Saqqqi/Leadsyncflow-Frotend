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

**Lead Sync Flow** is a sophisticated platform designed to streamline lead acquisition, management, and conversion. It features a modern design system with a premium "Glassmorphism" aesthetic, providing a seamless user experience across a strictly role-based operational environment.

---

## ✨ Key Features

### 🔐 Multi-Tier Security & Access
- **Dynamic Role-Based Access Control (RBAC)**: Secure access for Super Admin, Manager, Verifier, Lead Qualifier, and Data Minor.
- **Request-Based Signup**: New users register by department; accounts require manual Super Admin approval for activation.
- **Managed Session Security**: JWT-based authentication with high-integrity token management and auto-logout.
- **Protected Routing**: Advanced route guards ensuring users only see content authorized for their specific role.

### 🎨 Elite UI/UX Architecture
- **Glassmorphism Aesthetic**: Modern dark-themed interface with vibrant gradients, frosted glass effects, and depth.
- **Fully Responsive Core**: Seamless transition between Desktop, Tablet, and Mobile views.
- **Micro-animations**: Fluid transitions and interactive elements for a premium software feel.
- **Real-time UI Sync**: Instant feedback on actions with custom state management.

### ⚙️ Operational Excellence
- **Config-Driven Dashboards**: Centralized routing system in `dashboardConfig.jsx` for rapid scaling.
- **Dynamic Routing Engine**: Automatic route generation based on role configuration.
- **Lead Pipeline**: Multi-stage validation from entry (Data Minor) to verification (Verifier) to qualification (Lead Qualifier).
- **Real-time Duplicate Prevention**: Email and phone duplicate checking during data entry.
- **Audit & Analytics**: Visual performance metrics for supervisors and admins.

---

## 🏗️ Directory Structure

```
src/
├── 📁 api/                # 🌐 Centralized API layer (admin, data-minor, etc.)
├── 📁 auth/               # 🔑 Login/Signup flows & Authentication UI
├── 📁 components/         # 🧱 Shared UI components & Status monitoring
├── 📁 layouts/            # 🖼️ Persistent Dashboard & Auth layouts
├── 📁 routes/             # 🚦 Dynamic & Role-based routing logic
├── 📁 dashboards/         # 📊 Feature-rich role-specific modules
│   ├── 📁 super-admin/    # Governance: User approvals, roles, global stats
│   ├── 📁 data-minor/     # Operations: Lead entry, duplicate checks, uploads
│   ├── 📁 Verifier/       # Validation: Email verification, lead cleansing
│   ├── 📁 lead-qualifier/ # Qualification: Lead assignment, scoring, history
│   ├── 📁 manager/        # Leadership: Distribution tracking, team history
│   └── 📄 dashboardConfig.jsx # 🎯 The "Brain" of the dynamic routing system
└── 📁 utils/              # 🛠️ Token managers, role helpers & formatters
```

---

## 📊 Dashboards & Roles

The system utilizes a modular **Configuration-First** approach:

| Dashboard | Core Responsibility | Key Features |
|-----------|----------------------|--------------|
| **Super Admin** | Platform Governance | User Approval, Role Assignment, Global Stats |
| **Manager** | Strategic Oversight | Team History, Lead Distribution, Performance Tracking |
| **Verifier** | Data Integrity | Email Status Updates, Lead Cleansing, Batch Move |
| **Lead Qualifier** | Lead Maturity | Lead Scoring, Status Pipelines, Client Assignment |
| **Data Minor** | Acquisition | Bulk Uploads, Lead Entry, Real-time Duplicate Check |

---

## 🚀 Technical Architecture

### 📄 Config-Based Routing
The application uses a centralized `dashboardConfig.jsx` which defines:
- **Roles**: Allowed departments for each dashboard.
- **Base Paths**: Root URL for each module.
- **Pages**: Dynamic list of views with path, component, and sidebar visibility.

This allows adding new pages or entire dashboards without modifying the main routing logic.

### 🔌 API Integration
- **Axios Instance**: Standardized headers and error handling.
- **Modular APIs**: Segregated logic for Admin, Data Minor, and shared services.
- **Token Manager**: Centralized handling of React-to-Storage security.

---

## 🛠️ Technology Stack

- **Core**: React 18, Vite (for blazing fast builds)
- **Routing**: React Router 6 (with nested & dynamic configurations)
- **Styling**: TailwindCSS & Custom CSS Environment Variables
- **API**: Axios (with custom interceptors)
- **Icons**: Custom SVG Icons & Lucide React
- **Security**: JWT, localStorage Token Handling, Role Hierarchy

---

<div align="center">
  <h3>🚀 High-Performance Lead Management</h3>
  <p>Built for scale. Designed for speed. Secured for enterprise.</p>
</div>
