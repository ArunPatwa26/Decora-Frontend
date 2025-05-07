import React, { Component } from "react";
import { Link } from "react-router-dom";
import { FiArrowLeft, FiFilter, FiX, FiStar, FiShoppingCart, FiSearch } from "react-icons/fi";
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
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(product => 
        product.title.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query)
      );
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
      { value: "0-100", label: "Under ₹100" },
      { value: "100-300", label: "₹100 - ₹300" },
      { value: "300-500", label: "₹300 - ₹500" },
      { value: "500-1000", label: "₹500 - ₹1000" },
      { value: "1000-9999", label: "Over ₹1000" }
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
      <div className="min-h-screen bg-gray-50">
        {/* Mobile Filter Overlay */}
        {showFilters && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => this.setState({ showFilters: false })}
          />
        )}

        {/* Mobile Filter Sidebar */}
        <div 
          className={`fixed inset-y-0 left-0 w-64 bg-white z-50 shadow-xl transform transition-transform duration-300 ease-in-out lg:hidden ${
            showFilters ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="p-4 h-full overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Filters</h2>
              <button 
                onClick={() => this.setState({ showFilters: false })}
                className="text-gray-500 hover:text-gray-700 p-1"
              >
                <FiX size={24} />
              </button>
            </div>

            {/* Categories Filter */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Categories</h3>
              <div className="space-y-2">
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => this.handleFilterChange("selectedCategory", category)}
                    className={`block w-full text-left px-3 py-2 rounded-md ${
                      selectedCategory === category 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range Filter */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Price Range</h3>
              <div className="space-y-2">
                {priceRanges.map(range => (
                  <button
                    key={range.value}
                    onClick={() => this.handleFilterChange("priceRange", range.value)}
                    className={`block w-full text-left px-3 py-2 rounded-md ${
                      priceRange === range.value 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    {range.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Rating Filter */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Customer Rating</h3>
              <div className="space-y-2">
                {ratingFilters.map(filter => (
                  <button
                    key={filter.value}
                    onClick={() => this.handleFilterChange("ratingFilter", filter.value)}
                    className={`flex items-center w-full text-left px-3 py-2 rounded-md ${
                      ratingFilter === filter.value 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    {filter.value !== "all" && (
                      <div className="flex mr-2">
                        {this.renderRatingStars(Number(filter.value))}
                      </div>
                    )}
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort Options */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Sort By</h3>
              <div className="space-y-2">
                {sortOptions.map(option => (
                  <button
                    key={option.value}
                    onClick={() => this.handleFilterChange("sortOption", option.value)}
                    className={`block w-full text-left px-3 py-2 rounded-md ${
                      sortOption === option.value 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={this.resetFilters}
              className="w-full bg-gray-200 text-gray-800 py-2 rounded-md hover:bg-gray-300 transition font-medium"
            >
              Reset All Filters
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div className="flex items-center">
              <Link 
                to="/" 
                className="flex items-center text-blue-600 hover:text-blue-800 transition font-medium"
              >
                <FiArrowLeft className="mr-2" /> Back to Home
              </Link>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 ml-4">All Products</h1>
            </div>

            {/* Search Bar */}
            <div className="relative w-full md:w-72">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => this.handleFilterChange("searchQuery", e.target.value)}
                className="block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Desktop Filters Sidebar */}
            <div className="hidden lg:block lg:w-72">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-bold text-gray-900">Filters</h2>
                  <button 
                    onClick={this.resetFilters}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    Reset All
                  </button>
                </div>

                {/* Categories Filter */}
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Categories</h3>
                  <div className="space-y-2">
                    {categories.map(category => (
                      <button
                        key={category}
                        onClick={() => this.handleFilterChange("selectedCategory", category)}
                        className={`block w-full text-left px-3 py-2 rounded-md ${
                          selectedCategory === category 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'hover:bg-gray-100'
                        }`}
                      >
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Range Filter */}
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Price Range</h3>
                  <div className="space-y-2">
                    {priceRanges.map(range => (
                      <button
                        key={range.value}
                        onClick={() => this.handleFilterChange("priceRange", range.value)}
                        className={`block w-full text-left px-3 py-2 rounded-md ${
                          priceRange === range.value 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'hover:bg-gray-100'
                        }`}
                      >
                        {range.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Rating Filter */}
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Customer Rating</h3>
                  <div className="space-y-2">
                    {ratingFilters.map(filter => (
                      <button
                        key={filter.value}
                        onClick={() => this.handleFilterChange("ratingFilter", filter.value)}
                        className={`flex items-center w-full text-left px-3 py-2 rounded-md ${
                          ratingFilter === filter.value 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'hover:bg-gray-100'
                        }`}
                      >
                        {filter.value !== "all" && (
                          <div className="flex mr-2">
                            {this.renderRatingStars(Number(filter.value))}
                          </div>
                        )}
                        {filter.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sort Options */}
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Sort By</h3>
                  <div className="space-y-2">
                    {sortOptions.map(option => (
                      <button
                        key={option.value}
                        onClick={() => this.handleFilterChange("sortOption", option.value)}
                        className={`block w-full text-left px-3 py-2 rounded-md ${
                          sortOption === option.value 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'hover:bg-gray-100'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Products Section */}
            <div className="flex-1">
              {/* Mobile Filter Button */}
              <button
                onClick={() => this.setState({ showFilters: true })}
                className="lg:hidden flex items-center justify-center bg-blue-600 text-white px-4 py-2 rounded-md mb-4 w-full hover:bg-blue-700 transition"
              >
                <FiFilter className="mr-2" /> Filters
              </button>

              {/* Products Count and Active Filters */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
                <div className="text-sm text-gray-600">
                  Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
                </div>
                {(selectedCategory !== "all" || priceRange !== "all" || ratingFilter !== "all" || searchQuery) && (
                  <button
                    onClick={this.resetFilters}
                    className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                  >
                    Clear all filters
                  </button>
                )}
              </div>

              {/* Products Grid */}
              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                  {filteredProducts.map((product) => (
                    <div 
                      key={product._id} 
                      className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition hover:-translate-y-1"
                    >
                      <Link to={`/product/${product._id}`} className="block">
                        <div className="relative pt-[100%] bg-gray-50">
                          <img
                            src={product.imageUrl}
                            alt={product.title}
                            className="absolute top-0 left-0 w-full h-full object-contain p-4"
                            loading="lazy"
                          />
                        </div>
                      </Link>
                      <div className="p-4">
                        <div className="flex justify-between items-start gap-2">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-gray-900 truncate">{product.title}</h3>
                            <p className="text-xs text-gray-500 capitalize">{product.category}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-blue-600">₹{product.price.toFixed(2)}</p>
                            {product.originalPrice && (
                              <p className="text-xs text-gray-500 line-through">₹{product.originalPrice.toFixed(2)}</p>
                            )}
                          </div>
                        </div>
                        <div className="mt-2 flex items-center">
                          <div className="flex">
                            {this.renderRatingStars(product.rating || 4.5)}
                          </div>
                          <span className="ml-1 text-xs text-gray-500">({product.reviews || 24})</span>
                        </div>
                        <button className="mt-4 w-full flex items-center justify-center bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition font-medium">
                          <FiShoppingCart className="mr-2" /> Add to Cart
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                  <div className="max-w-md mx-auto">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <h3 className="mt-2 text-lg font-medium text-gray-900">No products found</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Try adjusting your search or filter to find what you're looking for.
                    </p>
                    <div className="mt-6">
                      <button
                        onClick={this.resetFilters}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Reset all filters
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}