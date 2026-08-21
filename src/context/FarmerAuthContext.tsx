import React, { createContext, useContext, useState, useEffect } from "react";
import { FarmerProfile } from "../types";

export const DEFAULT_FARMER_PROFILES: FarmerProfile[] = [
  {
    id: "kpp_001",
    kppNumber: "KPP-2024-MH-9281",
    name: "Rameshwar Patil",
    phone: "+91 98234 56789",
    aadhaarLast4: "4920",
    state: "Maharashtra",
    district: "Nashik",
    taluka: "Niphad",
    village: "Pimpalgaon Baswant",
    landAcres: 4.5,
    soilType: "Black Cotton Soil (Heavy Vertisol)",
    primaryCrops: ["Onion (Nashik Red)", "Tomato (Hybrid A)", "Grapes"],
    khasraNumber: "74/2A & 75/1",
    bankKycVerified: true,
    agriStackVerified: true,
    registrationDate: "14-Feb-2024",
  },
  {
    id: "kpp_002",
    kppNumber: "KPP-2024-PB-3401",
    name: "Sukhwinder Singh",
    phone: "+91 98765 43210",
    aadhaarLast4: "7103",
    state: "Punjab",
    district: "Ludhiana",
    taluka: "Khanna",
    village: "Bhaini Sahib",
    landAcres: 12.0,
    soilType: "Alluvial Loam (Rich Indo-Gangetic)",
    primaryCrops: ["Wheat (Sharbati)", "Mustard (Yellow Pilli)", "Paddy Basmati"],
    khasraNumber: "112/5B",
    bankKycVerified: true,
    agriStackVerified: true,
    registrationDate: "03-Jan-2024",
  },
  {
    id: "kpp_003",
    kppNumber: "KPP-2024-KA-7712",
    name: "Anandamma Reddy",
    phone: "+91 94481 22390",
    aadhaarLast4: "8821",
    state: "Karnataka",
    district: "Kolar",
    taluka: "Srinivaspur",
    village: "Rayalpad",
    landAcres: 3.2,
    soilType: "Red Sandy Loam",
    primaryCrops: ["Tomato (Solanum)", "Mango (Alphonso)", "Ragi / Pulses"],
    khasraNumber: "42/3C",
    bankKycVerified: true,
    agriStackVerified: true,
    registrationDate: "19-Mar-2024",
  },
];

interface FarmerAuthContextType {
  currentFarmer: FarmerProfile;
  isAuthenticated: boolean;
  profiles: FarmerProfile[];
  availableProfiles: FarmerProfile[];
  loginWithKPP: (kppNumber: string, otp: string) => Promise<{ success: boolean; message?: string }>;
  loginWithPhone: (phone: string, otp: string) => Promise<{ success: boolean; message?: string }>;
  registerFarmer: (newProfile: Omit<FarmerProfile, "id" | "kppNumber" | "registrationDate" | "bankKycVerified" | "agriStackVerified">) => FarmerProfile;
  switchProfile: (profileId: string) => void;
  selectFarmer: (profileId: string) => void;
  logout: () => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  isCardModalOpen: boolean;
  setIsCardModalOpen: (open: boolean) => void;
}

const FarmerAuthContext = createContext<FarmerAuthContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY_CURRENT = "vrutikisan_current_farmer";
const LOCAL_STORAGE_KEY_PROFILES = "vrutikisan_all_profiles";

