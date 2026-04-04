import Image from "next/image";
import { getFacebookPosts, type FacebookPost } from "../lib/facebook";
import { getHeadlines, type Headline } from "../lib/headlines";
import ShareButton from "../components/ui/share";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";

export const revalidate = 14400; // 4 hours

export default async function Home() {
  const headlines = getHeadlines();
  const fbPosts = await getFacebookPosts();
  
  const currentDate = new Date().toLocaleDateString('en-US', { 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <main className="min-h-screen bg-white text-zinc-950 antialiased selection:bg-zinc-200">
      <div className="max-w-2xl mx-auto px-6 py-24">
        
        {/* 1. Header: The Masthead */}
        <header className="mb-20">
          <h1 className="text-xs font-bold tracking-[0.2em] uppercase text-zinc-400 mb-3">
            {currentDate}
          </h1>
          <h2 className="text-4xl font-semibold tracking-tight text-zinc-900">
            The Signal
          </h2>
        </header>

        {/* 2. Headlines Section: Native Accordion for Focus */}
        <section className="space-y-4 mb-24">
          {headlines.map((item: Headline) => (
            <details key={item.id} className="group border-b border-zinc-100">
              <summary className="flex items-center justify-between py-6 text-xl font-medium cursor-pointer list-none hover:text-zinc-500 transition-colors outline-none">
                {item.title}
                <span className="text-zinc-300 group-open:rotate-45 transition-transform duration-300">+</span>
              </summary>
              <div className="pb-10 space-y-6 animate-in fade-in slide-in-from-top-2 duration-500">
                
                {/* ENHANCED: The Headline Image Slot */}
                {item.image_url && (
                  <div className="relative w-full aspect-[2/1] md:aspect-[21/9] overflow-hidden rounded-xl bg-zinc-100 ring-1 ring-zinc-900/5 shadow-sm">
                    <Image 
                      src={item.image_url} 
                      alt={item.title}
                      fill
                      className="object-cover object-center"
                      sizes="(max-width: 768px) 100vw, 672px"
                    />
                  </div>
                )}

                <blockquote className="border-l-2 border-zinc-900 pl-6 italic text-zinc-500 text-lg leading-relaxed">
                  &quot;{item.quote}&quot;
                </blockquote>
                <p className="text-zinc-600 leading-relaxed text-lg whitespace-pre-line">
                  {item.commentary}
                </p>
              </div>
            </details>
          ))}
        </section>

        {/* 3. Social Feed: Editorial Stream */}
        {fbPosts.length > 0 && (
          <section className="mb-32">
            <h3 className="text-xs font-bold tracking-[0.2em] uppercase text-zinc-400 mb-12">
              Facebook Updates
            </h3>
            <div className="space-y-20">
              {fbPosts.map((post: FacebookPost, index: number) => (
                <article key={post.id} className="group">
                  <div className="flex flex-col gap-6">
                    
                    {/* The Utility Row: Date & Zen Share Button */}
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-zinc-400 font-medium tracking-wide">
                        {new Date(post.created_time).toLocaleDateString()}
                      </span>
                      <ShareButton 
                        title="The Signal - Update" 
                        text={post.message.substring(0, 50) + "..."} 
                      />
                    </div>
                    
                    {/* Image Container: 35mm Film Ratio & Hardware Bezel */}
                    {post.full_picture && (
                      <div className="relative w-full aspect-[4/3] md:aspect-[3/2] overflow-hidden rounded-2xl bg-zinc-100 ring-1 ring-zinc-900/5 shadow-sm transition-all duration-700 group-hover:shadow-lg">
                        <Image 
                          src={post.full_picture} 
                          alt="Signal Update"
                          fill
                          priority={index === 0}
                          className="object-[center_20%] object-cover transition-transform duration-1000 ease-out group-hover:scale-[1.02]"
                          sizes="(max-width: 768px) 100vw, 672px"
                        />
                      </div>
                    )}

                    {/* Content Body */}
                    <p className="text-lg leading-[1.8] text-zinc-800 whitespace-pre-line">
                      {post.message}
                    </p>
                    
                    <div className="h-px w-12 bg-zinc-200 mt-4" />
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* Writer Invitation Section */}
        <section className="mt-32 mb-20 py-20 border-t border-zinc-100">
          <div className="max-w-md">
            <h3 className="text-2xl font-medium tracking-tight text-zinc-900 mb-4">
              The table is open.
            </h3>
            <p className="text-zinc-500 mb-8 leading-relaxed">
              We are looking for writers who prioritize insight over outrage. If you have a signal to share, let us know where to find your work.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <Input 
                type="url" 
                placeholder="Link to your portfolio or latest piece" 
                className="bg-zinc-50/50 border-zinc-200 focus-visible:ring-zinc-400"
              />
              <Button className="bg-zinc-900 text-zinc-50 hover:bg-zinc-800 transition-all active:scale-95">
                Apply
              </Button>
            </div>
            
            <p className="mt-4 text-[10px] text-zinc-400 uppercase tracking-widest">
              Strictly curated. Responses within 48 hours.
            </p>
          </div>
        </section>
        
        {/* 4. Footer: Final Sign-off */}
        <footer className="pt-24 border-t border-zinc-100 text-center">
          <div className="mb-10 text-zinc-300 text-2xl">✓</div>
          <h4 className="text-xl font-medium mb-3 text-zinc-900">You are caught up.</h4>
          <p className="text-zinc-500 mb-12 max-w-xs mx-auto text-sm leading-relaxed">
            Curated daily for the focused mind. <br />Digital signal, physical soul.
          </p>
          <a 
            href="mailto:agent@purcellpress.com" 
            className="text-xs font-bold tracking-widest uppercase text-zinc-400 hover:text-zinc-900 transition-colors border-b border-transparent hover:border-zinc-900 pb-1"
          >
            Contact
          </a>
        </footer>

      </div>
    </main>
  );
}