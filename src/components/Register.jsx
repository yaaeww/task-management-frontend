import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    if (password !== passwordConfirmation) {
      setErrors({ password: "Passwords do not match" });
      setIsSubmitting(false);
      return;
    }

    console.log("🔄 Registration process started...");

    try {
      const result = await register(name, email, password, passwordConfirmation);

      console.log("📝 Registration result:", result);

      if (result.success) {
        console.log("✅ Registration successful, forcing redirect...");
        
        // SOLUSI PASTI: Force redirect dengan window.location
        setTimeout(() => {
          window.location.href = "/dashboard";
        }, 100);
        
      } else {
        console.error("❌ Registration failed with error:", result.error);
        if (result.error) {
          if (typeof result.error === "object") {
            setErrors(result.error);
          } else {
            setErrors({ general: result.error });
          }
        } else {
          setErrors({ general: "An error occurred during registration." });
        }
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error("❌ Registration error:", error);
      setErrors({ general: "An unexpected error occurred." });
      setIsSubmitting(false);
    }
  };

  // Password strength indicator
  const getPasswordStrength = () => {
    if (password.length === 0) return { width: "0%", color: "transparent", text: "" };
    if (password.length < 6) return { width: "33%", color: "var(--error)", text: "Weak" };
    if (password.length < 8) return { width: "66%", color: "var(--warning)", text: "Medium" };
    return { width: "100%", color: "var(--success)", text: "Strong" };
  };

  const passwordStrength = getPasswordStrength();

  return (
    <div className="register-container">
      <div className="register-layout">
        {/* Left Panel - Illustration */}
        <div className="register-illustration-panel">
          {/* Background Shapes */}
          <div className="bg-shape bg-shape-1"></div>
          <div className="bg-shape bg-shape-2"></div>
          <div className="bg-shape bg-shape-3"></div>
          
          <div className="register-illustration-container">
            <span className="register-illustration-icon">🚀</span>
            <h2 className="register-illustration-title">Join Task Manager Pro</h2>
            <p className="register-illustration-subtitle">
              Start your productivity journey with our powerful task management system. Get organized and achieve more.
            </p>

            {/* Benefits Grid */}
            <div className="benefits-grid">
              <div className="benefit-item">
                <span className="benefit-icon">📈</span>
                <div className="benefit-text">Boost Productivity</div>
              </div>
              <div className="benefit-item">
                <span className="benefit-icon">🆓</span>
                <div className="benefit-text">Free Forever</div>
              </div>
              <div className="benefit-item">
                <span className="benefit-icon">🔔</span>
                <div className="benefit-text">Smart Reminders</div>
              </div>
              <div className="benefit-item">
                <span className="benefit-icon">🌐</span>
                <div className="benefit-text">Access Anywhere</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Registration Form */}
        <div className="register-form-panel">
          <div className="register-header">
            <div className="register-logo">
              <span className="register-logo-icon">👤</span>
            </div>
            <h1 className="text-white">Create Account</h1>
            <p className="register-subtitle">Sign up to start managing your tasks</p>
          </div>

          <form className="register-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name" className="form-label">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                className={`input-modern ${errors.name ? 'input-error' : ''}`}
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isSubmitting}
              />
              {errors.name && (
                <div className="error-message">
                  <span>⚠️</span>
                  {errors.name[0]}
                </div>
              )}
            </div>

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
                className={`input-modern ${errors.email ? 'input-error' : ''}`}
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
              />
              {errors.email && (
                <div className="error-message">
                  <span>⚠️</span>
                  {errors.email[0]}
                </div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className={`input-modern ${errors.password ? 'input-error' : ''}`}
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isSubmitting}
              />
              {password && (
                <div className="password-strength">
                  <div className="strength-bar">
                    <div 
                      className="strength-fill" 
                      style={{ 
                        width: passwordStrength.width, 
                        backgroundColor: passwordStrength.color 
                      }}
                    ></div>
                  </div>
                  <div className="strength-text">
                    Password strength: {passwordStrength.text}
                  </div>
                </div>
              )}
              {errors.password && (
                <div className="error-message">
                  <span>⚠️</span>
                  {errors.password[0]}
                </div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="passwordConfirmation" className="form-label">
                Confirm Password
              </label>
              <input
                id="passwordConfirmation"
                name="passwordConfirmation"
                type="password"
                autoComplete="new-password"
                required
                className={`input-modern ${errors.password ? 'input-error' : ''}`}
                placeholder="Confirm your password"
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
                disabled={isSubmitting}
              />
              {passwordConfirmation && password !== passwordConfirmation && (
                <div className="error-message">
                  <span>⚠️</span>
                  Passwords do not match
                </div>
              )}
            </div>

            {/* General Error Message */}
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
            <button
              type="submit"
              disabled={isSubmitting}
              className="register-btn"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <div className="loading-spinner-sm mr-3"></div>
                  Creating account...
                </div>
              ) : (
                "Create Account"
              )}
            </button>

            {/* Login Link */}
            <div className="login-link">
              <p className="login-text">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="login-link-text"
                >
                  Sign in here
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;