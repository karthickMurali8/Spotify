import { Button } from '@/components/ui/button';
import { UsePlayerStore } from '@/stores/UsePlayerStore';
import type { Song } from '@/types'
import { Pause, Play } from 'lucide-react';
import React from 'react'

const PlayButton = ({ song }: { song: Song }) => {
    const { currentSong, isPlaying, setCurrentSong, togglePlay } = UsePlayerStore();
    const isCurrentSong = currentSong?._id === song._id;

    const handlePlay = () => {
        if (isCurrentSong) {
            togglePlay();
        } else {
            setCurrentSong(song);
        }
    }
  return (
    <Button
        onClick={handlePlay}
        size='icon'
        className={`absolute bottom-3 right-2 bg-green-500 hover:bg-green-400 hover:scale-105 transition-all 
				opacity-0 translate-y-2 group-hover:translate-y-0 ${
					isCurrentSong ? "opacity-100" : "group-hover:opacity-100"
				}`}
    >
        {isCurrentSong && isPlaying ? (
            <Pause className='h-5 w-5 text-black' />
        ) : (
            <Play className='h-5 w-5 text-black' />
        )}
    </Button>
  )
}

export default PlayButton