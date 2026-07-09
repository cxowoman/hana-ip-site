const SETTINGS_AUTH_KEY = "hana-site-settings-auth-v1";
const SITE_CONTENT_KEY = "hana-site-content-v1";
const COURSES_KEY = "hana-site-courses-v1";
const DELETED_COURSES_KEY = "hana-site-courses-deleted-v1";
const TESTIMONIALS_KEY = "hana-site-testimonials-v1";
const DELETED_TESTIMONIALS_KEY = "hana-site-testimonials-deleted-v1";
const TESTIMONIALS_MANUAL_EDIT_KEY = "hana-site-testimonials-manual-edit-v1";
const COACHING_KEY = "hana-site-coaching-v1";
const EXPERIENCES_KEY = "hana-site-experiences-v1";
const CONTENT_POSTS_KEY = "hana-site-content-posts-v1";
const DELETED_CONTENT_POSTS_KEY = "hana-site-content-posts-deleted-v1";
const REGISTRATIONS_KEY = "hana-ip-course-registrations-v1";
const EXPERIENCES_MANUAL_EDIT_KEY = "hana-site-experiences-manual-edit-v1";
const RESTORE_VERSION_KEY = "hana-site-restore-version-v1";
const PUBLISHED_VERSION_KEY = "hana-site-published-version-v1";
const RESTORE_VERSION = "2026-06-26-recovered-content-experience-testimonials-v4";

const fallbackImage = "./assets/hana-portrait-standing.jpeg";
const defaultExperienceMetrics = {
  "experience.metric1": "超過 20 年創業歷程",
  "experience.metric2": "4 個線上事業",
  "experience.metric3": "1000+ 創業學員",
  "experience.metric4": "個人品牌商品變現導師",
};

const normalizeExperienceMetrics = (content) => {
  const normalized = content && typeof content === "object" ? { ...content } : {};
  Object.entries(defaultExperienceMetrics).forEach(([key, value]) => {
    if (typeof normalized[key] !== "string" || !normalized[key].trim()) normalized[key] = value;
  });

  // Only repair the old duplicate bug; keep intentional admin edits.
  if (normalized["experience.metric2"] === defaultExperienceMetrics["experience.metric4"]) {
    normalized["experience.metric2"] = defaultExperienceMetrics["experience.metric2"];
  }
  return normalized;
};

const seedCourses = [
  {
    id: "offline-ip-day",
    type: "offline",
    status: "published",
    teacherName: "涵捺 Hana",
    teacherEmail: "hana31923@gmail.com",
    title: "個人 IP 魅力日：定位 × 內容 × 轉換",
    date: "2026-07-18",
    startTime: "10:00",
    endTime: "17:00",
    location: "台北市中山區｜報名成功後寄送詳細地址",
    capacity: "12",
    price: "NT$ 3,800",
    category: "個人 IP",
    description:
      "一天完成個人 IP 定位、內容主題、課程產品與成交路徑。適合想把專業變成清楚服務與穩定收入的創作者、講師與服務型創業者。",
    notes: "請提前 10 分鐘報到。課程講義與現場交流已包含在費用內。",
    image: fallbackImage,
  },
  {
    id: "online-content-strategy",
    type: "online",
    status: "published",
    teacherName: "涵捺 Hana",
    teacherEmail: "hana31923@gmail.com",
    title: "從零開始的個人 IP 內容策略",
    date: "2026-07-25",
    startTime: "20:00",
    endTime: "21:30",
    location: "Zoom 線上直播",
    capacity: "50",
    price: "NT$ 980",
    category: "個人 IP",
    description: "找到穩定輸出的內容支柱，讓貼文、直播與電子報互相支援，建立能被信任的個人品牌。",
    notes: "報名後會寄出直播連結與課前提醒。",
    image: "./assets/home-banner-hana.png",
  },
];

const seedTestimonials = [
  {
    id: "case-crystal-growth",
    status: "published",
    tag: "品牌營運｜10x Growth",
    title: "晶鉐水晶坊｜十倍營收成長",
    body: "從蝦皮直播起家，重新梳理品牌故事、直播節奏與高信任成交話術，讓水晶不只被看見，也被理解與記住。一年內帶動營收成長 10 倍，並從線上銷售拓展至線下門市。",
    image: "./assets/experience-consulting.png",
  },
  {
    id: "case-pet-food",
    status: "published",
    tag: "寵物市場｜永續思維",
    title: "寵物冷凍鮮食｜十年深耕",
    body: "以健康新鮮為核心，協助梳理產品線、產銷流程與再行銷策略，把一次性購買轉化為長期客群與穩定續購，讓品牌在寵物鮮食市場持續累積信任。",
    image: "./assets/experience-workshop.png",
  },
  {
    id: "case-japan-korea-buying",
    status: "published",
    tag: "策略轉型｜客單提升",
    title: "日韓代購｜客單價提升 30 倍",
    body: "疫情期間從平價小物轉攻高端精品路線，重新設定受眾、內容信任感與商品組合，三年內將客單價從百元提升至三千元等級，建立更有利潤的銷售結構。",
    image: "./assets/experience-award.png",
  },
  {
    id: "case-wedding-host",
    status: "published",
    tag: "線上課程｜高收入",
    title: "婚禮主持人培訓｜遠端工作",
    body: "將原本依賴現場接案的專業，轉化為可複製的線上課程與培訓流程。透過清楚定位、課程包裝與招生內容，培訓超過百位學員，打造兼具自由度與收入感的遠端工作模式。",
    image: "./assets/home-banner-hana.png",
  },
  {
    id: "case-yoga-healing",
    status: "published",
    tag: "身心靈｜商業模式",
    title: "瑜伽療癒｜收入翻五倍",
    body: "協助身心靈服務者把療癒價值轉化成清楚方案，從單次體驗延伸到系列課程、社群陪伴與預約制度，讓服務不再只靠體力接案，而是建立可持續經營的收入結構。",
    image: "./assets/hana-portrait-soft.jpeg",
  },
  {
    id: "case-stock-youtuber",
    status: "published",
    tag: "流量變現｜訂閱成長",
    title: "美股 YouTuber｜開拓多元收入",
    body: "將既有流量重新切分受眾需求，調整內容導向與商品階梯，從免費觀看延伸到訂閱、顧問與課程服務，讓頻道不只累積觀看數，也能形成更穩定的變現路徑。",
    image: "./assets/hero-banner.png",
  },
  {
    id: "case-ig-psychology",
    status: "published",
    tag: "粉絲破萬｜斜槓創業",
    title: "IG 心理測驗｜月增額外收入 3 萬",
    body: "運用心理測驗與占卜內容累積信任，再設計低門檻商品、私訊轉換與社群互動節奏，讓內容創作者在主業之外建立可持續的斜槓收入，每月增加額外收入 3 萬。",
    image: "./assets/hana-portrait-crossed.jpeg",
  },
  {
    id: "case-more-growth",
    status: "published",
    tag: "持續更新｜更多故事",
    title: "更多精彩案例持續更新中",
    body: "每一個成長故事，都是從看懂問題、拆解策略、穩定執行開始。後續可在網站設定持續新增學員見證、品牌成果與陪跑轉變，讓成果累積成最有說服力的信任資產。",
    image: "./assets/experience-workshop.png",
  },
  {
    id: "youtube-case-custom-shopee",
    status: "published",
    tag: "蝦皮實戰｜客製化爆單",
    title: "客製化商品突破價格戰",
    body: "從影片案例整理：學員不再只跟同業比低價，而是把商品做出客製化差異，讓顧客有明確理由選擇她。透過產品特色、溝通方式與賣場定位調整，讓蝦皮賣場從被動比價轉向主動詢問與下單。",
    image: "https://i.ytimg.com/vi/EZbEaN3MQ2g/hqdefault.jpg",
  },
  {
    id: "youtube-case-home-shopee-revenue",
    status: "published",
    tag: "在家創業｜營收成長",
    title: "從幾千塊到幾十萬的心路歷程",
    body: "從影片案例整理：在家經營蝦皮也能做出高營收，關鍵不是盲目上架，而是持續優化選品、圖片、文案、服務與回購節奏。案例呈現從小額起步到穩定放大的過程，適合想從副業走向正職收入的人參考。",
    image: "https://i.ytimg.com/vi/xAj7PFvgFpw/hqdefault.jpg",
  },
  {
    id: "youtube-case-space-rental",
    status: "published",
    tag: "創業訪談｜資源變現",
    title: "臉書廣告 × 空間出租，讓資源滾出現金流",
    body: "從影片案例整理：案例主角把既有空間和流量工具重新組合，透過臉書廣告曝光、明確方案設計與租賃服務包裝，讓原本閒置資源變成可持續的收入來源，也示範小成本創業如何降低風險。",
    image: "https://i.ytimg.com/vi/fsBZJDAYtnk/hqdefault.jpg",
  },
  {
    id: "youtube-case-single-product",
    status: "published",
    tag: "單品策略｜六位數營業額",
    title: "單靠一個商品，也能做出六位數營業額",
    body: "從影片案例整理：新手創業不一定要一開始就鋪很多商品，先把一個商品的受眾、賣點、成交理由和服務流程打磨清楚，也能創造可觀營業額。這則案例適合商品少、資源有限但想先跑通模式的人。",
    image: "https://i.ytimg.com/vi/jTTJDXdtJ-M/hqdefault.jpg",
  },
  {
    id: "youtube-case-traditional-million",
    status: "published",
    tag: "傳產轉型｜百萬營收",
    title: "傳統產業轉蝦皮電商，等到百萬營收",
    body: "從影片案例整理：傳統產業不需要推翻原本優勢，而是把既有產品、供應鏈與服務信任轉到線上。透過蝦皮賣場經營、商品呈現和轉換流程調整，讓老經驗接上新通路，累積到百萬營收成果。",
    image: "https://i.ytimg.com/vi/6riHuVnbVAI/hqdefault.jpg",
  },
  {
    id: "youtube-case-million-seller",
    status: "published",
    tag: "千萬賣家｜蝦皮策略",
    title: "千萬營收蝦皮賣家策略拆解",
    body: "從影片案例整理：成熟賣家要突破下一階段，重點不只是衝流量，而是看懂平台節奏、商品結構、廣告效率與回購設計。這則案例把高營收賣家的經營思維拆開，讓成長不只靠運氣或爆款。",
    image: "https://i.ytimg.com/vi/FQD4cPvk5rM/hqdefault.jpg",
  },
  {
    id: "youtube-case-vegan-selection",
    status: "published",
    tag: "蔬食選物｜逆境成長",
    title: "小草原蔬食選物，逆境中業績反彈",
    body: "從影片案例整理：品牌在逆境中更需要清楚定位與穩定溝通。這則案例聚焦蔬食選物品牌如何透過商品特色、價值溝通與蝦皮經營，讓客人理解品牌選品理由，進而帶動業績回升。",
    image: "https://i.ytimg.com/vi/669cFBLqwFU/hqdefault.jpg",
  },
  {
    id: "youtube-case-home-food",
    status: "published",
    tag: "家庭主婦｜食品電商",
    title: "食品電商從家裡廚房開始",
    body: "從影片案例整理：家庭主婦也能把生活經驗轉成商品價值，從家中廚房起步，透過食品特色、顧客信任與穩定出貨流程，逐步把副業變成可經營的電商生意。",
    image: "https://i.ytimg.com/vi/c_V0gqg5wLc/hqdefault.jpg",
  },
  {
    id: "youtube-case-hoffe-coffee",
    status: "published",
    tag: "精品咖啡｜品牌電商",
    title: "HOFFE COFFEE 轉戰蝦皮賣場",
    body: "從影片案例整理：十年精品咖啡品牌轉到蝦皮，不只是多一個通路，而是重新思考商品組合、品牌信任與平台購買習慣。案例呈現品牌型商家如何把線下累積的專業轉成線上銷售力。",
    image: "https://i.ytimg.com/vi/Elyi6XylDms/hqdefault.jpg",
  },
  {
    id: "youtube-case-silver-store",
    status: "published",
    tag: "傳產銀樓｜數位轉型",
    title: "台中 40 年亞洲銀樓，實體門市導入電商",
    body: "從影片案例整理：傳統銀樓透過數位行銷與電商工具，把原本仰賴地緣與熟客的門市經營，延伸成線上曝光與線下來客的雙向循環，讓老品牌被更多新客看見。",
    image: "https://i.ytimg.com/vi/NnDUV-qQKA8/hqdefault.jpg",
  },
];

