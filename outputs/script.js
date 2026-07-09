const toggle = document.querySelector(".nav-toggle");
const nav = document.querySelector(".nav");

toggle?.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("is-open");
  toggle.setAttribute("aria-expanded", String(isOpen));
});

nav?.addEventListener("click", (event) => {
  if (event.target instanceof HTMLAnchorElement) {
    nav.classList.remove("is-open");
    toggle?.setAttribute("aria-expanded", "false");
  }
});

const body = document.body;
const pageSections = [...document.querySelectorAll(".page-section")];
const offlineCourseList = document.querySelector("#offlineCourseList");
const onlineCourseList = document.querySelector("#onlineCourseList");
const courseDetail = document.querySelector("#courseDetail");
const onlineCourseDetail = document.querySelector("#onlineCourseDetail");
const contentShareList = document.querySelector("#contentShareList");
const contentShareDetail = document.querySelector("#contentShareDetail");
const testimonialGrid = document.querySelector("#testimonialGrid");
const coachingOverviewList = document.querySelector("#coachingOverviewList");
const monthlyCoachingList = document.querySelector("#monthlyCoachingList");
const deepCoachingList = document.querySelector("#deepCoachingList");
const experienceCredentialGrid = document.querySelector("#experienceCredentialGrid");

const COURSES_KEY = "hana-site-courses-v1";
const DELETED_COURSES_KEY = "hana-site-courses-deleted-v1";
const TESTIMONIALS_KEY = "hana-site-testimonials-v1";
const DELETED_TESTIMONIALS_KEY = "hana-site-testimonials-deleted-v1";
const TESTIMONIALS_MANUAL_EDIT_KEY = "hana-site-testimonials-manual-edit-v1";
const COACHING_KEY = "hana-site-coaching-v1";
const EXPERIENCES_KEY = "hana-site-experiences-v1";
const CONTENT_POSTS_KEY = "hana-site-content-posts-v1";
const DELETED_CONTENT_POSTS_KEY = "hana-site-content-posts-deleted-v1";
const EXPERIENCES_MANUAL_EDIT_KEY = "hana-site-experiences-manual-edit-v1";
const SELECTED_COURSE_KEY = "hana-site-selected-course-v1";
const SELECTED_CONTENT_POST_KEY = "hana-site-selected-content-post-v1";
const REGISTRATIONS_KEY = "hana-ip-course-registrations-v1";
const SITE_CONTENT_KEY = "hana-site-content-v1";
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

