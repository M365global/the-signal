import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({ 
  subsets: ["latin"], 
  variable: "--font-sans" 
});

const playfair = Playfair_Display({ 
  subsets: ["latin"], 
  variable: "--font-serif" 
});

export const metadata: Metadata = {
  title: "The Signal | Daily Insights",
  description: "Curated tech insights and company updates. No noise.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsMediaOrganization",
    "name": "The Signal",
    "url": "https://purcellpress.netlify.app",
  };

  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} antialiased`}>
      <head>
        {/* We use a string for JSON.stringify to avoid unescaped character issues */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-sans selection:bg-zinc-200">
        {children}
      </body>
    </html>
  );
}