import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

const siteUrl = "https://busanmassage.netlify.app";
const brand = "부산달리기";
const phone = "0508-202-4683";
const tel = "tel:05082024683";

const areas = {
  "부산": {
    "해운대구": ["우동", "중동", "좌동", "송정동", "반여동", "반송동", "재송동"],
    "부산진구": ["부전동", "전포동", "양정동", "범천동", "가야동", "개금동", "초읍동", "연지동"],
    "동래구": ["수안동", "복천동", "명륜동", "온천동", "사직동", "안락동", "명장동"],
    "남구": ["대연동", "용호동", "용당동", "문현동", "감만동", "우암동"],
    "수영구": ["남천동", "수영동", "망미동", "광안동", "민락동"],
    "연제구": ["거제동", "연산동"],
    "사하구": ["괴정동", "당리동", "하단동", "신평동", "장림동", "다대동", "감천동"],
    "북구": ["구포동", "금곡동", "화명동", "덕천동", "만덕동"],
    "금정구": ["장전동", "부곡동", "서동", "금사동", "구서동", "남산동", "청룡동"],
    "사상구": ["삼락동", "모라동", "덕포동", "괘법동", "감전동", "주례동", "학장동", "엄궁동"],
    "강서구": ["대저동", "강동동", "명지동", "가락동", "녹산동", "가덕도동"],
    "기장군": ["기장읍", "장안읍", "정관읍", "일광읍", "철마면"],
  },
  "경남": {
    "김해시": ["내외동", "북부동", "활천동", "삼안동", "불암동", "장유동", "진영읍", "주촌면", "한림면"],
    "양산시": ["물금읍", "동면", "원동면", "상북면", "하북면", "중앙동", "양주동", "삼성동", "강서동", "서창동", "소주동", "평산동", "덕계동"],
    "창원시": ["의창구", "성산구", "마산합포구", "마산회원구", "진해구", "중앙동", "상남동", "용호동", "팔용동", "합성동", "석전동", "경화동"],
  },
};

const massageTypes = ["타이마사지", "아로마 마사지", "스웨디시 마사지", "VIP 마사지"];
const priceRows = [
  ["타이(건식)", "90분 70,000", "120분 80,000", "150분 문의"],
  ["아로마(습식)", "90분 80,000", "120분 100,000", "150분 문의"],
  ["VIP 스페셜", "90분 문의", "120분 100,000", "150분 130,000"],
  ["시크릿 코스", "가격 전화 문의", "안내 24시간 상담", "예약 후불제"],
];

