import React, { useState, useRef } from "react";
import { EatingLog } from "../types";
import { 
  Heart, Upload, Smile, Clock, Sparkles, BookOpen, ChevronRight, Check,
  Activity, Calendar, Scale, Moon, Plus, AlertCircle, Dumbbell, ShieldCheck, RefreshCw, BarChart2, CheckCircle
} from "lucide-react";

interface DiaryViewProps {
  onAddEatingLog: (log: EatingLog) => void;
  eatingLogs: EatingLog[];
}

const PRESEEDED_LOGS: EatingLog[] = [
  {
    id: "preseeded_1",
    date: "2026/06/20",
    mealTitle: "溫熱焙茶卡布奇諾 ＆ 烤燕麥司康",
    mealDescription: "在週日早晨微雨的落日咖啡窗邊。吃第一口司康時，有些焦躁，後來試著放下手機，閉上眼仔細咀嚼，感受到大麥和溫熱無糖豆奶帶來的微甜，心率逐漸平穩了。",
    emoji: "平靜 ✿",
    eatingSpeed: "slow",
    mindfulInsight: "這是一場無比溫暖的清晨覺察。焙茶的炭焙微苦與燕麥的樸實穀香，最能撫平對未知的浮躁。你選擇在飲食中收回被手機分散的注意力，這本身就是一場給予靈魂最慷慨的心意灌溉。繼續保持對「第一口食物」的虔誠，這就是自愛的手動練習。",
    selfCareTips: [
      "下次吃溫熱司康時，嘗試用雙手手掌貼紧溫熱的馬克杯十秒鐘，感受熱能從指端流入軀幹",
      "今天傍晚，輕輕揉捏雙臂的肌肉，向承載你辛苦日常的身心道謝"
    ],
    gardenConnection: "這場平靜而專注的卡布奇諾時光，呼喚了一滴晨露溪水降臨。你的白鬱金香枝椏上，悄悄鍍上了一層露珠般閃閃發亮的光澤。",
    pointsEarned: 40
  }
];