const readDeletedTestimonialIds = () => {
  try {
    const deleted = JSON.parse(localStorage.getItem(DELETED_TESTIMONIALS_KEY) || "[]");
    return new Set(Array.isArray(deleted) ? deleted : []);
  } catch {
    return new Set();
  }
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

const pageRoutes = {
  about: "#about",
  offline: "#offline",
  "course-detail": "#course-detail",
  online: "#online",
  "online-course-detail": "#online-course-detail",
  share: "#share",
  "share-detail": "#share-detail",
  experience: "#experience",
  monthly: "#monthly",
  deep: "#deep",
  consult: "#consult",
};

const homeRoutes = new Set(["", "home"]);

const escapeHtml = (value) =>
  String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

const nl2br = (value) => escapeHtml(value).replaceAll("\n", "<br />");
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
const textFromHtml = (html) => {
  const template = document.createElement("template");
  template.innerHTML = sanitizeArticleHtml(html);
  return (template.content.textContent || "").replace(/\s+/g, " ").trim();
};
const formatPostDate = (value) => {
  if (!value) return "";
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("zh-TW", { year: "numeric", month: "long", day: "numeric" }).format(date);
};
const expertiseBodyUpgrades = {
  "聚焦品牌定位、產品線規劃與銷售漏斗策略。":
    "從品牌定位、產品線規劃、價格策略到銷售漏斗，協助你把「賣產品」升級成「經營品牌資產」，讓流量、內容與成交有清楚路徑。",
  "用官方認證講師的實戰方法，提升 ROI 與客單價。":
    "以官方認證講師的實戰方法，拆解後台數據、關鍵字廣告、商品頁優化與活動節奏，讓廣告預算不只是曝光，而能帶動 ROI、客單價與穩定成交。",
  "建立高毛利結構與續購模型，讓流量更有價值。":
    "不只是做出商品，而是設計可被理解、可被購買、可被續購的方案。從低門檻入口到高價服務，建立高毛利結構與可複製收入模型。",
  "整合社群工具與內容策略，打造能承接成交的流量閉環。":
    "整合社群平台、內容主題與私域工具，打造從被看見、被信任到願意購買的流量閉環，讓斜槓不只是曝光，而是能穩定創造收入。",
};

const highlightExpertiseText = () => {
  const terms = [
    "品牌定位",
    "銷售漏斗",
    "品牌資產",
    "後台數據",
    "ROI",
    "客單價",
    "可被理解、可被購買、可被續購",
    "高毛利",
    "被看見",
    "願意購買",
    "穩定創造收入",
  ];

  document.querySelectorAll('[data-edit^="about.expertise"][data-edit$=".body"]').forEach((element) => {
    const text = expertiseBodyUpgrades[element.textContent.trim()] || element.textContent.trim();
    let html = escapeHtml(text);
    terms.forEach((term) => {
      html = html.replaceAll(escapeHtml(term), `<mark>${escapeHtml(term)}</mark>`);
    });
    element.innerHTML = html;
  });
};

const readCourses = () => {
  try {
    const stored = JSON.parse(localStorage.getItem(COURSES_KEY) || "null");
    const deleted = JSON.parse(localStorage.getItem(DELETED_COURSES_KEY) || "[]");
    const deletedIds = new Set(Array.isArray(deleted) ? deleted : []);
    const source = Array.isArray(stored) ? stored : seedCourses;
    return source.filter((course) => !deletedIds.has(course.id));
  } catch {
    return seedCourses;
  }
};

const writeCourses = (courses) => {
  localStorage.setItem(COURSES_KEY, JSON.stringify(courses));
};

const readTestimonials = () => {
  if (Array.isArray(window.HANA_RECOVERED_TESTIMONIALS) && localStorage.getItem(TESTIMONIALS_MANUAL_EDIT_KEY) !== "1") {
    return window.HANA_RECOVERED_TESTIMONIALS;
  }
  try {
    const stored = JSON.parse(localStorage.getItem(TESTIMONIALS_KEY) || "null");
    const deletedIds = readDeletedTestimonialIds();
    const source = Array.isArray(stored) ? stored : defaultTestimonials();
    return source.filter((item) => !deletedIds.has(item.id));
  } catch {
    return defaultTestimonials();
  }
};

const defaultTestimonials = () => {
  if (Array.isArray(window.HANA_RECOVERED_TESTIMONIALS)) return window.HANA_RECOVERED_TESTIMONIALS;
  const deletedIds = readDeletedTestimonialIds();
  return seedTestimonials.filter((item) => !deletedIds.has(item.id));
};

const readCoachingOffers = () => {
  try {
    const stored = JSON.parse(localStorage.getItem(COACHING_KEY) || "null");
    return Array.isArray(stored) ? stored : seedCoachingOffers;
  } catch {
    return seedCoachingOffers;
  }
};

const readExperiences = () => {
  if (Array.isArray(window.HANA_RECOVERED_EXPERIENCES) && localStorage.getItem(EXPERIENCES_MANUAL_EDIT_KEY) !== "1") {
    return window.HANA_RECOVERED_EXPERIENCES;
  }
  try {
    const stored = JSON.parse(localStorage.getItem(EXPERIENCES_KEY) || "null");
    return Array.isArray(stored) ? stored : defaultExperiences();
  } catch {
    return defaultExperiences();
  }
};

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
      localStorage.setItem(EXPERIENCES_KEY, JSON.stringify(window.HANA_RECOVERED_EXPERIENCES));
      localStorage.removeItem(EXPERIENCES_MANUAL_EDIT_KEY);
    }
    if (Array.isArray(window.HANA_RECOVERED_CONTENT_POSTS)) {
      localStorage.setItem(CONTENT_POSTS_KEY, JSON.stringify(window.HANA_RECOVERED_CONTENT_POSTS));
      localStorage.setItem(
        DELETED_CONTENT_POSTS_KEY,
        JSON.stringify(Array.isArray(window.HANA_RECOVERED_DELETED_CONTENT_POST_IDS) ? window.HANA_RECOVERED_DELETED_CONTENT_POST_IDS : []),
      );
    }
    if (Array.isArray(window.HANA_RECOVERED_TESTIMONIALS)) {
      localStorage.setItem(TESTIMONIALS_KEY, JSON.stringify(window.HANA_RECOVERED_TESTIMONIALS));
      localStorage.setItem(
        DELETED_TESTIMONIALS_KEY,
        JSON.stringify(Array.isArray(window.HANA_RECOVERED_DELETED_TESTIMONIAL_IDS) ? window.HANA_RECOVERED_DELETED_TESTIMONIAL_IDS : []),
      );
      localStorage.removeItem(TESTIMONIALS_MANUAL_EDIT_KEY);
    }
    localStorage.setItem(RESTORE_VERSION_KEY, RESTORE_VERSION);
  } catch {
    // If storage is unavailable, the page still falls back to recovered defaults.
  }
};

