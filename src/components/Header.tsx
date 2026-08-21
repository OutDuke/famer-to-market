import React from "react";
import {
  Menu,
  FileBadge,
  ShieldCheck,
  Maximize2,
  Minimize2,
  TrendingUp,
} from "lucide-react";
import { useFarmerAuth } from "../context/FarmerAuthContext";

interface HeaderProps {
  activeTab: string;
  onOpenSidebar: () => void;
  isWideMode: boolean;
  setIsWideMode: (wide: boolean) => void;
}

const TAB_TITLES: Record<string, { title: string; subtitle: string; tag: string; tagColor: string }> = {
  decision: {
    title: "Market Decision Engine",
    subtitle: "Real-time multi-mandi arbitrage & net payout calculator",
    tag: "Arbitrage",
    tagColor: "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800",
  },
  freight: {
    title: "Freight & Logistics Estimator",
    subtitle: "Haversine distance, diesel surcharge & per-quintal transit math",
    tag: "Logistics",
    tagColor: "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800",
  },
  analytics: {
    title: "Mandi Price Velocity & Trends",
    subtitle: "7-day wholesale modal rate charts & volatility forecasts",
    tag: "Analytics",
    tagColor: "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800",
  },
  khata: {
    title: "Kisan Khata & Stock Ledger",
    subtitle: "Farm godown inventory, trader credit limits & payment receipts",
    tag: "Ledger",
    tagColor: "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800",
  },
  crop: {
    title: "Agro-Climatic Crop Planner",
    subtitle: "Soil & climate-calibrated sowing and profitability models",
    tag: "Agronomy",
    tagColor: "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800",
  },
  ocr: {
    title: "Price Board Vision OCR",
    subtitle: "APMC blackboard & handwritten trade slip digitizer",
    tag: "Vision AI",
    tagColor: "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800",
  },
};

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onOpenSidebar,
  isWideMode,
  setIsWideMode,
}) => {
  const { currentFarmer, setIsCardModalOpen } = useFarmerAuth();
  const currentTabInfo = TAB_TITLES[activeTab] || TAB_TITLES.decision;

  return (
    <header className="sticky top-0 z-30 bg-white/90 dark:bg-[#0F172A]/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="w-full mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
        {/* Left: Mobile Menu Trigger + Tab Title */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onOpenSidebar}
            className="lg:hidden p-2 rounded-xl text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer shrink-0"
            aria-label="Open Navigation Sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white tracking-tight truncate">
                {currentTabInfo.title}
              </h1>
              <span
                className={`hidden md:inline-block text-[10px] font-bold px-2 py-0.5 rounded-full border ${currentTabInfo.tagColor}`}
              >
                {currentTabInfo.tag}
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 truncate hidden sm:block">
              {currentTabInfo.subtitle}
            </p>
          </div>
        </div>

        {/* Right Controls: Live Mandi Ticker Pill, Verified KPP Badge & Wide Layout Toggle */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* APMC Ticker Pill (Hidden on smallest screens) */}
          <div className="hidden md:flex items-center gap-2 bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded-xl text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping shrink-0" />
            <span className="text-slate-600 dark:text-slate-400 font-medium">Azadpur Tomato:</span>
            <span className="font-mono font-extrabold text-emerald-600 dark:text-emerald-400">₹2,140/Q</span>
            <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded-md">
              +4.8%
            </span>
          </div>

          {/* Kisan Smart ID Pill */}
          <div
            onClick={() => setIsCardModalOpen(true)}
            className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 px-2.5 sm:px-3 py-1.5 rounded-xl cursor-pointer hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-colors shadow-2xs"
            title="View Official Kisan Pehchaan Patra (KPP)"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <div className="text-left hidden xs:block sm:block">
              <span className="text-[9px] uppercase font-mono font-bold text-emerald-700 dark:text-emerald-400 block leading-none">
                AgriStack Verified
              </span>
              <span className="text-xs font-black text-slate-900 dark:text-white truncate block">
                {currentFarmer?.name?.split(" ")[0] || "Farmer"}
              </span>
            </div>
            <FileBadge className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
          </div>

          {/* Desktop Full-Width / Standard Max-Width Toggle */}
          <button
            onClick={() => setIsWideMode(!isWideMode)}
            className="hidden xl:flex p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            title={isWideMode ? "Switch to Standard Centered Width" : "Expand to Full-Width Canvas"}
          >
            {isWideMode ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </header>
  );
};