const mergeSeedTestimonials = (items) => {
  const deletedIds = readDeletedTestimonialIds();
  const seedById = new Map(seedTestimonials.filter((item) => !deletedIds.has(item.id)).map((item) => [item.id, item]));
  const existingOriginal = [];
  const existingYoutube = [];
  items.filter((item) => !deletedIds.has(item.id)).forEach((item) => {
    seedById.delete(item.id);
    if (String(item.id || "").startsWith("youtube-case-")) existingYoutube.push(item);
    else existingOriginal.push(item);
  });
  const missingOriginal = [];
  const missingYoutube = [];
  seedById.forEach((item) => {
    if (item.id.startsWith("youtube-case-")) missingYoutube.push(item);
    else missingOriginal.push(item);
  });
  return [...existingOriginal, ...missingOriginal, ...existingYoutube, ...missingYoutube];
};

const seedCoachingOffers = [
  {
    id: "monthly-brand-rhythm",
    type: "monthly",
    status: "published",
    tag: "每月陪跑",
    title: "穩定前進的品牌節奏",
    description: "每月聚焦一個核心目標，拆解內容、產品與行動，適合需要持續校準的人。",
    duration: "每月 1 次策略會議",
    price: "依需求報價",
    ctaText: "預約每月陪跑諮詢",
    ctaLink: "#consult",
    image: "./assets/hana-portrait-front.jpeg",
  },
  {
    id: "deep-product-monetization-year",
    type: "deep",
    status: "published",
    tag: "商品變現｜年度陪跑",
    title: "商品變現年度陪跑計畫",
    description: "適合全職媽媽、上班族斜槓與想全職創業的人，透過 IG 社群經營、短影音內容、蝦皮直播互動與銷售心法，在一整年的陪跑下建立商品變現收入。",
    duration: "年度陪跑",
    price: "",
    ctaText: "查看詳細資訊",
    ctaLink: "https://hana.my1shop.com/2b8hka",
    image: "./assets/hana-portrait-standing.jpeg",
  },
  {
    id: "deep-shopee-revenue-growth",
    type: "deep",
    status: "published",
    tag: "蝦皮賣場｜營收成長",
    title: "蝦皮賣場營收成長｜陪跑專案",
    description: "針對想提升蝦皮賣場營收、優化商品頁、廣告投放、直播互動與成交流程的賣家，透過陪跑拆解賣場問題，逐步建立更穩定的銷售節奏。",
    duration: "深度陪跑",
    price: "",
    ctaText: "查看詳細資訊",
    ctaLink: "https://hana.my1shop.com/nfyqx0",
    image: "./assets/home-banner-hana.png",
  },
];

const seedExperiences = [
  {
    id: "experience-shopee-award",
    status: "published",
    tag: "榮譽獎項｜2024 年度",
    title: "榮獲 2024 蝦皮官方金牌講師",
    body: "由台灣蝦皮最高負責人親自頒發獎盃與獎狀，象徵學員對課程內容、口語表達、重點論述與實際成效的高度肯定。",
    image: "./assets/experience-award.png",
  },
  {
    id: "experience-campus-talk",
    status: "published",
    tag: "校園演講｜實戰分享",
    title: "弘光科技大學講座邀請",
    body: "受邀參與行銷相關講座，以實戰經驗帶領學生理解市場趨勢，鼓勵同學更有信心開創自己的未來。",
    image: "./assets/experience-workshop.png",
  },
  {
    id: "experience-labor-training",
    status: "published",
    tag: "職業培訓｜職能提升",
    title: "勞動部合作講師",
    body: "參與就業培訓與職能提升計畫，結合企業實戰經驗與數據分析，協助學員強化職場競爭力與就業信心。",
    image: "./assets/experience-consulting.png",
  },
];

