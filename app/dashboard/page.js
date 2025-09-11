import { Suspense } from "react";
import DashboardPageClient from "./DashboardPageClient";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading dashboard...</div>}>
      <DashboardPageClient />
    </Suspense>
  );
}
