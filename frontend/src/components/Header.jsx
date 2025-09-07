import { Menu, LogOut, User } from "lucide-react";
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
    <header className="bg-gray-800 border-b border-gray-700 px-4 py-3 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg hover:bg-gray-700 transition-colors"
        >
          <Menu className="h-5 w-5 text-gray-300" />
        </button>
        <h1 className="text-xl font-bold text-white">
          DSA <span className="text-primary-500">Chatbot</span>
        </h1>
      </div>

      <div className="relative">
        <button
          onClick={() => setShowUserMenu(!showUserMenu)}
          className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-700 transition-colors"
        >
          <User className="h-5 w-5 text-gray-300" />
          <span className="text-gray-300 hidden sm:block">
            {user?.username}
          </span>
        </button>

        {showUserMenu && (
          <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg border border-gray-700 z-50">
            <div className="p-3 border-b border-gray-700">
              <p className="text-white font-medium">{user?.username}</p>
              <p className="text-gray-400 text-sm">{user?.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="w-full text-left px-3 py-2 text-gray-300 hover:bg-gray-700 transition-colors flex items-center space-x-2"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
