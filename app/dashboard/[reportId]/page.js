"use client";

import { Suspense } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { ArrowLeft, TrendingUp, Shield, Zap, Download, RefreshCw } from 'lucide-react';

// Separate component that uses useParams and useSearchParams
function ReportDetailContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [country, setCountry] = useState('');
  const [healthType, setHealthType] = useState('');

  useEffect(() => {
    // Check if we're accessing via direct link (with report ID)
    if (params.reportId) {
      // Load report data from localStorage
      const existingReports = JSON.parse(localStorage.getItem('marketHealthReports') || '[]');
      const foundReport = existingReports.find(r => r.id === params.reportId);
      
      if (foundReport) {
        setReport(foundReport);
        setCountry(foundReport.country);
        setHealthType(foundReport.type);
      }
      setLoading(false);
    } 
    // Check if we're accessing via query parameters (new report)
    else {
      const countryParam = searchParams.get('country');
      const typeParam = searchParams.get('type');
      
      if (countryParam && typeParam) {
        setCountry(countryParam);
        setHealthType(typeParam);
        
        // Create a temporary report object for display
        const tempReport = {
          id: 'temp',
          country: countryParam,
          type: typeParam,
          date: new Date().toLocaleDateString(),
          title: `${typeParam.charAt(0).toUpperCase() + typeParam.slice(1)} Report for ${countryParam}`,
          score: '7.5/10',
          riskLevel: 'Low',
          lastUpdated: 'Just now'
        };
        setReport(tempReport);
      }
      setLoading(false);
    }
  }, [params.reportId, searchParams]);

  const getHealthTypeDetails = (type) => {
    const types = {
      'regulation': {
        title: 'Regulation & Compliance',
        icon: Shield,
        color: 'bg-green-50 border-green-200 text-green-800'
      },
      'infrastructure': {
        title: 'Infrastructure Health',
        icon: Zap,
        color: 'bg-blue-50 border-blue-200 text-blue-800'
      },
      'economic': {
        title: 'Economic Health',
        icon: TrendingUp,
        color: 'bg-purple-50 border-purple-200 text-purple-800'
      }
    };
    return types[type] || { title: 'Unknown', icon: TrendingUp, color: 'bg-gray-50' };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading report...</p>
        </div>
      </div>
    );
  }

  if (!report && !country && !healthType) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Report Not Found</h1>
          <p className="text-gray-600 mb-6">The requested report could not be found.</p>
          <button 
            onClick={() => router.push('/dashboard')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const typeDetails = getHealthTypeDetails(healthType || report?.type);
  const IconComponent = typeDetails.icon;
  const displayCountry = country || report?.country;
  const displayType = healthType || report?.type;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
{/* Header */}
<div className="bg-white shadow-sm border-b">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="flex flex-col md:flex-row md:items-center md:justify-between py-4 gap-4">
      {/* Left side: back + title */}
      <div className="flex items-start md:items-center space-x-3">
        <button
          onClick={() => router.back()}
          className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </button>
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">
            Market Health Dashboard
          </h1>
          <p className="text-gray-600 text-sm md:text-base">
            {typeDetails.title} for {displayCountry}
          </p>
        </div>
      </div>

      {/* Right side: action buttons */}
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
        {/* Refresh button */}
        <button
          onClick={() => window.location.reload()}
          className="flex items-center justify-center px-3 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors border rounded-lg"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </button>

        {/* Export button */}
        <button
          onClick={() => {
            if (!report) return;

            const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(report, null, 2));
            const downloadAnchor = document.createElement("a");
            downloadAnchor.setAttribute("href", dataStr);
            downloadAnchor.setAttribute("download", `${report.title.replace(/\s+/g, "_")}.json`);
            document.body.appendChild(downloadAnchor);
            downloadAnchor.click();
            downloadAnchor.remove();
          }}
          className="flex items-center justify-center px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Download className="w-4 h-4 mr-2" />
          Export
        </button>
      </div>
    </div>
  </div>
