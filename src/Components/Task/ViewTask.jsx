"use client"
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClipboardList, faPlus, faExclamationCircle, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { HashLoader } from 'react-spinners';

function ViewTasks() {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    let token;
    try {
        token = JSON.parse(localStorage.getItem('token'));
    } catch (error) {
        token = null;
    }
    const router = useRouter();

    useEffect(() => {
        if (!token) {
            router.push('/');
        }
    }, [token, router]);

    const fetchTasks = async () => {
        try {
            setLoading(true);
            const res = await axios.get('/api/task', {
                headers: { "Authorization": `Bearer ${token}` }
            });
            setTasks(res.data.tasks);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    const deleteTask = async (id) => {
        if (window.confirm('Are you sure you want to delete this task?')) {
            try {
                await axios.delete('/api/task', {
                    data: { id },
                    headers: { Authorization: `Bearer ${token}` }
                });
                fetchTasks();
            } catch {
                alert('Delete failed');
            }
        }
    };

    const getStatusBadge = (status) => {
        const statusClasses = {
            'pending': 'bg-yellow-100 text-yellow-800',
            'in-progress': 'bg-blue-100 text-blue-800',
            'done': 'bg-green-100 text-green-800'
        };
        return `inline-block px-2 py-1 rounded text-xs font-semibold ${statusClasses[status] || 'bg-gray-200 text-gray-800'}`;
    };

    useEffect(() => {
        if (token) {
            fetchTasks();
        }
    }, [token]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="flex flex-col items-center">
                    <HashLoader color="#2563eb" size={70} />
                    <span className="mt-2 text-blue-600 font-medium">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 py-8">
            <div className="max-w-5xl mx-auto px-4">
                <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                    <h2 className="text-2xl font-bold flex items-center gap-2 text-blue-700">
                        <FontAwesomeIcon icon={faClipboardList} className="h-6 w-6" />
                        My Tasks
                    </h2>
                    <button
                        className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow transition-colors"
                        onClick={() => router.push('/add-task')}
                    >
                        <FontAwesomeIcon icon={faPlus} className="h-5 w-5" />
                        Add Task
                    </button>
                </div>
                {/* Desktop Table View */}
                <div className="hidden lg:block">
                    <div className="bg-white shadow rounded-lg overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {tasks.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="text-center py-8 text-gray-400">
                                            <FontAwesomeIcon icon={faExclamationCircle} className="h-8 w-8 mx-auto mb-2" />
                                            No tasks found. Create your first task!
                                        </td>
                                    </tr>
                                ) : (
                                    tasks.map(t => (
                                        <tr key={t.id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{t.id}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{t.name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-gray-500">{t.description}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={getStatusBadge(t.status)}>{t.status}</span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap flex gap-2">
                                                <button
                                                    className="flex items-center gap-1 px-3 py-1 bg-yellow-100 hover:bg-yellow-200 text-yellow-800 rounded transition-colors"
                                                    onClick={() => router.push(`/edit-task/${t.id}`)}
                                                >
                                                    <FontAwesomeIcon icon={faEdit} className="h-4 w-4" />
                                                    Edit
                                                </button>
                                                <button
                                                    className="flex items-center gap-1 px-3 py-1 bg-red-100 hover:bg-red-200 text-red-800 rounded transition-colors"
                                                    onClick={() => deleteTask(t.id)}
                                                >
                                                    <FontAwesomeIcon icon={faTrash} className="h-4 w-4" />
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
                {/* Mobile Card View */}
                <div className="lg:hidden mt-6">
                    {tasks.length === 0 ? (
                        <div className="text-center py-8 text-gray-400">
                            <FontAwesomeIcon icon={faExclamationCircle} className="h-8 w-8 mx-auto mb-2" />
                            No tasks found. Create your first task!
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {tasks.map(t => (
                                <div key={t.id} className="bg-white shadow rounded-lg p-4 flex flex-col gap-2">
                                    <div className="flex justify-between items-center">
                                        <h3 className="font-semibold text-lg text-gray-900">{t.name}</h3>
                                        <span className={getStatusBadge(t.status)}>{t.status}</span>
                                    </div>
                                    <div className="text-gray-500 text-sm mb-2">{t.description || 'No description provided'}</div>
                                    <div className="flex justify-between items-center mt-2">
                                        <span className="text-xs text-gray-400">ID: {t.id}</span>
                                        <div className="flex gap-2">
                                            <button
                                                className="flex items-center gap-1 px-3 py-1 bg-yellow-100 hover:bg-yellow-200 text-yellow-800 rounded transition-colors"
                                                onClick={() => router.push(`/edit-task/${t.id}`)}
                                            >
                                                <FontAwesomeIcon icon={faEdit} className="h-4 w-4" />
                                                Edit
                                            </button>
                                            <button
                                                className="flex items-center gap-1 px-3 py-1 bg-red-100 hover:bg-red-200 text-red-800 rounded transition-colors"
                                                onClick={() => deleteTask(t.id)}
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
