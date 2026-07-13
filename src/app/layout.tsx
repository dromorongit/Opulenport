import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { getSiteUrl } from "@/lib/site-url";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  title: "OpulenPort Trading | Trusted Routes, Seamless Delivery",
  description:
    "OpulenPort Trading specializes in international sourcing, procurement and importation from China, Dubai, France and other global markets into Ghana.",
  metadataBase: new URL(getSiteUrl()),
  icons: {
    icon: "/images/opulenportlogo.jpg",
  },
  openGraph: {
    title: "OpulenPort Trading | Trusted Routes, Seamless Delivery",
    description:
      "OpulenPort Trading specializes in international sourcing, procurement and importation from China, Dubai, France and other global markets into Ghana.",
    siteName: "OpulenPort Trading",
    locale: "en_GH",
    type: "website",
  },
  themeColor: "#0B0F19",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="bg-navy text-cream font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
