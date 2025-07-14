"use client"
import React, { useEffect } from 'react'
import Register from '@/Components/Register'
import Navbaar from '@/Components/Common/Navbaar'
import { useRouter } from 'next/navigation'

const page = () => {
    const router = useRouter();
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('token');
            if (token) {
                router.replace('/dashboard');
            }
        }
    }, [router]);
    return (
        <>
            <Navbaar />
            <Register />
        </>
    )
}

export default page
