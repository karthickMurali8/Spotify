// import FeaturedGridSkeleton from "@/components/skeletons/FeaturedGridSkeleton";
import Topbar from "@/components/Topbar"
import { UseMusicStore } from "@/stores/UseMusicStore";
import { useEffect } from "react";
import FeaturedSection from "./components/FeaturedSection";
import { ScrollArea } from "@/components/ui/scroll-area";
import SectionGrid from "./components/SectionGrid";
import { UsePlayerStore } from "@/stores/UsePlayerStore";


function HomePage() {
  const { 
    featuredSongs,
    madeForYouSongs,
    trendingSongs,
    isLoading,
    fetchFeaturedSongs,
    fetchMadeForYouSongs,
    fetchTrendingSongs
  } = UseMusicStore();

  const { initializeQueue } = UsePlayerStore();

  useEffect(() => {
    fetchFeaturedSongs();
    fetchMadeForYouSongs();
    fetchTrendingSongs();
  }, [fetchFeaturedSongs, fetchMadeForYouSongs, fetchTrendingSongs]);

  console.log({ featuredSongs, madeForYouSongs, trendingSongs, isLoading });

  useEffect(() => {
    if (featuredSongs.length > 0 && madeForYouSongs.length > 0 && trendingSongs.length > 0) {
      initializeQueue([...featuredSongs, ...madeForYouSongs, ...trendingSongs]);
    }
  }, [featuredSongs, madeForYouSongs, trendingSongs, initializeQueue]);

  return (
    <main className='home-page rounded-md overflow-hidden h-full
     bg-gradient-to-b from-zinc-800 to-zinc-900'>
      <Topbar />

      <ScrollArea className="h-[calc(100vh-180px)]">
        <div className='p-4 sm:p-6'>
          <h1 className='text-2xl sm:text-3xl font-bold text-white mb-6'>
            Good Afternoon !!
          </h1>
          <FeaturedSection />

          <div className="space-y-8">
            <SectionGrid title="Made for you" songs={madeForYouSongs} isLoading={isLoading} />
            <SectionGrid title="Trending" songs={trendingSongs} isLoading={isLoading} />
          </div>

        </div>
      </ScrollArea>
    </main>
  )
}

export default HomePage 