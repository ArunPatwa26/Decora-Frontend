import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FiArrowLeft, FiHeart, FiShoppingCart, FiShare2, FiMinus, FiPlus } from "react-icons/fi";
import { FaStar, FaRegStar, FaStarHalfAlt } from "react-icons/fa";
import { useBackend } from "../context";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mainImage, setMainImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const { BACKEND_URL } = useBackend();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/products/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch product");
        }
        const data = await response.json();
        setProduct(data);
        setMainImage(data.images ? data.images[0] : "https://via.placeholder.com/800");
        if (data.colors?.length > 0) setSelectedColor(data.colors[0]);
        if (data.sizes?.length > 0) setSelectedSize(data.sizes[0]);
        fetchRelatedProducts(data.category, data.id);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const fetchRelatedProducts = async (category, currentProductId) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/products/category/${category}`);
      if (!response.ok) {
        throw new Error("Failed to fetch related products");
      }
      const data = await response.json();
      const filteredProducts = data.filter((item) => item._id !== currentProductId).slice(0, 4);
      setRelatedProducts(filteredProducts);
    } catch (err) {
      console.error("Error fetching related products:", err.message);
    }
  };

  const addToWishlist = (product) => {
    const user = JSON.parse(localStorage.getItem("e-user"));
    if (!user) {
      navigate("/login");
      return;
    }

    let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    const userWishlistIndex = wishlist.findIndex((entry) => entry.userId === user._id);

    if (userWishlistIndex !== -1) {
      const isProductInWishlist = wishlist[userWishlistIndex].products.some((item) => item.id === product.id);
      if (isProductInWishlist) {
        toast.info(`${product.name} is already in your wishlist!`);
        return;
      }
      wishlist[userWishlistIndex].products.push(product);
    } else {
      wishlist.push({ userId: user._id, products: [product] });
    }

    localStorage.setItem("wishlist", JSON.stringify(wishlist));
    toast.success(`${product.name} added to wishlist!`);
  };

  const addToCart = async (cartItem) => {
    const user = JSON.parse(localStorage.getItem("e-user"));

    if (!user || !user._id) {
      navigate("/login");
      return;
    }

    try {
      const response = await fetch(`${BACKEND_URL}/api/cart/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user._id,
          cartItem: {
            ...cartItem,
            selectedColor,
            selectedSize
          },
          quantity,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(`${cartItem.name} added to cart successfully!`);
        setTimeout(() => {
          navigate("/cart");
        }, 1500);
      } else {
        toast.error("Failed to add item to cart.");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Something went wrong!");
    }
  };

  const renderRatingStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<FaStar key={i} className="text-yellow-400" />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<FaStarHalfAlt key={i} className="text-yellow-400" />);
      } else {
        stars.push(<FaRegStar key={i} className="text-yellow-400" />);
      }
    }
    
    return stars;
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 max-w-md">
        <p className="font-bold">Error</p>
        <p>{error}</p>
      </div>
    </div>
  );

  if (!product) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 max-w-md">
        <p className="font-bold">Not Found</p>
        <p>Product not found</p>
      </div>
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen">
      <ToastContainer position="top-center" autoClose={2000} />
      
      {/* Product Main Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-blue-600 hover:text-blue-800 mb-6 transition"
        >
          <FiArrowLeft className="mr-2" /> Back to Products
        </button>

        {/* Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <img
                src={mainImage}
                alt={product.name}
                className="w-full h-96 object-contain p-4"
              />
            </div>
            
            {/* Thumbnail Gallery */}
            <div className="grid grid-cols-4 gap-3">
              {product.images?.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setMainImage(img)}
                  className={`bg-white rounded-lg overflow-hidden border-2 ${mainImage === img ? 'border-blue-500' : 'border-transparent'}`}
                >
                  <img
                    src={img}
                    alt={product.name}
                    className="w-full h-20 object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
                <div className="flex items-center mt-2">
                  <div className="flex mr-2">
                    {renderRatingStars(product.rating || 4.5)}
                  </div>
                  <span className="text-sm text-gray-500">({product.reviews || 24} reviews)</span>
                </div>
              </div>
              <button 
                onClick={() => addToWishlist(product)}
                className="text-gray-400 hover:text-red-500 transition"
              >
                <FiHeart className="w-6 h-6" />
              </button>
            </div>

            <div className="mt-4">
              <p className="text-3xl font-bold text-gray-900">${product.price}</p>
              {product.originalPrice && (
                <p className="text-sm text-gray-500 line-through">${product.originalPrice}</p>
              )}
            </div>

            <div className="mt-6">
              <p className="text-gray-700">{product.description || "No description available."}</p>
            </div>

            {/* Color Selection */}
            {product.colors?.length > 0 && (
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-900">Color</h3>
                <div className="flex space-x-2 mt-2">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`w-8 h-8 rounded-full border-2 ${selectedColor === color ? 'border-blue-500' : 'border-transparent'}`}
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Size Selection */}
            {product.sizes?.length > 0 && (
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-900">Size</h3>
                <div className="flex flex-wrap gap-2 mt-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 border rounded-md ${selectedSize === size ? 'bg-blue-100 border-blue-500 text-blue-700' : 'border-gray-300 text-gray-700'}`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-900">Quantity</h3>
              <div className="flex items-center mt-2">
                <button
                  onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                  className="p-2 border border-gray-300 rounded-l-md hover:bg-gray-50"
                >
                  <FiMinus className="w-4 h-4" />
                </button>
                <span className="px-4 py-2 border-t border-b border-gray-300 text-center w-12">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((prev) => prev + 1)}
                  className="p-2 border border-gray-300 rounded-r-md hover:bg-gray-50"
                >
                  <FiPlus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => addToCart(product)}
                className="flex-1 flex items-center justify-center bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition font-medium"
              >
                <FiShoppingCart className="mr-2" /> Add to Cart
              </button>
              <button className="flex-1 flex items-center justify-center bg-gray-100 text-gray-800 px-6 py-3 rounded-md hover:bg-gray-200 transition font-medium">
                <FiShare2 className="mr-2" /> Share
              </button>
            </div>

            {/* Additional Info */}
            <div className="mt-8 border-t border-gray-200 pt-6">
              <h3 className="text-sm font-medium text-gray-900">Details</h3>
              <div className="mt-2 space-y-2">
                <p className="text-sm text-gray-600"><span className="font-medium">Category:</span> {product.category || "N/A"}</p>
                <p className="text-sm text-gray-600"><span className="font-medium">SKU:</span> {product.sku || "N/A"}</p>
                <p className="text-sm text-gray-600"><span className="font-medium">Availability:</span> {product.stock > 0 ? `In Stock (${product.stock})` : "Out of Stock"}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">You May Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <div 
                  key={relatedProduct._id} 
                  className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition cursor-pointer"
                  onClick={() => navigate(`/product/${relatedProduct._id}`)}
                >
                  <div className="p-4">
                    <img
                      src={relatedProduct.imageUrl}
                      alt={relatedProduct.name}
                      className="w-full h-48 object-contain"
                    />
                  </div>
                  <div className="p-4 border-t">
                    <h3 className="font-medium text-gray-900">{relatedProduct.name}</h3>
                    <div className="mt-1 flex items-center justify-between">
                      <p className="text-lg font-bold text-blue-600">${relatedProduct.price}</p>
                      {relatedProduct.originalPrice && (
                        <p className="text-sm text-gray-500 line-through">${relatedProduct.originalPrice}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;