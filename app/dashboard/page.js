"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { FileText } from "lucide-react";

export default function DashboardPage() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState(null);

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
          setReports(data); // data is array of reports
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
      <h1 className="text-2xl font-bold mb-4">Reports Dashboard</h1>

      {/* Info banner */}
      <div className="bg-blue-50 border border-blue-200 text-blue-700 p-3 rounded mb-6">
        Reports may take up to <b>1 minute</b> to appear after you receive your update email.
      </div>

      {loading && <p>Loading reports...</p>}

      {!loading && reports.length === 0 && (
        <p>
          No reports yet for <b>{email}</b>. Please check again in a minute after your confirmation email arrives.
        </p>
      )}

      {!loading && reports.length > 0 && (
        <div className="grid gap-4">
          {reports.map((report, idx) => (
            <div
              key={idx}
              className="p-6 bg-white rounded-xl shadow flex justify-between items-center"
            >
              <div className="flex items-center gap-4">
                <FileText className="w-6 h-6 text-green-600" />
                <div>
                  <p><b>Country:</b> {report.country}</p>
                  <p><b>Sector:</b> {report.sector}</p>
                  <p><b>Update:</b> {report.updateTitle}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedReport(report)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                View
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Modal for full details */}
      {selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
          <div className="bg-white p-6 rounded-xl shadow max-w-lg w-full">
            <h2 className="text-xl font-bold mb-4">{selectedReport.updateTitle}</h2>
            <p className="mb-4">{selectedReport.updateText}</p>
            {selectedReport.updateLink && (
              <a
                href={selectedReport.updateLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-600 underline"
              >
                Read more
              </a>
            )}
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelectedReport(null)}
                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
