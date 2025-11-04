import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  CheckSquare, 
  DollarSign, 
  BarChart3,
  StickyNote,
  User, 
  Settings,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Sidebar: React.FC = () => {
  const { signOut, user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Tasks', href: '/tasks', icon: CheckSquare },
    { name: 'Finance', href: '/finance', icon: DollarSign },
    { name: 'Analytics', href: '/analytics', icon: BarChart3 },
    { name: 'Notes', href: '/notes', icon: StickyNote },
    { name: 'Profile', href: '/profile', icon: User },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  const handleSignOut = () => {
    signOut();
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden bg-gray-900 text-white p-4 flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-2">
            <img src="/Untitled design.png" alt="WORKLOOP" className="h-8 w-8" />
            <h1 className="text-lg font-bold text-orange-300">WORKLOOP</h1>
          </div>
          <p className="text-gray-400 text-xs">Welcome, {user?.user_metadata?.full_name || 'User'}</p>
        </div>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-lg hover:bg-gray-800 transition-colors"
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile menu overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black bg-opacity-50" onClick={closeMobileMenu} />
      )}

      {/* Sidebar */}
      <div className={`
        bg-gray-900 text-white 
        lg:w-64 lg:min-h-screen lg:flex lg:flex-col lg:relative
        ${isMobileMenuOpen 
          ? 'fixed inset-y-0 left-0 z-50 w-64 flex flex-col transform translate-x-0' 
          : 'fixed inset-y-0 left-0 z-50 w-64 flex flex-col transform -translate-x-full lg:translate-x-0'
        }
        transition-transform duration-300 ease-in-out
      `}>
        {/* Desktop header */}
        <div className="hidden lg:block p-6">
          <div className="flex items-center space-x-3 mb-2">
            <img src="/Untitled design.png" alt="WORKLOOP" className="h-10 w-10" />
            <h1 className="text-2xl font-bold text-orange-300">WORKLOOP</h1>
          </div>
          <p className="text-gray-400 text-sm mt-1">Welcome, {user?.user_metadata?.full_name || 'User'}</p>
        </div>

        {/* Mobile header */}
        <div className="lg:hidden p-4 border-b border-gray-700 flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2">
              <img src="/Untitled design.png" alt="WORKLOOP" className="h-8 w-8" />
              <h1 className="text-xl font-bold text-orange-300">WORKLOOP</h1>
            </div>
            <p className="text-gray-400 text-sm mt-1">Welcome, {user?.user_metadata?.full_name || 'User'}</p>
          </div>
          <button
            onClick={closeMobileMenu}
            className="p-2 rounded-lg hover:bg-gray-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <nav className="flex-1 px-4 pb-4 overflow-y-auto">
          <ul className="space-y-2 mt-4 lg:mt-0">
            {navigation.map((item) => (
              <li key={item.name}>
                <NavLink
                  to={item.href}
                  onClick={closeMobileMenu}
                  className={({ isActive }) =>
                    `flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 ${
                      isActive
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                    }`
                  }
                >
                  <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                  <span className="truncate">{item.name}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        
        <div className="p-4 border-t border-gray-700">
          <button
            onClick={() => {
              handleSignOut();
              closeMobileMenu();
            }}
            className="flex items-center w-full px-4 py-3 text-sm font-medium text-gray-300 rounded-lg hover:bg-gray-800 hover:text-white transition-colors duration-200"
          >
            <LogOut className="mr-3 h-5 w-5 flex-shrink-0" />
            <span className="truncate">Sign Out</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;