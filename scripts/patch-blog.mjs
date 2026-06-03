import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

// Runs late in the build (after footer/eeat/domain patches, before search verification),
// so the blog pages are generated self-contained with their own clean footer, Article
// schema, and author byline. patch-search-verification.mjs adds the verification meta after.
const siteUrl = "https://busanrun.netlify.app";
const brand = "부산달리기";
const phone = "0508-202-4683";
const tel = "tel:05082024683";
const author = "부산달리기 운영팀";
const published = "2026-06-03";
const today = new Date().toISOString().slice(0, 10);

function enc(value) { return encodeURIComponent(value); }
function write(path, html) { const file = join("out", path); mkdirSync(dirname(file), { recursive: true }); writeFileSync(file, html, "utf8"); }

const css = `:root{--bg:#050505;--panel:#111;--text:#fff;--muted:#bdbdbd;--line:#2b2b2b;--orange:#ff7a1a;--orange2:#ff9b3d}*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:var(--bg);color:var(--text);font-family:Arial,"Malgun Gothic",sans-serif}a{color:inherit;text-decoration:none}.topbar{position:sticky;top:0;z-index:20;background:rgba(5,5,5,.94);border-bottom:1px solid var(--line);backdrop-filter:blur(12px)}.top-inner{width:min(1180px,calc(100% - 32px));margin:0 auto;padding:14px 0;display:flex;align-items:center;justify-content:space-between}.brand{display:flex;align-items:center;gap:10px;font-size:21px;font-weight:900}.brand-mark{display:grid;place-items:center;width:38px;height:38px;border-radius:8px;background:linear-gradient(135deg,var(--orange),#ff4f1f);color:#fff}.nav{display:flex;gap:18px;font-size:14px}.call-btn{display:inline-flex;align-items:center;justify-content:center;min-height:42px;border-radius:8px;background:var(--orange);padding:0 16px;font-weight:900}.section{width:min(820px,calc(100% - 32px));margin:0 auto;padding:40px 0}.eyebrow{color:var(--orange);font-weight:900;margin:0 0 12px}h1{font-size:clamp(30px,5vw,46px);line-height:1.15;margin:0 0 16px}h2{font-size:26px;margin:34px 0 12px;color:var(--orange)}.lead{color:var(--muted);font-size:18px;line-height:1.8}.post-meta{display:flex;flex-wrap:wrap;gap:14px;color:#9f9f9f;font-size:14px;border-top:1px solid #1f1f1f;border-bottom:1px solid #1f1f1f;padding:14px 0;margin:22px 0 8px}.post-body p{color:#dcdcdc;line-height:1.85;font-size:17px;margin:0 0 16px}.post-body a{color:var(--orange2);font-weight:800;text-decoration:underline}.toc{border:1px solid var(--line);border-radius:12px;background:#101010;padding:18px 20px;margin:24px 0}.toc strong{color:var(--orange);display:block;margin-bottom:8px}.toc ol{margin:0;padding-left:20px;color:#cfcfcf;line-height:1.9}.related{border:1px solid var(--line);border-radius:12px;background:#101010;padding:20px;margin-top:30px}.related h2{margin-top:0;font-size:20px}.related-links{display:flex;flex-wrap:wrap;gap:8px;margin-top:6px}.related-links a{border:1px solid #3a2a1d;border-radius:999px;padding:9px 13px;color:#f1f1f1;background:#0d0d0d;font-size:13px;font-weight:800;text-decoration:none}.post-card{display:block;border:1px solid var(--line);border-radius:14px;background:var(--panel);padding:22px;margin-bottom:14px}.post-card h2{margin:0 0 8px;font-size:22px}.post-card p{color:var(--muted);line-height:1.7;margin:0}.footer{border-top:1px solid #252525;margin-top:56px;background:#070707}.footer-inner{width:min(1180px,calc(100% - 32px));margin:0 auto;padding:36px 0 24px}.footer-top{display:grid;grid-template-columns:1.25fr .85fr .85fr;gap:18px;align-items:stretch}.footer-card{border:1px solid #252525;border-radius:12px;background:#101010;padding:18px}.footer-card h3,.footer-brand-title,.footer-links-title{margin:0 0 10px;color:#ff7a1a;font-size:15px;font-weight:900}.footer-brand-row{display:flex;align-items:center;gap:10px;margin-bottom:12px}.footer-brand-row .brand-mark{width:36px;height:36px}.footer-name{font-size:22px;font-weight:900}.footer p,.footer li{color:#c9c9c9;line-height:1.7}.footer-list{list-style:none;margin:0;padding:0}.footer-list strong{display:block;color:#fff;font-size:19px;margin-top:4px}.footer-links{display:flex;flex-wrap:wrap;gap:8px;border-top:1px solid #222;padding-top:18px;margin-top:22px}.footer-links a{border:1px solid #3a2a1d;border-radius:999px;padding:9px 13px;color:#f1f1f1;background:#0d0d0d;font-size:13px;font-weight:800}.footer-bottom{border-top:1px solid #222;margin-top:18px;padding-top:14px;color:#9f9f9f;font-size:13px;line-height:1.7}.mobile-call{display:none}@media(max-width:900px){.nav{display:none}.footer-top{grid-template-columns:1fr}body{padding-bottom:82px}.mobile-call{position:fixed;left:12px;right:12px;bottom:12px;z-index:50;display:flex;align-items:center;justify-content:center;gap:10px;min-height:58px;border-radius:8px;background:var(--orange);font-weight:900}.footer-links a{width:calc(50% - 4px);text-align:center}}`;