const seedContentPosts = [
  {
    id: "ig-content-strategy-breakthrough-live-notes",
    status: "published",
    category: "直播精華",
    publishedAt: "2026-06-26",
    title: "IG經營卡住怎麼辦？女創俱樂部直播重點：用生活內容破圈，累積信任到變現",
    subtitle:
      "女創俱樂部直播重點整理：IG經營卡住時，如何用吃喝玩樂與日常場景打開內容入口，把專業轉成能破圈、長粉、建立信任並變現的內容策略。",
    image: "./assets/home-banner-hana.png",
    body: `<p>這場女創俱樂部直播，聊的是很多創業者、自媒體經營者都會遇到的狀態：IG經營到一半卡住了，不知道要發什麼，覺得自己的內容好像太專業、太垂直，觸及不出去，也很難把粉絲慢慢帶到信任和變現。</p>
<p>但直播裡最重要的一個觀念是：卡住不代表你要停下來。很多時候，問題不是你沒有專業，也不是你不夠努力，而是你的內容入口太窄，只有已經懂你、已經準備好購買的人才看得懂。</p>
<p>如果你希望 IG 不只是紀錄生活，而是真的可以幫你增加曝光、累積信任、帶到商品變現或顧問服務，那內容就不能只停留在「我想講什麼」，而是要開始思考：「別人為什麼會想看？他看完之後，會更理解我什麼？」</p>
<h3>本文重點整理</h3>
<ul><li>IG經營卡住時，不要急著停更，而是先檢查內容入口是不是太窄。</li><li>專業內容不一定要一開始就很硬，可以用吃喝玩樂、時事、日常場景切入。</li><li>真正有記憶點的內容，通常不是 AI 直接產出的文字，而是你對生活的第一手感受。</li><li>日更不是為了每篇爆紅，而是縮短粉絲認識你、熟悉你、信任你的時間。</li><li>有觸及卻沒有長粉，常常是內容沒有把泛流量收回你的價值觀和專業。</li><li>短影片負責擴大觸及，限動負責養熟悉感，貼文負責沉澱方法論。</li><li>變現的順序不是先賣，而是先被看見、被理解、被信任，最後才會成交。</li></ul>
<h3>IG經營卡住，不代表你要停下來</h3>
<p>很多人經營 IG 一段時間後，會進入一種很尷尬的狀態：一開始很有熱情，也知道自己想分享專業，可是發著發著就開始覺得沒有主題、不知道要說什麼，甚至會想：「我是不是應該先沉澱一下？」</p>
<p>沉澱當然可以，但如果「沉澱」變成停止行動的理由，內容就會越來越難重新啟動。</p>
<p>直播裡提到一個很實際的提醒：你現在卡關，不一定是你不適合做內容，而是你原本的內容規劃可能太垂直了。你講的都是專業乾貨、商品變現、商業營收、顧問方法，這些內容對已經創業的人很有價值，但對還在觀望、還沒有意識到需求的人來說，門檻就會比較高。</p>
<ol><li>我的內容是不是只有已經懂這個領域的人才看得懂？</li><li>我有沒有用大眾本來就有興趣的話題，帶大家靠近我的專業？</li><li>我每一篇內容有沒有讓人更理解我的觀點、價值觀或方法？</li></ol>
<p>卡住的時候，不一定要重做整個帳號。很多時候，只要把「入口」打開，內容就會開始有新的方向。</p>
<h3>內容太專業，為什麼反而不容易破圈？</h3>
<p>很多創業者經營個人品牌時，會有一個很自然的想法：我要展現專業，所以我的內容一定要很專業。這件事沒有錯，但如果每一篇都只講專業，問題就會出現。</p>
<p>因為專業內容通常有一個特性：越精準，越容易只打到少數人。它可以吸引已經有明確需求的人，但比較難吸引那些「其實可能需要你，但還不知道自己需要你」的人。</p>
<p>例如你一直講 IG變現、商品定位、商業營收，這些內容對正在做品牌、做課程、做顧問的人很有幫助。可是對更多還在想「我是不是也可以開始創業？」「我是不是可以增加收入？」「我能不能把生活經驗變成價值？」的人來說，這些詞可能離他有一點遠。</p>
<p>所以，破圈不是放棄專業，而是先用更容易被理解的內容，把人帶進來。也就是說，你的專業可以放在後面，但前面的開口要讓人願意停下來看。</p>
<h3>內容公式：吃喝玩樂 × 你的專業</h3>
<p><strong>公式：吃喝玩樂 / 時事討論 / 日常場景 + 你的專業</strong></p>
<p>這個公式的核心不是要你變成生活部落客，而是要你學會從生活裡找到專業的入口。</p>
<p>例如麥當勞，不只是薯條和漢堡。它背後可以延伸出「確定感」：為什麼我們在不知道吃什麼的時候，會想選麥當勞？因為它穩定、快速、不太出錯。這就可以連到品牌經營：你的品牌有沒有給顧客一種穩定的確定感？</p>
<p>例如星巴克，不只是咖啡。它可以延伸到消費習慣、收入底氣、生活選擇，甚至是你如何看待自己的工作節奏和價值感。</p>
<p>例如鍋物或餐廳，也不只是吃飯。它可以延伸到空間設計、客單價、顧客停留時間、服務流程，甚至是商業模式。</p>
<p>例如玩具總動員，也不只是電影。它可以延伸到被取代的焦慮、人生階段的轉換、角色價值感，甚至是創業者面對 AI 或市場變化時的心態。</p>
<p>你會發現，這些內容的前半段很生活、很大眾，大家比較容易有共鳴；但後半段可以收回你的專業判斷，讓人看見你的思考深度。這就是「破圈內容」真正重要的地方：不是只有流量，而是用流量讓更多人看懂你的價值觀。</p>
<h3>AI可以寫文案，但不能替你感受生活</h3>
<p>現在很多人會用 AI 協助寫文案、想標題、整理腳本，這當然是很好的工具。但直播裡也提到一個關鍵：AI可以幫你整理文字，卻不能替你感受生活。</p>
<p>AI不知道你今天遇到誰，不知道你在某個場景裡被什麼觸動，也不知道你為什麼突然想把一件小事分享給粉絲。真正有記憶點的內容，往往不是最漂亮的句子，而是最真實的感受。</p>
<ol><li>我今天看到什麼？</li><li>我當下感受到什麼？</li><li>這件事讓我想到什麼專業觀點？</li><li>我接下來想怎麼做，或希望讀者怎麼思考？</li></ol>
<p>例如你今天去星巴克，看到很多人都在工作，你可以寫的不只是「今天喝咖啡」。你可以延伸到自由工作者的生活節奏、工作空間的選擇、收入結構的改變，甚至是為什麼有些人願意花錢買一個更好的工作狀態。</p>
<h3>日更不是追爆紅，是縮短信任時間</h3>
<p>很多人一聽到日更，就會覺得壓力很大，因為他會以為日更代表每天都要生出一篇很厲害、很完整、很有爆點的內容。</p>
<p>但直播裡對日更的定義其實比較實際：日更不是為了每一篇都爆紅，而是為了讓對的人更常看見你。</p>
<p>粉絲第一次看到你的內容，可能只是覺得有興趣。第二次看到，會開始覺得你有點熟。第三次、第四次、第五次看到，才會慢慢建立信任。</p>
<p>如果你一週只出現一次，粉絲可能要一個月才看你四次。但如果你幾乎每天都出現，他可能一週內就看你三到五次。這就是內容累積信任的速度差。</p>
<ul><li>一段限動觀察</li><li>一個生活場景</li><li>一句今天的學習</li><li>一個客戶問題</li><li>一個活動紀錄</li><li>一段短影片</li><li>一篇輪播貼文重點</li></ul>
<p>重點是，你要找到自己每天本來就在做、而且能夠長期延伸的事情。</p>
<h3>有觸及卻不長粉，問題可能卡在哪？</h3>
<p>很多人也會遇到另一種狀況：某些內容明明有觸及，但粉絲沒有明顯增加。這時候要先分清楚一件事：觸及和長粉不是同一件事。</p>
<p>觸及代表有人看見你；長粉代表他看完之後，覺得你值得繼續追蹤。</p>
<p>如果你只是做吃喝玩樂，內容可能會有觸及，因為大家本來就喜歡看生活、美食、電影、時事。但如果你沒有把這些泛流量收回你的觀點和價值觀，大家看完可能只會覺得「這篇滿有趣」，但不一定知道為什麼要追蹤你。</p>
<ol><li>這篇內容前面是不是夠好懂，讓陌生人願意停下來？</li><li>中間有沒有放進我的觀察和判斷？</li><li>結尾有沒有讓人知道，我真正想分享的是什麼價值？</li><li>看完這篇之後，對方會更想認識我嗎？</li></ol>
<p>如果答案是否定的，那內容可能只是熱鬧，還沒有真正幫你累積品牌。</p>
<h3>短影片、限動、貼文要怎麼分工？</h3>
<p>經營 IG 時，不是每一種內容格式都要做一樣的事情。直播裡有一個很清楚的方向：不同內容格式，要負責不同任務。</p>
<p>短影片適合擴大觸及。因為短影片比較容易被陌生人看到，所以可以用時事、吃喝玩樂、生活討論、大家本來就有興趣的話題切入。它的任務是讓更多人先看見你。</p>
<p>限動適合養熟悉感。限動不一定要每則都很有深度，它更像是讓粉絲每天看到你在做什麼、你在想什麼、你怎麼工作、你怎麼生活。當粉絲越常看見你，他就越容易覺得你是熟悉的人。</p>
<p>貼文適合沉澱重點。貼文可以把你的方法、框架、觀點整理得更完整，讓粉絲可以收藏、轉發，也讓新粉絲回到你的頁面時，快速看懂你的專業。</p>
<ul><li>短影片：負責讓陌生人看見你。</li><li>限動：負責讓粉絲熟悉你。</li><li>貼文：負責讓大家理解你的專業。</li></ul>
<h3>從被看見到變現，順序不能跳過</h3>
<p>很多人經營 IG 的目標是變現，可能是賣商品、賣課程、做顧問、接合作、增加活動報名。但變現不是一開始就發生的，它有一個順序。</p>
<p>第一步，是被看見。你要先讓更多人知道你存在，所以需要可以破圈的內容。第二步，是被理解。粉絲不只要看見你，還要知道你在乎什麼、擅長什麼、可以幫他解決什麼。</p>
<p>第三步，是建立信任。信任不是靠一篇貼文完成，而是靠一次又一次的出現、互動、觀察和累積。第四步，才是變現。當粉絲已經理解你的價值，也相信你的判斷，成交就會變得自然很多。</p>
<p>所以如果你現在很想變現，但內容還沒有觸及、沒有互動、沒有信任，那就不要急著怪產品不好賣。你真正要補的，可能是前面的內容鋪陳。</p>
<h3>你可以從今天開始做的 3 個練習</h3>
<p>如果你也覺得自己的 IG經營卡住，可以先不用急著想很大的改版。你可以從三個小練習開始。</p>
<p>第一，列出你每天本來就在做的事情。像是吃飯、工作、備課、開會、閱讀、包貨、陪客戶討論、參加活動、煮飯、看電影、喝咖啡。不要先判斷它能不能變成內容，先把素材列出來。</p>
<p>第二，幫每一個生活素材接上一個專業觀點。你可以問自己：這件事跟我的專業有什麼關係？它反映了什麼商業思維？它讓我想到什麼創業者會遇到的問題？</p>
<p>第三，把內容拆成不同格式。比較生活、即時、輕鬆的，放限動；有討論度、容易吸引陌生人的，做短影片；可以整理成方法論的，做貼文或輪播。</p>
<h3>結語：你不是沒有內容，而是還沒把生活轉成內容</h3>
<p>這場女創俱樂部直播最重要的提醒是：很多人不是沒有內容，也不是沒有專業，而是習慣把內容想得太正式、太困難、太像教科書。</p>
<p>但真正能讓粉絲靠近你的，往往是你怎麼看生活、怎麼做選擇、怎麼理解一件日常小事背後的商業邏輯。</p>
<p>你的生活裡本來就有內容。你的內容裡，也本來就可以放進專業。</p>
<p>從今天開始，不要只問自己「我要發什麼」。你可以改問：「我今天遇到的這件事，可以讓粉絲更理解我哪一個觀點？」</p>
<p>當你開始用生活打開入口，再用專業收回價值，IG就不只是發文的平台，而會變成你累積信任、建立品牌、走向變現的重要工具。</p>
<h3>FAQ：IG內容經營常見問題</h3>
<p><strong>IG經營卡住怎麼辦？</strong><br>先不要急著停更。可以先檢查你的內容是不是太垂直、太專業，導致陌生人不容易看懂。建議從吃喝玩樂、時事討論、日常場景切入，再慢慢帶回你的專業觀點。</p>
<p><strong>IG內容一定要很專業才有價值嗎？</strong><br>不一定。專業內容很重要，但前面的入口要讓人願意靠近。好的內容可以先用生活引起共鳴，再把你的經驗、判斷和方法放進去，讓粉絲看見你的專業。</p>
<p><strong>AI可以幫忙做IG內容嗎？</strong><br>可以。AI很適合協助整理文案、產出標題、規劃腳本。但 AI 不能替你感受生活，也不知道你真正被什麼觸動。最好的做法是先提供你的觀察和感受，再讓 AI 協助你整理成更清楚的內容。</p>
<p><strong>為什麼日更可以幫助變現？</strong><br>日更的目的不是每篇都爆紅，而是增加粉絲看見你的次數。當粉絲更常看到你的內容、生活和觀點，就會更快建立熟悉感與信任感。變現通常不是來自單篇貼文，而是長期信任累積後的結果。</p>
<p><strong>短影片、限動、貼文應該怎麼分工？</strong><br>短影片適合擴大觸及，讓陌生人先看見你；限動適合增加互動和熟悉感；貼文適合沉澱重點與方法論。三種格式搭配使用，會比每一種都做同樣內容更有效。</p>`,
  },
  {
    id: "content-live-repurpose",
    status: "published",
    category: "直播精華",
    publishedAt: "2026-06-23",
    title: "直播結束後，如何整理成粉絲願意收藏的內容？",
    subtitle:
      "把直播和課程中的重點變成文章，不只是整理逐字稿，而是重新設計成粉絲一眼看懂、願意分享，也更容易信任你的內容資產。",
    image: "./assets/home-banner-hana.png",
    body:
      "<p>每一場直播其實都藏著很多可以再利用的內容：觀念、案例、問答、方法步驟，甚至是粉絲最常卡住的問題。重點不是把直播完整貼上來，而是把它整理成清楚、有段落、有結論的文章。</p><h3>我會先抓三個重點</h3><ul><li>粉絲看完後可以解決什麼問題。</li><li>哪一段觀念最能建立你的專業信任。</li><li>最後可以引導到哪一個課程、講座或諮詢。</li></ul><p>當內容有清楚的大標題、摘要與封面圖，粉絲在進入文章前就知道這篇內容對她有什麼幫助，也更容易停下來閱讀。</p>",
  },
];

