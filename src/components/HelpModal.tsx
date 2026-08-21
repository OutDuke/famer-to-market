import React, { useState } from "react";
import { useAppSettings } from "../context/AppSettingsContext";
import {
  HelpCircle,
  PhoneCall,
  MessageSquare,
  FileQuestion,
  ExternalLink,
  X,
  BookOpen,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

export const HelpModal: React.FC = () => {
  const { isHelpModalOpen, setIsHelpModalOpen } = useAppSettings();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  if (!isHelpModalOpen) return null;

  const faqs = [
    {
      q: "What is Kisan Pehchaan Patra (KPP)?",
      a: "Kisan Pehchaan Patra (KPP) is an Aadhaar & AgriStack-verified unique digital farmer identity that authenticates land parcel ownership, active crops, and enables direct e-NAM APMC gate entry without redundant paperwork.",
    },
    {
      q: "How is the Net Payout Arbitrage calculated?",
      a: "Net Payout = (Mandi Modal Price × Quantity) − [Vehicle Base Freight + (Distance × Road Curvature 1.28 × Fuel Surcharge) + Driver Bhatta + Perishable Handling + APMC Cess].",
    },
    {
      q: "Can I use VrutiKisan offline in the field?",
      a: "Yes. All previously downloaded Mandi rates, Kisan Khata ledgers, and Crop Planning algorithms run locally on device memory even in zero-network farm fields.",
    },
    {
      q: "How do I lodge a grievance regarding APMC auction price deductions?",
      a: "You can dial the National Kisan Helpline at 1800-180-1551 or submit the digitized auction receipt generated from our OCR board scanner directly to the APMC Mandi Secretary.",
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white border border-[#D6DBD2] rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 text-[#1A2E1A]">
        {/* Header */}
        <div className="bg-[#142614] text-white p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#22C55E] flex items-center justify-center text-white font-black text-lg shadow-xs">
              <HelpCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-white">Kisan Help & Support Desk</h3>
              <p className="text-xs text-[#A6C4A6]">Government Helplines, APMC Grievance & User Manual</p>
            </div>
          </div>

          <button
            onClick={() => setIsHelpModalOpen(false)}
            className="text-[#A6C4A6] hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 space-y-4 text-xs">
          {/* Toll Free Emergency Helpline Banner */}
          <div className="bg-gradient-to-r from-[#166534] to-[#14532D] text-white p-4 rounded-xl shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded">
                National Kisan Call Center
              </span>
              <span className="text-emerald-200 text-[10px] font-mono">24x7 Toll-Free</span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-2xl font-black tracking-wider block font-mono">1800-180-1551</span>
                <span className="text-[11px] text-emerald-150">Direct Agronomist & Mandi Officer Support</span>
              </div>
              <a
                href="tel:18001801551"
                className="bg-[#22C55E] hover:bg-[#16A34A] text-[#0A1F0A] font-bold px-3 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Call Now</span>
              </a>
            </div>
          </div>

          {/* Frequently Asked Questions */}
          <div className="space-y-2">
            <h4 className="font-bold text-[#1A2E1A] text-xs uppercase tracking-wider">
              Frequently Asked Questions (FAQ)
            </h4>
            <div className="space-y-1.5">
              {faqs.map((faq, idx) => (
                <div
                  key={idx}
                  className="border border-[#D6DBD2] rounded-xl overflow-hidden bg-[#F8FAF6]"
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className="w-full p-3 text-left font-bold text-[#1A2E1A] text-xs flex items-center justify-between cursor-pointer hover:bg-[#F1F3EF]"
                  >
                    <span>{faq.q}</span>
                    <span className="text-sm font-bold text-[#15803D]">{openFaq === idx ? "−" : "+"}</span>
                  </button>
                  {openFaq === idx && (
                    <div className="p-3 pt-0 text-[11px] text-[#526652] bg-white border-t border-[#E5EAE1] leading-relaxed">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Quick External Links */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <a
              href="https://enam.gov.in"
              target="_blank"
              rel="noreferrer"
              className="p-2.5 bg-[#F8FAF6] border border-[#D6DBD2] rounded-xl flex items-center justify-between hover:bg-[#F1F3EF] transition-colors"
            >
              <span className="font-bold text-[#1A2E1A]">e-NAM National Portal</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#15803D]" />
            </a>
            <a
              href="https://agmarknet.gov.in"
              target="_blank"
              rel="noreferrer"
              className="p-2.5 bg-[#F8FAF6] border border-[#D6DBD2] rounded-xl flex items-center justify-between hover:bg-[#F1F3EF] transition-colors"
            >
              <span className="font-bold text-[#1A2E1A]">Agmarknet Daily Prices</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#15803D]" />
            </a>
          </div>

          <div className="pt-2">
            <button
              onClick={() => setIsHelpModalOpen(false)}
              className="w-full bg-[#15803D] hover:bg-[#166534] text-white font-bold py-2.5 rounded-xl text-xs shadow-xs transition-colors cursor-pointer"
            >
              Close Support Desk
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
