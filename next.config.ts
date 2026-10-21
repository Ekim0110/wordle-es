import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // El service worker no debe quedarse guardado en el navegador: así,
  // cuando publicamos una versión nueva, el celular la recibe.
  async headers() {
    return [
      {
        source: "/sw.js",
        headers: [
          { key: "Cache-Control", value: "no-cache, no-store, must-revalidate" },
          { key: "Content-Type", value: "application/javascript; charset=utf-8" },
        ],
      },
    ];
  },
};

export default nextConfig;
