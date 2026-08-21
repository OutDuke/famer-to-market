import React, { useState, useEffect } from "react";
import {
  Truck,
  MapPin,
  Fuel,
  Scale,
  Navigation,
  Clock,
  IndianRupee,
  ShieldAlert,
  ArrowRight,
  Info,
  CheckCircle2,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import { PRESET_FARMS, PRESET_MANDIS, VEHICLE_OPTIONS } from "../data/mockData";
import { FreightEstimateResult } from "../types";

export const FreightEstimator: React.FC = () => {
  const [selectedFarm, setSelectedFarm] = useState(PRESET_FARMS[0]);
  const [selectedMandi, setSelectedMandi] = useState(PRESET_MANDIS[0]);
  const [loadWeight, setLoadWeight] = useState(25);
  const [vehicleType, setVehicleType] = useState(VEHICLE_OPTIONS[1].name);
  const [dieselPrice, setDieselPrice] = useState(90.5);
  const [isPerishable, setIsPerishable] = useState(true);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<FreightEstimateResult | null>(null);

  const calculateFreight = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/freight/estimate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          originLat: selectedFarm.latitude,
          originLon: selectedFarm.longitude,
          originName: selectedFarm.name,
          destLat: selectedMandi.latitude,
          destLon: selectedMandi.longitude,
          destName: selectedMandi.name,
          loadWeightQuintals: loadWeight,
          vehicleType,
          dieselPricePerLitre: dieselPrice,
          isPerishable,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setResult(data);
      }
    } catch (err) {
      console.error("Freight calculation error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    calculateFreight();
  }, [selectedFarm, selectedMandi, loadWeight, vehicleType, dieselPrice, isPerishable]);

  return (
    <div className="space-y-5">
      {/* Top Banner / Summary Card */}
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 rounded-2xl p-4 sm:p-6 shadow-xs relative overflow-hidden text-slate-900 dark:text-slate-100">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                Logistics & Route Optimization
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Haversine Road Curvature Calibrated
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">
              Farm-to-Mandi Freight & Logistics Estimator
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed">
              Calculate exact vehicle freight, fuel surcharges, driver bhatta, and per-quintal transportation costs between your farm gate and regional APMC wholesale markets.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-xl p-3 sm:p-4 text-right shadow-2xs">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-medium">
                Estimated Unit Freight
              </span>
              <div className="text-xl sm:text-2xl font-extrabold text-amber-600 dark:text-amber-400">
                ₹{result?.metrics.costPerQuintal || "--"} <span className="text-xs text-slate-500 dark:text-slate-400 font-normal">/ Q</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Form + Results Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Controls Column */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 rounded-2xl p-4 sm:p-5 space-y-4 shadow-xs text-slate-900 dark:text-slate-100">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <Navigation className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span>Route & Coordinates</span>
            </h3>

            {/* Farm Origin Picker */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-900 dark:text-white flex items-center justify-between">
                <span>1. Farm Gate Origin (GPS)</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                  {selectedFarm.latitude.toFixed(4)}, {selectedFarm.longitude.toFixed(4)}
                </span>
              </label>
              <select
                value={selectedFarm.name}
                onChange={(e) => {
                  const farm = PRESET_FARMS.find((f) => f.name === e.target.value);
                  if (farm) setSelectedFarm(farm);
                }}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-hidden focus:border-amber-500"
              >
                {PRESET_FARMS.map((f) => (
                  <option key={f.name} value={f.name}>
                    {f.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Destination Mandi Picker */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-900 dark:text-white flex items-center justify-between">
                <span>2. Target Mandi Destination</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                  {selectedMandi.latitude.toFixed(4)}, {selectedMandi.longitude.toFixed(4)}
                </span>
              </label>
              <select
                value={selectedMandi.name}
                onChange={(e) => {
                  const m = PRESET_MANDIS.find((item) => item.name === e.target.value);
                  if (m) setSelectedMandi(m);
                }}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-hidden focus:border-amber-500"
              >
                {PRESET_MANDIS.map((m) => (
                  <option key={m.name} value={m.name}>
                    {m.name} ({m.state})
                  </option>
                ))}
              </select>
            </div>

            <hr className="border-slate-200 dark:border-slate-700" />

            {/* Vehicle & Load Controls */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                <Truck className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span>Vehicle & Load Specs</span>
              </h3>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-900 dark:text-white">Commercial Vehicle Fleet</label>
                <select
                  value={vehicleType}
                  onChange={(e) => setVehicleType(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-hidden focus:border-amber-500"
                >
                  {VEHICLE_OPTIONS.map((v) => (
                    <option key={v.id} value={v.name}>
                      {v.name} ({v.maxPayloadQuintals} Q capacity)
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs text-slate-900 dark:text-white">
                  <span className="font-semibold">Dispatch Quantity</span>
                  <span className="font-bold text-amber-600 dark:text-amber-400">{loadWeight} Quintals</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="150"
                  step="5"
                  value={loadWeight}
                  onChange={(e) => setLoadWeight(Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">Diesel Price (₹/L)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={dieselPrice}
                    onChange={(e) => setDieselPrice(Number(e.target.value))}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-900 dark:text-white font-bold"
                  />
                </div>

                <div className="flex items-center gap-2 pt-4">
                  <input
                    type="checkbox"
                    id="perishable"
                    checked={isPerishable}
                    onChange={(e) => setIsPerishable(e.target.checked)}
                    className="w-4 h-4 rounded text-amber-600 accent-amber-500 cursor-pointer"
                  />
                  <label htmlFor="perishable" className="text-xs font-semibold text-slate-900 dark:text-white cursor-pointer">
                    Perishable Produce (Tarpaulin/Fast)
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Results & Cost Breakdown */}
        <div className="lg:col-span-7 space-y-4">
          {result ? (
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 rounded-2xl p-4 sm:p-5 space-y-4 shadow-xs text-slate-900 dark:text-slate-100">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700/60">
                <div>
                  <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wide">
                    Logistics Payout Summary
                  </span>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                    {result.route?.origin?.name || result.origin?.name || selectedFarm.name} → {result.route?.destination?.name || result.destination?.name || selectedMandi.name}
                  </h3>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-500 dark:text-slate-400">Total Route Freight:</span>
                  <div className="text-xl font-black text-amber-600 dark:text-amber-400">
                    ₹{(result.metrics?.totalFreightCost || 0).toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Metrics Highlights Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div className="bg-slate-50 dark:bg-slate-900/60 p-3 rounded-xl border border-slate-200 dark:border-slate-700/60">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-medium">Road Distance</span>
                  <span className="text-sm font-extrabold text-blue-600 dark:text-blue-400">
                    {result.metrics?.roadDistanceKm || 0} km
                  </span>
                </div>
                <div className="bg-slate-50 dark:bg-slate-900/60 p-3 rounded-xl border border-slate-200 dark:border-slate-700/60">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-medium">Estimated Transit</span>
                  <span className="text-sm font-extrabold text-slate-900 dark:text-white">
                    ~{result.metrics?.estimatedTransitHours || 1} Hours
                  </span>
                </div>
                <div className="bg-slate-50 dark:bg-slate-900/60 p-3 rounded-xl border border-slate-200 dark:border-slate-700/60">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-medium">Diesel Needed</span>
                  <span className="text-sm font-extrabold text-amber-600 dark:text-amber-400">
                    {result.metrics?.fuelNeededLitres || Math.round((result.metrics?.roadDistanceKm || 50) / 8)} Litres
                  </span>
                </div>
                <div className="bg-slate-50 dark:bg-slate-900/60 p-3 rounded-xl border border-slate-200 dark:border-slate-700/60">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-medium">Unit Freight</span>
                  <span className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400">
                    ₹{result.metrics?.costPerQuintal || 0}/Q
                  </span>
                </div>
              </div>

              {/* Line Item Cost Breakdown */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Itemized Transit Expense Breakdown
                </h4>
                <div className="bg-slate-50 dark:bg-slate-900/60 rounded-xl p-3 border border-slate-200 dark:border-slate-700/60 space-y-2 text-xs">
                  <div className="flex justify-between text-slate-700 dark:text-slate-300">
                    <span>Base Vehicle Haulage Fee:</span>
                    <span className="font-semibold">₹{result.breakdown?.baseFreight || result.metrics?.breakdown?.baseFreight || 0}</span>
                  </div>
                  <div className="flex justify-between text-slate-700 dark:text-slate-300">
                    <span>Fuel Expense ({result.metrics?.fuelNeededLitres || Math.round((result.metrics?.roadDistanceKm || 50) / 8)}L @ ₹{dieselPrice}/L):</span>
                    <span className="font-semibold">₹{result.breakdown?.fuelSurcharge || result.metrics?.breakdown?.fuelSurcharge || result.metrics?.breakdown?.fuelComponent || 0}</span>
                  </div>
                  <div className="flex justify-between text-slate-700 dark:text-slate-300">
                    <span>Driver Bhatta & Daily Allowance:</span>
                    <span className="font-semibold">₹{result.breakdown?.driverBhatta || result.metrics?.breakdown?.driverBhatta || 0}</span>
                  </div>
                  <div className="flex justify-between text-slate-700 dark:text-slate-300">
                    <span>Highway Toll & Border Inter-State Charges:</span>
                    <span className="font-semibold">₹{result.breakdown?.tollCharges || result.metrics?.breakdown?.tollCharges || result.metrics?.breakdown?.tollsAndPermits || 0}</span>
                  </div>
                  <div className="flex justify-between text-slate-700 dark:text-slate-300">
                    <span>Mandi Loading / Unloading Hamali (Handling):</span>
                    <span className="font-semibold">₹{result.breakdown?.loadingUnloading || result.metrics?.breakdown?.loadingUnloading || result.metrics?.breakdown?.labourHandling || 0}</span>
                  </div>
                  <hr className="border-slate-200 dark:border-slate-700" />
                  <div className="flex justify-between text-slate-900 dark:text-white font-extrabold text-sm pt-1">
                    <span>Total Farm-to-Mandi Freight:</span>
                    <span className="text-amber-600 dark:text-amber-400">
                      ₹{(result.metrics?.totalFreightCost || 0).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Advisory Box */}
              <div className="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 rounded-xl flex items-start gap-2 text-xs text-amber-900 dark:text-amber-200">
                <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <p>
                  <strong>Logistics Tip: </strong> Pooling dispatch with neighbouring farmers in your village to reach 60Q on a Medium Truck drops your per-quintal freight cost from <strong>₹{result.metrics?.costPerQuintal || 0}/Q</strong> down to <strong>₹{Math.round((result.metrics?.costPerQuintal || 0) * 0.65)}/Q</strong>.
                </p>
              </div>
            </div>
          ) : (
            <div className="p-8 bg-white dark:bg-slate-800 rounded-2xl text-center text-slate-500">
              Calculating freight metrics...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
