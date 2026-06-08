import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 显式指定 Turbopack 根目录，避免因 pnpm-workspace.yaml 推断到错误的工作区根
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
