import React from 'react'

const AuthLayout = ({children}) => {
  return (
    <div className='flex justify-center pt-10 pb-20'>
      {children}
    </div>
  )
}

export default AuthLayout

// Wrapper around sign-in and sign-out 