const css = `:root{--bg:#050505;--panel:#111;--panel2:#151515;--text:#fff;--muted:#bdbdbd;--line:#2b2b2b;--orange:#ff7a1a;--orange2:#ff9b3d}*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:var(--bg);color:var(--text);font-family:Arial,"Malgun Gothic",sans-serif}a{color:inherit;text-decoration:none}.topbar{position:sticky;top:0;z-index:20;background:rgba(5,5,5,.94);border-bottom:1px solid var(--line);backdrop-filter:blur(12px)}.top-inner{width:min(1180px,calc(100% - 32px));margin:0 auto;padding:14px 0;display:flex;align-items:center;justify-content:space-between}.brand{display:flex;align-items:center;gap:10px;font-size:21px;font-weight:900}.brand-mark{display:grid;place-items:center;width:38px;height:38px;border-radius:8px;background:linear-gradient(135deg,var(--orange),#ff4f1f);color:#fff}.nav{display:flex;gap:18px;font-size:14px}.call-btn,.primary-btn{display:inline-flex;align-items:center;justify-content:center;min-height:42px;border-radius:8px;background:var(--orange);padding:0 16px;font-weight:900}.section{width:min(1180px,calc(100% - 32px));margin:0 auto;padding:48px 0}.hero{display:grid;grid-template-columns:minmax(0,1.08fr) minmax(340px,.92fr);gap:32px;align-items:center;min-height:590px}.eyebrow{margin:0 0 12px;color:var(--orange);font-weight:900}h1{font-size:clamp(42px,7vw,76px);line-height:1.05;margin:0}h2{font-size:34px;margin:0 0 18px;color:var(--orange)}h3{font-size:22px;margin:0 0 12px;color:#fff}.lead{color:var(--muted);font-size:18px;line-height:1.75}.hero-actions{display:flex;flex-wrap:wrap;gap:10px;margin-top:24px}.outline-btn{display:inline-flex;align-items:center;justify-content:center;min-height:42px;border:1px solid var(--line);border-radius:8px;padding:0 16px;font-weight:900}.panel,.card,.price-card{border:1px solid var(--line);border-radius:14px;background:var(--panel);padding:22px}.grid-2{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}.grid-3{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px}.grid-4{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px}.region-card h3,.area-card h3,.dong-link strong,.type-card h3,.price-card h3{color:var(--orange)}.muted,.card p,.price-card p{color:var(--muted);line-height:1.7}.link-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px}.dong-link{display:flex;justify-content:space-between;align-items:center;border:1px solid #3a2a1d;border-radius:12px;background:linear-gradient(180deg,#171717,#0f0f0f);padding:15px 16px;font-weight:900}.dong-link:after{content:'›';color:var(--orange2);font-size:22px}.price-row{display:flex;justify-content:space-between;border-bottom:1px dashed #333;padding:10px 0}.shop-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:14px}.shop-card{aspect-ratio:1/1;border:1px solid var(--line);border-radius:14px;background:linear-gradient(180deg,#151515,#0d0d0d);padding:18px;display:flex;flex-direction:column;justify-content:space-between}.shop-card span{color:var(--orange2);font-size:13px;font-weight:900}.footer{border-top:1px solid var(--line);margin-top:48px;background:#070707}.footer-inner{width:min(1180px,calc(100% - 32px));margin:0 auto;padding:34px 0;display:grid;grid-template-columns:1.1fr .9fr;gap:24px}.footer p{color:var(--muted);line-height:1.7}.footer-links{grid-column:1/-1;display:flex;flex-wrap:wrap;gap:8px;border-top:1px solid #222;padding-top:18px}.footer-links a{border:1px solid #33261b;border-radius:999px;padding:8px 12px;color:#e8e8e8;font-size:13px;font-weight:800}.mobile-call{display:none}@media(max-width:1000px){.hero,.grid-2,.grid-3,.grid-4,.shop-grid{grid-template-columns:1fr 1fr}.link-grid{grid-template-columns:repeat(2,1fr)}}@media(max-width:760px){.nav{display:none}.hero,.grid-2,.grid-3,.grid-4,.shop-grid,.link-grid,.footer-inner{grid-template-columns:1fr}body{padding-bottom:82px}.mobile-call{position:fixed;left:12px;right:12px;bottom:12px;z-index:50;display:flex;align-items:center;justify-content:center;gap:10px;min-height:58px;border-radius:8px;background:var(--orange);font-weight:900}.section{padding:36px 0}h1{font-size:40px}}`;

function enc(value) { return encodeURIComponent(value); }
function pathFor(...parts) { return parts.map(enc).join("/"); }
function write(path, html) { const file = join("out", path); mkdirSync(dirname(file), { recursive: true }); writeFileSync(file, html, "utf8"); }
function stripSuffix(value) { return value.replace(/시$|구$|군$|읍$|면$|동$/g, ""); }

function nav() {
  return `<header class="topbar"><div class="top-inner"><a class="brand" href="/"><span class="brand-mark">B</span>${brand}</a><nav class="nav"><a href="/#price">요금표</a><a href="/#types">마사지 종류</a><a href="/#areas">지역선택</a><a href="/blog/">블로그</a><a href="/#faq">FAQ</a><a href="${tel}">전화예약</a></nav><a class="call-btn" href="${tel}">${phone}</a></div></header>`;
}

