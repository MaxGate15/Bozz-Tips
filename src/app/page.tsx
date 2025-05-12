'use client';
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { getUsername, getToken } from './utils/auth';
import LocationModal from '../components/LocationModal';
import useGames from "./freegames";

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
  const [selectedDay, setSelectedDay] = useState<'yesterday' | 'today' | 'tomorrow'>('today');

  const { today, tomorrow, yesterday, loading, error } = useGames();

  useEffect(() => {
    // Update the game list based on selected day
    if (selectedDay === 'today') {
      setGames(today);
    } else if (selectedDay === 'tomorrow') {
      setGames(tomorrow);
    } else if (selectedDay === 'yesterday') {
      setGames(yesterday);
    }
  }, [selectedDay, today, tomorrow, yesterday]);

  useEffect(() => {
    setDebugUsername(getUsername());
    setDebugToken(getToken());
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      {/* ... (unchanged) ... */}

      {/* Predictions Timeline */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          {/* Date Navigation */}
          <div className="flex justify-center space-x-4 mb-8">
            {(['yesterday', 'today', 'tomorrow'] as const).map((day) => (
              <button
                key={day}
                className={`px-8 py-2 rounded-full border-2 ${selectedDay === day
                  ? 'bg-blue-500 text-white border-blue-500'
                  : 'border-blue-500 text-blue-900 hover:bg-blue-500 hover:text-white'
                  } transition-colors`}
                onClick={() => setSelectedDay(day)}
              >
                {day.charAt(0).toUpperCase() + day.slice(1)}
              </button>
            ))}
          </div>

          {/* Title */}
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-blue-900">
              Football Matches Predictions for {selectedDay.charAt(0).toUpperCase() + selectedDay.slice(1)}
            </h2>
            <p className="text-gray-600">Here are our predictions for {selectedDay}.</p>
          </div>

          {/* Predictions List */}
          <div className="max-w-4xl mx-auto">
            {loading ? (
              <p className="text-center text-gray-500">Loading games...</p>
            ) : games.length === 0 ? (
              <p className="text-center text-red-500 font-semibold">No games available for {selectedDay}.</p>
            ) : (
              games.map((match, index) => (
                <div
                  key={index}
                  className="bg-white border-b border-gray-100 py-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-8">
                    <div className="w-24 text-blue-600">
                      <div className="font-semibold">{match.date_created}</div>
                      <div className="text-sm">{match.time_created}</div>
                    </div>
                    <div>
                      <div className="text-gray-500 text-sm mb-1">{match.game_type}</div>
                      <div className="font-medium text-gray-900">{match.team1} vs {match.team2}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-600">{match.prediction}</span>
                    <div className="w-4 h-4 rounded-full bg-yellow-300"></div>
                  </div>
                </div>
              ))
            )}

            {/* Unlock More Button */}
            <div className="text-center mt-12">
              <button
                className="inline-block bg-blue-900 text-white px-12 py-3 uppercase font-semibold hover:bg-blue-800 transition-colors"
                onClick={() => setIsLocationModalOpen(true)}
              >
                Unlock More
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ... Other sections unchanged ... */}

      {/* Debug Info */}
      <div style={{ background: '#fee', color: '#900', padding: '1rem', margin: '1rem 0', borderRadius: '8px' }}>
        <strong>Debug Info:</strong><br />
        Username in localStorage: {debugUsername || 'null'}<br />
        Token in localStorage: {debugToken || 'null'}
      </div>

      <LocationModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        onSelect={() => setIsLocationModalOpen(false)}
      />
    </div>
  );
};

export default Home;
