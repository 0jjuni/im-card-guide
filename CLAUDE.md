# CLAUDE.md

이 파일은 Claude Code가 이 저장소에서 작업할 때 참고하는 안내서입니다.

## 프로젝트 개요

iM뱅크 영업점 직원이 고객 상담 중 카드를 빠르게 찾아 추천하는 사내 도구입니다.
"개인사업자인데 주유 혜택 카드 있어?" 같은 질문을 발급대상·혜택 필터와 검색으로
즉시 해결하는 것이 목표입니다. 카드사업부는 관리자 화면에서 카드를 추가·수정·단종
처리합니다.

## 기술 스택

- Vite 5 + React 18 (JavaScript / JSX)
- Tailwind CSS 3 — `stone` 중립 + `im` 민트(iM뱅크 브랜드 컬러, tailwind.config.js 정의)
- lucide-react (아이콘)
- Supabase (PostgreSQL) — 카드 데이터 저장소. 미설정 시 로컬 데이터로 폴백
- 라우팅: 해시 기반 (`#/admin` = 관리자, 그 외 = 직원용). 별도 라우터 없음
- 배포: 프론트는 Vercel 등 정적 호스팅, 데이터는 Supabase

## 명령어

- `npm install` — 의존성 설치
- `npm run dev` — 개발 서버
- `npm run build` — 프로덕션 빌드 (`dist/`)
- `npm run preview` — 빌드 미리보기
- `npm run data` — `content/cards/*.md` → `src/data/cards.js`, `filters.js` 재생성
- `npm run seed` — 로컬 카드 데이터를 Supabase `cards` 테이블에 적재 (최초 1회)

## Supabase 설정 (DB 모드)

1. supabase.com 에서 프로젝트 생성
2. SQL Editor 에 `supabase/schema.sql` 붙여넣고 실행 → `cards` 테이블 생성
3. `.env.example` 을 `.env` 로 복사하고 값 입력:
   - `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` — 프론트엔드용 (Project Settings > API)
   - `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` — 시드 스크립트용 (service_role 키, 커밋 금지)
4. `npm run seed` — 196개 카드를 DB 에 적재
5. `npm run dev` — 이제 앱이 Supabase 에서 카드를 읽고, 관리자 화면에서 쓰기 가능

`.env` 가 없으면 앱은 `src/data/cards.js` 의 로컬 데이터로 동작하며 관리자 화면은
읽기 전용이 됩니다. 즉 Supabase 없이도 직원용 화면은 바로 뜹니다.

주의: `supabase/schema.sql` 의 쓰기 정책(`cards_write_dev`)은 개발용으로 열려
있습니다. 운영 배포 전 Supabase Auth 기반 정책으로 교체하세요 (schema.sql 하단 주석).

## 디렉터리 구조

```
index.html
src/main.jsx               React 마운트
src/App.jsx                데이터 로드 + 해시 라우팅(직원/관리자)
src/index.css              Tailwind + .md-body(카드 상세) 스타일
src/lib/
  supabase.js              Supabase 클라이언트 (env 없으면 null)
  cardsRepo.js             데이터 계층 — Supabase 또는 로컬 폴백
  format.js                cn(), 카드종류·상태 배지 스타일
src/data/
  cards.js                 카드 196개 (자동 생성 — 로컬 폴백/시드 원본)
  filters.js               카드종류·발급대상·혜택·상태 목록 (자동 생성)
src/components/
  Brand.jsx                브랜드 로고
  Sidebar.jsx              필터 패널 (발급대상·카드종류·혜택·상태)
  CardGrid.jsx             결과 리스트
  CardTile.jsx             결과 리스트의 카드 한 줄
  CardModal.jsx            카드 상세 모달
  admin/CardForm.jsx       카드 추가·수정 폼
src/pages/
  GuidePage.jsx            직원용 — 검색·필터·리스트
  AdminPage.jsx            카드사업부용 — 카드 CRUD·단종 처리
content/cards/*.md         카드 원본 콘텐츠 196개 (로컬 폴백의 source)
scripts/
  build-cards.mjs          content → src/data 생성기 (npm run data)
  seed-supabase.mjs        src/data/cards.js → Supabase 적재 (npm run seed)
supabase/schema.sql        DB 스키마
```

## 데이터 모델

카드 객체 필드 (`cardsRepo.js` 가 Supabase row 와 객체를 상호 변환):

- id: 정수
- name: 카드명
- type: 신용카드 / 체크카드 / 법인카드 / 기타
- status: 판매중 / 단종
- targets: 발급대상 배열 — 개인 / 개인사업자 / 법인
- targetText: 발급대상 원문
- fee: 연회비 표시 문자열 / feemin: 최소 연회비 숫자
- summary: 대표혜택 한 줄
- cats: 정규화된 혜택 카테고리 배열 (필터용)
- rawcats: 원본 혜택 태그 (검색용)
- body: 카드 상세 HTML
- mdfile: 원본 마크다운 파일명

Supabase `cards` 테이블 컬럼은 snake_case (`target_text`, `fee_min`, `raw_cats`,
`source_file`). 변환은 `cardsRepo.js` 의 `fromRow` / `toRow`.

## 데이터 갱신 흐름

- DB 모드 운영 중: 카드사업부가 `#/admin` 에서 추가·수정·단종. 또는 Supabase
  대시보드에서 직접 편집.
- 로컬/시드 데이터 수정: `content/cards/<파일>.md` 수정 → `npm run data` →
  `src/data/cards.js` 갱신. DB 에 반영하려면 `npm run seed`.
- `src/data/*.js` 는 자동 생성물이므로 직접 편집하지 않는다.

## 디자인 규칙

- 색상: `stone` 중립 + `im`(민트) 강조. 노란색 사용 금지(iM뱅크는 민트 브랜드).
- 모서리 작게(rounded-sm/md), 폰트 Noto Sans KR, 조밀한 영업점 도구 톤.
- 카드종류 배지: 신용=sky, 체크=im(민트), 법인=violet, 기타=stone (`format.js`).
- 동적 조합 Tailwind 클래스는 JIT 스캔을 위해 `format.js` 등에 문자열 전체로 존재.

## 알려진 한계 / 향후 작업

- status 는 전 카드 기본 '판매중'. 실제 단종 카드는 카드사업부가 관리자 화면에서 지정.
- targets(발급대상)는 카드명·발급대상 텍스트로 추정한 값 — 관리자 화면에서 보정 가능.
- 카드 본문(body)은 HTML 문자열. 관리자 폼은 HTML 직접 입력 — 추후 마크다운/리치
  에디터 도입 여지.
- 운영 전 Supabase 쓰기 RLS 정책을 인증 기반으로 강화 필요.
- 향후: 연회비 구간 필터, 카드 비교, 카드 이미지, 약관·변경이력 연동.
