import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { Eye, EyeOff, AlertCircle, Mail, Lock, User } from "lucide-react";

const Signup = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await signup(formData);
      navigate("/chat");
    } catch (error) {
      setError(error.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.1),transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(139,92,246,0.1),transparent_60%)]" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
      <div
        className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"
        style={{ animationDelay: "1s" }}
      />

      <div className="max-w-md w-full space-y-8 relative z-10">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center w-25 h-25 mx-auto rounded-2xl mb-2">
            <img src="chatbot.svg" className="h-25 w-25 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white">Join DSA Chatbot</h1>
          <p className="text-slate-400 text-lg">
            Start your journey to master algorithms
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {error && (
            <div className="bg-red-500/10 backdrop-blur-sm border border-red-500/20 rounded-xl p-4 flex items-center space-x-3 animate-fade-in">
              <div className="p-2 bg-red-500/20 rounded-lg">
                <AlertCircle className="h-5 w-5 text-red-400" />
              </div>
              <p className="text-red-400 font-medium">{error}</p>
            </div>
          )}

          <div className="space-y-5">
            <div className="group">
              <label
                htmlFor="username"
                className="block text-sm font-semibold text-slate-300 mb-3 group-focus-within:text-blue-400 transition-colors"
              >
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={formData.username}
                  onChange={handleChange}
                  className="
                    w-full pl-4 pr-4 py-4 bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 
                    rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 
                    focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300
                    hover:border-slate-600/50 hover:bg-slate-800/70
                  "
                  placeholder="Choose a username"
                />
              </div>
            </div>

            <div className="group">
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-slate-300 mb-3 group-focus-within:text-blue-400 transition-colors"
              >
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="
                    w-full pl-4 pr-4 py-4 bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 
                    rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 
                    focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300
                    hover:border-slate-600/50 hover:bg-slate-800/70
                  "
                  placeholder="Enter your email address"
                />
              </div>
            </div>

            <div className="group">
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-blue-300 mb-3 group-focus-within:text-blue-400 transition-colors"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-blue-400 group-focus-within:text-blue-400 transition-colors" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="
                    w-full pl-4 pr-12 py-4 bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 
                    rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 
                    focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300
                    hover:border-blue-600/50 hover:bg-blue-800/70
                  "
                  placeholder="Create a password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="
              relative w-full py-4 px-6 bg-gradient-to-r from-blue-500 to-cyan-500 
              hover:from-blue-600 hover:to-cyan-600 text-white font-semibold rounded-xl 
              transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed 
              hover:shadow-lg hover:shadow-blue-500/25 hover:scale-105 active:scale-95
              overflow-hidden group
            "
          >
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            {loading ? (
              <div className="relative flex items-center justify-center space-x-3">
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                <span>Creating your account...</span>
              </div>
            ) : (
              <span className="relative">Create Account</span>
            )}
          </button>

          <div className="text-center pt-6">
            <p className="text-slate-400">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-blue-400 hover:text-blue-300 font-semibold transition-colors hover:underline"
              >
                Sign In
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
