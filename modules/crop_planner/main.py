from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from typing import List, Optional
from rules import evaluate_crop_plan

app = FastAPI(
    title="Rule-Based Crop Planner API",
    description="Agro-climatic recommendation engine mapping soil profiles, planting windows, and local temperatures to optimal crops with yield and profit projections.",
    version="1.0.0"
)

class CropPlanRequest(BaseModel):
    soil_type: str = Field("Alluvial Loam", example="Alluvial Loam / Black Soil / Sandy Loam")
    current_month: str = Field("October", example="October")
    local_temperature_celsius: float = Field(24.0, example=24.5)
    water_availability: str = Field("Canal & Tube-well (High)", example="Canal & Tube-well (High)")
    land_area_acres: float = Field(2.5, gt=0, example=2.5)

class CropRecommendation(BaseModel):
    crop_name: str
    variety: str
    suitability_score: int
    sowing_window: str
    harvest_duration_days: int
    estimated_harvest_timeline: str
    expected_yield_per_acre_quintals: float
    estimated_cost_per_acre_rs: float
    projected_mandi_price_per_quintal_rs: float
    estimated_gross_revenue_per_acre_rs: float
    estimated_net_profit_per_acre_rs: float
    total_projected_net_profit_rs: float
    water_requirement: str
    soil_fitness_reason: str
    pest_risk_level: str
    market_demand_outlook: str

class CropPlanResponse(BaseModel):
    success: bool
    input_params: CropPlanRequest
    agro_season: str
    recommendations_count: int
    top_recommendation: CropRecommendation
    recommendations: List[CropRecommendation]
    agronomy_tips: List[str]

@app.get("/health")
def health():
    return {"status": "healthy", "service": "crop_planner", "version": "1.0.0"}

@app.post("/plan", response_model=CropPlanResponse)
def generate_crop_plan(request: CropPlanRequest):
    try:
        ranked_crops = evaluate_crop_plan(
            soil_type=request.soil_type,
            current_month=request.current_month,
            temperature_c=request.local_temperature_celsius,
            land_acres=request.land_area_acres
        )

        m = request.current_month.lower()
        if any(mon in m for mon in ["jun", "jul", "aug", "sep"]):
            season = "Kharif (Monsoon Season)"
        elif any(mon in m for mon in ["feb", "mar", "apr", "may"]):
            season = "Zaid (Summer Cash Crop Season)"
        else:
            season = "Rabi (Winter Sowing Season)"

        tips = [
            "Conduct soil test to check Nitrogen, Phosphorus, Potassium (NPK) and Micronutrients before sowing.",
            "Treat seed with Trichoderma bio-fungicide @ 4g/kg seed to prevent seedling blight.",
            "Utilize laser land leveling to improve water application efficiency by up to 25%."
        ]

        return CropPlanResponse(
            success=True,
            input_params=request,
            agro_season=season,
            recommendations_count=len(ranked_crops),
            top_recommendation=CropRecommendation(**ranked_crops[0]),
            recommendations=[CropRecommendation(**c) for c in ranked_crops],
            agronomy_tips=tips
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8003, reload=True)
