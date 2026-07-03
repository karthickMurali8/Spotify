import { UsePlayerStore } from '@/stores/UsePlayerStore';
import { useEffect, useRef } from 'react'

const AudioPlayer = () => {
    const audioref = useRef<HTMLAudioElement>(null);
    const prevSongRef = useRef<string | null>(null);

    const { currentSong, isPlaying, playNext } = UsePlayerStore();

    //Handle song play/pause
    useEffect(() => {
        if (isPlaying) audioref.current?.play();
        else audioref.current?.pause();
    }, [isPlaying]);

    //Handle song End
    useEffect(() => {
        const audio = audioref.current;
        if (!audio) return;

        audio.addEventListener("ended", playNext);

        return () => {
            audio.removeEventListener("ended", playNext);
        }
    }, [playNext]);

    // Handle song change
    useEffect(() => {
        const audio = audioref.current;
        if (!currentSong || !audio) return;

        const isSongChanged = prevSongRef.current !== currentSong._id;

        if (isSongChanged) {
            audio.src = currentSong.audioUrl;
            audio.currentTime = 0;
            prevSongRef.current = currentSong._id;

            if (isPlaying) {
                audio.play();
            }
        }

    }, [currentSong]);

  return (
    <audio ref={audioref} />
  )
}

export default AudioPlayer