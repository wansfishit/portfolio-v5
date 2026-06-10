import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Code2, Github, Globe, User } from 'lucide-react';

const TypewriterEffect = ({ text }) => {
  const [displayText, setDisplayText] = useState('');
  
  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      if (index <= text.length) {
        setDisplayText(text.slice(0, index));
        index++;
      } else {
        clearInterval(timer);
      }
    }, 80);
    
    return () => clearInterval(timer);
  }, [text]);

  return (
    <span className="inline-block">
      {displayText}
      <span className="animate-pulse">|</span>
    </span>
  );
};

const BackgroundEffect = () => (
  <div className="absolute inset-0 overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/15 to-purple-600/15 blur-2xl" />
    <div className="absolute inset-0 bg-gradient-to-tr from-indigo-600/10 via-transparent to-purple-600/10 blur-xl" />
  </div>
);

const IconButton = ({ Icon }) => (
  <div className="relative transition-transform duration-200 sm:hover:scale-110">
    <div className="absolute -inset-2 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full blur opacity-20 sm:group-hover:opacity-60 transition duration-200" />
    <div className="relative p-2 sm:p-3 bg-black/50 backdrop-blur-sm rounded-full border border-white/10">
      <Icon className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-white" />
    </div>
  </div>
);

const WelcomeScreen = ({ onLoadingComplete }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      setTimeout(() => {
        onLoadingComplete?.();
      }, 250);
    }, 1600);
    
    return () => clearTimeout(timer);
  }, [onLoadingComplete]);

  const containerVariants = {
    exit: {
      opacity: 0,
      scale: 1.02,
      filter: "blur(2px)",
      transition: {
        duration: 0.25,
        ease: "easeOut",
        when: "beforeChildren",
        staggerChildren: 0.02
      }
    }
  };

  const childVariants = {
    exit: {
      y: -8,
      opacity: 0,
      transition: {
        duration: 0.18,
        ease: "easeOut"
      }
    }
  };

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className="fixed inset-0 bg-[#030014] z-[9999]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit="exit"
          variants={containerVariants}
        >
          <BackgroundEffect />
          
          <div className="relative min-h-screen flex items-center justify-center px-4">
            <div className="w-full max-w-4xl mx-auto">
              <motion.div 
                className="flex justify-center gap-3 sm:gap-4 md:gap-8 mb-6 sm:mb-8 md:mb-12"
                variants={childVariants}
              >
                {[Code2, User, Github].map((Icon, index) => (
                  <div key={index}>
                    <IconButton Icon={Icon} />
                  </div>
                ))}
              </motion.div>

              <motion.div 
                className="text-center mb-6 sm:mb-8 md:mb-12"
                variants={childVariants}
              >
                <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold space-y-2 sm:space-y-4">
                  <div className="mb-2 sm:mb-4">
                    <span className="inline-block px-2 bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent">
                      Welcome
                    </span>{' '}
                    <span className="inline-block px-2 bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent">
                      To
                    </span>{' '}
                    <span className="inline-block px-2 bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent">
                      My
                    </span>
                  </div>
                  <div>
                    <span className="inline-block px-2 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                      Portfolio
                    </span>{' '}
                    <span className="inline-block px-2 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                      Website
                    </span>
                  </div>
                </h1>
              </motion.div>

              <motion.div className="text-center" variants={childVariants}>
                <a
                  href="https://tino.cc.cd"
                  className="inline-flex items-center gap-2 px-4 py-2 sm:px-6 sm:py-3 rounded-full relative group transition-transform duration-200 sm:hover:scale-105"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 rounded-full blur-md" />
                  <div className="relative flex items-center gap-2 text-lg sm:text-xl md:text-2xl">
                    <Globe className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600" />
                    <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                      <TypewriterEffect text="tino.cc.cd" />
                    </span>
                  </div>
                </a>
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WelcomeScreen;
