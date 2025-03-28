import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminNavbar from './AdminNavbar';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { FiUsers, FiDollarSign, FiClock, FiShoppingCart, FiBox, FiTrendingUp } from 'react-icons/fi';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useBackend } from '../context';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: 'https://decora-backend.vercel.app/api',
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('dtoken')}`
  }
});

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState({
    totalUsers: 0,
    totalEarnings: 0,
    pendingApprovals: 0,
    activeProducts: 0,
    recentOrders: [],
    salesData: []
  });
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('monthly');
  const [error, setError] = useState(null);
  const { BACKEND_URL } = useBackend();

  // Check authentication and fetch data
  useEffect(() => {
    const token = localStorage.getItem('dtoken');
    if (!token) {
      navigate('/admin-login');
      return;
    }

    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch all data in parallel
        const [usersRes, ordersRes, productsRes, analyticsRes] = await Promise.all([
          api.get('/user/all-user'),
          api.get('/order/orders'),
          api.get('/products/all'),
          api.get(`/analytics?range=${timeRange}`)
        ]);

        // Process data
        const usersData = usersRes.data?.users || [];
        const ordersData = ordersRes.data?.orders || [];
        const productsData = productsRes.data?.products || [];
        const analyticsData = analyticsRes.data || {};

        // Calculate metrics
        const earnings = ordersData.reduce((sum, order) => {
          const price = parseFloat(order.total_price) || 0;
          return order.status?.toLowerCase() === 'delivered' ? sum + price : sum;
        }, 0);

        const pendingCount = ordersData.filter(
          order => order.status?.toLowerCase() === 'pending'
        ).length;

        // Set dashboard data
        setDashboardData({
          totalUsers: usersData.length,
          totalEarnings: earnings,
          pendingApprovals: pendingCount,
          activeProducts: productsData.length,
          recentOrders: ordersData.slice(0, 5).map(order => ({
            ...order,
            shortId: order._id?.slice(-6).toUpperCase() || 'N/A'
          })),
          salesData: analyticsData.salesData || generateFallbackSalesData()
        });

      } catch (err) {
        console.error('Dashboard error:', err);
        setError(err.response?.data?.message || err.message || 'Failed to load data');
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate, timeRange]);

  // Generate fallback data for charts
  const generateFallbackSalesData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    return months.map(month => ({
      name: month,
      sales: Math.floor(Math.random() * 5000) + 1000
    }));
  };

  // Product category data
  const productCategoryData = [
    { name: 'Furniture', value: 35 },
    { name: 'Lighting', value: 25 },
    { name: 'Decor', value: 20 },
    { name: 'Textiles', value: 15 },
    { name: 'Other', value: 5 }
  ];

  // Admin data from localStorage
  const adminData = JSON.parse(localStorage.getItem('adminData')) || {};

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem('dtoken');
    localStorage.removeItem('adminData');
    navigate('/admin-login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <div className='fixed h-full'>

      <AdminNavbar />
      </div>
      
      <div className="flex-1 p-6 md:p-8 overflow-x-hidden ml-55">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Dashboard Overview</h1>
            <p className="text-gray-600 mt-1">
              Welcome back, <span className="font-semibold text-indigo-600">{adminData.name || 'Admin'}</span>
            </p>
            {error && <p className="text-red-500 text-sm mt-2">Error: {error}</p>}
          </div>
          <div className="mt-4 md:mt-0 flex items-center space-x-4">
            <select 
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="bg-white border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
            <button
              onClick={handleLogout}
              className="bg-red-100 text-red-600 px-4 py-2 rounded-md text-sm font-medium hover:bg-red-200 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard 
            icon={<FiUsers className="text-indigo-500" size={24} />}
            title="Total Users"
            value={loading ? '...' : dashboardData.totalUsers}
            change={loading ? '...' : "+12%"}
            loading={loading}
            color="indigo"
          />
          <StatCard 
            icon={<FiDollarSign className="text-green-500" size={24} />}
            title="Total Revenue"
            value={loading ? '...' : `₹${dashboardData.totalEarnings.toFixed(2)}`}
            change={loading ? '...' : "+24%"}
            loading={loading}
            color="green"
          />
          <StatCard 
            icon={<FiClock className="text-yellow-500" size={24} />}
            title="Pending Orders"
            value={loading ? '...' : dashboardData.pendingApprovals}
            change={loading ? '...' : "-5%"}
            loading={loading}
            color="yellow"
          />
          <StatCard 
            icon={<FiBox className="text-blue-500" size={24} />}
            title="Active Products"
            value={loading ? '...' : dashboardData.activeProducts}
            change={loading ? '...' : "+8%"}
            loading={loading}
            color="blue"
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Sales Chart */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Sales Overview ({timeRange})</h3>
              <div className="flex space-x-2">
                {['weekly', 'monthly', 'yearly'].map(range => (
                  <button
                    key={range}
                    onClick={() => setTimeRange(range)}
                    className={`px-3 py-1 text-xs rounded-md capitalize ${
                      timeRange === range 
                        ? 'bg-indigo-100 text-indigo-700' 
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {range}
                  </button>
                ))}
              </div>
            </div>
            <div className="h-80">
              {loading ? (
                <div className="h-full flex items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dashboardData.salesData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`₹${value}`, 'Sales']} />
                    <Legend />
                    <Bar dataKey="sales" fill="#4F46E5" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Product Categories */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Product Categories</h3>
            <div className="h-80">
              {loading ? (
                <div className="h-full flex items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={productCategoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {productCategoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value}%`, 'Share']} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>

        {/* Recent Orders and Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Orders */}
          <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Recent Orders</h3>
              <button 
                onClick={() => navigate('/manage-orders')}
                className="text-indigo-600 text-sm font-medium hover:text-indigo-800"
              >
                View All
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {loading ? (
                    <tr>
                      <td colSpan="4" className="px-6 py-4 text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
                      </td>
                    </tr>
                  ) : dashboardData.recentOrders.length > 0 ? (
                    dashboardData.recentOrders.map((order) => (
                      <tr key={order._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          #{order.shortId}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {order.user?.name || 'Guest'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          ₹{(order.total_price || 0).toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${order.status?.toLowerCase() === 'delivered' ? 'bg-green-100 text-green-800' :
                              order.status?.toLowerCase() === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'}`}>
                            {order.status || 'Processing'}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">
                        No recent orders found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
            <div className="space-y-4">
              <QuickActionCard 
                icon={<FiTrendingUp className="text-green-500" size={20} />}
                title="Add New Product"
                description="Create a new product listing"
                onClick={() => navigate('/add-product')}
              />
              <QuickActionCard 
                icon={<FiUsers className="text-blue-500" size={20} />}
                title="Manage Users"
                description="View and manage all users"
                onClick={() => navigate('/manage-users')}
              />
              <QuickActionCard 
                icon={<FiShoppingCart className="text-purple-500" size={20} />}
                title="Process Orders"
                description="Update order statuses"
                onClick={() => navigate('/manage-orders')}
              />
              <QuickActionCard 
                icon={<FiBox className="text-orange-500" size={20} />}
                title="Inventory"
                description="Check product stock levels"
                onClick={() => navigate('/inventory')}
              />
            </div>
          </div>
        </div>

        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </div>
  );
}

// Stat Card Component
function StatCard({ icon, title, value, change, loading, color }) {
  const colorClasses = {
    indigo: 'bg-indigo-50 text-indigo-700',
    green: 'bg-green-50 text-green-700',
    yellow: 'bg-yellow-50 text-yellow-700',
    blue: 'bg-blue-50 text-blue-700'
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
            {icon}
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <h3 className="text-2xl font-bold mt-1">
              {value}
            </h3>
          </div>
        </div>
        <span className={`text-xs font-medium px-2 py-1 rounded-full 
          ${change?.startsWith('+') ? 'bg-green-100 text-green-800' : 
            change?.startsWith('-') ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}`}>
          {change}
        </span>
      </div>
    </div>
  );
}

// Quick Action Card Component
function QuickActionCard({ icon, title, description, onClick }) {
  return (
    <div 
      onClick={onClick}
      className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
    >
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-gray-100 rounded-lg">
          {icon}
        </div>
        <div>
          <h4 className="font-medium text-gray-800">{title}</h4>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
      </div>
    </div>
  );
}

// Chart colors
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];