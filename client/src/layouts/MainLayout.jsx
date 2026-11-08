import Navbar from "../components/Navbar.jsx";

const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">{children}</main>
      <footer className="text-center text-xs text-gray-400 py-6">
        AI Resume Analyzer & Smart Job Matcher
      </footer>
    </div>
  );
};

export default MainLayout;
