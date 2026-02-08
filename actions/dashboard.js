"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server"; 
import { revalidatePath } from "next/cache";

const serializeTransaction =(obj)=>{   // Cannot return decimal values in next.js , so serializing balance(float) into number
    const serialized={...obj}
    if(obj.balance){
        serialized.balance=obj.balance.toNumber()
    }
    if(obj.amount){
        serialized.amount=obj.amount.toNumber()
    }
    return serialized
}

export async function createAccount(data) {  // server action
    try{
        const{userId}=await auth();
        if(!userId) throw new Error("Unauthorized")

        const user=await db.user.findUnique({
            where:{
                clerkUserId:userId
            }
        })
        if(!user){
            throw new Error ("User not Found")
        }

        const balanceFloat=parseFloat(data.balance); // Converting balance amount to float
        if(isNaN(balanceFloat)){                     // If its not a number
            throw Error("Invalid Balance Amount")
        }

        const existingAccount=await db.account.findMany({ // Finding all the accounts of the user
            where:{userId:user.id}
        })
        const shouldBeDefault=existingAccount.length===0?true:data.isDefault // data.isDefault - false
        if(shouldBeDefault){
            await db.account.updateMany({
                where:{userId:user.id,isDefault:true},  // if there is no existing acc then this acc is default and 
                data:{isDefault:false}                  // set all other accs as false
            })
        }

        const account=await db.account.create({
            data:{
                ...data, // other cols that are not mentioned createdAt updatedAt type name
                balance:balanceFloat,
                userId:user.id,
                isDefault:shouldBeDefault
            }
        })

        const serializedAccount=serializeTransaction(account);
        revalidatePath("/dashboard") // refetch data of a page
        return {success:true,data:serializedAccount}

    }catch(err){
        throw new Error(err.message);
    }
}

export async function getUserAccounts() {
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

    const accounts = await db.account.findMany({ // Finding all the accounts of the user
        where: { userId: user.id },
        orderBy:{createdAt:"desc"},
        include:{
            _count:{
                select:{
                    transactions:true
                }
            }
        }
    })

    const serializedAccount = accounts.map(serializeTransaction); // serialize each and every account
    return serializedAccount
}

export async function getDashboardData(){
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

    const transaction =await db.transaction.findMany({
        where:{userId:user.id},
        orderBy:{date:"desc"}
    })

    return transaction.map(serializeTransaction)
}