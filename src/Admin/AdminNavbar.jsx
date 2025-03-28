import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FaTachometerAlt,
  FaUsers,
  FaBox,
  FaShoppingCart,
  FaSignOutAlt,
  FaUserCircle,
  FaChevronRight,
  FaCog,
} from "react-icons/fa";

const AdminNavbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("dtoken");
    localStorage.removeItem("adminData");
    navigate("/admin-login");
  };

  const adminName =
    JSON.parse(localStorage.getItem("adminData"))?.name || "Admin";

  return (
    <div className="bg-gradient-to-b from-indigo-700 to-indigo-900 w-64 p-6 text-white min-h-screen flex flex-col fixed left-0 top-0 h-full shadow-xl z-50">
      {/* Admin Panel Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-center mb-2 text-white">
          Admin Panel
        </h2>
        <div className="h-1 bg-indigo-400 rounded-full w-3/4 mx-auto"></div>
      </div>

      {/* Admin Profile */}
      <div className="flex items-center mb-8 p-4 bg-indigo-800 rounded-xl shadow">
        <div className="relative">
          <FaUserCircle className="text-4xl text-indigo-200" />
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-indigo-800"></span>
        </div>
        <div className="ml-4">
          <p className="font-medium text-white">{adminName}</p>
          <p className="text-xs text-indigo-200">Administrator</p>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1">
        <ul className="space-y-2">
          <NavItem
            icon={<FaTachometerAlt />}
            text="Dashboard"
            onClick={() => navigate("/admin-dashboard")}
            active={window.location.pathname === "/admin-dashboard"}
          />
          <NavItem
            icon={<FaUsers />}
            text="Manage Users"
            onClick={() => navigate("/manage-users")}
            active={window.location.pathname === "/manage-users"}
          />
          <NavItem
            icon={<FaBox />}
            text="Manage Products"
            onClick={() => navigate("/manage-products")}
            active={window.location.pathname === "/manage-products"}
          />
          <NavItem
            icon={<FaShoppingCart />}
            text="Manage Orders"
            onClick={() => navigate("/manage-orders")}
            active={window.location.pathname === "/manage-orders"}
          />
          <NavItem
            icon={<FaCog />}
            text="Settings"
            onClick={() => navigate("/admin-profile")}
            active={window.location.pathname === "/admin-settings"}
          />
        </ul>
      </nav>

      {/* Logout Button */}
      <div className="mt-auto">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-between p-3 text-indigo-100 hover:text-white hover:bg-indigo-800 rounded-lg transition-all duration-200"
        >
          <div className="flex items-center">
            <FaSignOutAlt className="mr-3" />
            <span>Logout</span>
          </div>
          <FaChevronRight className="text-xs opacity-70" />
        </button>
      </div>
    </div>
  );
};

// Reusable NavItem component
const NavItem = ({ icon, text, onClick, active = false }) => {
  return (
    <li>
      <button
        onClick={onClick}
        className={`w-full flex items-center justify-between p-3 rounded-lg transition-all duration-200 ${
          active
            ? "bg-white text-indigo-800 shadow-md font-medium"
            : "text-indigo-100 hover:text-white hover:bg-indigo-800"
        }`}
      >
        <div className="flex items-center">
          <span className="mr-3">{icon}</span>
          <span>{text}</span>
        </div>
        <FaChevronRight className={`text-xs opacity-70 ${active ? "text-indigo-800" : ""}`} />
      </button>
    </li>
  );
};

export default AdminNavbar;
