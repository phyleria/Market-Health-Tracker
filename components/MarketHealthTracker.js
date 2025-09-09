"use client";

import React, { useState } from 'react';
import { Mail, MessageSquare, Bell, TrendingUp, Shield, Zap, MapPin, Download } from 'lucide-react';
import { sendNotification } from "../utils/webhook";
import GlobeComponent from './Globe/index';



const MarketHealthTracker = () => {
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedHealthType, setSelectedHealthType] = useState(null);
  const [notificationMethod, setNotificationMethod] = useState('email');
  const [userEmail, setUserEmail] = useState('');
  const [slackWebhook, setSlackWebhook] = useState('');
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");


  // African countries with their ISO codes, display names, and center points for animation
const africanCountries = [
  { name: "Algeria", code: "DZ", iso: "DZA", lat: 28.0339, lon: 1.6596 },
  { name: "Angola", code: "AO", iso: "AGO", lat: -11.2027, lon: 17.8739 },
  { name: "Benin", code: "BJ", iso: "BEN", lat: 9.3077, lon: 2.3158 },
  { name: "Botswana", code: "BW", iso: "BWA", lat: -22.3285, lon: 24.6849 },
  { name: "Burkina Faso", code: "BF", iso: "BFA", lat: 12.2383, lon: -1.5616 },
  { name: "Burundi", code: "BI", iso: "BDI", lat: -3.3731, lon: 29.9189 },
  { name: "Cabo Verde", code: "CV", iso: "CPV", lat: 16.5388, lon: -23.0418 },
  { name: "Cameroon", code: "CM", iso: "CMR", lat: 7.3697, lon: 12.3547 },
  { name: "Central African Republic", code: "CF", iso: "CAF", lat: 6.6111, lon: 20.9394 },
  { name: "Chad", code: "TD", iso: "TCD", lat: 15.4542, lon: 18.7322 },
  { name: "Comoros", code: "KM", iso: "COM", lat: -11.6455, lon: 43.3333 },
  { name: "Republic of Congo", code: "CG", iso: "COG", lat: -0.228, lon: 15.8277 },
  { name: "Democratic Republic of the Congo", code: "CD", iso: "COD", lat: -4.0383, lon: 21.7587 },
  { name: "Djibouti", code: "DJ", iso: "DJI", lat: 11.8251, lon: 42.5903 },
  { name: "Egypt", code: "EG", iso: "EGY", lat: 26.8206, lon: 30.8025 },
  { name: "Equatorial Guinea", code: "GQ", iso: "GNQ", lat: 1.6508, lon: 10.2679 },
  { name: "Eritrea", code: "ER", iso: "ERI", lat: 15.1794, lon: 39.7823 },
  { name: "Eswatini", code: "SZ", iso: "SWZ", lat: -26.5225, lon: 31.4659 },
  { name: "Ethiopia", code: "ET", iso: "ETH", lat: 9.145, lon: 40.4897 },
  { name: "Gabon", code: "GA", iso: "GAB", lat: -0.8037, lon: 11.6094 },
  { name: "Gambia", code: "GM", iso: "GMB", lat: 13.4432, lon: -15.3101 },
  { name: "ghana", code: "GH", iso: "GHA", lat: 7.9465, lon: -1.0232 },
  { name: "Guinea", code: "GN", iso: "GIN", lat: 9.9456, lon: -9.6966 },
  { name: "Guinea-Bissau", code: "GW", iso: "GNB", lat: 11.8037, lon: -15.1804 },
  { name: "Ivory Coast", code: "CI", iso: "CIV", lat: 7.5399, lon: -5.5471 },
  { name: "Kenya", code: "KE", iso: "KEN", lat: -0.0236, lon: 37.9062 },
  { name: "Lesotho", code: "LS", iso: "LSO", lat: -29.61, lon: 28.2336 },
  { name: "Liberia", code: "LR", iso: "LBR", lat: 6.4281, lon: -9.4295 },
  { name: "Libya", code: "LY", iso: "LBY", lat: 26.3351, lon: 17.2283 },
  { name: "Madagascar", code: "MG", iso: "MDG", lat: -18.7669, lon: 46.8691 },
  { name: "Malawi", code: "MW", iso: "MWI", lat: -13.2543, lon: 34.3015 },
  { name: "Mali", code: "ML", iso: "MLI", lat: 17.5707, lon: -3.9962 },
  { name: "Mauritania", code: "MR", iso: "MRT", lat: 21.0079, lon: -10.9408 },
  { name: "Mauritius", code: "MU", iso: "MUS", lat: -20.3484, lon: 57.5522 },
  { name: "Morocco", code: "MA", iso: "MAR", lat: 31.7917, lon: -7.0926 },
  { name: "Mozambique", code: "MZ", iso: "MOZ", lat: -18.6657, lon: 35.5296 },
  { name: "Namibia", code: "NA", iso: "NAM", lat: -22.9576, lon: 18.4904 },
  { name: "Niger", code: "NE", iso: "NER", lat: 17.6078, lon: 8.0817 },
  { name: "Nigeria", code: "NG", iso: "NGA", lat: 9.082, lon: 8.675 },
  { name: "Rwanda", code: "RW", iso: "RWA", lat: -1.9403, lon: 29.8739 },
  { name: "Sao Tome and Principe", code: "ST", iso: "STP", lat: 0.1864, lon: 6.6131 },
  { name: "Senegal", code: "SN", iso: "SEN", lat: 14.4974, lon: -14.4524 },
  { name: "Seychelles", code: "SC", iso: "SYC", lat: -4.6796, lon: 55.4915 },
  { name: "Sierra Leone", code: "SL", iso: "SLE", lat: 8.4606, lon: -11.7799 },
  { name: "Somalia", code: "SO", iso: "SOM", lat: 5.1521, lon: 46.1996 },
  { name: "South Africa", code: "ZA", iso: "ZAF", lat: -30.5595, lon: 22.9375 },
  { name: "South Sudan", code: "SS", iso: "SSD", lat: 6.877, lon: 31.307 },
  { name: "Sudan", code: "SD", iso: "SDN", lat: 12.8628, lon: 30.2176 },
  { name: "United Republic of Tanzania", code: "TZ", iso: "TZA", lat: -6.369, lon: 34.8888 },
  { name: "Togo", code: "TG", iso: "TGO", lat: 8.6195, lon: 0.8248 },
  { name: "Tunisia", code: "TN", iso: "TUN", lat: 33.8869, lon: 9.5375 },
  { name: "Uganda", code: "UG", iso: "UGA", lat: 1.3733, lon: 32.2903 },
  { name: "Zambia", code: "ZM", iso: "ZMB", lat: -13.1339, lon: 27.8493 },
  { name: "Zimbabwe", code: "ZW", iso: "ZWE", lat: -19.0154, lon: 29.1549 },
];


  const healthTypes = [
    {
      id: 'regulation',
      title: 'Regulation & Compliance',
      icon: Shield,
      description: 'Legal framework, business registration, tax policies, and regulatory environment',
      color: 'bg-green-50 border-green-200 text-green-800'
    },
    {
      id: 'infrastructure',
      title: 'Infrastructure Health',
      icon: Zap,
      description: 'Digital infrastructure, transportation, energy, and telecommunications',
      color: 'bg-green-50 border-green-200 text-green-800'
    },
    {
      id: 'economic',
      title: 'Economic Health',
      icon: TrendingUp,
      description: 'GDP growth, inflation, currency stability, and market conditions',
      color: 'bg-green-50 border-green-200 text-green-800'
    }
  ];

  // Create benefitsList for the globe component
  const benefitsList = [
    // You'll need to structure this based on your original GlobeComponent's expected format
    // This is a placeholder - adjust based on your actual data structure
    {
      country: 'Nigeria',
      assets: {
        'Purchases of': ['Mobile Money', 'Digital Banking', 'E-commerce'],
        'Deposit to': ['Local Banks', 'Mobile Wallets']
      }
    },
  ];

  const handleCountryClick = (countryName) => {
  const country = africanCountries.find(
    (c) =>
      c.name.toLowerCase() === countryName.toLowerCase() ||
      c.code.toLowerCase() === countryName.toLowerCase() ||
      c.iso.toLowerCase() === countryName.toLowerCase()
  );

  if (country) {
    setSelectedCountry(country); // ✅ this shows "Selected Kenya"
  }
};



  const handleHealthTypeSelect = (healthType) => {
    setSelectedHealthType(healthType);
    setStep(3);
  };

   const handleSubmit = async (e) => {
  e.preventDefault();

  const email = userEmail;
  const country = selectedCountry?.name?.toLowerCase(); // e.g. "ghana"
  const sector = selectedHealthType?.id; // e.g. "regulation"

  console.log("🚀 handleSubmit fired");
  console.log("📩 Sending data:", { email, country, sector });

  try {
    const response = await fetch("/api/webhook", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        notificationType: "email",
        email,
        country,
        sector,
      }),
    });

    console.log("🔎 Raw response:", response);

    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }

    const result = await response.text();
    console.log("✅ Success:", result);
    alert("Data successfully sent to webhook!");
  } catch (err) {
    console.error("❌ Error sending data:", err);
    alert("Error: " + err.message);
  }
};

  const resetFlow = () => {
    setSelectedCountry(null);
    setSelectedHealthType(null);
    setStep(1);
  };

