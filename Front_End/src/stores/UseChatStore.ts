import { axiosInstance } from "@/lib/axios";
import { create } from "zustand";

interface ChatStore {
    users: any[];
    getUsers: () => Promise<void>;
    isLoading: boolean;
    error: string | null;
}

export const UseChatStore = create<ChatStore>((set) => ({
    users: [],
    isLoading: false,
    error: null,

    getUsers: async () => {
        set({ isLoading: true, error: null });

        try {
            const response = await axiosInstance.get("/users");
            set({ users: response.data, isLoading: false });
        } catch (error: any) {
            set({ error: "Failed to fetch users", isLoading: false });
        }
    }
}));