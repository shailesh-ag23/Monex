"use client";

import React, { useEffect, useState } from 'react'
import {Drawer,DrawerClose,DrawerContent,DrawerHeader,DrawerTitle,DrawerTrigger} from "@/components/ui/drawer"
import { accountSchema } from '@/app/lib/schema';
import {zodResolver} from '@hookform/resolvers/zod'
import { Input } from './ui/input';
import { useForm } from 'react-hook-form';
import {Select,SelectContent,SelectItem,SelectTrigger,SelectValue} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Button } from './ui/button';
import useFetch from '@/hooks/use-fetch';
import { createAccount } from '@/actions/dashboard';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const CreateAccountDrawer = ({children}) => {
    const [open,setOpen]=useState(false);

    const{register,handleSubmit,formState:{errors},setValue,watch,reset}=useForm({     // For Connecting with accountSchema's zod
        resolver:zodResolver(accountSchema),
        defaultValues:{
            name:"",
            type:"CURRENT",
            balance:"",
            isDefault:false
        }
    })

    const {
        data: newAccount, error, fn: createAccountFn, loading: createAccountLoading // data : newAccount - renaming data to newAccount
    } = useFetch(createAccount) // createAccount from actions/dashboard.js
    
    useEffect(()=>{
        if(newAccount&&!createAccountLoading){
            toast.success("Account Created Successfully")
            reset() // form reset
            setOpen(false)
        }
    },[createAccountLoading,newAccount]) // when there is a change in newAccount and loading this will be triggered
    
    useEffect(()=>{
        if(error){
            toast.error(error.message || "Failed to create account")
        }
    })

    const onSubmit=async(data)=>{  // from handleSubmit in onSubmit
        await createAccountFn(data)
    }

    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>{children}</DrawerTrigger>
            <DrawerContent>
                <DrawerHeader>
                    <DrawerTitle>Are you absolutely sure?</DrawerTitle>
                </DrawerHeader>
                <div className='px-4 pb-4'>
                    <form className='space-y-4' onSubmit={handleSubmit(onSubmit)}>

                        <div className='space-y-2'>
                            <label htmlFor='name' className='text-sm font-medium'>Account Name</label>
                            <Input id="name" placeholder="e.g., Main Checking" {...register("name")}/>
                            {errors.name && <p className='text-sm tex-red-500'>{errors.name.message}</p>}
                        </div>

                        <div className='space-y-2'>
                            <label htmlFor='type' className='text-sm font-medium'>Account Type</label>
                            <Select 
                                onValueChange={(value)=>{setValue("type",value)}}
                                defaultValue={watch("type")}>
                                <SelectTrigger id="type">
                                    <SelectValue placeholder="Select Type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="CURRENT">Current</SelectItem>
                                    <SelectItem value="SAVINGS">Savings</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.type && <p className='text-sm tex-red-500'>{errors.type.message}</p>}
                        </div>

                        <div className='space-y-2'>
                            <label htmlFor='balance' className='text-sm font-medium'>Initial Balance</label>
                            <Input id="balance" type="number" step="0.01" placeholder="0.01" {...register("balance")}/>
                            {errors.balance && <p className='text-sm tex-red-500'>{errors.balance.message}</p>}
                        </div>

                        <div className='flex items-center justify-between rounded-lg border p-3'>
                            <div className='space-y-0.5'> 
                                <label htmlFor='isDefault' className='text-sm font-medium cursor-pointer'>Set as Default</label>
                                <p className='text-sm text-muted-foreground'>This Account will be selected by default for Transactions</p>
                            </div>
                            <Switch id="isDefault"
                                onCheckedChange={(checked) => { setValue("isDefault", checked) }}
                                checked={watch("isDefault")} />
                        </div>
                                

                        <div className='flex gap-4 pt-4'>
                            <DrawerClose asChild>
                                <Button type="button" variant="outline" className="flex-1">Cancel</Button>
                            </DrawerClose>
                            <Button type="submit" className="flex-1" disabled={createAccountLoading}>
                                {createAccountLoading ? <><Loader2 />Creating...</> : "Create Account"}</Button>
                        </div>

                    </form>
                </div>
            </DrawerContent>
        </Drawer>
    )
}

export default CreateAccountDrawer

// register() - connecting input to form states
// watch() - shows/reads the current value while changing
// htmlFor - instead of For , Clicking the label focuses on the input <label htmlFor="type"/> -> <input id="type"/>
// step="0.01" - An up and down switch used to increment or decrement by 0.01
// checked - watches the current state ( checked / not ) , built in from radix-ui