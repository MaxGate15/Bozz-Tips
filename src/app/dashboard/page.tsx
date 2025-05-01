'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState(new Date('2025-05-01'));
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  const handleDateChange = (date: Date | null) => {
    if (date) {
      setSelectedDate(date);
      setIsDatePickerOpen(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Black Header */}
      <div className="bg-black py-6">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-white">My Dashboard</h1>
          <div className="relative">
            <button
              onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
              className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-gray-100"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </button>
            {isDatePickerOpen && (
              <div className="absolute right-0 mt-2 z-10">
                <DatePicker
                  selected={selectedDate}
                  onChange={handleDateChange}
                  dateFormat="MM/dd/yyyy"
                  inline
                  className="bg-white shadow-lg rounded-lg"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* User Info Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center space-x-4">
            {session?.user?.image ? (
              <img
                src={session.user.image}
                alt="Profile"
                className="w-16 h-16 rounded-full"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-2xl text-gray-600">
                  {session?.user?.name?.[0] || 'U'}
                </span>
              </div>
            )}
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Welcome back, {session?.user?.name || 'User'}!
              </h2>
              <p className="text-gray-600">{session?.user?.email}</p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Active Subscription</h3>
            <p className="text-3xl font-bold text-red-600">VVIP</p>
            <p className="text-gray-600 mt-2">Valid until: Mar 15, 2024</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Predictions Used</h3>
            <p className="text-3xl font-bold text-red-600">47</p>
            <p className="text-gray-600 mt-2">Last 30 days</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Win Rate</h3>
            <p className="text-3xl font-bold text-red-600">89%</p>
            <p className="text-gray-600 mt-2">Based on your picks</p>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Recent Activity</h3>
            <div className="space-y-6">
              {[
                {
                  type: 'prediction',
                  teams: 'Manchester United vs Arsenal',
                  prediction: 'Over 2.5',
                  date: '2024-03-01',
                  status: 'won'
                },
                {
                  type: 'subscription',
                  action: 'Renewed VVIP subscription',
                  date: '2024-02-28',
                  status: 'completed'
                },
                {
                  type: 'prediction',
                  teams: 'Real Madrid vs Barcelona',
                  prediction: 'Home Win',
                  date: '2024-02-27',
                  status: 'won'
                }
              ].map((activity, index) => (
                <div key={index} className="flex items-center justify-between border-b border-gray-100 pb-4">
                  <div>
                    <p className="font-medium text-gray-900">
                      {activity.type === 'prediction' ? (
                        <>
                          {activity.teams}
                          <span className="text-gray-600 ml-2">({activity.prediction})</span>
                        </>
                      ) : (
                        activity.action
                      )}
                    </p>
                    <p className="text-sm text-gray-600">{activity.date}</p>
                  </div>
                  <div>
                    {activity.status === 'won' ? (
                      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                        Won
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                        Completed
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 