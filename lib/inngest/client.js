import { Inngest } from "inngest";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "Monex",name:"Monex",
    retryFunction:async(attempt)=>({ // If everything fails try again once
        delay:Math.pow(2,attempt)*1000,
        maxAttempts:2
    })
});