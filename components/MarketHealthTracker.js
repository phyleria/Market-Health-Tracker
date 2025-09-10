"use client";

import React, { useState } from 'react';
import { Mail, MessageSquare, Bell, TrendingUp, Shield, Zap, MapPin, Download, FileText, CheckCircle } from 'lucide-react';
import { sendNotification } from "../utils/webhook";
import GlobeComponent from './Globe/index';

const MarketHealthTracker = () => {
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedHealthType, setSelectedHealthType] = useState(null);
  const [notificationMethod, setNotificationMethod] = useState('email');
  const [userEmail, setUserEmail] = useState('');
  const [slackWebhook, setSlackWebhook] = useState('');
  const [weeklyUpdates, setWeeklyUpdates] = useState(false);
  const [step, setStep] = useState(1);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
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
    { name: "Comoirs", code: "KM", iso: "COM", lat: -11.6455, lon: 43.3333 },
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
      setSelectedCountry(country);
    }
  };

  const handleHealthTypeSelect = (healthType) => {
    setSelectedHealthType(healthType);
    setStep(3);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const email = userEmail;
    const country = selectedCountry?.name?.toLowerCase();
    const sector = selectedHealthType?.id;

    console.log("🚀 handleSubmit fired");
    console.log("📩 Sending data:", { email, country, sector, weeklyUpdates });

    try {
      const response = await fetch("/api/webhook", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          notificationType: notificationMethod,
          email: notificationMethod === 'email' ? email : null,
          slackWebhook: notificationMethod === 'slack' ? slackWebhook : null,
          country,
          sector,
          weeklyUpdates,
        }),
      });

      console.log("🔎 Raw response:", response);

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const result = await response.text();
      console.log("✅ Success:", result);
      
      setPopupMessage(`Report generated successfully! Check your ${notificationMethod} for the report.`);
      setShowSuccessPopup(true);
      
    } catch (err) {
      console.error("❌ Error sending data:", err);
      
      setPopupMessage(`Error: ${err.message}`);
      setShowSuccessPopup(true);
    }
  };

  const resetFlow = () => {
    setSelectedCountry(null);
    setSelectedHealthType(null);
    setWeeklyUpdates(false);
    setUserEmail('');
    setSlackWebhook('');
    setStep(1);
  };

  const SuccessPopup = () => {
    if (!showSuccessPopup) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4">
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-t-2xl p-6 text-center">
            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Success!</h3>
          </div>
          <div className="p-8">
            <p className="text-gray-600 text-lg leading-relaxed mb-6">
              {popupMessage}
            </p>
            <button
              onClick={() => setShowSuccessPopup(false)}
              className="w-full px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-200"
            >
              Got it!
            </button>
          </div>
        </div>
      </div>
    );
  };

  const GlobeWrapper = () => {
    return (
      <div className="relative w-full aspect-square md:max-w-[490px] mx-auto">
        <div className="w-full h-full flex items-center justify-center">
          <GlobeComponent 
            benefitsList={benefitsList}
            onCountrySelect={handleCountryClick}
            selectedCountry={selectedCountry}
          />
        </div>
        
        {!selectedCountry && (
<div className="hidden md:block absolute bottom-1 left-1/2 transform -translate-x-1/2 text-white text-xs text-center opacity-80 bg-black bg-opacity-50 px-2 py-0.5 rounded">            Click on Africa to select a country
          </div>
        )}
        
        {selectedCountry && (
          <div className="absolute top-2 left-1/2 transform -translate-x-1/2 -translate-y-1/6 pointer-events-none z-10">
            <div className="hidden md:block bg-green-500 bg-opacity-90 text-white text-sm px-3 py-1 rounded-lg font-small shadow-lg">
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
            <h1 className="text-2xl font-bold text-gray-900">Africa Market Health Tracker</h1>
            <div className="hidden md:flex items-center space-x-2 text-sm text-gray-500">
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
              Step {step}: {step === 1 ? 'Select Country' : step === 2 ? 'Choose Health Metric' : 'Report Generation'}
            </div>
          </div>
        </div>

        {/* Step 1: Country Selection */}
        {step === 1 && (
          <div className="bg-white rounded-lg shadow-lg p-9">
            <div className="text-center mb-1">
              <h2 className="text-1xl font-bold text-gray-900 mb-2">Select an African Market</h2>
            </div>

            <div className="mb-2">
              <GlobeWrapper />
            </div>

            {selectedCountry && (
              <div className="text-center mt-6">
                <button
                  onClick={() => setStep(2)}
                  className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-stone-400 transition-colors font-small"
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

        {/* Step 3: Report & Updates Configuration */}
        {step === 3 && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Configure Report & Updates</h2>
              <p className="text-gray-600">Set up your report delivery and optional weekly updates</p>
            </div>

            <div className="max-w-2xl mx-auto">
              {/* Report Generation Info */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl mb-8 border border-blue-200">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 mt-1">
                    <FileText className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-blue-900 mb-2">Report Generation</h4>
                    <p className="text-blue-700 leading-relaxed">
                      Generate your comprehensive {selectedHealthType?.title.toLowerCase()} report for {selectedCountry?.name}
                    </p>
                  </div>
                </div>
              </div>

              {/* Form Container */}
              <div className="space-y-8">
                {/* Notification Method Selection */}
                <div>
                  <label className="block text-lg font-semibold text-gray-800 mb-4">
                    Where would you like to receive your report?
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <label className={`relative flex items-center p-5 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                      notificationMethod === 'email' 
                        ? 'border-blue-500 bg-blue-50 shadow-md' 
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}>
                      <input
                        type="radio"
                        value="email"
                        checked={notificationMethod === 'email'}
                        onChange={(e) => setNotificationMethod(e.target.value)}
                        className="sr-only"
                      />
                      <div className="flex items-center space-x-4">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          notificationMethod === 'email' 
                            ? 'border-blue-500 bg-blue-500' 
                            : 'border-gray-300'
                        }`}>
                          {notificationMethod === 'email' && (
                            <div className="w-2 h-2 rounded-full bg-white"></div>
                          )}
                        </div>
                        <Mail className="w-6 h-6 text-gray-600" />
                        <span className="font-medium text-gray-900">Via Email</span>
                      </div>
                    </label>
                    
                    <label className={`relative flex items-center p-5 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                      notificationMethod === 'slack' 
                        ? 'border-blue-500 bg-blue-50 shadow-md' 
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}>
                      <input
                        type="radio"
                        value="slack"
                        checked={notificationMethod === 'slack'}
                        onChange={(e) => setNotificationMethod(e.target.value)}
                        className="sr-only"
                      />
                      <div className="flex items-center space-x-4">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          notificationMethod === 'slack' 
                            ? 'border-blue-500 bg-blue-500' 
                            : 'border-gray-300'
                        }`}>
                          {notificationMethod === 'slack' && (
                            <div className="w-2 h-2 rounded-full bg-white"></div>
                          )}
                        </div>
                        <MessageSquare className="w-6 h-6 text-gray-600" />
                        <span className="font-medium text-gray-900">Via Slack</span>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Email Input */}
                {notificationMethod === 'email' && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={userEmail}
                      onChange={(e) => setUserEmail(e.target.value)}
                      placeholder="your.email@company.com"
                      className="w-full px-4 py-4 text-lg border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      required
                    />
                  </div>
                )}

                {/* Slack Input */}
                {notificationMethod === 'slack' && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Slack Webhook URL
                    </label>
                    <input
                      type="url"
                      value={slackWebhook}
                      onChange={(e) => setSlackWebhook(e.target.value)}
                      placeholder="https://hooks.slack.com/services/..."
                      className="w-full px-4 py-4 text-lg border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      required
                    />
                    <p className="text-sm text-gray-500 mt-2 ml-1">
                      Get your webhook URL from your Slack workspace settings
                    </p>
                  </div>
                )}

                {/* Weekly Updates Checkbox */}
                <div className="border-t pt-6">
                  <label className={`flex items-start space-x-4 p-6 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                    weeklyUpdates 
                      ? 'border-green-500 bg-green-50 shadow-md' 
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}>
                    <div className="flex-shrink-0 mt-1">
                      <div className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${
                        weeklyUpdates 
                          ? 'border-green-500 bg-green-500' 
                          : 'border-gray-300'
                      }`}>
                        {weeklyUpdates && (
                          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      <input
                        type="checkbox"
                        checked={weeklyUpdates}
                        onChange={(e) => setWeeklyUpdates(e.target.checked)}
                        className="sr-only"
                      />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 mb-2">
                        Subscribe to weekly market change updates
                      </div>
                      <div className="text-sm text-gray-600 leading-relaxed">
                        Stay informed with weekly insights on market developments and regulatory changes
                      </div>
                    </div>
                  </label>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-between items-center pt-6">
                  <button
                    onClick={() => setStep(2)}
                    className="px-6 py-3 text-gray-600 hover:text-gray-800 transition-colors font-medium order-2 sm:order-1"
                  >
                    ← Back to health metrics
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={
                      (notificationMethod === 'email' && !userEmail) ||
                      (notificationMethod === 'slack' && !slackWebhook)
                    }
                    className="px-10 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-lg font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-200 flex items-center shadow-lg hover:shadow-xl order-1 sm:order-2"
                  >
                    <FileText className="w-5 h-5 mr-3" />
                    Generate Report
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Success Popup */}
      <SuccessPopup />
    </div>
  );
};

export default MarketHealthTracker;