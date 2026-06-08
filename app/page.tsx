"use client";

import { useState } from "react";
import {
  ArrowRight,
  BookOpen,
  Calendar,
  Code2,
  Cpu,
  Layers,
  Mail,
  Rocket,
  Send,
  ShieldCheck,
  Sparkles,
  Users,
  Zap,
} from "lucide-react";
import Navbar from "./components/Navbar";
import AuthModal, { type AuthMode } from "./components/AuthModal";
import StarrySky from "./components/StarrySky";
import TodoCard from "./components/TodoCard";

const FEATURES = [
  {
    icon: Zap,
    title: "极速体验",
    desc: "基于 Next.js 与 Turbopack 构建，毫秒级热更新，丝滑流畅。",
  },
  {
    icon: ShieldCheck,
    title: "数据持久化",
    desc: "待办本地存储，刷新不丢失，随时记录你的灵感与计划。",
  },
  {
    icon: Cpu,
    title: "科技美学",
    desc: "星空、紫色、玻璃拟态，沉浸式的视觉与交互设计。",
  },
  {
    icon: Layers,
    title: "组件化架构",
    desc: "清晰的模块划分，易于扩展，让你的项目持续生长。",
  },
];

const COURSES = [
  {
    tag: "前端入门",
    title: "React 19 与 Next.js 实战",
    desc: "从零搭建现代化全栈应用，掌握 App Router 与服务端组件。",
    level: "初级 · 12 课时",
  },
  {
    tag: "界面设计",
    title: "Tailwind CSS 美学进阶",
    desc: "用原子化 CSS 打造星空级视觉，玻璃拟态与渐变的艺术。",
    level: "中级 · 8 课时",
  },
  {
    tag: "工程实践",
    title: "TypeScript 类型体操",
    desc: "构建健壮可维护的大型应用，让类型成为你的好帮手。",
    level: "高级 · 16 课时",
  },
];

const NEWS = [
  {
    date: "2026.06.08",
    title: "三池书院工作室官网正式上线 🚀",
    desc: "全新星空主题首页发布，集成待办清单与课程体系。",
  },
  {
    date: "2026.05.20",
    title: "新增「星空待办」核心功能",
    desc: "支持本地持久化、筛选与一键清理，记录每一个小目标。",
  },
  {
    date: "2026.04.30",
    title: "组件库重构完成",
    desc: "全面拥抱 React 19 与 Tailwind CSS v4，性能再提升。",
  },
];

const STATS = [
  { value: "10k+", label: "学习者" },
  { value: "50+", label: "精品课程" },
  { value: "99.9%", label: "服务可用" },
  { value: "24/7", label: "社区陪伴" },
];