const contentSections = [
  {
    id: "home",
    title: "首頁",
    fields: [
      ["hero.eyebrow", "首頁小標", "text", "Personal Brand Studio"],
      ["hero.title", "首頁主標", "textarea", "把你的專業，長成能被看見、被信任、被選擇的個人 IP。"],
      ["hero.body", "首頁說明", "textarea", "陪伴女性創作者、講師與服務型創業者，梳理定位、內容、課程與成交路徑，讓個人品牌不只是漂亮，而是能穩定推進事業。"],
      ["hero.primaryCta", "主按鈕文字", "text", "預約免費諮詢"],
      ["hero.primaryLink", "主按鈕連結", "text", "#consult"],
      ["hero.secondaryCta", "次按鈕文字", "text", "查看課程"],
      ["hero.secondaryLink", "次按鈕連結", "text", "#offline"],
      ["hero.image", "首頁 Banner 圖片", "image", "./assets/home-banner-hana.png"],
    ],
  },
  {
    id: "about",
    title: "認識涵捺",
    fields: [
      ["about.eyebrow", "小標", "text", "About Hana"],
      ["about.title", "標題", "text", "認識涵捺 Hana"],
      ["about.body", "價值主張", "textarea", "協助電商賣家與專業服務者打造可複製的營收成長系統，從品牌定位、選品定價、廣告 ROI 到社群變現，降低試錯成本，走向穩定收入。"],
      ["about.image", "形象照", "image", "./assets/hana-portrait-front.jpeg"],
      ["about.badge1", "亮點 1", "text", "20 年創業經歷"],
      ["about.badge2", "亮點 2", "text", "10+ 年電商實戰"],
      ["about.badge3", "亮點 3", "text", "蝦皮官方認證講師"],
      ["about.badge4", "亮點 4", "text", "個人品牌商品變現導師"],
      ["about.specialtyEyebrow", "核心專業小標", "text", "Core Expertise"],
      ["about.specialtyTitle", "核心專業標題", "text", "核心專業領域"],
      ["about.specialtyIntro", "核心專業說明", "textarea", "專注於四大維度，全方位提升品牌競爭力。"],
      ["about.expertise1.title", "專業 1 標題", "text", "電商與品牌經營"],
      ["about.expertise1.body", "專業 1 內文", "textarea", "從品牌定位、產品線規劃、價格策略到銷售漏斗，協助你把「賣產品」升級成「經營品牌資產」，讓流量、內容與成交有清楚路徑。"],
      ["about.expertise1.point1", "專業 1 重點 A", "text", "品牌定位策略"],
      ["about.expertise1.point2", "專業 1 重點 B", "text", "商品線規劃"],
      ["about.expertise1.point3", "專業 1 重點 C", "text", "轉換率優化"],
      ["about.expertise2.title", "專業 2 標題", "text", "蝦皮賣場實戰"],
      ["about.expertise2.body", "專業 2 內文", "textarea", "以官方認證講師的實戰方法，拆解後台數據、關鍵字廣告、商品頁優化與活動節奏，讓廣告預算不只是曝光，而能帶動 ROI、客單價與穩定成交。"],
      ["about.expertise2.point1", "專業 2 重點 A", "text", "關鍵字廣告布局"],
      ["about.expertise2.point2", "專業 2 重點 B", "text", "商品頁優化"],
      ["about.expertise2.point3", "專業 2 重點 C", "text", "後台數據解析"],
      ["about.expertise3.title", "專業 3 標題", "text", "商品變現設計"],
      ["about.expertise3.body", "專業 3 內文", "textarea", "不只是做出商品，而是設計可被理解、可被購買、可被續購的方案。從低門檻入口到高價服務，建立高毛利結構與可複製收入模型。"],
      ["about.expertise3.point1", "專業 3 重點 A", "text", "可複製方案設計"],
      ["about.expertise3.point2", "專業 3 重點 B", "text", "獲利結構優化"],
      ["about.expertise3.point3", "專業 3 重點 C", "text", "續購模型規劃"],
      ["about.expertise4.title", "專業 4 標題", "text", "社群變現與斜槓"],
      ["about.expertise4.body", "專業 4 內文", "textarea", "整合社群平台、內容主題與私域工具，打造從被看見、被信任到願意購買的流量閉環，讓斜槓不只是曝光，而是能穩定創造收入。"],
      ["about.expertise4.point1", "專業 4 重點 A", "text", "內容漏斗策略"],
      ["about.expertise4.point2", "專業 4 重點 B", "text", "多元收入佈局"],
      ["about.expertise4.point3", "專業 4 重點 C", "text", "私域名單經營"],
      ["about.storyTitle", "故事標題", "textarea", "把營收成長做成可以追蹤、可以複製的系統。"],
      ["about.story1", "故事段落 1", "textarea", "我是涵捺 Hana，擁有 20 年創業經歷與 10 年以上電商事業實戰。目前專注於商業營收成長顧問與電商講師，擅長把賣不動、投放沒效、流量無法變現等問題，拆成可以執行的策略。"],
      ["about.story2", "故事段落 2", "textarea", "我的培訓與陪跑涵蓋蝦皮廣告、後台數據解讀、社群漏斗整合、商品變現方案設計與品牌經營布局，也透過實體交流讓學員建立同儕支持與資源連結。"],
      ["about.story3", "故事段落 3", "textarea", "我相信突破不是靠運氣，而是一次次做對選擇。若你正在面對營收瓶頸，或想建立穩定斜槓收入，我會陪你用數據、流程與行動節奏，把成長做成系統。"],
    ],
  },
  {
    id: "experience",
    title: "相關經歷",
    fields: [
      ["experience.eyebrow", "小標", "text", "Experience & Achievements"],
      ["experience.title", "標題", "text", "相關經歷與成功案例"],
      ["experience.subtitle", "副標", "text", "創業培訓｜電商營運｜品牌顧問"],
      ["experience.metric1", "數字 1", "text", "超過 20 年創業歷程"],
      ["experience.metric2", "數字 2", "text", "4 個線上事業"],
      ["experience.metric3", "數字 3", "text", "1000+ 創業學員"],
      ["experience.metric4", "數字 4", "text", "個人品牌商品變現導師"],
      ["experience.caseEyebrow", "案例小標", "text", "Success Cases"],
      ["experience.caseTitle", "案例標題", "text", "學員與品牌成長案例"],
    ],
  },
  {
    id: "share",
    title: "內容分享",
    fields: [
      ["share.eyebrow", "內容分享小標", "text", "Content Library"],
      ["share.title", "內容分享標題", "text", "內容分享"],
      ["share.intro", "內容分享說明", "textarea", "把直播、課程與陪跑中的重點整理成可閱讀、可收藏、可分享的文章內容。"],
    ],
  },
  {
    id: "coaching",
    title: "陪跑與諮詢",
    fields: [
      ["coaching.eyebrow", "陪跑總覽小標", "text", "Coaching"],
      ["coaching.title", "陪跑總覽標題", "text", "陪跑方案"],
      ["coaching.intro", "陪跑總覽說明", "textarea", "依照你目前的品牌階段，選擇適合的陪跑節奏。"],
      ["monthly.pageEyebrow", "每月陪跑小標", "text", "Monthly Coaching"],
      ["monthly.pageTitle", "每月陪跑頁標題", "text", "每月陪跑"],
      ["monthly.pageIntro", "每月陪跑頁說明", "textarea", "適合需要穩定校準方向、每月拆解行動與持續推進的人。"],
      ["deep.pageEyebrow", "深度陪跑小標", "text", "Deep Coaching"],
      ["deep.pageTitle", "深度陪跑頁標題", "text", "深度陪跑"],
      ["deep.pageIntro", "深度陪跑頁說明", "textarea", "適合正在轉型、重整品牌定位，或想放大課程與營收系統的人。"],
      ["consult.title", "免費諮詢標題", "textarea", "先聊聊你的品牌現在卡在哪裡。"],
      ["consult.body", "免費諮詢內文", "textarea", "留下你的需求，我們會一起判斷最適合的下一步：課程、講座、陪跑，或先整理你的定位。"],
      ["consult.cta", "免費諮詢按鈕", "text", "預約免費諮詢"],
      ["consult.link", "免費諮詢連結", "text", "mailto:hello@example.com?subject=我想預約涵捺免費諮詢"],
    ],
  },
  {
    id: "navigation",
    title: "選單與頁尾",
    fields: [
      ["nav.about", "選單：認識涵捺", "text", "認識涵捺 Hana"],
      ["nav.offline", "選單：實體課程", "text", "實體課程"],
      ["nav.online", "選單：線上講座", "text", "線上講座"],
      ["nav.share", "選單：內容分享", "text", "內容分享"],
      ["nav.experience", "選單：相關經歷", "text", "相關經歷"],
      ["nav.monthly", "選單：每月陪跑", "text", "每月陪跑"],
      ["nav.deep", "選單：深度陪跑", "text", "深度陪跑"],
      ["nav.consult", "選單：免費諮詢", "text", "免費諮詢"],
      ["footer.copyright", "頁尾版權", "text", "© 2026 Hannah Personal Brand Studio"],
      ["footer.backTop", "頁尾回首頁", "text", "回到首頁"],
    ],
  },
];

const $ = (selector) => document.querySelector(selector);
const loginView = $("#loginView");
const dashboardView = $("#dashboardView");
const contentSectionTabs = $("#contentSectionTabs");
const contentForm = $("#contentForm");
const adminCourseList = $("#adminCourseList");
const adminCourseForm = $("#adminCourseForm");
const adminContentShareList = $("#adminContentShareList");
const adminContentShareForm = $("#adminContentShareForm");
const contentPostBodyEditor = $("#contentPostBodyEditor");
const adminCoachingList = $("#adminCoachingList");
const adminCoachingForm = $("#adminCoachingForm");
const adminExperienceList = $("#adminExperienceList");
const adminExperienceForm = $("#adminExperienceForm");
const adminTestimonialList = $("#adminTestimonialList");
const adminTestimonialForm = $("#adminTestimonialForm");
let activeContentSection = contentSections[0].id;
let selectedCourseId = "";
let selectedContentPostId = "";
let selectedCoachingId = "";
let selectedExperienceId = "";
let selectedTestimonialId = "";
let draggedTestimonialId = "";

const fileToDataUrl = (file, aspectRatio = null) =>
  new Promise((resolve) => {
    if (!file) return resolve("");
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      const image = new Image();
      image.addEventListener("load", () => {
        const maxSize = 1800;
        let sourceX = 0;
        let sourceY = 0;
        let sourceWidth = image.width;
        let sourceHeight = image.height;
        if (aspectRatio) {
          const currentRatio = image.width / image.height;
          if (currentRatio > aspectRatio) {
            sourceWidth = image.height * aspectRatio;
            sourceX = (image.width - sourceWidth) / 2;
          } else {
            sourceHeight = image.width / aspectRatio;
            sourceY = (image.height - sourceHeight) / 2;
          }
        }
        const scale = Math.min(1, maxSize / Math.max(sourceWidth, sourceHeight));
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(sourceWidth * scale);
        canvas.height = Math.round(sourceHeight * scale);
        const context = canvas.getContext("2d");
        context.drawImage(image, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.86));
      });
      image.addEventListener("error", () => resolve(String(reader.result)));
      image.src = String(reader.result);
    });
    reader.readAsDataURL(file);
  });

