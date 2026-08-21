'use client';

import Link from 'next/link';
import { useAuth } from '@/providers/AuthProvider';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold text-orange-600">BookMyPanditJi</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <Link href="/" className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-orange-600">Home</Link>
            <Link href="/services" className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-orange-600">Services</Link>
            <Link href="/pandits" className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-orange-600">Find Pandits</Link>
            <Link href="/products" className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-orange-600">Products</Link>
            <Link href="/about" className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-orange-600">About Us</Link>

            <Link href="/register-pandit" className="bg-orange-100 hover:bg-orange-200 text-orange-600 px-3 py-2 rounded-md text-sm font-medium">Register as Pandit</Link>

            {isAuthenticated && user ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-700">{user.name}</span>
                <button onClick={logout} className="text-red-600 hover:underline">Sign out</button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link href="/login" className="text-sm font-medium text-gray-700 hover:text-orange-600">Login</Link>
                <Link href="/register" className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-md text-sm font-medium">Register</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}