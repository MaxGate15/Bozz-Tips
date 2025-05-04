'use client'
import Link from "next/link";
import React,{ useState,useEffect } from "react";
import axios from "axios";

const Home:React.FC =() =>{
  type Game = {
    game_id: number;
    date_created: string;
    time_created: string;
    game_type: string;
    team1: string;
    team2: string;
    prediction: string;
  }
  const [games, setGames] = useState<Game[]>([]);
  useEffect(() => {
  async function fetchGames():Promise<void> {
    try {
      const response = await axios.get<Game[]>("https://wonit-backend.onrender.com/games");
      setGames(response.data);
    } catch (error) {
      console.error("Error fetching games:", error);
    }

  }
  fetchGames();
},[])
  
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[90vh] bg-gradient-to-br from-blue-900 to-blue-700">
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative container mx-auto px-4 h-full flex flex-col justify-center items-center text-white text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Bozz Tips Games</h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl">
            Get in touch with our daily amazing games, we post free predictions, HT/FT games and
            many more, join us now and don't miss out on our next winning
          </p>
          <div className="flex gap-4 flex-col sm:flex-row">
            <Link
              href="/vvip"
              className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-full font-semibold transition-colors"
            >
              JOIN VVIP
            </Link>
            <Link
              href="/telegram"
              className="bg-white text-blue-900 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors"
            >
              Join Telegram Channel
            </Link>
          </div>
        </div>
      </section>

      {/* Predictions Timeline */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          {/* Date Navigation */}
          <div className="flex justify-center space-x-4 mb-8">
            <button className="px-8 py-2 rounded-full border-2 border-blue-500 text-blue-900 hover:bg-blue-500 hover:text-white transition-colors">
              Yesterday
            </button>
            <button className="px-8 py-2 rounded-full border-2 border-blue-500 bg-blue-500 text-white">
              Today
            </button>
            <button className="px-8 py-2 rounded-full border-2 border-blue-500 text-blue-900 hover:bg-blue-500 hover:text-white transition-colors">
              Tomorrow
            </button>
          </div>

          {/* Title */}
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-blue-900">Today's Football Matches Predictions For Thursday, May 1, 2025</h2>
            <p className="text-gray-600">Here are all of our football betting predictions for Thursday, May 1, 2025.</p>
          </div>
          
          {/* Predictions List */}
          <div className="max-w-4xl mx-auto">
            {
            [
              {
                date: "01/05",
                time: "11:30 AM",
                type: "Over/Under",
                team1: "Royal Antwerp FC",
                team2: "RSC Anderlecht",
                prediction: "Under 4.5"
              },
              {
                date: "01/05",
                time: "11:00 AM",
                type: "Double Chance",
                team1: "Henan",
                team2: "Wuhan Three Towns FC",
                prediction: "Home or Draw"
              },
              {
                date: "01/05",
                time: "11:00 AM",
                type: "Over/Under",
                team1: "Zhejiang FC",
                team2: "Changchun Yatai",
                prediction: "Over 2.5"
              },
              {
                date: "01/05",
                time: "11:35 AM",
                type: "Over/Under",
                team1: "Shandong Taishan FC",
                team2: "Qingdao Hainiu FC",
                prediction: "Over 2.5"
              },
              {
                date: "01/05",
                time: "11:35 AM",
                type: "Over/Under",
                team1: "Shanghai Port FC",
                team2: "Beijing Guoan",
                prediction: "Over 2.5"
              }
            ].map((match, index) => (
              <div 
                key={index} 
                className="bg-white border-b border-gray-100 py-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-8">
                  <div className="w-24 text-blue-600">
                    <div className="font-semibold">{match.date}</div>
                    <div className="text-sm">{match.time}</div>
                  </div>
                  <div>
                    <div className="text-gray-500 text-sm mb-1">{match.type}</div>
                    <div className="font-medium text-gray-900">{match.team1} vs {match.team2}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-600">{match.prediction}</span>
                  <div className="w-4 h-4 rounded-full bg-yellow-300"></div>
                </div>
              </div>
            ))}
            
            {/* Unlock More Button */}
            <div className="text-center mt-12">
              <Link
                href="/vvip"
                className="inline-block bg-blue-900 text-white px-12 py-3 uppercase font-semibold hover:bg-blue-800 transition-colors"
              >
                Unlock More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
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

      {/* CTA Section */}
      <section className="py-20 bg-blue-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-8">Join Us Now</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-blue-100">
            Join over 10,000 people who win every single day. Our games are categorized for every aspect including free daily games. Don't miss out on this chance of winning big.
          </p>
          <Link
            href="/vvip"
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
    </div>
  );
}

export default Home;