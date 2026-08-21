# Geo-Distance & Freight Cost Estimator Microservice

A standalone, plug-and-play Python FastAPI microservice designed for Agri-Logistics applications. It calculates great-circle distance using pure Python Haversine trigonometry, applies a calibrated Indian rural road tortuosity factor (1.28x), and computes exact truck transportation costs broken down by fuel, labour, driver allowance, tolls, and perishability tier.

## 🚀 Quickstart

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Run the standalone server:
```bash
uvicorn main:app --port 8001 --reload
```

3. Test with cURL:
```bash
curl -X POST "http://localhost:8001/estimate" \
  -H "Content-Type: application/json" \
  -d '{
    "origin": {"name": "Karnal Farm Gate", "latitude": 29.6857, "longitude": 76.9905},
    "destination": {"name": "Azadpur APMC Delhi", "latitude": 28.7158, "longitude": 77.1783},
    "load_weight_quintals": 30.0,
    "vehicle_type": "Mini Truck (Tata 407)",
    "diesel_price_per_litre": 90.50,
    "is_perishable": true
  }'
```

## 📦 Output Response Schema
- `aerial_distance_km`: Haversine straight-line distance
- `road_distance_km`: Calibrated real-world road route distance
- `estimated_transit_hours`: Predicted transit duration
- `total_freight_cost`: Net payable freight amount in INR
- `cost_per_quintal`: Unit transport cost to compute net mandi profit margins
