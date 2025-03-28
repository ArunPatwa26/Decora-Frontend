import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate,Link } from 'react-router-dom';
import { FaLock, FaEnvelope, FaSignInAlt } from 'react-icons/fa';
import { useBackend } from '../context';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
   const { BACKEND_URL } = useBackend();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await axios.post(`${BACKEND_URL}/api/admin/login`, {
        email,
        password,
      });

      console.log("Backend response:", response.data);

      if (response.data.token) {
        localStorage.setItem('dtoken', response.data.token);

        const adminData = {
          email: response.data.admin.email,
          name: response.data.admin.name,
          address: response.data.admin.address,
          profilePicture: response.data.admin.profilePicture,
        };

        console.log("Admin Data to store:", adminData);
        localStorage.setItem('adminData', JSON.stringify(adminData));

        setMessage('Login successful! Redirecting...');
        setTimeout(() => navigate('/admin-dashboard'), 1500);
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Header Section */}
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg mb-4">
            <FaLock className="text-white text-2xl" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800">Admin Portal</h1>
          <p className="text-gray-600 mt-2">Sign in to your administrator account</p>
        </div>

        {/* Card Container */}
        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          <div className="p-8 sm:p-10">
            {/* Messages */}
            {message && (
              <div className="mb-6 p-3 bg-green-50 text-green-700 rounded-lg border border-green-200 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {message}
              </div>
            )}
            
            {error && (
              <div className="mb-6 p-3 bg-red-50 text-red-700 rounded-lg border border-red-200 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaEnvelope className="text-gray-400" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                    placeholder="admin@example.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="text-gray-400" />
                  </div>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                   <Link
                                  to="/login"
                                  className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                                >
                    Forgot password?
                  </Link>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Signing in...
                    </>
                  ) : (
                    <>
                      <FaSignInAlt className="mr-2" />
                      
                      Sign In
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Footer */}
          <div className="px-8 py-4 bg-gray-50 text-center">
            <p className="text-xs text-gray-500">
              &copy; {new Date().getFullYear()} Your Company. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}