const writePublishedJson = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

const hydratePublishedDataOnce = () => {
  const data = window.HANA_PUBLISHED_DATA;
  if (!data || typeof data !== "object" || !data.version) return;
  try {
    if (data.content && typeof data.content === "object") {
      writePublishedJson(SITE_CONTENT_KEY, normalizeExperienceMetrics(data.content));
    }
    if (Array.isArray(data.courses)) writePublishedJson(COURSES_KEY, data.courses);
    if (Array.isArray(data.deletedCourses)) writePublishedJson(DELETED_COURSES_KEY, data.deletedCourses);
    if (Array.isArray(data.coaching)) writePublishedJson(COACHING_KEY, data.coaching);
    if (Array.isArray(data.experiences)) {
      writePublishedJson(EXPERIENCES_KEY, data.experiences);
      localStorage.setItem(EXPERIENCES_MANUAL_EDIT_KEY, "1");
    }
    if (Array.isArray(data.contentPosts)) writePublishedJson(CONTENT_POSTS_KEY, data.contentPosts);
    if (Array.isArray(data.deletedContentPosts)) writePublishedJson(DELETED_CONTENT_POSTS_KEY, data.deletedContentPosts);
    if (Array.isArray(data.testimonials)) {
      writePublishedJson(TESTIMONIALS_KEY, data.testimonials);
      localStorage.setItem(TESTIMONIALS_MANUAL_EDIT_KEY, "1");
    }
    if (Array.isArray(data.deletedTestimonials)) writePublishedJson(DELETED_TESTIMONIALS_KEY, data.deletedTestimonials);
    localStorage.setItem(PUBLISHED_VERSION_KEY, data.version);
  } catch {
    // If storage is unavailable, the page still falls back to in-file defaults.
  }
};

hydrateRecoveredDataOnce();
hydratePublishedDataOnce();

const readContentPosts = () => {
  try {
    const stored = JSON.parse(localStorage.getItem(CONTENT_POSTS_KEY) || "null");
    const deleted = JSON.parse(localStorage.getItem(DELETED_CONTENT_POSTS_KEY) || "[]");
    const deletedIds = new Set(Array.isArray(deleted) ? deleted : []);
    const basePosts = defaultContentPosts();
    const existing = Array.isArray(stored) ? stored.filter((post) => !deletedIds.has(post.id)) : [];
    const existingIds = new Set(existing.map((post) => post.id));
    return [...basePosts.filter((post) => !existingIds.has(post.id) && !deletedIds.has(post.id)), ...existing];
  } catch {
    return defaultContentPosts();
  }
};

