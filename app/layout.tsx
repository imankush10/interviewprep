import { Mona_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { ProgressBar } from "@/components/ProgressBar";
import ReactQueryProvider from "./providers/ReactQueryProvider";
import { Suspense } from "react";

const monaSans = Mona_Sans({
  variable: "--font-mona-sans",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <title>Interview Prep</title>
        <meta name="description" content="AI Powered Interviewing webapp" />
        <link rel="icon" type="image/svg" href="/logo.svg" />
      </head>
      <body className={`${monaSans.className} antialiased pattern`}>
        <ReactQueryProvider>
          {children}
          <Suspense>
            <ProgressBar />
          </Suspense>
          <Toaster />
        </ReactQueryProvider>
      </body>
    </html>
  );
}
