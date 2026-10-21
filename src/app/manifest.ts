import type { MetadataRoute } from "next";

// El "manifiesto" le cuenta al celular cómo es la app: su nombre, su ícono,
// sus colores y que se abre a pantalla completa. Next.js lo publica en
// /manifest.webmanifest automáticamente.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "El Ahorcado Colombiano",
    short_name: "Ahorcado",
    description: "El ahorcado con palabras colombianas, 4 niveles y sonidos de cumbia.",
    lang: "es-CO",
    start_url: "/",
    display: "standalone", // sin la barra del navegador
    orientation: "portrait",
    background_color: "#0b1026",
    theme_color: "#0b1026",
    categories: ["games", "education"],
    icons: [
      { src: "/iconos/icono-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/iconos/icono-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/iconos/icono-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