const readSiteContent = () => {
  try {
    const content = JSON.parse(localStorage.getItem(SITE_CONTENT_KEY) || "{}");
    return normalizeExperienceMetrics(content);
  } catch {
    return normalizeExperienceMetrics({});
  }
};

const applySiteContent = () => {
  const content = readSiteContent();

  document.querySelectorAll("[data-edit]").forEach((element) => {
    const key = element.dataset.edit;
    if (key && typeof content[key] === "string") element.textContent = content[key];
  });

  document.querySelectorAll("[data-edit-link]").forEach((element) => {
    const key = element.dataset.editLink;
    if (key && typeof content[key] === "string") element.setAttribute("href", content[key]);
  });

  document.querySelectorAll("[data-edit-image]").forEach((element) => {
    const key = element.dataset.editImage;
    if (key && typeof content[key] === "string") element.setAttribute("src", content[key]);
  });

  highlightExpertiseText();
};

const publicCourses = (type) =>
  readCourses().filter((course) => course.type === type && course.status === "published");

const publicContentPosts = () => readContentPosts().filter((post) => post.status === "published");

const formatDate = (course) => {
  if (!course.date) return "日期未定";
  const date = new Date(`${course.date}T${course.startTime || "00:00"}`);
  const formatted = new Intl.DateTimeFormat("zh-TW", {
    month: "long",
    day: "numeric",
    weekday: "short",
  }).format(date);
  return `${formatted} ${course.startTime || ""}${course.endTime ? `–${course.endTime}` : ""}`;
};

const setSelectedCourse = (id) => {
  localStorage.setItem(SELECTED_COURSE_KEY, id);
};

const setSelectedContentPost = (id) => {
  localStorage.setItem(SELECTED_CONTENT_POST_KEY, id);
};

const selectedCourse = (type) => {
  const courses = publicCourses(type);
  const selectedId = localStorage.getItem(SELECTED_COURSE_KEY);
  return courses.find((course) => course.id === selectedId) || courses[0];
};

const selectedContentPost = () => {
  const posts = publicContentPosts();
  const selectedId = localStorage.getItem(SELECTED_CONTENT_POST_KEY);
  return posts.find((post) => post.id === selectedId) || posts[0];
};

const courseCard = (course) => `
  <article class="event-card">
    <div class="course-cover">
      <img src="${escapeHtml(course.image || fallbackImage)}" alt="${escapeHtml(course.title)}" />
    </div>
    <div class="event-card__body">
      <p class="tag">${course.type === "offline" ? "實體課程" : "線上課程"}</p>
      <h3>${escapeHtml(course.title)}</h3>
      <div class="event-card__meta">
        <div><span>日期與時間</span><strong>${escapeHtml(formatDate(course))}</strong></div>
        <div><span>名額</span><strong>${escapeHtml(course.capacity || "名額未定")} 位</strong></div>
        <div><span>講師</span><strong>${escapeHtml(course.teacherName || "涵捺 Hana")}</strong></div>
      </div>
      <a class="event-card__button" href="${course.type === "offline" ? "#course-detail" : "#online-course-detail"}" data-open-course="${escapeHtml(course.id)}">了解完整資訊</a>
    </div>
  </article>
`;

const contentPostCard = (post) => {
  const excerpt = post.subtitle || textFromHtml(post.body).slice(0, 96);
  return `
    <article class="share-card">
      <a href="#share-detail" data-open-content="${escapeHtml(post.id)}">
        <div class="share-card__media">
          <img src="${escapeHtml(post.image || fallbackImage)}" alt="${escapeHtml(post.title)}" />
        </div>
        <div class="share-card__body">
          <div class="share-card__meta">
            <span>${escapeHtml(post.category || "內容分享")}</span>
            ${post.publishedAt ? `<time datetime="${escapeHtml(post.publishedAt)}">${escapeHtml(formatPostDate(post.publishedAt))}</time>` : ""}
          </div>
          <h3>${escapeHtml(post.title)}</h3>
          <p>${escapeHtml(excerpt)}</p>
          <strong>閱讀完整內容</strong>
        </div>
      </a>
    </article>
  `;
};

