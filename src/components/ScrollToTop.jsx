import React, { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY;
      // Show button if scrolled down past 300px
      if (scrolled > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }

      // Calculate vertical scroll percentage
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        const progress = (scrolled / totalScroll) * 100;
        setScrollProgress(progress);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (scrollProgress / 100) * circumference;

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-6 right-6 z-50 flex items-center justify-center w-12 h-12 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-white shadow-2xl transition-all duration-300 transform hover:scale-110 active:scale-95 group focus:outline-none ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
      }`}
      aria-label="Back to top"
    >
      {/* Progress Circle SVG */}
      <svg className="absolute w-full h-full transform -rotate-90">
        <circle
          cx="24"
          cy="24"
          r={radius}
          className="stroke-white/10"
          strokeWidth="2.5"
          fill="transparent"
        />
        <circle
          cx="24"
          cy="24"
          r={radius}
          className="stroke-indigo-500 transition-all duration-100"
          strokeWidth="2.5"
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
        />
      </svg>
      {/* Arrow Icon */}
      <ArrowUp className="w-5 h-5 text-indigo-400 group-hover:text-white transition-colors duration-300" />
    </button>
  );
};

export default ScrollToTop;
