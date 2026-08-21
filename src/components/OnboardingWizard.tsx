import React, { useState, useEffect } from "react";
import { useFarmerAuth } from "../context/FarmerAuthContext";
import { useAppSettings } from "../context/AppSettingsContext";
import {
  Compass,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Truck,
  BookOpen,
  Sprout,
  ScanLine,
  UserCheck,
  MapPin,
  Sparkles,
  ArrowRight,
  X,
  FileBadge,
} from "lucide-react";

interface OnboardingWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab?: (tab: string) => void;
}

export const OnboardingWizard: React.FC<OnboardingWizardProps> = ({
  isOpen,
  onClose,
  onNavigateTab,
}) => {
  const { currentFarmer, profiles, availableProfiles, selectFarmer, switchProfile } = useFarmerAuth();
  const { updateSettings, settings } = useAppSettings();

  const farmerList = availableProfiles || profiles || [];
  const switchFarmer = selectFarmer || switchProfile;

  const [currentStep, setCurrentStep] = useState(1);
  const [selectedCrop, setSelectedCrop] = useState("Tomato");
  const [selectedVehicle, setSelectedVehicle] = useState("Tata 407 (3.5T)");

  if (!isOpen) return null;

  const totalSteps = 4;

  const handleFinish = () => {
    localStorage.setItem("vrutikisan_onboarded", "true");
    onClose();
    if (onNavigateTab) {
      onNavigateTab("decision");
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white dark:bg-[#122312] border border-[#D6DBD2] dark:border-[#264526] rounded-2xl max-w-xl w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 text-[#1A2E1A] dark:text-[#E2EDE2]">
        {/* Modal Top Header with Step Progress */}
        <div className="bg-[#142614] text-white p-4 sm:p-5 flex items-center justify-between border-b border-[#243E24]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#22C55E] flex items-center justify-center text-white font-black text-lg shadow-xs">
              🌾
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-[#22C55E] text-[#0A1F0A] px-2 py-0.5 rounded-full">
                  Step {currentStep} of {totalSteps}
                </span>
                <span className="text-xs text-[#A6C4A6]">Farmer Onboarding Workflow</span>
              </div>
              <h3 className="font-extrabold text-base text-white mt-0.5">
                {currentStep === 1 && "Welcome to VrutiKisan"}
                {currentStep === 2 && "Confirm Your Identity & Land Parcel"}
                {currentStep === 3 && "Configure Market & Haulage Defaults"}
                {currentStep === 4 && "You're All Set to Maximize Net Realization!"}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-[#A6C4A6] hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
            title="Skip Onboarding"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-[#E5EAE1] dark:bg-[#1E381E] h-1.5">
          <div
            className="bg-[#22C55E] h-1.5 transition-all duration-300"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>

        {/* Step Content */}
        <div className="p-4 sm:p-6 space-y-4">
          {/* STEP 1: Welcome & Regional Setup */}
          {currentStep === 1 && (
            <div className="space-y-4 text-xs">
              <div className="bg-[#F8FAF6] dark:bg-[#182E18] p-4 rounded-xl border border-[#D6DBD2] dark:border-[#2B4E2B] space-y-2">
                <p className="text-sm font-bold text-[#1A2E1A] dark:text-white leading-relaxed">
                  VrutiKisan is India's real-time farm-to-market arbitrage platform that calculates true <strong>Net Farmer Payouts</strong> after deducting road curvature, fuel surcharges, driver bhatta, and mandi cess.
                </p>
                <p className="text-[#526652] dark:text-[#A6C4A6]">
                  Let's configure your digital Kisan Pehchaan Patra (KPP) and farm credentials in under 60 seconds.
                </p>
              </div>

              <div className="space-y-2">
                <label className="font-bold text-[#1A2E1A] dark:text-white block uppercase tracking-wider text-[11px]">
                  Select Your Preferred Language / भाषा
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
                      onClick={() => updateSettings({ language: lang.code as any })}
                      className={`py-2 px-1 text-center rounded-lg border font-bold transition-all cursor-pointer ${
                        settings.language === lang.code
                          ? "bg-[#15803D] text-white border-[#15803D] shadow-xs"
                          : "bg-[#F8FAF6] dark:bg-[#182E18] border-[#D6DBD2] dark:border-[#2B4E2B] text-[#526652] dark:text-[#A6C4A6] hover:bg-[#F1F3EF]"
                      }`}
                    >
                      {lang.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="font-bold text-[#1A2E1A] dark:text-white block uppercase tracking-wider text-[11px]">
                  Select Pre-Configured Regional Farmer Profile
                </label>
                <div className="space-y-2">
                  {farmerList.map((p) => {
                    const isSelected = currentFarmer?.id === p.id;
                    return (
                      <div
                        key={p.id}
                        onClick={() => switchFarmer && switchFarmer(p.id)}
                        className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                          isSelected
                            ? "bg-[#DCFCE7] dark:bg-[#1E3E1E] border-[#15803D] dark:border-[#4ADE80] shadow-xs"
                            : "bg-[#F8FAF6] dark:bg-[#182E18] border-[#D6DBD2] dark:border-[#2B4E2B] hover:bg-[#F1F3EF]"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-[#15803D] text-white flex items-center justify-center font-bold text-xs">
                            {p.name.substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <h4 className="font-extrabold text-[#1A2E1A] dark:text-white text-xs">{p.name}</h4>
                            <span className="text-[11px] text-[#526652] dark:text-[#A6C4A6]">
                              {p.village}, {p.district} ({p.state}) • {p.landAcres} Acres
                            </span>
                          </div>
                        </div>

                        {isSelected && (
                          <CheckCircle2 className="w-5 h-5 text-[#15803D] dark:text-[#4ADE80]" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Identity & Land Parcel */}
          {currentStep === 2 && (
            <div className="space-y-4 text-xs">
              <div className="p-3 bg-emerald-50 dark:bg-[#183118] border border-emerald-200 dark:border-[#2E542E] rounded-xl flex items-center gap-3">
                <FileBadge className="w-6 h-6 text-[#15803D] dark:text-[#4ADE80] shrink-0" />
                <div>
                  <h4 className="font-extrabold text-emerald-950 dark:text-white">
                    Verified Digital KPP ID: {currentFarmer.kppNumber}
                  </h4>
                  <p className="text-[11px] text-emerald-800 dark:text-[#A6C4A6]">
                    AgriStack Registry & Land Survey Record 7-12 Active
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-[#F8FAF6] dark:bg-[#182E18] border border-[#D6DBD2] dark:border-[#2B4E2B] rounded-xl">
                  <span className="text-[10px] uppercase font-bold text-[#526652] dark:text-[#A6C4A6] block">
                    Land Holding
                  </span>
                  <span className="text-base font-black text-[#15803D] dark:text-[#4ADE80] mt-0.5 block">
                    {currentFarmer.landAcres} Acres
                  </span>
                  <span className="text-[10px] text-[#526652] dark:text-[#A6C4A6]">Cultivable Area</span>
                </div>

                <div className="p-3 bg-[#F8FAF6] dark:bg-[#182E18] border border-[#D6DBD2] dark:border-[#2B4E2B] rounded-xl">
                  <span className="text-[10px] uppercase font-bold text-[#526652] dark:text-[#A6C4A6] block">
                    Khasra Parcel No.
                  </span>
                  <span className="text-xs font-mono font-black text-[#1A2E1A] dark:text-white mt-0.5 block">
                    {currentFarmer.khasraNumber}
                  </span>
                  <span className="text-[10px] text-[#526652] dark:text-[#A6C4A6]">Revenue Mapped</span>
                </div>
              </div>

              <div className="p-3 bg-[#F8FAF6] dark:bg-[#182E18] border border-[#D6DBD2] dark:border-[#2B4E2B] rounded-xl space-y-1">
                <span className="text-[10px] uppercase font-bold text-[#526652] dark:text-[#A6C4A6]">
                  Registered Soil Type
                </span>
                <p className="font-bold text-[#1A2E1A] dark:text-white">{currentFarmer.soilType}</p>
                <p className="text-[11px] text-[#526652] dark:text-[#A6C4A6]">
                  Optimized for high-yield horticulture, cereals, and cash crops.
                </p>
              </div>
            </div>
          )}

          {/* STEP 3: Market & Haulage Defaults */}
          {currentStep === 3 && (
            <div className="space-y-4 text-xs">
              <div className="space-y-2">
                <label className="font-bold text-[#1A2E1A] dark:text-white block uppercase tracking-wider text-[11px]">
                  Select Primary Crop to Arbitrage First
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {["Tomato", "Onion", "Wheat", "Grapes", "Cotton", "Potato"].map((c) => (
                    <button
                      key={c}
                      onClick={() => setSelectedCrop(c)}
                      className={`p-2.5 rounded-xl border text-center font-bold transition-all cursor-pointer ${
                        selectedCrop === c
                          ? "bg-[#15803D] text-white border-[#15803D] shadow-xs"
                          : "bg-[#F8FAF6] dark:bg-[#182E18] border-[#D6DBD2] dark:border-[#2B4E2B] text-[#526652] dark:text-[#A6C4A6] hover:bg-[#F1F3EF]"
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="font-bold text-[#1A2E1A] dark:text-white block uppercase tracking-wider text-[11px]">
                  Default Haulage Vehicle
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { name: "Tata Ace (1.5T)", cap: "15 Quintals", rate: "₹18/km" },
                    { name: "Tata 407 (3.5T)", cap: "35 Quintals", rate: "₹26/km" },
                    { name: "6-Tyre Truck (10T)", cap: "100 Quintals", rate: "₹42/km" },
                    { name: "Eicher 17ft (7T)", cap: "70 Quintals", rate: "₹34/km" },
                  ].map((v) => (
                    <div
                      key={v.name}
                      onClick={() => setSelectedVehicle(v.name)}
                      className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                        selectedVehicle === v.name
                          ? "bg-[#DCFCE7] dark:bg-[#1E3E1E] border-[#15803D] dark:border-[#4ADE80] font-bold text-[#15803D] dark:text-[#4ADE80] shadow-xs"
                          : "bg-[#F8FAF6] dark:bg-[#182E18] border-[#D6DBD2] dark:border-[#2B4E2B] text-[#526652] dark:text-[#A6C4A6]"
                      }`}
                    >
                      <div className="font-extrabold text-xs">{v.name}</div>
                      <div className="text-[10px] text-[#526652] dark:text-[#A6C4A6]">
                        {v.cap} • {v.rate}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Ready Summary */}
          {currentStep === 4 && (
            <div className="space-y-4 text-xs">
              <div className="text-center py-2 space-y-1.5">
                <div className="w-12 h-12 rounded-full bg-[#DCFCE7] dark:bg-[#1E3E1E] text-[#15803D] dark:text-[#4ADE80] flex items-center justify-center mx-auto shadow-xs">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h4 className="font-extrabold text-base text-[#1A2E1A] dark:text-white">
                  Ready to Start Arbitraging!
                </h4>
                <p className="text-[#526652] dark:text-[#A6C4A6] max-w-sm mx-auto text-xs">
                  Your profile <strong>{currentFarmer.name}</strong> is synced with local mandis and logistics rates.
                </p>
              </div>

              <div className="space-y-2">
                <div className="p-3 bg-[#F8FAF6] dark:bg-[#182E18] border border-[#D6DBD2] dark:border-[#2B4E2B] rounded-xl flex items-center gap-3">
                  <Compass className="w-5 h-5 text-[#15803D] dark:text-[#4ADE80] shrink-0" />
                  <div>
                    <span className="font-bold text-[#1A2E1A] dark:text-white block">Market Decision Engine</span>
                    <span className="text-[11px] text-[#526652] dark:text-[#A6C4A6]">
                      Compare local, district, and metro APMC net profit after freight costs.
                    </span>
                  </div>
                </div>

                <div className="p-3 bg-[#F8FAF6] dark:bg-[#182E18] border border-[#D6DBD2] dark:border-[#2B4E2B] rounded-xl flex items-center gap-3">
                  <BookOpen className="w-5 h-5 text-[#15803D] dark:text-[#4ADE80] shrink-0" />
                  <div>
                    <span className="font-bold text-[#1A2E1A] dark:text-white block">Kisan Khata & Stock</span>
                    <span className="text-[11px] text-[#526652] dark:text-[#A6C4A6]">
                      Track godown stock, outstanding trader dues, and auto-send WhatsApp receipts.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation Controls */}
        <div className="bg-[#F8FAF6] dark:bg-[#0E1F0E] p-4 sm:p-5 border-t border-[#E5EAE1] dark:border-[#243E24] flex items-center justify-between">
          {currentStep > 1 ? (
            <button
              onClick={() => setCurrentStep((prev) => prev - 1)}
              className="bg-white dark:bg-[#182E18] border border-[#D6DBD2] dark:border-[#2B4E2B] hover:bg-[#F1F3EF] px-4 py-2 rounded-xl text-xs font-bold text-[#1A2E1A] dark:text-white flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          ) : (
            <button
              onClick={onClose}
              className="text-xs text-[#526652] dark:text-[#A6C4A6] hover:underline font-semibold cursor-pointer"
            >
              Skip For Now
            </button>
          )}

          {currentStep < totalSteps ? (
            <button
              onClick={() => setCurrentStep((prev) => prev + 1)}
              className="bg-[#15803D] hover:bg-[#166534] text-white px-5 py-2 rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <span>Continue</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleFinish}
              className="bg-[#15803D] hover:bg-[#166534] text-white px-6 py-2 rounded-xl text-xs font-black shadow-md flex items-center gap-2 cursor-pointer transition-all hover:scale-102"
            >
              <span>Launch Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
