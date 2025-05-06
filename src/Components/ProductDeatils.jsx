import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  FiArrowLeft,
  FiHeart,
  FiShoppingCart,
  FiShare2,
  FiMinus,
  FiPlus,
  FiMessageSquare,
  FiImage,
  FiUser,
  FiX,
  FiChevronLeft,
  FiChevronRight,
  FiTruck,
  FiShield ,
  FiRepeat ,
  FiCreditCard ,
  FiHeadphones ,
  FiThumbsUp ,
  FiLoader ,
} from "react-icons/fi";
import { FaStar, FaRegStar, FaStarHalfAlt } from "react-icons/fa";
import { useBackend } from "../context";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mainImage, setMainImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [formData, setFormData] = useState({
    rating: 5,
    message: "",
    image: null,
    previewImage: "",
  });
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const { BACKEND_URL } = useBackend();

  useEffect(() => {
    if (!id) return;

    const fetchProductData = async () => {
      try {
        setLoading(true);
        const [productRes, reviewsRes] = await Promise.all([
          fetch(`${BACKEND_URL}/api/products/${id}`),
          fetch(`${BACKEND_URL}/api/reviews/product/${id}`),
        ]);

        if (!productRes.ok) throw new Error("Failed to fetch product");
        if (!reviewsRes.ok) throw new Error("Failed to fetch reviews");

        const productData = await productRes.json();
        const reviewsData = await reviewsRes.json();

        setProduct(productData);
        setReviews(reviewsData.reviews || []);
        setMainImage(
          productData.images?.[0] || "https://via.placeholder.com/800"
        );
        if (productData.colors?.length > 0)
          setSelectedColor(productData.colors[0]);
        if (productData.sizes?.length > 0)
          setSelectedSize(productData.sizes[0]);

        const relatedRes = await fetch(
          `${BACKEND_URL}/api/products/category/${productData.category}`
        );
        if (relatedRes.ok) {
          const relatedData = await relatedRes.json();
          setRelatedProducts(
            relatedData
              .filter((item) => item._id !== productData._id)
              .slice(0, 4)
          );
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
  }, [id, BACKEND_URL]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size > 2 * 1024 * 1024) {
      toast.error("Image size should be less than 2MB");
      return;
    }
    if (file) {
      setFormData({
        ...formData,
        image: file,
        previewImage: URL.createObjectURL(file),
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmittingReview(true);

    const user = JSON.parse(localStorage.getItem("e-user"));
    if (!user) {
      toast.error("Please login to submit a review");
      setIsSubmittingReview(false);
      navigate("/login");
      return;
    }

    if (!formData.message.trim()) {
      toast.error("Please write your review message");
      setIsSubmittingReview(false);
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("productId", product._id);
    formDataToSend.append("userId", user._id);
    formDataToSend.append("message", formData.message);
    formDataToSend.append("rating", formData.rating);

    if (formData.image) {
      formDataToSend.append("image", formData.image);
    }

    try {
      const response = await fetch(`${BACKEND_URL}/api/reviews/create`, {
        method: "POST",
        body: formDataToSend,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to submit review");
      }

      toast.success("Review submitted successfully!");
      setReviews([data.review, ...reviews]);

      setFormData({
        rating: 5,
        message: "",
        image: null,
        previewImage: "",
      });
      setShowReviewForm(false);
    } catch (err) {
      console.error("Error submitting review:", err);
      toast.error(err.message || "Failed to submit review");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const addToWishlist = (product) => {
    const user = JSON.parse(localStorage.getItem("e-user"));
    if (!user) {
      navigate("/login");
      return;
    }

    let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    const userWishlistIndex = wishlist.findIndex(
      (entry) => entry.userId === user._id
    );

    if (userWishlistIndex !== -1) {
      const isProductInWishlist = wishlist[userWishlistIndex].products.some(
        (item) => item.id === product.id
      );
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
            selectedSize,
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

  const renderRatingStars = (rating, interactive = false) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(
          <button
            key={i}
            type={interactive ? "button" : undefined}
            onClick={
              interactive
                ? () => setFormData({ ...formData, rating: i })
                : undefined
            }
          >
            <FaStar className="text-yellow-400" />
          </button>
        );
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(
          <button
            key={i}
            type={interactive ? "button" : undefined}
            onClick={
              interactive
                ? () => setFormData({ ...formData, rating: i - 0.5 })
                : undefined
            }
          >
            <FaStarHalfAlt className="text-yellow-400" />
          </button>
        );
      } else {
        stars.push(
          <button
            key={i}
            type={interactive ? "button" : undefined}
            onClick={
              interactive
                ? () => setFormData({ ...formData, rating: i })
                : undefined
            }
          >
            <FaRegStar className="text-yellow-400" />
          </button>
        );
      }
    }

    return <div className="flex space-x-1">{stars}</div>;
  };

  const openImageModal = (index) => {
    setSelectedImageIndex(index);
    setCurrentImageIndex(index);
  };

  const closeImageModal = () => {
    setSelectedImageIndex(null);
  };

  const navigateImage = (direction) => {
    const reviewsWithImages = reviews.filter((review) => review.image);
    if (direction === "prev") {
      setCurrentImageIndex((prev) =>
        prev === 0 ? reviewsWithImages.length - 1 : prev - 1
      );
    } else {
      setCurrentImageIndex((prev) =>
        prev === reviewsWithImages.length - 1 ? 0 : prev + 1
      );
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 max-w-md">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      </div>
    );

  if (!product)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 max-w-md">
          <p className="font-bold">Not Found</p>
          <p>Product not found</p>
        </div>
      </div>
    );

  const reviewsWithImages = reviews.filter((review) => review.image);

  return (
    <div className="bg-gray-50 min-h-screen">
      <ToastContainer position="top-center" autoClose={2000} />
  
      {/* Hero Banner */}
      
  
      {/* Product Main Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-blue-600 hover:text-blue-800 mb-6 transition-all text-sm font-medium hover:-translate-x-1"
        >
          <FiArrowLeft className="mr-2" /> Back to Products
        </button>
  
        {/* Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-all duration-300">
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
                  className={`bg-white rounded-lg overflow-hidden border-2 transition-all ${
                    mainImage === img 
                      ? "border-blue-500 scale-105 shadow-sm" 
                      : "border-transparent hover:border-gray-200"
                  }`}
                >
                  <img
                    src={img}
                    alt={product.name}
                    className="w-full h-20 object-cover"
                  />
                </button>
              ))}
            </div>
  
            {/* Product Video */}
          
          </div>
  
          {/* Product Info */}
          <div className="bg-white rounded-2xl shadow-sm p-6 lg:p-8 border border-gray-100">
            <div className="flex justify-between items-start">
              <div>
                <div className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mb-2 font-medium">
                  {product.category || "Featured"}
                </div>
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
                  {product.name}
                </h1>
                <div className="flex items-center mt-2">
                  <div className="flex mr-2">
                    {renderRatingStars(product.rating || 0)}
                  </div>
                  <span className="text-sm text-gray-500">
                    ({reviews.length} reviews) | <span className="text-green-600">In Stock</span>
                  </span>
                </div>
              </div>
              <button
                onClick={() => addToWishlist(product)}
                className={`p-2 rounded-full transition-all 
                  ? "text-red-500 bg-red-50 hover:bg-red-100" 
                  : "text-gray-400 hover:text-red-500 hover:bg-gray-50"}`}
              >
                <FiHeart className="w-6 h-6" />
              </button>
            </div>
  
            <div className="mt-4">
              <div className="flex items-center gap-3">
                <p className="text-3xl font-bold text-gray-900">
                ₹{product.price}
                </p>
                {product.originalPrice && (
                  <p className="text-sm text-gray-500 line-through">
                    ₹{product.originalPrice}
                  </p>
                )}
                {product.originalPrice && (
                  <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-0.5 rounded-full">
                    {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                  </span>
                )}
              </div>
            </div>
  
            <div className="mt-6">
              <p className="text-gray-700">
                {product.description || "No description available."}
              </p>
            </div>
  
            {/* Color Selection */}
            {product.colors?.length > 0 && (
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-900">Color</h3>
                <div className="flex flex-wrap gap-2 mt-2">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`w-8 h-8 rounded-full border-2 transition-all ${
                        selectedColor === color
                          ? "border-blue-500 scale-110 shadow-sm"
                          : "border-transparent hover:border-gray-200"
                      }`}
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
                      className={`px-4 py-2 border rounded-md transition-all ${
                        selectedSize === size
                          ? "bg-blue-100 border-blue-500 text-blue-700 scale-105"
                          : "border-gray-300 text-gray-700 hover:border-gray-400"
                      }`}
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
                  className="p-2 border border-gray-300 rounded-l-md hover:bg-gray-50 transition-all active:bg-gray-100"
                >
                  <FiMinus className="w-4 h-4" />
                </button>
                <span className="px-4 py-2 border-t border-b border-gray-300 text-center w-12">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((prev) => prev + 1)}
                  className="p-2 border border-gray-300 rounded-r-md hover:bg-gray-50 transition-all active:bg-gray-100"
                >
                  <FiPlus className="w-4 h-4" />
                </button>
              </div>
            </div>
  
            {/* Action Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => addToCart(product)}
                className="flex-1 flex items-center justify-center bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all font-medium shadow-sm hover:shadow-md active:scale-95"
              >
                <FiShoppingCart className="mr-2" /> Add to Cart
              </button>
              <button className="flex-1 flex items-center justify-center bg-gray-100 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-200 transition-all font-medium shadow-sm hover:shadow-md active:scale-95">
                <FiShare2 className="mr-2" /> Share
              </button>
            </div>
  
            
  
            {/* Additional Info */}
            <div className="mt-6 border-t border-gray-200 pt-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <FiShield className="text-gray-500" />
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">1 Year Warranty</h4>
                    <p className="text-xs text-gray-500">Manufacturer warranty</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <FiRepeat className="text-gray-500" />
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">30-Day Returns</h4>
                    <p className="text-xs text-gray-500">Money back guarantee</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <FiCreditCard className="text-gray-500" />
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">Secure Payment</h4>
                    <p className="text-xs text-gray-500">SSL encrypted</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
  
        
  
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                You May Also Like
              </h2>
              <button className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center">
                View all <FiChevronRight className="ml-1" />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <div
                  key={relatedProduct._id}
                  className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all cursor-pointer group border border-gray-100"
                  onClick={() => navigate(`/product/${relatedProduct._id}`)}
                >
                  <div className="relative">
                    <img
                      src={relatedProduct.imageUrl}
                      alt={relatedProduct.name}
                      className="w-full h-48 object-contain p-4"
                    />
                    <button className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                      <FiHeart className="text-gray-400 hover:text-red-500" />
                    </button>
                    {relatedProduct.originalPrice && (
                      <div className="absolute top-3 left-3 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                        SALE
                      </div>
                    )}
                  </div>
                  <div className="p-4 border-t">
                    <h3 className="font-medium text-gray-900 line-clamp-1">
                      {relatedProduct.name}
                    </h3>
                    <div className="mt-2 flex items-center">
                      <div className="flex mr-2">
                        {renderRatingStars(relatedProduct.rating || 0)}
                      </div>
                      <span className="text-xs text-gray-500">(24)</span>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <p className="text-lg font-bold text-blue-600">
                      ₹{relatedProduct.price}
                      </p>
                      {relatedProduct.originalPrice && (
                        <p className="text-sm text-gray-500 line-through">
                          ₹{relatedProduct.originalPrice}
                        </p>
                      )}
                    </div>
                    <button className="mt-3 w-full py-2 bg-gray-100 text-gray-800 rounded-md text-sm font-medium hover:bg-gray-200 transition-all">
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
  
        {/* Reviews Section */}
        <div className="mt-16">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Customer Reviews
            </h2>
            {localStorage.getItem("e-user") && (
              <button
                onClick={() => setShowReviewForm(!showReviewForm)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all text-sm font-medium shadow-sm hover:shadow-md"
              >
                {showReviewForm ? "Cancel" : "Write Review"}
              </button>
            )}
          </div>
  
          {/* Review Form */}
          {showReviewForm && (
            <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Write a Review</h3>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Rating
                  </label>
                  {renderRatingStars(formData.rating, true)}
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Review
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows="4"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    minLength="10"
                    placeholder="Share your experience with this product..."
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Image (Optional)
                  </label>
                  <div className="flex items-center gap-4">
                    <label className="cursor-pointer">
                      <div className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all">
                        Choose File
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                    {formData.previewImage && (
                      <div className="relative">
                        <img
                          src={formData.previewImage}
                          alt="Preview"
                          className="h-16 w-16 object-cover rounded-lg border border-gray-300"
                        />
                        <button 
                          type="button"
                          onClick={() => setFormData({...formData, previewImage: null})}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        >
                          <FiX size={12} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isSubmittingReview}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-medium shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmittingReview ? (
                      <span className="flex items-center">
                        <FiLoader className="animate-spin mr-2" /> Submitting...
                      </span>
                    ) : (
                      "Submit Review"
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}
  
          {/* Reviews Summary */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-5xl font-bold text-gray-900 mb-2">
                  {product.rating?.toFixed(1) || "0.0"}
                </div>
                <div className="flex justify-center mb-2">
                  {renderRatingStars(product.rating || 0)}
                </div>
                <p className="text-sm text-gray-600">
                  Based on {reviews.length} reviews
                </p>
              </div>
              <div className="space-y-3">
                {[5, 4, 3, 2, 1].map((star) => (
                  <div key={star} className="flex items-center gap-2">
                    <span className="text-sm font-medium w-8">{star} star</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-yellow-400 h-2.5 rounded-full" 
                        style={{ 
                          width: `${(reviews.filter(r => r.rating === star).length / reviews.length) * 100 || 0}%` 
                        }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600 w-8 text-right">
                      {reviews.filter(r => r.rating === star).length}
                    </span>
                  </div>
                ))}
              </div>
              <div className="flex flex-col justify-center">
                <h4 className="font-medium text-gray-900 mb-3">Share your thoughts</h4>
                <p className="text-sm text-gray-600 mb-4">
                  If you've used this product, share your experience with other customers
                </p>
                {!localStorage.getItem("e-user") ? (
                  <button
                    onClick={() => navigate("/login")}
                    className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-all text-sm font-medium"
                  >
                    Login to Review
                  </button>
                ) : (
                  <button
                    onClick={() => setShowReviewForm(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all text-sm font-medium"
                  >
                    Write a Review
                  </button>
                )}
              </div>
            </div>
          </div>
  
          {/* Reviews List */}
          <div className="space-y-6">
            {reviews.length > 0 ? (
              <>
                {/* Sorted Reviews */}
                {reviews.map((review) => (
                  <div
                    key={review._id}
                    className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 bg-gray-100 rounded-full p-2">
                        <FiUser className="text-gray-600" size={20} />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium text-gray-900">
                              {review.userId?.name || "Anonymous"}
                            </h4>
                            <p className="text-xs text-gray-500 mt-1">
                              {new Date(review.createdAt).toLocaleDateString(
                                "en-US",
                                {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                }
                              )}
                            </p>
                          </div>
                          <div className="flex">
                            {renderRatingStars(review.rating)}
                          </div>
                        </div>
                        <p className="mt-2 text-gray-700">
                          {review.message}
                        </p>
                        {review.image && (
                          <div className="mt-3">
                            <img
                              src={review.image}
                              alt="Review"
                              className="h-24 w-24 object-cover rounded-lg border border-gray-300 cursor-pointer hover:shadow-md transition-all"
                              onClick={() =>
                                openImageModal(
                                  reviewsWithImages.findIndex(
                                    (r) => r._id === review._id
                                  )
                                )}
                            />
                          </div>
                        )}
                        
                      </div>
                    </div>
                  </div>
                ))}
  
                {/* Gallery of all review images */}
                {reviewsWithImages.length > 0 && (
                  <div className="mt-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Customer Photos ({reviewsWithImages.length})
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                      {reviewsWithImages.map((review, index) => (
                        <div
                          key={review._id}
                          className="relative group overflow-hidden rounded-lg border border-gray-200 shadow-sm cursor-pointer hover:shadow-md transition-all"
                          onClick={() => openImageModal(index)}
                        >
                          <img
                            src={review.image}
                            alt="Review"
                            className="h-32 w-full object-cover transition-transform duration-200 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                            <div className="flex items-center text-white text-sm">
                              <FiThumbsUp className="mr-1" /> 12
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="bg-white rounded-xl shadow-sm p-8 text-center border border-gray-100">
                <FiMessageSquare className="mx-auto h-10 w-10 text-gray-400 mb-4" />
                <h3 className="text-xl font-medium text-gray-900 mb-2">
                  No reviews yet
                </h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  Be the first to share your thoughts about this product!
                </p>
                {!localStorage.getItem("e-user") ? (
                  <button
                    onClick={() => navigate("/login")}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-medium shadow-sm hover:shadow-md"
                  >
                    Login to Review
                  </button>
                ) : (
                  <button
                    onClick={() => setShowReviewForm(true)}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-medium shadow-sm hover:shadow-md"
                  >
                    Write a Review
                  </button>
                )}
              </div>
            )}
          </div>
  
          {/* Image Modal/Lightbox */}
          {selectedImageIndex !== null && (
            <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
              <button
                onClick={closeImageModal}
                className="absolute top-6 right-6 text-white hover:text-gray-300 p-2 rounded-full hover:bg-white/10 transition-all"
              >
                <FiX size={24} />
              </button>
  
              <button
                onClick={() => navigateImage("prev")}
                className="absolute left-6 text-white hover:text-gray-300 p-2 rounded-full hover:bg-white/10 transition-all"
                disabled={currentImageIndex === 0}
              >
                <FiChevronLeft size={32} />
              </button>
  
              <div className="max-w-4xl w-full max-h-screen flex items-center justify-center">
                <img
                  src={reviewsWithImages[currentImageIndex].image}
                  alt="Review"
                  className="max-w-full max-h-[80vh] object-contain"
                />
              </div>
  
              <button
                onClick={() => navigateImage("next")}
                className="absolute right-6 text-white hover:text-gray-300 p-2 rounded-full hover:bg-white/10 transition-all"
                disabled={currentImageIndex === reviewsWithImages.length - 1}
              >
                <FiChevronRight size={32} />
              </button>
  
              <div className="absolute bottom-6 left-0 right-0 text-center text-white text-sm">
                {currentImageIndex + 1} of {reviewsWithImages.length}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
