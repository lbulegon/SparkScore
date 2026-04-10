import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Obter API Key — SparkScore",
  description: "Create your account and receive your tenant API key.",
};

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
