import React, { useState, useEffect } from 'react';
import { dataMinorAPI } from '../../../api/data-minor';
import tokenManager from '../../../utils/tokenManager';

const DataMinorDashboard = () => {
    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState(null);
    const [leadStats, setLeadStats] = useState({
        todayCount: 0,
        monthCount: 0
    });

    useEffect(() => {
        const user = tokenManager.getUser();
        setUserData(user);

        const fetchStats = async () => {
            try {
                setLoading(true);
                const response = await dataMinorAPI.getMyStats();
                if (response.success) {
                    setLeadStats({
                        todayCount: response.todayCount || 0,
                        monthCount: response.monthCount || 0
                    });
                }
            } catch (error) {
                console.error('Failed to fetch stats:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const getInitials = (name) => {
        if (!name) return 'U';
        return name.split(' ').map(n => n[0]).join('').toUpperCase();
    };

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good Morning';
        if (hour < 17) return 'Good Afternoon';
        return 'Good Evening';
    };

    const getCurrentDate = () => {
        return new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center space-y-4">
                    <div className="w-16 h-16 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
                    <p className="text-sm font-bold opacity-60" style={{ color: 'var(--text-secondary)' }}>Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 sm:p-6 md:p-8 space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-700">

            {/* Welcome Header Section */}
            <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl border p-6 sm:p-8 md:p-10"
                style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-primary)' }}>

                <div className="absolute -right-20 -top-20 w-64 h-64 bg-gradient-to-br from-blue-500/20 to-indigo-600/20 rounded-full blur-3xl"></div>
                <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-gradient-to-br from-purple-500/10 to-pink-600/10 rounded-full blur-3xl"></div>

                <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                    <div className="flex items-center gap-5">
                        <div className="relative">
                            <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-2xl bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white font-black text-2xl sm:text-3xl shadow-2xl shadow-blue-500/30">
                                {getInitials(userData?.name)}
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 rounded-lg flex items-center justify-center shadow-lg">
                                <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                            </div>
                        </div>
                        <div>
                            <p className="text-sm font-bold opacity-60 mb-1" style={{ color: 'var(--text-secondary)' }}>
                                {getGreeting()} 👋
                            </p>
                            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight" style={{ color: 'var(--text-primary)' }}>
                                {userData?.name || 'User'}
                            </h1>
                            <div className="flex items-center gap-3 mt-2 flex-wrap">
                                <span className="px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest bg-blue-500/10 text-blue-500 border border-blue-500/20">
                                    {userData?.role || 'Data Miner'}
                                </span>
                                <span className="px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest"
                                    style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}>
                                    {userData?.department || 'Team'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Stats Badges - Prominent Display */}
                    <div className="flex items-center gap-4">
                        {/* Today's Leads */}
                        <div className="relative overflow-hidden rounded-2xl border px-6 py-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                            style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-primary)' }}>
                            <div className="absolute -right-6 -top-6 w-24 h-24 bg-gradient-to-br from-emerald-500/30 to-cyan-500/30 rounded-full blur-2xl"></div>
                            <div className="relative z-10 flex items-center gap-4">
                                <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 text-white shadow-lg shadow-emerald-500/30">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <span className="text-4xl font-black tracking-tight" style={{ color: 'var(--text-primary)' }}>{leadStats.todayCount}</span>
                                    <p className="text-xs font-black uppercase tracking-widest mt-1" style={{ color: 'var(--text-secondary)' }}>Today's Leads</p>
                                </div>
                            </div>
                        </div>

                        {/* Monthly Leads */}
                        <div className="relative overflow-hidden rounded-2xl border px-6 py-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                            style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-primary)' }}>
                            <div className="absolute -right-6 -top-6 w-24 h-24 bg-gradient-to-br from-blue-500/30 to-indigo-600/30 rounded-full blur-2xl"></div>
                            <div className="relative z-10 flex items-center gap-4">
                                <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/30">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <div>
                                    <span className="text-4xl font-black tracking-tight" style={{ color: 'var(--text-primary)' }}>{leadStats.monthCount}</span>
                                    <p className="text-xs font-black uppercase tracking-widest mt-1" style={{ color: 'var(--text-secondary)' }}>Monthly Leads</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Date & Status */}
                <div className="relative z-10 flex items-center justify-between mt-6 pt-6 border-t" style={{ borderColor: 'var(--border-primary)' }}>
                    <p className="text-xs font-bold opacity-60" style={{ color: 'var(--text-secondary)' }}>
                        {getCurrentDate()}
                    </p>
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                        <span className="flex h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
                        <span className="text-[9px] font-black uppercase tracking-widest" style={{ color: 'var(--text-secondary)' }}>
                            System Active
                        </span>
                    </div>
                </div>
            </div>

            {/* User Profile Details Card */}
            <div className="rounded-2xl sm:rounded-3xl border overflow-hidden"
                style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-primary)' }}>

                <div className="px-6 sm:px-8 py-5 sm:py-6 border-b flex items-center justify-between"
                    style={{ borderColor: 'var(--border-primary)' }}>
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </div>
                        <div>
                            <h2 className="text-lg sm:text-xl font-black" style={{ color: 'var(--text-primary)' }}>Profile Details</h2>
                            <p className="text-[10px] font-bold uppercase tracking-widest opacity-60" style={{ color: 'var(--text-secondary)' }}>Your account information</p>
                        </div>
                    </div>
                </div>

                <div className="p-6 sm:p-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">

                        {/* Name */}
                        <div className="p-4 sm:p-5 rounded-xl border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-primary)' }}>
                            <div className="flex items-center gap-2 mb-3">
                                <svg className="w-4 h-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--text-tertiary)' }}>
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: 'var(--text-tertiary)' }}>Full Name</span>
                            </div>
                            <p className="text-base sm:text-lg font-bold truncate" style={{ color: 'var(--text-primary)' }}>
                                {userData?.name || 'N/A'}
                            </p>
                        </div>

                        {/* Email */}
                        <div className="p-4 sm:p-5 rounded-xl border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-primary)' }}>
                            <div className="flex items-center gap-2 mb-3">
                                <svg className="w-4 h-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--text-tertiary)' }}>
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: 'var(--text-tertiary)' }}>Email</span>
                            </div>
                            <p className="text-sm font-bold truncate" style={{ color: 'var(--text-primary)' }}>
                                {userData?.email || 'N/A'}
                            </p>
                        </div>

                        {/* Role */}
                        <div className="p-4 sm:p-5 rounded-xl border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-primary)' }}>
                            <div className="flex items-center gap-2 mb-3">
                                <svg className="w-4 h-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--text-tertiary)' }}>
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                                </svg>
                                <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: 'var(--text-tertiary)' }}>Role</span>
                            </div>
                            <p className="text-base sm:text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                                {userData?.role || 'N/A'}
                            </p>
                        </div>

                        {/* Department */}
                        <div className="p-4 sm:p-5 rounded-xl border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-primary)' }}>
                            <div className="flex items-center gap-2 mb-3">
                                <svg className="w-4 h-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--text-tertiary)' }}>
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                                <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: 'var(--text-tertiary)' }}>Department</span>
                            </div>
                            <p className="text-base sm:text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                                {userData?.department || 'N/A'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

                {/* Add New Lead */}
                <a href="/data-minor/input-files"
                    className="group p-5 sm:p-6 rounded-2xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-lg flex items-center gap-4"
                    style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-primary)' }}>
                    <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg group-hover:scale-110 transition-transform">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="font-bold text-base" style={{ color: 'var(--text-primary)' }}>Add New Lead</h3>
                        <p className="text-xs font-medium opacity-60" style={{ color: 'var(--text-secondary)' }}>Submit a new lead entry</p>
                    </div>
                </a>


            </div>

        </div>
    );
};

export default DataMinorDashboard;