'use client';
import Link from "next/link";
import React, { useEffect } from "react";
import { getUsername, getToken, isAuthenticated } from './utils/auth';
import LocationModal from '../components/LocationModal';
import useGames from "./freegames/FreeGames";
import { useSession } from 'next-auth/react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FaRegCalendarAlt } from 'react-icons/fa';
import AnimatedCounter from '../components/Animatedcounter';
import { format } from 'date-fns';
import { useRef, useState } from 'react';

type Game = {
  game_id: number;
  date_created: string;
  time_created: string;
  game_type: string;
  team1: string;
  team2: string;
  prediction: string;
  result: string; // Added result field
  booking_code?: {
    betWay_code: string;
    sportyBet_code: string;
  };
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
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const bookingBtnRef = useRef<HTMLButtonElement>(null);
  const [isBookingPopoverOpen, setIsBookingPopoverOpen] = useState(false);

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
      <section className="relative h-[60vh] sm:h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Mobile gradient overlay for hero section, hidden on desktop */}
        <div className="absolute inset-0 w-full h-full bg-gradient-to-b from-blue-900 to-black sm:hidden z-0" />
        <div className="absolute inset-0 w-full h-full">
          <img
            src="/bozzmain.png.png"
            alt="Bozz Tips Games Background"
            className="w-full h-full object-contain sm:object-cover object-center"
          />
          <div className="absolute inset-0 bg-black/60 z-10" />
        </div>
        <div className="relative z-20 flex flex-col items-center w-full px-4 sm:px-0">
          {/* The logo is part of the background image, so nothing else here */}
        </div>
        <div className="absolute bottom-2 sm:bottom-10 left-1/2 transform -translate-x-1/2 w-full max-w-xs sm:max-w-2xl px-3 flex flex-col items-center text-white text-center z-30 bg-transparent py-6 mt-8 sm:py-6 sm:mt-8">
          <div className="flex flex-wrap justify-center items-center gap-4 gap-y-2">
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
              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 sm:px-4 sm:py-3 rounded-full font-bold transition-colors min-w-[100px] sm:min-w-[140px] text-center text-sm sm:text-base"
            >
              JOIN VVIP
            </Link>
            <Link
              href="https://t.me/+4IYlVJxd_R1iM2U0"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-blue-900 px-3 py-2 sm:px-4 sm:py-3 rounded-full font-bold hover:bg-gray-100 transition-colors min-w-[100px] sm:min-w-[140px] text-center text-sm sm:text-base"
            >
              Join Telegram Channel
            </Link>
          </div>
        </div>
      </section>
      {/* ... (unchanged) ... */}

      {/* Predictions Timeline */}
      <section className="py-6 sm:py-12">
        <div className="container mx-auto px-4 sm:px-4">
          {/* Date Navigation */}
          <div className="flex justify-center space-x-2 sm:space-x-4 mb-6 sm:mb-8 items-center overflow-x-auto">
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
            <div className="relative flex items-center ml-2 sm:ml-4">
              <button
                className="p-2 border border-blue-300 rounded-full bg-white hover:bg-blue-50 focus:outline-none"
                onClick={() => setShowDatePicker((prev) => !prev)}
                aria-label="Pick a date"
              >
                <FaRegCalendarAlt className="text-blue-600 text-xl" />
              </button>
              {showDatePicker && (
                <>
                  {/* Overlay */}
                  <div
                    className="fixed inset-0 z-50 bg-black/40"
                    onClick={() => setShowDatePicker(false)}
                  />
                  {/* Centered Modal */}
                  <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
                    <div className="bg-white border border-blue-200 rounded-lg shadow-lg p-4 w-[95vw] max-w-xs sm:w-auto sm:max-w-none pointer-events-auto">
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
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Title */}
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 sm:mb-4 text-blue-900">
              Football Matches Predictions for {selectedDay.charAt(0).toUpperCase() + selectedDay.slice(1)}
            </h2>
            <p className="text-gray-600 text-sm sm:text-base">Here are our predictions for {selectedDay}.</p>
          </div>

          {/* Predictions List */}
          <div className="max-w-4xl mx-auto">
          {loading ? (
              <p className="text-center text-gray-500">Loading games...</p>
            ) : games.length === 0 ? (
              <p className="text-center text-red-500 font-semibold">No games available for {selectedDay}.</p>
            ) : (
              games.map((match, index) => {
                // Format date to MM/DD
                let formattedDate = '';
                try {
                  formattedDate = format(new Date(match.date_created), 'MM/dd');
                } catch {
                  formattedDate = match.date_created;
                }
                // Format time to h:mm a (e.g., 3:26 pm)
                let formattedTime = '';
                try {
                  const [hours, minutes, seconds] = match.time_created.split(':');
                  const date = new Date();
                  date.setHours(Number(hours));
                  date.setMinutes(Number(minutes));
                  date.setSeconds(Number(seconds));
                  formattedTime = format(date, 'h:mm a').toLowerCase();
                } catch {
                  formattedTime = match.time_created;
                }
                return (
                  <div
                    key={index}
                    className="bg-white border-b border-gray-100 py-2 sm:py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between hover:bg-gray-50 transition-colors px-1 sm:px-3 text-xs sm:text-sm"
                    style={{ minHeight: '40px', maxWidth: '100%' }}
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-1 sm:space-y-0 sm:space-x-4 w-full">
                      <div className="w-full sm:w-20 text-blue-600 flex flex-row sm:flex-col justify-between sm:justify-start">
                        <div className="font-semibold">{formattedDate}</div>
                        <div className="text-xs">{formattedTime}</div>
                      </div>
                      <div>
                        <div className="text-gray-500 text-[10px] sm:text-xs mb-1">{match.game_type}</div>
                        <div className="font-medium text-gray-900 text-xs sm:text-sm">{match.team1} vs {match.team2}</div>
                      </div>
                    </div>
                    <div className="flex flex-col items-center min-w-[60px] mt-1 sm:mt-0">
                      <span className="text-gray-600 text-xs sm:text-sm whitespace-nowrap">{match.prediction}</span>
                      <div
                        className={`w-3 h-3 rounded-full mt-1 ${
                          match.result === 'won'
                            ? 'bg-green-500'
                            : match.result === 'lost'
                            ? 'bg-red-500'
                            : 'bg-yellow-300'
                        }`}
                      ></div>
                    </div>
                  </div>
                );
              })
            )}

            {/* Booking Code Section */}
            <div className="text-center mt-8 relative">
              <button
                ref={bookingBtnRef}
                className="bg-blue-600 text-white px-6 sm:px-8 py-2 sm:py-3 uppercase font-semibold hover:bg-blue-700 transition-colors text-sm sm:text-base"
                onClick={() => setIsBookingPopoverOpen((open) => !open)}
              >
                GET BOOKING CODE
              </button>
              {isBookingPopoverOpen && (
                <div
                  className="absolute left-1/2 -translate-x-1/2 mt-2 w-64 bg-white border border-blue-200 rounded-lg shadow-lg z-50 p-4"
                  style={{ top: '100%' }}
                >
                  <div className="font-bold text-blue-900 mb-2">Booking Codes</div>
                  {games.length > 0 && (
                    <div className="flex flex-col gap-2 py-2">
                      <div className="flex justify-between items-center gap-2">
                        <span className="text-gray-700 font-medium">BetWay:</span>
                        <span className="font-mono text-blue-700 text-lg">{games[0].booking_code?.betWay_code}</span>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(games[0].booking_code?.betWay_code || '');
                            setCopiedCode('betway');
                            setTimeout(() => setCopiedCode(null), 1200);
                          }}
                          className="ml-2 p-1 rounded hover:bg-blue-100"
                          title="Copy BetWay code"
                        >
                          {copiedCode === 'betway' ? (
                            <span className="text-green-600 text-xs font-semibold">Copied!</span>
                          ) : (
                            <svg className="w-5 h-5 text-blue-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                              <rect x="3" y="3" width="13" height="13" rx="2" ry="2" />
                            </svg>
                          )}
                        </button>
                      </div>
                      <div className="flex justify-between items-center gap-2">
                        <span className="text-gray-700 font-medium">SportyBet:</span>
                        <span className="font-mono text-blue-700 text-lg">{games[0].booking_code?.sportyBet_code}</span>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(games[0].booking_code?.sportyBet_code || '');
                            setCopiedCode('sportybet');
                            setTimeout(() => setCopiedCode(null), 1200);
                          }}
                          className="ml-2 p-1 rounded hover:bg-blue-100"
                          title="Copy SportyBet code"
                        >
                          {copiedCode === 'sportybet' ? (
                            <span className="text-green-600 text-xs font-semibold">Copied!</span>
                          ) : (
                            <svg className="w-5 h-5 text-blue-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                              <rect x="3" y="3" width="13" height="13" rx="2" ry="2" />
                            </svg>
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
            {/* Unlock More Button */}
            <div className="text-center mt-12">
              <button
                className="inline-block bg-blue-900 text-white px-12 py-3 uppercase font-semibold hover:bg-blue-800 transition-colors"
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
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 text-white">Why Us?</h2>
          <p className="text-center text-blue-900 max-w-2xl mx-auto mb-16">
            We have <AnimatedCounter target={96} duration={5000} />% win ratio so far, our games are well organized and taken from the best sources. 
            We value our clients first, and we've managed to satisfy every single customer.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-white rounded-lg shadow-sm">
              <div className="text-4xl font-bold text-blue-600 mb-2"><AnimatedCounter target={10000} duration={5000} />+</div>
              <div className="text-gray-600">Subscribers</div>
            </div>
            <div className="text-center p-6 bg-white rounded-lg shadow-sm">
              <div className="text-4xl font-bold text-blue-600 mb-2"><AnimatedCounter target={96} duration={5000} />%</div>
              <div className="text-gray-600">Win Ratio</div>
            </div>
            <div className="text-center p-6 bg-white rounded-lg shadow-sm">
              <div className="text-4xl font-bold text-blue-600 mb-2"><AnimatedCounter target={6500} duration={5000} />+</div>
              <div className="text-gray-600">Predictions</div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-28 bg-blue-900 text-white relative" style={{ background: 'none' }}>
        {/* Mobile gradient overlay for Join Us Now section, hidden on desktop */}
        <div className="absolute inset-0 w-full h-full bg-gradient-to-b from-blue-900 to-black sm:hidden z-0" />
        <div className="absolute inset-0 w-full h-full">
          <img
            src="/bozz.png.png"
            alt="Join Us Now Background"
            className="w-full h-full object-contain sm:object-cover object-center sm:object-top min-h-[400px]"
            style={{ filter: 'brightness(0.5)' }}
          />
        </div>
        <div className="container mx-auto px-4 text-center relative z-10 flex flex-col items-center justify-center min-h-[350px] py-12 sm:py-0">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 sm:mb-8">Join Us Now</h2>
          <p className="text-base sm:text-xl mb-6 sm:mb-8 max-w-xs sm:max-w-2xl mx-auto text-blue-100">
            Join over <AnimatedCounter target={10000} duration={5000} />+ people who win every single day. Our games are categorized for every aspect including free daily games. Don't miss out on this chance of winning big.
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
      <section className="py-16">
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
