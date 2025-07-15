"use client";
import React, { useEffect } from "react";
import Link from "next/link";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faList, faBox } from '@fortawesome/free-solid-svg-icons';

const Dashboard = () => {
    const { isAuthenticated, user } = useSelector((state) => state.user);
    const router = useRouter();

    useEffect(() => {
        if (!isAuthenticated) {
            router.push("/");
        }
    }, [isAuthenticated, router]);

    return (
        <div className="min-h-screen bg-gray-100 transition-colors duration-300">
            <div className="container mx-auto px-4 py-10 flex flex-col items-center">
                <div className="flex justify-between w-full max-w-2xl mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">Welcome{user?.name ? `, ${user.name}` : ''}!</h1>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-2xl">
                    <Link href="/view-task" className="block rounded-xl shadow-lg p-8 bg-white hover:shadow-2xl transition-all border border-gray-200 group">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="bg-blue-100 p-3 rounded-full">
                                <FontAwesomeIcon icon={faList} className="h-7 w-7 text-blue-600" />
                            </div>
                            <h2 className="text-xl font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">Manage Tasks</h2>
                        </div>
                        <p className="text-gray-600">View, add, edit, and delete your tasks efficiently in one place.</p>
                    </Link>
                    <Link href="/view-product" className="block rounded-xl shadow-lg p-8 bg-white hover:shadow-2xl transition-all border border-gray-200 group">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="bg-green-100 p-3 rounded-full">
                                <FontAwesomeIcon icon={faBox} className="h-7 w-7 text-green-600" />
                            </div>
                            <h2 className="text-xl font-semibold text-gray-800 group-hover:text-green-600 transition-colors">Manage Products</h2>
                        </div>
                        <p className="text-gray-600">Easily organize, add, edit, and remove your products.</p>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Dashboard; 