function seoTags(title, description, url) {
  const canonical = `${siteUrl}${url}`;
  const data = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: title,
    description,
    url: canonical,
    inLanguage: "ko-KR",
    publisher: { "@type": "Organization", name: brand, url: siteUrl, telephone: phone },
  };
  return `<title>${title}</title><meta name="description" content="${description}"><link rel="canonical" href="${canonical}"><meta name="robots" content="index,follow,max-snippet:-1,max-image-preview:large"><meta property="og:site_name" content="${brand}"><meta property="og:title" content="${title}"><meta property="og:description" content="${description}"><meta property="og:url" content="${canonical}"><meta name="twitter:card" content="summary"><script type="application/ld+json">${JSON.stringify(data)}</script>`;
}

function layout({ title, description, url, body }) {
  return `<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">${seoTags(title, description, url)}<style>${css}</style></head><body>${nav()}${body}${footer()}<a class="mobile-call" href="${tel}"><span>전화예약</span><strong>${phone}</strong></a></body></html>`;
}

function footer() {
  const links = [
    ["해운대 출장마사지", "/area/부산/해운대구/"],
    ["서면 출장마사지", "/area/부산/부산진구/"],
    ["김해 출장마사지", "/area/경남/김해시/"],
    ["양산 출장마사지", "/area/경남/양산시/"],
    ["창원 출장마사지", "/area/경남/창원시/"],
  ];
  return `<footer class="footer"><div class="footer-inner"><section><strong class="brand"><span class="brand-mark">B</span>${brand}</strong><p>${brand}는 부산 전 지역과 경남 김해시, 양산시, 창원시 출장마사지와 홈타이 가능 지역을 행정구와 행정동 기준으로 정리하는 예약 안내 플랫폼입니다.</p></section><section><div class="card"><h3>고객센터</h3><p><a href="${tel}">${phone}</a><br>운영시간 오전 11시 ~ 익일 오전 8시<br>연중무휴</p></div></section><nav class="footer-links" aria-label="인기 지역 링크">${links.map(([label, href]) => `<a href="${href.split('/').map((part, i) => i > 1 ? enc(part) : part).join('/')}">${label}</a>`).join("")}<a href="/sitemap.xml">사이트맵</a></nav></div></footer>`;
}

function priceCards() {
  return priceRows.map(([title, ...rows]) => `<article class="price-card"><h3>${title}</h3>${rows.map((row) => { const [label, ...price] = row.split(" "); return `<div class="price-row"><span>${label}</span><strong>${price.join(" ")}</strong></div>`; }).join("")}</article>`).join("");
}

function typeCards() {
  return massageTypes.map((type) => `<article class="type-card card"><h3>${type}</h3><p>${type}는 지역, 시간대, 관리사 배정 상황에 따라 운영 범위가 달라질 수 있습니다. 예약 전 코스 시간, 요금, 관리 범위, 추가 비용 여부를 상담으로 확인하세요.</p></article>`).join("");
}

function areaSummary(region, district, dong = "") {
  const place = dong || district || region;
  return `${place} 지역은 상권, 주거지, 숙소 이용 흐름에 따라 방문 가능 시간과 업체 배정 상황이 달라질 수 있습니다. ${brand}는 예약 전 요금, 코스, 가능 시간, 주의사항을 먼저 확인할 수 있도록 안내합니다.`;
}

function shops(place) {
  const names = ["프리미엄 홈타이", "힐링 아로마", "VIP 방문케어", "시그니처 케어"];
  return `<section class="section"><h2>${place} 추천 업체</h2><div class="shop-grid">${names.map((name, index) => `<article class="shop-card"><div><span>${["빠른 상담", "후불 안내", "관리사 확인", "코스 비교"][index]}</span><h3>${place} ${name}</h3></div><p class="muted">상담 후 가능 시간, 코스 상세, 요금, 방문 조건을 확인할 수 있습니다.</p></article>`).join("")}</div></section>`;
}

const regionCards = Object.entries(areas).map(([region, districts]) => `<a class="region-card card" href="/area/${enc(region)}/"><h3>${region} 출장마사지</h3><p>${region} 지역의 2차 지역과 3차 세부 지역을 확인하세요. 대표 지역: ${Object.keys(districts).slice(0, 4).join(", ")}</p></a>`).join("");

