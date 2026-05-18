import { useEffect, useState } from "react";
import Sidebar from "./Sidebar_employee";
import "./index.css";

function AdminInventory() {
  const [items, setItems] = useState([]);
   const inputStyle = {
    width: "100%",
    padding: "10px",
    marginBottom: "10px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "14px",
  };

  const [modalOpen, setModalOpen] = useState(false);
  const [mode, setMode] = useState("add");

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [filter, setFilter] = useState("all");

  const [form, setForm] = useState({
    id: "",
    product_name: "",
    category: "",
    quantity: "",
    price: "",
    image: null,
    current_image: "",
  });

  const [preview, setPreview] = useState(null);

  /* =========================
     FETCH INVENTORY (AJAX)
  ========================= */
  useEffect(() => {
    fetchItems();
  }, [search, category, filter]);

  const fetchItems = async () => {
    try {
      const params = new URLSearchParams({
        search,
        category,
        filter,
      });

      const res = await fetch(
        `http://localhost/project/backend/ajax_inventory.php?${params}`,
        { credentials: "include" }
      );

      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Fetch error:", err);
      setItems([]);
    }
  };

  /* =========================
     MODAL HANDLERS
  ========================= */
  const openAdd = () => {
    setMode("add");
    setForm({
      id: "",
      product_name: "",
      category: "",
      quantity: "",
      price: "",
      image: null,
      current_image: "",
    });
    setPreview(null);
    setModalOpen(true);
  };

  const openEdit = (item) => {
    setMode("edit");
    setForm({
      id: item.id,
      product_name: item.product_name,
      category: item.category,
      quantity: item.quantity,
      price: item.price,
      current_image: item.image,
    });
    setPreview(item.image);
    setModalOpen(true);
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    setForm((prev) => ({ ...prev, image: file }));
    if (file) setPreview(URL.createObjectURL(file));
  };

  /* =========================
     SAVE (ADD / UPDATE)
  ========================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const fd = new FormData();
    fd.append("product_name", form.product_name);
    fd.append("category", form.category);
    fd.append("quantity", form.quantity);
    fd.append("price", form.price);

    if (form.image) fd.append("image", form.image);

    if (mode === "edit") {
      fd.append("update_item", 1);
      fd.append("item_id", form.id);
      fd.append("current_image", form.current_image);
    } else {
      fd.append("add_item", 1);
    }

    await fetch("http://localhost/project/backend/inventory.php", {
      method: "POST",
      body: fd,
      credentials: "include",
    });

    setModalOpen(false);
    fetchItems();
  };

  /* =========================
     DELETE
  ========================= */
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this item?")) return;

    await fetch(
      `http://localhost/project/backend/inventory.php?delete_id=${id}`,
      { credentials: "include" }
    );

    setModalOpen(false);
    fetchItems();
  };

  /* =========================
     STOCK CLASS
  ========================= */
  const getStockClass = (qty) => {
    if (qty == 0) return "stock-none";
    if (qty <= 5) return "stock-low";
    return "stock-ok";
  };
    const btnGreen = {
    padding: "8px 12px",
    borderRadius: 8,
    background: "#28a745",
    color: "white",
    border: "none"
    };

    const btnOrange = {
    padding: "8px 12px",
    borderRadius: 8,
    background: "#ff9800",
    color: "white",
    border: "none"
    };

    const btnRed = {
    padding: "8px 12px",
    borderRadius: 8,
    background: "#dc3545",
    color: "white",
    border: "none"
    };

    const btnGray = {
    padding: "8px 12px",
    borderRadius: 8,
    background: "#6c757d",
    color: "white",
    border: "none"
    };
    
  /* =========================
     UI
  ========================= */
