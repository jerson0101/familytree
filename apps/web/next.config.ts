import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname, "../.."),
  },
  transpilePackages: ["@kintree/ui", "@kintree/shared", "@kintree/database", "@kintree/graph-engine"],
};

export default nextConfig;