export default function Home() {
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>("login");

  function openAuth(mode: AuthMode) {
    setAuthMode(mode);
    setAuthOpen(true);
  }

  return (
    <div className="relative flex min-h-screen flex-col text-white">
      <StarrySky />
      <Navbar onAuth={openAuth} />

      <main className="flex-1">
        {/* 首页核心区：星空待办 */}
        <section
          id="home"
          className="mx-auto flex max-w-6xl flex-col items-center gap-12 px-4 py-20 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:py-28"
        >
          <div className="max-w-xl text-center lg:text-left">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-sm text-indigo-200/80">
              <Sparkles className="h-4 w-4 text-amber-300" />
              探索宇宙级的高效体验
            </span>
            <h1 className="mt-6 bg-gradient-to-r from-white via-indigo-200 to-fuchsia-300 bg-clip-text text-4xl font-extrabold leading-tight tracking-tight text-transparent sm:text-5xl">
              在星河之间，
              <br />
              规划你的每一天
            </h1>
            <p className="mt-5 text-lg leading-8 text-indigo-200/70">
              三池书院工作室，一个融合科技与书法书香的平台。
              从这里的星空待办开始，记录灵感、管理任务、点亮目标。
            </p>
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row lg:items-start">
              <button
                onClick={() => openAuth("register")}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-indigo-400 to-fuchsia-500 px-6 py-3 font-semibold text-white shadow-lg shadow-fuchsia-500/30 transition hover:scale-105 active:scale-95 sm:w-auto"
              >
                免费开始
                <ArrowRight className="h-4 w-4" />
              </button>
              <a
                href="#features"
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/15 px-6 py-3 font-medium text-white transition hover:bg-white/5 sm:w-auto"
              >
                了解更多
              </a>
            </div>
          </div>

          <div className="flex w-full justify-center lg:w-auto">
            <TodoCard />
          </div>
        </section>

        {/* 功能 */}
        <Section id="features" eyebrow="功能特性" title="为何选择三池书院工作室">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="group rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md transition hover:-translate-y-1 hover:border-fuchsia-400/40 hover:bg-white/10"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-400 to-fuchsia-500 shadow-lg shadow-fuchsia-500/30">
                  <f.icon className="h-6 w-6 text-white" />
                </span>
                <h3 className="mt-4 text-lg font-semibold text-white">
                  {f.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-indigo-200/70">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </Section>

        {/* 课程 */}
        <Section id="courses" eyebrow="精品课程" title="开启你的学习之旅">
          <div className="grid gap-5 md:grid-cols-3">
            {COURSES.map((c) => (
              <div
                key={c.title}
                className="flex flex-col rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md transition hover:border-fuchsia-400/40 hover:bg-white/10"
              >
                <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-fuchsia-500/15 px-3 py-1 text-xs font-medium text-fuchsia-200">
                  <BookOpen className="h-3.5 w-3.5" />
                  {c.tag}
                </span>
                <h3 className="mt-4 text-lg font-semibold text-white">
                  {c.title}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-6 text-indigo-200/70">
                  {c.desc}
                </p>
                <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-4">
                  <span className="text-xs text-indigo-200/60">{c.level}</span>
                  <a
                    href="#"
                    className="flex items-center gap-1 text-sm font-medium text-fuchsia-300 transition hover:text-fuchsia-200"
                  >
                    查看课程
                    <ArrowRight className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* 工作室动态 */}
        <Section id="news" eyebrow="工作室动态" title="最新消息与更新">
          <div className="mx-auto max-w-3xl space-y-4">
            {NEWS.map((n) => (
              <div
                key={n.title}
                className="flex items-start gap-4 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-md transition hover:border-fuchsia-400/40 hover:bg-white/10"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-400 to-fuchsia-500">
                  <Calendar className="h-5 w-5 text-white" />
                </span>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold text-white">{n.title}</h3>
                    <span className="text-xs text-indigo-200/50">{n.date}</span>
                  </div>
                  <p className="mt-1 text-sm leading-6 text-indigo-200/70">
                    {n.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* 关于我们 */}
        <Section id="about" eyebrow="关于我们" title="我们是三池书院工作室">
          <div className="mx-auto max-w-3xl text-center">
            <Rocket className="mx-auto h-10 w-10 text-fuchsia-300" />
            <p className="mt-5 text-lg leading-8 text-indigo-200/80">
              三池书院工作室是一支热爱技术与设计的团队，致力于打造兼具
              科技感与美学的产品与课程。我们相信，每一个伟大的创意，
              都始于一份清晰的待办清单，和一片仰望的星空。
            </p>
            <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {STATS.map((s) => (
                <div
                  key={s.label}
                  className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-md"
                >
                  <div className="bg-gradient-to-r from-indigo-300 to-fuchsia-300 bg-clip-text text-2xl font-extrabold text-transparent">
                    {s.value}
                  </div>
                  <div className="mt-1 text-sm text-indigo-200/60">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-10 flex items-center justify-center gap-3 text-indigo-200/70">
              <Users className="h-5 w-5" />
              <span className="text-sm">加入我们，与万千探索者一同成长</span>
            </div>
          </div>
        </Section>
      </main>

      {/* 页脚 */}
      <footer className="border-t border-white/10 bg-[#070716]/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row sm:px-6">
          <div className="flex items-center gap-2 text-sm text-indigo-200/60">
            <Sparkles className="h-4 w-4 text-amber-300" />
            © 2026 三池书院工作室 · Galaxy Studio
          </div>
          <div className="flex items-center gap-4 text-indigo-200/60">
            <a href="#" className="transition hover:text-white" aria-label="代码仓库">
              <Code2 className="h-5 w-5" />
            </a>
            <a href="#" className="transition hover:text-white" aria-label="社交媒体">
              <Send className="h-5 w-5" />
            </a>
            <a href="#" className="transition hover:text-white" aria-label="邮箱">
              <Mail className="h-5 w-5" />
            </a>
          </div>
        </div>
      </footer>

      <AuthModal
        open={authOpen}
        mode={authMode}
        onModeChange={setAuthMode}
        onClose={() => setAuthOpen(false)}
      />
    </div>
  );
}

function Section({
  id,
  eyebrow,
  title,
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className="mx-auto max-w-6xl scroll-mt-20 px-4 py-16 sm:px-6 lg:py-24"
    >
      <div className="mb-10 text-center">
        <span className="text-sm font-medium uppercase tracking-[0.2em] text-fuchsia-300/80">
          {eyebrow}
        </span>
        <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
          {title}
        </h2>
      </div>
      {children}
    </section>
  );
}
