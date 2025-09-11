"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FileText, Download, Plus, Home, BarChart3, ArrowRight, Trash2 } from 'lucide-react';

export default function DashboardPage() {
  const [reports, setReports] = useState([]);
  const router = useRouter();
  const searchParams = useSearchParams();
  const country = searchParams.get('country');
  const type = searchParams.get('type');

  useEffect(() => {
    // Load reports from localStorage on component mount
    const loadReports = () => {
      try {
        const storedReports = localStorage.getItem('marketHealthReports');
        if (storedReports) {
          setReports(JSON.parse(storedReports));
        }
      } catch (error) {
        console.error('Error loading reports from localStorage:', error);
      }
    };

    loadReports();

    // Also set up storage event listener to sync across tabs
    const handleStorageChange = (e) => {
      if (e.key === 'marketHealthReports') {
        loadReports();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  useEffect(() => {
    // Check if we have a new report to add from query parameters
    if (country && type) {
      const newReport = {
        id: Date.now().toString(),
        country,
        type,
        date: new Date().toLocaleDateString(),
        title: `${type.charAt(0).toUpperCase() + type.slice(1)} Report for ${country}`,
        score: (Math.random() * 3 + 7).toFixed(1) + '/10', // Random score between 7-10
        riskLevel: ['Low', 'Medium', 'High'][Math.floor(Math.random() * 3)],
        lastUpdated: 'Just now'
      };
      
      // Get existing reports from localStorage or initialize empty array
      const existingReports = JSON.parse(localStorage.getItem('marketHealthReports') || '[]');
      
      // Add new report and save
      const updatedReports = [...existingReports, newReport];
      localStorage.setItem('marketHealthReports', JSON.stringify(updatedReports));
      setReports(updatedReports);
      
      // Clear the query parameters to avoid adding the same report again
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete('country');
      newUrl.searchParams.delete('type');
      window.history.replaceState({}, '', newUrl.toString());
    }
  }, [country, type]);

  const generateNewReport = () => {
    router.push('/'); // Redirect back to the main app
  };

  const viewReportDetails = (reportId) => {
    router.push(`/dashboard/${reportId}`);
  };

  const deleteReport = (reportId, e) => {
    e.stopPropagation(); // Prevent triggering the view report action
    
    if (confirm('Are you sure you want to delete this report?')) {
      const updatedReports = reports.filter(report => report.id !== reportId);
      localStorage.setItem('marketHealthReports', JSON.stringify(updatedReports));
      setReports(updatedReports);
    }
  };

  const clearAllReports = () => {
    if (confirm('Are you sure you want to delete all reports? This cannot be undone.')) {
      localStorage.removeItem('marketHealthReports');
      setReports([]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div className="flex items-center">
            <BarChart3 className="w-8 h-8 text-blue-600 mr-3" />
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Market Health Reports Dashboard</h1>
              <p className="text-gray-600 text-sm mt-1">
                {reports.length} report{reports.length !== 1 ? 's' : ''} generated
                {reports.length > 0 && (
                  <button 
                    onClick={clearAllReports}
                    className="ml-4 text-red-600 hover:text-red-800 text-xs flex items-center"
                  >
                    <Trash2 className="w-3 h-3 mr-1" />
                    Clear all
                  </button>
                )}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button 
              onClick={generateNewReport}
              className="flex items-center px-3 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-300 transition-colors text-sm"
            >
              <Plus className="w-4 h-4 mr-1" />
              New Report
            </button>
           
          </div>
        </div>

        {/* Reports Grid */}
        {reports.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reports.map((report) => (
              <div 
                key={report.id} 
                className="bg-white rounded-lg shadow-lg p-4 md:p-6 hover:shadow-xl transition-shadow cursor-pointer relative group"
                onClick={() => viewReportDetails(report.id)}
              >
                {/* Delete button */}
                <button 
                  onClick={(e) => deleteReport(report.id, e)}
                  className="absolute top-3 right-3 p-1 text-gray-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Delete report"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                
                <div className="flex items-center mb-3">
                  <FileText className="w-6 h-6 md:w-8 md:h-8 text-blue-600 mr-2 md:mr-3" />
                  <h3 className="text-lg md:text-xl font-semibold text-gray-900">{report.title}</h3>
                </div>
                <div className="mb-4">
                  <p className="text-sm text-gray-600">Country: <span className="font-medium">{report.country}</span></p>
                  <p className="text-sm text-gray-600">Type: <span className="font-medium capitalize">{report.type}</span></p>
                  <p className="text-sm text-gray-600">Date: <span className="font-medium">{report.date}</span></p>
                  <div className="mt-2 p-2 bg-gray-50 rounded">
                    <p className="text-xs text-gray-600">Overall Score: <span className="font-medium">{report.score}</span></p>
                    <p className="text-xs text-gray-600">Risk Level: <span className={`font-medium ${
                      report.riskLevel === 'Low' ? 'text-green-600' : 
                      report.riskLevel === 'Medium' ? 'text-yellow-600' : 
                      'text-red-600'
                    }`}>{report.riskLevel}</span></p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <button 
                    onClick={() => viewReportDetails(report.id)}
                    className="flex items-center justify-center px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm w-full sm:w-auto"
                  >
                    <span>View Details</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </button>
                  <button className="flex items-center justify-center text-gray-600 hover:text-gray-800 transition-colors text-sm w-full sm:w-auto">
                    <Download className="w-4 h-4 mr-1" />
                    <span>Download</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg p-8 md:p-12 text-center">
            <FileText className="w-12 h-12 md:w-16 md:h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No reports yet</h3>
            <p className="text-gray-600 mb-6">Generate your first market health report to get started</p>
            <button 
              onClick={generateNewReport}
              className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-300 transition-colors"
            >
              Generate Report
            </button>
          </div>
        )}
      </div>
    </div>
  );
}