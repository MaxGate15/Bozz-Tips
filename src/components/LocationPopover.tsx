import React, { useState, useRef, useEffect } from 'react';
import { getUsername } from '../app/utils/auth';
import router from 'next/router';
import { u } from 'framer-motion/client';

const countries = [
  { country: 'Nigeria', code: 'NGN' },
  { country: 'South Africa', code: 'ZAR' },
  { country: 'Kenya', code: 'KES' },
];

interface LocationPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  anchorRef: React.RefObject<HTMLButtonElement>;
  game_category: string;
  price: number;
}

async function getRate(currencyCode: string): Promise<number> {
  if (currencyCode === 'GHS') return 1;

  const response = await fetch(`https://api.exchangerate.host/latest?base=${currencyCode}&symbols=GHS`);
  const data = await response.json();

  if (!data || !data.rates || !data.rates.GHS) {
    throw new Error('Failed to fetch exchange rate');
  }

  return data.rates.GHS;
}


const LocationPopover: React.FC<LocationPopoverProps> = ({ isOpen, onClose, anchorRef,game_category,price }) => {
  const [step, setStep] = useState<'location' | 'country'>('location');
  const [selectedLocation, setSelectedLocation] = useState<'ghana' | 'not-ghana' | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [position, setPosition] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
  const popoverRef = useRef<HTMLDivElement>(null);
  const [username, setUsername] = useState<string>('');
  useEffect(() => {
    setUsername(getUsername() || '');
  }
  , []);
  

  useEffect(() => {
    if (isOpen && anchorRef.current) {
      const rect = anchorRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + window.scrollY + 8,
        left: rect.left + window.scrollX,
      });
    }
  }, [isOpen, anchorRef]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node) &&
        anchorRef.current &&
        !anchorRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose, anchorRef]);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://js.paystack.co/v1/inline.js';
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handlePayWithPaystack = async (currencyCode: string) => {
    // Check if user is logged in
    if (!username) {
      window.location.href = '/login';
      return;
    }
    try {
     const rate = await getRate('USD'); // e.g., 1 USD = 15.25 GHS


      const isNotGhana = selectedLocation === 'not-ghana';
      const handler = (window as any).PaystackPop.setup({
        key: 'pk_live_7b78cc04196ecfe3ae0a964af06d18540f4bd4d5',
        username: username,
        
        amount: price*rate,
        currency: currencyCode,
        ref: '' + Math.floor(Math.random() * 1000000000 + 1),
        metadata: {
          custom_fields: [
            {
              display_name: { username },
              variable_name: 'location',
              game_category: game_category,
              value: selectedCountry || (selectedLocation === 'ghana' ? 'Ghana' : ''),
            },
          ],
        },
        ...(isNotGhana && { payment_channels: ['card'] }), // Only allow card if not in Ghana
        callback: function (response: any) {
          router.push('/vvip/games')
          alert('Payment successful! Reference: ' + response.reference);
          
          onClose();
        },
        onClose: function () {
          alert('Payment cancelled');
        },
      });

      handler.openIframe();
    } catch (error) {
      alert('Error initializing payment: ' + error);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      ref={popoverRef}
      style={{ position: 'absolute', top: position.top, left: position.left, zIndex: 10000 }}
      className="bg-white rounded-xl shadow-lg p-6 w-80 border-2 border-blue-700"
    >
      <button
        onClick={onClose}
        className="absolute top-2 right-3 text-2xl text-gray-400 hover:text-blue-700 font-bold"
      >
        &times;
      </button>

      {step === 'location' && (
        <>
          <h2 className="text-xl font-bold text-center mb-6 text-blue-700">SELECT YOUR LOCATION</h2>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => {
                setSelectedLocation('ghana');
                handlePayWithPaystack('GHS'); // explicitly using GHS
              }}
              className="bg-gradient-to-r from-blue-700 to-blue-900 text-white font-bold py-2 px-6 rounded-lg shadow hover:from-blue-800 hover:to-blue-950 border border-blue-900 text-base transition-all"
            >
              IN GHANA
            </button>
            <button
              onClick={() => {
                setSelectedLocation('not-ghana');
                setStep('country');
              }}
              className="bg-gradient-to-r from-blue-700 to-blue-900 text-white font-bold py-2 px-6 rounded-lg shadow hover:from-blue-800 hover:to-blue-950 border border-blue-900 text-base transition-all"
            >
              NOT IN GHANA
            </button>
          </div>
        </>
      )}

      {step === 'country' && (
        <>
          <h2 className="text-xl font-bold text-center mb-6 text-blue-700">SELECT YOUR COUNTRY</h2>
          <select
            className="w-full p-2 border border-blue-300 rounded mb-4"
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
          >
            <option value="">-- Select Country --</option>
            {countries.map((country) => (
              <option key={country.country} value={country.code}>
                {country.country}
              </option>
            ))}
          </select>
          <button
            className="w-full bg-blue-700 text-white py-2 rounded font-semibold hover:bg-blue-900 disabled:opacity-50"
            disabled={!selectedCountry}
            onClick={() => handlePayWithPaystack(selectedCountry)}
          >
            Continue to Payment
          </button>
        </>
      )}
    </div>
  );
};

export default LocationPopover;
