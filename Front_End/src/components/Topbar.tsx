import { SignedIn, SignedOut, SignOutButton } from "@clerk/clerk-react";
import { LayoutDashboardIcon } from "lucide-react";
import { Link } from "react-router-dom";
import SignInOAuthButton from "./SignInOAuthButton";
import { Button } from "./ui/button";

const Topbar = () => {
    const isAdmin = false;

  return (
    <div className='flex items-center justify-between p-4 sticky top-0 bg-zinc-900/75 backdrop-blur-sm z-10'>
      <div className='flex items-center gap-2'>
        Spotify
      </div>

      <div className='flex items-center gap-4'>
        {isAdmin && (
          <Link to='/admin' className='text-sm text-emerald-500 hover:underline'>
            <LayoutDashboardIcon className='size-4' />
            Admin Dashboard
          </Link>
        )}

        <SignedIn>
          <SignOutButton>
            <Button variant="secondary" className='w-full text-white border-zinc-200 h-11'>
                Sign Out
            </Button>
          </SignOutButton>
        </SignedIn>

        <SignedOut>
          <SignInOAuthButton />
        </SignedOut>
      </div>
    </div>
  )
}

export default Topbar;