"use client";

import { useState } from "react";

export default function Home() {
  const [url, setUrl] = useState("");
  const [detectedFeatures, setDetectedFeatures] = useState<string[]>([]);

  const riskFactors = [
    {
      icon: "🔗",
      title: "Suspicious URL Structure",
      description:
        "Unusual or overly long URLs often indicate phishing attempts.",
      color: "text-red-500",
    },
    {
      icon: "🔒",
      title: "Missing HTTPS",
      description:
        "Websites without HTTPS encryption are less secure and more risky.",
      color: "text-blue-500",
    },
    {
      icon: "⚠️",
      title: "Special Characters",
      description:
        "Presence of symbols like '@' or '-' can indicate malicious intent.",
      color: "text-yellow-500",
    },
    {
      icon: "🌐",
      title: "IP Address Usage",
      description:
        "Using IP addresses instead of domain names is a common phishing trick.",
      color: "text-purple-500",
    },
    {
      icon: "📝",
      title: "Suspicious Keywords",
      description:
        "Words like 'login', 'verify', and 'secure' are often used in phishing URLs.",
      color: "text-green-500",
    },
    {
      icon: "📊",
      title: "Domain Behavior",
      description:
        "New or untrusted domains are more likely to be malicious.",
      color: "text-orange-500",
    },
  ];

  // 🔥 Simple Feature Extraction Logic (Demo)
  const analyzeURL = () => {
    let features: string[] = [];

    if (!url.startsWith("https")) {
      features.push("Missing HTTPS");
    }

    if (url.length > 40) {
      features.push("Suspicious URL Structure");
    }

    if (url.includes("@") || url.includes("-")) {
      features.push("Special Characters");
    }

    if (/\d+\.\d+\.\d+\.\d+/.test(url)) {
      features.push("IP Address Usage");
    }

    const keywords = ["login", "verify", "secure", "update", "account"];
    if (keywords.some((word) => url.toLowerCase().includes(word))) {
      features.push("Suspicious Keywords");
    }

    setDetectedFeatures(features);
  };

  return (
    <main className="min-h-screen bg-gray-100 px-6 py-12 flex flex-col items-center">
      
      {/* Heading */}
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 text-center">
        AI Phishing Detection Platform
      </h1>

      <p className="text-gray-600 text-center max-w-2xl mt-4 mb-8">
        Enter a website URL to analyze potential phishing threats using AI-powered detection.
      </p>

      {/* Input */}
      <div className="flex gap-3 w-full max-w-xl mb-10">
        <input
          type="text"
          placeholder="Enter URL..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="flex-1 p-3 rounded-xl border border-gray-300 focus:outline-none"
        />
        <button
          onClick={analyzeURL}
          className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
        >
          Scan
        </button>
      </div>

      {/* Cards */}
      <div className="w-full max-w-7xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {riskFactors.map((factor, index) => {
          const isActive = detectedFeatures.includes(factor.title);

          return (
            <div
              key={index}
              className={`group rounded-2xl p-6 transition duration-300 border
              ${
                isActive
                  ? "bg-red-50 border-red-400 shadow-lg"
                  : "bg-white border-gray-200 shadow-sm hover:shadow-xl hover:-translate-y-1"
              }`}
            >
              {/* Icon */}
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-100 mb-4">
                <span className={`text-2xl ${factor.color}`}>
                  {factor.icon}
                </span>
              </div>

              {/* Title */}
              <h3 className="text-lg font-semibold text-gray-900">
                {factor.title}
              </h3>

              {/* Description */}
              <p className="text-gray-600 text-sm mt-2 leading-relaxed">
                {factor.description}
              </p>

              {/* Highlight */}
              {isActive && (
                <p className="text-red-600 text-xs mt-3 font-medium">
                  ⚠ Detected in this URL
                </p>
              )}
            </div>
          );
        })}
      </div>
    </main>
  );
}