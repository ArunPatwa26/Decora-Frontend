import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useBackend } from '../context';

export default function AddProducts() {
  const [product, setProduct] = useState({
    name: '',
    price: '',
    description: '',
    category: '',
  });
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { BACKEND_URL } = useBackend();

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

  const handleSubmit = async (e) => {
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
      const response = await axios.post(`${BACKEND_URL}/api/products/add-product`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('dtoken')}`
        },
      });

      alert(response.data.message);
      navigate('/manage-products');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to add product, please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-4 sm:py-6 md:py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header with back button */}
        <div className="flex items-center justify-between mb-4 sm:mb-6 md:mb-8">
          <button
            onClick={handleGoBack}
            className="flex items-center text-gray-600 hover:text-gray-800 transition-colors text-sm sm:text-base"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back
          </button>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 text-center">Add New Product</h1>
          <div className="w-6 sm:w-10"></div> {/* Spacer for alignment */}
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded text-sm sm:text-base">
            <p>{error}</p>
          </div>
        )}

        {/* Form container */}
        <div className="bg-white rounded-lg sm:rounded-xl shadow-sm sm:shadow-md overflow-hidden">
          <form onSubmit={handleSubmit} className="p-4 sm:p-6 md:p-8">
            <div className="space-y-4 sm:space-y-6">
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

              {/* File Upload */}
              <div>
                <label htmlFor="file-upload" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  Product Images
                </label>
                <div className="mt-1 flex justify-center px-4 pt-4 pb-5 sm:px-6 sm:pt-5 sm:pb-6 border-2 border-gray-300 border-dashed rounded-md sm:rounded-lg">
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
                  <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-gray-500">{images.length} file(s) selected</p>
                )}
              </div>

              {/* Preview of selected images */}
              {images.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {images.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={URL.createObjectURL(image)}
                        alt={`Preview ${index + 1}`}
                        className="h-20 sm:h-24 w-full object-cover rounded border border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const newImages = [...images];
                          newImages.splice(index, 1);
                          setImages(newImages);
                        }}
                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center text-xs"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Submit Button */}
              <div className="pt-2 sm:pt-4">
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
                      Processing...
                    </>
                  ) : (
                    'Add Product'
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}