"use server"

import { db } from "@/lib/prisma"
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache"

const serializeTransaction = (obj) => {   // Cannot return decimal values in next.js , so serializing balance(float) into number
    const serialized = { ...obj }
    if (obj.balance) {
        serialized.balance = obj.balance.toNumber()
    }
    if (obj.amount) {
        serialized.amount = obj.amount.toNumber()
    }
    return serialized
}

export async function updateDefaultAccount(accountId) {
    try{
        const { userId } = await auth();
        if (!userId) throw new Error("Unauthorized")

        const user = await db.user.findUnique({
            where: {
                clerkUserId: userId
            }
        })
        if (!user) {
            throw new Error("User not Found")
        }

        await db.account.updateMany({
            where: { userId: user.id, isDefault: true },  // if there is no existing acc then this acc is default and 
            data: { isDefault: false }                    // set all other accs as false
        })

        const acc=await db.account.update({
            where:{id:accountId,userId:user.id},
            data:{isDefault:true}
        })

        revalidatePath("/dashboard")
        return {success:true,data:serializeTransaction(acc)}
    }catch(err){
        return {success:false,error:err.message}
    }
}

export async function deleteAccount(accountId){
    try{
        const { userId } = await auth();
        if (!userId) throw new Error("Unauthorized")

        const user = await db.user.findUnique({
            where: {
                clerkUserId: userId
            }
        })
        if (!user) {
            throw new Error("User not Found")
        }

        await db.account.delete({
            where:{id:accountId,userId:user.id}
        })

        revalidatePath("/dashboard")
        return {success:true}
    }catch(err){
        return {success:false,error:err.message}
    }
}

export async function getAccountWithTransaction(accountId) {
    
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized")

    const user = await db.user.findUnique({
        where: {
            clerkUserId: userId
        }
    })
    if (!user) {
        throw new Error("User not Found")
    }

    const acc = await db.account.findUnique({
        where: { id: accountId, userId: user.id },
        include:{
            transactions:{orderBy:{date:"desc"}},
            _count: {select:{transactions:true}}
        },
        
    })

    if (!acc) return null;
    return {...serializeTransaction(acc),transactions:acc.transactions.map(serializeTransaction)}
}

export async function bulkDeleteTransactions(transactionIds){
    try{
        const { userId } = await auth();
        if (!userId) throw new Error("Unauthorized")
    
        const user = await db.user.findUnique({
            where: {
                clerkUserId: userId
            }
        })
        if (!user) {
            throw new Error("User not Found")
        }
    
        const transactions=await db.transaction.findMany({
            where:{
                id:{in:transactionIds},
                userId:user.id
            }
        })

        let accountId=""
    
        const accBalanceChanges=transactions.reduce((acc,transaction)=>{
            const change=transaction.type==="EXPENSE" ? transaction.amount : - transaction.amount
            
            acc[transaction.accountId]=(acc[transaction.accountId] || 0) + Number(change) // Changes made for a particular account
            return acc
        },{})
        
        await db.$transaction(async(tx)=>{  // To prevent the case , where if one api fails every other also fails
            await tx.transaction.deleteMany({ //tx is db
                where:{
                    id:{in:transactionIds},
                    userId:user.id
                }
            })

            for (const [accId, balChange] of Object.entries(accBalanceChanges)) {
                accountId=accId
                
                const updated=await tx.account.update({
                    where: { id: accId },
                    data: { balance: { increment: balChange } }
                })
                
            }
            
        })
       
        revalidatePath("/dashboard")
        revalidatePath(`/account/${accountId}`)
        return {success:true}
    }catch(err){
        return {success:false,error:err.message}
    }
}