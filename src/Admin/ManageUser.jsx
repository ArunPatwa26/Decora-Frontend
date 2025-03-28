import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminNavbar from './AdminNavbar';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useBackend } from '../context';

export default function ManageUser() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { BACKEND_URL } = useBackend();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${BACKEND_URL}/api/user/all-user`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (response.data && response.data.users) {
          setUsers(response.data.users);
        } else {
          setError('Unexpected response format');
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Error fetching users');
        toast.error('Failed to load users');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [BACKEND_URL]);

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    
    try {
      await axios.delete(`${BACKEND_URL}/api/user/delete-user/${userId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setUsers(users.filter(user => user._id !== userId));
      toast.success('User deleted successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error deleting user');
    }
  };

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      <AdminNavbar />
      
      <main className="flex-1 p-4 sm:p-6 md:p-8 md:ml-64">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 ml-5 mt-12">User Management</h1>
            
            {/* Search Input */}
            <div className="w-full sm:w-64">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm">
              {error}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm md:shadow-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Profile</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Email</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredUsers.length > 0 ? (
                      filteredUsers.map((user) => (
                        <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-8 w-8 sm:h-10 sm:w-10">
                                <img
                                  className="h-8 w-8 sm:h-10 sm:w-10 rounded-full object-cover"
                                  src={user.profilePicture || 'https://via.placeholder.com/150'}
                                  alt="Profile"
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = 'https://via.placeholder.com/150';
                                  }}
                                />
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                            <div className="text-xs text-gray-500 sm:hidden">{user.email}</div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap hidden sm:table-cell">
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleViewUser(user)}
                                className="text-blue-600 hover:text-blue-900 text-xs sm:text-sm"
                              >
                                View
                              </button>
                              <button
                                onClick={() => handleDelete(user._id)}
                                className="text-red-600 hover:text-red-900 text-xs sm:text-sm"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">
                          {searchTerm ? 'No matching users found' : 'No users found'}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>

      <ToastContainer position="top-right" autoClose={5000} />

      {/* User Details Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-md sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">User Details</h3>
                    {selectedUser && (
                      <div className="grid grid-cols-1 gap-4">
                        <div className="flex justify-center">
                          <img
                            src={selectedUser.profilePicture || 'https://via.placeholder.com/150'}
                            alt="Profile"
                            className="h-24 w-24 sm:h-32 sm:w-32 rounded-full object-cover"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = 'https://via.placeholder.com/150';
                            }}
                          />
                        </div>
                        <div className="border-t border-gray-200 pt-4">
                          <dl className="grid grid-cols-1 gap-x-4 gap-y-3">
                            <div className="sm:col-span-1">
                              <dt className="text-xs sm:text-sm font-medium text-gray-500">Full name</dt>
                              <dd className="mt-1 text-sm sm:text-base text-gray-900">{selectedUser.name}</dd>
                            </div>
                            <div className="sm:col-span-1">
                              <dt className="text-xs sm:text-sm font-medium text-gray-500">Email address</dt>
                              <dd className="mt-1 text-sm sm:text-base text-gray-900">{selectedUser.email}</dd>
                            </div>
                            {selectedUser.address && (
                              <div className="sm:col-span-1">
                                <dt className="text-xs sm:text-sm font-medium text-gray-500">Address</dt>
                                <dd className="mt-1 text-sm sm:text-base text-gray-900">
                                  {selectedUser.address}
                                </dd>
                              </div>
                            )}
                          </dl>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={closeModal}
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