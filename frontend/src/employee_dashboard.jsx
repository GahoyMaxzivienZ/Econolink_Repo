import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Chart from "chart.js/auto";
import Sidebar from "./Sidebar_employee";

function EmployeeDashboard() {
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
    fetch("http://localhost/project/backend/employee_dashboard.php", {
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
      <div style={{ flex: 1 }}>
        <div style={styles.body}>

          {/* HEADER */}
          <div style={styles.header}>
            <img
                src={
                  user.profile_image
                    ? `http://localhost/project/backend/${user.profile_image}`
                    : "https://via.placeholder.com/80"
                }
                alt="profile"
                style={styles.profile}
                />

            <div>
              <h2 style={{ color: "white" }}>
                Welcome back, {user.name ?? "Employee"}
              </h2>
              <p style={{ color: "white" }}>Employee Dashboard</p>
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

  header: {
    background: "#001f3f",
    padding: "20px",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    gap: "15px",
    marginBottom: "20px",
  },

  profile: {
    width: "120px",
    height: "120px",
    borderRadius: "50%",
    border: "2px solid white",
  },

  cards: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "15px",
    marginBottom: "20px",
  },

  card: {
    background: "white",
    padding: "15px",
    borderRadius: "10px",
    border: "2px solid #001f3f",
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

  table: {
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

table: {
  width: "100%",
  borderCollapse: "collapse",
  textAlign: "left",
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

export default EmployeeDashboard;