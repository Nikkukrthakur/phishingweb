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
        `http://localhost:8000/predict?url=${encodeURIComponent(url)}`
      );

      const data = await res.json();
      console.log("API Response:", data);

      setResult(data);
    } catch (error) {
      console.error("Error:", error);
    }

    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-gray-950 text-white flex flex-col items-center px-4 py-12">

      {/* Heading */}
      <h1 className="text-4xl font-bold mb-2 text-center">
        Website Security Scanner
      </h1>
      <p className="text-gray-400 mb-8 text-center">
        Analyze any website URL using AI-powered phishing detection
      </p>

      {/* Input Box */}
      <div className="w-full max-w-2xl flex gap-3">
        <input
          type="text"
          placeholder="Enter website URL..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="flex-1 p-4 rounded-xl bg-gray-800 border border-gray-700 focus:outline-none"
        />

        <button
          onClick={handleScan}
          className="px-6 py-4 bg-blue-600 rounded-xl hover:bg-blue-700 transition"
        >
          {loading ? "Scanning..." : "Scan"}
        </button>
      </div>

      {/* Result Section */}
      {result && (
        <div className="mt-10 w-full max-w-2xl bg-gray-900 p-6 rounded-2xl border border-gray-700 shadow-lg">

          {/* Status */}
          <h2
            className={`text-2xl font-bold mb-3 ${
              result.prediction === "Phishing"
                ? "text-red-500"
                : "text-green-500"
            }`}
          >
            {result.prediction}
          </h2>

          {/* Risk Score */}
          <p className="mb-4">
            Risk Score:{" "}
            <span className="font-bold">
              {(result.risk_score * 100).toFixed(2)}%
            </span>
          </p>

          {/* Issues (optional) */}
          <div>
            <h3 className="font-semibold mb-2">Detected Issues:</h3>
            <ul className="list-disc ml-5 text-gray-300">
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
    </main>
  );
}