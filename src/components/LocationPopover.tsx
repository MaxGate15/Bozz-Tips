import React, { useState, useRef, useEffect } from 'react';

const countries = [
  { country: 'Nigeria', code: 'NGN' },      // ✅ Valid
  { country: 'South Africa', code: 'ZAR' }, // ✅ Valid
  { country: 'Kenya', code: 'KES' }         // ✅ Valid
];


interface LocationPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  anchorRef: React.RefObject<HTMLButtonElement>;
}
async function getRate(currencyCode: string): Promise<number> {
  const res = await fetch(`https://v6.exchangerate-api.com/v6/YOUR_API_KEY/latest/USD`);
  const data = await res.json();
  const rate = data.conversion_rates[currencyCode];
  const amountInLocal = rate * 5; // e.g., 5 USD worth
  return Math.floor(amountInLocal * 100); // Convert to kobo, cents, etc.
}




const LocationPopover: React.FC<LocationPopoverProps> = ({ isOpen, onClose, anchorRef }) => {
  const [step, setStep] = useState<'location' | 'payment' | 'country'>('location');
  const [selectedLocation, setSelectedLocation] = useState<'ghana' | 'not-ghana' | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const popoverRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<{ top: number; left: number }>({ top: 0, left: 0 });

  useEffect(() => {
    if (isOpen && anchorRef.current) {
      const rect = anchorRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + window.scrollY + 8, // 8px below the button
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

  const handlePayWithPaystack = async (paymentType?: string, country?: string ) => {
    const rate = await getRate(country|| 'GHS'); // Must return amount in kobo (or equivalent in smallest unit)
    
    const handler = (window as any).PaystackPop.setup({
      key: 'pk_live_7b78cc04196ecfe3ae0a964af06d18540f4bd4d5',
      email: 'Kofiokolobaah@gmail.com',
      amount: rate, // Already converted in smallest unit
      currency: country,
      ref: '' + Math.floor(Math.random() * 1000000000 + 1),
      metadata: {
        custom_fields: [
          {
            display_name: "Location",
            variable_name: "location",
            value: selectedCountry || (selectedLocation === 'ghana' ? 'Ghana' : ''),
          },
          paymentType ? {
            display_name: "Payment Type",
            variable_name: "payment_type",
            value: paymentType,
          } : null,
        ].filter(Boolean),
      },
      callback: function (response: any) {
        alert('Payment successful! Reference: ' + response.reference);
        onClose();
      },
      onClose: function () {
        alert('Payment cancelled');
      },
    });
  
    handler.openIframe();
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
                handlePayWithPaystack();
                onClose();
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
      {step === 'payment' && (
        <>
          <h2 className="text-xl font-bold text-center mb-6 text-blue-700">PAYMENT METHOD</h2>
          {selectedLocation === 'ghana' ? (
            <div className="flex flex-col gap-3">
              <button className="bg-blue-700 text-white py-2 rounded hover:bg-blue-900 font-semibold" onClick={() => handlePayWithPaystack('Mobile Money')}>Mobile Money</button>
              <button className="bg-blue-700 text-white py-2 rounded hover:bg-blue-900 font-semibold" onClick={() => handlePayWithPaystack('Card Payment')}>Card Payment</button>
            </div>
          ) : null}
        </>
      )}
      {step === 'country' && (
        <>
          <h2 className="text-xl font-bold text-center mb-6 text-blue-700">SELECT YOUR COUNTRY</h2>
          <select
            className="w-full p-2 border border-blue-300 rounded mb-4"
            value={selectedCountry}
            onChange={e => setSelectedCountry(e.target.value)}
          >
            <option value="">-- Select Country --</option>
            {countries.map(country => (
              <option key={country.country} value={country.code}>{country.country}</option>
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