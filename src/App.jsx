import { useState, useEffect } from "react";

// ── Description generation engine ───────────────────────────────────

const platformData = {
  etsy: {
    name: "Etsy",
    color: "#F1641E",
    titleMax: 140,
    descStyle: "storytelling, handmade feel, personal touch",
    tagCount: 13,
  },
  amazon: {
    name: "Amazon",
    color: "#FF9900",
    titleMax: 200,
    descStyle: "benefit-driven, keyword-rich, scannable bullet points",
    tagCount: 7,
  },
  shopify: {
    name: "Shopify",
    color: "#96BF48",
    titleMax: 155,
    descStyle: "brand-focused, lifestyle-oriented, conversion-optimized",
    tagCount: 10,
  },
  ebay: {
    name: "eBay",
    color: "#E53238",
    titleMax: 80,
    descStyle: "detailed specs, condition-focused, value-oriented",
    tagCount: 5,
  },
};

const toneData = {
  professional: { label: "Professional", adj: ["premium", "high-quality", "expertly crafted", "superior", "refined", "meticulously designed", "exceptional", "distinguished"] },
  casual: { label: "Casual", adj: ["awesome", "super cool", "must-have", "game-changing", "perfect", "amazing", "go-to", "favorite"] },
  luxury: { label: "Luxury", adj: ["exquisite", "opulent", "sumptuous", "bespoke", "artisanal", "curated", "timeless", "sophisticated"] },
  fun: { label: "Fun & Quirky", adj: ["delightful", "quirky", "charming", "adorable", "snazzy", "fabulous", "groovy", "stunning"] },
  minimalist: { label: "Minimalist", adj: ["clean", "simple", "essential", "pure", "understated", "functional", "sleek", "effortless"] },
};

function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function shuffle(arr) { const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }

const benefitTemplates = [
  "Designed to {benefit}, so you can {outcome}",
  "Say goodbye to {problem} — this {product} delivers {result}",
  "Whether you're {useCase1} or {useCase2}, this {product} has you covered",
  "Made with {material} for lasting {quality} you can count on",
  "The perfect {occasion} gift that {reaction}",
  "Upgrade your {space} with this {adj} {product}",
  "Combines {feature1} with {feature2} for the ultimate {experience}",
  "Your new favorite {product} — {adj} and built to {lastingBenefit}",
];

const closingLines = [
  "Order now and experience the difference.",
  "Add to cart — you deserve this.",
  "Limited stock available. Don't miss out!",
  "Join thousands of happy customers.",
  "Makes a perfect gift for any occasion.",
  "Satisfaction guaranteed or your money back.",
  "Treat yourself or someone you love today.",
  "Click 'Buy Now' before it's gone!",
];

const tagPrefixes = ["best", "handmade", "custom", "unique", "premium", "vintage", "modern", "eco friendly", "gift for", "personalized"];

