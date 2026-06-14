import React, { useState, useEffect } from "react";
import { Menu, X, Volume2, VolumeX } from "lucide-react";
import { playHoverSound, playClickSound } from "../utils/audio";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [activeSection, setActiveSection] = useState("Home");
    const [theme, setTheme] = useState(() => localStorage.getItem("portfolioTheme") || "default");
    const [soundEnabled, setSoundEnabled] = useState(() => localStorage.getItem("soundEnabled") === "true");

    useEffect(() => {
        document.documentElement.className = "";
        if (theme !== "default") {
            document.documentElement.classList.add(`theme-${theme}`);
        }
        localStorage.setItem("portfolioTheme", theme);
    }, [theme]);

    useEffect(() => {
        localStorage.setItem("soundEnabled", soundEnabled ? "true" : "false");
        window.dispatchEvent(new CustomEvent("soundSettingsChanged", { detail: soundEnabled }));
    }, [soundEnabled]);
    
    const navItems = [
        { href: "#Home", label: "Home" },
        { href: "#About", label: "About" },
        { href: "#Portofolio", label: "Portofolio" },
        { href: "#Contact", label: "Contact" },
    ];

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
            const sections = navItems.map(item => {
                const section = document.querySelector(item.href);
                if (section) {
                    return {
                        id: item.href.replace("#", ""),
                        offset: section.offsetTop - 550,
                        height: section.offsetHeight
                    };
                }
                return null;
            }).filter(Boolean);

            const currentPosition = window.scrollY;
            const active = sections.find(section => 
                currentPosition >= section.offset && 
                currentPosition < section.offset + section.height
            );

            if (active) {
                setActiveSection(active.id);
            }
        };

        window.addEventListener("scroll", handleScroll);
        handleScroll();
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [isOpen]);

    const scrollToSection = (e, href) => {
        e.preventDefault();
        const section = document.querySelector(href);
        if (section) {
            const top = section.offsetTop - 100;
            window.scrollTo({
                top: top,
                behavior: "smooth"
            });
        }
        setIsOpen(false);
    };

    return (
        <nav
            className={`fixed w-full top-0 z-50 transition-all duration-500 ${
                isOpen
                    ? "bg-[#030014]"
                    : scrolled
                    ? "bg-[#030014]/50 backdrop-blur-xl"
                    : "bg-transparent"
            }`}
        >
            <div className="mx-auto px-[5%] sm:px-[5%] lg:px-[10%]">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <a
                            href="#Home"
                            onClick={(e) => scrollToSection(e, "#Home")}
                            className="text-xl font-bold bg-gradient-to-r from-[#a855f7] to-[#6366f1] bg-clip-text text-transparent"
                        >
                            Tino.dev
                        </a>
                    </div>
        
                    {/* Desktop Navigation */}
                    <div className="hidden md:block">
                        <div className="ml-8 flex items-center space-x-8">
                            {navItems.map((item) => (
                                <a
                                    key={item.label}
                                    href={item.href}
                                    onMouseEnter={() => playHoverSound()}
                                    onClick={(e) => {
                                        playClickSound();
                                        scrollToSection(e, item.href);
                                    }}
                                    className="group relative px-1 py-2 text-sm font-medium"
                                >
                                    <span
                                        className={`relative z-10 transition-colors duration-300 ${
                                            activeSection === item.href.substring(1)
                                                ? "bg-gradient-to-r from-[#6366f1] to-[#a855f7] bg-clip-text text-transparent font-semibold"
                                                : "text-[#e2d3fd] group-hover:text-white"
                                        }`}
                                    >
                                        {item.label}
                                    </span>
                                    <span
                                        className={`absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-[#6366f1] to-[#a855f7] transform origin-left transition-transform duration-300 ${
                                            activeSection === item.href.substring(1)
                                                ? "scale-x-100"
                                                : "scale-x-0 group-hover:scale-x-100"
                                        }`}
                                    />
                                </a>
                            ))}

                            {/* Color Theme Switcher */}
                            <div className="flex items-center gap-1.5 border-l border-white/10 pl-4">
                                {[
                                    { id: "default", color: "bg-[#6366f1]" },
                                    { id: "cyberpunk", color: "bg-[#00f0ff]" },
                                    { id: "matrix", color: "bg-[#00ff66]" },
                                    { id: "sunset", color: "bg-[#ff5e36]" }
                                ].map(t => (
                                    <button
                                        key={t.id}
                                        onClick={() => { setTheme(t.id); setTimeout(playClickSound, 50); }}
                                        className={`w-3.5 h-3.5 rounded-full ${t.color} transition-all duration-300 transform hover:scale-125 focus:outline-none ${theme === t.id ? "ring-2 ring-white scale-110" : ""}`}
                                        title={`Theme: ${t.id}`}
                                    />
                                ))}
                            </div>

                            {/* Sound Toggle */}
                            <button
                                onClick={() => {
                                    const nextSound = !soundEnabled;
                                    setSoundEnabled(nextSound);
                                    localStorage.setItem("soundEnabled", nextSound ? "true" : "false");
                                    if (nextSound) setTimeout(playClickSound, 50);
                                }}
                                onMouseEnter={() => playHoverSound()}
                                className="p-1.5 rounded-lg border border-white/10 hover:border-white/20 text-[#e2d3fd] hover:text-white transition-colors"
                                title={soundEnabled ? "Mute sounds" : "Enable click sounds"}
                            >
                                {soundEnabled ? <Volume2 className="w-4 h-4 text-indigo-400" /> : <VolumeX className="w-4 h-4 text-gray-500" />}
                            </button>
                        </div>
                    </div>
        
                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className={`relative p-2 text-[#e2d3fd] hover:text-white transition-transform duration-300 ease-in-out transform ${
                                isOpen ? "rotate-90 scale-125" : "rotate-0 scale-100"
                            }`}
                        >
                            {isOpen ? (
                                <X className="w-6 h-6" />
                            ) : (
                                <Menu className="w-6 h-6" />
                            )}
                        </button>
                    </div>
                </div>
            </div>
        
            {/* Mobile Menu */}
            <div
                className={`md:hidden transition-all duration-300 ease-in-out ${
                    isOpen
                        ? "max-h-screen opacity-100"
                        : "max-h-0 opacity-0 overflow-hidden"
                }`}
            >
                <div className="px-4 py-6 space-y-4">
                    {navItems.map((item, index) => (
                        <a
                            key={item.label}
                            href={item.href}
                            onMouseEnter={() => playHoverSound()}
                            onClick={(e) => {
                                playClickSound();
                                scrollToSection(e, item.href);
                            }}
                            className={`block px-4 py-3 text-lg font-medium transition-all duration-300 ease ${
                                activeSection === item.href.substring(1)
                                    ? "bg-gradient-to-r from-[#6366f1] to-[#a855f7] bg-clip-text text-transparent font-semibold"
                                    : "text-[#e2d3fd] hover:text-white"
                            }`}
                            style={{
                                transitionDelay: `${index * 100}ms`,
                                transform: isOpen ? "translateX(0)" : "translateX(50px)",
                                opacity: isOpen ? 1 : 0,
                            }}
                        >
                            {item.label}
                        </a>
                    ))}

                    {/* Mobile Settings Controls */}
                    <div className="pt-4 border-t border-white/10 flex items-center justify-between px-4">
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-400">Theme:</span>
                            <div className="flex items-center gap-1.5">
                                {[
                                    { id: "default", color: "bg-[#6366f1]" },
                                    { id: "cyberpunk", color: "bg-[#00f0ff]" },
                                    { id: "matrix", color: "bg-[#00ff66]" },
                                    { id: "sunset", color: "bg-[#ff5e36]" }
                                ].map(t => (
                                    <button
                                        key={t.id}
                                        onClick={() => { setTheme(t.id); playClickSound(); }}
                                        className={`w-4 h-4 rounded-full ${t.color} focus:outline-none ${theme === t.id ? "ring-2 ring-white scale-110" : ""}`}
                                    />
                                ))}
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-400">Sound:</span>
                            <button
                                onClick={() => {
                                    const nextSound = !soundEnabled;
                                    setSoundEnabled(nextSound);
                                    localStorage.setItem("soundEnabled", nextSound ? "true" : "false");
                                    if (nextSound) playClickSound();
                                }}
                                className="p-1.5 rounded-lg border border-white/10 text-white"
                            >
                                {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-indigo-400" /> : <VolumeX className="w-3.5 h-3.5 text-gray-500" />}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;