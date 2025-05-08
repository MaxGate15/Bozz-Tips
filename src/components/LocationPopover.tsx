import React, { useState, useRef, useEffect } from 'react';

interface LocationPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  anchorRef: React.RefObject<HTMLButtonElement>;
}

const LocationPopover: React.FC<LocationPopoverProps> = ({ isOpen, onClose, anchorRef }) => {
  const [step, setStep] = useState<'location' | 'payment'>('location');
  const [selectedLocation, setSelectedLocation] = useState<'ghana' | 'not-ghana' | null>(null);
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
    const script = document.createElement('script');
    script.src = 'https://js.paystack.co/v1/inline.js';
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);
  
  const handlePayWithPaystack = () => {
    const handler = (window as any).PaystackPop.setup({
      key: 'your-public-key-here', // replace with your Paystack public key
      email: 'user@example.com',   // ideally from form or user state
      amount: 5000 * 100,          // amount in kobo (₦5,000)
      currency: 'NGN',
      ref: '' + Math.floor(Math.random() * 1000000000 + 1),
      metadata: {
        custom_fields: [
          {
            display_name: "Location",
            variable_name: "location",
            value: selectedLocation,
          },
        ],
      },
      callback: function (response: any) {
        alert('Payment successful! Reference: ' + response.reference);
        // Optionally: send reference to your backend for verification
        onClose();
      },
      onClose: function () {
        alert('Payment cancelled');
      },
    });
  
    handler.openIframe();
  };
  

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
                setStep('payment');
              }}
              className="bg-gradient-to-r from-blue-700 to-blue-900 text-white font-bold py-2 px-6 rounded-lg shadow hover:from-blue-800 hover:to-blue-950 border border-blue-900 text-base transition-all"
            >
              IN GHANA
            </button>
            <button
              onClick={() => {
                setSelectedLocation('not-ghana');
                setStep('payment');
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
              <button className="bg-blue-700 text-white py-2 rounded hover:bg-blue-900 font-semibold">Mobile Money</button>
              <button className="bg-blue-700 text-white py-2 rounded hover:bg-blue-900 font-semibold" onClick={handlePayWithPaystack}>Card Payment</button>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <button className="bg-blue-700 text-white py-2 rounded hover:bg-blue-900 font-semibold" onClick={handlePayWithPaystack}>Card Payment</button>
              <button className="bg-blue-700 text-white py-2 rounded hover:bg-blue-900 font-semibold">Crypto</button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default LocationPopover; 