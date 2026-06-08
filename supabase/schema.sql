-- ============================================================
-- 三池书院工作室 · 待办清单数据库结构
-- 用法：复制本文件内容，粘贴到 Supabase 后台 → SQL Editor → 运行
-- ============================================================

-- 待办表
create table if not exists public.todos (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users (id) on delete cascade,
  email       text default auth.email(),
  text        text not null check (char_length(text) between 1 and 500),
  done        boolean not null default false,
  inserted_at timestamptz not null default now()
);

-- 若表已存在，补加 email 列（已运行过旧脚本的用户执行这一句即可）
alter table public.todos
  add column if not exists email text default auth.email();

-- 常用查询索引：按用户 + 时间排序
create index if not exists todos_user_id_inserted_at_idx
  on public.todos (user_id, inserted_at desc);

-- 开启行级安全（RLS）
alter table public.todos enable row level security;

-- 策略：用户只能查看自己的待办
drop policy if exists "用户查看自己的待办" on public.todos;
create policy "用户查看自己的待办"
  on public.todos for select
  using (auth.uid() = user_id);

-- 策略：用户只能插入属于自己的待办
drop policy if exists "用户新增自己的待办" on public.todos;
create policy "用户新增自己的待办"
  on public.todos for insert
  with check (auth.uid() = user_id);

-- 策略：用户只能更新自己的待办
drop policy if exists "用户更新自己的待办" on public.todos;
create policy "用户更新自己的待办"
  on public.todos for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- 策略：用户只能删除自己的待办
drop policy if exists "用户删除自己的待办" on public.todos;
create policy "用户删除自己的待办"
  on public.todos for delete
  using (auth.uid() = user_id);
