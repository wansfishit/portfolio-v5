import React, { useEffect, useState } from "react";

const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [trail, setTrail] = useState({ x: 0, y: 0 });
  const [hidden, setHidden] = useState(true);
  const [clicked, setClicked] = useState(false);
  const [linkHovered, setLinkHovered] = useState(false);
  const [ripples, setRipples] = useState([]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(hover: hover)");
    if (!mediaQuery.matches) return;

    const handleMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
      setHidden(false);
    };

    const handleMouseEnter = () => setHidden(false);
    const handleMouseLeave = () => setHidden(true);

    const handleMouseDown = (e) => {
      setClicked(true);
      const newRipple = { x: e.clientX, y: e.clientY, id: Date.now() };
      setRipples((prev) => [...prev, newRipple]);
      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
      }, 600);
    };
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
          x: prevTrail.x + dx * 0.05,
          y: prevTrail.y + dy * 0.05,
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
      {/* Liquid Glass Ripples */}
      {ripples.map((ripple) => (
        <div
          key={ripple.id}
          className="fixed top-0 left-0 w-20 h-20 rounded-full pointer-events-none z-[9997] animate-ripple"
          style={{
            left: `${ripple.x}px`,
            top: `${ripple.y}px`,
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.05))',
            backdropFilter: 'blur(6px)',
            border: '1px solid rgba(255, 255, 255, 0.4)',
            boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
          }}
        />
      ))}
      {/* Inner Dot */}
      <div
        className="fixed top-0 left-0 w-3 h-3 bg-indigo-400 rounded-full pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 transition-transform duration-100 ease-out shadow-[0_0_10px_rgba(99,102,241,0.8)]"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          transform: `translate(-50%, -50%) scale(${clicked ? 0.8 : linkHovered ? 1.5 : 1})`,
        }}
      />
      {/* Outer Glowing Ring */}
      <div
        className="fixed top-0 left-0 rounded-full pointer-events-none z-[9998] -translate-x-1/2 -translate-y-1/2"
        style={{
          left: `${trail.x}px`,
          top: `${trail.y}px`,
          width: linkHovered ? "56px" : "32px",
          height: linkHovered ? "56px" : "32px",
          border: clicked ? "3px solid rgba(168, 85, 247, 0.9)" : "2px solid rgba(99, 102, 241, 0.6)",
          backgroundColor: linkHovered ? "rgba(99, 102, 241, 0.1)" : "transparent",
          boxShadow: linkHovered 
            ? "0 0 20px rgba(99, 102, 241, 0.5)" 
            : "0 0 10px rgba(99, 102, 241, 0.3)",
          transform: `translate(-50%, -50%) scale(${clicked ? 0.9 : 1})`,
          transition: "width 0.3s, height 0.3s, border-color 0.3s, background-color 0.3s, box-shadow 0.3s, transform 0.3s ease-out"
        }}
      />
    </>
  );
};

export default CustomCursor;
