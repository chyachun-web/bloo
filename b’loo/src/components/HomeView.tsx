import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { FlowerRenderer } from "./FlowerRenderer";
import { Sparkles, Moon, Sun, ArrowRight, Compass, Heart, Check, RotateCcw } from "lucide-react";
import { UserProfile, LuckyFlower } from "../types";

interface HomeViewProps {
  userProfile: UserProfile;
  energyCalm: number;
  energyVitality: number;
  energyCreativity: number;
  energySocial: number;
  setEnergyCalm: (val: number) => void;
  setEnergyVitality: (val: number) => void;
  setEnergyCreativity: (val: number) => void;
  setEnergySocial: (val: number) => void;
  onNavigateToTab: (tab: number) => void;
  onPlantFlower?: (newFlower: LuckyFlower) => void;
}

const DIET_REMINDERS = [
  "今天試著放慢速度，好好感受第一口食物的味道。",
  "如果此時感到飢餓，問問自己是胃在呼喚，還是情緒需要被擁抱？",
  "在餐具與餐具交疊的安靜片刻，給予自己三次緩慢的深呼吸。",
  "試著用雙手握住溫暖的杯子，感受熱度，向為你帶來這餐的所有源頭道謝。",
  "今天不看螢幕吃一餐飯吧！讓牙齒與穀物的摩擦聲成為你唯一的背景音樂。"
];

