import React from 'react'
import { SignInButton,SignUpButton,SignedIn,SignedOut,UserButton } from '@clerk/nextjs'
import Link  from 'next/link' //Make sure its imported from proper package
import Image from 'next/image'
import { Button } from './ui/button'
import { LayoutDashboard, PenBox } from 'lucide-react'
import { checkUser } from '@/lib/checkUser'

const Header = async () => {
  await checkUser(); // for checkUser.js to load the details of the user in db when they login

  return (
    <div className='fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b'>
      <nav className='container mx-auto px-4 py-4 flex items-center justify-between'>
          <Link href="/">
              <Image src={"/monex.png"} alt="monex logo" height={60} width={200} className='h-20 w-auto object-contain rounded-lg'/>
          </Link>
          
          <div className='flex items-center gap-2'>
            <SignedIn>
              <Link href={"/dashboard"} className='text-gray-600 hover:text-red-900 flex items-center gap-2'>
                  <Button variant='outline' >
                      <LayoutDashboard size={18}/> {/* Dashboard symbol*/}
                      <span className='hidden md:inline'>Dashboard</span> {/*Show Dashboard only if the screen is bigger than md*/}
                  </Button>
              </Link>
              <Link href={"/transaction/create"} className='flex items-center gap-2'>
                  <Button >
                      <PenBox size={18}/>
                      <span className='hidden md:inline'>Add Transaction</span>
                  </Button>
              </Link>
            </SignedIn>


            <SignedOut>     {/* If signed out */}
                <SignInButton forceRedirectUrl='/dashboard'>
                  <Button variant='outline'>Login</Button>
                </SignInButton>
                <SignUpButton>
                  <Button variant='outline'>Signup</Button>
                </SignUpButton>
            </SignedOut>

            <SignedIn>      {/* If signed in */}
                <UserButton appearance={{
                  elements:{
                      avatarBox:"w-10 h-10"
                  }
                }} />
            </SignedIn>
          </div>
      </nav>
    </div>
  )
}

export default Header

// fixed top-0 header will be seen in the screen even scrolled also
// object-contain keeps the original proportion of the image 
// border-b border in bottom
// forceRedirectUrl after the login , go to the url
// span - to change only the title without changing the symbol (style a small part of text) 