"use client";

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { FileText, Download, Plus, Home } from 'lucide-react';

const Dashboard = () => {
  const [reports, setReports] = useState([]);
  const searchParams = useSearchParams();
  const country = searchParams.get('country');
  const type = searchParams.get('type');

  // Mock data - in a real app, this would come from an API
  useEffect(() => {
    // Check if we have a new report to add
    if (country && type) {
      const newReport = {
        id: Date.now(),
        country,
        type,
        date: new Date().toLocaleDateString(),
        title: `${type.charAt(0).toUpperCase() + type.slice(1)} Report for ${country}`,
        // In a real app, this would contain the actual report data
      };
      
      // Get existing reports from localStorage or initialize empty array
      const existingReports = JSON.parse(localStorage.getItem('marketHealthReports') || '[]');
      
      // Add new report and save
      const updatedReports = [...existingReports, newReport];
      localStorage.setItem('marketHealthReports', JSON.stringify(updatedReports));
      setReports(updatedReports);
    } else {
      // Load existing reports
      const existingReports = JSON.parse(localStorage.getItem('marketHealthReports') || '[]');
      setReports(existingReports);
    }
  }, [country, type]);

  const generateNewReport = () => {
    window.location.href = '/'; // Redirect back to the main app
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Market Health Reports Dashboard</h1>
          <div className="flex space-x-4">
            <button 
              onClick={generateNewReport}
              className="flex items-center px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-5 h-5 mr-2" />
              New Report
            </button>
            {/* <button 
              onClick={() => window.location.href = '/'}
              className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <Home className="w-5 h-5 mr-2" />
              Home
            </button> */}
          </div>
        </div>

        {/* Reports Grid */}
        {reports.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reports.map((report) => (
              <div key={report.id} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
                <div className="flex items-center mb-4">
                  <FileText className="w-8 h-8 text-blue-600 mr-3" />
                  <h3 className="text-xl font-semibold text-gray-900">{report.title}</h3>
                </div>
                <div className="mb-4">
                  <p className="text-sm text-gray-600">Country: <span className="font-medium">{report.country}</span></p>
                  <p className="text-sm text-gray-600">Type: <span className="font-medium">{report.type}</span></p>
                  <p className="text-sm text-gray-600">Date: <span className="font-medium">{report.date}</span></p>
                </div>
                <div className="flex justify-between items-center">
                  <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm">
                    View Details
                  </button>
                  <button className="flex items-center text-gray-600 hover:text-gray-800 transition-colors">
                    <Download className="w-4 h-4 mr-1" />
                    <span className="text-sm">Download</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No reports yet</h3>
            <p className="text-gray-600 mb-6">Generate your first market health report to get started</p>
            <button 
              onClick={generateNewReport}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Generate Report
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;