'use client';
import Link from 'next/link';
import React,{ useState,useEffect, useRef } from 'react';
import axios from 'axios';
import LocationModal from '../../components/LocationModal';
import LocationPopover from '../../components/LocationPopover';

const PredictionsPage:React.FC = () => {
  type Game = {
    game_id: number;
    date_created: string;
    time_created: string;
    game_type: string;
    team1: string;
    team2: string;
    prediction: string;
}

const [selectedDate, setSelectedDate] = useState(new Date());
const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
const [games, setGames] = useState<Game[]>([])
const [day, setDay] = useState('today');
const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
const [isLocationPopoverOpen, setIsLocationPopoverOpen] = useState(false);
const buyPlanBtnRef = React.useRef<HTMLButtonElement>(null);
const [openVvipPopover, setOpenVvipPopover] = useState<number | null>(null);
const vvipBtnRefs = [useRef<HTMLButtonElement>(null), useRef<HTMLButtonElement>(null), useRef<HTMLButtonElement>(null)];
const [isCorrectScorePopoverOpen, setIsCorrectScorePopoverOpen] = useState(false);
const correctScoreBtnRef = useRef<HTMLButtonElement>(null);

useEffect(() => {
  async function fetchGames(): Promise<void> {
    try {
      let response;

      if (day === 'today') {
        response = await axios.get<Game[]>("https://wonit-backend.onrender.com/today-games/");
      } else if (day === 'yesterday') {
        response = await axios.get<Game[]>("https://wonit-backend.onrender.com/yesterday-games");
      } else if (day === 'tomorrow') {
        response = await axios.get<Game[]>("https://wonit-backend.onrender.com/tomorrow-games");
      } else {
        const formattedDate = formatDateForInput(selectedDate);
        response = await axios.get<Game[]>(`https://wonit-backend.onrender.com/other-games?formattedDate=${formattedDate}`);
      }

      const gamesData = response.data 
      setGames(gamesData);
      console.log(gamesData);
    } catch (error) {
      console.error("Error fetching games:", error);
    }
  }

  fetchGames();
}, [day, selectedDate]);

const formatDate = (date: Date) => {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const newDate = new Date(e.target.value);
  setSelectedDate(newDate);
  setDay('other'); // ✅ Move this here
  setIsDatePickerOpen(false);
};


const goToYesterday = () => {
  const yesterday = new Date(selectedDate);
  yesterday.setDate(selectedDate.getDate() - 1);
  setSelectedDate(yesterday);
  setDay('yesterday');
  
};

const goToTomorrow = () => {
  const tomorrow = new Date(selectedDate);
  tomorrow.setDate(selectedDate.getDate() + 1);
  setDay('tomorrow');
  setSelectedDate(tomorrow);
  
};
const goToToday = () => {
  const today = new Date();
  setSelectedDate(today);
  setDay('today');
};

const formatDateForInput = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};


  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-700 py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white text-center">PREDICTIONS</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Date Navigation */}
        <div className="flex justify-center space-x-4 mb-8">
        <button 
  onClick={goToYesterday}
  className={`px-8 py-2 rounded-full border ${day === 'yesterday' ? 'bg-blue-500 text-white' : 'border-blue-500 text-blue-900 hover:bg-blue-500 hover:text-white'} transition-colors`}
>
  Yesterday
</button>

          <button 
  onClick={goToToday}
  className={`px-8 py-2 rounded-full border ${day === 'today' ? 'bg-blue-500 text-white' : 'border-blue-500 text-blue-900 hover:bg-blue-500 hover:text-white'} transition-colors`}
>
  Today
</button>

<button 
  onClick={goToTomorrow}
  className={`px-8 py-2 rounded-full border ${day === 'tomorrow' ? 'bg-blue-500 text-white' : 'border-blue-500 text-blue-900 hover:bg-blue-500 hover:text-white'} transition-colors`}
>
  Tomorrow
