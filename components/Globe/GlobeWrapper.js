"use client";

import dynamic from "next/dynamic";

// Dynamically import react-globe.gl with SSR disabled
const Globe = dynamic(() => import("react-globe.gl"), {
  ssr: false,
});

export default Globe;
