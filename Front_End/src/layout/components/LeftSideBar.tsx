import PlaylistSkeleton from '@/components/skeletons/PlayListSkeleton'
import { buttonVariants } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import { UseMusicStore } from '@/stores/UseMusicStore'
import { SignedIn } from '@clerk/clerk-react'
import { HomeIcon, Library, MessageCircle, Scroll } from 'lucide-react'
import React, { use, useEffect } from 'react'
import { Link } from 'react-router-dom'

const LeftSideBar = () => {
    const { isLoading, albums, fetchAlbums } = UseMusicStore();

    useEffect(() => {
        fetchAlbums();
    }, []);
    // }, [fetchAlbums]);

    console.log("Albums:", { albums });

  return (
    <div className='h-full flex flex-col gap-2'>
        {/* Navigation Menu */}
        <div className="roudned-lg bg-zinc-900 p-4">
            <div className='space-y-2'>
                <Link to='/' className={cn(buttonVariants(
                    {
                        variant: 'ghost',
                        className: 'w-full justify-start text-white hover:bg-zinc-800'
                    }
                ))}>
                    <HomeIcon className='mr-2 size-5' />
                    <span className='hidden md:inline'>Home</span>
                </Link>

                <SignedIn>
                    <Link to='/chat' className={cn(buttonVariants(
                        {
                            variant: 'ghost',
                            className: 'w-full justify-start text-white hover:bg-zinc-800'
                        }
                    ))}>
                        <MessageCircle className='mr-2 size-5' />
                        <span className='hidden md:inline'>Messages</span>
                    </Link>
                </SignedIn>
            </div>
        </div>

        {/* Library Section */}
        <div className='flex-1 rounded-lg bg-zinc-900 p-4 h-[calc(100%-150px)]'>
            <div className='flex items-center justify-between mb-4'>
                <div className='flex items-center text-white px-2'>
                    <Library className='mr-2 size-5' />
                    <span className='hidden md:inline'>PlayLists</span>
                </div>
            </div>

            <ScrollArea className='h-[calc(100%-300px)]'>
                <div className='space-y-2'>
                    { isLoading ? (
                        <PlaylistSkeleton />
                    ) : (
                        albums.map((album) => (
                            <Link
                            key={album._id}
                            to={`/albums/${album._id}`}
                            className='block p-2 rounded-md hover:bg-zinc-800 text-white flex items-center gap-3 group cursor-pointer'>
                                
                                {/* In a Vite + React project, the / at the beginning of a path refers to the public/ directory, not the file system root or the src/ folder. */}
                                
                                {/* Front_End/
                                ├── public/           ← Static assets served at root "/"
                                │   └── albums/
                                │       └── 2.jpg     ← Accessible via '/albums/2.jpg'
                                ├── src/              ← React components
                                │   └── layout/
                                │       └── components/
                                │           └── LeftSideBar.tsx
                                └── vite.config.ts */}

                                <img src={album.imageUrl} alt={album.title} className='size-12 rounded-md object-cover flex-shrink-0' />

                                <div className='flex-1 min-w-0 hidden md:block'>
                                    <p className='font-medium truncate'>{album.title}</p>
                                    <p className='text-sm text-zinc-400 truncate'>Album • {album.artist}</p>
                                </div>

                            </Link>
                        ))
                    )}
                </div>
            </ScrollArea>
        </div>
    </div>
  )
}

export default LeftSideBar