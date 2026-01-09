import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import tokenManager from '../utils/tokenManager';
import { getRoleBasedRedirect } from '../utils/roleRedirect';

const LandingPage = () => {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const token = tokenManager.getToken();
        if (token && tokenManager.isCurrentTokenValid()) {
            setIsLoggedIn(true);
            setUser(tokenManager.getUser());
        }

        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleGoToDashboard = () => {
        if (user) {
            const path = getRoleBasedRedirect(user.role || user.department);
            navigate(path);
        }
    };

    return (
        <div className="min-h-screen font-sans selection:bg-teal-500/30 selection:text-teal-200" style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
            {/* Dynamic Background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-5%] w-[60%] h-[60%] rounded-full opacity-20 blur-[120px] animate-float"
                    style={{ background: 'radial-gradient(circle, var(--accent-primary) 0%, transparent 70%)' }}></div>
                <div className="absolute bottom-[-10%] right-[-5%] w-[50%] h-[50%] rounded-full opacity-10 blur-[100px] animate-pulse"
                    style={{ background: 'radial-gradient(circle, var(--color-accent) 0%, transparent 70%)' }}></div>
            </div>

            {/* Navigation */}
            <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'py-4 backdrop-blur-lg border-b' : 'py-6'}`}
                style={{ borderColor: scrolled ? 'var(--border-primary)' : 'transparent', backgroundColor: scrolled ? 'rgba(27, 60, 83, 0.8)' : 'transparent' }}>
                <div className="container mx-auto px-6 flex items-center justify-between">
                    <div className="flex items-center gap-3 group cursor-pointer">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:rotate-12"
                            style={{ background: 'linear-gradient(135deg, var(--accent-primary), var(--color-accent)) shadow-lg' }}>
                            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                        <span className="text-2xl font-black tracking-tighter">Lead<span style={{ color: 'var(--accent-primary)' }}>Sync</span></span>
                    </div>

                    <div className="flex items-center gap-6">
                        {isLoggedIn ? (
                            <button onClick={handleGoToDashboard} className="px-6 py-2.5 rounded-full font-bold text-sm transition-all hover:scale-105 active:scale-95"
                                style={{ backgroundColor: 'var(--accent-primary)', color: 'white' }}>
                                Dashboard
                            </button>
                        ) : (
                            <>
                                <Link to="/login" className="text-sm font-bold opacity-70 hover:opacity-100 transition-opacity">Sign In</Link>
                                <Link to="/signup" className="px-6 py-2.5 rounded-full border border-teal-500/30 font-bold text-sm transition-all hover:bg-teal-500/10 hover:border-teal-500/50"
                                    style={{ color: 'var(--accent-primary)' }}>
                                    Start Flow
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <main className="relative z-10 container mx-auto px-6 pt-32 pb-20">
                <div className="flex flex-col items-center text-center max-w-4xl mx-auto space-y-10">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-bold tracking-widest uppercase mb-4 animate-fadeIn"
                        style={{ backgroundColor: 'rgba(0,190,155,0.05)', borderColor: 'rgba(0,190,155,0.2)', color: 'var(--accent-primary)' }}>
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        New: V2.0 Enterprise Sync is Live
                    </div>

                    <h1 className="text-6xl md:text-8xl font-black tracking-tight leading-[0.9] animate-slideUp">
                        Sync Leads.<br />
                        <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(to right, var(--accent-primary), var(--text-primary))' }}>
                            Scale Teams.
                        </span>
                    </h1>

                    <p className="text-xl md:text-2xl opacity-60 max-w-2xl mx-auto leading-relaxed animate-fadeIn" style={{ animationDelay: '0.2s' }}>
                        The most powerful platform for high-velocity sales teams to manage, qualify, and sync leads across the entire enterprise.
                    </p>

                    <div className="pt-8 animate-slideUp" style={{ animationDelay: '0.3s' }}>
                        <Link to="/signup"
                            className="px-8 py-4 rounded-2xl font-black text-lg text-white shadow-2xl transition-all hover:scale-105 active:scale-95"
                            style={{ background: 'linear-gradient(135deg, var(--accent-primary), #00a889)', boxShadow: '0 15px 30px -10px rgba(0,190,155,0.4)' }}>
                            Get Started Free →
                        </Link>
                    </div>


                    {/* Trust Indicators */}
                    <div className="pt-24 animate-fadeIn" style={{ animationDelay: '0.6s' }}>
                        <p className="text-[10px] uppercase font-bold tracking-[0.3em] opacity-30 mb-8">Trusted by industry leaders in data mining</p>
                        <div className="flex flex-wrap justify-center gap-12 opacity-20 grayscale hover:grayscale-0 transition-all duration-500">
                            {['FORTUNE', 'LEADGEN', 'DATASYNC', 'FLOWPRO'].map(brand => (
                                <span key={brand} className="text-2xl font-black tracking-tighter">{brand}</span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Compact Premium Feature Row */}
                <div className="mt-40 w-full max-w-[1000px] mx-auto animate-slideUp" style={{ animationDelay: '0.4s' }}>
                    <div className="grid grid-cols-3 gap-4">
                        {[
                            {
                                title: 'Data Mining',
                                desc: 'Enterprise-grade extraction tools for high-volume lead sourcing.',
                                icon: 'M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4',
                                glow: 'rgba(0, 190, 155, 0.15)'
                            },
                            {
                                title: 'Smart Qualify',
                                desc: 'AI-driven lead qualification to ensure your sales team focus on wins.',
                                icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
                                glow: 'rgba(59, 130, 246, 0.15)'
                            },
                            {
                                title: 'Global Sync',
                                desc: 'Real-time synchronization across teams and regional offices.',
                                icon: 'M13 10V3L4 14h7v7l9-11h-7z',
                                glow: 'rgba(255, 255, 255, 0.1)'
                            }
                        ].map((feature, i) => (
                            <div key={i} className="group relative p-6 rounded-[1.5rem] border transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl overflow-hidden"
                                style={{
                                    backgroundColor: 'rgba(15, 23, 42, 0.8)',
                                    borderColor: 'rgba(69, 104, 130, 0.2)'
                                }}>
                                {/* Subtle Glow Backdrop */}
                                <div className="absolute top-0 right-0 w-24 h-24 blur-[50px] opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                                    style={{ backgroundColor: feature.glow }}></div>

                                <div className="relative z-10">
                                    <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-5 transition-all group-hover:bg-teal-500/10 shadow-lg"
                                        style={{ background: 'rgba(255,255,255,0.03)' }}>
                                        <svg className="w-5 h-5 transition-colors group-hover:text-teal-400" style={{ color: 'var(--accent-primary)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={feature.icon} />
                                        </svg>
                                    </div>
                                    <h3 className="text-lg font-bold mb-2 tracking-tight group-hover:text-teal-400 transition-colors">{feature.title}</h3>
                                    <p className="text-xs opacity-50 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                                        {feature.desc}
                                    </p>
                                </div>

                                <div className="mt-6 flex items-center gap-1.5 text-[9px] font-black tracking-widest uppercase transition-all duration-300"
                                    style={{ color: 'var(--accent-primary)' }}>
                                    <span className="opacity-40 group-hover:opacity-100">Explore Feature</span>
                                    <svg className="w-2.5 h-2.5 transform translate-x-0 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="relative z-10 py-20 border-t" style={{ borderColor: 'var(--border-primary)', backgroundColor: 'rgba(27,60,83,0.3)' }}>
                <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-10">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-teal-500 shadow-lg shadow-teal-500/20">
                            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                        <span className="text-xl font-black tracking-tighter">LeadSync</span>
                    </div>
                    <p className="text-sm opacity-30 font-medium">© 2026 LeadSync Flow Ecosystem. All rights secured.</p>
                    <div className="flex gap-8">
                        {['Twitter', 'LinkedIn', 'Github'].map(social => (
                            <span key={social} className="text-sm font-bold opacity-30 hover:opacity-100 cursor-pointer transition-opacity">{social}</span>
                        ))}
                    </div>
                </div>
            </footer>

            {/* Modern Animations */}
            <style>{`
        @keyframes float { 0% { transform: translateY(0px) rotate(0deg); } 50% { transform: translateY(-20px) rotate(5deg); } 100% { transform: translateY(0px) rotate(0deg); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
        .animate-float { animation: float 10s ease-in-out infinite; }
        .animate-fadeIn { animation: fadeIn 1s ease-out forwards; opacity: 0; }
        .animate-slideUp { animation: slideUp 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; opacity: 0; }
      `}</style>
        </div>
    );
};

export default LandingPage;
