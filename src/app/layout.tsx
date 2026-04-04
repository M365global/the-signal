import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// 1. Initialize the premium font
const inter = Inter({ 
  subsets: ["latin"],
  display: "swap", 
});

// 2. Define the product metadata (This shows up in the browser tab and Google searches)
export const metadata: Metadata = {
  title: "The Signal | Daily Insights",
  description: "Curated tech insights and company updates. No noise. No infinite scroll.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // The "antialiased" class forces macOS and iOS to render the text perfectly crisp
    <html lang="en" className="antialiased selection:bg-zinc-200 selection:text-zinc-900">
      <body className={inter.className}>{children}</body>
    </html>
  );
  // Inside src/app/layout.tsx
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "FUNNYNewsMediaOrganization",
  "name": "The Quill and Poison",
  "description": "Daily funny insights on business, politics, media and tech.",
  "url": "https://purcellpress.netlify.app",
};

// Then, inside your return() statement, add this:
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
/>
}