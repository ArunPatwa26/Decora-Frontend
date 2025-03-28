import React, { Component } from "react";
import { Link, useParams } from "react-router-dom";
import { FiSearch, FiShoppingCart, FiHeart } from "react-icons/fi";
import { FaStar, FaRegStar } from "react-icons/fa";
import { BackendContext } from "../context"

class GetProductsByID extends Component {
  static contextType = BackendContext;
  constructor(props) {
    super(props);
    this.state = {
      products: [],
      loading: true,
      error: null,
      sortOption: "featured",
      searchQuery: "",
    };
  }
  
  componentDidMount() {
    const { BACKEND_URL } = this.context;
    const { category } = this.props.params;
    fetch(`${BACKEND_URL}/api/products/category/${category}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }
      return response.json();
    })
    .then((data) => this.setState({ products: data, loading: false }))
    .catch((error) => this.setState({ error: error.message, loading: false }));
  }
  
  handleSortChange = (e) => {
    this.setState({ sortOption: e.target.value });
    // Add sorting logic here
  };
  
  handleSearchChange = (e) => {
    this.setState({ searchQuery: e.target.value });
    // Add search filtering logic here
  };
  
  renderRatingStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const emptyStars = 5 - fullStars;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={`full-${i}`} className="text-yellow-400" />);
    }
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FaRegStar key={`empty-${i}`} className="text-yellow-400" />);
    }
    
    return stars;
  };
  
  render() {
    const { products, loading, error, sortOption, searchQuery } = this.state;
    const { category } = this.props.params;

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
      <div className="bg-gray-50 min-h-screen">
        {/* Category Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-800 py-12 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold capitalize">{category}</h1>
            <p className="mt-2 text-blue-100">
              {products.length} {products.length === 1 ? 'product' : 'products'} available
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Filters and Search */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            {/* Search Bar */}
            <div className="relative w-full md:w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={this.handleSearchChange}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Sort Options */}
            <div className="flex items-center">
              <label htmlFor="sort" className="mr-2 text-sm font-medium text-gray-700">
                Sort by:
              </label>
              <select
                id="sort"
                value={sortOption}
                onChange={this.handleSortChange}
                className="border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Customer Rating</option>
                <option value="newest">Newest Arrivals</option>
              </select>
            </div>
          </div>

          {/* Products Grid */}
          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <div key={product._id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition duration-300">
                  <Link to={`/product/${product._id}`} className="block">
                    {/* Product Image */}
                    <div className="relative pt-[100%] bg-gray-100">
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="absolute top-0 left-0 w-full h-full object-contain p-4"
                      />
                      {/* Quick Actions */}
                      <div className="absolute top-2 right-2 flex flex-col space-y-2">
                        <button className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition">
                          <FiHeart className="w-4 h-4 text-gray-600" />
                        </button>
                        <button className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition">
                          <FiShoppingCart className="w-4 h-4 text-gray-600" />
                        </button>
                      </div>
                    </div>

                    {/* Product Info */}
                    <div className="p-4">
                      <h3 className="font-medium text-gray-900 mb-1 line-clamp-1">{product.name}</h3>
                      <div className="flex items-center mb-2">
                        {this.renderRatingStars(product.rating || 4.5)}
                        <span className="ml-1 text-xs text-gray-500">({product.reviews || 24})</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-lg font-bold text-blue-600">${product.price}</p>
                        {product.originalPrice && (
                          <p className="text-sm text-gray-500 line-through">${product.originalPrice}</p>
                        )}
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-500">We couldn't find any products matching your criteria.</p>
            </div>
          )}
        </div>
      </div>
    );
  }
}

// Wrap with useParams hook to get category from URL
export default function (props) {
  const params = useParams();
  return <GetProductsByID {...props} params={params} />;
}