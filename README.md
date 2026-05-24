# iM뱅크 카드 상품 가이드 (영업점 전용)

iM뱅크 영업점 직원이 고객 상담 중 카드를 빠르게 찾아 추천하는 사내 웹 도구입니다.
"개인사업자인데 주유 혜택 카드 있어?" 같은 질문을 발급대상·혜택 필터와 검색으로
바로 해결합니다. 카드사업부는 관리자 화면에서 카드를 추가·수정·단종 처리합니다.

## 주요 기능

- 카드명·혜택 검색
- 발급 대상 필터 — 개인 / 개인사업자 / 법인
- 카드 종류 필터 — 신용 / 체크 / 법인 / 기타
- 혜택 카테고리 필터 19종 (주유·교통·캐시백·여행항공 등)
- 판매 상태 — 단종 카드는 "신규 발급 불가 · 기존 고객 안내용"으로 표시
- 카드 상세 보기 — 발급대상·연회비·혜택·유의사항 전문
- 관리자 화면(`#/admin`) — 카드사업부의 카드 추가·수정·단종 처리

## 기술 스택

Vite 5 · React 18 · Tailwind CSS 3 · lucide-react · Supabase(PostgreSQL)

## 빠른 시작 (로컬 데이터)

```
npm install
npm run dev
```

Supabase 설정이 없으면 `src/data/cards.js` 의 로컬 데이터(카드 196개)로 바로
동작합니다. 단, 이 모드에서 관리자 화면은 읽기 전용입니다.

## Supabase 연결 (카드 추가·관리)

1. supabase.com 에서 프로젝트 생성
2. SQL Editor 에 `supabase/schema.sql` 실행 → `cards` 테이블 생성
3. `.env.example` 을 `.env` 로 복사 후 키 입력
   - `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` (프론트엔드)
   - `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` (시드용, 커밋 금지)
4. `npm run seed` — 카드 196개를 DB 에 적재
5. `npm run dev` — 이제 DB 에서 카드를 읽고, `#/admin` 에서 카드 관리 가능

운영 배포 전 `supabase/schema.sql` 의 쓰기 정책을 인증 기반으로 교체하세요.

## 빌드 및 배포

```
npm run build
```

`dist/` 를 Vercel·Netlify 등에 배포합니다. Supabase 환경변수는 호스팅 플랫폼의
환경변수 설정에 등록합니다.

## 카드 콘텐츠 원본

`content/cards/*.md` (카드 1개 = 마크다운 1개)가 로컬 데이터의 원본입니다.
수정 후 `npm run data` 로 `src/data/` 를 재생성하고, 필요 시 `npm run seed` 로
DB 에 반영합니다.

## 데이터 출처

iM뱅크 카드 상품설명서 PDF 196건에서 추출·정리. 정확한 조건은 상품설명서·약관
원문을 확인하세요. 사내 참고용 도구입니다.
