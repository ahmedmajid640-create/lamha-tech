"use client";

/** Last-resort boundary when the root layout itself fails. Minimal, no dependencies. */
export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, minHeight: "100vh", display: "grid", placeItems: "center", background: "#06070b", color: "#fff", fontFamily: "system-ui, sans-serif" }}>
        <main style={{ maxWidth: 560, padding: 24, textAlign: "center" }}>
          <p style={{ fontSize: 12, letterSpacing: "0.2em", textTransform: "uppercase", color: "#7fb0ff" }}>LAMHA Technologies</p>
          <h1 style={{ fontSize: 28, margin: "16px 0" }}>Something went wrong.</h1>
          <p style={{ color: "#c3ccda", lineHeight: 1.6 }}>
            The site hit an unexpected error. Please try again.
            {error.digest ? ` Reference: ${error.digest}` : ""}
          </p>
          <button
            type="button"
            onClick={reset}
            style={{ marginTop: 20, padding: "12px 20px", background: "#1769e0", color: "#fff", border: 0, borderRadius: 3, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", fontSize: 12, cursor: "pointer" }}
          >
            Try again
          </button>
        </main>
      </body>
    </html>
  );
}
