import { mkdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";

const siteUrl = "https://busanmassage.netlify.app";
const brand = "부산달리기";
const phone = "0508-202-4683";
const tel = "tel:05082024683";

const extraAreas = {
  "울산": {
    "남구": ["삼산동", "달동", "신정동", "옥동", "무거동", "선암동", "야음동", "수암동"],
    "중구": ["성남동", "학성동", "반구동", "복산동", "우정동", "태화동", "다운동", "병영동"],
    "동구": ["방어동", "일산동", "화정동", "대송동", "전하동", "남목동"],
    "북구": ["농소동", "강동동", "효문동", "송정동", "양정동", "염포동"],
    "울주군": ["언양읍", "온산읍", "온양읍", "범서읍", "청량읍", "삼남읍", "서생면", "웅촌면"],
  },
  "경북": {
    "포항시": ["중앙동", "양학동", "죽도동", "용흥동", "우창동", "두호동", "장량동", "효곡동", "대이동", "오천읍", "연일읍"],
    "경주시": ["황오동", "성건동", "중부동", "황남동", "월성동", "선도동", "용강동", "황성동", "동천동", "불국동", "안강읍"],
  },
  "대구": {
    "중구": ["동인동", "삼덕동", "성내동", "대신동", "남산동", "대봉동"],
    "동구": ["신암동", "신천동", "효목동", "도평동", "불로봉무동", "안심동", "혁신동"],
    "서구": ["내당동", "비산동", "평리동", "상중이동", "원대동"],
    "남구": ["이천동", "봉덕동", "대명동"],
    "북구": ["고성동", "칠성동", "침산동", "산격동", "복현동", "검단동", "태전동", "구암동"],
    "수성구": ["범어동", "만촌동", "수성동", "황금동", "중동", "상동", "파동", "두산동", "지산동", "범물동", "고산동"],
    "달서구": ["성당동", "두류동", "본리동", "감삼동", "죽전동", "장기동", "용산동", "이곡동", "월성동", "상인동", "도원동"],
    "달성군": ["화원읍", "논공읍", "다사읍", "유가읍", "옥포읍", "현풍읍", "가창면", "구지면"],
  },
};

const priceRows = [
  ["타이(건식)", "90분 70,000", "120분 80,000", "150분 문의"],
  ["아로마(습식)", "90분 80,000", "120분 100,000", "150분 문의"],
  ["VIP 스페셜", "90분 문의", "120분 100,000", "150분 130,000"],
  ["시크릿 코스", "가격 전화 문의", "안내 24시간 상담", "예약 후불제"],
];

const css = `:root{--bg:#050505;--panel:#111;--text:#fff;--muted:#bdbdbd;--line:#2b2b2b;--orange:#ff7a1a;--orange2:#ff9b3d}*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--text);font-family:Arial,"Malgun Gothic",sans-serif}a{color:inherit;text-decoration:none}.topbar{position:sticky;top:0;z-index:20;background:#050505;border-bottom:1px solid var(--line)}.top-inner{width:min(1180px,calc(100% - 32px));margin:0 auto;padding:14px 0;display:flex;align-items:center;justify-content:space-between}.brand{display:flex;align-items:center;gap:10px;font-size:21px;font-weight:900}.brand-mark{display:grid;place-items:center;width:38px;height:38px;border-radius:8px;background:linear-gradient(135deg,var(--orange),#ff4f1f)}.nav{display:flex;gap:18px;font-size:14px}.call-btn,.primary-btn{display:inline-flex;align-items:center;justify-content:center;min-height:42px;border-radius:8px;background:var(--orange);padding:0 16px;font-weight:900}.section{width:min(1180px,calc(100% - 32px));margin:0 auto;padding:48px 0}.eyebrow{color:var(--orange);font-weight:900}h1{font-size:clamp(40px,6vw,70px);line-height:1.05}h2{font-size:34px;color:var(--orange)}h3{font-size:22px;color:var(--orange);margin:0 0 12px}.lead,.card p,.muted{color:var(--muted);line-height:1.75;font-size:18px}.card,.price-card{border:1px solid var(--line);border-radius:14px;background:var(--panel);padding:22px}.grid-2{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}.grid-3{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px}.grid-4{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px}.link-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px}.dong-link{display:flex;justify-content:space-between;align-items:center;border:1px solid #3a2a1d;border-radius:12px;background:#111;padding:15px 16px;font-weight:900}.dong-link strong{color:var(--orange)}.dong-link:after{content:'›';color:var(--orange2);font-size:22px}.price-row{display:flex;justify-content:space-between;border-bottom:1px dashed #333;padding:10px 0}.shop-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:14px}.shop-card{aspect-ratio:1/1;border:1px solid var(--line);border-radius:14px;background:linear-gradient(180deg,#151515,#0d0d0d);padding:18px;display:flex;flex-direction:column;justify-content:space-between}.shop-card span{color:var(--orange2);font-weight:900;font-size:13px}.hero-actions{display:flex;flex-wrap:wrap;gap:10px;margin-top:22px}.outline-btn{display:inline-flex;align-items:center;justify-content:center;min-height:42px;border:1px solid var(--line);border-radius:8px;padding:0 16px;font-weight:900}.footer{border-top:1px solid var(--line);margin-top:48px;background:#070707}.footer-inner{width:min(1180px,calc(100% - 32px));margin:0 auto;padding:34px 0}.footer-links{display:flex;flex-wrap:wrap;gap:8px;border-top:1px solid #222;padding-top:18px;margin-top:18px}.footer-links a{border:1px solid #33261b;border-radius:999px;padding:8px 12px;color:#e8e8e8;font-size:13px;font-weight:800}.mobile-call{display:none}@media(max-width:900px){.nav{display:none}.grid-2,.grid-3,.grid-4,.link-grid,.shop-grid{grid-template-columns:1fr}body{padding-bottom:82px}.mobile-call{position:fixed;left:12px;right:12px;bottom:12px;z-index:50;display:flex;align-items:center;justify-content:center;gap:10px;min-height:58px;border-radius:8px;background:var(--orange);font-weight:900}}`;

function enc(value) { return encodeURIComponent(value); }
function pathFor(...parts) { return parts.map(enc).join("/"); }
function write(path, html) { const file = join("out", path); mkdirSync(dirname(file), { recursive: true }); writeFileSync(file, html, "utf8"); }

function nav() {
  return `<header class="topbar"><div class="top-inner"><a class="brand" href="/"><span class="brand-mark">B</span>${brand}</a><nav class="nav"><a href="/#price">요금표</a><a href="/#types">마사지 종류</a><a href="/#areas">지역선택</a><a href="/blog/">블로그</a><a href="/#faq">FAQ</a><a href="${tel}">전화예약</a></nav><a class="call-btn" href="${tel}">${phone}</a></div></header>`;
}

function seo(title, description, url) {
  const canonical = `${siteUrl}${url}`;
  return `<title>${title}</title><meta name="description" content="${description}"><link rel="canonical" href="${canonical}"><meta name="robots" content="index,follow,max-snippet:-1,max-image-preview:large"><meta property="og:title" content="${title}"><meta property="og:description" content="${description}"><meta property="og:url" content="${canonical}">`;
}

function footer() {
  const links = [["울산 출장마사지", "/area/울산/"], ["포항 출장마사지", "/area/경북/포항시/"], ["경주 출장마사지", "/area/경북/경주시/"], ["대구 출장마사지", "/area/대구/"], ["부산 출장마사지", "/area/부산/"]];
  return `<footer class="footer"><div class="footer-inner"><strong class="brand"><span class="brand-mark">B</span>${brand}</strong><p class="lead">${brand}는 부산, 경남, 울산, 경북, 대구 출장마사지와 홈타이 가능 지역을 1차, 2차, 3차 기준으로 정리합니다.</p><nav class="footer-links">${links.map(([label, href]) => `<a href="${href.split('/').map((p, i) => i > 1 ? enc(p) : p).join('/')}">${label}</a>`).join("")}<a href="/sitemap.xml">사이트맵</a></nav></div></footer>`;
}

function layout({ title, description, url, body }) {
  return `<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">${seo(title, description, url)}<style>${css}</style></head><body>${nav()}${body}${footer()}<a class="mobile-call" href="${tel}"><span>전화예약</span><strong>${phone}</strong></a></body></html>`;
}

function priceCards() {
  return priceRows.map(([title, ...rows]) => `<article class="price-card"><h3>${title}</h3>${rows.map((row) => { const [label, ...price] = row.split(" "); return `<div class="price-row"><span>${label}</span><strong>${price.join(" ")}</strong></div>`; }).join("")}</article>`).join("");
}

function summary(region, district, dong = "") {
  const place = dong || district || region;
  return `${place} 지역은 상권, 주거지, 숙소 이용 흐름에 따라 방문 가능 시간과 업체 배정 상황이 달라질 수 있습니다. ${brand}는 예약 전 요금, 코스, 가능 시간, 주의사항을 먼저 확인할 수 있도록 안내합니다.`;
}

function shops(place) {
  const names = ["프리미엄 홈타이", "힐링 아로마", "VIP 방문케어", "시그니처 케어"];
  return `<section class="section"><h2>${place} 추천 업체</h2><div class="shop-grid">${names.map((name, index) => `<article class="shop-card"><div><span>${["빠른 상담", "후불 안내", "관리사 확인", "코스 비교"][index]}</span><h3>${place} ${name}</h3></div><p class="muted">상담 후 가능 시간, 코스 상세, 요금, 방문 조건을 확인할 수 있습니다.</p></article>`).join("")}</div></section>`;
}

const extraHomeCards = Object.entries(extraAreas).map(([region, districts]) => `<a class="card area-card" href="/area/${enc(region)}/"><h3>${region} 출장마사지</h3><p>${region} 지역의 2차 지역과 3차 세부 지역을 확인하세요. 대표 지역: ${Object.keys(districts).slice(0, 4).join(", ")}</p></a>`).join("");

if (existsSync("out/index.html")) {
  let home = readFileSync("out/index.html", "utf8");
  home = home.replace(/<\/section><section class="section" id="price">/, `<div class="grid-3">${extraHomeCards}</div></section><section class="section" id="price">`);
  home = home.replace("부산 · 경남 출장마사지 홈타이 안내", "부산 · 경남 · 울산 · 경북 · 대구 출장마사지 홈타이 안내");
  home = home.replace("부산 전 지역과 경남 김해시, 양산시, 창원시", "부산 전 지역과 경남 김해시, 양산시, 창원시, 울산, 경북 포항시·경주시, 대구");
  writeFileSync("out/index.html", home, "utf8");
}

for (const [region, districts] of Object.entries(extraAreas)) {
  const districtLinks = Object.keys(districts).map((district) => `<a class="card" href="/area/${pathFor(region, district)}/"><h3>${district}</h3><p>${summary(region, district)}</p></a>`).join("");
  const body = `<main><section class="section"><p class="eyebrow">1차 지역</p><h1>${region} 출장마사지 홈타이</h1><p class="lead">${region} 지역의 2차 지역을 선택하세요. 각 지역 페이지에서 세부 3차 지역과 예약 전 확인사항을 볼 수 있습니다.</p></section><section class="section"><h2>${region} 2차 지역 선택</h2><div class="grid-3">${districtLinks}</div></section></main>`;
  write(`area/${region}/index.html`, layout({ title: `${region} 출장마사지 홈타이 | ${brand}`, description: `${region} 출장마사지와 홈타이 가능 2차 지역, 요금표, 예약 전 확인사항 안내.`, url: `/area/${enc(region)}/`, body }));

  for (const [district, dongs] of Object.entries(districts)) {
    const dongLinks = dongs.map((dong) => `<a class="dong-link" href="/area/${pathFor(region, district, dong)}/"><strong>${dong}</strong></a>`).join("");
    const body2 = `<main><section class="section"><p class="eyebrow">2차 지역</p><h1>${region} ${district} 출장마사지 홈타이</h1><p class="lead">${summary(region, district)} 아래에서 ${district} 세부 지역을 선택하세요.</p></section><section class="section"><h2>${district} 3차 지역 선택</h2><div class="link-grid">${dongLinks}</div></section><section class="section"><h2>${district} 마사지 코스 및 요금</h2><div class="grid-4">${priceCards()}</div></section></main>`;
    write(`area/${region}/${district}/index.html`, layout({ title: `${region} ${district} 출장마사지 홈타이 | ${brand}`, description: `${region} ${district} 출장마사지, 홈타이 예약 시간과 요금표, 세부 지역 안내.`, url: `/area/${pathFor(region, district)}/`, body: body2 }));

    for (const dong of dongs) {
      const info = `<section class="section"><div class="grid-2"><article class="card"><h2>공지사항</h2><p>${dong} 예약은 시간대와 업체 배정 상황에 따라 가능 여부가 달라질 수 있습니다. 예약 전 총 금액, 코스 시간, 추가 요금 여부를 확인하세요.</p></article><article class="card"><h2>업체소개</h2><p>${brand}는 ${region} ${district} ${dong} 주변 출장마사지와 홈타이 가능 업체를 비교하기 쉽게 정리하는 안내 플랫폼입니다.</p></article><article class="card"><h2>관리사정보</h2><p>관리사 성별, 경력, 코스 가능 여부는 업체별 배정 상황에 따라 달라지므로 상담 단계에서 확인합니다.</p></article><article class="card"><h2>주의사항</h2><p>불법 성매매, 유사 성행위, 미성년자 관련 서비스는 등록과 노출을 허용하지 않습니다.</p></article></div></section>`;
      const body3 = `<main><section class="section"><p class="eyebrow">3차 지역</p><h1>${region} ${district} ${dong} 출장마사지 홈타이</h1><p class="lead">${summary(region, district, dong)} 전화 상담으로 가능 시간, 요금, 코스 범위, 관리사 배정 상황을 확인하세요.</p><div class="hero-actions"><a class="primary-btn" href="${tel}">전화예약</a><a class="outline-btn" href="/#price">요금표 보기</a></div></section><section class="section"><h2>${dong} 마사지 코스 및 요금</h2><div class="grid-4">${priceCards()}</div></section>${shops(dong)}${info}</main>`;
      write(`area/${region}/${district}/${dong}/index.html`, layout({ title: `${region} ${district} ${dong} 출장마사지 홈타이 | ${brand}`, description: `${region} ${district} ${dong} 출장마사지와 홈타이 예약 시간, 요금표, 추천 업체, 주의사항 안내.`, url: `/area/${pathFor(region, district, dong)}/`, body: body3 }));
    }
  }
}

if (existsSync("out/sitemap.xml")) {
  let sitemap = readFileSync("out/sitemap.xml", "utf8");
  const today = new Date().toISOString().slice(0, 10);
  const urls = Object.entries(extraAreas).flatMap(([region, districts]) => [`/area/${enc(region)}/`, ...Object.entries(districts).flatMap(([district, dongs]) => [`/area/${pathFor(region, district)}/`, ...dongs.map((dong) => `/area/${pathFor(region, district, dong)}/`)])]);
  sitemap = sitemap.replace("</urlset>", `${urls.map((url) => `<url><loc>${siteUrl}${url}</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>0.7</priority></url>`).join("")}</urlset>`);
  writeFileSync("out/sitemap.xml", sitemap, "utf8");
}

if (existsSync("out/rss.xml")) {
  let rss = readFileSync("out/rss.xml", "utf8");
  const items = Object.keys(extraAreas).map((region) => `<item><title>${brand} ${region} 출장마사지</title><link>${siteUrl}/area/${enc(region)}/</link><guid>${siteUrl}/area/${enc(region)}/</guid></item>`).join("");
  rss = rss.replace("</channel>", `${items}</channel>`);
  writeFileSync("out/rss.xml", rss, "utf8");
}
