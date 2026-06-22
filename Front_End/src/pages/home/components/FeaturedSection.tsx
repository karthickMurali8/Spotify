import FeaturedGridSkeleton from '@/components/skeletons/FeaturedGridSkeleton';
import { UseMusicStore } from '@/stores/UseMusicStore';
import React from 'react'
import PlayButton from './PlayButton';

const FeaturedSection = () => {
    const { featuredSongs, isLoading, error } = UseMusicStore();

    if (isLoading) {
        return <FeaturedGridSkeleton />;
    }

    if (error) {
        return <div className='text-red-500'>Error loading featured songs: {error}</div>;
    }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {featuredSongs.map((song) => (
            <div key={song._id} className='flex items-center bg-zinc-800/50 rounded-md overflow-hidden
         hover:bg-zinc-700/50 transition-colors group cursor-pointer relative'>
                <img src={song.imageUrl} alt={song.title} className='w-16 sm:w-20 h-16 sm:h-20 object-cover flex-shrink-0' />

                <div className='flex-1 p-4'>
                    <div className='text-sm font-semibold text-white mb-1 truncate'>{song.title}</div>
                    <div className='text-xs text-zinc-400 truncate'>{song.artist}</div>
                </div>

                <PlayButton song={song} />
            </div>
        ))}
    </div>
  )
}

export default FeaturedSection