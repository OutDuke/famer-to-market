import React, { useState } from "react";
import {
  Compass,
  Truck,
  TrendingUp,
  BookOpen,
  Sprout,
  ScanLine,
  UserCheck,
  ChevronLeft,
  ChevronRight,
  FileBadge,
  Sparkles,
  MapPin,
  X,
  User,
  Settings,
  HelpCircle,
  Info,
  Sun,
  Moon,
  Eye,
  Rocket,
  Calculator,
  Radio,
  PhoneCall,
  Activity,
} from "lucide-react";
import { useFarmerAuth } from "../context/FarmerAuthContext";
import { useAppSettings } from "../context/AppSettingsContext";
import { UnitConverterModal } from "./UnitConverterModal";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  isOpen,
  setIsOpen,
  isCollapsed,
  setIsCollapsed,
}) => {
  const { currentFarmer, setIsAuthModalOpen, setIsCardModalOpen } = useFarmerAuth();
  const {
    settings,
    setTheme,
    setIsAccountModalOpen,
    setIsSettingsModalOpen,
    setIsHelpModalOpen,
    setIsVersionModalOpen,
    setIsOnboardingOpen,
  } = useAppSettings();

  const [isConverterOpen, setIsConverterOpen] = useState(false);

  const navigationItems = [
    {
      category: "MARKET INTELLIGENCE",
      items: [
        {
          id: "decision",
          label: "Decision Engine",
          desc: "Multi-mandi arbitrage matrix",
          icon: Compass,
          accent: "text-emerald-600 dark:text-emerald-400",
          activeBg: "bg-emerald-600 text-white shadow-md shadow-emerald-600/20",
          badge: "Core",
          badgeColor: "bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-700",
        },
        {
          id: "freight",
          label: "Freight & Logistics",
          desc: "Per-quintal transit math",
          icon: Truck,
          accent: "text-emerald-600 dark:text-emerald-400",
          activeBg: "bg-emerald-600 text-white shadow-md shadow-emerald-600/20",
        },
        {
          id: "analytics",
          label: "Mandi Analytics",
          desc: "7-day wholesale price trends",
          icon: TrendingUp,
          accent: "text-emerald-600 dark:text-emerald-400",
          activeBg: "bg-emerald-600 text-white shadow-md shadow-emerald-600/20",
        },
      ],
    },
    {
      category: "FARM MANAGEMENT",
      items: [
        {
          id: "khata",
          label: "Kisan Khata & Stock",
          desc: "Godown inventory & credit ledger",
          icon: BookOpen,
          accent: "text-emerald-600 dark:text-emerald-400",
          activeBg: "bg-emerald-600 text-white shadow-md shadow-emerald-600/20",
        },
        {
          id: "crop",
          label: "Crop Sowing Planner",
          desc: "Agro-climatic yield forecaster",
          icon: Sprout,
          accent: "text-emerald-600 dark:text-emerald-400",
          activeBg: "bg-emerald-600 text-white shadow-md shadow-emerald-600/20",
        },
        {
          id: "ocr",
          label: "Price Board Scanner",
          desc: "Blackboard & receipt digitizer",
          icon: ScanLine,
          accent: "text-emerald-600 dark:text-emerald-400",
          activeBg: "bg-emerald-600 text-white shadow-md shadow-emerald-600/20",
        },
      ],
    },
  ];

  return (
    <>
      <UnitConverterModal isOpen={isConverterOpen} onClose={() => setIsConverterOpen(false)} />

      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs lg:hidden transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 lg:z-30 flex flex-col bg-white dark:bg-[#0F172A] text-slate-900 dark:text-slate-100 border-r border-slate-200 dark:border-slate-800 transition-all duration-300 ease-in-out shadow-sm ${
          isCollapsed ? "w-20" : "w-72"
        } ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/70">
          <div
            className="flex items-center gap-3 cursor-pointer overflow-hidden"
            onClick={() => {
              setActiveTab("decision");
              setIsOpen(false);
            }}
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white font-black text-lg shadow-sm shrink-0">
              🌾
            </div>
            {!isCollapsed && (
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-base tracking-tight text-slate-900 dark:text-white">
                    Vruti<span className="text-emerald-600 dark:text-emerald-400">Kisan</span>
                  </span>
                  <span className="bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 text-[9px] font-bold px-1.5 py-0.5 rounded uppercase">
                    v2.4
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                  Farmer Arbitrage & Ledger
                </p>
              </div>
            )}
          </div>

          {/* Desktop Collapse Toggle */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex p-1.5 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>

          {/* Mobile Close Button */}
          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Authenticated Farmer Profile Card */}
        <div className="p-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40">
          {isCollapsed ? (
            <div
              onClick={() => setIsAccountModalOpen(true)}
              className="w-10 h-10 mx-auto rounded-full bg-emerald-600 text-white flex items-center justify-center font-extrabold text-xs cursor-pointer hover:ring-2 hover:ring-emerald-400 transition-all shadow-xs"
              title={`${currentFarmer?.name || "Farmer"} (Account)`}
            >
              {(currentFarmer?.name || "Kisan").substring(0, 2).toUpperCase()}
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-xl p-3 space-y-2 text-slate-800 dark:text-slate-200 shadow-2xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-mono font-bold text-emerald-700 dark:text-emerald-400 uppercase">
                    Kisan Pehchaan Patra
                  </span>
                </div>
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="text-[10px] text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 flex items-center gap-1 font-bold transition-colors cursor-pointer"
                >
                  <UserCheck className="w-3 h-3" />
                  <span>Switch</span>
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-extrabold text-xs text-slate-900 dark:text-white leading-tight">
                    {currentFarmer?.name || "Sukhwinder Singh"}
                  </h4>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span className="truncate">{currentFarmer?.district || "Ludhiana"}, {currentFarmer?.state || "Punjab"}</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 block">
                    {currentFarmer?.landAcres || 12} Ac
                  </span>
                  <span className="text-[9px] font-mono text-slate-400 block">
                    {currentFarmer?.khasraNumber || "112/5B"}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setIsCardModalOpen(true)}
                className="w-full bg-slate-50 hover:bg-slate-100 dark:bg-slate-900/60 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-[11px] font-bold py-1 px-2 rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
              >
                <FileBadge className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span className="font-mono text-[10px]">{currentFarmer?.kppNumber || "KPP-2024-PB-3401"}</span>
              </button>
            </div>
          )}
        </div>

        {/* Feature Navigation Tabs */}
        <div className="flex-1 overflow-y-auto py-3 px-2 space-y-4">
          {navigationItems.map((sec, idx) => (
            <div key={idx} className="space-y-1">
              {!isCollapsed && (
                <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  {sec.category}
                </div>
              )}
              <div className="space-y-1">
                {sec.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        setIsOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left transition-all cursor-pointer ${
                        isActive
                          ? item.activeBg
                          : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
                      }`}
                      title={isCollapsed ? item.label : undefined}
                    >
                      <Icon
                        className={`w-4 h-4 shrink-0 transition-transform ${
                          isActive ? "text-white scale-110" : item.accent
                        }`}
                      />
                      {!isCollapsed && (
                        <div className="flex-1 min-w-0 flex items-center justify-between">
                          <div>
                            <span className="text-xs font-bold block leading-tight">{item.label}</span>
                            <span
                              className={`text-[10px] block truncate ${
                                isActive ? "text-white/80" : "text-slate-400 dark:text-slate-500"
                              }`}
                            >
                              {item.desc}
                            </span>
                          </div>
                          {item.badge && (
                            <span
                              className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase border ${
                                isActive
                                  ? "bg-white/20 text-white border-white/30"
                                  : item.badgeColor
                              }`}
                            >
                              {item.badge}
                            </span>
                          )}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {/* ESSENTIAL FARMER UTILITIES & TOOLS */}
          <div className="space-y-1 pt-2 border-t border-slate-200 dark:border-slate-800">
            {!isCollapsed && (
              <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                FARM TOOLS & FEEDS
              </div>
            )}

            {/* Quick Unit Converter Tool */}
            <button
              onClick={() => {
                setIsConverterOpen(true);
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title="Kisan Unit Converter"
            >
              <Calculator className="w-4 h-4 text-blue-500 shrink-0" />
              {!isCollapsed && (
                <div className="flex-1 min-w-0">
                  <span className="text-xs font-bold block leading-tight">Field Unit Converter</span>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 block truncate">Quintal, Acre, Diesel calc</span>
                </div>
              )}
            </button>

            {/* Live APMC Mandi Feeds Status */}
            {!isCollapsed && (
              <div className="mx-2 my-1.5 p-2.5 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800 text-[11px] space-y-1.5">
                <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 font-semibold text-[10px]">
                  <span className="flex items-center gap-1.5">
                    <Radio className="w-3 h-3 text-emerald-500 animate-pulse" />
                    <span>Live Mandi Connectivity</span>
                  </span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">Connected</span>
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-600 dark:text-slate-400">
                  <span>Azadpur (Delhi)</span>
                  <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">14ms</span>
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-600 dark:text-slate-400">
                  <span>Lasalgaon & Khanna</span>
                  <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">28ms</span>
                </div>
              </div>
            )}

            {/* Kisan Call Center Helpline */}
            <div
              className={`flex items-center gap-3 px-3 py-2 rounded-xl text-slate-600 dark:text-slate-300 bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 ${
                isCollapsed ? "justify-center" : ""
              }`}
              title="Kisan Call Center: 1800-180-1551"
            >
              <PhoneCall className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
              {!isCollapsed && (
                <div className="flex-1 min-w-0">
                  <span className="text-[11px] font-bold text-amber-900 dark:text-amber-300 block leading-tight">
                    Kisan Helpline: 1800-180-1551
                  </span>
                  <span className="text-[10px] text-amber-700/80 dark:text-amber-400/70 block truncate">
                    Toll-free 24x7 Agri Advisory
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* SYSTEM UTILITIES (Accounts, Settings, Help, Onboarding, Version) */}
          <div className="space-y-1 pt-2 border-t border-slate-200 dark:border-slate-800">
            {!isCollapsed && (
              <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                SYSTEM & CONFIGURATION
              </div>
            )}

            {/* Farmer Account Trigger */}
            <button
              onClick={() => {
                setIsAccountModalOpen(true);
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title="Farmer Account & KPP"
            >
              <User className="w-4 h-4 text-slate-400 shrink-0" />
              {!isCollapsed && (
                <div className="flex-1 min-w-0">
                  <span className="text-xs font-semibold block leading-tight">Farmer Account</span>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 block truncate">KPP & Land Holdings</span>
                </div>
              )}
            </button>

            {/* Platform Settings Trigger */}
            <button
              onClick={() => {
                setIsSettingsModalOpen(true);
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title="Platform Settings"
            >
              <Settings className="w-4 h-4 text-slate-400 shrink-0" />
              {!isCollapsed && (
                <div className="flex-1 min-w-0">
                  <span className="text-xs font-semibold block leading-tight">Platform Settings</span>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 block truncate">Language, Diesel, Rates</span>
                </div>
              )}
            </button>

            {/* First-Time Setup Wizard Prompt */}
            <button
              onClick={() => {
                setIsOnboardingOpen(true);
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title="Setup Wizard"
            >
              <Rocket className="w-4 h-4 text-indigo-500 shrink-0" />
              {!isCollapsed && (
                <div className="flex-1 min-w-0">
                  <span className="text-xs font-semibold block leading-tight">Guided Walkthrough</span>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 block truncate">Onboarding & Setup</span>
                </div>
              )}
            </button>

            {/* Help & Support Trigger */}
            <button
              onClick={() => {
                setIsHelpModalOpen(true);
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title="Help Desk & FAQs"
            >
              <HelpCircle className="w-4 h-4 text-slate-400 shrink-0" />
              {!isCollapsed && (
                <div className="flex-1 min-w-0">
                  <span className="text-xs font-semibold block leading-tight">Help & Documentation</span>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 block truncate">FAQs & Support</span>
                </div>
              )}
            </button>
          </div>
        </div>

        {/* Sidebar Footer with 1-Click Theme Switcher */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/70 text-xs space-y-2">
          {!isCollapsed ? (
            <div>
              <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mb-2">
                <span>Display Theme:</span>
                <span className="capitalize font-bold text-slate-900 dark:text-white">{settings.theme}</span>
              </div>
              <div className="grid grid-cols-3 gap-1 bg-slate-200/80 dark:bg-slate-800 p-1 rounded-xl border border-slate-300/60 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => setTheme("light")}
                  className={`py-1.5 px-2 rounded-lg flex items-center justify-center gap-1 text-[11px] font-bold transition-all cursor-pointer ${
                    settings.theme === "light"
                      ? "bg-white text-slate-900 shadow-xs"
                      : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                  title="Light Theme"
                >
                  <Sun className="w-3.5 h-3.5 text-amber-500" />
                  <span>Light</span>
                </button>

                <button
                  type="button"
                  onClick={() => setTheme("dark")}
                  className={`py-1.5 px-2 rounded-lg flex items-center justify-center gap-1 text-[11px] font-bold transition-all cursor-pointer ${
                    settings.theme === "dark"
                      ? "bg-slate-900 text-white shadow-xs"
                      : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                  title="Dark Theme"
                >
                  <Moon className="w-3.5 h-3.5 text-blue-400" />
                  <span>Dark</span>
                </button>

                <button
                  type="button"
                  onClick={() => setTheme("sunlight")}
                  className={`py-1.5 px-2 rounded-lg flex items-center justify-center gap-1 text-[11px] font-bold transition-all cursor-pointer ${
                    settings.theme === "sunlight"
                      ? "bg-amber-400 text-amber-950 shadow-xs"
                      : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                  title="Field Sunlight High-Contrast"
                >
                  <Eye className="w-3.5 h-3.5 text-amber-900" />
                  <span>Sun</span>
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setTheme(settings.theme === "dark" ? "light" : "dark")}
              className="w-10 h-10 mx-auto rounded-xl bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors cursor-pointer"
              title="Toggle Theme"
            >
              {settings.theme === "dark" ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-blue-400" />}
            </button>
          )}
        </div>
      </aside>
    </>
  );
};
