export interface LocationPoint {
  name: string;
  latitude: number;
  longitude: number;
}

export interface FreightCostBreakdown {
  baseDistanceFreight: number;
  fuelComponent: number;
  labourHandling: number;
  driverBhatta: number;
  tollsAndPermits: number;
  perishabilityPremium: number;
}

export interface FreightEstimateResult {
  origin: LocationPoint;
  destination: LocationPoint;
  metrics: {
    aerialDistanceKm: number;
    roadDistanceKm: number;
    estimatedTransitHours: number;
    totalFreightCost: number;
    costPerQuintal: number;
    costPerKm: number;
    loadWeightQuintals: number;
    vehicleType: string;
    breakdown: FreightCostBreakdown;
  };
}

export interface MandiDataPoint {
  date: string;
  modalPrice: number;
  minPrice?: number;
  maxPrice?: number;
  AzadpurMandi?: number;
  LocalDistrictMandi?: number;
  RegionalHubMandi?: number;
  arrivalVolumeTonnes?: number;
  [key: string]: any;
}

export interface MandiAnalyticsData {
  crop: string;
  mandi: string;
  unit: string;
  currentPrice: number;
  change7dPercent: number;
  volatilityIndex: string;
  sellingRecommendation: string;
  timeSeries: MandiDataPoint[];
}

export interface InventoryItem {
  id: string;
  crop: string;
  variety: string;
  quantityQuintals: number;
  harvestDate: string;
  storageLocation: string;
  minimumTargetPrice: number;
}

export interface CustomerLedger {
  id: string;
  name: string;
  phone: string;
  village: string;
  creditLimit: number;
  totalPurchased: number;
  totalPaid: number;
  outstandingDue: number;
  lastTransactionDate: string;
}

export interface TransactionRecord {
  id: string;
  customerId: string;
  customerName: string;
  crop: string;
  quantityQuintals: number;
  ratePerQuintal: number;
  totalAmount: number;
  paidAmount: number;
  creditAmount: number;
  status: "PAID" | "PARTIAL" | "CREDIT";
  date: string;
  notes?: string;
}

export interface CropRecommendation {
  cropName: string;
  variety: string;
  suitabilityScore: number;
  sowingWindow: string;
  harvestDurationDays: number;
  estimatedHarvestMonth: string;
  expectedYieldPerAcreQuintals: number;
  estimatedCostPerAcreRs: number;
  projectedMandiPricePerQuintalRs: number;
  estimatedGrossRevenuePerAcreRs: number;
  estimatedNetProfitPerAcreRs: number;
  totalProjectedNetProfitRs: number;
  waterRequirement: string;
  soilFitnessReason: string;
  pestRiskLevel: "Low" | "Medium" | "High";
  marketDemandOutlook: "High Growth" | "Stable" | "Volatile";
}

export interface CropPlanResult {
  inputParams: {
    soilType: string;
    currentMonth: string;
    localTemperatureCelsius: number;
    waterAvailability: string;
    landAreaAcres: number;
  };
  agroSeason: string;
  recommendationsCount: number;
  primaryCrop: CropRecommendation;
  allRecommendations: CropRecommendation[];
  agronomyTips: string[];
}

export interface OcrExtractedRate {
  crop: string;
  minPrice: number;
  maxPrice: number;
  modalPrice: number;
  unit: string;
  confidenceScore: number;
  arrivalVolume: string;
  detectedGrade: string;
  bbox?: { x: number; y: number; width: number; height: number };
}

export interface OcrResult {
  metadata: {
    mandiLocation: string;
    capturedDate: string;
    timestamp: string;
    boardLanguageDetected: string;
    scanResolution: string;
    averageConfidence: string;
    totalCropsParsed: number;
    rawTextDump: string;
  };
  extractedRates: OcrExtractedRate[];
}