function nav() {
  return `<header class="topbar"><div class="top-inner"><a class="brand" href="/"><span class="brand-mark">B</span>${brand}</a><nav class="nav"><a href="/#price">요금표</a><a href="/#types">마사지 종류</a><a href="/#areas">지역선택</a><a href="/blog/">블로그</a><a href="${tel}">전화예약</a></nav><a class="call-btn" href="${tel}">${phone}</a></div></header>`;
}

function footer() {
  return `<footer class="footer"><div class="footer-inner"><div class="footer-top"><section class="footer-card"><div class="footer-brand-row"><span class="brand-mark">B</span><strong class="footer-name">${brand}</strong></div><p>${brand}는 부산, 경남, 울산, 경북, 대구 출장마사지와 홈타이 가능 지역을 행정구와 행정동 기준으로 정리하는 지역 기반 예약 안내 플랫폼입니다. 예약 전 요금, 가능 시간, 코스 범위, 주의사항을 먼저 확인할 수 있도록 운영 정보를 안내합니다.</p></section><section class="footer-card"><h3>고객센터</h3><ul class="footer-list"><li>전화예약<strong><a href="${tel}">${phone}</a></strong></li><li>상담 방식<strong>전화 상담</strong></li></ul></section><section class="footer-card"><h3>운영시간</h3><ul class="footer-list"><li>출장마사지 운영<strong>오전 11시 ~ 익일 오전 8시</strong></li><li>운영일<strong>연중무휴</strong></li></ul></section></div><nav class="footer-links" aria-label="주요 지역 링크"><span class="footer-links-title">주요 지역</span><a href="/area/%EB%B6%80%EC%82%B0/">부산 출장마사지</a><a href="/area/%EA%B2%BD%EB%82%A8/">경남 출장마사지</a><a href="/area/%EC%9A%B8%EC%82%B0/">울산 출장마사지</a><a href="/area/%EA%B2%BD%EB%B6%81/">경북 출장마사지</a><a href="/area/%EB%8C%80%EA%B5%AC/">대구 출장마사지</a><a href="/blog/">블로그</a><a href="/sitemap.xml">사이트맵</a></nav><p class="footer-bottom">불법 서비스는 등록과 노출을 허용하지 않습니다. 예약 전 실제 가능 시간, 요금, 코스 안내를 전화로 확인해 주세요.</p></div></footer>`;
}

function layout({ title, description, url, head = "", body }) {
  const canonical = `${siteUrl}${url}`;
  const seo = `<title>${title}</title><meta name="description" content="${description}"><link rel="canonical" href="${canonical}"><meta name="author" content="${author}"><meta name="theme-color" content="#050505"><meta name="robots" content="index,follow,max-snippet:-1,max-image-preview:large"><meta property="og:type" content="article"><meta property="og:site_name" content="${brand}"><meta property="og:title" content="${title}"><meta property="og:description" content="${description}"><meta property="og:url" content="${canonical}"><meta name="twitter:card" content="summary"><link rel="icon" type="image/svg+xml" href="/favicon.svg"><link rel="shortcut icon" href="/favicon.svg">`;
  return `<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">${seo}${head}<style>${css}</style></head><body>${nav()}${body}${footer()}<a class="mobile-call" href="${tel}"><span>전화예약</span><strong>${phone}</strong></a></body></html>`;
}

