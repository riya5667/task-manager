import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import ThemeToggle from '../ThemeToggle/ThemeToggle';
import { FiLogOut, FiChevronDown, FiUser } from 'react-icons/fi';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getInitials = (email) => {
    if (!email) return 'U';
    return email.substring(0, 2).toUpperCase();
  };

  return (
    <nav className="glass sticky top-0 z-50 px-6 py-3 flex items-center justify-between mb-8 shadow-sm">
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center font-bold text-white shadow-md shadow-primary/20">
          TF
        </div>
        <span className="text-xl font-bold tracking-tight text-foreground">TaskFlow</span>
      </div>
      
      <div className="flex items-center space-x-4">
        <ThemeToggle />
        
        {user && (
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center space-x-2 pl-2 pr-3 py-1 rounded-full border border-border bg-card hover:bg-muted-bg transition"
            >
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-xs font-bold text-white">
                {getInitials(user.email)}
              </div>
              <FiChevronDown className="text-muted w-4 h-4" />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-xl border border-border bg-card shadow-lg shadow-black/5 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-4 py-3 border-b border-border bg-muted-bg/50">
                  <p className="text-sm font-medium text-foreground truncate">{user.email}</p>
                </div>
                <div className="p-1">
                  <button
                    onClick={logout}
                    className="flex w-full items-center space-x-2 px-3 py-2 text-sm text-danger hover:bg-danger/10 rounded-lg transition"
                  >
                    <FiLogOut className="w-4 h-4" />
                    <span>Log out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
