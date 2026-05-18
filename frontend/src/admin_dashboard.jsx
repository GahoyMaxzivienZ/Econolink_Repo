import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Chart from "chart.js/auto";
import Sidebar from "./Sidebar";

function AdminDashboard() {
  const [user, setUser] = useState({});
  const [stats, setStats] = useState({});
  const [charts, setCharts] = useState({});
  const [recent, setRecent] = useState([]);

  const navigate = useNavigate();
  const topChartRef = useRef(null);
  const inventoryChartRef = useRef(null);
  // =========================
  // FETCH DATA
  // =========================
  useEffect(() => {
    fetch("http://localhost/project/backend/admin_dashboard.php", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          navigate("/");
          return;
        }

        setUser(data.user || {});
        setStats(data.stats || {});
        setCharts(data.charts || {});
        setRecent(data.recent_transactions || []);
      })
      .catch((err) => console.log(err));
  }, [navigate]);

  // =========================
  // CHARTS
  // =========================
useEffect(() => {
  if (!charts?.top_products || !charts?.top_quantities) return;

  const ctx1 = document.getElementById("topProductsChart");
  const ctx2 = document.getElementById("inventoryChart");

  if (!ctx1 || !ctx2) return;

  // SAFE destroy (Chart.js v4 fix)
  if (topChartRef.current instanceof Chart) {
    topChartRef.current.destroy();
  }

  if (inventoryChartRef.current instanceof Chart) {
    inventoryChartRef.current.destroy();
  }

  // CREATE BAR CHART
  topChartRef.current = new Chart(ctx1, {
    type: "bar",
    data: {
      labels: charts.top_products,
      datasets: [
        {
          label: "Top Products",
          data: charts.top_quantities,
          backgroundColor: ["#001f3f", "#007FFF", "#FF5733"],
        },
      ],
    },
    options: {
      responsive: true,
    },
  });

  // CREATE DOUGHNUT CHART
  inventoryChartRef.current = new Chart(ctx2, {
    type: "doughnut",
    data: {
      labels: ["No Stock", "Low Stock", "In Stock"],
      datasets: [
        {
          data: [
            charts.inventory_status?.no_stock || 0,
            charts.inventory_status?.low_stock || 0,
            charts.inventory_status?.in_stock || 0,
          ],
          backgroundColor: ["#e74c3c", "#f39c12", "#2ecc71"],
        },
      ],
    },
    options: {
      cutout: "65%",
    },
  });

  // CLEANUP (IMPORTANT)
  return () => {
    if (topChartRef.current instanceof Chart) {
      topChartRef.current.destroy();
    }
    if (inventoryChartRef.current instanceof Chart) {
      inventoryChartRef.current.destroy();
    }
  };
}, [charts]);
  return (
    <div style={{ display: "flex" }}>

      {/* SIDEBAR */}
      <Sidebar />

      {/* MAIN CONTENT */}
      <div style={{ flex: 1, marginLeft: "250px" }}>
        <div style={styles.body}>

{/* TOPBAR */}
<div style={styles.topbar}>

  {/* LEFT SIDE */}
  <div>
    <h1 style={styles.dashboardTitle}>
      Admin Dashboard
    </h1>

    <p style={styles.dashboardSubtitle}>
      Manage your sales and inventory system
    </p>
  </div>

  {/* RIGHT SIDE */}
  <div style={styles.userCard}>

    {/* IMAGE NASA KALIWA */}
    <img
      src={
        user.profile_image
          ? `${process.env.PUBLIC_URL}/${user.profile_image}`
          : "https://via.placeholder.com/80"
      }
      alt="profile"
      style={styles.smallProfile}
    />

    <div>
      <h3 style={styles.userName}>
        {user.name || "Admin"}
      </h3>

      <p style={styles.userRole}>
        Administrator
      </p>
    </div>

  </div>

</div>

          {/* CARDS */}
          <div style={styles.cards}>
            <div style={styles.card}>
              <h3 style={styles.cardTitle}>Sales Today</h3>
              <p style={styles.cardValue}>₱{stats.sales_today || 0}</p>
            </div>

            <div style={styles.card}>
              <h3 style={styles.cardTitle}>Transactions</h3>
              <p style={styles.cardValue}>{stats.transactions_today || 0}</p>
            </div>

            <div style={styles.card}>
              <h3 style={styles.cardTitle}>Inventory</h3>
              <p style={styles.cardValue}>{stats.inventory || 0}</p>
            </div>

            <div style={styles.card}>
              <h3 style={styles.cardTitle}>Low Stock</h3>
              <p style={styles.cardValue}>{stats.low_stock || 0}</p>
            </div>
          </div>
          {/* GRAPHS */}
          <div style={styles.graphs}>
            <div style={styles.graphCard}>
              <h3>Top Products</h3>
              <canvas id="topProductsChart"></canvas>
            </div>

            <div style={styles.graphCard}>
              <h3>Inventory Status</h3>
              <canvas id="inventoryChart"></canvas>
            </div>
          </div>

          {/* TABLE */}
          <div style={styles.tableSection}>
            <h3>Recent Transactions</h3>

            <table style={styles.table}>
            <thead>
                <tr>
                <th style={styles.th}>Receipt</th>
                <th style={styles.th}>Total</th>
                <th style={styles.th}>Date</th>
                </tr>
            </thead>

            <tbody>
                {recent.length === 0 ? (
                <tr>
                    <td colSpan="3" style={styles.td}>No transactions</td>
                </tr>
                ) : (
                recent.map((item, i) => (
                    <tr key={i}>
                    <td style={styles.td}>#{item.receipt_id}</td>
                    <td style={styles.td}>₱{Number(item.total).toLocaleString()}</td>
                    <td style={styles.td}>{item.formatted_date}</td>
                    </tr>
                ))
                )}
            </tbody>
            </table>
          </div>

        </div>
      </div>
    </div>
  );
}
/* =========================
   STYLES
========================= */
const styles = {
  body: {
    fontFamily: "Poppins, sans-serif",
    background: "#f4f9ff",
    minHeight: "100vh",
    padding: "20px",
  },

topbar: {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "25px",
},

dashboardTitle: {
  fontSize: "34px",
  fontWeight: "700",
  color: "#001f3f",
  margin: 0,
},

dashboardSubtitle: {
  color: "#666",
  marginTop: "5px",
},

userCard: {
  background: "#001f3f",
  padding: "12px 18px",
  borderRadius: "15px",
  display: "flex",
  alignItems: "center",
  gap: "15px",
  border: "5px solid #cecece",
  boxShadow: "0 5px 15px rgba(0,0,0,0.08)",
},

smallProfile: {
  width: "55px",
  height: "55px",
  borderRadius: "50%",
  objectFit: "cover",
  border: "2px solid #001f3f",
},

userName: {
  margin: 0,
  color: "#ffffff",
  fontSize: "16px",
},

userRole: {
  margin: 0,
  color: "#ffffff",
  fontSize: "13px",
},

  cards: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "15px",
    marginBottom: "10px",
    marginTop: "-10px",
  },