const renderContentShares = () => {
  if (!contentShareList) return;
  const posts = publicContentPosts();
  contentShareList.innerHTML = posts.length
    ? posts.map(contentPostCard).join("")
    : `<div class="empty-state course-empty">目前尚未新增內容分享。</div>`;
};

const renderContentShareDetail = () => {
  if (!contentShareDetail) return;
  const post = selectedContentPost();
  if (!post) {
    contentShareDetail.innerHTML = `<div class="empty-state">目前尚未新增內容分享。</div>`;
    return;
  }

  contentShareDetail.innerHTML = `
    <article class="share-detail">
      <div class="share-detail__hero">
        <img src="${escapeHtml(post.image || fallbackImage)}" alt="${escapeHtml(post.title)}" />
      </div>
      <div class="share-detail__body">
        <p class="eyebrow">${escapeHtml(post.category || "Content Library")}</p>
        <h2>${escapeHtml(post.title)}</h2>
        <p class="lead">${escapeHtml(post.subtitle || "")}</p>
        ${post.publishedAt ? `<time datetime="${escapeHtml(post.publishedAt)}">${escapeHtml(formatPostDate(post.publishedAt))}</time>` : ""}
        <div class="article-content">${sanitizeArticleHtml(post.body || "")}</div>
      </div>
    </article>
  `;
};

const testimonialCard = (item) => `
  <article>
    <div class="case-media">
      <img src="${escapeHtml(item.image || fallbackImage)}" alt="${escapeHtml(item.title)}" />
    </div>
    <div class="case-body">
      <span>${escapeHtml(item.tag)}</span>
      <h4>${escapeHtml(item.title)}</h4>
      <p>${escapeHtml(item.body)}</p>
    </div>
  </article>
`;

const renderTestimonials = () => {
  if (!testimonialGrid) return;
  const testimonials = readTestimonials().filter((item) => item.status === "published");
  testimonialGrid.innerHTML = testimonials.length
    ? testimonials.map(testimonialCard).join("")
    : `<div class="empty-state course-empty">目前尚未新增見證案例。</div>`;
};

const coachingCard = (offer, compact = false) => `
  <article class="coaching-card ${offer.type === "deep" ? "deep" : ""}">
    <div class="coaching-media">
      <img src="${escapeHtml(offer.image || fallbackImage)}" alt="${escapeHtml(offer.title)}" />
    </div>
    <div class="coaching-card__body">
      <p class="tag">${escapeHtml(offer.tag || (offer.type === "monthly" ? "每月陪跑" : "深度陪跑"))}</p>
      <h3>${escapeHtml(offer.title)}</h3>
      <p>${escapeHtml(offer.description)}</p>
      ${compact ? "" : `<div class="coaching-meta">${offer.duration ? `<span>${escapeHtml(offer.duration)}</span>` : ""}${offer.price ? `<span>${escapeHtml(offer.price)}</span>` : ""}</div>`}
      <a href="${escapeHtml(compact ? `#${offer.type}` : offer.ctaLink || "#consult")}">${escapeHtml(compact ? "查看方案" : offer.ctaText || "預約諮詢")}</a>
    </div>
  </article>
