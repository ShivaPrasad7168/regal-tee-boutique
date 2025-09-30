import React, { useEffect, useRef, useState } from "react";
import onyxiaLogo from "@/assets/onyxia-logo.png";

/**
 * AnimatedLogo: Bird flying, morphs into ONYXIA logo, then fades out
 */
const AnimatedLogo: React.FC<{ onFinish: () => void }> = ({ onFinish }) => {
  const [phase, setPhase] = useState<"bird" | "morph" | "logo" | "hidden">("bird");
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Bird flies for 1.5s, morph for 1s, logo for 1s, then hide
    if (phase === "bird") {
      timeoutRef.current = setTimeout(() => setPhase("morph"), 1500);
    } else if (phase === "morph") {
      timeoutRef.current = setTimeout(() => setPhase("logo"), 1000);
    } else if (phase === "logo") {
      timeoutRef.current = setTimeout(() => {
        setPhase("hidden");
        onFinish();
      }, 1000);
    }
    return () => timeoutRef.current && clearTimeout(timeoutRef.current);
  }, [phase, onFinish]);

  if (phase === "hidden") return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 transition-all duration-700">
      {/* Bird Animation */}
      {phase === "bird" && (
        <svg width="120" height="120" viewBox="0 0 120 120" className="animate-bird-fly">
          {/* Simple bird shape with flapping wings animation */}
          <g>
            <ellipse cx="60" cy="60" rx="18" ry="10" fill="#222" />
            <path className="animate-bird-wing" d="M60 60 Q40 40 20 60" stroke="#222" strokeWidth="4" fill="none" />
            <path className="animate-bird-wing" d="M60 60 Q80 40 100 60" stroke="#222" strokeWidth="4" fill="none" />
          </g>
        </svg>
      )}
      {/* Morph Animation */}
      {phase === "morph" && (
        <div className="relative w-[120px] h-[120px] flex items-center justify-center animate-morph">
          <svg width="120" height="120" viewBox="0 0 120 120" className="absolute">
            <ellipse cx="60" cy="60" rx="18" ry="10" fill="#222" opacity="0.5" />
          </svg>
          <img src={onyxiaLogo} alt="ONYXIA Logo" className="absolute w-[100px] h-[100px] rounded-full opacity-60" />
        </div>
      )}
      {/* Logo Display */}
      {phase === "logo" && (
        <img
          src={onyxiaLogo}
          alt="ONYXIA Logo"
          className="w-[120px] h-[120px] rounded-full shadow-lg animate-logo-fade"
        />
      )}
      <style>{`
        .animate-bird-fly {
          animation: birdFly 1.5s cubic-bezier(.4,2,.6,1) forwards;
        }
        .animate-bird-wing {
          animation: birdWing 0.4s infinite alternate;
        }
        @keyframes birdFly {
          0% { transform: translateY(40px) scale(0.7); opacity: 0.7; }
          80% { transform: translateY(-10px) scale(1.1); opacity: 1; }
          100% { transform: translateY(0) scale(1); opacity: 1; }
        }
        @keyframes birdWing {
          0% { transform: rotate(-20deg); }
          100% { transform: rotate(20deg); }
        }
        .animate-morph {
          animation: morphLogo 1s cubic-bezier(.4,2,.6,1) forwards;
        }
        @keyframes morphLogo {
          0% { opacity: 0.7; filter: blur(2px); }
          100% { opacity: 1; filter: blur(0); }
        }
        .animate-logo-fade {
          animation: logoFade 1s ease-in forwards;
        }
        @keyframes logoFade {
          0% { opacity: 0; transform: scale(0.8); }
          100% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
};

export default AnimatedLogo;
