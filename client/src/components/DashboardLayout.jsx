import React from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';

const DashboardLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const location = useLocation();

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  // Determine page title based on route for the top header
  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes('/create-experiment')) return 'Create Study';
    if (path.includes('/results')) return 'Analytics Data';
    if (path.includes('/experiments')) return 'All Experiments';
    if (path.includes('/settings')) return 'Lab Settings';
    return 'Dashboard Overview';
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* 1. Dark Theme Sidebar on the Left */}
      <Sidebar isOpen={isSidebarOpen} closeSidebar={closeSidebar} />

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* 2. Top Header Bar (Clean, Light Theme) */}
        <header className="h-20 bg-white border-b border-slate-200 sticky top-0 z-30 flex items-center justify-between px-4 sm:px-8 shadow-sm">
           <div className="flex items-center gap-4">
              <button 
                onClick={toggleSidebar}
                className="p-2 -ml-2 text-slate-500 hover:text-brand-600 md:hidden transition-colors"
                aria-label="Toggle Sidebar"
              >
                <span className="text-2xl">☰</span>
              </button>
              <h1 className="text-lg sm:text-xl font-bold text-slate-900 truncate">{getPageTitle()}</h1>
           </div>
           
           <div className="flex items-center gap-5">
              {/* Search Mockup */}
              <div className="hidden md:flex items-center bg-slate-100 rounded-full px-4 py-2 border border-slate-200">
                <span className="text-slate-400 mr-2">🔍</span>
                <input type="text" placeholder="Search studies..." className="bg-transparent border-none focus:ring-0 p-0 text-sm w-48 text-slate-700" />
              </div>

              {/* Action Icons */}
              <button className="text-slate-400 hover:text-brand-600 transition-colors relative">
                 🔔
                 <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
              </button>
              <button className="text-slate-400 hover:text-brand-600 transition-colors">
                 ❓
              </button>
           </div>
        </header>

        {/* 3. Main Content Area */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 sm:p-6 lg:p-8 w-full max-w-7xl mx-auto">
          {children}
        </main>

      </div>
    </div>
  );
};

export default DashboardLayout;
