"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { getUsername, getToken } from "../utils/auth";
import { useRouter } from "next/navigation";

const UserHome: React.FC = () => {
  const [username, setUsername] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!getToken()) {
      router.push("/login");
    } else {
      setUsername(getUsername());
    }
  }, [router]);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[40vh] sm:h-[60vh] bg-gradient-to-br from-blue-900 to-blue-700">
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative container mx-auto px-2 sm:px-4 h-full flex flex-col justify-center items-center text-white text-center">
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold mb-2 sm:mb-4">
            Welcome, {username || "User"}!
          </h1>
          <p className="text-base sm:text-lg md:text-xl mb-4 sm:mb-6 max-w-xs sm:max-w-2xl">
            This is your personalized home page. Access all your features below.
          </p>
          <div className="flex gap-2 sm:gap-4 flex-col sm:flex-row w-full sm:w-auto">
            <Link href="/dashboard" className="bg-blue-500 hover:bg-blue-600 text-white px-6 sm:px-8 py-2 sm:py-3 rounded-full font-semibold transition-colors w-full sm:w-auto">Dashboard</Link>
            <Link href="/settings" className="bg-white text-blue-900 px-6 sm:px-8 py-2 sm:py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors w-full sm:w-auto">Settings</Link>
            <Link href="/payment" className="bg-green-500 hover:bg-green-600 text-white px-6 sm:px-8 py-2 sm:py-3 rounded-full font-semibold transition-colors w-full sm:w-auto">Payment</Link>
            <Link href="/logout" className="bg-red-500 hover:bg-red-600 text-white px-6 sm:px-8 py-2 sm:py-3 rounded-full font-semibold transition-colors w-full sm:w-auto">Logout</Link>
          </div>
        </div>
      </section>

      {/* You can add more personalized sections here, or copy more from your home page */}
    </div>
  );
};

export default UserHome; 