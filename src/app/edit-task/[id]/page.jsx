"use client";
import React from 'react';
import EditTask from '@/Components/Task/EditTask';
import Navbaar from '@/Components/Common/Navbaar';
import { useParams } from 'next/navigation';

const Page = () => {
    const { id } = useParams();
    return (
        <>
            <Navbaar />
            <EditTask id={id} />
        </>
    );
};

export default Page; 