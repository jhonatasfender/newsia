import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import TopNav from "@/components/TopNav";
import SiteFooter from "@/components/SiteFooter";
import { getActiveBannerForSSG } from "@/hooks/useBanner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  try {
    const banner = await getActiveBannerForSSG();
    return {
      title: banner.title,
      description: banner.subtitle || "Inteligência Artificial e Sociedade",
    };
  } catch (error) {
    console.error("Erro ao buscar banner para metadata:", error);
    return {
      title: "Impacto IA",
      description: "Inteligência Artificial e Sociedade",
    };
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <TopNav />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
