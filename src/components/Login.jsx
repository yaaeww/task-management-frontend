import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    console.log("🔄 Login process started...");

    const result = await login(email, password);

    console.log("📝 Login result:", result);

    if (!result.success) {
      console.error("❌ Login failed with error:", result.error);
      if (result.error && typeof result.error === "object") {
        setErrors(result.error);
      } else if (result.error) {
        setErrors({ general: result.error });
      } else {
        setErrors({ general: "An error occurred during login." });
      }
    } else {
      console.log("✅ Login successful, checking auth state...");

      setTimeout(() => {
        const currentUser = JSON.parse(localStorage.getItem("user") || "null");
        console.log("👤 Current user in storage:", currentUser);

        if (currentUser) {
          console.log("🚀 Redirecting to dashboard...");
          navigate("/dashboard");
        } else {
          console.log("❌ User not found in storage, redirect failed");
          setErrors({ general: "Authentication failed. Please try again." });
        }
      }, 100);
    }

    setIsSubmitting(false);
  };

  return (
    <div className="login-container">
      <div className="login-layout">
        {/* Left Panel - Login Form */}
        <div className="login-form-panel">
          <div className="login-header">
            <div className="login-logo">
              <span className="login-logo-icon">🔐</span>
            </div>
            <h1 className="login-title">Welcome Back</h1>
            <p className="login-subtitle">
              Sign in to continue to your dashboard
            </p>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="input-modern"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="input-modern"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {/* Error Message */}
            {errors.general && (
              <div className="alert-error">
                <div className="flex items-center space-x-2">
                  <span>⚠️</span>
                  <div>
                    <strong>Error:</strong> {errors.general}
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button type="submit" disabled={isSubmitting} className="login-btn">
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <div className="loading-spinner-sm mr-3"></div>
                  Signing in...
                </div>
              ) : (
                "Sign In"
              )}
            </button>

            {/* Register Link */}
            <div className="register-link">
              <p className="register-text">
                Don't have an account?{" "}
                <Link to="/register" className="register-link-text">
                  Sign up here
                </Link>
              </p>
            </div>
          </form>
        </div>

        {/* Right Panel - Illustration */}
        <div className="login-illustration-panel">
          {/* Background Shapes */}
          <div className="bg-shape bg-shape-1"></div>
          <div className="bg-shape bg-shape-2"></div>
          <div className="bg-shape bg-shape-3"></div>

          <div className="illustration-container">
            <span className="illustration-icon">📊</span>
            <h2 className="illustration-title">Task Manager Pro</h2>
            <p className="illustration-subtitle">
              Manage your tasks efficiently with our powerful task management
              system. Stay organized and boost your productivity.
            </p>

            {/* Features Grid */}
            <div className="features-grid">
              <div className="feature-item">
                <span className="feature-icon">📋</span>
                <div className="feature-text">Task Management</div>
              </div>
              <div className="feature-item">
                <span className="feature-icon">⚡</span>
                <div className="feature-text">Real-time Updates</div>
              </div>
              <div className="feature-item">
                <span className="feature-icon">🔒</span>
                <div className="feature-text">Secure & Private</div>
              </div>
              <div className="feature-item">
                <span className="feature-icon">📱</span>
                <div className="feature-text">Responsive Design</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
