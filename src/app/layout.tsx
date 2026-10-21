import type { Metadata } from "next";
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
