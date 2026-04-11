import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "SparkScore — PPA e leitura antecipada da recepção",
  description:
    "SparkScore estima o Potencial Prévio de Ação (PPA), SparkUnits e Orbitais — para alinhar mensagem, canal e impacto antes da publicação, com método em vez de adivinhação.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.className} antialiased bg-black text-white`}>
        {children}
      </body>
    </html>
  );
}
