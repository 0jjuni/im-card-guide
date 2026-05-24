-- iM뱅크 카드 가이드 — Supabase 스키마
-- Supabase 프로젝트 > SQL Editor 에 붙여넣고 실행하세요.

create table if not exists public.cards (
  id          bigint generated always as identity primary key,
  name        text not null,
  type        text not null default '기타',          -- 신용카드 / 체크카드 / 법인카드 / 기타
  status      text not null default '판매중',         -- 판매중 / 단종
  targets     text[] not null default '{}',          -- 개인 / 개인사업자 / 법인
  target_text text default '',                       -- 발급대상 원문
  fee         text default '',                       -- 연회비 표시 문자열
  fee_min     integer,                               -- 최소 연회비(숫자)
  summary     text default '',                       -- 대표혜택 한 줄
  cats        text[] not null default '{}',          -- 정규화된 혜택 카테고리
  raw_cats    text[] not null default '{}',          -- 원본 혜택 태그
  body        text default '',                       -- 카드 상세 (HTML)
  source_file text,                                  -- 원본 마크다운 파일명
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists cards_type_idx   on public.cards (type);
create index if not exists cards_status_idx on public.cards (status);

-- updated_at 자동 갱신
create or replace function public.touch_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists cards_touch on public.cards;
create trigger cards_touch before update on public.cards
  for each row execute function public.touch_updated_at();

-- Row Level Security
alter table public.cards enable row level security;

-- 읽기: 누구나 (사내 조회용)
drop policy if exists cards_select on public.cards;
create policy cards_select on public.cards for select using (true);

-- ⚠ 개발용 쓰기 정책 — 누구나 추가/수정/삭제 가능.
--   운영 배포 전에는 반드시 아래를 삭제하고 Supabase Auth 기반 정책으로 교체하세요.
drop policy if exists cards_write_dev on public.cards;
create policy cards_write_dev on public.cards
  for all using (true) with check (true);

-- [운영용 예시] 인증 사용자만 쓰기 — 위 dev 정책 삭제 후 활성화
-- create policy cards_write_auth on public.cards
--   for all using (auth.role() = 'authenticated')
--   with check (auth.role() = 'authenticated');
