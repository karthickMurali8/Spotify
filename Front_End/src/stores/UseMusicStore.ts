import { axiosInstance } from "@/lib/axios";
import type { Album, Song, Stats } from "@/types";
import { create } from "zustand";
import toast from "react-hot-toast";

interface MusicStore {
    albums: Album[];
    songs: Song[];
    isLoading: boolean;
    error: string | null;
    currentAlbum: Album | null;
    featuredSongs: Song[];
    madeForYouSongs: Song[];
    trendingSongs: Song[];
    stats: Stats;

    fetchAlbums: () => Promise<void>;
    fetchAlbumById: (id: string) => Promise<void>;
    fetchFeaturedSongs: () => Promise<void>;
    fetchMadeForYouSongs: () => Promise<void>;
    fetchTrendingSongs: () => Promise<void>;
    fetchStats: () => Promise<void>;
    fetchSongs: () => Promise<void>;
    deleteSong: (id: string) => Promise<void>;
    deleteAlbum: (id: string) => Promise<void>;
}

export const UseMusicStore = create<MusicStore>((set) => ({
    albums: [],
    songs: [],
    isLoading: true,
    error: null,
    currentAlbum: null,
    featuredSongs: [],
    madeForYouSongs: [],
    trendingSongs: [],
    stats: {
        totalSongs: 0,
        totalAlbums: 0,
        totalUsers: 0,
        totalArtists: 0
    },

    deleteSong: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
            await axiosInstance.delete(`/admin/songs/${id}`);
            set((state) => ({
                songs: state.songs.filter((song) => song._id !== id),
                isLoading: false,
            }));
            toast.success("Song deleted successfully");
        } catch (err: any) {
            toast.error("Failed to delete song");
            set({ error: err.response?.data?.message, isLoading: false });
        }
    },

    deleteAlbum: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
            await axiosInstance.delete(`/admin/albums/${id}`);
            set((state) => ({
                albums: state.albums.filter((album) => album._id !== id),
                // songs: state.songs.filter((song) => song.albumId !== id), // Remove songs that belong to the deleted album
                songs: state.songs.map((song) =>
					song.albumId === state.albums.find((a) => a._id === id)?.title ? { ...song, album: null } : song
				),
                isLoading: false,
            }));
            toast.success("Album deleted successfully");
        } catch (err: any) {
            toast.error("Failed to delete album");
            set({ error: err.response?.data?.message, isLoading: false });
        }
    },

    fetchSongs: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await axiosInstance.get("/songs/getAll");
            set({ songs: response.data.songs, isLoading: false });
        } catch (err: any) {
            set({ error: err.response?.data?.message, isLoading: false });
        }
    },

    fetchStats: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await axiosInstance.get("/stats");
            set({ stats: response.data, isLoading: false });
        } catch (err: any) {
            set({ error: err.response?.data?.message, isLoading: false });
        }
    },

    fetchAlbums: async () => {
        set({ isLoading: true, error: null });

        try {
            // const response = await fetch("/api/albums");
            // const data = await response.json();
            // if (!response.ok) {
            //     throw new Error("Failed to fetch albums");
            // }
            // set({ albums: data, isLoading: false });
            
            const response = await axiosInstance.get("/albums");
            set({ albums: response.data.albums });
        } catch (err: any) {
            set({ error: err.response?.data?.message });
        } finally {
            set({ isLoading: false });
        }
    },

    fetchAlbumById: async (id: string) => {
        set({ isLoading: true, error: null });

        try {
            const response = await axiosInstance.get(`/albums/${id}`);
            set({ currentAlbum: response.data.album });
            // return response.data.album;
        } catch (err: any) {
            set({ error: err.response?.data?.message });
        } finally {
            set({ isLoading: false });
        }
    },

    fetchFeaturedSongs: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await axiosInstance.get("/songs/getFeatured");
            set({ featuredSongs: response.data.songs, isLoading: false });
        } catch (err: any) {
            set({ error: err.response?.data?.message, isLoading: false });
        }
    },

    fetchMadeForYouSongs: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await axiosInstance.get("/songs/getMadeForYou");
            set({ madeForYouSongs: response.data.songs, isLoading: false });
        } catch (err: any) {
            set({ error: err.response?.data?.message, isLoading: false });
        }
    },

    fetchTrendingSongs: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await axiosInstance.get("/songs/getTopCharts");
            set({ trendingSongs: response.data.songs, isLoading: false });
        } catch (err: any) {
            set({ error: err.response?.data?.message, isLoading: false });
        }
    },
}));