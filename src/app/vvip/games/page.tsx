'use client';
import React, { useState,useEffect, use } from 'react';
import Link from 'next/link';
import {  getToken, isAuthenticated,getUsername} from './../../utils/auth';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import useCurrentVipGames from '../../freegames/VipGames'
import usePreviousVipGames from '../../freegames/PreviousVipGames'
import { useRouter } from 'next/navigation';

const dateNow = {
  today: new Date().toLocaleDateString('en-US')
    .split('/')
    .reverse()
    .join('-'),
  yesterday: new Date(Date.now() - 864e5)
    .toLocaleDateString('en-US')
    .split('/')
    .reverse()
    .join('-'),}

// const mockCurrentVIPGames = [
//   {
//     id: 1,
    
//     date: '2024-06-10',
//     tips: [
//       { text: 'Team A vs Team B - Over 2.5', status: 'won' },
//       { text: 'Team C vs Team D - Home Win', status: 'pending' },
//       { text: 'Team E vs Team F - Both Teams to Score', status: 'lost' },
//       { text: 'Team G vs Team H - Under 3.5', status: 'won' },
//       { text: 'Team I vs Team J - Draw', status: 'pending' },
//     ],
//   },
// ];
// const mockPreviousVIPGames = [
//   {
//     id: 2,
//     tips: [
//       { text: 'Team K vs Team L - Away Win', status: 'lost' },
//       { text: 'Team M vs Team N - Over 1.5', status: 'won' },
//       { text: 'Team O vs Team P - Home Win', status: 'won' },
//       { text: 'Team Q vs Team R - Under 2.5', status: 'pending' },
//     ],
//   }]
// const mockCurrentVVIPGames = [
//   {
//     id: 1,
   
//     date: '2024-06-10',
//     tips: [
//       { text: 'Team A vs Team B - Over 2.5', status: 'won' },
//       { text: 'Team C vs Team D - Home Win', status: 'pending' },
//       { text: 'Team E vs Team F - Both Teams to Score', status: 'lost' },
//       { text: 'Team G vs Team H - Under 3.5', status: 'won' },
//       { text: 'Team I vs Team J - Draw', status: 'pending' },
//     ],
//   },
// ];

// const mockPreviousVVIPGames = [
//   {
//     id: 2,
//     tips: [
//       { text: 'Team K vs Team L - Away Win', status: 'lost' },
//       { text: 'Team M vs Team N - Over 1.5', status: 'won' },
//       { text: 'Team O vs Team P - Home Win', status: 'won' },
//       { text: 'Team Q vs Team R - Under 2.5', status: 'pending' },
//     ],
//   }
// ];

const statusColor = {
  won: 'bg-green-500',
  lost: 'bg-red-500',
  pending: 'bg-yellow-400',
  default: 'bg-yellow-400',
};

type games = {
  game_id: number;
  team1: string;
  team2: string;
  prediction: string;
  
  result: 'won' | 'lost' | 'pending';
}
type Slip = {
  slip_id: number;
  games: games[];
results: string,
total_odd:string,
price:string,
category:string,
date_created:string,

}


