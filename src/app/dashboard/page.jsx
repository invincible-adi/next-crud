"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faList, faBox, faMoon, faSun } from '@fortawesome/free-solid-svg-icons';
import Navbaar from '@/Components/Common/Navbaar';

const Dashboard = () => {
    const { isAuthenticated, user } = useSelector((state) => state.user);
    const router = useRouter();
    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        if (!isAuthenticated) {
            router.push("/");
        }
    }, [isAuthenticated, router]);

    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    }, [darkMode]);

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
            <Navbaar />
            <div className="container mx-auto px-4 py-10 flex flex-col items-center">
                <div className="flex justify-between w-full max-w-2xl mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Welcome{user?.name ? `, ${user.name}` : ''}!</h1>
                    <button
                        aria-label="Toggle Dark Mode"
                        onClick={() => setDarkMode((prev) => !prev)}
                        className="ml-4 p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                    >
                        <FontAwesomeIcon icon={darkMode ? faSun : faMoon} className="h-5 w-5 text-yellow-500 dark:text-yellow-300" />
                    </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-2xl">
                    <Link href="/view-task" className="block rounded-xl shadow-lg p-8 bg-white dark:bg-gray-800 hover:shadow-2xl transition-all border border-gray-200 dark:border-gray-700 group">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full">
                                <FontAwesomeIcon icon={faList} className="h-7 w-7 text-blue-600 dark:text-blue-300" />
                            </div>
                            <h2 className="text-xl font-semibold text-gray-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-colors">Manage Tasks</h2>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300">View, add, edit, and delete your tasks efficiently in one place.</p>
                    </Link>
                    <Link href="/view-product" className="block rounded-xl shadow-lg p-8 bg-white dark:bg-gray-800 hover:shadow-2xl transition-all border border-gray-200 dark:border-gray-700 group">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="bg-green-100 dark:bg-green-900 p-3 rounded-full">
                                <FontAwesomeIcon icon={faBox} className="h-7 w-7 text-green-600 dark:text-green-300" />
                            </div>
                            <h2 className="text-xl font-semibold text-gray-800 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-300 transition-colors">Manage Products</h2>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300">Easily organize, add, edit, and remove your products.</p>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Dashboard; 