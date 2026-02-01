"use client";

import { useState, useEffect } from "react";

export function CopyrightYear() {
  // Build-time year as fallback, hydrates to current year on client
  const [year, setYear] = useState(2025);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return <>{year}</>;
}
