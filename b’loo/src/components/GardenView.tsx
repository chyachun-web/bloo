import React, { useState } from "react";
import { FlowerRenderer } from "./FlowerRenderer";
import { LuckyFlower, UserProfile, GardenLevel } from "../types";
import { Sun, Moon, Wind, Info, X, Compass, Calendar, Layers, CloudRain, Snowflake } from "lucide-react";

interface GardenViewProps {
  userProfile: UserProfile;
  collectedFlowers: LuckyFlower[];
  onNavigateToTab: (tab: number) => void;
}

export const GardenView: React.FC<GardenViewProps> = ({
  userProfile,
  collectedFlowers,
  onNavigateToTab,
}) => {
  const [timeMode, setTimeMode] = useState<"day" | "night">("day");
  const [seasonMode, setSeasonMode] = useState<"spring" | "summer" | "autumn" | "winter">("spring");
  const [windSpeed, setWindSpeed] = useState<"slow" | "normal" | "fast">("normal");
  const [selectedFlower, setSelectedFlower] = useState<LuckyFlower | null>(null);

  // Growth level evaluation based on total flower count
  const getGardenLevelAndProgress = (count: number): { level: GardenLevel; nextCount: number; title: string } => {
    if (count < 7) {
      return { level: "萌芽花園", nextCount: 7, title: "萌芽花園 (7朵升級)" };
    } else if (count < 30) {
      return { level: "療癒花園", nextCount: 30, title: "療癒花園 (30朵升級)" };
    } else if (count < 100) {
      return { level: "夢幻花園", nextCount: 100, title: "夢幻花園 (100朵升級)" };
    } else {
      return { level: "Bloom Kingdom", nextCount: 365, title: "Bloom Kingdom (365朵滿月)" };
    }
  };

  const { level, nextCount, title } = getGardenLevelAndProgress(collectedFlowers.length + (userProfile.hasRegistered ? 1 : 0));
  const progressPercent = Math.min(100, Math.round(((collectedFlowers.length + (userProfile.hasRegistered ? 1 : 0)) / nextCount) * 100));

  // Determine season class coloring and floating particles
  const getSeasonSkyClass = () => {
    if (timeMode === "night") {
      return "bg-[#111622] text-slate-200 border-slate-800";
    }
    switch (seasonMode) {
      case "spring": return "bg-gradient-to-b from-[#FFF0F2] via-[#FFFFFF] to-[#F1F6FA] text-gray-800 border-pink-100";
      case "summer": return "bg-gradient-to-b from-[#E7F7F6] via-[#FFFFFF] to-[#E9F3FC] text-gray-800 border-teal-100";
      case "autumn": return "bg-gradient-to-b from-[#F9F3EA] via-[#FFFFFF] to-[#E6DFD4] text-gray-800 border-amber-100";
      case "winter": return "bg-gradient-to-b from-[#EFF3F6] via-[#FFFFFF] to-[#E4E9ED] text-gray-800 border-slate-100";
    }
  };

  const getSwaySpeedLiteral = () => {
    if (windSpeed === "slow") return "slow";
    if (windSpeed === "fast") return "fast";
    return "normal";
  };

  return (
    <div className={`w-full h-full overflow-y-auto px-4 pt-4 pb-20 transition-all duration-500 flex flex-col ${getSeasonSkyClass()}`}>
      
      {/* Title block */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="font-serif text-lg font-bold">我的專屬花園</h2>
          <p className="text-[9px] uppercase font-mono tracking-widest text-[#a3c9e8]">
            My Eternal Garden
          </p>
        </div>
        
        {/* Statistics Badge */}
        <div className="bg-white/80 backdrop-blur-xs border border-gray-100/60 px-2.5 py-1 rounded-full text-[10px] font-mono text-gray-600 shadow-3xs flex items-center gap-1">
          <Layers className="w-3 h-3 text-[#a3c9e8]" />
          <span>已灌溉 {collectedFlowers.length + (userProfile.hasRegistered ? 1 : 0)} 朵花</span>
        </div>
      </div>

      {/* Progress & Milestone Card */}
      <div className="bg-white/95 border border-gray-100 rounded-3xl p-4 shadow-3xs mb-4">
        <div className="flex justify-between items-center text-xs mb-1.5 font-serif">
          <span className="text-gray-400 font-serif">目前花園階段：</span>
          <span className="text-[#5d8cb3] font-bold">{level}</span>
        </div>
        {/* Progress bar */}
        <div className="w-full h-1.5 bg-[#a3c9e8]/10 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-[#d6e8f5] to-[#a3c9e8] transition-all duration-1000"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <div className="flex justify-between text-[9px] text-gray-400 font-mono mt-1">
          <span>成長值 {progressPercent}%</span>
          <span>下一目標：{title}</span>
        </div>
      </div>

      {/* Interactive Environment Dock */}
      <div className="bg-white/70 backdrop-blur-md rounded-2xl p-2.5 border border-gray-100/40 mb-4 grid grid-cols-3 gap-2 text-center shadow-3xs">
        {/* Day/Night selector */}
        <div>
          <p className="text-[9px] text-gray-400 font-serif mb-1 uppercase tracking-tight">日夜變化</p>
          <div className="flex bg-gray-50 rounded-lg p-0.5 border border-gray-200/20">
            <button 
              onClick={() => setTimeMode("day")}
              className={`flex-1 py-1 rounded-md text-[10px] transition-colors flex justify-center items-center ${timeMode === "day" ? "bg-[#a3c9e8] text-white" : "text-gray-400 hover:text-gray-700"}`}
            >
              <Sun className="w-2.5 h-2.5 mr-0.5" />
              日
            </button>
            <button 
              onClick={() => setTimeMode("night")}
              className={`flex-1 py-1 rounded-md text-[10px] transition-colors flex justify-center items-center ${timeMode === "night" ? "bg-[#111622] text-white" : "text-gray-400 hover:text-gray-300"}`}
            >
              <Moon className="w-2.5 h-2.5 mr-0.5" />
              夜
            </button>
          </div>
        </div>

        {/* Season selector */}
        <div>
          <p className="text-[9px] text-gray-400 font-serif mb-1">四季風情</p>
          <select 
            value={seasonMode} 
            onChange={(e: any) => setSeasonMode(e.target.value)}
            className="w-full bg-gray-50/80 rounded-lg py-1 px-1.5 text-[10px] border border-gray-200/20 text-gray-700 focus:outline-none"
          >
            <option value="spring">春 · 櫻</option>
            <option value="summer">夏 · 荷</option>
            <option value="autumn">秋 · 菊</option>
            <option value="winter">冬 · 蘭</option>
          </select>
        </div>

        {/* Sway control */}
        <div>
          <p className="text-[9px] text-gray-400 font-serif mb-1">自然微風</p>
          <div className="flex bg-gray-50 rounded-lg p-0.5 border border-gray-200/20">
            {(["slow", "normal", "fast"] as const).map((speed) => (
              <button
                key={speed}
                onClick={() => setWindSpeed(speed)}
                className={`flex-1 py-1 rounded-md text-[9px] transition-all uppercase font-medium ${windSpeed === speed ? "bg-[#a3c9e8] text-white" : "text-gray-400 hover:text-gray-700"}`}
              >
                {speed === "slow" ? "微" : speed === "normal" ? "和" : "疾"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* IMMERSIVE MEADOW VIEW (THE GARDEN STAGE) */}
      <div className={`relative w-full h-[360px] rounded-[36px] overflow-hidden border transition-all duration-700 flex flex-col justify-end p-4 border-dashed border-gray-100 shadow-inner ${
        timeMode === "night" 
          ? "bg-slate-950 border-slate-800" 
          : seasonMode === "spring" ? "bg-[#FFF5F6]" 
          : seasonMode === "summer" ? "bg-[#F0FAF7]" 
          : seasonMode === "autumn" ? "bg-[#FFFBF5]" 
          : "bg-[#F3F7FA]"
      }`}>
        
        {/* Floating sky decorations (moon/stars/clouds) */}
        {timeMode === "night" ? (
          <div className="absolute top-6 left-6 flex items-center gap-1">
            <Moon className="w-5 h-5 text-amber-100 fill-amber-100/30 animate-pulse" />
            <div className="w-1.5 h-1.5 rounded-full bg-white/70 absolute top-4 left-16 animate-ping" />
            <div className="w-1 h-1 rounded-full bg-white/80 absolute top-10 left-32 animate-pulse" />
            <div className="w-1 h-1 rounded-full bg-white/40 absolute top-6 left-52 animate-pulse" />
          </div>
        ) : (
          <div className="absolute top-5 left-5 flex items-center gap-2">
            <Sun className="w-6 h-6 text-amber-400/90 animate-spin-slow" style={{ animationDuration: "20s" }} />
            <span className="text-[9px] font-serif text-gray-400/80 italic">溫和光照中...</span>
          </div>
        )}

        {/* Center pedestal: Birthday flower is largest */}
        <div className="absolute left-1/2 -translate-x-1/2 bottom-[140px] z-20 flex flex-col items-center">
          {userProfile.hasRegistered && userProfile.birthdayFlower ? (
            <div 
              onClick={() => setSelectedFlower({
                id: "bday",
                flowerName: userProfile.birthdayFlower!.flowerName,
                flowerLanguage: userProfile.birthdayFlower!.flowerLanguage,
                emotionReminder: userProfile.birthdayFlower!.personalityDescription,
                fortune: {
                  relationship: "內在神性覺醒，看見本來具有的愛。",
                  work: "你的本質是綻放，只需信任內在的核心節奏。",
                  finance: "豐盛不假外求，一切從好好善待自己胃部與心情開始。"
                },
                mindfulEatingAdvice: userProfile.birthdayFlower!.growthAdvice,
                luckyColor: "#FFF8DC",
                dateCollected: "首次註冊"
              })}
              className="cursor-pointer transition-transform hover:scale-110 relative flex flex-col items-center"
            >
              {/* Dynamic Pedestal Indicator ring */}
              <div className="absolute -bottom-1 w-20 h-1.5 rounded-full bg-black/10 blur-3xs animate-pulse" />
              <div className="absolute -bottom-3 text-[8px] font-sans font-bold bg-[#a3c9e8] text-white px-2 py-0.5 rounded-full uppercase tracking-wider shadow-2xs border border-white">
                生日本命花
              </div>
              <FlowerRenderer 
                name={userProfile.birthdayFlower.flowerName} 
                size={140} 
                glowing={true} 
                swaySpeed={getSwaySpeedLiteral()} 
              />
            </div>
          ) : (
            <div 
              onClick={() => onNavigateToTab(4)} // navigate to Profile/Welcome
              className="cursor-pointer bg-white/90 shadow-xs border border-dashed border-[#a3c9e8] px-5 py-3 rounded-2xl text-center max-w-[140px] hover:bg-slate-50 transition-colors"
            >
              <p className="text-[10px] text-gray-500 leading-normal font-serif">✿ 註冊生日以產生最大本命花</p>
            </div>
          )}
        </div>

        {/* Grass meadow styling layer */}
        <div className="absolute bottom-0 left-0 right-0 h-28 bg-[#93c7a1]/20 rounded-b-[34px] border-t border-[#93c7a1]/15 backdrop-blur-xs flex items-end justify-center pb-2 pointer-events-none">
          <div className="w-[105%] h-5 bg-[#84b992]/25 rounded-b-[34px] translate-y-3" />
        </div>

        {/* Clustered gathered daily flowers swaying around (meadow surroundings) */}
        <div className="relative z-10 w-full h-[120px] flex items-end justify-center gap-1.5 overflow-x-auto scrollbar-none px-2 pointer-events-auto">
          {collectedFlowers.length === 0 ? (
            /* Prepopulate beautiful placeholders to show garden visual potential if list is empty */
            [
              { id: "s1", flowerName: "白鬱金香 (White Tulip)", flowerLanguage: "睿智的留白、自然的高貴", dateCollected: "2026/06/18", luckyColor: "#FAF8F3" },
              { id: "s2", flowerName: "黃色洋甘菊 (Chamomile)", flowerLanguage: "逆境中的包容力、自我寬慰", dateCollected: "2026/06/19", luckyColor: "#FFFBF2" },
              { id: "s3", flowerName: "藍色繡球花 (Blue Hydrangea)", flowerLanguage: "謙遜的希望、溫潤的理解", dateCollected: "2026/06/20", luckyColor: "#EAF3FC" }
            ].map((mock, index) => (
              <div
                key={mock.id}
                onClick={() => setSelectedFlower({
                  id: mock.id,
                  flowerName: mock.flowerName,
                  flowerLanguage: mock.flowerLanguage,
                  emotionReminder: "這是花園為你準備的迎賓花朵。代表著你踏上飲食身心覺察與平靜的第一天。",
                  fortune: {
                    relationship: "今天多一分保留。在吃每一口麵包、吸入每一股空氣時，體會安靜。",
                    work: "工作是一場與社會和諧共振的舞蹈，累了就停下來欣賞一片葉子。",
                    finance: "平穩踏實。購買對身體無負擔的有機原形食物，是極具遠見的綠色投資。"
                  },
                  mindfulEatingAdvice: "與食物溫和相處，不去計較卡路里。在盤中保留一部分空位，代表原諒與接納自己。",
                  luckyColor: mock.luckyColor,
                  dateCollected: mock.dateCollected
                })}
                className="cursor-pointer translate-y-2 shrink-0 transition-transform duration-300 hover:scale-125 flex flex-col items-center"
              >
                <FlowerRenderer name={mock.flowerName} size={65} swaySpeed={index % 2 === 0 ? "slow" : "normal"} />
                <span className="text-[7px] text-gray-400 bg-white/70 px-1 rounded-[3px] border border-gray-50 scale-90">{mock.flowerName.split(" ")[0]}</span>
              </div>
            ))
          ) : (
            collectedFlowers.map((flower, idx) => (
              <div
                key={flower.id}
                onClick={() => setSelectedFlower(flower)}
                className="cursor-pointer translate-y-2 shrink-0 transition-transform duration-300 hover:scale-125 flex flex-col items-center"
              >
                <div className="absolute -top-1 w-1.5 h-1.5 rounded-full bg-yellow-200 opacity-60 animate-ping pointer-events-none" />
                <FlowerRenderer name={flower.flowerName} size={70} swaySpeed={idx % 2 === 0 ? "slow" : "normal"} />
                <span className="text-[7px] text-gray-400 bg-white/80 px-1 rounded-[3px] border border-gray-50 scale-90">{flower.flowerName.split(" ")[0]}</span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Flower Inspection Overlay sheet card (當天運勢/花語/取得日期) */}
      {selectedFlower && (
        <div className="fixed inset-0 z-40 flex items-end justify-center bg-black/20 backdrop-blur-3xs p-4 border border-transparent">
          <div className="w-full max-w-[360px] bg-white rounded-t-[40px] rounded-b-[24px] p-5 shadow-2xl border border-gray-100 animate-slide-up">
            
            <div className="flex justify-between items-start mb-3">
              <div>
                <span className="text-[9px] font-mono uppercase bg-[#a3c9e8]/15 text-[#5d8cb3] px-2.5 py-0.5 rounded-full font-bold">
                  花魂覺察日誌 Note
                </span>
                <p className="text-xs text-gray-400 mt-1 font-mono flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  栽種時間：{selectedFlower.dateCollected}
                </p>
              </div>
              <button 
                onClick={() => setSelectedFlower(null)}
                className="p-1 rounded-full bg-gray-50 text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content card */}
            <div className="flex items-center gap-3.5 mb-4 bg-cream/35 p-3 rounded-2xl border border-gray-50">
              <FlowerRenderer name={selectedFlower.flowerName} size={70} swaySpeed="none" />
              <div>
                <h4 className="font-serif text-sm font-bold text-gray-900">
                  {selectedFlower.flowerName.split(" ")[0]}
                </h4>
                <p className="text-[10px] text-gray-400 font-mono italic">
                  {selectedFlower.flowerName.includes("(") ? selectedFlower.flowerName.slice(selectedFlower.flowerName.indexOf("(") + 1, -1) : ""}
                </p>
                <p className="text-xs text-[#5d8cb3] font-serif font-semibold mt-1">
                  「 {selectedFlower.flowerLanguage} 」
                </p>
              </div>
            </div>

            {/* Tabs details */}
            <div className="space-y-3.5 text-xs">
              <div>
                <p className="font-serif font-semibold text-gray-700 flex items-center gap-1">
                  <span className="w-1 h-3 rounded-full bg-emerald-300" />
                  當天飲食覺察指示：
                </p>
                <p className="text-xs text-gray-500 mt-1 pl-2 leading-relaxed bg-[#fbfbf9] rounded-xl p-2.5 border border-gray-50">
                  {selectedFlower.mindfulEatingAdvice}
                </p>
              </div>

              <div>
                <p className="font-serif font-semibold text-gray-700 flex items-center gap-1">
                  <span className="w-1 h-3 rounded-full bg-[#a3c9e8]" />
                  宇宙自處箴言：
                </p>
                <p className="text-xs text-gray-500 mt-1 pl-2 leading-relaxed italic">
                  💬 {selectedFlower.emotionReminder.split("。")[0]}。
                </p>
              </div>
            </div>

            <button 
              onClick={() => setSelectedFlower(null)}
              className="w-full bg-[#a3c9e8] text-white py-3 rounded-xl text-xs font-serif font-medium mt-5"
            >
              微閉雙眼，默默感受這朵花的能量
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
