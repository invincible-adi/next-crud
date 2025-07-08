"use client"
import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTag, faFileAlt, faFlag, faTimes, faSave } from '@fortawesome/free-solid-svg-icons';
import { HashLoader } from 'react-spinners';

function EditTask({ id }) {
  const [task, setTask] = useState({ name: '', description: '', status: 'pending' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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

  useEffect(() => {
    if (token && id) {
      setLoading(true);
      axios.get(`/api/task?id=${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      }).then(res => {
        if (res.data && res.data.task) {
          setTask(res.data.task);
        }
        setLoading(false);
      }).catch(() => {
        setLoading(false);
      });
    }
  }, [id, token]);

  const handleChange = e => setTask({ ...task, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setSaving(true);
    try {
      await axios.put('/api/task', { id, ...task }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      router.push('/view-task');
    } catch (err) {
      alert('Update failed');
    } finally {
      setSaving(false);
    }
  };

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
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-lg mx-auto">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="bg-blue-600 text-white px-6 py-4">
            <h4 className="text-xl font-bold flex items-center gap-2">
              <FontAwesomeIcon icon={faEdit} className="h-5 w-5" />
              Edit Task
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
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <HashLoader color="#fff" size={20} />
                      <span className="ml-2">Updating...</span>
                    </>
                  ) : (
                    <>
                      <FontAwesomeIcon icon={faSave} className="h-4 w-4" />
                      Update Task
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

export default EditTask;
