"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Mail, MessageSquare, Bell, TrendingUp, Shield, Zap, MapPin, Download } from 'lucide-react';
import dynamic from 'next/dynamic';
import * as topojson from 'topojson-client';

const Globe = dynamic(() => import('react-globe.gl'), { ssr: false });

const MarketHealthTracker = () => {
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedHealthType, setSelectedHealthType] = useState(null);
  const [notificationMethod, setNotificationMethod] = useState('email');
  const [userEmail, setUserEmail] = useState('');
  const [slackWebhook, setSlackWebhook] = useState('');
  const [step, setStep] = useState(1);
  const [countries, setCountries] = useState({ features: [] });
  const [hoverD, setHoverD] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const globeEl = useRef();

  // African countries with their ISO codes, display names, and center points for animation
  const africanCountries = [
    { name: 'Nigeria', code: 'NG', iso: 'NGA', lat: 9.082, lon: 8.675 },
    { name: 'Kenya', code: 'KE', iso: 'KEN', lat: -0.0236, lon: 37.9062 },
    { name: 'South Africa', code: 'ZA', iso: 'ZAF', lat: -30.5595, lon: 22.9375 },
    { name: 'Ghana', code: 'GH', iso: 'GHA', lat: 7.9465, lon: -1.0232 },
    { name: 'Egypt', code: 'EG', iso: 'EGY', lat: 26.8206, lon: 30.8025 },
    { name: 'Morocco', code: 'MA', iso: 'MAR', lat: 31.7917, lon: -7.0926 },
    { name: 'Ethiopia', code: 'ET', iso: 'ETH', lat: 9.145, lon: 40.4897 },
    { name: 'Tanzania', code: 'TZ', iso: 'TZA', lat: -6.369, lon: 34.8888 },
    { name: 'Uganda', code: 'UG', iso: 'UGA', lat: 1.3733, lon: 32.2903 },
    { name: 'Rwanda', code: 'RW', iso: 'RWA', lat: -1.9403, lon: 29.8739 },
    { name: 'Senegal', code: 'SN', iso: 'SEN', lat: 14.4974, lon: -14.4524 },
    { name: 'Ivory Coast', code: 'CI', iso: 'CIV', lat: 7.5399, lon: -5.5471 },
    { name: 'Angola', code: 'AO', iso: 'AGO', lat: -11.2027, lon: 17.8739 },
    { name: 'Zambia', code: 'ZM', iso: 'ZMB', lat: -13.1339, lon: 27.8493 },
    { name: 'Botswana', code: 'BW', iso: 'BWA', lat: -22.3285, lon: 24.6849 },
    { name: 'Algeria', code: 'DZ', iso: 'DZA', lat: 28.0339, lon: 1.6596 },
    { name: 'Tunisia', code: 'TN', iso: 'TUN', lat: 33.8869, lon: 9.5375 },
    { name: 'Libya', code: 'LY', iso: 'LBY', lat: 26.3351, lon: 17.2283 },
    { name: 'Sudan', code: 'SD', iso: 'SDN', lat: 12.8628, lon: 30.2176 },
    { name: 'Chad', code: 'TD', iso: 'TCD', lat: 15.4542, lon: 18.7322 },
    { name: 'Niger', code: 'NE', iso: 'NER', lat: 17.6078, lon: 8.0817 },
    { name: 'Mali', code: 'ML', iso: 'MLI', lat: 17.5707, lon: -3.9962 },
    { name: 'Burkina Faso', code: 'BF', iso: 'BFA', lat: 12.2383, lon: -1.5616 },
    { name: 'Guinea', code: 'GN', iso: 'GIN', lat: 9.9456, lon: -9.6966 },
    { name: 'Sierra Leone', code: 'SL', iso: 'SLE', lat: 8.4606, lon: -11.7799 },
    { name: 'Liberia', code: 'LR', iso: 'LBR', lat: 6.4281, lon: -9.4295 },
    { name: 'Togo', code: 'TG', iso: 'TGO', lat: 8.6195, lon: 0.8248 },
    { name: 'Benin', code: 'BJ', iso: 'BEN', lat: 9.3077, lon: 2.3158 },
    { name: 'Cameroon', code: 'CM', iso: 'CMR', lat: 7.3697, lon: 12.3547 },
    { name: 'Central African Republic', code: 'CF', iso: 'CAF', lat: 6.6111, lon: 20.9394 },
    { name: 'Democratic Republic of Congo', code: 'CD', iso: 'COD', lat: -4.0383, lon: 21.7587 },
    { name: 'Republic of Congo', code: 'CG', iso: 'COG', lat: -0.228, lon: 15.8277 },
    { name: 'Gabon', code: 'GA', iso: 'GAB', lat: -0.8037, lon: 11.6094 },
    { name: 'Equatorial Guinea', code: 'GQ', iso: 'GNQ', lat: 1.651, lon: 10.2679 },
    { name: 'Sao Tome and Principe', code: 'ST', iso: 'STP', lat: 0.1864, lon: 6.6131 },
    { name: 'Somalia', code: 'SO', iso: 'SOM', lat: 5.1521, lon: 46.1996 },
    { name: 'Djibouti', code: 'DJ', iso: 'DJI', lat: 11.8251, lon: 42.5903 },
    { name: 'Eritrea', code: 'ER', iso: 'ERI', lat: 15.1794, lon: 39.7823 },
    { name: 'Burundi', code: 'BI', iso: 'BDI', lat: -3.3733, lon: 29.9189 },
    { name: 'Malawi', code: 'MW', iso: 'MWI', lat: -13.2543, lon: 34.3015 },
    { name: 'Mozambique', code: 'MZ', iso: 'MOZ', lat: -18.6657, lon: 35.5296 },
    { name: 'Zimbabwe', code: 'ZW', iso: 'ZWE', lat: -19.0154, lon: 29.1549 },
    { name: 'Namibia', code: 'NA', iso: 'NAM', lat: -22.9576, lon: 18.4904 },
    { name: 'Lesotho', code: 'LS', iso: 'LSO', lat: -29.6006, lon: 28.2336 },
    { name: 'Eswatini', code: 'SZ', iso: 'SWZ', lat: -26.5225, lon: 31.4659 },
    { name: 'Madagascar', code: 'MG', iso: 'MDG', lat: -18.7669, lon: 46.8691 },
    { name: 'Mauritius', code: 'MU', iso: 'MUS', lat: -20.3484, lon: 57.5522 },
    { name: 'Seychelles', code: 'SC', iso: 'SYC', lat: -4.6796, lon: 55.492 },
    { name: 'Comoros', code: 'KM', iso: 'COM', lat: -11.875, lon: 43.8722 },
    { name: 'Cape Verde', code: 'CV', iso: 'CPV', lat: 16.5388, lon: -23.0418 },
    { name: 'Gambia', code: 'GM', iso: 'GMB', lat: 13.4432, lon: -15.3101 },
    { name: 'Guinea-Bissau', code: 'GW', iso: 'GNB', lat: 11.86, lon: -15.4746 },
    { name: 'Mauritania', code: 'MR', iso: 'MRT', lat: 21.0079, lon: -10.9408 }
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

  useEffect(() => {
    if (typeof window !== 'undefined') {
      fetch('https://unpkg.com/world-atlas@2.0.2/countries-110m.json')
        .then(res => res.json())
        .then(data => {
          const { countries: topoCountries } = data.objects;
          const geoJsonData = topojson.feature(data, topoCountries);
          setCountries(geoJsonData);
          setIsLoading(false);

          if (globeEl.current) {
            globeEl.current.pointOfView({ lat: 5, lon: 18, altitude: 2.2 }, 4000);
          }
        })
        .catch(error => {
          console.error('Error fetching globe data:', error);
          setIsLoading(false);
        });
    }
  }, []);

  const handleCountryClick = (polygon) => {
    if (!polygon || !polygon.properties) {
      return;
    }
    
    // Check for multiple possible ISO code property names
    const isoCode = polygon.properties.iso_a3 || polygon.properties.ISO_A3 || polygon.properties.ADM0_A3 || polygon.properties.ISO3;
    
    if (!isoCode) {
      return;
    }
    
    const country = africanCountries.find(c => c.iso === isoCode);
    
    if (country) {
      setSelectedCountry(country);
      if (globeEl.current) {
        globeEl.current.pointOfView({ lat: country.lat, lon: country.lon, altitude: 1.5 }, 2000);
      }
    }
  };

  const handleHealthTypeSelect = (healthType) => {
    setSelectedHealthType(healthType);
    setStep(3);
  };

  const handleSubmit = () => {
    const requestData = {
      country: selectedCountry,
      healthType: selectedHealthType,
      notificationMethod,
      email: notificationMethod === 'email' ? userEmail : null,
      slackWebhook: notificationMethod === 'slack' ? slackWebhook : null
    };

    console.log('Submitting request:', requestData);
    alert('Request submitted successfully! You will receive updates via ' + notificationMethod);
  };

  const resetFlow = () => {
    setSelectedCountry(null);
    setSelectedHealthType(null);
    setStep(1);
  };

  const GlobeComponent = () => {
    if (isLoading || !Globe) {
      return (
        <div className="relative w-full aspect-square md:max-w-[700px] mx-auto flex items-center justify-center rounded-full shadow-2xl bg-gray-50">
          <svg className="animate-spin h-10 w-10 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      );
    }
    
    // Filter to only show African countries and get the correct ISO code
    const africanFeatures = countries.features.filter(f => {
      const isoCode = f.properties.iso_a3 || f.properties.ISO_A3 || f.properties.ADM0_A3 || f.properties.ISO3;
      return africanCountries.some(ac => ac.iso === isoCode);
    });

    return (
      <div className="relative w-full aspect-square md:w-full md:max-w-[700px] mx-auto overflow-hidden rounded-full shadow-2xl bg-gray-900">
        <Globe
          ref={globeEl}
          globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
          backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
          polygonsData={africanFeatures}
          polygonAltitude={d => {
            const isoCode = d.properties.iso_a3 || d.properties.ISO_A3 || d.properties.ADM0_A3 || d.properties.ISO3;
            if (d === hoverD || selectedCountry?.iso === isoCode) return 0.08;
            return 0.03;
          }}
          polygonCapColor={d => {
            const isoCode = d.properties.iso_a3 || d.properties.ISO_A3 || d.properties.ADM0_A3 || d.properties.ISO3;
            if (d === hoverD) return '#fbbf24'; // Yellow for hover
            if (selectedCountry?.iso === isoCode) return '#3b82f6'; // Blue for selected
            return '#10b981'; // Green for African countries
          }}
          polygonSideColor={d => {
            const isoCode = d.properties.iso_a3 || d.properties.ISO_A3 || d.properties.ADM0_A3 || d.properties.ISO3;
            if (d === hoverD) return 'rgba(251, 191, 36, 0.8)';
            if (selectedCountry?.iso === isoCode) return 'rgba(59, 130, 246, 0.8)';
            return 'rgba(16, 185, 129, 0.6)';
          }}
          polygonStrokeColor={() => '#ffffff'}
          polygonsTransitionDuration={300}
          onPolygonClick={handleCountryClick}
          onPolygonHover={setHoverD}
          enablePointerInteraction={true}
          width={700}
          height={700}
        />
        {hoverD && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 pointer-events-none z-10">
            <div className="bg-black bg-opacity-75 text-white text-sm px-4 py-2 rounded-lg font-medium shadow-lg">
              {hoverD.properties.name}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
   
<div className="bg-white shadow-sm border-b">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
              <p className="text-gray-600">Click on any country on the 3D globe or select from the list below</p>
            </div>

            {/* Dynamic 3D Globe */}
            <div className="mb-8">
              <GlobeComponent />
              {selectedCountry && (
                <div className="text-center mt-4">
                  <div className="inline-block bg-blue-100 text-blue-800 px-4 py-2 rounded-full">
                    Selected: {selectedCountry.name}
                  </div>
                </div>
              )}
            </div>

            {/* Country Grid */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">Select from all African countries:</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 max-h-96 overflow-y-auto border border-gray-200 rounded-lg p-4">
                {africanCountries.map((country) => (
                  <button
                    key={country.iso}
                    onClick={() => {
                        setSelectedCountry(country);
                        const targetCountry = africanCountries.find(c => c.iso === country.iso);
                        if (targetCountry && globeEl.current) {
                          globeEl.current.pointOfView({ lat: targetCountry.lat, lon: targetCountry.lon, altitude: 1.5 }, 2000);
                        }
                    }}
                    className={`p-3 rounded-lg border text-center transition-all hover:shadow-md ${
                      selectedCountry?.iso === country.iso
                        ? 'bg-blue-50 border-blue-300 text-blue-800'
                        : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <MapPin className="w-4 h-4 mx-auto mb-1" />
                    <div className="text-sm font-medium">{country.name}</div>
                    <div className="text-xs text-gray-500">{country.code}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Continue Button */}
            {selectedCountry && (
              <div className="text-center mt-6">
                <button
                  onClick={() => setStep(2)}
                  className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
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
                  className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
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