// ── Blog post ───────────────────────────────────────────────────────────────
const postSlug = "google-search-2026-seo-guide";
const postUrl = `/blog/${postSlug}/`;
const postTitle = "2026년 구글 상위노출 최신 정책 완벽 정리";
const postDesc = "E-E-A-T, 도움되는 콘텐츠, Who·How·Why, 스팸 정책, Core Web Vitals(INP), 구조화 데이터, 2026년 3월 코어·스팸 동시 업데이트, 구글 뉴스 조건까지 검색 상위노출 최신 기준을 정리했습니다.";

const link = {
  home: `<a href="/">부산달리기</a>`,
  busan: `<a href="/area/${enc("부산")}/">부산 출장마사지</a>`,
  haeundae: `<a href="/area/${enc("부산")}/${enc("해운대구")}/">해운대 출장마사지</a>`,
  gimhae: `<a href="/area/${enc("경남")}/${enc("김해시")}/">김해 출장마사지</a>`,
};

const postBody = `<main><article class="section">
<p class="eyebrow">SEO 인사이트</p>
<h1>${postTitle}</h1>
<p class="lead">검색 결과 상위 노출을 위한 구글의 평가 기준은 2025년 말부터 2026년 상반기까지 빠르게 바뀌었습니다. ${link.home} 운영팀이 직접 사이트를 운영하며 적용해 본 최신 핵심 정책을 한 번에 정리했습니다.</p>
<div class="post-meta"><span>글쓴이 · ${author}</span><span>발행일 · ${published}</span><span>분류 · 검색엔진 최적화</span></div>
<div class="toc"><strong>이 글의 순서</strong><ol><li>E-E-A-T 원칙과 YMYL</li><li>도움되는 콘텐츠와 사이트 단위 신호</li><li>Who·How·Why 원칙</li><li>스팸 정책과 정보 이득</li><li>기술 요소와 구조화 데이터</li><li>2026년 3월 업데이트와 구글 뉴스</li></ol></div>
<div class="post-body">
<h2>1. E-E-A-T 원칙과 YMYL</h2>
<p>2022년 말 기존 E-A-T에 경험(Experience)이 더해졌습니다. 실제 제품 사용이나 장소 방문처럼 직접 경험에서 나온 콘텐츠가 높게 평가되며, 건강·금융·안전 같은 YMYL 주제에서는 그 비중이 훨씬 더 크게 작용합니다. 작성자 바이라인, 저자 소개 페이지, 외부 인용과 언급 같은 신뢰 신호를 갖추는 것이 기본입니다.</p>
<p>운영 경험상 같은 정보라도 누가 어떤 근거로 작성했는지가 드러나면 체류 시간과 재방문이 눈에 띄게 달라집니다. 그래서 각 페이지에 운영팀 표기와 작성 기준일, 실제 상담 흐름을 함께 노출하는 방식을 권장합니다. 직접 확인하지 않은 수치나 가격을 단정하지 않고 ‘상담 시점 기준’으로 명시하는 것도 신뢰 신호에 해당합니다.</p>
<h2>2. 도움되는 콘텐츠와 사이트 단위 신호</h2>
<p>2024년 3월부터 도움되는 콘텐츠 시스템은 별도 업데이트가 아니라 핵심 랭킹 알고리즘에 통합되었습니다. 중요한 점은 사이트 전체에 저품질 콘텐츠가 일정량 쌓이면 양질의 페이지 순위까지 함께 떨어지는 사이트 단위 신호라는 것입니다. 실시간 작동이라기보다 검색 품질 평가에 지속적으로 반영되는 핵심 신호로 이해하는 편이 정확합니다.</p>
<p>따라서 페이지 수를 무리하게 늘리기보다, 방문자에게 실질적으로 도움이 되지 않는 얇은 페이지를 정리하거나 통합하는 작업이 전체 순위에 더 유리할 수 있습니다. 새 글을 한 편 발행할 때도 사이트 평균 품질을 끌어올리는지 먼저 자문하는 습관이 필요합니다.</p>
<h2>3. Who·How·Why 원칙</h2>
<p>2025년 12월 갱신된 가이드라인은 누가, 어떻게, 왜 만들었는가를 기준으로 콘텐츠를 평가합니다. AI 사용 여부 자체보다 결과물의 가치가 핵심이며, 전문가 검수와 원본 데이터, 명시된 책임 저자가 있다면 AI를 활용해도 문제되지 않습니다. 검색 순위만을 목적으로 자동 생성된 콘텐츠인지, 사람에게 도움을 주려고 만든 콘텐츠인지가 판단의 갈림길입니다.</p>
<h2>4. 스팸 정책과 정보 이득</h2>
<p>반드시 피해야 할 행위는 순위 조작을 위한 대량 저가치 콘텐츠 양산, 제3자 콘텐츠로 도메인 신뢰도를 악용하는 행위, 만료 도메인을 인수해 무관한 콘텐츠를 발행하는 행위입니다. 키워드 스터핑, 클로킹, 링크 스킴, 도어웨이 페이지 같은 전통적 스팸도 금지됩니다. 반대로 어디서나 볼 수 있는 요약이 아닌 독자적 관점과 1차 경험 리뷰, 원본 데이터를 담은 비범용 콘텐츠는 점점 더 중요해지고 있습니다.</p>
<p>‘정보 이득(Information Gain)’은 공식 정책명이 아니므로, 구글 공식 표현인 독자적 관점과 1차 경험 리뷰, 비범용 콘텐츠로 이해하는 편이 정확합니다. 같은 키워드를 다루더라도 다른 곳에서 얻을 수 없는 직접 경험과 원본 데이터를 한 문단이라도 더하는 것이 핵심입니다.</p>
<h2>5. 기술 요소와 구조화 데이터</h2>
<p>페이지 경험에서는 Core Web Vitals의 FID가 INP로 교체되었고 모바일 친화성, 로딩 속도, HTTPS가 기본 요건입니다. 2026년 3월 24일에는 논의 포럼과 Q&A 마크업에 새로운 지원 속성이 추가되어, 댓글 스레드 구조를 더 명확히 이해합니다. 커뮤니티 사이트라면 DiscussionForumPosting 적용을 고려할 만합니다. 같은 해 3월 2일에는 schema.org 마크업과 og:image 메타 태그를 함께 써 원하는 썸네일을 지정하는 방법이 공식 문서에 추가되어, 구글 뉴스와 Discover 노출에서 특히 유용합니다. 더 이상 구글이 임의로 썸네일을 크롤링하지 않도록 원하는 이미지를 명확히 지정할 수 있게 된 것입니다. 자바스크립트로 콘텐츠를 로드해도 검색이 더 어려워지지 않는다는 입장도 공식화되었으나, 렌더링 지연 성능은 별도로 관리해야 합니다.</p>
<h2>6. 2026년 3월 업데이트와 구글 뉴스</h2>
<p>2026년 3월에는 24일 스팸 업데이트가 시작된 사흘 뒤인 27일 코어 업데이트가 시작되어 약 2주간 함께 진행되었고, 그 결과 순위 변동이 매우 컸으며 트래픽 감소 원인이 스팸 때문인지 품질 때문인지 분석하기 어려운 구간이 생겼습니다. 이런 시기에는 성급하게 콘텐츠를 대량 수정하기보다 업데이트 종료 후 데이터를 보고 판단하는 편이 안전합니다.</p>
<p>한편 구글 뉴스는 별도 신청 없이 기준에 맞는 사이트를 자동으로 발견해 포함시킵니다. 순수 홍보성 콘텐츠, 보도자료, 광고성 기사는 노출되지 않으며 독립적이고 사실에 기반한 현재 사건 보도여야 합니다. 저자 바이라인, 회사 소개, 연락처, 편집 정책이 명확히 공개되어야 하고, 과거 필수였던 AMP의 중요도는 크게 낮아져 속도와 모바일 최적화 자체가 더 중요해졌습니다.</p>
<p>${link.home}는 부산 전 지역과 경남·울산·경북·대구의 출장마사지 정보를 직접 정리하면서 이 기준을 그대로 적용합니다. 지역별 안내는 ${link.busan}, ${link.haeundae}, ${link.gimhae} 페이지에서 직접 확인해 보세요.</p>
</div>
<aside class="related"><h2>함께 보면 좋은 페이지</h2><div class="related-links"><a href="/">홈으로</a><a href="/blog/">블로그 전체보기</a><a href="/area/${enc("부산")}/">부산 출장마사지</a><a href="/area/${enc("경남")}/${enc("김해시")}/">김해 출장마사지</a><a href="/area/${enc("울산")}/">울산 출장마사지</a></div></aside>
</article></main>`;

