import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const AuthHeader = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <header className="fixed top-0 left-0 w-full z-50 py-6 px-8 flex items-center justify-between transition-all duration-300 backdrop-blur-md border-b"
            style={{
                borderColor: 'var(--border-primary)',
                backgroundColor: theme === 'dark' ? 'rgba(27, 60, 83, 0.7)' : 'rgba(255, 255, 255, 0.7)'
            }}>
            <Link to="/" className="flex items-center gap-3 group">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:rotate-12"
                    style={{ background: 'linear-gradient(135deg, var(--accent-success), var(--color-secondary))', boxShadow: '0 8px 20px -5px var(--accent-success)' }}>
                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                </div>
                <span className="text-2xl font-black tracking-tighter" style={{ color: 'var(--text-primary)' }}>
                    Lead<span style={{ color: 'var(--accent-success)' }}>Sync</span>
                </span>
            </Link>

            <div className="flex items-center gap-6">
                {/* Theme Toggle */}
                <button
                    onClick={toggleTheme}
                    className="p-2 rounded-lg hover:bg-[var(--bg-tertiary)]/50 transition-colors"
                    style={{ color: 'var(--text-primary)' }}
                    title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                >
                    {theme === 'dark' ? (
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                    ) : (
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                        </svg>
                    )}
                </button>

                <Link to="/" className="flex items-center gap-2 text-sm font-bold opacity-70 hover:opacity-100 transition-opacity" style={{ color: 'var(--text-primary)' }}>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back to Home
                </Link>
            </div>
        </header>
    );
};

export default AuthHeader;
