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

## 📊 Dashboards & Operational Flow

The system follows a strict linear pipeline ensuring high data quality at every stage:

### 1️⃣ Data Minor (The Entry Point)
*   **Dashboard**: Overview of submission stats and real-time activity.
*   **Input Files**: Advanced lead entry system with multi-field validation and **instant duplicate detection** for emails and phone numbers.
*   **Employee Listing**: Manage internal staff records associated with data acquisition.

### 2️⃣ Verifier (The Filter)
*   **Verifier Dashboard**: Performance tracking for verification accuracy and batch processing controls.
*   **Verifier Leads**: Dedicated interface for cleansing data. Verifiers review raw submissions, update email statuses (Active, Bounced, Dead), and use the **Batch Move** tool to push qualified data forward.

### 3️⃣ Lead Qualifier (The Strategist)
*   **LQ Dashboard**: High-level view of lead maturity and conversion rates.
*   **Leads Management**: Advanced filtering by status and date. Lead qualifiers score leads, verify intent, and move them into the final "Manager-Ready" pipeline.

### 4️⃣ Manager (The Executor)
*   **Manager Dashboard**: Overview of new assignments and team performance.
*   **New Leads**: Interface for receiving fresh, qualified leads for immediate action.
*   **History**: A comprehensive archive of all historical lead interactions and outcomes.

### 5️⃣ Super Admin (The Governor)
*   **Admin Dashboard**: Central hub for system health and **Pending User Approvals**.
*   **User Management**: Full CRUD operations on users across all departments.
*   **Global Leads**: Master view of every lead in the system.
*   **Analytics**: Advanced visualization of the entire pipeline performance.
*   **System Settings**: Global configuration for roles, security, and API endpoints.

---

## � Application Architecture

### 📄 Config-Based Routing Hub
The application's skeleton is defined in `src/dashboards/dashboardConfig.jsx`. This centralized file acts as the single source of truth for:
*   **Sidebar Navigation**: Icons and labels are dynamically pulled from the config.
*   **Access Control**: Only users with the matching `role` can access specific base paths.
*   **Route Generation**: All pages are automatically registered in the `DynamicRoutes.jsx` engine.

### � Enterprise Security
*   **Auth Interceptors**: Every API call is automatically injected with high-security JWT tokens.
*   **Session Watchdog**: The `TokenStatus` component monitors token age and warns users before session expiry.
*   **Department Guards**: Users are locked into their specific departmental layouts, preventing cross-role unauthorized access.

---

## 🏗️ Technical Architecture Breakdown

| Layer | Responsibility | Technology |
|-------|----------------|------------|
| **View Layer** | Premium Glassmorphism UI | React 18 / TailwindCSS |
| **Routing** | Dynamic RBAC Routing | React Router 6 (Nested) |
| **API Layer** | Standardized Data Fetching | Axios with Custom Instances |
| **State** | High-performance sync | React Hooks (Memoized) |
| **Security** | Identity & Access | JWT / LocalStorage Encapsulation |

---

<div align="center">
  <h3>🚀 High-Performance Lead Management</h3>
  <p>Built for scale. Designed for speed. Secured for enterprise.</p>
</div>
