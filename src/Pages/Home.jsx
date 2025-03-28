import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Slider from "../Navbar/Slidder";
import { Star, ShoppingCart, ArrowRight, ChevronRight, ChevronLeft } from "lucide-react";
import { useBackend } from "../context";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { BACKEND_URL } = useBackend();
 

  useEffect(() => {
    fetch(`${BACKEND_URL}/api/products/all`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        return response.json();
      })
      .then((data) => {
        const categoryMap = {};
        data.forEach((product) => {
          if (!categoryMap[product.category]) {
            categoryMap[product.category] = {
              imageUrl: product.imageUrl,
              count: 1
            };
          } else {
            categoryMap[product.category].count += 1;
          }
        });

        const categories = Object.entries(categoryMap).map(([category, data]) => ({
          category,
          imageUrl: data.imageUrl,
          count: data.count
        }));

        setProducts(data.slice(0, 8));
        setCategories(categories);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, []);

  const addToCart = (product) => {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.push(product);
    localStorage.setItem("cart", JSON.stringify(cart));
    alert(`${product.name} added to cart!`);
  };

  return (
    <div className="bg-gray-50">
      {/* Hero Slider */}
      <Slider />

      {/* About Section */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Welcome to Decora</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Where beautiful spaces begin. We believe your home should tell your story through carefully curated decor that blends timeless elegance with contemporary design.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-6 rounded-xl">
              <div className="bg-blue-100 w-12 h-12 rounded-xl flex items-center justify-center mb-4 text-blue-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Premium Quality</h3>
              <p className="text-gray-600">
                Each piece in our collection is hand-selected for exceptional craftsmanship and lasting durability.
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-xl">
              <div className="bg-blue-100 w-12 h-12 rounded-xl flex items-center justify-center mb-4 text-blue-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Fast Delivery</h3>
              <p className="text-gray-600">
                Get your decor delivered quickly with our efficient shipping network across the country.
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-xl">
              <div className="bg-blue-100 w-12 h-12 rounded-xl flex items-center justify-center mb-4 text-blue-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Secure Payment</h3>
              <p className="text-gray-600">
                Shop with confidence using our 100% secure payment methods and buyer protection.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Shop by Category</h2>
            <p className="text-gray-600">Discover our curated collections for every space in your home</p>
          </div>
          
          {loading ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="text-center text-red-500 font-semibold">{error}</div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {categories.map((categoryItem) => (
                <Link
                  key={categoryItem.category}
                  to={`/products/${categoryItem.category}`}
                  className="group relative overflow-hidden bg-white rounded-xl shadow-sm hover:shadow-md transition-all"
                >
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={categoryItem.imageUrl}
                      alt={categoryItem.category}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-lg font-semibold text-white group-hover:text-blue-300 transition">
                      {categoryItem.category}
                    </h3>
                    <p className="text-sm text-white/80">{categoryItem.count} items</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-800">Featured Products</h2>
              <p className="text-gray-600">Handpicked items just for you</p>
            </div>
            <Link 
              to="/all-products" 
              className="flex items-center text-blue-600 hover:text-blue-800 font-medium"
            >
              View all <ChevronRight className="ml-1" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {products.map((product) => (
              <div key={product._id} className="group relative bg-white rounded-xl shadow-sm hover:shadow-lg overflow-hidden transition-all">
                <div className="relative aspect-square overflow-hidden">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-bold flex items-center">
                    <Star className="h-3 w-3 text-yellow-500 mr-1" />
                    <span>{product.rating || '4.5'}</span>
                  </div>
                </div>
                
                <div className="p-4">
                  <h3 className="text-lg font-bold text-gray-800 mb-1 truncate">{product.name}</h3>
                  <p className="text-gray-500 text-sm mb-3 capitalize">{product.category}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold text-blue-600">${product.price}</span>
                    <button 
                      onClick={() => addToCart(product)}
                      className="bg-blue-100 text-blue-600 p-2 rounded-full hover:bg-blue-200 transition hover:scale-110"
                    >
                      <ShoppingCart className="h-5 w-5" />
                    </button>
                  </div>
                </div>
                
                <Link
                  to={`/product/${product._id}`}
                  className="absolute inset-0 z-10"
                  aria-label={`View ${product.name} details`}
                ></Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Promo Banner */}
      <section className="py-20 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Summer Collection - Up to 40% Off</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Refresh your space with our seasonal favorites. Limited time offer on selected items.
          </p>
          <Link 
            to="/summer-sale" 
            className="inline-flex items-center bg-white text-indigo-600 px-6 py-3 rounded-lg font-bold hover:bg-gray-100 transition hover:scale-105"
          >
            Shop the Sale <ArrowRight className="ml-2" />
          </Link>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">What Our Customers Say</h2>
            <p className="text-gray-600">Join thousands of happy customers who transformed their homes with Decora</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Johnson",
                location: "New York",
                text: "The quality of Decora's products exceeded my expectations. My living room has never looked better!",
                rating: 5,
                image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100"
              },
              {
                name: "Michael Chen",
                location: "San Francisco",
                text: "Excellent customer service and fast shipping. The pieces I ordered were even more beautiful in person.",
                rating: 5,
                image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100"
              },
              {
                name: "Emma Rodriguez",
                location: "Chicago",
                text: "I love how Decora's collections help me create a cohesive look throughout my home. Highly recommend!",
                rating: 5,
                image: "https://images.unsplash.com/photo-1554151228-14d9def656e4?w=100"
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`${i < testimonial.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'} h-5 w-5 mr-1`} 
                    />
                  ))}
                </div>
                <p className="text-gray-600 mb-6">"{testimonial.text}"</p>
                <div className="flex items-center">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name} 
                    className="w-12 h-12 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h4 className="font-bold text-gray-800">{testimonial.name}</h4>
                    <p className="text-sm text-gray-500">{testimonial.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Stay Updated</h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Subscribe to our newsletter for exclusive offers, design tips, and new arrivals.
          </p>
          <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
            <input 
              type="email" 
              placeholder="Your email address" 
              className="flex-grow px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition">
              Subscribe
            </button>
          </div>
        </div>
      </section>

      
    </div>
  );
};

export default Home;