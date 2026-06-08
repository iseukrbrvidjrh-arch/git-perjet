"use client";

import Image from "next/image";
import { useState } from "react";
import { LogIn, LogOut, Menu, UserPlus, UserRound, X } from "lucide-react";
import type { AuthMode } from "./AuthModal";
import { useAuth } from "./AuthProvider";
import { Button } from "@/components/ui/button";

const NAV_LINKS = [
  { href: "#home", label: "首页" },
  { href: "#features", label: "功能" },
  { href: "#courses", label: "课程" },
  { href: "#news", label: "工作室动态" },
  { href: "#about", label: "关于我们" },
];

type Props = {
  onAuth: (mode: AuthMode) => void;
};

export default function Navbar({ onAuth }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, signOut } = useAuth();

  const displayName =
    (user?.user_metadata?.name as string | undefined) ||
    user?.email?.split("@")[0] ||
    "";

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#070716]/70 backdrop-blur-xl">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* 左上角 Logo + 网站名称 */}
        <a href="#home" className="flex items-center gap-2.5">
          <span className="relative h-9 w-9 overflow-hidden rounded-xl ring-1 ring-white/20 ring-offset-1 ring-offset-[#070716]">
            <Image
              src="/logo.png"
              alt="三池书院工作室 Logo"
              fill
              sizes="36px"
              className="object-cover"
              priority
            />
          </span>
          <span className="flex flex-col leading-none">
            <span className="text-base font-bold tracking-tight text-white">
              三池书院工作室
            </span>
            <span className="text-[10px] font-medium tracking-[0.2em] text-indigo-300/60">
              GALAXY STUDIO
            </span>
          </span>
        </a>

        {/* 中间导航项 */}
        <ul className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="rounded-lg px-3 py-2 text-sm font-medium text-indigo-100/80 transition hover:bg-white/5 hover:text-white"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* 右上角：已登录显示用户/登出，未登录显示登录/注册 */}
        <div className="hidden items-center gap-2 md:flex">
          {user ? (
            <>
              <span className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-indigo-100/90">
                <UserRound className="h-4 w-4 text-fuchsia-300" />
                {displayName}
              </span>
              <Button
                variant="outline"
                onClick={() => signOut()}
                className="border-white/15 bg-transparent text-white hover:bg-white/5 hover:text-white"
              >
                <LogOut className="h-4 w-4" />
                退出
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                onClick={() => onAuth("login")}
                className="border-white/15 bg-transparent text-white hover:bg-white/5 hover:text-white"
              >
                <LogIn className="h-4 w-4" />
                登录
              </Button>
              <Button
                onClick={() => onAuth("register")}
                className="bg-gradient-to-br from-indigo-400 to-fuchsia-500 font-semibold text-white shadow-lg shadow-fuchsia-500/30 hover:from-indigo-400 hover:to-fuchsia-500 hover:brightness-110"
              >
                <UserPlus className="h-4 w-4" />
                注册
              </Button>
            </>
          )}
        </div>

        {/* 移动端菜单按钮 */}
        <button
          onClick={() => setMenuOpen((v) => !v)}
          className="text-white md:hidden"
          aria-label="菜单"
        >
          {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {/* 移动端展开菜单 */}
      {menuOpen && (
        <div className="border-t border-white/10 bg-[#070716]/95 px-4 py-4 md:hidden">
          <ul className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="block rounded-lg px-3 py-2 text-sm font-medium text-indigo-100/80 transition hover:bg-white/5 hover:text-white"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-3 flex gap-2">
            {user ? (
              <>
                <span className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-indigo-100/90">
                  <UserRound className="h-4 w-4 text-fuchsia-300" />
                  {displayName}
                </span>
                <Button
                  variant="outline"
                  onClick={() => {
                    setMenuOpen(false);
                    signOut();
                  }}
                  className="flex-1 border-white/15 bg-transparent text-white hover:bg-white/5 hover:text-white"
                >
                  <LogOut className="h-4 w-4" />
                  退出
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  onClick={() => {
                    setMenuOpen(false);
                    onAuth("login");
                  }}
                  className="flex-1 border-white/15 bg-transparent text-white hover:bg-white/5 hover:text-white"
                >
                  <LogIn className="h-4 w-4" />
                  登录
                </Button>
                <Button
                  onClick={() => {
                    setMenuOpen(false);
                    onAuth("register");
                  }}
                  className="flex-1 bg-gradient-to-br from-indigo-400 to-fuchsia-500 font-semibold text-white hover:from-indigo-400 hover:to-fuchsia-500 hover:brightness-110"
                >
                  <UserPlus className="h-4 w-4" />
                  注册
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
