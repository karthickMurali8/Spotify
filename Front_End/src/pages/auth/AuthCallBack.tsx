import { Card, CardContent } from "@/components/ui/card";
import { axiosInstance } from "@/lib/axios";
import { useUser } from "@clerk/clerk-react";
import { Loader } from "lucide-react";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const AuthCallbackPage = () => {
	const { isLoaded, user } = useUser();
	const navigate = useNavigate();
	const logInAttempted = useRef(false);

	useEffect(() => {
		const syncUser = async () => {
			try {
				if (!isLoaded || !user || logInAttempted.current) {
					return; // Wait until the user data is loaded
				}

				logInAttempted.current = true;

				// await axiosInstance.get('/api/auth', {
				await axiosInstance.post('/auth/callback', {
					id: user.id,
					firstName: user.firstName,
					lastName: user.lastName,
					imageUrl: user.imageUrl,
				});
			} catch (error) {
				console.error("Error during authentication callback:", error);
			} finally {
				navigate('/'); // Redirect to home
			}
		}

		syncUser();
	}, [isLoaded, user, navigate]);

	return (
		<div className='h-screen w-full bg-black flex items-center justify-center'>
			<Card className='w-[90%] max-w-md bg-zinc-900 border-zinc-800'>
				<CardContent className='flex flex-col items-center gap-4 pt-6'>
					<Loader className='size-6 text-emerald-500 animate-spin' />
					<h3 className='text-zinc-400 text-xl font-bold'>Logging you in</h3>
					<p className='text-zinc-400 text-sm'>Redirecting...</p>
				</CardContent>
			</Card>
		</div>
	);
};

export default AuthCallbackPage;