import type { Metadata } from "next";
import { Mona_Sans, IBM_Plex_Sans_Thai } from "next/font/google";
import "./globals.css";

const monaSans = Mona_Sans({
  variable: "--font-mona-sans",
  subsets: ["latin"],
});

const ibmPlexSansThai = IBM_Plex_Sans_Thai({
  variable: "--font-ibm-plex-sans-thai",
  subsets: ["latin", "thai"],
  weight: "300",
});

export const metadata: Metadata = {
  title: "SmartPrep",
  description: "An Interview Prep Platform with AI-driven feedback",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${monaSans.className} ${ibmPlexSansThai.variable} antialiased pattern`}
      >
        {children}
      </body>
    </html>
  );
}
