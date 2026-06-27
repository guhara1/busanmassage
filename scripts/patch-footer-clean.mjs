import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const outDir = "out";
const phone = "0508-202-4683";
const tel = "tel:05082024683";

const footerCss = `.footer{border-top:1px solid #252525;margin-top:56px;background:#070707}.footer-inner{width:min(1180px,calc(100% - 32px));margin:0 auto;padding:36px 0 24px}.footer-top{display:grid;grid-template-columns:1.25fr .85fr .85fr;gap:18px;align-items:stretch}.footer-card{border:1px solid #252525;border-radius:12px;background:#101010;padding:18px}.footer-card h3,.footer-brand-title,.footer-links-title{margin:0 0 10px;color:#ff7a1a;font-size:15px;font-weight:900}.footer-brand-row{display:flex;align-items:center;gap:10px;margin-bottom:12px}.footer-brand-row .brand-mark{width:36px;height:36px}.footer-name{font-size:22px;font-weight:900}.footer p,.footer li{color:#c9c9c9;line-height:1.7}.footer-list{list-style:none;margin:0;padding:0}.footer-list strong{display:block;color:#fff;font-size:19px;margin-top:4px}.footer-links{display:flex;flex-wrap:wrap;gap:8px;border-top:1px solid #222;padding-top:18px;margin-top:22px}.footer-links a{border:1px solid #3a2a1d;border-radius:999px;padding:9px 13px;color:#f1f1f1;background:#0d0d0d;font-size:13px;font-weight:800}.footer-bottom{border-top:1px solid #222;margin-top:18px;padding-top:14px;color:#9f9f9f;font-size:13px;line-height:1.7}@media(max-width:900px){.footer-top{grid-template-columns:1fr}.footer-inner{padding-bottom:26px}.footer-links a{width:calc(50% - 4px);text-align:center}}`;

const footerHtml = `<footer class="footer"><div class="footer-inner"><div class="footer-top"><section class="footer-card"><div class="footer-brand-row"><span class="brand-mark">B</span><strong class="footer-name">부산마사지</strong></div><p>부산마사지는 부산, 경남, 울산, 경북, 대구 출장마사지와 홈타이 가능 지역을 행정구와 행정동 기준으로 정리하는 지역 기반 예약 안내 플랫폼입니다. 예약 전 요금, 가능 시간, 코스 범위, 주의사항을 먼저 확인할 수 있도록 운영 정보를 안내합니다.</p></section><section class="footer-card"><h3>고객센터</h3><ul class="footer-list"><li>전화예약<strong><a href="${tel}">${phone}</a></strong></li><li>상담 방식<strong>전화 상담</strong></li></ul></section><section class="footer-card"><h3>운영시간</h3><ul class="footer-list"><li>출장마사지 운영<strong>오전 11시 ~ 익일 오전 8시</strong></li><li>운영일<strong>연중무휴</strong></li></ul></section></div><nav class="footer-links" aria-label="주요 지역 링크"><span class="footer-links-title">주요 지역</span><a href="/area/%EB%B6%80%EC%82%B0/">부산 출장마사지</a><a href="/area/%EA%B2%BD%EB%82%A8/">경남 출장마사지</a><a href="/area/%EC%9A%B8%EC%82%B0/">울산 출장마사지</a><a href="/area/%EA%B2%BD%EB%B6%81/">경북 출장마사지</a><a href="/area/%EA%B2%BD%EB%B6%81/%ED%8F%AC%ED%95%AD%EC%8B%9C/">포항 출장마사지</a><a href="/area/%EA%B2%BD%EB%B6%81/%EA%B2%BD%EC%A3%BC%EC%8B%9C/">경주 출장마사지</a><a href="/area/%EB%8C%80%EA%B5%AC/">대구 출장마사지</a><a href="/sitemap.xml">사이트맵</a></nav><p class="footer-bottom">불법 서비스는 등록과 노출을 허용하지 않습니다. 예약 전 실제 가능 시간, 요금, 코스 안내를 전화로 확인해 주세요.</p></div></footer>`;

function walk(dir) {
  return readdirSync(dir).flatMap((entry) => {
    const path = join(dir, entry);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });
}

for (const file of walk(outDir)) {
  if (!file.endsWith(".html")) continue;

  let html = readFileSync(file, "utf8");

  if (!html.includes(".footer-top")) {
    html = html.replace("</style>", `${footerCss}</style>`);
  }

  html = html.replace(/<footer class="footer">[\s\S]*?<\/footer>/, footerHtml);
  writeFileSync(file, html, "utf8");
}
