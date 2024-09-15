import { ClerkProvider } from "@clerk/nextjs";
import { TooltipProvider } from "@/components/ui/tooltip";
import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import { cn } from "@/lib/utils";
import "./globals.css";
import { dark } from "@clerk/themes";
import { Toaster } from "@/components/ui/sonner";
import Footer from "@/components/footer";
import { Provider as JotaiProvider } from "jotai";
import { Analytics } from "@vercel/analytics/react";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "use-voice",
  description:
    "use-voice is a developer-oriented open-source platform for building voice AI chatbots.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className="dark" lang="en" suppressHydrationWarning>
      <head />
      <body
        className={cn("bg-background font-sans antialiased", fontSans.variable)}
      >
        <JotaiProvider>
          <ClerkProvider
            appearance={{
              baseTheme: dark,
            }}
          >
            <TooltipProvider>
              <div className="min-h-screen">{children}</div>
              <Footer />
              <Toaster />
            </TooltipProvider>
          </ClerkProvider>
        </JotaiProvider>
        <Analytics />
      </body>
    </html>
  );
}
