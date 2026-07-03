import { axiosInstance } from "@/lib/axios";
import type { Message, User } from "@/types";
import { create } from "zustand";
import { io } from "socket.io-client";

interface ChatStore {
    users: User[];
    isLoading: boolean;
    error: string | null;

    socket: any;
    isConnected: boolean;
    onlineUsers: Set<string>;
    userActivities: Map<string, string>;
    Messages: Message[];
    selectedUser: User | null;
    
    fetchUsers: () => Promise<void>;
    setSelectedUser: (user: User | null) => void;

    initSocket: (userId: string) => void;
    disconnectSocket: () => void;
    sendMessage: (receiverId: string, senderId: string, content: string) => void;
    fetchMessages: (userId: string) => Promise<void>;
}

const socket = io(import.meta.env.VITE_BACKEND_URL, {
    autoConnect: false,
    withCredentials: true
})

export const UseChatStore = create<ChatStore>((set, get) => ({
    users: [],
    isLoading: false,
    error: null,
    socket: socket,
    isConnected: false,
    onlineUsers: new Set(),
    userActivities: new Map(),
    Messages: [],
    selectedUser: null,

    setSelectedUser: (user: any) => {
        set({ selectedUser: user });
    },

    fetchUsers: async () => {
        set({ isLoading: true, error: null });

        try {
            const response = await axiosInstance.get("/users");
            set({ users: response.data, isLoading: false });
        } catch (error: any) {
            set({ error: "Failed to fetch users", isLoading: false });
        }
    },

    initSocket: (userId: string) => {
        if (!get().socket.connected){

            socket.auth = { userId };
            socket.connect();

            socket.emit("user_connected", userId);

            socket.on('users_online', (onlineUsers: string[]) => {
                set({ onlineUsers: new Set(onlineUsers) });
            });

            socket.on('activities', (activities: [string, string][]) => {
                // const userActivities = new Map();
                // activities.forEach(([userId, activity]) => {
                //     userActivities.set(userId, activity);
                // });
                // set({ userActivities });
                
                set({ userActivities: new Map(activities) });
            });

            socket.on('user_connected', (userId: string) => {
                set((state) => {
                    const updatedOnlineUsers = new Set(state.onlineUsers);
                    updatedOnlineUsers.add(userId);
                    return { onlineUsers: updatedOnlineUsers };
                });
            });

            socket.on('user_disconnected', (userId: string) => {
                set((state) => {
                    const updatedOnlineUsers = new Set(state.onlineUsers);
                    updatedOnlineUsers.delete(userId);
                    return { onlineUsers: updatedOnlineUsers };
                });
            });

            socket.on('receive_message', (message: Message) => {
                set((state) => ({
                    Messages: [...state.Messages, message]
                }));
            });

            socket.on('sent_message', (message: Message) => {
                set((state) => ({
                    Messages: [...state.Messages, message]
                }));
            });

            socket.on('activity_updated', ({ userId, activity }: { userId: string; activity: string }) => {
                set((state) => {
                    const updatedActivities = new Map(state.userActivities);
                    updatedActivities.set(userId, activity);
                    return { userActivities: updatedActivities };
                });
            });

            set({ isConnected: true });
            // set({ socket: socket, isConnected: true });
        }
    },

    disconnectSocket: () => {
        if (get().isConnected) {
            socket.disconnect();
            set({ isConnected: false });
            // set({ socket: null, isConnected: false });
        }
    },

    sendMessage: (receiverId: string, senderId: string, content: string) => {
        const socket = get().socket;
        if (socket && get().isConnected) {
            socket.emit('send_message', { receiverId, senderId, content });
        }
    },

    fetchMessages: async (userId: string) => {
        set({ isLoading: true, error: null });

        try {
            const response = await axiosInstance.get(`/users/messages/${userId}`);
            set({ Messages: response.data, isLoading: false });
        } catch (error: any) {
            set({ error: "Failed to fetch messages", isLoading: false });
        }
    }
}));