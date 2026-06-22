import type { Song } from "@/types";
import { create } from "zustand";


interface PlayerStore {
    currentSong: Song | null;
    isPlaying: boolean;
    queue: Song[];
    currentIndex: number;

    setCurrentSong: (song: Song) => void;
    togglePlay: () => void;
    playNext: () => void;
    playPrevious: () => void;
    playAlbum: (album: Song[], startIndex?: number) => void;
    initializeQueue: (songs: Song[], startIndex?: number) => void;
}


export const UsePlayerStore = create<PlayerStore>((set, get) => ({
    currentSong: null,
    isPlaying: false,
    queue: [],
    currentIndex: -1,

    setCurrentSong: (song: Song) => {
        if (!song) return;

        const queue = get().queue;
        const songIndex = queue.findIndex((s) => s._id === song._id);

        // if (songIndex === -1) return;

        set({
			currentSong: song,
			isPlaying: true,
			currentIndex: songIndex !== -1 ? songIndex : get().currentIndex,
		});
    },

    togglePlay: () => {
        set({ isPlaying: !get().isPlaying });
    },

    playNext: () => {
        const { queue, currentIndex } = get();
        if (currentIndex < queue.length - 1) {
            const nextSong = queue[currentIndex + 1];
            set({ currentSong: nextSong, currentIndex: currentIndex + 1, isPlaying: true });
        } else {
            set({ currentIndex: 0, currentSong: queue[0], isPlaying: true });
        }
    },

    playPrevious: () => {
        const { queue, currentIndex } = get();
        if (currentIndex > 0) {
            const prevSong = queue[currentIndex - 1];
            set({ currentSong: prevSong, currentIndex: currentIndex - 1, isPlaying: true });
        } else {
            set({ currentIndex: queue.length - 1, currentSong: queue[queue.length - 1], isPlaying: true });
        }
    },

    playAlbum: (album: Song[], startIndex = 0) => {
        if (album.length === 0) return;

        const song = album[startIndex];
        set({ 
            currentSong: song, 
            isPlaying: true, 
            queue: album, 
            currentIndex: startIndex 
        });
    },
    
    initializeQueue: (songs: Song[]) => {
        set({ 
            queue: songs,
            currentIndex: get().currentIndex === -1 ? 0 : get().currentIndex,
            currentSong: get().currentSong || songs[0],
            // isPlaying: true
        });
    },
}))