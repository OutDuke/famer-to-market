from fastapi import FastAPI, HTTPException, status
from typing import List
from datetime import date
from models import (
    Customer,
    CustomerCreate,
    InventoryItem,
    InventoryItemCreate,
    SaleRecordRequest,
    SettlementRequest,
    TransactionRecord,
    PaymentStatus,
    LedgerSummary,
)

app = FastAPI(
    title="Kisan Khata & Ledger Engine API",
    description="Microservice for smallholder farmers to track produce inventory, record mandi cash/credit sales, and manage buyer receivables.",
    version="1.0.0"
)

# In-memory storage for standalone execution
CUSTOMERS_DB: dict[str, Customer] = {
    "CUST-001": Customer(
        id="CUST-001",
        name="Ramesh Aggarwal (Wholesale Trading)",
        phone="+91 98765 43210",
        village_or_mandi="Azadpur Mandi, Delhi",
        credit_limit=150000.0,
        total_purchased=240000.0,
        total_paid=180000.0,
        outstanding_due=60000.0,
        last_transaction_date="2026-08-18"
    ),
    "CUST-002": Customer(
        id="CUST-002",
        name="Gupta Sabzi Bhandar",
        phone="+91 98112 34567",
        village_or_mandi="Sector 18, Noida",
        credit_limit=80000.0,
        total_purchased=95000.0,
        total_paid=70000.0,
        outstanding_due=25000.0,
        last_transaction_date="2026-08-19"
    )
}

INVENTORY_DB: dict[str, InventoryItem] = {
    "INV-01": InventoryItem(
        id="INV-01",
        crop="Wheat (Sharbati)",
        variety="HD-2967",
        quantity_quintals=85.0,
        harvest_date="2026-04-20",
        storage_location="Farm Godown #1",
        minimum_target_price=2600.0
    ),
    "INV-02": InventoryItem(
        id="INV-02",
        crop="Tomato (Hybrid Red)",
        variety="Abhinav F1",
        quantity_quintals=32.0,
        harvest_date="2026-08-17",
        storage_location="Cooling Shed",
        minimum_target_price=2200.0
    )
}

TRANSACTIONS_DB: List[TransactionRecord] = [
    TransactionRecord(
        id="TXN-101",
        customer_id="CUST-001",
        customer_name="Ramesh Aggarwal (Wholesale Trading)",
        crop="Wheat (Sharbati)",
        quantity_quintals=40.0,
        rate_per_quintal=2750.0,
        total_amount=110000.0,
        paid_amount=50000.0,
        credit_amount=60000.0,
        status=PaymentStatus.PARTIAL,
        date="2026-08-18",
        notes="Part cash received, balance due."
    )
]

@app.get("/health")
def health():
    return {"status": "healthy", "service": "ledger_engine", "version": "1.0.0"}

# 1. Produce Inventory Endpoints
@app.get("/inventory", response_model=List[InventoryItem])
def get_inventory():
    return list(INVENTORY_DB.values())

@app.post("/inventory/add", response_model=InventoryItem, status_code=status.HTTP_201_CREATED)
def add_stock(item_in: InventoryItemCreate):
    new_id = f"INV-{len(INVENTORY_DB) + 1:02d}"
    item = InventoryItem(
        id=new_id,
        harvest_date=str(date.today()),
        **item_in.model_dump()
    )
    INVENTORY_DB[new_id] = item
    return item

# 2. Customers & Credit Endpoints
@app.get("/customers", response_model=List[Customer])
def get_customers():
    return list(CUSTOMERS_DB.values())

@app.post("/customers/add", response_model=Customer, status_code=status.HTTP_201_CREATED)
def add_customer(cust_in: CustomerCreate):
    new_id = f"CUST-{len(CUSTOMERS_DB) + 1:03d}"
    customer = Customer(
        id=new_id,
        last_transaction_date=str(date.today()),
        **cust_in.model_dump()
    )
    CUSTOMERS_DB[new_id] = customer
    return customer

