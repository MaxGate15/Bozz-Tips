'use client';

import React, { useState, useEffect } from 'react';
import { FaRegCalendarAlt, FaUsers, FaGamepad, FaBell, FaSms, FaCog, FaSignOutAlt, FaPlus, FaEdit, FaTrash, FaCheck, FaTimes, FaUpload, FaDownload } from 'react-icons/fa';

// Add types for games and slips to avoid implicit any
type Game = {
  team1?: string;
  team2?: string;
  odds?: number | string;
  prediction?: string;
  category?: string;
  result?: 'Pending' | 'Won' | 'Lost' | string;
  [key: string]: any;
};

type Slip = {
  id: number;
  uploadedAt: string;
  sportyCode: string;
  msportCode: string;
  totalOdds: number;
  games: Game[];
  slipResult: string;
  category: string;
  price?: string;
  published?: boolean;
  publishedAt?: string;
};

export default function AdminDashboard() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showAddAdmin, setShowAddAdmin] = useState(false);
  const [showAddGame, setShowAddGame] = useState(false);
  const [showSMS, setShowSMS] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Slips');
  const [bookingCode, setBookingCode] = useState('');
  // typed per-category loaded games
  const [loadedGames, setLoadedGames] = useState<{[key: string]: Game[]}>({});
  const [isLoading, setIsLoading] = useState(false);
  const [totalOdds, setTotalOdds] = useState<{[key: string]: number}>({});
  const [currentBookingCode, setCurrentBookingCode] = useState<{[key: string]: string}>({});
  const [showAttachDropdown, setShowAttachDropdown] = useState(false);
  const [sportyCode, setSportyCode] = useState('');
  const [msportCode, setMsportCode] = useState('');
  const [slips, setSlips] = useState<Slip[]>([]);
  // editingGame stores a composite id like `${slip.id}-${gameIndex}` so use string|null
  const [editingGame, setEditingGame] = useState<string | null>(null);
  const [expandedSlip, setExpandedSlip] = useState<number | null>(null);
  const [selectedSlips, setSelectedSlips] = useState<Set<number>>(new Set());
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showAddAdminModal, setShowAddAdminModal] = useState(false);
  const [newAdmin, setNewAdmin] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'admin',
    permissions: {
      games: true,
      users: true,
      notifications: true,
      sms: true,
      settings: false
    }
  });
  const [vipStatus, setVipStatus] = useState({
    daily_vvip_plan: 'sold_out',
    daily_vvip_plan_2: 'available',
    daily_vvip_plan_3: 'available',
    vip_plan: 'available'
  });
  const [showPriceModal, setShowPriceModal] = useState(false);
  const [gamePrice, setGamePrice] = useState('');
  const [attachedBookings, setAttachedBookings] = useState<{[key: string]: {sportyCode: string, msportCode: string}}>({});
  const [gamePrices, setGamePrices] = useState<{[key: string]: string}>({});

  // Dynamic total users fetched from local API
  const [totalUsers, setTotalUsers] = useState<number | null>(null);

  // Dynamic active games (pending slips) fetched from local API
  const [activeGames, setActiveGames] = useState<number | null>(null);
  // Dynamic VIP subscriptions (purchased slips)
  const [purchasedSubs, setPurchasedSubs] = useState<number | null>(null);

  useEffect(() => {
    let mounted = true;
    const controller = new AbortController();

    const fetchTotalUsers = async () => {
      try {
        const res = await fetch('https://admin.bozz-tips.com/total-users/', { signal: controller.signal });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        const value = typeof data.total_users === 'number' ? data.total_users : Number(data.total_users);
        if (mounted && !Number.isNaN(value)) setTotalUsers(value);
      } catch (err) {
        console.error('Failed to fetch total users:', err);
        if (mounted) setTotalUsers(null);
      }
    };

    fetchTotalUsers();
    return () => {
      mounted = false;
      controller.abort();
    };
  }, []);

  // Fetch purchased slips count (VIP subscriptions)
  useEffect(() => {
    let mounted = true;
    const controller = new AbortController();

    const fetchPurchased = async () => {
      try {
        const res = await fetch('https://admin.bozz-tips.com/purchased-slips/', { signal: controller.signal });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        const value = typeof data.purchased_slips === 'number' ? data.purchased_slips : Number(data.purchased_slips);
        if (mounted && !Number.isNaN(value)) setPurchasedSubs(value);
      } catch (err) {
        console.error('Failed to fetch purchased slips:', err);
        if (mounted) setPurchasedSubs(null);
      }
    };

    fetchPurchased();
    return () => {
      mounted = false;
      controller.abort();
    };
  }, []);

  // Fetch pending slips count (active games)
  useEffect(() => {
    let mounted = true;
    const controller = new AbortController();

    const fetchPending = async () => {
      try {
        const res = await fetch('https://admin.bozz-tips.com/pending-slips/', { signal: controller.signal });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        const value = typeof data.pending_slips === 'number' ? data.pending_slips : Number(data.pending_slips);
        if (mounted && !Number.isNaN(value)) setActiveGames(value);
      } catch (err) {
        console.error('Failed to fetch pending slips:', err);
        if (mounted) setActiveGames(null);
      }
    };

    fetchPending();
    return () => {
      mounted = false;
      controller.abort();
    };
  }, []);

  const toggleVipStatus = (vipType: 'daily_vvip_plan' | 'daily_vvip_plan_2' | 'daily_vvip_plan_3' | 'vip_plan') => {
    setVipStatus(prev => ({
      ...prev,
      [vipType]: prev[vipType] === 'available' ? 'sold_out' : 'available'
    }));
  };

  // Function to toggle slip selection
  const toggleSlipSelection = (slipId: number) => {
    setSelectedSlips(prev => {
      const newSet = new Set(prev);
      if (newSet.has(slipId)) {
        newSet.delete(slipId);
      } else {
        newSet.add(slipId);
      }
      return newSet;
    });
  };

  // Function to select all slips
  const selectAllSlips = () => {
    setSelectedSlips(new Set(slips.map(slip => slip.id)));
  };

  // Function to clear selection
  const clearSelection = () => {
    setSelectedSlips(new Set());
  };

  // Function to archive selected slips (hide from admin view but keep for user history)
  const archiveSelectedSlips = () => {
    if (selectedSlips.size === 0) {
      alert('Please select slips to archive');
      return;
    }
    setShowDeleteConfirm(true);
  };

  // Function to confirm archive
  const confirmArchive = () => {
    setSlips(prevSlips => prevSlips.filter(slip => !selectedSlips.has(slip.id)));
    setSelectedSlips(new Set());
    setShowDeleteConfirm(false);
    alert(`${selectedSlips.size} slip(s) archived successfully. Users can still see their purchase history.`);
  };

  // Function to handle new admin form submission
  const handleAddAdmin = () => {
    if (!newAdmin.name.trim() || !newAdmin.email.trim() || !newAdmin.phone.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newAdmin.email)) {
      alert('Please enter a valid email address');
      return;
    }

    // Validate phone format (basic validation)
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    if (!phoneRegex.test(newAdmin.phone.replace(/\s/g, ''))) {
      alert('Please enter a valid phone number');
      return;
    }

    // Here you would typically send the data to your backend
    console.log('New Admin Data:', newAdmin);
    alert(`New ${newAdmin.role} added successfully!`);
    
    // Reset form
    setNewAdmin({
      name: '',
      email: '',
      phone: '',
      role: 'admin',
      permissions: {
        games: true,
        users: true,
        notifications: true,
        sms: true,
        settings: false
      }
    });
    setShowAddAdminModal(false);
  };

  // Function to handle role change and update permissions
  const handleRoleChange = (role: string) => {
    let permissions = {
      games: true,
      users: true,
      notifications: true,
      sms: true,
      settings: false
    };

    switch (role) {
      case 'super_admin':
        permissions = {
          games: true,
          users: true,
          notifications: true,
          sms: true,
          settings: true
        };
        break;
      case 'admin':
        permissions = {
          games: true,
          users: true,
          notifications: true,
          sms: true,
          settings: false
        };
        break;
      case 'moderator':
        permissions = {
          games: true,
          users: false,
          notifications: true,
          sms: false,
          settings: false
        };
        break;
      case 'support':
        permissions = {
          games: false,
          users: true,
          notifications: true,
          sms: true,
          settings: false
        };
        break;
    }

    setNewAdmin(prev => ({
      ...prev,
      role,
      permissions
    }));
  };

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: FaRegCalendarAlt },
    { id: 'games', label: 'Games', icon: FaGamepad },
    { id: 'gamesControl', label: 'Games Control', icon: FaGamepad },
    { id: 'users', label: 'Users', icon: FaUsers },
    { id: 'notifications', label: 'Notifications', icon: FaBell },
    { id: 'sms', label: 'SMS', icon: FaSms },
    { id: 'settings', label: 'Settings', icon: FaCog },
  ];

  // Function to attach booking codes to selected category
  const handleAttachBookings = () => {
    if (!sportyCode.trim() && !msportCode.trim()) {
      alert('Please enter at least one booking code.');
      return;
    }

    setAttachedBookings(prev => ({
      ...prev,
      [selectedCategory]: {
        sportyCode: sportyCode.trim(),
        msportCode: msportCode.trim()
      }
    }));

    setShowAttachDropdown(false);
    setSportyCode('');
    setMsportCode('');
    alert(`Booking codes attached to ${selectedCategory}`);
  };

  // Function to upload games to slips
  const handleUploadGames = () => {
    const currentLoadedGames = loadedGames[selectedCategory] || [];
    if (currentLoadedGames.length === 0) {
      alert('No games to upload. Please load games first.');
      return;
    }

    // Create ONE slip with all the games
    const slip = {
      id: Date.now() + Math.random(), // Unique slip ID
      uploadedAt: new Date().toISOString(),
      sportyCode: attachedBookings[selectedCategory]?.sportyCode || 'N/A',
      msportCode: attachedBookings[selectedCategory]?.msportCode || 'N/A',
      totalOdds: totalOdds[selectedCategory] || 0,
      games: currentLoadedGames.map(game => ({
        ...game,
        result: 'Pending' // Default result for each game
      })),
      slipResult: 'Pending', // Overall slip result
      category: selectedCategory,
      price: gamePrices[selectedCategory] || '0'
    };

    setSlips(prevSlips => [...prevSlips, slip]);
    
    // Clear loaded games and codes for this category
    setLoadedGames(prev => ({
      ...prev,
      [selectedCategory]: []
    }));
    setTotalOdds(prev => ({
      ...prev,
      [selectedCategory]: 0
    }));
    setCurrentBookingCode(prev => ({
      ...prev,
      [selectedCategory]: ''
    }));
    setBookingCode('');
    setSportyCode('');
    setMsportCode('');
    setShowAttachDropdown(false);
    
    // Switch to Slips category
    setSelectedCategory('Slips');
    
    alert(`Slip created successfully with ${currentLoadedGames.length} games!`);
  };

  // Function to update game result
  const handleUpdateGameResult = (slipId: number, gameIndex: number, result: string) => {
    setSlips(prevSlips =>
      prevSlips.map(slip =>
        slip.id === slipId
          ? {
              ...slip,
              games: slip.games.map((game: any, index: number) =>
                index === gameIndex ? { ...game, result } : game
              )
            }
          : slip
      )
    );
    setEditingGame(null);
  };

  // Function to update overall slip result
  const handleUpdateSlipResult = (slipId: number, result: string) => {
    setSlips(prevSlips => 
      prevSlips.map(slip => 
        slip.id === slipId ? { ...slip, slipResult: result } : slip
      )
    );
    setEditingGame(null);
  };

  // Function to publish slip results to users
  const handlePublishSlip = (slipId: number) => {
    setSlips(prevSlips => 
      prevSlips.map(slip => 
        slip.id === slipId ? { ...slip, published: true, publishedAt: new Date().toISOString() } : slip
      )
    );
    // Collapse the slip after publishing
    setExpandedSlip(null);
    alert('Slip results have been published and are now visible to users!');
  };

  // Function to load games from SportyBet API
  const handleLoadGames = async () => {
    if (!bookingCode.trim()) {
      alert('Please enter a SportyBet booking code');
      return;
    }

    setIsLoading(true);
    try {
      // TODO: Replace with actual SportyBet API call
      const response = await fetch(`/api/sportybet/${bookingCode}`);
      const data = await response.json();
      
      if (data.success) {
        setLoadedGames(prev => ({
          ...prev,
          [selectedCategory]: data.games
        }));
        setTotalOdds(prev => ({
          ...prev,
          [selectedCategory]: data.totalOdds
        }));
        setCurrentBookingCode(prev => ({
          ...prev,
          [selectedCategory]: bookingCode
        }));
      } else {
        alert('Failed to load games. Please check the booking code.');
      }
    } catch (error) {
      console.error('Error loading games:', error);
      alert('Error loading games. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Dashboard Overview</h2>
      
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-3xl font-bold text-blue-600">{totalUsers !== null ? totalUsers.toLocaleString() : '—'}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <FaUsers className="text-blue-600 text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Games</p>
              <p className="text-3xl font-bold text-green-600">{activeGames !== null ? activeGames.toLocaleString() : '—'}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <FaGamepad className="text-green-600 text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">VIP Subscriptions</p>
              <p className="text-3xl font-bold text-orange-600">{purchasedSubs !== null ? purchasedSubs.toLocaleString() : '—'}</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-full">
              <FaCheck className="text-orange-600 text-xl" />
            </div>
          </div>
        </div>

      </div>

      {/* Recent Activity */}
      <div className="bg-white p-6 rounded-lg shadow-md border">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
            <span className="text-sm text-gray-600">New user registered: john_doe</span>
            <span className="text-xs text-gray-500">2 minutes ago</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
            <span className="text-sm text-gray-600">VIP package sold: Daily Plan</span>
            <span className="text-xs text-gray-500">5 minutes ago</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
            <span className="text-sm text-gray-600">Game result updated: Team A vs Team B</span>
            <span className="text-xs text-gray-500">10 minutes ago</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderGames = () => {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">Games Management</h2>
        </div>

        {/* Filter Games by Category Section */}
        <div className="bg-white p-6 rounded-lg shadow-md border">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Filter Games by Category</h3>
          <div className="flex flex-wrap gap-3">
            <button 
              onClick={() => {
                setSelectedCategory('Slips');
                setBookingCode('');
              }}
              className={`px-4 py-2 rounded-lg font-medium ${
                selectedCategory === 'Slips' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-600 text-white hover:bg-gray-700'
              }`}
            >
                  Slips ({slips.length})
            </button>
            <button 
              onClick={() => {
                setSelectedCategory('Free');
                setBookingCode('');
              }}
              className={`px-4 py-2 rounded-lg font-medium ${
                selectedCategory === 'Free' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-600 text-white hover:bg-gray-700'
              }`}
            >
              Free
            </button>
            <button 
              onClick={() => {
                setSelectedCategory('DAILY VVIP PLAN');
                setBookingCode('');
              }}
              className={`px-4 py-2 rounded-lg font-medium ${
                selectedCategory === 'DAILY VVIP PLAN' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-600 text-white hover:bg-gray-700'
              }`}
            >
              DAILY VVIP PLAN
            </button>
            <button 
              onClick={() => {
                setSelectedCategory('DAILY VVIP PLAN 2');
                setBookingCode('');
              }}
              className={`px-4 py-2 rounded-lg font-medium ${
                selectedCategory === 'DAILY VVIP PLAN 2' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-600 text-white hover:bg-gray-700'
              }`}
            >
              DAILY VVIP PLAN 2
            </button>
            <button 
              onClick={() => {
                setSelectedCategory('DAILY VVIP PLAN 3');
                setBookingCode('');
              }}
              className={`px-4 py-2 rounded-lg font-medium ${
                selectedCategory === 'DAILY VVIP PLAN 3' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-600 text-white hover:bg-gray-700'
              }`}
            >
              DAILY VVIP PLAN 3
            </button>
            <button 
              onClick={() => {
                setSelectedCategory('VIP PLAN');
                setBookingCode('');
              }}
              className={`px-4 py-2 rounded-lg font-medium ${
                selectedCategory === 'VIP PLAN' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-600 text-white hover:bg-gray-700'
              }`}
            >
              VIP PLAN
            </button>
          </div>
        </div>

        {/* Load Games Section - Shows when Free is selected and no games loaded */}
        {selectedCategory === 'Free' && (!loadedGames[selectedCategory] || loadedGames[selectedCategory].length === 0) && (
          <div className="bg-white p-6 rounded-lg shadow-md border">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Load Games - Free</h3>
            <div className="flex gap-4">
              <input
                type="text"
                value={bookingCode}
                onChange={(e) => setBookingCode(e.target.value)}
                placeholder="Enter SportyBet booking code for Free..."
                className="flex-1 px-4 py-3 border-2 border-green-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <button 
                onClick={handleLoadGames}
                disabled={isLoading}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Loading...' : 'Load'}
              </button>
            </div>
          </div>
        )}

        {/* Display loaded games - Shows when games are loaded */}
        {selectedCategory === 'Free' && loadedGames[selectedCategory] && loadedGames[selectedCategory].length > 0 && (
          <div className="bg-white rounded-lg shadow-md border p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h4 className="text-xl font-bold text-gray-800">Loaded Games from SportyBet</h4>
                <p className="text-sm text-gray-600 mt-1">Booking Code: {currentBookingCode[selectedCategory] || ''}</p>
                <div className="flex gap-2 mt-2">
                  {attachedBookings[selectedCategory] && (
                    <div className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">
                      ✓ Booking codes attached
                    </div>
                  )}
                  {gamePrices[selectedCategory] && (
                    <div className="text-xs text-orange-600 bg-orange-100 px-2 py-1 rounded">
                      Price: ${gamePrices[selectedCategory]}
                    </div>
                  )}
                </div>
              </div>
              <button 
                onClick={() => {
                  setLoadedGames(prev => ({ ...prev, [selectedCategory]: [] }));
                  setTotalOdds(prev => ({ ...prev, [selectedCategory]: 0 }));
                  setCurrentBookingCode(prev => ({ ...prev, [selectedCategory]: '' }));
                }}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
              >
                Clear All
              </button>
            </div>
            
              <div className="space-y-1">
                {(loadedGames[selectedCategory] || []).map((game, index) => (
                 <div key={index} className="flex items-center justify-between py-3 border-b border-gray-200 last:border-b-0">
                   <div className="flex items-center gap-3">
                     <button className="text-black text-xl font-normal hover:text-red-500" style={{ fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
                       ×
                     </button>
                     <div>
                       <div className="text-xs text-gray-500 mb-1 font-normal" style={{ fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>{game.category}</div>
                       <div className="font-normal text-gray-900 text-sm" style={{ fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
                         {game.team1} vs {game.team2}
                       </div>
                       <div className="text-xs text-gray-500 mt-1 font-normal" style={{ fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
                         {game.prediction}
                       </div>
                     </div>
                   </div>
                   <div className="text-right">
                     <div className="font-normal text-gray-900 text-base" style={{ fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>{game.odds}</div>
                   </div>
                 </div>
              ))}
            </div>
            
            <div className="mt-6 flex justify-between items-center">
              <div className="text-sm text-gray-600">
                {loadedGames[selectedCategory]?.length || 0} selections loaded
              </div>
              <div className="text-right">
                <div className="text-lg font-normal text-gray-800" style={{ fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>Total Odds: {totalOdds[selectedCategory] || 0}</div>
                <div className="flex gap-2 mt-2">
                    <button 
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        setShowAttachDropdown(!showAttachDropdown);
                      }}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                    >
                      Add Booking
                    </button>
                    <button 
                      type="button"
                      onClick={() => setShowPriceModal(true)}
                      className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
                    >
                      {gamePrices[selectedCategory] ? `Price: $${gamePrices[selectedCategory]}` : 'Set Price'}
                    </button>
                  <button 
                    onClick={handleUploadGames}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                  >
                    Upload
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Uploaded Slips Section - Shows when Slips is selected */}
        {selectedCategory === 'Slips' && (
          <div className="bg-white p-6 rounded-lg shadow-md border">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Uploaded Slips ({slips.length})</h3>
              {slips.length > 0 && (
                <div className="flex gap-2">
                  <button
                    onClick={selectAllSlips}
                    className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                  >
                    Select All
                  </button>
                  <button
                    onClick={clearSelection}
                    className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                  >
                    Clear Selection
                  </button>
                  <button
                    onClick={archiveSelectedSlips}
                    disabled={selectedSlips.size === 0}
                    className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
                  >
                    Archive Selected ({selectedSlips.size})
                  </button>
                </div>
              )}
            </div>
            
            {slips.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No slips uploaded yet</p>
                <p className="text-sm mt-2">Upload games from other categories to see them here</p>
              </div>
            ) : (
              <div className="space-y-2">
                {slips.map((slip, index) => (
                  <div key={slip.id} className="border border-gray-200 rounded-lg">
                    {/* Collapsed Slip Header */}
                    <div 
                      className={`p-4 transition-colors ${
                        slip.published 
                          ? 'cursor-default bg-gray-50' 
                          : 'cursor-pointer hover:bg-gray-50'
                      }`}
                      onClick={() => {
                        if (!slip.published) {
                          setExpandedSlip(expandedSlip === slip.id ? null : slip.id);
                        }
                      }}
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={selectedSlips.has(slip.id)}
                            onChange={(e) => {
                              e.stopPropagation();
                              toggleSlipSelection(slip.id);
                            }}
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <div>
                            <h3 className="text-lg font-semibold text-gray-800">
                              Slip({index + 1}) - {slip.category} Predictions
                            </h3>
                            <p className="text-sm text-gray-600 mt-1">
                              {slip.games.length} games • Total Odds: {slip.totalOdds} • {new Date(slip.uploadedAt).toLocaleString()}
                            </p>
                            <div className="mt-2 text-xs text-gray-500">
                              <div className="flex gap-4">
                                <span>SportyBet: {slip.sportyCode}</span>
                                <span>MSport: {slip.msportCode}</span>
                                {slip.price && slip.price !== '0' && (
                                  <span className="text-orange-600 font-semibold">Price: ${slip.price}</span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {slip.published ? (
                            <span className="text-green-600 font-medium">
                              ✓ Published on {slip.publishedAt ? new Date(slip.publishedAt).toLocaleString() : 'Unknown date'}
                            </span>
                          ) : (
                            <span className="text-gray-400">
                              {expandedSlip === slip.id ? '▼' : '▶'}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Expanded Slip Content */}
                    {expandedSlip === slip.id && (
                      <div className="border-t border-gray-200 p-4 bg-gray-50">
                        <div className="space-y-2">
                          {slip.games.map((game, gameIndex) => (
                            <div key={gameIndex} className="bg-white rounded-lg p-2 border border-gray-200">
                              <div className="flex items-center justify-between mb-1">
                                <div className="flex items-center gap-2">
                                  <h4 className="font-semibold text-gray-800 text-sm">
                                    {game.team1} vs {game.team2}
                                  </h4>
                                  <span className={`text-sm ${
                                    game.result === 'Won' ? 'text-green-600' :
                                    game.result === 'Lost' ? 'text-red-600' :
                                    'text-yellow-600'
                                  }`}>
                                    {game.result === 'Won' ? '✓' : 
                                     game.result === 'Lost' ? '✗' : '?'}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <div className="text-right">
                                    <div className="font-bold text-gray-900 text-sm" style={{ fontFamily: 'Roboto, -apple-system, BlinkMacSystemFont, sans-serif' }}>
                                      {game.odds}
                                    </div>
                                  </div>
                                  <button
                                    onClick={() => setEditingGame(editingGame === `${slip.id}-${gameIndex}` ? null : `${slip.id}-${gameIndex}`)}
                                    className="px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                                  >
                                    Edit
                                  </button>
                                </div>
                              </div>
                              
                              <div className="text-xs text-gray-600 mb-1">
                                {game.category} • {new Date().toLocaleDateString()}
                              </div>
                              
                              <div className="text-xs font-medium text-gray-800">
                                {game.prediction}
                              </div>
                              
                              {editingGame === `${slip.id}-${gameIndex}` && (
                                <div className="mt-2">
                                  <div className="text-xs font-medium text-gray-700 mb-1">Update Result:</div>
                                  <div className="flex justify-end">
                                    <div className="flex items-center gap-1">
                                      <button
                                        onClick={() => handleUpdateGameResult(slip.id, gameIndex, 'Won')}
                                        className="flex items-center gap-1 px-2 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700"
                                      >
                                        <span>✓</span> Won
                                      </button>
                                      <button
                                        onClick={() => handleUpdateGameResult(slip.id, gameIndex, 'Lost')}
                                        className="flex items-center gap-1 px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700"
                                      >
                                        <span>✗</span> Lost
                                      </button>
                                      <button
                                        onClick={() => handleUpdateGameResult(slip.id, gameIndex, 'Pending')}
                                        className="flex items-center gap-1 px-2 py-1 bg-yellow-600 text-white text-xs rounded hover:bg-yellow-700"
                                      >
                                        <span>?</span> Pending
                                      </button>
                                      <button
                                        onClick={() => setEditingGame(null)}
                                        className="px-2 py-1 text-gray-600 bg-gray-200 text-xs rounded hover:bg-gray-300"
                                      >
                                        Cancel
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                        
                        {/* Publish Button */}
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <div className="flex justify-between items-center">
                            <div className="text-xs text-gray-500">
                              {slip.published ? (
                                <span className="text-green-600 font-medium">
                                  ✓ Published on {slip.publishedAt ? new Date(slip.publishedAt).toLocaleString() : 'Unknown date'}
                                </span>
                              ) : (
                                <span>Ready to publish results</span>
                              )}
                            </div>
                            <button
                              onClick={() => handlePublishSlip(slip.id)}
                              disabled={slip.published}
                              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                                slip.published 
                                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                                  : 'bg-green-600 text-white hover:bg-green-700'
                              }`}
                            >
                              {slip.published ? 'Published' : 'Publish Results'}
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Load Games Section - Shows when VVIP/VIP categories are selected and no games loaded */}
        {(selectedCategory === 'DAILY VVIP PLAN' || selectedCategory === 'DAILY VVIP PLAN 2' || selectedCategory === 'DAILY VVIP PLAN 3' || selectedCategory === 'VIP PLAN') && (!loadedGames[selectedCategory] || loadedGames[selectedCategory].length === 0) && (
          <div className="bg-white p-6 rounded-lg shadow-md border">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Load Games - {selectedCategory}</h3>
            <div className="flex gap-4">
              <input
                type="text"
                value={bookingCode}
                onChange={(e) => setBookingCode(e.target.value)}
                placeholder={`Enter SportyBet booking code for ${selectedCategory}...`}
                className="flex-1 px-4 py-3 border-2 border-green-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <button 
                onClick={handleLoadGames}
                disabled={isLoading}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Loading...' : 'Load'}
              </button>
            </div>
          </div>
        )}

        {/* Display loaded games for VVIP/VIP - Shows when games are loaded */}
        {(selectedCategory === 'DAILY VVIP PLAN' || selectedCategory === 'DAILY VVIP PLAN 2' || selectedCategory === 'DAILY VVIP PLAN 3' || selectedCategory === 'VIP PLAN') && loadedGames[selectedCategory] && loadedGames[selectedCategory].length > 0 && (
          <div className="bg-white rounded-lg shadow-md border p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h4 className="text-xl font-bold text-gray-800">Loaded Games from SportyBet</h4>
                <p className="text-sm text-gray-600 mt-1">Booking Code: {currentBookingCode[selectedCategory] || ''}</p>
                <div className="flex gap-2 mt-2">
                  {attachedBookings[selectedCategory] && (
                    <div className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">
                      ✓ Booking codes attached
                    </div>
                  )}
                  {gamePrices[selectedCategory] && (
                    <div className="text-xs text-orange-600 bg-orange-100 px-2 py-1 rounded">
                      Price: ${gamePrices[selectedCategory]}
                    </div>
                  )}
                </div>
              </div>
              <button 
                onClick={() => {
                  setLoadedGames(prev => ({ ...prev, [selectedCategory]: [] }));
                  setTotalOdds(prev => ({ ...prev, [selectedCategory]: 0 }));
                  setCurrentBookingCode(prev => ({ ...prev, [selectedCategory]: '' }));
                }}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
              >
                Clear All
              </button>
            </div>
            
              <div className="space-y-1">
                {(loadedGames[selectedCategory] || []).map((game, index) => (
                 <div key={index} className="flex items-center justify-between py-3 border-b border-gray-200 last:border-b-0">
                   <div className="flex items-center gap-3">
                     <button className="text-black text-xl font-normal hover:text-red-500" style={{ fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
                       ×
                     </button>
                     <div>
                       <div className="text-xs text-gray-500 mb-1 font-normal" style={{ fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>{game.category}</div>
                       <div className="font-normal text-gray-900 text-sm" style={{ fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
                         {game.team1} vs {game.team2}
                       </div>
                       <div className="text-xs text-gray-500 mt-1 font-normal" style={{ fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
                         {game.prediction}
                       </div>
                     </div>
                   </div>
                   <div className="text-right">
                     <div className="font-normal text-gray-900 text-base" style={{ fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>{game.odds}</div>
                   </div>
                 </div>
              ))}
            </div>
            
            <div className="mt-6 flex justify-between items-center">
              <div className="text-sm text-gray-600">
                {loadedGames[selectedCategory]?.length || 0} selections loaded
              </div>
              <div className="text-right">
                <div className="text-lg font-normal text-gray-800" style={{ fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>Total Odds: {totalOdds[selectedCategory] || 0}</div>
                <div className="flex gap-2 mt-2">
                    <button 
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        setShowAttachDropdown(!showAttachDropdown);
                      }}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                    >
                      Add Booking
                    </button>
                    <button 
                      type="button"
                      onClick={() => setShowPriceModal(true)}
                      className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
                    >
                      {gamePrices[selectedCategory] ? `Price: $${gamePrices[selectedCategory]}` : 'Set Price'}
                    </button>
                  <button 
                    onClick={handleUploadGames}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                  >
                    Upload
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderGamesControl = () => {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-800">VIP Games Control</h2>
        
        {/* VIP Package Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md border">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold text-gray-800">DAILY VVIP PLAN</h3>
              <span className={`px-3 py-1 rounded text-sm ${
                vipStatus.daily_vvip_plan === 'sold_out' 
                  ? 'bg-orange-500 text-white' 
                  : 'bg-green-500 text-white'
              }`}>
                {vipStatus.daily_vvip_plan === 'sold_out' ? 'Sold Out' : 'Available'}
              </span>
            </div>
            <button 
              onClick={() => toggleVipStatus('daily_vvip_plan')}
              className={`w-full mt-4 py-2 rounded font-medium ${
                vipStatus.daily_vvip_plan === 'sold_out'
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : 'bg-orange-600 text-white hover:bg-orange-700'
              }`}
            >
              {vipStatus.daily_vvip_plan === 'sold_out' ? 'Available' : 'Sold Out'}
            </button>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold text-gray-800">DAILY VVIP PLAN 2</h3>
              <span className={`px-3 py-1 rounded text-sm ${
                vipStatus.daily_vvip_plan_2 === 'sold_out' 
                  ? 'bg-orange-500 text-white' 
                  : 'bg-green-500 text-white'
              }`}>
                {vipStatus.daily_vvip_plan_2 === 'sold_out' ? 'Sold Out' : 'Available'}
              </span>
            </div>
            <button 
              onClick={() => toggleVipStatus('daily_vvip_plan_2')}
              className={`w-full mt-4 py-2 rounded font-medium ${
                vipStatus.daily_vvip_plan_2 === 'sold_out'
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : 'bg-orange-600 text-white hover:bg-orange-700'
              }`}
            >
              {vipStatus.daily_vvip_plan_2 === 'sold_out' ? 'Available' : 'Sold Out'}
            </button>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold text-gray-800">DAILY VVIP PLAN 3</h3>
              <span className={`px-3 py-1 rounded text-sm ${
                vipStatus.daily_vvip_plan_3 === 'sold_out' 
                  ? 'bg-orange-500 text-white' 
                  : 'bg-green-500 text-white'
              }`}>
                {vipStatus.daily_vvip_plan_3 === 'sold_out' ? 'Sold Out' : 'Available'}
              </span>
            </div>
            <button 
              onClick={() => toggleVipStatus('daily_vvip_plan_3')}
              className={`w-full mt-4 py-2 rounded font-medium ${
                vipStatus.daily_vvip_plan_3 === 'sold_out'
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : 'bg-orange-600 text-white hover:bg-orange-700'
              }`}
            >
              {vipStatus.daily_vvip_plan_3 === 'sold_out' ? 'Available' : 'Sold Out'}
            </button>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold text-gray-800">VIP PLAN</h3>
              <span className={`px-3 py-1 rounded text-sm ${
                vipStatus.vip_plan === 'sold_out' 
                  ? 'bg-orange-500 text-white' 
                  : 'bg-green-500 text-white'
              }`}>
                {vipStatus.vip_plan === 'sold_out' ? 'Sold Out' : 'Available'}
              </span>
            </div>
            <button 
              onClick={() => toggleVipStatus('vip_plan')}
              className={`w-full mt-4 py-2 rounded font-medium ${
                vipStatus.vip_plan === 'sold_out'
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : 'bg-orange-600 text-white hover:bg-orange-700'
              }`}
            >
              {vipStatus.vip_plan === 'sold_out' ? 'Available' : 'Sold Out'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderUsers = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">User Management</h2>
      
      <div className="bg-white rounded-lg shadow-md border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                      JD
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">John Doe</div>
                      <div className="text-sm text-gray-500">@john_doe</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">john@example.com</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">+1234567890</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    Active
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="text-blue-600 hover:text-blue-900 mr-3">
                    <FaEdit />
                  </button>
                  <button className="text-red-600 hover:text-red-900">
                    <FaTrash />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderSMS = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">SMS Broadcasting</h2>
      
      <div className="bg-white p-6 rounded-lg shadow-md border">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Send SMS</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Recipients</label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input type="radio" name="recipients" value="all" className="mr-2" />
                <span>All Users (1,234 recipients)</span>
              </label>
              <label className="flex items-center">
                <input type="radio" name="recipients" value="custom" className="mr-2" />
                <span>Custom Numbers</span>
              </label>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
            <textarea
              rows={4}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Type your message here..."
            ></textarea>
          </div>
          
          <button className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 flex items-center gap-2">
            <FaSms /> Send SMS
          </button>
        </div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Settings & Admin Management</h2>
        <button
          onClick={() => setShowAddAdminModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <FaPlus /> Add New Admin
        </button>
      </div>

      {/* Current Admins */}
      <div className="bg-white rounded-lg shadow-md border overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">Current Admins</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Admin</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Active</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                      AD
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">Admin User</div>
                      <div className="text-sm text-gray-500">admin@bozz-tips.com</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                    Super Admin
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">2 minutes ago</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    Active
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="text-blue-600 hover:text-blue-900 mr-3">
                    <FaEdit />
                  </button>
                  <button className="text-red-600 hover:text-red-900">
                    <FaTimes />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return renderDashboard();
      case 'games':
        return renderGames();
      case 'gamesControl':
        return renderGamesControl();
      case 'users':
        return renderUsers();
      case 'notifications':
        return <div className="text-center py-12"><h2 className="text-2xl font-bold text-gray-800">Notifications Management</h2></div>;
      case 'sms':
        return renderSMS();
      case 'settings':
        return renderSettings();
      default:
        return renderDashboard();
    }
  };

  if (!isClient) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Admin Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-blue-900 text-white shadow-lg">
        <div className="px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">Bozz Tips Admin</h1>
              <p className="text-blue-200">Control Panel</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm">Admin User</span>
              <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center gap-2">
                <FaSignOutAlt /> Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar Navigation */}
        <nav className="w-64 bg-white shadow-lg min-h-screen">
          <div className="p-4">
            <ul className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <li key={tab.id}>
                    <button
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                        activeTab === tab.id
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="text-lg" />
                      <span className="font-medium">{tab.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {renderContent()}
        </main>
      </div>

      {/* Attach Booking Dropdown */}
      {showAttachDropdown && (
        <div className="fixed inset-0 z-40" onClick={() => setShowAttachDropdown(false)}>
          <div 
            className="absolute top-40 right-6 bg-white rounded-lg shadow-lg border p-3 w-64 z-50"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-base font-semibold text-gray-800">Attach Booking</h3>
              <button
                onClick={() => setShowAttachDropdown(false)}
                className="text-gray-400 hover:text-gray-600 text-xl"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  SportyBet Code
                </label>
                <input
                  type="text"
                  value={sportyCode}
                  onChange={(e) => setSportyCode(e.target.value)}
                  placeholder="e.g. abcd"
                  className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  MSport Code
                </label>
                <input
                  type="text"
                  value={msportCode}
                  onChange={(e) => setMsportCode(e.target.value)}
                  placeholder="e.g. efgh"
                  className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-2 mt-3">
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  setShowAttachDropdown(false);
                }}
                className="px-3 py-1.5 text-xs text-gray-600 bg-gray-200 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  handleAttachBookings();
                }}
                className="px-3 py-1.5 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Attach
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Set Price Modal */}
      {showPriceModal && (
        <div className="fixed inset-0 z-40" onClick={() => setShowPriceModal(false)}>
          <div 
            className="absolute top-40 right-6 bg-white rounded-lg shadow-lg border p-3 w-64 z-50"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-base font-semibold text-gray-800">Set Price for {selectedCategory}</h3>
              <button
                onClick={() => setShowPriceModal(false)}
                className="text-gray-400 hover:text-gray-600 text-xl"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Price (USD)
                </label>
                <input
                  type="number"
                  value={gamePrice || gamePrices[selectedCategory] || ''}
                  onChange={(e) => setGamePrice(e.target.value)}
                  placeholder={gamePrices[selectedCategory] ? `Current: $${gamePrices[selectedCategory]}` : "e.g. 10.00"}
                  step="0.01"
                  min="0"
                  className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-purple-500"
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-2 mt-3">
              <button
                type="button"
                onClick={() => {
                  setShowPriceModal(false);
                  setGamePrice('');
                }}
                className="px-3 py-1.5 text-xs text-gray-600 bg-gray-200 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  // Save price for the selected category
                  setGamePrices(prev => ({
                    ...prev,
                    [selectedCategory]: gamePrice
                  }));
                  alert(`Price set to $${gamePrice} for ${selectedCategory}`);
                  setShowPriceModal(false);
                  setGamePrice('');
                }}
                className="px-3 py-1.5 text-xs bg-purple-600 text-white rounded hover:bg-purple-700"
              >
                Set Price
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Archive Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50" onClick={() => setShowDeleteConfirm(false)}>
          <div 
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-lg border p-6 w-96 z-50"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Archive Slips</h3>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="text-gray-400 hover:text-gray-600 text-xl"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-4">
              <p className="text-gray-600">
                Are you sure you want to archive {selectedSlips.size} selected slip(s)?
              </p>
              <p className="text-sm text-gray-500">
                <strong>Note:</strong> This will hide the slips from the admin view, but users will still be able to see their purchase history.
              </p>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-sm text-gray-600 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmArchive}
                className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Archive Slips
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add New Admin Modal */}
      {showAddAdminModal && (
        <div className="fixed inset-0 z-50" onClick={() => setShowAddAdminModal(false)}>
          <div 
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-lg border p-6 w-96 z-50 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Add New Admin</h3>
              <button
                onClick={() => setShowAddAdminModal(false)}
                className="text-gray-400 hover:text-gray-600 text-xl"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-4">
              {/* Basic Information */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={newAdmin.name}
                  onChange={(e) => setNewAdmin(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter full name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={newAdmin.email}
                  onChange={(e) => setNewAdmin(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="Enter email address"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  value={newAdmin.phone}
                  onChange={(e) => setNewAdmin(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="Enter phone number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Role Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Admin Role *
                </label>
                <select
                  value={newAdmin.role}
                  onChange={(e) => handleRoleChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="admin">Admin - Full access except settings</option>
                  <option value="moderator">Moderator - Games and notifications only</option>
                  <option value="support">Support - Users and communications</option>
                  <option value="super_admin">Super Admin - Complete access (use carefully)</option>
                </select>
              </div>

              {/* Permissions Display */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Permissions
                </label>
                <div className="space-y-2 p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Games Management</span>
                    <span className={`text-xs px-2 py-1 rounded ${newAdmin.permissions.games ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {newAdmin.permissions.games ? 'Allowed' : 'Restricted'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">User Management</span>
                    <span className={`text-xs px-2 py-1 rounded ${newAdmin.permissions.users ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {newAdmin.permissions.users ? 'Allowed' : 'Restricted'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Notifications</span>
                    <span className={`text-xs px-2 py-1 rounded ${newAdmin.permissions.notifications ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {newAdmin.permissions.notifications ? 'Allowed' : 'Restricted'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">SMS Broadcasting</span>
                    <span className={`text-xs px-2 py-1 rounded ${newAdmin.permissions.sms ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {newAdmin.permissions.sms ? 'Allowed' : 'Restricted'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Settings & Admin Management</span>
                    <span className={`text-xs px-2 py-1 rounded ${newAdmin.permissions.settings ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {newAdmin.permissions.settings ? 'Allowed' : 'Restricted'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                onClick={() => setShowAddAdminModal(false)}
                className="px-4 py-2 text-sm text-gray-600 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddAdmin}
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Add Admin
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
