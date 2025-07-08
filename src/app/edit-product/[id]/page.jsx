"use client";
import React from 'react';
import EditProduct from '@/Components/Product/EditProduct';
import Navbaar from '@/Components/Common/Navbaar';
import { useParams } from 'next/navigation';

const Page = () => {
    const { id } = useParams();
    return (
        <>
            <Navbaar />
            <EditProduct id={id} />
        </>
    );
};

export default Page; 