return (
    
  <div style={{ display: "flex", minHeight: "100vh", background: "#f4f9ff" , fontFamily: "Poppins, sans-serif",}}>
    <Sidebar />

    <div className="main" style={{ flex: 1, padding: 30 }}>

      {/* HEADER */}
      <div className="header" style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 30
      }}>
        <h1 style={{ color: "#001f3f", fontSize: "1.8em" }}>
          Inventory Management
        </h1>

        <input
          type="text"
          placeholder="Search items..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            padding: "10px 15px",
            borderRadius: 8,
            border: "1px solid #ccc",
            width: 250
          }}
        />
      </div>

      {/* INVENTORY CONTAINER */}
      <div
        className="inventory-container"
        style={{
          background: "white",
          padding: 25,
          borderRadius: 16,
          boxShadow: "0 5px 15px rgba(0, 127, 255, .1)"
        }}
      >

        {/* HEADER INSIDE */}
        <div
          className="inventory-header"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h3 style={{ color: "#001f3f", fontSize: 20 }}>
            Current Stock
          </h3>

          <button
            onClick={openAdd}
            style={{
              background: "#001f3f",
              color: "white",
              border: "none",
              padding: "10px 20px",
              borderRadius: 10,
              fontWeight: 600,
              cursor: "pointer"
            }}
          >
            Add New Item
          </button>
        </div>

        {/* FILTERS */}
        <div style={{ display: "flex", alignItems: "center", gap: 15, marginBottom: 20 }}>

          <label style={{ fontWeight: 600, color: "#001f3f" }}>
            Filter by Category:
          </label>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={{
                padding: "8px 12px",
                borderRadius: 8,
                border: "1px solid #ccc"
            }}
            >
            <option value="all">All Categories</option>
            <option value="IC">IC</option>
            <option value="MOSFETS">MOSFETS</option>
            <option value="Capacitor">Capacitor</option>
            <option value="Diode">Diode</option>
            <option value="Faders">Faders</option>
            <option value="Potentiometer">Potentiometer</option>
            <option value="Transistor">Transistor</option>
            <option value="Thermistor">Thermistor</option>
            <option value="TRIAC">TRIAC</option>
            <option value="Toroidal Transformer">Toroidal Transformer</option>
            <option value="Audio Equipments">Audio Equipments</option>
            <option value="Electronic Components">Electronic Components</option>
            <option value="Heatsink">Heatsink</option>
            <option value="Panel Meter">Panel Meter</option>
            <option value="Radio Equipments">Radio Equipments</option>
            </select>

<button onClick={() => {
  setFilter("goodstock");
}} style={btnGreen}>
  Good Stock
</button>

<button onClick={() => {
  setFilter("lowstock");
}} style={btnOrange}>
  Low Stock
</button>

<button onClick={() => {
  setFilter("nostock");
}} style={btnRed}>
  No Stock
</button>

<button onClick={() => {
  setFilter("all");
  setCategory("all");
}} style={btnGray}>
  Clear Filter
</button>

        </div>

        {/* LEGEND */}
        <div style={{
          display: "flex",
          justifyContent: "center",
          gap: 20,
          marginBottom: 20,
          flexWrap: "wrap"
        }}>
          <Legend color="#28a745" label="Good Stock (>5)" />
          <Legend color="#ff9800" label="Low Stock (1-5)" />
          <Legend color="#dc3545" label="No Stock (0)" />
        </div>

        {/* GRID */}
<div
  style={{
    display: "grid",
    gridTemplateColumns: "repeat(5, 1fr)",
    gap: 12,
  }}
>
  {items.length === 0 ? (
    <p
      style={{
        gridColumn: "1/-1",
        textAlign: "center",
        color: "#999",
      }}
    >
      No items found.
    </p>
  ) : (
    items.map((item) => (
      <div
        key={item.id}
        onClick={() => openEdit(item)}
        style={{
          background: "#fff",
          borderRadius: 10,
          overflow: "hidden",
          cursor: "pointer",
          boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
          transition: "0.2s ease",
          border:
            item.quantity == 0
              ? "2px solid #dc3545"
              : item.quantity <= 5
              ? "2px solid #ff9800"
              : "2px solid #28a745",
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.transform = "translateY(-3px)")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.transform = "translateY(0)")
        }
      >
        {/* IMAGE */}
        <div
          style={{
            width: "100%",
            height: 120,
            background: "#f5f7fa",
            overflow: "hidden",
          }}
        >
          <img
            src={item.image || "placeholder.png"}
            alt=""
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </div>

        {/* CONTENT */}
        <div style={{ padding: 10 }}>
          <h4
            style={{
              margin: 0,
              fontSize: 14,
              color: "#001f3f",
              fontWeight: 700,
            }}
          >
            {item.product_name}
          </h4>

          <p
            style={{
              margin: "4px 0",
              fontSize: 12,
              color: "#666",
            }}
          >
            {item.category}
          </p>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: 8,
            }}
          >
            <span
              style={{
                fontWeight: 700,
                fontSize: 13,
                color: "#000080",
              }}
            >
              ₱{item.price}
            </span>

            <span
              style={{
                fontSize: 11,
                padding: "3px 6px",
                borderRadius: 6,
                background:
                  item.quantity == 0
                    ? "#ffe5e5"
                    : item.quantity <= 5
                    ? "#fff3e0"
                    : "#e8f5e9",
                color:
                  item.quantity == 0
                    ? "#dc3545"
                    : item.quantity <= 5
                    ? "#ff9800"
                    : "#28a745",
                fontWeight: 600,
              }}
            >
              {item.quantity} pcs
            </span>
          </div>
        </div>
      </div>
    ))
  )}
