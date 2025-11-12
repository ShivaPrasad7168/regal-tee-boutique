
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
      className={`fixed inset-0 z-[100] bg-black flex items-center justify-center transition-opacity duration-500 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="text-center animate-fade-in-scale">
        <img
          src={logo}
          alt="ONYXIA Logo"
          className="h-40 w-40 mx-auto mb-6 rounded-full object-cover"
        />

      </div>
    </div>
  );
};

export default IntroAnimation;