const GlobeWrapper = () => {
  return (
    <div className="relative w-full aspect-square md:max-w-[600px] mx-auto">
      <div className="w-full h-full flex items-center justify-center">
        <GlobeComponent 
          benefitsList={benefitsList}
          onCountrySelect={handleCountryClick}
          selectedCountry={selectedCountry}
        />
      </div>
      
      {/* Instructions (only show when no country is selected) */}
      {!selectedCountry && (
        <div className="absolute bottom-0.2 left-1/2 transform -translate-x-1/2 text-white text-xs text-center opacity-80 bg-black bg-opacity-50 px-3 py-1 rounded">
          Click on Africa to select a country
        </div>
      )}
      
      {/* Selected country indicator */}
      {selectedCountry && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 pointer-events-none z-10">
          <div className="bg-green-500 bg-opacity-90 text-white text-sm px-4 py-2 rounded-lg font-medium shadow-lg">
            Selected: {selectedCountry.name}
          </div>
        </div>
      )}
    </div>
  );
};

  return (
    
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Fixed Header */}
      <div className="bg-white shadow-sm border-b">
  <div className="w-full px-8 sm:px-12 lg:px-16">
    <div className="flex justify-between items-center py-6">
      <h1 className="text-3xl font-bold text-gray-900">Africa Market Health Tracker</h1>
      <div className="flex items-center space-x-2 text-sm text-gray-500">
        <Bell className="w-4 h-4" />
        <span>Stay updated on market changes</span>
      </div>
    </div>
  </div>
