import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { notFound } from "next/navigation";
import { I18nProvider, isLocale, locales } from "@zellapay/app-kit";
import { loadMessages } from "@/lib/i18n/messages";
import "../globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: { default: "ZellaPay Admin", template: "%s · ZellaPay Admin" },
  description: "Internal administration for ZellaPay staff.",
  robots: { index: false, follow: false },
};

/** Every page is rendered per request so it can carry the CSP nonce. */
export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export default async function RootLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const messages = await loadMessages(lang);
  return (
    <html
      lang={lang}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <I18nProvider locale={lang} messages={messages}>
          {children}
        </I18nProvider>
      </body>
    </html>
  );
}
