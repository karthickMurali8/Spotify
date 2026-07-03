import { SignedIn, SignedOut, SignOutButton, UserButton } from "@clerk/clerk-react";
import { LayoutDashboardIcon } from "lucide-react";
import { Link } from "react-router-dom";
import SignInOAuthButton from "./SignInOAuthButton";
import { Button, buttonVariants } from "./ui/button";
import { UseAuthStore } from "@/stores/UseAuthStore";
import { cn } from "@/lib/utils";

const Topbar = () => {
    const { isAdmin } = UseAuthStore();
    console.log("Admin status:", isAdmin); // Debugging log

  return (
    <div className='flex items-center justify-between p-4 sticky top-0 bg-zinc-900/75 backdrop-blur-sm z-10'>
      <div className='flex items-center gap-2'>
        <img src='/spotify.png' alt='Spotify' className='size-8' />
        Spotify
      </div>

      <div className='flex items-center gap-4'>
        {isAdmin && (
          <Link to='/admin' className={cn(buttonVariants({ variant: "outline"}), 'text-sm text-emerald-500 hover:underline')}>
            <LayoutDashboardIcon className='size-4' />
            Admin Dashboard
          </Link>
        )}

        {/* <SignedIn>
          <SignOutButton>
            <Button variant="secondary" className='w-full text-white border-zinc-200 h-11'>
                Sign Out
            </Button>
          </SignOutButton>
        </SignedIn> */}

        <SignedOut>
          <SignInOAuthButton />
        </SignedOut>

        <UserButton />
      </div>
    </div>
  )
}

export default Topbar;