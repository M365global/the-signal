import type { Metadata } from "next";
import { Inter, PT_Serif } from "next/font/google";
import "./globals.css";

// 1. Initialize the Sans for UI and PT Serif for the 'Mash' Authority
const inter = Inter({ 
  subsets: ["latin"], 
  variable: "--font-sans",
  display: "swap", 
});

const ptSerif = PT_Serif({ 
  weight: ['400', '700'], 
  subsets: ["latin"], 
  variable: "--font-serif",
  display: "swap",
});

// 2. Define the product metadata
export const metadata: Metadata = {
  title: "The Weekly Signal | Tech Insights",
  description: "Curated tech insights and company updates. No noise. No infinite scroll.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Structured Data for SEO - defined as an object to avoid escaping errors
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsMediaOrganization",
    "name": "The Weekly Signal",
    "description": "Weekly insights on business, media, and technology.",
    "url": "https://theweeklysignal.press", // Update this to your new custom domain
  };

  return (
    <html lang="en" className={`${inter.variable} ${ptSerif.variable} antialiased selection:bg-zinc-900 selection:text-white`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-sans bg-[#fcfcfc]">
        {children}
      </body>
    </html>
  );
}