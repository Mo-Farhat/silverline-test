import React from 'react';
import { NavLink } from 'react-router-dom';
import { FileUp, FolderOpen, LogOut } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { logout } from '../features/auth/authSlice';

const Navbar = () => {
  const dispatch = useDispatch();
  const navItems = [
    { name: 'Upload', path: '/upload', icon: FileUp },
    { name: 'Files', path: '/files', icon: FolderOpen },
  ];

  return (
    <div className="w-64 bg-brand-dark min-h-screen text-white rounded-r-3xl flex flex-col py-8 shadow-xl relative z-10">
      <div className="flex items-center justify-center mb-12">
        <div className="flex items-center gap-2">
           {/* Logo and texts removed per request */}
        </div>
      </div>
      
      <nav className="flex-1 px-4 space-y-2 text-gray-400">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-4 px-6 py-3 rounded-2xl transition-all duration-200 ${
                isActive
                  ? 'bg-white text-brand-dark shadow-md font-semibold'
                  : 'text-indigo-100 hover:bg-brand-dark hover:brightness-125 hover:text-white'
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="px-4 mt-auto">
        <button 
          onClick={() => dispatch(logout())}
          className="flex items-center gap-4 px-6 py-3 w-full text-indigo-100 hover:bg-brand-dark hover:brightness-125 hover:text-white rounded-2xl transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span>Log Out</span>
        </button>
      </div>
    </div>
  );
};

export default Navbar;
