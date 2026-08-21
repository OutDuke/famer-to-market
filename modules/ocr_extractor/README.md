# Regional Mandi Price Board OCR Extractor API (`/modules/ocr_extractor`)

A plug-and-play FastAPI microservice that extracts agricultural commodity rates, minimum/maximum/modal prices, arrival volumes, and commodity grades from uploaded photos of APMC mandi rate blackboards and trade slips.

## 🚀 Endpoints
- `POST /extract-board`: Accepts multipart image upload or simulated payload and returns structured JSON with extracted key-value pairs (`crop_price_map`) and confidence metrics.

## 🧪 cURL Example
```bash
curl -X POST "http://localhost:8004/extract-board" \
  -F "file=@mandi_rate_board.jpg" \
  -F "mandi_hint=Azadpur APMC Yard #2"
```
