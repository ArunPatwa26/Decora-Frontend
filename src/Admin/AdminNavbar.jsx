import React, { useState, useEffect } from "react";
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
  FaBars,
  FaTimes,
} from "react-icons/fa";

const AdminNavbar = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const handleLogout = () => {
    localStorage.removeItem("dtoken");
    localStorage.removeItem("adminData");
    navigate("/admin-login");
  };

  const adminName =
    JSON.parse(localStorage.getItem("adminData"))?.name || "Admin";

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    
    // Initialize based on current screen size
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={toggleMenu}
        className="md:hidden fixed top-4 left-4 z-50 bg-indigo-700 text-white p-2 rounded-lg shadow-lg"
      >
        {isOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
      </button>

      {/* Navbar */}
      <div
        className={`bg-gradient-to-b from-indigo-700 to-indigo-900 w-64 p-6 text-white min-h-screen flex flex-col fixed left-0 top-0 h-full shadow-xl z-40 transition-all duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
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
              onClick={() => {
                navigate("/admin-dashboard");
                if (isMobile) setIsOpen(false);
              }}
              active={window.location.pathname === "/admin-dashboard"}
            />
            <NavItem
              icon={<FaUsers />}
              text="Manage Users"
              onClick={() => {
                navigate("/manage-users");
                if (isMobile) setIsOpen(false);
              }}
              active={window.location.pathname === "/manage-users"}
            />
            <NavItem
              icon={<FaBox />}
              text="Manage Products"
              onClick={() => {
                navigate("/manage-products");
                if (isMobile) setIsOpen(false);
              }}
              active={window.location.pathname === "/manage-products"}
            />
            <NavItem
              icon={<FaShoppingCart />}
              text="Manage Orders"
              onClick={() => {
                navigate("/manage-orders");
                if (isMobile) setIsOpen(false);
              }}
              active={window.location.pathname === "/manage-orders"}
            />
            <NavItem
              icon={<FaCog />}
              text="Profile"
              onClick={() => {
                navigate("/admin-profile");
                if (isMobile) setIsOpen(false);
              }}
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

      {/* Overlay for mobile */}
      {isOpen && isMobile && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={toggleMenu}
        ></div>
      )}
    </>
  );
};

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
        <FaChevronRight
          className={`text-xs opacity-70 ${active ? "text-indigo-800" : ""}`}
        />
      </button>
    </li>
  );
};

export default AdminNavbar;