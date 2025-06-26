'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getUsername, getToken, isAuthenticated } from '../utils/auth';
import usePurchasedGames from '../freegames/PurchasedGames'

// const allPSlips = [
// 	{
// 		id: 1,
// 		title: "Today's VVIP Game",
// 		amount: '$4.00',
// 		date: '2024-06-10',
// 		time: '10:15 AM',
// 		tips: [
// 			{ text: 'Team A vs Team B - Over 2.5', status: 'won' },
// 			{ text: 'Team C vs Team D - Home Win', status: 'lost' },
// 			{ text: 'Team E vs Team F - Both Teams to Score', status: 'won' },
// 		],
// 	},
// 	{
// 		id: 2,
// 		title: "Yesterday's VVIP Game",
// 		amount: '$4.00',
// 		date: '2024-06-09',
// 		time: '09:45 AM',
// 		tips: [
// 			{ text: 'Team G vs Team H - Under 3.5', status: 'lost' },
// 			{ text: 'Team I vs Team J - Draw', status: 'won' },
// 		],
// 	},
// 	...Array.from({ length: 13 }, (_, i) => ({
// 		id: i + 3,
// 		title: `VVIP Game #${i + 3}`,
// 		amount: `$${(Math.random() * 20 + 4).toFixed(2)}`,
// 		date: `2024-06-${(10 - i).toString().padStart(2, '0')}`,
// 		time: `${(8 + i % 12).toString().padStart(2, '0')}:00 AM`,
// 		tips: [
// 			{ text: `Team ${String.fromCharCode(75 + i)} vs Team ${String.fromCharCode(76 + i)} - Over 2.5`, status: i % 2 === 0 ? 'won' : 'lost' },
// 			{ text: `Team ${String.fromCharCode(77 + i)} vs Team ${String.fromCharCode(78 + i)} - Home Win`, status: i % 3 === 0 ? 'won' : 'lost' },
// 			{ text: `Team ${String.fromCharCode(79 + i)} vs Team ${String.fromCharCode(80 + i)} - Under 3.5`, status: i % 4 === 0 ? 'won' : 'lost' },
// 		],
// 	})),
// ];

