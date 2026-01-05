import { useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authAPI } from "../api/auth.api";

export default function LoginPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = useCallback(({ target }) => {
    const { name, value } = target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleSubmit = useCallback(
    async e => {
      e.preventDefault();

      if (loading) return;

      setError(null);
      setLoading(true);

      try {
        const response = await authAPI.login(formData);
        console.log('Login response:', response); // Debug log
        
        const { token, user } = response;
        console.log('Token:', token); // Debug log
        console.log('User data:', user); // Debug log

        if (token && user) {
          localStorage.setItem("token", token);
   
          navigate("/dashboard", { replace: true });
        } else {
          console.error('Missing token or user in response');
          setError("Invalid response from server");
        }
      } catch (err) {
        setError(
          err?.response?.data?.message ||
            err?.response?.data?.error ||
            err?.message ||
            "Login failed"
        );
      } finally {
        setLoading(false);
      }
    },
    [formData, loading, navigate]
  );


    return (
        <div className="min-h-screen flex items-center justify-center p-6" 
             style={{ 
                 backgroundColor: 'var(--bg-primary)',
                 backgroundImage: 'linear-gradient(135deg, rgba(27, 60, 83, 0.95) 0%, rgba(35, 76, 106, 0.9) 100%)'
             }}>
            
            {/* Main Container */}
            <div className="w-full max-w-lg">
                {/* Logo Header */}
                <div className="text-center mb-10">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <div className="flex h-14 w-14 items-center justify-center rounded-xl" 
                             style={{ 
                                 background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
                                 boxShadow: '0 10px 25px rgba(69, 104, 130, 0.3)'
                             }}>
                            <svg
                                className="h-8 w-8 text-white"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >   
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M13 10V3L4 14h7v7l9-11h-7z"
                                />
                            </svg>
                        </div>
                        <div className="text-left">
                            <span className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>Lead Sync</span>
                        </div>
                    </div>
                </div>

                {/* Login Card */}
                <div className="rounded-2xl p-6" 
                     style={{ 
                         backgroundColor: 'var(--bg-secondary)',
                         boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(69, 104, 130, 0.2)'
                     }}>
                    
                    {/* Header */}
                    <div className="text-center mb-6">
                        <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                            Welcome Back
                        </h2>
                        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                            Sign in to access your dashboard
                        </p>
                    </div>

                    {/* Error Message */}
                {error && (
                    <div 
                        className="mb-6 p-4 rounded-lg border"
                        style={{
                            backgroundColor: "rgba(239, 68, 68, 0.1)",
                            borderColor: "rgba(239, 68, 68, 0.3)",
                            color: "#ef4444"
                        }}
                    >
                        <div className="flex items-center">
                            <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-sm font-medium">{error}</span>
                        </div>
                    </div>
                )}

                {/* Login Form */}
                    <form className="space-y-4" onSubmit={handleSubmit}>
                        {/* Email Field */}
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium mb-2" 
                                style={{ color: 'var(--text-secondary)' }}
                            >
                                Email Address
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5" style={{ color: 'var(--text-tertiary)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="block w-full pl-12 rounded-xl border px-4 py-3 focus:outline-none focus:ring-2 transition-all duration-200"
                                    style={{ 
                                        borderColor: 'var(--border-primary)',
                                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                        color: 'var(--text-primary)',
                                        focusBorderColor: 'var(--border-secondary)',
                                        focusRingColor: 'var(--accent-primary)'
                                    }}
                                    placeholder="you@company.com"
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div>
                            <div className="flex items-center justify-between mb-3">
                                <label
                                    htmlFor="password"
                                    className="block text-sm font-medium" 
                                    style={{ color: 'var(--text-secondary)' }}
                                >
                                    Password
                                </label>
                              
                            </div>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5" style={{ color: 'var(--text-tertiary)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="block w-full pl-12 rounded-xl border px-4 py-3 focus:outline-none focus:ring-2 transition-all duration-200"
                                    style={{ 
                                        borderColor: 'var(--border-primary)',
                                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                        color: 'var(--text-primary)',
                                        focusBorderColor: 'var(--border-secondary)',
                                        focusRingColor: 'var(--accent-primary)'
                                    }}
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        {/* Remember Me & Submit */}
                        <div className="flex items-center justify-between pt-2">
                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    name="remember-me"
                                    type="checkbox"
                                    className="h-5 w-5 rounded border focus:ring-2 focus:ring-offset-0 transition-all duration-200"
                                    style={{ 
                                        borderColor: 'var(--border-primary)',
                                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                        color: 'var(--accent-primary)'
                                    }}
                                />
                                <label
                                    htmlFor="remember-me"
                                    className="ml-3 block text-sm"
                                    style={{ color: 'var(--text-secondary)' }}
                                >
                                    Keep me signed in
                                </label>
                            </div>
                            
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-8 py-3 rounded-xl text-sm font-semibold text-white transition-all duration-200 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 transform hover:-translate-y-1 hover:scale-105 active:scale-95"
                                style={{ 
                                    background: loading 
                                        ? "linear-gradient(135deg, #94a3b8, #64748b)"
                                        : "linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))",
                                    boxShadow: loading 
                                        ? "none" 
                                        : "0 10px 20px rgba(69, 104, 130, 0.4)",
                                    focusRingColor: 'var(--accent-primary)',
                                    focusRingOffsetColor: 'var(--bg-secondary)',
                                    cursor: loading ? 'not-allowed' : 'pointer',
                                    opacity: loading ? 0.7 : 1
                                }}
                            >
                                <div className="flex items-center gap-2">
                                    {loading ? (
                                        <>
                                            <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            <span>Signing In...</span>
                                        </>
                                    ) : (
                                        <>
                                            <span>Sign In</span>
                                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                            </svg>
                                        </>
                                    )}
                                </div>
                            </button>
                        </div>
                    </form>

                    {/* Divider */}
                    <div className="my-6 relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t" style={{ borderColor: 'var(--border-primary)' }}></div>
                        </div>
                       
                    </div>

                    {/* Sign Up Link */}
                    <div className="text-center">
                        <Link
                            to="/"
                            className="inline-flex items-center justify-center w-full py-3 rounded-xl text-sm font-semibold transition-all duration-200 border hover:shadow-lg"
                            style={{ 
                                borderColor: 'var(--border-secondary)',
                                color: 'var(--text-primary)',
                                backgroundColor: 'rgba(69, 104, 130, 0.1)'
                            }}
                        >
                            <span>Create a free account</span>
                            <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                        </Link>
                    </div>
                </div>

            </div>
        </div>
    );
}
