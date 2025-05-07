import React, { Component } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Heart, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default class Wishlist extends Component {
  state = {
    wishlist: [],
    isLoading: true,
  };

  componentDidMount() {
    this.loadWishlist();
  }

  loadWishlist = () => {
    const user = JSON.parse(localStorage.getItem("e-user"));
    if (!user) {
      this.setState({ isLoading: false });
      return;
    }

    const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    const userWishlist = wishlist.find((entry) => entry.userId === user._id);

    setTimeout(() => {
      this.setState({
        wishlist: userWishlist ? userWishlist.products : [],
        isLoading: false,
      });
    }, 500);
  };

  removeFromWishlist = (productId) => {
    const user = JSON.parse(localStorage.getItem("e-user"));
    if (!user) return;

    let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    const userWishlistIndex = wishlist.findIndex(
      (entry) => entry.userId === user._id
    );

    if (userWishlistIndex !== -1) {
      wishlist[userWishlistIndex].products =
        wishlist[userWishlistIndex].products.filter(
          (product) => product._id !== productId
        );

      if (wishlist[userWishlistIndex].products.length === 0) {
        wishlist.splice(userWishlistIndex, 1);
      }

      localStorage.setItem("wishlist", JSON.stringify(wishlist));
      this.loadWishlist();
      toast.success("Removed from wishlist", {
        position: "top-center",
        icon: <Heart className="text-red-500" />,
      });
    }
  };

  render() {
    const { wishlist, isLoading } = this.state;

    return (
      <div className="min-h-screen bg-white py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
            <Link
              to="/"
              className="mb-4 sm:mb-0 flex items-center text-indigo-600 hover:text-indigo-800 text-base font-medium"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Shopping
            </Link>

            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center">
              <Heart className="w-7 h-7 text-red-500 mr-2" />
              My Wishlist
            </h1>
          </div>

          {/* Loader or Error or Content */}
          {isLoading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500" />
            </div>
          ) : wishlist.length > 0 ? (
            <div className="group relative bg-white rounded-lg overflow-hidden shadow-xs hover:shadow-sm transition-all duration-300">
              {wishlist.map((product) => (
                <div
                  key={product._id}
                  className="relative bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300"
                >
                  {/* Remove Button */}
                  <button
                    onClick={() => this.removeFromWishlist(product._id)}
                    className="absolute top-3 right-3 z-10 p-2 bg-white rounded-full shadow hover:bg-red-50 text-gray-500 hover:text-red-500 transition"
                    aria-label="Remove from wishlist"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>

                  {/* Product Image */}
                  <Link
                    to={`/product/${product._id}`}
                    className="block relative pt-[100%] overflow-hidden rounded-t-xl"
                  >
                    <img
                      src={product.images[0] || "https://via.placeholder.com/300"}
                      alt={product.name}
                      className="absolute top-0 left-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </Link>

                  {/* Product Info */}
                  <div className="p-4 flex flex-col justify-between h-[140px]">
                    <Link to={`/product/${product._id}`}>
                      <h3 className="text-sm font-medium text-gray-900 line-clamp-2 hover:text-indigo-600">
                        {product.name}
                      </h3>
                    </Link>
                    <div className="mt-2 flex justify-between items-center">
                      <span className="text-lg font-semibold text-indigo-600">
                      ₹{product.price}
                      </span>
                      <button className="text-sm px-3 py-1 rounded-md bg-indigo-600 text-white hover:bg-indigo-700">
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Heart className="w-16 h-16 mx-auto text-gray-300 mb-4" strokeWidth={1} />
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                Your wishlist is empty
              </h3>
              <p className="text-sm text-gray-500 mb-6 max-w-sm mx-auto">
                You haven’t added anything yet. Start shopping to add products you love.
              </p>
              <Link
                to="/"
                className="inline-block px-5 py-2 bg-indigo-600 text-white text-sm font-medium rounded hover:bg-indigo-700 transition"
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
