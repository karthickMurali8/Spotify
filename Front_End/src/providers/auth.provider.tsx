import { axiosInstance } from "@/lib/axios";
import { useAuth } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { Loader } from "lucide-react";

const updateToken = (token: string | null) => {
    if (token) {
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        delete axiosInstance.defaults.headers.common['Authorization'];
    }
}

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const { getToken } = useAuth();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initAuth = async () => {
            try {
                const token = await getToken();
                updateToken(token);
            } catch (error) {
                console.error("Error fetching token:", error);
                updateToken(null);
            } finally {
                setLoading(false);
            }
        };

        initAuth();
    }, [getToken]);

    // return <>{children}</>;

    return loading ?
    (
        <div className="h-screen flex items-center justify-center w-full">
            <Loader className="animate-spin size-8 text-emerald-500" />
        </div>
    ) : (
        <>{children}</>
    );
}

export default AuthProvider;