# 부산달리기

부산, 김해, 양산, 창원 등 동남권 출장마사지/홈타이 지역 안내 정적 사이트입니다.

- Build: `npm run build`
- Publish directory: `out`
- Domain: `https://busanrun1.netlify.app`

## 검색 색인 (Indexing)

빌드 결과(`out/`)에 검색엔진 색인용 파일이 함께 생성됩니다.

- `sitemap.xml` — 전체 URL (lastmod/priority 포함)
- `rss.xml` — 신규/주요 페이지 피드 (네이버 수집 보조)
- `robots.txt` — Googlebot / NaverBot(Yeti) 허용 + Sitemap 위치 명시
- 메인 페이지에 Google / Naver 사이트 인증 메타태그 삽입
- `<indexnow-key>.txt` — IndexNow 소유권 검증 키 파일

### IndexNow 즉시 색인 통보 (Bing · Naver)

글을 새로 올리거나 페이지가 바뀔 때마다 한 번 실행하면 Bing/Naver 등
IndexNow 참여 검색엔진에 즉시 색인을 통보합니다.

```bash
# 첫 일괄 통보: sitemap 의 모든 URL 통보
python tools/indexnow.py

# 특정 URL 만 통보
python tools/indexnow.py https://busanrun1.netlify.app/area/부산/

# 전송 없이 대상 URL 확인
python tools/indexnow.py --dry-run
```

- 외부 의존성 없이 표준 라이브러리만 사용합니다.
- 로컬 `out/sitemap.xml` 이 있으면 그 URL을, 없으면 원격 sitemap을 사용합니다.
- IndexNow 키는 `scripts/patch-indexnow.mjs` 와 `tools/indexnow.py` 에서
  동일하게 관리합니다. 키 변경 시 두 파일을 함께 수정하세요.

### Google Indexing API (선택)

Google 은 IndexNow 미참여이므로 즉시 색인이 필요하면 별도 API를 사용합니다.
서비스 계정 인증과 Search Console 소유자 등록이 필요합니다 (자세한 준비 단계는
`tools/google_indexing.py` 상단 주석 참고).

```bash
pip install google-api-python-client google-auth
GOOGLE_INDEXING_CREDENTIALS=/path/to/service-account.json \
    python tools/google_indexing.py
```

> 참고: Google/Bing 의 구형 `sitemap ping` 엔드포인트는 모두 폐기되었습니다.
> Google 은 Search Console + sitemap 제출 / Indexing API, 그 외 엔진은
> IndexNow 를 표준 경로로 사용합니다.
