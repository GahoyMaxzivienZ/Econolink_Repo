import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import "./Sidebar.css";

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
                className={isActive("/employee") ? "active" : ""}
                onClick={() => navigate("/employee")}
              >
                <img src="/dashboard.png" className="icon" />
                Dashboard
              </div>
            </li>

            <li>
              <div
                className={isActive("/employee_inventory") ? "active" : ""}
                onClick={() => navigate("/employee_inventory")}
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