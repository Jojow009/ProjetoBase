import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TaskFlow - Gerenciador de Tarefas",
  description: "Organize seu fluxo de trabalho com Dashboards, Kanban e Calendário.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // suppressHydrationWarning é necessário para o next-themes
    <html lang="pt-br" suppressHydrationWarning>
      <head />{/* <head> colado no <html> */}
      <body className={inter.className}>{/* <body> colado no <head> */}
        {/* O <Providers> agora agrupa Auth, Temas, Header, Footer e VLibras
        */}
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}