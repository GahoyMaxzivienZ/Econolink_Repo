import { useEffect, useMemo, useState } from "react";
import "./pos.css";

export default function POS() {
  const [itemsData, setItemsData] = useState([]);
  const [cart, setCart] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [cash, setCash] = useState("");
  const [cashier, setCashier] = useState("");
  const [receipt, setReceipt] = useState(null);
  const [showReceipt, setShowReceipt] = useState(false);
  const [selected, setSelected] = useState(null);
  const [qty, setQty] = useState(1);
  

  const API = "http://localhost/project/backend/get_pos_data.php";

  useEffect(() => {
    fetch(API, { credentials: "include" })
      .then(r => r.json())
      .then(d => {
        setItemsData(d.items || []);
        setCashier(d.cashier_name || "");
      });
  }, []);

  const filteredItems = useMemo(() => {
    return itemsData.filter(i => {
      const matchSearch = i.product_name
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchCat = category === "all" || i.category === category;

      return matchSearch && matchCat;
    });
  }, [itemsData, search, category]);

  const addToCart = (item, qty) => {
    if (item.quantity <= 0) return;

    setCart(prev => {
      const exist = prev.find(i => i.id === item.id);

      if (exist) {
        return prev.map(i =>
          i.id === item.id
            ? { ...i, qty: i.qty + qty }
            : i
        );
      }

      return [
        ...prev,
        {
          id: item.id,
          name: item.product_name,
          price: item.price * 1.12,
          qty,
          stock: item.quantity,
          image: item.image
        }
      ];
    });
  };

  const { subtotal, vat, total, change } = useMemo(() => {
    let sub = 0;
    let v = 0;

    cart.forEach(i => {
      const line = i.price * i.qty;
      v += line * (12 / 112);
      sub += line - line * (12 / 112);
    });

    const t = sub + v;
    const cashNum = Number(cash) || 0;
    const c = cashNum >= t ? cashNum - t : 0;

    return {
      subtotal: sub,
      vat: v,
      total: t,
      change: c
    };
  }, [cart, cash]);

const checkout = () => {
  if (!cart.length) return;

  const receiptData = {
    items: cart.map(i => ({
      product_id: i.id,
      name: i.name,
      quantity: i.qty,
      price: i.price,
      total: i.price * i.qty
    })),
    cash: Number(cash),
    change,
    subtotal,
    vat,
    total
  };

  setReceipt(receiptData);
  setShowReceipt(true);
};

const printReceipt = async () => {
  if (!receipt || !receipt.items?.length) {
    alert("No receipt data found");
    return;
  }

  try {
    const res = await fetch(
      "http://localhost/project/backend/save_sales.php",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
  items: receipt.items.map(i => ({
    product_id: i.product_id,
    quantity: i.quantity,
    price: i.price,
    discount: 0,
    total: i.total
  })),
  discount_applied: 0,
  discount_amount: 0,
  total: receipt.total
})
      }
    );

    const data = await res.json();

    console.log("SAVE RESPONSE:", data); // 🔥 IMPORTANT DEBUG

    if (data.status === "success") {
  window.print();

  setShowReceipt(false);
  setCart([]);
  setCash("");
  setReceipt(null);

  setTimeout(() => {
    window.location.reload();
  }, 300);
} else {
      alert(data.msg || "Save failed");
    }

  } catch (err) {
    console.error("PRINT ERROR:", err);
    alert("Print failed (check console)");
  }
};

  return (
    <div className="pos-wrapper">

      {/* LEFT SIDE */}
      <div className="pos-left">

        <div className="pos-topbar">
          <button onClick={() => window.history.back()}>
            ← Back
          </button>

          <div className="topbar-right">
            <input
              placeholder="Search items..."
              onChange={e => setSearch(e.target.value)}
            />

            <select onChange={e => setCategory(e.target.value)}>
              <option value="all">All</option>
              {[...new Set(itemsData.map(i => i.category))].map((c, i) => (
                <option key={i}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid">
          {filteredItems.map(item => (
            <div
              key={item.id}
              className={`card ${item.quantity <= 0 ? "disabled" : ""}`}
              onClick={() => {
                setSelected(item);
                setQty(1);
              }}
            >
              <img src={item.image} />
              <div className="card-info">
                <h4>{item.product_name}</h4>
                <p>₱{(item.price * 1.12).toFixed(2)}</p>
                <span>Stock: {item.quantity}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

          {/* RIGHT SIDE */}
<div className="pos-right">

  {/* HEADER */}
  <div className="receipt-title">
    <h3>RECEIPT</h3>
    <div className="receipt-meta">
      <div>Cashier: {cashier}</div>
    </div>
  </div>

  {/* ITEMS */}
  <div className="receipt">
    <div className="receipt-box">

      <div className="receipt-header">
        <span className="col-name">Product</span>
        <span className="col-qty">Qty</span>
        <span className="col-price">Price</span>
        <span className="col-action"></span>
      </div>

      {cart.map((i, idx) => (
        <div key={idx} className="receipt-row">

          <div className="col-name">
            <img src={i.image} className="receipt-img" />
            <span>{i.name}</span>
          </div>

          <span className="col-qty">{i.qty}</span>

          <span className="col-price">
            ₱{(i.price * i.qty).toFixed(2)}
          </span>

          <span className="col-action">
            <button
              className="remove-btn"
              onClick={() => {
                setCart(prev =>
                  prev.filter((_, index) => index !== idx)
                );
              }}
            >
              ✕
            </button>
          </span>

        </div>
      ))}

    </div>
  </div>

  {/* SUMMARY */}
  <div className="summary-box">
    <div className="line">
      <span>Subtotal</span>
      <span>₱{subtotal.toFixed(2)}</span>
    </div>

    <div className="line">
      <span>VAT</span>
      <span>₱{vat.toFixed(2)}</span>
    </div>

    <div className="line total">
      <span>TOTAL</span>
      <span>₱{total.toFixed(2)}</span>
    </div>
  </div>

  {/* PAYMENT */}
  <div className="payment-box">

<input
  placeholder="Cash"
  value={cash}
  onChange={(e) => {
    let val = e.target.value;

    // allow numbers + dot only
    val = val.replace(/[^0-9.]/g, "");

    // prevent multiple dots
    const parts = val.split(".");
    if (parts.length > 2) {
      val = parts[0] + "." + parts[1];
    }

    setCash(val);
  }}
  className={cash && Number(cash) < total ? "cash-input error" : "cash-input"}
/>
        
    <div className="change-line">
  
        <span className="left-status">
            {cash && Number(cash) < total ? "Insufficient cash" : ""}
        </span>

        <span className="right-change">
            Change: ₱{change.toFixed(2)}
        </span>

        </div>

  </div>

<div className="action-buttons">

  <button
    className="clear-receipt"
    onClick={() => {
      setCart([]);
      setCash("");
    }}
  >
    Clear Receipt
  </button>

  <button
        disabled={!cash || Number(cash) < total}
        className="checkout"
        onClick={checkout}
      >
    Checkout
  </button>

</div>

</div>

      {/* MODAL */}
      {selected && (
        <div className="modal">
          <div className="modal-boxx">

            <img src={selected.image} className="modal-img" />

            <h3>{selected.product_name}</h3>
            <p>Stock: {selected.quantity}</p>

            <input
              type="number"
              value={qty}
              min={1}
              max={selected?.quantity || 1}
              step="1"
              onChange={(e) => {
                let val = e.target.value.replace(/[^0-9]/g, "");
                let num = Number(val);

                if (!num || num < 1) num = 1;
if (selected && num > selected.quantity) {
  num = selected.quantity;
}
                setQty(num);
}}
            />

            <button
              onClick={() => {
                addToCart(selected, qty);
                setSelected(null);
              }}
            >
              Add to Cart
            </button>

            <button onClick={() => setSelected(null)}>
              Cancel
            </button>

          </div>
        </div>
      )}
      {showReceipt && receipt && (
  <div className="modal">
    <div className="modal-box receipt-modal">
      <h2 className="receipt-title-text">RECEIPT</h2>
      <div className="receipt-print-area">

      
<div className="receipt-brand">

  <div className="receipt-store">
    ECONOLYTZ
  </div>

  <div className="receipt-address">
    B14 Lot 1&2 Woodpecker St. Phase 2 East<br/>
    Camella Homes Springville, Molino Road<br/>
    Bacoor, Philippines, 4102<br/>
    09923227702
  </div>

</div>

<div className="receipt-headerB">

  <div className="receipt-info-line">
    <span>Cashier:</span>
    <span>{cashier}</span>
  </div>

  <div className="receipt-info-line">
    <span>Date: </span>
    <span>{new Date().toLocaleString()}</span>
  </div>

</div>

      <hr />

      <div className="receipt-items">

        {/* HEADER */}
        <div className="receipt-line header">
          <span className="col-qty">QTY</span>
          <span className="col-name">ITEM</span>
          <span className="col-price">AMOUNT</span>
        </div>

        <div className="divider"></div>

        {/* ITEMS */}
        {receipt.items?.map((item, idx) => (
          <div key={idx} className="receipt-line">
            <span className="col-qty">{item.quantity}</span>
            <span className="col-name">{item.name}</span>
            <span className="col-price">₱{item.total.toFixed(2)}</span>
          </div>
        ))}
      </div>

      <hr />

<div className="receipt-summary">

  <div className="line">
    <span>Subtotal</span>
    <span>₱{receipt.subtotal?.toFixed(2)}</span>
  </div>

  <div className="line">
    <span>VAT (12%)</span>
    <span>₱{receipt.vat?.toFixed(2)}</span>
  </div>

  <div className="line total">
    <span>TOTAL</span>
    <span>₱{receipt.total?.toFixed(2)}</span>
  </div>

  <div className="line">
    <span>Cash</span>
    <span>₱{receipt.cash?.toFixed(2)}</span>
  </div>

  <div className="line">
    <span>Change</span>
    <span>₱{receipt.change?.toFixed(2)}</span>
  </div>

</div>
  </div>

      <div className="receipt-actions">
        <button onClick={() => setShowReceipt(false)}>
 Cancel
</button>

<button onClick={printReceipt}>
 Print
</button>
      </div>

    </div>
  </div>
)}
    </div>
    
  );
}