# 3. Sales & Ledger Transactions
@app.post("/sales/record", response_model=TransactionRecord, status_code=status.HTTP_201_CREATED)
def record_sale(sale: SaleRecordRequest):
    customer = CUSTOMERS_DB.get(sale.customer_id)
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found in ledger")

    total_amt = round(sale.quantity_quintals * sale.rate_per_quintal, 2)
    paid_amt = round(sale.paid_amount, 2)
    credit_amt = round(max(0.0, total_amt - paid_amt), 2)

    # Check credit limit
    if (customer.outstanding_due + credit_amt) > customer.credit_limit:
        raise HTTPException(
            status_code=400,
            detail=f"Sale exceeds customer credit limit of ₹{customer.credit_limit}. Current due: ₹{customer.outstanding_due}"
        )

    status_val = (
        PaymentStatus.PAID if paid_amt >= total_amt
        else PaymentStatus.PARTIAL if paid_amt > 0
        else PaymentStatus.CREDIT
    )

    txn_id = f"TXN-{len(TRANSACTIONS_DB) + 101}"
    txn = TransactionRecord(
        id=txn_id,
        customer_id=customer.id,
        customer_name=customer.name,
        crop=sale.crop,
        quantity_quintals=sale.quantity_quintals,
        rate_per_quintal=sale.rate_per_quintal,
        total_amount=total_amt,
        paid_amount=paid_amt,
        credit_amount=credit_amt,
        status=status_val,
        date=str(date.today()),
        notes=sale.notes
    )

    TRANSACTIONS_DB.insert(0, txn)

    # Update customer ledger balance
    customer.total_purchased += total_amt
    customer.total_paid += paid_amt
    customer.outstanding_due += credit_amt
    customer.last_transaction_date = str(date.today())

    # Automatically deduct from inventory if exists
    for inv_item in INVENTORY_DB.values():
        if sale.crop.lower() in inv_item.crop.lower() and inv_item.quantity_quintals >= sale.quantity_quintals:
            inv_item.quantity_quintals -= sale.quantity_quintals
            break

    return txn

# 4. View Pending Dues & Overall Khata Summary
@app.get("/dues", response_model=LedgerSummary)
def get_pending_dues():
    pending_list = [c for c in CUSTOMERS_DB.values() if c.outstanding_due > 0]
    total_credit = sum(c.outstanding_due for c in CUSTOMERS_DB.values())
    total_sales = sum(t.total_amount for t in TRANSACTIONS_DB)
    total_collected = sum(t.paid_amount for t in TRANSACTIONS_DB)
    total_stock = sum(i.quantity_quintals for i in INVENTORY_DB.values())

    return LedgerSummary(
        total_outstanding_credit=total_credit,
        total_sales_value=total_sales,
        total_cash_collected=total_collected,
        total_inventory_quintals=total_stock,
        active_buyers_count=len(CUSTOMERS_DB),
        pending_dues_customers=pending_list
    )

# 5. Settle Credit Due
@app.post("/dues/settle")
def settle_customer_due(settlement: SettlementRequest):
    customer = CUSTOMERS_DB.get(settlement.customer_id)
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")

    amount = settlement.settlement_amount
    customer.outstanding_due = max(0.0, customer.outstanding_due - amount)
    customer.total_paid += amount

    receipt = TransactionRecord(
        id=f"PAY-{len(TRANSACTIONS_DB) + 201}",
        customer_id=customer.id,
        customer_name=customer.name,
        crop="Payment Settlement",
        quantity_quintals=0,
        rate_per_quintal=0,
        total_amount=0,
        paid_amount=amount,
        credit_amount=0,
        status=PaymentStatus.PAID,
        date=str(date.today()),
        notes=f"Settlement via {settlement.payment_mode}. Remaining due: ₹{customer.outstanding_due}"
    )
    TRANSACTIONS_DB.insert(0, receipt)

    return {
        "success": True,
        "settled_amount": amount,
        "remaining_due": customer.outstanding_due,
        "receipt_id": receipt.id
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8002, reload=True)
