import React, { useState, useEffect } from "react";
import {
  Compass,
  Truck,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  MapPin,
  IndianRupee,
  CheckCircle2,
  TrendingUp,
  Scale,
  RefreshCw,
} from "lucide-react";
import { COMMODITIES_LIST, PRESET_FARMS, PRESET_MANDIS } from "../data/mockData";
import { useFarmerAuth } from "../context/FarmerAuthContext";

interface DecisionSummaryProps {
  onNavigateTab: (tab: string) => void;
}

export const DecisionSummary: React.FC<DecisionSummaryProps> = ({ onNavigateTab }) => {
  const { currentFarmer, setIsCardModalOpen } = useFarmerAuth();
  const [selectedCrop, setSelectedCrop] = useState("Tomato");
  const [selectedFarm, setSelectedFarm] = useState(PRESET_FARMS[0]);
  const [quantityQuintals, setQuantityQuintals] = useState(30);
  const [loading, setLoading] = useState(false);
  const [mandiComparisons, setMandiComparisons] = useState<any[]>([]);
  const [bestMandi, setBestMandi] = useState<any | null>(null);

  const computeArbitrage = async () => {
    setLoading(true);
    try {
      const selectedCommodity = COMMODITIES_LIST.find((c) => c.id === selectedCrop) || COMMODITIES_LIST[0];
      const basePrice = selectedCommodity.basePrice;

      const candidateMandis = [
        { ...PRESET_MANDIS[0], priceMultiplier: 1.0, name: "Azadpur APMC (Delhi Metro Hub)" },
        { ...PRESET_MANDIS[5], priceMultiplier: 0.91, name: "Sonipat Local Mandi (Nearest Yard)" },
        { ...PRESET_MANDIS[2], priceMultiplier: 1.12, name: "Vashi APMC (Navi Mumbai Terminal)" },
        { ...PRESET_MANDIS[6], priceMultiplier: 0.94, name: "Agra Mandi (Regional Center)" },
      ];

      const results = [];

      for (const m of candidateMandis) {
        const res = await fetch("/api/freight/estimate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            originLat: selectedFarm.latitude,
            originLon: selectedFarm.longitude,
            originName: selectedFarm.name,
            destLat: m.latitude,
            destLon: m.longitude,
            destName: m.name,
            loadWeightQuintals: quantityQuintals,
            vehicleType: "Mini Truck (Tata 407)",
            isPerishable: selectedCommodity.perishable,
          }),
        });

        const freightData = await res.json();
        const roadDistance = freightData.metrics?.roadDistanceKm || 50;
        const totalFreight = freightData.metrics?.totalFreightCost || 2500;
        const freightPerQ = freightData.metrics?.costPerQuintal || 83;
        const mandiRate = Math.round(basePrice * m.priceMultiplier);
        const grossRevenue = Math.round(quantityQuintals * mandiRate);
        const netFarmerProfit = Math.round(grossRevenue - totalFreight);
        const effectiveRealizedPricePerQ = Math.round((netFarmerProfit / quantityQuintals) * 100) / 100;

        results.push({
          mandiName: m.name,
          state: m.state,
          roadDistanceKm: roadDistance,
          transitHours: freightData.metrics?.estimatedTransitHours || 2,
          mandiRatePerQ: mandiRate,
          totalFreightCost: totalFreight,
          freightCostPerQ: freightPerQ,
          grossRevenue,
          netFarmerProfit,
          effectiveRealizedPricePerQ,
        });
      }

      results.sort((a, b) => b.netFarmerProfit - a.netFarmerProfit);
      setMandiComparisons(results);
      setBestMandi(results[0]);
    } catch (err) {
      console.error("Arbitrage calculation error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    computeArbitrage();
  }, [selectedCrop, selectedFarm, quantityQuintals]);

  const localMandi = mandiComparisons.find((m) => m.mandiName.includes("Local")) || mandiComparisons[1];
  const extraGain = bestMandi && localMandi ? Math.max(0, bestMandi.netFarmerProfit - localMandi.netFarmerProfit) : 0;

  return (
    <div className="space-y-5 max-w-5xl mx-auto">
      {/* 1. MINIMALIST TOP CONTROLS */}
      <div className="bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs transition-colors">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Commodity Quick Selector */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
              Select Commodity
            </span>
            <div className="flex flex-wrap gap-1.5">
              {COMMODITIES_LIST.slice(0, 5).map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCrop(c.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    selectedCrop === c.id
                      ? "bg-emerald-600 text-white shadow-xs"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                  }`}
                >
                  {c.name.split(" ")[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Farm Location & Quantity Slider */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="space-y-1 min-w-[180px]">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                Farm Origin
              </span>
              <select
                value={selectedFarm.name}
                onChange={(e) => {
                  const f = PRESET_FARMS.find((item) => item.name === e.target.value);
                  if (f) setSelectedFarm(f);
                }}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              >
                {PRESET_FARMS.map((f) => (
                  <option key={f.name} value={f.name}>
                    {f.name.split(" (")[0]}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1 min-w-[170px] bg-slate-50 dark:bg-slate-800 p-2 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-500 dark:text-slate-400">Load:</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-mono">{quantityQuintals} Quintals</span>
              </div>
              <input
                type="range"
                min="5"
                max="100"
                step="5"
                value={quantityQuintals}
                onChange={(e) => setQuantityQuintals(Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer h-1.5"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 2. PROMINENT VERDICT HERO CARD (Rich Agricultural Green Identity) */}
      {bestMandi && (
        <div className="bg-gradient-to-br from-emerald-700 to-emerald-900 text-white rounded-2xl p-5 sm:p-7 shadow-lg relative overflow-hidden">
          {/* Background Ambient Motif */}
          <div className="absolute -right-6 -bottom-6 w-44 h-44 rounded-full bg-emerald-500/15 blur-2xl pointer-events-none" />

          <div className="relative z-10 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-emerald-100 text-xs font-bold border border-white/20">
                <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
                <span>Optimal Selling Recommendation</span>
              </div>
              <div className="text-xs text-emerald-100 font-medium">
                {selectedCrop} • {quantityQuintals} Quintals
              </div>
            </div>

            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pt-1">
              <div className="space-y-1">
                <span className="text-xs text-emerald-200 uppercase font-bold tracking-wider block">
                  Recommended Dispatch Mandi
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  {bestMandi.mandiName}
                </h2>
                <div className="flex items-center gap-3 text-xs text-emerald-100 pt-1">
                  <span>Distance: <strong>{bestMandi.roadDistanceKm} km</strong></span>
                  <span>•</span>
                  <span>Freight: <strong>₹{bestMandi.totalFreightCost.toLocaleString()}</strong></span>
                  <span>•</span>
                  <span>Mandi Rate: <strong>₹{bestMandi.mandiRatePerQ}/Q</strong></span>
                </div>
              </div>

              {/* Net Payout & Gain Pill */}
              <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-xl space-y-1 shrink-0 min-w-[240px]">
                <span className="text-[11px] text-emerald-200 uppercase font-bold tracking-wider block">
                  Estimated Net In-Hand Payout
                </span>
                <div className="text-3xl font-black text-white tracking-tight">
                  ₹{bestMandi.netFarmerProfit.toLocaleString()}
                </div>
                {extraGain > 0 && (
                  <div className="text-xs font-bold text-emerald-300 flex items-center gap-1 pt-0.5">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>+₹{extraGain.toLocaleString()} extra vs local mandi</span>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Action Navigation Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-emerald-600/40">
              <button
                onClick={() => onNavigateTab("freight")}
                className="bg-white hover:bg-emerald-50 text-emerald-900 px-4 py-2 rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Truck className="w-4 h-4 text-emerald-700" />
                <span>Calculate Truck Logistics</span>
              </button>

              <button
                onClick={() => onNavigateTab("khata")}
                className="bg-emerald-800/80 hover:bg-emerald-800 text-white border border-emerald-500/40 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>Record in Khata Ledger</span>
                <ArrowRight className="w-3.5 h-3.5 text-emerald-300" />
              </button>

              <button
                onClick={() => onNavigateTab("analytics")}
                className="text-xs text-emerald-100 hover:text-white font-bold ml-auto flex items-center gap-1 transition-colors cursor-pointer"
              >
                <span>View Price Trends & Spreads →</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. CLEAN 3-MANDI COMPARISON GRID */}
      <div className="bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <span>Alternative Mandi Corridors</span>
            <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded-full font-bold">
              Net Realized Price
            </span>
          </h3>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Deducted for road diesel & handling
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {mandiComparisons.slice(0, 3).map((m, idx) => {
            const isBest = idx === 0;
            return (
              <div
                key={m.mandiName}
                className={`p-4 rounded-xl border transition-all ${
                  isBest
                    ? "bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800 shadow-2xs"
                    : "bg-slate-50/60 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700/60"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-extrabold text-slate-900 dark:text-white truncate">
                    {m.mandiName.split(" (")[0]}
                  </span>
                  {isBest ? (
                    <span className="text-[9px] bg-emerald-600 text-white font-extrabold px-1.5 py-0.5 rounded">
                      Best Payout
                    </span>
                  ) : (
                    <span className="text-[9px] text-slate-500 dark:text-slate-400 font-mono">
                      {m.roadDistanceKm} km
                    </span>
                  )}
                </div>

                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Mandi Rate:</span>
                    <span className="font-bold text-slate-900 dark:text-white">₹{m.mandiRatePerQ} / Q</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Total Freight:</span>
                    <span className="font-bold text-amber-600 dark:text-amber-400">₹{m.totalFreightCost.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-slate-200 dark:border-slate-700/60">
                    <span className="font-bold text-slate-700 dark:text-slate-300">Net Farmer Payout:</span>
                    <span className="font-black text-emerald-600 dark:text-emerald-400 font-mono">
                      ₹{m.netFarmerProfit.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
