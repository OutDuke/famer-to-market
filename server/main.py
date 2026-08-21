"""
=============================================================================
Farmer-to-Market Decision Platform - Unified FastAPI Backend
=============================================================================
This file demonstrates how the main FastAPI backend imports and mounts all 5
isolated, standalone modules from the /modules/ directory.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import sys
import os

# Ensure modules directory is on the Python path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "modules")))

# 1. Import Standalone Modules
from freight_estimator.main import app as freight_app
from ledger_engine.main import app as ledger_app
from crop_planner.main import app as crop_planner_app
from ocr_extractor.main import app as ocr_app

# Initialize Master FastAPI Application
app = FastAPI(
    title="Farmer-to-Market Unified Decision Platform API",
    description="Unified agri-decision intelligence platform combining Freight Optimization, Khata Ledger, Crop Planning, Mandi OCR, and Analytics.",
    version="2.0.0"
)

# Enable CORS for Next.js Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =============================================================================
# Mount Isolated Sub-Applications (Microservices as Sub-Apps / Routers)
# =============================================================================
app.mount("/api/freight", freight_app)
app.mount("/api/ledger", ledger_app)
app.mount("/api/crop-plan", crop_planner_app)
app.mount("/api/ocr", ocr_app)

@app.get("/")
def root():
    return {
        "platform": "Farmer-to-Market Decision Platform",
        "status": "operational",
        "integrated_modules": [
            {"name": "Geo-Distance & Freight Estimator", "mount": "/api/freight"},
            {"name": "Mandi Analytics Widget", "type": "Frontend Next.js Component (/modules/analytics_widget)"},
            {"name": "Kisan Khata & Ledger Engine", "mount": "/api/ledger"},
            {"name": "Rule-Based Crop Planner", "mount": "/api/crop-plan"},
            {"name": "Mandi Board OCR Extractor", "mount": "/api/ocr"},
        ],
        "unified_decision_endpoint": "/api/decision-summary"
    }

@app.get("/api/decision-summary")
def get_unified_farmer_decision(
    crop: str = "Tomato",
    farm_lat: float = 29.6857,
    farm_lon: float = 76.9905,
    quantity_quintals: float = 25.0
):
    """
    High-level composite decision endpoint:
    Combines Freight Estimator + Mandi Prices to calculate NET farmer profit across 3 nearby mandis.
    """
    # Sample candidate mandis
    mandis = [
        {"name": "Azadpur APMC (Delhi)", "lat": 28.7158, "lon": 77.1783, "modal_price": 2450.0},
        {"name": "Karnal Local Mandi (Haryana)", "lat": 29.6857, "lon": 76.9905, "modal_price": 2180.0},
        {"name": "Vashi APMC (Navi Mumbai Hub)", "lat": 19.0760, "lon": 72.9996, "modal_price": 2780.0},
    ]

    from freight_estimator.main import haversine_distance_km

    comparison = []
    for m in mandis:
        aerial_km = haversine_distance_km(farm_lat, farm_lon, m["lat"], m["lon"])
        road_km = round(aerial_km * 1.28, 1)
        
        # Freight calculation
        base_rate = 22.0
        freight_total = round((road_km * base_rate) + (quantity_quintals * 15.0) + 400.0, 2)
        freight_per_q = round(freight_total / quantity_quintals, 2) if quantity_quintals > 0 else 0
        
        gross_revenue = round(quantity_quintals * m["modal_price"], 2)
        net_farmer_take_home = round(gross_revenue - freight_total, 2)
        effective_price_per_q = round(net_farmer_take_home / quantity_quintals, 2) if quantity_quintals > 0 else 0

        comparison.append({
            "mandi_name": m["name"],
            "road_distance_km": road_km,
            "mandi_modal_price_rs": m["modal_price"],
            "total_freight_cost_rs": freight_total,
            "freight_cost_per_quintal_rs": freight_per_q,
            "gross_revenue_rs": gross_revenue,
            "net_farmer_profit_rs": net_farmer_take_home,
            "effective_realized_price_per_quintal": effective_price_per_q
        })

    # Sort by highest net farmer profit
    comparison.sort(key=lambda x: x["net_farmer_profit_rs"], reverse=True)
    best_mandi = comparison[0]

    return {
        "crop": crop,
        "load_quantity_quintals": quantity_quintals,
        "best_mandi_recommendation": best_mandi["mandi_name"],
        "projected_net_gain_vs_local_mandi": round(best_mandi["net_farmer_profit_rs"] - comparison[-1]["net_farmer_profit_rs"], 2),
        "mandi_comparisons": comparison
    }

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
