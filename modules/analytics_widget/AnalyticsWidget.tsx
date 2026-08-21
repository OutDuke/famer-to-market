"use client";

import React, { useState } from "react";
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  Area,
} from "recharts";
import { TrendingUp, TrendingDown, ArrowUpDown, Calendar, Sparkles } from "lucide-react";

export interface MandiDataPoint {
  date: string;
  modalPrice: number;
  minPrice?: number;
  maxPrice?: number;
  AzadpurMandi?: number;
  LocalDistrictMandi?: number;
  RegionalHubMandi?: number;
  arrivalVolumeTonnes?: number;
  [key: string]: any;
}

export interface AnalyticsWidgetProps {
  data: {
    crop?: string;
    mandi?: string;
    unit?: string;
    currentPrice?: number;
    change7dPercent?: number;
    volatilityIndex?: string;
    sellingRecommendation?: string;
    timeSeries: MandiDataPoint[];
  };
  title?: string;
  className?: string;
  showVolume?: boolean;
  onRefresh?: () => void;
}

export const AnalyticsWidget: React.FC<AnalyticsWidgetProps> = ({
  data,
  title = "7-Day Mandi Price Trend & Volatility Intelligence",
  className = "",
  showVolume = true,
}) => {
  const [activeMetric, setActiveMetric] = useState<"prices" | "volume">("prices");

  const {
    crop = "Produce",
    mandi = "Regional APMC",
    unit = "Rs/Quintal",
    currentPrice = 0,
    change7dPercent = 0,
    volatilityIndex = "Normal",
    sellingRecommendation,
    timeSeries = [],
  } = data || {};

  const isPositive = (change7dPercent || 0) >= 0;

  // Custom high-contrast tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 border border-slate-700 text-white p-3 rounded-xl shadow-2xl text-xs space-y-1.5 backdrop-blur-md">
          <div className="font-semibold text-slate-300 flex items-center gap-1.5 pb-1 border-b border-slate-800">
            <Calendar className="w-3.5 h-3.5 text-blue-400" />
            <span>{label}</span>
          </div>
          {(payload || []).map((entry: any, index: number) => (
            <div key={`tooltip-${index}`} className="flex items-center justify-between gap-4 text-slate-300">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
                <span className="capitalize">{entry.name}:</span>
              </span>
              <span className="font-bold text-white">
                {entry.name.includes("Volume") ? `${entry.value} Tonnes` : `₹${entry.value.toLocaleString()}`}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div
      id="analytics-widget-root"
      className={`bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 rounded-2xl p-5 shadow-xs text-slate-900 dark:text-slate-100 ${className}`}
    >
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-700/60">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800 rounded-md">
              Market Intelligence
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {crop} • {mandi}
            </span>
          </div>
          <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white mt-1">{title}</h3>
        </div>

        {/* Action Toggle Pills */}
        <div className="flex items-center gap-2">
          <div className="flex bg-slate-100 dark:bg-slate-900 p-1 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setActiveMetric("prices")}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                activeMetric === "prices"
                  ? "bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-xs"
                  : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Prices & Spread
            </button>
            <button
              onClick={() => setActiveMetric("volume")}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                activeMetric === "volume"
                  ? "bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-xs"
                  : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Arrival Volumes
            </button>
          </div>
        </div>
      </div>

      {/* Metric Highlight Summary Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
        <div className="bg-slate-50 dark:bg-slate-900/60 p-3 rounded-xl border border-slate-200 dark:border-slate-700/60">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Current Modal Rate</span>
          <div className="text-lg sm:text-xl font-black text-slate-900 dark:text-white mt-0.5">
            ₹{currentPrice.toLocaleString()}{" "}
            <span className="text-xs font-normal text-slate-500 dark:text-slate-400">/ Q</span>
          </div>
        </div>

        <div className="bg-slate-50 dark:bg-slate-900/60 p-3 rounded-xl border border-slate-200 dark:border-slate-700/60">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">7-Day Trajectory</span>
          <div
            className={`text-lg sm:text-xl font-black mt-0.5 flex items-center gap-1 ${
              isPositive ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
            }`}
          >
            {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            <span>
              {isPositive ? "+" : ""}
              {change7dPercent}%
            </span>
          </div>
        </div>

        <div className="bg-slate-50 dark:bg-slate-900/60 p-3 rounded-xl border border-slate-200 dark:border-slate-700/60">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Volatility Profile</span>
          <div className="text-xs sm:text-sm font-bold text-amber-600 dark:text-amber-400 mt-1 flex items-center gap-1">
            <ArrowUpDown className="w-4 h-4" />
            <span className="truncate">{volatilityIndex}</span>
          </div>
        </div>

        <div className="bg-slate-50 dark:bg-slate-900/60 p-3 rounded-xl border border-slate-200 dark:border-slate-700/60">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Dispatch Window</span>
          <div className="text-xs sm:text-sm font-bold text-blue-600 dark:text-blue-400 mt-1 flex items-center gap-1">
            <Sparkles className="w-4 h-4" />
            <span>Optimal Next 48h</span>
          </div>
        </div>
      </div>

      {/* Main Interactive Recharts Stage */}
      <div className="h-60 sm:h-68 w-full mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={timeSeries} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#94A3B8" strokeOpacity={0.2} vertical={false} />
            <XAxis
              dataKey="date"
              stroke="#64748B"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: "#CBD5E1" }}
            />
            <YAxis
              stroke="#64748B"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              domain={["auto", "auto"]}
              tickFormatter={(val) => `₹${val}`}
            />
            {showVolume && (
              <YAxis
                yAxisId="right"
                orientation="right"
                stroke="#64748B"
                fontSize={10}
                tickLine={false}
                axisLine={false}
                tickFormatter={(val) => `${val}T`}
              />
            )}
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "6px" }} />

            {activeMetric === "volume" ? (
              <Bar
                dataKey="arrivalVolumeTonnes"
                name="Arrival Volume (Tonnes)"
                fill="#10B981"
                radius={[4, 4, 0, 0]}
                opacity={0.85}
              />
            ) : (
              <>
                <Area
                  type="monotone"
                  dataKey="maxPrice"
                  name="Price Ceiling Band"
                  fill="#3B82F6"
                  fillOpacity={0.08}
                  stroke="none"
                />
                <Line
                  type="monotone"
                  dataKey="AzadpurMandi"
                  name="Azadpur APMC (Benchmark)"
                  stroke="#2563EB"
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: "#2563EB" }}
                  activeDot={{ r: 5 }}
                />
                <Line
                  type="monotone"
                  dataKey="LocalDistrictMandi"
                  name="Local District Mandi"
                  stroke="#0D9488"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  dot={{ r: 2 }}
                />
                <Line
                  type="monotone"
                  dataKey="RegionalHubMandi"
                  name="Regional Hub (Vashi/Kolkata)"
                  stroke="#D97706"
                  strokeWidth={2}
                  dot={{ r: 2 }}
                />
              </>
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Selling Advisory Banner */}
      {sellingRecommendation && (
        <div className="mt-4 p-3 bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60 rounded-xl flex items-start gap-2 text-xs text-blue-900 dark:text-blue-200">
          <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
          <div>
            <strong className="font-bold">AI Mandi Strategy: </strong>
            <span>{sellingRecommendation}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalyticsWidget;
