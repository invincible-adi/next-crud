"use client"
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
  let token;
  try {
    token = JSON.parse(localStorage.getItem('token'));
  } catch (error) {
    token = null;
  }

  useEffect(() => {
    if (!token) {
      router.push('/');
    }
  }, [token, router]);

  const dispatch = useDispatch();
  const { loading, error, message } = useSelector((state) => state.task);

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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-lg mx-auto">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="bg-blue-600 text-white px-6 py-4">
            <h4 className="text-xl font-bold flex items-center gap-2">
              <FontAwesomeIcon icon={faPlus} className="h-5 w-5" />
              Add New Task
            </h4>
          </div>
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                  <FontAwesomeIcon icon={faTag} className="h-4 w-4" />
                  Task Name
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
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
                  className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
                  id="description"
                  name="description"
                  value={task.description}
                  onChange={handleChange}
                  placeholder="Enter task description"
                  rows="4"
                />
              </div>
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                  <FontAwesomeIcon icon={faFlag} className="h-4 w-4" />
                  Status
                </label>
                <select
                  className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
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
              <div className="flex justify-end gap-2 mt-6">
                <button
                  type="button"
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded transition-colors flex items-center gap-1"
                  onClick={() => router.push('/view-task')}
                >
                  <FontAwesomeIcon icon={faTimes} className="h-4 w-4" />
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors flex items-center gap-1"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <HashLoader color="#fff" size={20} />
                      <span className="ml-2">Adding...</span>
                    </>
                  ) : (
                    <>
                      <FontAwesomeIcon icon={faSave} className="h-4 w-4" />
                      Add Task
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddTask;
