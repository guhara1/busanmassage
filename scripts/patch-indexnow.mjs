import { writeFileSync } from "node:fs";
import { join } from "node:path";

// IndexNow 공유 키. 이 값은 tools/indexnow.py 와 반드시 동일해야 합니다.
// 키 파일은 https://busanrun1.netlify.app/<key>.txt 에서 그대로 노출되어
// Bing / Naver 등 IndexNow 참여 검색엔진이 소유권을 검증합니다.
const key = "cae8c256405f61db5e7963e3a4864539";

writeFileSync(join("out", `${key}.txt`), key, "utf8");
