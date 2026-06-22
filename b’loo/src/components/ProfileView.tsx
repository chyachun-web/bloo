import React, { useState } from "react";
import { UserProfile, BirthdayFlower } from "../types";
import { FlowerRenderer } from "./FlowerRenderer";
import { Calendar, User, Clock, Heart, Award, ArrowRight, RotateCcw, AlertCircle, Compass, ShieldCheck, Sparkles } from "lucide-react";

const CONSTELLATIONS = [
  "牡羊座 (Aries)", "金牛座 (Taurus)", "雙子座 (Gemini)", "巨蟹座 (Cancer)",
  "獅子座 (Leo)", "處女座 (Virgo)", "天秤座 (Libra)", "天蠍座 (Scorpio)",
  "射手座 (Sagittarius)", "摩羯座 (Capricorn)", "水瓶座 (Aquarius)", "雙魚座 (Pisces)"
];

const SIX_STARS = [
  "水星人 (Mercury Star)", "金星人 (Venus Star)", "火星人 (Mars Star)",
  "木星人 (Jupiter Star)", "土星人 (Saturn Star)", "天王星人 (Uranus Star)"
];

interface ProfileViewProps {
  userProfile: UserProfile;
  setUserProfile: (profile: UserProfile) => void;
  gardenPoints: number;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  userProfile,
  setUserProfile,
  gardenPoints,
}) => {
  const [userName, setUserName] = useState(userProfile.userName || "春之漫步者");
  const [birthDate, setBirthDate] = useState(userProfile.birthDate || "1998-05-20");
  const [birthTime, setBirthTime] = useState(userProfile.birthTime || "");
  const [gender, setGender] = useState(userProfile.gender || "未設定");
  const [constellation, setConstellation] = useState(userProfile.constellation || CONSTELLATIONS[0]);
  const [sixStarsNode, setSixStarsNode] = useState(userProfile.sixStarsNode || SIX_STARS[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [bloomingStep, setBloomingStep] = useState<"form" | "blooming" | "result">("form");

  const [birthdayFlowerResult, setBirthdayFlowerResult] = useState<BirthdayFlower | null>(userProfile.birthdayFlower || null);
  
  const [personalityReport, setPersonalityReport] = useState<any>(null);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);

  const handleGeneratePersonalityReport = async () => {
    setIsGeneratingReport(true);
    try {
      const res = await fetch("/api/generate-personality-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          birthDate: userProfile.birthDate || birthDate,
          birthTime: userProfile.birthTime || birthTime,
          birthFlower: birthdayFlowerResult?.flowerName || "",
          userName: userProfile.userName || userName
        })
      });
      if (res.ok) {
        const data = await res.json();
        setPersonalityReport(data);
      }
    } catch (err) {
      console.error("Failed to generate personality report:", err);
    } finally {
      setIsGeneratingReport(false);
    }
  };

  const handleSubmitProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim()) return;

    setIsLoading(true);
    setBloomingStep("blooming");

    try {
      // Call full stack endpoint to fetch personalized birthday flower
      const response = await fetch("/api/generate-birthday-flower", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          birthDate,
          birthTime,
          gender,
          userName
        })
      });
      const data = await response.json();

      const flowerData: BirthdayFlower = {
        flowerName: data.flowerName || "白鬱金香 (White Tulip)",
        flowerLanguage: data.flowerLanguage || "睿智的留白、自然的高貴",
        personalityDescription: data.personalityDescription || "你天生擁有靜謐高潔的核心靈魂。崇尚簡約與優雅，善於在平凡瑣碎的生活裡精細修剪出一塊純粹的世外淨土。",
        advantages: data.advantages || ["觀察力極強且有深度", "極高品味，拒絕庸俗", "內心獨立強大"],
        growthAdvice: data.growthAdvice || "對於完美的極端苛求有時會演化為下意識匆忙吞嚥、甚至胃部緊縮的情緒食物壓力。今天，一茶一飯，請對胃部說句慢下來，一切都來得及。",
        soulLesson: data.soulLesson || "原諒所有的不完美，讓世界以它原本的缺陷美在你指旁默默流走。"
      };

      setBirthdayFlowerResult(flowerData);
      
      // Delay progress to make the blooming animation feel grand and ceremonial
      setTimeout(() => {
        setBloomingStep("result");
        setUserProfile({
          userName,
          birthDate,
          birthTime,
          gender,
          constellation,
          sixStarsNode,
          hasRegistered: true,
          birthdayFlower: flowerData
        });
        setIsLoading(false);
      }, 3200);

    } catch (err) {
      console.error(err);
      setIsLoading(false);
      setBloomingStep("form");
    }
  };

  const handleResetProfile = () => {
    setBloomingStep("form");
    setBirthdayFlowerResult(null);
    setUserProfile({
      userName: "",
      birthDate: "",
      birthTime: "",
      gender: "",
      constellation: undefined,
      sixStarsNode: undefined,
      hasRegistered: false,
      birthdayFlower: undefined
    });
  };

  return (
    <div className="w-full h-full overflow-y-auto px-5 pt-4 pb-20 bg-white text-gray-800">
      
      {/* Title block */}
      <div className="flex flex-col items-center mb-6 text-center">
        <h2 className="font-serif text-lg font-bold text-gray-900 flex items-center gap-1.5 justify-center">
          {userProfile.hasRegistered ? (
            <span>會員專屬中心</span>
          ) : (
            <span className="flex items-center gap-1 whitespace-nowrap">
              <span>初識</span>
              <span className="font-bernoru font-black tracking-tighter text-gray-800 align-middle">b’loo</span>
              <span>旅程</span>
            </span>
          )}
        </h2>
        <p className="text-[10px] text-gray-400 font-mono tracking-wider uppercase">
          {userProfile.hasRegistered ? "My Profile Hub" : "BIRTH FLOWER ONBOARDING"}
        </p>
        <div className="w-4 h-[1px] bg-gray-200 mt-2" />
      </div>

      {bloomingStep === "form" && !userProfile.hasRegistered && (
        /* First Time Onboarding Intake Form */
        <div className="animate-fade-in duration-300">
          <p className="text-xs text-gray-500 mb-6 text-center leading-relaxed font-serif">
            歡迎你。請在此寫下你的宇宙刻度節點。<br />
            <span className="font-bernoru font-black tracking-tighter text-gray-800 mx-0.5">b'loo</span> 將為你喚醒沉睡在大地深處、與你靈魂共鳴的「生日本命花」。
          </p>

          <form onSubmit={handleSubmitProfile} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-[11px] text-gray-400 mb-1 font-serif">如何稱呼你？ (Your Name)</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="輸入您的暱稱"
                  className="w-full bg-cream/40 rounded-xl py-2 px-3.5 pl-9 text-xs text-gray-700 border border-gray-100 focus:outline-none focus:ring-1 focus:ring-[#a3c9e8]"
                />
                <User className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              </div>
            </div>

            {/* Birth date */}
            <div>
              <label className="block text-[11px] text-gray-400 mb-1 font-serif">出生日期 (Birth Date)</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  placeholder="請手動輸入，例如：1998/05/20 或 5月20日"
                  className="w-full bg-cream/40 rounded-xl py-2 px-3.5 pl-9 text-xs text-gray-700 border border-gray-100 focus:outline-none focus:ring-1 focus:ring-[#a3c9e8]"
                />
                <Calendar className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              </div>
            </div>

             {/* Birth Time */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] text-gray-400 mb-1 font-serif">出生時辰 (Time - 選填)</label>
                <div className="relative">
                  <input
                    type="text"
                    value={birthTime}
                    onChange={(e) => setBirthTime(e.target.value)}
                    placeholder="例如：辰時 / 08:32"
                    className="w-full bg-cream/40 rounded-xl py-2 px-3.5 pl-9 text-xs text-gray-700 border border-gray-100 focus:outline-none"
                  />
                  <Clock className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-gray-400 mb-1 font-serif">性別 (Gender - 選填)</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full bg-cream/40 rounded-xl py-2 px-2.5 text-xs text-gray-700 border border-gray-100 focus:outline-none"
                >
                  <option value="未設定">保留隱私</option>
                  <option value="女性">優雅少女 · 女</option>
                  <option value="男性">安靜少年 · 男</option>
                  <option value="非二元">酷系文青 · 酷</option>
                </select>
              </div>
            </div>

            {/* Astrology custom parameter fields for ritual feel - moved to profile setup */}
            <div className="w-full bg-[#faf7f2]/70 rounded-3xl p-5 border border-gray-100/85 my-4 space-y-4">
              <div className="flex items-center gap-1.5 mb-1">
                <Sparkles className="w-3.5 h-3.5 text-[#5d8cb3]" />
                <span className="text-xs font-serif font-semibold text-gray-700">宿命星盤核對</span>
              </div>

              {/* Constellation Selector */}
              <div>
                <label className="block text-[11px] text-gray-400 mb-1 font-serif">你的出生星座 (Constellation)</label>
                <select
                  value={constellation}
                  onChange={(e) => setConstellation(e.target.value)}
                  className="w-full bg-white rounded-xl py-2 px-3 text-xs border border-gray-100 text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#a3c9e8]"
                >
                  {CONSTELLATIONS.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* Six Stars Selector */}
              <div>
                <label className="block text-[11px] text-gray-400 mb-1 font-serif">六星占術主局 (Six Stars Node)</label>
                <select
                  value={sixStarsNode}
                  onChange={(e) => setSixStarsNode(e.target.value)}
                  className="w-full bg-white rounded-xl py-2 px-3 text-xs border border-gray-100 text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#a3c9e8]"
                >
                  {SIX_STARS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#a3c9e8] text-white py-3.5 rounded-2xl text-xs font-medium font-serif shadow-md hover:bg-[#8ebcdb] transition-all flex items-center justify-center gap-1.5 mt-6 active:scale-[0.98]"
            >
              <span>喚醒內在本命花 · Awaken my Birth Flower</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <p className="text-[10px] text-gray-300 text-center mt-6">
            🔒 我們珍視隱私，您的物理出生天體參數將百分百鎖在本地，不用於任何第三方追蹤。
          </p>
        </div>
      )}

      {bloomingStep === "blooming" && (
        /* Grand ceremonial blooming animations */
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="relative w-36 h-36 mb-8 flex items-center justify-center">
            {/* Pulsing circular expand overlays */}
            <div className="absolute inset-0 rounded-full bg-[#a3c9e8]/10 animate-ping" />
            <div className="absolute inset-4 rounded-full bg-[#a3c9e8]/20 animate-pulse duration-1000" />
            
            {/* Spinning seed node */}
            <div className="absolute inset-8 rounded-full border-2 border-dashed border-[#5d8cb3]/30 animate-spin" style={{ animationDuration: "12s" }} />
            
            <Heart className="w-8 h-8 text-[#a3c9e8] fill-[#a3c9e8]/30 animate-pulse" />
          </div>

          <h3 className="font-serif text-sm font-semibold text-gray-700 animate-pulse tracking-wide">
            正在喚醒宿命深處的泥土種子...
          </h3>
          <p className="text-[10px] text-gray-400 mt-2 font-mono">
            微張手臂，深深呼吸。花朵即將盛開。
          </p>
        </div>
      )}

      {(bloomingStep === "result" || userProfile.hasRegistered) && birthdayFlowerResult && (
        /* Fully registered custom profile cards and statistics */
        <div className="animate-fade-in duration-500 space-y-6">
          
          {/* Main Onboarding Result Reveal banner */}
          <div className="bg-cream/35 border border-[#a3c9e8]/30 rounded-3xl p-5 text-center flex flex-col items-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-radial from-[#a3c9e8]/20 to-transparent pointer-events-none" />
            
            <FlowerRenderer name={birthdayFlowerResult.flowerName} size={150} glowing={true} />

            <span className="text-[9px] uppercase font-mono tracking-widest text-gray-400 mt-4 bg-white/80 px-2.5 py-0.5 rounded-full border border-gray-50 font-bold">
              你的生日本命花 · Birth Flower
            </span>

            <h3 className="font-serif text-xl font-bold text-gray-900 mt-2">
              {birthdayFlowerResult.flowerName}
            </h3>

            <p className="font-serif italic text-xs text-[#5d8cb3] mt-2.5 max-w-[280px]">
              「 {birthdayFlowerResult.flowerLanguage} 」
            </p>
          </div>

          {/* Core Soul Personality analysis blocks */}
          <div className="bg-white rounded-2xl border border-gray-100 p-4 space-y-4">
            <div>
              <p className="text-[11px] font-semibold text-gray-400 uppercase font-mono tracking-widest">個性特質 · Soul Portrait</p>
              <p className="text-xs text-gray-600 leading-relaxed font-serif mt-1.5">
                {birthdayFlowerResult.personalityDescription}
              </p>
            </div>

            {/* Strengths lists */}
            <div>
              <p className="text-[11px] font-semibold text-gray-400 uppercase font-mono tracking-widest">優勢特質 · Your Strengths</p>
              <div className="mt-2 space-y-1.5">
                {birthdayFlowerResult.advantages.map((adv, idx) => (
                  <div key={idx} className="flex gap-2 items-center text-xs text-gray-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#a3c9e8]" />
                    <span>{adv}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Reassuring growth and self-eating habit tips */}
            <div>
              <p className="text-[11px] font-semibold text-gray-400 uppercase font-mono tracking-widest">飲食與修身建議 · Mindfulness Guidance</p>
              <p className="text-xs text-gray-600 leading-relaxed mt-1.5 pl-3 border-l-2 border-[#a3c9e8]/30">
                {birthdayFlowerResult.growthAdvice}
              </p>
            </div>

            {/* Philosophic soul task */}
            <div className="bg-[#faf7f2] rounded-xl p-3.5 border border-dashed border-gray-100">
              <p className="text-[10px] font-bold text-gray-400 font-mono tracking-wider uppercase">適合的人生課題 · Life Lesson</p>
              <p className="text-xs text-[#5d8cb3] italic font-serif leading-relaxed mt-1">
                💬 「 {birthdayFlowerResult.soulLesson} 」
              </p>
            </div>
          </div>

          {/* AI 花語人格報告 (Premium Analysis Card) */}
          <div className="bg-[#fdfbf7] rounded-3xl border border-amber-200/50 p-5 shadow-3xs space-y-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-radial from-amber-100/10 to-transparent pointer-events-none" />
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500 fill-amber-100" />
              <h4 className="font-serif text-sm font-semibold text-gray-900">🌸 專屬 AI 花語宿命人格報告</h4>
            </div>

            {!personalityReport ? (
              <div className="text-center py-2">
                <p className="text-xs text-gray-500 leading-relaxed font-serif text-justify">
                  結合維多利亞花語、日本花言葉與心理學投射，為您深度解析您的情緒關係原型、工作美學、隱秘壓力模式與慢灌能量補給方略。
                </p>
                <button
                  type="button"
                  disabled={isGeneratingReport}
                  onClick={handleGeneratePersonalityReport}
                  className="mt-4 bg-gray-900 text-white rounded-2xl py-2.5 px-6 text-xs font-serif font-semibold hover:bg-gray-800 disabled:bg-gray-100 disabled:text-gray-400 transition-all flex items-center justify-center gap-2 mx-auto shadow-sm"
                >
                  {isGeneratingReport ? (
                    <>
                      <div className="w-3 h-3 border-2 border-gray-400 border-t-white rounded-full animate-spin" />
                      <span>正在深度演算本質特質...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>生成「宿命花語人格報告」</span>
                    </>
                  )}
                </button>
              </div>
            ) : (
              <div className="space-y-4 font-serif text-left border-t border-amber-100/40 pt-4">
                <div className="bg-amber-50/50 rounded-2xl p-4 border border-amber-100/20">
                  <p className="text-[10px] font-mono font-bold tracking-widest text-amber-600 uppercase mb-0.5">植物神聖原型 · Archetype</p>
                  <p className="text-sm font-bold text-gray-900">{personalityReport.personalityType}</p>
                </div>

                <div className="space-y-3.5 divide-y divide-gray-100/70 text-xs text-gray-700">
                  <div className="pt-0">
                    <p className="text-[10px] text-gray-400 font-bold mb-1 uppercase tracking-wider">💖 愛情與自我關係特質</p>
                    <p className="text-gray-600 leading-relaxed text-justify">{personalityReport.loveTrait}</p>
                  </div>
                  <div className="pt-3">
                    <p className="text-[10px] text-gray-400 font-bold mb-1 uppercase tracking-wider">💼 日常工作與學習能量</p>
                    <p className="text-gray-600 leading-relaxed text-justify">{personalityReport.workStyle}</p>
                  </div>
                  <div className="pt-3">
                    <p className="text-[10px] text-gray-400 font-bold mb-1 uppercase tracking-wider">⚠️ 隱秘壓力與過快進食模式</p>
                    <p className="text-gray-600 leading-relaxed text-justify">{personalityReport.stressPattern}</p>
                  </div>
                  <div className="pt-3">
                    <p className="text-[10px] text-gray-400 font-bold mb-1 uppercase tracking-wider">🔋 專屬能量慢活補給方略</p>
                    <p className="text-gray-600 leading-relaxed text-justify">{personalityReport.rechargeMethod}</p>
                  </div>
                </div>

                <div className="bg-[#fcf8f2] border border-amber-200/40 rounded-2xl p-3.5 mt-2">
                  <p className="text-[10px] text-amber-600 font-bold mb-1 uppercase">✦ 療癒師宿命花語寄語</p>
                  <p className="text-xs text-amber-800 leading-relaxed text-justify italic font-medium">{personalityReport.flowerAdvice}</p>
                </div>
              </div>
            )}
          </div>

          {/* Profile User stats scoreboard card */}
          <div className="bg-cream/30 rounded-2xl p-4 border border-gray-100 grid grid-cols-2 gap-4">
            <div>
              <p className="text-[10px] text-gray-400 font-serif">尊貴宿命暱稱：</p>
              <p className="text-xs text-gray-800 font-bold mt-1">{userProfile.userName}</p>
            </div>
            <div>
              <p className="text-[10px] text-gray-400 font-serif">宇宙出生時間：</p>
              <p className="text-xs text-gray-800 font-mono mt-1">{userProfile.birthDate} {userProfile.birthTime ? `(${userProfile.birthTime})` : ""}</p>
            </div>
            <div>
              <p className="text-[10px] text-gray-400 font-serif">宿命出生星座：</p>
              <p className="text-xs text-gray-800 font-bold mt-1">{userProfile.constellation || "未設定"}</p>
            </div>
            <div>
              <p className="text-[10px] text-gray-400 font-serif">六星占術主局：</p>
              <p className="text-xs text-gray-800 font-bold mt-1">{userProfile.sixStarsNode || "未設定"}</p>
            </div>
            <div>
              <p className="text-[10px] text-gray-400 font-serif">累積灌溉成長能量：</p>
              <p className="text-xs text-[#5d8cb3] font-bold mt-1">{gardenPoints} 點數</p>
            </div>
            <div>
              <p className="text-[10px] text-gray-400 font-serif">靈魂安全保證：</p>
              <p className="text-[10px] text-emerald-800 font-bold flex items-center gap-1 mt-1">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                本地加密盾
              </p>
            </div>
          </div>

          {/* Reset profile control */}
          <button
            onClick={handleResetProfile}
            className="w-full border border-rose-100 bg-rose-50/25 text-rose-700 py-3 rounded-2xl text-[11px] font-serif hover:bg-rose-50 transition-all flex items-center justify-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            重置生日與本命花 (Reset Profile Workflow)
          </button>
        </div>
      )}
    </div>
  );
};
