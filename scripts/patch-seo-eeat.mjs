import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join, relative, sep } from "node:path";

const outDir = "out";
const siteUrl = "https://busanrun1.netlify.app";
const brand = "부산달리기";
const phone = "0508-202-4683";
const today = new Date().toISOString().slice(0, 10);

const eeatCss = `.eeat-section{border-top:1px solid #1f1f1f}.eeat-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px}.eeat-card{border:1px solid #2d2d2d;border-radius:12px;background:#101010;padding:18px}.eeat-card h3{color:#ff7a1a;margin:0 0 10px;font-size:18px}.eeat-card p{color:#cfcfcf;line-height:1.7;margin:0}.source-note{margin-top:16px;color:#aaa;font-size:14px;line-height:1.7}@media(max-width:900px){.eeat-grid{grid-template-columns:1fr}}`;

function walk(dir) {
  return readdirSync(dir).flatMap((entry) => {
    const path = join(dir, entry);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });
}

function decodeHtml(value = "") {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function stripTags(value = "") {
  return decodeHtml(value.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim());
}

function getMatch(html, pattern) {
  return html.match(pattern)?.[1] ?? "";
}

function relativeUrl(file) {
  const rel = relative(outDir, file).split(sep).join("/");
  if (rel === "index.html") return "/";
  if (rel.endsWith("/index.html")) return `/${rel.slice(0, -"index.html".length)}`;
  return `/${rel}`;
}

function breadcrumbItems(url) {
  const parts = url.split("/").filter(Boolean);
  const items = [{ name: "홈", item: `${siteUrl}/` }];
  let path = "";
  for (const part of parts) {
    path += `/${part}`;
    if (part === "area") {
      items.push({ name: "지역", item: `${siteUrl}${path}/` });
    } else {
      items.push({ name: decodeURIComponent(part), item: `${siteUrl}${path}/` });
    }
  }
  return items;
}

function makeJsonLd({ title, description, canonical, url }) {
  const crumbs = breadcrumbItems(url).map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    item: item.item,
  }));

  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        name: brand,
        url: siteUrl,
        telephone: phone,
        areaServed: ["부산", "경남", "울산", "경북", "대구"],
      },
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: brand,
        inLanguage: "ko-KR",
        publisher: { "@id": `${siteUrl}/#organization` },
      },
      {
        "@type": "WebPage",
        "@id": `${canonical}#webpage`,
        url: canonical,
        name: title,
        description,
        inLanguage: "ko-KR",
        isPartOf: { "@id": `${siteUrl}/#website` },
        about: "동남권 출장마사지 및 홈타이 지역 안내",
        dateModified: today,
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${canonical}#breadcrumb`,
        itemListElement: crumbs,
      },
    ],
  };

  return `<script type="application/ld+json" data-seo-eeat="true">${JSON.stringify(graph)}</script>`;
}

function makeEeatSection(h1, url) {
  const cleanTitle = h1.replace(/\s*\|.*$/, "").trim() || brand;
  const regionText = url.includes("/area/") ? "선택한 지역의 생활권과 이동 동선을 기준으로" : "부산, 경남, 울산, 경북, 대구 권역을 나누어";
  return `<section class="section eeat-section" data-eeat-section="true"><p class="eyebrow">부산달리기 운영 기준</p><h2>${cleanTitle} 이용 전 확인 기준</h2><div class="eeat-grid"><article class="eeat-card"><h3>지역 확인</h3><p>${regionText} 실제 상담 가능 범위와 배정 시간을 확인합니다. 같은 구군 안에서도 숙소, 상권, 주거지 위치에 따라 안내가 달라질 수 있습니다.</p></article><article class="eeat-card"><h3>요금 확인</h3><p>표기된 코스 금액은 참고 기준이며 최종 안내는 통화 시점의 시간대, 이동 조건, 선택 코스에 따라 확인합니다. 추가 조건은 예약 전에 먼저 안내하는 방식을 기준으로 합니다.</p></article><article class="eeat-card"><h3>신뢰 기준</h3><p>부산달리기는 위법하거나 부적절한 요청을 안내하지 않습니다. 이용 전 코스 범위, 결제 방식, 방문 가능 시간, 주의사항을 확인하도록 안내합니다.</p></article></div><p class="source-note">작성 기준: ${brand} 운영팀이 ${today} 기준 지역 상담 흐름과 예약 전 확인 항목을 정리했습니다.</p></section>`;
}

for (const file of walk(outDir)) {
  if (!file.endsWith(".html")) continue;

  let html = readFileSync(file, "utf8");
  const url = relativeUrl(file);
  const canonical = getMatch(html, /<link rel="canonical" href="([^"]+)"/) || `${siteUrl}${url}`;
  const title = stripTags(getMatch(html, /<title>([\s\S]*?)<\/title>/)) || brand;
  const description = decodeHtml(getMatch(html, /<meta name="description" content="([^"]*)"/)) || `${brand} 지역 안내`;
  const h1 = stripTags(getMatch(html, /<h1[^>]*>([\s\S]*?)<\/h1>/)) || title;

  if (!html.includes("name=\"author\"")) {
    html = html.replace("<meta name=\"viewport\" content=\"width=device-width,initial-scale=1\">", `<meta name="viewport" content="width=device-width,initial-scale=1"><meta name="author" content="부산달리기 운영팀"><meta name="theme-color" content="#050505"><meta name="format-detection" content="telephone=yes">`);
  }

  if (!html.includes("rel=\"canonical\"")) {
    html = html.replace("</title>", `</title><link rel="canonical" href="${canonical}">`);
  }

  if (!html.includes("data-seo-eeat=\"true\"")) {
    html = html.replace("</head>", `${makeJsonLd({ title, description, canonical, url })}</head>`);
  }

  if (!html.includes(".eeat-section")) {
    html = html.replace("</style>", `${eeatCss}</style>`);
  }

  if (!html.includes("data-eeat-section=\"true\"")) {
    html = html.replace("<footer class=\"footer\">", `${makeEeatSection(h1, url)}<footer class="footer">`);
  }

  writeFileSync(file, html, "utf8");
}
