"use client"
import React, { useEffect } from 'react'
import Login from '@/Components/Login'
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
            <Login />
        </>
    )
}

export default page
