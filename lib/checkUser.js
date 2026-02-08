import { currentUser } from "@clerk/nextjs/server";
import { db } from "./prisma"; // Exported from the prisma.js

export const checkUser=async ()=>{
    const user =await currentUser();
    if(!user){           // User exists
        return null
    } 

    try{                 // Find the user if he exists in db
        const loggedInUser=await db.user.findUnique({
            where:{
                clerkUserId:user.id  // comes from clerk itself
            }
        })
        if(loggedInUser){  // return user 
            return loggedInUser
        }

        const name=`${user.firstName} ${user.lastName}`; // else create a new user
        const newUser=await db.user.create({
            data:{
                clerkUserId:user.id,
                name,
                imageUrl:user.imageUrl,
                email:user.emailAddresses[0].emailAddress
            }   
        })
        return newUser

    }catch(err){
        console.log(err.message)
    }
}