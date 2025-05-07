import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ShoppingCart, ChevronDown, Search, Menu, X } from "lucide-react";
import { useBackend } from "../context";
import axios from "axios";

const Navbar = () => {
  const { BACKEND_URL } = useBackend();
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("e-user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); // Detects route change

  // Watch localStorage changes across tabs
  useEffect(() => {
    const handleStorageChange = () => {
      const storedUser = localStorage.getItem("e-user");
      setUser(storedUser ? JSON.parse(storedUser) : null);
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Re-read user on route changes (covers in-app navigation)
  useEffect(() => {
    const storedUser = localStorage.getItem("e-user");
    setUser(storedUser ? JSON.parse(storedUser) : null);
  }, [location]);

  // Fetch cart count on user change and poll every 5s
  useEffect(() => {
    if (!user?._id) return;

    const fetchAndSetCount = () => fetchCartCount(user._id);
    fetchAndSetCount(); // Initial

    const interval = setInterval(fetchAndSetCount, 5000);
    return () => clearInterval(interval);
  }, [user]);

  const fetchCartCount = async (userId) => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/cart/${userId}`);
      if (typeof response.data?.cartCount === "number") {
        setCartCount((prevCount) =>
          prevCount !== response.data.cartCount ? response.data.cartCount : prevCount
        );
      } else {
        setCartCount(0); // fallback
      }
    } catch (error) {
      console.error("Error fetching cart count:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("e-token");
    localStorage.removeItem("e-user");
    setUser(null);
    setCartCount(0);
    navigate("/login");
  };
  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      {/* Desktop Navbar */}
      <div className="hidden md:block">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Decora
              </span>
            </Link>

            {/* Navigation Links */}
            <div className="flex items-center space-x-8">
              <Link to="/" className="text-gray-700 hover:text-blue-600 transition font-medium">
                Home
              </Link>
              <Link to="/all-products" className="text-gray-700 hover:text-blue-600 transition font-medium">
                Shop
              </Link>
              <Link to="/contact" className="text-gray-700 hover:text-blue-600 transition font-medium">
                Contact
              </Link>
              <Link to="/about" className="text-gray-700 hover:text-blue-600 transition font-medium">
                About
              </Link>
            </div>

            {/* Right Side */}
            <div className="flex items-center space-x-6">
              {/* Search Button (Desktop) */}
              <button 
                onClick={() => navigate('/search')}
                className="text-gray-600 hover:text-blue-600 transition"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Cart */}
              <Link to="/cart" className="relative">
                <ShoppingCart className="w-5 h-5 text-gray-600 hover:text-blue-600 transition" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* User Profile or Auth Buttons */}
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center space-x-1 focus:outline-none"
                  >
                    <img
                      src={user.profilePicture || "https://via.placeholder.com/40"}
                      alt="Profile"
                      className="w-8 h-8 rounded-full object-cover border border-gray-200"
                    />
                    <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-100">
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        My Profile
                      </Link>
                      <Link
                        to="/orders"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        My Orders
                      </Link>
                      <Link
                        to="/wishlist"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        Wishlist
                      </Link>
                      <div className="border-t border-gray-100 my-1"></div>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                      >
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex space-x-3">
                  <Link
                    to="/login"
                    className="px-3 py-1.5 text-sm font-medium text-gray-700 hover:text-blue-600 transition"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Search Bar (Desktop) */}
        {searchOpen && (
          <div className="bg-gray-50 py-3 border-t">
            <div className="container mx-auto px-4">
              <div className="relative max-w-xl mx-auto" >
                <input
                  type="text"
                  placeholder="Search for products, brands, and more..."
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Navbar */}
      <div className="md:hidden">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-700 focus:outline-none"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>

            {/* Logo */}
            <Link to="/" className="flex items-center">
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Decora
              </span>
            </Link>

            {/* Cart Icon */}
            <div className="flex items-center space-x-4">
            <button
                   
                    className="flex items-center space-x-1 focus:outline-none gap-2"
                  >
                     <Link
                        to="/profile">

                    <img
                      src={user.profilePicture || "https://via.placeholder.com/40"}
                      alt="Profile"
                      className="w-8 h-8 rounded-full object-cover border border-gray-200"
                      />
                      </Link>

          
                  </button>

              <Link to="/cart" className="relative">
                <ShoppingCart className="w-5 h-5 text-gray-600" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="bg-white border-t">
            <div className="container mx-auto px-4 py-2">
              {/* Search Bar */}
              <div className="relative mb-4" onClick={() => navigate('/search')}>
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>

              {/* Navigation Links */}
              <div className="flex flex-col space-y-2">
                <Link
                  to="/"
                  className="px-3 py-2 text-gray-700 rounded-md hover:bg-gray-50"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Home
                </Link>
                <Link
                  to="/all-products"
                  className="px-3 py-2 text-gray-700 rounded-md hover:bg-gray-50"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Shop
                </Link>
                <Link
                  to="/contact"
                  className="px-3 py-2 text-gray-700 rounded-md hover:bg-gray-50"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Contact
                </Link>
                <Link
                  to="/about"
                  className="px-3 py-2 text-gray-700 rounded-md hover:bg-gray-50"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  About
                </Link>
              </div>

              {/* Auth Buttons */}
              <div className="mt-4 pt-4 border-t">
                {user ? (
                  <>
                    <Link
                      to="/profile"
                      className="block px-3 py-2 text-gray-700 rounded-md hover:bg-gray-50"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      My Profile
                    </Link>
                    <Link
                      to="/orders"
                      className="block px-3 py-2 text-gray-700 rounded-md hover:bg-gray-50"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      My Orders
                    </Link>
                    <Link
                      to="/wishlist"
                      className="block px-3 py-2 text-gray-700 rounded-md hover:bg-gray-50"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      My Wishlist
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setMobileMenuOpen(false);
                      }}
                      className="block w-full text-left px-3 py-2 text-red-600 rounded-md hover:bg-gray-50"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <div className="flex space-x-2">
                    <Link
                      to="/login"
                      className="flex-1 text-center px-3 py-2 text-gray-700 rounded-md hover:bg-gray-50"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Login
                    </Link>
                    <Link
                      to="/signup"
                      className="flex-1 text-center px-3 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;