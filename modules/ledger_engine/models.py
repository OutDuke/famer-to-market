from typing import Optional, List
from enum import Enum
from pydantic import BaseModel, Field
from datetime import date

class PaymentStatus(str, Enum):
    PAID = "PAID"
    PARTIAL = "PARTIAL"
    CREDIT = "CREDIT"

class InventoryItemCreate(BaseModel):
    crop: str = Field(..., example="Wheat (Sharbati)")
    variety: str = Field("Standard Grade", example="HD-2967")
    quantity_quintals: float = Field(..., gt=0, example=50.0)
    storage_location: str = Field("Farm Godown #1", example="Farm Godown #1")
    minimum_target_price: float = Field(2500.0, gt=0, example=2600.0)

class InventoryItem(InventoryItemCreate):
    id: str
    harvest_date: str

class CustomerCreate(BaseModel):
    name: str = Field(..., example="Ramesh Aggarwal (Trader)")
    phone: str = Field(..., example="+91 9876543210")
    village_or_mandi: str = Field(..., example="Azadpur Mandi, Delhi")
    credit_limit: float = Field(100000.0, example=150000.0)

class Customer(CustomerCreate):
    id: str
    total_purchased: float = 0.0
    total_paid: float = 0.0
    outstanding_due: float = 0.0
    last_transaction_date: str

class SaleRecordRequest(BaseModel):
    customer_id: str = Field(..., example="CUST-001")
    crop: str = Field(..., example="Wheat (Sharbati)")
    quantity_quintals: float = Field(..., gt=0, example=20.0)
    rate_per_quintal: float = Field(..., gt=0, example=2750.0)
    paid_amount: float = Field(0.0, ge=0, example=15000.0)
    notes: Optional[str] = Field(None, example="Partial cash payment, balance in 10 days")

class SettlementRequest(BaseModel):
    customer_id: str = Field(..., example="CUST-001")
    settlement_amount: float = Field(..., gt=0, example=40000.0)
    payment_mode: str = Field("UPI", example="UPI / Cash / Bank Transfer")
    notes: Optional[str] = None

class TransactionRecord(BaseModel):
    id: str
    customer_id: str
    customer_name: str
    crop: str
    quantity_quintals: float
    rate_per_quintal: float
    total_amount: float
    paid_amount: float
    credit_amount: float
    status: PaymentStatus
    date: str
    notes: Optional[str] = None

class LedgerSummary(BaseModel):
    total_outstanding_credit: float
    total_sales_value: float
    total_cash_collected: float
    total_inventory_quintals: float
    active_buyers_count: int
    pending_dues_customers: List[Customer]
