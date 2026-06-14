import React, { useEffect, useState } from "react";

const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [trail, setTrail] = useState({ x: 0, y: 0 });
  const [hidden, setHidden] = useState(true);
  const [clicked, setClicked] = useState(false);
  const [linkHovered, setLinkHovered] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(hover: hover)");
    if (!mediaQuery.matches) return;

    const handleMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
      setHidden(false);
    };

    const handleMouseEnter = () => setHidden(false);
    const handleMouseLeave = () => setHidden(true);

    const handleMouseDown = () => setClicked(true);
    const handleMouseUp = () => setClicked(false);

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseenter", handleMouseEnter);
    document.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);

    const addHoverListeners = () => {
      const clickables = document.querySelectorAll(
        'a, button, input, textarea, select, [role="button"], .cursor-pointer'
      );
      clickables.forEach((el) => {
        el.addEventListener("mouseenter", () => setLinkHovered(true));
        el.addEventListener("mouseleave", () => setLinkHovered(false));
      });
    };

    addHoverListeners();

    const observer = new MutationObserver(addHoverListeners);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseenter", handleMouseEnter);
      document.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    let animationFrameId;
    
    const updateTrail = () => {
      setTrail((prevTrail) => {
        const dx = position.x - prevTrail.x;
        const dy = position.y - prevTrail.y;
        return {
          x: prevTrail.x + dx * 0.15,
          y: prevTrail.y + dy * 0.15,
        };
      });
      animationFrameId = requestAnimationFrame(updateTrail);
    };
    
    animationFrameId = requestAnimationFrame(updateTrail);
    return () => cancelAnimationFrame(animationFrameId);
  }, [position]);

  const isTouchDevice = typeof window !== "undefined" && !window.matchMedia("(hover: hover)").matches;
  if (isTouchDevice || hidden) return null;

  return (
    <>
      {/* Inner Dot */}
      <div
        className="fixed top-0 left-0 w-2 h-2 bg-indigo-500 rounded-full pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 transition-transform duration-100 ease-out"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          transform: `translate(-50%, -50%) scale(${clicked ? 0.8 : linkHovered ? 1.5 : 1})`,
        }}
      />
      {/* Outer Glowing Ring */}
      <div
        className="fixed top-0 left-0 rounded-full pointer-events-none z-[9998] -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ease-out"
        style={{
          left: `${trail.x}px`,
          top: `${trail.y}px`,
          width: linkHovered ? "48px" : "24px",
          height: linkHovered ? "48px" : "24px",
          border: clicked ? "2px solid rgba(168, 85, 247, 0.8)" : "1.5px solid rgba(99, 102, 241, 0.4)",
          backgroundColor: linkHovered ? "rgba(99, 102, 241, 0.05)" : "transparent",
          boxShadow: linkHovered 
            ? "0 0 15px rgba(99, 102, 241, 0.3)" 
            : "0 0 5px rgba(99, 102, 241, 0.1)",
          transform: `translate(-50%, -50%) scale(${clicked ? 0.9 : 1})`,
        }}
      />
    </>
  );
};

export default CustomCursor;
