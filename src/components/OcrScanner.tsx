import React, { useState } from "react";
import {
  ScanLine,
  Upload,
  Image as ImageIcon,
  CheckCircle2,
  FileText,
  Sparkles,
  RefreshCw,
  Eye,
  Languages,
  Check,
  AlertCircle,
} from "lucide-react";
import { OcrResult } from "../types";

export const OcrScanner: React.FC<{ onSyncExtractedRates?: (rates: any) => void }> = ({
  onSyncExtractedRates,
}) => {
  const [selectedSample, setSelectedSample] = useState("azadpur");
  const [mandiHint, setMandiHint] = useState("Azadpur APMC Yard #2");
  const [loading, setLoading] = useState(false);
  const [ocrResult, setOcrResult] = useState<OcrResult | null>(null);
  const [synced, setSynced] = useState(false);

  const sampleBoards = [
    {
      id: "azadpur",
      title: "Azadpur APMC Rate Blackboard",
      subtitle: "Daily Vegetable & Grain Auction Sheet",
      mandi: "Azadpur APMC Yard #2",
    },
    {
      id: "lasalgaon",
      title: "Lasalgaon Onion Market Noticeboard",
      subtitle: "Grade-Wise Red Onion Auction Rates",
      mandi: "Lasalgaon Mandi Yard, Nashik",
    },
    {
      id: "khanna",
      title: "Khanna Grain Yard Official Bulletin",
      subtitle: "Wheat & Mustard Daily Arrival Tally",
      mandi: "Khanna APMC Main Yard, Ludhiana",
    },
  ];

  const handleRunOcr = async () => {
    setLoading(true);
    setSynced(false);
    try {
      const res = await fetch("/api/ocr/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mandiName: mandiHint,
          documentType: "Mandi Board",
        }),
      });

      const data = await res.json();
      if (data.success) {
        setOcrResult(data);
      }
    } catch (err) {
      console.error("OCR Scan failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSync = () => {
    if (ocrResult) {
      setSynced(true);
      if (onSyncExtractedRates) {
        onSyncExtractedRates(ocrResult.extractedRates);
      }
      setTimeout(() => setSynced(false), 3500);
    }
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 rounded-2xl p-4 sm:p-6 shadow-xs relative overflow-hidden text-slate-900 dark:text-slate-100">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                Vision OCR Scanner
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Mandi Price Blackboard & Slip Digitizer
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">
              Regional Mandi Price Board OCR Extractor
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed">
              Extracts validated Crop:Price key-value pairs, minimum/maximum/modal auction rates, and moisture grades from photographs of APMC mandi rate blackboards and trading slips.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRunOcr}
              disabled={loading}
              className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-xs transition-all cursor-pointer"
            >
              <ScanLine className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              <span>{loading ? "Scanning Document..." : "Scan Price Board"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Upload & Preview vs Extracted Rates */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Document Select & Simulated Vision Stage */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 rounded-2xl p-4 sm:p-5 space-y-4 shadow-xs text-slate-900 dark:text-slate-100">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>Select Mandi Noticeboard Photo</span>
            </h3>

            {/* Preset Board Selectors */}
            <div className="grid grid-cols-1 gap-2.5">
              {sampleBoards.map((board) => (
                <button
                  key={board.id}
                  onClick={() => {
                    setSelectedSample(board.id);
                    setMandiHint(board.mandi);
                  }}
                  className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                    selectedSample === board.id
                      ? "bg-indigo-50/70 dark:bg-indigo-950/40 border-indigo-400 dark:border-indigo-600 shadow-xs text-slate-900 dark:text-white"
                      : "bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-700/60 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 dark:text-white text-xs">{board.title}</span>
                    <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-mono font-bold">Sample</span>
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{board.subtitle}</div>
                </button>
              ))}
            </div>

            {/* Custom file drag and drop zone */}
            <div
              onClick={handleRunOcr}
              className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-500 bg-slate-50 dark:bg-slate-900/60 rounded-2xl p-6 text-center cursor-pointer transition-colors"
            >
              <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <div className="text-xs font-semibold text-slate-900 dark:text-white">
                Click or Drop Photo of Mandi Board / Trade Receipt
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                Supports JPG, PNG, WEBP (Hindi Devanagari & English)
              </div>
            </div>

            {/* Visual Blackboard Mock Preview */}
            <div className="bg-slate-950 text-white border border-slate-800 rounded-2xl p-4 font-mono text-xs relative overflow-hidden shadow-inner">
              <div className="flex items-center justify-between text-indigo-400 border-b border-slate-800 pb-2 mb-3">
                <span className="text-[10px] text-indigo-400 font-bold uppercase">Live Vision Canvas</span>
                <span className="text-[10px] text-slate-400">1920×1080 (Bilingual Mode)</span>
              </div>

              <div className="space-y-1.5 text-slate-200 font-mono text-[11px] leading-relaxed select-none">
                <div className="text-center font-bold text-amber-300 pb-1">
                  *** कृषि उपज मंडी समिति ({mandiHint}) ***
                </div>
                <div className="text-center text-slate-400 text-[10px]">
                  दैनिक थोक भाव व आवक सूची
                </div>
                <div className="pt-2 border-t border-slate-800 space-y-1">
                  <div className="flex justify-between">
                    <span>1. टमाटर (हाइब्रिड A)</span>
                    <span className="text-emerald-400 font-bold">₹2100 - ₹2600 (M: ₹2450)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>2. प्याज (नासिक लाल)</span>
                    <span className="text-emerald-400 font-bold">₹2600 - ₹3100 (M: ₹2850)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>3. आलू (पुखराज FAQ)</span>
                    <span className="text-emerald-400 font-bold">₹1450 - ₹1750 (M: ₹1620)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>4. गेहूं (शरबती लस्टर)</span>
                    <span className="text-emerald-400 font-bold">₹2650 - ₹2850 (M: ₹2750)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>5. सरसों (पीली 42% तेल)</span>
                    <span className="text-emerald-400 font-bold">₹5200 - ₹5550 (M: ₹5400)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Extracted JSON Key-Value Pairs & Confidence Breakdown */}
        <div className="lg:col-span-7 space-y-4">
          {ocrResult ? (
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 rounded-2xl p-5 sm:p-6 space-y-5 shadow-xs text-slate-900 dark:text-slate-100">
              {/* Top OCR Metadata Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-700/60">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 dark:text-white text-base">
                      {ocrResult.metadata.mandiLocation}
                    </span>
                    <span className="px-2 py-0.5 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 rounded-md text-[10px] font-bold">
                      Confidence: {ocrResult.metadata.averageConfidence}
                    </span>
                  </div>
                  <span className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 block">
                    Script: {ocrResult.metadata.boardLanguageDetected} • {ocrResult.metadata.totalCropsParsed} Commodities Parsed
                  </span>
                </div>

                <button
                  onClick={handleSync}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
                >
                  {synced ? <Check className="w-4 h-4 text-white" /> : <Sparkles className="w-4 h-4" />}
                  <span>{synced ? "Synced to Decision Engine!" : "Sync Rates to App"}</span>
                </button>
              </div>

              {/* Extracted Key-Value Table */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Extracted Commodity Price Key-Value Pairs (Crop: Price)
                </h4>

                <div className="overflow-x-auto border border-slate-200 dark:border-slate-700 rounded-xl">
                  <table className="w-full text-xs text-left min-w-[550px]">
                    <thead className="bg-slate-50 dark:bg-slate-900/60 text-slate-500 dark:text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-200 dark:border-slate-700">
                      <tr>
                        <th className="py-2.5 px-3">Crop Name</th>
                        <th className="py-2.5 px-3">Modal Rate</th>
                        <th className="py-2.5 px-3">Min / Max Range</th>
                        <th className="py-2.5 px-3">Detected Grade</th>
                        <th className="py-2.5 px-3">Arrivals</th>
                        <th className="py-2.5 px-3">OCR Score</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60 text-slate-800 dark:text-slate-200">
                      {(ocrResult?.extractedRates || []).map((item, idx) => (
                        <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-750">
                          <td className="py-3 px-3 font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400" />
                            <span>{item.crop}</span>
                          </td>
                          <td className="py-3 px-3 font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                            ₹{item.modalPrice} <span className="text-[10px] text-slate-500 dark:text-slate-400 font-normal">/Q</span>
                          </td>
                          <td className="py-3 px-3 text-slate-800 dark:text-slate-200">
                            ₹{item.minPrice} – ₹{item.maxPrice}
                          </td>
                          <td className="py-3 px-3 text-slate-500 dark:text-slate-400 text-[11px]">{item.detectedGrade}</td>
                          <td className="py-3 px-3 text-slate-800 dark:text-slate-200">{item.arrivalVolume}</td>
                          <td className="py-3 px-3">
                            <span className="bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 px-2 py-0.5 rounded-full font-mono text-[10px] font-bold">
                              {(item.confidenceScore * 100).toFixed(0)}%
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Raw OCR Text Dump */}
              <div className="space-y-1.5">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                  Raw Optical Text Stream (Bilingual Hindi/English)
                </span>
                <pre className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-3.5 rounded-xl text-slate-800 dark:text-slate-200 font-mono text-[11px] whitespace-pre-wrap leading-relaxed">
                  {ocrResult.metadata.rawTextDump}
                </pre>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 rounded-2xl p-12 text-center space-y-4 shadow-xs text-slate-900 dark:text-slate-100">
              <ScanLine className="w-12 h-12 text-slate-400 mx-auto animate-pulse" />
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">No Active OCR Scan</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                  Click "Scan Price Board" or pick a sample noticeboard to simulate optical text extraction with bounding box key-value mapping.
                </p>
              </div>
              <button
                onClick={handleRunOcr}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs inline-flex items-center gap-2 shadow-xs cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>Trigger Instant OCR Scan</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
