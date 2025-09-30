import { useEffect, useState } from "react";
import phoenixImg from "@/assets/product-1.jpg"; // Replace with your phoenix jpg file
import logoImg from "@/assets/onyxia-logo.png";
import "./PhoenixIntro.css";

const PhoenixIntro = ({ onFinish }) => {
  const [stage, setStage] = useState("phoenix"); // phoenix -> morph -> logo -> disappear

  useEffect(() => {
    const timer1 = setTimeout(() => setStage("morph"), 2500); // show phoenix for 2.5s
    const timer2 = setTimeout(() => setStage("logo"), 4000); // morph duration 1.5s
    const timer3 = setTimeout(() => {
      setStage("disappear");
      onFinish && onFinish();
    }, 5500); // logo for 1.5s, then disappear
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [onFinish]);

  return (
    <div className={`phoenix-intro-overlay ${stage}`}>
      {(stage === "phoenix" || stage === "morph") && (
        <img
          src={phoenixImg}
          alt="Majestic Phoenix"
          className="phoenix-img"
        />
      )}
      {(stage === "morph" || stage === "logo" || stage === "disappear") && (
        <img
          src={logoImg}
          alt="ONYXIA Logo"
          className={`onyxia-logo ${stage}`}
        />
      )}
      {/* Embers and glow effects */}
      <div className="phoenix-embers" />
    </div>
  );
};

export default PhoenixIntro;
