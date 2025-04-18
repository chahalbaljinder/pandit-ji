'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileDropdownOpen(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold text-orange-600">BookMyPanditJi</span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center justify-between flex-1 ml-10">
            <div className="flex space-x-4">
              <Link href="/" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-orange-600">
                Home
              </Link>
              <Link href="/services" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-orange-600">
                Services
              </Link>
              <Link href="/pandits" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-orange-600">
                Find Pandits
              </Link>
              <Link href="/about" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-orange-600">
                About Us
              </Link>
            </div>
            
            <div className="flex items-center">
              {/* User Profile Icon & Dropdown */}
              <div className="ml-4 relative flex-shrink-0" ref={dropdownRef}>
                <div>
                  <button 
                    onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                    className="bg-orange-100 flex text-sm rounded-full focus:outline-none"
                    id="user-menu"
                    aria-haspopup="true"
                  >
                    <span className="sr-only">Open user menu</span>
                    <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-semibold">
                      RS
                    </div>
                  </button>
                </div>
                
                {/* Profile dropdown panel */}
                {isProfileDropdownOpen && (
                  <div 
                    className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 z-50" 
                    role="menu" 
                    aria-orientation="vertical" 
                    aria-labelledby="user-menu"
                  >
                    <Link 
                      href="/profile" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50"
                      role="menuitem"
                      onClick={() => setIsProfileDropdownOpen(false)}
                    >
                      Your Profile
                    </Link>
                    <Link 
                      href="/profile?tab=bookings" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50"
                      role="menuitem"
                      onClick={() => setIsProfileDropdownOpen(false)}
                    >
                      My Bookings
                    </Link>
                    <Link 
                      href="/profile?tab=wallet" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50"
                      role="menuitem"
                      onClick={() => setIsProfileDropdownOpen(false)}
                    >
                      Wallet
                    </Link>
                    <Link 
                      href="/profile?tab=settings" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50"
                      role="menuitem"
                      onClick={() => setIsProfileDropdownOpen(false)}
                    >
                      Settings
                    </Link>
                    <div className="border-t border-gray-100"></div>
                    <a 
                      href="#" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50"
                      role="menuitem"
                      onClick={() => setIsProfileDropdownOpen(false)}
                    >
                      Sign out
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-orange-600 focus:outline-none"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {/* Icon when menu is closed */}
              <svg
                className={`${isMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              {/* Icon when menu is open */}
              <svg
                className={`${isMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu Panel */}
      <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden`}>
        <div className="pt-2 pb-3 space-y-1">
          <Link 
            href="/"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-orange-50 hover:text-orange-600"
            onClick={() => setIsMenuOpen(false)}
          >
            Home
          </Link>
          <Link 
            href="/services"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-orange-50 hover:text-orange-600"
            onClick={() => setIsMenuOpen(false)}
          >
            Services
          </Link>
          <Link 
            href="/pandits"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-orange-50 hover:text-orange-600"
            onClick={() => setIsMenuOpen(false)}
          >
            Find Pandits
          </Link>
          <Link 
            href="/about"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-orange-50 hover:text-orange-600"
            onClick={() => setIsMenuOpen(false)}
          >
            About Us
          </Link>
        </div>
        
        {/* Mobile Profile Links */}
        <div className="pt-4 pb-3 border-t border-gray-200">
          <div className="flex items-center px-4">
            <div className="flex-shrink-0">
              <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-semibold">
                RS
              </div>
            </div>
            <div className="ml-3">
              <div className="text-base font-medium text-gray-800">Rahul Sharma</div>
              <div className="text-sm font-medium text-gray-500">rahul.sharma@example.com</div>
            </div>
          </div>
          <div className="mt-3 space-y-1">
            <Link 
              href="/profile"
              className="block px-4 py-2 text-base font-medium text-gray-700 hover:bg-orange-50 hover:text-orange-600"
              onClick={() => setIsMenuOpen(false)}
            >
              Your Profile
            </Link>
            <Link 
              href="/profile?tab=bookings"
              className="block px-4 py-2 text-base font-medium text-gray-700 hover:bg-orange-50 hover:text-orange-600"
              onClick={() => setIsMenuOpen(false)}
            >
              My Bookings
            </Link>
            <Link 
              href="/profile?tab=wallet"
              className="block px-4 py-2 text-base font-medium text-gray-700 hover:bg-orange-50 hover:text-orange-600"
              onClick={() => setIsMenuOpen(false)}
            >
              Wallet
            </Link>
            <Link 
              href="/profile?tab=settings"
              className="block px-4 py-2 text-base font-medium text-gray-700 hover:bg-orange-50 hover:text-orange-600"
              onClick={() => setIsMenuOpen(false)}
            >
              Settings
            </Link>
            <a 
              href="#" 
              className="block px-4 py-2 text-base font-medium text-gray-700 hover:bg-orange-50 hover:text-orange-600"
              onClick={() => setIsMenuOpen(false)}
            >
              Sign out
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}