const readJson = (key, fallback) => {
  try {
    const value = JSON.parse(localStorage.getItem(key) || "null");
    return value ?? fallback;
  } catch {
    return fallback;
  }
};

const writeJson = (key, value) => localStorage.setItem(key, JSON.stringify(value));
const readDeletedTestimonialIds = () => {
  const deleted = readJson(DELETED_TESTIMONIALS_KEY, []);
  return new Set(Array.isArray(deleted) ? deleted : []);
};
const writeDeletedTestimonialIds = (ids) => writeJson(DELETED_TESTIMONIALS_KEY, [...ids]);
const markTestimonialDeleted = (id) => {
  if (!id) return;
  const deletedIds = readDeletedTestimonialIds();
  deletedIds.add(id);
  writeDeletedTestimonialIds(deletedIds);
};
const restoreTestimonialId = (id) => {
  const deletedIds = readDeletedTestimonialIds();
  if (!deletedIds.delete(id)) return;
  writeDeletedTestimonialIds(deletedIds);
};
const readDeletedContentPostIds = () => {
  const deleted = readJson(DELETED_CONTENT_POSTS_KEY, []);
  return new Set(Array.isArray(deleted) ? deleted : []);
};
const writeDeletedContentPostIds = (ids) => writeJson(DELETED_CONTENT_POSTS_KEY, [...ids]);
const markContentPostDeleted = (id) => {
  if (!id) return;
  const deletedIds = readDeletedContentPostIds();
  deletedIds.add(id);
  writeDeletedContentPostIds(deletedIds);
};
const restoreContentPostId = (id) => {
  const deletedIds = readDeletedContentPostIds();
  if (!deletedIds.delete(id)) return;
  writeDeletedContentPostIds(deletedIds);
};
const readDeletedCourseIds = () => {
  const deleted = readJson(DELETED_COURSES_KEY, []);
  return new Set(Array.isArray(deleted) ? deleted : []);
};
const writeDeletedCourseIds = (ids) => writeJson(DELETED_COURSES_KEY, [...ids]);
const markCourseDeleted = (id) => {
  if (!id) return;
  const deletedIds = readDeletedCourseIds();
  deletedIds.add(id);
  writeDeletedCourseIds(deletedIds);
};
const restoreCourseId = (id) => {
  const deletedIds = readDeletedCourseIds();
  if (!deletedIds.delete(id)) return;
  writeDeletedCourseIds(deletedIds);
};
const readContent = () => {
  const content = readJson(SITE_CONTENT_KEY, {});
  return normalizeExperienceMetrics(content);
};
const writeContent = (content) => writeJson(SITE_CONTENT_KEY, content);
const readCourses = () => {
  const courses = readJson(COURSES_KEY, null);
  const deletedIds = readDeletedCourseIds();
  const source = Array.isArray(courses) ? courses : seedCourses;
  return source.filter((course) => !deletedIds.has(course.id));
};
const writeCourses = (courses) => writeJson(COURSES_KEY, courses);
const readTestimonials = () => {
  if (Array.isArray(window.HANA_RECOVERED_TESTIMONIALS) && localStorage.getItem(TESTIMONIALS_MANUAL_EDIT_KEY) !== "1") {
    return window.HANA_RECOVERED_TESTIMONIALS;
  }
  const testimonials = readJson(TESTIMONIALS_KEY, null);
  const deletedIds = readDeletedTestimonialIds();
  const source = Array.isArray(testimonials) ? testimonials : defaultTestimonials();
  return source.filter((item) => !deletedIds.has(item.id));
};
const defaultTestimonials = () => {
  if (Array.isArray(window.HANA_RECOVERED_TESTIMONIALS)) return window.HANA_RECOVERED_TESTIMONIALS;
  const deletedIds = readDeletedTestimonialIds();
  return seedTestimonials.filter((item) => !deletedIds.has(item.id));
};
const writeTestimonials = (testimonials) => writeJson(TESTIMONIALS_KEY, testimonials);
const readCoachingOffers = () => {
  const offers = readJson(COACHING_KEY, null);
  return Array.isArray(offers) ? offers : seedCoachingOffers;
};
const writeCoachingOffers = (offers) => writeJson(COACHING_KEY, offers);
const readExperiences = () => {
  if (Array.isArray(window.HANA_RECOVERED_EXPERIENCES) && localStorage.getItem(EXPERIENCES_MANUAL_EDIT_KEY) !== "1") {
    return window.HANA_RECOVERED_EXPERIENCES;
  }
  const experiences = readJson(EXPERIENCES_KEY, null);
  return Array.isArray(experiences) ? experiences : defaultExperiences();
};
const writeExperiences = (experiences) => writeJson(EXPERIENCES_KEY, experiences);
const defaultExperiences = () =>
  Array.isArray(window.HANA_RECOVERED_EXPERIENCES) ? window.HANA_RECOVERED_EXPERIENCES : seedExperiences;
const defaultContentPosts = () => {
  if (Array.isArray(window.HANA_RECOVERED_CONTENT_POSTS)) return window.HANA_RECOVERED_CONTENT_POSTS;
  const extraPosts = Array.isArray(window.HANA_EXTRA_CONTENT_POSTS) ? window.HANA_EXTRA_CONTENT_POSTS : [];
  const extraIds = new Set(extraPosts.map((post) => post.id));
  return [...extraPosts, ...seedContentPosts.filter((post) => !extraIds.has(post.id))];
};
const hydrateRecoveredDataOnce = () => {
  try {
    if (localStorage.getItem(RESTORE_VERSION_KEY) === RESTORE_VERSION) return;
    if (Array.isArray(window.HANA_RECOVERED_EXPERIENCES)) {
      writeJson(EXPERIENCES_KEY, window.HANA_RECOVERED_EXPERIENCES);
      localStorage.removeItem(EXPERIENCES_MANUAL_EDIT_KEY);
    }
    if (Array.isArray(window.HANA_RECOVERED_CONTENT_POSTS)) {
      writeJson(CONTENT_POSTS_KEY, window.HANA_RECOVERED_CONTENT_POSTS);
      writeJson(
        DELETED_CONTENT_POSTS_KEY,
        Array.isArray(window.HANA_RECOVERED_DELETED_CONTENT_POST_IDS) ? window.HANA_RECOVERED_DELETED_CONTENT_POST_IDS : [],
      );
    }
    if (Array.isArray(window.HANA_RECOVERED_TESTIMONIALS)) {
      writeJson(TESTIMONIALS_KEY, window.HANA_RECOVERED_TESTIMONIALS);
      writeJson(
        DELETED_TESTIMONIALS_KEY,
        Array.isArray(window.HANA_RECOVERED_DELETED_TESTIMONIAL_IDS) ? window.HANA_RECOVERED_DELETED_TESTIMONIAL_IDS : [],
      );
      localStorage.removeItem(TESTIMONIALS_MANUAL_EDIT_KEY);
    }
    localStorage.setItem(RESTORE_VERSION_KEY, RESTORE_VERSION);
  } catch {
    // If storage is unavailable, the admin still falls back to recovered defaults.
  }
};

const hydratePublishedDataOnce = () => {
  const data = window.HANA_PUBLISHED_DATA;
  if (!data || typeof data !== "object" || !data.version) return;
  try {
    if (data.content && typeof data.content === "object") writeContent(data.content);
    if (Array.isArray(data.courses)) writeCourses(data.courses);
    if (Array.isArray(data.deletedCourses)) writeDeletedCourseIds(new Set(data.deletedCourses));
    if (Array.isArray(data.coaching)) writeCoachingOffers(data.coaching);
    if (Array.isArray(data.experiences)) {
      writeExperiences(data.experiences);
      localStorage.setItem(EXPERIENCES_MANUAL_EDIT_KEY, "1");
    }
    if (Array.isArray(data.contentPosts)) writeJson(CONTENT_POSTS_KEY, data.contentPosts);
    if (Array.isArray(data.deletedContentPosts)) writeDeletedContentPostIds(new Set(data.deletedContentPosts));
    if (Array.isArray(data.testimonials)) {
      writeTestimonials(data.testimonials);
      localStorage.setItem(TESTIMONIALS_MANUAL_EDIT_KEY, "1");
    }
    if (Array.isArray(data.deletedTestimonials)) writeDeletedTestimonialIds(new Set(data.deletedTestimonials));
    localStorage.setItem(PUBLISHED_VERSION_KEY, data.version);
  } catch {
    // If storage is unavailable, the admin still keeps the in-file published defaults.
  }
};
hydrateRecoveredDataOnce();
hydratePublishedDataOnce();
const readContentPosts = () => {
  const posts = readJson(CONTENT_POSTS_KEY, null);
  const deletedIds = readDeletedContentPostIds();
  const basePosts = defaultContentPosts();
  const existing = Array.isArray(posts) ? posts.filter((post) => !deletedIds.has(post.id)) : [];
  const existingIds = new Set(existing.map((post) => post.id));
  return [...basePosts.filter((post) => !existingIds.has(post.id) && !deletedIds.has(post.id)), ...existing];
};
const writeContentPosts = (posts) => writeJson(CONTENT_POSTS_KEY, posts);
const readRegistrations = () => readJson(REGISTRATIONS_KEY, []);
const publishedPayload = () => ({
  version: new Date().toISOString(),
  content: readContent(),
  courses: readCourses(),
  deletedCourses: [...readDeletedCourseIds()],
  coaching: readCoachingOffers(),
  experiences: readExperiences(),
  contentPosts: readContentPosts(),
  deletedContentPosts: [...readDeletedContentPostIds()],
  testimonials: readTestimonials(),
  deletedTestimonials: [...readDeletedTestimonialIds()],
});
const publishSiteData = async (statusElement, successMessage = "已儲存並發布到公開頁。") => {
  try {
    const response = await fetch("./api/publish", {
      method: "POST",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(publishedPayload()),
    });
    if (!response.ok) throw new Error(`Publish failed: ${response.status}`);
    const result = await response.json();
    if (result?.version) localStorage.setItem(PUBLISHED_VERSION_KEY, result.version);
    if (statusElement) {
      const gitPublish = result?.gitPublish;
      if (gitPublish?.ok && gitPublish?.skipped === false) {
        statusElement.textContent = "已儲存並推送到 GitHub Pages。公開頁通常會在 1-2 分鐘內更新。";
      } else if (gitPublish?.reason === "no_remote") {
        statusElement.textContent = "已儲存並產生 GitHub Pages 公開檔案。完成 GitHub 上線設定後，之後會自動推送。";
      } else if (gitPublish && !gitPublish.ok) {
        statusElement.textContent = "已儲存公開檔案，但 GitHub 推送沒有成功。請把畫面截圖給我，我會接著處理。";
      } else {
        statusElement.textContent = successMessage;
      }
    }
    return true;
  } catch {
    if (statusElement) {
      statusElement.textContent = "已儲存本機，但尚未產生公開頁資料。請確認目前是用 127.0.0.1 的本機後台操作。";
    }
    return false;
  }
};
const escapeHtml = (value) =>
  String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
