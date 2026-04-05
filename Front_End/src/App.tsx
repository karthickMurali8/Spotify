import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from '@clerk/clerk-react'
import './App.css'
import { Button } from './components/ui/button'

function App() {

  return (
    <>
      <header>

        {/* Show the sign-in and sign-up buttons when the user is signed out */}
        <SignedOut>
          <SignInButton>
            <Button variant='outline' size='lg'>Sign In</Button>
          </SignInButton>
          {/* <SignUpButton /> */}
        </SignedOut>

        {/* Show the user button when the user is signed in */}
        <SignedIn>
          <h1 className='text-red-500 text-8xl'>Spotify</h1>
          <Button variant='outline' size='lg'>Click Here !!!</Button>
          <UserButton />
        </SignedIn>

      </header>
    </>
  )
}

export default App