export default function VVIPGamesPage() {
  const [loading, setLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [games, setGames] = useState<Slip[]>([]);
  
  const {vipPSlips, vvip1PSlips, vvip2PSlips, vvip3PSlips} = usePreviousVipGames() as {
    vipPSlips: Slip[];
    vvip1PSlips: Slip[];
    vvip2PSlips: Slip[];
    vvip3PSlips: Slip[];
  };
  const {
    vipSlips,
    vvip1Slips,
    vvip2Slips,
    vvip3Slips
  } = useCurrentVipGames() as {
    vipSlips: Slip[];
    vvip1Slips: Slip[];
    vvip2Slips: Slip[];
    vvip3Slips: Slip[];
  };

  useEffect(() => {
    const fetchGames = async () => {
      const username = getUsername();
      try {
        
        const response = await axios.get('https://bozztips-app-57hce.ondigitalocean.app/goto-purchased-games/', {
          headers: {
            'Content-Type': 'application/json',
            'x-username': username,
            
          },
          params: { date: selectedDate },
        });
        // Handle the response data
        setGames(response.data);
      } catch (error) {
        console.error('Error fetching games:', error);
      }
      finally {
      setLoading(false);             // stop (success or error)
    }
    };

    if (selectedDate) {
      fetchGames();
    }
  }, [selectedDate]);
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined' && !isAuthenticated()) {
      router.replace('/login');
    }
  }, []);
  console.log(selectedDate)
  return (
    <div className="min-h-screen bg-[#FFF8F0] text-black pb-12">
      {/* Blue Gradient Banner */}
      <div className="w-full h-40 bg-gradient-to-r from-blue-900 to-blue-600 flex items-center justify-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-white tracking-wide">VVIP/VIP GAMES</h1>
      </div>
      <div className="max-w-3xl mx-auto px-4">
        {/* Current Purchased Games */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 text-orange-500 uppercase tracking-wide">Current Purchased Games</h2>
          {}
          {vipSlips.length === 0 ? (
            <div>
            <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">No VVIP game has been purchased yet.</div>
            <Link
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            if (typeof window !== 'undefined') {
                              if (!(session || isAuthenticated() || getToken())) {
                                window.location.href = '/login';
                              } else {
                                window.location.href = '/vvip';
                              }
                            }
                          }}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-full font-semibold transition-colors"
                        >
                          Buy Avalible Games Now
                        </Link></div>
          ) : (
            vipSlips.map((game: Slip) => (
              <div key={game.slip_id} className="bg-white rounded-lg shadow p-6 mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-lg text-blue-900">Today's VIP Games</span>
                  <span className="text-sm text-gray-500">{dateNow.today}</span>
                </div>
                <ul className="list-none pl-0 text-base text-gray-800">
                  {game.games.map((tip, idx) => (
                    <li key={idx} className="flex items-center gap-2 mb-1">
                      <span className={`inline-block w-3 h-3 rounded-full ${statusColor[tip.result as keyof typeof statusColor]}`}></span>
                      {tip.team1} vs {tip.team2} - {tip.prediction}
                    </li>
                  ))}
                </ul>
              </div>
            ))
          )}
          {vvip1Slips.length === 0  ? (
            <div >
              <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">No VVIP1 game has been purchased yet.</div>
              <Link
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (typeof window !== 'undefined') {
                    if (!(session || isAuthenticated() || getToken())) {
                      window.location.href = '/login';
                    } else {
                      window.location.href = '/vvip';
                    }
                  }
                }}
                className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-full font-semibold transition-colors"
              >
                Buy Avalible Games Now
              </Link>
            </div>
          ) : (
            vvip1Slips.map((game: any) => (
              <div key={game.slip_id} className="bg-white rounded-lg shadow p-6 mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-lg text-blue-900">Today's VVIP1 Games</span>
                  <span className="text-sm text-gray-500">{dateNow.today}</span>
                </div>
                <ul className="list-none pl-0 text-base text-gray-800">
                  {game.games.map((tip: any, idx: number) => (
                    <li key={idx} className="flex items-center gap-2 mb-1">
                      <span className={`inline-block w-3 h-3 rounded-full ${statusColor[tip.status as keyof typeof statusColor]}`}></span>
                      {tip.team1} vs {tip.team2} - {tip.prediction}
                    </li>
                  ))}
                </ul>
              </div>
            ))
          )}
          {vvip2Slips.length === 0  ? (
            <div>
              <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">No VVIP2 game has been purchased yet.</div>
              <Link
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (typeof window !== 'undefined') {
                    if (!(session || isAuthenticated() || getToken())) {
                      window.location.href = '/login';
                    } else {
                      window.location.href = '/vvip';
                    }
                  }
                }}
                className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-full font-semibold transition-colors"
              >
                Buy Avalible Games Now
              </Link>
            </div>
          ) : (
            vvip2Slips.map((game: any) => (
              <div key={game.slip_id} className="bg-white rounded-lg shadow p-6 mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-lg text-blue-900">Today's VVIP2 Games</span>
                  <span className="text-sm text-gray-500">{dateNow.today}</span>
                </div>
                <ul className="list-none pl-0 text-base text-gray-800">
                  {game.games.map((tip: any, idx: number) => (
                    <li key={idx} className="flex items-center gap-2 mb-1">
                      <span className={`inline-block w-3 h-3 rounded-full ${statusColor[tip.status as keyof typeof statusColor]}`}></span>
                      {tip.team1} vs {tip.team2} - {tip.prediction}
                    </li>
                  ))}
                </ul>
              </div>
            ))
          )}
          {vvip3Slips.length === 0  ? (
            <div>
              <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">No VVIP3 game has been purchased yet.</div>
              <Link
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (typeof window !== 'undefined') {
                    if (!(session || isAuthenticated() || getToken())) {
                      window.location.href = '/login';
                    } else {
                      window.location.href = '/vvip';
                    }
                  }
                }}
                className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-full font-semibold transition-colors"
              >
                Buy Avalible Games Now
              </Link>
            </div>
          ) : (
            vvip3Slips.map((game: any) => (
              <div key={game.slip_id} className="bg-white rounded-lg shadow p-6 mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-lg text-blue-900">Today's VVIP3 Games</span>
                  <span className="text-sm text-gray-500">{dateNow.today}</span>
                </div>
                <ul className="list-none pl-0 text-base text-gray-800">
                  {game.games.map((tip: any, idx: number) => (
                    <li key={idx} className="flex items-center gap-2 mb-1">
                      <span className={`inline-block w-3 h-3 rounded-full ${statusColor[tip.status as keyof typeof statusColor]}`}></span>
                      {tip.team1} vs {tip.team2} - {tip.prediction}
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
          {vipPSlips.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">No VIP games were purchased yesterday.</div>
          ) : (
            vipPSlips.map((game) => (
              <div key={game.slip_id} className="bg-white rounded-lg shadow p-6 mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-lg text-blue-900">Yesterday's VIP Games</span>
                  <span className="text-sm text-gray-500">{dateNow.yesterday}</span>
                </div>
                <ul className="list-none pl-0 text-base text-gray-800">
                  {game.games.map((tip, idx) => (
                    <li key={idx} className="flex items-center gap-2 mb-1">
                      <span className={`inline-block w-3 h-3 rounded-full ${statusColor[tip.result as keyof typeof statusColor]}`}></span>
                      {tip.team1} vs {tip.team2} - {tip.prediction}
                    </li>
                  ))}
                </ul>
              </div>
            ))
          )}
          {vvip1PSlips.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">No VVIP1 games were purchased yesterday.</div>
          ) : (
            vvip1PSlips.map((game) => (
              <div key={game.slip_id} className="bg-white rounded-lg shadow p-6 mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-lg text-blue-900">Yesterday's VVIP1 Games</span>
                  <span className="text-sm text-gray-500">{dateNow.yesterday}</span>
                </div>
                <ul className="list-none pl-0 text-base text-gray-800">
                  {game.games.map((tip, idx) => (
                    <li key={idx} className="flex items-center gap-2 mb-1">
                      <span className={`inline-block w-3 h-3 rounded-full ${statusColor[tip.result as keyof typeof statusColor]}`}></span>
                      {tip.team1} vs {tip.team2} - {tip.prediction}
                    </li>
                  ))}
                </ul>
              </div>
            ))
          )}
          {vvip2PSlips.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">No VVIP2 games were purchased yesterday.</div>
          ) : (
            vvip2PSlips.map((game) => (
              <div key={game.slip_id} className="bg-white rounded-lg shadow p-6 mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-lg text-blue-900">Yesterday's VVIP2 Games</span>
                  <span className="text-sm text-gray-500">{dateNow.yesterday}</span>
                </div>
                <ul className="list-none pl-0 text-base text-gray-800">
                  {game.games.map((tip, idx) => (
                    <li key={idx} className="flex items-center gap-2 mb-1">
                      <span className={`inline-block w-3 h-3 rounded-full ${statusColor[tip.result as keyof typeof statusColor]}`}></span>
                      {tip.team1} vs {tip.team2} - {tip.prediction}
                    </li>
                  ))}
                </ul>
              </div>
            ))
          )}
          {vvip3PSlips.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">No VVIP3 games were purchased yesterday.</div>
          ) : (
            vvip3PSlips.map((game) => (
              <div key={game.slip_id} className="bg-white rounded-lg shadow p-6 mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-lg text-blue-900">Yesterday's VVIP3 Games</span>
                  <span className="text-sm text-gray-500">{dateNow.yesterday}</span>
                </div>
                <ul className="list-none pl-0 text-base text-gray-800">
                  {game.games.map((tip, idx) => (
                    <li key={idx} className="flex items-center gap-2 mb-1">
                      <span className={`inline-block w-3 h-3 rounded-full ${statusColor[tip.result as keyof typeof statusColor]}`}></span>
                      {tip.team1} vs {tip.team2} - {tip.prediction}
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
    <div className="font-bold text-lg text-blue-900 mb-2">
      Games for {selectedDate}
    </div>

    {loading ? (
      <div className="text-gray-500 animate-pulse">Loading games…</div>
    ) : games.length === 0 ? (
      <div className="text-gray-500">
        No games were purchased on {selectedDate}
      </div>
    ) : (
      games.map((game, index) => (
        <div key={index} className="bg-white rounded-lg shadow p-6 mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="font-bold text-lg text-blue-900">Games Purchased</span>
            <span className="text-sm text-gray-500">{selectedDate}</span>
          </div>
          <ul className="list-none pl-0 text-base text-gray-800">
            {game.games.map((tip, idx) => (
              <li key={idx} className="flex items-center gap-2 mb-1">
                <span
                  className={`inline-block w-3 h-3 rounded-full ${
                    statusColor[tip.result as keyof typeof statusColor]
                  }`}
                />
                {tip.team1} vs {tip.team2} - {tip.prediction}
              </li>
            ))}
          </ul>
        </div>
      ))
    )}
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