import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Limpa e Protege",
  description: "Seu computador 24 horas. Sem parar.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