</div>



      {/* Dashboard Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Summary Card */}
        <div className={`p-6 rounded-xl border-2 mb-8 ${typeDetails.color}`}>
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-white rounded-lg shadow-sm">
              <IconComponent className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-xl font-bold">{typeDetails.title} Report</h2>
              <p className="text-sm opacity-90">Comprehensive analysis for {displayCountry}</p>
              {report?.date && (
                <p className="text-sm opacity-90 mt-1">Generated on: {report.date}</p>
              )}
              {report?.id === 'temp' && (
                <p className="text-sm text-yellow-700 mt-1">
                  This is a preview. Generate the report to save it to your dashboard.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Placeholder Content */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Key Metrics</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Overall Score</span>
                <span className="font-semibold">{report?.score || '7.5/10'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Risk Level</span>
                <span className="text-green-600 font-semibold">{report?.riskLevel || 'Low'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Last Updated</span>
                <span className="text-gray-500">{report?.lastUpdated || '2 hours ago'}</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Recent Changes</h3>
            <div className="space-y-3">
              <div className="text-sm">
                <div className="text-gray-900 font-medium">Policy Update</div>
                <div className="text-gray-600">New regulations announced</div>
                <div className="text-xs text-gray-500 mt-1">3 days ago</div>
              </div>
              <div className="text-sm">
                <div className="text-gray-900 font-medium">Economic Indicator</div>
                <div className="text-gray-600">GDP growth revised upward</div>
                <div className="text-xs text-gray-500 mt-1">1 week ago</div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Recommendations</h3>
            <div className="space-y-3 text-sm">
              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="text-blue-900 font-medium">Monitor Closely</div>
                <div className="text-blue-700">Keep track of upcoming policy changes</div>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <div className="text-green-900 font-medium">Opportunity</div>
                <div className="text-green-700">Consider market expansion</div>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Analysis Section */}
        <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-xl font-bold mb-6">Detailed Analysis</h3>
          <div className="prose max-w-none text-gray-700">
            <p>
              This comprehensive report provides insights into the {typeDetails.title.toLowerCase()} 
              landscape in {displayCountry}. The analysis covers current market conditions, regulatory 
              environment, and key factors affecting business operations.
            </p>
            <p>
              Based on our assessment, the overall market health score is {report?.score || '7.5/10'}, indicating 
              a stable and favorable environment for business activities. Key strengths include 
              robust regulatory framework and improving infrastructure development.
            </p>
            <p>
              We recommend continued monitoring of policy developments and maintaining compliance 
              with evolving regulations. Market opportunities remain strong, with particular 
              potential in digital services and financial technology sectors.
            </p>
          </div>
        </div>

        {/* Action buttons for temporary reports */}
        {report?.id === 'temp' && (
          <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-yellow-800 mb-4">Save This Report</h3>
            <p className="text-yellow-700 mb-4">
              This is a preview of your report. Generate it to save it to your dashboard and access it later.
            </p>
            <button
              onClick={() => {
                // Create a proper report and save it
                const newReport = {
                  id: Date.now().toString(),
                  country: displayCountry,
                  type: displayType,
                  date: new Date().toLocaleDateString(),
                  title: `${displayType.charAt(0).toUpperCase() + displayType.slice(1)} Report for ${displayCountry}`,
                  score: (Math.random() * 3 + 7).toFixed(1) + '/10',
                  riskLevel: ['Low', 'Medium', 'High'][Math.floor(Math.random() * 3)],
                  lastUpdated: 'Just now'
                };
                
                // Save to localStorage
                const existingReports = JSON.parse(localStorage.getItem('marketHealthReports') || '[]');
                const updatedReports = [...existingReports, newReport];
                localStorage.setItem('marketHealthReports', JSON.stringify(updatedReports));
                
                // Redirect to the saved report
                router.push(`/dashboard/${newReport.id}`);
              }}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Generate and Save Report
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// Loading fallback component
function ReportDetailLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">Loading report...</p>
      </div>
    </div>
  );
}

// Main page component with Suspense boundary
export default function ReportDetail() {
  return (
    <Suspense fallback={<ReportDetailLoading />}>
      <ReportDetailContent />
    </Suspense>
  );
}