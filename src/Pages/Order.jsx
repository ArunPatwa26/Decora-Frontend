import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { FiArrowLeft, FiCreditCard, FiDollarSign, FiMapPin, FiShoppingBag } from "react-icons/fi";
import { useBackend } from "../context";

const OrderPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [cart, setCart] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [userId, setUserId] = useState(null);
  const [address, setAddress] = useState({ street: "", city: "", state: "", pincode: "" });
  const [showModal, setShowModal] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("");
    const { BACKEND_URL } = useBackend();

  useEffect(() => {
    if (location.state) {
      const { cart = [], totalPrice = 0, userId = null } = location.state;
      setCart(cart);
      setTotalPrice(totalPrice);
      setUserId(userId);
    }
  }, [location.state]);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleAddressChange = (e) => {
    setAddress((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleClearCart = async () => {
    try {
      await axios.delete(`${BACKEND_URL}/api/cart/clear/${userId}`);
      setCart([]);
    } catch (error) {
      console.error("Error clearing cart:", error);
    }
  };

  const handleRazorpayPayment = async () => {
    if (!window.Razorpay) {
      alert("Razorpay SDK not loaded. Please check your internet connection.");
      return;
    }

    const options = {
      key: "rzp_test_LoIkTKPLTo0StT",
      amount: totalPrice * 100,
      currency: "INR",
      name: "My Shop",
      description: "Order Payment",
      handler: async (response) => {
        await handleOrder("Online Payment", response.razorpay_payment_id);
      },
      prefill: { name: "User Name", email: "user@example.com", contact: "9999999999" },
      theme: { color: "#3399cc" },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const handleOrder = async (method, paymentId = null) => {
    if (!Object.values(address).every((value) => value.trim())) {
      alert("Please fill in all address fields");
      return;
    }
    if (!method) {
      alert("Please select a payment method");
      return;
    }

    const orderData = {
      user_id: String(userId),
      cart: cart.map(({ cartItem, quantity }) => ({
        cartItem: String(cartItem?._id),
        quantity: Number(quantity),
      })),
      address: { ...address, pincode: String(address.pincode) },
      total_price: Number(totalPrice),
      payment_method: method,
      transaction_id: paymentId,
    };

    try {
      await axios.post(`${BACKEND_URL}/api/order/create`, orderData);
      alert("Order placed successfully!");
      await handleClearCart();
      navigate("/orders");
    } catch (error) {
      alert(`Failed to place order: ${error.response?.data?.message || "Unknown error"}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-blue-600 hover:text-blue-800 mr-4"
          >
            <FiArrowLeft className="mr-2" /> Back
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>
        </div>

        {/* Order Summary Card */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <FiShoppingBag className="mr-2 text-blue-500" />
              Order Summary
            </h2>
          </div>

          {cart.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              Your cart is empty
            </div>
          ) : (
            <>
              <div className="divide-y">
                {cart.map(({ cartItem, quantity }, index) => (
                  <div key={index} className="flex items-center p-4 hover:bg-gray-50">
                    <img 
                      src={cartItem?.imageUrl} 
                      alt={cartItem?.category} 
                      className="w-16 h-16 object-cover rounded-lg border mr-4"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 capitalize">{cartItem?.category}</h3>
                      <p className="text-sm text-gray-500">Quantity: {quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">₹{cartItem?.price * quantity}</p>
                      <p className="text-sm text-gray-500">₹{cartItem?.price} each</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-6 border-t">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">₹{totalPrice}</span>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">₹0</span>
                </div>
                <div className="flex justify-between items-center mt-4 pt-4 border-t">
                  <span className="text-lg font-bold text-gray-900">Total</span>
                  <span className="text-xl font-bold text-blue-600">₹{totalPrice}</span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Checkout Button */}
        {cart.length > 0 && (
          <button
            onClick={() => setShowModal("address")}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium shadow-md transition"
          >
            Proceed to Payment
          </button>
        )}

        {/* Address Modal */}
        {showModal === "address" && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-md">
              <div className="p-6 border-b">
                <h3 className="text-lg font-bold text-gray-900 flex items-center">
                  <FiMapPin className="mr-2 text-blue-500" />
                  Shipping Address
                </h3>
              </div>
              <div className="p-6">
                {["street", "city", "state", "pincode"].map((field) => (
                  <div key={field} className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                      {field}
                    </label>
                    <input
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      name={field}
                      placeholder={`Enter ${field}`}
                      value={address[field]}
                      onChange={handleAddressChange}
                    />
                  </div>
                ))}
              </div>
              <div className="p-6 border-t flex justify-end space-x-3">
                <button
                  onClick={() => setShowModal(null)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setShowModal("payment")}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Continue
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Payment Method Modal */}
        {showModal === "payment" && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-md">
              <div className="p-6 border-b">
                <h3 className="text-lg font-bold text-gray-900 flex items-center">
                  <FiCreditCard className="mr-2 text-blue-500" />
                  Payment Method
                </h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div 
                    className={`flex items-center p-4 border rounded-lg cursor-pointer ${paymentMethod === "Online Payment" ? "border-blue-500 bg-blue-50" : "border-gray-300"}`}
                    onClick={() => setPaymentMethod("Online Payment")}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="Online Payment"
                      className="mr-3 h-5 w-5 text-blue-600"
                      checked={paymentMethod === "Online Payment"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <div>
                      <h4 className="font-medium text-gray-900">Online Payment</h4>
                      <p className="text-sm text-gray-500">Pay with credit/debit card or UPI</p>
                    </div>
                  </div>
                  <div 
                    className={`flex items-center p-4 border rounded-lg cursor-pointer ${paymentMethod === "Cash On Delivery" ? "border-blue-500 bg-blue-50" : "border-gray-300"}`}
                    onClick={() => setPaymentMethod("Cash On Delivery")}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="Cash On Delivery"
                      className="mr-3 h-5 w-5 text-blue-600"
                      checked={paymentMethod === "Cash On Delivery"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <div>
                      <h4 className="font-medium text-gray-900">Cash on Delivery</h4>
                      <p className="text-sm text-gray-500">Pay when you receive your order</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-6 border-t flex justify-end space-x-3">
                <button
                  onClick={() => setShowModal("address")}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Back
                </button>
                <button
                  onClick={paymentMethod === "Online Payment" ? handleRazorpayPayment : () => handleOrder(paymentMethod)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
                >
                  {paymentMethod === "Online Payment" ? (
                    <>
                      <FiCreditCard className="mr-2" /> Pay Now
                    </>
                  ) : (
                    <>
                      <FiDollarSign className="mr-2" /> Place Order
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderPage;