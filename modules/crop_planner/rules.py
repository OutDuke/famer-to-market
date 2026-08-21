from typing import List, Dict, Any

CROP_DATABASE: List[Dict[str, Any]] = [
    {
        "name": "Wheat (Sharbati Premium)",
        "variety": "HD-2967 / PBW-550",
        "seasons": ["rabi"],
        "suitable_months": ["october", "november", "december"],
        "ideal_temp_min_c": 12,
        "ideal_temp_max_c": 26,
        "suitable_soils": ["alluvial", "loam", "clay loam"],
        "water_need": "Medium (4-5 Irrigations)",
        "duration_days": 135,
        "harvest_timeline": "Late March – Early April",
        "yield_quintals_per_acre": 22.0,
        "cultivation_cost_per_acre": 14500.0,
        "projected_mandi_price": 2750.0,
        "pest_risk": "Low",
        "soil_reason": "Alluvial loam provides superior moisture-holding capacity and root anchorage for high tillering.",
        "market_outlook": "High Demand (Export + MSP Buffer)"
    },
    {
        "name": "Mustard (Pusa Bold Yellow)",
        "variety": "Pusa Jai Kisan / RH-749",
        "seasons": ["rabi"],
        "suitable_months": ["september", "october", "november"],
        "ideal_temp_min_c": 15,
        "ideal_temp_max_c": 28,
        "suitable_soils": ["alluvial", "loam", "sandy loam", "red soil"],
        "water_need": "Low (2-3 Irrigations)",
        "duration_days": 110,
        "harvest_timeline": "February – Early March",
        "yield_quintals_per_acre": 9.5,
        "cultivation_cost_per_acre": 9800.0,
        "projected_mandi_price": 5400.0,
        "pest_risk": "Medium (Aphid monitoring recommended)",
        "soil_reason": "Well-drained light to medium loamy soils prevent waterlogging and stimulate high oil content.",
        "market_outlook": "High Demand (Domestic Edible Oil Deficit)"
    },
    {
        "name": "Green Vegetable Pea (Early)",
        "variety": "Arkel / Azad P-1",
        "seasons": ["rabi"],
        "suitable_months": ["october", "november"],
        "ideal_temp_min_c": 14,
        "ideal_temp_max_c": 25,
        "suitable_soils": ["alluvial", "sandy loam", "loam"],
        "water_need": "Medium (Sprinkler)",
        "duration_days": 70,
        "harvest_timeline": "December (High Early Window Price)",
        "yield_quintals_per_acre": 38.0,
        "cultivation_cost_per_acre": 18000.0,
        "projected_mandi_price": 3200.0,
        "pest_risk": "Medium",
        "soil_reason": "Rhizobium root nodules fix 30-40kg atmospheric nitrogen, enriching soil for subsequent season.",
        "market_outlook": "Premium Early Vegetable Market"
    },
    {
        "name": "Basmati Rice (PB-1121)",
        "variety": "Pusa Basmati 1121",
        "seasons": ["kharif"],
        "suitable_months": ["june", "july", "august"],
        "ideal_temp_min_c": 22,
        "ideal_temp_max_c": 36,
        "suitable_soils": ["clay", "clay loam", "alluvial"],
        "water_need": "High (Submerged Puddle)",
        "duration_days": 125,
        "harvest_timeline": "October – November",
        "yield_quintals_per_acre": 20.0,
        "cultivation_cost_per_acre": 16500.0,
        "projected_mandi_price": 3850.0,
        "pest_risk": "Medium",
        "soil_reason": "Heavy clay prevents percolation losses and sustains puddle state essential for aromatic grains.",
        "market_outlook": "Export Giant & Stable Domestic Demand"
    },
    {
        "name": "Cotton (Bt Hybrid)",
        "variety": "RCH-659 / Bollgard II",
        "seasons": ["kharif"],
        "suitable_months": ["may", "june", "july"],
        "ideal_temp_min_c": 24,
        "ideal_temp_max_c": 38,
        "suitable_soils": ["black cotton soil", "deep alluvial", "clay loam"],
        "water_need": "Medium (Furrow Irrigation)",
        "duration_days": 160,
        "harvest_timeline": "November – December",
        "yield_quintals_per_acre": 11.0,
        "cultivation_cost_per_acre": 19000.0,
        "projected_mandi_price": 7200.0,
        "pest_risk": "Medium",
        "soil_reason": "Deep black soil provides high cation exchange capacity and moisture reserve throughout boll formation.",
        "market_outlook": "Textile Mill Demand Stable"
    },
    {
        "name": "Summer Moong (Green Gram)",
        "variety": "Samrat / IPM 205-7",
        "seasons": ["zaid"],
        "suitable_months": ["march", "april", "may"],
        "ideal_temp_min_c": 25,
        "ideal_temp_max_c": 40,
        "suitable_soils": ["alluvial", "sandy loam", "loam", "black"],
        "water_need": "Low (3 Irrigations)",
        "duration_days": 60,
        "harvest_timeline": "May – June",
        "yield_quintals_per_acre": 6.5,
        "cultivation_cost_per_acre": 6500.0,
        "projected_mandi_price": 7800.0,
        "pest_risk": "Low",
        "soil_reason": "Fast 60-day catch crop that breaks pest cycles and enriches soil organic matter.",
        "market_outlook": "High Protein Demand & Quick Cash Flow"
    }
]

