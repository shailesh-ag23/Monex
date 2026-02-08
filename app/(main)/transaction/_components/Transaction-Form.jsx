"use client"

import { createTransaction, updateTransaction } from '@/actions/transaction'
import { transactionSchema } from '@/app/lib/schema'
import useFetch from '@/hooks/use-fetch'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Select,SelectContent,SelectGroup,SelectItem,SelectTrigger,SelectValue } from "@/components/ui/select"
import { Popover,PopoverContent,PopoverTrigger } from "@/components/ui/popover"
import { Input } from '@/components/ui/input'
import CreateAccountDrawer from '@/components/CreateAccountDrawer'
import { format } from 'date-fns'
import { CalendarIcon, Loader2 } from 'lucide-react'
import { Calendar } from '@/components/ui/calendar'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import ReceiptScanner from './Receipt-Scanner'

const AddTransactionForm = ({accounts,categories,editMode=false,initialData=null}) => {
    
    const router=useRouter();
    const searchParams=useSearchParams()
    const editId=searchParams.get("edit")
    
    const {register,setValue,handleSubmit,formState:{errors},watch,getValues,reset}=
    useForm({
        resolver:zodResolver(transactionSchema),
        defaultValues:
            editMode && initialData ? {
                type:initialData.type,
                amount:initialData.amount.toString(),
                accountId:initialData.accountId,
                category:initialData.category,
                date:new Date(initialData.date),
                isReccuring:initialData.isReccuring,
                ...(initialData.reccuringInterval && {
                    reccuringInterval:initialData.reccuringInterval
                }),
                description:initialData.description
            }:{
                type: "EXPENSE",
                amount: "",
                description: "",
                accountId: accounts.find((acc) => acc.isDefault)?.id,
                date: new Date(),
                isReccuring: false
            }
        }
    )

    const {loading:transactionLoading,fn:transactionFn,data:transactionResult}=useFetch(editMode ? updateTransaction: createTransaction)
    
    const type=watch("type")
    const isReccuring=watch("isReccuring")
    const date=watch("date")
    
    const onSubmit=async(data)=>{
        const formData={
            ...data,
            amount:parseFloat(data.amount)
        }

        if(editMode){
            transactionFn(editId,formData)
        }else{
            transactionFn(formData)
        }
        
    }

    useEffect(()=>{
        if(transactionResult?.success && !transactionLoading){
            toast.success(editMode ? "Transaction updated successfully": "Transaction created successfully")
            reset() // resetting the form
            router.push(`/account/${transactionResult.data.accountId}`)
        }
    },[transactionResult,transactionLoading,editMode])

    const filteredCategories=categories.filter((category)=>category.type===type)

    const handleScanComplete=(scannedData)=>{
      
        if(scannedData){
            setValue("amount",scannedData.amount.toString())
            setValue("date",new Date(scannedData.date))
            if(scannedData.description){
                
                setValue("description",scannedData.description)
            }
            if(scannedData.category){
                setValue("category", scannedData.category[0].toUpperCase() + scannedData.category.slice(1))
            }
        }
    }

    const currentAccount=editMode && accounts.filter((acc) => acc?.id === initialData.accountId)[0].name
    
    return (
        <form className='space-y-4' onSubmit={handleSubmit(onSubmit)}>

            {!editMode && <ReceiptScanner onScanComplete={handleScanComplete}/>}

            <div className='space-y-2'>
                <label className='text-sm font-medium'>Type</label>
                <Select onValueChange={(val)=>setValue("type",val)} defaultValue={type}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectItem value="INCOME">Income</SelectItem>
                            <SelectItem value="EXPENSE">Expense</SelectItem>
                            
                        </SelectGroup>
                    </SelectContent>
                </Select>

                {errors.type && (<p className='text-sm text-red-500'>{errors.type.message}</p>)}
            </div>

            <div className='grid gap-6 md:grid-cols-2'>
                <div className='space-y-2'>
                    <label className='text-sm font-medium'>Amount</label>
                    <Input type="number" step="0.01" placeholder="0.00" {...register("amount")}/>

                    {errors.amount && (<p className='text-sm text-red-500'>{errors.amount.message}</p>)}
                </div>

                <div className='space-y-2'>
                    <label className='text-sm font-medium'>Account</label>
                    <Select onValueChange={(val) => setValue("accountId", val)} defaultValue={editMode? currentAccount : getValues("accountId")}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select account" />
                        </SelectTrigger>
                        <SelectContent>
                            {editMode ? <SelectItem value={currentAccount}>{currentAccount}</SelectItem>:(
                                accounts.map((acc)=>(
                                    <SelectItem key={acc.id} value={acc.id}>{acc.name} (${parseFloat(acc.balance).toFixed(2)})</SelectItem>
                                ))
                            )}
                                
                        <CreateAccountDrawer>
                           { !editMode && <Button variant="ghost" className='w-full select-none items-center text-sm outline-none'>Create Account</Button>}
                        </CreateAccountDrawer>

                        </SelectContent>
                    </Select>

                    {errors.accountId && (<p className='text-sm text-red-500'>{errors.accountId.message}</p>)}
                </div>
            </div>

            <div className='space-y-2'>
                <label className='text-sm font-medium'>Category</label>
                <Select onValueChange={(val) => setValue("category", val)} value={watch("category")} defaultValue={getValues("category")}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                        {filteredCategories.map((category) => (
                            <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                {errors.category && (<p className='text-sm text-red-500'>{errors.category.message}</p>)}
            </div>

            <div className='space-y-2'>
                <label className='text-sm font-medium'>Date</label>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="outline" className='w-full pl-3 text-left font-normal'>
                            {date?format(date,"PPP"):<span>Pick a date</span>}
                            <CalendarIcon className='ml-auto h-4 w-4 opacity-50'/>
                        </Button>
                    </PopoverTrigger>

                    <PopoverContent className='w-auto p-0' align="start">
                        <Calendar mode="single" selected={date} onSelect={(date)=>setValue("date",date)} disabled={(date)=>date>new Date() || date<new Date("1900-01-01")} initialFocus/>
                    </PopoverContent>
                </Popover>
                {errors.date && (<p className='text-sm text-red-500'>{errors.date.message}</p>)}
            </div>

            <div className='space-y-2'>
                <label className='text-sm font-medium'>Description</label>
                <Input  placeholder="Enter description" {...register("description")} value={watch("description")} defaultValue={getValues("description")}/>

                {errors.description && (<p className='text-sm text-red-500'>{errors.description.message}</p>)}
            </div>

            <div className='flex items-center justify-between rounded-lg border p-3'>
                <div className='space-y-0.5'>
                    <label  className='text-sm font-medium cursor-pointer'>Recurring Transaction</label>
                    <p className='text-sm text-muted-foreground'>Set up a recurring schedule for this transaction</p>
                </div>
                <Switch 
                    onCheckedChange={(checked) => { setValue("isReccuring", checked) }}
                    checked={isReccuring} />
            </div>
           
            {isReccuring && (
                <div className='space-y-2'>
                    <label className='text-sm font-medium'>Recurring Interval</label>
                    <Select onValueChange={(val) => setValue("reccuringInterval", val)} defaultValue={getValues("reccuringInterval")}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select Interval" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="DAILY">Daily</SelectItem>
                            <SelectItem value="WEEKLY">Weekly</SelectItem>
                            <SelectItem value="MONTHLY">Monthly</SelectItem>
                            <SelectItem value="YEARLY">Yearly</SelectItem>
                        </SelectContent>
                    </Select>

                    {errors.reccuringInterval && (<p className='text-sm text-red-500'>{errors.reccuringInterval.message}</p>)}
                </div>
            )}

            <div className='grid grid-cols-2 gap-4'>
                <Button type="button" variant='outline' className='w-full' onClick={()=>router.back()}>Cancel</Button> 
                <Button type="submit" className='w-full' disabled={transactionLoading}>
                    {transactionLoading?(
                        <>
                            <Loader2 className='mr-2 h-4 w-4 animate-spin'/>
                            {editMode ?"Updating...":"Creating..."}
                        </>
                    ):editMode?("Update Transaction"):("Create Transaction")}
                </Button>
            </div>
            
        </form>
    )
}

export default AddTransactionForm

// router.back() returns back to the previous page 