</button>

          
          <button
            onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
            className="px-4 py-2 rounded-full border border-blue-500 text-blue-900 hover:bg-blue-500 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </button>
          {isDatePickerOpen && (
            <div className="absolute right-0 mt-2 bg-white rounded-lg shadow-lg p-2 z-50">
              <input
                type="date"
                value={formatDateForInput(selectedDate)}
                onChange={handleDateChange}
                className="px-4 py-2 border border-gray-300 rounded-lg text-center cursor-pointer hover:border-blue-500 transition-colors appearance-none"
              />
            </div>
          )}
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-2 text-blue-900">
            Football Matches Predictions For {formatDate(selectedDate)}
          </h2>
          <p className="text-gray-600">
            Here are all of our football betting predictions for {formatDate(selectedDate)}.
          </p>
        </div>

        {/* Free Predictions List */}
        <div className="max-w-4xl mx-auto space-y-4 mb-12">
          {games.map((match, index) => (
            <div 
              key={index}
              className="bg-white p-6 flex items-center justify-between hover:shadow-md transition-shadow rounded-lg border border-gray-100"
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
          ))}
        </div>

        {/* Booking Code Section */}
        <div className="max-w-4xl mx-auto mb-12">
          {[
            {
              date: "01/05",
              time: "07:00 PM",
              type: "Handicap 0:2",
              team1: "Athletic Bilbao",
              team2: "Man Utd",
              prediction: "Away (0:2)"
            },
            {
              date: "01/05",
              time: "05:30 PM",
              type: "Double Chance",
              team1: "Nottingham Forest",
              team2: "Brentford FC",
              prediction: "Home or Away"
            },
            {
              date: "01/05",
              time: "05:30 PM",
              type: "Over/Under",
              team1: "Viborg FF",
              team2: "Copenhagen",
              prediction: "Over 1.5"
            },
            {
              date: "01/05",
              time: "04:00 PM",
              type: "Over/Under",
              team1: "Rosenborg BK",
              team2: "Kristiansund BK",
              prediction: "Over 2.5"
            }
          ].map((match, index) => (
            <div 
              key={index}
              className="bg-white p-6 mb-4 flex items-center justify-between hover:shadow-md transition-shadow"
            >
              <div className="flex items-center space-x-8">
                <div className="w-32">
                  <div className="text-blue-600 font-medium">{match.date}</div>
                  <div className="text-blue-600 text-sm">{match.time}</div>
                </div>
                <div>
                  <div className="text-gray-500 text-sm mb-1">{match.type}</div>
                  <div className="font-medium">{match.team1} vs {match.team2}</div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-gray-600">{match.prediction}</span>
                <div className="w-4 h-4 rounded-full bg-yellow-300"></div>
              </div>
            </div>
          ))}
          
          <div className="text-center mt-8">
            <button className="bg-blue-600 text-white px-8 py-3 uppercase font-semibold hover:bg-blue-700 transition-colors" onClick={() => setIsLocationModalOpen(true)}>
              GET BOOKING CODE
            </button>
          </div>
        </div>

        {/* VIP Section */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-center mb-12 text-blue-900">VIP</h2>
          <div className="max-w-sm mx-auto bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <h3 className="text-xl font-bold mb-4 text-blue-900">DAILY VIP PLAN</h3>
              <div className="text-blue-600 text-3xl font-bold mb-6">$2.67</div>
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
              />
            </div>
          </div>
        </div>

        {/* VVIP Section */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-center mb-12 text-blue-900">VVIP</h2>
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-3 gap-8">
              {/* Column 1 */}
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="text-blue-600 text-sm mb-6">05/01, 07:02 AM</div>
                <div className="space-y-4">
                  {[
                    ["Zhejiang FC", "Changchun Yatai"],
                    ["Shandong Taisha...", "Qingdao Haini..."],
                    ["Shanghai Port FC", "Beijing Guoan"],
                    ["Club Brugge", "Gent"],
                    ["SK Super Nova", "Riga FC"],
                    ["Rosenborg BK", "Kristiansund BK"],
                    ["Viborg FF", "Copenhagen"],
                    ["Nottingham Forest", "Brentford FC"],
                    ["Tottenham", "Bodoe/Glimt"],
                    ["Djurgardens IF", "Chelsea"]
                  ].map(([team1, team2], index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-gray-700 text-sm">{team1}</span>
                      <span className="text-gray-500 text-sm">vs</span>
                      <span className="text-gray-700 text-sm">{team2}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-6">
                  <button
                    ref={vvipBtnRefs[0]}
                    className="bg-blue-900 text-white text-sm py-2 px-4 w-full"
                    onClick={() => setOpenVvipPopover(0)}
                  >
                    10.03 ODDS ($4.00)
                  </button>
                  <LocationPopover
                    isOpen={openVvipPopover === 0}
                    onClose={() => setOpenVvipPopover(null)}
                    anchorRef={vvipBtnRefs[0] as React.RefObject<HTMLButtonElement>}
                  />
                </div>
              </div>

              {/* Column 2 */}
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="text-blue-600 text-sm mb-6">05/01, 07:01 AM</div>
                <div className="space-y-4">
                  {[
                    ["Club Brugge", "Gent"],
                    ["Rosenborg BK", "Kristiansund BK"],
                    ["Tottenham", "Bodoe/Glimt"],
                    ["Djurgardens IF", "Chelsea"]
                  ].map(([team1, team2], index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-gray-700 text-sm">{team1}</span>
                      <span className="text-gray-500 text-sm">vs</span>
                      <span className="text-gray-700 text-sm">{team2}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-6">
                  <button
                    ref={vvipBtnRefs[1]}
                    className="bg-blue-900 text-white text-sm py-2 px-4 w-full"
                    onClick={() => setOpenVvipPopover(1)}
                  >
                    67.86 ODDS ($20.00)
                  </button>
                  <LocationPopover
                    isOpen={openVvipPopover === 1}
                    onClose={() => setOpenVvipPopover(null)}
                    anchorRef={vvipBtnRefs[1] as React.RefObject<HTMLButtonElement>}
                  />
                </div>
              </div>

              {/* Column 3 */}
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="text-blue-600 text-sm mb-6">05/01, 12:00 AM</div>
                <div className="space-y-4">
                  {[
                    {
                      team1: "Ethiopian Coffe...",
                      team2: "Dire Dawa Ken...",
                      option: "Home",
                      odds: "1.86"
                    },
                    {
                      team1: "Hawke's Bay Hawks",
                      team2: "Whai",
                      option: "Home",
                      odds: "2.98"
                    },
                    {
                      team1: "Moutet, Corentin",
                      team2: "Kotov, Pavel",
                      option: "Home",
                      odds: "2.83"
                    },
                    {
                      team1: "Walton, Adam",
                      team2: "Rachmazov, Alibek",
                      option: "Away",
                      odds: "1.27"
                    },
                    {
                      team1: "Nam Ji / Yuzu...",
                      team2: "Bayldon B / Stald...",
                      option: "Home",
                      odds: "1.27"
                    }
                  ].map((match, index) => (
                    <div key={index} className="bg-gray-50 p-3 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-700 text-sm">{match.team1}</span>
                        <span className="text-gray-500 text-sm">vs</span>
                        <span className="text-gray-700 text-sm">{match.team2}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="bg-gray-100 px-2 py-1 rounded">
                          <span className="text-gray-600 text-sm">Option: {match.option}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="bg-gray-100 px-2 py-1 rounded">
                            <span className="text-gray-600 text-sm">Odds: {match.odds}</span>
                          </div>
                          <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                          </svg>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 flex items-center justify-end">
                  <button
                    ref={vvipBtnRefs[2]}
                    className="bg-blue-900 text-white text-sm py-2 px-4"
                    onClick={() => setOpenVvipPopover(2)}
                  >
                    1.00 ODDS ($33.33)
                  </button>
                  <LocationPopover
                    isOpen={openVvipPopover === 2}
                    onClose={() => setOpenVvipPopover(null)}
                    anchorRef={vvipBtnRefs[2] as React.RefObject<HTMLButtonElement>}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Correct Score Section */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-center mb-12 text-blue-900">Correct score</h2>
          <div className="max-w-4xl mx-auto">
            <div className="text-blue-600 text-sm mb-4">05/01, 12:00 AM</div>
            <button
              ref={correctScoreBtnRef}
              className="bg-blue-900 text-white text-lg font-medium py-3 px-12 block mx-auto hover:bg-blue-800 transition-colors"
              onClick={() => setIsCorrectScorePopoverOpen(true)}
            >
              1.00 ODDS ($33.33)
            </button>
            <LocationPopover
              isOpen={isCorrectScorePopoverOpen}
              onClose={() => setIsCorrectScorePopoverOpen(false)}
              anchorRef={correctScoreBtnRef as React.RefObject<HTMLButtonElement>}
            />
          </div>
        </div>
      </div>
      {isLocationModalOpen && (
        <div className="fixed top-0 left-0 w-full z-[9999] text-center text-red-600 bg-white">[DEBUG] Location Modal is Open</div>
      )}
      <LocationModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        onSelect={() => setIsLocationModalOpen(false)}
      />
    </div>
  );
} 

export default PredictionsPage;