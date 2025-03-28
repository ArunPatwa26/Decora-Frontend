import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Edit, MapPin, Phone, Calendar, ShoppingBag, CreditCard, Settings, LogOut } from "lucide-react";

const Profile = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("e-user");
    if (storedUser) {
      // Sample user data with more fields
      const userData = {
        ...JSON.parse(storedUser),
        phone: "+1 (555) 123-4567",
        joinDate: "January 15, 2022",
        orders: 12,
        address: "123 Main St, Apt 4B\nNew York, NY 10001",
        paymentMethods: ["VISA ****4242", "PayPal"],
      };
      setUser(userData);
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("e-user");
    navigate("/login");
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-6 px-6">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-white hover:text-blue-200 transition"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </button>
          <h1 className="text-xl font-semibold">My Profile</h1>
          <div className="w-5"></div> {/* Spacer for alignment */}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Profile Card */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
          <div className="relative">
            {/* Cover Photo */}
            <div className="h-32 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
            
            {/* Profile Picture and Basic Info */}
            <div className="px-6 pb-6 -mt-16">
              <div className="flex flex-col sm:flex-row items-start sm:items-end gap-6">
                <img
                  src={user.profilePicture}
                  alt="Profile"
                  className="w-38 h-38 rounded-full border-4 border-white shadow-lg"
                />
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-800">{user.name}</h2>
                      <p className="text-gray-600">{user.email}</p>
                    </div>
                    <button
                      onClick={() => navigate("/edit-profile")}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                      <Edit size={16} />
                      Edit
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 divide-x divide-gray-200 border-t border-gray-200">
            <div className="p-4 text-center">
              <p className="text-2xl font-bold text-gray-800">{user.orders}</p>
              <p className="text-sm text-gray-600">Orders</p>
            </div>
            <div className="p-4 text-center">
              <p className="text-2xl font-bold text-gray-800">4.9</p>
              <p className="text-sm text-gray-600">Avg. Rating</p>
            </div>
            <div className="p-4 text-center">
              <p className="text-2xl font-bold text-gray-800">2</p>
              <p className="text-sm text-gray-600">Wishlist</p>
            </div>
          </div>
        </div>

        {/* Details Sections */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Personal Information */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Settings className="text-blue-600" size={18} />
              Personal Information
            </h3>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <Phone className="text-gray-500 mt-1" size={18} />
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="text-gray-800">{user.phone}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Calendar className="text-gray-500 mt-1" size={18} />
                <div>
                  <p className="text-sm text-gray-500">Member Since</p>
                  <p className="text-gray-800">{user.joinDate}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <MapPin className="text-blue-600" size={18} />
              Address
            </h3>
            <div className="flex items-start gap-4">
              <MapPin className="text-gray-500 mt-1" size={18} />
              <div>
                <p className="text-gray-800 whitespace-pre-line">{user.address}</p>
                <button className="mt-3 text-blue-600 hover:text-blue-800 text-sm font-medium transition">
                  Edit Address
                </button>
              </div>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <CreditCard className="text-blue-600" size={18} />
              Payment Methods
            </h3>
            <div className="space-y-3">
              {user.paymentMethods.map((method, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-gray-800">{method}</p>
                  <button className="text-red-500 hover:text-red-700 text-sm">
                    Remove
                  </button>
                </div>
              ))}
              <button className="text-blue-600 hover:text-blue-800 text-sm font-medium mt-2 transition">
                + Add Payment Method
              </button>
            </div>
          </div>

          {/* Recent Orders */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <ShoppingBag className="text-blue-600" size={18} />
              Recent Orders
            </h3>
            <div className="space-y-4">
              {[1, 2, 3].map((order) => (
                <div key={order} className="flex justify-between items-center border-b border-gray-100 pb-4">
                  <div>
                    <p className="font-medium text-gray-800">Order #100{order}</p>
                    <p className="text-sm text-gray-500">May {15 + order}, 2023</p>
                  </div>
                  <button className="text-blue-600 hover:text-blue-800 text-sm font-medium transition">
                    View Details
                  </button>
                </div>
              ))}
              <button className="text-blue-600 hover:text-blue-800 text-sm font-medium mt-2 transition">
                View All Orders
              </button>
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <div className="mt-8 text-center">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-6 py-3 text-red-600 hover:bg-red-50 rounded-lg transition mx-auto"
          >
            <LogOut size={18} />
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;