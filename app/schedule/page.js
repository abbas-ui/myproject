"use client";

import { useState } from 'react';
import Link from 'next/link';

export default function SchedulePage() {
  // State to hold the list of tasks
  const [tasks, setTasks] = useState([
    { id: 1, task: 'Walk Buddy', date: '2025-04-10', time: '9:00 AM' },
    { id: 2, task: 'Feed Whiskers', date: '2025-04-10', time: '12:00 PM' },
  ]);

  // State to handle form input for new tasks
  const [newTask, setNewTask] = useState({
    task: '',
    date: '',
    time: '',
  });

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewTask((prevTask) => ({
      ...prevTask,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (newTask.task && newTask.date && newTask.time) {
      setTasks((prevTasks) => [...prevTasks, { ...newTask, id: Date.now() }]);
      setNewTask({ task: '', date: '', time: '' });
    }
  };

  // Handle task removal
  const handleRemoveTask = (id) => {
    setTasks((prevTasks) => prevTasks.filter(task => task.id !== id));
  };

  return (
    <div className="text-center">
      {/* Back button added here */}
      <div className="text-left mb-4">
        <Link href="/" className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          ← Back to Home
        </Link>
      </div>

      <h2 className="text-4xl font-bold mb-4 text-blue-700">Schedule 🗓️</h2>

      {/* Form to add a new schedule task */}
      <form onSubmit={handleSubmit} className="mb-8">
        <input
          type="text"
          name="task"
          value={newTask.task}
          onChange={handleChange}
          placeholder="Task (e.g., Walk Buddy)"
          className="px-4 py-2 mr-2 border rounded-lg"
        />
        <input
          type="date"
          name="date"
          value={newTask.date}
          onChange={handleChange}
          className="px-4 py-2 mr-2 border rounded-lg"
        />
        <input
          type="time"
          name="time"
          value={newTask.time}
          onChange={handleChange}
          className="px-4 py-2 mr-2 border rounded-lg"
        />
        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Add Task
        </button>
      </form>

      {/* Display the scheduled tasks */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {tasks.map((task) => (
          <div key={task.id} className="bg-white shadow-lg rounded-lg p-4 relative">
            <button
              onClick={() => handleRemoveTask(task.id)}
              className="absolute top-2 right-2 text-red-500 hover:text-red-700"
              aria-label="Remove task"
            >
              ×
            </button>
            <h3 className="text-xl font-semibold text-gray-800">{task.task}</h3>
            <p className="text-gray-600">Date: {task.date}</p>
            <p className="text-gray-600">Time: {task.time}</p>
          </div>
        ))}
      </div>
    </div>
  );
}