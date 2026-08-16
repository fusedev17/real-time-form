import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { BackgroundDecor } from "@/components/ui/BackgroundDecor";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Real-Time Patient Form",
    template: "%s · Real-Time Patient Form",
  },
  description: "Real-time patient intake form with a live staff monitoring dashboard.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <BackgroundDecor />
        {children}
      </body>
    </html>
  );
}