const tipStatusColor = {
	won: 'bg-green-500',
	lost: 'bg-red-500',
	pending: 'bg-yellow-500',
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

export default function DashboardPage() {
	const tomorrow = new Date();
	tomorrow.setDate(tomorrow.getDate() + 1);
	const { data: session, status } = useSession();
	const router = useRouter();
	const [localUsername, setLocalUsername] = useState<string | null>(null);
	const [visible, setVisible] = useState(false);
	const [showPurchasedDropdown, setShowPurchasedDropdown] = useState(false);
	const [expandedPurchaseId, setExpandedPurchaseId] = useState<number | null>(null);
	const { allPSlips,recentGames} = usePurchasedGames() as {
		allPSlips:Slip[],
		recentGames: Slip[];

	};

	useEffect(() => {
		if (status === 'unauthenticated' && !getToken()) {
			router.push('/login');
		}
		// Get username from local storage if session is not available
		if (!session) {
			setLocalUsername(getUsername());
		}
		if (status !== 'loading') {
			setVisible(true);
		}
	}, [status, router, session]);

	useEffect(() => {
		if (typeof window !== 'undefined' && !isAuthenticated()) {
			router.replace('/login');
		}
	}, []);

	if (status === 'loading') {
		return (
			<div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
				<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
			</div>
		);
	}

	return (
		<div className={`min-h-screen bg-gray-50 transition-opacity duration-500 ${visible ? 'opacity-100' : 'opacity-0'}`}>
			{/* Black Header */}
			<div className="bg-black py-6">
				<div className="container mx-auto px-4 flex justify-between items-center">
					<h1 className="text-3xl font-bold text-white">My Dashboard</h1>
				</div>
			</div>

			<div className="container mx-auto px-2 sm:px-4 py-6 sm:py-12">
                {/* User Info Section */}
                <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6 sm:mb-8">
                    <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4">
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
                        <div className="text-center sm:text-left">
                            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                                Welcome back, {session?.user?.name || localUsername || 'User'}!
                            </h2>
                            <p className="text-gray-600 text-sm sm:text-base">{session?.user?.email}</p>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
                    <div
                        className="bg-white p-4 sm:p-6 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition"
                        onClick={() => router.push('/vvip/games')}
                        title="Go to your VVIP purchased games"
                    >
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 sm:mb-2">Active Subscription</h3>
                        <p className="text-2xl sm:text-3xl font-bold text-red-600">VVIP</p>
                        <p className="text-gray-600 mt-1 sm:mt-2 text-xs sm:text-base">
                            Valid until: {tomorrow.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </p>
                    </div>
                    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 sm:mb-2">Predictions Used</h3>
                        <p className="text-2xl sm:text-3xl font-bold text-red-600">{allPSlips.length}</p>
                        <p className="text-gray-600 mt-1 sm:mt-2 text-xs sm:text-base">In The Last 30 days</p>
                        <div className="relative">
                            <button
                                className="text-blue-900 font-semibold mt-2 underline hover:text-blue-700 transition w-full text-left text-xs sm:text-base"
                                onClick={() => setShowPurchasedDropdown((prev) => !prev)}
                            >
                                Games Purchased: {allPSlips.length}
                            </button>
                            {showPurchasedDropdown && (
                                <div className="absolute left-0 mt-2 w-full bg-white border border-gray-200 rounded shadow-lg z-10 max-h-60 sm:max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-blue-200 scrollbar-track-blue-50 text-xs sm:text-base">
                                    {allPSlips.length === 0 ? (
                                        <div className="p-4 text-gray-500">No games purchased yet.</div>
                                    ) : (
                                        <ul>
                                            {allPSlips.map((slip) => (
                                                <li key={slip.slip_id} className="px-2 sm:px-4 py-2 sm:py-3 border-b last:border-b-0">
                                                    <div
                                                        className="flex flex-col md:flex-row md:items-center md:justify-between cursor-pointer hover:bg-blue-50 rounded"
                                                        onClick={() => setExpandedPurchaseId(expandedPurchaseId === slip.slip_id ? null : slip.slip_id)}
                                                    >
                                                        <div>
                                                            <div className="font-semibold text-blue-900 flex items-center">
                                                                {slip.category.toUpperCase()} Game
                                                                <span className="ml-2 text-xs text-gray-400">{expandedPurchaseId === slip.slip_id ? '\u25B2' : '\u25BC'}</span>
                                                            </div>
                                                            <div className="text-gray-600 text-xs sm:text-sm">{slip.date_created}</div>
                                                        </div>
                                                        <div className="text-red-600 font-bold text-base sm:text-lg mt-2 md:mt-0">{slip.price}</div>
                                                    </div>
                                                    {expandedPurchaseId === slip.slip_id && slip.games && (
                                                        <ul className="mt-2 ml-2">
                                                            {slip.games.map((game, idx) => (
                                                                <li key={idx} className="flex items-center gap-2 mb-1 text-gray-800 text-xs sm:text-base">
                                                                    <span className={`inline-block w-3 h-3 rounded-full ${tipStatusColor[game.result as keyof typeof tipStatusColor]}`}></span>
                                                                    {game.team1} vs {game.team2} - {game.prediction}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    )}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 sm:mb-2">Win Rate</h3>
                        <p className="text-2xl sm:text-3xl font-bold text-red-600">89%</p>
                        <p className="text-gray-600 mt-1 sm:mt-2 text-xs sm:text-base">Based on your picks</p>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="p-4 sm:p-6">
                        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">Recent Activity</h3>
                        <div className="space-y-4 sm:space-y-6">
                            {recentGames.length === 0 ? (
                                <div className="text-gray-500 text-center py-8">No recent activity yet.</div>
                            ) : (
                                recentGames.map((slip) =>
                                    slip.games.map((game, gameIdx) => (
                                        <div key={`${slip.slip_id}-${gameIdx}`} className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-gray-100 pb-4">
                                            <div>
                                                <p className="font-medium text-gray-900 text-sm sm:text-base">
                                                    {game.team1} vs {game.team2}
                                                    <span className="text-gray-600 ml-2">({game.prediction})</span>
                                                </p>
                                                <p className="text-xs sm:text-sm text-gray-600">{slip.date_created}</p>
                                            </div>
                                            <div className="mt-2 sm:mt-0">
                                                {game.result === 'won' ? (
                                                    <span className="px-2 sm:px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs sm:text-sm">
                                                        Won
                                                    </span>
                                                ) : game.result === 'lost' ? (
                                                    <span className="px-2 sm:px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs sm:text-sm">
                                                        Lost
                                                    </span>
                                                ) : (
                                                    <span className="px-2 sm:px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs sm:text-sm">
                                                        Pending
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                )
                            )}
                        </div>
                    </div>
                </div>
            </div>
		</div>
	);
}