import React, { Component } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Heart, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default class WishlistProducts extends Component {
  state = {
    wishlist: [],
    isLoading: true
  };

  componentDidMount() {
    this.loadWishlist();
  }

  // Load the wishlist for the logged-in user
  loadWishlist = () => {
    const user = JSON.parse(localStorage.getItem("e-user"));
    if (!user) {
      this.setState({ isLoading: false });
      return;
    }

    const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    const userWishlist = wishlist.find((entry) => entry.userId === user._id);

    // Simulate loading for better UX
    setTimeout(() => {
      this.setState({ 
        wishlist: userWishlist ? userWishlist.products : [],
        isLoading: false
      });
    }, 500);
  };

  // Remove a product from the wishlist
  removeFromWishlist = (productId) => {
    const user = JSON.parse(localStorage.getItem("e-user"));
    if (!user) return;

    let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    const userWishlistIndex = wishlist.findIndex((entry) => entry.userId === user._id);

    if (userWishlistIndex !== -1) {
      wishlist[userWishlistIndex].products = wishlist[userWishlistIndex].products.filter(
        (product) => product._id !== productId
      );

      if (wishlist[userWishlistIndex].products.length === 0) {
        wishlist.splice(userWishlistIndex, 1);
      }

      localStorage.setItem("wishlist", JSON.stringify(wishlist));
      this.loadWishlist();
      toast.success("Removed from wishlist", { 
        position: "top-center",
        icon: <Heart className="text-red-500" />
      });
    }
  };

  render() {
    const { wishlist, isLoading } = this.state;

    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header with back button */}
          <div className="flex items-center justify-between mb-8">
            <Link 
              to="/" 
              className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span className="text-lg font-medium">Back to Shopping</span>
            </Link>
            
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <Heart className="h-8 w-8 text-red-500 mr-2" />
              My Wishlist
            </h1>
          </div>

          {/* Content */}
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
          ) : wishlist.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {wishlist.map((product) => (
                <div
                  key={product._id}
                  className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300 group relative"
                >
                  {/* Remove button */}
                  <button
                    onClick={() => this.removeFromWishlist(product._id)}
                    className="absolute top-3 right-3 z-10 p-2 bg-white rounded-full shadow-md hover:bg-red-50 text-gray-500 hover:text-red-500 transition-colors"
                    aria-label="Remove from wishlist"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>

                  {/* Product image */}
                  <Link to={`/product/${product._id}`} className="block relative pt-[100%] overflow-hidden">
                    <img
                      src={product.images[0] || "https://via.placeholder.com/300"}
                      alt={product.name}
                      className="absolute top-0 left-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </Link>

                  {/* Product info */}
                  <div className="p-4">
                    <Link to={`/product/${product._id}`} className="block">
                      <h3 className="font-medium text-gray-900 line-clamp-1 hover:text-indigo-600 transition-colors">
                        {product.name}
                      </h3>
                    </Link>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-lg font-bold text-indigo-600">${product.price}</span>
                      <button className="px-3 py-1 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700 transition-colors">
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="mx-auto h-24 w-24 text-gray-400 mb-4">
                <Heart className="h-full w-full" strokeWidth={1} />
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">Your wishlist is empty</h3>
              <p className="text-gray-500 max-w-md mx-auto">
                You haven't added any items to your wishlist yet. Start shopping to add your favorite products!
              </p>
              <Link
                to="/"
                className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Browse Products
              </Link>
            </div>
          )}
        </div>
      </div>
    );
  }
}