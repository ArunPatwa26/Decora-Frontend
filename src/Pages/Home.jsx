import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Slider from "../Navbar/Slidder";
import { Star, ShoppingCart, ArrowRight, ChevronRight, Heart } from "lucide-react";
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

      {/* Categories Section */}
      <section className="py-8 md:py-12 px-4 sm:px-6">
  <div className="max-w-7xl mx-auto">
    <div className="text-center mb-8">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Shop by Category</h2>
      <p className="text-gray-600 text-sm md:text-base">Find perfect pieces for every space</p>
    </div>

    {loading ? (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    ) : error ? (
      <div className="text-center text-red-500 font-medium py-12">{error}</div>
    ) : (
      <div className="sm:grid sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6 overflow-x-auto sm:overflow-visible whitespace-nowrap flex sm:flex-none space-x-4 scrollbar-hide pb-2">
        {categories.map((categoryItem) => (
          <Link
            key={categoryItem.category}
            to={`/products/${categoryItem.category}`}
            className="group relative bg-white rounded-lg shadow-xs hover:shadow-sm transition-all duration-300 min-w-[60%] sm:min-w-0 sm:w-auto"
          >
            <div className="aspect-square overflow-hidden">
              <img
                src={categoryItem.imageUrl}
                alt={categoryItem.category}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4">
              <h3 className="text-sm md:text-base font-semibold text-white group-hover:text-blue-200 transition">
                {categoryItem.category}
              </h3>
              <p className="text-xs text-white/80">{categoryItem.count} items</p>
            </div>
          </Link>
        ))}
      </div>
    )}
  </div>
</section>


      {/* Featured Products */}
      <section className="py-8 md:py-12 px-4 sm:px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8">
            <div className="mb-4 md:mb-0">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Featured Products</h2>
              <p className="text-gray-600 text-sm md:text-base">Curated selection of our best items</p>
            </div>
            <Link 
              to="/all-products" 
              className="flex items-center text-blue-600 hover:text-blue-800 font-medium text-sm md:text-base"
            >
              View all <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.map((product) => (
              <div key={product._id} className="group relative bg-white rounded-lg overflow-hidden shadow-xs hover:shadow-sm transition-all duration-300">
                <div className="relative aspect-square overflow-hidden">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <button className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm p-1.5 rounded-full text-xs font-bold flex items-center">
                    <Heart className="h-4 w-4 text-gray-600 hover:text-red-500 transition" />
                  </button>
                </div>
                
                <div className="p-3 md:p-4">
                  <h3 className="text-sm md:text-base font-semibold text-gray-800 mb-1 line-clamp-1">{product.name}</h3>
                  <p className="text-gray-500 text-xs md:text-sm mb-2 capitalize">{product.category}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-base md:text-lg font-bold text-blue-600">₹{product.price}</span>
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        addToCart(product);
                      }}
                      className="bg-blue-100 text-blue-600 p-1.5 md:p-2 rounded-full hover:bg-blue-200 transition hover:scale-110"
                      aria-label="Add to cart"
                    >
                      <ShoppingCart className="h-4 w-4 md:h-5 md:w-5" />
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
      <section className="py-12 md:py-16 px-4 sm:px-6 bg-gradient-to-r from-indigo-700 to-purple-700 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 md:mb-4">Summer Collection - Up to 40% Off</h2>
          <p className="text-sm md:text-base lg:text-lg mb-6 md:mb-8 max-w-3xl mx-auto opacity-90">
            Refresh your space with our seasonal favorites. Limited time offer on selected items.
          </p>
          <Link 
            to="/summer-sale" 
            className="inline-flex items-center bg-white text-indigo-700 px-5 py-2.5 md:px-6 md:py-3 rounded-lg font-bold hover:bg-gray-100 transition transform hover:scale-105 active:scale-95"
          >
            Shop the Sale <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* About Section */}
      <section className="py-8 md:py-12 px-4 sm:px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Why Choose Decora</h2>
            <p className="text-gray-600 text-sm md:text-base max-w-3xl mx-auto">
              We combine quality craftsmanship with thoughtful design to bring you home decor that lasts
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-4 md:gap-6">
            <div className="bg-white p-4 md:p-6 rounded-lg shadow-xs">
              <div className="bg-blue-100 w-10 h-10 md:w-12 md:h-12 rounded-lg flex items-center justify-center mb-3 md:mb-4 text-blue-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-1 md:mb-2">Premium Quality</h3>
              <p className="text-gray-600 text-sm md:text-base">
                Each piece is hand-selected for exceptional craftsmanship and lasting durability.
              </p>
            </div>

            <div className="bg-white p-4 md:p-6 rounded-lg shadow-xs">
              <div className="bg-blue-100 w-10 h-10 md:w-12 md:h-12 rounded-lg flex items-center justify-center mb-3 md:mb-4 text-blue-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-1 md:mb-2">Fast Delivery</h3>
              <p className="text-gray-600 text-sm md:text-base">
                Get your decor delivered quickly with our efficient shipping network.
              </p>
            </div>

            <div className="bg-white p-4 md:p-6 rounded-lg shadow-xs">
              <div className="bg-blue-100 w-10 h-10 md:w-12 md:h-12 rounded-lg flex items-center justify-center mb-3 md:mb-4 text-blue-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-1 md:mb-2">Secure Payment</h3>
              <p className="text-gray-600 text-sm md:text-base">
                Shop with confidence using our secure payment methods and buyer protection.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-8 md:py-12 px-4 sm:px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Customer Stories</h2>
            <p className="text-gray-600 text-sm md:text-base">See how Decora has transformed homes</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {[
              {
                name: "Sarah Johnson",
                location: "New York",
                text: "The quality exceeded my expectations. My living room has never looked better!",
                rating: 5,
                image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100"
              },
              {
                name: "Michael Chen",
                location: "San Francisco",
                text: "Excellent service and fast shipping. The pieces were even more beautiful in person.",
                rating: 5,
                image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100"
              },
              {
                name: "Emma Rodriguez",
                location: "Chicago",
                text: "Love how Decora helps create a cohesive look throughout my home. Highly recommend!",
                rating: 5,
                image: "https://images.unsplash.com/photo-1554151228-14d9def656e4?w=100"
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-gray-50 p-4 md:p-6 rounded-lg">
                <div className="flex mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`${i < testimonial.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'} h-4 w-4 mr-0.5`} 
                    />
                  ))}
                </div>
                <p className="text-gray-600 text-sm md:text-base mb-4 md:mb-6">"{testimonial.text}"</p>
                <div className="flex items-center">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name} 
                    className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover mr-3"
                    loading="lazy"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-800 text-sm md:text-base">{testimonial.name}</h4>
                    <p className="text-xs md:text-sm text-gray-500">{testimonial.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-8 md:py-12 px-4 sm:px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto bg-white rounded-lg p-6 md:p-8 text-center shadow-xs">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">Join Our Community</h2>
          <p className="text-gray-600 text-sm md:text-base mb-4 md:mb-6 max-w-2xl mx-auto">
            Subscribe for exclusive offers, design tips, and new arrivals.
          </p>
          <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
            <input 
              type="email" 
              placeholder="Your email address" 
              className="flex-grow px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button className="px-4 py-2.5 bg-blue-600 text-white rounded-lg font-medium text-sm hover:bg-blue-700 transition active:bg-blue-800">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;