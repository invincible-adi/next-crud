"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTag, faFileAlt, faFlag, faTimes, faSave } from '@fortawesome/free-solid-svg-icons';
import { HashLoader } from 'react-spinners';
import { useDispatch, useSelector } from 'react-redux';
import { addTask } from '../../store/taskSlice';

function AddTask() {
  const [task, setTask] = useState({ name: '', description: '', status: 'pending' });
  const router = useRouter();
  const dispatch = useDispatch();
  const { loading, error, message } = useSelector((state) => state.task);
  const { token, isAuthenticated } = useSelector((state) => state.user);

  useEffect(() => {
    if (!isAuthenticated || !token) {
      router.push('/');
    }
  }, [isAuthenticated, token, router]);

  const handleChange = e => setTask({ ...task, [e.target.name]: e.target.value });

  const handleAddTask = async (task) => {
    await dispatch(addTask({ task, token }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    await handleAddTask(task);
    if (!error) {
      router.push('/view-task');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex items-center justify-center h-96">
          <div className="flex flex-col items-center">
            <HashLoader color="#2563eb" size={70} />
            <span className="mt-4 text-gray-600 font-medium">Adding your task...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-10">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="flex items-center gap-3 mb-6">
            <FontAwesomeIcon icon={faPlus} className="h-6 w-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900">Add New Task</h2>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                <FontAwesomeIcon icon={faTag} className="h-4 w-4" />
                Task Name
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 text-black bg-gray-50"
                id="name"
                name="name"
                value={task.name}
                onChange={handleChange}
                placeholder="Enter task name"
                required
              />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                <FontAwesomeIcon icon={faFileAlt} className="h-4 w-4" />
                Description
              </label>
              <textarea
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 text-black bg-gray-50"
                id="description"
                name="description"
                value={task.description}
                onChange={handleChange}
                placeholder="Enter task description"
              />
            </div>
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                <FontAwesomeIcon icon={faFlag} className="h-4 w-4" />
                Status
              </label>
              <select
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 text-black bg-gray-50"
                id="status"
                name="status"
                value={task.status}
                onChange={handleChange}
              >
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                className="flex items-center gap-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors"
                onClick={() => router.push('/view-task')}
              >
                <FontAwesomeIcon icon={faTimes} className="h-4 w-4" />
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <FontAwesomeIcon icon={faSave} className="h-4 w-4" />
                Save Task
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddTask;
