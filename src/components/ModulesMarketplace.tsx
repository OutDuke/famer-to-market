import React, { useState } from "react";
import {
  Boxes,
  Copy,
  Check,
  Code2,
  Terminal,
  FileCode2,
  Layers,
  ArrowUpRight,
  Sparkles,
  Download,
  BookOpen,
} from "lucide-react";

export const ModulesMarketplace: React.FC = () => {
  const [selectedModuleId, setSelectedModuleId] = useState("freight_estimator");
  const [copiedSnippet, setCopiedSnippet] = useState<string | null>(null);

  const modules = [
    {
      id: "freight_estimator",
      name: "Geo-Distance & Freight Cost API",
      directory: "/modules/freight_estimator",
      stack: "Python 3 + FastAPI + Haversine (Pure Math)",
      desc: "Computes great-circle Haversine distance, applies rural road tortuosity factor (1.28x), and calculates itemized truck freight costs.",
      files: ["main.py", "requirements.txt", ".env.example", "README.md"],
      curlSnippet: `curl -X POST "http://localhost:8001/estimate" \\
  -H "Content-Type: application/json" \\
  -d '{
    "origin": {"name": "Karnal Farm Gate", "latitude": 29.6857, "longitude": 76.9905},
    "destination": {"name": "Azadpur APMC Delhi", "latitude": 28.7158, "longitude": 77.1783},
    "load_weight_quintals": 30.0,
    "vehicle_type": "Mini Truck (Tata 407)",
    "is_perishable": true
  }'`,
      pythonImportSnippet: `from freight_estimator.main import haversine_distance_km, estimate_freight

distance_km = haversine_distance_km(29.6857, 76.9905, 28.7158, 77.1783)
print(f"Aerial Distance: {distance_km} km")`,
    },
    {
      id: "analytics_widget",
      name: "Interactive Mandi Price Analytics Widget",
      directory: "/modules/analytics_widget",
      stack: "Next.js (React) + Recharts + Tailwind CSS",
      desc: "Self-contained React component visualizing 7-day Mandi modal price trends, ceiling bands, regional hub spreads, and arrival volume influx.",
      files: ["AnalyticsWidget.tsx", "package.json", ".env.example", "README.md"],
      curlSnippet: `# React Component Usage in Next.js
import { AnalyticsWidget } from "@/modules/analytics_widget/AnalyticsWidget";

<AnalyticsWidget data={mandiData} />`,
      pythonImportSnippet: `// Standard Generic JSON Prop accepted:
{
  "crop": "Tomato",
  "mandi": "Azadpur APMC",
  "currentPrice": 2450,
  "change7dPercent": 4.8,
  "timeSeries": [...]
}`,
    },
    {
      id: "ledger_engine",
      name: "Kisan Khata & Ledger Engine API",
      directory: "/modules/ledger_engine",
      stack: "Python 3 + FastAPI + Pydantic",
      desc: "Microservice managing produce inventory in godowns, recording cash vs credit wholesale sales, and enforcing buyer credit limits.",
      files: ["main.py", "models.py", "requirements.txt", ".env.example", "README.md"],
      curlSnippet: `curl -X POST "http://localhost:8002/sales/record" \\
  -H "Content-Type: application/json" \\
  -d '{
    "customer_id": "CUST-001",
    "crop": "Wheat (Sharbati)",
    "quantity_quintals": 20,
    "rate_per_quintal": 2750,
    "paid_amount": 15000,
    "notes": "Partial payment, balance due next week"
  }'`,
      pythonImportSnippet: `from ledger_engine.main import add_stock, record_sale, get_pending_dues

# Auto-deducts inventory upon credit sale confirmation`,
    },
    {
      id: "crop_planner",
      name: "Rule-Based Crop Planner API",
      directory: "/modules/crop_planner",
      stack: "Python 3 + FastAPI + Agronomy Rules Matrix",
      desc: "Takes soil type, current month, local temperature, and land acreage to compute ranked crop recommendations and financial projections.",
      files: ["main.py", "rules.py", "requirements.txt", ".env.example", "README.md"],
      curlSnippet: `curl -X POST "http://localhost:8003/plan" \\
  -H "Content-Type: application/json" \\
  -d '{
    "soil_type": "Alluvial Loam",
    "current_month": "October",
    "local_temperature_celsius": 24.0,
    "land_area_acres": 3.0
  }'`,
      pythonImportSnippet: `from crop_planner.rules import evaluate_crop_plan

recommendations = evaluate_crop_plan("Alluvial Loam", "October", 24.0, 3.0)`,
    },
    {
      id: "ocr_extractor",
      name: "Mandi Board OCR Extractor API",
      directory: "/modules/ocr_extractor",
      stack: "Python 3 + FastAPI + Vision Parser",
      desc: "Extracts validated Crop:Price key-value pairs, minimum/maximum/modal auction rates, and moisture grades from uploaded photographs of APMC mandi rate blackboards.",
      files: ["main.py", "requirements.txt", ".env.example", "README.md"],
      curlSnippet: `curl -X POST "http://localhost:8004/extract-board" \\
  -F "file=@mandi_board.jpg" \\
  -F "mandi_hint=Azadpur APMC Yard #2"`,
      pythonImportSnippet: `from ocr_extractor.main import extract_mandi_board

# Returns structured dictionary of { crop_name: modal_price }`,
    },
  ];

  const currentMod = modules.find((m) => m.id === selectedModuleId) || modules[0];

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSnippet(key);
    setTimeout(() => setCopiedSnippet(null), 2000);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="bg-white border border-[#D6DBD2] rounded-xl p-5 shadow-xs relative overflow-hidden text-[#1A2E1A]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-[#DCFCE7] text-[#166534] border border-[#86EFAC]">
                ARCHITECTURE CORE RULE
              </span>
              <span className="text-xs text-[#526652] font-medium">
                5 Strictly Isolated Plug-and-Play Assets
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-[#1A2E1A] mt-1">
              Modules Marketplace & Developer Hub
            </h2>
            <p className="text-xs sm:text-sm text-[#526652] mt-1 max-w-2xl">
              Each module is completely isolated in the <code className="text-[#15803D] font-bold">/modules/</code> directory with its own dependency manifest (<code className="text-[#1A2E1A] font-semibold">requirements.txt</code> or <code className="text-[#1A2E1A] font-semibold">package.json</code>) and <code className="text-[#1A2E1A] font-semibold">.env.example</code>, ready to be packaged or licensed to other hackathon teams.
            </p>
          </div>

          <div className="p-3 bg-[#F1F3EF] border border-[#D6DBD2] rounded-lg text-right">
            <span className="text-[11px] text-[#526652] block">Total Isolated Microservices</span>
            <div className="text-lg sm:text-xl font-black text-[#15803D]">5 Standalone Assets</div>
          </div>
        </div>
      </div>

      {/* Module Selector Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5">
        {modules.map((m, idx) => (
          <button
            key={m.id}
            onClick={() => setSelectedModuleId(m.id)}
            className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
              selectedModuleId === m.id
                ? "bg-[#DCFCE7]/70 border-[#15803D] shadow-xs text-[#1A2E1A]"
                : "bg-white border-[#D6DBD2] hover:bg-[#F8FAF6] text-[#526652]"
            }`}
          >
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-mono text-[#15803D] font-black">M{idx + 1}</span>
              <span className="text-[10px] bg-[#F1F3EF] border border-[#D6DBD2] px-1.5 py-0.2 rounded text-[#526652] font-semibold">Isolated</span>
            </div>
            <div className="font-bold text-[#1A2E1A] text-xs line-clamp-1">{m.name}</div>
            <div className="text-[10px] text-[#526652] mt-1 font-mono">{m.directory}</div>
          </button>
        ))}
      </div>

      {/* Selected Module Detail Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Specification Column */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white border border-[#D6DBD2] rounded-xl p-4 sm:p-5 space-y-4 shadow-xs text-[#1A2E1A]">
            <div>
              <span className="text-xs font-bold text-[#15803D] uppercase tracking-wider">
                Module Specification
              </span>
              <h3 className="text-lg sm:text-xl font-black text-[#1A2E1A] mt-0.5">{currentMod.name}</h3>
              <p className="text-xs text-[#526652] mt-2 leading-relaxed">{currentMod.desc}</p>
            </div>

            <div className="space-y-2.5 pt-3 border-t border-[#E5EAE1] text-xs">
              <div>
                <span className="text-[#526652] block font-medium">Isolated Root Directory:</span>
                <code className="bg-[#F1F3EF] text-[#15803D] border border-[#D6DBD2] px-2 py-0.5 rounded font-mono text-[11px] block mt-0.5 font-bold">
                  {currentMod.directory}
                </code>
              </div>

              <div>
                <span className="text-[#526652] block font-medium">Technology Stack:</span>
                <strong className="text-[#1A2E1A] block mt-0.5">{currentMod.stack}</strong>
              </div>

              <div>
                <span className="text-[#526652] block font-medium">Manifest & Config Files:</span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {(currentMod?.files || []).map((f) => (
                    <span
                      key={f}
                      className="px-2 py-0.5 bg-[#F8FAF6] text-[#1A2E1A] border border-[#D6DBD2] rounded text-[11px] font-mono flex items-center gap-1 font-medium"
                    >
                      <FileCode2 className="w-3 h-3 text-[#15803D]" />
                      <span>{f}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Code Inspection & cURL Column */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white border border-[#D6DBD2] rounded-xl p-4 sm:p-5 space-y-4 shadow-xs text-[#1A2E1A]">
            {/* cURL Snippet */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#1A2E1A] uppercase tracking-wider flex items-center gap-1.5">
                  <Terminal className="w-4 h-4 text-[#15803D]" />
                  <span>Standalone Microservice cURL Command</span>
                </span>
                <button
                  onClick={() => copyToClipboard(currentMod.curlSnippet, "curl")}
                  className="text-xs text-[#526652] hover:text-[#15803D] flex items-center gap-1 transition-colors font-medium cursor-pointer"
                >
                  {copiedSnippet === "curl" ? <Check className="w-3.5 h-3.5 text-[#15803D]" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedSnippet === "curl" ? "Copied!" : "Copy cURL"}</span>
                </button>
              </div>

              <pre className="bg-[#1A2E1A] border border-[#2D452D] rounded-lg p-3.5 text-xs text-[#86EFAC] font-mono overflow-x-auto whitespace-pre-wrap leading-relaxed">
                {currentMod.curlSnippet}
              </pre>
            </div>

            {/* Python / Next.js Integration Snippet */}
            <div className="space-y-2 pt-2 border-t border-[#E5EAE1]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#1A2E1A] uppercase tracking-wider flex items-center gap-1.5">
                  <Code2 className="w-4 h-4 text-sky-600" />
                  <span>Import & Orchestration Interface</span>
                </span>
                <button
                  onClick={() => copyToClipboard(currentMod.pythonImportSnippet, "code")}
                  className="text-xs text-[#526652] hover:text-sky-600 flex items-center gap-1 transition-colors font-medium cursor-pointer"
                >
                  {copiedSnippet === "code" ? <Check className="w-3.5 h-3.5 text-sky-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedSnippet === "code" ? "Copied!" : "Copy Code"}</span>
                </button>
              </div>

              <pre className="bg-[#F8FAF6] border border-[#D6DBD2] rounded-lg p-3.5 text-xs text-[#1A2E1A] font-mono overflow-x-auto whitespace-pre-wrap leading-relaxed">
                {currentMod.pythonImportSnippet}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
