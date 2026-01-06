import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authAPI } from '../api/auth.api';

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

        // Client-side validation
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
            // Create FormData for file upload
            const submitData = new FormData();
            submitData.append('name', formData.name);
            submitData.append('email', formData.email);
            submitData.append('sex', formData.sex);
            submitData.append('department', formData.department);
            submitData.append('password', formData.password);
            submitData.append('confirmPassword', formData.confirmPassword);

            const response = await authAPI.signup(submitData);

            setSuccess("Account created But Request is pending for approval");

            // Store token if returned
            if (response.token) {
                localStorage.setItem('token', response.token);
            }

            // Redirect to login after 2 seconds
            setTimeout(() => {
                navigate('/login');
            }, 5000);

        } catch (err) {
            console.error('Signup error:', err);

            // Handle different types of errors
            if (err.response?.data?.message) {
                setError(err.response.data.message);
            } else if (err.response?.data?.error) {
                setError(err.response.data.error);
            } else if (err.message) {
                setError(err.message);
            } else {
                setError("Failed to create account. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;

        if (type === "file" && files && files[0]) {
            setFormData((prev) => ({
                ...prev,
                [name]: URL.createObjectURL(files[0]),
                [name + 'File']: files[0] // Store actual file for upload
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: value
            }));
        }
    };

    return (
        <div
            className="min-h-screen flex items-center justify-center p-4"
            style={{
                backgroundColor: "var(--bg-primary)",
                backgroundImage:
                    "linear-gradient(135deg, rgba(27, 60, 83, 0.95) 0%, rgba(35, 76, 106, 0.9) 100%)"
            }}
        >
            {/* Main Container */}
            <div className="w-full max-w-5xl">
                {/* Logo Header */}
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center gap-3 mb-2">
                        <div
                            className="flex h-12 w-12 items-center justify-center rounded-xl"
                            style={{
                                background:
                                    "linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))",
                                boxShadow: "0 8px 20px rgba(69, 104, 130, 0.3)"
                            }}
                        >
                            <svg
                                className="h-6 w-6 text-white"
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
                            <span
                                className="text-2xl font-bold"
                                style={{ color: "var(--text-primary)" }}
                            >
                                Lead Sync
                            </span>
                            <p
                                className="text-xs mt-1"
                                style={{ color: "var(--text-secondary)" }}
                            >
                                Create Your Account
                            </p>
                        </div>
                    </div>
                </div>

                {/* Error and Success Messages */}
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

                {success && (
                    <div
                        className="mb-6 p-4 rounded-lg border"
                        style={{
                            backgroundColor: "rgba(34, 197, 94, 0.1)",
                            borderColor: "rgba(34, 197, 94, 0.3)",
                            color: "#22c55e"
                        }}
                    >
                        <div className="flex items-center">
                            <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-sm font-medium">{success}</span>
                        </div>
                    </div>
                )}

                {/* Signup Card */}
                <div
                    className="rounded-2xl p-8"
                    style={{
                        backgroundColor: "var(--bg-secondary)",
                        boxShadow:
                            "0 15px 35px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(69, 104, 130, 0.2)"
                    }}
                >
                    <form className="space-y-8" onSubmit={handleSubmit}>


                        {/* Form Fields Container - Controls max width */}
                        <div className="max-w-4xl mx-auto space-y-8">
                            {/* Row 1: Name & Email - TWO COLUMNS on medium+ screens */}
                            <div
                                style={{
                                    display: "flex",
                                    flexWrap: "wrap",
                                    gap: "24px",
                                    margin: "-12px"
                                }}
                            >
                                <div style={{ flex: "1 1 300px", padding: "12px" }}>
                                    <label
                                        className="block text-sm font-medium mb-1.5"
                                        style={{ color: "var(--text-secondary)" }}
                                    >
                                        Full Name
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <svg
                                                className="h-5 w-5"
                                                style={{ color: "var(--text-tertiary)" }}
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                                />
                                            </svg>
                                        </div>
                                        <input
                                            name="name"
                                            type="text"
                                            required
                                            value={formData.name}
                                            onChange={handleChange}
                                            className="block w-full pl-10 pr-3 py-3 rounded-lg border text-base focus:outline-none focus:ring-2 transition-all"
                                            style={{
                                                borderColor: "var(--border-primary)",
                                                backgroundColor: "rgba(255, 255, 255, 0.05)",
                                                color: "var(--text-primary)"
                                            }}
                                            placeholder="John Doe"
                                        />
                                    </div>
                                </div>

                                <div style={{ flex: "1 1 300px", padding: "12px" }}>
                                    <label
                                        className="block text-sm font-medium mb-1.5"
                                        style={{ color: "var(--text-secondary)" }}
                                    >
                                        Email Address
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <svg
                                                className="h-5 w-5"
                                                style={{ color: "var(--text-tertiary)" }}
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2z"
                                                />
                                            </svg>
                                        </div>
                                        <input
                                            name="email"
                                            type="email"
                                            required
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="block w-full pl-10 pr-3 py-3 rounded-lg border text-base focus:outline-none focus:ring-2 transition-all"
                                            style={{
                                                borderColor: "var(--border-primary)",
                                                backgroundColor: "rgba(255, 255, 255, 0.05)",
                                                color: "var(--text-primary)"
                                            }}
                                            placeholder="you@company.com"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Row 2: sex & Department */}
                            <div
                                style={{
                                    display: "flex",
                                    flexWrap: "wrap",
                                    gap: "24px",
                                    margin: "-12px"
                                }}
                            >
                                <div style={{ flex: "1 1 300px", padding: "12px" }}>
                                    <label
                                        className="block text-sm font-medium mb-1.5"
                                        style={{ color: "var(--text-secondary)" }}
                                    >
                                        Gender
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <svg
                                                className="h-5 w-5"
                                                style={{ color: "var(--text-tertiary)" }}
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                                                />
                                            </svg>
                                        </div>
                                        <select
                                            name="sex"
                                            required
                                            value={formData.sex}
                                            onChange={handleChange}
                                            className="block w-full pl-10 pr-8 py-3 rounded-lg border text-base focus:outline-none focus:ring-2 appearance-none"
                                            style={{
                                                borderColor: "var(--border-primary)",
                                                backgroundColor: "rgba(255, 255, 255, 0.05)",
                                                color: "var(--text-primary)"
                                            }}
                                        >
                                            <option value="">Select...</option>
                                            <option value="male">Male</option>
                                            <option value="female">Female</option>

                                        </select>
                                    </div>
                                </div>

                                <div style={{ flex: "1 1 300px", padding: "12px" }}>
                                    <label
                                        className="block text-sm font-medium mb-1.5"
                                        style={{ color: "var(--text-secondary)" }}
                                    >
                                        Department
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <svg
                                                className="h-5 w-5"
                                                style={{ color: "var(--text-tertiary)" }}
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                                                />
                                            </svg>
                                        </div>
                                        <select
                                            name="department"
                                            required
                                            value={formData.department}
                                            onChange={handleChange}
                                            className="block w-full pl-10 pr-8 py-3 rounded-lg border text-base focus:outline-none focus:ring-2 appearance-none"
                                            style={{
                                                borderColor: "var(--border-primary)",
                                                backgroundColor: "rgba(255, 255, 255, 0.05)",
                                                color: "var(--text-primary)"
                                            }}
                                        >
                                            <option value="">Select Department...</option>
                                            {departments.map((dept) => (
                                                <option key={dept} value={dept}>
                                                    {dept}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Row 3: Password & Confirm Password */}
                            <div
                                style={{
                                    display: "flex",
                                    flexWrap: "wrap",
                                    gap: "24px",
                                    margin: "-12px"
                                }}
                            >
                                <div style={{ flex: "1 1 300px", padding: "12px" }}>
                                    <label
                                        className="block text-sm font-medium mb-1.5"
                                        style={{ color: "var(--text-secondary)" }}
                                    >
                                        Password
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <svg
                                                className="h-5 w-5"
                                                style={{ color: "var(--text-tertiary)" }}
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                                />
                                            </svg>
                                        </div>
                                        <input
                                            name="password"
                                            type={showPassword ? "text" : "password"}
                                            required
                                            value={formData.password}
                                            onChange={handleChange}
                                            className="block w-full pl-10 pr-12 py-3 rounded-lg border text-base focus:outline-none focus:ring-2 transition-all"
                                            style={{
                                                borderColor: "var(--border-primary)",
                                                backgroundColor: "rgba(255, 255, 255, 0.05)",
                                                color: "var(--text-primary)"
                                            }}
                                            placeholder="••••••••"
                                        />
                                        <button
                                            type="button"
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                            onClick={() => setShowPassword(!showPassword)}
                                            style={{ color: "var(--text-tertiary)" }}
                                        >
                                            {showPassword ? (
                                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                                </svg>
                                            ) : (
                                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                </svg>
                                            )}
                                        </button>
                                    </div>
                                </div>

                                <div style={{ flex: "1 1 300px", padding: "12px" }}>
                                    <label
                                        className="block text-sm font-medium mb-1.5"
                                        style={{ color: "var(--text-secondary)" }}
                                    >
                                        Confirm Password
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <svg
                                                className="h-5 w-5"
                                                style={{ color: "var(--text-tertiary)" }}
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                                                />
                                            </svg>
                                        </div>
                                        <input
                                            name="confirmPassword"
                                            type={showConfirmPassword ? "text" : "password"}
                                            required
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            className="block w-full pl-10 pr-12 py-3 rounded-lg border text-base focus:outline-none focus:ring-2 transition-all"
                                            style={{
                                                borderColor: "var(--border-primary)",
                                                backgroundColor: "rgba(255, 255, 255, 0.05)",
                                                color: "var(--text-primary)"
                                            }}
                                            placeholder="••••••••"
                                        />
                                        <button
                                            type="button"
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            style={{ color: "var(--text-tertiary)" }}
                                        >
                                            {showConfirmPassword ? (
                                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                                </svg>
                                            ) : (
                                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                </svg>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Terms & Buttons */}
                            <div className="pt-6">
                                <div className="flex items-start mb-6">
                                    <input
                                        id="terms"
                                        name="terms"
                                        type="checkbox"
                                        required
                                        className="h-4 w-4 rounded border mt-1"
                                        style={{
                                            borderColor: "var(--border-primary)",
                                            accentColor: "var(--accent-primary)"
                                        }}
                                    />
                                    <label
                                        htmlFor="terms"
                                        className="ml-3 text-sm"
                                        style={{ color: "var(--text-secondary)" }}
                                    >
                                        I agree to the{" "}
                                        <Link
                                            to="#"
                                            className="font-medium hover:underline"
                                            style={{ color: "var(--accent-primary)" }}
                                        >
                                            Terms of Service
                                        </Link>{" "}
                                        and{" "}
                                        <Link
                                            to="#"
                                            className="font-medium hover:underline"
                                            style={{ color: "var(--accent-primary)" }}
                                        >
                                            Privacy Policy
                                        </Link>
                                    </label>
                                </div>

                                {/* Buttons - One on top, one below */}
                                <div
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: "16px"
                                    }}
                                >
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        style={{
                                            width: "100%",
                                            padding: "16px",
                                            background: loading
                                                ? "linear-gradient(135deg, #94a3b8, #64748b)"
                                                : "linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))",
                                            boxShadow: loading
                                                ? "none"
                                                : "0 6px 20px rgba(69, 104, 130, 0.4)",
                                            cursor: loading ? "not-allowed" : "pointer",
                                            opacity: loading ? 0.7 : 1
                                        }}
                                        className="py-4 rounded-lg font-semibold text-white transition-all duration-300 hover:shadow-xl"
                                    >
                                        {loading ? (
                                            <div className="flex items-center justify-center">
                                                <svg className="animate-spin h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Creating Account...
                                            </div>
                                        ) : (
                                            "Create Account"
                                        )}
                                    </button>
                                    <Link
                                        to="/login"
                                        style={{
                                            width: "100%",
                                            padding: "16px",
                                            borderColor: "var(--border-secondary)",
                                            color: "var(--accent-primary)",
                                            backgroundColor: "rgba(69, 104, 130, 0.1)"
                                        }}
                                        className="flex items-center justify-center py-4 rounded-lg font-semibold border transition-all duration-300 hover:shadow-md text-center"
                                    >
                                        Already have an account? Sign In
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>

            </div>
        </div>
    );
}