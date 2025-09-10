"use client";

import React, { useState } from 'react';
import { Mail, MessageSquare, Bell, TrendingUp, Shield, Zap, MapPin, Download, FileText, CheckCircle } from 'lucide-react';
import { sendNotification } from "../utils/webhook";
import GlobeComponent from './Globe/index';

const MarketHealthTracker = () => {
  // ... (state variables remain the same)
  
  // ... (africanCountries array remains the same)
  
  // ... (healthTypes array remains the same)
  
  // ... (benefitsList array remains the same)
  
  // ... (handleCountryClick function remains the same)
  
  // ... (handleHealthTypeSelect function remains the same)
  
  // ... (handleSubmit function remains the same)
  
  // ... (resetFlow function remains the same)
  
  // ... (SuccessPopup component remains the same)

  const GlobeWrapper = () => {
    return (
      <div className="relative w-full max-w-[400px] mx-auto aspect-square">
        <div className="w-full h-full flex items-center justify-center">
          <GlobeComponent 
            benefitsList={benefitsList}
            onCountrySelect={handleCountryClick}
            selectedCountry={selectedCountry}
          />
        </div>
        
        {!selectedCountry && (
          <div className="hidden md:block absolute bottom-1 left-1/2 transform -translate-x-1/2 text-white text-xs text-center opacity-80 bg-black bg-opacity-50 px-2 py-0.5 rounded">
            Click on Africa to select a country
          </div>
        )}
        
        {selectedCountry && (
          <div className="absolute top-2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10">
            <div className="hidden md:block bg-green-500 bg-opacity-90 text-white text-sm px-3 py-1 rounded-lg font-small shadow-lg">
              Selected: {selectedCountry.name}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 overflow-x-hidden">
      {/* Fixed Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-xl font-bold text-gray-900">Africa Market Health Tracker</h1>
            <div className="hidden md:flex items-center space-x-2 text-sm text-gray-500">
              <Bell className="w-4 h-4" />
              <span>Stay updated on market changes</span>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Progress Steps */}
        <div className="mb-6">
          <div className="flex items-center justify-center space-x-4">
            {[1, 2, 3].map((stepNum) => (
              <div key={stepNum} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  stepNum === step ? 'bg-orange-500 text-white' :
                  stepNum < step ? 'bg-gray-500 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  {stepNum}
                </div>
                {stepNum < 3 && (
                  <div className={`w-12 h-1 mx-2 ${stepNum < step ? 'bg-gray-500' : 'bg-gray-200'}`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-3 text-sm text-gray-600">
            <div className="text-center">
              Step {step}: {step === 1 ? 'Select Country' : step === 2 ? 'Choose Health Metric' : 'Report Generation'}
            </div>
          </div>
        </div>

        {/* Step 1: Country Selection */}
        {step === 1 && (
          <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
            <div className="text-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Select an African Market</h2>
            </div>

            <div className="mb-4">
              <GlobeWrapper />
            </div>

            {selectedCountry && (
              <div className="text-center mt-6">
                <button
                  onClick={() => setStep(2)}
                  className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm font-medium"
                >
                  Continue with {selectedCountry.name} →
                </button>
              </div>
            )}
          </div>
        )}

        {/* Step 2: Health Type Selection */}
        {step === 2 && (
          <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Choose Health Metric for {selectedCountry?.name}
              </h2>
              <p className="text-gray-600 text-sm">Select which aspect of market health you want to analyze</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {healthTypes.map((type) => {
                const IconComponent = type.icon;
                return (
                  <button
                    key={type.id}
                    onClick={() => handleHealthTypeSelect(type)}
                    className={`p-4 rounded-lg border-2 text-left transition-all hover:shadow-md ${
                      selectedHealthType?.id === type.id
                        ? type.color
                        : 'bg-white border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center mb-3">
                      <IconComponent className="w-6 h-6 mr-2" />
                      <h3 className="text-base font-semibold">{type.title}</h3>
                    </div>
                    <p className="text-xs text-gray-600">{type.description}</p>
                  </button>
                );
              })}
            </div>

            <div className="flex justify-between mt-6">
              <button
                onClick={resetFlow}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors text-sm"
              >
                ← Back to country selection
              </button>
              {selectedHealthType && (
                <button
                  onClick={() => setStep(3)}
                  className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                >
                  Continue to Notifications →
                </button>
              )}
            </div>
          </div>
        )}

        {/* Step 3: Report & Updates Configuration */}
        {step === 3 && (
          <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-2">Configure Report & Updates</h2>
              <p className="text-gray-600 text-sm">Set up your report delivery and optional weekly updates</p>
            </div>

            <div className="max-w-xl mx-auto">
              {/* Report Generation Info */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg mb-6 border border-blue-200">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-0.5">
                    <FileText className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-blue-900 text-sm mb-1">Report Generation</h4>
                    <p className="text-blue-700 text-xs leading-relaxed">
                      Generate your comprehensive {selectedHealthType?.title.toLowerCase()} report for {selectedCountry?.name}
                    </p>
                  </div>
                </div>
              </div>

              {/* Form Container */}
              <div className="space-y-6">
                {/* Notification Method Selection */}
                <div>
                  <label className="block text-base font-semibold text-gray-800 mb-3">
                    Where would you like to receive your report?
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <label className={`relative flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                      notificationMethod === 'email' 
                        ? 'border-blue-500 bg-blue-50 shadow-sm' 
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}>
                      <input
                        type="radio"
                        value="email"
                        checked={notificationMethod === 'email'}
                        onChange={(e) => setNotificationMethod(e.target.value)}
                        className="sr-only"
                      />
                      <div className="flex items-center space-x-3">
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                          notificationMethod === 'email' 
                            ? 'border-blue-500 bg-blue-500' 
                            : 'border-gray-300'
                        }`}>
                          {notificationMethod === 'email' && (
                            <div className="w-2 h-2 rounded-full bg-white"></div>
                          )}
                        </div>
                        <Mail className="w-5 h-5 text-gray-600" />
                        <span className="font-medium text-gray-900 text-sm">Via Email</span>
                      </div>
                    </label>
                    
                    <label className={`relative flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                      notificationMethod === 'slack' 
                        ? 'border-blue-500 bg-blue-50 shadow-sm' 
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}>
                      <input
                        type="radio"
                        value="slack"
                        checked={notificationMethod === 'slack'}
                        onChange={(e) => setNotificationMethod(e.target.value)}
                        className="sr-only"
                      />
                      <div className="flex items-center space-x-3">
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                          notificationMethod === 'slack' 
                            ? 'border-blue-500 bg-blue-500' 
                            : 'border-gray-300'
                        }`}>
                          {notificationMethod === 'slack' && (
                            <div className="w-2 h-2 rounded-full bg-white"></div>
                          )}
                        </div>
                        <MessageSquare className="w-5 h-5 text-gray-600" />
                        <span className="font-medium text-gray-900 text-sm">Via Slack</span>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Email Input */}
                {notificationMethod === 'email' && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={userEmail}
                      onChange={(e) => setUserEmail(e.target.value)}
                      placeholder="your.email@company.com"
                      className="w-full px-3 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      required
                    />
                  </div>
                )}

                {/* Slack Input */}
                {notificationMethod === 'slack' && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Slack Webhook URL
                    </label>
                    <input
                      type="url"
                      value={slackWebhook}
                      onChange={(e) => setSlackWebhook(e.target.value)}
                      placeholder="https://hooks.slack.com/services/..."
                      className="w-full px-3 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Get your webhook URL from your Slack workspace settings
                    </p>
                  </div>
                )}

                {/* Weekly Updates Checkbox */}
                <div className="border-t pt-4">
                  <label className={`flex items-start space-x-3 p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                    weeklyUpdates 
                      ? 'border-green-500 bg-green-50 shadow-sm' 
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}>
                    <div className="flex-shrink-0 mt-0.5">
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                        weeklyUpdates 
                          ? 'border-green-500 bg-green-500' 
                          : 'border-gray-300'
                      }`}>
                        {weeklyUpdates && (
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
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
                      <div className="font-semibold text-gray-900 text-sm mb-1">
                        Subscribe to weekly market change updates
                      </div>
                      <div className="text-xs text-gray-600 leading-relaxed">
                        Stay informed with weekly insights on market developments and regulatory changes
                      </div>
                    </div>
                  </label>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 justify-between items-center pt-4">
                  <button
                    onClick={() => setStep(2)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors text-sm font-medium order-2 sm:order-1"
                  >
                    ← Back to health metrics
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={
                      (notificationMethod === 'email' && !userEmail) ||
                      (notificationMethod === 'slack' && !slackWebhook)
                    }
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-base font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-200 flex items-center shadow-md hover:shadow-sm order-1 sm:order-2"
                  >
                    <FileText className="w-4 h-4 mr-2" />
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