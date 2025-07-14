"use client";
import React from 'react';
import EditProduct from '@/Components/Product/EditProduct';
import { useParams } from 'next/navigation';

const Page = () => {
    const { id } = useParams();
    return (
        <>
            <EditProduct id={id} />
        </>
    );
};

export default Page; 