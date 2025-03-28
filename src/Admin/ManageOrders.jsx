import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AdminNavbar from "./AdminNavbar";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useBackend } from "../context";

export default function ManageOrders() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { BACKEND_URL } = useBackend();
  
  // Pagination and filters state
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(10);
  const [totalOrders, setTotalOrders] = useState(0);
  const [filters, setFilters] = useState({
    status: "all",
    startDate: null,
    endDate: null,
    search: "",
    searchType: "user"
  });

  // Fetch orders with filters
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const params = {
          page: currentPage,
          limit: ordersPerPage,
          ...filters,
          startDate: filters.startDate ? filters.startDate.toISOString() : null,
          endDate: filters.endDate ? filters.endDate.toISOString() : null
        };

        const response = await axios.get(`${BACKEND_URL}/api/order/orders`, { params });
        
        setOrders(response.data.orders);
        setTotalOrders(response.data.totalOrders);
      } catch (err) {
        setError("Failed to fetch orders");
        toast.error("Error fetching orders");
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrders();
  }, [currentPage, filters, BACKEND_URL, ordersPerPage]);

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
    setCurrentPage(1); // Reset to first page when filters change
  };

  // Handle date filter changes
  const handleDateChange = (date, field) => {
    setFilters(prev => ({
      ...prev,
      [field]: date
    }));
    setCurrentPage(1);
  };

  // Handle order actions (delete, status update, view)
  const handleDelete = async (orderId) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      try {
        await axios.delete(`${BACKEND_URL}/api/order/${orderId}`);
        setOrders(orders.filter(order => order._id !== orderId));
        toast.success("Order deleted successfully!");
      } catch (err) {
        toast.error("Failed to delete order");
      }
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await axios.put(`${BACKEND_URL}/api/order/${orderId}/status`, { status: newStatus });
      setOrders(orders.map(order => 
        order._id === orderId ? { ...order, status: newStatus } : order
      ));
      toast.success("Order status updated successfully!");
    } catch (err) {
      toast.error("Failed to update order status");
    }
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  // Calculate pagination
  const totalPages = Math.ceil(totalOrders / ordersPerPage);

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      <AdminNavbar />
      <main className="flex-1 p-4 sm:p-6 md:p-8 md:ml-64">
        <div className="bg-white rounded-lg shadow-sm md:shadow-md p-4 sm:p-6">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6 ml-8">Manage Orders</h1>
          
          {/* Filters Section */}
          <div className="bg-white rounded-lg shadow-xs md:shadow-sm p-3 sm:p-4 mb-4 sm:mb-6 border border-gray-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {/* Status Filter */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  name="status"
                  value={filters.status}
                  onChange={handleFilterChange}
                  className="w-full p-1 sm:p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-xs sm:text-sm"
                >
                  <option value="all">All Statuses</option>
                  <option value="Pending">Pending</option>
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
              
              {/* Date Range Filter */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Start Date</label>
                <DatePicker
                  selected={filters.startDate}
                  onChange={(date) => handleDateChange(date, 'startDate')}
                  selectsStart
                  startDate={filters.startDate}
                  endDate={filters.endDate}
                  placeholderText="Start date"
                  className="w-full p-1 sm:p-2 border border-gray-300 rounded-md text-xs sm:text-sm"
                />
              </div>
              
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">End Date</label>
                <DatePicker
                  selected={filters.endDate}
                  onChange={(date) => handleDateChange(date, 'endDate')}
                  selectsEnd
                  startDate={filters.startDate}
                  endDate={filters.endDate}
                  minDate={filters.startDate}
                  placeholderText="End date"
                  className="w-full p-1 sm:p-2 border border-gray-300 rounded-md text-xs sm:text-sm"
                />
              </div>
              
              {/* Search */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Search</label>
                <div className="flex">
                  <select
                    name="searchType"
                    value={filters.searchType}
                    onChange={handleFilterChange}
                    className="border border-gray-300 rounded-l-md p-1 sm:p-2 bg-gray-100 text-xs sm:text-sm"
                  >
                    <option value="user">User</option>
                    <option value="product">Product</option>
                    <option value="order">Order ID</option>
                  </select>
                  <input
                    type="text"
                    name="search"
                    value={filters.search}
                    onChange={handleFilterChange}
                    placeholder={`Search by ${filters.searchType}`}
                    className="flex-1 min-w-0 p-1 sm:p-2 border border-gray-300 rounded-r-md focus:ring-blue-500 focus:border-blue-500 text-xs sm:text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          {error && <p className="text-red-500 text-xs sm:text-sm mb-3 sm:mb-4">{error}</p>}

          {/* Orders Table */}
          <div className="overflow-x-auto bg-white rounded-lg border border-gray-200 shadow-xs md:shadow-sm">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 sm:px-4 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                  <th className="px-3 py-2 sm:px-4 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-3 py-2 sm:px-4 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                  <th className="px-3 py-2 sm:px-4 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-3 py-2 sm:px-4 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan="5" className="px-4 py-4 text-center text-xs sm:text-sm text-gray-500">
                      Loading orders...
                    </td>
                  </tr>
                ) : orders.length > 0 ? (
                  orders.map((order) => (
                    <tr key={order._id} className="hover:bg-gray-50">
                      <td className="px-3 py-3 sm:px-4 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900 truncate max-w-[100px] sm:max-w-xs">
                        {order._id}
                      </td>
                      <td className="px-3 py-3 sm:px-4 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900">
                        {order.user_id?.name || 'Unknown User'}
                      </td>
                      <td className="px-3 py-3 sm:px-4 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900">
                        ₹{order.total_price.toFixed(2)}
                      </td>
                      <td className="px-3 py-3 sm:px-4 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900">
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                          className="border border-gray-300 rounded-md p-1 text-xs sm:text-sm focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td className="px-3 py-3 sm:px-4 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleViewOrder(order)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            View
                          </button>
                          <button
                            onClick={() => handleDelete(order._id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-4 py-4 text-center text-xs sm:text-sm text-gray-500">
                      No orders found matching your criteria
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-3 sm:mt-4 px-3 sm:px-4 py-2 sm:py-3 bg-white border-t border-gray-200">
              <div className="flex-1 flex flex-col sm:flex-row items-center justify-between gap-2">
                <div>
                  <p className="text-xs sm:text-sm text-gray-700">
                    Showing <span className="font-medium">{(currentPage - 1) * ordersPerPage + 1}</span> to{' '}
                    <span className="font-medium">{Math.min(currentPage * ordersPerPage, totalOrders)}</span> of{' '}
                    <span className="font-medium">{totalOrders}</span> results
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-2 py-1 sm:px-2 sm:py-2 rounded-l-md border border-gray-300 bg-white text-xs sm:text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    >
                      Previous
                    </button>
                    {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                      let page;
                      if (totalPages <= 5) {
                        page = i + 1;
                      } else if (currentPage <= 3) {
                        page = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        page = totalPages - 4 + i;
                      } else {
                        page = currentPage - 2 + i;
                      }
                      return (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`relative inline-flex items-center px-3 py-1 sm:px-4 sm:py-2 border text-xs sm:text-sm font-medium ${
                            currentPage === page
                              ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                              : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                          }`}
                        >
                          {page}
                        </button>
                      );
                    })}
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="relative inline-flex items-center px-2 py-1 sm:px-2 sm:py-2 rounded-r-md border border-gray-300 bg-white text-xs sm:text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    >
                      Next
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Order Details Modal */}
      {isModalOpen && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-full sm:max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-4 sm:p-6">
              <div className="flex justify-between items-start">
                <h2 className="text-lg sm:text-xl font-bold text-gray-800">Order Details</h2>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <span className="sr-only">Close</span>
                  <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="mt-4 sm:mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-1 sm:mb-2">Order Information</h3>
                  <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm">
                    <p><span className="font-medium">Order ID:</span> {selectedOrder._id}</p>
                    <p><span className="font-medium">Date:</span> {new Date(selectedOrder.createdAt).toLocaleString()}</p>
                    <p>
                      <span className="font-medium">Status:</span> 
                      <span className={`ml-1 sm:ml-2 px-2 py-1 rounded-full text-xs ${
                        selectedOrder.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                        selectedOrder.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {selectedOrder.status}
                      </span>
                    </p>
                  </div>

                  <h3 className="text-base sm:text-lg font-medium text-gray-900 mt-3 sm:mt-4 mb-1 sm:mb-2">Payment Information</h3>
                  <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm">
                    <p><span className="font-medium">Method:</span> {selectedOrder.payment_method}</p>
                    <p>
                      <span className="font-medium">Status:</span> 
                      <span className={`ml-1 sm:ml-2 px-2 py-1 rounded-full text-xs ${
                        selectedOrder.payment_status === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {selectedOrder.payment_status}
                      </span>
                    </p>
                    {selectedOrder.transaction_id && (
                      <p><span className="font-medium">Transaction ID:</span> {selectedOrder.transaction_id}</p>
                    )}
                    <p><span className="font-medium">Total:</span> ₹{selectedOrder.total_price.toFixed(2)}</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-1 sm:mb-2">Customer Information</h3>
                  <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm">
                    <p><span className="font-medium">Name:</span> {selectedOrder.user_id?.name || 'Unknown User'}</p>
                    {selectedOrder.user_id?.email && (
                      <p><span className="font-medium">Email:</span> {selectedOrder.user_id.email}</p>
                    )}
                  </div>

                  <h3 className="text-base sm:text-lg font-medium text-gray-900 mt-3 sm:mt-4 mb-1 sm:mb-2">Shipping Address</h3>
                  <div className="space-y-1 text-xs sm:text-sm">
                    <p>{selectedOrder.address?.street || 'N/A'}</p>
                    <p>{selectedOrder.address?.city || ''}, {selectedOrder.address?.state || ''}</p>
                    <p>{selectedOrder.address?.pincode || ''}</p>
                  </div>
                </div>
              </div>

              <h3 className="text-base sm:text-lg font-medium text-gray-900 mt-4 sm:mt-6 mb-2 sm:mb-3">Order Items</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-2 sm:px-4 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                      <th className="px-3 py-2 sm:px-4 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                      <th className="px-3 py-2 sm:px-4 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Qty</th>
                      <th className="px-3 py-2 sm:px-4 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {selectedOrder.products?.map((item, index) => (
                      <tr key={index}>
                        <td className="px-3 py-3 sm:px-4 sm:py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {item.cartItem?.imageUrl && (
                              <div className="flex-shrink-0 h-8 w-8 sm:h-10 sm:w-10">
                                <img 
                                  className="h-8 w-8 sm:h-10 sm:w-10 rounded-full object-cover" 
                                  src={item.cartItem.imageUrl} 
                                  alt={item.cartItem.name}
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = '/placeholder-product.png';
                                  }}
                                />
                              </div>
                            )}
                            <div className="ml-2 sm:ml-4">
                              <div className="text-xs sm:text-sm font-medium text-gray-900">{item.cartItem?.name || 'Unknown Product'}</div>
                              <div className="text-xs text-gray-500">ID: {item.cartItem?._id || 'N/A'}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-3 py-3 sm:px-4 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                          ₹{item.cartItem?.price?.toFixed(2) || '0.00'}
                        </td>
                        <td className="px-3 py-3 sm:px-4 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                          {item.quantity}
                        </td>
                        <td className="px-3 py-3 sm:px-4 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                          ₹{((item.cartItem?.price || 0) * item.quantity).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-4 sm:mt-6 flex justify-end">
                <button
                  onClick={closeModal}
                  className="px-3 py-1 sm:px-4 sm:py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 text-xs sm:text-sm"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}