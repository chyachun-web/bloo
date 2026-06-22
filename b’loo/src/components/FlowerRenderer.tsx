import React from "react";

interface FlowerRendererProps {
  name: string;
  size?: number;
  glowing?: boolean;
  swaySpeed?: "normal" | "slow" | "fast" | "none";
}

export const FlowerRenderer: React.FC<FlowerRendererProps> = ({
  name = "白鬱金香",
  size = 120,
  glowing = false,
  swaySpeed = "normal",
}) => {
  // Normalize the name to find the best species match
  const n = name.toLowerCase();
  
  let swayClass = "animate-sway";
  if (swaySpeed === "slow") swayClass = "animate-sway-slow";
  if (swaySpeed === "fast") swayClass = "animate-sway-fast";
  if (swaySpeed === "none") swayClass = "";

  // Render different SVG vectors representing premium Korean editorial illustrations
  const renderFlowerSVG = () => {
    if (n.includes("繡球") || n.includes("hydrangea")) {
      // Hydrangea: beautiful clusters of florets with gradient shifts
      return (
        <svg viewBox="0 0 100 120" className="w-full h-full">
          {/* Leaves */}
          <path d="M 25 80 C 10 70, 15 50, 45 65" fill="#BCE3CD" opacity="0.8" />
          <path d="M 75 80 C 90 70, 85 50, 55 65" fill="#BCE3CD" opacity="0.8" />
          <line x1="50" y1="65" x2="50" y2="120" stroke="#93C4A1" strokeWidth="2.5" />
          
          {/* Main cluster support */}
          <circle cx="50" cy="45" r="28" fill="url(#blueHydrangeaGrad)" opacity="0.95" />
          
          {/* Florets */}
          <circle cx="36" cy="35" r="6" fill="#D2E8F6" />
          <circle cx="36" cy="35" r="1.5" fill="#FFFFFF" />
          
          <circle cx="48" cy="28" r="7" fill="#BDDCF0" />
          <circle cx="48" cy="28" r="2" fill="#FFFFFF" />
          
          <circle cx="62" cy="34" r="6.5" fill="#C9E1F2" />
          <circle cx="62" cy="34" r="1.5" fill="#FFFFFF" />
          
          <circle cx="64" cy="48" r="7" fill="#AED4EE" />
          <circle cx="64" cy="48" r="2" fill="#FFFFFF" />
          
          <circle cx="50" cy="54" r="6.5" fill="#B5D7F0" />
          <circle cx="50" cy="54" r="1.5" fill="#FFFFFF" />
          
          <circle cx="37" cy="48" r="6" fill="#C2DFF4" />
          <circle cx="37" cy="48" r="1.5" fill="#FFFFFF" />
          
          <circle cx="48" cy="41" r="8" fill="#E1EEF7" />
          <circle cx="48" cy="41" r="2.5" fill="#89C4E9" />
          
          {/* Definitions */}
          <defs>
            <radialGradient id="blueHydrangeaGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#E9F3FC" />
              <stop offset="50%" stopColor="#A8D1EE" />
              <stop offset="100%" stopColor="#7FAFD4" />
            </radialGradient>
          </defs>
        </svg>
      );
    } else if (n.includes("滿天星") || n.includes("baby")) {
      // Baby's Breath: elegant twigs with clusters of miniature white nodes
      return (
        <svg viewBox="0 0 100 120" className="w-full h-full">
          {/* Delicate Stems */}
          <path d="M 50 110 C 50 90, 48 55, 48 40" fill="none" stroke="#A7C2A3" strokeWidth="2" strokeLinecap="round" />
          <path d="M 48 75 C 42 65, 30 55, 26 48" fill="none" stroke="#A7C2A3" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M 48 65 C 55 55, 70 45, 76 38" fill="none" stroke="#A7C2A3" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M 48 50 C 44 40, 36 30, 35 24" fill="none" stroke="#A7C2A3" strokeWidth="1.2" strokeLinecap="round" />
          
          {/* Miniature Fluffy Buds */}
          {/* Stem 1 ends */}
          <circle cx="48" cy="40" r="3.5" fill="#FFFFFF" stroke="#D3E6D0" strokeWidth="0.5" />
          <circle cx="46" cy="38" r="1.5" fill="#E8F4E6" />
          
          {/* Stem 2 branches */}
          <circle cx="26" cy="48" r="3" fill="#FFFFFF" stroke="#D3E6D0" strokeWidth="0.5" />
          <circle cx="21" cy="45" r="2.5" fill="#FFFFFF" stroke="#D3E6D0" strokeWidth="0.5" />
          <circle cx="30" cy="42" r="2.8" fill="#FFFFFF" stroke="#D3E6D0" strokeWidth="0.5" />

          {/* Stem 3 branches */}
          <circle cx="76" cy="38" r="3.2" fill="#FFFFFF" stroke="#D3E6D0" strokeWidth="0.5" />
          <circle cx="82" cy="34" r="2.5" fill="#FFFFFF" stroke="#D3E6D0" strokeWidth="0.5" />
          <circle cx="71" cy="32" r="2.8" fill="#FFFFFF" stroke="#D3E6D0" strokeWidth="0.5" />

          {/* Top Branch */}
          <circle cx="35" cy="24" r="3" fill="#FFFFFF" stroke="#D3E6D0" strokeWidth="0.5" />
          <circle cx="41" cy="20" r="2.5" fill="#FFFFFF" stroke="#D3E6D0" strokeWidth="0.5" />
        </svg>
      );
    } else if (n.includes("鬱金香") || n.includes("tulip")) {
      // White Tulip: smooth editorial shape, serene and classy
      return (
        <svg viewBox="0 0 100 120" className="w-full h-full">
          {/* Stem */}
          <path d="M 50 65 C 50 85, 52 105, 50 115" fill="none" stroke="#90A98D" strokeWidth="2.5" strokeLinecap="round" />
          {/* Leaf */}
          <path d="M 50 95 C 32 80, 28 60, 48 70" fill="#9FB79C" opacity="0.9" />
          
          {/* Flower Cup with layered gradients */}
          {/* Back petals */}
          <path d="M 32 50 C 30 25, 42 22, 50 48" fill="#F4EFE6" />
          <path d="M 68 50 C 70 25, 58 22, 50 48" fill="#EFECE3" />
          
          {/* Center inner shadow */}
          <ellipse cx="50" cy="45" rx="14" ry="18" fill="#E6E0D4" />
          
          {/* Front wrap petals */}
          <path d="M 32 50 C 35 25, 48 18, 55 46" fill="#FAF8F3" />
          <path d="M 68 50 C 65 25, 52 18, 45 46" fill="#FCFAF6" />
          <path d="M 38 52 C 45 35, 55 35, 62 52 C 55 60, 45 60, 38 52" fill="#FFFFFF" opacity="0.95" />
        </svg>
      );
    } else if (n.includes("金盞") || n.includes("marigold") || n.includes("sunflower") || n.includes("向日葵")) {
      // Warm orange marigold / radiant gold sunflower
      const isMarigold = n.includes("金盞") || n.includes("marigold");
      const petColor1 = isMarigold ? "#FFB84D" : "#FFD43B";
      const petColor2 = isMarigold ? "#FF922B" : "#FAB005";
      const centerCol = isMarigold ? "#D9480F" : "#7A4D14";

      return (
        <svg viewBox="0 0 100 120" className="w-full h-full">
          {/* Stem & Leaves */}
          <path d="M 50 80 C 50 95, 48 110, 48 115" fill="none" stroke="#91A18F" strokeWidth="2.5" />
          <path d="M 50 90 C 62 82, 65 72, 50 82" fill="#A2B2A0" />
          <path d="M 48 97 C 36 90, 32 80, 48 88" fill="#A2B2A0" />

          {/* Petals arranged circularly */}
          <g transform="translate(50, 45)">
            {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
              <g transform={`rotate(${deg})`} key={deg}>
                {/* Back large petal */}
                <path d="M 0 -8 C -10 -25, 10 -25, 0 -8" fill={petColor1} opacity="0.9" />
                {/* Front layer petal */}
                <path d="M 0 -8 C -6 -20, 6 -20, 0 -8" fill={petColor2} />
              </g>
            ))}
            {/* Center disc */}
            <circle cx="0" cy="0" r="14" fill={centerCol} />
            <circle cx="0" cy="0" r="12" fill="url(#sunflowerCoreGrad)" />
            <circle cx="-2" cy="-2" r="3" fill="#FFE082" opacity="0.4" />
          </g>
          <defs>
            <radialGradient id="sunflowerCoreGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#493112" />
              <stop offset="85%" stopColor={centerCol} />
              <stop offset="100%" stopColor="#2F1F0A" />
            </radialGradient>
          </defs>
        </svg>
      );
    } else if (n.includes("洋甘菊") || n.includes("chamomile") || n.includes("雛菊") || n.includes("daisy")) {
      // Chamomile / Daisy: dainty and comforting
      return (
        <svg viewBox="0 0 100 120" className="w-full h-full">
          {/* Stem */}
          <path d="M 50 60 C 50 80, 49 100, 48 115" fill="none" stroke="#A3B2A0" strokeWidth="2" />
          <path d="M 49 85 C 55 78, 62 75, 49 80" fill="#B4C4B1" />

          <g transform="translate(50, 45)">
            {/* Petals */}
            {[0, 24, 48, 72, 96, 120, 144, 168, 192, 216, 240, 264, 288, 312, 336].map((deg) => (
              <g transform={`rotate(${deg})`} key={deg}>
                <ellipse cx="0" cy="-18" rx="4.5" ry="11" fill="#FFFFFF" stroke="#E8E2D5" strokeWidth="0.5" />
                <ellipse cx="0" cy="-14" rx="2" ry="7" fill="#FCFAF6" />
              </g>
            ))}
            {/* Soft shadow */}
            <circle cx="0" cy="1" r="9" fill="#000" opacity="0.04" />
            {/* Domed Yellow Seed center */}
            <circle cx="0" cy="0" r="9" fill="url(#chamomileCore)" />
            <circle cx="-1.5" cy="-2.5" r="2.5" fill="#FFF" opacity="0.35" />
          </g>
          <defs>
            <radialGradient id="chamomileCore" cx="45%" cy="45%" r="55%">
              <stop offset="0%" stopColor="#FEE440" />
              <stop offset="60%" stopColor="#FFB703" />
              <stop offset="100%" stopColor="#FB8500" />
            </radialGradient>
          </defs>
        </svg>
      );
    } else if (n.includes("玫瑰") || n.includes("rose")) {
      // Classic Rose: elegant, swirling delicate pink/peach
      return (
        <svg viewBox="0 0 100 120" className="w-full h-full">
          {/* Stem & thorns */}
          <path d="M 50 70 C 50 90, 50 105, 50 115" fill="none" stroke="#879984" strokeWidth="2.5" />
          <path d="M 50 82 L 44 80 L 50 85" fill="#879984" />
          <path d="M 50 96 L 56 94 L 50 99" fill="#879984" />
          
          <path d="M 50 85 C 65 72, 72 65, 52 75" fill="#98AB95" />
          <path d="M 50 93 C 35 83, 28 72, 48 83" fill="#98AB95" />

          {/* Blossom layering */}
          <g transform="translate(50, 45)">
            <ellipse cx="0" cy="0" rx="28" ry="24" fill="url(#roseOuterGrad)" />
            
            {/* Swirling petals */}
            <path d="M -16 -12 C -8 -26, 12 -26, 18 -10 C 12 -6, -6 -6, -16 -12" fill="#FFC9C9" opacity="0.9" />
            <path d="M -22 6 C -28 -10, -5 -18, 0 -6 C -6 6, -16 12, -22 6" fill="#FFA3A3" opacity="0.8" />
            <path d="M 22 4 C 28 -8, 12 -20, 2 -8 C 6 2, 14 10, 22 4" fill="#FFB3B3" opacity="0.8" />
            
            {/* Core compact spiral */}
            <circle cx="0" cy="0" r="13" fill="#FF8E8E" />
            <path d="M -8 -3 C -5 -12, 5 -12, 8 -3 C 5 2, -5 2, -8 -3" fill="#E65F5F" />
            <path d="M -5 -1 C -1 -6, 4 -6, 5 -1 C 2 3, -2 3, -5 -1" fill="#C93B3B" />
            <circle cx="0" cy="0" r="4.5" fill="#A82828" />
          </g>
          
          <defs>
            <radialGradient id="roseOuterGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFF2F2" />
              <stop offset="60%" stopColor="#FFD2D2" />
              <stop offset="100%" stopColor="#FFA6A6" />
            </radialGradient>
          </defs>
        </svg>
      );
    } else if (n.includes("薰衣草") || n.includes("lavender")) {
      // Lavender: tall spikes with layered lavender clusters
      return (
        <svg viewBox="0 0 100 120" className="w-full h-full">
          {/* Tall Stem */}
          <line x1="50" y1="20" x2="50" y2="115" stroke="#7C927A" strokeWidth="2" strokeLinecap="round" />
          <path d="M 50 100 C 35 90, 42 70, 50 85" fill="none" stroke="#8EA68B" strokeWidth="1.5" />
          <path d="M 50 95 C 65 85, 58 65, 50 80" fill="none" stroke="#8EA68B" strokeWidth="1.5" />

          {/* Lavender stacks */}
          {[
            { y: 30, r: 8, fill: "#B599CE" },
            { y: 40, r: 10, fill: "#A281C3" },
            { y: 50, r: 11, fill: "#956FB9" },
            { y: 60, r: 11, fill: "#885DB0" },
            { y: 70, r: 10, fill: "#7E50A7" },
            { y: 80, r: 8, fill: "#6A3F93" }
          ].map((stack, idx) => (
            <g key={idx} transform={`translate(50, ${stack.y})`}>
              {/* Petal whorl */}
              <ellipse cx="-7" cy="0" rx="6" ry="4.5" fill={stack.fill} transform="rotate(-15)" />
              <ellipse cx="7" cy="0" rx="6" ry="4.5" fill={stack.fill} transform="rotate(15)" />
              <ellipse cx="0" cy="-4" rx="4.5" ry="6" fill={stack.fill} />
              
              {/* Soft highlighted spots */}
              <circle cx="-5" cy="-2" r="1.5" fill="#E2D4EE" />
              <circle cx="5" cy="-2" r="1.5" fill="#E2D4EE" />
              <circle cx="0" cy="-6" r="1.2" fill="#FFFFFF" />
            </g>
          ))}
        </svg>
      );
    } else if (n.includes("勿忘我") || n.includes("forget")) {
      // Forget-Me-Not: dainty baby blue 5-petalled flower groups
      return (
        <svg viewBox="0 0 100 120" className="w-full h-full">
          {/* Branches */}
          <path d="M 50 110 C 50 85, 45 60, 45 45" fill="none" stroke="#89A186" strokeWidth="2.2" />
          <path d="M 47 75 C 55 65, 66 50, 68 40" fill="none" stroke="#89A186" strokeWidth="1.8" />
          <path d="M 46 60 C 36 50, 26 40, 22 35" fill="none" stroke="#89A186" strokeWidth="1.5" strokeLinecap="round" />

          {/* Dainty flower 1 (Center top) */}
          <g transform="translate(45, 38) scale(0.95)">
            {[0, 72, 144, 216, 288].map((deg) => (
              <ellipse key={deg} cx="0" cy="-10" rx="6.5" ry="7.5" fill="#8ECAF0" stroke="#7CB9E0" strokeWidth="0.5" transform={`rotate(${deg})`} />
            ))}
            <circle cx="0" cy="0" r="3.2" fill="#FFD13B" />
            <circle cx="0" cy="0" r="1" fill="#FFFFFF" />
          </g>

          {/* Dainty flower 2 (Right branch) */}
          <g transform="translate(68, 38) scale(0.85)">
            {[0, 72, 144, 216, 288].map((deg) => (
              <ellipse key={deg} cx="0" cy="-10" rx="6" ry="7" fill="#A5D7F4" stroke="#8ECAF0" strokeWidth="0.5" transform={`rotate(${deg})`} />
            ))}
            <circle cx="0" cy="0" r="3" fill="#FFD13B" />
            <circle cx="0" cy="0" r="1" fill="#FFFFFF" />
          </g>

          {/* Dainty flower 3 (Left branch) */}
          <g transform="translate(22, 33) scale(0.8)">
            {[0, 72, 144, 216, 288].map((deg) => (
              <ellipse key={deg} cx="0" cy="-10" rx="6.5" ry="7" fill="#7DBFE6" stroke="#68AED6" strokeWidth="0.5" transform={`rotate(${deg})`} />
            ))}
            <circle cx="0" cy="0" r="3" fill="#FFC000" />
            <circle cx="0" cy="0" r="1" fill="#FFFFFF" />
          </g>
        </svg>
      );
    } else {
      // Generic beautiful flower - Elegant Poppy / Morning Glory style
      return (
        <svg viewBox="0 0 100 120" className="w-full h-full">
          {/* Stem & Leaves */}
          <path d="M 50 65 C 50 85, 48 105, 48 115" fill="none" stroke="#7BA88F" strokeWidth="2" />
          <path d="M 50 80 C 62 70, 58 60, 50 72" fill="#8EBDA3" />
          <path d="M 48 90 C 35 80, 32 72, 48 82" fill="#8EBDA3" />
          
          {/* Flower Cup */}
          <g transform="translate(50, 45)">
            <circle cx="0" cy="0" r="24" fill="url(#genericFlowerGrad)" />
            
            {/* Heart petal overlays representing "Bloom With Love" */}
            {[0, 90, 180, 270].map((deg) => (
              <g transform={`rotate(${deg})`} key={deg}>
                <path d="M -12 -5 C -18 -26, 18 -26, 12 -5 Z" fill="#93C8E6" opacity="0.85" />
                <path d="M -8 -3 C -12 -18, 12 -18, 8 -3 Z" fill="#A7D5EE" />
              </g>
            ))}
            {/* Center pistils */}
            <circle cx="0" cy="0" r="6" fill="#F6EAC2" />
            <circle cx="0" cy="0" r="3" fill="#E8C354" />
            {/* Soft pollen dots */}
            <circle cx="-5" cy="-5" r="1" fill="#E8C354" />
            <circle cx="5" cy="-5" r="1" fill="#E8C354" />
            <circle cx="-5" cy="5" r="1" fill="#E8C354" />
            <circle cx="5" cy="5" r="1" fill="#E8C354" />
          </g>
          <defs>
            <radialGradient id="genericFlowerGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="70%" stopColor="#CBE4F2" />
              <stop offset="100%" stopColor="#A4CCE1" />
            </radialGradient>
          </defs>
        </svg>
      );
    }
  };

  return (
    <div
      style={{ width: size, height: size }}
      className={`relative inline-flex items-center justify-center select-none ${swayClass}`}
    >
      {/* Immersive Glowing Halo effect in Baby Blue / Gold */}
      {glowing && (
        <div className="absolute inset-0 rounded-full bg-radial from-[#a3c9e8]/30 via-transparent to-transparent scale-[1.6] pointer-events-none filter blur-md animate-pulse duration-[3000ms]" />
      )}
      
      {/* Decorative gentle floating sparkles around special flowers */}
      {glowing && (
        <>
          <div className="absolute top-0 left-1/4 w-1.5 h-1.5 rounded-full bg-[#FFF] opacity-80 animate-ping" />
          <div className="absolute bottom-1/4 right-0 w-2 h-2 rounded-full bg-[#FFF0F5] opacity-60 animate-bounce" />
          <div className="absolute top-1/3 right-1/4 w-1 h-1 rounded-full bg-yellow-300 opacity-90 animate-pulse" />
        </>
      )}

      {/* SVG Image */}
      <div className="w-full h-full py-2">
        {renderFlowerSVG()}
      </div>
    </div>
  );
};
