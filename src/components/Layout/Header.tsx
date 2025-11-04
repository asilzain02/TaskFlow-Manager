import React from 'react';
import NotificationDropdown from './NotificationDropdown';

interface HeaderProps {
  title: string;
  subtitle?: string;
}

const Header: React.FC<HeaderProps> = ({ title, subtitle }) => {
  return (
    <div className="bg-white shadow-sm border-b border-gray-200">
      <div className="px-4 sm:px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">{title}</h1>
          {subtitle && (
            <p className="text-xs sm:text-sm text-gray-600 mt-1 line-clamp-2">{subtitle}</p>
          )}
        </div>
        
        <div className="flex items-center">
          <NotificationDropdown />
        </div>
      </div>
    </div>
  );
};

export default Header;