export const HomeView: React.FC<HomeViewProps> = ({
  userProfile,
  energyCalm,
  energyVitality,
  energyCreativity,
  energySocial,
  setEnergyCalm,
  setEnergyVitality,
  setEnergyCreativity,
  setEnergySocial,
  onNavigateToTab,
  onPlantFlower,
}) => {
  const [reminderIndex, setReminderIndex] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCollected, setIsCollected] = useState(false);
  const [dailyFlower, setDailyFlower] = useState<any>(null);
  const [isLoadingDailyFlower, setIsLoadingDailyFlower] = useState(false);
  const [emotionFlower, setEmotionFlower] = useState<LuckyFlower | null>(() => {
    try {
      const saved = localStorage.getItem("bloo_current_emotion_flower");
      return saved ? JSON.parse(saved) : null;
    } catch (_) {
      return null;
    }
  });

  useEffect(() => {
    const fetchDailyFlower = async () => {
      setIsLoadingDailyFlower(true);
      try {
        const todayStr = new Date().toLocaleDateString("zh-TW", { year: 'numeric', month: '2-digit', day: '2-digit' });
        const res = await fetch("/api/generate-daily-flower", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ today: todayStr, userName: userProfile.userName })
        });
        if (res.ok) {
          const d = await res.json();
          setDailyFlower(d);
        }
      } catch (err) {
        console.error("Error loading daily flower", err);
      } finally {
        setIsLoadingDailyFlower(false);
      }
    };
    fetchDailyFlower();
  }, [userProfile.userName]);

  useEffect(() => {
    if (emotionFlower) {
      localStorage.setItem("bloo_current_emotion_flower", JSON.stringify(emotionFlower));
    } else {
      localStorage.removeItem("bloo_current_emotion_flower");
    }
  }, [emotionFlower]);

  // Check if current flower has already been added to local collection to prevent redundant saves
  useEffect(() => {
    if (!emotionFlower) return;
    try {
      const savedCollected = localStorage.getItem("bloo_collected_flowers");
      if (savedCollected) {
        const parsed = JSON.parse(savedCollected) as LuckyFlower[];
        if (parsed.some(f => f.flowerName === emotionFlower.flowerName)) {
          setIsCollected(true);
          return;
        }
      }
    } catch (_) {}
    setIsCollected(false);
  }, [emotionFlower]);

  const handleGenerateEmotionFlower = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch("/api/generate-emotion-flower", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          energyCalm,
          energyVitality,
          energyCreativity,
          energySocial,
          userName: userProfile.userName || "優雅的旅人"
        })
      });
      if (response.ok) {
        const data = await response.json();
        const flowerId = `emotion_${Date.now()}`;
        setEmotionFlower({
          id: flowerId,
          flowerName: data.flowerName,
          flowerLanguage: data.flowerLanguage,
          emotionReminder: data.emotionReminder,
          fortune: data.fortune,
          mindfulEatingAdvice: data.mindfulEatingAdvice,
          luckyColor: data.luckyColor || "#EAF2F8",
          dateCollected: data.dateCollected,
          userEmotion: `平靜:${energyCalm}% 活力:${energyVitality}% 創造:${energyCreativity}% 社交:${energySocial}%`
        });
        setIsCollected(false);
      }
    } catch (err) {
      console.error("Failed to generate emotion flower:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  // If user has a birthday flower registered, display it! Else use standard Hydrangea
  const hasFlower = userProfile.hasRegistered && userProfile.birthdayFlower;
  const currentFlowerName = hasFlower ? userProfile.birthdayFlower!.flowerName : "藍色繡球花 (Blue Hydrangea)";
  const currentFloriography = hasFlower ? userProfile.birthdayFlower!.flowerLanguage : "永恆的美滿、謙遜的希望、溫潤的理解";
  
  const handleNextReminder = () => {
    setReminderIndex((prev) => (prev + 1) % DIET_REMINDERS.length);
  };

  return (
    <div className="w-full h-full overflow-y-auto px-5 pt-4 pb-20 bg-white text-gray-800">
      
      {/* Editorial Greetings Logo Column */}
      <div className="flex flex-col items-center mb-6">
        <h1 className="font-bernoru font-black text-3xl text-gray-900 tracking-tighter">b’loo</h1>
        <p className="font-mono text-[10px] text-[#a3c9e8] tracking-widest uppercase mt-0.5">Bloom With Love</p>
        <div className="w-6 h-[1.5px] bg-gray-200 mt-3" />
      </div>

      {/* Greeting card */}
      <div className="bg-cream/40 rounded-3xl p-4 mb-6 border border-gray-100 flex items-center justify-between">
        <div>
          <p className="text-[11px] text-gray-400 uppercase tracking-widest font-mono">Today's Vibe</p>
          <p className="font-serif text-base text-gray-800 mt-1">
            你好，{userProfile.hasRegistered ? userProfile.userName : "優雅的旅人"}
          </p>
          <p className="text-xs text-gray-500 mt-0.5">今天也是陪伴自己慢慢綻放的一天。</p>
        </div>
        <Heart className="w-4 h-4 text-[#a3c9e8] fill-[#a3c9e8]/50 animate-pulse" />
      </div>

      {/* Main Today's Flower Card (今日專屬花語) */}
      <div className="relative bg-white rounded-3xl border border-gray-100 p-5 shadow-xs mb-8 overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-radial from-[#a3c9e8]/10 to-transparent pointer-events-none" />
        
        <div className="flex items-center gap-1.5 mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-[#a3c9e8]" />
          <h3 className="font-serif text-sm font-medium text-gray-500 tracking-tight">今日專屬花語 · Daily Flower Oracle</h3>
        </div>

        {isLoadingDailyFlower || !dailyFlower ? (
          <div className="flex flex-col items-center py-10">
            <div className="w-10 h-10 border-2 border-[#a3c9e8] border-t-transparent rounded-full animate-spin mb-4" />
            <p className="font-serif text-xs text-gray-400">正在調配今日專屬能量花卉...</p>
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center py-2"
          >
            <FlowerRenderer name={dailyFlower.flowerName} size={150} glowing={true} />
            
            <h4 className="font-serif text-lg font-bold text-gray-900 mt-3 text-center">
              🌸 {dailyFlower.flowerName}
            </h4>
            <span className="text-xs font-mono text-gray-400 mt-0.5 tracking-wider italic">
              {dailyFlower.scientificName || "Botanical Species"}
            </span>
            
            <div className="w-12 h-[1px] bg-gray-100 my-4" />
            
            <div className="w-full space-y-4 font-serif">
              {/* Flower Language */}
              <div className="text-center">
                <p className="text-[10px] font-mono uppercase text-gray-400 font-bold tracking-widest mb-1">花語 · Floriography</p>
                <p className="text-sm font-medium text-[#5d8cb3] leading-relaxed px-4">
                  「 {dailyFlower.flowerLanguage} 」
                </p>
              </div>

              {/* Cultural Origin */}
              <div className="bg-cream/20 rounded-2xl p-4 border border-gray-100/50">
                <p className="text-[10px] uppercase font-mono tracking-widest text-[#5d8cb3] font-bold mb-1">🏛️ 文化來源 · Culture</p>
                <p className="text-xs text-gray-600 leading-relaxed text-left text-justify">
                  {dailyFlower.culturalOrigin}
                </p>
              </div>

              {/* Message of Today */}
              <div className="bg-cream/40 rounded-2xl p-4 border border-gray-150/40">
                <p className="text-[10px] uppercase font-mono tracking-widest text-gray-400 font-bold mb-1.5">✉️ 今日訊息 · Inner Message</p>
                <p className="text-xs text-gray-600 leading-relaxed text-left text-justify">
                  {dailyFlower.dailyMessage}
                </p>
              </div>

              {/* Todo of Today */}
              <div className="bg-gray-50/80 rounded-2xl p-4 border border-gray-100">
                <p className="text-[10px] uppercase font-mono tracking-widest text-amber-500 font-bold mb-2">🧘‍♂️ 今日適合做的事 · Fit Things</p>
                <ul className="space-y-1.5 text-left">
                  {(dailyFlower.todayFitThings || "").split(/[;；,，、]/).filter((x: string) => x.trim()).map((thing: string, idx: number) => (
                    <li key={idx} className="text-xs text-gray-600 flex items-start gap-2">
                      <span className="text-[#a3c9e8] mt-0.5">•</span>
                      <span>{thing.trim()}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Healing Quote */}
              <div className="bg-radial from-[#a3c9e8]/5 to-transparent rounded-2xl p-4 text-center border border-[#a3c9e8]/10 shadow-3xs">
                <p className="text-[11px] text-[#5d8cb3] italic font-medium leading-relaxed font-serif">
                  {dailyFlower.healingQuote}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Today's Emotional Energy Controls (今日情緒能量) */}
      <div className="bg-white rounded-3xl border border-gray-100 p-5 shadow-xs mb-8">
        <div className="flex items-center gap-1.5 mb-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#a3c9e8]" />
          <h3 className="font-serif text-sm font-medium text-gray-500 tracking-tight">今日情緒能量 · Inner Energy</h3>
        </div>

        {emotionFlower ? (
          /* Render Dynamic Generated Emotion Flower Card */
          <div className="border border-[#a3c9e8]/20 rounded-2xl p-5 bg-radial from-[#a3c9e8]/5 to-transparent relative overflow-hidden flex flex-col items-center">
            {/* Soft decorative background glow based on flower color */}
            <div 
              className="absolute -top-12 -right-12 w-28 h-28 rounded-full opacity-15 filter blur-2xl pointer-events-none" 
              style={{ backgroundColor: emotionFlower.luckyColor }}
            />

            {/* Premium flower view */}
            <div className="my-2 select-none">
              <FlowerRenderer name={emotionFlower.flowerName} size={135} glowing={true} />
            </div>

            <span className="text-[10px] uppercase font-mono tracking-widest text-[#5d8cb3] bg-[#a3c9e8]/10 px-2.5 py-0.5 rounded-full mt-2 font-medium">
              當下情緒綻放 · Emotion Bloom
            </span>

            <h4 className="font-serif text-lg font-bold text-gray-900 mt-2.5 text-center">
              {emotionFlower.flowerName}
            </h4>

            <p className="font-serif text-xs text-[#5d8cb3] text-center max-w-[240px] leading-relaxed mt-1.5 italic font-medium">
              「 {emotionFlower.flowerLanguage} 」
            </p>

            <div className="w-full border-t border-gray-100/60 my-4" />

            {/* Poetic climate insight and guides */}
            <div className="space-y-4 text-left w-full font-serif text-gray-700">
              {/* 代表原因 */}
              <div>
                <h5 className="text-[10px] font-semibold text-gray-400 font-mono tracking-widest uppercase mb-1">🌼 代表原因 · Representation</h5>
                <p className="text-xs leading-relaxed text-justify text-gray-650">
                  {emotionFlower.reasonRepresented || emotionFlower.emotionReminder}
                </p>
              </div>

              {/* 這朵花想對你說 */}
              <div className="bg-[#a3c9e8]/5 rounded-2xl p-4 border border-[#a3c9e8]/10 space-y-1 my-1 shadow-3xs">
                <h5 className="text-[10px] font-semibold text-[#5d8cb3] font-mono tracking-widest uppercase mb-1">✉️ 這朵花想對你說 · Message</h5>
                <p className="text-xs italic leading-relaxed text-justify text-gray-700">
                  「 {emotionFlower.messageToUser || emotionFlower.emotionReminder || emotionFlower.dailyMessage} 」
                </p>
              </div>

              {/* 情緒照顧建議 */}
              <div>
                <h5 className="text-[10px] font-semibold text-gray-400 font-mono tracking-widest uppercase mb-1">🧘‍♂️ 情緒照顧建議 · Self-Care Advice</h5>
                <p className="text-xs leading-relaxed text-justify text-gray-650">
                  {emotionFlower.emotionCareAdvice || emotionFlower.mindfulEatingAdvice}
                </p>
              </div>

              {/* Optional Trio of custom mini fortune notes */}
              {emotionFlower.fortune && (
                <div className="bg-cream/30 rounded-2xl p-4 space-y-2.5 border border-amber-200/10">
                  <h5 className="text-[10px] font-semibold text-amber-600/80 font-mono tracking-widest uppercase border-b border-amber-100/40 pb-1">✦ 今日運勢流動 · Fortunes</h5>
                  <div>
                    <p className="text-[10px] font-semibold text-gray-500 mb-0.5">✦ 關係連結 · Relationship</p>
                    <p className="text-[11px] text-gray-600 leading-relaxed">{emotionFlower.fortune.relationship}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold text-gray-500 mb-0.5">✦ 專注日常 · Focus & Work</p>
                    <p className="text-[11px] text-gray-600 leading-relaxed">{emotionFlower.fortune.work}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold text-gray-500 mb-0.5">✦ 豐盛能量 · Abundance</p>
                    <p className="text-[11px] text-gray-600 leading-relaxed">{emotionFlower.fortune.finance}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="w-full border-t border-gray-100/60 my-4" />

            {/* Interaction Buttons details */}
            <div className="flex flex-col gap-2 w-full">
              {onPlantFlower && (
                <button
                  onClick={() => {
                    if (emotionFlower) {
                      onPlantFlower(emotionFlower);
                      setIsCollected(true);
                    }
                  }}
                  disabled={isCollected}
                  className={`w-full py-2.5 px-4 rounded-xl text-xs font-serif font-medium transition-all flex items-center justify-center gap-1.5 cursor-pointer border ${
                    isCollected 
                      ? "bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed" 
                      : "bg-[#a3c9e8] text-white border-transparent hover:bg-[#8eb9db] active:scale-95"
                  }`}
                >
                  {isCollected ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>已種入你的心靈庭院 ✓</span>
                    </>
                  ) : (
                    <>
                      <Heart className="w-3.5 h-3.5" />
                      <span>種入心靈庭院 · Plant in Garden</span>
                    </>
                  )}
                </button>
              )}

              <button
                onClick={() => {
                  setEmotionFlower(null);
                  setIsCollected(false);
                }}
                className="w-full py-2.5 px-4 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-700 text-xs font-serif font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>重新調整情緒比例 · Readjust</span>
              </button>
            </div>
          </div>
        ) : (
          /* Render Sliders for user input first */
          <>
            <p className="text-xs text-gray-400 mb-5 leading-relaxed">
              感受此時此刻的身體，輕拉滑動桿，反映你內在花朵的不同能量維度：
            </p>

            {/* Emotion Slider Slates */}
            <div className="space-y-4">
              {/* Calm */}
              <div>
                <div className="flex justify-between items-center text-xs text-gray-600 mb-1">
                  <span className="font-serif font-medium">平靜 (Calm)</span>
                  <span className="font-mono text-gray-400">{energyCalm}%</span>
                </div>
                <div className="relative">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={energyCalm}
                    onChange={(e) => setEnergyCalm(Number(e.target.value))}
                    className="w-full h-1 bg-[#a3c9e8]/20 rounded-lg appearance-none cursor-pointer accent-[#a3c9e8]"
                  />
                </div>
              </div>

              {/* Vitality */}
              <div>
                <div className="flex justify-between items-center text-xs text-gray-600 mb-1">
                  <span className="font-serif font-medium">活力 (Vitality)</span>
                  <span className="font-mono text-gray-400">{energyVitality}%</span>
                </div>
                <div className="relative">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={energyVitality}
                    onChange={(e) => setEnergyVitality(Number(e.target.value))}
                    className="w-full h-1 bg-[#a3c9e8]/20 rounded-lg appearance-none cursor-pointer accent-[#a3c9e8]"
                  />
                </div>
              </div>

              {/* Creativity */}
              <div>
                <div className="flex justify-between items-center text-xs text-gray-600 mb-1">
                  <span className="font-serif font-medium">創造力 (Creativity)</span>
                  <span className="font-mono text-gray-400">{energyCreativity}%</span>
                </div>
                <div className="relative">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={energyCreativity}
                    onChange={(e) => setEnergyCreativity(Number(e.target.value))}
                    className="w-full h-1 bg-[#a3c9e8]/20 rounded-lg appearance-none cursor-pointer accent-[#a3c9e8]"
                  />
                </div>
              </div>

              {/* Social Energy */}
              <div>
                <div className="flex justify-between items-center text-xs text-gray-600 mb-1">
                  <span className="font-serif font-medium">社交能量 (Social)</span>
                  <span className="font-mono text-gray-400">{energySocial}%</span>
                </div>
                <div className="relative">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={energySocial}
                    onChange={(e) => setEnergySocial(Number(e.target.value))}
                    className="w-full h-1 bg-[#a3c9e8]/20 rounded-lg appearance-none cursor-pointer accent-[#a3c9e8]"
                  />
                </div>
              </div>
            </div>

            {/* Primary Generation Action trigger */}
            <button
              onClick={handleGenerateEmotionFlower}
              disabled={isGenerating}
              className="w-full mt-6 py-3 px-4 rounded-2xl bg-gradient-to-r from-[#a3c9e8] to-[#bcdcf0] text-white font-serif text-xs font-semibold hover:opacity-90 active:scale-98 transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75 disabled:pointer-events-none animate-fade-in"
            >
              {isGenerating ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>正在調配專屬情緒之花...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                  <span>綻放今日情緒之花 · Generate Flower</span>
                </>
              )}
            </button>

            {/* Dynamic Vibe feedback of flower growth */}
            <div className="mt-5 pt-4 border-t border-gray-50 flex items-center gap-3 animate-fade-in">
              <div className="w-8 h-8 rounded-full bg-[#a3c9e8]/10 flex items-center justify-center text-[#a3c9e8] text-xs font-serif font-bold">
                {(energyCalm + energyVitality + energyCreativity + energySocial) > 280 ? "✿" : "❀"}
              </div>
              <p className="text-[11px] text-gray-500 leading-relaxed">
                {(energyCalm + energyVitality + energyCreativity + energySocial) > 280 
                  ? "太棒了！你今天的內在能量飽滿均勻，花園充滿了明亮的生命氣流。" 
                  : "今天的能量靜謐內斂，正是向內探索、放慢用餐與休息的好時期。"}
              </p>
            </div>
          </>
        )}
      </div>

      {/* Mindful Eating Card (今日飲食覺察提醒) */}
      <div className="relative bg-[#a3c9e8]/10 rounded-3xl border border-[#a3c9e8]/20 p-5 shadow-xs mb-8">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5">
            <Compass className="w-4 h-4 text-[#5d8cb3]" />
            <h3 className="font-serif text-sm font-medium text-[#5d8cb3] tracking-tight">飲食覺察提醒 · Mindful Bite</h3>
          </div>
          <button 
            onClick={handleNextReminder}
            className="text-[10px] text-[#5d8cb3] border border-[#5d8cb3]/20 bg-white/70 px-2.5 py-1 rounded-full hover:bg-white transition-colors"
          >
            換一張 · Next
          </button>
        </div>

        <div className="px-1 py-2">
          <blockquote className="font-serif text-[13px] text-gray-700 leading-relaxed italic border-l-2 border-[#a3c9e8]/40 pl-3.5 my-2">
            「 {DIET_REMINDERS[reminderIndex]} 」
          </blockquote>
        </div>

        <div className="mt-4 flex justify-end">
          <button 
            onClick={() => onNavigateToTab(3)} // navigate to tab 3 (Diet Diary)
            className="flex items-center gap-1.5 text-xs text-[#5d8cb3] font-medium hover:underline"
          >
            去記錄飲食日記 <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
