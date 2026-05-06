import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const outDir = "out";

const favicon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="14" fill="#050505"/>
  <path d="M14 44V18h20c9 0 15 5 15 13s-6 13-15 13H14Z" fill="#ff7a1a"/>
  <path d="M24 25h10c3 0 5 2 5 5s-2 5-5 5H24V25Z" fill="#050505"/>
  <path d="M18 50h31" stroke="#ff9b3d" stroke-width="4" stroke-linecap="round"/>
</svg>`;
writeFileSync(join(outDir, "favicon.svg"), favicon, "utf8");

const regionSection = `<section class="section" id="yeongnam-areas"><p class="eyebrow">추가 서비스 지역</p><h2>영남권 지역 바로가기</h2><div class="grid-3"><a class="card area-card" href="/area/%EC%9A%B8%EC%82%B0/"><h3>울산</h3><p>울산 남구, 중구, 동구, 북구, 울주군 출장마사지와 홈타이 세부 지역을 확인하세요.</p></a><a class="card area-card" href="/area/%EA%B2%BD%EB%B6%81/"><h3>경북</h3><p>경북 포항시와 경주시 출장마사지, 홈타이 가능 지역을 2차와 3차 지역 기준으로 확인하세요.</p></a><a class="card area-card" href="/area/%EB%8C%80%EA%B5%AC/"><h3>대구</h3><p>대구 중구, 동구, 수성구, 달서구 등 주요 구군과 행정동 정보를 확인하세요.</p></a><a class="card area-card" href="/area/%EA%B2%BD%EB%B6%81/%ED%8F%AC%ED%95%AD%EC%8B%9C/"><h3>포항시</h3><p>포항시 중앙동, 죽도동, 두호동, 효곡동 등 세부 지역 예약 안내를 확인하세요.</p></a><a class="card area-card" href="/area/%EA%B2%BD%EB%B6%81/%EA%B2%BD%EC%A3%BC%EC%8B%9C/"><h3>경주시</h3><p>경주시 황오동, 성건동, 황남동, 용강동 등 세부 지역 안내를 확인하세요.</p></a><a class="card area-card" href="/area/%EA%B2%BD%EB%82%A8/"><h3>경남</h3><p>김해시, 양산시, 창원시 출장마사지와 홈타이 지역 페이지로 이동합니다.</p></a></div></section>`;

function walk(dir) {
  return readdirSync(dir).flatMap((entry) => {
    const path = join(dir, entry);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });
}

for (const file of walk(outDir)) {
  if (!file.endsWith(".html")) continue;
  let html = readFileSync(file, "utf8");

  if (!html.includes("/favicon.svg")) {
    html = html.replace("<style>", '<link rel="icon" type="image/svg+xml" href="/favicon.svg"><link rel="shortcut icon" href="/favicon.svg"><style>');
  }

  if (file.endsWith(join("out", "index.html")) && !html.includes('id="yeongnam-areas"')) {
    html = html.replace('<section class="section" id="price">', `${regionSection}<section class="section" id="price">`);
  }

  writeFileSync(file, html, "utf8");
}
