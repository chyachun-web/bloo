import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { FlowerRenderer } from "./FlowerRenderer";
import { LuckyFlower, UserProfile } from "../types";
import { Sparkles, Heart, Briefcase, DollarSign, Leaf, RefreshCw } from "lucide-react";

interface DrawViewProps {
  userProfile: UserProfile;
  setUserProfile: (profile: UserProfile) => void;
  onPlantFlower: (flower: LuckyFlower) => void;
  collectedFlowers: LuckyFlower[];
}

// Helper to spawn initial random floating petals
const generatePetals = () => {
  return Array.from({ length: 15 }).map((_, i) => ({
    id: i,
    left: Math.random() * 100, // percentage
    delay: Math.random() * 2,
    duration: 3 + Math.random() * 3,
    size: 10 + Math.random() * 12,
    rotate: Math.random() * 360,
  }));
};

export const DrawView: React.FC<DrawViewProps> = ({
  userProfile,
  setUserProfile,
  onPlantFlower,
  collectedFlowers,
}) => {
  const [drawingState, setDrawingState] = useState<"idle" | "loading" | "blooming" | "revealed">("idle");
  const [loadingText, setLoadingText] = useState("正在連結星宿能量...");
  const [luckyResult, setLuckyResult] = useState<LuckyFlower | null>(null);
  const [activeResultTab, setActiveResultTab] = useState<"general" | "love" | "work" | "diet">("general");
  const [petals, setPetals] = useState<{ id: number; left: number; delay: number; duration: number; size: number; rotate: number }[]>([]);
  const [hasPlantedThisTurn, setHasPlantedThisTurn] = useState(false);

  const startDrawRitual = async () => {
    setDrawingState("loading");
    setHasPlantedThisTurn(false);
    
    // Cycle beautiful comforting loading lines
    const phrases = [
      "正在收集天空落下的露水...",
      "土壤核心能量正在舒展應和...",
      "星斗宿命正在為你吐露芬芳...",
      "倒數三秒，即將為你盛開..."
    ];
    let step = 0;
    const interval = setInterval(() => {
      if (step < phrases.length) {
         setLoadingText(phrases[step]);
         step++;
      }
    }, 1100);

    // Make API call to backend
    try {
      const response = await fetch("/api/draw-lucky-flower", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          birthDate: userProfile.birthDate || "1998-05-20",
          constellation: userProfile.constellation || "雙魚座 (Pisces)",
          userName: userProfile.userName || "優雅的旅人",
          sixStar: userProfile.sixStarsNode || "水星人 (Mercury Star)"
        })
      });
      const data = await response.json();
      
      clearInterval(interval);
      
      // Trigger blooming effect
      setLoadingText("花瓣悄悄展開了...");
      setPetals(generatePetals());
      setDrawingState("blooming");

      // Set results
      const uniqueId = `lucky_${Date.now()}`;
      setLuckyResult({
        id: uniqueId,
        flowerName: data.flowerName || "白色洋甘菊 (White Chamomile)",
        flowerLanguage: data.flowerLanguage || "逆境中的包容、自我修復、安定",
        emotionReminder: data.dailyMessage || data.emotionReminder || "今天感到心累時，試著像洋甘菊般隨自然吐納，放下重擔。",
        fortune: {
          relationship: data.loveFortune || data.fortune?.relationship || "原諒自己過去的微小彆扭，與內在的小女孩乾杯和解。",
          work: data.workFortune || data.fortune?.work || "今天不求完美，只需用極輕柔的姿態完成手頭最基本的一兩件事。",
          finance: data.financeFortune || data.fortune?.finance || "不需要用買買買消費來填補不安。試著在抽屜找出那本沒寫完的筆記本，重新拿來寫字。"
        },
        mindfulEatingAdvice: data.healthFortune || data.mindfulEatingAdvice || "當心裏有浪潮時，手上的麵包也容易咬得太快。試著多嚼十下，感受麵粉在唾液中融化出的甘甜清香。",
        luckyColor: data.luckyColor || "#FCFAF6",
        dateCollected: new Date().toLocaleDateString("zh-TW", { year: 'numeric', month: '2-digit', day: '2-digit' }),
        
        // Populate lottery fields
        luckStars: data.luckStars || 5,
        loveFortune: data.loveFortune || data.fortune?.relationship || "相互傾聽，此時無聲勝有聲。",
        workFortune: data.workFortune || data.fortune?.work || "細水長流，拆解繁雜的工作。",
        financeFortune: data.financeFortune || data.fortune?.finance || "金錢是能量，用以滋養自己的健康與精緻心靈。",
        healthFortune: data.healthFortune || data.mindfulEatingAdvice || "放慢吞嚥，對辛苦支撐的脾胃與心腹道謝。",
        luckyNumber: data.luckyNumber || 8,
        dailyMessage: data.dailyMessage || data.emotionReminder || "安心綻放。"
      });

      // Maintain bloom animation for 2.8 seconds, then reveal
      setTimeout(() => {
        setDrawingState("revealed");
      }, 3000);

    } catch (err) {
      console.error(err);
      clearInterval(interval);
      setDrawingState("idle");
    }
  };

  const handlePlantIntoGarden = () => {
    if (luckyResult && !hasPlantedThisTurn) {
      onPlantFlower(luckyResult);
      setHasPlantedThisTurn(true);
    }
  };

  const resetDraw = () => {
    setDrawingState("idle");
    setHasPlantedThisTurn(false);
    setLuckyResult(null);
  };

  return (
    <div className="w-full h-full overflow-y-auto px-5 pt-4 pb-20 bg-white text-gray-800">
      
      {/* Tab Header title */}
      <div className="flex flex-col items-center mb-6">
        <h2 className="font-serif text-lg font-bold text-gray-900">每日運勢抽抽樂</h2>
        <p className="text-[10px] text-gray-400 font-mono tracking-wider">DAILY ORACLE & FLORAL DRAW</p>
        <div className="w-4 h-[1px] bg-gray-200 mt-2" />
      </div>

      <AnimatePresence mode="wait">
        {drawingState === "idle" && (
          <motion.div
            key="idle"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-col items-center"
          >
            {/* Soft background decor flower card */}
            <div className="w-40 h-40 bg-cream/40 rounded-full flex items-center justify-center border border-gray-50/60 mb-6 group relative">
              <div className="absolute inset-0 bg-radial from-[#a3c9e8]/10 to-transparent rounded-full animate-pulse pointer-events-none" />
              <FlowerRenderer name="generic" size={110} swaySpeed="slow" />
            </div>

            {/* Aesthetics dynamic alignment card */}
            <div className="w-full bg-[#faf7f2]/50 rounded-3xl p-5 border border-gray-150/50 mb-6 space-y-3.5">
              <div className="flex items-center gap-1.5 justify-center mb-1">
                <Sparkles className="w-3.5 h-3.5 text-[#5d8cb3] animate-pulse" />
                <span className="text-xs font-serif font-black text-gray-800">宿命星盤核對已啟用</span>
              </div>

              <div className="bg-white/80 rounded-2xl p-4 text-[11px] text-gray-600 leading-relaxed border border-gray-100 flex flex-col gap-2 font-serif">
                <div className="flex justify-between border-b border-gray-50 pb-1.5">
                  <span className="text-gray-400">你的出生星座</span>
                  <span className="font-bold text-gray-800">{userProfile.constellation || "雙魚座 (Pisces) [預設]"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">六星占術主局</span>
                  <span className="font-bold text-gray-800">{userProfile.sixStarsNode || "水星人 (Mercury Star) [預設]"}</span>
                </div>
              </div>

              <p className="text-[10px] text-gray-400 text-center leading-relaxed font-serif pt-1.5">
                💡 欲修改星座或主局？請前往「會員專屬中心」與您的姓名、生日一同編輯。
              </p>
            </div>

            {/* Launch ritual action button and visual cues */}
            <button
              onClick={startDrawRitual}
              className="w-full bg-[#a3c9e8] text-white py-3.5 rounded-2xl text-xs font-medium font-serif shadow-md hover:bg-[#8ebcdb] transition-all flex items-center justify-center gap-1.5 active:scale-[0.98]"
            >
              開啟今日花語命定 · Draw Today's Oracle
            </button>
          </motion.div>
        )}

        {drawingState === "loading" && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center py-20"
          >
            {/* Spinning glowing core */}
            <div className="relative w-24 h-24 mb-8 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-2 border-dashed border-[#a3c9e8]/40 animate-spin" />
              <div className="absolute inset-2 rounded-full border border-[#a3c9e8]/20 bg-cream/40 animate-pulse" />
              <Leaf className="w-6 h-6 text-[#a3c9e8] animate-bounce" />
            </div>
            
            <p className="font-serif text-sm text-gray-600 animate-pulse text-center tracking-wide">
              {loadingText}
            </p>
            <p className="text-[10px] text-gray-400 mt-2 font-mono"><span className="font-bernoru font-black tracking-tighter text-gray-500 mr-1">b'loo</span> — Bloom with Love</p>
          </motion.div>
        )}

        {drawingState === "blooming" && (
          <motion.div
            key="blooming"
            className="relative w-full h-[500px] flex flex-col items-center justify-center overflow-hidden"
          >
            {/* Falling drifting procedural petals */}
            {petals.map((pet) => (
              <motion.div
                key={pet.id}
                className="absolute w-4 h-5 rounded-full bg-[#fff0f5] border border-[#ffccd5]"
                style={{
                  left: `${pet.left}%`,
                  top: -20,
                  width: pet.size,
                  height: pet.size * 1.25,
                  rotate: pet.rotate,
                  background: `radial-gradient(circle, #fff 0%, #ffccd5 100%)`,
                }}
                animate={{
                  y: 520,
                  x: [0, Math.sin(pet.id) * 30, 0],
                  rotate: pet.rotate + 360,
                }}
                transition={{
                  duration: pet.duration,
                  delay: pet.delay,
                  ease: "linear",
                  repeat: Infinity,
                }}
              />
            ))}

            {/* Core flower bud pulsing/blooming scale up */}
            <motion.div
              initial={{ scale: 0.3 }}
              animate={{ scale: [1, 1.4, 1.2] }}
              transition={{ duration: 2.5, ease: "easeInOut" }}
              className="flex items-center justify-center"
            >
              <FlowerRenderer name={luckyResult?.flowerName || "generic"} size={220} glowing={true} swaySpeed="fast" />
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1] }}
              transition={{ delay: 1, duration: 1 }}
              className="font-serif text-sm text-gray-500 mt-8 text-center"
            >
              你的日常，正在悄悄綻放...
            </motion.p>
          </motion.div>
        )}

        {drawingState === "revealed" && luckyResult && (
          <motion.div
            key="revealed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full flex flex-col items-center"
          >
            {/* Result Visual Panel */}
            <div className="relative w-full bg-white rounded-3xl border border-gray-100 p-5 shadow-xs mb-6 text-center">
              {/* Backglow using lucky color */}
              <div 
                className="absolute top-0 left-0 right-0 h-28 opacity-20 rounded-t-3xl pointer-events-none"
                style={{ background: `linear-gradient(180deg, ${luckyResult.luckyColor} 0%, transparent 100%)` }}
              />

              <div className="relative pt-6 flex flex-col items-center">
                <FlowerRenderer name={luckyResult.flowerName} size={150} glowing={true} />
                
                <span className="text-[10px] uppercase font-mono font-bold text-gray-400 mt-3 tracking-widest bg-gray-50 px-2.5 py-0.5 rounded-full">
                  今日幸運之花 · Lucky Flower
                </span>
                
                <h3 className="font-serif text-xl font-bold text-gray-900 mt-2">
                  {luckyResult.flowerName.split(" ")[0]}
                </h3>
                <span className="text-xs text-gray-400 font-mono mt-0.5">
                  {luckyResult.flowerName.slice(luckyResult.flowerName.indexOf("(") + 1, -1)}
                </span>
                
                <div className="w-10 h-[1.5px] bg-gray-100 my-4" />

                <h4 className="font-serif text-sm font-semibold text-[#5d8cb3] max-w-[280px] leading-relaxed px-4">
                  「 {luckyResult.flowerLanguage} 」
                </h4>

                <p className="text-xs text-gray-500 mt-4 px-3 leading-relaxed text-left bg-cream/40 rounded-2xl p-4 border border-gray-50/50">
                  🍃 {luckyResult.emotionReminder}
                </p>
              </div>
            </div>

            {/* Domain Tabs switcher (Love, Work, Finance, Eating) */}
            <div className="w-full bg-[#fbfbf9] rounded-2xl p-1 mb-5 flex border border-gray-100">
              {[
                { id: "general", label: "運勢總結" },
                { id: "love", label: "愛情與親我" },
                { id: "work", label: "工作與財富" },
                { id: "diet", label: "健康與慢食" }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveResultTab(tab.id as any)}
                  className={`flex-1 text-center py-2 text-[11px] font-medium font-serif rounded-xl transition-all duration-300 ${
                    activeResultTab === tab.id
                      ? "bg-white text-gray-800 shadow-xs border border-gray-100/60"
                      : "text-gray-400 hover:text-gray-700"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Details Box */}
            <div className="w-full bg-[#fcfcf9] rounded-2xl border border-gray-100 p-4.5 min-h-[160px] mb-6">
              <AnimatePresence mode="wait">
                {activeResultTab === "general" && (
                  <motion.div
                    key="general"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-4"
                  >
                    <div>
                      <h4 className="text-[10px] font-bold text-gray-400 font-mono tracking-widest uppercase mb-1.5">🎴 今日花語抽抽樂</h4>
                      <p className="text-xs text-gray-700 leading-relaxed font-serif">
                        <strong>抽中花朵：</strong>{luckyResult.flowerName}
                      </p>
                    </div>

                    <div className="flex justify-between items-center bg-white p-2.5 rounded-xl border border-gray-100/50">
                      <div className="text-xs font-serif text-gray-600">
                        <strong>幸運指數：</strong>
                        <span className="text-amber-400 ml-1">
                          {"★".repeat(luckyResult.luckStars || 5)}
                          {"☆".repeat(5 - (luckyResult.luckStars || 5))}
                        </span>
                      </div>
                      <div className="text-xs font-serif text-gray-600">
                        <strong>幸運數字：</strong>
                        <span className="font-mono bg-[#a3c9e8]/10 text-[#5d8cb3] px-2 py-0.5 rounded-md font-bold ml-1">{luckyResult.luckyNumber || 7}</span>
                      </div>
                    </div>

                    <div className="flex gap-2 items-center text-xs text-gray-600 font-serif">
                      <span className="w-2 h-2 rounded-full border border-gray-100" style={{ backgroundColor: luckyResult.luckyColor }} />
                      <p>
                        <strong>幸運顏色：</strong>
                        <span className="font-mono text-gray-500 ml-1">{luckyResult.luckyColor}</span>
                      </p>
                    </div>

                    <div className="bg-white rounded-xl p-3 border border-gray-100/60">
                      <p className="text-[10px] font-semibold text-[#5d8cb3] mb-1">✦ 今日花語訊息</p>
                      <p className="text-xs text-gray-600 leading-relaxed font-serif text-justify">
                        {luckyResult.dailyMessage || luckyResult.emotionReminder}
                      </p>
                    </div>
                  </motion.div>
                )}

                {activeResultTab === "love" && (
                  <motion.div
                    key="love"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex gap-3"
                  >
                    <Heart className="w-5 h-5 text-rose-300 shrink-0 mt-0.5 fill-rose-100" />
                    <div>
                      <h4 className="font-serif text-xs font-bold text-gray-700">對自己與他人的愛情運</h4>
                      <p className="text-xs text-gray-500 mt-2 leading-relaxed font-serif text-justify">{luckyResult.loveFortune || luckyResult.fortune?.relationship}</p>
                    </div>
                  </motion.div>
                )}

                {activeResultTab === "work" && (
                  <motion.div
                    key="work"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-4 font-serif"
                  >
                    <div className="flex gap-3">
                      <Briefcase className="w-5 h-5 text-amber-300 shrink-0 mt-0.5 fill-amber-100" />
                      <div>
                        <h4 className="text-xs font-bold text-gray-700">工作運 · Daily Workspace</h4>
                        <p className="text-xs text-gray-500 mt-1.5 leading-relaxed text-justify">{luckyResult.workFortune || luckyResult.fortune?.work}</p>
                      </div>
                    </div>
                    <div className="border-t border-gray-100/60 pt-3 flex gap-3">
                      <DollarSign className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5 fill-emerald-100/50" />
                      <div>
                        <h4 className="text-xs font-bold text-gray-700">財運 · Abundance Flow</h4>
                        <p className="text-xs text-gray-500 mt-1.5 leading-relaxed text-justify">{luckyResult.financeFortune || luckyResult.fortune?.finance}</p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeResultTab === "diet" && (
                  <motion.div
                    key="diet"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex gap-3 font-serif"
                  >
                    <Leaf className="w-5 h-5 text-emerald-300 shrink-0 mt-0.5 fill-emerald-100" />
                    <div>
                      <h4 className="text-xs font-bold text-gray-700">健康運與自處飲食覺察</h4>
                      <p className="text-xs text-gray-500 mt-2 leading-relaxed text-justify">{luckyResult.healthFortune || luckyResult.mindfulEatingAdvice}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Plant in Garden / Re-Draw Button controls */}
            <div className="w-full space-y-3">
              <button
                onClick={handlePlantIntoGarden}
                disabled={hasPlantedThisTurn}
                className={`w-full py-3.5 rounded-2xl text-xs font-medium font-serif transition-all flex items-center justify-center gap-1.5 ${
                  hasPlantedThisTurn
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-100 font-bold"
                    : "bg-[#a3c9e8] text-white hover:bg-[#8ebcdb] shadow-md active:scale-[0.98]"
                }`}
              >
                {hasPlantedThisTurn ? "✓ 此花已種下在你的花園裡" : "將此花種在我的花園 · Plant in my Garden"}
              </button>

              <button
                onClick={resetDraw}
                className="w-full border border-gray-100 bg-[#fbfbf9] text-gray-500 py-3 rounded-2xl text-[11px] font-serif hover:bg-gray-50 hover:text-gray-700 transition-all flex items-center justify-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                明天再來抽取新的命定花
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