</div>

        {/* PAGINATION (optional UI placeholder) */}
        <div style={{ marginTop: 25, textAlign: "center" }}>
          <span style={{ fontWeight: 600, color: "#001f3f" }}>
            {/* optional pagination logic later */}
          </span>
        </div>

      </div>

      {/* MODAL */}
{modalOpen && (
  <div
    style={{
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.4)",
      display: modalOpen ? "flex" : "none", // 👈 ADD THIS
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 999,
    }}
  >
    <div
      style={{
        background: "white",
        padding: "25px",
        borderRadius: "12px",
        width: "750px",
        display: "flex",
        gap: "25px",
        position: "relative",
        boxShadow: "0 5px 15px rgba(0, 0, 0, .2)",
        }}
    >
      {/* CLOSE BUTTON */}
      <span
        onClick={() => setModalOpen(false)}
        style={{
          position: "absolute",
          top: 10,
          right: 15,
          fontSize: 22,
          fontWeight: "bold",
          cursor: "pointer",
          color: "#001f3f",
        }}
      >
        ×
      </span>

      {/* IMAGE SECTION */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div
         style={{
            width: "100%",
            height: "250px",
            border: "2px dashed #00A6FF",
            borderRadius: "10px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: "15px",
            marginTop: "40px",
            overflow: "hidden",
            textAlign: "center",
            color: "#001f3f"
        }}

        >
          {preview ? (
            <img
              src={preview}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            "No image selected"
          )}
        </div>

        <input
            type="file"
            id="imageInput"
            onChange={handleImage}
            style={{ display: "none" }}
            />

            <label
            htmlFor="imageInput"
            style={{
                background: "#001f3f",
                color: "white",
                padding: "10px 20px",
                borderRadius: "8px",
                fontWeight: 600,
                cursor: "pointer"
            }}
            >
            Choose Image
        </label>
      </div>

      {/* FORM SECTION */}
      <div style={{ flex: 1.2 }}>
        <h2 style={{ textAlign: "center", color: "#001f3f", marginBottom: "10px" }}>
          {mode === "add" ? "Add New Item" : "Edit Item"}
        </h2>

        <label style={{ fontWeight: 600 }}>Product Name</label>
            <input
            value={form.product_name}
            onChange={(e) =>
                setForm({ ...form, product_name: e.target.value })
            }
            style={inputStyle}
            />

        <select
          value={form.category}
          onChange={(e) =>
            setForm({ ...form, category: e.target.value })
          }
          style={inputStyle}
        >
          <option value="all">All Categories</option>
            <option value="IC">IC</option>
            <option value="MOSFETS">MOSFETS</option>
            <option value="Capacitor">Capacitor</option>
            <option value="Diode">Diode</option>
            <option value="Faders">Faders</option>
            <option value="Potentiometer">Potentiometer</option>
            <option value="Transistor">Transistor</option>
            <option value="Thermistor">Thermistor</option>
            <option value="TRIAC">TRIAC</option>
            <option value="Toroidal Transformer">Toroidal Transformer</option>
            <option value="Audio Equipments">Audio Equipments</option>
            <option value="Electronic Components">Electronic Components</option>
            <option value="Heatsink">Heatsink</option>
            <option value="Panel Meter">Panel Meter</option>
            <option value="Radio Equipments">Radio Equipments</option>
        </select>

        <label style={{ fontWeight: 600 }}>Quantity</label>
            <input
            type="number"
            value={form.quantity}
            onChange={(e) =>
                setForm({ ...form, quantity: e.target.value })
            }
            style={inputStyle}
            />

        <label style={{ fontWeight: 600 }}>Price (₱)</label>
        <input
        value={form.price}
        onChange={(e) =>
            setForm({ ...form, price: e.target.value })
        }
        style={inputStyle}
        />

        <button
          onClick={handleSubmit}
          style={{
            width: "100%",
            padding: "12px",
            background: "#001f3f",
            color: "white",
            border: "none",
            borderRadius: "10px",
            fontWeight: "600",
            cursor: "pointer",
          }}
        >
          {mode === "add" ? "Save Item" : "Update Item"}
        </button>

        {mode === "edit" && (
          <button
            onClick={() => handleDelete(form.id)}
            style={{
              width: "100%",
              padding: "12px",
              marginTop: "10px",
              background: "#FF4D4D",
              color: "white",
              border: "none",
              borderRadius: "10px",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            Delete Item
          </button>
        )}
      </div>
    </div>
  </div>
)}

    </div>
  </div>
);

/* small helper component */
function Legend({ color, label }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div style={{ width: 20, height: 20, borderRadius: 4, background: color }} />
      {label}
    </div>
  );
}

}

export default AdminInventory;