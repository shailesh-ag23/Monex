import React, { Suspense } from 'react'
import DashboardPage from './page'
import { BarLoader } from 'react-spinners'

const layout = () => {
  return (
    <div className='px-5'>
      <h1 className='text-6xl font-bold gradient-title mb-5 text-center'>Dashboard</h1>
      <Suspense fallback={<BarLoader className='mt-4' width={"100%"} color='#FFA127' />}> 
        <DashboardPage/>
      </Suspense>
    </div>
  )
}

export default layout

//suspense - loading bar for delays
