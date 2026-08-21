import { LocationPoint } from "../types";

export const PRESET_FARMS: LocationPoint[] = [
  { name: "Karnal Farm Gate (Haryana)", latitude: 29.6857, longitude: 76.9905 },
  { name: "Nashik Onion Belt (Maharashtra)", latitude: 19.9975, longitude: 73.7898 },
  { name: "Indore Malwa Farm (Madhya Pradesh)", latitude: 22.7196, longitude: 75.8577 },
  { name: "Guntur Chilly Zone (Andhra Pradesh)", latitude: 16.3067, longitude: 80.4365 },
  { name: "Khanna Grain Belt (Punjab)", latitude: 30.7071, longitude: 76.2168 },
  { name: "Meerut Sugarcane/Veg Plain (UP)", latitude: 28.9845, longitude: 77.7064 },
];

export const PRESET_MANDIS: (LocationPoint & { state: string; specialty: string; avgHandlingChargePerQ: number })[] = [
  { name: "Azadpur APMC Yard (Delhi)", latitude: 28.7158, longitude: 77.1783, state: "Delhi NCR", specialty: "Fruits & Vegetables (Asia's Largest)", avgHandlingChargePerQ: 18 },
  { name: "Lasalgaon Mandi (Nashik)", latitude: 20.1466, longitude: 74.2289, state: "Maharashtra", specialty: "Onion & Garlic Global Hub", avgHandlingChargePerQ: 14 },
  { name: "Vashi APMC Market (Navi Mumbai)", latitude: 19.0760, longitude: 72.9996, state: "Maharashtra", specialty: "High-Margin Coastal Metro Hub", avgHandlingChargePerQ: 22 },
  { name: "Khanna Grain Market (Ludhiana)", latitude: 30.7071, longitude: 76.2168, state: "Punjab", specialty: "Wheat & Paddy Asia Largest Grain Yard", avgHandlingChargePerQ: 12 },
  { name: "Guntur Mirchi Yard", latitude: 16.3067, longitude: 80.4365, state: "Andhra Pradesh", specialty: "Spices & Commercial Crops", avgHandlingChargePerQ: 16 },
  { name: "Sonipat District Mandi", latitude: 28.9931, longitude: 77.0151, state: "Haryana", specialty: "Local Green Vegetables & Grains", avgHandlingChargePerQ: 10 },
  { name: "Agra Potato Mandi (Khandari)", latitude: 27.1767, longitude: 78.0081, state: "Uttar Pradesh", specialty: "Potato & Cold Storage Hub", avgHandlingChargePerQ: 11 },
];

export const COMMODITIES_LIST = [
  { id: "Tomato", name: "Tomato (Hybrid Red)", category: "Vegetable", perishable: true, basePrice: 2450 },
  { id: "Wheat", name: "Wheat (Sharbati Gold)", category: "Grain", perishable: false, basePrice: 2750 },
  { id: "Onion", name: "Onion (Nashik Red)", category: "Vegetable", perishable: true, basePrice: 2850 },
  { id: "Potato", name: "Potato (Jyoti / Pukhraj)", category: "Tuber", perishable: false, basePrice: 1620 },
  { id: "Mustard", name: "Mustard (Pusa Bold)", category: "Oilseed", perishable: false, basePrice: 5400 },
  { id: "Soybean", name: "Soybean (Yellow)", category: "Oilseed", perishable: false, basePrice: 4650 },
  { id: "Cotton", name: "Cotton (Bt Medium Staple)", category: "Commercial", perishable: false, basePrice: 7200 },
];

export const VEHICLE_OPTIONS = [
  { id: "small_pickup", name: "Small Pickup (Mahindra Bolero Maxi / Tata Ace)", maxPayloadQuintals: 15, baseKmRate: 14, mileageKmPerLitre: 12 },
  { id: "mini_truck", name: "Mini Truck (Tata 407 / Eicher Pro 1049)", maxPayloadQuintals: 35, baseKmRate: 22, mileageKmPerLitre: 8 },
  { id: "medium_truck", name: "Medium Truck (Eicher 6-Tyre 1114)", maxPayloadQuintals: 70, baseKmRate: 32, mileageKmPerLitre: 6 },
  { id: "heavy_truck", name: "Heavy Multi-Axle (10-Tyre 25 Tonner)", maxPayloadQuintals: 160, baseKmRate: 52, mileageKmPerLitre: 3.8 },
];
