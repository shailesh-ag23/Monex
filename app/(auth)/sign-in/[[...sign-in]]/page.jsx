import { SignIn } from '@clerk/nextjs'
import React from 'react'

const Page = () => {
  return (
    <div className='mt-30' >
      <SignIn />
    </div>
  )
}

export default Page
