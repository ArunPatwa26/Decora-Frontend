import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaPlus, FaSearch, FaTimes, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import AdminNavbar from './AdminNavbar';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useBackend } from '../context';

export default function ManageProducts() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [error, setError] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { BACKEND_URL } = useBackend();

  // Fetch all products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${BACKEND_URL}/api/products/all`);
        setProducts(response.data);
        setFilteredProducts(response.data);
      } catch (err) {
        setError('Error fetching products');
        toast.error('Failed to fetch products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [BACKEND_URL]);

  // Apply filters whenever search term, category or price range changes
  useEffect(() => {
    const filtered = products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           product.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
      
      return matchesSearch && matchesCategory && matchesPrice;
    });
    
    setFilteredProducts(filtered);
  }, [searchTerm, categoryFilter, priceRange, products]);

  // Get unique categories for filter dropdown
  const categories = ['all', ...new Set(products.map(product => product.category))];

  // Handle product actions
  const handleEdit = (productId) => navigate(`/edit-product/${productId}`);
  
  const handleDelete = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await axios.delete(`${BACKEND_URL}/api/products/delete/${productId}`);
        setProducts(products.filter(product => product._id !== productId));
        toast.success('Product deleted successfully!');
      } catch (err) {
        toast.error('Failed to delete product');
      }
    }
  };

  const handleView = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
    setCurrentImageIndex(0);
  };

  const closeModal = () => setIsModalOpen(false);

  const handlePrevImage = () => {
    setCurrentImageIndex(prev => prev === 0 ? selectedProduct.images.length - 1 : prev - 1);
  };

  const handleNextImage = () => {
    setCurrentImageIndex(prev => prev === selectedProduct.images.length - 1 ? 0 : prev + 1);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setCategoryFilter('all');
    setPriceRange([0, 10000]);
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      <AdminNavbar />
      <main className="flex-1 p-4 sm:p-6 md:p-8 md:ml-64">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-4">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800 ml-14">Manage Products</h1>
          <button
            onClick={() => navigate('/add-product')}
            className="bg-indigo-600 text-white px-3 py-1 sm:px-4 mt-4 sm:py-2 rounded-md flex items-center hover:bg-indigo-700 transition-colors text-sm sm:text-base"
          >
            <FaPlus className="mr-1 sm:mr-2" /> Add Product
          </button>
        </div>

        {/* Filter Section */}
        <div className="bg-white p-3 sm:p-4 rounded-lg shadow-sm md:shadow-md mb-4 sm:mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {/* Search Input */}
            <div className="relative col-span-2 sm:col-span-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400 text-sm" />
              </div>
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-8 py-1 sm:py-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm sm:text-base"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <FaTimes className="text-gray-400 hover:text-gray-600 text-xs" />
                </button>
              )}
            </div>

            {/* Category Filter */}
            <div>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full px-3 py-1 sm:px-4 sm:py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm sm:text-base"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Range Filter */}
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                Price Range: ₹{priceRange[0]} - ₹{priceRange[1]}
              </label>
              <div className="flex items-center space-x-2 sm:space-x-4">
                <input
                  type="range"
                  min="0"
                  max="10000"
                  step="100"
                  value={priceRange[0]}
                  onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <input
                  type="range"
                  min="0"
                  max="10000"
                  step="100"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Clear Filters Button */}
          {(searchTerm || categoryFilter !== 'all' || priceRange[0] > 0 || priceRange[1] < 10000) && (
            <button
              onClick={clearFilters}
              className="mt-2 text-xs sm:text-sm text-indigo-600 hover:text-indigo-800 flex items-center"
            >
              <FaTimes className="mr-1" /> Clear all filters
            </button>
          )}
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-lg shadow-sm md:shadow-md overflow-hidden">
          {loading ? (
            <div className="p-6 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
              <p className="mt-3 text-sm text-gray-600">Loading products...</p>
            </div>
          ) : error ? (
            <div className="p-4 text-sm text-red-500">{error}</div>
          ) : filteredProducts.length === 0 ? (
            <div className="p-6 text-center">
              <p className="text-sm text-gray-500">No products found matching your criteria</p>
              <button
                onClick={clearFilters}
                className="mt-2 text-xs sm:text-sm text-indigo-600 hover:text-indigo-800"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 sm:px-4 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                    <th className="px-3 py-2 sm:px-4 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    <th className="px-3 py-2 sm:px-4 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                    <th className="px-3 py-2 sm:px-4 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredProducts.map((product) => (
                    <tr key={product._id} className="hover:bg-gray-50">
                      <td className="px-3 py-3 sm:px-4 sm:py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-8 w-8 sm:h-10 sm:w-10">
                            <img
                              className="h-8 w-8 sm:h-10 sm:w-10 rounded-full object-cover"
                              src={product.images?.[0] || product.imageUrl || '/placeholder-product.png'}
                              alt={product.name}
                              onError={(e) => {
                                e.target.onerror = null; 
                                e.target.src = '/placeholder-product.png'
                              }}
                            />
                          </div>
                          <div className="ml-2 sm:ml-4">
                            <div className="text-xs sm:text-sm font-medium text-gray-900 line-clamp-1">{product.name}</div>
                            <div className="text-xs text-gray-500 line-clamp-1 max-w-[150px] sm:max-w-xs">{product.description}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-3 sm:px-4 sm:py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                          {product.category}
                        </span>
                      </td>
                      <td className="px-3 py-3 sm:px-4 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900">₹{product.price}</td>
                      <td className="px-3 py-3 sm:px-4 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-medium">
                        <div className="flex space-x-2 sm:space-x-3">
                          <button
                            onClick={() => handleView(product)}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            View
                          </button>
                          <button
                            onClick={() => handleEdit(product._id)}
                            className="text-green-600 hover:text-green-900"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(product._id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Product Details Modal */}
      {isModalOpen && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-full w-full sm:max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-4 sm:p-6">
              <div className="flex justify-between items-start">
                <h2 className="text-lg sm:text-xl font-bold text-gray-800">Product Details</h2>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="mt-4 sm:mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {/* Product Images */}
                <div>
                  <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-1 sm:mb-2">Images</h3>
                  {selectedProduct.images?.length > 0 ? (
                    <div className="relative">
                      <img
                        src={selectedProduct.images[currentImageIndex]}
                        alt={`Product ${currentImageIndex + 1}`}
                        className="w-full h-48 sm:h-64 object-contain rounded-lg border border-gray-200"
                        onError={(e) => {
                          e.target.onerror = null; 
                          e.target.src = '/placeholder-product.png'
                        }}
                      />
                      {selectedProduct.images.length > 1 && (
                        <>
                          <button
                            onClick={handlePrevImage}
                            className="absolute left-1 sm:left-2 top-1/2 -translate-y-1/2 bg-white p-1 sm:p-2 rounded-full shadow-md hover:bg-gray-100"
                          >
                            <FaChevronLeft className="w-3 h-3 sm:w-4 sm:h-4 text-gray-700" />
                          </button>
                          <button
                            onClick={handleNextImage}
                            className="absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 bg-white p-1 sm:p-2 rounded-full shadow-md hover:bg-gray-100"
                          >
                            <FaChevronRight className="w-3 h-3 sm:w-4 sm:h-4 text-gray-700" />
                          </button>
                          <div className="flex justify-center mt-1 sm:mt-2 space-x-1">
                            {selectedProduct.images.map((_, index) => (
                              <button
                                key={index}
                                onClick={() => setCurrentImageIndex(index)}
                                className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${currentImageIndex === index ? 'bg-indigo-600' : 'bg-gray-300'}`}
                              />
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  ) : (
                    <div className="h-48 sm:h-64 flex items-center justify-center bg-gray-100 rounded-lg">
                      <p className="text-sm text-gray-500">No images available</p>
                    </div>
                  )}
                </div>

                {/* Product Details */}
                <div>
                  <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-1 sm:mb-2">Information</h3>
                  <div className="space-y-2 sm:space-y-4">
                    <div>
                      <p className="text-xs sm:text-sm text-gray-500">Name</p>
                      <p className="text-sm sm:text-base font-medium">{selectedProduct.name}</p>
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-gray-500">Category</p>
                      <p className="text-sm sm:text-base font-medium">{selectedProduct.category}</p>
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-gray-500">Price</p>
                      <p className="text-sm sm:text-base font-medium">₹{selectedProduct.price}</p>
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-gray-500">Description</p>
                      <p className="text-sm sm:text-base font-medium">{selectedProduct.description || 'No description provided'}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 sm:mt-6 flex justify-end">
                <button
                  onClick={closeModal}
                  className="px-3 py-1 sm:px-4 sm:py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 text-sm sm:text-base"
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