import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import "./reports.css";
import Chart from "react-apexcharts";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend
);
const API = "http://localhost/Project/backend/api_reports.php";

export default function Reports() {
  const [stats, setStats] = useState({});
  const [charts, setCharts] = useState({});
  const [sales, setSales] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [lowStock, setLowStock] = useState([]);
  const [activeTable, setActiveTable] = useState("sales");
  const [search, setSearch] = useState("");
  const fetchReports = async () => {
    const res = await fetch(API, {
  credentials: "include",
});
    const data = await res.json();

    setStats(data.stats || {});
    setSales(data.sales || []);
    setCharts(data.charts || {});
    setTransactions(data.transactions || []);
    
    setLowStock(data.inventory || []);

   
  };

  useEffect(() => {
    fetchReports();
  }, []);
const value = search.toLowerCase();

const filteredSales = sales.filter((row) =>
  row.receipt_id?.toString().includes(value) ||
  row.product_name?.toLowerCase().includes(value) ||
  row.cashier?.toLowerCase().includes(value) ||
  row.date_sold?.toLowerCase().includes(value)
);

const filteredTransactions = transactions.filter((row) =>
  row.receipt_id?.toString().includes(value) ||
  row.date_created?.toLowerCase().includes(value) ||
  row.cashier_id?.toString().includes(value)
);

const filteredInventory = lowStock.filter((row) =>
  row.product_name?.toLowerCase().includes(value) ||
  row.category?.toLowerCase().includes(value)
);

const tableData =
  activeTable === "sales"
    ? filteredSales
    : activeTable === "transactions"
    ? filteredTransactions
    : activeTable === "inventory"
    ? filteredInventory
    : [];



  /* =========================
     PRINT FUNCTION
  ========================= */
  const printTable = (title, data, headers) => {
    const win = window.open("", "", "width=900,height=700");

    let rows = "";

    data.forEach((row) => {
      rows += "<tr>";
      headers.forEach((h) => {
        rows += `<td>${row[h] ?? ""}</td>`;
      });
      rows += "</tr>";
    });

    win.document.write(`
      <html>
      <head>
        <title>${title}</title>
        <style>
          body { font-family: Arial; padding: 20px; }
          table { width: 100%; border-collapse: collapse; }
          th, td { border: 1px solid #333; padding: 8px; }
          th { background: #eee; }
        </style>
      </head>
      <body>
        <h2>${title}</h2>
        <table>
          <thead>
            <tr>
              ${headers.map((h) => `<th>${h}</th>`).join("")}
            </tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
        </table>
      </body>
      </html>
    `);

    win.document.close();
    win.print();
  };
const monthlyChartData = {
  labels: stats?.charts?.monthlyLabels || [],
  datasets: [
    {
      label: "Sales",
      data: (charts?.monthlyData || []).map(Number),
      borderColor: "#001f3f",
      backgroundColor: "rgba(0,31,63,0.2)",
      tension: 0.4,
    },
  ],
};

const categoryChartData = {
  labels: stats?.charts?.categoryNames || [],
  datasets: [
    {
      data: stats?.charts?.categorySales || [],
      backgroundColor: ["#001f3f", "#007FFF", "#FF5733", "#33FF57", "#FFC300"],
    },
  ],
};
if (!stats || Object.keys(stats).length === 0) {
  return (
    <div className="container">
      <Sidebar />
      <div className="main">
        <h2>Loading Reports....</h2>
      </div>
    </div>
  );
}

const tableConfig = {
  sales: {
    headers: ["Receipt", "Product", "Qty", "Price", "Discount", "Total", "Cashier", "Date Sold"],
    rows: (row) => [
      row.receipt_id,
      row.product_name,
      row.quantity,
      row.price,
      row.discount,
      row.total,
      row.cashier,
      row.date_sold,
    ],
  },

  transactions: {
    headers: ["Receipt ID", "Items", "Total Amount", "Date"],
    rows: (row) => [
      row.receipt_id,
      row.item_count,
      row.total_amount,
      row.date_sold,
    ],
  },

  inventory: {
    headers: ["Product", "Category", "Qty", "Price"],
    rows: (row) => [
      row.product_name,
      row.category,
      row.quantity,
      row.price,
    ],
  },
};
return (
   <div className="reports-page">
  <div className="container">
    <Sidebar />

    <div className="main">

      {/* HEADER */}
      <div className="header">
        <div className="header-left">
          <h2>Reports Econolink</h2>
        </div>
      </div>

      {/* CARDS */}
      <div className="cards">
        <div className="card" onClick={() => setActiveTable("sales")}>  
          <h3>Sales This Month</h3>
          <p>₱{Number(stats.sales_month).toLocaleString()}</p>
        </div>

        <div className="card">
          <h3>Total Sales</h3>
          <p>₱{Number(stats.total_sales).toLocaleString()}</p>
        </div>

        <div className="card" onClick={() => setActiveTable("employees")}>
          <h3>Active Employees</h3>
          <p>{stats.active_employees}</p>
        </div>

        <div className="card" onClick={() => setActiveTable("inactive")}>
          <h3>Inactive Employees</h3>
          <p>{stats.inactive_employees}</p>
        </div>

        <div className="card" onClick={() => setActiveTable("lowstock")}>
          <h3>Low Stock Items</h3>
          <p>{stats.low_stock}</p>
        </div>
      </div>

      {/* CHARTS */}
<div className="table-section" style={{ marginBottom: "30px" }}>
  <h3>Monthly Sales Overview</h3>

<Chart
  type="line"
  height={350}
  series={[
    {
      name: "Sales",
      data: charts?.monthlyData || [],
    },
  ]}
  options={{
    chart: {
      type: "line",
      height: 350,
      zoom: { enabled: true },
    },
    xaxis: {
      categories: charts?.monthlyLabels || [],
    },
    stroke: {
      curve: "smooth",
      width: 3,
    },
    markers: {
      size: 5,
    },
    colors: ["#001f3f"],
  }}
/>
</div>
<div className="table-section charts-row">
  
  {/* BAR CHART */}
  <div className="chart-box">
    <h3>Top 3 Sold Items This Month</h3>
    <Chart
      type="bar"
      height={350}
      series={[
        {
          name: "Items Sold",
          data: charts?.topItemQty || [],
        },
      ]}
      options={{
        chart: { type: "bar" },
        xaxis: {
          categories: charts?.topItemNames || [],
        },
        plotOptions: {
          bar: {
            borderRadius: 6,
            columnWidth: "45%",
            distributed: true,
          },
        },
        colors: ["#001f3f", "#007FFF", "#FF5733"],
        dataLabels: { enabled: true },
        tooltip: {
          y: (val, { dataPointIndex }) => {
            const sales = charts?.topItemSales?.[dataPointIndex] || 0;
            return `${val} pcs | ₱${sales.toLocaleString()}`;
          },
        },
      }}
    />
  </div>

  {/* PIE CHART */}
  <div className="chart-box">
    <h3>Sales by Category</h3>
    <Chart
      type="pie"
      height={350}
      series={charts?.categorySales || []}
      options={{
        labels: charts?.categoryNames || [],
        legend: { position: "bottom" },
        colors: [
          "#001f3f",
          "#007FFF",
          "#FF5733",
          "#33FF57",
          "#FFC300",
        ],
      }}
    />
  </div>



</div>
<div className="table-section">

  <div style={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "10px",
    flexWrap: "wrap"
  }}>

    <h3>
  {activeTable === "sales"
    ? "Sales Report"
    : activeTable === "transactions"
    ? "Transactions Report"
    : "Inventory Report"}
</h3>
    
    {/* RIGHT SIDE (SEARCH + PRINT) */}
    <div style={{
      display: "flex",
      gap: "10px",
      alignItems: "center"
    }}>
      <select
  value={activeTable}
  onChange={(e) => setActiveTable(e.target.value)}
  style={{
    padding: "8px",
    borderRadius: "6px",
    border: "1px solid #ccc"
  }}
>
  <option value="sales">Sales</option>
  <option value="transactions">Transactions</option>
  <option value="inventory">Inventory</option>
</select>

      <input
        type="text"
        placeholder="Search sales..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          padding: "8px",
          borderRadius: "6px",
          border: "1px solid #ccc"
        }}
      />

      <button
        className="print-btn"
        onClick={() =>
printTable(
  activeTable === "sales"
    ? "Sales Report"
    : activeTable === "transactions"
    ? "Transactions Report"
    : "Inventory Report",
  tableData,
            [
              "receipt_id",
              "product_name",
              "quantity",
              "price",
              "discount",
              "total",
              "cashier",
              "date_sold"
            ]
          )
        }
      >
        Print
      </button>

    </div>
  </div>

  <div className="scrollable-table">
    <table>

<thead>
  <tr>
    {tableConfig[activeTable]?.headers.map((h, i) => (
      <th key={i}>{h}</th>
    ))}
  </tr>
</thead>

<tbody>
  {tableData.length > 0 ? (
    tableData.map((row, index) => (
      <tr key={index}>
        {tableConfig[activeTable]?.rows(row).map((val, i) => (
          <td key={i}>
            {typeof val === "number" && activeTable !== "lowstock"
              ? `₱${Number(val).toLocaleString()}`
              : val}
          </td>
        ))}
      </tr>
    ))
  ) : (
          <tr>
            <td colSpan="8" style={{ textAlign: "center" }}>
              No results found.
            </td>
          </tr>
        )}
      </tbody>

    </table>
  </div>

</div>
</div>
</div>

  </div>
);
}