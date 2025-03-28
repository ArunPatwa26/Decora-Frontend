import React from "react";
import { Link } from "react-router-dom";
import { 
  Facebook, Instagram, Twitter, Linkedin, 
  MapPin, Mail, Phone, ArrowRight
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* Brand Column */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold text-white">DECORA</span>
            </Link>
            <p className="text-gray-400">
              Transforming houses into homes with our curated collection of premium home decor.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="#" className="text-gray-400 hover:text-white transition">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-pink-500 transition">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-600 transition">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link 
                  to="/" 
                  className="flex items-center text-gray-400 hover:text-white transition"
                >
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Home
                </Link>
              </li>
              <li>
                <Link 
                  to="/shop" 
                  className="flex items-center text-gray-400 hover:text-white transition"
                >
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Shop
                </Link>
              </li>
              <li>
                <Link 
                  to="/about" 
                  className="flex items-center text-gray-400 hover:text-white transition"
                >
                  <ArrowRight className="h-4 w-4 mr-2" />
                  About Us
                </Link>
              </li>
              <li>
                <Link 
                  to="/contact" 
                  className="flex items-center text-gray-400 hover:text-white transition"
                >
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Customer Service</h3>
            <ul className="space-y-3">
              <li>
                <Link 
                  to="/faq" 
                  className="flex items-center text-gray-400 hover:text-white transition"
                >
                  <ArrowRight className="h-4 w-4 mr-2" />
                  FAQs
                </Link>
              </li>
              <li>
                <Link 
                  to="/shipping" 
                  className="flex items-center text-gray-400 hover:text-white transition"
                >
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link 
                  to="/returns" 
                  className="flex items-center text-gray-400 hover:text-white transition"
                >
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Return Policy
                </Link>
              </li>
              <li>
                <Link 
                  to="/privacy" 
                  className="flex items-center text-gray-400 hover:text-white transition"
                >
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Contact Us</h3>
            <div className="space-y-4">
              <div className="flex items-start">
                <MapPin className="h-5 w-5 text-gray-400 mt-1 mr-3" />
                <p className="text-gray-400">
                  123 Design District<br />
                  New York, NY 10001
                </p>
              </div>
              <div className="flex items-center">
                <Mail className="h-5 w-5 text-gray-400 mr-3" />
                <a href="mailto:hello@decora.com" className="text-gray-400 hover:text-white transition">
                  hello@decora.com
                </a>
              </div>
              <div className="flex items-center">
                <Phone className="h-5 w-5 text-gray-400 mr-3" />
                <a href="tel:+1234567890" className="text-gray-400 hover:text-white transition">
                  +1 (234) 567-890
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 my-8"></div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} Decora. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/terms" className="text-gray-500 hover:text-white text-sm transition">
              Terms of Service
            </Link>
            <Link to="/privacy" className="text-gray-500 hover:text-white text-sm transition">
              Privacy Policy
            </Link>
            <Link to="/cookies" className="text-gray-500 hover:text-white text-sm transition">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;