`;

const renderCoachingOffers = () => {
  const offers = readCoachingOffers().filter((offer) => offer.status === "published");
  const monthly = offers.filter((offer) => offer.type === "monthly");
  const deep = offers.filter((offer) => offer.type === "deep");

  if (coachingOverviewList) {
    const overview = [monthly[0], deep[0]].filter(Boolean);
    coachingOverviewList.innerHTML = overview.length
      ? overview.map((offer) => coachingCard(offer, true)).join("")
      : `<div class="empty-state course-empty">目前尚未上架陪跑方案。</div>`;
  }

  if (monthlyCoachingList) {
    monthlyCoachingList.innerHTML = monthly.length
      ? monthly.map((offer) => coachingCard(offer)).join("")
      : `<div class="empty-state course-empty">目前尚未上架每月陪跑方案。</div>`;
  }

  if (deepCoachingList) {
    deepCoachingList.innerHTML = deep.length
      ? deep.map((offer) => coachingCard(offer)).join("")
      : `<div class="empty-state course-empty">目前尚未上架深度陪跑方案。</div>`;
  }
};

const experienceCard = (item) => `
  <article>
    <div class="credential-media">
      <img src="${escapeHtml(item.image || fallbackImage)}" alt="${escapeHtml(item.title)}" />
    </div>
    <p class="tag">${escapeHtml(item.tag)}</p>
    <h3>${escapeHtml(item.title)}</h3>
    <p>${escapeHtml(item.body)}</p>
  </article>
`;

const renderExperiences = () => {
  if (!experienceCredentialGrid) return;
  const experiences = readExperiences().filter((item) => item.status === "published");
  experienceCredentialGrid.innerHTML = experiences.length
    ? experiences.map(experienceCard).join("")
    : `<div class="empty-state course-empty">目前尚未新增相關經歷。</div>`;
};

const renderCourseLists = () => {
  const offline = publicCourses("offline");
  const online = publicCourses("online");

  if (offlineCourseList) {
    offlineCourseList.innerHTML = offline.length
      ? offline.map(courseCard).join("")
      : `<div class="empty-state course-empty">目前尚未上架實體課程。</div>`;
  }

  if (onlineCourseList) {
    onlineCourseList.innerHTML = online.length
      ? online
          .map(
            (course, index) => `
              <article>
                <span>${String(index + 1).padStart(2, "0")}</span>
                <div>
                  <h3>${escapeHtml(course.title)}</h3>
                  <p>${escapeHtml(course.description)}</p>
                  <a class="lecture-link" href="#online-course-detail" data-open-course="${escapeHtml(course.id)}">了解完整資訊</a>
                </div>
              </article>
            `,
          )
          .join("")
      : `<div class="empty-state course-empty">目前尚未上架線上課程。</div>`;
  }
};

const registrationForm = (course) => `
  <form class="registration-form" data-registration-form>
    <div class="registration-heading">
      <p class="eyebrow">Registration</p>
      <h3>會員報名</h3>
    </div>
    <div class="form-grid">
      <label>會員姓名<input name="memberName" autocomplete="name" required /></label>
      <label>會員身份<select name="memberType" required><option>正式會員</option><option>一般學員</option><option>企業團隊</option></select></label>
      <label>Email<input name="email" type="email" autocomplete="email" required /></label>
      <label>手機<input name="phone" autocomplete="tel" required /></label>
      <label class="wide">備註<textarea name="note" rows="4" placeholder="飲食、同行人、其他需求"></textarea></label>
    </div>
    <div class="form-footer">
      <p class="registration-note">送出後會收到報名成功信，並於 48 小時後、課程前三天及課程前一天收到提醒。</p>
      <button class="button primary" type="submit">確認報名</button>
    </div>
    <p class="form-status" role="status"></p>
  </form>
