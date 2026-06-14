import { BrowserRouter, Routes, Route } from "react-router-dom";
import React, { useEffect, useState, lazy, Suspense } from "react";
import { HelmetProvider } from "react-helmet-async";
import AOS from "aos";
import "aos/dist/aos.css";
import "./index.css";
import Navbar from "./components/Navbar";
import Home from "./Pages/Home";
import About from "./Pages/About";
import AnimatedBackground from "./components/Background";
import { AnimatePresence } from "framer-motion";
import Footer from "./components/Footer";

import Login from "./Pages/Login";
import Dashboard from "./Pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import ScrollToTop from "./components/ScrollToTop";
import CustomCursor from "./components/CustomCursor";

const Portofolio = lazy(() => import("./Pages/Portofolio"));
const ContactPage = lazy(() => import("./Pages/Contact"));
const ProjectDetails = lazy(() => import("./components/ProjectDetail"));
const WelcomeScreen = lazy(() => import("./Pages/WelcomeScreen"));
const NotFoundPage = lazy(() => import("./Pages/404"));

const initScrollAnimations = () => {
  AOS.init({
    once: false,
    mirror: true,
    offset: 10,
    duration: window.innerWidth < 640 ? 350 : 500,
    delay: 0,
    disable: false,
  });
  AOS.refreshHard();
};

const LandingPage = ({ showWelcome, setShowWelcome }) => {
  useEffect(() => {
    if (showWelcome) return;

    const timers = [0, 500, 1500].map((delay) => setTimeout(initScrollAnimations, delay));
    window.addEventListener("resize", initScrollAnimations);
    window.addEventListener("orientationchange", initScrollAnimations);

    return () => {
      timers.forEach(clearTimeout);
      window.removeEventListener("resize", initScrollAnimations);
      window.removeEventListener("orientationchange", initScrollAnimations);
    };
  }, [showWelcome]);

  return (
    <>
      <AnimatePresence mode="wait">
        {showWelcome && (
          <Suspense fallback={null}>
            <WelcomeScreen onLoadingComplete={() => setShowWelcome(false)} />
          </Suspense>
        )}
      </AnimatePresence>

      {!showWelcome && (
        <>
          <Navbar />
          <Home />
          <About />
          <Suspense fallback={<div className="h-20" />}>
            <Portofolio />
            <ContactPage />
          </Suspense>
          <Footer />
        </>
      )}
    </>
  );
};

const ProjectPageLayout = () => (
  <>
    <Suspense fallback={<div className="min-h-screen" />}>
      <ProjectDetails />
    </Suspense>
    <Footer />
  </>
);

function App() {
  const [showWelcome, setShowWelcome] = useState(true);

  return (
    <HelmetProvider>
      <div className="pointer-events-none">
        <AnimatedBackground />
      </div>
      <BrowserRouter>
        <Routes>
          {/* PUBLIC */}
          <Route
            path="/"
            element={
              <LandingPage
                showWelcome={showWelcome}
                setShowWelcome={setShowWelcome}
              />
            }
          />

          <Route path="/project/:slug" element={<ProjectPageLayout />} />

          {/* AUTH */}
          <Route path="/login" element={<Login />} />

          {/* ADMIN (PROTECTED) */}
          <Route
            path="/dashboard/*"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* 404 */}
          <Route
            path="*"
            element={
              <Suspense fallback={null}>
                <NotFoundPage />
              </Suspense>
            }
          />
        </Routes>
      </BrowserRouter>
      <ScrollToTop />
      <CustomCursor />
    </HelmetProvider>
  );
}

export default App;
