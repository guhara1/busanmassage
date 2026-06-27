#!/usr/bin/env python3
"""Google Indexing API 색인 통보 스크립트 (선택).

Google 은 IndexNow 에 참여하지 않으므로, 즉시 색인 요청은 별도의
Indexing API 를 사용합니다. 서비스 계정 인증이 필요합니다.

준비:
  1) Google Cloud 프로젝트에서 "Indexing API" 활성화
  2) 서비스 계정 생성 후 JSON 키 다운로드
  3) Google Search Console 에서 busanrun1.netlify.app 속성에
     해당 서비스 계정 이메일을 "소유자(Owner)" 로 추가
  4) 의존성 설치:
        pip install google-api-python-client google-auth

사용법:
  GOOGLE_INDEXING_CREDENTIALS=/path/to/service-account.json \
      python tools/google_indexing.py
  python tools/google_indexing.py https://busanrun1.netlify.app/area/부산/

참고: Indexing API 는 1일 200건 기본 쿼터가 있습니다. 대량 일괄 색인은
sitemap + IndexNow(tools/indexnow.py) 로 처리하고, 본 스크립트는 신규/수정
페이지의 즉시 색인 요청에 사용하는 것을 권장합니다.
"""

import os
import sys
from pathlib import Path

LOCAL_SITEMAP = Path(__file__).resolve().parent.parent / "out" / "sitemap.xml"
SITEMAP_NS = "{http://www.sitemaps.org/schemas/sitemap/0.9}"
SCOPES = ["https://www.googleapis.com/auth/indexing"]
ENDPOINT = "https://indexing.googleapis.com/v3/urlNotifications:publish"


def collect_urls(args):
    if args:
        return args
    import xml.etree.ElementTree as ET
    if not LOCAL_SITEMAP.exists():
        print("[google] 로컬 out/sitemap.xml 이 없습니다. URL 을 인자로 전달하세요.",
              file=sys.stderr)
        return []
    root = ET.fromstring(LOCAL_SITEMAP.read_text(encoding="utf-8"))
    return [loc.text.strip() for loc in root.iter(f"{SITEMAP_NS}loc") if loc.text]


def main(argv):
    creds_path = os.environ.get("GOOGLE_INDEXING_CREDENTIALS")
    if not creds_path or not Path(creds_path).exists():
        print("[google] 환경변수 GOOGLE_INDEXING_CREDENTIALS 에 서비스 계정 "
              "JSON 키 경로를 지정하세요.", file=sys.stderr)
        return 1

    try:
        from google.oauth2 import service_account
        from googleapiclient.discovery import build
    except ImportError:
        print("[google] 의존성 누락: pip install google-api-python-client google-auth",
              file=sys.stderr)
        return 1

    urls = collect_urls(argv)
    if not urls:
        return 1

    credentials = service_account.Credentials.from_service_account_file(
        creds_path, scopes=SCOPES)
    service = build("indexing", "v3", credentials=credentials, cache_discovery=False)

    ok = True
    for url in urls:
        try:
            service.urlNotifications().publish(
                body={"url": url, "type": "URL_UPDATED"}).execute()
            print(f"[google] OK URL_UPDATED {url}")
        except Exception as e:  # noqa: BLE001 - 개별 URL 실패는 계속 진행
            ok = False
            print(f"[google] FAIL {url} -> {e}", file=sys.stderr)

    return 0 if ok else 2


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1:]))
