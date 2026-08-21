import React, { useState } from "react";
import { X, Calculator, ArrowRightLeft, Scale, MapPin, Fuel } from "lucide-react";

interface UnitConverterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UnitConverterModal: React.FC<UnitConverterModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<"weight" | "land" | "diesel">("weight");

  // Weight conversion
  const [weightValue, setWeightValue] = useState<number>(10);
  const [weightFrom, setWeightFrom] = useState<"quintal" | "kg" | "ton" | "maund">("quintal");

  // Land conversion
  const [landValue, setLandValue] = useState<number>(2.5);
  const [landFrom, setLandFrom] = useState<"acre" | "bigha_pucca" | "bigha_kaccha" | "hectare" | "guntha">("acre");

  // Diesel estimation
  const [distanceKm, setDistanceKm] = useState<number>(120);
  const [mileageKmPerL, setMileageKmPerL] = useState<number>(7.5);
  const [dieselRate, setDieselRate] = useState<number>(90.5);

  if (!isOpen) return null;

  // Weight Calculations
  const getWeightInKg = (val: number, unit: string) => {
    switch (unit) {
      case "quintal": return val * 100;
      case "kg": return val;
      case "ton": return val * 1000;
      case "maund": return val * 37.324;
      default: return val * 100;
    }
  };

  const currentKg = getWeightInKg(weightValue, weightFrom);

  // Land Calculations (in Acres base)
  const getLandInAcres = (val: number, unit: string) => {
    switch (unit) {
      case "acre": return val;
      case "bigha_pucca": return val * 0.625; // Standard UP/Punjab
      case "bigha_kaccha": return val * 0.208;
      case "hectare": return val * 2.47105;
      case "guntha": return val * 0.025; // Maharashtra / Karnataka
      default: return val;
    }
  };

  const currentAcres = getLandInAcres(landValue, landFrom);

  // Diesel calculations
  const totalLitres = Math.round((distanceKm / (mileageKmPerL || 1)) * 10) / 10;
  const totalFuelCost = Math.round(totalLitres * dieselRate);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden text-slate-900 dark:text-slate-100 flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-700/80 flex items-center justify-between bg-slate-50 dark:bg-slate-800/80">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">Kisan Field Unit Converter</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Quick Agri conversions for weights, land parcels & fuel</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="grid grid-cols-3 p-2 bg-slate-100 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-700/60 text-xs font-bold">
          <button
            onClick={() => setActiveTab("weight")}
            className={`py-2 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === "weight"
                ? "bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-xs"
                : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Scale className="w-4 h-4" />
            <span>Produce Weight</span>
          </button>
          <button
            onClick={() => setActiveTab("land")}
            className={`py-2 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === "land"
                ? "bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-xs"
                : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>Land Area</span>
          </button>
          <button
            onClick={() => setActiveTab("diesel")}
            className={`py-2 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === "diesel"
                ? "bg-white dark:bg-slate-800 text-amber-600 dark:text-amber-400 shadow-xs"
                : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Fuel className="w-4 h-4" />
            <span>Transit Diesel</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs">
          {activeTab === "weight" && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-600 dark:text-slate-400 font-semibold block mb-1">Enter Quantity</label>
                  <input
                    type="number"
                    value={weightValue}
                    onChange={(e) => setWeightValue(Math.max(0, Number(e.target.value)))}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl px-3 py-2 text-sm font-bold text-slate-900 dark:text-white focus:outline-hidden focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-slate-600 dark:text-slate-400 font-semibold block mb-1">From Unit</label>
                  <select
                    value={weightFrom}
                    onChange={(e: any) => setWeightFrom(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 dark:text-white focus:outline-hidden focus:border-blue-500"
                  >
                    <option value="quintal">Quintal (100 kg)</option>
                    <option value="kg">Kilogram (kg)</option>
                    <option value="ton">Metric Ton (1,000 kg)</option>
                    <option value="maund">Maund / Man (~37.3 kg)</option>
                  </select>
                </div>
              </div>

              {/* Conversion Results Grid */}
              <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl p-4 space-y-2.5">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Equivalent Weights</div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                    <span className="text-slate-400 block text-[10px]">In Quintals:</span>
                    <span className="text-sm font-extrabold text-blue-600 dark:text-blue-400">
                      {(currentKg / 100).toLocaleString(undefined, { maximumFractionDigits: 3 })} Q
                    </span>
                  </div>
                  <div className="p-2.5 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                    <span className="text-slate-400 block text-[10px]">In Kilograms (Kg):</span>
                    <span className="text-sm font-extrabold text-slate-900 dark:text-white">
                      {currentKg.toLocaleString(undefined, { maximumFractionDigits: 2 })} Kg
                    </span>
                  </div>
                  <div className="p-2.5 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                    <span className="text-slate-400 block text-[10px]">In Metric Tonnes:</span>
                    <span className="text-sm font-extrabold text-slate-900 dark:text-white">
                      {(currentKg / 1000).toLocaleString(undefined, { maximumFractionDigits: 4 })} MT
                    </span>
                  </div>
                  <div className="p-2.5 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                    <span className="text-slate-400 block text-[10px]">In Traditional Maund:</span>
                    <span className="text-sm font-extrabold text-amber-600 dark:text-amber-400">
                      {(currentKg / 37.324).toLocaleString(undefined, { maximumFractionDigits: 2 })} Maund
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "land" && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-600 dark:text-slate-400 font-semibold block mb-1">Enter Area</label>
                  <input
                    type="number"
                    value={landValue}
                    onChange={(e) => setLandValue(Math.max(0, Number(e.target.value)))}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl px-3 py-2 text-sm font-bold text-slate-900 dark:text-white focus:outline-hidden focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-slate-600 dark:text-slate-400 font-semibold block mb-1">From Unit</label>
                  <select
                    value={landFrom}
                    onChange={(e: any) => setLandFrom(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 dark:text-white focus:outline-hidden focus:border-emerald-500"
                  >
                    <option value="acre">Acre (Standard)</option>
                    <option value="bigha_pucca">Bigha (Pucca / UP-Punjab ~0.625 Ac)</option>
                    <option value="bigha_kaccha">Bigha (Kaccha ~0.208 Ac)</option>
                    <option value="hectare">Hectare (Ha ~2.47 Ac)</option>
                    <option value="guntha">Guntha (MH/KA ~0.025 Ac)</option>
                  </select>
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl p-4 space-y-2.5">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Equivalent Land Parcel Area</div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                    <span className="text-slate-400 block text-[10px]">In Standard Acres:</span>
                    <span className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400">
                      {currentAcres.toLocaleString(undefined, { maximumFractionDigits: 3 })} Acres
                    </span>
                  </div>
                  <div className="p-2.5 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                    <span className="text-slate-400 block text-[10px]">In Hectares:</span>
                    <span className="text-sm font-extrabold text-slate-900 dark:text-white">
                      {(currentAcres / 2.47105).toLocaleString(undefined, { maximumFractionDigits: 4 })} Ha
                    </span>
                  </div>
                  <div className="p-2.5 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                    <span className="text-slate-400 block text-[10px]">In Pucca Bigha:</span>
                    <span className="text-sm font-extrabold text-slate-900 dark:text-white">
                      {(currentAcres / 0.625).toLocaleString(undefined, { maximumFractionDigits: 2 })} Bigha
                    </span>
                  </div>
                  <div className="p-2.5 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                    <span className="text-slate-400 block text-[10px]">In Guntha (40 per Ac):</span>
                    <span className="text-sm font-extrabold text-purple-600 dark:text-purple-400">
                      {(currentAcres * 40).toLocaleString(undefined, { maximumFractionDigits: 1 })} Guntha
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "diesel" && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-2.5">
                <div>
                  <label className="text-slate-600 dark:text-slate-400 font-semibold block mb-1">Distance (km)</label>
                  <input
                    type="number"
                    value={distanceKm}
                    onChange={(e) => setDistanceKm(Math.max(1, Number(e.target.value)))}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl px-2.5 py-2 text-xs font-bold text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-600 dark:text-slate-400 font-semibold block mb-1">Mileage (km/L)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={mileageKmPerL}
                    onChange={(e) => setMileageKmPerL(Math.max(1, Number(e.target.value)))}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl px-2.5 py-2 text-xs font-bold text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-600 dark:text-slate-400 font-semibold block mb-1">Diesel (₹/L)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={dieselRate}
                    onChange={(e) => setDieselRate(Math.max(1, Number(e.target.value)))}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl px-2.5 py-2 text-xs font-bold text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-amber-800 dark:text-amber-300 font-semibold">Estimated Diesel Requirement:</span>
                  <span className="text-base font-extrabold text-amber-900 dark:text-amber-200">{totalLitres} Litres</span>
                </div>
                <div className="flex items-center justify-between border-t border-amber-200/80 dark:border-amber-900/40 pt-2">
                  <span className="text-amber-800 dark:text-amber-300 font-bold">Estimated Total Fuel Expense:</span>
                  <span className="text-lg font-black text-amber-600 dark:text-amber-400">₹{totalFuelCost.toLocaleString()}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-700 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs hover:opacity-90 transition-opacity"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
