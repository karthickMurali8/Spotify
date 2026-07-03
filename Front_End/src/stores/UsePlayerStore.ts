import type { Song } from "@/types";
import { create } from "zustand";
import { UseChatStore } from "./UseChatStore";


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

        const socket = UseChatStore.getState().socket;
        if (socket.auth) {
            socket.emit("update_activity",
                { 
                    userId: socket.auth.userId,
                    activity: `Playing ${song.title} by ${song.artist}`
                }
            );
        }

        // if (songIndex === -1) return;

        set({
			currentSong: song,
			isPlaying: true,
			currentIndex: songIndex !== -1 ? songIndex : get().currentIndex,
		});
    },

    togglePlay: () => {
		const willStartPlaying = !get().isPlaying;

		const currentSong = get().currentSong;
		const socket = UseChatStore.getState().socket;
		if (socket.auth) {
			socket.emit("update_activity", {
				userId: socket.auth.userId,
				activity:
					willStartPlaying && currentSong ? `Playing ${currentSong.title} by ${currentSong.artist}` : "Idle",
			});
		}

		set({
			isPlaying: willStartPlaying,
		});
	},

    playNext: () => {
        const { queue, currentIndex } = get();
        const nextIndex = (currentIndex < queue.length - 1) ? currentIndex + 1 : 0;
        const nextSong = queue[nextIndex];

        set({ currentIndex: nextIndex, currentSong: nextSong, isPlaying: true });

        const socket = UseChatStore.getState().socket;
        if (socket.auth) {
            socket.emit("update_activity",
                { 
                    userId: socket.auth.userId,
                    activity: `Playing ${nextSong.title} by ${nextSong.artist}`
                }
            );
        }
    },

    playPrevious: () => {
        // const { queue, currentIndex } = get();
        // if (currentIndex > 0) {
        //     const prevSong = queue[currentIndex - 1];
        //     set({ currentSong: prevSong, currentIndex: currentIndex - 1, isPlaying: true });
        // } else {
        //     set({ currentIndex: queue.length - 1, currentSong: queue[queue.length - 1], isPlaying: true });
        // }

        const { queue, currentIndex } = get();
        const prevIndex = (currentIndex > 0) ? currentIndex - 1 : queue.length - 1;
        const prevSong = queue[prevIndex];

        set({ currentIndex: prevIndex, currentSong: prevSong, isPlaying: true });

        const socket = UseChatStore.getState().socket;
        if (socket.auth) {
            socket.emit("update_activity",
                {
                    userId: socket.auth.userId,
                    activity: `Playing ${prevSong.title} by ${prevSong.artist}`
                }
            );
        }
    },

    playAlbum: (album: Song[], startIndex = 0) => {
        if (album.length === 0) return;

        const song = album[startIndex];

        const socket = UseChatStore.getState().socket;
        if (socket.auth) {
            socket.emit("update_activity",
                { 
                    userId: socket.auth.userId,
                    activity: `Playing ${song.title} by ${song.artist}`
                }
            );
        }

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