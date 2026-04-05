import Image from "next/image";
//import { getFacebookPosts } from "../lib/facebook"; // Removed unused FacebookPost type
import { getHeadlines, type Headline } from "../lib/headlines";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import ReactMarkdown from 'react-markdown';
// Note: If you aren't using ShareButton or fbPosts right now, 
// they are omitted here to clear the ESLint warnings.

export const revalidate = 14400;

export default async function Home() {
  const headlines = getHeadlines();
  //const fbPosts = await getFacebookPosts(); // Keep this if you plan to re-add the FB section
  const currentDate = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric' });

  return (
    <main className="min-h-screen bg-[#fcfcfc] text-zinc-950 antialiased selection:bg-zinc-900 selection:text-white">
      <div className="max-w-2xl mx-auto px-6 py-12">
        
        {/* Masthead */}
        <header className="mb-16 border-b-4 border-zinc-900 pb-4">
          <div className="flex justify-between items-end">
            <h2 className="text-5xl font-serif font-black tracking-tighter uppercase italic">The Signal</h2>
            <h1 className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1">{currentDate}</h1>
          </div>
        </header>

        {/* Headlines */}
        <section className="space-y-24 mb-32">
          {headlines.map((item: Headline, index: number) => (
            <article key={item.id} className="group cursor-default">
              {item.image_url && typeof item.image_url === 'string' && (
                <div className="relative w-full aspect-[16/9] mb-8 overflow-hidden bg-zinc-200">
                  <Image 
                    src={item.image_url} 
                    alt={item.title} 
                    fill 
                    unoptimized={item.image_url.endsWith('.svg')}
                    className="object-cover grayscale hover:grayscale-0 transition-all duration-700 ease-in-out"
                    priority={index === 0}
                  />
                </div>
              )}
              
              <h3 className="text-4xl md:text-5xl font-serif font-bold leading-[1.1] mb-4 tracking-tight group-hover:text-red-700 transition-colors">
                {item.title}
              </h3>
              
              <p className="text-xl font-serif italic text-zinc-500 mb-6 leading-relaxed">&quot;{item.quote}&quot;</p>

              <details className="group/details">
                <summary className="list-none cursor-pointer text-xs font-black uppercase tracking-[0.3em] text-zinc-400 hover:text-zinc-900">
                  + Full Analysis
                </summary>
                <div className="mt-8 text-zinc-800 text-lg leading-relaxed animate-in fade-in slide-in-from-top-2">
                  <ReactMarkdown components={{
                    p: ({ children }) => <p className="mb-6 last:mb-0">{children}</p>,
                    img: ({ src, alt }) => {
                      const imageSrc = typeof src === 'string' ? src : '';
                      if (!imageSrc) return null;
                      return (
                        <span className="block relative w-full aspect-video my-10 border-y border-zinc-100">
                          <Image 
                            src={imageSrc} 
                            alt={alt || ""} 
                            fill 
                            unoptimized={imageSrc.endsWith('.svg')}
                            className="object-cover" 
                          />
                        </span>
                      );
                    }
                  }}>{item.commentary}</ReactMarkdown>
                </div>
              </details>
            </article>
          ))}
        </section>

        {/* 3D Footer CTA */}
        <footer className="relative mt-40 pb-20">
          <div className="relative bg-zinc-900 text-white p-10 rounded-none shadow-[20px_20px_0px_0px_rgba(0,0,0,0.1)]">
            <div className="absolute right-[-20px] top-[-20px] opacity-20 pointer-events-none scale-150 rotate-12">
               <span className="text-[200px] font-serif font-black italic select-none">S</span>
            </div>

            <div className="relative z-10 max-w-sm">
              <h4 className="text-3xl font-serif font-bold mb-4 italic">
                &quot;Get the signal, skip the poison.&quot;
              </h4>
              <p className="text-zinc-400 mb-8 text-sm leading-relaxed">
                Join 12,000+ readers getting the hard-coded truth delivered twice weekly.
              </p>
              
              <div className="space-y-4">
                <Input className="bg-white/10 border-white/20 text-white placeholder:text-zinc-500 rounded-none h-12" placeholder="email@address.com" />
                <Button className="w-full bg-white text-zinc-900 hover:bg-zinc-200 font-bold uppercase tracking-widest rounded-none h-12">
                  Subscribe Now
                </Button>
              </div>
            </div>
          </div>
        </footer>

      </div>
    </main>
  );
}