import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useDarkMode from "../hooks/useDarkMode";

const Navbar = () => {
  const { user, logout } = useAuth();
  const [isDark, setIsDark] = useDarkMode();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="border-b border-gray-100 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-2">
        <Link
          to="/"
          className="font-bold text-base sm:text-lg text-primary-600 dark:text-primary-400"
        >
          AI Resume Analyzer
        </Link>

        <div className="flex flex-wrap items-center justify-end gap-2 sm:gap-4">
          {user ? (
            <>
              <Link
                to="/dashboard"
                className="text-xs sm:text-sm hover:text-primary-600"
              >
                Dashboard
              </Link>
              <Link
                to="/upload"
                className="text-xs sm:text-sm hover:text-primary-600"
              >
                Upload
              </Link>
              <Link
                to="/jobs"
                className="text-xs sm:text-sm hover:text-primary-600"
              >
                Jobs
              </Link>
              <Link
                to="/saved-jobs"
                className="text-xs sm:text-sm hover:text-primary-600"
              >
                Saved
              </Link>
              <Link
                to="/profile"
                className="text-xs sm:text-sm hover:text-primary-600"
              >
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="btn-secondary text-xs sm:text-sm py-1.5"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-xs sm:text-sm hover:text-primary-600"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="btn-primary text-xs sm:text-sm py-1.5"
              >
                Get Started
              </Link>
            </>
          )}
          <button
            onClick={() => setIsDark(!isDark)}
            aria-label="Toggle dark mode"
            className="text-sm w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 shrink-0"
          >
            {isDark ? "☀️" : "🌙"}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
