import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import "./Sidebar.css"; // IMPORTANT

function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);

  const isActive = (path) => location.pathname === path;

  const logout = () => {
    fetch("http://localhost/project/backend/logout.php", {
      credentials: "include",
    }).then(() => {
      navigate("/");
    });
  };

  return (
    <>
      <div className="sidebar">
        <div>
          <div className="logo">
            <img
              src="/logo.png"
              alt="EconoLink Logo"
              className="logo-img"
            />
            EconoLink
          </div>

          <ul className="menu">
            <li>
              <div
                className={isActive("/admin") ? "active" : ""}
                onClick={() => navigate("/admin")}
              >
                <img src="/dashboard.png" className="icon" />
                Dashboard
              </div>
            </li>

            <li>
              <div
                className={isActive("/inventory") ? "active" : ""}
                onClick={() => navigate("/inventory")}
              >
                <img src="/inventory.png" className="icon" />
                Inventory
              </div>
            </li>

            <li>
              <div
                className={isActive("/pos") ? "active" : ""}
                onClick={() => navigate("/pos")}
              >
                <img src="/pos.png" className="icon" />
                Point of Sale
              </div>
            </li>

            <li>
              <div
                className={isActive("/employees") ? "active" : ""}
                onClick={() => navigate("/employees")}
              >
                <img src="/employee.png" className="icon" />
                Employees
              </div>
            </li>


            <li>
              <div
                className={isActive("/reports") ? "active" : ""}
                onClick={() => navigate("/reports")}
              >
                <img src="/reports.png" className="icon" />
                Reports
              </div>
            </li>

            <li>
              <div onClick={() => setShowPopup(true)}>
                <img src="/logout.png" className="icon" />
                Logout
              </div>
            </li>
          </ul>
        </div>
      </div>

      {/* LOGOUT POPUP */}
      {showPopup && (
        <div className="overlay">
          <div className="popup">
            <h3>Are you sure you want to log out?</h3>
            <div className="buttons">
              <button
                className="cancel"
                onClick={() => setShowPopup(false)}
              >
                Cancel
              </button>
              <button className="confirm" onClick={logout}>
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Sidebar;