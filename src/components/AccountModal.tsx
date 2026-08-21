import React, { useState } from "react";
import { useFarmerAuth } from "../context/FarmerAuthContext";
import { useAppSettings } from "../context/AppSettingsContext";
import {
  User,
  ShieldCheck,
  Phone,
  MapPin,
  Trees,
  Landmark,
  FileBadge,
  QrCode,
  CheckCircle2,
  X,
  RefreshCw,
  Award,
  Download,
  Share2,
} from "lucide-react";

export const AccountModal: React.FC = () => {
  const { currentFarmer, isCardModalOpen, setIsCardModalOpen, setIsAuthModalOpen } = useFarmerAuth();
  const { isAccountModalOpen, setIsAccountModalOpen } = useAppSettings();
  const [activeTab, setActiveTab] = useState<"profile" | "land" | "kyc">("profile");
  const [copied, setCopied] = useState(false);

  if (!isAccountModalOpen) return null;

  const handleCopyKpp = () => {
    navigator.clipboard.writeText(currentFarmer.kppNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-700 rounded-2xl max-w-xl w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 text-slate-900 dark:text-slate-100">
        {/* Header */}
        <div className="bg-slate-900 text-white p-4 sm:p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-black text-lg shadow-xs">
              🌾
            </div>
            <div>
              <h3 className="font-extrabold text-base text-white flex items-center gap-2">
                <span>Farmer Account & Identity</span>
                <span className="bg-emerald-500/20 text-emerald-300 text-[9px] font-bold px-1.5 py-0.2 rounded-full uppercase border border-emerald-500/30">
                  AgriStack KYC Active
                </span>
              </h3>
              <p className="text-xs text-slate-400">Kisan Pehchaan Patra Registry • Government of India</p>
            </div>
          </div>

          <button
            onClick={() => setIsAccountModalOpen(false)}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Buttons */}
        <div className="flex border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 p-1.5 gap-1 text-xs font-bold">
          <button
            onClick={() => setActiveTab("profile")}
            className={`flex-1 py-2 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === "profile"
                ? "bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-xs border border-slate-200 dark:border-slate-700"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Profile & KPP</span>
          </button>
          <button
            onClick={() => setActiveTab("land")}
            className={`flex-1 py-2 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === "land"
                ? "bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-xs border border-slate-200 dark:border-slate-700"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Trees className="w-3.5 h-3.5" />
            <span>Land & Parcel</span>
          </button>
          <button
            onClick={() => setActiveTab("kyc")}
            className={`flex-1 py-2 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === "kyc"
                ? "bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-xs border border-slate-200 dark:border-slate-700"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Landmark className="w-3.5 h-3.5" />
            <span>Bank & DBT KYC</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 space-y-4">
          {/* TAB 1: Profile & KPP */}
          {activeTab === "profile" && (
            <div className="space-y-4">
              <div className="bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center font-black text-lg shadow-xs">
                    {currentFarmer.name.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="font-extrabold text-base text-slate-900 dark:text-white">{currentFarmer.name}</h4>
                    <span className="text-xs text-slate-500 dark:text-slate-400 block">
                      {currentFarmer.phone} • Aadhaar XXXX-XXXX-{currentFarmer.aadhaarLast4}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleCopyKpp}
                  className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-750 px-3 py-1.5 rounded-lg text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <FileBadge className="w-3.5 h-3.5" />
                  <span>{copied ? "Copied!" : currentFarmer.kppNumber}</span>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-50 dark:bg-slate-900/60 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 block">Village & Gram Panchayat</span>
                  <span className="font-extrabold text-slate-900 dark:text-white text-sm mt-0.5 block">{currentFarmer.village}</span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">{currentFarmer.taluka}, {currentFarmer.district}</span>
                </div>
                <div className="bg-slate-50 dark:bg-slate-900/60 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 block">Registration Date</span>
                  <span className="font-extrabold text-slate-900 dark:text-white text-sm mt-0.5 block">{currentFarmer.registrationDate}</span>
                  <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">AgriStack Registry v2.4</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() => {
                    setIsAccountModalOpen(false);
                    setIsCardModalOpen(true);
                  }}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-xs flex items-center gap-2 cursor-pointer"
                >
                  <FileBadge className="w-4 h-4" />
                  <span>Open Full Smart ID Card</span>
                </button>

                <button
                  onClick={() => {
                    setIsAccountModalOpen(false);
                    setIsAuthModalOpen(true);
                  }}
                  className="text-xs text-emerald-600 dark:text-emerald-400 font-bold hover:underline cursor-pointer"
                >
                  Switch / Add Profile →
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: Land & Parcel */}
          {activeTab === "land" && (
            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 dark:bg-slate-900/60 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">Total Land Holding</span>
                  <div className="text-xl font-black text-emerald-600 dark:text-emerald-400 mt-1">{currentFarmer.landAcres} Acres</div>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">Registered Farm Land Area</span>
                </div>
                <div className="bg-slate-50 dark:bg-slate-900/60 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">Khasra / 7-12 Survey No.</span>
                  <div className="text-sm font-mono font-black text-slate-900 dark:text-white mt-1">{currentFarmer.khasraNumber}</div>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">Land Revenue Record Verified</span>
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-slate-900/60 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1.5">
                <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">Soil Classification</span>
                <p className="font-bold text-slate-900 dark:text-white">{currentFarmer.soilType}</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  High moisture retention capacity with verified NPK nutrient soil health card benchmark.
                </p>
              </div>

              <div className="bg-slate-50 dark:bg-slate-900/60 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1.5">
                <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">Primary Registered Crops</span>
                <div className="flex flex-wrap gap-1.5 pt-0.5">
                  {(currentFarmer?.primaryCrops || []).map((c, i) => (
                    <span key={i} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2.5 py-1 rounded-md font-bold text-emerald-600 dark:text-emerald-400">
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Bank & DBT KYC */}
          {activeTab === "kyc" && (
            <div className="space-y-3 text-xs">
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <div>
                  <h5 className="font-extrabold text-emerald-900 dark:text-emerald-300">Direct Benefit Transfer (DBT) Ready</h5>
                  <p className="text-[11px] text-emerald-700 dark:text-emerald-400">
                    Aadhaar NPCI mapped with Kisan Credit Card (KCC) limit active.
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center p-2.5 bg-slate-50 dark:bg-slate-900/60 rounded-lg border border-slate-200 dark:border-slate-700">
                  <span className="text-slate-500 dark:text-slate-400">Kisan Credit Card (KCC) Status:</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">Active (Limit: ₹3,00,000)</span>
                </div>
                <div className="flex justify-between items-center p-2.5 bg-slate-50 dark:bg-slate-900/60 rounded-lg border border-slate-200 dark:border-slate-700">
                  <span className="text-slate-500 dark:text-slate-400">PM-KISAN Samman Nidhi:</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">16th Installment Disbursed</span>
                </div>
                <div className="flex justify-between items-center p-2.5 bg-slate-50 dark:bg-slate-900/60 rounded-lg border border-slate-200 dark:border-slate-700">
                  <span className="text-slate-500 dark:text-slate-400">e-NAM APMC Trading License:</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">Verified Direct Seller</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
