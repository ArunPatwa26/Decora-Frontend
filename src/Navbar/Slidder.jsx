import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Slidder = () => {
  // Custom arrow components
  const NextArrow = ({ onClick }) => (
    <button 
      onClick={onClick}
      className="absolute right-4 top-1/2 z-10 -translate-y-1/2 bg-white/30 hover:bg-white/50 backdrop-blur-sm p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
      aria-label="Next slide"
    >
      <ChevronRight className="h-6 w-6 text-gray-800" />
    </button>
  );

  const PrevArrow = ({ onClick }) => (
    <button 
      onClick={onClick}
      className="absolute left-4 top-1/2 z-10 -translate-y-1/2 bg-white/30 hover:bg-white/50 backdrop-blur-sm p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
      aria-label="Previous slide"
    >
      <ChevronLeft className="h-6 w-6 text-gray-800" />
    </button>
  );

  // Slider settings
  const settings = {
    dots: true,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    pauseOnHover: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    appendDots: dots => (
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
        <ul className="flex space-x-2">{dots}</ul>
      </div>
    ),
    customPaging: i => (
      <div className="w-3 h-3 rounded-full bg-white/50 hover:bg-white transition-all duration-300"></div>
    )
  };

  // Slide data
  const slides = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1616046229478-9901c5536a45?q=80&w=2080&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      title: "Modern Living Spaces",
      subtitle: "Discover our premium collection"
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1615874694520-474822394e73?q=80&w=2080&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      title: "Elegant Home Decor",
      subtitle: "Transform your space with style"
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1615873968403-89e068629265?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      title: "Luxury Redefined",
      subtitle: "Exclusive designs for your home"
    },
    {
      id: 4,
      image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      title: "Timeless Elegance",
      subtitle: "Crafted for sophisticated tastes"
    }
  ];

  return (
    <div className="w-full max-w-8xl mx-auto px-4 py-8">
      <div className="relative group">
        <Slider {...settings}>
          {slides.map((slide) => (
            <div key={slide.id} className="relative">
              <div className="relative h-[600px] md:h-[700px] overflow-hidden rounded-2xl">
                <img 
                  src={slide.image} 
                  alt={slide.title} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/20"></div>
              </div>
              
              {/* Slide Content */}
              <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 text-center w-full px-4">
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 animate-fadeIn">
                  {slide.title}
                </h2>
                <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto animate-fadeIn">
                  {slide.subtitle}
                </p>
                <button className="px-8 py-3 bg-white text-gray-900 font-medium rounded-lg hover:bg-gray-100 transition-all duration-300 hover:scale-105 animate-fadeIn">
                  Shop Collection
                </button>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default Slidder;