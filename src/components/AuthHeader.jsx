import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import tokenManager from '../utils/tokenManager';
import { getRoleBasedRedirect } from '../utils/roleRedirect';

const AuthHeader = ({ isLandingPage = false }) => {
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = tokenManager.getToken();
        if (token && tokenManager.isCurrentTokenValid()) {
            setIsLoggedIn(true);
            setUser(tokenManager.getUser());
        } else {
            setIsLoggedIn(false);
            setUser(null);
        }
    }, []);

    const handleGoToDashboard = () => {
        if (user) {
            const path = getRoleBasedRedirect(user.role || user.department);
            navigate(path);
        }
    };

    return (
        <header className="fixed top-0 w-full z-50 py-6 px-8 flex items-center justify-between transition-all duration-300 backdrop-blur-md border-b"
            style={{
                borderColor: 'var(--border-primary)',
                backgroundColor: theme === 'dark' ? 'rgba(27, 60, 83, 0.7)' : 'rgba(255, 255, 255, 0.7)'
            }}>
            <Link to="/" className="flex items-center gap-4 group pl-4"> {/* Added pl-4 for left padding */}
                <img src="/Logo - Lead Sync.(Dark Mode).svg" alt="LeadSync Logo" className="h-16 w-auto transition-transform group-hover:scale-105" />
            </Link>

            <div className="flex items-center gap-6 pr-8"> {/* Increased pr-4 to pr-8 */}
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

                {isLandingPage ? (
                    isLoggedIn ? (
                        <button onClick={handleGoToDashboard} className="px-6 py-2.5 rounded-full font-bold text-sm transition-all hover:scale-105 active:scale-95 shadow-lg shadow-[var(--accent-primary)]/20"
                            style={{ backgroundColor: 'var(--accent-primary)', color: 'white' }}>
                            Dashboard
                        </button>
                    ) : (
                        <>
                            <Link to="/login" className="text-sm font-bold opacity-70 hover:opacity-100 transition-opacity">Sign In</Link>
                            <Link to="/signup" className="px-6 py-2.5 rounded-full border font-bold text-sm transition-all hover:bg-[var(--accent-primary)]/10"
                                style={{ color: 'var(--accent-primary)', borderColor: 'var(--accent-primary)' }}>
                                Start Flow
                            </Link>
                        </>
                    )
                ) : (
                    <Link to="/" className="flex items-center gap-2 text-sm font-bold opacity-70 hover:opacity-100 transition-opacity" style={{ color: 'var(--text-primary)' }}>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to Home
                    </Link>
                )}
            </div>
        </header>
    );
};

export default AuthHeader;
