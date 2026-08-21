import React, { createContext, useContext, useState, useEffect } from "react";

export type ThemeMode = "light" | "dark" | "sunlight";
export type SupportedLanguage = "en" | "hi" | "mr" | "pa" | "kn";

interface AppSettings {
  theme: ThemeMode;
  language: SupportedLanguage;
  dieselPrice: number;
  weightUnit: "quintal" | "kg" | "ton";
  priceAlerts: boolean;
  smsNotifications: boolean;
  autoRefreshMandiSec: number;
  highContrastMode: boolean;
}

interface AppSettingsContextType {
  settings: AppSettings;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
  setTheme: (theme: ThemeMode) => void;
  setLanguage: (lang: SupportedLanguage) => void;
  isAccountModalOpen: boolean;
  setIsAccountModalOpen: (open: boolean) => void;
  isSettingsModalOpen: boolean;
  setIsSettingsModalOpen: (open: boolean) => void;
  isHelpModalOpen: boolean;
  setIsHelpModalOpen: (open: boolean) => void;
  isVersionModalOpen: boolean;
  setIsVersionModalOpen: (open: boolean) => void;
  isOnboardingOpen: boolean;
  setIsOnboardingOpen: (open: boolean) => void;
}

const DEFAULT_SETTINGS: AppSettings = {
  theme: "light",
  language: "en",
  dieselPrice: 89.5,
  weightUnit: "quintal",
  priceAlerts: true,
  smsNotifications: true,
  autoRefreshMandiSec: 60,
  highContrastMode: false,
};

const AppSettingsContext = createContext<AppSettingsContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY_SETTINGS = "vrutikisan_app_settings";

export const AppSettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettingsState] = useState<AppSettings>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_SETTINGS);
      if (saved) {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
      }
    } catch {
      // fallback
    }
    return DEFAULT_SETTINGS;
  });

  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [isVersionModalOpen, setIsVersionModalOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(() => {
    try {
      const onboarded = localStorage.getItem("vrutikisan_onboarded");
      return !onboarded; // Open by default if first time!
    } catch {
      return false;
    }
  });

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY_SETTINGS, JSON.stringify(settings));
    // Apply theme class to document
    const root = document.documentElement;
    root.classList.remove("dark", "sunlight-mode");
    if (settings.theme === "dark") {
      root.classList.add("dark");
    } else if (settings.theme === "sunlight") {
      root.classList.add("sunlight-mode");
    }
  }, [settings]);

  const updateSettings = (newSettings: Partial<AppSettings>) => {
    setSettingsState((prev) => ({ ...prev, ...newSettings }));
  };

  const setTheme = (theme: ThemeMode) => {
    updateSettings({ theme });
  };

  const setLanguage = (language: SupportedLanguage) => {
    updateSettings({ language });
  };

  return (
    <AppSettingsContext.Provider
      value={{
        settings,
        updateSettings,
        setTheme,
        setLanguage,
        isAccountModalOpen,
        setIsAccountModalOpen,
        isSettingsModalOpen,
        setIsSettingsModalOpen,
        isHelpModalOpen,
        setIsHelpModalOpen,
        isVersionModalOpen,
        setIsVersionModalOpen,
        isOnboardingOpen,
        setIsOnboardingOpen,
      }}
    >
      {children}
    </AppSettingsContext.Provider>
  );
};

export const useAppSettings = () => {
  const context = useContext(AppSettingsContext);
  if (!context) {
    throw new Error("useAppSettings must be used within AppSettingsProvider");
  }
  return context;
};