def evaluate_crop_plan(soil_type: str, current_month: str, temperature_c: float, land_acres: float = 1.0) -> List[Dict[str, Any]]:
    m_lower = current_month.lower()
    s_lower = soil_type.lower()
    
    scored_crops = []
    
    for crop in CROP_DATABASE:
        score = 60 # Base score
        
        # 1. Month / Season Fit
        if any(m in m_lower for m in crop["suitable_months"]):
            score += 25
        elif ("oct" in m_lower or "nov" in m_lower) and "rabi" in crop["seasons"]:
            score += 20
        elif ("jun" in m_lower or "jul" in m_lower) and "kharif" in crop["seasons"]:
            score += 20
        elif ("mar" in m_lower or "apr" in m_lower) and "zaid" in crop["seasons"]:
            score += 20
        else:
            score -= 15
            
        # 2. Temperature Fit
        if crop["ideal_temp_min_c"] <= temperature_c <= crop["ideal_temp_max_c"]:
            score += 15
        else:
            temp_diff = min(abs(temperature_c - crop["ideal_temp_min_c"]), abs(temperature_c - crop["ideal_temp_max_c"]))
            score -= int(temp_diff * 2)
            
        # 3. Soil Suitability
        if any(soil_term in s_lower for soil_term in crop["suitable_soils"]):
            score += 15
        else:
            score -= 10
            
        score = max(40, min(99, score))
        
        # Economics
        gross_rev_acre = round(crop["yield_quintals_per_acre"] * crop["projected_mandi_price"], 2)
        net_profit_acre = round(gross_rev_acre - crop["cultivation_cost_per_acre"], 2)
        total_profit = round(net_profit_acre * land_acres, 2)
        
        scored_crops.append({
            "crop_name": crop["name"],
            "variety": crop["variety"],
            "suitability_score": score,
            "sowing_window": ", ".join([m.capitalize() for m in crop["suitable_months"]]),
            "harvest_duration_days": crop["duration_days"],
            "estimated_harvest_timeline": crop["harvest_timeline"],
            "expected_yield_per_acre_quintals": crop["yield_quintals_per_acre"],
            "estimated_cost_per_acre_rs": crop["cultivation_cost_per_acre"],
            "projected_mandi_price_per_quintal_rs": crop["projected_mandi_price"],
            "estimated_gross_revenue_per_acre_rs": gross_rev_acre,
            "estimated_net_profit_per_acre_rs": net_profit_acre,
            "total_projected_net_profit_rs": total_profit,
            "water_requirement": crop["water_need"],
            "soil_fitness_reason": crop["soil_reason"],
            "pest_risk_level": crop["pest_risk"],
            "market_demand_outlook": crop["market_outlook"]
        })
        
    scored_crops.sort(key=lambda x: x["suitability_score"], reverse=True)
    return scored_crops