const sanitizeArticleHtml = (html) => {
  const template = document.createElement("template");
  template.innerHTML = String(html || "");
  template.content.querySelectorAll("script, iframe, object, embed, style").forEach((element) => element.remove());
  template.content.querySelectorAll("*").forEach((element) => {
    [...element.attributes].forEach((attribute) => {
      const name = attribute.name.toLowerCase();
      const value = attribute.value.trim();
      if (name.startsWith("on") || (name === "href" && value.toLowerCase().startsWith("javascript:"))) {
        element.removeAttribute(attribute.name);
      }
    });
  });
  return template.innerHTML;
};

let serverAuthenticated = false;

const setAuthenticated = (value) => {
  serverAuthenticated = Boolean(value);
  if (serverAuthenticated) sessionStorage.setItem(SETTINGS_AUTH_KEY, "ok");
  else sessionStorage.removeItem(SETTINGS_AUTH_KEY);
};

const isAuthenticated = () => serverAuthenticated;

const requireAuth = () => {
  if (isAuthenticated()) return true;
  setAuthenticated(false);
  renderAuth();
  $(".login-status").textContent = "請先登入管理員帳號。";
  return false;
};

const renderAuth = () => {
  const authed = isAuthenticated();
  loginView.classList.toggle("is-hidden", authed);
  dashboardView.classList.toggle("is-hidden", !authed);
  loginView.toggleAttribute("inert", authed);
  dashboardView.toggleAttribute("inert", !authed);
  dashboardView.setAttribute("aria-hidden", String(!authed));
  if (authed) renderDashboard();
};

const refreshAuth = async () => {
  try {
    const response = await fetch("./api/session", { credentials: "same-origin" });
    const result = response.ok ? await response.json() : { authenticated: false };
    setAuthenticated(Boolean(result.authenticated));
  } catch {
    setAuthenticated(false);
  }
  renderAuth();
};

$("#adminLoginForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const data = new FormData(form);
  $(".login-status").textContent = "登入中...";
  try {
    const response = await fetch("./api/login", {
      method: "POST",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: String(data.get("username") || ""),
        password: String(data.get("password") || ""),
      }),
    });
    if (!response.ok) throw new Error("login failed");
    setAuthenticated(true);
    form.reset();
    renderAuth();
    return;
  } catch {
    setAuthenticated(false);
    $(".login-status").textContent = "帳號或密碼不正確，或後台發布服務尚未啟動。";
  }
});

$("#adminLogoutButton").addEventListener("click", async () => {
  try {
    await fetch("./api/logout", { method: "POST", credentials: "same-origin" });
  } catch {
    // Logging out locally is enough if the server is unreachable.
  }
  setAuthenticated(false);
  renderAuth();
});

document.querySelectorAll(".admin-tabs button").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".admin-tabs button").forEach((item) => item.classList.remove("is-active"));
    document.querySelectorAll(".panel").forEach((panel) => panel.classList.remove("is-active"));
    button.classList.add("is-active");
    document.getElementById(button.dataset.panel).classList.add("is-active");
  });
});

const renderContentTabs = () => {
  contentSectionTabs.innerHTML = contentSections
    .map(
      (section) =>
        `<button type="button" class="${section.id === activeContentSection ? "is-active" : ""}" data-section="${section.id}">${section.title}</button>`,
    )
    .join("");
};

const renderContentForm = () => {
  const content = readContent();
  const section = contentSections.find((item) => item.id === activeContentSection) || contentSections[0];
  contentForm.innerHTML = `
    ${section.fields
      .map(([key, label, type, fallback]) => {
        const value = escapeHtml(content[key] ?? fallback ?? "");
        if (type === "textarea") {
          return `<label class="wide">${escapeHtml(label)}<textarea name="${key}" rows="4">${value}</textarea></label>`;
        }
        if (type === "image" || type === "image16x9") {
          return `
            <label class="wide upload-box">
              ${escapeHtml(label)}
              <input name="${key}" value="${value}" />
              <input name="${key}__file" type="file" accept="image/png,image/jpeg,image/webp" />
              <span>${type === "image16x9" ? "可貼圖片路徑，也可以上傳新圖片。上傳後會自動裁成 16:9。" : "可貼圖片路徑，也可以上傳新圖片。"}</span>
            </label>
          `;
        }
        return `<label>${escapeHtml(label)}<input name="${key}" value="${value}" /></label>`;
      })
      .join("")}
    <div class="form-actions">
      <p class="content-status" role="status">儲存後，前台重新整理即可看到變更。</p>
      <button type="submit">儲存內容</button>
    </div>
  `;
};

contentSectionTabs.addEventListener("click", (event) => {
  const button = event.target.closest("[data-section]");
  if (!button) return;
  activeContentSection = button.dataset.section;
  renderContentTabs();
  renderContentForm();
});

contentForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!requireAuth()) return;
  const content = readContent();
  const section = contentSections.find((item) => item.id === activeContentSection) || contentSections[0];
  const data = new FormData(event.currentTarget);

  for (const [key, , type] of section.fields) {
    if (type === "image" || type === "image16x9") {
      const file = data.get(`${key}__file`);
      const uploaded = file instanceof File && file.size ? await fileToDataUrl(file, type === "image16x9" ? 16 / 9 : null) : "";
      content[key] = uploaded || String(data.get(key) || "");
    } else {
      content[key] = String(data.get(key) || "");
    }
  }

  writeContent(content);
  const status = $(".content-status");
  status.textContent = "已儲存，正在發布到公開頁...";
  await publishSiteData(status, "已儲存網站內容，並發布到公開頁。");
});

$("#resetContentButton").addEventListener("click", async () => {
  if (!requireAuth()) return;
  localStorage.removeItem(SITE_CONTENT_KEY);
  renderContentForm();
  await publishSiteData($(".content-status"), "已還原文字，並發布到公開頁。");
});

const renderCourseList = () => {
  const courses = readCourses();
  if (!selectedCourseId && courses[0]) selectedCourseId = courses[0].id;
  adminCourseList.innerHTML = courses
    .map(
      (course) => `
        <button type="button" class="${course.id === selectedCourseId ? "is-active" : ""}" data-course-id="${escapeHtml(course.id)}">
          <span class="course-list-copy">
            <strong>${escapeHtml(course.title)}</strong>
            <small>${course.type === "offline" ? "實體課程" : "線上課程"}｜${course.status === "published" ? "已上架" : "草稿"}</small>
          </span>
          <span class="inline-delete" role="button" tabindex="0" data-delete-course="${escapeHtml(course.id)}">刪除</span>
        </button>
      `,
    )
    .join("");
};

const fillCourseForm = () => {
  const course = readCourses().find((item) => item.id === selectedCourseId) || {};
  [...adminCourseForm.elements].forEach((element) => {
    if (!element.name || element.type === "file") return;
    element.value = course[element.name] ?? "";
  });
};

const deleteCourse = async (id) => {
  if (!requireAuth()) return;
  if (!id) return;
  markCourseDeleted(id);
  const courses = readCourses().filter((course) => course.id !== id);
  selectedCourseId = courses[0]?.id || "";
  writeCourses(courses);
  renderCourses();
  const status = $(".course-status");
  status.textContent = "已刪除課程，正在發布到公開頁...";
  await publishSiteData(status, "已刪除課程，並同步發布到公開頁。");
};

adminCourseList.addEventListener("click", (event) => {
  const deleteButton = event.target.closest("[data-delete-course]");
  if (deleteButton) {
    event.preventDefault();
    event.stopPropagation();
    deleteCourse(deleteButton.dataset.deleteCourse);
    return;
  }
  const button = event.target.closest("[data-course-id]");
  if (!button) return;
  selectedCourseId = button.dataset.courseId;
  renderCourseList();
  fillCourseForm();
});

adminCourseList.addEventListener("keydown", (event) => {
  if (event.key !== "Enter" && event.key !== " ") return;
  const deleteButton = event.target.closest("[data-delete-course]");
  if (!deleteButton) return;
  event.preventDefault();
  deleteCourse(deleteButton.dataset.deleteCourse);
});

$("#newCourseButton").addEventListener("click", () => {
  selectedCourseId = "";
  adminCourseForm.reset();
  adminCourseForm.elements.id.value = "";
  adminCourseForm.elements.type.value = "offline";
  adminCourseForm.elements.status.value = "published";
  adminCourseForm.elements.teacherName.value = "涵捺 Hana";
});

adminCourseForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!requireAuth()) return;
  const data = new FormData(event.currentTarget);
  const imageFile = data.get("imageFile");
  const uploaded = imageFile instanceof File && imageFile.size ? await fileToDataUrl(imageFile) : "";
  const course = {
    id: String(data.get("id") || `course-${Date.now().toString(36)}`),
    type: String(data.get("type") || "offline"),
    status: String(data.get("status") || "published"),
    teacherName: String(data.get("teacherName") || "").trim(),
    teacherEmail: String(data.get("teacherEmail") || "").trim(),
    title: String(data.get("title") || "").trim(),
    date: String(data.get("date") || ""),
    startTime: String(data.get("startTime") || ""),
    endTime: String(data.get("endTime") || ""),
    location: String(data.get("location") || "").trim(),
    capacity: String(data.get("capacity") || "").trim(),
    price: String(data.get("price") || "").trim(),
    category: String(data.get("category") || "").trim(),
    description: String(data.get("description") || "").trim(),
    notes: String(data.get("notes") || "").trim(),
    image: uploaded || String(data.get("image") || fallbackImage),
  };
  const courses = readCourses();
  const index = courses.findIndex((item) => item.id === course.id);
  if (index >= 0) courses[index] = course;
  else courses.push(course);
  selectedCourseId = course.id;
  restoreCourseId(course.id);
  writeCourses(courses);
  renderCourses();
  const status = $(".course-status");
  status.textContent = "已儲存課程，正在發布到公開頁...";
  await publishSiteData(status, "已儲存課程，並發布到公開頁。");
});

$("#deleteCourseButton").addEventListener("click", () => {
  deleteCourse(selectedCourseId);
});

const renderCourses = () => {
  renderCourseList();
  fillCourseForm();
};

