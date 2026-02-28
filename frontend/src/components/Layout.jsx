import React from 'react';
import Navbar from './Navbar';
import { ChevronDown } from 'lucide-react';
import { useSelector } from 'react-redux';

const Layout = ({ children }) => {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="flex min-h-screen bg-[#F0F2F5] font-sans">
      <Navbar />
      <div className="flex-1 flex flex-col pt-8 px-10 overflow-x-hidden">
        {/* Top Header matching the UI */}
        <header className="flex justify-end items-center mb-8">
          <div className="flex items-center gap-6 bg-white py-2 px-4 rounded-full shadow-sm">
             <div className="flex items-center gap-3 pl-2 cursor-pointer">
               <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-brand-dark font-bold text-sm uppercase">
                 {user?.username ? user.username.substring(0, 2) : 'GS'}
               </div>
               <span className="text-sm font-semibold text-gray-700 pr-2">{user?.username || 'Guest User'}</span>
             </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 pb-10">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
