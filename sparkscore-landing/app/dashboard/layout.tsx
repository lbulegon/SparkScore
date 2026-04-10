import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Painel — SparkScore",
  description: "Account and analysis history.",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
