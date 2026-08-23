import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { NaviMentor } from "@/components/navi-mentor";
import { Sidebar } from "@/components/sidebar";
import { BurnoutSupportWidget } from "@/components/burnout-support";
import { ProactiveAIAgent } from "@/components/proactive-ai-agent";
import { PomodoroTimer } from "@/components/pomodoro-timer";
import { Header } from "@/components/header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FM Edu - Персонализированное обучение с AI",
  description: "Адаптивная образовательная платформа для школьников 7-12 классов по программе NIS",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ru"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Header />
        <Sidebar />
        {children}
        <NaviMentor />
        <BurnoutSupportWidget />
        <ProactiveAIAgent />
        <PomodoroTimer />
      </body>
    </html>
  );
}
