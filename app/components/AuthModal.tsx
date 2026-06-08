"use client";

import { useEffect, useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  Loader2,
  Lock,
  Mail,
  Sparkles,
  TriangleAlert,
  User,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "./AuthProvider";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export type AuthMode = "login" | "register";

type Props = {
  open: boolean;
  mode: AuthMode;
  onModeChange: (mode: AuthMode) => void;
  onClose: () => void;
};

export default function AuthModal({ open, mode, onModeChange, onClose }: Props) {
  const { signIn, signUp, configured } = useAuth();
  const [registered, setRegistered] = useState(false);
  const [needsConfirm, setNeedsConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  useEffect(() => {
    if (!open) {
      setRegistered(false);
      setNeedsConfirm(false);
      setError(null);
      setSubmitting(false);
      setForm({ name: "", email: "", password: "" });
    }
  }, [open]);

  useEffect(() => {
    setRegistered(false);
    setNeedsConfirm(false);
    setError(null);
  }, [mode]);

  const isRegister = mode === "register";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    if (isRegister) {
      const { error, needsConfirmation } = await signUp(
        form.email,
        form.password,
        form.name
      );
      setSubmitting(false);
      if (error) {
        setError(error);
        return;
      }
      setNeedsConfirm(needsConfirmation);
      setRegistered(true);
    } else {
      const { error } = await signIn(form.email, form.password);
      setSubmitting(false);
      if (error) {
        setError(error);
        return;
      }
      toast.success("登录成功，欢迎回来！");
      onClose();
    }
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="border-white/10 shadow-fuchsia-900/30">
        {registered ? (
          <div className="flex flex-col items-center gap-5 py-6 text-center">
            <DialogHeader className="sr-only">
              <DialogTitle>注册成功</DialogTitle>
              <DialogDescription>账户已创建</DialogDescription>
            </DialogHeader>
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-indigo-400 to-fuchsia-500 shadow-lg shadow-fuchsia-500/40">
              <CheckCircle2 className="h-8 w-8 text-white" />
            </span>
            <div>
              <h3 className="text-xl font-bold text-white">注册成功！</h3>
              <p className="mt-1 text-sm text-indigo-200/70">
                {needsConfirm
                  ? "我们已向你的邮箱发送确认邮件，请查收并完成验证后再登录。"
                  : "欢迎加入三池书院工作室，开启你的探索之旅 ✨"}
              </p>
            </div>
            <Button
              variant="outline"
              className="border-white/15 bg-white/5 text-white hover:bg-white/10 hover:text-white"
              onClick={() => {
                setRegistered(false);
                onModeChange("login");
              }}
            >
              <ArrowLeft className="h-4 w-4" />
              返回登录
            </Button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-xl text-white">
                <Sparkles className="h-5 w-5 text-amber-300" />
                {isRegister ? "创建账户" : "欢迎回来"}
              </DialogTitle>
              <DialogDescription className="text-indigo-200/60">
                {isRegister
                  ? "注册一个账户，让待办在云端同步。"
                  : "登录以同步你的星空待办。"}
              </DialogDescription>
            </DialogHeader>

            {!configured && (
              <div className="flex items-start gap-2 rounded-xl border border-amber-400/30 bg-amber-400/10 p-3 text-sm text-amber-200">
                <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" />
                <span>
                  尚未配置 Supabase。请在 <code>.env.local</code> 填写 URL 与
                  anon key 并重启开发服务器后再试。
                </span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {isRegister && (
                <div className="flex flex-col gap-2">
                  <Label htmlFor="name" className="text-indigo-100/90">
                    <User className="h-4 w-4 text-indigo-200/60" />
                    用户名
                  </Label>
                  <Input
                    id="name"
                    required
                    placeholder="给自己起个名字"
                    value={form.name}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, name: e.target.value }))
                    }
                    className="border-white/10 bg-white/5 text-white placeholder:text-indigo-200/40"
                  />
                </div>
              )}
              <div className="flex flex-col gap-2">
                <Label htmlFor="email" className="text-indigo-100/90">
                  <Mail className="h-4 w-4 text-indigo-200/60" />
                  邮箱
                </Label>
                <Input
                  id="email"
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, email: e.target.value }))
                  }
                  className="border-white/10 bg-white/5 text-white placeholder:text-indigo-200/40"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="password" className="text-indigo-100/90">
                  <Lock className="h-4 w-4 text-indigo-200/60" />
                  密码
                </Label>
                <Input
                  id="password"
                  type="password"
                  required
                  placeholder="至少 6 位"
                  value={form.password}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, password: e.target.value }))
                  }
                  className="border-white/10 bg-white/5 text-white placeholder:text-indigo-200/40"
                />
              </div>

              {error && (
                <div className="flex items-start gap-2 rounded-xl border border-rose-400/30 bg-rose-400/10 p-3 text-sm text-rose-200">
                  <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <Button
                type="submit"
                disabled={submitting}
                className="mt-1 bg-gradient-to-br from-indigo-400 to-fuchsia-500 text-white shadow-lg shadow-fuchsia-500/30 hover:from-indigo-400 hover:to-fuchsia-500 hover:brightness-110"
              >
                {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                {isRegister ? "立即注册" : "登录"}
              </Button>
            </form>

            <p className="text-center text-sm text-indigo-200/60">
              {isRegister ? "已有账户？" : "还没有账户？"}
              <button
                type="button"
                onClick={() => onModeChange(isRegister ? "login" : "register")}
                className="ml-1 font-medium text-fuchsia-300 transition hover:text-fuchsia-200"
              >
                {isRegister ? "去登录" : "去注册"}
              </button>
            </p>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
