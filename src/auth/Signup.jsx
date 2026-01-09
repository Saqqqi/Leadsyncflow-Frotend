import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authAPI } from '../api/auth.api';
import AuthHeader from "../components/AuthHeader";

export default function SignupPage() {
    const departments = [
        'Development',
        'IT',
        'Marketing&SEO',
        'RND',
        'Quality Assurance',
        'Sales',
        'Writing',
        'Youtube Automation',
        'Lead Qualifiers',
        'Medical Billing'
    ];

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        sex: "",
        department: "",
        password: "",
        confirmPassword: ""
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match!");
            return;
        }

        if (formData.password.length < 6) {
            setError("Password must be at least 6 characters long!");
            return;
        }

        setLoading(true);

        try {
            const submitData = new FormData();
            submitData.append('name', formData.name);
            submitData.append('email', formData.email);
            submitData.append('sex', formData.sex);
            submitData.append('department', formData.department);
            submitData.append('password', formData.password);
            submitData.append('confirmPassword', formData.confirmPassword);

            const response = await authAPI.signup(submitData);
            setSuccess("Account created successfully. Pending approval.");

            setTimeout(() => {
                navigate('/login');
            }, 3000);

        } catch (err) {
            setError(err.response?.data?.message || err.message || "Failed to create account.");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 pt-24"
            style={{
                backgroundColor: "var(--bg-primary)",
                backgroundImage: "linear-gradient(135deg, rgba(27, 60, 83, 0.95) 0%, rgba(35, 76, 106, 0.9) 100%)"
            }}>
            <AuthHeader />

            <div className="w-full max-w-4xl">
                {/* Messages */}
                {error && (
                    <div className="mb-6 p-4 rounded-xl border flex items-center gap-3 animate-fadeIn"
                        style={{ backgroundColor: "rgba(239, 68, 68, 0.1)", borderColor: "rgba(239, 68, 68, 0.2)", color: "#ef4444" }}>
                        <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-sm font-semibold">{error}</span>
                    </div>
                )}

                {success && (
                    <div className="mb-6 p-4 rounded-xl border flex items-center gap-3 animate-fadeIn"
                        style={{ backgroundColor: "rgba(34, 197, 94, 0.1)", borderColor: "rgba(34, 197, 94, 0.2)", color: "#22c55e" }}>
                        <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-sm font-semibold">{success}</span>
                    </div>
                )}

                {/* Form Card */}
                <div className="rounded-3xl p-8 md:p-12 shadow-2xl"
                    style={{ backgroundColor: "var(--bg-secondary)", border: "1px solid var(--border-primary)" }}>

                    <div className="mb-10">
                        <h2 className="text-3xl font-black tracking-tight" style={{ color: "var(--text-primary)" }}>Join the Flow</h2>
                        <p className="text-sm opacity-60" style={{ color: "var(--text-secondary)" }}>Create your enterprise account to get started.</p>
                    </div>

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Name */}
                            <div className="space-y-2">
                                <label className="text-sm font-bold opacity-70">Full Name</label>
                                <input name="name" type="text" required value={formData.name} onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition-all"
                                    style={{ borderColor: "var(--border-primary)", backgroundColor: "rgba(255,255,255,0.03)", color: "var(--text-primary)" }}
                                    placeholder="John Doe" />
                            </div>

                            {/* Email */}
                            <div className="space-y-2">
                                <label className="text-sm font-bold opacity-70">Email Address</label>
                                <input name="email" type="email" required value={formData.email} onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition-all"
                                    style={{ borderColor: "var(--border-primary)", backgroundColor: "rgba(255,255,255,0.03)", color: "var(--text-primary)" }}
                                    placeholder="john@example.com" />
                            </div>

                            {/* Gender */}
                            <div className="space-y-2">
                                <label className="text-sm font-bold opacity-70">Gender</label>
                                <select name="sex" required value={formData.sex} onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition-all appearance-none"
                                    style={{ borderColor: "var(--border-primary)", backgroundColor: "rgba(255,255,255,0.03)", color: "var(--text-primary)" }}>
                                    <option value="">Select...</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                </select>
                            </div>

                            {/* Department */}
                            <div className="space-y-2">
                                <label className="text-sm font-bold opacity-70">Department</label>
                                <select name="department" required value={formData.department} onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition-all appearance-none"
                                    style={{ borderColor: "var(--border-primary)", backgroundColor: "rgba(255,255,255,0.03)", color: "var(--text-primary)" }}>
                                    <option value="">Select Department...</option>
                                    {departments.map(dept => <option key={dept} value={dept}>{dept}</option>)}
                                </select>
                            </div>

                            {/* Password */}
                            <div className="space-y-2 relative">
                                <label className="text-sm font-bold opacity-70">Password</label>
                                <input name="password" type={showPassword ? "text" : "password"} required value={formData.password} onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition-all"
                                    style={{ borderColor: "var(--border-primary)", backgroundColor: "rgba(255,255,255,0.03)", color: "var(--text-primary)" }}
                                    placeholder="••••••••" />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-9 opacity-40 hover:opacity-100">
                                    {showPassword ? "Hide" : "Show"}
                                </button>
                            </div>

                            {/* Confirm Password */}
                            <div className="space-y-2 relative">
                                <label className="text-sm font-bold opacity-70">Confirm Password</label>
                                <input name="confirmPassword" type={showConfirmPassword ? "text" : "password"} required value={formData.confirmPassword} onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition-all"
                                    style={{ borderColor: "var(--border-primary)", backgroundColor: "rgba(255,255,255,0.03)", color: "var(--text-primary)" }}
                                    placeholder="••••••••" />
                                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-9 opacity-40 hover:opacity-100">
                                    {showConfirmPassword ? "Hide" : "Show"}
                                </button>
                            </div>
                        </div>

                        <div className="pt-6 space-y-4">
                            <button type="submit" disabled={loading}
                                className="w-full py-4 rounded-xl font-black text-lg text-white shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                                style={{ background: "linear-gradient(135deg, var(--accent-primary), #00a889)" }}>
                                {loading ? "Creating Account..." : "Create Account"}
                            </button>

                            <p className="text-center text-sm opacity-60">
                                Already have an account? <Link to="/login" className="font-bold underline hover:text-teal-400 decoration-teal-500/30">Sign In</Link>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}