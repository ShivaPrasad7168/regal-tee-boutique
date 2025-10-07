
import { useEffect, useState } from "react";
import logo from "../assets/onyxia-logo.png";

const IntroAnimation = ({ onComplete }: { onComplete: () => void }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 500);
    }, 2500);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-[100] bg-background flex items-center justify-center transition-opacity duration-500 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="text-center animate-fade-in-scale">
        <img
          src={logo}
          alt="ONYXIA Logo"
          className="h-40 w-40 mx-auto mb-6 rounded-full object-cover shadow-gold animate-glow"
        />
        <h1 className="text-4xl md:text-5xl font-cinzel font-bold text-gradient-gold mb-2">
          ONYXIA
        </h1>
        <p className="text-secondary text-sm tracking-[0.3em] uppercase">
          Luxury Fashion
        </p>
      </div>
    </div>
  );
};

export default IntroAnimation;