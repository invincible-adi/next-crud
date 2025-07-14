"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { logout, setUserFromStorage } from "@/store/userSlice";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTachometerAlt, faList, faBox, faSignOutAlt, faMoon, faSun } from '@fortawesome/free-solid-svg-icons';

export default function DashboardLayout({ children }) {
    const { isAuthenticated, user } = useSelector((state) => state.user);
    const router = useRouter();
    const dispatch = useDispatch();
    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        if (!isAuthenticated) {
            router.push("/");
        }
        // Set dark mode from localStorage or system preference
        const storedDark = localStorage.getItem('darkMode');
        if (storedDark !== null) {
            setDarkMode(storedDark === 'true');
        } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            setDarkMode(true);
        }
    }, [isAuthenticated, router]);

    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add("dark");
            localStorage.setItem("darkMode", "true");
        } else {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("darkMode", "false");
        }
    }, [darkMode]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        dispatch(logout());
        router.push("/");
    };

    return (
        <div className="min-h-screen flex bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
            {/* Sidebar */}
            <aside className="w-64 h-screen bg-white dark:bg-gray-800 shadow-lg flex flex-col justify-between py-8 px-4 fixed md:relative z-40">
                <div>
                    <div className="mb-10 flex items-center gap-3">
                        <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">Dashboard</span>
                    </div>
                    <nav className="flex flex-col gap-2">
                        <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-blue-100 dark:hover:bg-blue-700 transition-colors font-medium">
                            <FontAwesomeIcon icon={faTachometerAlt} className="h-5 w-5" /> Dashboard
                        </Link>
                        <Link href="/view-task" className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-blue-100 dark:hover:bg-blue-700 transition-colors font-medium">
                            <FontAwesomeIcon icon={faList} className="h-5 w-5" /> Tasks
                        </Link>
                        <Link href="/view-product" className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-blue-100 dark:hover:bg-blue-700 transition-colors font-medium">
                            <FontAwesomeIcon icon={faBox} className="h-5 w-5" /> Products
                        </Link>
                    </nav>
                </div>
                <div className="flex flex-col gap-2">
                    <button
                        aria-label="Toggle Dark Mode"
                        onClick={() => setDarkMode((prev) => !prev)}
                        className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-blue-100 dark:hover:bg-blue-700 transition-colors font-medium"
                    >
                        <FontAwesomeIcon icon={darkMode ? faSun : faMoon} className="h-5 w-5 text-yellow-500 dark:text-yellow-300" />
                        {darkMode ? "Light Mode" : "Dark Mode"}
                    </button>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-700 transition-colors font-medium"
                    >
                        <FontAwesomeIcon icon={faSignOutAlt} className="h-5 w-5" /> Logout
                    </button>
                </div>
            </aside>
            {/* Main Content */}
            <main className="flex-1 ml-0 md:ml-64 p-6 transition-all duration-300">
                {children}
            </main>
        </div>
    );
} 