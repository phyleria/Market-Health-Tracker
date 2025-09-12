"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { FileText } from "lucide-react";

export default function DashboardPage() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!email) return;

    async function fetchReports() {
      try {
        const res = await fetch(`/api/webhook/reports`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });

        const data = await res.json();
        if (res.ok) {
          setReports(data);
        } else {
          console.error("❌ Error fetching reports:", data.error);
        }
      } catch (err) {
        console.error("❌ Fetch failed:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchReports();
  }, [email]);

  return (
    <div className="max-w-5xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Reports Dashboard</h1>

      {/* Notice about delay */}
      <div className="bg-blue-50 border border-blue-200 text-blue-700 p-3 rounded mb-6">
        Reports usually appear here within ~1 minute of receiving your update email.
      </div>

      {/* Loading skeleton */}
      {loading && (
        <div className="space-y-4 animate-pulse">
          <div className="h-4 bg-gray-300 rounded w-1/3"></div>
          <div className="h-4 bg-gray-300 rounded w-2/3"></div>
          <div className="h-4 bg-gray-300 rounded w-1/2"></div>
        </div>
      )}

      {/* No reports yet */}
      {!loading && reports.length === 0 && (
        <div className="text-center text-gray-500">
          <p>No reports yet for <b>{email}</b>.</p>
          <p className="text-sm mt-1">
            Once your first update is processed (≈1 minute after the confirmation email), it will appear here.
          </p>
        </div>
      )}

      {/* Reports list */}
      {!loading && reports.length > 0 && (
        <div className="grid gap-4">
          {reports.map((report, idx) => (
            <div
              key={idx}
              className="p-6 bg-white rounded-xl shadow flex items-center gap-4"
            >
              <FileText className="w-6 h-6 text-green-600" />
              <div>
                <p><b>Country:</b> {report.country}</p>
                <p><b>Sector:</b> {report.sector}</p>
                <p><b>Update:</b> {report.updateTitle}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
