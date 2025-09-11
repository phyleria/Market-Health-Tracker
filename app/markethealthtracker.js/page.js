"use client";

import { useRouter } from "next/navigation";
import { useReports } from "../context/ReportsContext";

export default function MarketHealthTracker() {
  const router = useRouter();
  const { addReport } = useReports();

  const handleGotIt = () => {
    const newReport = {
      id: Date.now(),
      country: "Kenya", // Replace with real selected country
      type: "economic", // Replace with real selected type
      createdAt: new Date().toISOString(),
    };

    addReport(newReport);
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <button
        onClick={handleGotIt}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
      >
        Got it
      </button>
    </div>
  );
}
