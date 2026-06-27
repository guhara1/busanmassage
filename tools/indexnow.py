#!/usr/bin/env python3
"""IndexNow 즉시 색인 통보 스크립트.

부산마사지 사이트의 모든 URL을 IndexNow 프로토콜로 Bing / Naver 등
참여 검색엔진에 즉시 통보합니다. 외부 의존성 없이 표준 라이브러리만 사용합니다.

사용법:
    python tools/indexnow.py                # sitemap 의 모든 URL 통보
    python tools/indexnow.py https://busanrun1.netlify.app/area/부산/   # 특정 URL 만 통보
    python tools/indexnow.py --dry-run      # 전송하지 않고 대상 URL 만 출력

글을 새로 올리거나 도메인/지역 페이지가 바뀔 때마다 한 번 실행하면 됩니다.
"""

import sys
import json
import gzip
import urllib.request
import urllib.error
import xml.etree.ElementTree as ET
from pathlib import Path

# scripts/patch-indexnow.mjs 의 key 와 반드시 동일해야 합니다.
KEY = "cae8c256405f61db5e7963e3a4864539"
HOST = "busanrun1.netlify.app"
SITE = f"https://{HOST}"
KEY_LOCATION = f"{SITE}/{KEY}.txt"

# IndexNow 는 한 엔드포인트에 보내면 참여 검색엔진끼리 공유되지만,
# 전달 신뢰성을 위해 주요 엔진에 직접 중복 통보합니다.
ENDPOINTS = [
    "https://api.indexnow.org/indexnow",
    "https://www.bing.com/indexnow",
    "https://searchadvisor.naver.com/indexnow",
]

LOCAL_SITEMAP = Path(__file__).resolve().parent.parent / "out" / "sitemap.xml"
SITEMAP_NS = "{http://www.sitemaps.org/schemas/sitemap/0.9}"
UA = {"User-Agent": "busanrun-indexnow/1.0"}


def urls_from_local_sitemap():
    if not LOCAL_SITEMAP.exists():
        return []
    root = ET.fromstring(LOCAL_SITEMAP.read_text(encoding="utf-8"))
    return [loc.text.strip() for loc in root.iter(f"{SITEMAP_NS}loc") if loc.text]


def urls_from_remote_sitemap():
    req = urllib.request.Request(f"{SITE}/sitemap.xml", headers=UA)
    with urllib.request.urlopen(req, timeout=30) as resp:
        data = resp.read()
    if data[:2] == b"\x1f\x8b":  # gzip
        data = gzip.decompress(data)
    root = ET.fromstring(data)
    return [loc.text.strip() for loc in root.iter(f"{SITEMAP_NS}loc") if loc.text]


def collect_urls():
    urls = urls_from_local_sitemap()
    if urls:
        print(f"[indexnow] 로컬 sitemap 에서 {len(urls)}개 URL 수집 ({LOCAL_SITEMAP})")
        return urls
    print("[indexnow] 로컬 sitemap 없음 → 원격 sitemap 다운로드")
    urls = urls_from_remote_sitemap()
    print(f"[indexnow] 원격 sitemap 에서 {len(urls)}개 URL 수집")
    return urls


def chunked(seq, size):
    for i in range(0, len(seq), size):
        yield seq[i:i + size]


def submit(endpoint, url_list):
    payload = json.dumps({
        "host": HOST,
        "key": KEY,
        "keyLocation": KEY_LOCATION,
        "urlList": url_list,
    }).encode("utf-8")
    req = urllib.request.Request(
        endpoint,
        data=payload,
        headers={**UA, "Content-Type": "application/json; charset=utf-8"},
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            return resp.status, resp.read(200).decode("utf-8", "replace").strip()
    except urllib.error.HTTPError as e:
        return e.code, e.read(200).decode("utf-8", "replace").strip()
    except urllib.error.URLError as e:
        return None, str(e.reason)


def main(argv):
    args = [a for a in argv if not a.startswith("--")]
    dry_run = "--dry-run" in argv

    urls = args if args else collect_urls()
    if not urls:
        print("[indexnow] 통보할 URL 이 없습니다.", file=sys.stderr)
        return 1

    print(f"[indexnow] 대상 URL {len(urls)}개, keyLocation={KEY_LOCATION}")
    if dry_run:
        for u in urls:
            print(f"  {u}")
        print("[indexnow] --dry-run: 실제 전송하지 않았습니다.")
        return 0

    ok = True
    # IndexNow 권장: 요청당 최대 10,000 URL. 안전하게 1,000 단위로 분할.
    for endpoint in ENDPOINTS:
        for batch in chunked(urls, 1000):
            status, body = submit(endpoint, batch)
            tag = "OK" if status in (200, 202) else "FAIL"
            if status not in (200, 202):
                ok = False
            preview = f" {body}" if body else ""
            print(f"[indexnow] {tag} {status} {endpoint} ({len(batch)} urls){preview}")

    return 0 if ok else 2


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1:]))
