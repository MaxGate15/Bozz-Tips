'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import {
  getUsername,
  isAuthenticated,
  removeToken,
  removeUsername,
  removeIsAuthenticated,
  getToken,
} from '../app/utils/auth'; // adjust path if necessary
import { u } from 'framer-motion/client';

export default function Navbar() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [auth, setAuth] = useState(false);
  const [username, setUsername] = useState('');
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const notifications = [
    { id: 1, title: 'Games Updated', body: 'New games have been added for today!', date: '2024-06-01' },
    { id: 2, title: 'Welcome!', body: 'Welcome to Bozz Tips! Enjoy your stay.', date: '2024-05-30' },
  ];

  const checkAuth = () => {
    // Authenticated if NextAuth session exists or custom token exists
    if ((status === 'authenticated' && session) || isAuthenticated() || getToken()) {
      setAuth(true);
      setUsername(getUsername() || session?.user?.name || 'User');
    } else {
      setAuth(false);
      setUsername('');
    }
  };
  useEffect(() => {
    checkAuth();
  }, [pathname, status, session]);
  

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
              <>
                {/* Notification Bell */}
                <div className="relative">
                  <button
                    onClick={() => setIsNotifOpen(!isNotifOpen)}
                    className="relative focus:outline-none mr-2"
                    aria-label="Notifications"
                  >
                    <svg className="w-7 h-7 text-blue-900 hover:text-blue-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                    {/* Badge for unread notifications */}
                    <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full px-1.5 py-0.5">{notifications.length}</span>
                  </button>
                  {isNotifOpen && (
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg py-2 z-50 border border-blue-100">
                      <div className="px-4 py-2 font-semibold text-blue-900 border-b">Notifications</div>
                      {notifications.length === 0 ? (
                        <div className="px-4 py-4 text-gray-500">No notifications</div>
                      ) : (
                        notifications.map((notif) => (
                          <div key={notif.id} className="px-4 py-3 border-b last:border-b-0 hover:bg-blue-50">
                            <div className="font-bold text-blue-800">{notif.title}</div>
                            <div className="text-gray-700 text-sm">{notif.body}</div>
                            <div className="text-gray-400 text-xs mt-1">{notif.date}</div>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
                {/* Profile Dropdown */}
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
              </>
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
