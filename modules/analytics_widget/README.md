# Interactive Analytics UI Widget (`/modules/analytics_widget`)

A drop-in Next.js (React) component powered by Recharts for visualizing real-time and 7-day Mandi modal prices, price ceiling bands, regional hub spreads, and arrival volume influx.

## 📦 Installation & Usage

1. Copy `AnalyticsWidget.tsx` to your components directory.
2. Install peer dependencies:
```bash
npm install recharts lucide-react
```

3. Import and use in any Next.js (App Router or Pages Router) page:
```tsx
import { AnalyticsWidget } from "@/modules/analytics_widget/AnalyticsWidget";

const mockMandiData = {
  crop: "Tomato",
  mandi: "Azadpur APMC",
  currentPrice: 2450,
  change7dPercent: 4.8,
  volatilityIndex: "Moderate (±4.8%)",
  sellingRecommendation: "High demand detected. Dispatch recommended within next 24-48 hours.",
  timeSeries: [
    { date: "Mon", modalPrice: 2100, AzadpurMandi: 2100, LocalDistrictMandi: 1950, arrivalVolumeTonnes: 90 },
    { date: "Tue", modalPrice: 2200, AzadpurMandi: 2200, LocalDistrictMandi: 2020, arrivalVolumeTonnes: 110 },
    { date: "Wed", modalPrice: 2180, AzadpurMandi: 2180, LocalDistrictMandi: 2000, arrivalVolumeTonnes: 95 },
    { date: "Thu", modalPrice: 2320, AzadpurMandi: 2320, LocalDistrictMandi: 2150, arrivalVolumeTonnes: 85 },
    { date: "Fri", modalPrice: 2400, AzadpurMandi: 2400, LocalDistrictMandi: 2220, arrivalVolumeTonnes: 75 },
    { date: "Sat", modalPrice: 2420, AzadpurMandi: 2420, LocalDistrictMandi: 2250, arrivalVolumeTonnes: 70 },
    { date: "Today", modalPrice: 2450, AzadpurMandi: 2450, LocalDistrictMandi: 2280, arrivalVolumeTonnes: 68 },
  ]
};

export default function MarketTrendsPage() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <AnalyticsWidget data={mockMandiData} />
    </div>
  );
}
```
