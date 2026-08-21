import math
from typing import Optional
from fastapi import FastAPI, HTTPException, Query
from pydantic import BaseModel, Field

app = FastAPI(
    title="Geo-Distance & Freight Cost API",
    description="Standalone Microservice for calculating agricultural freight costs based on GPS coordinates and road factor using pure Haversine distance math.",
    version="1.0.0"
)

class LocationPoint(BaseModel):
    name: str = Field(..., example="Karnal Farm Gate")
    latitude: float = Field(..., ge=-90, le=90, example=29.6857)
    longitude: float = Field(..., ge=-180, le=180, example=76.9905)

class FreightRequest(BaseModel):
    origin: LocationPoint
    destination: LocationPoint
    load_weight_quintals: float = Field(20.0, gt=0, example=25.0)
    vehicle_type: str = Field("Mini Truck (Tata 407)", example="Mini Truck (Tata 407)")
    diesel_price_per_litre: float = Field(90.50, gt=0, example=90.50)
    is_perishable: bool = Field(False, example=True)

class CostBreakdown(BaseModel):
    base_distance_freight: float
    fuel_component: float
    labour_handling: float
    driver_bhatta: float
    tolls_and_permits: float
    perishability_premium: float

class FreightMetrics(BaseModel):
    aerial_distance_km: float
    road_distance_km: float
    estimated_transit_hours: float
    total_freight_cost: float
    cost_per_quintal: float
    cost_per_km: float
    load_weight_quintals: float
    vehicle_type: str
    breakdown: CostBreakdown

class FreightResponse(BaseModel):
    success: bool
    origin: LocationPoint
    destination: LocationPoint
    metrics: FreightMetrics
    formula_used: str = "Haversine + Tortuosity Factor (1.28x) + Multi-Tier Fuel/Labour Matrix"

def haversine_distance_km(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Calculates great-circle distance between two points on Earth using Haversine formula in pure Python."""
    r = 6371.0  # Earth's radius in kilometers
    d_lat = math.radians(lat2 - lat1)
    d_lon = math.radians(lon2 - lon1)
    
    a = (math.sin(d_lat / 2) ** 2 + 
         math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * 
         math.sin(d_lon / 2) ** 2)
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return round(r * c, 2)

@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "freight_estimator", "version": "1.0.0"}

@app.post("/estimate", response_model=FreightResponse)
def estimate_freight(request: FreightRequest):
    try:
        aerial_km = haversine_distance_km(
            request.origin.latitude,
            request.origin.longitude,
            request.destination.latitude,
            request.destination.longitude
        )

        # Rural Indian road tortuosity factor (~1.28x aerial straight line)
        road_km = round(aerial_km * 1.28, 1)

        # Vehicle profiles
        vtype = request.vehicle_type.lower()
        if "pickup" in vtype or "bolero" in vtype or "small" in vtype:
            base_rate_per_km = 14.0
            mileage = 12.0
        elif "mini" in vtype or "407" in vtype:
            base_rate_per_km = 22.0
            mileage = 8.0
        elif "eicher" in vtype or "medium" in vtype:
            base_rate_per_km = 32.0
            mileage = 6.0
        elif "heavy" in vtype or "10-tyre" in vtype:
            base_rate_per_km = 52.0
            mileage = 3.8
        else:
            base_rate_per_km = 20.0
            mileage = 8.5

        # Fuel and operational cost breakdown
        fuel_litres = road_km / mileage if mileage > 0 else 0
        fuel_cost = round(fuel_litres * request.diesel_price_per_litre, 2)
        driver_bhatta = 500.0 if road_km > 100 else 300.0
        labour_handling = round(request.load_weight_quintals * 15.0, 2)  # Rs 15/quintal
        tolls = round(road_km * 1.2, 2)

        subtotal = (road_km * base_rate_per_km) + (fuel_cost * 0.4) + driver_bhatta + labour_handling + tolls
        perishability_premium = round(subtotal * 0.15, 2) if request.is_perishable else 0.0
        total_cost = round(subtotal + perishability_premium, 2)

        cost_per_q = round(total_cost / request.load_weight_quintals, 2) if request.load_weight_quintals > 0 else 0
        cost_per_k = round(total_cost / road_km, 2) if road_km > 0 else 0
        transit_hrs = round(((road_km / 38.0) + 0.75), 1)

        return FreightResponse(
            success=True,
            origin=request.origin,
            destination=request.destination,
            metrics=FreightMetrics(
                aerial_distance_km=aerial_km,
                road_distance_km=road_km,
                estimated_transit_hours=transit_hrs,
                total_freight_cost=total_cost,
                cost_per_quintal=cost_per_q,
                cost_per_km=cost_per_k,
                load_weight_quintals=request.load_weight_quintals,
                vehicle_type=request.vehicle_type,
                breakdown=CostBreakdown(
                    base_distance_freight=round(road_km * base_rate_per_km, 2),
                    fuel_component=fuel_cost,
                    labour_handling=labour_handling,
                    driver_bhatta=driver_bhatta,
                    tolls_and_permits=tolls,
                    perishability_premium=perishability_premium
                )
            )
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8001, reload=True)