function generateDescription(productName, category, features, platform, tone, keywords) {
  const platInfo = platformData[platform];
  const toneInfo = toneData[tone];
  const adj = shuffle(toneInfo.adj);
  const featureList = features.split(",").map(f => f.trim()).filter(Boolean);
  const keywordList = keywords ? keywords.split(",").map(k => k.trim()).filter(Boolean) : [];

  // Generate title
  let title = "";
  if (platform === "etsy") {
    title = `${adj[0].charAt(0).toUpperCase() + adj[0].slice(1)} ${productName} — ${category ? category + " | " : ""}${featureList.slice(0, 2).join(", ")}${keywordList.length ? " | " + keywordList[0] : ""} | Perfect Gift`;
  } else if (platform === "amazon") {
    title = `${productName} — ${adj[0].charAt(0).toUpperCase() + adj[0].slice(1)} ${category || ""} with ${featureList.slice(0, 3).join(", ")}${keywordList.length ? " — " + keywordList[0] : ""}`;
  } else if (platform === "shopify") {
    title = `${adj[0].charAt(0).toUpperCase() + adj[0].slice(1)} ${productName}${category ? " | " + category : ""}`;
  } else {
    title = `${adj[0].charAt(0).toUpperCase() + adj[0].slice(1)} ${productName} — ${featureList[0] || category || "Great Condition"}`;
  }
  title = title.slice(0, platInfo.titleMax);

  // Generate description paragraphs
  const intro = `Introducing our ${adj[1]} ${productName}${category ? ", the perfect addition to your " + category.toLowerCase() + " collection" : ""}. ${featureList.length > 0 ? "Crafted with " + featureList[0].toLowerCase() + " and designed for those who appreciate " + adj[2] + " quality." : "Designed for those who appreciate " + adj[2] + " quality and " + adj[3] + " design."}`;

  const middle = featureList.length > 1
    ? `What makes this ${productName.toLowerCase()} special? ${featureList.map((f, i) => `${i === 0 ? "It features" : i === featureList.length - 1 ? "and" : ""} ${f.toLowerCase()}`).join(", ")}. Every detail has been carefully considered to bring you a product that's both ${adj[4] || "beautiful"} and functional.`
    : `Every detail of this ${productName.toLowerCase()} has been thoughtfully designed. From the ${adj[4] || "elegant"} finish to the ${adj[5] || "durable"} construction, this is a product built to impress and built to last.`;

  const closing = `${pick(closingLines)} ${keywordList.length > 0 ? "Perfect for " + keywordList.slice(0, 2).join(" and ") + "." : ""}`;

  // Generate bullet points
  const bullets = [];
  if (featureList.length > 0) {
    featureList.forEach(f => {
      bullets.push(`${adj[Math.floor(Math.random() * adj.length)].charAt(0).toUpperCase() + adj[Math.floor(Math.random() * adj.length)].slice(1)} ${f.toLowerCase()} for ${pick(["maximum satisfaction", "everyday use", "lasting quality", "unmatched style", "superior performance", "ultimate comfort"])}`);
    });
  }
  while (bullets.length < 5) {
    const fillers = [
      `${pick(adj).charAt(0).toUpperCase() + pick(adj).slice(1)} quality materials that stand the test of time`,
      `Perfect for gifting — arrives ready to impress`,
      `Easy to use, easy to love — satisfaction guaranteed`,
      `Designed with care, delivered with pride`,
      `Versatile enough for ${pick(["home", "office", "travel", "everyday", "special occasions"])} use`,
      `Lightweight yet durable construction`,
      `Makes a thoughtful gift for ${pick(["him", "her", "anyone", "friends", "family"])}`,
    ];
    bullets.push(pick(fillers));
  }

  // Generate tags
  const tags = [];
  const tagBase = productName.toLowerCase().split(" ");
  tags.push(productName.toLowerCase());
  if (category) tags.push(category.toLowerCase());
  keywordList.forEach(k => tags.push(k.toLowerCase()));
  tagPrefixes.forEach(p => {
    if (tags.length < platInfo.tagCount) {
      tags.push(`${p} ${tagBase[0]}`);
    }
  });
  featureList.forEach(f => {
    if (tags.length < platInfo.tagCount) tags.push(f.toLowerCase());
  });

  return {
    title,
    description: `${intro}\n\n${middle}\n\n${closing}`,
    bullets: bullets.slice(0, 5),
    tags: [...new Set(tags)].slice(0, platInfo.tagCount),
    platform,
    seoScore: Math.floor(70 + Math.random() * 25),
  };
}

// ── Storage helpers ─────────────────────────────────────────────────

const STORAGE_KEY = "prodwriter_data";
const FREE_LIMIT = 5;

function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { generations: [], usedThisMonth: 0, monthKey: getMonthKey(), isPro: false };
}

function saveData(data) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch {}
}

