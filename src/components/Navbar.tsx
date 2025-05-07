'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  getUsername,
  isAuthenticated,
  removeToken,
  removeUsername,
  removeIsAuthenticated,
} from '../app/utils/auth'; // adjust path if necessary
import { u } from 'framer-motion/client';

export default function Navbar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [auth, setAuth] = useState(false);
  const [username, setUsername] = useState('');

  const checkAuth = () => {
    if (isAuthenticated()) {
      setAuth(true);
      setUsername(getUsername() || 'User');
    } else {
      setAuth(false);
      setUsername('');
    }
  };
  useEffect(() => {
    checkAuth();
  }, [pathname]);
  

  const handleSignOut = () => {
    removeToken();
    removeUsername();
    removeIsAuthenticated();
    setAuth(false);
    setUsername('');
    window.location.href = '/login'; // Redirect after logout
  };

  const getInitials = (name:string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-2xl font-bold text-blue-900">
            Bozz Tips
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-600 hover:text-blue-900">Home</Link>
            <Link href="/predictions" className="text-gray-600 hover:text-blue-900">Predictions</Link>
            <Link href="/about" className="text-gray-600 hover:text-blue-900">About</Link>

            {auth ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-2 text-gray-600 hover:text-blue-900 focus:outline-none"
                >
                  <div className="w-8 h-8 rounded-full bg-blue-900 flex items-center justify-center text-white font-semibold">
                    {getInitials(username)}
                  </div>
                  <span>{username}</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1">
                    <Link href="/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Dashboard</Link>
                    <Link href="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Settings</Link>
                    <button
                      onClick={handleSignOut}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="bg-blue-900 text-white px-4 py-2 rounded-full hover:bg-blue-800 transition-colors"
              >
                Sign In
              </Link>
            )}
          </div>

          <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link href="/" className="block px-3 py-2 text-gray-600 hover:text-blue-900">Home</Link>
              <Link href="/predictions" className="block px-3 py-2 text-gray-600 hover:text-blue-900">Predictions</Link>
              <Link href="/about" className="block px-3 py-2 text-gray-600 hover:text-blue-900">About</Link>
              {auth ? (
                <>
                  <Link href="/dashboard" className="block px-3 py-2 text-gray-600 hover:text-blue-900">Dashboard</Link>
                  <Link href="/settings" className="block px-3 py-2 text-gray-600 hover:text-blue-900">Settings</Link>
                  <button
                    onClick={handleSignOut}
                    className="block w-full text-left px-3 py-2 text-gray-600 hover:text-blue-900"
                  >
                    Sign out
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  className="block px-3 py-2 bg-blue-900 text-white rounded-full text-center hover:bg-blue-800 transition-colors"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
