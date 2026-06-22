import React, { useState, useEffect } from "react";
import { Sparkles, FileText, Smartphone, Laptop, Check } from "lucide-react";

interface IPhoneMockupProps {
  children: React.ReactNode;
  activeWorkMode: "app" | "specs";
  onModeChange: (mode: "app" | "specs") => void;
}

export const IPhoneMockup: React.FC<IPhoneMockupProps> = ({
  children,
  activeWorkMode,
  onModeChange,
}) => {
  const [currentTime, setCurrentTime] = useState("09:41");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      let minutes = now.getMinutes().toString().padStart(2, "0");
      setCurrentTime(`${hours}:${minutes}`);
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full min-h-screen bg-cream py-8 px-4 flex flex-col items-center justify-start font-sans">
      
      {/* Top Header Panel representing b'loo Creative Studio */}
      <div className="w-full max-w-6xl mb-8 flex flex-col sm:flex-row items-center justify-between border-b border-[#a3c9e8]/30 pb-6 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-bernoru font-black text-2xl text-gray-800 tracking-tighter">b’loo</span>
            <span className="text-xs bg-[#a3c9e8]/30 text-gray-700 px-2 py-0.5 rounded-full font-mono">Creative Suite</span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            韓系風格數位療癒花園 · Senior UX/UI Design & Product Spec Pitch Deck
          </p>
        </div>

        {/* Studio Control Toggles for Senior PM/UX reviewer */}
        <div className="flex bg-white shadow-xs border border-gray-100 p-1 rounded-xl">
          <button
            onClick={() => onModeChange("app")}
            className={`flex items-center gap-1.5 px-4 py-2 text-xs font-medium rounded-lg transition-all duration-300 ${
              activeWorkMode === "app"
                ? "bg-[#a3c9e8] text-white shadow-xs"
                : "text-gray-500 hover:text-gray-800"
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            iPhone 14/16 Pro Mockup (App)
          </button>
          <button
            onClick={() => onModeChange("specs")}
            className={`flex items-center gap-1.5 px-4 py-2 text-xs font-medium rounded-lg transition-all duration-300 ${
              activeWorkMode === "specs"
                ? "bg-[#a3c9e8] text-white shadow-xs"
                : "text-gray-500 hover:text-gray-800"
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            UX/UI Design Specification (Handoff)
          </button>
        </div>
      </div>

      {activeWorkMode === "app" ? (
        /* The Realistic iPhone Dynamic Mockup */
        <div className="relative flex flex-col items-center transition-all duration-500 transform scale-100">
          
          {/* Subtle phone shadow on table */}
          <div className="absolute -bottom-10 w-[95%] h-8 bg-black/10 blur-xl rounded-full pointer-events-none" />

          {/* iPhone Exterior Chassis Container */}
          <div className="relative w-[398px] h-[812px] bg-[#2E3136] rounded-[52px] p-[10px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.35)] border-[4px] border-[#3B3E43]">
            
            {/* Matte metal bezel details */}
            <div className="absolute top-[120px] -left-[14px] w-[4px] h-[35px] bg-[#1F2124] rounded-l-md" /> {/* volume up */}
            <div className="absolute top-[170px] -left-[14px] w-[4px] h-[35px] bg-[#1F2124] rounded-l-md" /> {/* volume down */}
            <div className="absolute top-[135px] -right-[14px] w-[4px] h-[55px] bg-[#1F2124] rounded-r-md" /> {/* power */}

            {/* Content screen bounding box */}
            <div className="relative w-full h-full bg-white rounded-[42px] overflow-hidden flex flex-col select-none border border-black/80">
              
              {/* iOS Status Top Bar */}
              <div className="absolute top-0 left-0 right-0 h-10 px-6 pt-3 flex items-center justify-between z-50 text-gray-800 text-[11px] font-medium pointer-events-none">
                {/* Simulated Time */}
                <span className="font-sans font-semibold tracking-tight">{currentTime}</span>

                {/* iPhone Dynamic Island */}
                <div className="absolute left-1/2 -translate-x-1/2 top-2.5 w-[105px] h-6 bg-black rounded-full flex items-center justify-between px-3.5 py-1 shadow-inner border border-white/5 transition-all hover:w-[130px] duration-500">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-900/60" />
                  <div className="w-[3px] h-[3px] rounded-full bg-emerald-400" /> {/* green mic icon */}
                </div>

                {/* Simulated Status Bar Right */}
                <div className="flex items-center gap-1.5 font-mono text-[10px]">
                  {/* Signals */}
                  <svg className="w-3.5 h-2" viewBox="0 0 16 10" fill="currentColor">
                    <rect x="0" y="8" width="2" height="2" rx="0.5" />
                    <rect x="3" y="6" width="2" height="4" rx="0.5" />
                    <rect x="6" y="4" width="2" height="6" rx="0.5" />
                    <rect x="9" y="2" width="2" height="8" rx="0.5" />
                    <rect x="12" y="0" width="2" height="10" rx="0.5" />
                  </svg>
                  <span>5G</span>
                  {/* Battery */}
                  <div className="relative w-[18px] h-2.5 border border-gray-800 rounded-[3px] p-[1px] flex items-center">
                    <div className="h-full w-[85%] bg-gray-800 rounded-[1.5px]" />
                    <div className="absolute -right-[2.5px] top-1/2 -translate-y-1/2 w-[1.5px] h-1.2 bg-gray-800 rounded-r-[0.5px]" />
                  </div>
                </div>
              </div>

              {/* Injected App frame */}
              <div className="w-full h-full pt-10 pb-4 overflow-hidden flex flex-col bg-white">
                {children}
              </div>

              {/* iOS Bottom Indicator Bar */}
              <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-[120px] h-[4.5px] bg-gray-900/45 rounded-full z-50 pointer-events-none" />
            </div>
          </div>
        </div>
      ) : (
        /* Render full width presentation view of b'loo specs */
        <div className="w-full animate-fade-in duration-500">
          {children}
        </div>
      )}
    </div>
  );
};
