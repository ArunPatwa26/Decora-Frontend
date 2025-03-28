import React from "react";
import { motion } from "framer-motion";
import { Home, Palette, Sparkles, Truck, Shield } from "lucide-react";

const About = () => {
  const stats = [
    { value: "10,000+", label: "Happy Customers", icon: <Home className="h-6 w-6" /> },
    { value: "5,000+", label: "Unique Products", icon: <Palette className="h-6 w-6" /> },
    { value: "50+", label: "Design Awards", icon: <Sparkles className="h-6 w-6" /> },
    { value: "100+", label: "Cities Served", icon: <Truck className="h-6 w-6" /> },
  ];

  const teamMembers = [
    {
      name: "Sophia Williams",
      role: "Founder & Creative Director",
      bio: "Interior design expert with a passion for accessible home decor",
      img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300",
    },
    {
      name: "James Rodriguez",
      role: "Head of Operations",
      bio: "Ensuring seamless delivery of your decor dreams",
      img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300",
    },
    {
      name: "Aisha Khan",
      role: "Lead Designer",
      bio: "Curating collections that transform houses into homes",
      img: "https://images.unsplash.com/photo-1554151228-14d9def656e4?w=300",
    },
  ];

  return (
    <div className="bg-white">
      {/* Hero Section - Full Width */}
      <section className="relative h-96 md:h-screen max-h-[400px] bg-gradient-to-br from-amber-50 to-amber-100 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
            <motion.h1
              className="text-4xl md:text-6xl font-bold text-amber-900 mb-6"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Welcome to Decora
            </motion.h1>
            <motion.p
              className="text-xl md:text-2xl text-amber-800 mb-8"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Where beautiful spaces begin
            </motion.p>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <button className="px-8 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition shadow-lg">
                Explore Our Collections
              </button>
            </motion.div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent"></div>
      </section>

      {/* Our Story - Full Width */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            className="grid md:grid-cols-2 gap-12 items-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-amber-900 mb-6">Our Story</h2>
              <p className="text-lg text-gray-700 mb-6">
                Founded in 2015, Decora began as a small boutique with a big vision - to make exceptional home decor accessible to everyone. What started as a passion project in a tiny studio has grown into a beloved brand serving thousands of customers nationwide.
              </p>
              <p className="text-lg text-gray-700 mb-8">
                We believe your home should tell your story. That's why we carefully curate each piece in our collection, blending timeless elegance with contemporary design to help you create spaces that feel uniquely yours.
              </p>
              <div className="flex gap-4">
                <button className="px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition">
                  Our Collections
                </button>
                <button className="px-6 py-3 border border-amber-600 text-amber-600 rounded-lg hover:bg-amber-50 transition">
                  Design Services
                </button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg overflow-hidden h-64">
                <img 
                  src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=500" 
                  alt="Decora showroom"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="rounded-lg overflow-hidden h-64">
                <img 
                  src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=500" 
                  alt="Decora products"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="rounded-lg overflow-hidden h-64">
                <img 
                  src="https://images.unsplash.com/photo-1556911220-bff31c812dba?w=500" 
                  alt="Decora team"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="rounded-lg overflow-hidden h-64">
                <img 
                  src="https://images.unsplash.com/photo-1618220179428-22790b461013?w=500" 
                  alt="Decora packaging"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* What We Offer - Full Width */}
      <section className="py-20 bg-amber-50">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-amber-900 text-center mb-16">What Makes Decora Special</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition">
                <div className="bg-amber-100 w-14 h-14 rounded-xl flex items-center justify-center mb-4 text-amber-600">
                  <Palette className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Curated Collections</h3>
                <p className="text-gray-600">
                  Each piece is hand-selected by our design team to ensure quality, style, and timeless appeal.
                </p>
              </div>
              <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition">
                <div className="bg-amber-100 w-14 h-14 rounded-xl flex items-center justify-center mb-4 text-amber-600">
                  <Shield className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Quality Guarantee</h3>
                <p className="text-gray-600">
                  We stand behind every product with a 100% satisfaction guarantee and easy returns.
                </p>
              </div>
              <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition">
                <div className="bg-amber-100 w-14 h-14 rounded-xl flex items-center justify-center mb-4 text-amber-600">
                  <Sparkles className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Design Services</h3>
                <p className="text-gray-600">
                  Our experts can help you create cohesive looks for any room in your home.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section - Full Width */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            {stats.map((stat, index) => (
              <div key={index} className="bg-amber-50 p-8 rounded-xl text-center">
                <div className="bg-amber-100 w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4 text-amber-600">
                  {stat.icon}
                </div>
                <h3 className="text-3xl font-bold text-amber-900 mb-2">{stat.value}</h3>
                <p className="text-gray-600">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Team Section - Full Width */}
      <section className="py-20 bg-amber-50">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-amber-900 text-center mb-16">Meet The Decora Team</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {teamMembers.map((member, index) => (
                <div key={index} className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition">
                  <div className="h-80 overflow-hidden">
                    <img 
                      src={member.img} 
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-800">{member.name}</h3>
                    <p className="text-amber-600 mb-3">{member.role}</p>
                    <p className="text-gray-600">{member.bio}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section - Full Width */}
      <section className="py-20 bg-gradient-to-br from-amber-600 to-amber-700 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Space?</h2>
            <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
              Discover decor that speaks to your style and creates the home you've always wanted.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-3 bg-white text-amber-600 rounded-lg font-medium hover:bg-gray-100 transition shadow-lg">
                Shop Now
              </button>
              <button className="px-8 py-3 border-2 border-white text-white rounded-lg font-medium hover:bg-white hover:bg-opacity-10 transition">
                Book Design Consultation
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default About;