export const FarmerAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profiles, setProfiles] = useState<FarmerProfile[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_PROFILES);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // fallback
    }
    return DEFAULT_FARMER_PROFILES;
  });

  const [currentFarmer, setCurrentFarmer] = useState<FarmerProfile>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_CURRENT);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // fallback
    }
    return DEFAULT_FARMER_PROFILES[0];
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isCardModalOpen, setIsCardModalOpen] = useState<boolean>(false);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY_CURRENT, JSON.stringify(currentFarmer));
  }, [currentFarmer]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY_PROFILES, JSON.stringify(profiles));
  }, [profiles]);

  const loginWithKPP = async (kppNumber: string, otp: string): Promise<{ success: boolean; message?: string }> => {
    // Simulate verification
    const cleanKpp = kppNumber.trim().toUpperCase();
    const found = profiles.find((p) => p.kppNumber.toUpperCase() === cleanKpp || p.phone.includes(cleanKpp));
    
    if (found) {
      setCurrentFarmer(found);
      setIsAuthenticated(true);
      return { success: true };
    }

    // If not found in demo, create standard profile for entered KPP
    if (cleanKpp.startsWith("KPP") || cleanKpp.length >= 8) {
      const autoProfile: FarmerProfile = {
        id: `kpp_${Date.now()}`,
        kppNumber: cleanKpp.startsWith("KPP") ? cleanKpp : `KPP-2024-${cleanKpp.substring(0, 4).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`,
        name: "Verified Kisan User",
        phone: "+91 98XXX XXXXX",
        aadhaarLast4: "9901",
        state: "Maharashtra",
        district: "Nashik",
        taluka: "Central",
        village: "Farm Gate 1",
        landAcres: 5.0,
        soilType: "Black Cotton Soil (Vertisol)",
        primaryCrops: ["Onion", "Tomato", "Wheat"],
        khasraNumber: "101/A",
        bankKycVerified: true,
        agriStackVerified: true,
        registrationDate: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
      };
      setProfiles((prev) => [autoProfile, ...prev]);
      setCurrentFarmer(autoProfile);
      setIsAuthenticated(true);
      return { success: true };
    }

    return { success: false, message: "Invalid Kisan Pehchaan Patra format. Try e.g. KPP-2024-MH-9281 or use a quick demo profile." };
  };

  const loginWithPhone = async (phone: string, _otp: string): Promise<{ success: boolean; message?: string }> => {
    const cleanPhone = phone.replace(/[^0-9]/g, "");
    const found = profiles.find((p) => p.phone.replace(/[^0-9]/g, "").includes(cleanPhone));
    if (found) {
      setCurrentFarmer(found);
      setIsAuthenticated(true);
      return { success: true };
    }
    return { success: false, message: "Phone number not registered. Please register your Kisan Pehchaan Patra below." };
  };

  const registerFarmer = (
    newProfileData: Omit<FarmerProfile, "id" | "kppNumber" | "registrationDate" | "bankKycVerified" | "agriStackVerified">
  ): FarmerProfile => {
    const stateCode = newProfileData.state.substring(0, 2).toUpperCase() || "IN";
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const newKpp = `KPP-2024-${stateCode}-${randomNum}`;

    const newProfile: FarmerProfile = {
      ...newProfileData,
      id: `kpp_${Date.now()}`,
      kppNumber: newKpp,
      bankKycVerified: true,
      agriStackVerified: true,
      registrationDate: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
    };

    setProfiles((prev) => [newProfile, ...prev]);
    setCurrentFarmer(newProfile);
    setIsAuthenticated(true);
    return newProfile;
  };

  const switchProfile = (profileId: string) => {
    const found = profiles.find((p) => p.id === profileId);
    if (found) {
      setCurrentFarmer(found);
      setIsAuthenticated(true);
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  return (
    <FarmerAuthContext.Provider
      value={{
        currentFarmer,
        isAuthenticated,
        profiles,
        availableProfiles: profiles,
        loginWithKPP,
        loginWithPhone,
        registerFarmer,
        switchProfile,
        selectFarmer: switchProfile,
        logout,
        isAuthModalOpen,
        setIsAuthModalOpen,
        isCardModalOpen,
        setIsCardModalOpen,
      }}
    >
      {children}
    </FarmerAuthContext.Provider>
  );
};

export const useFarmerAuth = () => {
  const context = useContext(FarmerAuthContext);
  if (!context) {
    throw new Error("useFarmerAuth must be used within a FarmerAuthProvider");
  }
  return context;
};
