import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "SparkScore — Certainty Ahead | PPA e análise semiótica",
  description:
    "SparkScore quantifica o Potencial Prévio de Ação (PPA), SparkUnits e Orbitais — para alinhar mensagem, canal e impacto antes da publicação.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased bg-black text-white`}>
        {children}
      </body>
    </html>
  );
}
