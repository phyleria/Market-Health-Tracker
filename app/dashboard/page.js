"use client";

import { Suspense } from "react";
import DashboardPageClient from "./DashboardPageClient";

export default function DashboardPage() {
  return (
    <Suspense fallback={<p className="p-6">Loading dashboard...</p>}>
      <DashboardPageClient />
    </Suspense>
  );
}
