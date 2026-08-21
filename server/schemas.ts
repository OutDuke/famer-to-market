import { z } from "zod";

export const FreightEstimateSchema = z.object({
  originLat: z.coerce.number({ message: "originLat must be a valid number" }),
  originLon: z.coerce.number({ message: "originLon must be a valid number" }),
  originName: z.string().optional(),
  destLat: z.coerce.number({ message: "destLat must be a valid number" }),
  destLon: z.coerce.number({ message: "destLon must be a valid number" }),
  destName: z.string().optional(),
  loadWeightQuintals: z.coerce.number().positive("Load weight must be greater than 0").default(20),
  vehicleType: z.string().default("Mini Truck (Tata 407 / Bolero Maxi)"),
  dieselPricePerLitre: z.coerce.number().positive().default(90.5),
  isPerishable: z.boolean().default(false),
});

export const AddStockSchema = z.object({
  crop: z.string().min(1, "Crop name is required"),
  variety: z.string().optional().default("Standard Grade"),
  quantityQuintals: z.coerce.number().positive("Quantity must be greater than 0"),
  storageLocation: z.string().optional().default("Farm Shed"),
  minimumTargetPrice: z.coerce.number().positive().default(2000),
});

export const RecordSaleSchema = z.object({
  customerId: z.string().min(1, "Customer ID is required"),
  crop: z.string().min(1, "Crop name is required"),
  quantityQuintals: z.coerce.number().positive("Quantity must be greater than 0"),
  ratePerQuintal: z.coerce.number().positive("Rate must be greater than 0"),
  paidAmount: z.coerce.number().min(0).default(0),
  notes: z.string().optional().default(""),
});

export const SettleDueSchema = z.object({
  customerId: z.string().min(1, "Customer ID is required"),
  settlementAmount: z.coerce.number().positive().optional(),
  amountPaid: z.coerce.number().positive().optional(),
  paymentMode: z.string().optional().default("UPI"),
}).refine(
  (data) => (data.settlementAmount !== undefined && data.settlementAmount > 0) || (data.amountPaid !== undefined && data.amountPaid > 0),
  { message: "A positive settlement amount or amountPaid is required" }
);

export const CropPlanSchema = z.object({
  soilType: z.string().default("Alluvial Loam"),
  currentMonth: z.string().default("October"),
  localTemperatureCelsius: z.coerce.number().default(24),
  waterAvailability: z.string().default("Canal & Tube-well (High)"),
  landAreaAcres: z.coerce.number().positive("Land area must be greater than 0").default(2.5),
});

export const OcrParseSchema = z.object({
  image: z.string().optional(),
  mandiName: z.string().default("Azadpur Mandi (Delhi)"),
});
