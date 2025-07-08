"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTasks, faBars, faList, faBox, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

const Navbaar = () => {
    const router = useRouter();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        setIsLoggedIn(!!token);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        router.push('/');
    };

    return (
        <nav className="bg-blue-600 shadow-sm">
            <div className="container mx-auto px-4 flex flex-wrap items-center justify-between py-3">
                <Link href={isLoggedIn ? "/view-task" : "/"} className="flex items-center text-white font-bold text-xl gap-2">
                    <FontAwesomeIcon icon={faTasks} className="h-6 w-6" />
                    Product Manager
                </Link>
                <button
                    className="text-white md:hidden focus:outline-none"
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-label="Toggle navigation"
                >
                    <FontAwesomeIcon icon={faBars} className="h-6 w-6" />
                </button>
                <div className={`w-full md:flex md:items-center md:w-auto ${menuOpen ? 'block' : 'hidden'}`}>
                    <ul className="flex flex-col md:flex-row md:space-x-6 mt-4 md:mt-0 md:ml-6">
                        <li>
                            <Link href="/view-task" className="flex items-center text-white hover:text-blue-200 py-2 md:py-0">
                                <FontAwesomeIcon icon={faList} className="h-5 w-5 mr-1" />
                                Tasks
                            </Link>
                        </li>
                        <li>
                            <Link href="/view-product" className="flex items-center text-white hover:text-blue-200 py-2 md:py-0">
                                <FontAwesomeIcon icon={faBox} className="h-5 w-5 mr-1" />
                                Products
                            </Link>
                        </li>
                    </ul>
                    {isLoggedIn && (
                        <div className="flex mt-4 md:mt-0 md:ml-6">
                            <button
                                className="flex items-center bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded transition-colors"
                                onClick={handleLogout}
                            >
                                <FontAwesomeIcon icon={faSignOutAlt} className="h-5 w-5 mr-1" />
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbaar;
