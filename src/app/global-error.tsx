"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Global error:", error);
  }, [error]);

  return (
    <html lang="en">
      <body style={{ fontFamily: "system-ui, sans-serif", margin: 0 }}>
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "2rem",
            backgroundColor: "#fafafa",
          }}
        >
          <div style={{ maxWidth: "32rem", textAlign: "center" }}>
            <h1
              style={{
                fontSize: "1.875rem",
                fontWeight: 600,
                marginBottom: "1rem",
                color: "#171717",
              }}
            >
              Something went wrong
            </h1>
            <p
              style={{
                fontSize: "1rem",
                color: "#525252",
                marginBottom: "2rem",
                fontFamily: "monospace",
              }}
            >
              A critical error occurred. Please try again.
            </p>
            <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
              <button
                onClick={reset}
                style={{
                  padding: "0.75rem 1.5rem",
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  backgroundColor: "#171717",
                  color: "#fff",
                  border: "none",
                  borderRadius: "0.5rem",
                  cursor: "pointer",
                }}
              >
                Try again
              </button>
              <a
                href="/"
                style={{
                  padding: "0.75rem 1.5rem",
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  backgroundColor: "transparent",
                  color: "#171717",
                  border: "1px solid #d4d4d4",
                  borderRadius: "0.5rem",
                  textDecoration: "none",
                }}
              >
                Return home
              </a>
            </div>
            {error.digest && (
              <p
                style={{
                  marginTop: "2rem",
                  fontSize: "0.75rem",
                  color: "#a3a3a3",
                  fontFamily: "monospace",
                }}
              >
                Error ID: {error.digest}
              </p>
            )}
          </div>
        </div>
      </body>
    </html>
  );
}
