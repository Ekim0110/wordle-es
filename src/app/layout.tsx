import type { Metadata, Viewport } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

// Outfit: una letra moderna y redondeada. Next.js la descarga y la sirve
// desde tu propia página, así carga rápido.
const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "El Ahorcado",
  description: "El ahorcado con palabras colombianas y 4 niveles.",
  applicationName: "Ahorcado",
  // Para iPhone: que se abra a pantalla completa al instalarla.
  appleWebApp: { capable: true, title: "Ahorcado", statusBarStyle: "black-translucent" },
};

// Color de la barra de arriba del celular y tamaño de la pantalla.
export const viewport: Viewport = {
  themeColor: "#0b1026",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${outfit.variable} font-sans antialiased`}>{children}</body>
    </html>
  );
}
