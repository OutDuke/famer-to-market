import React, { useState, useEffect } from "react";
import {
  Sprout,
  Calendar,
  Thermometer,
  Droplets,
  Layers,
  Sparkles,
  TrendingUp,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  IndianRupee,
  Scale,
  FileBadge,
} from "lucide-react";
import { CropPlanResult, CropRecommendation } from "../types";
import { useFarmerAuth } from "../context/FarmerAuthContext";

export const CropPlanner: React.FC = () => {
  const { currentFarmer, setIsCardModalOpen } = useFarmerAuth();
  const [soilType, setSoilType] = useState(
    currentFarmer.soilType.includes("Black")
      ? "Black Cotton Soil (Deccan Trap)"
      : currentFarmer.soilType.includes("Red")
      ? "Red & Yellow Soil (Peninsular)"
      : "Alluvial Loam (Indo-Gangetic Basin)"
  );
  const [month, setMonth] = useState("October");
  const [temperature, setTemperature] = useState(24);
  const [waterStatus, setWaterStatus] = useState("Canal & Tube-well (High)");
  const [landAcres, setLandAcres] = useState(currentFarmer.landAcres);
  const [result, setResult] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLandAcres(currentFarmer.landAcres);
    if (currentFarmer.soilType.includes("Black")) {
      setSoilType("Black Cotton Soil (Deccan Trap)");
    } else if (currentFarmer.soilType.includes("Red")) {
      setSoilType("Red & Yellow Soil (Peninsular)");
    } else {
      setSoilType("Alluvial Loam (Indo-Gangetic Basin)");
    }
  }, [currentFarmer]);

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const soils = [
    "Alluvial Loam (Indo-Gangetic Basin)",
    "Black Cotton Soil (Deccan Trap)",
    "Sandy Loam (Semi-Arid)",
    "Clay Loam (Lowland River Delta)",
    "Red & Yellow Soil (Peninsular)",
  ];

  const generatePlan = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/crop-plan/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          soilType,
          currentMonth: month,
          localTemperatureCelsius: temperature,
          waterAvailability: waterStatus,
          landAreaAcres: landAcres,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setResult(data);
      }
    } catch (err) {
      console.error("Error generating crop plan:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    generatePlan();
  }, [soilType, month, temperature, waterStatus, landAcres]);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 rounded-2xl p-4 sm:p-6 shadow-xs relative overflow-hidden text-slate-900 dark:text-slate-100">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-400 border border-teal-200 dark:border-teal-800">
                Agronomic Intelligence
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Soil & Climate-Calibrated Yield Forecaster
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">
              Agro-Climatic Sowing & Profit Planner
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed">
              Evaluates soil physical properties, ambient temperature bands, and planting windows to rank optimal crops with harvest timeline, expected quintals yield, and net financial realization.
            </p>
          </div>

          {result && (
            <div className="bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-right shrink-0">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block">Season Classification</span>
              <div className="text-sm font-black text-teal-600 dark:text-teal-400 mt-0.5">
                {result.agroSeason}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Grid: Inputs + Output */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Controls Column */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 rounded-2xl p-4 sm:p-5 space-y-4 shadow-xs text-slate-900 dark:text-slate-100">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              <span>Farm Agro-Climatic Inputs</span>
            </h3>

            {/* Soil Type */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-900 dark:text-white">Soil Texture & Classification</label>
              <select
                value={soilType}
                onChange={(e) => setSoilType(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-hidden focus:border-teal-500"
              >
                {soils.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            {/* Month */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-900 dark:text-white">Sowing / Planting Month</label>
              <select
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-hidden focus:border-teal-500"
              >
                {months.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            {/* Temperature */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-slate-900 dark:text-white">Ambient Temperature</span>
                <span className="font-bold text-amber-600 dark:text-amber-400">{temperature}°C</span>
              </div>
              <input
                type="range"
                min="10"
                max="45"
                step="1"
                value={temperature}
                onChange={(e) => setTemperature(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 dark:text-slate-400">
                <span>10°C (Winter)</span>
                <span>28°C (Moderate)</span>
                <span>45°C (Peak Summer)</span>
              </div>
            </div>

            {/* Land Area */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-slate-900 dark:text-white">Cultivable Land Holding</span>
                <span className="font-bold text-teal-600 dark:text-teal-400">{landAcres} Acres</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="25"
                step="0.5"
                value={landAcres}
                onChange={(e) => setLandAcres(Number(e.target.value))}
                className="w-full accent-teal-500 cursor-pointer"
              />
            </div>

            {/* Water Source */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-900 dark:text-white">Irrigation Reliability</label>
              <select
                value={waterStatus}
                onChange={(e) => setWaterStatus(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-hidden focus:border-teal-500"
              >
                <option value="Canal & Tube-well (High)">Canal & Tube-well (High Availability)</option>
                <option value="Drip / Sprinkler Micro-Irrigation">Drip / Sprinkler Micro-Irrigation</option>
                <option value="Rainfed / Monsoon Reliant">Rainfed / Monsoon Reliant (Low Water)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Column */}
        <div className="lg:col-span-8 space-y-4">
          {result && (
            <div className="space-y-4">
              {/* Primary Top Recommendation Card */}
              <div className="bg-white dark:bg-slate-800 border-2 border-teal-500 dark:border-teal-500 rounded-2xl p-5 sm:p-6 shadow-xs relative overflow-hidden text-slate-900 dark:text-slate-100">
                <div className="sm:absolute top-4 right-4 bg-teal-600 text-white font-black text-[11px] px-3 py-1 rounded-full uppercase tracking-wider shadow-xs mb-3 sm:mb-0 inline-block">
                  Top Recommended ({result.primaryCrop.suitabilityScore}% Match)
                </div>

                <div className="space-y-4">
                  <div>
                    <span className="text-xs text-teal-600 dark:text-teal-400 font-bold uppercase tracking-wider">
                      Agronomic Top Pick
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-0.5">
                      {result.primaryCrop.cropName}
                    </h3>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      Variety: <strong className="text-slate-900 dark:text-white">{result.primaryCrop.variety}</strong> • Sowing Window:{" "}
                      <strong className="text-slate-900 dark:text-white">{result.primaryCrop.sowingWindow}</strong>
                    </div>
                  </div>

                  {/* Financial Projection Bar */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/60 p-3.5 rounded-xl">
                    <div>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold">Estimated Harvest</span>
                      <div className="text-xs font-bold text-slate-900 dark:text-white mt-0.5">
                        {result.primaryCrop.estimatedHarvestMonth}
                      </div>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400">{result.primaryCrop.harvestDurationDays} days cycle</span>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold">Expected Total Yield</span>
                      <div className="text-xs font-bold text-slate-900 dark:text-white mt-0.5">
                        {(result.primaryCrop.expectedYieldPerAcreQuintals * landAcres).toFixed(1)} Q
                      </div>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400">
                        ({result.primaryCrop.expectedYieldPerAcreQuintals} Q / Acre)
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold">Projected Rate</span>
                      <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                        ₹{result.primaryCrop.projectedMandiPricePerQuintalRs} / Q
                      </div>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400">Avg Wholesale Model</span>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold">Net Farm Profit ({landAcres} Ac)</span>
                      <div className="text-sm font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
                        ₹{result.primaryCrop.totalProjectedNetProfitRs.toLocaleString()}
                      </div>
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400">
                        ₹{result.primaryCrop.estimatedNetProfitPerAcreRs.toLocaleString()} / Acre
                      </span>
                    </div>
                  </div>

                  {/* Agronomic Reasoning */}
                  <div className="p-3.5 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/60 rounded-xl text-xs space-y-1.5">
                    <div className="text-teal-600 dark:text-teal-400 font-bold flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4" />
                      <span>Soil Compatibility & Water Rationale</span>
                    </div>
                    <p className="text-slate-800 dark:text-slate-200 leading-relaxed">
                      {result.primaryCrop.soilFitnessReason}
                    </p>
                    <div className="flex flex-wrap gap-3 pt-1 text-[11px] text-slate-500 dark:text-slate-400">
                      <span>💧 Water: <strong className="text-slate-900 dark:text-white">{result.primaryCrop.waterRequirement}</strong></span>
                      <span>🐛 Pest Risk: <strong className="text-slate-900 dark:text-white">{result.primaryCrop.pestRiskLevel}</strong></span>
                      <span>📈 Market Outlook: <strong className="text-slate-900 dark:text-white">{result.primaryCrop.marketDemandOutlook}</strong></span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Alternative Crops Table */}
              <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 rounded-2xl p-4 sm:p-5 space-y-3 shadow-xs text-slate-900 dark:text-slate-100">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Alternative Crop Feasibility Matrix
                </h4>

                <div className="divide-y divide-slate-100 dark:divide-slate-700/60">
                  {(result.allRecommendations || []).slice(1).map((crop: any) => (
                    <div key={crop.cropName} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 dark:text-white text-sm">{crop.cropName}</span>
                          <span className="text-[10px] bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-400 border border-teal-200 dark:border-teal-800 px-2 py-0.5 rounded-full font-bold">
                            {crop.suitabilityScore}% Match
                          </span>
                        </div>
                        <div className="text-slate-500 dark:text-slate-400 mt-0.5">
                          Harvest: {crop.estimatedHarvestMonth} ({crop.harvestDurationDays} days) • Yield: {crop.expectedYieldPerAcreQuintals} Q/Ac
                        </div>
                      </div>

                      <div className="text-left sm:text-right">
                        <div className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                          Net Profit: ₹{crop.totalProjectedNetProfitRs.toLocaleString()}
                        </div>
                        <div className="text-slate-500 dark:text-slate-400 text-[11px]">
                          Rate: ₹{crop.projectedMandiPricePerQuintalRs}/Q
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Extension Agronomy Advice */}
              <div className="p-4 bg-teal-50 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-900/50 rounded-2xl text-xs space-y-2 text-teal-900 dark:text-teal-200">
                <div className="font-bold text-teal-700 dark:text-teal-300 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                  <span>Kisan Expert Agronomy Advisory</span>
                </div>
                <ul className="list-disc list-inside space-y-1 text-slate-700 dark:text-slate-300">
                  {(result.agronomyTips || []).map((tip: string, idx: number) => (
                    <li key={idx}>{tip}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
