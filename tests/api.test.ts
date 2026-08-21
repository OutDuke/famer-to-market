import { FreightEstimateSchema, RecordSaleSchema, SettleDueSchema } from "../server/schemas.js";
import { loadStore, saveStore } from "../server/storage.js";

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ FAIL: ${message}`);
    process.exit(1);
  } else {
    console.log(`✅ PASS: ${message}`);
  }
}

console.log("=== Running Platform Security & Business Logic Unit Tests ===\n");

// 1. Freight Schema Validation
console.log("1. Testing Freight Calculation Schemas...");
const validFreight = FreightEstimateSchema.safeParse({
  originLat: 28.6139,
  originLon: 77.2090,
  destLat: 29.6857,
  destLon: 76.9905,
  loadWeightQuintals: 25,
  vehicleType: "Mini Truck (Tata 407 / Bolero Maxi)",
});
assert(validFreight.success, "FreightEstimateSchema parses valid geo-coordinates and load weight");

const invalidFreight = FreightEstimateSchema.safeParse({
  originLat: "invalid",
  destLat: 29.6857,
});
assert(!invalidFreight.success, "FreightEstimateSchema catches invalid numeric inputs");

// 2. Ledger Transaction & Settlement Accounting
console.log("\n2. Testing Khata Ledger & Settlement Schemas...");
const validSale = RecordSaleSchema.safeParse({
  customerId: "CUST-001",
  crop: "Wheat (Sharbati)",
  quantityQuintals: 20,
  ratePerQuintal: 2750,
  paidAmount: 25000,
});
assert(validSale.success, "RecordSaleSchema accepts valid sale data");

const invalidSale = RecordSaleSchema.safeParse({
  customerId: "",
  crop: "",
  quantityQuintals: -5,
  ratePerQuintal: 0,
});
assert(!invalidSale.success, "RecordSaleSchema rejects negative quantities and empty crops");

const validSettle = SettleDueSchema.safeParse({
  customerId: "CUST-001",
  settlementAmount: 15000,
  paymentMode: "UPI",
});
assert(validSettle.success, "SettleDueSchema accepts valid settlement payload");

// 3. Persistent Local Store Verification
console.log("\n3. Testing File-backed Store Persistence...");
const initialStore = loadStore();
assert(Array.isArray(initialStore.customers) && initialStore.customers.length > 0, "Persistent store loads customers array");
assert(Array.isArray(initialStore.inventory) && initialStore.inventory.length > 0, "Persistent store loads inventory array");

console.log("\n🎉 All unit & integration tests completed successfully with 100% pass rate!\n");
