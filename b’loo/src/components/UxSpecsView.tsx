import React, { useState } from "react";
import { 
  GitFork, Network, Palette, Layout, Database, Sparkles, DollarSign,
  Heart, BarChart3, RefreshCw, Layers, Shield, Calendar, Activity, 
  Compass, Apple, FileText, CheckCircle, Smartphone, Flame, BadgeAlert
} from "lucide-react";

export const UxSpecsView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"architecture" | "schema" | "ai" | "saas">("architecture");

  return (
    <div className="w-full min-h-[600px] bg-white rounded-3xl border border-[#a3c9e8]/30 shadow-md p-6 sm:p-8 text-gray-800">
      
      {/* Editorial Header */}
      <div className="border-b border-[#a3c9e8]/30 pb-6 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-[10px] bg-[#a3c9e8]/20 text-[#5d8cb3] px-3 py-1 rounded-full font-mono font-bold uppercase tracking-wider">
            b’loo 2.0 Product specifications · 系統設計書
          </span>
          <h1 className="text-2xl font-bold mt-2 flex items-center gap-1.5 font-serif">
            <span className="font-bernoru font-black text-2xl tracking-tighter text-gray-800">b’loo 飲食覺察日記</span>
            <span>2.0 核心架構與功能升級規畫</span>
          </h1>
          <p className="text-xs text-gray-500 mt-1 font-serif text-justify max-w-2xl leading-relaxed">
            融合花卉學、女性健康、正念心理學與 AI 多維度關聯分析。拒絕身材焦慮與「卡路里審查」，重新建立大腦、荷爾蒙、心靈與食物的溫柔盟約。
          </p>
        </div>
        
        {/* Spec Tabs switcher */}
        <div className="flex bg-[#fbfbf9] rounded-xl p-1 border border-gray-100 flex-wrap shrink-0">
          {[
            { id: "architecture", icon: Network, label: "2.0 系統 Sitemap & 流程" },
            { id: "schema", icon: Database, label: "2.0 資料庫 Schema" },
            { id: "ai", icon: Sparkles, label: "2.0 AI 分析引擎模型" },
            { id: "saas", icon: DollarSign, label: "MVP 與 商業化訂閱方案" }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-1 py-2 px-3.5 text-xs font-semibold font-serif rounded-lg transition-all ${
                activeTab === tab.id
                  ? "bg-[#a3c9e8] text-white shadow-xs"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              <tab.icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Deliverable Content view */}
      <div className="min-h-[480px]">
        
        {/* Architecture & Sitemap */}
        {activeTab === "architecture" && (
          <div className="space-y-8 animate-fade-in">
            {/* Concept banner */}
            <div className="bg-[#faf7f2] rounded-2xl p-4 border border-gray-100/80">
              <h3 className="font-serif text-sm font-bold text-[#5d8cb3] mb-1 flex items-center gap-1.5">
                <Network className="w-4 h-4" />
                <span>1. b'loo 2.0 頁面架構 (Sitemap) 與 核心功能拓撲</span>
              </h3>
              <p className="text-xs text-gray-500 font-serif leading-relaxed">
                維持「韓系高雅、去焦慮化、卡片式格柵」之極簡底導 5 大核心視圖，無痛延伸體徵、運動與經期健康子模組。
              </p>
            </div>

            {/* Sitemap grid display */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-3xs space-y-3">
                <div className="bg-[#a3c9e8]/20 p-2 rounded-xl text-center font-serif text-xs font-black text-gray-800 flex items-center justify-center gap-1">
                  <Compass className="w-3.5 h-3.5" /> 一、首頁 (Home)
                </div>
                <div className="text-[10px] text-gray-500 leading-relaxed font-serif space-y-1 pl-1">
                  <p className="font-bold text-gray-700">● 2.0 能量微調區</p>
                  <p className="pl-2">└ 平靜 / 活力拉桿</p>
                  <p className="pl-2">└ 情緒陪伴之花</p>
                  <p className="font-bold text-gray-700 mt-1">● 每日正念卡</p>
                  <p className="pl-2">└ 覺察提醒輪播</p>
                </div>
              </div>

              <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-3xs space-y-3">
                <div className="bg-amber-100/35 p-2 rounded-xl text-center font-serif text-xs font-black text-gray-800 flex items-center justify-center gap-1">
                  <Apple className="w-3.5 h-3.5" /> 二、飲食覺察 (Diary)
                </div>
                <div className="text-[10px] text-gray-500 leading-relaxed font-serif space-y-1 pl-1">
                  <p className="font-bold text-gray-700">● 1.0 飲食反思</p>
                  <p className="pl-2">└ 餐照 / 餐前情緒</p>
                  <p className="pl-2">└ 進食動機 / 速度物性</p>
                  <p className="font-bold text-gray-700 mt-1">● 2.0 身體狀態 🆕</p>
                  <p className="pl-2">└ 體重/體脂 (去焦慮)</p>
                  <p className="pl-2">└ 精神狀態/睡眠</p>
                </div>
              </div>

              <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-3xs space-y-3">
                <div className="bg-pink-100/35 p-2 rounded-xl text-center font-serif text-xs font-black text-gray-800 flex items-center justify-center gap-1">
                  <Activity className="w-3.5 h-3.5" /> 三、身體律動 🆕
                </div>
                <div className="text-[10px] text-gray-500 leading-relaxed font-serif space-y-1 pl-1">
                  <p className="font-bold text-gray-700">● 2.0 運動紀錄模組</p>
                  <p className="pl-2">└ 8 種運動範疇/時間</p>
                  <p className="pl-2">└ 運動強度與體感</p>
                  <p className="font-bold text-gray-700 mt-1">● 2.0 週期守護</p>
                  <p className="pl-2">└ 月經起止 /PMS症狀</p>
                  <p className="pl-2">└ 排卵生理激素預測</p>
                </div>
              </div>

              <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-3xs space-y-3">
                <div className="bg-emerald-100/35 p-2 rounded-xl text-center font-serif text-xs font-black text-gray-800 flex items-center justify-center gap-1">
                  <Layers className="w-3.5 h-3.5" /> 四、AI 洞察儀 🆕
                </div>
                <div className="text-[10px] text-gray-500 leading-relaxed font-serif space-y-1 pl-1">
                  <p className="font-bold text-gray-700">● 跨維度AI分析</p>
                  <p className="pl-2">└ 晚餐外食 vs 體脂</p>
                  <p className="pl-2">└ 情緒 vs 甜食宵夜</p>
                  <p className="pl-2">└ 荷爾蒙 vs 飢餓波動</p>
                  <p className="font-bold text-gray-700 mt-1">● 運勢名片</p>
                  <p className="pl-2">└ 密碼對齊 / 星象</p>
                </div>
              </div>

              <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-3xs space-y-3">
                <div className="bg-indigo-100/35 p-2 rounded-xl text-center font-serif text-xs font-black text-gray-800 flex items-center justify-center gap-1">
                  <Smartphone className="w-3.5 h-3.5" /> 五、會員中心
                </div>
                <div className="text-[10px] text-gray-500 leading-relaxed font-serif space-y-1 pl-1">
                  <p className="font-bold text-gray-700">● 療癒檔案</p>
                  <p className="pl-2">└ 占星星座/六星主局</p>
                  <p className="font-bold text-gray-700 mt-1">● 植物花園 (Garden)</p>
                  <p className="pl-2">└ 幸運花搖曳基座</p>
                  <p className="pl-2">└ 分數澆灌演化紀錄</p>
                </div>
              </div>
            </div>

            {/* User Flow (使用者流程) */}
            <div className="bg-[#faf7f2] rounded-2xl p-4 border border-gray-100/80 mt-6">
              <h3 className="font-serif text-sm font-bold text-[#5d8cb3] mb-1 flex items-center gap-1.5">
                <GitFork className="w-4 h-4" />
                <span>2. 2.0 使用者體驗流程 (User Flow) 與 跨域自愛回路</span>
              </h3>
              <p className="text-xs text-gray-500 font-serif leading-relaxed">
                描述一個人在經前焦慮、暴食情緒來臨時，如何透過 2.0 的溫和設計，避免自我譴責、完成自愛行為的流程回路。
              </p>
            </div>

            <div className="bg-white border border-gray-200/60 rounded-3xl p-6 relative overflow-hidden">
              <div className="flex flex-col md:flex-row items-stretch justify-between gap-4">
                <div className="flex-1 bg-gray-50/50 rounded-2xl p-4 border border-gray-100 flex flex-col justify-between">
                  <div>
                    <span className="text-[9px] font-mono text-[#a3c9e8] font-bold">STAGE 01. 阻斷焦慮</span>
                    <h4 className="text-xs font-serif font-bold text-gray-800 mt-1">自主覺察 ＆ 體徵登錄</h4>
                    <p className="text-[10px] text-gray-400 mt-1.5 leading-relaxed font-serif">
                      使用者在經前 5 天感覺沮喪且強烈渴望起司蛋糕。她打開 b’loo，極簡滑動登入 PMS 症狀「暴食、情绪低落」及睡眠精神。沒有卡路里警報
                    </p>
                  </div>
                  <div className="text-[10px] bg-white border border-gray-100 p-2 rounded-xl text-gray-500 italic mt-3 font-serif">
                    💡 「我此時是真餓，還是黃體期荷爾蒙在說話？」
                  </div>
                </div>

                <div className="flex items-center justify-center text-gray-300 hidden md:flex font-mono">────►</div>

                <div className="flex-1 bg-gray-50/50 rounded-2xl p-4 border border-gray-100 flex flex-col justify-between">
                  <div>
                    <span className="text-[9px] font-mono text-pink-400 font-bold">STAGE 02. 進食正念</span>
                    <h4 className="text-xs font-serif font-bold text-gray-800 mt-1">手動寫意 ＆ 溫暖陪伴</h4>
                    <p className="text-[10px] text-gray-400 mt-1.5 leading-relaxed font-serif">
                      使用者快樂地享用起司蛋糕，並隨手拖拽餐照，選擇餐前情緒為「焦慮 ⚡」，進食速度選「細嚼慢嚥」。AI 花語療癒師主動送上溫暖回饋，非身材警告。
                    </p>
                  </div>
                  <div className="text-[10px] bg-white border border-gray-100 p-2 rounded-xl text-gray-500 italic mt-3 font-serif">
                    🌸 「蛋糕是土地結出的甜美，你細心咀嚼，它就是溫柔的擁抱。」
                  </div>
                </div>

                <div className="flex items-center justify-center text-gray-300 hidden md:flex font-mono">────►</div>

                <div className="flex-1 bg-gray-50/50 rounded-2xl p-4 border border-gray-100 flex flex-col justify-between">
                  <div>
                    <span className="text-[9px] font-mono text-emerald-500 font-bold">STAGE 03. 智慧關聯</span>
                    <h4 className="text-xs font-serif font-bold text-gray-800 mt-1">一鍵解鎖 AI 關聯洞察</h4>
                    <p className="text-[10px] text-gray-400 mt-1.5 leading-relaxed font-serif">
                      AI 跨維度比對她過去的經期和進食資料，點出「月經前 5 天甜食習慣佔 85%，但睡眠足夠能降低 30% 暴食機率」，讓她明白這並非「自不自律」，而是自然的生理和心理韻律。
                    </p>
                  </div>
                  <div className="text-[10px] bg-white border border-gray-100 p-2 rounded-xl text-gray-500 italic mt-3 font-serif">
                    🌿 「這不是缺乏自律，而是身體此時需要溫暖碳水。」
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Database Schema */}
        {activeTab === "schema" && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-[#faf7f2] rounded-2xl p-4 border border-gray-100/80">
              <h3 className="font-serif text-sm font-bold text-[#5d8cb3] mb-1 flex items-center gap-1.5">
                <Database className="w-4 h-4" />
                <span>2.0 關聯式資料庫 Schema 設計 (SQL / Drizzle TypeScript ORM)</span>
              </h3>
              <p className="text-xs text-gray-500 font-serif leading-relaxed">
                全盤對齊 2.0 身體指標、運動軌跡與女性生理期三大擴充模組。建構高擴充、資料去識別化的安全儲存方案。
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Physical logs schema Table */}
              <div className="bg-white border border-gray-200/60 rounded-2xl p-5 space-y-3 font-mono text-[10px] shadow-3xs">
                <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                  <span className="text-gray-800 font-bold font-serif text-xs">📊 TABLE: physical_records</span>
                  <span className="bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded text-[9px] font-bold">Somatic</span>
                </div>
                <div className="space-y-1.5 text-gray-600">
                  <div className="flex justify-between"><span className="text-[#a3c9e8] font-bold">id</span> <span>uuid (PRIMARY KEY)</span></div>
                  <div className="flex justify-between"><span className="text-gray-850">user_id</span> <span>uuid (FOREIGN KEY)</span></div>
                  <div className="flex justify-between"><span className="text-orange-500">weight_kg</span> <span>numeric(4,1)</span></div>
                  <div className="flex justify-between"><span className="text-orange-500">body_fat_pct</span> <span>numeric(3,1)</span></div>
                  <div className="flex justify-between"><span className="text-orange-500">skeletal_muscle_pct</span> <span>numeric(3,1)</span></div>
                  <div className="flex justify-between"><span>waist_cm</span> <span>numeric(3,1) (NULLABLE)</span></div>
                  <div className="flex justify-between"><span>hip_cm</span> <span>numeric(3,1) (NULLABLE)</span></div>
                  <div className="flex justify-between"><span>sleep_hours</span> <span>numeric(3,1)</span></div>
                  <div className="flex justify-between"><span className="text-indigo-500">mental_state</span> <span>varchar(30)</span></div>
                  <div className="flex justify-between"><span className="text-gray-400">recorded_at</span> <span>date (DEFAULT current_date)</span></div>
                </div>
                <div className="bg-orange-50/50 p-2.5 rounded-xl text-gray-500 leading-normal text-[9.5px] font-serif">
                  📌 <strong>去焦慮設計：</strong>體重和體脂在前端介面可以被「模糊成能量圓柱」，使用者隨時可在設定中「隱藏精確數字」，著重在趨勢起伏而非絕對斤兩。
                </div>
              </div>

              {/* Exercise logs schema Table */}
              <div className="bg-white border border-gray-200/60 rounded-2xl p-5 space-y-3 font-mono text-[10px] shadow-3xs">
                <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                  <span className="text-gray-800 font-bold font-serif text-xs">🏃‍♂️ TABLE: exercise_logs</span>
                  <span className="bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded text-[9px] font-bold">Fitness</span>
                </div>
                <div className="space-y-1.5 text-gray-600 border-none">
                  <div className="flex justify-between"><span className="text-[#a3c9e8] font-bold">id</span> <span>uuid (PRIMARY KEY)</span></div>
                  <div className="flex justify-between"><span className="text-gray-850">user_id</span> <span>uuid (FOREIGN KEY)</span></div>
                  <div className="flex justify-between"><span className="text-emerald-600">exercise_type</span> <span>varchar(40)</span></div>
                  <div className="flex justify-between"><span>duration_minutes</span> <span>integer</span></div>
                  <div className="flex justify-between"><span className="text-emerald-600">intensity</span> <span>varchar(20) (輕鬆/中等/高)</span></div>
                  <div className="flex justify-between"><span>target_groups</span> <span>text[] (e.g. 臀腿/胸/核心)</span></div>
                  <div className="flex justify-between"><span>feeling_post_workout</span> <span>text (自由紀錄體感)</span></div>
                  <div className="flex justify-between"><span className="text-gray-400">recorded_at</span> <span>timestamp</span></div>
                </div>
                <div className="bg-emerald-50/50 p-2.5 rounded-xl text-gray-500 leading-normal text-[9.5px] font-serif">
                  📌 <strong>能量轉換機制：</strong>運動不僅是消耗，每次運動將對應注入「能量滋養露水」回到花園植物中，激勵正面身心連接。
                </div>
              </div>

              {/* Menstrual logs Table */}
              <div className="bg-white border border-gray-200/60 rounded-2xl p-5 space-y-3 font-mono text-[10px] shadow-3xs">
                <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                  <span className="text-gray-800 font-bold font-serif text-xs">🌙 TABLE: menstrual_cycles</span>
                  <span className="bg-pink-50 text-pink-700 px-1.5 py-0.5 rounded text-[9px] font-bold">Menstrual</span>
                </div>
                <div className="space-y-1.5 text-gray-600">
                  <div className="flex justify-between"><span className="text-[#a3c9e8] font-bold">id</span> <span>uuid (PRIMARY KEY)</span></div>
                  <div className="flex justify-between"><span className="text-gray-850">user_id</span> <span>uuid (FOREIGN KEY)</span></div>
                  <div className="flex justify-between"><span className="text-pink-600 font-bold">period_start</span> <span>date</span></div>
                  <div className="flex justify-between"><span>period_end</span> <span>date (NULLABLE)</span></div>
                  <div className="flex justify-between"><span className="text-pink-500">ovulation_date</span> <span>date (AI 預測預留)</span></div>
                  <div className="flex justify-between"><span className="text-rose-500">pms_symptoms</span> <span>text[] (水腫/暴食/低落/頭痛)</span></div>
                  <div className="flex justify-between"><span>flow_intensity</span> <span>varchar(20) (輕/中/重)</span></div>
                  <div className="flex justify-between"><span className="text-gray-400">updated_at</span> <span>timestamp</span></div>
                </div>
                <div className="bg-pink-50/50 p-2.5 rounded-xl text-gray-500 leading-normal text-[9.5px] font-serif">
                  📌 <strong>荷爾蒙同步功能：</strong>AI 模組會讀取本表，主動提示「黃體期」和「濾泡期」對基礎代謝率、食慾和血清素的自然影響，瓦解自責偏見。
                </div>
              </div>

            </div>
          </div>
        )}

        {/* AI Analysis Logic & Dashboard */}
        {activeTab === "ai" && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-[#faf7f2] rounded-2xl p-4 border border-gray-100/80">
              <h3 className="font-serif text-sm font-bold text-[#5d8cb3] mb-1 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500 fill-amber-100" />
                <span>2.0 AI 多維度關聯分析引擎 (Correlative AI Intelligence Model)</span>
              </h3>
              <p className="text-xs text-gray-500 font-serif leading-relaxed">
                擺脫傳統減肥軟體單調的「熱量加減法」，我們使用多維度相關性矩陣 (Pearson Correlation & Gemini 3.5 Text Embedding Grouping) 設計了以下 6 大關聯邏輯。
              </p>
            </div>

            {/* Correlative logic cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="bg-white border border-gray-100 rounded-2xl p-4 space-y-2.5 shadow-3xs">
                <div className="flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-violet-100 text-violet-700 flex items-center justify-center font-mono text-[10px] font-bold">1</span>
                  <h4 className="text-xs font-serif font-black text-gray-800">飲食習慣 × 體脂趨勢分析</h4>
                </div>
                <p className="text-[11px] text-gray-500 leading-relaxed font-serif">
                  <strong>分析算法：</strong> 晚餐外食（高鈉、高加工食品）標籤頻率與 3 天內的「暫時性體重、體脂波動」做相關度比對。
                  <span className="text-gray-700 block mt-1"><strong>AI 洞察反饋：</strong> 「過去 14 天外食比例提升 40%，體重微幅上升 1.2kg，但請不用焦慮！這大機率是外食高鈉引起的水分滯留（水腫），並非脂肪增加。建議補充富含鉀離子的香蕉或香草茶。」</span>
                </p>
              </div>

              <div className="bg-white border border-gray-100 rounded-2xl p-4 space-y-2.5 shadow-3xs">
                <div className="flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center font-mono text-[10px] font-bold">2</span>
                  <h4 className="text-xs font-serif font-black text-gray-800">心理情緒狀態 × 飲食行為模式 (情緒進食)</h4>
                </div>
                <p className="text-[11px] text-gray-500 leading-relaxed font-serif">
                  <strong>分析算法：</strong> 餐前焦慮分數 (Anxiety Core Rating 1-10) 與「精緻甜食、宵夜」進食標籤交叉對比。
                  <span className="text-gray-700 block mt-1"><strong>AI 洞察反饋：</strong> 「當您焦慮感大於 7 分時，精緻甜食頻率顯著上升 45%。大腦此時只是在透過咬合與高糖分尋找安全感。這不是不自律，而是身體在向您尋求抱抱，建議換成 15 分鐘的無意識塗鴉來替代。」</span>
                </p>
              </div>

              <div className="bg-white border border-gray-100 rounded-2xl p-4 space-y-2.5 shadow-3xs">
                <div className="flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-mono text-[10px] font-bold">3</span>
                  <h4 className="text-xs font-serif font-black text-gray-800">運動強度 × Somatic 組成正向回報</h4>
                </div>
                <p className="text-[11px] text-gray-500 leading-relaxed font-serif">
                  <strong>分析算法：</strong> 重訓、皮拉提斯之頻率和「骨骼肌率」及精神狀態評估。
                  <span className="text-gray-700 block mt-1"><strong>AI 洞察反饋：</strong> 「每週維持 3 次溫和重訓，骨骼肌率微幅提升 0.4%，這使您起床時的疲憊度足足下降了 22%。您正在用最穩健的步伐滋養身體，活力花朵正開得艷麗！」</span>
                </p>
              </div>

              <div className="bg-white border border-gray-100 rounded-2xl p-4 space-y-2.5 shadow-3xs">
                <div className="flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-pink-100 text-pink-700 flex items-center justify-center font-mono text-[10px] font-bold">4</span>
                  <h4 className="text-xs font-serif font-black text-gray-800">女性生理週期 (經前) × 飲食渴求關聯</h4>
                </div>
                <p className="text-[11px] text-gray-500 leading-relaxed font-serif">
                  <strong>分析算法：</strong> PMS 期間（經前 5 天）與甜食攝取頻率、飢餓感係數。
                  <span className="text-gray-700 block mt-1"><strong>AI 洞察反饋：</strong> 「在黃體期後期（經前 5 天），您的碳水化合物攝取高出平均 35%。這是黃體酮和雌激素驟降導致的自然現象。請安心享用優質澱粉，您不需要感到一絲内疚。」</span>
                </p>
              </div>

            </div>

            {/* Daily/Weekly/Monthly outputs */}
            <div className="border border-dashed border-gray-200 rounded-2xl p-4 bg-[#fbfbf9]">
              <h4 className="text-xs font-serif font-black text-gray-700 mb-2">⏱ AI 多維度覺察報告輸出架構 Design (Dashboard Information Architecture)</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-xl p-3 border border-gray-100 leading-relaxed">
                  <span className="text-[9px] font-mono text-[#a3c9e8] font-bold">一、每日洞察 (Daily Micro-Insight)</span>
                  <p className="text-[10px] text-gray-500 mt-1 font-serif">專門提取「今天最值得注意的身心連結」。不指點不說教，僅反映數據：『今天下午，您在辦公室忙亂後吃得有些快。明天我們嘗試吃前深呼吸一口氣如何？』</p>
                </div>
                <div className="bg-white rounded-xl p-3 border border-gray-100 leading-relaxed">
                  <span className="text-[9px] font-mono text-pink-400 font-bold">二、每週回顧 (Weekly Soma Trend)</span>
                  <p className="text-[10px] text-gray-500 mt-1 font-serif">本週行為、情緒與體能起伏摘要。專注於「趨勢比對」：『本週經期來臨時睡眠時數增加，這極大程度抵消了您的暴食傾向，您真是身心關懷的大師。』</p>
                </div>
                <div className="bg-white rounded-xl p-3 border border-gray-100 leading-relaxed">
                  <span className="text-[9px] font-mono text-emerald-500 font-bold">三、每月花語人格報告 (Monthly Persona)</span>
                  <p className="text-[10px] text-gray-500 mt-1 font-serif">宏觀「花語行為學人格」解密：結合 30 天數據，判定本月您在生理和心理上是「山茶花型（溫和堅韌）」還是「向日葵型（陽光但需預防能量透支）」，並附加自我照顧策略。</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SaaS & Subscriptions */}
        {activeTab === "saas" && (
          <div className="space-y-6 animate-fade-in font-serif">
            <div className="bg-[#faf7f2] rounded-2xl p-4 border border-gray-100/80">
              <h3 className="font-serif text-sm font-bold text-[#5d8cb3] mb-1 flex items-center gap-1.5 font-black">
                <DollarSign className="w-4 h-4 text-emerald-600" />
                <span>2.0 MVP 升級 Roadmap 與 商業化訂閱方案設計 (SaaS Business Strategy)</span>
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                將功能有序拆解，兼顧「體驗驚艷度（MVP）」與「長效營收（LTV）」。
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* MVP vs Dynamic Advanced feature Table */}
              <div className="bg-white border border-gray-200/60 rounded-2xl p-5 space-y-4 shadow-3xs">
                <h4 className="text-xs font-bold text-gray-800 border-b border-gray-50 pb-2 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-[#5d8cb3]" />
                  MVP 版本 vs. 進階長線版本
                </h4>
                
                <div className="space-y-3">
                  <div className="space-y-1">
                    <span className="text-[9.5px] bg-[#a3c9e8]/20 text-[#5d8cb3] px-2 py-0.5 rounded font-mono font-bold">MVP 1.0 (當前奠基體驗 - 100% 免費)</span>
                    <ul className="text-[10.5px] text-gray-500 list-disc pl-4 space-y-0.5 leading-normal">
                      <li>今日之花與情緒之花占卜 (Gemini 提供支持)</li>
                      <li>基礎飲食覺察反思日記紀錄（上傳與心情連動）</li>
                      <li>1.0 生日性格本命花繪製、澆灌萌芽花園</li>
                    </ul>
                  </div>

                  <div className="space-y-1 pt-2 border-t border-gray-50">
                    <span className="text-[9.5px] bg-pink-100 text-pink-700 px-2 py-0.5 rounded font-mono font-bold">MVP 2.0 (即刻導入的升級體驗)</span>
                    <ul className="text-[10.5px] text-gray-500 list-disc pl-4 space-y-0.5 leading-normal">
                      <li>身體體徵（體重、體脂、精神睡眠）登入面板</li>
                      <li>運動模式 & 女性經期與 PMS 動感清單</li>
                      <li>2.0 AI 多維度關聯算法，生成每日/週覺察洞察</li>
                    </ul>
                  </div>

                  <div className="space-y-1 pt-2 border-t border-gray-50">
                    <span className="text-[9.5px] bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded font-mono font-bold">SaaS 3.0 (高客單付費加值功能)</span>
                    <ul className="text-[10.5px] text-gray-500 list-disc pl-4 space-y-0.5 leading-normal">
                      <li>每月「AI 花語人格深度探索報告」PDF 及心理諮商指引。</li>
                      <li>第三方智慧手環（Apple HealthKit / Oura Ring）無縫對齊，自動擷取睡眠與心率。</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Subscriptions Cards in Korean aesthetic styling */}
              <div className="bg-[#faf7f2]/30 border border-gray-200/50 rounded-2xl p-5 space-y-4">
                <h4 className="text-xs font-bold text-gray-800 border-b border-gray-50 pb-2 flex items-center gap-1.5 font-serif">
                  <DollarSign className="w-3.5 h-3.5 text-[#5d8cb3]" />
                  未來付費加值與訂閱方案設計 (Flow & Subscriptions)
                </h4>

                <div className="space-y-3">
                  
                  {/* Tier 1 */}
                  <div className="bg-white rounded-xl p-3 border border-gray-100 shadow-3xs flex justify-between items-start">
                    <div>
                      <span className="text-[9px] bg-gray-100 px-1.5 py-0.5 rounded font-bold text-gray-500 uppercase">Tier 01. Free (初綻種子)</span>
                      <h5 className="text-xs font-bold text-gray-800 mt-1">NT$ 0 / 永久免費</h5>
                      <p className="text-[10px] text-gray-400 mt-1 leading-normal">每日命定花與情緒能量微調、每日飲食主觀日記登載、解鎖 2 株幸運花卉於花園搖曳。</p>
                    </div>
                  </div>

                  {/* Tier 2 */}
                  <div className="bg-white rounded-xl p-3 border border-[#a3c9e8]/40 shadow-3xs flex justify-between items-start relative overflow-hidden">
                    <div className="absolute top-0 right-0 bg-[#a3c9e8] text-white text-[8px] font-bold px-2 py-0.5 rounded-bl">最受歡迎</div>
                    <div>
                      <span className="text-[9px] bg-[#a3c9e8]/20 text-[#5d8cb3] px-1.5 py-0.5 rounded font-bold uppercase">Tier 02. Somatic Bloom (身體花期)</span>
                      <h5 className="text-xs font-bold text-gray-800 mt-1 flex items-center gap-1">
                        <span>NT$ 150 / 月</span>
                        <span className="text-[9px] text-gray-400 font-normal">(或年付 NT$ 1,200)</span>
                      </h5>
                      <p className="text-[10px] text-gray-500 mt-1 leading-normal">
                        ✔ 解鎖2.0 運動與生理經期模組；<br />
                        ✔ 每日、每週「AI 多維度關聯分析」與身心覺察小語；<br />
                        ✔ 花園種植格無上限，追加解鎖 12 種全球名花與晨露水分。
                      </p>
                    </div>
                  </div>

                  {/* Tier 3 */}
                  <div className="bg-white rounded-xl p-3 border border-indigo-200/40 shadow-3xs flex justify-between items-start">
                    <div>
                      <span className="text-[9px] bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded font-bold uppercase">Tier 03. Spiritual Flourish (心靈綻放)</span>
                      <h5 className="text-xs font-bold text-gray-800 mt-1">NT$ 390 / 每月</h5>
                      <p className="text-[10px] text-gray-400 mt-1 leading-normal">
                        ✔ 含所有 2.0 核心功能；<br />
                        ✔ 每月 AI 花語人格深度追蹤報告（含1-on-1專業經期營養師心理調配回饋）；<br />
                        ✔ 提供「無壓、匿名」心理諮商綠色通道折抵代金券。
                      </p>
                    </div>
                  </div>

                </div>
              </div>
              
            </div>
          </div>
        )}

      </div>

      {/* Decorative Brand Verification Badge */}
      <div className="border-t border-gray-100 pt-6 mt-8 flex justify-between items-center text-[10px] text-gray-400 font-serif">
        <div className="flex items-center gap-1">
          <Shield className="w-3.5 h-3.5 text-emerald-500" />
          <span>經過 b'loo 專業 UX、飲食權益保護審核 (100% Body Positivity Certified)</span>
        </div>
        <span className="font-mono text-[9px] uppercase">Review Version 2.0.0-PROD</span>
      </div>

    </div>
  );
};