const articleSchema = `<script type="application/ld+json">${JSON.stringify({
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  headline: postTitle,
  description: postDesc,
  inLanguage: "ko-KR",
  datePublished: published,
  dateModified: today,
  author: { "@type": "Organization", name: author, url: siteUrl },
  publisher: { "@type": "Organization", name: brand, url: siteUrl, telephone: phone },
  mainEntityOfPage: { "@type": "WebPage", "@id": `${siteUrl}${postUrl}` },
})}</script>`;

const breadcrumbSchema = `<script type="application/ld+json">${JSON.stringify({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "홈", item: `${siteUrl}/` },
    { "@type": "ListItem", position: 2, name: "블로그", item: `${siteUrl}/blog/` },
    { "@type": "ListItem", position: 3, name: postTitle, item: `${siteUrl}${postUrl}` },
  ],
})}</script>`;

write(`blog/${postSlug}/index.html`, layout({
  title: `${postTitle} | ${brand}`,
  description: postDesc,
  url: postUrl,
  head: articleSchema + breadcrumbSchema,
  body: postBody,
}));

// ── Blog index (internal-linking hub) ────────────────────────────────────────
const indexBody = `<main><section class="section"><p class="eyebrow">${brand} 블로그</p><h1>운영 인사이트 & 가이드</h1><p class="lead">검색 노출과 지역 안내 운영에서 직접 확인한 내용을 정리합니다.</p><a class="post-card" href="${postUrl}"><h2>${postTitle}</h2><p>${postDesc}</p></a><nav class="related-links" aria-label="지역 바로가기" style="margin-top:18px"><a href="/area/${enc("부산")}/">부산 출장마사지</a><a href="/area/${enc("경남")}/${enc("김해시")}/">김해 출장마사지</a><a href="/area/${enc("울산")}/">울산 출장마사지</a><a href="/">홈으로</a></nav></section></main>`;

