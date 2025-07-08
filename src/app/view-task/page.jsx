"use client"
import React from 'react'
import ViewTasks from '@/Components/Task/ViewTask'
import Navbaar from '@/Components/Common/Navbaar'

const page = () => {
    return (
        <>
            <Navbaar />
            <ViewTasks/>
        </>
    )
}

export default page
