'use client';
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { getUsername, getToken, isAuthenticated } from './utils/auth';
import LocationModal from '../components/LocationModal';
import useGames from "./freegames/FreeGames";
import { useSession } from 'next-auth/react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FaRegCalendarAlt } from 'react-icons/fa';

type Game = {
  game_id: number;
  date_created: string;
  time_created: string;
  game_type: string;
  team1: string;
  team2: string;
  prediction: string;
};

const Home: React.FC = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [debugUsername, setDebugUsername] = useState<string | null>(null);
  const [debugToken, setDebugToken] = useState<string | null>(null);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState<'yesterday' | 'today' | 'tomorrow' | 'other'>('today');
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [calendarDate, setCalendarDate] = useState<Date | null>(null);

  const { today, tomorrow, yesterday, loading, error } = useGames();
  const { data: session } = useSession();

  useEffect(() => {
    if (selectedDay === 'today') {
      setGames(today);
    } else if (selectedDay === 'tomorrow') {
      setGames(tomorrow);
    } else if (selectedDay === 'yesterday') {
      setGames(yesterday);
    } else if (selectedDay === 'other' && selectedDate) {
      // Fetch games for the selected date
      fetch(`/api/games?date=${selectedDate}`)
        .then(res => res.json())
        .then(data => setGames(data))
        .catch(() => setGames([]));
    }
  }, [selectedDay, today, tomorrow, yesterday, selectedDate]);

  useEffect(() => {
    setDebugUsername(getUsername());
    setDebugToken(getToken());
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[250px] sm:min-h-[350px] md:min-h-[500px] flex items-center justify-center">
        <div className="absolute inset-0 w-full h-full">
          <img
            src="/bozzmain.png.png"
            alt="Bozz Tips Games Background"
            className="w-full h-full object-contain object-center"
            style={{ maxHeight: '500px' }}
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>
        <div className="relative z-20 flex flex-col items-center">
          {/* The logo is part of the background image, so nothing else here */}
        </div>
        <div className="absolute bottom-6 sm:bottom-10 left-1/2 transform -translate-x-1/2 w-full max-w-lg sm:max-w-2xl px-2 sm:px-4 flex flex-col sm:flex-row items-center gap-3 sm:gap-4 text-white text-center z-10">
          <Link
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (!(session || isAuthenticated() || getToken())) {
                window.location.href = '/login';
              } else {
                window.location.href = '/vvip';
              }
            }}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 sm:px-8 py-2 sm:py-3 rounded-full font-semibold transition-colors w-full sm:w-auto"
          >
            JOIN VVIP
          </Link>
          <Link
            href="https://t.me/wassce_bece_2024"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white text-blue-900 px-6 sm:px-8 py-2 sm:py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors w-full sm:w-auto"
          >
            Join Telegram Channel
          </Link>
        </div>
      </section>
      {/* ... (unchanged) ... */}

      {/* Predictions Timeline */}
      <section className="py-8 sm:py-12 bg-gray-50">
        <div className="container mx-auto px-2 sm:px-4">
          {/* Date Navigation */}
          <div className="flex flex-col sm:flex-row justify-center sm:space-x-4 space-y-2 sm:space-y-0 mb-6 sm:mb-8 items-center">
            {(['yesterday', 'today', 'tomorrow'] as const).map((day) => (
              <button
                key={day}
                className={`px-4 sm:px-8 py-2 rounded-full border-2 ${selectedDay === day
                  ? 'bg-blue-500 text-white border-blue-500'
                  : 'border-blue-500 text-blue-900 hover:bg-blue-500 hover:text-white'
                  } transition-colors text-sm sm:text-base`}
                onClick={() => { setSelectedDay(day); setSelectedDate(""); setCalendarDate(null); }}
              >
                {day.charAt(0).toUpperCase() + day.slice(1)}
              </button>
            ))}
            <div className="relative flex items-center sm:ml-4 mt-2 sm:mt-0">
              <button
                className="p-2 border border-blue-300 rounded-full bg-white hover:bg-blue-50 focus:outline-none"
                onClick={() => setShowDatePicker((prev) => !prev)}
                aria-label="Pick a date"
              >
                <FaRegCalendarAlt className="text-blue-600 text-xl" />
              </button>
              {showDatePicker && (
                <>
                  {/* Overlay to close popover when clicking outside */}
                  <div
                    className="fixed inset-0 z-40 bg-transparent"
                    onClick={() => setShowDatePicker(false)}
                  />
                  <div className="absolute z-50 mt-2 left-1/2 -translate-x-1/2 bg-white border border-blue-200 rounded-lg shadow-lg p-2 sm:p-4">
                    <DatePicker
                      selected={calendarDate}
                      onChange={(date: Date | null) => {
                        setCalendarDate(date);
                        setShowDatePicker(false);
                        if (date) {
                          const formatted = date.toISOString().split('T')[0];
                          setSelectedDate(formatted);
                          setSelectedDay('other');
                        }
                      }}
                      maxDate={new Date()}
                      inline
                      showMonthDropdown
                      showYearDropdown
                      dropdownMode="select"
                    />
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Title */}
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="text-lg sm:text-2xl md:text-3xl font-bold mb-2 sm:mb-4 text-blue-900">
              Football Matches Predictions for {selectedDay.charAt(0).toUpperCase() + selectedDay.slice(1)}
            </h2>
            <p className="text-gray-600 text-sm sm:text-base">Here are our predictions for {selectedDay}.</p>
          </div>

          {/* Predictions List */}
          <div className="max-w-full sm:max-w-4xl mx-auto space-y-2 sm:space-y-4">
          {loading ? (
              <p className="text-center text-gray-500">Loading games...</p>
            ) : games.length === 0 ? (
              <p className="text-center text-red-500 font-semibold">No games available for {selectedDay}.</p>
            ) : (
              games.map((match, index) => (
                <div
                  key={index}
                  className="bg-white border-b border-gray-100 py-4 sm:py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between hover:bg-gray-50 transition-colors px-2 sm:px-6"
                >
                  <div className="flex flex-row sm:flex-row items-center space-x-4 sm:space-x-8 w-full sm:w-auto mb-2 sm:mb-0">
                    <div className="w-20 sm:w-24 text-blue-600">
                      <div className="font-semibold text-xs sm:text-base">{match.date_created}</div>
                      <div className="text-xs sm:text-sm">{match.time_created}</div>
                    </div>
                    <div>
                      <div className="text-gray-500 text-xs sm:text-sm mb-1">{match.game_type}</div>
                      <div className="font-medium text-gray-900 text-sm sm:text-base">{match.team1} vs {match.team2}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 mt-2 sm:mt-0">
                    <span className="text-gray-600 text-sm sm:text-base">{match.prediction}</span>
                    <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-yellow-300"></div>
                  </div>
                </div>
              ))
            )}

            {/* Unlock More Button */}
            <div className="text-center mt-8 sm:mt-12">
              <button
                className="inline-block bg-blue-900 text-white px-8 sm:px-12 py-2 sm:py-3 uppercase font-semibold hover:bg-blue-800 transition-colors text-sm sm:text-base"
                onClick={() => {
                  if (!(session || isAuthenticated() || getToken())) {
                    window.location.href = '/login';
                  } else {
                    window.location.href = '/vvip';
                  }
                }}
              >
                Unlock More
              </button>
            </div>
          </div>
        </div>
      </section>
      <section className="py-20 bg-blue-900">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 text-white">Why Us?</h2>
          <p className="text-center text-blue-100 max-w-2xl mx-auto mb-16">
            We have 90% win ratio so far, our games are well organized and taken from the best sources. 
            We value our clients first, and we've managed to satisfy every single customer.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-white rounded-lg shadow-sm">
              <div className="text-4xl font-bold text-blue-600 mb-2">10,000+</div>
              <div className="text-gray-600">Subscribers</div>
            </div>
            <div className="text-center p-6 bg-white rounded-lg shadow-sm">
              <div className="text-4xl font-bold text-blue-600 mb-2">90%</div>
              <div className="text-gray-600">Win Ratio</div>
            </div>
            <div className="text-center p-6 bg-white rounded-lg shadow-sm">
              <div className="text-4xl font-bold text-blue-600 mb-2">6,500+</div>
              <div className="text-gray-600">Predictions</div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-blue-900">Our Predictions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {['Football', 'HT/FT', 'Over/Under', 'Correct Score'].map((category) => (
              <div key={category} className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-xl font-semibold mb-4 text-blue-900">{category}</h3>
                <p className="text-gray-600">
                  Professional {category.toLowerCase()} predictions with high accuracy rates.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-20 bg-blue-900 text-white relative">
        <div className="absolute inset-0 w-full h-full">
          <img
            src="/bozz.png.png"
            alt="Join Us Now Background"
            className="w-full h-full object-contain object-top"
            style={{ maxHeight: '350px' }}
          />
        </div>
        <div className="container mx-auto px-4 text-center relative z-10 flex flex-col items-center justify-center min-h-[350px]">
          <h2 className="text-3xl md:text-4xl font-bold mb-8">Join Us Now</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-blue-100">
            Join over 10,000 people who win every single day. Our games are categorized for every aspect including free daily games. Don't miss out on this chance of winning big.
          </p>
          <Link
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (!(session || isAuthenticated() || getToken())) {
                window.location.href = '/login';
              } else {
                window.location.href = '/vvip';
              }
            }}
            className="inline-block bg-blue-500 text-white px-8 py-3 rounded-full font-semibold hover:bg-blue-600 transition-colors"
          >
            Join VVIP Now
          </Link>
        </div>
      </section>

      {/* Footer Info Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center text-gray-600">
            <p className="mb-6">
              Football betting is fun, period. Whether it's a rousing victory or a crushing defeat, 
              but without some level of guidance and knowledge, football betting is a high-risk venture. 
              Every day, football fans around the world are actively seeking websites and platforms that 
              offer accurate predictions and profits over the long term.
            </p>
          </div>
        </div>
      </section>

      {/* ... Other sections unchanged ... */}

      {/* Debug Info */}
      {/* <div style={{ background: '#fee', color: '#900', padding: '1rem', margin: '1rem 0', borderRadius: '8px' }}>
        <strong>Debug Info:</strong><br />
        Username in localStorage: {debugUsername || 'null'}<br />
        Token in localStorage: {debugToken || 'null'}
      </div> */}

      <LocationModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        onSelect={() => setIsLocationModalOpen(false)}
      />
    </div>
  );
};

export default Home;
