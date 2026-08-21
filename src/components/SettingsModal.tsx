import React from "react";
import { useAppSettings, ThemeMode, SupportedLanguage } from "../context/AppSettingsContext";
import {
  Settings,
  Sun,
  Moon,
  Eye,
  Languages,
  Fuel,
  Bell,
  Scale,
  X,
  Check,
  RefreshCw,
} from "lucide-react";

export const SettingsModal: React.FC = () => {
  const { settings, updateSettings, setTheme, isSettingsModalOpen, setIsSettingsModalOpen } = useAppSettings();

  if (!isSettingsModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white border border-[#D6DBD2] rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 text-[#1A2E1A]">
        {/* Header */}
        <div className="bg-[#142614] text-white p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#22C55E] flex items-center justify-center text-white font-black text-lg shadow-xs">
              <Settings className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-white">Platform Settings & Appearance</h3>
              <p className="text-xs text-[#A6C4A6]">Configure UI theme, language, and freight calculation defaults</p>
            </div>
          </div>

          <button
            onClick={() => setIsSettingsModalOpen(false)}
            className="text-[#A6C4A6] hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 space-y-5 text-xs">
          {/* 1. Theme Selection */}
          <div className="space-y-2">
            <label className="font-bold text-[#1A2E1A] block uppercase tracking-wider text-[11px]">
              Display & Color Theme
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setTheme("light")}
                className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                  settings.theme === "light"
                    ? "bg-[#DCFCE7] border-[#15803D] text-[#15803D] font-bold shadow-xs"
                    : "bg-[#F8FAF6] border-[#D6DBD2] text-[#526652] hover:bg-[#F1F3EF]"
                }`}
              >
                <Sun className="w-4 h-4" />
                <span className="text-xs">Light Mode</span>
              </button>

              <button
                type="button"
                onClick={() => setTheme("dark")}
                className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                  settings.theme === "dark"
                    ? "bg-[#142614] border-[#22C55E] text-[#4ADE80] font-bold shadow-xs"
                    : "bg-[#F8FAF6] border-[#D6DBD2] text-[#526652] hover:bg-[#F1F3EF]"
                }`}
              >
                <Moon className="w-4 h-4" />
                <span className="text-xs">Dark Mode</span>
              </button>

              <button
                type="button"
                onClick={() => setTheme("sunlight")}
                className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                  settings.theme === "sunlight"
                    ? "bg-amber-100 border-amber-600 text-amber-900 font-bold shadow-xs"
                    : "bg-[#F8FAF6] border-[#D6DBD2] text-[#526652] hover:bg-[#F1F3EF]"
                }`}
              >
                <Eye className="w-4 h-4" />
                <span className="text-xs">Field Sunlight</span>
              </button>
            </div>
          </div>

          {/* 2. Language Selection */}
          <div className="space-y-2">
            <label className="font-bold text-[#1A2E1A] block uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <Languages className="w-3.5 h-3.5 text-[#15803D]" />
              <span>Regional Language / भाषा</span>
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5">
              {[
                { code: "en", label: "English" },
                { code: "hi", label: "हिंदी" },
                { code: "mr", label: "मराठी" },
                { code: "pa", label: "ਪੰਜਾਬੀ" },
                { code: "kn", label: "ಕನ್ನಡ" },
              ].map((lang) => (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => updateSettings({ language: lang.code as SupportedLanguage })}
                  className={`py-2 px-2 rounded-lg border text-center transition-all cursor-pointer ${
                    settings.language === lang.code
                      ? "bg-[#15803D] border-[#15803D] text-white font-bold shadow-xs"
                      : "bg-[#F8FAF6] border-[#D6DBD2] text-[#526652] hover:bg-[#F1F3EF]"
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          </div>

          {/* 3. Diesel Price Default Override */}
          <div className="space-y-2">
            <label className="font-bold text-[#1A2E1A] block uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <Fuel className="w-3.5 h-3.5 text-[#15803D]" />
              <span>Default Diesel Rate for Freight Calculation</span>
            </label>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <span className="absolute left-3 top-2.5 font-bold text-[#526652]">₹</span>
                <input
                  type="number"
                  step="0.5"
                  value={settings.dieselPrice}
                  onChange={(e) => updateSettings({ dieselPrice: parseFloat(e.target.value) || 89.5 })}
                  className="w-full bg-[#F8FAF6] border border-[#D6DBD2] rounded-lg pl-7 pr-3 py-2 text-xs font-mono font-bold text-[#1A2E1A]"
                />
              </div>
              <span className="text-[#526652] font-semibold text-xs whitespace-nowrap">/ Litre</span>
            </div>
          </div>

          {/* 4. Weight Unit & Notifications */}
          <div className="space-y-2 border-t border-[#E5EAE1] pt-3">
            <div className="flex items-center justify-between py-1">
              <div>
                <span className="font-bold text-[#1A2E1A] block">Mandi Arbitrage Alerts via SMS / WhatsApp</span>
                <span className="text-[11px] text-[#526652]">Send alerts when prices surge &gt; 15% in nearby APMC</span>
              </div>
              <input
                type="checkbox"
                checked={settings.smsNotifications}
                onChange={(e) => updateSettings({ smsNotifications: e.target.checked })}
                className="w-4 h-4 text-[#15803D] accent-[#15803D] rounded cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between py-1">
              <div>
                <span className="font-bold text-[#1A2E1A] block">Auto-Sync APMC Wholesale Ticker</span>
                <span className="text-[11px] text-[#526652]">Refresh auction modal prices every 60 seconds</span>
              </div>
              <input
                type="checkbox"
                checked={settings.priceAlerts}
                onChange={(e) => updateSettings({ priceAlerts: e.target.checked })}
                className="w-4 h-4 text-[#15803D] accent-[#15803D] rounded cursor-pointer"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={() => setIsSettingsModalOpen(false)}
              className="w-full bg-[#15803D] hover:bg-[#166534] text-white font-bold py-2.5 rounded-xl text-xs shadow-xs transition-colors cursor-pointer"
            >
              Save & Apply Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
