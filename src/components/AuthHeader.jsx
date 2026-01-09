import React from 'react';
import { Link } from 'react-router-dom';

const AuthHeader = () => {
    return (
        <header className="fixed top-0 left-0 w-full z-50 py-6 px-8 flex items-center justify-between transition-all duration-300 backdrop-blur-md border-b"
            style={{ borderColor: 'var(--border-primary)', backgroundColor: 'rgba(27, 60, 83, 0.7)' }}>
            <Link to="/" className="flex items-center gap-3 group">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:rotate-12"
                    style={{ background: 'linear-gradient(135deg, var(--accent-primary), var(--color-accent))', boxShadow: '0 8px 20px -5px rgba(0, 190, 155, 0.4)' }}>
                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                </div>
                <span className="text-2xl font-black tracking-tighter" style={{ color: 'var(--text-primary)' }}>
                    Lead<span style={{ color: 'var(--accent-primary)' }}>Sync</span>
                </span>
            </Link>

            <Link to="/" className="flex items-center gap-2 text-sm font-bold opacity-70 hover:opacity-100 transition-opacity" style={{ color: 'var(--text-primary)' }}>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Home
            </Link>
        </header>
    );
};

export default AuthHeader;
