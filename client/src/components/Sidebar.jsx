import React from 'react';
import { NavLink, Link } from 'react-router-dom';

const Sidebar = ({ isOpen, closeSidebar }) => {
  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: '📊' },
    { name: 'Experiments', path: '/experiments', icon: '🧪' },
    { name: 'Create Experiment', path: '/create-experiment', icon: '➕' },
    { name: 'Results Data', path: '/results', icon: '📈' },
    { name: 'Settings', path: '/settings', icon: '⚙️' },
  ];

  return (
    <>
      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 md:hidden"
          onClick={closeSidebar}
        ></div>
      )}

      <aside className={`fixed md:sticky top-0 left-0 w-64 bg-slate-900 border-r border-slate-800 h-screen transition-transform duration-300 ease-in-out z-50 flex flex-col pt-6 ${
        isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}>
      
      {/* Brand Logo in Sidebar for Dashboard Layout */}
      <div className="px-6 pb-6 border-b border-slate-800 mb-6">
         <Link to="/dashboard" className="text-xl font-bold text-white flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center text-white font-bold shadow-lg shadow-brand-500/30">C</div>
            CognitoLab
         </Link>
      </div>

      <nav className="flex-1 px-4 space-y-1.5">
        <p className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Main Menu</p>
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            onClick={closeSidebar}
            className={({ isActive }) => 
              `flex items-center px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive 
                  ? 'bg-brand-600/10 text-brand-400 font-medium border border-brand-500/20 shadow-[0_0_15px_-3px_rgba(14,165,233,0.1)]' 
                  : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 border border-transparent'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span className={`mr-3 text-lg ${isActive ? 'opacity-100' : 'opacity-70'}`}>{item.icon}</span>
                {item.name}
              </>
            )}
          </NavLink>
        ))}
      </nav>
      
      <div className="p-4 border-t border-slate-800 bg-slate-900/50">
        <div className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-slate-800/50 transition-colors cursor-pointer">
          <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 font-bold text-sm">
            DR
          </div>
          <div className="text-sm flex-1">
             <p className="font-medium text-white line-clamp-1">Dr. Researcher</p>
             <p className="text-slate-500 text-xs line-clamp-1">University Lab</p>
          </div>
          <div className="text-slate-500">⋮</div>
        </div>
      </div>
    </aside>
  </>
);
};

export default Sidebar;
