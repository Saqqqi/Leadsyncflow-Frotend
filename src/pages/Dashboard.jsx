import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authAPI } from '../api/auth.api';

export default function DashboardPage() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Check if user is logged in
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');

        if (!token || !userId) {
            navigate('/login');
            return;
        }

        // Fetch user details by ID
        const fetchUserDetails = async () => {
            try {
                const userData = await authAPI.getUserById(userId);
                setUser(userData.user);
            } catch (error) {
                console.error('Error fetching user details:', error);
                setError('Failed to load user details');
                // If API call fails, redirect to login
                setTimeout(() => navigate('/login'), 2000);
            } finally {
                setLoading(false);
            }
        };

        fetchUserDetails();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center" 
                 style={{ 
                     backgroundColor: 'var(--bg-primary)',
                     backgroundImage: 'linear-gradient(135deg, rgba(27, 60, 83, 0.95) 0%, rgba(35, 76, 106, 0.9) 100%)'
                 }}>
                <div className="text-center">
                    <svg className="animate-spin h-12 w-12 mx-auto mb-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p style={{ color: 'var(--text-primary)' }}>Loading dashboard...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return null; // Will redirect to login
    }

    return (
        <div className="min-h-screen p-6" 
             style={{ 
                 backgroundColor: 'var(--bg-primary)',
                 backgroundImage: 'linear-gradient(135deg, rgba(27, 60, 83, 0.95) 0%, rgba(35, 76, 106, 0.9) 100%)'
             }}>
            
            {/* Header */}
            <div className="max-w-6xl mx-auto mb-8">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl" 
                             style={{ 
                                 background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
                                 boxShadow: '0 8px 20px rgba(69, 104, 130, 0.3)'
                             }}>
                            <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                                Lead Sync Dashboard
                            </h1>
                            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                                Welcome back, {user.name}
                            </p>
                        </div>
                    </div>
                    
                    <button
                        onClick={handleLogout}
                        className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:shadow-lg"
                        style={{ 
                            borderColor: 'var(--border-secondary)',
                            color: 'var(--text-primary)',
                            backgroundColor: 'rgba(239, 68, 68, 0.1)',
                            border: '1px solid rgba(239, 68, 68, 0.3)'
                        }}
                    >
                        <div className="flex items-center gap-2">
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            <span>Logout</span>
                        </div>
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* User Profile Card */}
                    <div className="lg:col-span-1">
                        <div className="rounded-2xl p-6 h-full" 
                             style={{ 
                                 backgroundColor: 'var(--bg-secondary)',
                                 boxShadow: '0 15px 35px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(69, 104, 130, 0.2)'
                             }}>
                            
                            <h2 className="text-xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
                                User Profile
                            </h2>
                            
                            {/* Profile Image */}
                            <div className="flex flex-col items-center mb-6">
                                <div className="h-24 w-24 rounded-full overflow-hidden border-4 flex items-center justify-center mb-4"
                                     style={{
                                         borderColor: "var(--border-secondary)",
                                         backgroundColor: "rgba(255, 255, 255, 0.05)"
                                     }}>
                                    {user.profileImage ? (
                                        <img
                                            src={user.profileImage}
                                            alt="Profile"
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <svg className="h-12 w-12" style={{ color: "var(--text-tertiary)" }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    )}
                                </div>
                                
                                <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                                    {user.name}
                                </h3>
                                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                                    {user.email}
                                </p>
                            </div>

                            {/* User Details */}
                            <div className="space-y-4">
                                <div className="flex justify-between items-center py-2 border-b" 
                                     style={{ borderColor: 'var(--border-primary)' }}>
                                    <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                                        Gender
                                    </span>
                                    <span className="text-sm font-medium capitalize" style={{ color: 'var(--text-primary)' }}>
                                        {user.sex}
                                    </span>
                                </div>
                                
                                <div className="flex justify-between items-center py-2 border-b" 
                                     style={{ borderColor: 'var(--border-primary)' }}>
                                    <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                                        Department
                                    </span>
                                    <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                                        {user.department}
                                    </span>
                                </div>
                                
                                <div className="flex justify-between items-center py-2 border-b" 
                                     style={{ borderColor: 'var(--border-primary)' }}>
                                    <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                                        User ID
                                    </span>
                                    <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                                        {user.id}
                                    </span>
                                </div>
                                
                                <div className="flex justify-between items-center py-2">
                                    <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                                        Role
                                    </span>
                                    <span className="text-sm font-medium px-2 py-1 rounded" 
                                          style={{ 
                                              backgroundColor: 'rgba(69, 104, 130, 0.2)',
                                              color: 'var(--accent-primary)'
                                          }}>
                                        User
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Dashboard Content */}
                    <div className="lg:col-span-2">
                        <div className="rounded-2xl p-6" 
                             style={{ 
                                 backgroundColor: 'var(--bg-secondary)',
                                 boxShadow: '0 15px 35px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(69, 104, 130, 0.2)'
                             }}>
                            
                            <h2 className="text-xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
                                Dashboard Overview
                            </h2>
                            
                            {/* Welcome Message */}
                            <div className="mb-8 p-6 rounded-lg" 
                                 style={{ 
                                     backgroundColor: 'rgba(69, 104, 130, 0.1)',
                                     border: '1px solid rgba(69, 104, 130, 0.3)'
                                 }}>
                                <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                                    Welcome to Lead Sync! 🎉
                                </h3>
                                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                                    You have successfully logged in to your account. This is your personal dashboard where you can manage your profile and view your information.
                                </p>
                            </div>

                            {/* Quick Stats */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                                <div className="p-4 rounded-lg text-center" 
                                     style={{ 
                                         backgroundColor: 'rgba(34, 197, 94, 0.1)',
                                         border: '1px solid rgba(34, 197, 94, 0.3)'
                                     }}>
                                    <div className="text-2xl font-bold mb-1" style={{ color: '#22c55e' }}>
                                        Active
                                    </div>
                                    <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                                        Account Status
                                    </div>
                                </div>
                                
                                <div className="p-4 rounded-lg text-center" 
                                     style={{ 
                                         backgroundColor: 'rgba(59, 130, 246, 0.1)',
                                         border: '1px solid rgba(59, 130, 246, 0.3)'
                                     }}>
                                    <div className="text-2xl font-bold mb-1" style={{ color: '#3b82f6' }}>
                                        {user.department}
                                    </div>
                                    <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                                        Department
                                    </div>
                                </div>
                                
                                <div className="p-4 rounded-lg text-center" 
                                     style={{ 
                                         backgroundColor: 'rgba(251, 146, 60, 0.1)',
                                         border: '1px solid rgba(251, 146, 60, 0.3)'
                                     }}>
                                    <div className="text-2xl font-bold mb-1" style={{ color: '#fb923c' }}>
                                        {user.sex}
                                    </div>
                                    <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                                        Gender
                                    </div>
                                </div>
                            </div>

                            {/* Recent Activity */}
                            <div>
                                <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
                                    Recent Activity
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3 p-3 rounded-lg" 
                                         style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}>
                                        <div className="h-2 w-2 rounded-full bg-green-500"></div>
                                        <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                                            Successfully logged in to your account
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 rounded-lg" 
                                         style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}>
                                        <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                                        <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                                            Account created successfully
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 rounded-lg" 
                                         style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}>
                                        <div className="h-2 w-2 rounded-full bg-orange-500"></div>
                                        <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                                            Profile setup completed
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
