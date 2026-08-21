import React from "react";
import {
  Compass,
  Truck,
  TrendingUp,
  BookOpen,
  Sprout,
  ScanLine,
  Sparkles,
} from "lucide-react";

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { id: "decision", label: "Decision Engine", icon: Compass },
    { id: "freight", label: "Freight & Logistics", icon: Truck },
    { id: "analytics", label: "Mandi Analytics", icon: TrendingUp },
    { id: "khata", label: "Kisan Khata & Stock", icon: BookOpen },
    { id: "crop", label: "Crop Planner", icon: Sprout },
    { id: "ocr", label: "Price Board Scanner", icon: ScanLine },
  ];

  return (
    <header className="bg-[#1A2E1A] border-b border-[#2C482C] text-white backdrop-blur-md sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Logo & Brand */}
          <div
            className="flex items-center gap-2.5 cursor-pointer select-none"
            onClick={() => setActiveTab("decision")}
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#22C55E] to-[#15803D] flex items-center justify-center shadow text-white font-black text-base">
              🌾
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-extrabold text-white tracking-tight">
                  Vruti<span className="text-[#4ADE80]">Kisan</span>
                </span>
                <span className="bg-[#274827] text-[#86EFAC] border border-[#3B663B] text-[9px] font-bold px-1.5 py-0.2 rounded tracking-wider uppercase">
                  Agri-Commerce
                </span>
              </div>
              <p className="text-[10px] text-[#A6BCA6] hidden sm:block">
                Smart Farmer-to-Market Decision Platform
              </p>
            </div>
          </div>

          {/* Desktop Navigation Tabs */}
          <nav className="hidden lg:flex items-center gap-1 bg-[#122312] p-1 rounded-lg border border-[#2B472B]">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-btn-${item.id}`}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? "bg-[#4ADE80] text-[#0E230E] shadow-xs font-bold"
                      : "text-[#A9BEA9] hover:text-white hover:bg-[#254225]"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Live Status & Quick Action */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 px-2.5 py-1 rounded-md bg-[#122312] border border-[#2B472B] text-xs text-[#CBDBCB]">
              <span className="w-2 h-2 rounded-full bg-[#4ADE80] animate-pulse" />
              <span className="text-[10px] text-[#A6BCA6]">Mandi Rates</span>
              <span className="font-bold text-[#4ADE80] text-[11px]">Live & Synced</span>
            </div>
          </div>
        </div>

        {/* Mobile Horizontal Scrolling Tabs */}
        <div className="lg:hidden flex items-center gap-1 overflow-x-auto py-1.5 border-t border-[#2B472B] no-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                  isActive
                    ? "bg-[#4ADE80] text-[#0E230E] font-bold"
                    : "text-[#A9BEA9] hover:text-white bg-[#122312]"
                }`}
              >
                <Icon className="w-3 h-3" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