`;

const renderCourseDetail = (type) => {
  const course = selectedCourse(type);
  const target = type === "offline" ? courseDetail : onlineCourseDetail;
  if (!target) return;

  if (!course) {
    target.innerHTML = `<div class="empty-state">目前尚未上架${type === "offline" ? "實體課程" : "線上課程"}。</div>`;
    return;
  }

  const details = `
    <div class="course-detail register-card">
      <div class="course-poster">
        <img src="${escapeHtml(course.image || fallbackImage)}" alt="${escapeHtml(course.title)}" />
      </div>
      <div class="course-info register-copy">
      <p class="eyebrow">Event Details</p>
      <h2>${escapeHtml(course.title)}</h2>
      <div class="detail-table event-facts">
        <div class="event-fact"><span>活動日期</span><strong>${escapeHtml(course.date || "日期未定")}</strong></div>
        <div class="event-fact"><span>開始時間</span><strong>${escapeHtml(course.startTime || "時間未定")}</strong></div>
        <div class="event-fact"><span>結束時間</span><strong>${escapeHtml(course.endTime || "時間未定")}</strong></div>
        <div class="event-fact"><span>名額</span><strong>${escapeHtml(course.capacity || "名額未定")} 位</strong></div>
        <div class="event-fact event-fact-wide wide"><span>${type === "offline" ? "地點" : "線上連結"}</span><strong>${escapeHtml(course.location || "尚未設定")}</strong></div>
        <div class="event-fact event-fact-wide wide"><span>費用</span><strong>${escapeHtml(course.price || "免費")}</strong></div>
      </div>
      <div class="course-agenda event-story">
        <p class="eyebrow event-story-label">課程文案</p>
        <p class="event-story-copy">${nl2br(course.description)}</p>
      </div>
      <div class="course-agenda event-notes">
        <strong>注意事項</strong>
        <span>${nl2br(course.notes || "報名成功後會收到課前通知。")}</span>
      </div>
      ${registrationForm(course)}
      </div>
    </div>
  `;

  target.innerHTML = details;
};

const routeContent = () => {
  const hash = window.location.hash.replace("#", "");
  const pageSelector = pageRoutes[hash];

  pageSections.forEach((section) => section.classList.remove("is-active-page"));

  if (pageSelector) {
    body.classList.add("page-view");
    document.querySelector(pageSelector)?.classList.add("is-active-page");
    if (hash === "course-detail") renderCourseDetail("offline");
    if (hash === "online-course-detail") renderCourseDetail("online");
    if (hash === "share-detail") renderContentShareDetail();
    window.setTimeout(() => window.scrollTo({ top: 0, behavior: "auto" }), 0);
    return;
  }

  if (homeRoutes.has(hash)) {
    body.classList.remove("page-view");
  }
};

document.addEventListener("click", (event) => {
  const openButton = event.target.closest("[data-open-course]");
  if (openButton) setSelectedCourse(openButton.dataset.openCourse);
  const openContentButton = event.target.closest("[data-open-content]");
  if (openContentButton) setSelectedContentPost(openContentButton.dataset.openContent);
});

document.addEventListener("submit", (event) => {
  const form = event.target.closest("[data-registration-form]");
  if (!form) return;
  event.preventDefault();
  const data = new FormData(form);
  const registrations = JSON.parse(localStorage.getItem(REGISTRATIONS_KEY) || "[]");
  registrations.push({
    memberName: data.get("memberName"),
    email: data.get("email"),
    phone: data.get("phone"),
    note: data.get("note"),
    createdAt: new Date().toISOString(),
  });
  localStorage.setItem(REGISTRATIONS_KEY, JSON.stringify(registrations));
  form.reset();
  form.querySelector(".form-status").textContent =
    "展示模式：報名資料已存在此瀏覽器。設定 Supabase/Gmail 後，送出就會自動寄出四封信。";
});

const renderAll = () => {
  applySiteContent();
  renderCourseLists();
  renderTestimonials();
  renderCoachingOffers();
  renderExperiences();
  renderContentShares();
  renderContentShareDetail();
  renderCourseDetail("offline");
  renderCourseDetail("online");
};

window.addEventListener("hashchange", routeContent);
window.addEventListener("storage", (event) => {
  if (
    event.key === SITE_CONTENT_KEY ||
    event.key === COURSES_KEY ||
    event.key === DELETED_COURSES_KEY ||
    event.key === TESTIMONIALS_KEY ||
    event.key === DELETED_TESTIMONIALS_KEY ||
    event.key === COACHING_KEY ||
    event.key === EXPERIENCES_KEY ||
    event.key === CONTENT_POSTS_KEY ||
    event.key === DELETED_CONTENT_POSTS_KEY
  ) {
    renderAll();
  }
});

renderAll();
routeContent();
