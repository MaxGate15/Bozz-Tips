import React from 'react';

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (location: 'ghana' | 'not-ghana') => void;
}

const LocationModal: React.FC<LocationModalProps> = ({ isOpen, onClose, onSelect }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full border-2 border-blue-700 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-2xl text-gray-400 hover:text-blue-700 font-bold"
        >
          &times;
        </button>
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 text-blue-700">SELECT YOUR LOCATION</h2>
        <div className="flex gap-6 justify-center">
          <button
            onClick={() => onSelect('ghana')}
            className="bg-gradient-to-r from-blue-700 to-blue-900 text-white font-bold py-3 px-8 rounded-lg shadow hover:from-blue-800 hover:to-blue-950 border border-blue-900 text-lg transition-all"
          >
            IN GHANA
          </button>
          <button
            onClick={() => onSelect('not-ghana')}
            className="bg-gradient-to-r from-blue-700 to-blue-900 text-white font-bold py-3 px-8 rounded-lg shadow hover:from-blue-800 hover:to-blue-950 border border-blue-900 text-lg transition-all"
          >
            NOT IN GHANA
          </button>
        </div>
      </div>
    </div>
  );
};

export default LocationModal; 