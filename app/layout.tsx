import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./styles/globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "長照文書自動化｜家訪錄音AI轉SOAP報告，省時80% | Rubix AI",
  description: "告別手寫報告！Rubix AI自動將家訪對話轉為SOAP格式，支援政府請款與稽核需求，讓照服員每天多出2小時陪伴長者。免費試用3份報告。",

  openGraph: {
    title: "長照文書自動化｜家訪錄音AI轉SOAP報告，省時80% | Rubix AI",
    description: "告別手寫報告！Rubix AI自動將家訪對話轉為逐字稿、SOAP格式，支援政府請款與稽核需求，讓照服員每天多出2小時陪伴長者。免費試用專業版。",
    type: "website",
    locale: "zh_TW",
  },
  
  twitter: {
    card: "summary_large_image",
    title: "長照機構必備神器｜AI語音助理自動生成SOAP報告 | Rubix AI",
    description: "Rubix AI 將家訪錄音自動轉為標準逐字稿、SOAP報告，節省80%文書時間，符合長照稽核要求。立即申請免費體驗。",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
