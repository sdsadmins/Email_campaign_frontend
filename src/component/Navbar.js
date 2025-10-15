'use client';

import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const isActive = (path) => {
    return pathname === path;
  };

  return (
    <nav className="h-20 border-b border-gray-200/70 backdrop-blur-lg bg-white/80 sticky top-0 z-50 shadow-sm">
      <div className="w-full px-8 lg:px-12 flex items-center h-full justify-between">
        {/* Logo */}
        <Link href="/" className="flex-shrink-0">
          <div className="text-2xl font-bold text-transparent bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text">
            Email Campaign
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center space-x-10">
          <Link 
            href="/email-campaign/dashboard" 
            prefetch={true}
            className={`relative text-sm font-semibold tracking-wide px-4 py-2 rounded-lg transition-all duration-200 ease-in-out ${
              isActive('/email-campaign/dashboard') 
                ? 'text-transparent bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text bg-orange-50/70 shadow-sm' 
                : 'text-gray-700 hover:text-transparent hover:bg-gradient-to-r hover:from-orange-500 hover:to-yellow-500 hover:bg-clip-text hover:bg-orange-50/70'
            }`}
          >
            Dashboard
            {isActive('/email-campaign/dashboard') && (
              <span className="absolute inset-x-0 -bottom-[21px] h-0.5 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full shadow-sm"></span>
            )}
          </Link>
          <Link 
            href="/email-campaign/email-templates" 
            prefetch={true}
            className={`relative text-sm font-semibold tracking-wide px-4 py-2 rounded-lg transition-all duration-200 ease-in-out ${
              isActive('/email-campaign/email-templates') 
                ? 'text-transparent bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text bg-orange-50/70 shadow-sm' 
                : 'text-gray-700 hover:text-transparent hover:bg-gradient-to-r hover:from-orange-500 hover:to-yellow-500 hover:bg-clip-text hover:bg-orange-50/70'
            }`}
          >
            Email Templates
            {isActive('/email-campaign/email-templates') && (
              <span className="absolute inset-x-0 -bottom-[21px] h-0.5 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full shadow-sm"></span>
            )}
          </Link>
          <Link 
            href="/email-campaign/info-list" 
            prefetch={true}
            className={`relative text-sm font-semibold tracking-wide px-4 py-2 rounded-lg transition-all duration-200 ease-in-out ${
              isActive('/email-campaign/info-list') 
                ? 'text-transparent bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text bg-orange-50/70 shadow-sm' 
                : 'text-gray-700 hover:text-transparent hover:bg-gradient-to-r hover:from-orange-500 hover:to-yellow-500 hover:bg-clip-text hover:bg-orange-50/70'
            }`}
          >
            Subscribers
            {isActive('/email-campaign/info-list') && (
              <span className="absolute inset-x-0 -bottom-[21px] h-0.5 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full shadow-sm"></span>
            )}
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="lg:hidden relative w-8 h-8 flex flex-col justify-center items-center space-y-1.5 group" 
          aria-label="Toggle mobile menu"
          onClick={toggleMobileMenu}
        >
          <span className="block w-6 h-0.5 bg-gray-700 transition-all duration-300"></span>
          <span className="block w-6 h-0.5 bg-gray-700 transition-all duration-300"></span>
          <span className="block w-6 h-0.5 bg-gray-700 transition-all duration-300"></span>
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`lg:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-200 shadow-lg transition-all duration-300 ease-in-out ${isMobileMenuOpen ? 'opacity-100 translate-y-0 visible' : 'opacity-0 -translate-y-4 invisible'}`}>
        <div className="px-8 py-8 space-y-4">
          <Link 
            href="/email-campaign/dashboard" 
            className={`block text-base font-semibold tracking-wide px-4 py-3 rounded-xl transition-all duration-300 ${
              isActive('/email-campaign/dashboard') 
                ? 'text-transparent bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text bg-orange-50/70 shadow-sm' 
                : 'text-gray-700 hover:text-transparent hover:bg-gradient-to-r hover:from-orange-500 hover:to-yellow-500 hover:bg-clip-text hover:bg-orange-50'
            }`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Dashboard
          </Link>
          <Link 
            href="/email-campaign/email-templates" 
            className={`block text-base font-semibold tracking-wide px-4 py-3 rounded-xl transition-all duration-300 ${
              isActive('/email-campaign/email-templates') 
                ? 'text-transparent bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text bg-orange-50/70 shadow-sm' 
                : 'text-gray-700 hover:text-transparent hover:bg-gradient-to-r hover:from-orange-500 hover:to-yellow-500 hover:bg-clip-text hover:bg-orange-50'
            }`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Email Templates
          </Link>
          <Link 
            href="/email-campaign/info-list" 
            className={`block text-base font-semibold tracking-wide px-4 py-3 rounded-xl transition-all duration-300 ${
              isActive('/email-campaign/info-list') 
                ? 'text-transparent bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text bg-orange-50/70 shadow-sm' 
                : 'text-gray-700 hover:text-transparent hover:bg-gradient-to-r hover:from-orange-500 hover:to-yellow-500 hover:bg-clip-text hover:bg-orange-50'
            }`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Subscribers
          </Link>
        </div>
      </div>
    </nav>
  );
}
