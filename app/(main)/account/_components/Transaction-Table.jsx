"use client"

import React, { useEffect, useMemo, useState } from 'react'
import { Table,TableBody,TableCell,TableHead,TableHeader,TableRow } from "@/components/ui/table"
import { Select,SelectContent,SelectItem,SelectTrigger,SelectValue } from "@/components/ui/select"
import { Checkbox } from '@/components/ui/checkbox'
import { categoryColors } from '@/data/categories'
import { format } from 'date-fns'
import { Tooltip,TooltipContent,TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from '@/components/ui/badge'
import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp, Clock, MoreHorizontal, RefreshCw, Search, Trash, X } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { DropdownMenu,DropdownMenuContent,DropdownMenuItem,DropdownMenuSeparator,DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import useFetch from '@/hooks/use-fetch'
import { bulkDeleteTransactions } from '@/actions/accounts'
import { toast } from 'sonner'
import { BarLoader } from 'react-spinners'

const RECURRING_INTERVALS={DAILY:"Daily",WEEKLY:"Weekly",MONTHLY:"Monthly",YEARLY:"Yearly"}

const TransactionTable = ({transactions}) => {
  
  const router=useRouter();
  const [selectedIds,setSelectedIds]=useState([])
  const [sortConfig,setSortConfig]=useState({field:"date",direction:"desc"})

  const [search,setSearch]=useState("")
  const [typeFilter,setTypeFilter]=useState("")
  const [recurringFilter,setRecurringFilter] = useState("")

  const { loading:deleteLoading,fn:deleteFn,data:deleted}=useFetch(bulkDeleteTransactions)

  const [page,setPage]=useState(1)
  
  const filteredAndSortedTransactions=useMemo(()=>{
    let result=[...transactions]

    if(search){
      const searchLower=search.toLowerCase()
      result=result.filter((transaction)=>{
        return transaction.description?.toLowerCase().includes(searchLower)
      })
    }

    if(recurringFilter){
      result=result.filter((transaction)=>{
        if(recurringFilter==="recurring"){
          return transaction.isReccuring
        }
        return !transaction.isReccuring
      })
    }

    if(typeFilter){
      result=result.filter((transaction)=>{return transaction.type===typeFilter})
    }

    if(sortConfig){

      result.sort((a,b)=>{  // sort in js takes two values a and b and compares them 
        let comparison=0
        switch(sortConfig.field){
          case "date":
            comparison = new Date(a.date)-new Date(b.date)
            break
          case "amount":
            comparison = a.amount - b.amount
            break
          case "category":
            comparison= a.category.localeCompare(b.category) //localeCompare - compares letter by letter
            break
        }
        return sortConfig.direction==="asc" ? comparison : -comparison
      })
    
    }

    return result;
  },[transactions,search,typeFilter,recurringFilter,sortConfig]) // Changes in dependencies will trigger the memo hook 

  const handleSort=(field)=>{
    setSortConfig((current)=>({
      field,
      direction:field==current.field && current.direction === "asc" ? "desc" :"asc" // Make it descending if its already ascending and vice versa
    }))
  }

  const handleSelect =(id)=>{
    setSelectedIds((current)=>{ // current Holds the ids of the selected checkboxes 
      return current.includes(id) ? current.filter((item)=>item!=id) : [...current,id] // if the user clicks the id of a selected checkbox , deselect it or else add the id to the array
    })
  }

  const handleSelectAll =()=>{
    setSelectedIds((current)=>{
      return current.length===filteredAndSortedTransactions.length ?  // if all selected , deselect all 
      [] : filteredAndSortedTransactions.map(transaction=>transaction.id) // or else select all
    })
  }

  const handleBulkDelete=async()=>{
    if(!window.confirm(`Are you want to delete ${selectedIds.length} transactions ?`)){
      return; 
    }
    deleteFn(selectedIds)
    setSelectedIds([])
  }

  useEffect(()=>{
    if(deleted&& !deleteLoading){
      toast.success("Transactions deleted Successfully")
    }
  },[deleted,deleteLoading])

  const handleClearFilters=()=>{
    setRecurringFilter("")
    setSearch("")
    setTypeFilter("")
    setSelectedIds([])
  }

  function handlePage(value){
    if(value>=1&&value<=transactions.length){
      setPage(value)
    }
  }

  return (
    <div className='space-y-4'>
      {deleteLoading && <BarLoader className='mt-4' width={"100%"} color='#FFA127'/>}

      <div className='flex flex-col sm:flex-row gap-4'>
        <div className='relative flex-1'>
          <Search className='absolute left-2 top-2.5 h-4 w-4 text-muted-foreground'/>
          <Input placeholder="Search transactions..." className='pl-8' value={search} onChange={(event)=>setSearch(event.target.value)}/>
        </div>
        
        <div className='flex gap-2'>
          <Select value={typeFilter} onValueChange={(value)=>{setTypeFilter(value)}}>
            <SelectTrigger >
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="INCOME">Income</SelectItem>
              <SelectItem value="EXPENSE">Expense</SelectItem>
            </SelectContent>
          </Select>
              
          <Select value={recurringFilter} onValueChange={(value)=>{setRecurringFilter(value)}}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="All Transactions" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recurring">Recurring Only</SelectItem>
              <SelectItem value="non-recurring">Non-recurring Only</SelectItem>
            </SelectContent>
          </Select>

          {selectedIds.length>0 && (
            <div className='flex items-center gap-1'>
              <Button size="sm" variant='destructive' onClick={handleBulkDelete} >
                <Trash className='h-4 w-4 '/>Delete Selected ( {selectedIds.length} )
              </Button>
            </div>
          )} 

          {(search || typeFilter || recurringFilter) && (
            <Button variant='outline' size='icon' onClick={handleClearFilters} title="Clear Filters"><X className='h-4 w-5'/></Button>
          )}   
        </div>
      </div>

      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <Checkbox onCheckedChange={handleSelectAll} checked={selectedIds.length===filteredAndSortedTransactions.length && filteredAndSortedTransactions.length>0}/>
              </TableHead>

              <TableHead className="cursor-pointer" onClick={()=> handleSort("date")}>
                  <div className='flex items-center'>
                    Date{" "}{sortConfig.field==="date" && (
                      sortConfig.direction==="asc" ? (<ChevronUp className='ml-1 h-4 w-4'/>):(<ChevronDown className='ml-1 h-4 w-4'/>)
                    )}
                  </div>
              </TableHead>

              <TableHead >Description</TableHead>

              <TableHead className="cursor-pointer" onClick={() => handleSort("category")}>
                  <div className='flex items-center'>
                    Category{" "}{sortConfig.field === "category" && (
                      sortConfig.direction === "asc" ? (<ChevronUp className='ml-1 h-4 w-4' />) : (<ChevronDown className='ml-1 h-4 w-4' />)
                    )}
                  </div>
              </TableHead>

              <TableHead className="cursor-pointer" onClick={() => handleSort("amount")}>
                  <div className='flex items-center justify-end'>
                    Amount{" "}{sortConfig.field === "amount" && (
                      sortConfig.direction === "asc" ? (<ChevronUp className='ml-1 h-4 w-4' />) : (<ChevronDown className='ml-1 h-4 w-4' />)
                    )}
                  </div>
              </TableHead>

              <TableHead className="w-[50px]">Recurring</TableHead>

              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredAndSortedTransactions.length===0?(
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground">No Transactions Found</TableCell>
              </TableRow>) :(
              
              filteredAndSortedTransactions.slice(page*10-10,page*10).map((transaction)=>(
                <TableRow key={transaction.id}>
                  <TableCell>
                  <Checkbox onCheckedChange={() => { handleSelect(transaction.id) }} checked={selectedIds.includes(transaction.id) }/>
                  </TableCell>

                  <TableCell>{format(new Date(transaction.date),"PP")}</TableCell>

                  <TableCell>{transaction.description}</TableCell>

                  <TableCell className="capitalize">
                      <span 
                      style={{background:categoryColors[transaction.category]}} // Colors for particular categories from categories.js
                      className='px-2 py-1 rounded text-white text-sm'>{transaction.category}</span>
                  </TableCell>

                  <TableCell className="text-right font-medium" 
                        style={{ color: transaction.type === "EXPENSE" ? "red" :"#1bb635"}}>
                      {transaction.type==="EXPENSE"?"-":"+"} ${transaction.amount.toFixed(2)}
                  </TableCell>

                  <TableCell>{transaction.isReccuring ? (
                     <Tooltip>
                        <TooltipTrigger>
                            <Badge variant="outline" className="gap-1 bg-orange-100 text-orange-700 hover:bg-orange-200">
                              <RefreshCw className='h-3 w-3' />{RECURRING_INTERVALS[transaction.reccuringInterval]}
                            </Badge>
                        </TooltipTrigger>
                        <TooltipContent>
                            <div className='text-sm'>
                                <div className='font-medium'>Next Date:</div>
                                <div>{format(new Date(transaction.nextRecurringDate), "PP")}</div>
                            </div>
                        </TooltipContent>
                      </Tooltip>
                    ):(
                      <Badge variant="outline" className="gap-1">
                          <Clock className='h-3 w-3'/>One-time
                      </Badge>
                  )}</TableCell>

                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className='h-8 w-8 p-0'><MoreHorizontal className='h-4 w-4'/></Button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={()=>{router.push(`/transaction/create?edit=${transaction.id}`)}}>Edit</DropdownMenuItem>
                        <DropdownMenuSeparator />
                      <DropdownMenuItem className='text-destructive' onClick={() => { deleteFn([transaction.id]) }}>Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>

                </TableRow>
              ))
            )}
          </TableBody>

        </Table>
      </div>

      <div className='flex justify-center text-md mt-10'>
        <ChevronLeft className={page>1?'h-6 w-5 mr-2  rounded-md border hover:bg-gray-100':"hideIcon"}  onClick={()=>{handlePage(page-1)}}/> 
        {transactions.length === 0 ? <p>Page 0 of 0</p> : <p>Page {page} of {Math.ceil(transactions.length / 10)} </p> }
        <ChevronRight className={page <transactions.length/10 ?'h-6 w-5 ml-2  rounded-sm border hover:bg-gray-100':"hideIcon"} onClick={()=>{page<transactions.length/10 && handlePage(page+1)}}/>
      </div>
  </div>
  )
}

export default TransactionTable

// MoreHorizontal - three dots
// absolute - to place inside input