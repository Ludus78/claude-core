"use client";

import dynamic from "next/dynamic";

// three.js needs the browser: render the globe on the client only.
const Globe = dynamic(() => import("./Globe"), { ssr: false });

export default function GlobeLoader() {
  return <Globe />;
}
