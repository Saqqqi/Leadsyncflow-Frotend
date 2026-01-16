import React from 'react';
import { Link } from 'react-router-dom';
import AuthHeader from '../components/AuthHeader';

const LandingPage = () => {
    return (
        <div className="min-h-screen font-sans selection:bg-[var(--accent-primary)]/30 selection:text-[var(--text-primary)]" style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
            {/* Dynamic Background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-5%] w-[60%] h-[60%] rounded-full opacity-20 blur-[120px] animate-float"
                    style={{ background: 'radial-gradient(circle, var(--accent-primary) 0%, transparent 70%)' }}></div>
                <div className="absolute bottom-[-10%] right-[-5%] w-[50%] h-[50%] rounded-full opacity-10 blur-[100px] animate-pulse"
                    style={{ background: 'radial-gradient(circle, var(--accent-secondary) 0%, transparent 70%)' }}></div>
            </div>

            <AuthHeader isLandingPage={true} />

            {/* Hero Section */}
            <main className="relative z-10 container mx-auto px-6 pt-40 pb-20">
                <div className="flex flex-col items-center text-center max-w-4xl mx-auto space-y-10">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-bold tracking-widest uppercase mb-4 animate-fadeIn"
                        style={{ backgroundColor: 'var(--accent-primary)0D', borderColor: 'var(--accent-primary)33', color: 'var(--accent-primary)' }}>
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--accent-primary)] opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--accent-primary)]"></span>
                        </span>
                        New: V2.0 Enterprise Sync is Live
                    </div>

                    <h1 className="text-6xl md:text-8xl font-black tracking-tight leading-[0.9] animate-slideUp">
                        Sync Leads.<br />
                        <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(to right, var(--accent-primary), var(--text-primary))' }}>
                            Scale Teams.
                        </span>
                    </h1>

                    <p className="text-xl md:text-2xl opacity-60 max-w-2xl mx-auto leading-relaxed animate-fadeIn" style={{ animationDelay: '0.2s', color: 'var(--text-secondary)' }}>
                        The most powerful platform for high-velocity sales teams to manage, qualify, and sync leads across the entire enterprise.
                    </p>

                    <div className="pt-8 animate-slideUp" style={{ animationDelay: '0.3s' }}>
                        <Link to="/signup"
                            className="px-8 py-4 rounded-2xl font-black text-lg text-white shadow-2xl transition-all hover:scale-105 active:scale-95"
                            style={{
                                background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
                                boxShadow: '0 15px 30px -10px var(--accent-primary)66'
                            }}>
                            Get Started Free →
                        </Link>
                    </div>


                    {/* Trust Indicators */}
                    <div className="pt-24 animate-fadeIn" style={{ animationDelay: '0.6s' }}>
                        <p className="text-[10px] uppercase font-bold tracking-[0.3em] opacity-30 mb-8" style={{ color: 'var(--text-tertiary)' }}>Trusted by industry leaders in data mining</p>
                        <div className="flex flex-wrap justify-center gap-12 opacity-20 grayscale hover:grayscale-0 transition-all duration-500">
                            {['BESTPAPERPROS', 'WRITEMYNURSING', 'NURSFPXWRITERS'].map(brand => (
                                <span key={brand} className="text-2xl font-black tracking-tighter" style={{ color: 'var(--text-primary)' }}>{brand}</span>
                            ))}
                        </div>
                    </div>
                </div>


            </main>



            {/* Modern Animations */}
            < style > {`
        @keyframes float { 0% { transform: translateY(0px) rotate(0deg); } 50% { transform: translateY(-20px) rotate(5deg); } 100% { transform: translateY(0px) rotate(0deg); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
        .animate-float { animation: float 10s ease-in-out infinite; }
        .animate-fadeIn { animation: fadeIn 1s ease-out forwards; opacity: 0; }
        .animate-slideUp { animation: slideUp 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; opacity: 0; }
      `}</style>
        </div >
    );
};

export default LandingPage;
