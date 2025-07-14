"use client";
import React from 'react';
import EditTask from '@/Components/Task/EditTask';
import { useParams } from 'next/navigation';

const Page = () => {
    const { id } = useParams();
    return (
        <>
            <EditTask id={id} />
        </>
    );
};

export default Page; 