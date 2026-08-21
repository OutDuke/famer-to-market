import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

// Initialize optional Gemini AI for enhanced OCR parsing or advisory if key is present
const getGeminiClient = () => {
  if (process.env.GEMINI_API_KEY) {
    return new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return null;
};

// --- In-Memory Khata Ledger Store ---
interface LedgerCustomer {
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

interface LedgerTransaction {
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

interface InventoryItem {
  id: string;
  crop: string;
  variety: string;
  quantityQuintals: number;
  harvestDate: string;
  storageLocation: string;
  minimumTargetPrice: number;
}

let customers: LedgerCustomer[] = [
  {
    id: "CUST-001",
    name: "Ramesh Aggarwal (Wholesale Trading)",
    phone: "+91 98765 43210",
    village: "Azadpur Mandi, Delhi",
    creditLimit: 150000,
    totalPurchased: 240000,
    totalPaid: 180000,
    outstandingDue: 60000,
    lastTransactionDate: "2026-08-18",
  },
  {
    id: "CUST-002",
    name: "Gupta Sabzi Bhandar",
    phone: "+91 98112 34567",
    village: "Sector 18, Noida",
    creditLimit: 80000,
    totalPurchased: 95000,
    totalPaid: 70000,
    outstandingDue: 25000,
    lastTransactionDate: "2026-08-19",
  },
  {
    id: "CUST-003",
    name: "Kisan Agro Processing Mill",
    phone: "+91 97234 56789",
    village: "Sonipat Industrial Area",
    creditLimit: 300000,
    totalPurchased: 520000,
    totalPaid: 480000,
    outstandingDue: 40000,
    lastTransactionDate: "2026-08-15",
  },
  {
    id: "CUST-004",
    name: "Vikas Local Retail",
    phone: "+91 94567 89012",
    village: "Murthal",
    creditLimit: 30000,
    totalPurchased: 28000,
    totalPaid: 28000,
    outstandingDue: 0,
    lastTransactionDate: "2026-08-10",
  }
];

let transactions: LedgerTransaction[] = [
  {
    id: "TXN-101",
    customerId: "CUST-001",
    customerName: "Ramesh Aggarwal (Wholesale Trading)",
    crop: "Wheat (Sharbati)",
    quantityQuintals: 40,
    ratePerQuintal: 2750,
    totalAmount: 110000,
    paidAmount: 50000,
    creditAmount: 60000,
    status: "PARTIAL",
    date: "2026-08-18",
    notes: "Part cash received, balance promised in 7 days."
  },
  {
    id: "TXN-102",
    customerId: "CUST-002",
    customerName: "Gupta Sabzi Bhandar",
    crop: "Tomato (Hybrid Red)",
    quantityQuintals: 15,
    ratePerQuintal: 2400,
    totalAmount: 36000,
    paidAmount: 11000,
    creditAmount: 25000,
    status: "PARTIAL",
    date: "2026-08-19",
    notes: "Weekly delivery on credit ledger."
  },
  {
    id: "TXN-103",
    customerId: "CUST-003",
    customerName: "Kisan Agro Processing Mill",
    crop: "Mustard (Pusa Bold)",
    quantityQuintals: 30,
    ratePerQuintal: 5400,
    totalAmount: 162000,
    paidAmount: 122000,
    creditAmount: 40000,
    status: "PARTIAL",
    date: "2026-08-15",
    notes: "Bulk milling supply."
  }
];

let inventory: InventoryItem[] = [
  {
    id: "INV-01",
    crop: "Wheat (Sharbati)",
    variety: "C-306",
    quantityQuintals: 85,
    harvestDate: "2026-04-20",
    storageLocation: "Farm Godown #1",
    minimumTargetPrice: 2600,
  },
  {
    id: "INV-02",
    crop: "Tomato (Hybrid Red)",
    variety: "Abhinav F1",
    quantityQuintals: 32,
    harvestDate: "2026-08-17",
    storageLocation: "Cooling Shed",
    minimumTargetPrice: 2200,
  },
  {
    id: "INV-03",
    crop: "Onion (Nashik Red)",
    variety: "Bhima Super",
    quantityQuintals: 120,
    harvestDate: "2026-05-10",
    storageLocation: "Dry Storage Deck B",
    minimumTargetPrice: 2800,
  },
  {
    id: "INV-04",
    crop: "Potato (Jyoti)",
    variety: "Kufri Jyoti",
    quantityQuintals: 95,
    harvestDate: "2026-03-25",
    storageLocation: "Cold Store Room #3",
    minimumTargetPrice: 1600,
  }
];

// --- Haversine Distance Helper ---
function haversineDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371.0; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 100) / 100;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "25mb" }));

  // ==========================================
  // MODULE 1 API: Geo-Distance & Freight Estimator
  // ==========================================
  app.post("/api/freight/estimate", (req, res) => {
    try {
      const {
        originLat,
        originLon,
        originName,
        destLat,
        destLon,
        destName,
        loadWeightQuintals = 20,
        vehicleType = "Mini Truck (Tata 407 / Bolero Maxi)",
        dieselPricePerLitre = 90.5,
        isPerishable = false,
      } = req.body;

      if (
        originLat === undefined ||
        originLon === undefined ||
        destLat === undefined ||
        destLon === undefined
      ) {
        return res.status(400).json({ error: "Missing coordinates (origin or destination)" });
      }

      const aerialDistanceKm = haversineDistanceKm(
        Number(originLat),
        Number(originLon),
        Number(destLat),
        Number(destLon)
      );

      // Road tortuosity factor in rural/semi-urban India (~1.25x - 1.35x aerial distance)
      const roadFactor = 1.28;
      const roadDistanceKm = Math.round(aerialDistanceKm * roadFactor * 10) / 10;

      // Vehicle capacity & base rate configurations
      let baseRatePerKm = 18;
      let maxPayloadQuintals = 25;
      let mileageKmPerLitre = 9;

      if (vehicleType.toLowerCase().includes("small") || vehicleType.toLowerCase().includes("pickup")) {
        baseRatePerKm = 14;
        maxPayloadQuintals = 15;
        mileageKmPerLitre = 12;
      } else if (vehicleType.toLowerCase().includes("mini") || vehicleType.toLowerCase().includes("407")) {
        baseRatePerKm = 22;
        maxPayloadQuintals = 35;
        mileageKmPerLitre = 8;
      } else if (vehicleType.toLowerCase().includes("eicher") || vehicleType.toLowerCase().includes("medium")) {
        baseRatePerKm = 32;
        maxPayloadQuintals = 70;
        mileageKmPerLitre = 6;
      } else if (vehicleType.toLowerCase().includes("heavy") || vehicleType.toLowerCase().includes("10-tyre")) {
        baseRatePerKm = 52;
        maxPayloadQuintals = 160;
        mileageKmPerLitre = 3.8;
      }

      // Fuel consumption cost
      const totalFuelLitres = Math.round((roadDistanceKm / mileageKmPerLitre) * 10) / 10;
      const fuelCost = Math.round(totalFuelLitres * dieselPricePerLitre);

      // Base driver & vehicle maintenance rate
      const driverDailyBhatta = roadDistanceKm > 100 ? 500 : 300;
      const loadingUnloadingLabour = Math.round(loadWeightQuintals * 15); // Rs 15 per quintal handling
      const tollAndTaxes = Math.round(roadDistanceKm * 1.2);

      // Perishable surcharge (reefer / tarp / express speed constraint)
      const perishabilityPremium = isPerishable ? 0.15 : 0.0;

      const subtotalFreight =
        (roadDistanceKm * baseRatePerKm) +
        fuelCost * 0.4 +
        driverDailyBhatta +
        loadingUnloadingLabour +
        tollAndTaxes;

      const totalFreightCost = Math.round(subtotalFreight * (1 + perishabilityPremium));
      const costPerQuintal = loadWeightQuintals > 0 ? Math.round((totalFreightCost / loadWeightQuintals) * 100) / 100 : 0;
      const costPerKm = roadDistanceKm > 0 ? Math.round((totalFreightCost / roadDistanceKm) * 100) / 100 : 0;

      // Estimated Transit Duration (Average rural mandi transit speed: ~38 km/h + 45 min loading/mandi gate check)
      const transitHours = Math.round(((roadDistanceKm / 38) + 0.75) * 10) / 10;

      return res.json({
        success: true,
        origin: { name: originName || "Farm Location", lat: originLat, lon: originLon, latitude: originLat, longitude: originLon },
        destination: { name: destName || "Target Mandi", lat: destLat, lon: destLon, latitude: destLat, longitude: destLon },
        route: {
          origin: { name: originName || "Farm Location", lat: originLat, lon: originLon, latitude: originLat, longitude: originLon },
          destination: { name: destName || "Target Mandi", lat: destLat, lon: destLon, latitude: destLat, longitude: destLon }
        },
        metrics: {
          aerialDistanceKm,
          roadDistanceKm,
          estimatedTransitHours: transitHours,
          fuelNeededLitres: totalFuelLitres,
          totalFreightCost,
          costPerQuintal,
          costPerKm,
          loadWeightQuintals,
          vehicleType,
          breakdown: {
            baseFreight: Math.round(roadDistanceKm * baseRatePerKm),
            fuelSurcharge: fuelCost,
            driverBhatta: driverDailyBhatta,
            tollCharges: tollAndTaxes,
            loadingUnloading: loadingUnloadingLabour,
            perishabilityPremium: Math.round(subtotalFreight * perishabilityPremium),
            baseDistanceFreight: Math.round(roadDistanceKm * baseRatePerKm),
            fuelComponent: fuelCost,
            labourHandling: loadingUnloadingLabour,
            tollsAndPermits: tollAndTaxes
          }
        },
        breakdown: {
          baseFreight: Math.round(roadDistanceKm * baseRatePerKm),
          fuelSurcharge: fuelCost,
          driverBhatta: driverDailyBhatta,
          tollCharges: tollAndTaxes,
          loadingUnloading: loadingUnloadingLabour,
          perishabilityPremium: Math.round(subtotalFreight * perishabilityPremium),
          baseDistanceFreight: Math.round(roadDistanceKm * baseRatePerKm),
          fuelComponent: fuelCost,
          labourHandling: loadingUnloadingLabour,
          tollsAndPermits: tollAndTaxes
        },
        formula: "Haversine + Tortuosity(1.28x) + Multi-factor Freight Cost Matrix"
      });
    } catch (err: any) {
      return res.status(500).json({ error: err.message || "Failed to calculate freight" });
    }
  });

  // ==========================================
  // MODULE 2 API: Local Mandi Price Analytics
  // ==========================================
  app.get("/api/analytics/mandi-trends", (req, res) => {
    const crop = (req.query.crop as string) || "Tomato";
    const mandi = (req.query.mandi as string) || "Azadpur";

    // 7-day realistic simulated volatility dataset with multi-mandi comparisons
    const days = ["Day -6", "Day -5", "Day -4", "Day -3", "Day -2", "Yesterday", "Today (Live)"];
    
    // Crop base pricing
    const baseMap: Record<string, { base: number; unit: string; trend: number[] }> = {
      Tomato: { base: 2200, unit: "Rs / Quintal", trend: [1850, 1920, 2100, 2050, 2350, 2400, 2550] },
      Wheat: { base: 2650, unit: "Rs / Quintal", trend: [2580, 2600, 2620, 2640, 2680, 2700, 2750] },
      Onion: { base: 2900, unit: "Rs / Quintal", trend: [3200, 3100, 3050, 2950, 2900, 2850, 2800] },
      Potato: { base: 1600, unit: "Rs / Quintal", trend: [1480, 1500, 1530, 1550, 1580, 1620, 1650] },
      Mustard: { base: 5300, unit: "Rs / Quintal", trend: [5150, 5200, 5220, 5280, 5320, 5390, 5450] },
      Soybean: { base: 4600, unit: "Rs / Quintal", trend: [4450, 4500, 4520, 4580, 4620, 4650, 4700] },
      Cotton: { base: 7100, unit: "Rs / Quintal", trend: [6900, 6950, 7050, 7100, 7150, 7200, 7280] },
    };

    const selectedCropData = baseMap[crop] || baseMap["Tomato"];
    
    const trendData = days.map((day, idx) => {
      const azadpurPrice = selectedCropData.trend[idx];
      const localMandiPrice = Math.round(azadpurPrice * 0.91 + (idx * 15));
      const vashiPrice = Math.round(azadpurPrice * 1.06 - (idx * 10));
      const arrivalVolumeTonnes = Math.round(80 + Math.sin(idx) * 25 + (idx * 4));

      return {
        date: day,
        AzadpurMandi: azadpurPrice,
        LocalDistrictMandi: localMandiPrice,
        RegionalHubMandi: vashiPrice,
        arrivalVolumeTonnes,
        modalPrice: azadpurPrice,
        minPrice: Math.round(azadpurPrice * 0.88),
        maxPrice: Math.round(azadpurPrice * 1.12),
      };
    });

    const currentPrice = trendData[trendData.length - 1].modalPrice;
    const previousPrice = trendData[trendData.length - 2].modalPrice;
    const changePct = Math.round(((currentPrice - previousPrice) / previousPrice) * 1000) / 10;
    const volatilityIndex = "Moderate (±4.8% weekly spread)";
    const sellingRecommendation =
      changePct > 2
        ? "BULLISH: High demand detected. Recommended to sell within next 24-48 hours."
        : changePct < -2
        ? "BEARISH: Oversupply arrival spike. Consider short-term storage or alternate mandi."
        : "STABLE: Steady trading window. Good time for planned dispatch.";

    res.json({
      crop,
      mandi,
      unit: selectedCropData.unit,
      currentPrice,
      change7dPercent: changePct,
      volatilityIndex,
      sellingRecommendation,
      timeSeries: trendData,
    });
  });

  // ==========================================
  // MODULE 3 API: Khata / Ledger Engine
  // ==========================================
  app.get("/api/ledger/summary", (req, res) => {
    const totalOutstanding = customers.reduce((acc, c) => acc + c.outstandingDue, 0);
    const totalSalesValue = transactions.reduce((acc, t) => acc + t.totalAmount, 0);
    const totalCashCollected = transactions.reduce((acc, t) => acc + t.paidAmount, 0);
    const totalInventoryQuintals = inventory.reduce((acc, i) => acc + i.quantityQuintals, 0);

    res.json({
      totalOutstandingCredit: totalOutstanding,
      totalSalesValue,
      totalCashCollected,
      totalInventoryQuintals,
      activeBuyersCount: customers.length,
      recentTransactionsCount: transactions.length,
    });
  });

  app.get("/api/ledger/customers", (req, res) => {
    res.json({ success: true, customers });
  });

  app.get("/api/ledger/transactions", (req, res) => {
    res.json({ success: true, transactions });
  });

  app.get("/api/ledger/inventory", (req, res) => {
    res.json({ success: true, inventory });
  });

  app.post("/api/ledger/stock/add", (req, res) => {
    const { crop, variety, quantityQuintals, storageLocation, minimumTargetPrice } = req.body;
    if (!crop || !quantityQuintals) {
      return res.status(400).json({ error: "Crop name and quantity are required" });
    }

    const newItem: InventoryItem = {
      id: `INV-${Date.now().toString().slice(-4)}`,
      crop,
      variety: variety || "Standard Grade",
      quantityQuintals: Number(quantityQuintals),
      harvestDate: new Date().toISOString().split("T")[0],
      storageLocation: storageLocation || "Farm Shed",
      minimumTargetPrice: Number(minimumTargetPrice) || 2000,
    };

    inventory.unshift(newItem);
    res.json({ success: true, item: newItem });
  });

  app.post("/api/ledger/sale/record", (req, res) => {
    const {
      customerId,
      crop,
      quantityQuintals,
      ratePerQuintal,
      paidAmount = 0,
      notes = "",
    } = req.body;

    if (!customerId || !crop || !quantityQuintals || !ratePerQuintal) {
      return res.status(400).json({ error: "Missing mandatory sale fields" });
    }

    const customer = customers.find((c) => c.id === customerId);
    if (!customer) {
      return res.status(404).json({ error: "Customer not found in ledger" });
    }

    const qty = Number(quantityQuintals);
    const rate = Number(ratePerQuintal);
    const totalAmount = qty * rate;
    const paid = Number(paidAmount);
    const credit = Math.max(0, totalAmount - paid);

    const status: "PAID" | "PARTIAL" | "CREDIT" =
      paid >= totalAmount ? "PAID" : paid > 0 ? "PARTIAL" : "CREDIT";

    const newTxn: LedgerTransaction = {
      id: `TXN-${Date.now().toString().slice(-4)}`,
      customerId: customer.id,
      customerName: customer.name,
      crop,
      quantityQuintals: qty,
      ratePerQuintal: rate,
      totalAmount,
      paidAmount: paid,
      creditAmount: credit,
      status,
      date: new Date().toISOString().split("T")[0],
      notes,
    };

    transactions.unshift(newTxn);

    // Update customer balances
    customer.totalPurchased += totalAmount;
    customer.totalPaid += paid;
    customer.outstandingDue += credit;
    customer.lastTransactionDate = newTxn.date;

    // Deduct from inventory if matching item found
    const invItem = inventory.find((i) => i.crop.toLowerCase().includes(crop.toLowerCase()));
    if (invItem && invItem.quantityQuintals >= qty) {
      invItem.quantityQuintals -= qty;
    }

    res.json({
      success: true,
      transaction: newTxn,
      updatedCustomer: customer,
    });
  });

  const handleSettle = (req: express.Request, res: express.Response) => {
    const { customerId, settlementAmount, amountPaid, paymentMode = "UPI" } = req.body;
    const customer = customers.find((c) => c.id === customerId);
    if (!customer) {
      return res.status(404).json({ error: "Customer not found" });
    }

    const amount = Number(settlementAmount !== undefined ? settlementAmount : amountPaid);
    if (isNaN(amount) || amount <= 0) {
      return res.status(400).json({ error: "Invalid settlement amount" });
    }

    customer.outstandingDue = Math.max(0, customer.outstandingDue - amount);
    customer.totalPaid += amount;

    const receiptTxn: LedgerTransaction = {
      id: `PAY-${Date.now().toString().slice(-4)}`,
      customerId: customer.id,
      customerName: customer.name,
      crop: "Khata Settlement Payment",
      quantityQuintals: 0,
      ratePerQuintal: 0,
      totalAmount: 0,
      paidAmount: amount,
      creditAmount: 0,
      status: "PAID",
      date: new Date().toISOString().split("T")[0],
      notes: `Settlement received via ${paymentMode}. New due: Rs ${customer.outstandingDue}`,
    };

    transactions.unshift(receiptTxn);

    res.json({
      success: true,
      settledAmount: amount,
      remainingDue: customer.outstandingDue,
      receiptTransaction: receiptTxn,
      updatedCustomer: customer,
    });
  };

  app.post("/api/ledger/settle", handleSettle);
  app.post("/api/ledger/settle-due", handleSettle);

  // ==========================================
  // MODULE 4 API: Rule-Based Crop Planner
  // ==========================================
  app.post("/api/crop-plan/recommend", (req, res) => {
    const {
      soilType = "Alluvial Loam",
      currentMonth = "October",
      localTemperatureCelsius = 24,
      waterAvailability = "Canal & Tube-well (High)",
      landAreaAcres = 2.5,
    } = req.body;

    const monthLower = currentMonth.toLowerCase();
    const temp = Number(localTemperatureCelsius);
    const soil = soilType.toLowerCase();

    // Determine Agro-Climatic Season
    let season = "Rabi (Winter Season)";
    if (["june", "july", "august", "september"].some((m) => monthLower.includes(m))) {
      season = "Kharif (Monsoon Season)";
    } else if (["february", "march", "april", "may"].some((m) => monthLower.includes(m))) {
      season = "Zaid (Summer Cash Crop Season)";
    }

    interface CropRecommendation {
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

    const recommendations: CropRecommendation[] = [];

    if (season.includes("Rabi")) {
      // Rabi Crops
      if (soil.includes("alluvial") || soil.includes("loam") || soil.includes("clay")) {
        recommendations.push({
          cropName: "Wheat (Sharbati Gold)",
          variety: "HD-2967 / PBW-550",
          suitabilityScore: 96,
          sowingWindow: "Mid October – Late November",
          harvestDurationDays: 135,
          estimatedHarvestMonth: "Late March – Early April",
          expectedYieldPerAcreQuintals: 22,
          estimatedCostPerAcreRs: 14500,
          projectedMandiPricePerQuintalRs: 2750,
          estimatedGrossRevenuePerAcreRs: 22 * 2750,
          estimatedNetProfitPerAcreRs: (22 * 2750) - 14500,
          totalProjectedNetProfitRs: ((22 * 2750) - 14500) * Number(landAreaAcres),
          waterRequirement: "Medium (4-5 Irrigations)",
          soilFitnessReason: "Deep fertile alluvial loam provides optimal moisture retention and root aeration for high tillering.",
          pestRiskLevel: "Low",
          marketDemandOutlook: "High Growth",
        });
      }

      recommendations.push({
        cropName: "Mustard (Pusa Bold Yellow)",
        variety: "Pusa Jai Kisan / RH-749",
        suitabilityScore: 92,
        sowingWindow: "Late September – October",
        harvestDurationDays: 110,
        estimatedHarvestMonth: "February",
        expectedYieldPerAcreQuintals: 9.5,
        estimatedCostPerAcreRs: 9800,
        projectedMandiPricePerQuintalRs: 5400,
        estimatedGrossRevenuePerAcreRs: 9.5 * 5400,
        estimatedNetProfitPerAcreRs: (9.5 * 5400) - 9800,
        totalProjectedNetProfitRs: ((9.5 * 5400) - 9800) * Number(landAreaAcres),
        waterRequirement: "Low (2-3 Irrigations, highly drought resilient)",
        soilFitnessReason: "Thrives in loamy to sandy soils with neutral pH. Low nitrogen leaching.",
        pestRiskLevel: "Medium",
        marketDemandOutlook: "High Growth",
      });

      recommendations.push({
        cropName: "Green Pea / Early Vegetable Pea",
        variety: "Arkel / Azad P-1",
        suitabilityScore: 88,
        sowingWindow: "October First Fortnight",
        harvestDurationDays: 70,
        estimatedHarvestMonth: "December (Early High Price Window)",
        expectedYieldPerAcreQuintals: 38,
        estimatedCostPerAcreRs: 18000,
        projectedMandiPricePerQuintalRs: 3200,
        estimatedGrossRevenuePerAcreRs: 38 * 3200,
        estimatedNetProfitPerAcreRs: (38 * 3200) - 18000,
        totalProjectedNetProfitRs: ((38 * 3200) - 18000) * Number(landAreaAcres),
        waterRequirement: "Medium (Frequent light sprinkler irrigation)",
        soilFitnessReason: "Enriches soil with biological nitrogen fixation before summer crops.",
        pestRiskLevel: "Medium",
        marketDemandOutlook: "High Growth",
      });
    } else if (season.includes("Kharif")) {
      // Kharif crops
      recommendations.push({
        cropName: "Basmati Paddy (PB-1121 / 1509)",
        variety: "Pusa Basmati 1121",
        suitabilityScore: 94,
        sowingWindow: "June – July",
        harvestDurationDays: 120,
        estimatedHarvestMonth: "October – November",
        expectedYieldPerAcreQuintals: 20,
        estimatedCostPerAcreRs: 16500,
        projectedMandiPricePerQuintalRs: 3850,
        estimatedGrossRevenuePerAcreRs: 20 * 3850,
        estimatedNetProfitPerAcreRs: (20 * 3850) - 16500,
        totalProjectedNetProfitRs: ((20 * 3850) - 16500) * Number(landAreaAcres),
        waterRequirement: "High (Standing water required)",
        soilFitnessReason: "Heavy clay & clay loam retains flooded moisture ideal for paddy root systems.",
        pestRiskLevel: "Medium",
        marketDemandOutlook: "High Growth",
      });

      recommendations.push({
        cropName: "Hybrid Cotton (Bt)",
        variety: "RCH 659 / Bollgard II",
        suitabilityScore: 89,
        sowingWindow: "May – June",
        harvestDurationDays: 160,
        estimatedHarvestMonth: "November – December",
        expectedYieldPerAcreQuintals: 11,
        estimatedCostPerAcreRs: 19000,
        projectedMandiPricePerQuintalRs: 7200,
        estimatedGrossRevenuePerAcreRs: 11 * 7200,
        estimatedNetProfitPerAcreRs: (11 * 7200) - 19000,
        totalProjectedNetProfitRs: ((11 * 7200) - 19000) * Number(landAreaAcres),
        waterRequirement: "Medium",
        soilFitnessReason: "Deep black soil or fertile alluvial with good internal drainage.",
        pestRiskLevel: "Medium",
        marketDemandOutlook: "Stable",
      });
    } else {
      // Zaid summer crops
      recommendations.push({
        cropName: "Summer Moong (Green Gram)",
        variety: "Samrat / IPM 205-7",
        suitabilityScore: 95,
        sowingWindow: "March – April",
        harvestDurationDays: 60,
        estimatedHarvestMonth: "May – June",
        expectedYieldPerAcreQuintals: 6.5,
        estimatedCostPerAcreRs: 6500,
        projectedMandiPricePerQuintalRs: 7800,
        estimatedGrossRevenuePerAcreRs: 6.5 * 7800,
        estimatedNetProfitPerAcreRs: (6.5 * 7800) - 6500,
        totalProjectedNetProfitRs: ((6.5 * 7800) - 6500) * Number(landAreaAcres),
        waterRequirement: "Low (3 irrigations)",
        soilFitnessReason: "Short 60-day catch crop that fits neatly between Rabi harvest and Kharif sowing.",
        pestRiskLevel: "Low",
        marketDemandOutlook: "High Growth",
      });
    }

    res.json({
      success: true,
      inputParams: {
        soilType,
        currentMonth,
        localTemperatureCelsius: temp,
        waterAvailability,
        landAreaAcres: Number(landAreaAcres),
      },
      agroSeason: season,
      recommendationsCount: recommendations.length,
      primaryCrop: recommendations[0],
      allRecommendations: recommendations,
      agronomyTips: [
        "Perform soil testing for N-P-K & Zinc micronutrient balance 10 days before seed drill.",
        "Use certified bio-fungicide seed treatment (Trichoderma viride @ 4g/kg seed).",
        "Adopt drip irrigation or raised bed furrow planting to save 35% water & reduce weed pressure."
      ]
    });
  });

  // ==========================================
  // MODULE 5 API: Regional Mandi OCR Price Board Extractor
  // ==========================================
  app.post("/api/ocr/extract", async (req, res) => {
    try {
      const { imageBase64, mandiName = "Azadpur APMC Yard #2", documentType = "Mandi Board" } = req.body;

      // Mocked high-fidelity OCR engine with regional vernacular support & confidence score breakdown
      const mockExtractionResults = [
        {
          crop: "Tomato (Hybrid Grade A)",
          minPrice: 2100,
          maxPrice: 2600,
          modalPrice: 2450,
          unit: "Rs/Quintal",
          confidenceScore: 0.96,
          arrivalVolume: "142 Tonnes",
          detectedGrade: "FAQ Grade 1",
          bbox: { x: 42, y: 110, width: 280, height: 45 }
        },
        {
          crop: "Onion (Nashik Red)",
          minPrice: 2600,
          maxPrice: 3100,
          modalPrice: 2850,
          unit: "Rs/Quintal",
          confidenceScore: 0.94,
          arrivalVolume: "290 Tonnes",
          detectedGrade: "Medium Size (45-55mm)",
          bbox: { x: 42, y: 165, width: 280, height: 45 }
        },
        {
          crop: "Potato (Kufri Pukhraj)",
          minPrice: 1450,
          maxPrice: 1750,
          modalPrice: 1620,
          unit: "Rs/Quintal",
          confidenceScore: 0.98,
          arrivalVolume: "380 Tonnes",
          detectedGrade: "Standard Table Quality",
          bbox: { x: 42, y: 220, width: 280, height: 45 }
        },
        {
          crop: "Wheat (Sharbati)",
          minPrice: 2650,
          maxPrice: 2850,
          modalPrice: 2750,
          unit: "Rs/Quintal",
          confidenceScore: 0.92,
          arrivalVolume: "510 Tonnes",
          detectedGrade: "Luster Cleaned (Moisture < 12%)",
          bbox: { x: 42, y: 275, width: 280, height: 45 }
        },
        {
          crop: "Mustard Seed (Pusa Bold)",
          minPrice: 5200,
          maxPrice: 5550,
          modalPrice: 5400,
          unit: "Rs/Quintal",
          confidenceScore: 0.95,
          arrivalVolume: "95 Tonnes",
          detectedGrade: "Oil Content > 41.5%",
          bbox: { x: 42, y: 330, width: 280, height: 45 }
        },
      ];

      const ocrMetadata = {
        mandiLocation: mandiName,
        capturedDate: new Date().toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }),
        timestamp: new Date().toISOString(),
        boardLanguageDetected: "Hindi (Devanagari) & English bilingual header",
        scanResolution: "1920x1080px (Optimal High-Res)",
        averageConfidence: "95.2%",
        totalCropsParsed: mockExtractionResults.length,
        rawTextDump: `कृषि उपज मंडी समिति ${mandiName}\nदैनिक भाव पत्रक दिनांक: ${new Date().toLocaleDateString()}\nटमाटर (हाइब्रिड): 2100 - 2600 (मॉडल 2450)\nप्याज (लाल): 2600 - 3100 (मॉडल 2850)\nआलू (पुखराज): 1450 - 1750 (मॉडल 1620)\nगेहूं (शरबती): 2650 - 2850 (मॉडल 2750)\nसरसों (पीली): 5200 - 5550 (मॉडल 5400)\nआवक: बंपर (सामान्य से 12% अधिक)`,
      };

      res.json({
        success: true,
        metadata: ocrMetadata,
        extractedRates: mockExtractionResults,
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message || "Failed to process OCR image" });
    }
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true, hmr: false },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Farmer-to-Market Decision Platform running on port ${PORT}`);
  });
}

startServer();
