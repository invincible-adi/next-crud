"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTasks, faBox, faSignOutAlt, faUser, faBars, faTimes
} from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from "react-redux";
import { logout } from '../../store/userSlice';

const navLinks = [
  { name: "Tasks", href: "/view-task", icon: faTasks },
  { name: "Products", href: "/view-product", icon: faBox },
];

const Sidebar = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const [open, setOpen] = useState(false);

  if (!isAuthenticated) return null;

  return (
    <>
      {/* Sidebar overlay for mobile */}
      {open && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}
      {/* Sidebar */}
      <aside
        className={`fixed z-50 md:static left-0 top-0 h-screen min-h-screen w-64 bg-white shadow-md border-r border-gray-100 flex flex-col transition-transform duration-300 ${open ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
      >
        {/* Header/Profile */}
        <div className="flex flex-col items-center py-8 px-4 border-b border-gray-100">
          <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center mb-3 overflow-hidden shadow">
            <FontAwesomeIcon icon={faUser} className="h-10 w-10 text-blue-400" />
          </div>
          <div className="text-lg font-semibold text-gray-800">{user?.name || 'User'}</div>
          <div className="text-sm text-gray-500">{user?.email || 'user@example.com'}</div>
        </div>
        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-700 font-medium transition-colors"
              onClick={() => setOpen(false)}
            >
              <FontAwesomeIcon icon={link.icon} className="h-5 w-5 text-blue-400" />
              {link.name}
            </Link>
          ))}
        </nav>
        {/* Logout */}
        <div className="mt-auto px-4 pb-6">
          <button
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 font-medium transition-colors"
            onClick={() => {
              dispatch(logout());
              setOpen(false);
              router.push('/');
            }}
          >
            <FontAwesomeIcon icon={faSignOutAlt} className="h-5 w-5" />
            Logout
          </button>
        </div>
        {/* Sidebar close button (mobile) */}
        <button
          className="absolute top-4 right-4 md:hidden text-gray-400 hover:text-gray-700"
          onClick={() => setOpen(false)}
        >
          <FontAwesomeIcon icon={faTimes} className="h-6 w-6" />
        </button>
      </aside>
      {/* Sidebar open button (hamburger) */}
      <button
        className="fixed top-4 left-4 z-50 md:hidden bg-white border border-gray-200 rounded-full p-2 shadow-md hover:bg-blue-50 transition-colors"
        onClick={() => setOpen(true)}
      >
        <FontAwesomeIcon icon={faBars} className="h-6 w-6 text-blue-700" />
      </button>
    </>
  );
};

export default Sidebar; 