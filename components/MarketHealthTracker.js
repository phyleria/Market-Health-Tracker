import React, { useState } from 'react';
import { Mail, MessageSquare, Bell, TrendingUp, Shield, Zap, MapPin, Download } from 'lucide-react';

const MarketHealthTracker = () => {
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedHealthType, setSelectedHealthType] = useState(null);
  const [notificationMethod, setNotificationMethod] = useState('email');
  const [userEmail, setUserEmail] = useState('');
  const [slackWebhook, setSlackWebhook] = useState('');
  const [step, setStep] = useState(1);

  // African countries with approximate SVG coordinates (you'd want more precise ones)
  const africanCountries = [
    { name: 'Nigeria', code: 'NG', x: 48, y: 45 },
    { name: 'Kenya', code: 'KE', x: 62, y: 58 },
    { name: 'South Africa', code: 'ZA', x: 55, y: 85 },
    { name: 'Ghana', code: 'GH', x: 42, y: 48 },
    { name: 'Egypt', code: 'EG', x: 55, y: 25 },
    { name: 'Morocco', code: 'MA', x: 43, y: 22 },
    { name: 'Ethiopia', code: 'ET', x: 62, y: 52 },
    { name: 'Tanzania', code: 'TZ', x: 60, y: 62 },
    { name: 'Uganda', code: 'UG', x: 58, y: 58 },
    { name: 'Rwanda', code: 'RW', x: 57, y: 60 },
    { name: 'Senegal', code: 'SN', x: 38, y: 42 },
    { name: 'Ivory Coast', code: 'CI', x: 41, y: 48 },
    { name: 'Angola', code: 'AO', x: 52, y: 72 },
    { name: 'Zambia', code: 'ZM', x: 55, y: 72 },
    { name: 'Botswana', code: 'BW', x: 55, y: 78 },
  ];

  const healthTypes = [
    {
      id: 'regulation',
      title: 'Regulation & Compliance',
      icon: Shield,
      description: 'Legal framework, business registration, tax policies, and regulatory environment',
      color: 'bg-blue-50 border-blue-200 text-blue-800'
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
      color: 'bg-purple-50 border-purple-200 text-purple-800'
    }
  ];

  const handleCountryClick = (country) => {
    setSelectedCountry(country);
    setStep(2);
  };

  const handleHealthTypeSelect = (healthType) => {
    setSelectedHealthType(healthType);
    setStep(3);
  };

  const handleSubmit = () => {
    // Here you would typically send the request to your backend/n8n
    const requestData = {
      country: selectedCountry,
      healthType: selectedHealthType,
      notificationMethod,
      email: notificationMethod === 'email' ? userEmail : null,
      slackWebhook: notificationMethod === 'slack' ? slackWebhook : null
    };
    
    console.log('Submitting request:', requestData);
    // Reset to show success or integrate with your backend
    alert('Request submitted successfully! You will receive updates via ' + notificationMethod);
  };

  const resetFlow = () => {
    setSelectedCountry(null);
    setSelectedHealthType(null);
    setStep(1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Africa Market Health Tracker</h1>
              <p className="text-gray-600 mt-1">Real-time insights for VCs and founders investing in African markets</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Bell className="w-4 h-4" />
                <span>Stay updated on market changes</span>
              </div>
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
                  stepNum === step ? 'bg-blue-600 text-white' :
                  stepNum < step ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  {stepNum}
                </div>
                {stepNum < 3 && (
                  <div className={`w-16 h-1 mx-2 ${stepNum < step ? 'bg-green-500' : 'bg-gray-200'}`} />
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
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Select an African Market</h2>
              <p className="text-gray-600">Click on any country to analyze its market health</p>
            </div>
            
            <div className="flex justify-center">
              <div className="relative">
                {/* Simplified Africa SVG Map */}
                <svg viewBox="0 0 100 100" className="w-96 h-96 border border-gray-200 rounded-lg">
                  {/* Africa continent outline (simplified) */}
                  <path
                    d="M20,15 Q30,10 45,12 Q60,15 75,20 Q85,25 85,35 Q83,50 80,65 Q75,80 65,85 Q50,90 35,85 Q20,80 15,65 Q12,50 15,35 Q17,25 20,15 Z"
                    fill="#f8fafc"
                    stroke="#e2e8f0"
                    strokeWidth="0.5"
                  />
                  
                  {/* Country markers */}
                  {africanCountries.map((country) => (
                    <g key={country.code}>
                      <circle
                        cx={country.x}
                        cy={country.y}
                        r="2"
                        fill={selectedCountry?.code === country.code ? "#2563eb" : "#6b7280"}
                        stroke="white"
                        strokeWidth="0.5"
                        className="cursor-pointer hover:fill-blue-500 transition-colors"
                        onClick={() => handleCountryClick(country)}
                      />
                      <text
                        x={country.x}
                        y={country.y - 3}
                        textAnchor="middle"
                        className="text-xs fill-gray-700 pointer-events-none"
                        fontSize="3"
                      >
                        {country.code}
                      </text>
                    </g>
                  ))}
                </svg>
              </div>
            </div>

            {/* Country Grid as Alternative */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">Or select from the list:</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                {africanCountries.map((country) => (
                  <button
                    key={country.code}
                    onClick={() => handleCountryClick(country)}
                    className={`p-3 rounded-lg border text-center transition-all hover:shadow-md ${
                      selectedCountry?.code === country.code
                        ? 'bg-blue-50 border-blue-300 text-blue-800'
                        : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <MapPin className="w-4 h-4 mx-auto mb-1" />
                    <div className="text-sm font-medium">{country.name}</div>
                  </button>
                ))}
              </div>
            </div>
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