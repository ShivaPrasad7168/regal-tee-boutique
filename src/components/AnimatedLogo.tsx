import { useState, useEffect } from "react";
import logo from "@/assets/onyxia-logo.png";

export const AnimatedLogo = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Check if animation has been shown before
    const hasSeenAnimation = sessionStorage.getItem("onyxia_intro_seen");
    
    if (hasSeenAnimation) {
      setIsVisible(false);
      return;
    }

    // Hide animation after 4 seconds
    const timer = setTimeout(() => {
      setIsVisible(false);
      sessionStorage.setItem("onyxia_intro_seen", "true");
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-background flex items-center justify-center animate-fade-out" style={{ animationDelay: "3.5s" }}>
      {/* Animated starry background */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-foreground/30 rounded-full animate-pulse"
            style={{
              width: Math.random() * 3 + 1 + "px",
              height: Math.random() * 3 + 1 + "px",
              top: Math.random() * 100 + "%",
              left: Math.random() * 100 + "%",
              animationDelay: Math.random() * 2 + "s",
              animationDuration: Math.random() * 3 + 2 + "s",
            }}
          />
        ))}
      </div>

      {/* Flying bird that transforms into logo */}
      <div className="relative">
        {/* Bird animation */}
        <svg
          className="absolute inset-0 w-32 h-32 animate-[fly_2s_ease-in-out]"
          style={{
            animation: "fly 2s ease-in-out forwards, fade-out 0.5s 2s forwards",
          }}
          viewBox="0 0 100 100"
          fill="none"
        >
          <path
            d="M30 50 Q20 30, 10 40 M30 50 L50 35 L70 50 Q80 30, 90 40 M50 35 L50 60"
            stroke="hsl(45 100% 51%)"
            strokeWidth="2"
            strokeLinecap="round"
            className="animate-pulse"
          />
        </svg>

        {/* Phoenix logo that appears */}
        <div className="relative animate-[phoenix-glow_2s_2s_ease-out_forwards] opacity-0">
          <img
            src={logo}
            alt="ONYXIA Phoenix"
            className="w-64 h-64 object-contain drop-shadow-[0_0_50px_rgba(255,204,0,0.6)]"
          />
          
          {/* Magical particle effects */}
          <div className="absolute inset-0">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-primary rounded-full animate-[particle_2s_2s_ease-out_forwards] opacity-0"
                style={{
                  top: "50%",
                  left: "50%",
                  animationDelay: 2 + i * 0.05 + "s",
                  "--tx": Math.cos((i / 20) * Math.PI * 2) * 150 + "px",
                  "--ty": Math.sin((i / 20) * Math.PI * 2) * 150 + "px",
                } as React.CSSProperties}
              />
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fly {
          0% {
            transform: translate(-100vw, 50vh) scale(0.5);
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
          100% {
            transform: translate(0, 0) scale(1);
            opacity: 1;
          }
        }

        @keyframes phoenix-glow {
          0% {
            opacity: 0;
            transform: scale(0.5);
            filter: blur(20px);
          }
          50% {
            opacity: 1;
            transform: scale(1.1);
          }
          100% {
            opacity: 1;
            transform: scale(1);
            filter: blur(0);
          }
        }

        @keyframes particle {
          0% {
            opacity: 0;
            transform: translate(0, 0) scale(0);
          }
          50% {
            opacity: 1;
          }
          100% {
            opacity: 0;
            transform: translate(var(--tx), var(--ty)) scale(0);
          }
        }

        @keyframes fade-out {
          to {
            opacity: 0;
            pointer-events: none;
          }
        }
      `}</style>
    </div>
  );
};