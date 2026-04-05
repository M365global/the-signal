import Image from "next/image";
import { getHeadlines, type Headline } from "../lib/headlines";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import ReactMarkdown from 'react-markdown';

export const revalidate = 14400;

export const metadata = {
  title: "The Weekly Signal | Hard-Coded Insights",
  description: "Weekly high-signal analysis on technology, hardware, and the future of silicon.",
};

export default async function Home() {
  const headlines = getHeadlines();
  const currentDate = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric' });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsMediaOrganization",
    "name": "The Weekly Signal",
    "url": "https://thesignal.press",
    "description": "Weekly high-signal analysis on technology and hardware.",
    "datePublished": new Date().toISOString(),
  };

  return (
    <main className="min-h-screen bg-[#fcfcfc] text-zinc-950 antialiased selection:bg-zinc-900 selection:text-white print:bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-3xl mx-auto px-6 py-12 print:py-0">
        
        {/* 1. Editorial Masthead */}
        <header className="mb-20 print:mb-10">
          <div className="flex justify-between items-baseline mb-4 border-b border-zinc-100 pb-2 print:border-zinc-900">
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-400 print:text-zinc-900">
              {currentDate}
            </p>
            <a 
              href="https://linkedin.com/company/purcellpress" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-400 hover:text-red-800 transition-colors print:hidden"
            >
              Connect / LinkedIn
            </a>
          </div>
          <h1 className="text-5xl font-serif font-bold tracking-tighter uppercase print:text-6xl">
            The Weekly Signal
          </h1>
        </header>

        {/* 2. The News Stream */}
        <section className="space-y-16 mb-32 print:space-y-20">
          {headlines.map((item: Headline, index: number) => (
            <article key={item.id} className="border-b border-zinc-100 pb-12 last:border-0 print:border-zinc-900 print:pb-20">
              <details open className="group print:block">
                <summary className="list-none cursor-pointer outline-none print:cursor-default">
                  <div className="flex flex-col md:flex-row gap-8 items-start">
                    
                    {/* Iconic Thumbnail Window with LCP Optimization */}
                    {item.image_url && typeof item.image_url === 'string' && (
                      <div className="relative flex-shrink-0 w-full md:w-40 aspect-square overflow-hidden bg-zinc-100 group-open:hidden ring-1 ring-black/10 print:hidden">
                        <div className="absolute inset-0 z-10 border-t border-l border-white/40 pointer-events-none" />
                        <Image 
                          src={item.image_url} 
                          alt={item.title} 
                          fill 
                          sizes="160px"
                          priority={index === 0}
                          loading={index === 0 ? "eager" : "lazy"}
                          className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                        />
                      </div>
                    )}

                    <div className="flex-1 space-y-3">
                      <h2 className="text-3xl md:text-4xl font-serif font-bold leading-[1.1] text-zinc-900 group-hover:text-red-800 transition-colors print:text-4xl">
                        {item.title}
                      </h2>
                      <p className="text-zinc-600 font-serif text-lg italic leading-snug group-open:hidden print:block print:text-zinc-500">
                        &quot;{item.quote}&quot;
                      </p>
                    </div>
                  </div>
                </summary>

                {/* 3. The Cinematic Spread */}
                <div className="mt-16 space-y-12 animate-in fade-in zoom-in-95 duration-700 print:mt-8 print:animate-none">
                  
                  {/* Hero Image: Mobile Full-Bleed Hack */}
                  {item.image_url && typeof item.image_url === 'string' && (
                    <div className="-mx-6 md:mx-0 relative w-auto md:w-full aspect-[16/7] overflow-hidden bg-zinc-200 shadow-inner ring-1 ring-black/5 print:ring-0">
                      <div className="absolute inset-0 z-10 bg-gradient-to-tr from-white/5 via-transparent to-transparent pointer-events-none print:hidden" />
                      <Image 
                        src={item.image_url} 
                        alt={item.title} 
                        fill 
                        sizes="(max-width: 1024px) 100vw, 800px"
                        className="object-cover print:grayscale"
                      />
                    </div>
                  )}

                  {/* The Golden Measure: Narrow Text Container */}
                  <div className="max-w-xl mx-auto space-y-10">
                    <blockquote className="text-4xl font-serif font-bold italic text-zinc-300 leading-tight border-l-8 border-red-800 pl-10 py-2 print:text-zinc-400 print:border-zinc-900">
                      {item.quote}
                    </blockquote>

                    {/* Precision Typography Stylesheet */}
                    <div className="prose prose-zinc prose-xl font-serif leading-[1.8] text-zinc-800 antialiased prose-p:mb-10 prose-p:leading-relaxed [text-wrap:pretty] print:text-black">
                      <ReactMarkdown 
                        components={{
                          p: ({ children }) => <p className="mb-10 last:mb-0">{children}</p>,
                          strong: ({ children }) => (
                            <strong className="font-bold text-black border-b-2 border-red-800/10 print:border-b-0">
                              {children}
                            </strong>
                          ),
                        }}
                      >
                        {item.commentary}
                      </ReactMarkdown>

                      {/* Branded Signature */}
                      <div className="mt-16 pt-8 border-t border-zinc-100 flex items-center justify-between print:border-zinc-900">
                        <div className="flex items-center gap-4">
                          <div className="w-8 h-8 bg-zinc-900 flex items-center justify-center text-white text-[10px] font-bold">S</div>
                          <span className="text-xs font-serif italic text-zinc-500 font-bold uppercase tracking-widest print:text-black">Signal Editorial</span>
                        </div>
                        <a 
                          href={`https://www.linkedin.com/sharing/share-offsite/?url=https://thesignal.press`} 
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-zinc-900 transition-colors print:hidden"
                        >
                          Share / LinkedIn
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </details>
            </article>
          ))}
        </section>

        {/* 4. Brutalist Footer CTA */}
        <footer className="mt-40 bg-zinc-900 text-white p-16 relative overflow-hidden print:hidden">
             <div className="relative z-10 max-w-sm">
                <h4 className="text-4xl font-serif font-bold italic mb-6 leading-tight">Truth is the new currency.</h4>
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Input className="bg-white/10 border-white/20 rounded-none h-14 text-white placeholder:text-zinc-500" placeholder="Direct email..." />
                    <Button className="bg-red-800 text-white font-black uppercase tracking-widest px-8 rounded-none h-14 hover:bg-red-700 transition-all">
                      Join
                    </Button>
                  </div>
                  
                  <a 
                    href="https://linkedin.com/company/purcellpress" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 hover:text-white transition-colors"
                  >
                    <span className="w-4 h-4 bg-zinc-800 flex items-center justify-center text-[8px] border border-zinc-700">in</span>
                    Follow The Weekly Signal on LinkedIn
                  </a>
                </div>
             </div>
             <span className="absolute right-[-15%] bottom-[-20%] text-[300px] font-serif font-bold italic opacity-10 pointer-events-none select-none">S</span>
        </footer>

        {/* Print-Only URL Tag */}
        <div className="hidden print:block text-center mt-20 border-t border-zinc-900 pt-8 text-[10px] font-bold uppercase tracking-widest">
          Original Signal available at: THEWEEKLYSIGNAL.PRESS
        </div>
      </div>
    </main>
  );
}