"use client";

import { useState } from "react";

export default function ScanPage() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleScan = async () => {
    if (!url) return;

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch(
        `http://localhost:8000/predict?url=${encodeURIComponent(url)}`,
      );
      const data = await res.json();
      setResult(data);
    } catch (error) {
      console.error(error);
    }

    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-linear-to-br from-gray-950 via-blue-950 to-gray-900 text-white flex flex-col items-center px-4 py-12">
      {/* Heading */}
      <h1 className="text-4xl font-bold mb-2 text-center">
        🔍 Website Security Scanner
      </h1>
      <p className="text-gray-400 mb-10 text-center max-w-xl">
        Analyze any website URL using AI-powered phishing detection and get
        real-time risk insights.
      </p>

      {/* Input Card */}
      <div className="w-full max-w-2xl bg-white/5 backdrop-blur-lg border border-white/10 p-4 rounded-2xl flex gap-3 shadow-xl">
        <input
          type="text"
          placeholder="Enter website URL..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="flex-1 p-4 rounded-xl bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          onClick={handleScan}
          className="px-6 py-4 bg-blue-600 rounded-xl hover:bg-blue-700 transition font-semibold"
        >
          {loading ? "Scanning..." : "Scan"}
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <div className="mt-6 text-blue-400 animate-pulse">
          🔄 Scanning URL, please wait...
        </div>
      )}

      {/* Result Section */}
      {result && (
        <div className="mt-10 w-full max-w-2xl bg-white/5 backdrop-blur-lg p-6 rounded-2xl border border-white/10 shadow-xl">
          {/* Status */}
          <h2
            className={`text-2xl font-bold mb-3 ${
              result.prediction === "Phishing"
                ? "text-red-500"
                : "text-green-500"
            }`}
          >
            {result.prediction === "Phishing"
              ? "⚠️ Phishing Detected"
              : "✅ Safe Website"}
          </h2>

          {/* Risk Bar */}
          <div className="w-full bg-gray-700 rounded-full h-3 mb-4">
            <div
              className={`h-3 rounded-full ${
                result.prediction === "Phishing" ? "bg-red-500" : "bg-green-500"
              }`}
              style={{ width: `${result.risk_score * 100}%` }}
            ></div>
          </div>

          {/* Risk Score */}
          <p className="mb-4">
            Risk Score:{" "}
            <span className="font-bold text-lg">
              {(result.risk_score * 100).toFixed(2)}%
            </span>
          </p>

          <div>
            <h3 className="font-semibold mb-2 text-blue-400">
              🔍 Detected Issues:
            </h3>

            <ul className="list-disc ml-5 text-gray-300 space-y-1">
              {result.issues && result.issues.length > 0 ? (
                result.issues.map((issue: string, index: number) => (
                  <li key={index}>{issue}</li>
                ))
              ) : (
                <li>No major issues detected</li>
              )}
            </ul>
          </div>
        </div>
      )}

      {/* Features */}
      <div className="mt-12 flex gap-6 text-gray-400 text-sm flex-wrap justify-center">
        <span>⚡ Instant Detection</span>
        <span>🔒 Secure Analysis</span>
        <span>📊 Smart Risk Scoring</span>
      </div>
    </main>
  );
}
