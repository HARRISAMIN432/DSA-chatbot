import {
  Menu,
  LogOut,
  User,
  Settings,
  Sparkles,
  ChevronDown,
} from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { useState } from "react";

const Header = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
  };

  return (
    <header className="bg-slate-800/80 backdrop-blur-xl border-b border-slate-700/50 px-4 py-3 flex items-center justify-between relative">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-800/50 to-slate-900/50" />

      <div className="flex items-center space-x-4 relative z-10">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2.5 rounded-xl hover:bg-slate-700/50 transition-all duration-200 hover:scale-105 group"
        >
          <Menu className="h-5 w-5 text-slate-300 group-hover:text-white" />
        </button>

        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 shadow-lg">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <h1 className="text-xl font-bold">
            <span className="text-white">DSA</span>{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
              Chatbot
            </span>
          </h1>
        </div>
      </div>

      <div className="relative z-10">
        <button
          onClick={() => setShowUserMenu(!showUserMenu)}
          className="flex items-center space-x-3 p-2.5 rounded-xl hover:bg-slate-700/50 transition-all duration-200 hover:scale-105 group"
        >
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 shadow-md">
            <User className="h-4 w-4 text-white" />
          </div>
          <span className="text-slate-300 hidden sm:block font-medium group-hover:text-white transition-colors">
            {user?.username}
          </span>
          <ChevronDown
            className={`h-4 w-4 text-slate-400 group-hover:text-white transition-all duration-200 ${
              showUserMenu ? "rotate-180" : ""
            }`}
          />
        </button>

        {showUserMenu && (
          <div className="absolute right-0 mt-2 w-64 bg-slate-800/95 backdrop-blur-xl rounded-xl shadow-2xl border border-slate-700/50 z-50 animate-fade-in">
            {/* User Info */}
            <div className="p-4 border-b border-slate-700/50">
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg">
                  <User className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-white font-semibold">{user?.username}</p>
                  <p className="text-slate-400 text-sm">{user?.email}</p>
                </div>
              </div>
            </div>

            <div className="p-2">
              <button className="w-full text-left px-3 py-3 text-slate-300 hover:bg-slate-700/50 transition-all duration-200 rounded-lg flex items-center space-x-3 group hover:text-white">
                <div className="p-1.5 bg-slate-700/50 rounded-lg group-hover:bg-slate-600/50 transition-colors">
                  <Settings className="h-4 w-4" />
                </div>
                <span className="font-medium">Settings</span>
              </button>

              <button
                onClick={handleLogout}
                className="w-full text-left px-3 py-3 text-slate-300 hover:bg-red-500/10 transition-all duration-200 rounded-lg flex items-center space-x-3 group hover:text-red-400"
              >
                <div className="p-1.5 bg-slate-700/50 rounded-lg group-hover:bg-red-500/20 transition-colors">
                  <LogOut className="h-4 w-4" />
                </div>
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
