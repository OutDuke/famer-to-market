import os
import re
from typing import Dict, Any, List, Optional
from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from pydantic import BaseModel
from datetime import datetime

app = FastAPI(
    title="Regional Mandi Document & Board OCR Extractor API",
    description="Microservice for extracting agricultural commodity rates, grades, and arrival volumes from photo captures of APMC Mandi blackboard noticeboards and auction receipts.",
    version="1.0.0"
)

class MandiRateItem(BaseModel):
    crop: str
    min_price_rs_quintal: float
    max_price_rs_quintal: float
    modal_price_rs_quintal: float
    detected_grade: str
    arrival_volume: str
    confidence_score: float

class OcrMetadata(BaseModel):
    mandi_location: str
    scan_timestamp: str
    detected_script: str
    ocr_engine_mode: str
    average_confidence: str
    raw_text_extracted: str

class OcrExtractionResponse(BaseModel):
    success: bool
    filename: Optional[str]
    metadata: OcrMetadata
    extracted_rates: List[MandiRateItem]
    crop_price_map: Dict[str, float]

# High-fidelity regional mandi rates simulation
DEFAULT_MANDI_RECORDS = [
    {
        "crop": "Tomato (Hybrid Red)",
        "min_price_rs_quintal": 2100.0,
        "max_price_rs_quintal": 2600.0,
        "modal_price_rs_quintal": 2450.0,
        "detected_grade": "Grade-A Red Round",
        "arrival_volume": "145 Tonnes",
        "confidence_score": 0.96
    },
    {
        "crop": "Onion (Nashik Red)",
        "min_price_rs_quintal": 2600.0,
        "max_price_rs_quintal": 3100.0,
        "modal_price_rs_quintal": 2850.0,
        "detected_grade": "Medium (45-55mm)",
        "arrival_volume": "290 Tonnes",
        "confidence_score": 0.94
    },
    {
        "crop": "Potato (Jyoti / Pukhraj)",
        "min_price_rs_quintal": 1450.0,
        "max_price_rs_quintal": 1750.0,
        "modal_price_rs_quintal": 1620.0,
        "detected_grade": "Table Quality FAQ",
        "arrival_volume": "380 Tonnes",
        "confidence_score": 0.98
    },
    {
        "crop": "Wheat (Sharbati Gold)",
        "min_price_rs_quintal": 2650.0,
        "max_price_rs_quintal": 2850.0,
        "modal_price_rs_quintal": 2750.0,
        "detected_grade": "Luster Cleaned (<12% moisture)",
        "arrival_volume": "520 Tonnes",
        "confidence_score": 0.92
    },
    {
        "crop": "Mustard Seed (Pusa Bold)",
        "min_price_rs_quintal": 5200.0,
        "max_price_rs_quintal": 5550.0,
        "modal_price_rs_quintal": 5400.0,
        "detected_grade": "Yellow Bold (>41.5% oil)",
        "arrival_volume": "95 Tonnes",
        "confidence_score": 0.95
    }
]

@app.get("/health")
def health():
    return {"status": "healthy", "service": "ocr_extractor", "version": "1.0.0"}

@app.post("/extract-board", response_model=OcrExtractionResponse)
async def extract_mandi_board(
    file: Optional[UploadFile] = File(None),
    mandi_hint: Optional[str] = Form("Azadpur APMC Yard #2")
):
    try:
        filename = file.filename if file else "simulated_mandi_board.jpg"
        
        # Build dictionary mapping Crop -> Modal Price
        crop_map = {item["crop"]: item["modal_price_rs_quintal"] for item in DEFAULT_MANDI_RECORDS}

        raw_text = (
            f"=== कृषि उपज मंडी समिति ({mandi_hint}) ===\n"
            f"दैनिक थोक भाव पत्रक | दिनांक: {datetime.now().strftime('%d-%m-%Y')}\n"
            f"1. टमाटर (हाइब्रिड): ₹2100 - ₹2600 (मॉडल ₹2450) [आवक: 145T]\n"
            f"2. प्याज (नासिक लाल): ₹2600 - ₹3100 (मॉडल ₹2850) [आवक: 290T]\n"
            f"3. आलू (ज्योति/पुखराज): ₹1450 - ₹1750 (मॉडल ₹1620) [आवक: 380T]\n"
            f"4. गेहूं (शरबती): ₹2650 - ₹2850 (मॉडल ₹2750) [आवक: 520T]\n"
            f"5. सरसों (पीली बोल्ड): ₹5200 - ₹5550 (मॉडल ₹5400) [आवक: 95T]\n"
            f"सत्यापित नीलामी दरें - सचिव, एपीएमसी यार्ड"
        )

        metadata = OcrMetadata(
            mandi_location=mandi_hint or "Azadpur APMC Mandi",
            scan_timestamp=datetime.now().isoformat(),
            detected_script="Bilingual (Devanagari Hindi + Latin Numerals)",
            ocr_engine_mode="Mock Vision Transformer / Agmarknet Board Parser",
            average_confidence="95.0%",
            raw_text_extracted=raw_text
        )

        return OcrExtractionResponse(
            success=True,
            filename=filename,
            metadata=metadata,
            extracted_rates=[MandiRateItem(**item) for item in DEFAULT_MANDI_RECORDS],
            crop_price_map=crop_map
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8004, reload=True)
