'use client';
import React, { useState } from 'react';

const mockCurrentGames = [
  {
    id: 1,
    title: "Today's VVIP Game",
    date: '2024-06-10',
    tips: [
      { text: 'Team A vs Team B - Over 2.5', status: 'won' },
      { text: 'Team C vs Team D - Home Win', status: 'pending' },
      { text: 'Team E vs Team F - Both Teams to Score', status: 'lost' },
      { text: 'Team G vs Team H - Under 3.5', status: 'won' },
      { text: 'Team I vs Team J - Draw', status: 'pending' },
    ],
  },
];

const mockPreviousGames = [
  {
    id: 2,
    title: "Yesterday's VVIP Game",
    date: '2024-06-09',
    tips: [
      { text: 'Team K vs Team L - Away Win', status: 'lost' },
      { text: 'Team M vs Team N - Over 1.5', status: 'won' },
      { text: 'Team O vs Team P - Home Win', status: 'won' },
      { text: 'Team Q vs Team R - Under 2.5', status: 'pending' },
    ],
  }
];

const statusColor = {
  won: 'bg-green-500',
  lost: 'bg-red-500',
  pending: 'bg-yellow-400',
};

export default function VVIPGamesPage() {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');

  return (
    <div className="min-h-screen bg-[#FFF8F0] text-black pb-12">
      {/* Blue Gradient Banner */}
      <div className="w-full h-40 bg-gradient-to-r from-blue-900 to-blue-600 flex items-center justify-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-white tracking-wide">VVIP GAMES</h1>
      </div>
      <div className="max-w-3xl mx-auto px-4">
        {/* Current Purchased Games */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 text-orange-500 uppercase tracking-wide">Current Purchased Games</h2>
          {mockCurrentGames.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">No current games available.</div>
          ) : (
            mockCurrentGames.map((game) => (
              <div key={game.id} className="bg-white rounded-lg shadow p-6 mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-lg text-blue-900">{game.title}</span>
                  <span className="text-sm text-gray-500">{game.date}</span>
                </div>
                <ul className="list-none pl-0 text-base text-gray-800">
                  {game.tips.map((tip, idx) => (
                    <li key={idx} className="flex items-center gap-2 mb-1">
                      <span className={`inline-block w-3 h-3 rounded-full ${statusColor[tip.status as keyof typeof statusColor]}`}></span>
                      {tip.text}
                    </li>
                  ))}
                </ul>
              </div>
            ))
          )}
        </section>
        {/* Previous Paid Games */}
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-orange-500 uppercase tracking-wide">Previous Paid Games</h2>
          {mockPreviousGames.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">No previous games found.</div>
          ) : (
            mockPreviousGames.map((game) => (
              <div key={game.id} className="bg-white rounded-lg shadow p-6 mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-lg text-blue-900">{game.title}</span>
                  <span className="text-sm text-gray-500">{game.date}</span>
                </div>
                <ul className="list-none pl-0 text-base text-gray-800">
                  {game.tips.map((tip, idx) => (
                    <li key={idx} className="flex items-center gap-2 mb-1">
                      <span className={`inline-block w-3 h-3 rounded-full ${statusColor[tip.status as keyof typeof statusColor]}`}></span>
                      {tip.text}
                    </li>
                  ))}
                </ul>
              </div>
            ))
          )}
        </section>
        {/* View More Past Games Button and Date Picker */}
        <div className="flex flex-col items-center mt-8">
          {!showDatePicker && (
            <button
              className="bg-gradient-to-r from-blue-900 to-blue-600 text-white px-6 py-3 rounded-full font-semibold shadow hover:from-blue-800 hover:to-blue-700 transition mb-4"
              onClick={() => setShowDatePicker(true)}
            >
              View More Past Games
            </button>
          )}
          {showDatePicker && (
            <div className="flex flex-col items-center gap-4 w-full max-w-xs">
              <input
                type="date"
                className="border border-blue-300 rounded px-4 py-2 w-full"
                value={selectedDate}
                onChange={e => setSelectedDate(e.target.value)}
                max={new Date().toISOString().split('T')[0]}
              />
              {selectedDate && (
                <div className="bg-white rounded-lg shadow p-6 w-full text-center">
                  <div className="font-bold text-lg text-blue-900 mb-2">Games for {selectedDate}</div>
                  <div className="text-gray-500">(No data for this date. Connect to backend to show real games.)</div>
                </div>
              )}
              <button
                className="text-blue-900 font-semibold underline mt-2"
                onClick={() => { setShowDatePicker(false); setSelectedDate(''); }}
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 