const home = `<main><section class="section hero"><div><p class="eyebrow">부산 · 경남 출장마사지 홈타이 안내</p><h1>${brand} 출장마사지 & 홈타이</h1><p class="lead">${brand}는 부산 전 지역과 경남 김해시, 양산시, 창원시 출장마사지 가능 지역을 1차, 2차, 3차 지역 기준으로 정리합니다. 요금표, 마사지 종류, 예약 전 확인사항, 주의사항을 한 번에 확인하세요.</p><div class="hero-actions"><a class="primary-btn" href="/area/${enc("부산")}/">부산 지역 보기</a><a class="outline-btn" href="/area/${enc("경남")}/">경남 지역 보기</a><a class="outline-btn" href="${tel}">${phone}</a></div></div><div class="panel"><h2>빠른 지역 선택</h2><div class="grid-2">${regionCards}</div></div></section><section class="section" id="areas"><h2>서비스 지역</h2><div class="grid-3">${Object.entries(areas).flatMap(([region, districts]) => Object.keys(districts).slice(0, 6).map((district) => `<a class="area-card card" href="/area/${pathFor(region, district)}/"><h3>${district}</h3><p>${region} ${district} 출장마사지와 홈타이 가능 지역을 세부 지역 기준으로 확인하세요.</p></a>`)).join("")}</div></section><section class="section" id="price"><h2>마사지 코스 및 요금</h2><div class="grid-4">${priceCards()}</div></section><section class="section" id="types"><h2>마사지 종류</h2><div class="grid-4">${typeCards()}</div></section><section class="section" id="faq"><h2>자주 묻는 질문</h2><div class="grid-3"><article class="card"><h3>바로 예약 가능한가요?</h3><p>지역과 시간대에 따라 달라지며 전화 상담으로 가능 여부를 확인합니다.</p></article><article class="card"><h3>요금은 고정인가요?</h3><p>기본 요금표는 안내 기준이며 지역, 시간, 코스에 따라 달라질 수 있습니다.</p></article><article class="card"><h3>주의사항은?</h3><p>불법 서비스는 등록과 노출을 허용하지 않으며 합법 웰니스 방문 관리 기준으로 안내합니다.</p></article></div></section></main>`;
write("index.html", layout({ title: `${brand} | 부산 출장마사지 홈타이 경남 김해 양산 창원`, description: `${brand} 부산 출장마사지와 홈타이, 경남 김해시 양산시 창원시 지역별 예약 안내. 요금표, 마사지 종류, 주의사항 정리.`, url: "/", body: home }));