const renderContentPostList = () => {
  const posts = readContentPosts();
  if (!selectedContentPostId && posts[0]) selectedContentPostId = posts[0].id;
  adminContentShareList.innerHTML = posts
    .map(
      (post) => `
        <button type="button" class="${post.id === selectedContentPostId ? "is-active" : ""}" data-content-post-id="${escapeHtml(post.id)}">
          <span class="content-share-list-copy">
            <strong>${escapeHtml(post.title)}</strong>
            <small>${escapeHtml(post.category || "未分類")}｜${post.status === "published" ? "已上架" : "草稿"}</small>
          </span>
          <span class="inline-delete" role="button" tabindex="0" data-delete-content-post="${escapeHtml(post.id)}">刪除</span>
        </button>
      `,
    )
    .join("");
};

const fillContentPostForm = () => {
  const post = readContentPosts().find((item) => item.id === selectedContentPostId) || {};
  [...adminContentShareForm.elements].forEach((element) => {
    if (!element.name || element.type === "file") return;
    element.value = post[element.name] ?? "";
  });
  contentPostBodyEditor.innerHTML = sanitizeArticleHtml(post.body || "");
};

const deleteContentPost = async (id) => {
  if (!requireAuth()) return;
  if (!id) return;
  markContentPostDeleted(id);
  const posts = readContentPosts().filter((post) => post.id !== id);
  selectedContentPostId = posts[0]?.id || "";
  writeContentPosts(posts);
  renderContentShareAdmin();
  const status = $(".content-share-status");
  status.textContent = "已刪除內容分享，正在發布到公開頁...";
  await publishSiteData(status, "已刪除內容分享，並同步發布到公開頁。");
};

adminContentShareList.addEventListener("click", (event) => {
  const deleteButton = event.target.closest("[data-delete-content-post]");
  if (deleteButton) {
    event.preventDefault();
    event.stopPropagation();
    deleteContentPost(deleteButton.dataset.deleteContentPost);
    return;
  }
  const button = event.target.closest("[data-content-post-id]");
  if (!button) return;
  selectedContentPostId = button.dataset.contentPostId;
  renderContentPostList();
  fillContentPostForm();
});

adminContentShareList.addEventListener("keydown", (event) => {
  if (event.key !== "Enter" && event.key !== " ") return;
  const deleteButton = event.target.closest("[data-delete-content-post]");
  if (!deleteButton) return;
  event.preventDefault();
  deleteContentPost(deleteButton.dataset.deleteContentPost);
});

$("#newContentPostButton").addEventListener("click", () => {
  selectedContentPostId = "";
  adminContentShareForm.reset();
  adminContentShareForm.elements.id.value = "";
  adminContentShareForm.elements.status.value = "published";
  adminContentShareForm.elements.publishedAt.value = new Date().toISOString().slice(0, 10);
  contentPostBodyEditor.innerHTML = "";
  $(".content-share-status").textContent = "正在建立新的內容分享。";
});

adminContentShareForm.querySelector(".rich-toolbar").addEventListener("click", (event) => {
  const button = event.target.closest("[data-rich-command]");
  if (!button) return;
  const command = button.dataset.richCommand;
  const value = button.dataset.richValue || null;
  contentPostBodyEditor.focus();
  if (command === "createLink") {
    const url = window.prompt("請貼上連結網址");
    if (url) document.execCommand("createLink", false, url);
    return;
  }
  document.execCommand(command, false, value);
});

adminContentShareForm.querySelector(".rich-toolbar").addEventListener("mousedown", (event) => {
  if (event.target.closest("[data-rich-command]")) event.preventDefault();
});

adminContentShareForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!requireAuth()) return;
  const data = new FormData(event.currentTarget);
  const imageFile = data.get("imageFile");
  const uploaded = imageFile instanceof File && imageFile.size ? await fileToDataUrl(imageFile, 16 / 9) : "";
  const post = {
    id: String(data.get("id") || `content-${Date.now().toString(36)}`),
    status: String(data.get("status") || "published"),
    category: String(data.get("category") || "").trim(),
    publishedAt: String(data.get("publishedAt") || "").trim(),
    title: String(data.get("title") || "").trim(),
    subtitle: String(data.get("subtitle") || "").trim(),
    image: uploaded || String(data.get("image") || fallbackImage),
    body: sanitizeArticleHtml(contentPostBodyEditor.innerHTML),
  };
  const posts = readContentPosts();
  const index = posts.findIndex((item) => item.id === post.id);
  if (index >= 0) posts[index] = post;
  else posts.push(post);
  selectedContentPostId = post.id;
  restoreContentPostId(post.id);
  writeContentPosts(posts);
  renderContentShareAdmin();
  const status = $(".content-share-status");
  status.textContent = "已儲存內容分享，正在發布到公開頁...";
  await publishSiteData(status, "已儲存內容分享，並發布到公開頁。");
});

$("#deleteContentPostButton").addEventListener("click", () => {
  deleteContentPost(selectedContentPostId);
});

const renderContentShareAdmin = () => {
  renderContentPostList();
  fillContentPostForm();
};

const renderCoachingList = () => {
  const offers = readCoachingOffers();
  if (!selectedCoachingId && offers[0]) selectedCoachingId = offers[0].id;
  adminCoachingList.innerHTML = offers
    .map(
      (offer) => `
        <button type="button" class="${offer.id === selectedCoachingId ? "is-active" : ""}" data-coaching-id="${escapeHtml(offer.id)}">
          <strong>${escapeHtml(offer.title)}</strong>
          <small>${offer.type === "monthly" ? "每月陪跑" : "深度陪跑"}｜${offer.status === "published" ? "已上架" : "草稿"}</small>
        </button>
      `,
    )
    .join("");
};

const fillCoachingForm = () => {
  const offer = readCoachingOffers().find((item) => item.id === selectedCoachingId) || {};
  [...adminCoachingForm.elements].forEach((element) => {
    if (!element.name || element.type === "file") return;
    element.value = offer[element.name] ?? "";
  });
};

adminCoachingList.addEventListener("click", (event) => {
  const button = event.target.closest("[data-coaching-id]");
  if (!button) return;
  selectedCoachingId = button.dataset.coachingId;
  renderCoachingList();
  fillCoachingForm();
});

$("#newCoachingButton").addEventListener("click", () => {
  selectedCoachingId = "";
  adminCoachingForm.reset();
  adminCoachingForm.elements.id.value = "";
  adminCoachingForm.elements.type.value = "monthly";
  adminCoachingForm.elements.status.value = "published";
  adminCoachingForm.elements.ctaLink.value = "#consult";
});

adminCoachingForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!requireAuth()) return;
  const data = new FormData(event.currentTarget);
  const imageFile = data.get("imageFile");
  const uploaded = imageFile instanceof File && imageFile.size ? await fileToDataUrl(imageFile) : "";
  const offer = {
    id: String(data.get("id") || `coaching-${Date.now().toString(36)}`),
    type: String(data.get("type") || "monthly"),
    status: String(data.get("status") || "published"),
    tag: String(data.get("tag") || "").trim(),
    title: String(data.get("title") || "").trim(),
    description: String(data.get("description") || "").trim(),
    duration: String(data.get("duration") || "").trim(),
    price: String(data.get("price") || "").trim(),
    ctaText: String(data.get("ctaText") || "").trim(),
    ctaLink: String(data.get("ctaLink") || "#consult").trim(),
    image: uploaded || String(data.get("image") || fallbackImage),
  };
  const offers = readCoachingOffers();
  const index = offers.findIndex((item) => item.id === offer.id);
  if (index >= 0) offers[index] = offer;
  else offers.push(offer);
  selectedCoachingId = offer.id;
  writeCoachingOffers(offers);
  renderCoachingAdmin();
  const status = $(".coaching-status");
  status.textContent = "已儲存陪跑方案，正在發布到公開頁...";
  await publishSiteData(status, "已儲存陪跑方案，並發布到公開頁。");
});

$("#deleteCoachingButton").addEventListener("click", async () => {
  if (!requireAuth()) return;
  if (!selectedCoachingId) return;
  const offers = readCoachingOffers().filter((offer) => offer.id !== selectedCoachingId);
  selectedCoachingId = offers[0]?.id || "";
  writeCoachingOffers(offers);
  renderCoachingAdmin();
  await publishSiteData($(".coaching-status"), "已刪除陪跑方案，並同步發布到公開頁。");
});

const renderCoachingAdmin = () => {
  renderCoachingList();
  fillCoachingForm();
};

const renderExperienceList = () => {
  const experiences = readExperiences();
  if (!selectedExperienceId && experiences[0]) selectedExperienceId = experiences[0].id;
  adminExperienceList.innerHTML = experiences
    .map(
      (item) => `
        <button type="button" class="${item.id === selectedExperienceId ? "is-active" : ""}" data-experience-id="${escapeHtml(item.id)}">
          <strong>${escapeHtml(item.title)}</strong>
          <small>${escapeHtml(item.tag || "未分類")}｜${item.status === "published" ? "已上架" : "草稿"}</small>
        </button>
      `,
    )
    .join("");
};

const fillExperienceForm = () => {
  const experience = readExperiences().find((item) => item.id === selectedExperienceId) || {};
  [...adminExperienceForm.elements].forEach((element) => {
    if (!element.name || element.type === "file") return;
    element.value = experience[element.name] ?? "";
  });
};

adminExperienceList.addEventListener("click", (event) => {
  const button = event.target.closest("[data-experience-id]");
  if (!button) return;
  selectedExperienceId = button.dataset.experienceId;
  renderExperienceList();
  fillExperienceForm();
});

$("#newExperienceButton").addEventListener("click", () => {
  selectedExperienceId = "";
  adminExperienceForm.reset();
  adminExperienceForm.elements.id.value = "";
  adminExperienceForm.elements.status.value = "published";
});

adminExperienceForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!requireAuth()) return;
  const data = new FormData(event.currentTarget);
  const imageFile = data.get("imageFile");
  const uploaded = imageFile instanceof File && imageFile.size ? await fileToDataUrl(imageFile, 16 / 9) : "";
  const experience = {
    id: String(data.get("id") || `experience-${Date.now().toString(36)}`),
    status: String(data.get("status") || "published"),
    tag: String(data.get("tag") || "").trim(),
    title: String(data.get("title") || "").trim(),
    body: String(data.get("body") || "").trim(),
    image: uploaded || String(data.get("image") || fallbackImage),
  };
  const experiences = readExperiences();
  const index = experiences.findIndex((item) => item.id === experience.id);
  if (index >= 0) experiences[index] = experience;
  else experiences.push(experience);
  selectedExperienceId = experience.id;
  localStorage.setItem(EXPERIENCES_MANUAL_EDIT_KEY, "1");
  writeExperiences(experiences);
  renderExperiencesAdmin();
  const status = $(".experience-status");
  status.textContent = "已儲存經歷，正在發布到公開頁...";
  await publishSiteData(status, "已儲存經歷，並發布到公開頁。");
});

