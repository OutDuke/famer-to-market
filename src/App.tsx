import React, { useState } from "react";
import { FarmerAuthProvider } from "./context/FarmerAuthContext";
import { AppSettingsProvider, useAppSettings } from "./context/AppSettingsContext";
import { Sidebar } from "./components/Sidebar";
import { Header } from "./components/Header";
import { BottomFeatureDock } from "./components/BottomFeatureDock";
import { KisanAuthModal } from "./components/KisanAuthModal";
import { AccountModal } from "./components/AccountModal";
import { SettingsModal } from "./components/SettingsModal";
import { HelpModal } from "./components/HelpModal";
import { VersionModal } from "./components/VersionModal";
import { OnboardingWizard } from "./components/OnboardingWizard";
import { DecisionSummary } from "./components/DecisionSummary";
import { FreightEstimator } from "./components/FreightEstimator";
import { MandiAnalytics } from "./components/MandiAnalytics";
import { KhataLedger } from "./components/KhataLedger";
import { CropPlanner } from "./components/CropPlanner";
import { OcrScanner } from "./components/OcrScanner";
import { ShieldCheck, Sparkles } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

function MainLayout() {
  const [activeTab, setActiveTab] = useState("decision");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isWideMode, setIsWideMode] = useState(true);
  const { isOnboardingOpen, setIsOnboardingOpen } = useAppSettings();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F19] text-slate-900 dark:text-slate-100 font-sans flex flex-col selection:bg-emerald-500 selection:text-white relative">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
      />

      {/* Modal Dialogs & Guided Workflows */}
      <OnboardingWizard
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
        onNavigateTab={setActiveTab}
      />
      <KisanAuthModal />
      <AccountModal />
      <SettingsModal />
      <HelpModal />
      <VersionModal />

      {/* Main Content Area (Offset by Sidebar on Desktop) */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          isSidebarCollapsed ? "lg:pl-20" : "lg:pl-72"
        }`}
      >
        {/* Top Header */}
        <Header
          activeTab={activeTab}
          onOpenSidebar={() => setIsSidebarOpen(true)}
          isWideMode={isWideMode}
          setIsWideMode={setIsWideMode}
        />

        {/* Dynamic Views Container with buttery smooth tab transitions and clean spacing */}
        <main
          className={`flex-1 w-full mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-6 pb-24 lg:pb-12 ${
            isWideMode ? "max-w-[1640px]" : "max-w-7xl"
          }`}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18, ease: "easeInOut" }}
            >
              {activeTab === "decision" && <DecisionSummary onNavigateTab={setActiveTab} />}
              {activeTab === "freight" && <FreightEstimator />}
              {activeTab === "analytics" && <MandiAnalytics />}
              {activeTab === "khata" && <KhataLedger />}
              {activeTab === "crop" && <CropPlanner />}
              {activeTab === "ocr" && <OcrScanner />}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Polished App Footer */}
        <footer className="border-t border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900/60 py-3.5 text-xs text-slate-500 dark:text-slate-400 mt-auto">
          <div
            className={`w-full mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 ${
              isWideMode ? "max-w-[1640px]" : "max-w-7xl"
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="font-extrabold text-slate-900 dark:text-white">VrutiKisan</span>
              <span>•</span>
              <span className="text-slate-500 dark:text-slate-400">Agri-Commerce & Arbitrage Intelligence</span>
            </div>

            <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Kisan Pehchaan Patra (KPP) Integrated</span>
              </span>
              <span>•</span>
              <span className="font-mono text-[11px]">AgriStack Protocol v2.4</span>
            </div>
          </div>
        </footer>

        {/* Mobile-only Bottom Dock (Clean, non-overlapping on desktop) */}
        <BottomFeatureDock
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <FarmerAuthProvider>
      <AppSettingsProvider>
        <MainLayout />
      </AppSettingsProvider>
    </FarmerAuthProvider>
  );
}
