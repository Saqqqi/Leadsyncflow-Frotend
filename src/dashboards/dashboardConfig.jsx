import React, { lazy } from "react";

// Icons
const DashboardIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

const UsersIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

const LeadsIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const SettingsIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const FilesIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const AnalyticsIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

// Lazy Loaded Components
const SuperAdminDashboard = lazy(() => import("../dashboards/super-admin/pages/AdminDashboard"));
const SuperAdminUsers = lazy(() => import("../dashboards/super-admin/pages/Users"));
const SuperAdminLeads = lazy(() => import("../dashboards/super-admin/pages/Leads"));
const SuperAdminAnalytics = lazy(() => import("../dashboards/super-admin/pages/Analytics"));
const SuperAdminSettings = lazy(() => import("../dashboards/super-admin/pages/Settings"));
const LeadQualifierDashboard = lazy(() => import("../dashboards/lead-qualifier/pages/LeadQualifierDashboard"));
const DataMinorDashboard = lazy(() => import("../dashboards/data-minor/pages/DataMinorDashboard"));
const InputFiles = lazy(() => import("../dashboards/data-minor/pages/InputFiles"));
const Employees = lazy(() => import("../dashboards/data-minor/pages/EmployeeListing"));
const VerifierDashboard = lazy(() => import("../dashboards/verifier/pages/VerifierDashboard"));
const VerifierLeads = lazy(() => import("../dashboards/verifier/pages/VerifierLeads"));
const LeadQualifierLeads = lazy(() => import("../dashboards/lead-qualifier/pages/LeadQualifierLeads"));
const ManagerDashboard = lazy(() => import("../dashboards/manager/pages/ManagerDashboard"));
const ManagerNewLeads = lazy(() => import("../dashboards/manager/pages/ManagerNewLeads"));
const ManagerHistory = lazy(() => import("../dashboards/manager/pages/ManagerHistory"));

// Centralized Configuration
export const dashboardConfig = [
  {
    id: 'super-admin',
    name: 'Super Admin',
    role: 'Super Admin',
    basePath: '/gds/super-admin',
    icon: <SettingsIcon />,
    pages: [
      { name: 'Dashboard', path: '', component: SuperAdminDashboard, icon: <DashboardIcon />, showInSidebar: true },
      { name: 'Users', path: 'users', component: SuperAdminUsers, icon: <UsersIcon />, showInSidebar: true },
      { name: 'Leads', path: 'leads', component: SuperAdminLeads, icon: <LeadsIcon />, showInSidebar: true },
      { name: 'Analytics', path: 'analytics', component: SuperAdminAnalytics, icon: <AnalyticsIcon />, showInSidebar: true },
      { name: 'Settings', path: 'settings', component: SuperAdminSettings, icon: <SettingsIcon />, showInSidebar: true },
    ],
  },
  {
    id: 'lead-qualifier',
    name: 'Lead Qualifier',
    role: 'Lead Qualifiers',
    basePath: '/gds/lead-qualifier',
    icon: <DashboardIcon />,
    pages: [
      { name: 'Dashboard', path: '', component: LeadQualifierDashboard, icon: <DashboardIcon />, showInSidebar: true },
      { name: 'Leads', path: 'leads', component: LeadQualifierLeads, icon: <LeadsIcon />, showInSidebar: true },
    ],
  },
  {
    id: 'data-minor',
    name: 'Data Minor',
    role: 'Data Minors',
    basePath: '/gds/data-minor',
    icon: <LeadsIcon />,
    pages: [
      { name: 'Dashboard', path: '', component: DataMinorDashboard, icon: <DashboardIcon />, showInSidebar: true },
      { name: 'Input Files', path: 'input-files', component: InputFiles, icon: <FilesIcon />, showInSidebar: true },
      // { name: 'Employees', path: 'employees', component: Employees, icon: <UsersIcon />, showInSidebar: true },
      // { name: 'Leads', path: 'leads', component: VerifierLeads, icon: <LeadsIcon />, showInSidebar: true, allowedRoles: ['Verifier'] },
    ],
  },
  {
    id: 'verifier',
    name: 'Verifier',
    role: 'Verifier',
    basePath: '/gds/verifier',
    icon: <LeadsIcon />,
    pages: [
      { name: 'Dashboard', path: '', component: VerifierDashboard, icon: <DashboardIcon />, showInSidebar: true },
      { name: 'Leads', path: 'leads', component: VerifierLeads, icon: <LeadsIcon />, showInSidebar: true },
    ],
  },
  {
    id: 'manager',
    name: 'Manager',
    role: 'Manager',
    basePath: '/gds/manager',
    icon: <LeadsIcon />,
    pages: [
      { name: 'Dashboard', path: '', component: ManagerDashboard, icon: <DashboardIcon />, showInSidebar: true },
      { name: 'New Leads', path: 'new-leads', component: ManagerNewLeads, icon: <LeadsIcon />, showInSidebar: true },
      { name: 'History', path: 'history', component: ManagerHistory, icon: <FilesIcon />, showInSidebar: true },
    ],
  },
];

// For backward compatibility or alternative routing
export const appRoutes = dashboardConfig;