const blogSchema = `<script type="application/ld+json">${JSON.stringify({
  "@context": "https://schema.org",
  "@type": "Blog",
  name: `${brand} 블로그`,
  url: `${siteUrl}/blog/`,
  inLanguage: "ko-KR",
  blogPost: [{ "@type": "BlogPosting", headline: postTitle, url: `${siteUrl}${postUrl}`, datePublished: published }],
})}</script>`;

write("blog/index.html", layout({
  title: `블로그 | ${brand}`,
  description: `${brand} 블로그 - 검색 노출과 지역 안내 운영 인사이트를 정리합니다.`,
  url: "/blog/",
  head: blogSchema,
  body: indexBody,
}));

// ── Add blog URLs to sitemap ────────────────────────────────────────────────
if (existsSync("out/sitemap.xml")) {
  let sitemap = readFileSync("out/sitemap.xml", "utf8");
  const blogUrls = ["/blog/", postUrl];
  if (!sitemap.includes(`${siteUrl}/blog/`) && !sitemap.includes("/blog/")) {
    const entries = blogUrls.map((url) => `<url><loc>${siteUrl}${url}</loc><lastmod>${today}</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>`).join("");
    sitemap = sitemap.replace("</urlset>", `${entries}</urlset>`);
    writeFileSync("out/sitemap.xml", sitemap, "utf8");
  }
}

// Report the visible Korean character count of the post body for guideline checks.
const plain = postBody.replace(/<[^>]+>/g, "").replace(/\s+/g, "").trim();
console.log(`[patch-blog] post published: ${postUrl} (visible body chars: ${plain.length})`);
