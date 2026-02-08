"use client"

import React, { useEffect } from 'react'
import { Card,CardContent,CardFooter,CardHeader,CardTitle} from "@/components/ui/card"
import { ArrowDownRight, ArrowUpRight, Trash } from 'lucide-react'
import Link from 'next/link'
import { Switch } from '@/components/ui/switch'
import useFetch from '@/hooks/use-fetch'
import { deleteAccount, updateDefaultAccount } from '@/actions/accounts'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'

const AccountCard = ({account}) => { // {account} its like props

    const {name,type,balance,id,isDefault}=account
    const {loading:updateDefaultLoading,fn:updateDefaultFn,data:updatedAccount,error}=useFetch(updateDefaultAccount)
    const {loading:deleteAccountLoading,fn:deleteAccountFn,data:deletedAccount,deleteError}=useFetch(deleteAccount)

    const handleDefaultChange=async(event)=>{
        event.preventDefault() // to prevent the default behaviour

        if (isDefault){
            toast.warning("You need atleast 1 default account")
            return ; // Dont allow toggling the default acc 
        }
        await updateDefaultFn(id)
    }

    useEffect(()=>{
        if(updatedAccount?.success){  // ?. - if updatedAccount is not null or undefined , then read the success , or else dont
            toast.success("Default account updated successfully")
        }
    },[updatedAccount,updateDefaultLoading])

    useEffect(()=>{
        if(error){
            toast.error(error.message||"Failed to update default account")
        }
    },[error])

    const handleAccountDeletion=async(event)=>{
        if(!window.confirm("Are you sure you want to delete the account ?")){
            return
        }
        event.preventDefault()
        await deleteAccountFn(id)
    }

    useEffect(()=>{
        if(deletedAccount?.success){
            toast.success("Account Deleted Successfully")
        }
    },[deletedAccount,deleteAccountLoading])

    useEffect(() => {
        if (deleteError) {
            toast.error(deleteError.message || "Failed to delete account")
        }
    }, [deleteError])

    return (
        <Card className='hover:shadow-md transition-shadow group relative'>
            <Link href={`/account/${id}`}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium capitalize">{name}</CardTitle>
                    <div className='flex items-center gap-2'>

                    <Switch checked={isDefault} onClick={handleDefaultChange} />
                    <Button size="sm" variant='destructive' onClick={handleAccountDeletion} >
                        <Trash className='h-4 w-4 ' />
                    </Button>
                    
                    </div>
                </CardHeader>

                <CardContent>
                    <div className='text-2xl font-bold'>
                            ${parseFloat(balance).toFixed(2)}
                    </div>
                    <p className='text-xs text-muted-foreground'>{type.charAt(0) + type.slice(1).toLowerCase()} Account</p>  {/*First Letter only Capital*/}
                </CardContent>
                
                <CardFooter className="flex pt-4 justify-between text-sm text-muted-foreground">
                    <div className='flex items-center'>
                        <ArrowUpRight className=' mr-1 h-4 w-4 text-green-500'/>Income
                    </div>
                    <div className='flex items-center'>
                        <ArrowDownRight className='  mr-1 h-4 w-4 text-red-500'/>Expense
                    </div>
                </CardFooter>
            </Link>
        </Card>
    )
}

export default AccountCard