for (const [region, districts] of Object.entries(areas)) {
  const districtLinks = Object.keys(districts).map((district) => `<a class="area-card card" href="/area/${pathFor(region, district)}/"><h3>${district}</h3><p>${areaSummary(region, district)}</p></a>`).join("");
  const body = `<main><section class="section"><p class="eyebrow">1차 지역</p><h1>${region} 출장마사지 홈타이</h1><p class="lead">${region} 지역의 2차 지역을 선택하세요. 각 지역 페이지에서 세부 3차 지역과 예약 전 확인사항을 볼 수 있습니다.</p></section><section class="section"><h2>${region} 2차 지역 선택</h2><div class="grid-3">${districtLinks}</div></section></main>`;
  write(`area/${region}/index.html`, layout({ title: `${region} 출장마사지 홈타이 | ${brand}`, description: `${region} 출장마사지와 홈타이 가능 2차 지역, 요금표, 예약 전 확인사항 안내.`, url: `/area/${enc(region)}/`, body }));

  for (const [district, dongs] of Object.entries(districts)) {
    const dongLinks = dongs.map((dong) => `<a class="dong-link" href="/area/${pathFor(region, district, dong)}/"><strong>${dong}</strong></a>`).join("");
    const body2 = `<main><section class="section"><p class="eyebrow">2차 지역</p><h1>${region} ${district} 출장마사지 홈타이</h1><p class="lead">${areaSummary(region, district)} 아래에서 ${district} 세부 지역을 선택하세요.</p></section><section class="section"><h2>${district} 3차 지역 선택</h2><div class="link-grid">${dongLinks}</div></section><section class="section"><h2>${district} 마사지 코스 및 요금</h2><div class="grid-4">${priceCards()}</div></section></main>`;
    write(`area/${region}/${district}/index.html`, layout({ title: `${region} ${district} 출장마사지 홈타이 | ${brand}`, description: `${region} ${district} 출장마사지, 홈타이 예약 시간과 요금표, 세부 지역 안내.`, url: `/area/${pathFor(region, district)}/`, body: body2 }));

    for (const dong of dongs) {
      const place = `${dong}`;
      const info = `<section class="section"><div class="grid-2"><article class="card"><h2>공지사항</h2><p>${place} 예약은 시간대와 업체 배정 상황에 따라 가능 여부가 달라질 수 있습니다. 예약 전 총 금액, 코스 시간, 추가 요금 여부를 확인하세요.</p></article><article class="card"><h2>업체소개</h2><p>${brand}는 ${region} ${district} ${place} 주변 출장마사지와 홈타이 가능 업체를 비교하기 쉽게 정리하는 안내 플랫폼입니다.</p></article><article class="card"><h2>관리사정보</h2><p>관리사 성별, 경력, 코스 가능 여부는 업체별 배정 상황에 따라 달라지므로 상담 단계에서 확인합니다.</p></article><article class="card"><h2>주의사항</h2><p>불법 성매매, 유사 성행위, 미성년자 관련 서비스는 등록과 노출을 허용하지 않습니다. 부적절한 요청 시 상담이 중단될 수 있습니다.</p></article></div></section>`;
      const body3 = `<main><section class="section"><p class="eyebrow">3차 지역</p><h1>${region} ${district} ${place} 출장마사지 홈타이</h1><p class="lead">${areaSummary(region, district, place)} 전화 상담으로 가능 시간, 요금, 코스 범위, 관리사 배정 상황을 확인하세요.</p><div class="hero-actions"><a class="primary-btn" href="${tel}">전화예약</a><a class="outline-btn" href="/#price">요금표 보기</a></div></section><section class="section"><h2>${place} 마사지 코스 및 요금</h2><div class="grid-4">${priceCards()}</div></section>${shops(place)}${info}</main>`;
      write(`area/${region}/${district}/${dong}/index.html`, layout({ title: `${region} ${district} ${place} 출장마사지 홈타이 | ${brand}`, description: `${region} ${district} ${place} 출장마사지와 홈타이 예약 시간, 요금표, 추천 업체, 주의사항 안내.`, url: `/area/${pathFor(region, district, dong)}/`, body: body3 }));
    }
  }
}

const urls = ["/", ...Object.entries(areas).flatMap(([region, districts]) => [`/area/${enc(region)}/`, ...Object.entries(districts).flatMap(([district, dongs]) => [`/area/${pathFor(region, district)}/`, ...dongs.map((dong) => `/area/${pathFor(region, district, dong)}/`)])])];
const today = new Date().toISOString().slice(0, 10);
write("sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.map((url) => `<url><loc>${siteUrl}${url}</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>${url === "/" ? "1.0" : "0.7"}</priority></url>`).join("")}</urlset>`);
write("robots.txt", `User-agent: Googlebot\nAllow: /\n\nUser-agent: NaverBot\nAllow: /\n\nUser-agent: Yeti\nAllow: /\n\nUser-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`);
write("rss.xml", `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>${brand}</title><link>${siteUrl}/</link><description>부산 경남 출장마사지 홈타이 지역 안내</description><language>ko-KR</language>${urls.slice(0, 80).map((url) => `<item><title>${brand} ${url}</title><link>${siteUrl}${url}</link><guid>${siteUrl}${url}</guid></item>`).join("")}</channel></rss>`);
