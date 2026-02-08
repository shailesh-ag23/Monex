import arcjet, { tokenBucket } from "@arcjet/next";

const aj=arcjet({
    key: process.env.ARCJET_KEY,
    characteristics:["userId"],
    rules:[
        tokenBucket({   // For every hour , ten transactions for a particular user
            mode:'LIVE',
            refillRate:10,
            interval:3600,
            capacity:10
        })
    ]
})

export default aj;