import express from "express";
import path from "path";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialize Gemini API to prevent crashes on startup if GEMINI_API_KEY is missing
let aiClient: GoogleGenAI | null = null;
function getAI(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY" || apiKey.trim() === "") {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// Fallback database / definitions for Birthday Flowers
const BIRTHDAY_FLOWERS = [
  {
    flowerName: "藍色繡球花 (Blue Hydrangea)",
    flowerLanguage: "永恆的美滿、謙遜的希望、溫潤的理解",
    personalityDescription: "你擁有一顆如同清晨雨後繡球花般溫潤細膩的心。不愛誇張耀眼，卻在安靜的角落流露着難以忽視的療癒感。在群體中，你是天生的傾聽者，擁有將他人浮躁情緒撫平的溫柔力量。",
    advantages: ["同理心極強，深諳傾聽與陪伴的藝術", "觀察力敏銳，能發現生活中細微的美好", "情感豐富且真實，具有獨特的審美與文藝氣質"],
    growthAdvice: "有時過度在意他人的步伐，會讓你忘記自己呼吸的節奏。在飲食中，你容易將焦慮吞下。試著在感到疲憊時，為自己泡一杯熱茶，什麼都先別想，只專注感受茶湯滑過喉嚨的溫度。",
    soulLesson: "學會對世界溫柔的同時，也把這份溫柔毫無保留地留給自己。"
  },
  {
    flowerName: "滿天星 (Baby's Breath)",
    flowerLanguage: "純潔的愛、默默的守護、清雅的小確幸",
    personalityDescription: "你的存在就像滿天星一樣，輕盈、溫柔、不可或缺。你抗拒宏大敘事與刻意雕琢的精緻，更喜歡自然流淌的善意。懂得在平凡的日子裡釀造幸福，是你不凡的超能力。",
    advantages: ["內心純粹，保持著對世界善意的赤子之心", "隨和體貼，能讓相處的每個人都感到放鬆", "善於營造生活儀式感，在細節處發現閃光點"],
    growthAdvice: "因為善於為他人著想，你常常忽略自己胃部的微小抗議。今天，試著放下手機、關掉電視，把第一口米飯嚼足二十下。聽聽胃的聲音，它是否在對你道謝？",
    soulLesson: "你的微小綻放，本身就是一片宇宙；不需依附於任何人，你已足夠閃耀。"
  },
  {
    flowerName: "白鬱金香 (White Tulip)",
    flowerLanguage: "純潔的情誼、睿智的留白、剛柔並濟的力量",
    personalityDescription: "你擁有高雅簡潔的氣質，像一株生長在北歐陶罐裡的白色鬱金香。你崇尚簡約，懂得「留白」的主張。在複雜的環境中仍能保持獨立思考與平靜的內在核心。",
    advantages: ["思維清晰，能在繁冗中迅速理出乾淨的條理", "品味極佳，崇尚極簡、自然與有質感的極致美學", "外柔內剛，遇事沉著，是朋友心中最信賴的港灣"],
    growthAdvice: "對於完美的追求有時會轉化為飲食時的無形緊繃。當你感到事情失控，試著輕輕撫摸自己的腹部，深呼吸三次。告訴自己：『沒關係，現在這樣就很好了。』",
    soulLesson: "學會接納不完美，讓生命像鬱金香一樣隨四季自然展翼。"
  },
  {
    flowerName: "金盞花 (Marigold)",
    flowerLanguage: "溫暖的晨光、自我修復、澄澈的生命力",
    personalityDescription: "你天生帶有一種陽光灑在亞麻床單上的融融暖意。金盞花象徵強大的修復力，你在經歷挫折後，總能像朝陽般重新升起，擁有自行癒合甚至療癒他人的澄澈能量。",
    advantages: ["韌性極強，逆境中總能找到療癒與復原的養分", "具有天然的幽默感與樂觀，像和煦的小暖爐", "直覺靈敏，能與動植物及自然環境建立和諧共振"],
    growthAdvice: "熱情積極的你，生活步調也容易變快。你可能常在忙碌中把餐食塞得太急。今天試著把餐具放慢，每吃一口，都對大地與製作這頓飯的自己致意，這就是最好的自我照顧。",
    soulLesson: "你的陽光不僅照亮別人，更是一生滋養自己內在花園的泉源。"
  }
];

const LUCKY_FLOWERS = [
  {
    flowerName: "洋甘菊 (Chamomile)",
    flowerLanguage: "在逆境中的堅毅、溫柔的安撫、與焦慮和解",
    emotionReminder: "今天若有些許疲憊，不妨像洋甘菊一樣，深深呼吸，將緊繃的肩膀放鬆。你已經做得非常好了。",
    fortune: {
      relationship: "適合與親近的人訴說感謝，一句簡單的訊息就能為彼此帶來整天的暖意。",
      work: "無須焦躁地推進進度，今天適合整理舊檔案或寫下隨筆，慢工會精細生巧。",
      finance: "財務運勢平穩。今天適合把預算花在提升生活品質的小物上，如一束小黃花或好喝的草本茶。"
    },
    mindfulEatingAdvice: "今天容易因為工作壓力或匆忙而加速進食。試著在餐前喝三口溫水，閉上眼睛靜心十秒，讓身心都準備好迎接食物，這能大大溫柔你的腸胃。",
    luckyColor: "#FBFBF9" // Cream White
  },
  {
    flowerName: "粉櫻花 (Cherry Blossom)",
    flowerLanguage: "生命的絢爛、活在當下的珍貴、溫婉的綻放",
    emotionReminder: "美好的事物往往無須強求。今天允許自己慢下來，去林蔭下或窗邊看一眼隨風飄落的綠葉，生活正悄悄為你準備驚喜。",
    fortune: {
      relationship: "展現你最自然、不刻意的一面。你的不完美反而是最吸引他人的可愛之處。",
      work: "創意的靈感如同春天綻放的櫻花。不要害怕拋出不成熟的點子，它們會激發深層對話。",
      finance: "可能會有溫暖的社交開銷。與喜愛的朋友共享一份漂亮的茶點，在笑聲中，金錢會化為美妙的能量迴圈。"
    },
    mindfulEatingAdvice: "享受每一口甜美與幸福。今天在吃水果或甜點時，仔細觀察它的色澤，嗅聞它的香氣，再用舌尖細細品嚐酸甜度。這種百分百的專注會讓心靈無比富足。",
    luckyColor: "#FFF0F5" // Lavender Blush
  },
  {
    flowerName: "雛菊 (Daisy)",
    flowerLanguage: "純真、心中深藏的美意、生活的詩意覺察",
    emotionReminder: "像雛菊一樣在大地上自由呼吸吧。不去攀比高度，只是安心地在自己的花期裡，以最乾淨的姿態綻放。",
    fortune: {
      relationship: "平淡中見真情。試著為伴侶或家人倒一杯溫水，這樣平實的體貼最能打動人心。",
      work: "今天適合專注於微小而具體的日常工作。一件件安靜地寫完，會帶給你踏實的成就感。",
      finance: "生活中的小確幸花費能讓你心情開朗。買一份簡單天然的麵包或一份文具，這都是很有力量的自我犒賞。"
    },
    mindfulEatingAdvice: "今天試著練習「首口覺察」。當第一口食物送入嘴中時，先不要嚼，閉上眼睛，感受它的質地、溫度：是柔軟、酥脆、溫熱還是清涼？用這個儀式開啟一頓美好的午餐吧。",
    luckyColor: "#D4E2F0" // Baby Blue
  }
];

// Helper: safe JSON response parsing
function safeParseJSON(text: string, fallback: any) {
  try {
    // Basic parser cleanup
    let cleanText = text.replace(/```json/gi, "").replace(/```/g, "").trim();
    return JSON.parse(cleanText);
  } catch (error) {
    console.error("JSON parsing failed, returning fallback:", error);
    return fallback;
  }
}

// REST API Endpoints For Gemini Proxy
app.post("/api/generate-birthday-flower", async (req, res) => {
  const { birthDate, birthTime, gender, userName } = req.body;
  const ai = getAI();

  if (!ai) {
    // Mock Fallback with highly robust parsing for any user-typed manual string
    let birthDateParsedNum = 1;
    if (birthDate) {
      const parsedDate = new Date(birthDate);
      if (!isNaN(parsedDate.getTime())) {
        birthDateParsedNum = parsedDate.getDate();
      } else {
        // Fallback: parse numbers from the typed string
        const numbers = birthDate.match(/\d+/g);
        if (numbers && numbers.length > 0) {
          birthDateParsedNum = parseInt(numbers[numbers.length - 1], 10) || 1;
        } else {
          let hash = 0;
          for (let i = 0; i < birthDate.length; i++) {
            hash = birthDate.charCodeAt(i) + ((hash << 5) - hash);
          }
          birthDateParsedNum = Math.abs(hash) || 1;
        }
      }
    }
    const idx = Math.abs(birthDateParsedNum) % BIRTHDAY_FLOWERS.length;
    const randomFlower = BIRTHDAY_FLOWERS[isNaN(idx) ? 0 : idx];

    return res.json({
      ...randomFlower,
      source: "local-craft-database"
    });
  }

  try {
    const prompt = `
      Please act as an upscale floriography therapist ("AI 花語療癒師"), combining floriography, culture, psychology, and rituals.
      Analyze this birthday metadata for User ${userName || "親愛的旅人"}:
      - Birthdate: ${birthDate}
      - Birthtime: ${birthTime || "未提供"}
      - Gender: ${gender || "未提供"}

      Identify their supreme birth flower ("生日本命花") reflecting monthly birth flowers, birthday flowers, and global floriography systems (Victorian Floriography, Japanese Hanakotoba, Korean flower culture, European symbolics).
      Format the output STRICTLY as a raw JSON string (no markdown formatting other than plain JSON text) with the following exact keys:
      {
        "flowerName": "本命花花名 (Traditional Chinese, with optional English or Korean in parentheses, e.g., '優雅白鬱金香 (Classic White Tulip)')",
        "scientificName": "植物學名, e.g. 'Tulipa gesneriana'",
        "culturalOrigin": "文化來源 (Victorian, Japanese, Korean, etc., description)",
        "personalityDescription": "代表個性 (Comprehensive, deep, comforting, mindful psychological profile, 120-150 words)",
        "advantages": ["優勢特質一", "優勢特質二", "優勢特質三"],
        "growthAdvice": "需要留意的課題 (Gentle advice on stress, anxiety, or life hurdles)",
        "soulLesson": "人生祝福訊息 (Philosophical affirmation or warm, luxurious botanical quote)",
        "flowerLanguage": "本命花花語 (A short poetic floriography phrase, matching 'Bloom with Love')"
      }
      Respond ONLY with this valid JSON object, written in elegant Traditional Chinese. Style should be warm, soothing, therapeutic, and filled with ritual sense.
    `;

    const result = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const parsedData = safeParseJSON(result.text, BIRTHDAY_FLOWERS[0]);
    res.json({
      ...parsedData,
      // Mirror keys to maintain backward compatibility in case they are referenced somewhere with old names
      advantages: parsedData.advantages || ["細緻而溫暖的內在共情力", "不隨波逐流的獨特美學品味", "善於安頓身心的小確幸"],
      growthAdvice: parsedData.growthAdvice || "有時會因為照顧他人而忘記傾聽自己胃部的抗議，試著將吃飯視為神聖的灌溉。",
      soulLesson: parsedData.soulLesson || "允許世界不完美地存在，也允許自己不匆忙地成長。",
      source: "gemini-3.5-flash"
    });
  } catch (err) {
    console.error("Gemini Birthday Error:", err);
    const randomFlower = BIRTHDAY_FLOWERS[0];
    res.json({
      ...randomFlower,
      scientificName: "Hydrangea macrophylla",
      culturalOrigin: "維多利亞與日本花言文化",
      source: "fallback-after-error"
    });
  }
});

app.post("/api/draw-lucky-flower", async (req, res) => {
  const { birthDate, constellation, userName, sixStar } = req.body;
  const ai = getAI();

  if (!ai) {
    // Elegant fallback object matching the requested lottery card format
    const randomIndex = Math.floor(Math.random() * LUCKY_FLOWERS.length);
    const fallbackFlower = LUCKY_FLOWERS[randomIndex];
    return res.json({
      flowerName: fallbackFlower.flowerName,
      flowerLanguage: fallbackFlower.flowerLanguage,
      luckStars: 5,
      loveFortune: "愛情運：相互傾聽與陪伴，無聲勝有聲。今日適合送給另一半一個久違的擁抱。",
      workFortune: "工作運：慢條斯理地處理細節。適合釐清並簡化代辦清單，效率倍增。",
      financeFortune: "財運：適合投資在可以滋養心靈與身心健康的天然好物中。",
      healthFortune: "健康運：進食前深呼吸，舒緩胃部壓力。注意多補充溫水，促進新陳代謝。",
      luckyColor: fallbackFlower.luckyColor || "#D4E2F0",
      luckyNumber: 8,
      dailyMessage: fallbackFlower.emotionReminder || "今天感到疲累時，允許自己做一株安靜的雛菊。",
      source: "local-craft-database"
    });
  }

  try {
    const prompt = `
      You are b'loo, a premium therapeutic floriography expert ("AI 花語療癒師"). Generate a "Lucky Flower Lottery Draw Card" for today.
      User Profile: Name: ${userName || "親愛的旅人"}, Birthdate: ${birthDate || "未提供"}, Constellation: ${constellation || "守護星座"}, Six Star Node: ${sixStar || "六星占術"}.

      Choose a gorgeous flower reflecting global floriography (lavender, tulip, hydrangea, jasmine, chamomile, baby's breath, sunflower, rose, daisy, carnation).
      The return output MUST be written in Traditional Chinese, in a warm, nurturing, deeply comforting and high-end aesthetic tone, and must follow this EXACT raw JSON structure (no wrapping markdown block):
      {
        "flowerName": "抽中的幸運花名 (Traditional Chinese, with English standard name in parentheses, e.g., '晨曦洋甘菊 (Golden Chamomile)')",
        "flowerLanguage": "這朵花的花語 / 核心陪伴概念",
        "luckStars": 5, // A number from 1 to 5 representing the lucky index stars count
        "loveFortune": "愛情運分析 (Warm advice, e.g. '如何與伴侶、自己溫和交往')",
        "workFortune": "工作運/學習運分析 (How to work or build tasks smoothly)",
        "financeFortune": "財運分析 (High-vibe view on money abundance)",
        "healthFortune": "健康運與自處與用餐覺察建議",
        "luckyColor": "A beautiful hex color matching this flower's aesthetic in pastel colors (e.g., '#F0F8FF')",
        "luckyNumber": 7, // A lucky number from 1 to 99
        "dailyMessage": "今日花語訊息 (Empathetic psychological reminder or floral bless)"
      }
    `;

    const result = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const parsedData = safeParseJSON(result.text, {
      flowerName: "晨曦洋甘菊 (Golden Chamomile)",
      flowerLanguage: "逆境中的勇氣與輕柔和解",
      luckStars: 5,
      loveFortune: "溫和如微風。試著用聆聽取代建議，讓對手感受到你無條件的支持與接納。",
      workFortune: "細水長流。將龐大的任務分拆至最簡單的微型步驟，一步一個印記。",
      financeFortune: "心靈豐足。大方在健康的家常便飯，或一束擺在辦公桌的小雛菊身上大方投資自己。",
      healthFortune: "咀嚼第一口蔬菜時，放下手部動作。在微甜與溫柔的呼吸中調養脾胃能量。",
      luckyColor: "#FCFAF6",
      luckyNumber: 9,
      dailyMessage: "即便天空烏雲籠罩，泥土深處的洋甘菊依然帶著金盞的光芒對你微笑。"
    });

    res.json({
      ...parsedData,
      source: "gemini-3.5-flash"
    });
  } catch (err) {
    console.error("Gemini Drawing Error:", err);
    res.json({
      flowerName: "晨曦洋甘菊 (Golden Chamomile)",
      flowerLanguage: "逆境中的勇氣與輕柔和解",
      luckStars: 5,
      loveFortune: "溫和如微風。試著用聆聽取代建議，讓對手感受到你無條件的支持與接納。",
      workFortune: "細水長流。將龐大的任務分拆至最簡單的微型步驟，一步一個印記。",
      financeFortune: "心靈豐足。大方在健康的家常便飯，或一束擺在辦公桌的小雛菊身上大方投資自己。",
      healthFortune: "咀嚼第一口蔬菜時，放下手部動作。在微甜與溫柔的呼吸中調養脾胃能量。",
      luckyColor: "#FCFAF6",
      luckyNumber: 9,
      dailyMessage: "即便天空烏雲籠罩，泥土深處的洋甘菊依然帶著金盞的光芒對你微笑。",
      source: "fallback-after-error"
    });
  }
});

app.post("/api/analyze-eating-diary", async (req, res) => {
  const { mealTitle, mealDescription, emoji, eatingSpeed } = req.body;
  const ai = getAI();

  if (!ai) {
    // Fallback response helper
    return res.json({
      mindfulInsight: `吃下「${mealTitle || "美味的一餐"}」時，你選擇了「${emoji || "平靜"}」的情緒。以「${eatingSpeed === "quick" ? "比較匆忙" : eatingSpeed === "slow" ? "細嚼慢嚥" : "均速"}」的速度進食。
      這是一個極好的自我覺察起點。不論吃得快或慢、多或少，你的每一次記錄都是與身體重新連結的小小練習。今天，試著在晚餐後散步三分鐘，感受風的力量，相信自己的內在花朵正在悄悄茁壯。`,
      selfCareTips: [
        "在吃下下一口食物前，將手上的餐具放下五秒鐘，體會手部的放鬆",
        "今天睡前，輕輕按揉手心，向辛苦一天的四肢道謝"
      ],
      gardenConnection: "這頓具有覺察力的一餐，往你的花園裡注入了一股純淨乾淨的晨露溪水。你的生日花正散發出溫暖的金邊光芒。",
      mindfulnessPoints: eatingSpeed === "slow" ? 40 : 25,
      source: "local-craft-database"
    });
  }

  try {
    const prompt = `
      You are the b'loo Mindful Eating & Inner Floriography companion. 
      Analyze the user's meal log and provide warm, Korean-style poetic, non-diet therapeutic feedback:
      - Meal Title: ${mealTitle}
      - Meal Feeling/Description: ${mealDescription || "No description provided"}
      - Selected State: ${emoji}
      - Eating speed category: ${eatingSpeed}

      Remember, we DO NOT care about fitness, calories, fat, or sizing. We focus solely on mindful eating, loving self-care, and understanding the emotional connection with eating (e.g. eating because of boredom, stress, fatigue, or genuine physical hunger). High-end Korean magazine style (Matin Kim, Tamburins).
      
      Format output strictly as a JSON object in Traditional Chinese:
      {
        "mindfulInsight": "Warm therapeutic insight about this meal and emotional state. Validate their feelings (100-150 words).",
        "selfCareTips": ["Actionable warm self-care tip 1", "Actionable warm self-care tip 2"],
        "gardenConnection": "A delightful floral line describing how this meal has nourished their digital garden.",
        "mindfulnessPoints": 20
      }
      Respond only with this JSON.
    `;

    const result = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const parsedData = safeParseJSON(result.text, {
      mindfulInsight: "每一餐都是與身體對話的珍貴瞬間。你的飲食記錄蘊含著珍視自我的光澤。加油，慢慢來。",
      selfCareTips: ["睡前深呼吸兩分鐘", "喝一口白開水，感受它洗滌體內的安靜"],
      gardenConnection: "溫和的水分滋養了向日葵，這是一首獻給大地的歌。",
      mindfulnessPoints: 30
    });

    res.json({
      ...parsedData,
      source: "gemini-3.5-flash"
    });
  } catch (err) {
    console.error("Gemini Eating Diary Error:", err);
    res.json({
      mindfulInsight: `吃完「${mealTitle}」後能靜下心寫日記，這本身就是一場無與倫比的自我灌溉。不論當下的情緒是慌亂還是平靜，在 b’loo 的花園裡，每一步都算數。`,
      selfCareTips: [
        "洗手時感受冷水流過指縫的觸覺，帶走多餘的雜念",
        "閉上眼睛，做一次超長呼氣，卸下全身的防備"
      ],
      gardenConnection: "溫柔的泥土包裹著花瓣，這場飲食日記為你的花園帶來一股生機蓬勃的和暖微風。",
      mindfulnessPoints: 20,
      source: "fallback-after-error"
    });
  }
});

app.post("/api/generate-daily-flower", async (req, res) => {
  const { today, userName } = req.body;
  const ai = getAI();

  if (!ai) {
    return res.json({
      flowerName: "安然藍繡球 (Serene Blue Hydrangea)",
      scientificName: "Hydrangea macrophylla",
      flowerLanguage: "永恆的美滿、謙遜的希望、溫潤的理解",
      culturalOrigin: "源自維多利亞時代的寫意花語，與日本江戶時代象徵靈魂平和、潤物無聲的「花言葉」文化。",
      dailyMessage: `今天是 ${today || "今日"}。清晨的水氣在繡球花瓣間凝聚，正如你生命中那些正在靜默流淌、沉澱的智慧。今天，你不需要向世界證明任何急躁的事，只需像藍色繡球一樣，優雅、安靜地守著自己的土壤，緩緩舒展，深深吸氣。`,
      todayFitThings: "在喝第一口清水前對自己微笑；整理起被風吹亂的書頁；對為你提供支撐的脾胃與呼吸說一聲溫柔的辛苦了。",
      healingQuote: "「在不疾不徐的步調中，你的每一片花葉都已經足夠完美。」",
      source: "local-craft-database"
    });
  }

  try {
    const prompt = `
      You are an elite expert botanical therapist ("AI 花語療癒師"), combining floriography, culture, psychology, and sensory rituals to write warm, therapeutic, and highly ceremonial daily messages.
      Your global wisdom includes:
      - 維多利亞花語 (Victorian Floriography)
      - 日本花言葉 (Hanakotoba)
      - 韓國花語文化
      - 歐洲花卉象徵學
      - 中國花卉寓意文化
      - 現代心理療癒花語

      Your goal is to select an elegant botanical totem representing the energy of today: ${today || "today"} for user: ${userName || "優雅的旅人"}. 
      Prioritize flowers that resonate with today's date vibration and human emotional lessons. Keep the guidance extremely supportive and focused on slow living, mindfulness, self-acceptance, and slow-diet nutrition.

      Output MUST be written in Traditional Chinese. Returns STRICTLY a JSON object with this exact schema (no surrounding markdown formatting):
      {
        "flowerName": "今日之花名 (Traditional Chinese, with standard English in parentheses, e.g., '微雨白鬱金香 (Rainy White Tulip)')",
        "scientificName": "植物學名, e.g. 'Tulipa gesneriana'",
        "flowerLanguage": "今日核心花語",
        "culturalOrigin": "文化來源 (Provide details of its historical origins, e.g., Victorian, Japanese Hanakotoba, European, etc.)",
        "dailyMessage": "今日訊息 (A lovely therapeutic column analyzing today's energy, comforting the user, around 100-130 words)",
        "todayFitThings": "今日適合做的事 (A lovely bulleted action guide for mindful slow living, separate by semicolon)",
        "healingQuote": "一句療癒小語 (A short luxurious botanical quote/motto wrapper)"
      }
    `;

    const result = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const parsedData = safeParseJSON(result.text, {
      flowerName: "微雨白鬱金香 (Rainy White Tulip)",
      scientificName: "Tulipa gesneriana",
      flowerLanguage: "睿智的留白、自然的高貴、寬恕一切的純真",
      culturalOrigin: "源自歐洲花卉象徵學，被尊為心靈在靜謐中悄然甦醒的最高儀式感寫意之物。",
      dailyMessage: "今天是特別的今日。在綿綿的春日氣候中，白鬱金香在無人注視的庭院中緩緩吐露芳華。今天也請為自己的心靈留出一片不被喧囂打擾的空白，去安穩接納內在的所有漣漪。",
      todayFitThings: "泡一壺熱甘菊茶；在進食首口午餐前閉上眼睛感受溫度；赤手觸摸綠植的葉片。",
      healingQuote: "「去原諒所有的匆忙與瑕疵，世界正因你的留白而顯得尤為寬厚溫柔。」"
    });

    res.json({
      ...parsedData,
      source: "gemini-3.5-flash"
    });
  } catch (err) {
    console.error("Gemini Daily Flower Error:", err);
    res.json({
      flowerName: "微雨白鬱金香 (Rainy White Tulip)",
      scientificName: "Tulipa gesneriana",
      flowerLanguage: "睿智的留白、自然的高貴、寬恕一切的純真",
      culturalOrigin: "源自歐洲花卉象徵學，被尊為心靈在靜謐中悄然甦醒的最高儀式感寫意之物。",
      dailyMessage: "今天是特別的今日。在綿綿的春日氣候中，白鬱金香在無人注視的庭院中緩緩吐露芳華。今天也請為自己的心靈留出一片不被喧囂打擾的空白，去安穩接納內在的所有漣漪。",
      todayFitThings: "泡一壺熱甘菊茶；在進食首口午餐前閉上眼睛感受溫度；赤手觸摸綠植的葉片。",
      healingQuote: "「去原諒所有的匆忙與瑕疵，世界正因你的留白而顯得尤為寬厚溫柔。」",
      source: "fallback-after-error"
    });
  }
});

app.post("/api/generate-personality-report", async (req, res) => {
  const { birthDate, birthTime, birthFlower, recentEmotions, userName } = req.body;
  const ai = getAI();

  if (!ai) {
    return res.json({
      personalityType: "鈴蘭型人格 (Lily of the Valley Personality)",
      loveTrait: "在感情中你內斂、溫柔、極致守護。你害怕大起大落的喧囂，卻能以細水長流的深情將生活過成一首乾淨舒緩的詩。",
      workStyle: "追求細節完美，行事條理井然。比起做指揮全場的喧囂領袖，你更喜歡當一個以極致純粹之姿攻堅克難的靜默藝術家。",
      stressPattern: "遇到壓力時容易退回內在，在心中自責。可能會產生下意識的胃部緊縮、甚至以過快進食和忙碌工作來逃避內心的呼喚。",
      rechargeMethod: "在無人的臥室關掉手機，喝一杯溫牛奶；在安靜的花蒲前與泥土接觸；靜靜享受一頓無干擾的慢食晚餐。",
      flowerAdvice: "「將目光從完美的彼岸收回，去愛那個即便不夠耀眼、但在幽谷中優雅散發芬芳的真實自己。」",
      source: "local-craft-database"
    });
  }

  try {
    const prompt = `
      You are b'loo, a premium therapeutic Korean-style floriography master ("AI 花語療癒師").
      Generate a comprehensive premium "AI Floriography Personality Analysis Report" (🌺 花語人格報告) for User ${userName || "親愛的旅人"}.

      Input context:
      - birthDate: ${birthDate}
      - birthTime: ${birthTime || "未提供"}
      - Birth Flower: ${birthFlower || "藍色繡球花"}
      - Recent Emotional State: ${recentEmotions || "平靜而溫和的流動"}

      Match them to one of the supreme therapeutic botanical archetypes (e.g., '向日葵型人格', '鈴蘭型人格', '風信子型人格', '山茶花型人格', '薰衣草型人格', '鬱金香型人格' etc.).
      Write in elegant Traditional Chinese. The text must read like a premium boutique magazine publication (like Tamburins, Matin Kim, or Nonfiction), highly detailed, gentle, psychological, warm, and comforting.
      
      Return ONLY a raw JSON string (no markdown ticks):
      {
        "personalityType": "花語人格名稱 (e.g. '鈴蘭型人格 (Lily of the Valley Archetype)')",
        "loveTrait": "愛情特質 (Describe their deep characteristics and soft patterns in romantic/self connection, 80-100 words)",
        "workStyle": "工作風格 (How they approach tasks, schedules, and workplace energy, 80-100 words)",
        "stressPattern": "壓力模式 (How they react under fatigue, pressure, or hurry. Highlight how they might experience emotional tension or fast eating, 80-100 words)",
        "rechargeMethod": "能量補充方式 (Concrete mindful rituals, slow living, and self-care recommendations to replenish, 80-100 words)",
        "flowerAdvice": "專屬花語建議 (A beautiful, tailored blessing, around 50 words)"
      }
    `;

    const result = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const parsedData = safeParseJSON(result.text, {
      personalityType: "鈴蘭型人格 (Lily of the Valley Personality)",
      loveTrait: "在感情中你內斂、溫柔、極致守護。你害怕大起大落的喧囂，卻能以細水長流的深情將生活過成一首乾淨舒緩的詩。",
      workStyle: "追求細節完美，行事條理井然。比起做指揮全場的喧囂領袖，你更喜歡當一個以極致純粹之姿攻堅克難的靜默藝術家。",
      stressPattern: "遇到壓力時容易退回內在，在心中自責。可能會產生下意識的胃部緊縮、甚至以過快進食 and 忙碌工作來逃避內心的呼喚。",
      rechargeMethod: "在無人的臥室關掉手機，喝一杯溫牛奶；在安靜的花蒲前與泥土接觸；靜靜享受一頓無干擾的慢食晚餐。",
      flowerAdvice: "「將目光從完美的彼岸收回，去愛那個即便不夠耀眼、但在幽谷中優雅散發芬芳的真實自己。」"
    });

    res.json({
      ...parsedData,
      source: "gemini-3.5-flash"
    });
  } catch (err) {
    console.error("Gemini Personality Report Error:", err);
    res.json({
      personalityType: "鈴蘭型人格 (Lily of the Valley Personality)",
      loveTrait: "在感情中你內斂、溫柔、極致守護。你害怕大起大落的喧囂，卻能以細水長流的深情將生活過成一首乾淨舒緩的詩。",
      workStyle: "追求細節完美，行事條理井然。比起做指揮全場的喧囂領袖，你更喜歡當一個以極致純粹之姿攻堅克難的靜默藝術家。",
      stressPattern: "遇到壓力時容易退回內在，在心中自責。可能會產生下意識的胃部緊縮、甚至以過快進食 and 忙碌工作來逃避內心的呼喚。",
      rechargeMethod: "在無人的臥室關掉手機，喝一杯溫牛奶；在安靜的花蒲前與泥土接觸；靜靜享受一頓無干擾的慢食晚餐。",
      flowerAdvice: "「將目光從完美的彼岸收回，去愛那個即便不夠耀眼、但在幽谷中優雅散發芬芳的真實自己。」",
      source: "fallback-after-error"
    });
  }
});

app.post("/api/generate-emotion-flower", async (req, res) => {
  const { energyCalm, energyVitality, energyCreativity, energySocial, userName } = req.body;
  const ai = getAI();

  if (!ai) {
    // Generate beautiful fallback based on the highest state
    const scores = [
      { name: "calm", score: Number(energyCalm) || 0 },
      { name: "vitality", score: Number(energyVitality) || 0 },
      { name: "creativity", score: Number(energyCreativity) || 0 },
      { name: "social", score: Number(energySocial) || 0 }
    ];
    scores.sort((a, b) => b.score - a.score);
    const highest = scores[0].name;

    let flowerName = "曦光洋甘菊 (Dawn Chamomile)";
    let flowerLanguage = "在逆境與喧囂中守護內在的微小寧靜";
    let emotionReminder = "在喧騰的生命河流中，你為自己保留了一方清澈的淺灘。平靜並非無所作為，而是溫和地接納自己的本來面貌。";
    let fortune = {
      relationship: "平穩溫和。今天適合透過眼神或一杯暖水遞送無聲的關愛，不慌不忙的陪伴最是動人。",
      work: "細水長流。將繁複的工作拆解成微小的步驟，用安然的呼吸一件件勾銷，收穫踏實。",
      finance: "如細沙入罐。避開情緒化的消費，但在提升餐桌質感、一束小洋甘菊等美好生活細節上可以大方獎勵自己。"
    };
    let mindfulEatingAdvice = "進食前，先閉上眼睛做三次完整的腹式呼吸。感受這份平靜如何像綠色輕霧般拂過味蕾，讓食物的原味更顯甘甜。";
    let luckyColor = "#EAF2F8"; // Pastel Blue-Green

    if (highest === "vitality") {
      flowerName = "晨曦金盞花 (Crest Sun Marigold)";
      flowerLanguage = "用飽滿的熱度，融化日常裡的每一寸晦暗";
      emotionReminder = "此時此刻，你的心底燃燒著一株小小的篝火。這份盎然的活力能將周遭的人們溫柔喚醒，也請記得將溫度留給自己。";
      fortune = {
        relationship: "愛意溢滿。主動給身邊的人一聲明亮的早安問候，歡樂的氣息會回到你的生活。並多擁抱自己的感受。",
        work: "攻堅克難。今天的你抗壓力與執行力充沛，適合處理那些擱置已久、需要爆發力推動的複雜大案。",
        finance: "朝氣湧動。適合為自我學習、健康的運動裝備投入資金，這些會以雙倍的生命力能量回饋你的口袋。"
      };
      mindfulEatingAdvice = "活力充沛時，牙齒的咬合也容易變得快速用力。試著在嚼下第一口食物時，故意放慢，體會那份充沛的爆發力在細嚼慢嚥中是如何被溫柔馴服與吸收的。";
      luckyColor = "#FFF3CD"; // Sunset Yellow
    } else if (highest === "creativity") {
      flowerName = "星空勿忘我 (Starry Forget-Me-Not)";
      flowerLanguage = "在細微的世界裡，綻放充滿詩意的靈魂微光";
      emotionReminder = "你的腦海中像是藏著一整座夏夜的螢火蟲森林。那些浮現的靈感與浪漫奇思，是世界送給你的獨特餽贈。請相信，你的靈魂今天無比生動。";
      fortune = {
        relationship: "靈妙共契。與朋友聊天時，別害怕分享你腦海中那些稀奇古怪的小念頭，這反而能拉近彼此的純真連結。",
        work: "妙筆生花。今天不適合死板的機械工作，適合策劃、撰寫大綱、著色或重新擺飾你的辦公桌面，打破陳規。",
        finance: "靈巧豐盛。可能會有文藝開銷，比如買下一本手感獨特的筆記本、去看一展或買一張黑膠。這些開銷是極佳的感官灌溉。"
      };
      mindfulEatingAdvice = "試著把這一餐當作一副可以食用的藝術品。仔細觀察蔬菜的漸層綠意，水果的溫潤質地，把每次咀嚼都當成一場和食材的微小邂逅。";
      luckyColor = "#E8DAEF"; // Pastel Violet
    } else if (highest === "social") {
      flowerName = "盛放粉紅玫瑰 (Blooming Pink Rose)";
      flowerLanguage = "當心靈勇敢去碰撞，每一次盛開都是極致的溫柔";
      emotionReminder = "今天你擁有向外伸展觸角的渴望。去傾聽、去分享、去陪伴。你的溫柔就像微風中展開的粉紅玫瑰，正在為你身邊的人投射美好的投影。";
      fortune = {
        relationship: "桃花和煦。適合相聚、聚餐或打一通久違的電話給老朋友。在深入的談話中，彼此都會感到被深深擁抱了。",
        work: "協同無間。在小組會議或溝通上，你今天非常有渲染力。適合主持商討或協調棘手的合作，事半功倍。",
        finance: "分享悅納。為愛的人、身邊辛苦的同僚或保潔阿姨買一杯咖啡或下午茶，分享帶來的豐盛迴圈會將你溫柔包圍。"
      };
      mindfulEatingAdvice = "如果今天是與他人共餐，試著在說話的空檔放下筷子，真誠地聽完對方的句子，再輕咬一口食物。在溫馨的對話和靜默的咀嚼中，維持美好的呼吸頻率。";
      luckyColor = "#FFE4E1"; // Misty Rose
    }

    return res.json({
      flowerName,
      flowerLanguage,
      emotionReminder,
      fortune,
      mindfulEatingAdvice,
      luckyColor,
      dateCollected: new Date().toLocaleDateString("zh-TW", { year: 'numeric', month: '2-digit', day: '2-digit' }),
      source: "local-craft-database"
    });
  }

  try {
    const prompt = `
      You are b'loo, an expert therapeutic AI 花語療癒師 (AI Floriography Healer), integrating globally renowned botanical cultures to heal and guide human souls:
      * 維多利亞花語 (Victorian Floriography)
      * 日本花言葉 (Hanakotoba)
      * 韓國花語文化
      * 歐洲花卉象徵學
      * 中國花卉寓意文化
      * 現代心理療癒花語

      The user just selected their dynamic Emotional Energy Levels for today:
      - 平靜 (Calm): ${energyCalm}%
      - 活力 (Vitality): ${energyVitality}%
      - 創造力 (Creativity): ${energyCreativity}%
      - 社交能量 (Social Energy): ${energySocial}%
      User profile name: ${userName || "優雅的旅人"}

      Generate a highly tailored "當下情緒之花 · Emotion Flower Bloom" representing this precise combination.
      CRITICAL naming guideline: The generated 'flowerName' MUST contain one of the following base flower names (with possible elegant poetic descriptors of your choice, like '曦光藍繡球', '微雨白鬱金香', '夜空紫玫瑰', '風中滿天星', '夢境洋甘菊' to matching the Korean aesthetic perfectly):
      - '繡球' (Hydrangea)
      - '鬱金香' (Tulip)
      - '玫瑰' (Rose)
      - '雛菊' or '洋甘菊' (Daisy/Chamomile)
      - '勿忘我' (Forget-Me-Not)
      - '滿天星' (Baby's Breath)
      - '薰衣草' (Lavender)
      - '金盞' or '向日葵' (Marigold/Sunflower)
      This is required because the app has beautiful customized vector renderings for each of these base families!

      Provide responses in elegant Traditional Chinese. The text must read like a premium luxury magazine (like Tamburins or Matin Kim publications), warm, empathetic, mindful, deeply comforting, and psychological. Avoid dry clinical descriptions.
      
      Output strictly a raw JSON string (no markdown block, or single json code block) with the following structure:
      {
        "flowerName": "Name of the Custom Emotion Flower (Traditional Chinese first, with English in parentheses, e.g., '曦光藍繡球 (Aurora Blue Hydrangea)')",
        "flowerLanguage": "Poetic emotional flower language representing this precise mood mixture",
        "reasonRepresented": "代表原因 (Explain beautifully why this flower represents their current combination of Calm, Vitality, Creativity, and Social energy, 60-80 words)",
        "messageToUser": "這朵花想對你說 (An empathetic psychological reminder speaking directly to them, 80-100 words)",
        "emotionCareAdvice": "情緒照顧建議 (Slow living and non-diet mindful eating practices tailored to this emotional climate, 60-80 words)",
        "emotionReminder": "A brief summary combining reasonRepresented and messageToUser for backward compatibility",
        "fortune": {
          "relationship": "How to relate to others or themselves in this emotional climate today",
          "work": "How to approach tasks, projects, or space with this energy today",
          "finance": "A mindful perspective on their spending and abundance flow today"
        },
        "mindfulEatingAdvice": "Concrete mindful eating practice tailored to this state, echoing the emotionCareAdvice",
        "luckyColor": "A custom hex code color matching the botanical mood in pastel colors (e.g., '#F0F8FF', '#FFF8DC', '#FFF0F5', '#E6F4EA')"
      }
    `;

    const result = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const parsedData = safeParseJSON(result.text, {
      flowerName: "曦光藍繡球 (Aurora Blue Hydrangea)",
      flowerLanguage: "安然棲息於此刻，溫和包容一切發生的漣漪。",
      reasonRepresented: "你當下平靜與內斂的能量占據主導。藍色繡球花在清晨緩緩聚攏水氣，正如你在此刻將外散的精力收回，凝聚成內在沉靜的底氣。",
      messageToUser: "親愛的旅人，你不需要每分每秒都維持高頻的熱烈與綻放。此時此刻，給自己一點安靜的空檔，這並非止步不前，而是靈魂在溫柔地吸納養分，醞釀更美的一季盛開。",
      emotionCareAdvice: "在用餐前閉上眼睛深呼吸三次，感覺你的胃部。不要計較食物卡路里，慢慢享受一頓無螢幕干擾、不急不躁的暖胃晚餐。",
      emotionReminder: "藍色繡球花在清晨緩緩聚攏水氣。你不需要每分每秒都維持高頻的熱烈，此時給自己一點安靜的空檔，這並非止步不前，而是靈魂在溫柔地吸納養分。",
      fortune: {
        relationship: "平穩溫和。今天適合透過眼神或一杯暖水遞送無聲的關愛，不慌不忙的陪伴最是動人。",
        work: "細水長流。將繁複的工作拆解成微小的步驟，用安然的呼吸一件件勾銷，收穫踏實。",
        finance: "如細沙入罐。避開情緒化的消費，但在提升餐桌質感、一束小洋甘菊等美好生活細節上可以大方獎勵自己。"
      },
      mindfulEatingAdvice: "進食前，先閉上眼睛做三次完整的腹式呼吸。感受這份平靜如何像綠色輕霧般拂過味蕾，讓食物的原味更顯甘甜。",
      luckyColor: "#EAF2F8"
    });

    res.json({
      ...parsedData,
      // Fallbacks
      reasonRepresented: parsedData.reasonRepresented || "融合你今日的能量流動，所特別調配的情緒陪伴花朵。",
      messageToUser: parsedData.messageToUser || parsedData.emotionReminder,
      emotionCareAdvice: parsedData.emotionCareAdvice || parsedData.mindfulEatingAdvice,
      dateCollected: new Date().toLocaleDateString("zh-TW", { year: 'numeric', month: '2-digit', day: '2-digit' }),
      source: "gemini-3.5-flash"
    });
  } catch (err) {
    console.error("Generate Emotion Flower Error:", err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// Configure Vite integration for developer hot reload or production asset delivery
async function startServer() {
  // Vite Server middleware or Static delivery
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`b'loo Backend Server running secure on Port ${PORT}`);
  });
}

if (!process.env.VERCEL) {
  // Normal local / dev server boot
  startServer();
}

export default app;
