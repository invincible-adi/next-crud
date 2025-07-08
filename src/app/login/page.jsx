"use client"
import React, { useEffect } from 'react'
import Login from '@/Components/Login'
import Navbaar from '@/Components/Common/Navbaar'
import { useRouter } from 'next/navigation'

const page = () => {
    const router = useRouter();
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('token');
            if (token) {
                router.replace('/view-task');
            }
        }
    }, [router]);
    return (
        <>
            <Navbaar />
            <Login />
        </>
    )
}

export default page
