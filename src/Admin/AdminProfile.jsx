import React, { useEffect, useState } from 'react';
import AdminNavbar from './AdminNavbar';
import { FaUser, FaEnvelope, FaMapMarkerAlt, FaPhone, FaIdBadge, FaCalendarAlt } from 'react-icons/fa';
import { useBackend } from '../context';

export default function AdminProfile() {
  const [adminData, setAdminData] = useState({
    name: 'Admin User',
    email: 'admin@example.com',
    address: '123 Admin Street, Tech City',
    phone: '+1 (555) 123-4567',
    adminId: 'ADM-2023-001',
    joinDate: 'January 15, 2022',
    profilePicture: 'https://randomuser.me/api/portraits/women/44.jpg'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { BACKEND_URL } = useBackend();

  useEffect(() => {
    setLoading(true);
    try {
      const storedAdminData = localStorage.getItem('adminData');
      if (storedAdminData) {
        setAdminData(JSON.parse(storedAdminData));
      }
      setLoading(false);
    } catch (err) {
      setError("Failed to load admin data");
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <AdminNavbar />
        <div className="flex-1 p-4 md:p-6 lg:p-8 md:ml-64 flex items-center justify-center">
          <div className="animate-spin rounded-full h-10 w-10 md:h-12 md:w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <AdminNavbar />
        <div className="flex-1 p-4 md:p-6 lg:p-8 md:ml-64 flex items-center justify-center">
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 w-full max-w-md">
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      <AdminNavbar />
      <main className="flex-1 p-4 sm:p-6 md:p-8 md:ml-64">
        {/* Header Section */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 ml-14">Admin Profile</h1>
          <p className="text-gray-600 text-sm sm:text-base mt-2">View and manage your admin account details</p>
        </div>

        {/* Profile Card */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Profile Overview */}
          <div className="bg-white rounded-lg md:rounded-xl shadow-sm md:shadow-md overflow-hidden col-span-1">
            <div className="bg-indigo-600 h-16 sm:h-20 md:h-24"></div>
            <div className="px-4 sm:px-6 pb-4 sm:pb-6 -mt-8 sm:-mt-10 md:-mt-12">
              <div className="flex justify-center">
                <img 
                  src={adminData.profilePicture} 
                  alt="Profile" 
                  className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full border-4 border-white shadow-md"
                />
              </div>
              <div className="text-center mt-3 sm:mt-4">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-800">{adminData.name}</h2>
                <p className="text-indigo-600 text-sm sm:text-base">Administrator</p>
              </div>
              <div className="mt-4 sm:mt-6">
                <div className="flex items-center mb-2 sm:mb-3">
                  <span className="bg-indigo-100 p-1 sm:p-2 rounded-full mr-2 sm:mr-3">
                    <FaIdBadge className="text-indigo-600 text-sm sm:text-base" />
                  </span>
                  <div>
                    <p className="text-xs text-gray-500">Admin ID</p>
                    <p className="text-gray-700 text-sm sm:text-base">{adminData.adminId}</p>
                  </div>
                </div>
                <div className="flex items-center mb-2 sm:mb-3">
                  <span className="bg-indigo-100 p-1 sm:p-2 rounded-full mr-2 sm:mr-3">
                    <FaCalendarAlt className="text-indigo-600 text-sm sm:text-base" />
                  </span>
                  <div>
                    <p className="text-xs text-gray-500">Member Since</p>
                    <p className="text-gray-700 text-sm sm:text-base">{adminData.joinDate}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div className="bg-white rounded-lg md:rounded-xl shadow-sm md:shadow-md overflow-hidden col-span-1 lg:col-span-2">
            <div className="p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4 sm:mb-6 pb-2 border-b">Personal Information</h3>
              
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-start">
                  <span className="bg-indigo-100 p-2 sm:p-3 rounded-full mr-3 sm:mr-4">
                    <FaUser className="text-indigo-600 text-sm sm:text-base" />
                  </span>
                  <div>
                    <p className="text-xs sm:text-sm text-gray-500">Full Name</p>
                    <p className="text-gray-700 font-medium text-sm sm:text-base">{adminData.name}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <span className="bg-indigo-100 p-2 sm:p-3 rounded-full mr-3 sm:mr-4">
                    <FaEnvelope className="text-indigo-600 text-sm sm:text-base" />
                  </span>
                  <div>
                    <p className="text-xs sm:text-sm text-gray-500">Email Address</p>
                    <p className="text-gray-700 font-medium text-sm sm:text-base">{adminData.email}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <span className="bg-indigo-100 p-2 sm:p-3 rounded-full mr-3 sm:mr-4">
                    <FaPhone className="text-indigo-600 text-sm sm:text-base" />
                  </span>
                  <div>
                    <p className="text-xs sm:text-sm text-gray-500">Phone Number</p>
                    <p className="text-gray-700 font-medium text-sm sm:text-base">{adminData.phone}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <span className="bg-indigo-100 p-2 sm:p-3 rounded-full mr-3 sm:mr-4">
                    <FaMapMarkerAlt className="text-indigo-600 text-sm sm:text-base" />
                  </span>
                  <div>
                    <p className="text-xs sm:text-sm text-gray-500">Address</p>
                    <p className="text-gray-700 font-medium text-sm sm:text-base">{adminData.address}</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t flex flex-col sm:flex-row gap-2 sm:gap-0">
                <button className="bg-indigo-600 text-white px-4 py-1 sm:px-6 sm:py-2 rounded-lg hover:bg-indigo-700 transition text-sm sm:text-base">
                  Edit Profile
                </button>
                <button className="bg-white border border-gray-300 text-gray-700 px-4 py-1 sm:px-6 sm:py-2 rounded-lg hover:bg-gray-50 transition text-sm sm:text-base sm:ml-4">
                  Change Password
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Sections */}
        <div className="mt-6 sm:mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {/* Activity Log */}
          <div className="bg-white rounded-lg md:rounded-xl shadow-sm md:shadow-md overflow-hidden">
            <div className="p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4">Recent Activity</h3>
              <div className="space-y-3 sm:space-y-4">
                {[
                  { action: 'Updated product catalog', time: '2 hours ago' },
                  { action: 'Processed 5 new orders', time: '5 hours ago' },
                  { action: 'Responded to user inquiry', time: '1 day ago' },
                  { action: 'System maintenance', time: '2 days ago' }
                ].map((item, index) => (
                  <div key={index} className="flex items-start pb-2 sm:pb-3 border-b border-gray-100 last:border-0">
                    <span className="bg-green-100 p-1 rounded-full mr-2 sm:mr-3 mt-1">
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full"></div>
                    </span>
                    <div>
                      <p className="text-gray-700 text-sm sm:text-base">{item.action}</p>
                      <p className="text-xs text-gray-500">{item.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* System Information */}
          <div className="bg-white rounded-lg md:rounded-xl shadow-sm md:shadow-md overflow-hidden">
            <div className="p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4">System Information</h3>
              <div className="space-y-2 sm:space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600 text-xs sm:text-sm">Last Login</span>
                  <span className="font-medium text-xs sm:text-sm">Today, 09:42 AM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 text-xs sm:text-sm">Account Status</span>
                  <span className="text-green-600 font-medium text-xs sm:text-sm">Active</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 text-xs sm:text-sm">Admin Privileges</span>
                  <span className="font-medium text-xs sm:text-sm">Full Access</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 text-xs sm:text-sm">Two-Factor Auth</span>
                  <span className="text-blue-600 font-medium text-xs sm:text-sm">Enabled</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}