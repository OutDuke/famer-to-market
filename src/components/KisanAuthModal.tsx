import React, { useState } from "react";
import { useFarmerAuth } from "../context/FarmerAuthContext";
import {
  ShieldCheck,
  QrCode,
  UserCheck,
  CheckCircle2,
  Phone,
  Landmark,
  MapPin,
  Trees,
  FileBadge,
  X,
  Sparkles,
  ArrowRight,
  RefreshCw,
  Award,
} from "lucide-react";

export const KisanAuthModal: React.FC = () => {
  const {
    currentFarmer,
    isAuthenticated,
    profiles,
    loginWithKPP,
    loginWithPhone,
    registerFarmer,
    switchProfile,
    isAuthModalOpen,
    setIsAuthModalOpen,
    isCardModalOpen,
    setIsCardModalOpen,
  } = useFarmerAuth();

  const [authTab, setAuthTab] = useState<"switch" | "login" | "register">("switch");
  const [kppInput, setKppInput] = useState("");
  const [phoneInput, setPhoneInput] = useState("");
  const [otpInput, setOtpInput] = useState("4920");
  const [isVerifying, setIsVerifying] = useState(false);
  const [authError, setAuthError] = useState("");
  const [authSuccess, setAuthSuccess] = useState(false);

  // New Farmer Form State
  const [regName, setRegName] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regState, setRegState] = useState("Maharashtra");
  const [regDistrict, setRegDistrict] = useState("Nashik");
  const [regTaluka, setRegTaluka] = useState("Dindori");
  const [regVillage, setRegVillage] = useState("Palsan");
  const [regLandAcres, setRegLandAcres] = useState("5.0");
  const [regSoilType, setRegSoilType] = useState("Black Cotton Soil (Heavy Vertisol)");
  const [regCrops, setRegCrops] = useState("Tomato, Onion, Maize");
  const [regKhasra, setRegKhasra] = useState("142/3A");

  if (!isAuthModalOpen && !isCardModalOpen) return null;

  const handleKppLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    setAuthError("");
    try {
      const res = await loginWithKPP(kppInput || "KPP-2024-MH-9281", otpInput);
      if (res.success) {
        setAuthSuccess(true);
        setTimeout(() => {
          setIsAuthModalOpen(false);
          setAuthSuccess(false);
        }, 800);
      } else {
        setAuthError(res.message || "Failed to verify Kisan Pehchaan Patra");
      }
    } finally {
      setIsVerifying(false);
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regPhone.trim()) {
      setAuthError("Please fill in farmer name and mobile number.");
      return;
    }
    const created = registerFarmer({
      name: regName,
      phone: regPhone.startsWith("+91") ? regPhone : `+91 ${regPhone}`,
      aadhaarLast4: Math.floor(1000 + Math.random() * 9000).toString(),
      state: regState,
      district: regDistrict,
      taluka: regTaluka,
      village: regVillage,
      landAcres: parseFloat(regLandAcres) || 3.0,
      soilType: regSoilType,
      primaryCrops: regCrops.split(",").map((c) => c.trim()),
      khasraNumber: regKhasra || "89/1B",
    });

    setAuthSuccess(true);
    setTimeout(() => {
      setIsAuthModalOpen(false);
      setIsCardModalOpen(true);
      setAuthSuccess(false);
    }, 900);
  };

  // 1. Digital Smart ID Card Modal View
  if (isCardModalOpen) {
    return (
      <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
        <div className="bg-white border border-[#D6DBD2] rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          {/* Card Header */}
          <div className="bg-[#142614] text-white p-4 sm:p-5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#22C55E] flex items-center justify-center text-white font-black text-sm shadow-xs">
                🌾
              </div>
              <div>
                <h3 className="font-extrabold text-sm sm:text-base leading-tight text-white flex items-center gap-1.5">
                  <span>Kisan Pehchaan Patra</span>
                  <span className="bg-[#22C55E] text-[#0A1F0A] text-[9px] font-black px-1.5 py-0.2 rounded-full uppercase">
                    Verified
                  </span>
                </h3>
                <p className="text-[11px] text-[#A6C4A6]">Digital Farmer Identity • AgriStack Registry</p>
              </div>
            </div>
            <button
              onClick={() => setIsCardModalOpen(false)}
              className="text-[#A6C4A6] hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Physical Style Smart ID Card Body */}
          <div className="p-4 sm:p-6 space-y-4">
            <div className="relative rounded-xl bg-gradient-to-br from-[#F8FAF6] via-[#EEF4EB] to-[#E2EDE0] border-2 border-[#15803D]/60 p-4 sm:p-5 shadow-md overflow-hidden text-[#1A2E1A]">
              {/* Emblem Watermark */}
              <div className="absolute -right-8 -bottom-8 opacity-10 pointer-events-none text-9xl">
                🇮🇳
              </div>

              {/* Top Card Band */}
              <div className="flex items-center justify-between border-b border-[#C8D7C4] pb-3">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#15803D] block">
                    GOVERNMENT OF INDIA • AGRI-STACK
                  </span>
                  <span className="font-mono text-xs sm:text-sm font-black text-[#1A2E1A] tracking-wider">
                    {currentFarmer.kppNumber}
                  </span>
                </div>
                <div className="bg-[#15803D] text-white px-2.5 py-1 rounded-md text-[10px] font-black flex items-center gap-1 shadow-xs">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>KYC ACTIVE</span>
                </div>
              </div>

              {/* Farmer Info Grid */}
              <div className="grid grid-cols-3 gap-3 pt-3 text-xs">
                <div className="col-span-2 space-y-2">
                  <div>
                    <span className="text-[10px] text-[#526652] block uppercase font-bold">Farmer Name</span>
                    <span className="font-extrabold text-sm sm:text-base text-[#1A2E1A]">
                      {currentFarmer.name}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div>
                      <span className="text-[10px] text-[#526652] block font-semibold">Registered Phone</span>
                      <span className="font-mono font-bold text-[#1A2E1A]">{currentFarmer.phone}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#526652] block font-semibold">Aadhaar (Last 4)</span>
                      <span className="font-mono font-bold text-[#1A2E1A]">XXXX-XXXX-{currentFarmer.aadhaarLast4}</span>
                    </div>
                  </div>

                  <div className="text-[11px]">
                    <span className="text-[10px] text-[#526652] block font-semibold">Land Parcel & Village</span>
                    <span className="text-[#1A2E1A] font-semibold">
                      {currentFarmer.village}, {currentFarmer.taluka}, {currentFarmer.district} ({currentFarmer.state})
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-1">
                    <span className="bg-white border border-[#C8D7C4] px-2 py-0.5 rounded text-[10px] font-bold text-[#15803D]">
                      Holding: {currentFarmer.landAcres} Acres
                    </span>
                    <span className="bg-white border border-[#C8D7C4] px-2 py-0.5 rounded text-[10px] font-mono text-[#3B543B]">
                      Khasra: {currentFarmer.khasraNumber}
                    </span>
                  </div>
                </div>

                {/* QR Code & Photo Block */}
                <div className="flex flex-col items-center justify-between border-l border-[#C8D7C4] pl-3 text-center">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white border border-[#B6CAB2] rounded-lg p-1.5 shadow-xs flex items-center justify-center">
                    <QrCode className="w-full h-full text-[#142614]" />
                  </div>
                  <span className="text-[9px] text-[#526652] font-mono mt-1">Scan for Mandi Gate Entry</span>
                  <div className="text-[9px] font-bold text-[#15803D] mt-1 bg-white/80 px-1.5 py-0.5 rounded border border-[#C8D7C4]">
                    Reg: {currentFarmer.registrationDate}
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between gap-3 pt-2">
              <button
                onClick={() => {
                  setIsCardModalOpen(false);
                  setIsAuthModalOpen(true);
                }}
                className="text-xs text-[#15803D] font-bold hover:underline flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Switch / Manage Farmer Profiles</span>
              </button>

              <button
                onClick={() => setIsCardModalOpen(false)}
                className="bg-[#15803D] hover:bg-[#166534] text-white px-4 py-2 rounded-xl text-xs font-bold shadow-xs transition-all cursor-pointer"
              >
                Close & Continue
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 2. Authentication / Profile Switcher Modal
  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white border border-[#D6DBD2] rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 text-[#1A2E1A]">
        {/* Header */}
        <div className="bg-[#142614] text-white p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#22C55E] flex items-center justify-center text-white font-black text-sm">
              🌾
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base text-white">
                Farmer Identity Authorization
              </h3>
              <p className="text-[11px] text-[#A6C4A6]">Kisan Pehchaan Patra (KPP) • AgriStack Gateway</p>
            </div>
          </div>
          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="text-[#A6C4A6] hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Buttons */}
        <div className="flex border-b border-[#E5EAE1] bg-[#F8FAF6] p-1.5 gap-1.5 text-xs font-bold">
          <button
            onClick={() => {
              setAuthTab("switch");
              setAuthError("");
            }}
            className={`flex-1 py-2 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              authTab === "switch"
                ? "bg-white text-[#15803D] shadow-xs border border-[#D6DBD2]"
                : "text-[#526652] hover:text-[#1A2E1A]"
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Select Farmer</span>
          </button>

          <button
            onClick={() => {
              setAuthTab("login");
              setAuthError("");
            }}
            className={`flex-1 py-2 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              authTab === "login"
                ? "bg-white text-[#15803D] shadow-xs border border-[#D6DBD2]"
                : "text-[#526652] hover:text-[#1A2E1A]"
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>KPP Login</span>
          </button>

          <button
            onClick={() => {
              setAuthTab("register");
              setAuthError("");
            }}
            className={`flex-1 py-2 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              authTab === "register"
                ? "bg-white text-[#15803D] shadow-xs border border-[#D6DBD2]"
                : "text-[#526652] hover:text-[#1A2E1A]"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>New Farmer</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 space-y-4">
          {authError && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
              {authError}
            </div>
          )}

          {authSuccess && (
            <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Kisan Pehchaan Patra Verified! Updating workspace...</span>
            </div>
          )}

          {/* TAB 1: Quick Switch Demo Profile */}
          {authTab === "switch" && (
            <div className="space-y-3">
              <p className="text-xs text-[#526652]">
                Select an authorized farmer profile to load their land acreage, regional Mandi preferences, and Kisan Khata credit ledger:
              </p>

              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {(profiles || []).map((p) => {
                  const isCurrent = currentFarmer?.id === p.id;
                  return (
                    <div
                      key={p.id}
                      onClick={() => {
                        switchProfile(p.id);
                        setIsAuthModalOpen(false);
                      }}
                      className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                        isCurrent
                          ? "bg-[#DCFCE7]/70 border-[#15803D] shadow-xs"
                          : "bg-[#F8FAF6] border-[#D6DBD2] hover:bg-[#F1F3EF]"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-black ${
                            isCurrent
                              ? "bg-[#15803D] text-white"
                              : "bg-[#E2E8DF] text-[#1A2E1A]"
                          }`}
                        >
                          {p.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-extrabold text-xs text-[#1A2E1A]">{p.name}</span>
                            {isCurrent && (
                              <span className="text-[9px] bg-[#15803D] text-white px-1.5 py-0.2 rounded-full font-bold">
                                Active
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-[#526652] block">
                            {p.district}, {p.state} • {p.landAcres} Acres
                          </span>
                          <span className="text-[10px] font-mono text-[#15803D] font-bold">
                            {p.kppNumber}
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] font-bold text-[#15803D] bg-white border border-[#D6DBD2] px-2 py-0.5 rounded">
                          {p.primaryCrops[0]}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-2 border-t border-[#E5EAE1] flex justify-between items-center text-xs">
                <button
                  type="button"
                  onClick={() => {
                    setIsAuthModalOpen(false);
                    setIsCardModalOpen(true);
                  }}
                  className="text-[#15803D] font-bold hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <FileBadge className="w-3.5 h-3.5" />
                  <span>View Smart ID Card</span>
                </button>

                <button
                  type="button"
                  onClick={() => setAuthTab("register")}
                  className="bg-[#15803D] text-white px-3 py-1.5 rounded-lg font-bold shadow-xs hover:bg-[#166534] transition-colors cursor-pointer"
                >
                  + Add New Farmer
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: KPP / Phone OTP Login */}
          {authTab === "login" && (
            <form onSubmit={handleKppLogin} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#1A2E1A]">
                  Kisan Pehchaan Patra ID or Mobile Number
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={kppInput}
                    onChange={(e) => setKppInput(e.target.value)}
                    placeholder="e.g. KPP-2024-MH-9281 or 9823456789"
                    className="w-full bg-[#F8FAF6] border border-[#D6DBD2] rounded-lg px-3 py-2 text-xs text-[#1A2E1A] font-mono focus:border-[#15803D] focus:ring-1 focus:ring-[#15803D] outline-hidden"
                  />
                </div>
                <p className="text-[10px] text-[#526652]">
                  Enter your 16-character AgriStack ID or Aadhaar-linked farmer mobile number.
                </p>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <label className="font-bold text-[#1A2E1A]">Aadhaar / SMS OTP</label>
                  <span className="text-[10px] text-[#15803D] font-semibold">Auto-filled for demo</span>
                </div>
                <input
                  type="text"
                  value={otpInput}
                  onChange={(e) => setOtpInput(e.target.value)}
                  maxLength={6}
                  placeholder="Enter 4 or 6 digit OTP"
                  className="w-full bg-[#F8FAF6] border border-[#D6DBD2] rounded-lg px-3 py-2 text-xs font-mono tracking-widest text-[#1A2E1A] focus:border-[#15803D] outline-hidden"
                />
              </div>

              <button
                type="submit"
                disabled={isVerifying}
                className="w-full bg-[#15803D] hover:bg-[#166534] disabled:opacity-50 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
              >
                {isVerifying ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <ShieldCheck className="w-4 h-4" />
                )}
                <span>{isVerifying ? "Verifying with AgriStack..." : "Authenticate & Open Platform"}</span>
              </button>
            </form>
          )}

          {/* TAB 3: Register New Farmer */}
          {authTab === "register" && (
            <form onSubmit={handleRegister} className="space-y-3">
              <div className="grid grid-cols-2 gap-2.5">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#1A2E1A]">Farmer Full Name</label>
                  <input
                    type="text"
                    required
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="e.g. Vikas Sharma"
                    className="w-full bg-[#F8FAF6] border border-[#D6DBD2] rounded-lg px-2.5 py-1.5 text-xs text-[#1A2E1A]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#1A2E1A]">Mobile Number</label>
                  <input
                    type="tel"
                    required
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="e.g. 98123 45678"
                    className="w-full bg-[#F8FAF6] border border-[#D6DBD2] rounded-lg px-2.5 py-1.5 text-xs text-[#1A2E1A]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-[#1A2E1A]">State</label>
                  <input
                    type="text"
                    value={regState}
                    onChange={(e) => setRegState(e.target.value)}
                    className="w-full bg-[#F8FAF6] border border-[#D6DBD2] rounded-lg px-2 py-1.5 text-xs text-[#1A2E1A]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-[#1A2E1A]">District</label>
                  <input
                    type="text"
                    value={regDistrict}
                    onChange={(e) => setRegDistrict(e.target.value)}
                    className="w-full bg-[#F8FAF6] border border-[#D6DBD2] rounded-lg px-2 py-1.5 text-xs text-[#1A2E1A]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-[#1A2E1A]">Land (Acres)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={regLandAcres}
                    onChange={(e) => setRegLandAcres(e.target.value)}
                    className="w-full bg-[#F8FAF6] border border-[#D6DBD2] rounded-lg px-2 py-1.5 text-xs text-[#1A2E1A]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#1A2E1A]">Primary Sowing Crops</label>
                <input
                  type="text"
                  value={regCrops}
                  onChange={(e) => setRegCrops(e.target.value)}
                  placeholder="e.g. Onion, Tomato, Wheat"
                  className="w-full bg-[#F8FAF6] border border-[#D6DBD2] rounded-lg px-2.5 py-1.5 text-xs text-[#1A2E1A]"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#15803D] hover:bg-[#166534] text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer mt-2"
              >
                <Award className="w-4 h-4" />
                <span>Generate Verified Kisan Pehchaan Patra</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
