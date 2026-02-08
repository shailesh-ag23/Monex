//name of the file should be same to display the 404 error 
import { Button } from '@/components/ui/button'
import Link  from 'next/link'
import React from 'react'

const notfound = () => {
  return (
    <div className='flex flex-col items-center justify-center min-h-[100vh] px-4 text-center '>
      <h1 className='text-6xl font-bold gradient-title mb-4'>404</h1>
      <h2 className='text-2xl font-semibold mb-4'>Page Not Found</h2>
      <p className='text-gray-600 mb-8'>Oops!The Page you are looking for doesn't exist</p>
      <Link href='/'>
        <Button className='hover:bg-orange-400'>Return to Home Page</Button>
      </Link>
    </div>
  )
}

export default notfound
