import { AuthenticateWithRedirectCallback, SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from '@clerk/clerk-react'
import './App.css'
import { Button } from './components/ui/button'
import { Route, Routes } from 'react-router-dom'
import HomePage from './pages/home/HomePage'
import AuthCallBack from './pages/auth/AuthCallBack'

function App() {

  return (
    <>
      {/* <header> */}

        {/* Show the sign-in and sign-up buttons when the user is signed out */}
        {/* <SignedOut>
          <SignInButton>
            <Button variant='outline' size='lg'>Sign In</Button>
          </SignInButton>
        </SignedOut> */}

        {/* Show the user button when the user is signed in */}
        {/* <SignedIn>
          <h1 className='text-red-500 text-8xl'>Spotify</h1>
          <Button variant='outline' size='lg'>Click Here !!!</Button>
          <UserButton />
        </SignedIn>

      </header> */}
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/sso-callback' element={<AuthenticateWithRedirectCallback signUpForceRedirectUrl={'/auth/callback'} />} />
        <Route path='/auth/callback' element={<AuthCallBack />} />
      </Routes>
    </>
  )
}

export default App
