import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import {
  SUPABASE_ANON_KEY,
  SUPABASE_URL,
  isSupabaseConfigured,
} from "./config";

// 在每个请求上刷新 Supabase 会话，保持 cookie 同步
export async function updateSession(request: NextRequest) {
  const response = NextResponse.next({ request });

  // 未配置 Supabase 时直接放行
  if (!isSupabaseConfigured) return response;

  const supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        );
      },
    },
  });

  // 触发会话刷新（必须调用，否则 cookie 不会更新）
  await supabase.auth.getUser();

  return response;
}
