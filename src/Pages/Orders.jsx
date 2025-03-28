import React, { useEffect, useState } from "react";
import axios from "axios";
import { FiSearch, FiCalendar, FiPackage, FiTruck, FiCheckCircle, FiXCircle, FiFilter } from "react-icons/fi";
import { FaRupeeSign } from "react-icons/fa";
import { useBackend } from "../context";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
    const { BACKEND_URL } = useBackend();

  useEffect(() => {
    const fetchOrders = async () => {
      const user = JSON.parse(localStorage.getItem("e-user"));
      if (!user || !user._id) {
        setError("User not found. Please log in.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${BACKEND_URL}/api/order/user/${user._id}`);
        const ordersWithProducts = await Promise.all(
          response.data.orders.map(async (order) => {
            const updatedProducts = await Promise.all(
              order.products.map(async (product) => {
                const productResponse = await axios.get(`${BACKEND_URL}}/api/products/${product.cartItem}`);
                return { ...product, productDetails: productResponse.data };
              })
            );
            return { ...order, products: updatedProducts };
          })
        );
        setOrders(ordersWithProducts);
        setFilteredOrders(ordersWithProducts);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  useEffect(() => {
    let result = [...orders];
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(order => 
        order._id.toLowerCase().includes(term) ||
        order.products.some(p => 
          p.productDetails.name.toLowerCase().includes(term) ||
          p.productDetails.category.toLowerCase().includes(term)
        )
      );
    }
    
    // Apply status filter
    if (statusFilter !== "all") {
      result = result.filter(order => order.status === statusFilter);
    }
    
    // Apply date filter
    if (dateFilter !== "all") {
      const now = new Date();
      result = result.filter(order => {
        const orderDate = new Date(order.createdAt);
        
        switch (dateFilter) {
          case "today":
            return orderDate.toDateString() === now.toDateString();
          case "week":
            const oneWeekAgo = new Date(now.setDate(now.getDate() - 7));
            return orderDate >= oneWeekAgo;
          case "month":
            const oneMonthAgo = new Date(now.setMonth(now.getMonth() - 1));
            return orderDate >= oneMonthAgo;
          case "year":
            const oneYearAgo = new Date(now.setFullYear(now.getFullYear() - 1));
            return orderDate >= oneYearAgo;
          default:
            return true;
        }
      });
    }
    
    setFilteredOrders(result);
  }, [searchTerm, statusFilter, dateFilter, orders]);

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;
    try {
      await axios.delete(`${BACKEND_URL}/api/order/${orderId}`);
      setOrders(orders.filter(order => order._id !== orderId));
    } catch (err) {
      alert("Failed to cancel order. Try again later.");
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Processing":
        return <FiPackage className="mr-1 text-blue-500" />;
      case "Shipped":
        return <FiTruck className="mr-1 text-yellow-500" />;
      case "Delivered":
        return <FiCheckCircle className="mr-1 text-green-500" />;
      case "Cancelled":
        return <FiXCircle className="mr-1 text-red-500" />;
      default:
        return <FiPackage className="mr-1 text-gray-500" />;
    }
  };

  const getDeliveryDate = (createdAt) => {
    const orderDate = new Date(createdAt);
    orderDate.setDate(orderDate.getDate() + 7);
    return orderDate.toLocaleDateString("en-US", {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const getOrderDate = (createdAt) => {
    return new Date(createdAt).toLocaleDateString("en-US", {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 max-w-md">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4 md:mb-0">Your Orders</h1>
          
          {/* Search and Filter Controls */}
          <div className="w-full md:w-auto space-y-3 md:space-y-0 md:space-x-3 flex flex-col md:flex-row">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search orders..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <FiFilter className="mr-2" /> Filters
            </button>
          </div>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Order Status</label>
              <select
                className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Order Date</label>
              <select
                className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">Last 7 Days</option>
                <option value="month">Last 30 Days</option>
                <option value="year">Last Year</option>
              </select>
            </div>
            
            <div className="flex items-end">
              <button
                onClick={() => {
                  setStatusFilter("all");
                  setDateFilter("all");
                  setSearchTerm("");
                }}
                className="w-full bg-gray-200 text-gray-800 py-2 rounded-md hover:bg-gray-300 transition"
              >
                Reset Filters
              </button>
            </div>
          </div>
        )}

        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
            <p className="text-gray-500">Try adjusting your filters or search query</p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => (
              <div key={order._id} className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
                {/* Order Header */}
                <div className="p-6 border-b">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div className="mb-4 md:mb-0">
                      <h3 className="text-lg font-semibold text-gray-900">Order #{order._id.slice(-8).toUpperCase()}</h3>
                      <div className="flex items-center mt-1">
                        <FiCalendar className="text-gray-500 mr-1" />
                        <span className="text-sm text-gray-500">Ordered on {getOrderDate(order.createdAt)}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <div className="flex items-center mr-6">
                        {getStatusIcon(order.status)}
                        <span className={`font-medium ${
                          order.status === "Delivered" ? "text-green-600" :
                          order.status === "Cancelled" ? "text-red-600" :
                          order.status === "Shipped" ? "text-yellow-600" :
                          "text-blue-600"
                        }`}>
                          {order.status}
                        </span>
                      </div>
                      
                      <div className="flex items-center">
                        <FaRupeeSign className="text-gray-500 mr-1" />
                        <span className="font-bold text-gray-900">{order.total_price.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Order Details */}
                <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Products */}
                  <div className="lg:col-span-2">
                    <h4 className="text-md font-medium text-gray-900 mb-4">Products</h4>
                    <div className="space-y-4">
                      {order.products.map((product, index) => (
                        <div key={index} className="flex items-start border-b border-gray-100 pb-4">
                          <img 
                            src={product.productDetails.imageUrl} 
                            alt={product.productDetails.name} 
                            className="w-16 h-16 object-cover rounded-md border mr-4"
                          />
                          <div className="flex-1">
                            <h5 className="font-medium text-gray-900">{product.productDetails.name}</h5>
                            <p className="text-sm text-gray-500 capitalize">{product.productDetails.category}</p>
                            <div className="flex items-center mt-1">
                              <span className="text-sm text-gray-700 mr-4">Qty: {product.quantity}</span>
                              <span className="text-sm font-medium">
                                <FaRupeeSign className="inline mr-1" />
                                {(product.productDetails.price * product.quantity).toFixed(2)}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Order Summary */}
                  <div>
                    <h4 className="text-md font-medium text-gray-900 mb-4">Order Summary</h4>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Subtotal</span>
                          <span className="font-medium">
                            <FaRupeeSign className="inline mr-1" />
                            {order.total_price.toFixed(2)}
                          </span>
                        </div>
                        
                        <div className="flex justify-between">
                          <span className="text-gray-600">Shipping</span>
                          <span className="font-medium text-green-600">FREE</span>
                        </div>
                        
                        <div className="flex justify-between border-t border-gray-200 pt-3">
                          <span className="text-gray-900 font-bold">Total</span>
                          <span className="font-bold text-blue-600">
                            <FaRupeeSign className="inline mr-1" />
                            {order.total_price.toFixed(2)}
                          </span>
                        </div>
                      </div>
                      
                      <div className="mt-6">
                        <h5 className="text-sm font-medium text-gray-900 mb-2">Payment</h5>
                        <p className="text-sm text-gray-600">
                          {order.payment_method} • {order.payment_status}
                        </p>
                      </div>
                      
                      <div className="mt-6">
                        <h5 className="text-sm font-medium text-gray-900 mb-2">Delivery Address</h5>
                        <p className="text-sm text-gray-600">
                          {order.address.street},<br />
                          {order.address.city}, {order.address.state}<br />
                          {order.address.pincode}
                        </p>
                      </div>
                      
                      <div className="mt-6">
                        <h5 className="text-sm font-medium text-gray-900 mb-1">Expected Delivery</h5>
                        <p className="text-sm text-gray-600 flex items-center">
                          <FiTruck className="mr-2" /> {getDeliveryDate(order.createdAt)}
                        </p>
                      </div>
                    </div>
                    
                    {order.status !== "Delivered" && order.status !== "Cancelled" && (
                      <button
                        onClick={() => handleCancelOrder(order._id)}
                        className="w-full mt-4 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition font-medium"
                      >
                        Cancel Order
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;