import React, { useState, useEffect } from "react";
import { TrendingUp, RefreshCw, BarChart3, ArrowUpDown, Filter, Sparkles } from "lucide-react";
import { AnalyticsWidget } from "../../modules/analytics_widget/AnalyticsWidget";
import { COMMODITIES_LIST } from "../data/mockData";
import { MandiAnalyticsData } from "../types";

export const MandiAnalytics: React.FC = () => {
  const [selectedCrop, setSelectedCrop] = useState("Tomato");
  const [selectedMandi, setSelectedMandi] = useState("Azadpur APMC (Delhi)");
  const [analyticsData, setAnalyticsData] = useState<MandiAnalyticsData | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/analytics/mandi-trends?crop=${selectedCrop}&mandi=${encodeURIComponent(selectedMandi)}`);
      const data = await res.json();
      setAnalyticsData(data);
    } catch (err) {
      console.error("Failed to load analytics:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [selectedCrop, selectedMandi]);

  return (
    <div className="space-y-5">
      {/* Mandi Analytics Header */}
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 rounded-2xl p-4 sm:p-6 shadow-xs relative overflow-hidden text-slate-900 dark:text-slate-100">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                Wholesale Price Velocity
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                7-Day Price Trends & Volatility Tracker
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">
              Local Mandi Price & Volatility Analytics
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed">
              Real-time modal price tracking across primary wholesale yards and regional trading hubs. Evaluates arrival volume spikes to forecast optimal 24-48h farmer dispatch windows.
            </p>
          </div>

          {/* Quick Crop Selector Pills */}
          <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 dark:bg-slate-900 p-1.5 rounded-xl border border-slate-200 dark:border-slate-700">
            {COMMODITIES_LIST.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCrop(c.id)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  selectedCrop === c.id
                    ? "bg-emerald-600 text-white shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800"
                }`}
              >
                {c.name.split(" ")[0]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Standalone AnalyticsWidget */}
      {analyticsData && (
        <div className="space-y-5">
          <AnalyticsWidget
            data={analyticsData}
            title={`${selectedCrop} • 7-Day Market Trend & Hub Spreads`}
            onRefresh={fetchAnalytics}
          />

          {/* Multi-Mandi Arbitrage Spread Table */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 rounded-2xl p-4 sm:p-6 shadow-xs text-slate-900 dark:text-slate-100">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white">
                  Regional Mandi Arbitrage & Price Dispersion Matrix
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Compare today's live wholesale modal prices across north & west Indian trading terminals.
                </p>
              </div>
              <button
                onClick={fetchAnalytics}
                className="px-3 py-1.5 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-750 border border-slate-200 dark:border-slate-700 rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer font-bold"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
                <span>Sync Rates</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left min-w-[650px]">
                <thead className="bg-slate-50 dark:bg-slate-900/60 text-slate-500 dark:text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="py-2.5 px-3">Wholesale Mandi</th>
                    <th className="py-2.5 px-3">State</th>
                    <th className="py-2.5 px-3">Modal Price (₹/Q)</th>
                    <th className="py-2.5 px-3">Daily Min / Max Band</th>
                    <th className="py-2.5 px-3">Arrival Volume</th>
                    <th className="py-2.5 px-3">Arbitrage vs Benchmark</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60 text-slate-800 dark:text-slate-200">
                  <tr className="hover:bg-slate-50 dark:hover:bg-slate-750">
                    <td className="py-2.5 px-3 font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span>Azadpur APMC (Delhi Hub)</span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-500 dark:text-slate-400">Delhi NCR</td>
                    <td className="py-2.5 px-3 font-bold text-emerald-600 dark:text-emerald-400">₹{analyticsData.currentPrice}</td>
                    <td className="py-2.5 px-3 text-slate-500 dark:text-slate-400">
                      ₹{Math.round(analyticsData.currentPrice * 0.88)} - ₹{Math.round(analyticsData.currentPrice * 1.12)}
                    </td>
                    <td className="py-2.5 px-3 text-slate-800 dark:text-slate-200">68 Tonnes (Active)</td>
                    <td className="py-2.5 px-3 text-emerald-600 dark:text-emerald-400 font-bold">Benchmark (0%)</td>
                  </tr>

                  <tr className="hover:bg-slate-50 dark:hover:bg-slate-750">
                    <td className="py-2.5 px-3 font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-blue-500" />
                      <span>Local District Mandi (Sonipat/Karnal)</span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-500 dark:text-slate-400">Haryana</td>
                    <td className="py-2.5 px-3 font-bold text-slate-900 dark:text-white">
                      ₹{Math.round(analyticsData.currentPrice * 0.91)}
                    </td>
                    <td className="py-2.5 px-3 text-slate-500 dark:text-slate-400">
                      ₹{Math.round(analyticsData.currentPrice * 0.82)} - ₹{Math.round(analyticsData.currentPrice * 0.98)}
                    </td>
                    <td className="py-2.5 px-3 text-slate-800 dark:text-slate-200">42 Tonnes</td>
                    <td className="py-2.5 px-3 text-rose-600 dark:text-rose-400 font-bold">
                      -₹{Math.round(analyticsData.currentPrice * 0.09)} (-9%)
                    </td>
                  </tr>

                  <tr className="hover:bg-slate-50 dark:hover:bg-slate-750">
                    <td className="py-2.5 px-3 font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-amber-500" />
                      <span>Vashi APMC (Navi Mumbai Terminal)</span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-500 dark:text-slate-400">Maharashtra</td>
                    <td className="py-2.5 px-3 font-bold text-amber-600 dark:text-amber-400">
                      ₹{Math.round(analyticsData.currentPrice * 1.06)}
                    </td>
                    <td className="py-2.5 px-3 text-slate-500 dark:text-slate-400">
                      ₹{Math.round(analyticsData.currentPrice * 0.95)} - ₹{Math.round(analyticsData.currentPrice * 1.20)}
                    </td>
                    <td className="py-2.5 px-3 text-slate-800 dark:text-slate-200">185 Tonnes</td>
                    <td className="py-2.5 px-3 text-emerald-600 dark:text-emerald-400 font-bold">
                      +₹{Math.round(analyticsData.currentPrice * 0.06)} (+6%)
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
