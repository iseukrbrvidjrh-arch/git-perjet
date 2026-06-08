"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  Cloud,
  HardDrive,
  ListTodo,
  Loader2,
  Plus,
  Sparkles,
  Star,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "./AuthProvider";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

type Todo = {
  id: string;
  text: string;
  done: boolean;
};

type Filter = "all" | "active" | "completed";

const FILTERS: { key: Filter; label: string }[] = [
  { key: "all", label: "全部" },
  { key: "active", label: "进行中" },
  { key: "completed", label: "已完成" },
];

const STORAGE_KEY = "starry-todos";

const DEFAULT_TODOS: Todo[] = [
  { id: "demo-1", text: "欣赏一片璀璨的星空", done: true },
  { id: "demo-2", text: "完成今天的待办清单设计", done: false },
  { id: "demo-3", text: "给自己泡一杯热茶，放松一下", done: false },
];

function newLocalId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `local-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export default function TodoCard() {
  const { user, configured } = useAuth();
  const supabase = getSupabaseBrowserClient();

  const useDb = Boolean(user && configured && supabase);

  const [todos, setTodos] = useState<Todo[]>(DEFAULT_TODOS);
  const [hydrated, setHydrated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (useDb && supabase && user) {
        setLoading(true);
        const { data, error } = await supabase
          .from("todos")
          .select("id, text, done")
          .order("inserted_at", { ascending: false });
        if (!cancelled) {
          if (error) {
            toast.error("加载云端待办失败：" + error.message);
          } else if (data) {
            setTodos(data as Todo[]);
          }
          setLoading(false);
          setHydrated(true);
        }
      } else {
        try {
          const raw = localStorage.getItem(STORAGE_KEY);
          if (raw) {
            const saved = JSON.parse(raw) as Todo[];
            if (Array.isArray(saved)) setTodos(saved);
          } else {
            setTodos(DEFAULT_TODOS);
          }
        } catch {
          setTodos(DEFAULT_TODOS);
        }
        if (!cancelled) setHydrated(true);
      }
    }

    setHydrated(false);
    load();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [useDb, user?.id]);

  useEffect(() => {
    if (!hydrated || useDb) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    } catch {
      // 忽略写入失败（如隐私模式）
    }
  }, [todos, hydrated, useDb]);

  const remaining = todos.filter((t) => !t.done).length;
  const completed = todos.length - remaining;

  const visibleTodos = useMemo(() => {
    if (filter === "active") return todos.filter((t) => !t.done);
    if (filter === "completed") return todos.filter((t) => t.done);
    return todos;
  }, [todos, filter]);

  const addTodo = useCallback(async () => {
    const text = input.trim();
    if (!text) return;
    setInput("");

    if (useDb && supabase && user) {
      const { data, error } = await supabase
        .from("todos")
        .insert({ user_id: user.id, email: user.email, text, done: false })
        .select("id, text, done")
        .single();
      if (error) {
        toast.error("新增失败：" + error.message);
        return;
      }
      if (data) setTodos((prev) => [data as Todo, ...prev]);
    } else {
      setTodos((prev) => [{ id: newLocalId(), text, done: false }, ...prev]);
    }
  }, [input, useDb, supabase, user]);

  const toggleTodo = useCallback(
    async (id: string) => {
      const target = todos.find((t) => t.id === id);
      if (!target) return;
      const nextDone = !target.done;
      setTodos((prev) =>
        prev.map((t) => (t.id === id ? { ...t, done: nextDone } : t))
      );
      if (useDb && supabase) {
        const { error } = await supabase
          .from("todos")
          .update({ done: nextDone })
          .eq("id", id);
        if (error) toast.error("更新失败：" + error.message);
      }
    },
    [todos, useDb, supabase]
  );

  const removeTodo = useCallback(
    async (id: string) => {
      setTodos((prev) => prev.filter((t) => t.id !== id));
      if (useDb && supabase) {
        const { error } = await supabase.from("todos").delete().eq("id", id);
        if (error) toast.error("删除失败：" + error.message);
      }
    },
    [useDb, supabase]
  );

  const clearCompleted = useCallback(async () => {
    setTodos((prev) => prev.filter((t) => !t.done));
    if (useDb && supabase) {
      const { error } = await supabase
        .from("todos")
        .delete()
        .eq("done", true);
      if (error) toast.error("清除失败：" + error.message);
    }
  }, [useDb, supabase]);

  return (
    <Card className="w-full max-w-xl gap-0 border-white/10 bg-white/5 p-6 shadow-2xl shadow-indigo-900/40 backdrop-blur-xl sm:p-8">
      <header className="mb-6 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-400 to-fuchsia-500 shadow-lg shadow-fuchsia-500/30">
          <ListTodo className="h-6 w-6 text-white" />
        </div>
        <div className="flex-1">
          <h2 className="flex items-center gap-2 text-2xl font-bold tracking-tight text-white">
            星空待办
            <Sparkles className="h-5 w-5 text-amber-300" />
          </h2>
          <p className="text-sm text-indigo-200/70">
            在浩瀚星河下，规划你的每一天
          </p>
        </div>
        <span
          className={cn(
            "flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs",
            useDb
              ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-200"
              : "border-white/15 bg-white/5 text-indigo-200/70"
          )}
          title={useDb ? "已登录，云端同步" : "未登录，仅本地保存"}
        >
          {useDb ? (
            <>
              <Cloud className="h-3.5 w-3.5" />
              云端同步
            </>
          ) : (
            <>
              <HardDrive className="h-3.5 w-3.5" />
              本地保存
            </>
          )}
        </span>
      </header>

      <div className="mb-6 flex items-center gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTodo()}
          placeholder="想做点什么呢？写下来吧…"
          className="h-11 border-white/10 bg-white/5 text-white placeholder:text-indigo-200/40"
        />
        <Button
          onClick={addTodo}
          size="icon"
          className="h-11 w-11 shrink-0 bg-gradient-to-br from-indigo-400 to-fuchsia-500 text-white shadow-lg shadow-fuchsia-500/30 hover:from-indigo-400 hover:to-fuchsia-500 hover:brightness-110"
          aria-label="添加待办"
        >
          <Plus className="h-5 w-5" />
        </Button>
      </div>

      <div className="mb-4 flex items-center justify-between">
        <div className="flex gap-1 rounded-xl bg-white/5 p-1">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={cn(
                "rounded-lg px-3 py-1.5 text-sm font-medium transition",
                filter === f.key
                  ? "bg-gradient-to-br from-indigo-400 to-fuchsia-500 text-white shadow"
                  : "text-indigo-200/70 hover:text-white"
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
        <span className="flex items-center gap-1.5 text-sm text-indigo-200/70">
          <Star className="h-4 w-4 text-amber-300" />
          剩余 {remaining} 项
        </span>
      </div>

      <ul className="flex flex-col gap-2">
        {loading ? (
          <li className="flex flex-col items-center gap-2 py-10 text-center text-indigo-200/50">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span>正在从云端加载…</span>
          </li>
        ) : visibleTodos.length === 0 ? (
          <li className="flex flex-col items-center gap-2 py-10 text-center text-indigo-200/50">
            <CheckCircle2 className="h-10 w-10" />
            <span>这里空空如也，像静谧的夜空 ✨</span>
          </li>
        ) : (
          visibleTodos.map((todo) => (
            <li
              key={todo.id}
              className="group flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 transition hover:border-white/20 hover:bg-white/10"
            >
              <Checkbox
                checked={todo.done}
                onCheckedChange={() => toggleTodo(todo.id)}
                className="border-white/30 bg-white/5"
                aria-label={todo.done ? "标记为未完成" : "标记为已完成"}
              />
              <span
                className={cn(
                  "flex-1 text-[15px] transition",
                  todo.done
                    ? "text-indigo-200/40 line-through"
                    : "text-white"
                )}
              >
                {todo.text}
              </span>
              <Button
                onClick={() => removeTodo(todo.id)}
                variant="ghost"
                size="icon"
                className="h-8 w-8 shrink-0 text-indigo-200/30 opacity-0 transition hover:bg-rose-500/10 hover:text-rose-400 group-hover:opacity-100"
                aria-label="删除待办"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </li>
          ))
        )}
      </ul>

      {completed > 0 && (
        <footer className="mt-6 flex items-center justify-between border-t border-white/10 pt-4 text-sm text-indigo-200/60">
          <span>已完成 {completed} 项</span>
          <Button
            onClick={clearCompleted}
            variant="ghost"
            size="sm"
            className="text-indigo-200/60 hover:bg-rose-500/10 hover:text-rose-400"
          >
            <Trash2 className="h-4 w-4" />
            清除已完成
          </Button>
        </footer>
      )}
    </Card>
  );
}
