 import { getAccountWithTransaction } from '@/actions/accounts'
import notfound from '@/app/not-found'
import React, { Suspense } from 'react'
import { BarLoader } from 'react-spinners'
import TransactionTable from '../_components/Transaction-Table'
import AccountChart from '../_components/Account-Chart'

const AccountPage = async ({params}) => {
  
  const resParams=await params
  const accData=await getAccountWithTransaction(resParams.id)
  
  if(accData == null){
    return notfound();
  }
  
  const {transactions,...account}=accData
  return (
    <div className='space-y-8 px-5 '>
      <div className='flex gap-4 items-end justify-between'>

        <div className='my-5'>
          <h1 className='text-5xl sm:text-6xl font-bold gradient-title capitalize'>{accData.name}</h1>
          <p className='text-muted-foreground'>{accData.type.charAt(0) + accData.type.slice(1).toLowerCase()} Account </p>
        </div>

        <div className='text-right pb-2'>
          <div className='text-xl sm:text-2xl font-bold'>${parseFloat(accData.balance).toFixed(2) }</div>
          <p className='text-sm text-muted-foreground'>{accData._count.transactions} Transactions</p>
        </div>

      </div>

      <Suspense fallback={<BarLoader className='mt-4' width={"100%"} color='#FFA127' />}>
        <AccountChart transactions={transactions} />
      </Suspense>
      
      <Suspense fallback={<BarLoader className='mt-4' width={"100%"} color='#FFA127' />}>
        <TransactionTable transactions={transactions} />
      </Suspense>
    </div>
  )
}

export default AccountPage

// params.id - gives the remaining endpoint after account/ which is actually the id of the transaction