</div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            {[1, 2, 3].map((stepNum) => (
              <div key={stepNum} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                  stepNum === step ? 'bg-orange-500 text-white' :
                  stepNum < step ? 'bg-gray-500 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  {stepNum}
                </div>
                {stepNum < 3 && (
                  <div className={`w-16 h-1 mx-2 ${stepNum < step ? 'bg-gray-500' : 'bg-gray-200'}`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-4 text-sm text-gray-600">
            <div className="text-center">
              Step {step}: {step === 1 ? 'Select Country' : step === 2 ? 'Choose Health Metric' : 'Configure Notifications'}
            </div>
          </div>
        </div>

        {/* Step 1: Country Selection */}
        {step === 1 && (
          <div className="bg-white rounded-lg shadow-lg p-9">
            <div className="text-center mb-0.5">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Select an African Market</h2>
            </div>

            <div className="mb-4">
              <GlobeWrapper />
              {/* {selectedCountry && (
                <div className="text-center mt-4">
                  <div className="inline-block bg-grey-100 text-blue-800 px-4 py-2 rounded-full">
                    Selected: {selectedCountry.name}
                  </div>
                </div>
              )} */}
            </div>

            {/* Continue Button */}
            {selectedCountry && (
              <div className="text-center mt-6">
                <button
                  onClick={() => setStep(2)}
                  className="px-8 py-3 bg-green-500 text-white rounded-lg hover:bg-stone-400 transition-colors font-medium"
                >
                  Continue with {selectedCountry.name} →
                </button>
              </div>
            )}
          </div>
        )}

        {/* Step 2: Health Type Selection */}
        {step === 2 && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Choose Health Metric for {selectedCountry?.name}
              </h2>
              <p className="text-gray-600">Select which aspect of market health you want to analyze</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {healthTypes.map((type) => {
                const IconComponent = type.icon;
                return (
                  <button
                    key={type.id}
                    onClick={() => handleHealthTypeSelect(type)}
                    className={`p-6 rounded-lg border-2 text-left transition-all hover:shadow-lg ${
                      selectedHealthType?.id === type.id
                        ? type.color
                        : 'bg-white border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center mb-4">
                      <IconComponent className="w-8 h-8 mr-3" />
                      <h3 className="text-lg font-semibold">{type.title}</h3>
                    </div>
                    <p className="text-sm text-gray-600">{type.description}</p>
                  </button>
                );
              })}
            </div>

            <div className="flex justify-between mt-8">
              <button
                onClick={resetFlow}
                className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                ← Back to country selection
              </button>
              {selectedHealthType && (
                <button
                  onClick={() => setStep(3)}
                  className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-stone-400 transition-colors font-medium"
                >
                  Continue to Notifications →
                </button>
              )}
            </div>
          </div>
        )}

        {/* Step 3: Notification Setup */}
        {step === 3 && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Configure Notifications</h2>
              <p className="text-gray-600">
                Get updates on {selectedHealthType?.title.toLowerCase()} for {selectedCountry?.name}
              </p>
            </div>

            <div className="max-w-md mx-auto">
              {/* Notification Method Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  How would you like to receive updates?
                </label>
                <div className="space-y-3">
                  <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      value="email"
                      checked={notificationMethod === 'email'}
                      onChange={(e) => setNotificationMethod(e.target.value)}
                      className="mr-3"
                    />
                    <Mail className="w-5 h-5 mr-2 text-gray-600" />
                    <span>Email notifications</span>
                  </label>
                  <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      value="slack"
                      checked={notificationMethod === 'slack'}
                      onChange={(e) => setNotificationMethod(e.target.value)}
                      className="mr-3"
                    />
                    <MessageSquare className="w-5 h-5 mr-2 text-gray-600" />
                    <span>Slack notifications</span>
                  </label>
                </div>
              </div>

              {/* Email Input */}
              {notificationMethod === 'email' && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    placeholder="your.email@company.com"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              )}

              {/* Slack Input */}
              {notificationMethod === 'slack' && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Slack Webhook URL
                  </label>
                  <input
                    type="url"
                    value={slackWebhook}
                    onChange={(e) => setSlackWebhook(e.target.value)}
                    placeholder="https://hooks.slack.com/services/..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Get your webhook URL from your Slack workspace settings
                  </p>
                </div>
              )}

              {/* Summary */}
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <h4 className="font-medium text-gray-900 mb-2">Summary</h4>
                <div className="space-y-1 text-sm text-gray-600">
                  <div><strong>Country:</strong> {selectedCountry?.name}</div>
                  <div><strong>Health Metric:</strong> {selectedHealthType?.title}</div>
                  <div><strong>Notifications:</strong> {notificationMethod}</div>
                </div>
              </div>

              <div className="flex justify-between">
                <button
                  onClick={() => setStep(2)}
                  className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  ← Back to health metrics
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={
                    (notificationMethod === 'email' && !userEmail) ||
                    (notificationMethod === 'slack' && !slackWebhook)
                  }
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Start Tracking
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MarketHealthTracker;