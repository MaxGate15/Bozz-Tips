'use client';
import Link from 'next/link';
import React,{ useState,useEffect, useRef } from 'react';
import LocationModal from '../../components/LocationModal';
import usePreviousVipGames from '../freegames/PreviousVipGames';
import LocationPopover from '../../components/LocationPopover';
import useGames,{extractGames} from '../freegames/FreeGames';
import useUpdateCheck from '../UpdateCheck/Check';
import DatePicker from 'react-datepicker';
import axios from 'axios';
import 'react-datepicker/dist/react-datepicker.css';
import { FaRegCalendarAlt } from 'react-icons/fa';
import { format } from 'date-fns';


const PredictionsPage:React.FC = () => {
  type Game = {
    game_id: number;
    date_created: string;
    time_created: string;
    game_type: string;
    team1: string;
    team2: string;
    prediction: string;
    odd: string;
    result: string;
    booking_code: {bc_id: number; betWay_code: string,sportyBet_code: string};
}
type Update = {
  vip:boolean;
  vvip1:boolean;
  vvip2:boolean;
  vvip3:boolean;
}


const [games, setGames] = useState<Game[]>([])
const [yesterdayGames, setYesterdayGames] = useState<Game[]>([]);
const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
const [isLocationPopoverOpen, setIsLocationPopoverOpen] = useState(false);
const buyPlanBtnRef = React.useRef<HTMLButtonElement>(null);
const [openVvipPopover, setOpenVvipPopover] = useState<string | null>(null);
const vvipBtnRefs = [useRef<HTMLButtonElement>(null), useRef<HTMLButtonElement>(null), useRef<HTMLButtonElement>(null)];
const [isCorrectScorePopoverOpen, setIsCorrectScorePopover] = useState(false);
const correctScoreBtnRef = useRef<HTMLButtonElement>(null);
const { today, tomorrow, yesterday, loading} = useGames();
const { updateAvailable, updatePurchase, error } = useUpdateCheck() as {
  updateAvailable: Update | null;
  updatePurchase: Update | null;
  error: string | null;
};

// const [selectedDate, setSelectedDate] = useState(new Date());

const [selectedDay, setSelectedDay] = useState<'yesterday' | 'today' | 'tomorrow' | 'other'>('today');
const [isBookingPopoverOpen, setIsBookingPopoverOpen] = useState(false);
const bookingBtnRef = useRef<HTMLButtonElement>(null);
// const bookingCodes = [
//   { site: 'SportyBet', code: 'AD3S4S' },
//   { site: 'Betway', code: '123647' },
// ];
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
const [copiedCode, setCopiedCode] = useState<string | null>(null);
const [selectedDate, setSelectedDate] = useState<string>("");
const [showDatePicker, setShowDatePicker] = useState(false);
const [calendarDate, setCalendarDate] = useState<Date | null>(null);

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

const {vipPSlips, vvip1PSlips, vvip2PSlips, vvip3PSlips} = usePreviousVipGames() as {
    vipPSlips: Slip[];
    vvip1PSlips: Slip[];
    vvip2PSlips: Slip[];
    vvip3PSlips: Slip[];
  };


useEffect(() => {
  if (selectedDay === 'today') {
    setGames(today);
  } else if (selectedDay === 'tomorrow') {
    setGames(tomorrow);
  } else if (selectedDay === 'yesterday') {
    setGames(yesterday);
  } else if (selectedDay === 'other' && selectedDate) {
    
    // Fetch games for the selected date
    const fetchPreviousGames = async () => {
            try {
                const response = await axios.get(`https://admin.bozz-tips.com/free-games/?date=${selectedDate}`);
                
                const otherGame = extractGames(response.data);

                setGames(otherGame);
            } catch (err) {
                console.error(`Error fetching ${selectedDate} games:`, err);
                return [];
            }
        };

        fetchPreviousGames();
    
  }
}, [selectedDay, today, tomorrow, yesterday, selectedDate]);


  // Fetch VVIP games when the component mounts


// const formatDate = (date: Date) => {
//   return date.toLocaleDateString('en-US', {
//     weekday: 'long',
//     year: 'numeric',
//     month: 'long',
//     day: 'numeric'
//   });
// };

// const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//   const newDate = new Date(e.target.value);
//   setSelectedDate(newDate);
//   setDay('other'); // ✅ Move this here
//   setIsDatePickerOpen(false);
// };

// const goToYesterday = () => {
//   const yesterday = new Date(selectedDate);
//   yesterday.setDate(selectedDate.getDate() - 1);
//   setSelectedDate(yesterday);
//   setDay('yesterday');
  
// };

// const goToTomorrow = () => {
//   const tomorrow = new Date(selectedDate);
//   tomorrow.setDate(selectedDate.getDate() + 1);
//   setDay('tomorrow');
//   setSelectedDate(tomorrow);
  
// };
// const goToToday = () => {
//   const today = new Date();
//   setSelectedDate(today);
//   setDay('today');
// };

// const formatDateForInput = (date: Date) => {
//   const year = date.getFullYear();
//   const month = String(date.getMonth() + 1).padStart(2, '0');
//   const day = String(date.getDate()).padStart(2, '0');
//   return `${year}-${month}-${day}`;
type VVIP = {
    price: string;
    category: string;
  }
  const [vvipData,setVvipData]=useState<VVIP[]>(

    []
  )
  const statusColor = {
  won: 'bg-green-500',
  lost: 'bg-red-500',
  pending: 'bg-yellow-400',
  default: 'bg-yellow-400',
};

   useEffect(() => {
    const fetchUpdates = async () => {
      try {
        const response = await axios.get('https://admin.bozz-tips.com/vvip-price/'); // Adjust the API endpoint as needed
        if (response.data) {
          // Assuming the response data structure matches the expected type
          setVvipData(response.data);
          
        }
      }
      catch (error) {
        console.error('Error fetching updates:', error);
      }
    }
    fetchUpdates();
  }, []);
    
// };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-700 py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white text-center">PREDICTIONS</h1>
        </div>
      </div>

      <div className="container mx-auto px-2 sm:px-4 py-8">
        {/* Date Navigation */}
        <div className="flex flex-wrap justify-center gap-2 sm:space-x-4 mb-8 items-center">
          {(['yesterday', 'today', 'tomorrow'] as const).map((day) => (
            <button
              key={day}
              className={`px-4 py-2 sm:px-8 rounded-full border-2 text-xs sm:text-base ${selectedDay === day
                ? 'bg-blue-500 text-white border-blue-500'
                : 'border-blue-500 text-blue-900 hover:bg-blue-500 hover:text-white'
                } transition-colors`}
              onClick={() => { setSelectedDay(day); setSelectedDate(""); setCalendarDate(null); }}
            >
              {day.charAt(0).toUpperCase() + day.slice(1)}
            </button>
          ))}
          <div className="relative flex items-center ml-0 sm:ml-4 mt-2 sm:mt-0">
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
        <div className="text-center mb-8">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 text-blue-900">
            Football Matches Predictions for {selectedDay.charAt(0).toUpperCase() + selectedDay.slice(1)}
          </h2>
          <p className="text-gray-600 text-sm sm:text-base">Here are our predictions for {selectedDay}.</p>
        </div>

        {/* Free Predictions List */}
        <div className="max-w-full sm:max-w-4xl mx-auto space-y-4 mb-12">
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
              // Format time to h:mma (e.g., 3:26pm)
              let formattedTime = '';
              try {
                const [hours, minutes, seconds] = match.time_created.split(':');
                const date = new Date();
                date.setHours(Number(hours));
                date.setMinutes(Number(minutes));
                date.setSeconds(Number(seconds));
                formattedTime = format(date, 'h:mma').toLowerCase();
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
                  <div className="flex flex-col items-center mt-1 sm:mt-0 min-w-[60px]">
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
        </div>

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
                    <span className="font-mono text-blue-700 text-lg">{games[0].booking_code.betWay_code}</span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(games[0].booking_code.betWay_code);
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
                    <span className="font-mono text-blue-700 text-lg">{games[0].booking_code.sportyBet_code}</span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(games[0].booking_code.sportyBet_code);
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

        {/* VIP Section */}
        {  updateAvailable?.vip  &&
        <div className="mt-20">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-12 text-blue-900">VIP</h2>
          <div className="max-w-sm mx-auto bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <h3 className="text-xl font-bold mb-4 text-blue-900 text-center">DAILY VIP PLAN</h3>
              <div className="flex justify-center mb-2">
                <span className="inline-block px-4 py-1 rounded-full border border-green-500 bg-green-100 text-green-600 font-bold text-sm">
                  Available
                </span>
              </div>
              <div className="text-blue-600 text-3xl font-bold mb-6 text-center">${vvipData.find(i => i.category === "vvip1")?.price ?? '10.00'}</div>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Daily VIP Package
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Telegram Odds
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Access to VIP Tips (For 1 day)
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Recovery Tips Available
                </li>
              </ul>
              <button
                disabled={!updateAvailable?.vip || updatePurchase?.vip}
                ref={buyPlanBtnRef}
                className="block w-full bg-gradient-to-r from-blue-700 to-blue-900 text-white text-center py-3 mt-6 rounded-md font-semibold hover:from-blue-800 hover:to-blue-950 transition-all"
                onClick={() => setIsLocationPopoverOpen(true)}
              >
                BUY PLAN
              </button>
              <LocationPopover
                isOpen={isLocationPopoverOpen}
                onClose={() => setIsLocationPopoverOpen(false)}
                anchorRef={buyPlanBtnRef as React.RefObject<HTMLButtonElement>}
                game_category='vip'
                price={vvipData.find(i => i.category === "vvip1")?.price ?? "10.00"} // Assuming the price is fixed for VIP
              />
            </div>
          </div>
        </div>}

        {/* VVIP Plans Section (added below VIP) */}
        
        <div className="mt-20">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-12 text-blue-900">VVIP PLANS</h2>
          {!updateAvailable?.vvip1 && !updateAvailable?.vvip2 && !updateAvailable?.vvip3 && !updateAvailable?.vip &&(
              <div className="col-span-1 md:col-span-2 lg:col-span-3 bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-4 text-red-600">No VVIP Plans Available</h3>
                  <p className="text-gray-600">Currently, there are no VVIP plans available. Please check back later.</p>
                </div>
                </div>)}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-full lg:max-w-6xl mx-auto">
            
            {/* DAILY VVIP PLAN */}
            { updateAvailable?.vvip1 && 
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <h3 className="text-xl font-bold mb-4">DAILY VVIP PLAN</h3>
                <div className="text-red-600 text-3xl font-bold mb-6">${vvipData.find(i => i.category === "vvip1")?.price ?? '10.00'}</div>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    Daily VVIP Package
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    Access to VVIP Tips
                  </li>
                </ul>
                <button
                  disabled={!updateAvailable?.vvip1 || updatePurchase?.vvip1}
                  ref={vvipBtnRefs[0]}
                  onClick={() => setOpenVvipPopover('daily')}
                  className="w-full bg-gradient-to-r from-blue-700 to-blue-900 text-white py-3 font-semibold hover:from-blue-800 hover:to-blue-950 transition-all"
                >
                  SELECT PLAN
                </button>
                <LocationPopover
                  isOpen={openVvipPopover === 'daily'}
                  onClose={() => setOpenVvipPopover(null)}
                  anchorRef={vvipBtnRefs[0] as React.RefObject<HTMLButtonElement>}
                  game_category='vvip1'
                  price={vvipData.find(i => i.category === "vvip1")?.price ?? "10.00"} // Assuming the price is fixed for VVIP1
                />
              </div>
                </div>}
            {/* DAILY VVIP PLAN 2 */}
            { updateAvailable?.vvip2 && 
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <h3 className="text-xl font-bold mb-4">DAILY VVIP PLAN 2</h3>
                <div className="text-red-600 text-3xl font-bold mb-6">${vvipData.find(i => i.category === "vvip2")?.price ?? '10.00'}</div>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    Daily VVIP Package 2
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    Access to VVIP Tips
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    Half Time/Full Time
                  </li>
                </ul>
                <button
                  disabled={!updateAvailable?.vvip2 || updatePurchase?.vvip2}
                  ref={vvipBtnRefs[1]}
                  onClick={() => setOpenVvipPopover('weekly')}
                  className="w-full bg-gradient-to-r from-blue-700 to-blue-900 text-white py-3 font-semibold hover:from-blue-800 hover:to-blue-950 transition-all"
                >
                  SELECT PLAN
                </button>
                <LocationPopover
                  isOpen={openVvipPopover === 'weekly'}
                  onClose={() => setOpenVvipPopover(null)}
                  anchorRef={vvipBtnRefs[1] as React.RefObject<HTMLButtonElement>}
                  game_category='vvip2'
                  price={vvipData.find(i => i.category === "vvip2")?.price ?? "20.00"} // Assuming the price is fixed for VVIP2
                />
              </div>
            </div>}
            {/* DAILY VVIP PLAN 3 */}
            { updateAvailable?.vvip3 &&
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <h3 className="text-xl font-bold mb-4">DAILY VVIP PLAN 3</h3>
                <div className="text-red-600 text-3xl font-bold mb-6">${vvipData.find(i => i.category === "vvip3")?.price ?? '10.00'}</div>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    Daily VVIP Package 3
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    Access to VVIP Tips
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    Exclusive Analysis
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    Correct Score
                  </li>
                </ul>
          <button
                  disabled={!updateAvailable?.vvip3 || updatePurchase?.vvip3}
                  ref={vvipBtnRefs[2]}
                  onClick={() => setOpenVvipPopover('monthly')}
                  className="w-full bg-gradient-to-r from-blue-700 to-blue-900 text-white py-3 font-semibold hover:from-blue-800 hover:to-blue-950 transition-all"
                >
                  SELECT PLAN
          </button>
          <LocationPopover
                  isOpen={openVvipPopover === 'monthly'}
            onClose={() => setOpenVvipPopover(null)}
                  anchorRef={vvipBtnRefs[2] as React.RefObject<HTMLButtonElement>}
                  game_category='vvip3'
                  price={vvipData.find(i => i.category === "vvip3")?.price ?? "30.00"} // Assuming the price is fixed for VVIP3
          />
        </div>
      </div>}
          </div>
        </div>

        {/* Yesterday's vvip games Section */}
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

        {/* Removed as requested */}
      </div>
    </div>
  );
}

export default PredictionsPage;