card: {
  background: "white",
  padding: "8px",
  borderRadius: "10px",
  border: "2px solid #001f3f",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  gap: "4px",
  minHeight: "80px",
},
cardTitle: {
  margin: 0,
  fontSize: "12px",
  fontWeight: "600",
  color: "#666",
  lineHeight: "1.2",
},

cardValue: {
  margin: 0,
  fontSize: "20px",
  fontWeight: "700",
  color: "#001f3f",
  lineHeight: "1.2",
},
  graphs: {
    display: "grid",
    gridTemplateColumns: "2fr 1fr",
    gap: "20px",
    marginBottom: "20px",
  },

  graphCard: {
    background: "white",
    padding: "15px",
    borderRadius: "12px",
    border: "2px solid #001f3f",
  },


  tableSection: {
  background: "white",
  borderRadius: "16px",
  padding: "25px",
  border: "2px solid #001f3f",
  boxShadow: "0 5px 15px rgba(0, 127, 255, 0.1)",
},

 sidebar: {
  position: 'sticky',
  top: 0,
  left: 0,
  height: '100vh',
},

table: {
  width: "100%",
  borderCollapse: "collapse",
  textAlign: "left",
  background: "white",
  padding: "15px",
  borderRadius: "12px",
  border: "2px solid #001f3f",
},

th: {
  padding: "12px 10px",
  border: "2px solid #001f3f",
  background: "#f5f8ff",
  color: "#001f3f",
},

td: {
  padding: "12px 10px",
  border: "2px solid #001f3f",
},

rowHover: {
  cursor: "pointer",
},

modalOverlay: {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.4)",
  display: "flex",
  justifyContent: "center",
  alignItems: "flex-start",
  paddingTop: "60px",
  zIndex: 999,
},

modal: {
  background: "white",
  padding: "30px",
  borderRadius: "12px",
  width: "900px",
  border: "2px solid #001f3f",
  animation: "popupScale 0.3s ease",
},
};

export default AdminDashboard;