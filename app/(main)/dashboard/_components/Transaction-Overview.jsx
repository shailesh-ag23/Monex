"use client"

import React, { useState } from 'react'
import { PieChart, Pie, ResponsiveContainer, Cell, Legend } from 'recharts';
import { Card,CardContent,CardHeader,CardTitle } from "@/components/ui/card"
import { Select,SelectContent,SelectItem,SelectTrigger,SelectValue } from "@/components/ui/select"
import { ArrowDownRight, ArrowUpRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { defaultCategories } from '@/data/categories';

const DashboardOverview = ({accounts,transactions}) => {
    
    const [selectedAccountId,SetSelectedAccountId]=useState(accounts.find((acc)=>acc.isDefault)?.id || accounts[0]?.id)
    const accountTransactions=transactions.filter((t)=>t.accountId==selectedAccountId)
    const recentTransactions=accountTransactions.sort((a,b)=>new Date(b.date)-new Date(a.date)).slice(0,5)

    const currentDate= new Date()
    const currentMonthExpenses=accountTransactions.filter((t)=>{
        const transactionDate=new Date(t.date)
        return (t.type==="EXPENSE" && transactionDate.getMonth()===currentDate.getMonth() && transactionDate.getFullYear()===currentDate.getFullYear())
    })

    const expensesByCategory=currentMonthExpenses.reduce((acc,transaction)=>{
        const category=transaction.category
        if(!acc[category]){
            acc[category]=0
        }
        acc[category]+=transaction.amount
        return acc
    },{})

    const pieChartData =Object.entries(expensesByCategory).map(
        ([category,amount])=>({
            name:category,
            value:amount
        })
    )

    return (
        <div className='grid gap-4 md:grid-cols-2'>
            <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-4'>
                    <CardTitle className='text-base font-normal'>Recent Transactions</CardTitle>

                    <Select value={selectedAccountId} onValueChange={SetSelectedAccountId}>
                        <SelectTrigger className="w-[140px]">
                            <SelectValue placeholder="Select account" />
                        </SelectTrigger>
                        <SelectContent>
                           
                            {accounts.map((acc)=>(
        
                                <SelectItem key={acc.id} value={acc.id}>{acc.name}</SelectItem>
                            ))}
                            
                        </SelectContent>
                    </Select>
                </CardHeader>

                <CardContent>
                    <div className='space-y-4'>
                        {recentTransactions.length===0?(
                            <p className='text-center text-muted-foreground py-4'>No recent transactions</p>
                        ):(
                            recentTransactions.map((transaction)=>{
                                return(<div key={transaction.id} className='flex items-center justify-between'>

                                    <div className='space-y-1'>
                                        <p className='text-sm font-medium leading-none'>{transaction.description || "Untitled Transaction" }</p>
                                        <p className='text-sm text-muted-foreground'>{format(new Date(transaction.date),"PP")}</p>
                                    </div>

                                    <div className='flex items-center gap-2'>
                                        <div className={cn('flex items-center',transaction.type==="EXPENSE" ? "text-red-500" :"text-green-500")}>  
                                            {transaction.type==="EXPENSE" ? (
                                                <ArrowDownRight className='mr-1 h-4 w-4'/>
                                            ):(
                                                <ArrowUpRight className='mr-1 h-4 w-4' />
                                            )}
                                            ${transaction.amount.toFixed(2)}
                                        </div>
                                    </div>

                                </div>)
                            })
                        )}
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className='text-base font-normal'>Monthly Expense Breakdown</CardTitle>
                </CardHeader>

                <CardContent className='p-0 pb-5'>
                    {pieChartData.length===0?(
                        <p className='text-center text-muted-foreground py-4'>No expenses this month</p>
                    ):(
                        <div className='h-[300px]'>
                             
                            <ResponsiveContainer width="100%" height="100%" >
                                <PieChart>
                                        <Pie data={pieChartData} dataKey="value" cx="50%" cy="50%" outerRadius={80}
                                            label={({ name, value }) => `${name}: $${Number(value).toFixed(2)}`}>
                                            {pieChartData.map((entry, index) => (
                                                <Cell
                                                    key={`cell-${index}`}
                                                    fill={defaultCategories[index].color}
                                                />
                                            ))}
                                        </Pie>
                                        <Legend />
                                </PieChart>
                            </ResponsiveContainer>
      
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}

export default DashboardOverview

 //cn() from shadcn for conditions