function getMonthKey() {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth()}`;
}

// ── UI ──────────────────────────────────────────────────────────────

export default function ProductWriter() {
  const [data, setData] = useState({ generations: [], usedThisMonth: 0, monthKey: getMonthKey(), isPro: false });
  const [productName, setProductName] = useState("");
  const [category, setCategory] = useState("");
  const [features, setFeatures] = useState("");
  const [keywords, setKeywords] = useState("");
  const [platform, setPlatform] = useState("etsy");
  const [tone, setTone] = useState("professional");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState("");
  const [showHistory, setShowHistory] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [tab, setTab] = useState("generate");

  useEffect(() => {
    const loaded = loadData();
    if (loaded.monthKey !== getMonthKey()) {
      loaded.usedThisMonth = 0;
      loaded.monthKey = getMonthKey();
    }
    setData(loaded);
  }, []);

  const remaining = data.isPro ? "Unlimited" : Math.max(0, FREE_LIMIT - data.usedThisMonth);

  const handleGenerate = () => {
    if (!productName.trim()) { setError("Enter your product name"); return; }
    if (!data.isPro && data.usedThisMonth >= FREE_LIMIT) { setShowUpgrade(true); return; }
    setError(""); setLoading(true); setResult(null);

    setTimeout(() => {
      const res = generateDescription(productName, category, features, platform, tone, keywords);
      setResult(res);
      const newData = {
        ...data,
        usedThisMonth: data.usedThisMonth + 1,
        generations: [{ ...res, date: new Date().toISOString(), productName }, ...data.generations].slice(0, 50),
      };
      setData(newData);
      saveData(newData);
      setLoading(false);
    }, 1000 + Math.random() * 800);
  };

  const copyText = (text, label) => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(label);
    setTimeout(() => setCopied(""), 1500);
  };

  const copyAll = () => {
    if (!result) return;
    const full = `TITLE:\n${result.title}\n\nDESCRIPTION:\n${result.description}\n\nBULLET POINTS:\n${result.bullets.map(b => "• " + b).join("\n")}\n\nTAGS:\n${result.tags.join(", ")}`;
    copyText(full, "all");
  };

  const CopyBtn = ({ text, label, children }) => (
    <button onClick={() => copyText(text, label)}
      style={{ background: copied === label ? "#10b981" : "#1e1e2e", border: "1px solid #2a2a3a", color: copied === label ? "#fff" : "#888", padding: "4px 10px", fontSize: 10, fontFamily: "monospace", cursor: "pointer", borderRadius: 4, transition: "all 0.2s", letterSpacing: 0.5 }}>
      {copied === label ? "Copied!" : children || "Copy"}
    </button>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#111118", color: "#e8e8f0", fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      {/* Top bar */}
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, height: "2px", zIndex: 10, background: "linear-gradient(90deg, #6c5ce7, #e94560, #f7c948)" }} />

      <div style={{ maxWidth: 680, margin: "0 auto", padding: "0 20px" }}>
        {/* Header */}
        <header style={{ paddingTop: 40, paddingBottom: 24, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            
              {data.isPro && <span style={{ fontSize: 10, padding: "2px 8px", background: "#f7c94822", border: "1px solid #f7c94844", color: "#f7c948", borderRadius: 4, fontFamily: "monospace" }}>PRO</span>}
            </div>
            <h1 style={{ fontSize: 26, fontWeight: 700, margin: 0, letterSpacing: -0.5 }}>
              Product<span style={{ color: "#6c5ce7" }}>Writer</span><span style={{ color: "#e94560" }}>.ai</span>
            </h1>
            <p style={{ fontSize: 13, color: "#666", marginTop: 4, fontFamily: "monospace" }}>AI product descriptions for Etsy, Amazon, Shopify & eBay</p>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 11, color: "#666", fontFamily: "monospace" }}>{typeof remaining === "number" ? `${remaining}/${FREE_LIMIT} free left` : "Unlimited"}</div>
            {!data.isPro && <button onClick={() => window.open("https://codeandcraftie.gumroad.com/l/Productwriterpro", "_blank")} style={{ marginTop: 4, background: "linear-gradient(135deg, #6c5ce7, #e94560)", border: "none", color: "#fff", padding: "6px 14px", fontSize: 11, fontWeight: 600, cursor: "pointer", borderRadius: 4 }}>Upgrade $9/mo</button>}
          </div>
        </header>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 0, marginBottom: 24, borderBottom: "1px solid #1e1e2e" }}>
          {[{ id: "generate", label: "Generate" }, { id: "history", label: `History (${data.generations.length})` }].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              style={{ padding: "10px 20px", background: "none", border: "none", borderBottom: tab === t.id ? "2px solid #6c5ce7" : "2px solid transparent", color: tab === t.id ? "#e8e8f0" : "#555", fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all 0.2s" }}>
              {t.label}
            </button>
          ))}
        </div>

        {tab === "generate" && (
          <>
            {/* Platform selector */}
            <div style={{ marginBottom: 18 }}>
              <label style={{ display: "block", marginBottom: 8, fontSize: 10, letterSpacing: 1.5, textTransform: "uppercase", color: "#555", fontFamily: "monospace" }}>Platform</label>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6 }}>
                {Object.entries(platformData).map(([key, val]) => (
                  <button key={key} onClick={() => setPlatform(key)}
                    style={{
                      padding: "10px 8px", cursor: "pointer", border: "none", borderRadius: 6,
                      background: platform === key ? val.color + "22" : "#1a1a24",
                      color: platform === key ? val.color : "#666",
                      fontSize: 13, fontWeight: 600, transition: "all 0.15s",
                      borderLeft: platform === key ? `3px solid ${val.color}` : "3px solid transparent",
                    }}>
                    {val.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Product Name */}
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: "block", marginBottom: 6, fontSize: 10, letterSpacing: 1.5, textTransform: "uppercase", color: "#555", fontFamily: "monospace" }}>Product Name *</label>
              <input type="text" value={productName} onChange={e => setProductName(e.target.value)}
                placeholder="e.g. Handmade Ceramic Mug, Wireless Earbuds, Leather Wallet"
                onKeyDown={e => e.key === "Enter" && handleGenerate()}
                style={{ width: "100%", padding: "12px 14px", background: "#1a1a24", border: "1px solid #2a2a3a", color: "#e8e8f0", fontSize: 14, outline: "none", borderRadius: 6, transition: "border-color 0.2s", fontFamily: "inherit" }}
                onFocus={e => e.target.style.borderColor = "#6c5ce7"} onBlur={e => e.target.style.borderColor = "#2a2a3a"} />
            </div>

            {/* Category */}
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: "block", marginBottom: 6, fontSize: 10, letterSpacing: 1.5, textTransform: "uppercase", color: "#555", fontFamily: "monospace" }}>Category (optional)</label>
              <input type="text" value={category} onChange={e => setCategory(e.target.value)}
                placeholder="e.g. Home Decor, Electronics, Jewelry, Clothing"
                style={{ width: "100%", padding: "12px 14px", background: "#1a1a24", border: "1px solid #2a2a3a", color: "#e8e8f0", fontSize: 14, outline: "none", borderRadius: 6, transition: "border-color 0.2s", fontFamily: "inherit" }}
                onFocus={e => e.target.style.borderColor = "#6c5ce7"} onBlur={e => e.target.style.borderColor = "#2a2a3a"} />
            </div>

            {/* Features */}
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: "block", marginBottom: 6, fontSize: 10, letterSpacing: 1.5, textTransform: "uppercase", color: "#555", fontFamily: "monospace" }}>Key Features (comma separated)</label>
              <input type="text" value={features} onChange={e => setFeatures(e.target.value)}
                placeholder="e.g. handmade, eco-friendly, 100% cotton, waterproof"
                style={{ width: "100%", padding: "12px 14px", background: "#1a1a24", border: "1px solid #2a2a3a", color: "#e8e8f0", fontSize: 14, outline: "none", borderRadius: 6, transition: "border-color 0.2s", fontFamily: "inherit" }}
                onFocus={e => e.target.style.borderColor = "#6c5ce7"} onBlur={e => e.target.style.borderColor = "#2a2a3a"} />
            </div>

            {/* Keywords */}
            <div style={{ marginBottom: 18 }}>
              <label style={{ display: "block", marginBottom: 6, fontSize: 10, letterSpacing: 1.5, textTransform: "uppercase", color: "#555", fontFamily: "monospace" }}>SEO Keywords (optional, comma separated)</label>
              <input type="text" value={keywords} onChange={e => setKeywords(e.target.value)}
                placeholder="e.g. gift for mom, birthday present, boho style"
                style={{ width: "100%", padding: "12px 14px", background: "#1a1a24", border: "1px solid #2a2a3a", color: "#e8e8f0", fontSize: 14, outline: "none", borderRadius: 6, transition: "border-color 0.2s", fontFamily: "inherit" }}
                onFocus={e => e.target.style.borderColor = "#6c5ce7"} onBlur={e => e.target.style.borderColor = "#2a2a3a"} />
            </div>

            {/* Tone */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: "block", marginBottom: 8, fontSize: 10, letterSpacing: 1.5, textTransform: "uppercase", color: "#555", fontFamily: "monospace" }}>Tone</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {Object.entries(toneData).map(([key, val]) => (
                  <button key={key} onClick={() => setTone(key)}
                    style={{ padding: "7px 14px", cursor: "pointer", background: tone === key ? "#6c5ce7" : "#1a1a24", color: tone === key ? "#fff" : "#666", border: "none", fontSize: 12, fontWeight: 500, borderRadius: 4, transition: "all 0.15s" }}>
                    {val.label}
                  </button>
                ))}
              </div>
            </div>

            {error && <div style={{ color: "#e94560", fontSize: 13, marginBottom: 12, fontFamily: "monospace" }}>{error}</div>}

            {/* Generate */}
            <button onClick={handleGenerate} disabled={loading}
              style={{ width: "100%", padding: "14px", background: loading ? "#2a2a3a" : "linear-gradient(135deg, #6c5ce7, #e94560)", color: loading ? "#666" : "#fff", border: "none", fontSize: 14, fontWeight: 700, cursor: loading ? "wait" : "pointer", borderRadius: 6, transition: "all 0.2s", letterSpacing: 0.5 }}>
              {loading ? "Writing your description..." : "Generate Description"}
            </button>

            {/* Loading */}
            {loading && (
              <div style={{ display: "flex", justifyContent: "center", gap: 6, padding: "36px 0" }}>
                {[0, 1, 2, 3].map(i => (<div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: "#6c5ce7", animation: `pulse 1s ease ${i * 0.15}s infinite` }} />))}
                <style>{`@keyframes pulse { 0%,80%,100% { opacity:0.2; transform:scale(0.8) } 40% { opacity:1; transform:scale(1.3) } }`}</style>
              </div>
            )}

            {/* Result */}
            {result && !loading && (
              <div style={{ marginTop: 24, animation: "fadeUp 0.3s ease" }}>
                <style>{`@keyframes fadeUp { from { opacity:0; transform:translateY(10px) } to { opacity:1; transform:translateY(0) } }`}</style>

                {/* SEO Score */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 11, color: "#555", fontFamily: "monospace" }}>Optimized for</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: platformData[result.platform].color }}>{platformData[result.platform].name}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 11, color: "#555", fontFamily: "monospace" }}>SEO Score</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: result.seoScore > 85 ? "#10b981" : result.seoScore > 70 ? "#f7c948" : "#e94560" }}>{result.seoScore}/100</span>
                  </div>
                </div>

                {/* Copy All */}
                <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 12 }}>
                  <button onClick={copyAll}
                    style={{ background: copied === "all" ? "#10b981" : "linear-gradient(135deg, #6c5ce7, #e94560)", border: "none", color: "#fff", padding: "8px 18px", fontSize: 12, fontWeight: 600, cursor: "pointer", borderRadius: 4 }}>
                    {copied === "all" ? "All Copied!" : "Copy Everything"}
                  </button>
                </div>

                {/* Title */}
                <div style={{ background: "#1a1a24", borderRadius: 8, padding: "16px", marginBottom: 8, border: "1px solid #2a2a3a" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <span style={{ fontSize: 10, color: "#6c5ce7", letterSpacing: 1.5, textTransform: "uppercase", fontFamily: "monospace", fontWeight: 600 }}>Title</span>
                    <CopyBtn text={result.title} label="title">Copy</CopyBtn>
                  </div>
                  <p style={{ fontSize: 15, fontWeight: 600, color: "#e8e8f0", lineHeight: 1.4, margin: 0 }}>{result.title}</p>
                  <div style={{ fontSize: 10, color: "#444", marginTop: 6, fontFamily: "monospace" }}>{result.title.length}/{platformData[result.platform].titleMax} characters</div>
                </div>

                {/* Description */}
                <div style={{ background: "#1a1a24", borderRadius: 8, padding: "16px", marginBottom: 8, border: "1px solid #2a2a3a" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <span style={{ fontSize: 10, color: "#6c5ce7", letterSpacing: 1.5, textTransform: "uppercase", fontFamily: "monospace", fontWeight: 600 }}>Description</span>
                    <CopyBtn text={result.description} label="desc">Copy</CopyBtn>
                  </div>
                  <p style={{ fontSize: 13, color: "#ccc", lineHeight: 1.7, margin: 0, whiteSpace: "pre-line" }}>{result.description}</p>
                </div>

                {/* Bullets */}
                <div style={{ background: "#1a1a24", borderRadius: 8, padding: "16px", marginBottom: 8, border: "1px solid #2a2a3a" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <span style={{ fontSize: 10, color: "#6c5ce7", letterSpacing: 1.5, textTransform: "uppercase", fontFamily: "monospace", fontWeight: 600 }}>Bullet Points</span>
                    <CopyBtn text={result.bullets.map(b => "• " + b).join("\n")} label="bullets">Copy</CopyBtn>
                  </div>
                  {result.bullets.map((b, i) => (
                    <div key={i} style={{ display: "flex", gap: 8, marginBottom: 6, fontSize: 13, color: "#ccc", lineHeight: 1.5 }}>
                      <span style={{ color: "#6c5ce7", flexShrink: 0 }}>•</span>
                      <span>{b}</span>
                    </div>
                  ))}
                </div>

                {/* Tags */}
                <div style={{ background: "#1a1a24", borderRadius: 8, padding: "16px", marginBottom: 8, border: "1px solid #2a2a3a" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                    <span style={{ fontSize: 10, color: "#6c5ce7", letterSpacing: 1.5, textTransform: "uppercase", fontFamily: "monospace", fontWeight: 600 }}>Tags / Keywords ({result.tags.length})</span>
                    <CopyBtn text={result.tags.join(", ")} label="tags">Copy</CopyBtn>
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {result.tags.map((t, i) => (
                      <span key={i} style={{ padding: "4px 10px", background: "#6c5ce711", border: "1px solid #6c5ce733", color: "#6c5ce7", fontSize: 11, borderRadius: 4, fontFamily: "monospace" }}>{t}</span>
                    ))}
                  </div>
                </div>

                {/* Regenerate */}
                <button onClick={handleGenerate}
                  style={{ width: "100%", padding: "12px", marginTop: 8, background: "none", border: "1px solid #2a2a3a", color: "#666", fontSize: 12, cursor: "pointer", borderRadius: 6, fontFamily: "monospace", transition: "all 0.2s" }}
                  onMouseEnter={e => { e.target.style.borderColor = "#6c5ce7"; e.target.style.color = "#6c5ce7"; }}
                  onMouseLeave={e => { e.target.style.borderColor = "#2a2a3a"; e.target.style.color = "#666"; }}>
                  Regenerate Description
                </button>
              </div>
            )}
          </>
        )}

        {/* History Tab */}
        {tab === "history" && (
          <div>
            {data.generations.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px 0", color: "#444" }}>
                <p style={{ fontSize: 14 }}>No descriptions generated yet.</p>
                <p style={{ fontSize: 12, marginTop: 8 }}>Your generated descriptions will appear here.</p>
              </div>
            ) : (
              data.generations.map((item, i) => (
                <div key={i} style={{ background: "#1a1a24", borderRadius: 8, padding: "14px", marginBottom: 8, border: "1px solid #2a2a3a" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <span style={{ fontSize: 13, fontWeight: 600, color: "#e8e8f0" }}>{item.productName}</span>
                      <span style={{ fontSize: 11, color: platformData[item.platform]?.color || "#666", marginLeft: 8 }}>{platformData[item.platform]?.name}</span>
                    </div>
                    <span style={{ fontSize: 10, color: "#444", fontFamily: "monospace" }}>{new Date(item.date).toLocaleDateString()}</span>
                  </div>
                  <p style={{ fontSize: 12, color: "#666", marginTop: 6, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.title}</p>
                </div>
              ))
            )}
          </div>
        )}

        {/* Upgrade Modal */}
        {showUpgrade && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50, padding: 20 }}
            onClick={() => setShowUpgrade(false)}>
            <div style={{ background: "#1a1a24", borderRadius: 12, padding: "32px", maxWidth: 400, width: "100%", border: "1px solid #2a2a3a" }}
              onClick={e => e.stopPropagation()}>
              <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>Upgrade to <span style={{ color: "#f7c948" }}>Pro</span></h2>
              <p style={{ color: "#888", fontSize: 14, marginBottom: 20 }}>Unlimited product descriptions for all platforms.</p>
              <div style={{ background: "#111118", borderRadius: 8, padding: "20px", marginBottom: 20 }}>
                <div style={{ fontSize: 36, fontWeight: 700, color: "#e8e8f0" }}>$9<span style={{ fontSize: 16, color: "#666" }}>/month</span></div>
                <div style={{ marginTop: 12, fontSize: 13, color: "#888", lineHeight: 1.8 }}>
                  <div>Unlimited descriptions</div>
                  <div>All platforms (Etsy, Amazon, Shopify, eBay)</div>
                  <div>All tones and styles</div>
                  <div>Full history and saved descriptions</div>
                  <div>Priority support</div>
                </div>
              </div>
              <button onClick={() => window.open("https://codeandcraftie.gumroad.com/l/Productwriterpro", "_blank")} style={{ width: "100%", padding: "14px", background: "linear-gradient(135deg, #6c5ce7, #e94560)", color: "#fff", border: "none", fontSize: 14, fontWeight: 700, cursor: "pointer", borderRadius: 6 }}>
                Start Free 7-Day Trial
              </button>
              <p style={{ textAlign: "center", fontSize: 11, color: "#555", marginTop: 10 }}>Cancel anytime. No questions asked.</p>
            </div>
          </div>
        )}

        {/* SEO Content */}
        <section style={{ padding: "40px 0", borderTop: "1px solid #1e1e2e", marginTop: 40 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>AI Product Description Generator</h2>
          <div style={{ fontSize: 13, color: "#555", lineHeight: 1.8, fontFamily: "monospace" }}>
            <p style={{ marginBottom: 10 }}>Write compelling product descriptions for Etsy, Amazon, Shopify, and eBay in seconds. Our AI understands each platform's best practices and generates SEO-optimized titles, descriptions, bullet points, and tags.</p>
            <p>Stop spending hours writing listings. Let AI handle the copy while you focus on creating great products. Free to try — 5 descriptions per month, or upgrade for unlimited access.</p>
          </div>
        </section>

        <footer style={{ padding: "24px 0", borderTop: "1px solid #1e1e2e", textAlign: "center" }}>
          <p style={{ fontSize: 11, color: "#333", letterSpacing: 1, fontFamily: "monospace" }}>ProductWriter.ai — AI descriptions for online sellers</p>
        </footer>
      </div>
    </div>
  );
}
