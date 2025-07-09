"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTasks, faBars, faList, faBox, faSignOutAlt, faUser, faCaretDown } from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import { logout, setUserFromStorage } from '../../store/userSlice';

const Navbaar = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    const { isAuthenticated, user } = useSelector((state) => state.user);
    const [menuOpen, setMenuOpen] = useState(false);
    const [userDropdownOpen, setUserDropdownOpen] = useState(false);

    useEffect(() => {
        // Check for existing token in localStorage on component mount
        const token = localStorage.getItem('token');

        if (token) {
            try {
                const parsedToken = JSON.parse(token);
                // Set user from storage with token only
                dispatch(setUserFromStorage({ user: null, token: parsedToken }));
            } catch (error) {
                console.error('Error parsing stored token:', error);
                localStorage.removeItem('token');
            }
        }
    }, [dispatch]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        dispatch(logout());
        setUserDropdownOpen(false);
        router.push('/');
    };

    const toggleUserDropdown = () => {
        setUserDropdownOpen(!userDropdownOpen);
    };

    return (
        <nav className="bg-blue-600 shadow-sm">
            <div className="container mx-auto px-4 flex flex-wrap items-center justify-between py-3">
                <Link href={isAuthenticated ? "/view-task" : "/"} className="flex items-center text-white font-bold text-xl gap-2">
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
                    {isAuthenticated && (
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
                    )}
                    {isAuthenticated && (
                        <div className="relative mt-4 md:mt-0 md:ml-6">
                            <button
                                className="flex items-center text-white hover:text-blue-200 focus:outline-none"
                                onClick={toggleUserDropdown}
                            >
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 bg-blue-700 rounded-full flex items-center justify-center">
                                        <FontAwesomeIcon icon={faUser} className="h-4 w-4" />
                                    </div>
                                    <span className="hidden md:block text-sm font-medium">
                                        {user?.email || 'User'}
                                    </span>
                                    <FontAwesomeIcon icon={faCaretDown} className="h-3 w-3" />
                                </div>
                            </button>

                            {userDropdownOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                                    <div className="px-4 py-2 text-sm text-gray-700 border-b">
                                        <div className="font-medium">{user?.email || 'User'}</div>
                                        <div className="text-gray-500">Signed in</div>
                                    </div>
                                    <button
                                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                                        onClick={handleLogout}
                                    >
                                        <FontAwesomeIcon icon={faSignOutAlt} className="h-4 w-4" />
                                        Sign out
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Overlay to close dropdown when clicking outside */}
            {userDropdownOpen && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => setUserDropdownOpen(false)}
                />
            )}
        </nav>
    );
};

export default Navbaar;
