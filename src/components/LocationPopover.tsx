import React, { useState, useRef, useEffect } from 'react';

const countries = [
  'Nigeria', 'United States', 'United Kingdom', 'Canada', 'South Africa', 'Kenya', 'Germany', 'France', 'India', 'China', 'Brazil', 'Australia', 'Italy', 'Spain', 'Russia', 'Japan', 'Turkey', 'Egypt', 'Ghana', 'Cameroon', 'Ivory Coast', 'Senegal', 'Morocco', 'Netherlands', 'Sweden', 'Norway', 'Finland', 'Denmark', 'Poland', 'Mexico', 'Argentina', 'Chile', 'Colombia', 'Peru', 'Saudi Arabia', 'UAE', 'Qatar', 'Ukraine', 'Romania', 'Greece', 'Switzerland', 'Belgium', 'Austria', 'Portugal', 'Czech Republic', 'Hungary', 'Israel', 'Singapore', 'Malaysia', 'Indonesia', 'Thailand', 'Vietnam', 'Philippines', 'South Korea', 'New Zealand', 'Ireland', 'Bangladesh', 'Pakistan', 'Sri Lanka', 'Zimbabwe', 'Zambia', 'Uganda', 'Tanzania', 'Ethiopia', 'Algeria', 'Tunisia', 'Libya', 'Sudan', 'Angola', 'Mozambique', 'Botswana', 'Namibia', 'Malawi', 'Burkina Faso', 'Mali', 'Niger', 'Chad', 'Benin', 'Togo', 'Sierra Leone', 'Liberia', 'Guinea', 'Gabon', 'Congo', 'DR Congo', 'Central African Republic', 'Somalia', 'Madagascar', 'Mauritius', 'Seychelles', 'Comoros', 'Lesotho', 'Swaziland', 'Morocco', 'Albania', 'Bulgaria', 'Croatia', 'Slovakia', 'Slovenia', 'Estonia', 'Latvia', 'Lithuania', 'Belarus', 'Georgia', 'Armenia', 'Azerbaijan', 'Kazakhstan', 'Uzbekistan', 'Kyrgyzstan', 'Tajikistan', 'Turkmenistan', 'Mongolia', 'Nepal', 'Afghanistan', 'Iraq', 'Iran', 'Syria', 'Jordan', 'Lebanon', 'Palestine', 'Yemen', 'Oman', 'Kuwait', 'Bahrain', 'Malta', 'Cyprus', 'Iceland', 'Luxembourg', 'Liechtenstein', 'Monaco', 'San Marino', 'Vatican City', 'Andorra', 'Montenegro', 'Serbia', 'North Macedonia', 'Bosnia and Herzegovina', 'Moldova', 'Paraguay', 'Uruguay', 'Bolivia', 'Ecuador', 'Venezuela', 'Costa Rica', 'Panama', 'Guatemala', 'Honduras', 'El Salvador', 'Nicaragua', 'Cuba', 'Dominican Republic', 'Haiti', 'Jamaica', 'Trinidad and Tobago', 'Barbados', 'Bahamas', 'Belize', 'Guyana', 'Suriname', 'Fiji', 'Papua New Guinea', 'Samoa', 'Tonga', 'Vanuatu', 'Solomon Islands', 'Micronesia', 'Palau', 'Marshall Islands', 'Kiribati', 'Tuvalu', 'Nauru', 'East Timor', 'Brunei', 'Cambodia', 'Laos', 'Myanmar', 'North Korea', 'Taiwan', 'Hong Kong', 'Macau', 'Greenland', 'Antigua and Barbuda', 'Saint Kitts and Nevis', 'Saint Lucia', 'Saint Vincent and the Grenadines', 'Grenada', 'Dominica', 'Saint Pierre and Miquelon', 'Bermuda', 'Cayman Islands', 'Turks and Caicos Islands', 'British Virgin Islands', 'Anguilla', 'Montserrat', 'Aruba', 'Curacao', 'Sint Maarten', 'Bonaire', 'Saba', 'Sint Eustatius', 'Saint Barthelemy', 'Saint Martin', 'Guadeloupe', 'Martinique', 'French Guiana', 'Reunion', 'Mayotte', 'New Caledonia', 'French Polynesia', 'Wallis and Futuna', 'Saint Helena', 'Ascension Island', 'Tristan da Cunha', 'Falkland Islands', 'South Georgia and the South Sandwich Islands', 'Gibraltar', 'Isle of Man', 'Jersey', 'Guernsey', 'Faroe Islands', 'Aland Islands', 'Svalbard and Jan Mayen', 'Western Sahara', 'Kosovo', 'South Sudan', 'Eritrea', 'Djibouti', 'Somaliland', 'Bouvet Island', 'Heard Island and McDonald Islands', 'Norfolk Island', 'Pitcairn Islands', 'Saint Helena, Ascension and Tristan da Cunha', 'British Indian Ocean Territory', 'Cocos (Keeling) Islands', 'Christmas Island', 'Niue', 'Tokelau', 'Cook Islands', 'French Southern and Antarctic Lands', 'Antarctica'
];

interface LocationPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  anchorRef: React.RefObject<HTMLButtonElement>;
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
              <button className="bg-blue-700 text-white py-2 rounded hover:bg-blue-900 font-semibold">Mobile Money</button>
              <button className="bg-blue-700 text-white py-2 rounded hover:bg-blue-900 font-semibold">Card Payment</button>
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
              <option key={country} value={country}>{country}</option>
            ))}
          </select>
          <button
            className="w-full bg-blue-700 text-white py-2 rounded font-semibold hover:bg-blue-900 disabled:opacity-50"
            disabled={!selectedCountry}
            onClick={() => {
              // Placeholder for Paystack redirect
              alert(`Selected country: ${selectedCountry}. Implement Paystack payment here.`);
              onClose();
            }}
          >
            Continue to Payment
          </button>
        </>
      )}
    </div>
  );
};

export default LocationPopover; 