$("#deleteExperienceButton").addEventListener("click", async () => {
  if (!requireAuth()) return;
  if (!selectedExperienceId) return;
  const experiences = readExperiences().filter((item) => item.id !== selectedExperienceId);
  selectedExperienceId = experiences[0]?.id || "";
  localStorage.setItem(EXPERIENCES_MANUAL_EDIT_KEY, "1");
  writeExperiences(experiences);
  renderExperiencesAdmin();
  await publishSiteData($(".experience-status"), "已刪除經歷，並同步發布到公開頁。");
});

const renderExperiencesAdmin = () => {
  renderExperienceList();
  fillExperienceForm();
};

const renderTestimonialList = () => {
  const testimonials = readTestimonials();
  if (!selectedTestimonialId && testimonials[0]) selectedTestimonialId = testimonials[0].id;
  adminTestimonialList.innerHTML = testimonials
    .map(
      (item) => `
        <button
          type="button"
          draggable="true"
          class="${item.id === selectedTestimonialId ? "is-active" : ""}"
          data-testimonial-id="${escapeHtml(item.id)}"
        >
          <span class="drag-grip" aria-hidden="true"></span>
          <span class="testimonial-list-copy">
            <strong>${escapeHtml(item.title)}</strong>
            <small>${escapeHtml(item.tag || "未分類")}｜${item.status === "published" ? "已上架" : "草稿"}</small>
          </span>
        </button>
      `,
    )
    .join("");
};

const clearTestimonialDropHints = () => {
  adminTestimonialList
    .querySelectorAll(".is-drop-before, .is-drop-after")
    .forEach((element) => element.classList.remove("is-drop-before", "is-drop-after"));
};

const clearTestimonialDragState = () => {
  clearTestimonialDropHints();
  adminTestimonialList
    .querySelectorAll(".is-dragging")
    .forEach((element) => element.classList.remove("is-dragging"));
};

const fillTestimonialForm = () => {
  const testimonial = readTestimonials().find((item) => item.id === selectedTestimonialId) || {};
  [...adminTestimonialForm.elements].forEach((element) => {
    if (!element.name || element.type === "file") return;
    element.value = testimonial[element.name] ?? "";
  });
};

adminTestimonialList.addEventListener("click", (event) => {
  const button = event.target.closest("[data-testimonial-id]");
  if (!button) return;
  selectedTestimonialId = button.dataset.testimonialId;
  renderTestimonialList();
  fillTestimonialForm();
});

adminTestimonialList.addEventListener("dragstart", (event) => {
  const button = event.target.closest("[data-testimonial-id]");
  if (!button) return;
  draggedTestimonialId = button.dataset.testimonialId;
  selectedTestimonialId = draggedTestimonialId;
  button.classList.add("is-dragging");
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", draggedTestimonialId);
  }
});

adminTestimonialList.addEventListener("dragover", (event) => {
  if (!draggedTestimonialId) return;
  const button = event.target.closest("[data-testimonial-id]");
  if (!button || button.dataset.testimonialId === draggedTestimonialId) return;
  event.preventDefault();
  const rect = button.getBoundingClientRect();
  const isAfter = event.clientY > rect.top + rect.height / 2;
  clearTestimonialDropHints();
  button.classList.add(isAfter ? "is-drop-after" : "is-drop-before");
});

adminTestimonialList.addEventListener("drop", async (event) => {
  if (!draggedTestimonialId) return;
  const button = event.target.closest("[data-testimonial-id]");
  clearTestimonialDropHints();
  if (!button || button.dataset.testimonialId === draggedTestimonialId || !requireAuth()) {
    draggedTestimonialId = "";
    return;
  }
  event.preventDefault();
  const targetId = button.dataset.testimonialId;
  const testimonials = readTestimonials();
  const fromIndex = testimonials.findIndex((item) => item.id === draggedTestimonialId);
  let toIndex = testimonials.findIndex((item) => item.id === targetId);
  if (fromIndex < 0 || toIndex < 0) {
    draggedTestimonialId = "";
    return;
  }
  const rect = button.getBoundingClientRect();
  const insertAfter = event.clientY > rect.top + rect.height / 2;
  const [moved] = testimonials.splice(fromIndex, 1);
  if (fromIndex < toIndex) toIndex -= 1;
  testimonials.splice(insertAfter ? toIndex + 1 : toIndex, 0, moved);
  selectedTestimonialId = moved.id;
  draggedTestimonialId = "";
  localStorage.setItem(TESTIMONIALS_MANUAL_EDIT_KEY, "1");
  writeTestimonials(testimonials);
  renderTestimonialsAdmin();
  const status = $(".testimonial-status");
  status.textContent = "順序已更新，正在發布到公開頁...";
  await publishSiteData(status, "見證順序已更新，並發布到公開頁。");
});

adminTestimonialList.addEventListener("dragend", () => {
  draggedTestimonialId = "";
  clearTestimonialDragState();
});

$("#newTestimonialButton").addEventListener("click", () => {
  selectedTestimonialId = "";
  adminTestimonialForm.reset();
  adminTestimonialForm.elements.id.value = "";
  adminTestimonialForm.elements.status.value = "published";
});

adminTestimonialForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!requireAuth()) return;
  const data = new FormData(event.currentTarget);
  const imageFile = data.get("imageFile");
  const uploaded = imageFile instanceof File && imageFile.size ? await fileToDataUrl(imageFile, 16 / 9) : "";
  const testimonial = {
    id: String(data.get("id") || `testimonial-${Date.now().toString(36)}`),
    status: String(data.get("status") || "published"),
    tag: String(data.get("tag") || "").trim(),
    title: String(data.get("title") || "").trim(),
    body: String(data.get("body") || "").trim(),
    image: uploaded || String(data.get("image") || fallbackImage),
  };
  const testimonials = readTestimonials();
  const index = testimonials.findIndex((item) => item.id === testimonial.id);
  if (index >= 0) testimonials[index] = testimonial;
  else testimonials.push(testimonial);
  selectedTestimonialId = testimonial.id;
  restoreTestimonialId(testimonial.id);
  localStorage.setItem(TESTIMONIALS_MANUAL_EDIT_KEY, "1");
  writeTestimonials(testimonials);
  renderTestimonialsAdmin();
  const status = $(".testimonial-status");
  status.textContent = "已儲存見證，正在發布到公開頁...";
  await publishSiteData(status, "已儲存見證，並發布到公開頁。");
});

$("#deleteTestimonialButton").addEventListener("click", async () => {
  if (!requireAuth()) return;
  if (!selectedTestimonialId) return;
  markTestimonialDeleted(selectedTestimonialId);
  const testimonials = readTestimonials().filter((item) => item.id !== selectedTestimonialId);
  selectedTestimonialId = testimonials[0]?.id || "";
  localStorage.setItem(TESTIMONIALS_MANUAL_EDIT_KEY, "1");
  writeTestimonials(testimonials);
  renderTestimonialsAdmin();
  const status = $(".testimonial-status");
  status.textContent = "已刪除見證，正在發布到公開頁...";
  await publishSiteData(status, "已刪除見證，並同步發布到公開頁。");
});

const renderTestimonialsAdmin = () => {
  renderTestimonialList();
  fillTestimonialForm();
};

const renderRegistrations = () => {
  const registrations = readRegistrations();
  $("#emptyRegistrations").classList.toggle("is-visible", !registrations.length);
  $("#registrationRows").innerHTML = registrations
    .map(
      (item) => `
        <tr>
          <td>${escapeHtml(item.memberName)}</td>
          <td>${escapeHtml(item.email)}</td>
          <td>${escapeHtml(item.phone)}</td>
          <td>${escapeHtml(item.note)}</td>
          <td>${escapeHtml(item.createdAt ? new Date(item.createdAt).toLocaleString("zh-TW") : "")}</td>
        </tr>
      `,
    )
    .join("");
};

$("#exportRegistrationsButton").addEventListener("click", () => {
  if (!requireAuth()) return;
  const rows = [["姓名", "Email", "手機", "備註", "時間"], ...readRegistrations().map((item) => [item.memberName, item.email, item.phone, item.note, item.createdAt])];
  downloadText("hana-registrations.csv", rows.map((row) => row.map((cell) => `"${String(cell || "").replaceAll('"', '""')}"`).join(",")).join("\n"));
});

const downloadText = (filename, text) => {
  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
};

$("#exportBackupButton").addEventListener("click", () => {
  if (!requireAuth()) return;
  downloadText(
    "hana-site-backup.json",
    JSON.stringify(
      {
        content: readContent(),
        courses: readCourses(),
        deletedCourses: [...readDeletedCourseIds()],
        coaching: readCoachingOffers(),
        experiences: readExperiences(),
        contentPosts: readContentPosts(),
        deletedContentPosts: [...readDeletedContentPostIds()],
        testimonials: readTestimonials(),
        deletedTestimonials: [...readDeletedTestimonialIds()],
        registrations: readRegistrations(),
        exportedAt: new Date().toISOString(),
      },
      null,
      2,
    ),
  );
});

$("#importBackupInput").addEventListener("change", async (event) => {
  if (!requireAuth()) return;
  const file = event.currentTarget.files?.[0];
  if (!file) return;
  const backup = JSON.parse(await file.text());
  if (backup.content) writeContent(backup.content);
  if (backup.courses) writeCourses(backup.courses);
  if (backup.deletedCourses) writeDeletedCourseIds(new Set(backup.deletedCourses));
  if (backup.coaching) writeCoachingOffers(backup.coaching);
  if (backup.experiences) writeExperiences(backup.experiences);
  if (backup.contentPosts) writeContentPosts(backup.contentPosts);
  if (backup.deletedContentPosts) writeDeletedContentPostIds(new Set(backup.deletedContentPosts));
  if (backup.testimonials) writeTestimonials(backup.testimonials);
  if (backup.deletedTestimonials) writeDeletedTestimonialIds(new Set(backup.deletedTestimonials));
  if (backup.registrations) writeJson(REGISTRATIONS_KEY, backup.registrations);
  renderDashboard();
  await publishSiteData(null);
});

const renderDashboard = () => {
  renderContentTabs();
  renderContentForm();
  renderCourses();
  renderContentShareAdmin();
  renderCoachingAdmin();
  renderExperiencesAdmin();
  renderTestimonialsAdmin();
  renderRegistrations();
  const hasSupabase = Boolean(window.HANA_CONFIG?.supabaseUrl && window.HANA_CONFIG?.supabaseAnonKey);
  $("#storageModeText").textContent = hasSupabase
    ? "Supabase 設定已存在，可進一步切換為雲端資料模式。"
    : "目前使用本機後台 + GitHub Pages 免費發布：每次儲存後會更新公開頁資料檔；完成 GitHub 上線設定後會自動推送。";
};

refreshAuth();
