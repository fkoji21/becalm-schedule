import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import Image from "next/image";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BeCalm Schedule",
  description: "Schedule App",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      {/* body自体を薄いグレーにする（余白が出ても薄い） */}
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-[#F6F8FA]`}>
        <div className="min-h-screen">
          {/* Top bar（濃いのはここだけ） */}
          <header className="h-14 bg-[#5A6879] flex items-center justify-between px-4">
            <Image
              src="/icons/toggle_sidebar.png"
              alt="toggle_sidebar"
              width={24}
              height={24}
              priority
            />
            <Image
              src="/icons/Avatar.png"
              alt="Avatar"
              width={24}
              height={24}
              priority
            />
          </header>

          {/* 下段：サイドバー + メイン */}
          <div className="flex min-h-[calc(100vh-56px)]">
            {/* Sidebar（濃いのはここだけ） */}
            <aside className="w-[56px] bg-[#5A6879] flex flex-col items-center pt-6 gap-6">
              <Image src="/icons/Notebook.png" alt="Notebook" width={24} height={24} />
              <Image src="/icons/Dialog.png" alt="Dialog" width={24} height={24} />
              <Image src="/icons/Calendar.png" alt="Calendar" width={24} height={24} />
            </aside>

            {/* Main（薄いグレーで全面） */}
            <Providers>
              <main className="flex-1 bg-[#F6F8FA] p-6">
                <div className="w-full">{children}</div>
              </main>
            </Providers>
          </div>
        </div>
      </body>
    </html>
  );
}
