import type { Metadata } from "next";
import localFont from "next/font/local";
import { AuthProvider } from "../lib/auth-context";
import "./globals.css";

const bricolage = localFont({
  src: "../../../assets/fonts/BricolageGrotesque.ttf",
  display: "swap",
  variable: "--font-bricolage",
  weight: "100 900"
});

const sourceSans = localFont({
  src: "../../../assets/fonts/SourceSans3.ttf",
  display: "swap",
  variable: "--font-source-sans",
  weight: "200 900"
});

export const metadata: Metadata = {
  title: "Liete — viagens em grupo para novos destinos",
  description: "Encontre viagens em grupo e organizadores para sua próxima aventura."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body className={`${bricolage.variable} ${sourceSans.variable}`}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
