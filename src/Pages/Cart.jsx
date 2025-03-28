import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FiTrash2, FiShoppingBag, FiArrowLeft } from "react-icons/fi";
import { useBackend } from "../context";

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { BACKEND_URL } = useBackend();

  // Fetch userId from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("e-user");
    const parsedUser = storedUser ? JSON.parse(storedUser) : null;
    const userId = parsedUser ? parsedUser._id : null;

    if (userId) {
      setUserId(userId);
    } else {
      console.error("User ID not found in localStorage");
      setLoading(false);
    }
  }, []);

  // Fetch Cart Items
  useEffect(() => {
    if (!userId) return;

    axios
      .get(`${BACKEND_URL}/api/cart/${userId}`)
      .then((response) => {
        if (response.data.success && response.data.cart?.products) {
          setCart(response.data.cart.products);
        } else {
          setCart([]);
        }
      })
      .catch((error) => console.error("Error fetching cart:", error))
      .finally(() => setLoading(false));
  }, [userId]);

  // Remove item from cart
  const removeFromCart = (itemId) => {
    if (!userId) return;

    axios
      .delete(`${BACKEND_URL}/api/cart/remove`, {
        data: { userId, itemId },
      })
      .then((response) => {
        if (response.data.success) {
          setCart((prevCart) => prevCart.filter((item) => item._id !== itemId));
        }
      })
      .catch((error) => console.error("Error removing item:", error));
  };

  // Update quantity
  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    
    axios
      .put(`${BACKEND_URL}/api/cart/update`, {
        userId,
        itemId,
        quantity: newQuantity
      })
      .then((response) => {
        if (response.data.success) {
          setCart(prevCart => 
            prevCart.map(item => 
              item._id === itemId ? { ...item, quantity: newQuantity } : item
            )
          );
        }
      })
      .catch((error) => console.error("Error updating quantity:", error));
  };

  // Calculate totals
  const subtotal = cart.reduce(
    (sum, item) => sum + (item.cartItem?.price || 0) * item.quantity,
    0
  );
  const shipping = subtotal > 1000 ? 0 : 50;
  const tax = subtotal * 0.1;
  const totalPrice = subtotal + shipping + tax;

  const proceedToCheckout = () => {
    navigate("/order", { state: { cart, totalPrice, userId } });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
        <div className="bg-white p-8 rounded-xl shadow-sm max-w-md w-full text-center">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiShoppingBag className="w-10 h-10 text-blue-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">
            Looks like you haven't added any items to your cart yet
          </p>
          <button
            onClick={() => navigate("/all-products")}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-medium"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-blue-600 hover:text-blue-800"
          >
            <FiArrowLeft className="mr-2" /> Back to Shop
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Your Shopping Cart</h1>
          <div className="w-8"></div> {/* Spacer for alignment */}
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items */}
          <div className="lg:w-2/3">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              {/* Table Header */}
              <div className="hidden md:grid grid-cols-12 bg-gray-100 p-4 border-b">
                <div className="col-span-5 font-medium text-gray-700">Product</div>
                <div className="col-span-2 font-medium text-gray-700 text-center">Price</div>
                <div className="col-span-3 font-medium text-gray-700 text-center">Quantity</div>
                <div className="col-span-2 font-medium text-gray-700 text-right">Total</div>
              </div>

              {/* Cart Items */}
              {cart.map((item) => (
                <div key={item._id} className="grid grid-cols-12 p-4 border-b hover:bg-gray-50 transition">
                  {/* Product Info */}
                  <div className="col-span-12 md:col-span-5 flex items-center">
                    <img
                      src={item.cartItem?.imageUrl || "/placeholder.jpg"}
                      alt={item.cartItem?.name}
                      className="w-20 h-20 object-cover rounded-lg border mr-4"
                    />
                    <div>
                      <h3 className="font-medium text-gray-900">{item.cartItem?.name}</h3>
                      <p className="text-sm text-gray-500">{item.cartItem?.category}</p>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="col-span-4 md:col-span-2 flex items-center justify-start md:justify-center mt-4 md:mt-0">
                    <span className="font-medium">${item.cartItem?.price?.toFixed(2)}</span>
                  </div>

                  {/* Quantity */}
                  <div className="col-span-4 md:col-span-3 flex items-center justify-center mt-4 md:mt-0">
                    <div className="flex items-center border rounded-md">
                      <button
                        onClick={() => updateQuantity(item._id, item.quantity - 1)}
                        className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                      >
                        -
                      </button>
                      <span className="px-3 py-1 border-x">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item._id, item.quantity + 1)}
                        className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Total & Remove */}
                  <div className="col-span-4 md:col-span-2 flex items-center justify-end mt-4 md:mt-0">
                    <span className="font-medium mr-4">
                      ${(item.cartItem?.price * item.quantity).toFixed(2)}
                    </span>
                    <button
                      onClick={() => removeFromCart(item._id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-4">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">${shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax (10%)</span>
                  <span className="font-medium">${tax.toFixed(2)}</span>
                </div>
                <div className="border-t pt-4 flex justify-between">
                  <span className="font-bold text-gray-900">Total</span>
                  <span className="font-bold text-blue-600">${totalPrice.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={proceedToCheckout}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-medium shadow-md"
              >
                Proceed to Checkout
              </button>

              <div className="mt-4 text-center">
                <p className="text-sm text-gray-500">
                  or{' '}
                  <button 
                    onClick={() => navigate("/products")}
                    className="text-blue-600 hover:underline"
                  >
                    Continue Shopping
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;