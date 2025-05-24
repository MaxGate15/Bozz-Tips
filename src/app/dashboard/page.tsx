'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getUsername, getToken, isAuthenticated } from '../utils/auth';

const mockPurchasedGames = [
	{
		id: 1,
		title: "Today's VVIP Game",
		amount: '$4.00',
		date: '2024-06-10',
		time: '10:15 AM',
		tips: [
			{ text: 'Team A vs Team B - Over 2.5', status: 'won' },
			{ text: 'Team C vs Team D - Home Win', status: 'lost' },
			{ text: 'Team E vs Team F - Both Teams to Score', status: 'won' },
		],
	},
	{
		id: 2,
		title: "Yesterday's VVIP Game",
		amount: '$4.00',
		date: '2024-06-09',
		time: '09:45 AM',
		tips: [
			{ text: 'Team G vs Team H - Under 3.5', status: 'lost' },
			{ text: 'Team I vs Team J - Draw', status: 'won' },
		],
	},
	...Array.from({ length: 13 }, (_, i) => ({
		id: i + 3,
		title: `VVIP Game #${i + 3}`,
		amount: `$${(Math.random() * 20 + 4).toFixed(2)}`,
		date: `2024-06-${(10 - i).toString().padStart(2, '0')}`,
		time: `${(8 + i % 12).toString().padStart(2, '0')}:00 AM`,
		tips: [
			{ text: `Team ${String.fromCharCode(75 + i)} vs Team ${String.fromCharCode(76 + i)} - Over 2.5`, status: i % 2 === 0 ? 'won' : 'lost' },
			{ text: `Team ${String.fromCharCode(77 + i)} vs Team ${String.fromCharCode(78 + i)} - Home Win`, status: i % 3 === 0 ? 'won' : 'lost' },
			{ text: `Team ${String.fromCharCode(79 + i)} vs Team ${String.fromCharCode(80 + i)} - Under 3.5`, status: i % 4 === 0 ? 'won' : 'lost' },
		],
	})),
];

const tipStatusColor = {
	won: 'bg-green-500',
	lost: 'bg-red-500',
};

export default function DashboardPage() {
	const { data: session, status } = useSession();
	const router = useRouter();
	const [localUsername, setLocalUsername] = useState<string | null>(null);
	const [visible, setVisible] = useState(false);
	const [showPurchasedDropdown, setShowPurchasedDropdown] = useState(false);
	const [expandedPurchaseId, setExpandedPurchaseId] = useState<number | null>(null);

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
								Welcome back, {session?.user?.name || localUsername || 'User'}!
							</h2>
							<p className="text-gray-600">{session?.user?.email}</p>
						</div>
					</div>
				</div>

				{/* Stats Grid */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
					<div
						className="bg-white p-6 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition"
						onClick={() => router.push('/vvip/games')}
						title="Go to your VVIP purchased games"
					>
						<h3 className="text-lg font-semibold text-gray-900 mb-2">Active Subscription</h3>
						<p className="text-3xl font-bold text-red-600">VVIP</p>
						<p className="text-gray-600 mt-2">Valid until: Mar 15, 2024</p>
					</div>
					<div className="bg-white p-6 rounded-lg shadow-md">
						<h3 className="text-lg font-semibold text-gray-900 mb-2">Predictions Used</h3>
						<p className="text-3xl font-bold text-red-600">47</p>
						<p className="text-gray-600 mt-2">Last 30 days</p>
						<div className="relative">
							<button
								className="text-blue-900 font-semibold mt-2 underline hover:text-blue-700 transition w-full text-left"
								onClick={() => setShowPurchasedDropdown((prev) => !prev)}
							>
								Games Purchased: {mockPurchasedGames.length}
							</button>
							{showPurchasedDropdown && (
								<div className="absolute left-0 mt-2 w-full bg-white border border-gray-200 rounded shadow-lg z-10 max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-blue-200 scrollbar-track-blue-50">
									{mockPurchasedGames.length === 0 ? (
										<div className="p-4 text-gray-500">No games purchased yet.</div>
									) : (
										<ul>
											{mockPurchasedGames.map((game) => (
												<li key={game.id} className="px-4 py-3 border-b last:border-b-0">
													<div
														className="flex flex-col md:flex-row md:items-center md:justify-between cursor-pointer hover:bg-blue-50 rounded"
														onClick={() => setExpandedPurchaseId(expandedPurchaseId === game.id ? null : game.id)}
													>
														<div>
															<div className="font-semibold text-blue-900 flex items-center">
																{game.title}
																<span className="ml-2 text-xs text-gray-400">{expandedPurchaseId === game.id ? '\u25B2' : '\u25BC'}</span>
															</div>
															<div className="text-gray-600 text-sm">{game.date} at {game.time}</div>
														</div>
														<div className="text-red-600 font-bold text-lg md:text-base mt-2 md:mt-0">{game.amount}</div>
													</div>
													{expandedPurchaseId === game.id && game.tips && (
														<ul className="mt-2 ml-2">
															{game.tips.map((tip, idx) => (
																<li key={idx} className="flex items-center gap-2 mb-1 text-gray-800">
																	<span className={`inline-block w-3 h-3 rounded-full ${tipStatusColor[tip.status as keyof typeof tipStatusColor]}`}></span>
																	{tip.text}
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