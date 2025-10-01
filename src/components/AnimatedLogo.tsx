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

    // Hide animation after 6 seconds
    const timer = setTimeout(() => {
      setIsVisible(false);
      sessionStorage.setItem("onyxia_intro_seen", "true");
    }, 6000);

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-gradient-to-b from-[#0a0a1a] via-[#1a1a2e] to-background flex items-center justify-center animate-fade-out" style={{ animationDelay: "5.5s", animationDuration: "0.5s" }}>
      {/* Night sky with twinkling stars */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(100)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-foreground rounded-full"
            style={{
              width: Math.random() * 2 + 0.5 + "px",
              height: Math.random() * 2 + 0.5 + "px",
              top: Math.random() * 100 + "%",
              left: Math.random() * 100 + "%",
              opacity: Math.random() * 0.7 + 0.3,
              animation: `twinkle ${Math.random() * 3 + 2}s ease-in-out infinite`,
              animationDelay: Math.random() * 2 + "s",
              boxShadow: `0 0 ${Math.random() * 4 + 2}px rgba(255,255,255,${Math.random() * 0.5 + 0.5})`,
            }}
          />
        ))}
      </div>

      {/* Moon */}
      <div 
        className="absolute top-20 right-20 w-24 h-24 rounded-full bg-gradient-to-br from-foreground/40 to-foreground/10 blur-sm"
        style={{ boxShadow: "0 0 60px rgba(255,255,255,0.2)" }}
      />

      {/* Flying bird that transforms into phoenix */}
      <div className="relative flex items-center justify-center">
        {/* Elegant bird silhouette */}
        <svg
          className="absolute w-40 h-40"
          style={{
            animation: "bird-flight 3s cubic-bezier(0.4, 0, 0.2, 1) forwards",
          }}
          viewBox="0 0 200 200"
          fill="none"
        >
          {/* Bird body and wings with graceful curves */}
          <g className="bird-shape">
            {/* Left wing */}
            <path
              d="M100 100 Q60 70, 40 85 Q50 95, 70 90 Q85 95, 100 100"
              fill="hsl(45 100% 51%)"
              opacity="0.8"
              style={{ animation: "wing-flap 0.6s ease-in-out infinite" }}
            />
            {/* Right wing */}
            <path
              d="M100 100 Q140 70, 160 85 Q150 95, 130 90 Q115 95, 100 100"
              fill="hsl(45 100% 51%)"
              opacity="0.8"
              style={{ animation: "wing-flap 0.6s ease-in-out infinite 0.3s" }}
            />
            {/* Body */}
            <ellipse cx="100" cy="100" rx="12" ry="20" fill="hsl(45 100% 51%)" />
            {/* Head */}
            <circle cx="100" cy="85" r="8" fill="hsl(45 100% 51%)" />
            {/* Tail */}
            <path
              d="M100 120 L95 140 M100 120 L100 145 M100 120 L105 140"
              stroke="hsl(45 100% 51%)"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </g>
          
          {/* Magical trail */}
          <g className="magic-trail">
            {[...Array(8)].map((_, i) => (
              <circle
                key={i}
                cx="100"
                cy="100"
                r="2"
                fill="hsl(45 100% 51%)"
                opacity="0"
                style={{
                  animation: `trail-particle 0.8s ease-out infinite`,
                  animationDelay: `${i * 0.1}s`,
                }}
              />
            ))}
          </g>
        </svg>

        {/* Phoenix logo emergence with rebirth effect */}
        <div 
          className="relative"
          style={{
            animation: "phoenix-rebirth 2.5s 2.5s cubic-bezier(0.4, 0, 0.2, 1) forwards",
            opacity: 0,
            transform: "scale(0)",
          }}
        >
          {/* Glowing aura rings */}
          <div className="absolute inset-0 flex items-center justify-center">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full border-2 border-primary"
                style={{
                  width: `${300 + i * 50}px`,
                  height: `${300 + i * 50}px`,
                  animation: `energy-ring 2s ${2.5 + i * 0.2}s ease-out forwards`,
                  opacity: 0,
                }}
              />
            ))}
          </div>

          {/* Phoenix logo */}
          <img
            src={logo}
            alt="ONYXIA Phoenix"
            className="w-80 h-80 object-contain relative z-10"
            style={{
              filter: "drop-shadow(0 0 40px rgba(255,204,0,0.8)) drop-shadow(0 0 80px rgba(255,204,0,0.4))",
              animation: "phoenix-pulse 2s 4.5s ease-in-out infinite",
            }}
          />
          
          {/* Magical particle burst */}
          <div className="absolute inset-0">
            {[...Array(36)].map((_, i) => {
              const angle = (i / 36) * Math.PI * 2;
              const distance = 200;
              return (
                <div
                  key={i}
                  className="absolute w-3 h-3 rounded-full"
                  style={{
                    top: "50%",
                    left: "50%",
                    background: `radial-gradient(circle, hsl(${45 + Math.random() * 30} 100% 51%), transparent)`,
                    animation: `particle-burst 1.5s ${2.8 + i * 0.02}s ease-out forwards`,
                    opacity: 0,
                    "--angle": `${angle}rad`,
                    "--distance": `${distance}px`,
                  } as React.CSSProperties}
                />
              );
            })}
          </div>

          {/* Fire embers rising */}
          <div className="absolute inset-0">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 rounded-full bg-primary"
                style={{
                  bottom: "10%",
                  left: `${30 + Math.random() * 40}%`,
                  animation: `ember-rise 3s ${3 + Math.random() * 2}s ease-out infinite`,
                  opacity: 0,
                }}
              />
            ))}
          </div>

          {/* Mystical glow pulse */}
          <div 
            className="absolute inset-0 rounded-full"
            style={{
              background: "radial-gradient(circle, rgba(255,204,0,0.3), transparent 70%)",
              animation: "mystical-glow 2s 3s ease-in-out infinite",
              filter: "blur(40px)",
            }}
          />
        </div>
      </div>

      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
        }

        @keyframes bird-flight {
          0% {
            transform: translate(-150vw, 40vh) rotate(-15deg) scale(0.6);
            opacity: 0;
          }
          15% {
            opacity: 1;
          }
          40% {
            transform: translate(-20vw, -10vh) rotate(-5deg) scale(0.8);
          }
          60% {
            transform: translate(0, 0) rotate(0deg) scale(1);
          }
          100% {
            transform: translate(0, 0) rotate(0deg) scale(1);
            opacity: 0;
          }
        }

        @keyframes wing-flap {
          0%, 100% { transform: translateY(0) scaleY(1); }
          50% { transform: translateY(-8px) scaleY(1.1); }
        }

        @keyframes trail-particle {
          0% { opacity: 0.8; transform: translateX(0); }
          100% { opacity: 0; transform: translateX(-100px); }
        }

        @keyframes phoenix-rebirth {
          0% {
            opacity: 0;
            transform: scale(0) rotate(-180deg);
            filter: blur(30px) brightness(2);
          }
          50% {
            opacity: 1;
            transform: scale(1.15) rotate(0deg);
            filter: blur(10px) brightness(1.5);
          }
          70% {
            transform: scale(0.95) rotate(0deg);
          }
          100% {
            opacity: 1;
            transform: scale(1) rotate(0deg);
            filter: blur(0) brightness(1);
          }
        }

        @keyframes energy-ring {
          0% {
            opacity: 0;
            transform: scale(0.5);
          }
          50% {
            opacity: 0.6;
          }
          100% {
            opacity: 0;
            transform: scale(1.5);
          }
        }

        @keyframes particle-burst {
          0% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0);
          }
          30% {
            opacity: 1;
          }
          100% {
            opacity: 0;
            transform: translate(
              calc(-50% + cos(var(--angle)) * var(--distance)), 
              calc(-50% + sin(var(--angle)) * var(--distance))
            ) scale(0);
          }
        }

        @keyframes ember-rise {
          0% {
            opacity: 0;
            transform: translateY(0) translateX(0);
          }
          20% {
            opacity: 1;
          }
          100% {
            opacity: 0;
            transform: translateY(-200px) translateX(${Math.random() * 40 - 20}px);
          }
        }

        @keyframes mystical-glow {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.1); }
        }

        @keyframes phoenix-pulse {
          0%, 100% { filter: drop-shadow(0 0 40px rgba(255,204,0,0.8)) drop-shadow(0 0 80px rgba(255,204,0,0.4)); }
          50% { filter: drop-shadow(0 0 60px rgba(255,204,0,1)) drop-shadow(0 0 120px rgba(255,204,0,0.6)); }
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