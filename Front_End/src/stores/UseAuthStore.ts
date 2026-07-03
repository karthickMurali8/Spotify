import { axiosInstance } from "@/lib/axios";
import { create } from "zustand";


interface AuthStore {
    isAdmin: boolean;
    isLoading: boolean;
    error: string | null;
    checkAdminStatus: () => Promise<void>;
    reset: () => void;
}

export const UseAuthStore = create<AuthStore>((set) => ({
    isAdmin: false,
    isLoading: false,
    error: null,

    checkAdminStatus: async () => {
        set({ isLoading: true, error: null });

        try {
            // Simulate an API call to check admin status
            const response = await axiosInstance.get("/admin/isAdmin");
            set({ isAdmin: response.data.admin, isLoading: false });
        } catch (error: any) {
            set({ 
                error: error.response?.data?.message || "Failed to check admin status",
                isLoading: false,
                isAdmin: false
             });
        }
    },

    reset: () => set({ isAdmin: false, isLoading: false, error: null }),
}));