"use client" // To denote it as a client component

import React from 'react'
import { Button } from './ui/button'
import Link from "next/link"
import Image from 'next/image'
import { useRef,useEffect } from 'react'

const Hero = () => {
    const imgRef=useRef();
    
    useEffect(()=>{
        const imgElement=imgRef.current
       
        function handleScroll(){
            const scrollPosition=window.scrollY // current scroll pos
            const threshold=100                 // image is placed after 100 , so if the cursor passes 100 tilt the image
            if (scrollPosition>threshold){
                imgElement.classList.add("scrolled")
            }else{
                imgElement.classList.remove("scrolled")
            }
        }
        window.addEventListener("scroll",handleScroll)
        return ()=>{
            window.removeEventListener("scroll",handleScroll)
        }
    },[])

    return (
    <div className='pb-20 px-4 '>
        <div className='container mx-auto text-center '>
                <h1 className='text-4xl md:text-[50px] lg:text-[70px] pb-6 gradient-title'>Manage Your Finances with Mone<span className="text-gray-800">x</span></h1><br/>
            <p className='text-xl text-gray-600 mb-8 max-w-2xl mx-auto'>An AI-Powered financial management platform that helps you track , 
                analyze and optimize your spending with real-time insights</p>
            <Link href={"/dashboard"} className='flex justify-center'>
                <Button>Get Started</Button>
            </Link>
        </div>
       
        <div className='hero-img-wrapper'>
            <div ref={imgRef} className='hero-img '>
                <Image src="/banner.png" width={1280} height={720} alt="Dashboard Preview" 
                    className='rounded-lg shadow-2xl border mx-auto  w-auto object-contain' priority/>
            </div>
        </div>
    </div>
    )
}

export default Hero

// lg:text-[150px] [] are used to set custom values