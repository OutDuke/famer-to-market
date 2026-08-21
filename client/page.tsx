"use client";

import React, { useState, useEffect } from "react";
import { AnalyticsWidget } from "../modules/analytics_widget/AnalyticsWidget";
import {
  Navigation,
  Truck,
  TrendingUp,
  BookOpen,
  Sprout,
  ScanLine,
  Layers,
  ArrowRight,
  ShieldCheck,
  Zap,
} from "lucide-react";

export default function FarmerPlatformPage() {
  const [activeTab, setActiveTab] = useState<"decision" | "freight" | "analytics" | "khata" | "crop" | "ocr">("decision");
  const [selectedCrop, setSelectedCrop] = useState("Tomato");

  // Sample data simulating the output of /modules/analytics_widget
  const [analyticsData, setAnalyticsData] = useState({
    crop: "Tomato",
    mandi: "Azadpur APMC",
    unit: "Rs / Quintal",
    currentPrice: 2450,
    change7dPercent: 4.8,
    volatilityIndex: "Moderate (±4.8%)",
    sellingRecommendation: "High wholesale demand in Delhi hub. Net realized price higher by ₹180/Q even after 125km freight.",
    timeSeries: [
      { date: "Mon", modalPrice: 2100, AzadpurMandi: 2100, LocalDistrictMandi: 1950, arrivalVolumeTonnes: 90 },
      { date: "Tue", modalPrice: 2200, AzadpurMandi: 2200, LocalDistrictMandi: 2020, arrivalVolumeTonnes: 110 },
      { date: "Wed", modalPrice: 2180, AzadpurMandi: 2180, LocalDistrictMandi: 2000, arrivalVolumeTonnes: 95 },
      { date: "Thu", modalPrice: 2320, AzadpurMandi: 2320, LocalDistrictMandi: 2150, arrivalVolumeTonnes: 85 },
      { date: "Fri", modalPrice: 2400, AzadpurMandi: 2400, LocalDistrictMandi: 2220, arrivalVolumeTonnes: 75 },
      { date: "Sat", modalPrice: 2420, AzadpurMandi: 2420, LocalDistrictMandi: 2250, arrivalVolumeTonnes: 70 },
      { date: "Today", modalPrice: 2450, AzadpurMandi: 2450, LocalDistrictMandi: 2280, arrivalVolumeTonnes: 68 },
    ],
  });

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-10 font-sans">
      <header className="max-w-7xl mx-auto mb-8 border-b border-slate-800 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 text-sm font-semibold tracking-wide uppercase">
            <Zap className="w-4 h-4" />
            <span>Hackathon AgriTech Platform</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white mt-1">
            Farmer-to-Market Decision Platform
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Unified platform orchestrating 5 isolated plug-and-play microservices.
          </p>
        </div>

        {/* Modules Navigation */}
        <nav className="flex flex-wrap bg-slate-900 border border-slate-800 p-1.5 rounded-xl gap-1">
          {[
            { id: "decision", label: "Executive Decision", icon: Zap },
            { id: "freight", label: "Freight Estimator", icon: Truck },
            { id: "analytics", label: "Mandi Analytics", icon: TrendingUp },
            { id: "khata", label: "Kisan Khata", icon: BookOpen },
            { id: "crop", label: "Crop Planner", icon: Sprout },
            { id: "ocr", label: "Mandi Board OCR", icon: ScanLine },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-emerald-500 text-slate-950 shadow-md"
                    : "text-slate-300 hover:text-white hover:bg-slate-800"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </header>

      {/* Main Content Area */}
      <section className="max-w-7xl mx-auto">
        {activeTab === "analytics" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Isolated Module 2: Mandi Price Analytics Widget</h2>
              <span className="text-xs bg-slate-800 text-emerald-400 px-2.5 py-1 rounded-full border border-slate-700">
                /modules/analytics_widget
              </span>
            </div>
            <AnalyticsWidget data={analyticsData} />
          </div>
        )}

        {activeTab === "decision" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                <h3 className="text-lg font-bold text-white mb-2">
                  Unified Arbitrage Decision Engine
                </h3>
                <p className="text-slate-400 text-sm mb-4">
                  Computes Net Farmer Realization = (Mandi Price × Qty) - Haversine Freight - Handling Charges.
                </p>
                <AnalyticsWidget data={analyticsData} />
              </div>
            </div>

            {/* Side summary */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
              <h3 className="text-base font-bold text-white">Optimal Mandi Route</h3>
              <div className="p-4 bg-emerald-950/40 border border-emerald-800/60 rounded-lg">
                <div className="text-xs text-emerald-400 font-semibold uppercase">Top Recommendation</div>
                <div className="text-xl font-bold text-emerald-200 mt-1">Azadpur APMC (Delhi)</div>
                <div className="text-xs text-slate-300 mt-2">
                  Net Profit: <strong className="text-white">₹58,450</strong> (₹4,200 higher than Local Mandi)
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
