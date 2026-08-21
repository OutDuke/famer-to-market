import React, { useState, useEffect } from "react";
import {
  BookOpen,
  PlusCircle,
  IndianRupee,
  Users,
  Package,
  AlertCircle,
  CheckCircle,
  FileText,
  Send,
  TrendingUp,
  Clock,
  ShieldAlert,
  FileBadge,
  ShieldCheck,
} from "lucide-react";
import { CustomerLedger, InventoryItem, TransactionRecord } from "../types";
import { useFarmerAuth } from "../context/FarmerAuthContext";

export const KhataLedger: React.FC = () => {
  const { currentFarmer, setIsCardModalOpen } = useFarmerAuth();
  const [activeSubTab, setActiveSubTab] = useState<"dues" | "sales" | "inventory" | "customers">("dues");
  const [customers, setCustomers] = useState<CustomerLedger[]>([]);
  const [transactions, setTransactions] = useState<TransactionRecord[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(false);

  // Form states
  const [showAddStockModal, setShowAddStockModal] = useState(false);
  const [showRecordSaleModal, setShowRecordSaleModal] = useState(false);
  const [showSettleModal, setShowSettleModal] = useState(false);
  const [selectedCustomerForSettle, setSelectedCustomerForSettle] = useState<CustomerLedger | null>(null);

  // New stock form
  const [stockCrop, setStockCrop] = useState("Wheat (Sharbati)");
  const [stockVariety, setStockVariety] = useState("HD-2967");
  const [stockQty, setStockQty] = useState(50);
  const [stockStorage, setStockStorage] = useState("Farm Godown #1");
  const [stockMinPrice, setStockMinPrice] = useState(2600);

  // New sale form
  const [saleCustomerId, setSaleCustomerId] = useState("");
  const [saleCrop, setSaleCrop] = useState("Wheat (Sharbati)");
  const [saleQty, setSaleQty] = useState(20);
  const [saleRate, setSaleRate] = useState(2750);
  const [salePaidAmt, setSalePaidAmt] = useState(15000);
  const [saleNotes, setSaleNotes] = useState("Partial cash, balance due in 7 days");

  // Settle form
  const [settleAmount, setSettleAmount] = useState(0);
  const [settleMode, setSettleMode] = useState("UPI / PhonePe");

  // WhatsApp reminder modal
  const [reminderMessage, setReminderMessage] = useState<string | null>(null);

  const fetchLedgerData = async () => {
    setLoading(true);
    try {
      const [custRes, transRes, invRes] = await Promise.all([
        fetch("/api/ledger/customers"),
        fetch("/api/ledger/transactions"),
        fetch("/api/ledger/inventory"),
      ]);

      const [custData, transData, invData] = await Promise.all([
        custRes.json(),
        transRes.json(),
        invRes.json(),
      ]);

      const loadedCustomers = Array.isArray(custData) ? custData : (custData.customers || []);
      const loadedTransactions = Array.isArray(transData) ? transData : (transData.transactions || []);
      const loadedInventory = Array.isArray(invData) ? invData : (invData.inventory || []);

      setCustomers(loadedCustomers);
      setTransactions(loadedTransactions);
      setInventory(loadedInventory);
      if (loadedCustomers.length > 0 && !saleCustomerId) {
        setSaleCustomerId(loadedCustomers[0].id);
      }
    } catch (err) {
      console.error("Failed to load khata ledger:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLedgerData();
  }, []);

  const handleAddStock = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/ledger/stock/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          crop: stockCrop,
          variety: stockVariety,
          quantityQuintals: stockQty,
          storageLocation: stockStorage,
          minimumTargetPrice: stockMinPrice,
        }),
      });
      if (res.ok) {
        setShowAddStockModal(false);
        fetchLedgerData();
      }
    } catch (err) {
      console.error("Failed to add stock:", err);
    }
  };

  const handleRecordSale = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/ledger/sale/record", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId: saleCustomerId,
          crop: saleCrop,
          quantityQuintals: saleQty,
          ratePerQuintal: saleRate,
          paidAmount: salePaidAmt,
          notes: saleNotes,
        }),
      });
      if (res.ok) {
        setShowRecordSaleModal(false);
        fetchLedgerData();
      }
    } catch (err) {
      console.error("Failed to record sale:", err);
    }
  };

  const [isSubmittingSettle, setIsSubmittingSettle] = useState(false);

  const handleSettleDue = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomerForSettle || settleAmount <= 0) return;
    setIsSubmittingSettle(true);
    try {
      const res = await fetch("/api/ledger/settle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId: selectedCustomerForSettle.id,
          amountPaid: settleAmount,
          settlementAmount: settleAmount,
          paymentMode: settleMode,
        }),
      });
      if (res.ok) {
        setShowSettleModal(false);
        setSelectedCustomerForSettle(null);
        await fetchLedgerData();
      } else {
        const errorData = await res.json().catch(() => ({}));
        alert(errorData.error || "Failed to record payment settlement.");
      }
    } catch (err) {
      console.error("Failed to settle dues:", err);
      alert("Network error while recording settlement.");
    } finally {
      setIsSubmittingSettle(false);
    }
  };

  const generateWhatsAppReminder = (c: CustomerLedger) => {
    const msg = `नमस्ते ${c.name} जी, किसान खाता विवरण:\nआपके खाते में ₹${c.outstandingDue.toLocaleString()} की बकाया राशि लंबित है। कृपया UPI या बैंक ट्रांसफर के माध्यम से यथाशीघ्र भुगतान करें। धन्यवाद।`;
    setReminderMessage(msg);
  };

  const totalOutstanding = (customers || []).reduce((sum, c) => sum + (c.outstandingDue || 0), 0);
  const totalStockQuintals = (inventory || []).reduce((sum, i) => sum + (i.quantityQuintals || 0), 0);
  const totalSalesVal = (transactions || []).reduce((sum, t) => sum + (t.totalAmount || 0), 0);

  return (
    <div className="space-y-5">
      {/* Khata Ledger Header */}
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 rounded-2xl p-4 sm:p-6 shadow-xs relative overflow-hidden text-slate-900 dark:text-slate-100">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-400 border border-purple-200 dark:border-purple-800">
                Financial & Produce Ledger
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Produce Inventory & Buyer Credit Management
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">
              Kisan Khata & Produce Stock Ledger
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed">
              Track farm godown produce inventory, record cash vs credit wholesale trade sales, enforce buyer credit limits, and settle outstanding balances with instant receipts.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAddStockModal(true)}
              className="bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-750 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Package className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <span>+ Add Harvest Stock</span>
            </button>
            <button
              onClick={() => setShowRecordSaleModal(true)}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>+ Record Sale</span>
            </button>
          </div>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 p-4 sm:p-5 rounded-2xl shadow-xs text-slate-900 dark:text-slate-100">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold">
            <span>Total Pending Credit Dues</span>
            <AlertCircle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1">
            ₹{totalOutstanding.toLocaleString()}
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400">
            Across {(customers || []).filter((c) => c.outstandingDue > 0).length} buyers
          </span>
        </div>

        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 p-4 sm:p-5 rounded-2xl shadow-xs text-slate-900 dark:text-slate-100">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold">
            <span>Active Harvest Stock</span>
            <Package className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            {totalStockQuintals} <span className="text-sm font-normal text-slate-500 dark:text-slate-400">Quintals</span>
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400">Ready for dispatch in godown</span>
        </div>

        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 p-4 sm:p-5 rounded-2xl shadow-xs text-slate-900 dark:text-slate-100">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold">
            <span>Total Season Sales Value</span>
            <TrendingUp className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-2xl font-black text-purple-600 dark:text-purple-400 mt-1">
            ₹{totalSalesVal.toLocaleString()}
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400">{(transactions || []).length} transactions recorded</span>
        </div>
      </div>

      {/* Sub Tab Navigation */}
      <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-900 p-1.5 rounded-xl border border-slate-200 dark:border-slate-700/80 max-w-fit overflow-x-auto">
        {[
          { id: "dues", label: "Pending Dues & Khata Book", count: (customers || []).filter((c) => c.outstandingDue > 0).length },
          { id: "inventory", label: "Produce Inventory", count: (inventory || []).length },
          { id: "sales", label: "Sales History", count: (transactions || []).length },
          { id: "customers", label: "Registered Buyers", count: (customers || []).length },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id as any)}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
              activeSubTab === tab.id
                ? "bg-white dark:bg-slate-800 text-purple-600 dark:text-purple-400 shadow-xs"
                : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                activeSubTab === tab.id
                  ? "bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-400"
                  : "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400"
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Sub Tab 1: Pending Dues & Khata */}
      {activeSubTab === "dues" && (
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 rounded-2xl overflow-hidden shadow-xs text-slate-900 dark:text-slate-100">
          <div className="p-4 border-b border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">Buyer Receivables & Credit Ledger</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Manage credit given to commission agents and local traders.</p>
            </div>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-700/60">
            {(customers || []).map((c) => (
              <div key={c.id} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-750 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 dark:text-white text-sm">{c.name}</span>
                    <span className="text-[10px] bg-slate-100 dark:bg-slate-900 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 px-1.5 py-0.5 rounded font-mono">
                      {c.id}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex flex-wrap items-center gap-3">
                    <span>📱 {c.phone}</span>
                    <span>📍 {c.village}</span>
                    <span>Credit Limit: ₹{c.creditLimit.toLocaleString()}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-xs text-slate-500 dark:text-slate-400">Outstanding Balance</div>
                    <div className={`text-base font-extrabold ${c.outstandingDue > 0 ? "text-rose-600 dark:text-rose-400" : "text-emerald-600 dark:text-emerald-400"}`}>
                      ₹{c.outstandingDue.toLocaleString()}
                    </div>
                  </div>

                  {c.outstandingDue > 0 ? (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setSelectedCustomerForSettle(c);
                          setSettleAmount(c.outstandingDue);
                          setShowSettleModal(true);
                        }}
                        className="bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                      >
                        Settle Payment
                      </button>
                      <button
                        onClick={() => generateWhatsAppReminder(c)}
                        className="bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 p-2 rounded-lg text-xs transition-colors cursor-pointer"
                        title="Draft WhatsApp Reminder"
                      >
                        <Send className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      </button>
                    </div>
                  ) : (
                    <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 px-2 py-1 rounded">
                      <CheckCircle className="w-3.5 h-3.5" /> All Settled
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sub Tab 2: Produce Inventory */}
      {activeSubTab === "inventory" && (
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 rounded-2xl overflow-hidden shadow-xs text-slate-900 dark:text-slate-100">
          <div className="p-4 border-b border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">Active Farm Storage & Godown Stock</h3>
            <button
              onClick={() => setShowAddStockModal(true)}
              className="text-xs text-purple-600 dark:text-purple-400 font-bold hover:underline cursor-pointer"
            >
              + Add Batch
            </button>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-700/60">
            {(inventory || []).map((item) => (
              <div key={item.id} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-750 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 dark:text-white text-sm">{item.crop}</span>
                    <span className="text-[10px] bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-400 border border-purple-200 dark:border-purple-800 px-1.5 py-0.2 rounded font-semibold">
                      {item.variety}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex flex-wrap items-center gap-3">
                    <span>📍 {item.storageLocation}</span>
                    <span>Harvested: {item.harvestDate}</span>
                    <span>Min Target Rate: ₹{item.minimumTargetPrice} / Q</span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-base font-extrabold text-slate-900 dark:text-white">
                    {item.quantityQuintals} Quintals
                  </div>
                  <div className="text-[11px] text-emerald-600 dark:text-emerald-400">
                    Valuation: ₹{(item.quantityQuintals * item.minimumTargetPrice).toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sub Tab 3: Sales History */}
      {activeSubTab === "sales" && (
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 rounded-2xl overflow-hidden shadow-xs text-slate-900 dark:text-slate-100">
          <div className="p-4 border-b border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">Wholesale Invoices & Dispatch Receipts</h3>
            <button
              onClick={() => setShowRecordSaleModal(true)}
              className="text-xs text-purple-600 dark:text-purple-400 font-bold hover:underline cursor-pointer"
            >
              + Record Sale
            </button>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-700/60">
            {(transactions || []).map((t) => (
              <div key={t.id} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-750 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 dark:text-white text-sm">{t.customerName}</span>
                    <span className="text-[10px] bg-slate-100 dark:bg-slate-900 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 px-1.5 py-0.5 rounded font-mono">
                      {t.id}
                    </span>
                    <span
                      className={`text-[9px] uppercase font-bold px-1.5 py-0.2 rounded ${
                        t.type === "CREDIT"
                          ? "bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800"
                          : "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800"
                      }`}
                    >
                      {t.type}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex flex-wrap items-center gap-3">
                    <span>🌾 {t.crop} ({t.quantityQuintals} Q @ ₹{t.ratePerQuintal}/Q)</span>
                    <span>📅 {t.date}</span>
                    <span className="italic">{t.notes}</span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-base font-extrabold text-slate-900 dark:text-white">
                    ₹{t.totalAmount.toLocaleString()}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    Paid: <span className="text-emerald-600 dark:text-emerald-400 font-bold">₹{t.paidAmount.toLocaleString()}</span>
                    {t.totalAmount > t.paidAmount && (
                      <span className="text-rose-600 dark:text-rose-400 ml-2 font-bold">
                        Due: ₹{(t.totalAmount - t.paidAmount).toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sub Tab 4: Registered Buyers */}
      {activeSubTab === "customers" && (
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 rounded-2xl overflow-hidden shadow-xs text-slate-900 dark:text-slate-100">
          <div className="p-4 border-b border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">Authorized Traders & Commission Agents</h3>
            <span className="text-xs text-slate-500 dark:text-slate-400">{(customers || []).length} Verified Traders</span>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-700/60">
            {(customers || []).map((c) => (
              <div key={c.id} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-750 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 dark:text-white text-sm">{c.name}</span>
                    <span className="text-[10px] bg-slate-100 dark:bg-slate-900 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 px-1.5 py-0.5 rounded font-mono">
                      {c.id}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex flex-wrap items-center gap-3">
                    <span>📱 {c.phone}</span>
                    <span>📍 {c.village}</span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs text-slate-500 dark:text-slate-400">Credit Limit</div>
                  <div className="text-base font-extrabold text-slate-900 dark:text-white">
                    ₹{c.creditLimit.toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal: Add Harvest Stock */}
      {showAddStockModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 sm:p-6 max-w-md w-full space-y-4 shadow-xl text-slate-900 dark:text-slate-100">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Package className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <span>Add Farm Storage Stock</span>
            </h3>
            <form onSubmit={handleAddStock} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-900 dark:text-white font-semibold block mb-1">Crop Name</label>
                <input
                  type="text"
                  value={stockCrop}
                  onChange={(e) => setStockCrop(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-slate-900 dark:text-white"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-900 dark:text-white font-semibold block mb-1">Seed Variety</label>
                  <input
                    type="text"
                    value={stockVariety}
                    onChange={(e) => setStockVariety(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-900 dark:text-white font-semibold block mb-1">Quantity (Quintals)</label>
                  <input
                    type="number"
                    value={stockQty}
                    onChange={(e) => setStockQty(Number(e.target.value))}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-slate-900 dark:text-white"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-900 dark:text-white font-semibold block mb-1">Storage Shed</label>
                  <input
                    type="text"
                    value={stockStorage}
                    onChange={(e) => setStockStorage(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-900 dark:text-white font-semibold block mb-1">Min Target Price (₹/Q)</label>
                  <input
                    type="number"
                    value={stockMinPrice}
                    onChange={(e) => setStockMinPrice(Number(e.target.value))}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-slate-900 dark:text-white"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddStockModal(false)}
                  className="px-3.5 py-2 bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl cursor-pointer shadow-xs"
                >
                  Save Stock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Record Sale */}
      {showRecordSaleModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 sm:p-6 max-w-md w-full space-y-4 shadow-xl text-slate-900 dark:text-slate-100">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <PlusCircle className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <span>Record Wholesale Produce Sale</span>
            </h3>
            <form onSubmit={handleRecordSale} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-900 dark:text-white font-semibold block mb-1">Select Buyer / Trader</label>
                <select
                  value={saleCustomerId}
                  onChange={(e) => setSaleCustomerId(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-slate-900 dark:text-white"
                  required
                >
                  {(customers || []).map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} (Due: ₹{c.outstandingDue.toLocaleString()} / Limit: ₹{c.creditLimit.toLocaleString()})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-slate-900 dark:text-white font-semibold block mb-1">Crop Sold</label>
                <input
                  type="text"
                  value={saleCrop}
                  onChange={(e) => setSaleCrop(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-slate-900 dark:text-white"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-900 dark:text-white font-semibold block mb-1">Quantity (Quintals)</label>
                  <input
                    type="number"
                    value={saleQty}
                    onChange={(e) => setSaleQty(Number(e.target.value))}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-slate-900 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="text-slate-900 dark:text-white font-semibold block mb-1">Rate (₹ / Quintal)</label>
                  <input
                    type="number"
                    value={saleRate}
                    onChange={(e) => setSaleRate(Number(e.target.value))}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-slate-900 dark:text-white"
                    required
                  />
                </div>
              </div>
              <div className="p-2.5 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 flex justify-between font-bold">
                <span className="text-slate-500 dark:text-slate-400">Total Invoice Value:</span>
                <span className="text-slate-900 dark:text-white">₹{(saleQty * saleRate).toLocaleString()}</span>
              </div>
              <div>
                <label className="text-slate-900 dark:text-white font-semibold block mb-1">Cash / UPI Paid Upfront (₹)</label>
                <input
                  type="number"
                  value={salePaidAmt}
                  onChange={(e) => setSalePaidAmt(Number(e.target.value))}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-emerald-600 dark:text-emerald-400 font-bold"
                />
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  Credit Given: <strong className="text-rose-600 dark:text-rose-400">₹{Math.max(0, (saleQty * saleRate) - salePaidAmt).toLocaleString()}</strong>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowRecordSaleModal(false)}
                  className="px-3.5 py-2 bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl cursor-pointer shadow-xs"
                >
                  Record Sale & Update Khata
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Settle Payment */}
      {showSettleModal && selectedCustomerForSettle && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 sm:p-6 max-w-md w-full space-y-4 shadow-xl text-slate-900 dark:text-slate-100">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <IndianRupee className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <span>Settle Payment: {selectedCustomerForSettle.name}</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Total Outstanding Due: <strong className="text-rose-600 dark:text-rose-400">₹{selectedCustomerForSettle.outstandingDue.toLocaleString()}</strong>
            </p>
            <form onSubmit={handleSettleDue} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-900 dark:text-white font-semibold block mb-1">Settlement Amount (₹)</label>
                <input
                  type="number"
                  min="1"
                  value={settleAmount}
                  max={selectedCustomerForSettle.outstandingDue}
                  onChange={(e) => setSettleAmount(Number(e.target.value))}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-emerald-600 dark:text-emerald-400 text-base font-bold"
                  required
                />
              </div>
              <div>
                <label className="text-slate-900 dark:text-white font-semibold block mb-1">Payment Mode</label>
                <select
                  value={settleMode}
                  onChange={(e) => setSettleMode(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-slate-900 dark:text-white"
                >
                  <option value="UPI / PhonePe">UPI / PhonePe / GPay</option>
                  <option value="Cash Handover">Cash Handover</option>
                  <option value="NEFT / RTGS Bank Transfer">NEFT / RTGS Bank Transfer</option>
                  <option value="Post-Dated Cheque">Post-Dated Cheque</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowSettleModal(false)}
                  className="px-3.5 py-2 bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl font-bold cursor-pointer"
                  disabled={isSubmittingSettle}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingSettle}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl cursor-pointer shadow-xs disabled:opacity-50 flex items-center gap-1.5"
                >
                  {isSubmittingSettle ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Recording...</span>
                    </>
                  ) : (
                    <span>Record Settlement Receipt</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: WhatsApp Reminder Preview */}
      {reminderMessage && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 sm:p-6 max-w-md w-full space-y-4 shadow-xl text-slate-900 dark:text-slate-100">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Send className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <span>WhatsApp Payment Reminder Draft</span>
            </h3>
            <textarea
              readOnly
              value={reminderMessage}
              rows={4}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-xs text-slate-900 dark:text-white"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setReminderMessage(null)}
                className="px-3.5 py-2 bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 text-slate-900 dark:text-white text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(reminderMessage);
                  alert("Message copied to clipboard!");
                  setReminderMessage(null);
                }}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl cursor-pointer shadow-xs"
              >
                Copy Message
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
