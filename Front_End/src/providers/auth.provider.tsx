import { axiosInstance } from "@/lib/axios";
import { useAuth } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { Loader } from "lucide-react";
import { UseAuthStore } from "@/stores/UseAuthStore";
import { UseChatStore } from "@/stores/UseChatStore";

const updateToken = (token: string | null) => {
    if (token) {
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        delete axiosInstance.defaults.headers.common['Authorization'];
    }
}

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const { getToken, userId } = useAuth();
    const [loading, setLoading] = useState(true);
    const { checkAdminStatus } = UseAuthStore();
    const { initSocket, disconnectSocket } = UseChatStore();

    useEffect(() => {
        const initAuth = async () => {
            try {
                const token = await getToken();
                updateToken(token);
                if (token) {
                    await checkAdminStatus();

                    if (userId) initSocket(userId);
                }
            } catch (error) {
                console.error("Error fetching token:", error);
                updateToken(null);
            } finally {
                setLoading(false);
            }
        };

        initAuth();

        // clean up
        return () => disconnectSocket();

    }, [getToken, userId, checkAdminStatus, initSocket, disconnectSocket]);

    // return <>{children}</>;

    return loading ?
    (
        <div className="h-screen flex items-center justify-center w-full">
            <Loader className="animate-spin size-8 text-emerald-500" />
        </div>
        // <Spinner />
    ) : (
        <>{children}</>
    );
}

export default AuthProvider;