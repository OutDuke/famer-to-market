# Rule-Based Crop Planner API (`/modules/crop_planner`)

A standalone FastAPI microservice that computes ranked crop recommendations, harvest schedules, expected yield per acre, cultivation cost estimates, and projected net profitability based on soil type, planting month, ambient temperature, and land acreage.

## 🚀 Endpoints
- `POST /plan`: Takes soil type, month, temperature, land area and returns ranked agronomic crop advisory with full economic projection.

## 🧪 cURL Example
```bash
curl -X POST "http://localhost:8003/plan" \
  -H "Content-Type: application/json" \
  -d '{
    "soil_type": "Alluvial Loam",
    "current_month": "October",
    "local_temperature_celsius": 24.0,
    "water_availability": "Canal & Tube-well (High)",
    "land_area_acres": 3.0
  }'
```
