import React, { Component } from "react";
import { Link } from "react-router-dom";
import { FiArrowLeft, FiFilter, FiX, FiStar, FiShoppingCart } from "react-icons/fi";
import { BackendContext } from "../context";

export default class AllProducts extends Component {
  static contextType = BackendContext; 
  state = {
    products: [],
    filteredProducts: [],
    categories: [],
    selectedCategory: "all",
    priceRange: "all",
    ratingFilter: "all",
    sortOption: "featured",
    showFilters: false,
    searchQuery: "",
  };
  

  componentDidMount() {
    this.fetchProducts();
  }
  
  fetchProducts = async () => {
    const { BACKEND_URL } = this.context;
    try {
      const response = await fetch(`${BACKEND_URL}/api/products/all`);
      const data = await response.json();
      const categories = ["all", ...new Set(data.map((product) => product.category))];

      this.setState({ 
        products: data, 
        filteredProducts: data, 
        categories 
      });
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  applyFilters = () => {
    const { 
      products, 
      selectedCategory, 
      priceRange, 
      ratingFilter,
      sortOption,
      searchQuery
    } = this.state;

    let filtered = [...products];

    // Apply category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Apply price filter
    if (priceRange !== "all") {
      const [min, max] = priceRange.split("-").map(Number);
      filtered = filtered.filter(product => product.price >= min && product.price <= max);
    }

    // Apply rating filter
    if (ratingFilter !== "all") {
      const minRating = Number(ratingFilter);
      filtered = filtered.filter(product => product.rating >= minRating);
    }

    // Apply search filter
    if (searchQuery) {
    navigate('/search')
    }

    // Apply sorting
    switch (sortOption) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case "newest":
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      default:
        // Featured (default sorting)
        break;
    }

    this.setState({ filteredProducts: filtered });
  };

  handleFilterChange = (filterType, value) => {
    this.setState({ [filterType]: value }, this.applyFilters);
  };

  resetFilters = () => {
    this.setState({
      selectedCategory: "all",
      priceRange: "all",
      ratingFilter: "all",
      sortOption: "featured",
      searchQuery: "",
    }, this.applyFilters);
  };

  renderRatingStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<FiStar key={i} className="text-yellow-400 fill-current" />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<FiStar key={i} className="text-yellow-400 fill-current opacity-50" />);
      } else {
        stars.push(<FiStar key={i} className="text-gray-300" />);
      }
    }
    
    return stars;
  };

  render() {
    const { 
      filteredProducts, 
      showFilters, 
      selectedCategory, 
      priceRange,
      ratingFilter,
      sortOption,
      searchQuery,
      categories
    } = this.state;

    const priceRanges = [
      { value: "all", label: "All Prices" },
      { value: "0-100", label: "Under $100" },
      { value: "100-300", label: "$100 - $300" },
      { value: "300-500", label: "$300 - $500" },
      { value: "500-1000", label: "$500 - $1000" },
      { value: "1000-9999", label: "Over $1000" }
    ];

    const ratingFilters = [
      { value: "all", label: "All Ratings" },
      { value: "4", label: "4+ Stars" },
      { value: "3", label: "3+ Stars" },
      { value: "2", label: "2+ Stars" },
      { value: "1", label: "1+ Stars" }
    ];

    const sortOptions = [
      { value: "featured", label: "Featured" },
      { value: "price-low", label: "Price: Low to High" },
      { value: "price-high", label: "Price: High to Low" },
      { value: "rating", label: "Highest Rated" },
      { value: "newest", label: "Newest Arrivals" }
    ];

    return (
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div className="flex items-center mb-4 md:mb-0">
              <Link 
                to="/" 
                className="flex items-center text-blue-600 hover:text-blue-800 transition"
              >
                <FiArrowLeft className="mr-2" /> Back to Home
              </Link>
              <h1 className="text-3xl font-bold text-gray-900 ml-4">All Products</h1>
            </div>

            {/* Search Bar */}
            <div className="relative w-full md:w-64">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => this.handleFilterChange("searchQuery", e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <div className={`lg:w-64 ${showFilters ? 'block' : 'hidden'} lg:block`}>
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-bold text-gray-900">Filters</h2>
                  <button 
                    onClick={() => this.setState({ showFilters: false })}
                    className="lg:hidden text-gray-500 hover:text-gray-700"
                  >
                    <FiX />
                  </button>
                </div>

                {/* Categories Filter */}
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-900 mb-2">Categories</h3>
                  <select
                    value={selectedCategory}
                    onChange={(e) => this.handleFilterChange("selectedCategory", e.target.value)}
                    className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price Range Filter */}
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-900 mb-2">Price Range</h3>
                  <select
                    value={priceRange}
                    onChange={(e) => this.handleFilterChange("priceRange", e.target.value)}
                    className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    {priceRanges.map(range => (
                      <option key={range.value} value={range.value}>
                        {range.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Rating Filter */}
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-900 mb-2">Customer Rating</h3>
                  <select
                    value={ratingFilter}
                    onChange={(e) => this.handleFilterChange("ratingFilter", e.target.value)}
                    className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    {ratingFilters.map(filter => (
                      <option key={filter.value} value={filter.value}>
                        {filter.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Sort Options */}
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-900 mb-2">Sort By</h3>
                  <select
                    value={sortOption}
                    onChange={(e) => this.handleFilterChange("sortOption", e.target.value)}
                    className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    {sortOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={this.resetFilters}
                  className="w-full bg-gray-200 text-gray-800 py-2 rounded-md hover:bg-gray-300 transition"
                >
                  Reset Filters
                </button>
              </div>
            </div>

            {/* Products Grid */}
            <div className="flex-1">
              {/* Mobile Filter Button */}
              <button
                onClick={() => this.setState({ showFilters: !showFilters })}
                className="lg:hidden flex items-center bg-blue-600 text-white px-4 py-2 rounded-md mb-4 hover:bg-blue-700 transition"
              >
                <FiFilter className="mr-2" /> {showFilters ? 'Hide Filters' : 'Show Filters'}
              </button>

              {/* Products Count */}
              <div className="mb-4 text-sm text-gray-600">
                Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
              </div>

              {/* Products Grid */}
              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map((product) => (
                    <div key={product._id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition">
                      <Link to={`/product/${product._id}`} className="block">
                        <div className="relative pt-[100%] bg-gray-100">
                          <img
                            src={product.imageUrl}
                            alt={product.title}
                            className="absolute top-0 left-0 w-full h-full object-cover"
                          />
                        </div>
                      </Link>
                      <div className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium text-gray-900">{product.title}</h3>
                            <p className="text-sm text-gray-500">{product.category}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-blue-600">${product.price}</p>
                            {product.originalPrice && (
                              <p className="text-xs text-gray-500 line-through">${product.originalPrice}</p>
                            )}
                          </div>
                        </div>
                        <div className="mt-2 flex items-center">
                          {this.renderRatingStars(product.rating || 4.5)}
                          <span className="ml-1 text-xs text-gray-500">({product.reviews || 24})</span>
                        </div>
                        <button className="mt-4 w-full flex items-center justify-center bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition">
                          <FiShoppingCart className="mr-2" /> Add to Cart
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                  <p className="text-gray-500">Try adjusting your filters or search query</p>
                  <button
                    onClick={this.resetFilters}
                    className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
                  >
                    Reset Filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}