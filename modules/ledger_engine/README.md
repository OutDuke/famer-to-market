# Khata / Produce Ledger Engine API (`/modules/ledger_engine`)

A standalone FastAPI microservice for managing farmer harvest inventory and buyer receivables (Khata book). Handles real-time inventory deduction upon produce sale, credit limit enforcement, partial settlements, and outstanding balance summaries.

## 🚀 Endpoints
- `GET /inventory`: List active warehouse/shed stock
- `POST /inventory/add`: Add newly harvested crop quintals
- `GET /customers`: List registered traders and local buyers
- `POST /customers/add`: Register new trader with a designated credit limit
- `POST /sales/record`: Record a sale (auto-calculates cash vs credit and updates inventory)
- `GET /dues`: Retrieve aggregated pending dues and list of delinquent accounts
- `POST /dues/settle`: Record payment settlement via UPI/Cash/NEFT

## 🧪 cURL Example
```bash
# Record Sale on Credit
curl -X POST "http://localhost:8002/sales/record" \
  -H "Content-Type: application/json" \
  -d '{
    "customer_id": "CUST-001",
    "crop": "Wheat (Sharbati)",
    "quantity_quintals": 20,
    "rate_per_quintal": 2750,
    "paid_amount": 15000,
    "notes": "Delivered to shop, remaining ₹40,000 due next Monday"
  }'
```
