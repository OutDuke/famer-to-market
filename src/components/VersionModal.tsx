import React from "react";
import { useAppSettings } from "../context/AppSettingsContext";
import {
  Info,
  ShieldCheck,
  Cpu,
  Server,
  Layers,
  Sparkles,
  X,
  CheckCircle2,
  Boxes,
} from "lucide-react";

export const VersionModal: React.FC = () => {
  const { isVersionModalOpen, setIsVersionModalOpen } = useAppSettings();

  if (!isVersionModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white border border-[#D6DBD2] rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 text-[#1A2E1A]">
        {/* Header */}
        <div className="bg-[#142614] text-white p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#22C55E] flex items-center justify-center text-white font-black text-lg shadow-xs">
              <Info className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-white">System Architecture & Version</h3>
              <p className="text-xs text-[#A6C4A6]">VrutiKisan Platform Specifications</p>
            </div>
          </div>

          <button
            onClick={() => setIsVersionModalOpen(false)}
            className="text-[#A6C4A6] hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 space-y-4 text-xs">
          <div className="bg-[#F8FAF6] p-4 rounded-xl border border-[#D6DBD2] flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-[#526652]">Current Build</span>
              <h4 className="text-base font-extrabold text-[#1A2E1A]">VrutiKisan v2.4.0-stable</h4>
              <span className="text-[11px] text-[#15803D] font-mono font-bold">Build Hash: 8f9b41a-prod</span>
            </div>
            <span className="bg-[#DCFCE7] text-[#166534] border border-[#86EFAC] px-3 py-1 rounded-full font-bold text-xs">
              Production Ready
            </span>
          </div>

          {/* Specs List */}
          <div className="space-y-2">
            <h5 className="font-bold text-[#1A2E1A] text-xs uppercase tracking-wider">
              Core Modules & Protocol Stack
            </h5>

            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="p-2.5 bg-[#F8FAF6] border border-[#D6DBD2] rounded-lg">
                <span className="text-[#526652] block">3D Spatial Engine:</span>
                <span className="font-bold text-[#1A2E1A] font-mono">Three.js r185 WebGL</span>
              </div>
              <div className="p-2.5 bg-[#F8FAF6] border border-[#D6DBD2] rounded-lg">
                <span className="text-[#526652] block">AgriStack Identity:</span>
                <span className="font-bold text-[#15803D] font-mono">KPP Protocol v1.4</span>
              </div>
              <div className="p-2.5 bg-[#F8FAF6] border border-[#D6DBD2] rounded-lg">
                <span className="text-[#526652] block">Distance Haulage:</span>
                <span className="font-bold text-[#1A2E1A]">Haversine + 1.28x Road Matrix</span>
              </div>
              <div className="p-2.5 bg-[#F8FAF6] border border-[#D6DBD2] rounded-lg">
                <span className="text-[#526652] block">Price Analytics:</span>
                <span className="font-bold text-[#1A2E1A]">Recharts & APMC Aggregator</span>
              </div>
              <div className="p-2.5 bg-[#F8FAF6] border border-[#D6DBD2] rounded-lg">
                <span className="text-[#526652] block">Khata & Ledger:</span>
                <span className="font-bold text-[#1A2E1A]">Local-First Cryptographic Vault</span>
              </div>
              <div className="p-2.5 bg-[#F8FAF6] border border-[#D6DBD2] rounded-lg">
                <span className="text-[#526652] block">Vision OCR:</span>
                <span className="font-bold text-[#1A2E1A]">Dual-Pass Blackboard Parser</span>
              </div>
            </div>
          </div>

          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2.5 text-emerald-800 font-semibold">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>All APMC price streams and AgriStack APIs operational.</span>
          </div>

          <div className="pt-2">
            <button
              onClick={() => setIsVersionModalOpen(false)}
              className="w-full bg-[#15803D] hover:bg-[#166534] text-white font-bold py-2.5 rounded-xl text-xs shadow-xs transition-colors cursor-pointer"
            >
              Close System Info
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