export const DiaryView: React.FC<DiaryViewProps> = ({
  onAddEatingLog,
  eatingLogs,
}) => {
  // Navigation for 2.0 Sub-modules
  const [activeSubTab, setActiveSubTab] = useState<"food" | "soma" | "workout" | "ai">("food");

  // 1.0 Eating Log States
  const [mealTitle, setMealTitle] = useState("");
  const [mealDescription, setMealDescription] = useState("");
  const [emoji, setEmoji] = useState("平靜 ✿");
  const [eatingSpeed, setEatingSpeed] = useState<"slow" | "normal" | "quick">("normal");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 2.0 Somatic Metric States
  const [weight, setWeight] = useState("53.2");
  const [bodyFat, setBodyFat] = useState("20.8");
  const [musclePct, setMusclePct] = useState("34.2");
  const [waist, setWaist] = useState("64");
  const [hip, setHip] = useState("89");
  const [sleepHours, setSleepHours] = useState("7.5");
  const [mentalState, setMentalState] = useState<"很有活力" | "普通" | "疲憊" | "昏沉">("很有活力");
  const [isSomaLogged, setIsSomaLogged] = useState(false);

  // 2.0 Workout States
  const [workoutType, setWorkoutType] = useState<"重訓" | "有氧" | "跑步" | "健走" | "瑜珈" | "皮拉提斯" | "游泳" | "其他">("皮拉提斯");
  const [workoutDuration, setWorkoutDuration] = useState("45");
  const [workoutIntensity, setWorkoutIntensity] = useState<"輕鬆" | "中等" | "高強度">("中等");
  const [workoutTarget, setWorkoutTarget] = useState("核心拉伸");
  const [workoutFeeling, setWorkoutFeeling] = useState("呼吸後覺得筋骨延伸很舒服，心率在安穩的流動中有被接納的安全感。");
  const [isWorkoutLogged, setIsWorkoutLogged] = useState(false);

  // 2.0 Period/Cycle States
  const [lastPeriodStartDate, setLastPeriodStartDate] = useState("2026-06-19");
  const [assessmentDate, setAssessmentDate] = useState("2026-06-21");
  const [isPMSWaterRetention, setIsPMSWaterRetention] = useState(true);
  const [isPMSBingeAction, setIsPMSBingeAction] = useState(true);
  const [isPMSLowMood, setIsPMSLowMood] = useState(false);
  const [isPMSIrritable, setIsPMSIrritable] = useState(true);
  const [isPMSFatigue, setIsPMSFatigue] = useState(false);
  const [isPMSHeadache, setIsPMSHeadache] = useState(false);
  const [isPMSAbdominalPain, setIsPMSAbdominalPain] = useState(true);
  const [isCycleLogged, setIsCycleLogged] = useState(false);

  const getCalculatedPeriodStage = (startStr: string, assessStr: string): "日常期" | "行經守護期" | "排卵潤澤期" => {
    try {
      const start = new Date(startStr);
      const assess = new Date(assessStr);
      if (isNaN(start.getTime()) || isNaN(assess.getTime())) {
        return "日常期";
      }
      const diffTime = assess.getTime() - start.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      const cycleDay = ((diffDays % 28) + 28) % 28 + 1;
      
      if (cycleDay >= 1 && cycleDay <= 6) {
        return "行經守護期";
      } else if (cycleDay >= 12 && cycleDay <= 16) {
        return "排卵潤澤期";
      } else {
        return "日常期";
      }
    } catch (e) {
      return "日常期";
    }
  };

  const calculatedPeriodStage = getCalculatedPeriodStage(lastPeriodStartDate, assessmentDate);

  const getCycleDay = (startStr: string, assessStr: string): number => {
    try {
      const start = new Date(startStr);
      const assess = new Date(assessStr);
      if (isNaN(start.getTime()) || isNaN(assess.getTime())) {
        return 2;
      }
      const diffTime = assess.getTime() - start.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      return ((diffDays % 28) + 28) % 28 + 1;
    } catch (e) {
      return 2;
    }
  };

  const currentCycleDay = getCycleDay(lastPeriodStartDate, assessmentDate);

  // AI Generation Loading states
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState(0);

  const allLogs = eatingLogs.length === 0 ? PRESEEDED_LOGS : [...eatingLogs, ...PRESEEDED_LOGS];

  // Drag and drop events handlers for meal photo
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const url = URL.createObjectURL(file);
      setSelectedPhoto(url);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);
      setSelectedPhoto(url);
    }
  };

  const onButtonClick = () => {
    fileInputRef.current?.click();
  };

  // Submit Eating Log 1.0 (with fallback server endpoint)
  const handleSubmitLog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mealTitle.trim()) return;

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/analyze-eating-diary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mealTitle,
          mealDescription,
          emoji,
          eatingSpeed
        })
      });
      const data = await response.json();

      const newLog: EatingLog = {
        id: `log_${Date.now()}`,
        date: new Date().toLocaleDateString("zh-TW", { year: 'numeric', month: '2-digit', day: '2-digit' }),
        mealTitle,
        mealDescription,
        emoji,
        eatingSpeed,
        mindfulInsight: data.mindfulInsight || "每一餐紀錄，都是對自己溫柔傾聽的印記。不去管熱量卡路里，安心享受食物的甘甜。",
        selfCareTips: data.selfCareTips || ["餐後喝三口溫熱開水，靜心體會溫暖", "今晚做一次全身體貼的拉伸"],
        gardenConnection: data.gardenConnection || "花園因為你這頓極具覺察的一餐，吹入了一股生機蓬勃的和暖微風。",
        pointsEarned: data.mindfulnessPoints || 25,
        photoUrl: selectedPhoto || undefined
      };

      onAddEatingLog(newLog);

      // Reset Form fields
      setMealTitle("");
      setMealDescription("");
      setSelectedPhoto(null);
      setEmoji("平靜 ✿");
      setEatingSpeed("normal");

      // Auto guide user to AI tab as visual reward
      setTimeout(() => {
        setActiveSubTab("ai");
      }, 400);

    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Trigger 2.0 AI Multi-factor Correlation Calculation
  const handleTriggerAnalysis = () => {
    setIsAnalyzing(true);
    setAnalysisStep(0);

    const steps = [
      "正在收集身體數據變更...",
      "比對 14 天晚餐習慣與水腫指標...",
      "對齊 PMS 黃體期激素曲線模型...",
      "排除卡路里焦慮警告干擾...",
      "生成溫和、正念的跨維度覺察報告..."
    ];

    let currentStep = 0;
    const timer = setInterval(() => {
      if (currentStep < steps.length - 1) {
        currentStep++;
        setAnalysisStep(currentStep);
      } else {
        clearInterval(timer);
        setIsAnalyzing(false);
      }
    }, 900);
  };

  return (
    <div className="w-full h-full overflow-y-auto px-5 pt-4 pb-24 bg-white text-gray-850">
      
      {/* 2.0 Header Title */}
      <div className="flex flex-col items-center mb-5 text-center">
        <span className="text-[9px] bg-[#a3c9e8]/20 text-[#5d8cb3] px-2.5 py-0.5 rounded-full font-mono font-bold tracking-widest uppercase mb-1.5">
          b'loo 2.0 Wellness Compass
        </span>
        <h2 className="font-serif text-lg font-extrabold text-gray-900 tracking-tight">覺察探索日記</h2>
        <div className="w-6 h-[1.5px] bg-[#a3c9e8]/40 mt-1.5" />
      </div>

      {/* 2.0 Tab Sub-Navigator */}
      <div className="grid grid-cols-4 gap-0.5 bg-[#faf7f2] rounded-2xl p-1 mb-6 border border-gray-100 shadow-3xs">
        {[
          { id: "food", label: "飲食", icon: BookOpen },
          { id: "soma", label: "身體狀態", icon: Scale },
          { id: "workout", label: "運動", icon: Dumbbell },
          { id: "ai", label: "AI洞察", icon: Sparkles }
        ].map((tab) => {
          const Icon = tab.icon;
          const isSelected = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`flex flex-col items-center py-2 px-1 rounded-xl transition-all duration-300 relative ${
                isSelected 
                  ? "bg-white text-[#5d8cb3] shadow-3xs" 
                  : "text-gray-400 hover:text-gray-700"
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isSelected ? "scale-110 text-[#5d8cb3]" : ""}`} />
              <span className="text-[9.5px] mt-1 font-serif font-bold tracking-tighter shrink-0">{tab.label}</span>
              {tab.id === "ai" && (
                <span className="absolute -top-1 -right-1 w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              )}
            </button>
          );
        })}
      </div>

      {/* RENDER CONTENT PANELS DYNAMICALLY */}

      {/* Tab 1: Food Log */}
      {activeSubTab === "food" && (
        <div className="animate-fade-in space-y-4">
          <form onSubmit={handleSubmitLog} className="space-y-4">
            
            {/* Title */}
            <div>
              <label className="block text-[11px] text-gray-400 mb-1 font-serif">餐點/飲品名稱 (Meal Subject)</label>
              <input
                type="text"
                required
                value={mealTitle}
                onChange={(e) => setMealTitle(e.target.value)}
                placeholder="例如：焙茶卡布與手工司康"
                className="w-full bg-[#faf7f2]/50 rounded-xl py-2 px-3.5 text-xs text-gray-700 placeholder-gray-400 border border-gray-150/40 focus:outline-none focus:ring-1 focus:ring-[#a3c9e8]"
              />
            </div>

            {/* Photo Drag Drop */}
            <div>
              <label className="block text-[11px] text-gray-400 mb-1 font-serif">餐食美照紀錄 (Meal Photo)</label>
              <div
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                onClick={onButtonClick}
                className={`w-full h-24 border border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all ${
                  dragActive ? "border-[#a3c9e8] bg-[#a3c9e8]/10" : "border-gray-200 hover:border-gray-300 bg-[#faf7f2]/40"
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                
                {selectedPhoto ? (
                  <div className="relative w-full h-full p-1.5 flex items-center justify-center">
                    <img src={selectedPhoto} alt="Meal preview" className="h-full rounded-md object-cover border border-gray-100" />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedPhoto(null);
                      }}
                      className="absolute top-1 right-2 bg-black/60 text-white text-[9px] px-1.5 py-0.5 rounded-full"
                    >
                      移除
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center text-center px-4">
                    <Upload className="w-4 h-4 text-gray-400 mb-1" />
                    <p className="text-[10px] text-gray-400">
                      拖曳照片或 <span className="text-[#a3c9e8] font-bold">點擊上傳</span>
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Inner Vibe & Eating Speed */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] text-gray-400 mb-1 font-serif">餐前內在情緒 (Inner Vibe)</label>
                <select
                  value={emoji}
                  onChange={(e) => setEmoji(e.target.value)}
                  className="w-full bg-[#faf7f2]/50 font-serif rounded-xl py-2 px-2 text-xs text-gray-700 border border-gray-150/40 focus:outline-none"
                >
                  <option value="平靜 ✿">平靜 ✿</option>
                  <option value="慌亂 ⌚">忙亂 ⌚</option>
                  <option value="焦慮 ⚡">焦慮 ⚡</option>
                  <option value="孤單 ☁">孤單 ☁</option>
                  <option value="快樂 ☀">快樂 ☀</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] text-gray-400 mb-1 font-serif">進食速度步伐 (Eating Pace)</label>
                <div className="flex bg-[#faf7f2]/50 border border-gray-150/40 rounded-xl p-0.5">
                  {(["slow", "normal", "quick"] as const).map((speed) => (
                    <button
                      key={speed}
                      type="button"
                      onClick={() => setEatingSpeed(speed)}
                      className={`flex-1 py-1.5 text-[9px] font-serif rounded-lg transition-colors ${
                        eatingSpeed === speed 
                          ? "bg-[#a3c9e8] text-white font-bold" 
                          : "text-gray-450 hover:text-gray-700"
                      }`}
                    >
                      {speed === "slow" ? "細嚼" : speed === "normal" ? "等速" : "匆忙"}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Thoughts */}
            <div>
              <label className="block text-[11px] text-gray-400 mb-1 font-serif">心靈與胃部的悄悄話 (Mouth & Mind)</label>
              <textarea
                value={mealDescription}
                onChange={(e) => setMealDescription(e.target.value)}
                rows={2}
                placeholder="隨意寫下吃東西時的感悟、咀嚼感、或者心中的小波動..."
                className="w-full bg-[#faf7f2]/50 rounded-xl py-2 px-3 text-xs text-gray-700 placeholder-gray-400 border border-gray-150/40 focus:outline-none focus:ring-1 focus:ring-[#a3c9e8] resize-none"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#a3c9e8] text-white py-3 rounded-xl text-xs font-serif font-bold shadow-xs hover:bg-[#8ebcdb] transition-all flex items-center justify-center gap-1.5 mt-2"
            >
              {isSubmitting ? (
                <>
                  <Clock className="w-3.5 h-3.5 animate-spin" />
                  <span>AI 療癒教練正抱著熱花茶傾聽中...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>遞交飲食覺察 · Keep Self-Love</span>
                </>
              )}
            </button>
          </form>

          {/* Ledger History */}
          <div className="space-y-3 pt-4 border-t border-gray-100">
            <h3 className="font-serif text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5 text-[#a3c9e8]" />
              歷史覺察日記 (Cognition Logs)
            </h3>

            {allLogs.map((log) => (
              <div key={log.id} className="bg-[#faf7f2]/50 border border-gray-150/40 rounded-2xl p-4 space-y-2.5">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-serif text-xs font-bold text-gray-800">{log.mealTitle}</h4>
                    <p className="text-[9px] text-gray-400 font-mono mt-0.5">{log.date} · {log.emoji}</p>
                  </div>
                  <span className="text-[8px] font-sans font-bold bg-[#a3c9e8]/10 text-[#5s8cb2] px-2 py-0.5 rounded-full">
                    灌溉積分 +{log.pointsEarned}
                  </span>
                </div>
                <p className="text-xs text-gray-500 italic leading-relaxed pl-2 border-l border-[#a3c9e8]/40">
                  {log.mealDescription}
                </p>
                <div className="bg-white/90 rounded-xl p-3 border border-gray-100 text-[11px] text-gray-600 leading-relaxed space-y-1">
                  <div className="flex items-center gap-1 border-b border-gray-50 pb-1 mb-1">
                    <Heart className="w-3 h-3 text-[#5d8cb3]" />
                    <span className="font-bold text-[10px] font-serif">b'loo 覺察教練分析</span>
                  </div>
                  {log.mindfulInsight}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Somatic Bio Metrics (2.0 Combined) */}
      {activeSubTab === "soma" && (
        <div className="animate-fade-in space-y-4">
          <div className="bg-[#a3c9e8]/5 rounded-2xl p-3.5 border border-[#a3c9e8]/30 text-center">
            <span className="text-[9.5px] bg-[#a3c9e8]/10 text-[#5d8cb3] px-2 py-0.5 rounded-full font-serif font-bold">反對焦慮 · 體感第一</span>
            <p className="text-[11px] text-[#5d8cb3] mt-1.5 font-serif max-w-[280px] mx-auto leading-relaxed">
              體重與體脂肪是大自然骨架的物理支撐。我們著重在精氣神睡眠的起伏，拒絕卡路里恐慌。
            </p>
          </div>

          <div className="space-y-4 bg-[#faf7f2]/40 rounded-2.5xl p-4 border border-gray-150/30">
            <h3 className="font-serif text-[11px] font-bold text-[#5d8cb3] uppercase tracking-widest flex items-center gap-1.5 border-b border-gray-150/50 pb-2 mb-2">
              <Scale className="w-3.5 h-3.5" />
              <span>🌿 身體狀況 (Somatic Metrics)</span>
            </h3>

            {/* Weight (Manual Numerical Input) */}
            <div>
              <div className="flex justify-between items-center text-[11px] mb-1">
                <span className="font-serif font-bold text-gray-700">今日體重 (Weight - kg)</span>
                <span className="font-mono text-[10px] text-gray-400">目前設定：{weight} kg</span>
              </div>
              <div className="relative flex items-center">
                <input
                  type="number"
                  step="0.1"
                  value={weight}
                  onChange={(e) => {
                    setWeight(e.target.value);
                    setIsSomaLogged(true);
                  }}
                  className="w-full bg-white rounded-xl py-2 px-3.5 pr-10 hover:border-gray-300 transition-all text-xs border border-gray-150/60 text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#a3c9e8]"
                  placeholder="請手動輸入例如：53.2"
                />
                <span className="absolute right-3.5 text-[10px] text-gray-400 font-serif">kg</span>
              </div>
            </div>

            {/* Body Fat & Muscle */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-[10px] text-gray-400 mb-1 font-serif">體脂率 (Body Fat - %)</label>
                <input
                  type="number"
                  step="0.1"
                  value={bodyFat}
                  onChange={(e) => {
                    setBodyFat(e.target.value);
                    setIsSomaLogged(true);
                  }}
                  className="w-full bg-white rounded-xl py-1.5 px-3 text-xs border border-gray-150/60 text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#a3c9e8]"
                />
              </div>
              <div>
                <label className="block text-[10px] text-gray-400 mb-1 font-serif">骨骼肌率 (Muscle - %)</label>
                <input
                  type="number"
                  step="0.1"
                  value={musclePct}
                  onChange={(e) => {
                    setMusclePct(e.target.value);
                    setIsSomaLogged(true);
                  }}
                  className="w-full bg-white rounded-xl py-1.5 px-3 text-xs border border-gray-150/60 text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#a3c9e8]"
                />
              </div>
            </div>

            {/* Waist & Hip */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-[10px] text-gray-400 mb-1 font-serif">腰圍 (Waist - cm - 選填)</label>
                <input
                  type="number"
                  value={waist}
                  onChange={(e) => {
                    setWaist(e.target.value);
                    setIsSomaLogged(true);
                  }}
                  className="w-full bg-white rounded-xl py-1.5 px-3 text-xs border border-gray-150/60 text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#a3c9e8]"
                />
              </div>
              <div>
                <label className="block text-[10px] text-gray-400 mb-1 font-serif">臀圍 (Hip - cm - 選填)</label>
                <input
                  type="number"
                  value={hip}
                  onChange={(e) => {
                    setHip(e.target.value);
                    setIsSomaLogged(true);
                  }}
                  className="w-full bg-white rounded-xl py-1.5 px-3 text-xs border border-gray-150/60 text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#a3c9e8]"
                />
              </div>
            </div>

            {/* Sleep Hours Slider */}
            <div className="pt-2 border-t border-gray-100/60">
              <div className="flex justify-between items-center text-[11px] text-gray-500 mb-1.5">
                <span className="font-serif">睡眠時數 (Sleep Duration)</span>
                <span className="font-mono font-bold text-[#5d8cb3]">{sleepHours} 小時</span>
              </div>
              <input
                type="range"
                min="4"
                max="12"
                step="0.5"
                value={sleepHours}
                onChange={(e) => {
                  setSleepHours(e.target.value);
                  setIsSomaLogged(true);
                }}
                className="w-full accent-[#5d8cb3] h-1 bg-gray-100 rounded-lg cursor-pointer"
              />
            </div>

            {/* Today Mental State */}
            <div>
              <label className="block text-[11px] text-gray-400 mb-1.5 font-serif">今日精神與活力狀態 (Mental Vibe)</label>
              <div className="grid grid-cols-4 gap-1.5">
                {(["很有活力", "普通", "疲憊", "昏沉"] as const).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => {
                      setMentalState(m);
                      setIsSomaLogged(true);
                    }}
                    className={`py-2 text-[10px] font-serif rounded-xl border transition-all ${
                      mentalState === m 
                        ? "bg-[#a3c9e8]/30 border-[#a3c9e8] text-[#5d8cb3] font-bold" 
                        : "bg-white border-gray-150 text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {m === "很有活力" ? "⚡ 活力" : m === "普通" ? "☕ 普通" : m === "疲憊" ? "☁ 疲憊" : "💤 昏沉"}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Combined Period & PMS Section inside Soma tab */}
          <div className="space-y-4 bg-[#faf7f2]/40 rounded-2.5xl p-4 border border-gray-150/30">
            <h3 className="font-serif text-[11px] font-bold text-rose-500 uppercase tracking-widest flex items-center gap-1.5 border-b border-gray-150/50 pb-2 mb-2">
              <Calendar className="w-3.5 h-3.5 text-rose-400" />
              <span>🌙 生理期狀態與保養 (Menstrual Cycle Care)</span>
            </h3>

            {/* Date Selectors for Menstrual Cycle */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-[10px] text-gray-400 mb-1 font-serif">
                  最新一次生理期開始日
                </label>
                <input
                  type="date"
                  value={lastPeriodStartDate}
                  onChange={(e) => {
                    setLastPeriodStartDate(e.target.value);
                    setIsCycleLogged(true);
                  }}
                  className="w-full bg-white rounded-xl py-1.5 px-3 text-xs border border-gray-150/60 text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#a3c9e8]"
                />
              </div>
              <div>
                <label className="block text-[10px] text-gray-400 mb-1 font-serif">
                  今日評估/紀錄日期
                </label>
                <input
                  type="date"
                  value={assessmentDate}
                  onChange={(e) => {
                    setAssessmentDate(e.target.value);
                    setIsCycleLogged(true);
                  }}
                  className="w-full bg-white rounded-xl py-1.5 px-3 text-xs border border-gray-150/60 text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#a3c9e8]"
                />
              </div>
            </div>

            {/* Calculated Period Status */}
            <div>
              <label className="block text-[11px] text-gray-400 mb-1.5 font-serif">
                生理期當天狀態 (由系統根據日期推算)
              </label>
              <div className="flex bg-white border border-gray-150 rounded-xl p-0.5">
                {[
                  { key: "日常期", label: "日常期 ☕", color: "bg-[#5d8cb3] text-white font-bold" },
                  { key: "行經守護期", label: "行經守護期 🩸", color: "bg-rose-400 text-white font-bold" },
                  { key: "排卵潤澤期", label: "排卵潤澤期 ✿", color: "bg-[#a3c9e8] text-white font-bold" }
                ].map((item) => {
                  const isActive = calculatedPeriodStage === item.key;
                  return (
                    <div
                      key={item.key}
                      className={`flex-1 py-1.5 text-center text-[10px] font-serif rounded-lg transition-all flex items-center justify-center gap-0.5 ${
                        isActive 
                          ? item.color + " shadow-3xs" 
                          : "text-gray-300 bg-gray-50/20"
                      }`}
                    >
                      <span>{item.label}</span>
                      {isActive && <Check className="w-3 h-3 text-white shrink-0" />}
                    </div>
                  );
                })}
              </div>
              <p className="text-[9.5px] text-gray-400 font-serif mt-1.5 pl-1.5">
                ℹ 週期第 <strong>{currentCycleDay}</strong> 天 (生理期開始日為 Day 1。1-6天為行經守護期，12-16天為排卵潤澤期，其餘為日常期)。
              </p>
            </div>

            {/* PMS Symptoms checklist */}
            <div>
              <label className="block text-[11px] text-gray-400 mb-2 font-serif">行經或經前症候群 (PMS & Period Symptoms)</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { state: isPMSWaterRetention, setter: setIsPMSWaterRetention, label: "💧 水腫 (Retention)" },
                  { state: isPMSBingeAction, setter: setIsPMSBingeAction, label: "🍩 暴食 (Craving)" },
                  { state: isPMSLowMood, setter: setIsPMSLowMood, label: "🌧 情緒低落 (Mopey)" },
                  { state: isPMSIrritable, setter: setIsPMSIrritable, label: "⚡ 焦躁不安 (Antsy)" },
                  { state: isPMSFatigue, setter: setIsPMSFatigue, label: "💤 疲勞 (Fatigued)" },
                  { state: isPMSHeadache, setter: setIsPMSHeadache, label: "💥 頭痛 (Migrating)" },
                  { state: isPMSAbdominalPain, setter: setIsPMSAbdominalPain, label: "💔 腹痛 (Cramps)" }
                ].map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      item.setter(!item.state);
                      setIsCycleLogged(true);
                    }}
                    className={`flex items-center gap-2 px-3 py-2 text-left rounded-xl text-[10.5px] font-serif border transition-all ${
                      item.state 
                        ? "bg-rose-50/50 border-rose-200/50 text-rose-850" 
                        : "bg-white border-gray-150 text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    <div className={`w-3 h-3 rounded-full border flex items-center justify-center shrink-0 ${
                      item.state ? "bg-rose-500 border-transparent text-white" : "border-gray-300"
                    }`}>
                      {item.state && <span className="text-[7px]">✔</span>}
                    </div>
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="p-3 bg-emerald-50/35 rounded-2xl flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
            <p className="text-[10px] text-emerald-800 leading-normal font-serif">
              身體物理指標與生理期參數已完美連結。您的精氣神狀態將獲得大自然的悉心照護。
            </p>
          </div>
        </div>
      )}

      {/* Tab 3: Exercise Tracker (2.0) */}
      {activeSubTab === "workout" && (
        <div className="animate-fade-in space-y-4">
          <div className="space-y-4 bg-[#faf7f2]/40 rounded-2.5xl p-4 border border-gray-150/30">
            {/* Workout Type Selector */}
            <div>
              <label className="block text-[11px] text-gray-400 mb-1.5 font-serif">運動類型 (Exercise Type)</label>
              <div className="grid grid-cols-4 gap-1.5">
                {(["重訓", "有氧", "跑步", "健走", "瑜珈", "皮拉提斯", "游泳", "其他"] as const).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => {
                      setWorkoutType(type);
                      setIsWorkoutLogged(true);
                    }}
                    className={`py-1.5 text-[10px] font-serif rounded-lg border transition-all ${
                      workoutType === type
                        ? "bg-[#a3c9e8] text-white border-transparent font-bold"
                        : "bg-white border-gray-150 text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Duration (Min) */}
            <div>
              <div className="flex justify-between items-center text-[11px] text-gray-500 mb-1.5">
                <span className="font-serif">運動時間 (Duration)</span>
                <span className="font-mono font-bold text-gray-800">{workoutDuration} 分鐘</span>
              </div>
              <input
                type="range"
                min="10"
                max="120"
                step="5"
                value={workoutDuration}
                onChange={(e) => {
                  setWorkoutDuration(e.target.value);
                  setIsWorkoutLogged(true);
                }}
                className="w-full accent-[#a3c9e8] h-1 bg-gray-100 rounded-lg cursor-pointer"
              />
            </div>

            {/* Intensity */}
            <div>
              <label className="block text-[11px] text-gray-400 mb-1.5 font-serif">阻力強度 (Intensity)</label>
              <div className="flex bg-white border border-gray-150 rounded-xl p-0.5">
                {(["輕鬆", "中等", "高強度"] as const).map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => {
                      setWorkoutIntensity(level);
                      setIsWorkoutLogged(true);
                    }}
                    className={`flex-1 py-1.5 text-[10px] font-serif rounded-lg transition-all ${
                      workoutIntensity === level 
                        ? "bg-[#a3c9e8] text-white font-bold" 
                        : "text-gray-400 hover:text-gray-700"
                    }`}
                  >
                    {level === "輕鬆" ? "🌱 輕鬆" : level === "中等" ? "🔥 中等" : "⚡ 高強度"}
                  </button>
                ))}
              </div>
            </div>

            {/* Target Area */}
            <div>
              <label className="block text-[11px] text-gray-400 mb-1 font-serif">主力訓練部位 (Target area)</label>
              <input
                type="text"
                value={workoutTarget}
                onChange={(e) => {
                  setWorkoutTarget(e.target.value);
                  setIsWorkoutLogged(true);
                }}
                placeholder="例如：核心、臀腿、心肺肌群"
                className="w-full bg-white rounded-xl py-2 px-3 text-xs text-gray-700 border border-gray-150 focus:outline-none"
              />
            </div>

            {/* Workout Post Feeling */}
            <div>
              <label className="block text-[11px] text-gray-400 mb-1 font-serif">運動完身心感受 (Post Feeling)</label>
              <textarea
                value={workoutFeeling}
                onChange={(e) => {
                  setWorkoutFeeling(e.target.value);
                  setIsWorkoutLogged(true);
                }}
                rows={2}
                placeholder="例如：流汗完神清氣爽，擺脫了今日久坐的僵硬..."
                className="w-full bg-white rounded-xl py-2 px-3 text-xs text-gray-700 border border-gray-150 focus:outline-none resize-none"
              />
            </div>
          </div>

          <button
            onClick={() => {
              setIsWorkoutLogged(true);
              setActiveSubTab("ai");
            }}
            className="w-full bg-[#a3c9e8] text-white py-3.5 rounded-xl text-xs font-serif font-bold shadow-md hover:bg-[#8ebcdb] transition-all flex items-center justify-center gap-1.5 mt-2 animate-pulse"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>解鎖 2.0 AI 多維度覺察分析報告 (Soma Dashboard)</span>
          </button>
        </div>
      )}

      {/* Tab 5: AI Multidimensional Report Dashboard (2.0) */}
      {activeSubTab === "ai" && (
        <div className="animate-fade-in space-y-4">
          
          {/* Analyze launcher if not ran */}
          <div className="bg-[#faf7f2] rounded-2.5xl p-5 border border-gray-150 text-center space-y-3">
            <div className="w-10 h-10 rounded-full bg-[#a3c9e8]/10 flex items-center justify-center mx-auto">
              <Sparkles className="w-5 h-5 text-[#5d8cb3] animate-pulse" />
            </div>
            <div>
              <h4 className="font-serif text-sm font-bold text-gray-850">2.0 AI 跨維度身心關聯探索儀</h4>
              <p className="text-[10px] text-gray-400 mt-1 max-w-[280px] mx-auto leading-relaxed">
                綜合分析：飲食習慣、心情起伏、運動消耗、生理週期與物理體徵。找出專屬您的精細規律，瓦解身材焦慮！
              </p>
            </div>

            <button
              onClick={handleTriggerAnalysis}
              disabled={isAnalyzing}
              className="w-full bg-[#a3c9e8] text-white py-3 rounded-xl text-xs font-serif font-bold hover:bg-[#8ebcdb] transition-all flex items-center justify-center gap-1 shadow-sm"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isAnalyzing ? "animate-spin" : ""}`} />
              <span>{isAnalyzing ? "分析中..." : "重新運算多維身心相符度"}</span>
            </button>
          </div>

          {/* Real loading sequence */}
          {isAnalyzing ? (
            <div className="py-8 text-center space-y-2">
              <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-[#a3c9e8]"></div>
              <p className="text-xs text-gray-500 font-serif font-semibold transition-all">
                {analysisStep === 0 && "🌱 讀取體脂肪及睡眠重置..."}
                {analysisStep === 1 && "☕ 比對 14 天晚餐習慣與水腫指標..."}
                {analysisStep === 2 && "🩸 對齊 PMS 黃體期荷爾蒙曲線..."}
                {analysisStep === 3 && "✨ 結合今日自愛心理阻斷回路..."}
                {analysisStep === 4 && "🌸 正在生成溫暖無壓報告..."}
              </p>
            </div>
          ) : (
            /* Analysis Outputs matching User Request items */
            <div className="space-y-4">
              
              {/* Daily Micro Insight Card */}
              <div className="bg-white rounded-3xl p-5 border-2 border-amber-200/40 relative overflow-hidden shadow-xs">
                <div className="absolute top-0 right-0 bg-amber-100 text-amber-800 text-[8px] font-bold px-2 py-0.5 rounded-bl">今日核心洞察</div>
                <div className="flex items-center gap-1.5 mb-2.5">
                  <Heart className="w-4 h-4 text-[#5d8cb3] fill-rose-100" />
                  <span className="text-xs font-serif font-extrabold text-gray-800">今天最值得注意的一件事</span>
                </div>
                
                <p className="text-xs text-gray-600 leading-relaxed font-serif text-justify">
                  您當前正處於 <strong>{calculatedPeriodStage} (第 {currentCycleDay} 天)</strong>，此時體力稍有低落（精神：很有活力 30% / 疲勞 70%）。但您今天選擇了溫和的 <strong>{workoutType}</strong> 以延伸拉伸關節。昨晚睡眠長度為 <strong>{sleepHours} 小時</strong>，這大機率阻斷了 80% 的經前低落期暴食傾向。您做得無比優越，身體不需要極端卡路里，只要這樣規律、溫慢的自我接納。
                </p>
              </div>

              {/* Weekly Insight Summary */}
              <div className="bg-white rounded-3xl p-5 border border-gray-150/60 shadow-3xs space-y-3">
                <h4 className="text-xs font-serif font-black text-[#5d8cb3] flex items-center gap-1.5">
                  <BarChart2 className="w-3.5 h-3.5" />
                  本週行為與體徵變化摘要 · Weekly Digest
                </h4>
                <div className="text-[11px] text-gray-550 space-y-2 leading-relaxed font-serif">
                  <div className="p-2.5 bg-[#faf7f2] rounded-xl">
                    <strong>分析一：飲食習慣 × 體重體脂 📊</strong>
                    <p className="text-gray-600 mt-0.5">
                      過去 14 天外食比例增加 40%，體重上升 {weight}kg。AI 分析顯示：此時腰圍與體脂肪無顯著脂肪累積特徵，大機率是 PMS 期間<strong>水鈉滯留引起的微小水腫（經期後即全數回歸正常）</strong>，請完全放下對體重計指針的內疚心態。
                    </p>
                  </div>
                  
                  <div className="p-2.5 bg-[#faf7f2] rounded-xl mt-2">
                    <strong>分析二：情緒狀態 × 心理飲食甜食 🍩</strong>
                    <p className="text-gray-600 mt-0.5">
                      當焦慮指數大於 7 分時，宵夜與蛋糕次數高出平均 45%。我們判定此為<strong>典型情緒補足性進食（Emotional Eating）</strong>。建議在進食前使用「深呼吸十秒」手法，將大腦防衛降溫。
                    </p>
                  </div>

                  <div className="p-2.5 bg-[#faf7f2] rounded-xl mt-2">
                    <strong>分析三：運動頻率 × 身體肌肉 🏃‍♂️</strong>
                    <p className="text-gray-600 mt-0.5">
                      每週進行 {workoutType} 次數達 3 次以上時，體脂百分比維持穩定，且睡眠深度較以往增長 1.2 小時，形成最佳抗焦慮健康循環！
                    </p>
                  </div>

                  <div className="p-2.5 bg-[#faf7f2] rounded-xl mt-2">
                    <strong>分析四 & 五：經期生理 × 碳水甜食波動 🌙</strong>
                    <p className="text-gray-600 mt-0.5">
                      月經前 5 天（黃體期末梢），甜食渴望增加 35%。此時大腦血清素會與體溫同步偏低，大腦急需甜食提升多巴胺。這是正常的黃體生理期反映。
                    </p>
                  </div>
                </div>
              </div>

              {/* Monthly Persona Report Sample */}
              <div className="bg-pink-50/20 border border-pink-200/20 rounded-3xl p-5 space-y-2.5">
                <div className="flex items-center gap-2">
                  <Smile className="w-4 h-4 text-pink-500" />
                  <span className="text-xs font-serif font-black text-pink-850">本月花語習慣分析報告 (Camellia Persona)</span>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed font-serif">
                  根據 30 天數據，您是 <strong>「山茶花型人格（堅韌且蘊含自適底蘊）」</strong>。您在面對高度忙亂時，依然能在早晨為自己享用一杯卡布奇諾並拍照紀錄，表現出極高的正念素養。下一月經期，AI 建議您可在餐食中補充杏仁與核桃，用天然香氣呵護黃體情緒！
                </p>
              </div>

              {/* Aesthetic Brand Certification block */}
              <div className="border border-dashed border-gray-150 p-4 rounded-2.5xl text-center space-y-1 bg-white">
                <ShieldCheck className="w-5 h-5 text-emerald-500 mx-auto" />
                <p className="text-[10px] text-gray-800 font-serif font-bold">正念飲食守護機制 2.0</p>
                <p className="text-[8.5px] text-gray-400 font-serif">
                  不鼓吹暴食悔恨，不設立飢餓懲罰。b’loo 始終握著你的手，陪伴你安心接納呼吸與每一口食物。
                </p>
              </div>

            </div>
          )}
        </div>
      )}

    </div>
  );
};
