export interface FarmerProfile {
  id: string; // KPP ID
  kppNumber: string; // e.g., "KPP-2024-MH-9281"
  name: string;
  phone: string;
  aadhaarLast4: string;
  state: string;
  district: string;
  taluka: string;
  village: string;
  landAcres: number;
  soilType: string;
  primaryCrops: string[];
  khasraNumber: string;
  bankKycVerified: boolean;
  agriStackVerified: boolean;
  avatarUrl?: string;
  registrationDate: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  currentFarmer: FarmerProfile;
  availableProfiles: FarmerProfile[];
}

export interface LocationPoint {
  name: string;
  latitude: number;
  longitude: number;
}

export interface FreightEstimateResult {
  success: boolean;
  origin: string;
  destination: string;
  straightLineDistanceKm: number;
  roadDistanceKm: number;
  estimatedTransitHours: number;
  vehicleSelected: string;
  loadWeightQuintals: number;
  costBreakdown: {
    baseFreightCost: number;
    fuelCost: number;
    driverBhattaAllowance: number;
    perishableHandlingCharge: number;
    tollAndTaxes: number;
    totalFreightCost: number;
    costPerQuintal: number;
    costPerKm: number;
  };
  fuelMetrics: {
    dieselPricePerLitre: number;
    litresRequired: number;
    vehicleMileageKmPerLitre: number;
  };
  carbonEmissionKg: number;
  profitabilityIndexScore: number;
}

export interface MandiAnalyticsData {
  crop: string;
  mandi: string;
  unit: string;
  currentPrice: number;
  change7dPercent: number;
  volatilityIndex: string;
  sellingRecommendation: string;
  timeSeries: {
    date: string;
    modalPrice: number;
    AzadpurMandi?: number;
    LocalDistrictMandi?: number;
    arrivalVolumeTonnes: number;
  }[];
}

export interface CustomerLedger {
  id: string;
  name: string;
  mandiShop: string;
  phone: string;
  outstandingDue: number;
  currentBalance?: number;
  creditLimit: number;
  riskScore: "LOW" | "MEDIUM" | "HIGH";
  lastPaymentDate: string;
  paymentReliabilityPercent: number;
}

export interface InventoryItem {
  id: string;
  cropName: string;
  variety: string;
  quantityQuintals: number;
  storageLocation: string;
  harvestDate: string;
  minAcceptablePrice: number;
  estTotalValue: number;
}

export interface TransactionRecord {
  id: string;
  date: string;
  type: "SALE" | "PAYMENT_RECEIVED" | "ADVANCE";
  customerId: string;
  customerName: string;
  cropName?: string;
  quantityQuintals?: number;
  ratePerQuintal?: number;
  amount?: number;
  totalAmount: number;
  paymentMode: "CASH" | "UPI" | "NEFT_RTGS" | "CREDIT_KHATA";
  referenceNotes?: string;
  receiptNumber: string;
}

export interface CropRecommendation {
  cropName: string;
  suitabilityScore: number;
  seasonType: string;
  maturityDays: number;
  waterRequirement: string;
  estCostPerAcre: number;
  estYieldPerAcreQuintals: number;
  estModalSellingPricePerQtl: number;
  estGrossRevenue: number;
  estNetProfit: number;
  profitMarginPercent: number;
  keyRisks: string[];
  expertAdvice: string;
}

export interface CropPlanResult {
  success: boolean;
  soilType: string;
  currentMonth: string;
  landAreaAcres: number;
  agroZone: string;
  agroSeason?: string;
  recommendations: CropRecommendation[];
}

export interface ExtractedCommodityRate {
  cropName: string;
  variety: string;
  minPrice: number;
  modalPrice: number;
  maxPrice: number;
  unit: string;
  confidenceScore: number;
}

export interface OcrResult {
  success: boolean;
  mandiName: string;
  boardDate: string;
  languageDetected: string;
  qualityScore: number;
  rawText: string;
  extractedRates: ExtractedCommodityRate[];
  discrepancies: string[];
}
