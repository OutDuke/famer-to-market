import React from "react";
import {
  Compass,
  Truck,
  TrendingUp,
  BookOpen,
  Sprout,
  ScanLine,
} from "lucide-react";

interface BottomFeatureDockProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const BottomFeatureDock: React.FC<BottomFeatureDockProps> = ({
  activeTab,
  setActiveTab,
}) => {
  const featureTabs = [
    { id: "decision", label: "Arbitrage", icon: Compass },
    { id: "freight", label: "Freight", icon: Truck },
    { id: "analytics", label: "Trends", icon: TrendingUp },
    { id: "khata", label: "Khata", icon: BookOpen },
    { id: "crop", label: "Planner", icon: Sprout },
    { id: "ocr", label: "Scanner", icon: ScanLine },
  ];

  return (
    <nav
      id="bottom-mobile-nav"
      aria-label="Mobile Navigation"
      className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 px-1 py-1 shadow-lg"
    >
      <div className="flex items-center justify-around gap-0.5 max-w-md mx-auto">
        {featureTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl text-[10px] font-bold transition-all cursor-pointer flex-1 min-w-0 ${
                isActive
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
              title={tab.label}
            >
              <Icon
                className={`w-4 h-4 mb-0.5 shrink-0 transition-transform ${
                  isActive ? "text-white scale-105" : "text-slate-500 dark:text-slate-400"
                }`}
              />
              <span className="truncate w-full text-center leading-none text-[9px]">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
