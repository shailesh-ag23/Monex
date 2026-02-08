import { getUserAccounts } from '@/actions/dashboard'
import { defaultCategories } from '@/data/categories'
import React, { Suspense } from 'react'
import AddTransactionForm from '../_components/Transaction-Form'
import { BarLoader } from 'react-spinners'
import { getTransaction } from '@/actions/transaction'

const AddTransactionPage = async({searchParams}) => {
    const accounts=await getUserAccounts()
    
    const param= await searchParams
    const editId=param?.edit
   
    let initialData=null
    if(editId){
        const transaction=await getTransaction(editId)
        initialData=transaction
    }

    return (
        <div className='max-w-3xl mx-auto px-5'>
            <h1 className='text-5xl gradient-title mb-8'>{editId ? ("Edit"):("Add")} Transaction</h1>
            <Suspense fallback={<BarLoader className='mt-4' width={"100%"} color='#FFA127' />}>
                <AddTransactionForm accounts={accounts} categories={defaultCategories} editMode={!!editId} initialData={initialData} />
            </Suspense>
            
        </div>
    )
}

export default AddTransactionPage
