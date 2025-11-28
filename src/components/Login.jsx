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

    console.log("📝 Login result:", result); // ✅ DEBUG

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
      console.log("📦 User data:", result.data.user);
      console.log(
        "🔑 Token:",
        result.data.access_token ? "Received" : "Missing"
      );

      // ✅ CEK LOCALSTORAGE
      const storedUser = localStorage.getItem("user");
      const storedToken = localStorage.getItem("access_token");
      console.log("💾 Stored user:", storedUser);
      console.log("💾 Stored token:", storedToken ? "Exists" : "Missing");

      // ✅ CEK AUTH STATE
      setTimeout(() => {
        console.log("🕒 After timeout - checking auth again...");
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
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {errors.general && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              <strong>Error:</strong> {errors.general}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {isSubmitting ? "Signing in..." : "Sign in"}
            </button>
          </div>

          <div className="text-center">
            <Link
              to="/register"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Don't have an account? Sign up
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
