import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { useBackend } from '../context';

export default function EditProduct() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState('');
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { BACKEND_URL } = useBackend();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/products/${id}`);
        if (response.data) {
          setProduct(response.data);
        } else {
          setError('Product not found');
        }
      } catch (err) {
        setError('Error fetching product data');
      }
    };

    fetchProduct();
  }, [id, BACKEND_URL]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append('name', product.name);
    formData.append('price', product.price);
    formData.append('description', product.description);
    formData.append('category', product.category);

    images.forEach((image) => {
      formData.append('files', image);
    });

    try {
      await axios.put(`${BACKEND_URL}/api/products/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
      });
      alert('Product updated successfully');
      navigate('/manage-products');
    } catch (err) {
      setError(err.response?.data?.message || 'Error updating product');
    } finally {
      setLoading(false);
    }
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === 0 ? product.images.length - 1 : prevIndex - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === product.images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-4 sm:py-6 lg:py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header with back button */}
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <button
            onClick={handleGoBack}
            className="flex items-center text-gray-600 hover:text-gray-800 transition-colors text-sm sm:text-base"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back
          </button>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">Edit Product</h1>
          <div className="w-6 sm:w-10"></div> {/* Spacer for alignment */}
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded text-sm sm:text-base">
            <p>{error}</p>
          </div>
        )}

        {product ? (
          <div className="bg-white rounded-lg sm:rounded-xl shadow-sm sm:shadow-md overflow-hidden">
            <form onSubmit={handleUpdate} className="p-4 sm:p-6 md:p-8">
              <div className="space-y-4 sm:space-y-6">
                {/* Image Gallery */}
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                    Product Images
                  </label>
                  {product.images.length > 0 ? (
                    <div className="relative group">
                      <div className="aspect-w-16 aspect-h-9 bg-gray-100 rounded-lg overflow-hidden">
                        <img
                          src={product.images[currentImageIndex]}
                          alt={`Product ${currentImageIndex + 1}`}
                          className="w-full h-48 sm:h-64 object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://via.placeholder.com/300';
                          }}
                        />
                      </div>
                      {product.images.length > 1 && (
                        <>
                          <div className="absolute inset-0 flex items-center justify-between px-2 sm:px-4 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              type="button"
                              onClick={handlePrevImage}
                              className="p-1 sm:p-2 rounded-full bg-black bg-opacity-50 text-white hover:bg-opacity-70 transition"
                            >
                              <svg className="w-4 h-4 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                              </svg>
                            </button>
                            <button
                              type="button"
                              onClick={handleNextImage}
                              className="p-1 sm:p-2 rounded-full bg-black bg-opacity-50 text-white hover:bg-opacity-70 transition"
                            >
                              <svg className="w-4 h-4 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </button>
                          </div>
                          <div className="flex justify-center mt-1 sm:mt-2 space-x-1">
                            {product.images.map((_, index) => (
                              <button
                                key={index}
                                type="button"
                                onClick={() => setCurrentImageIndex(index)}
                                className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${index === currentImageIndex ? 'bg-blue-600' : 'bg-gray-300'}`}
                              />
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  ) : (
                    <div className="flex justify-center items-center h-32 bg-gray-100 rounded-lg">
                      <span className="text-gray-500 text-sm sm:text-base">No images available</span>
                    </div>
                  )}
                </div>

                {/* New Images Upload */}
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                    Add New Images
                  </label>
                  <div className="mt-1 flex justify-center px-4 sm:px-6 pt-4 sm:pt-5 pb-5 sm:pb-6 border-2 border-gray-300 border-dashed rounded-md sm:rounded-lg">
                    <div className="space-y-1 text-center">
                      <svg
                        className="mx-auto h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 text-gray-400"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 48 48"
                        aria-hidden="true"
                      >
                        <path
                          d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <div className="flex text-xs sm:text-sm text-gray-600 justify-center">
                        <label
                          htmlFor="file-upload"
                          className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none"
                        >
                          <span>Upload files</span>
                          <input
                            id="file-upload"
                            name="file-upload"
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleFileChange}
                            className="sr-only"
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-2xs sm:text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                    </div>
                  </div>
                  {images.length > 0 && (
                    <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-gray-500">{images.length} new file(s) selected</p>
                  )}
                </div>

                {/* Product Name */}
                <div>
                  <label htmlFor="name" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Product Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={product.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-1 sm:px-4 sm:py-2 border border-gray-300 rounded-md sm:rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-sm sm:text-base"
                    required
                  />
                </div>

                {/* Price */}
                <div>
                  <label htmlFor="price" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Price
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-2 sm:pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 text-sm sm:text-base">$</span>
                    </div>
                    <input
                      type="number"
                      id="price"
                      name="price"
                      value={product.price}
                      onChange={handleInputChange}
                      className="block w-full pl-6 sm:pl-7 pr-12 py-1 sm:py-2 border border-gray-300 rounded-md sm:rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-sm sm:text-base"
                      placeholder="0.00"
                      required
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label htmlFor="description" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows={3}
                    value={product.description}
                    onChange={handleInputChange}
                    className="w-full px-3 py-1 sm:px-4 sm:py-2 border border-gray-300 rounded-md sm:rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-sm sm:text-base"
                    required
                  />
                </div>

                {/* Category */}
                <div>
                  <label htmlFor="category" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={product.category}
                    onChange={handleInputChange}
                    className="w-full px-3 py-1 sm:px-4 sm:py-2 border border-gray-300 rounded-md sm:rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-sm sm:text-base"
                    required
                  >
                    <option value="">Select a category</option>
                    <option value="Furniture">Furniture</option>
                    <option value="Lighting">Lighting</option>
                    <option value="Decor">Decor</option>
                    <option value="Textiles">Textiles</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Submit Button */}
                <div className="pt-3 sm:pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full flex justify-center py-2 px-4 sm:py-3 sm:px-4 border border-transparent rounded-md shadow-sm text-xs sm:text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 sm:h-5 sm:w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Updating...
                      </>
                    ) : (
                      'Update Product'
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        ) : (
          <div className="text-center py-8 sm:py-12">
            <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-3 sm:mt-4 text-gray-600 text-sm sm:text-base">Loading product details...</p>
          </div>
        )}
      </div>
    </div>
  );
}