"use client"
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClipboardList, faPlus, faExclamationCircle, faEdit, faTrash, faCheckCircle, faClock, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { HashLoader } from 'react-spinners';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTasks, deleteTask } from '../../store/taskSlice';

function ViewTasks() {
    const router = useRouter();
    const dispatch = useDispatch();
    const { tasks, loading, error } = useSelector((state) => state.task);
    const { token, isAuthenticated, user } = useSelector((state) => state.user);

    useEffect(() => {
        if (!isAuthenticated || !token) {
            router.push('/');
        }
    }, [isAuthenticated, token, router]);

    useEffect(() => {
        if (token) {
            dispatch(fetchTasks(token));
        }
    }, [dispatch, token]);

    const handleDelete = (id) => {
        dispatch(deleteTask({ id, token }));
    };

    const getStatusBadge = (status) => {
        const statusClasses = {
            'pending': 'bg-yellow-100 text-yellow-800 border-yellow-200',
            'in-progress': 'bg-blue-100 text-blue-800 border-blue-200',
            'done': 'bg-green-100 text-green-800 border-green-200'
        };
        return `inline-block px-3 py-1 rounded-full text-xs font-semibold border ${statusClasses[status] || 'bg-gray-100 text-gray-800 border-gray-200'}`;
    };

    const getStatusIcon = (status) => {
        const icons = {
            'pending': faClock,
            'in-progress': faSpinner,
            'done': faCheckCircle
        };
        return icons[status] || faClock;
    };

    // Calculate statistics
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.status === 'done').length;
    const pendingTasks = tasks.filter(task => task.status === 'pending').length;
    const inProgressTasks = tasks.filter(task => task.status === 'in-progress').length;

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="flex items-center justify-center h-96">
                    <div className="flex flex-col items-center">
                        <HashLoader color="#2563eb" size={70} />
                        <span className="mt-4 text-gray-600 font-medium">Loading your tasks...</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header Section */}
                <div className="mb-8">
                    <div className="flex flex-col sm:flex-row justify-between  sm:items-center gap-4">
                        <div className='text-center'>
                            <h1 className="text-3xl font-bold  text-gray-900">Task Dashboard</h1>
                            <p className="text-gray-600 mt-1">Welcome back, {user?.name || 'User'}! Here's your task overview.</p>
                        </div>
                        <button
                            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105"
                            onClick={() => router.push('/add-task')}
                        >
                            <FontAwesomeIcon icon={faPlus} className="h-5 w-5" />
                            Add New Task
                        </button>
                    </div>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Tasks</p>
                                <p className="text-3xl font-bold text-gray-900">{totalTasks}</p>
                            </div>
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                <FontAwesomeIcon icon={faClipboardList} className="h-6 w-6 text-blue-600" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Completed</p>
                                <p className="text-3xl font-bold text-green-600">{completedTasks}</p>
                            </div>
                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                <FontAwesomeIcon icon={faCheckCircle} className="h-6 w-6 text-green-600" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Pending</p>
                                <p className="text-3xl font-bold text-yellow-600">{pendingTasks}</p>
                            </div>
                            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                                <FontAwesomeIcon icon={faClock} className="h-6 w-6 text-yellow-600" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">In Progress</p>
                                <p className="text-3xl font-bold text-blue-400">{inProgressTasks}</p>
                            </div>
                            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                                <FontAwesomeIcon icon={faSpinner} className="h-6 w-6 text-blue-400" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Task List */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-900">Your Tasks</h2>
                    </div>

                    {tasks.length === 0 ? (
                        <div className="text-center py-12">
                            <FontAwesomeIcon icon={faExclamationCircle} className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks yet</h3>
                            <p className="text-gray-500 mb-6">Get started by creating your first task!</p>
                            <button
                                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
                                onClick={() => router.push('/add-task')}
                            >
                                <FontAwesomeIcon icon={faPlus} className="h-4 w-4 mr-2" />
                                Create First Task
                            </button>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-200">
                            {tasks.map((task, idx) => (
                                <div key={task._id || task.id || idx} className="p-6 hover:bg-gray-50 transition-colors">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="text-lg font-semibold text-gray-900">{task.name}</h3>
                                                <span className={getStatusBadge(task.status)}>
                                                    <FontAwesomeIcon icon={getStatusIcon(task.status)} className="h-3 w-3 mr-1" />
                                                    {task.status}
                                                </span>
                                            </div>
                                            <p className="text-gray-600 mb-3">{task.description || 'No description provided'}</p>
                                            <div className="flex items-center gap-4 text-sm text-gray-500">
                                                <span>ID: {task.id}</span>
                                                <span>•</span>
                                                <span>Created by: {user?.email || 'Unknown'}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 ml-4">
                                            <button
                                                className="flex items-center gap-2 px-4 py-2 bg-yellow-100 hover:bg-yellow-200 text-yellow-800 rounded-lg transition-colors"
                                                onClick={() => router.push(`/edit-task/${task.id}`)}
                                            >
                                                <FontAwesomeIcon icon={faEdit} className="h-4 w-4" />
                                                Edit
                                            </button>
                                            <button
                                                className="flex items-center gap-2 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-800 rounded-lg transition-colors"
                                                onClick={() => handleDelete(task.id)}
                                            >
                                                <FontAwesomeIcon icon={faTrash} className="h-4 w-4" />
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ViewTasks;
