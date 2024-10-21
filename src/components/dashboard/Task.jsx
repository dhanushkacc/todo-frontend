import { useState } from "react";
import axios from "axios";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
const token = localStorage.getItem("token");

const Task = ({ task, onTaskUpdated, onTaskDeleted, isDueToday }) => {
  const [showModal, setShowModal] = useState(false);
  const [updatedTask, setUpdatedTask] = useState({
    title: task.title,
    description: task.description,
    dueDate: new Date(task.dueDate).toISOString().substring(0, 10),
    dueTime: task.dueTime
  });

  const handleCheckboxChange = async () => {
    try {
      const response = await axios.put(
        `http://localhost:5000/tasks/complete/${task._id}`,
        {
          isCompleted: !task.isCompleted,
        },
        {
          headers: {
            "x-auth-token": token,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        const updatedTask = { ...task, isCompleted: !task.isCompleted };
        onTaskUpdated(updatedTask);
      } else {
        alert("Failed to update task. Please try again.");
      }
    } catch (error) {
      console.error("Error updating task:", error);
      alert("Server error. Please try again later.");
    }
  };

  const handleDelete = async () => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this task?"
    );
    if (!isConfirmed) {
      return;
    }

    try {
      if (!token) {
        alert("No token found. Please login again.");
        return;
      }

      const response = await axios.delete(
        "http://localhost:5000/tasks/delete",
        {
          headers: {
            "x-auth-token": token,
            "Content-Type": "application/json",
          },
          data: {
            taskId: task._id,
          },
        }
      );

      if (response.status === 200) {
        onTaskDeleted(task._id);
      } else {
        alert("Failed to delete task. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting task:", error);
      alert("Server error. Please try again later.");
    }
  };

  const handleUpdateClick = () => {
    setShowModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedTask({ ...updatedTask, [name]: value });
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.put(
        `http://localhost:5000/tasks/update/${task._id}`,
        updatedTask,
        {
          headers: {
            "x-auth-token": token,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200) {
        onTaskUpdated(response.data.task);
        setShowModal(false);
      } else {
        alert("Failed to update task. Please try again.");
      }
    } catch (error) {
      console.error("Error updating task:", error);
      alert("Server error. Please try again later.");
    }
  };

  return (
    <div
      className={`flex justify-between items-center p-4 border rounded-md mb-4 shadow-md ${
        isDueToday ? "bg-yellow-100" : "bg-white"
      } ${task.isCompleted ? "bg-gray-200 opacity-50" : ""}`}
    >
     
      <input
        type="checkbox"
        checked={task.isCompleted}
        onChange={handleCheckboxChange}
        className="w-6 h-6"
      />


      <div className="flex-1 mx-4">
        <h3
          className={`text-lg font-semibold ${
            task.isCompleted ? "line-through text-gray-500" : ""
          }`}
        >
          {task.title}
        </h3>
        <p
          className={`text-gray-500 ${
            task.isCompleted ? "line-through" : ""
          }`}
        >
          Date: {new Date(task.dueDate).toLocaleDateString()}
        </p>
        {task.dueTime ? (
          <p
            className={`text-gray-500 ${
              task.isCompleted ? "line-through" : ""
            }`}
          >
            Time: {task.dueTime}
          </p>
        ) : (
          <p
            className={`text-gray-500 ${
              task.isCompleted ? "line-through" : ""
            }`}
          >
            Time: Not Set
          </p>
        )}
        <p
          className={`text-gray-700 ${
            task.isCompleted ? "line-through text-gray-500" : ""
          }`}
        >
          Description: {task.description}
        </p>
      </div>

  
      <div className="flex space-x-2">
        <button
          onClick={handleUpdateClick}
          className="text-green-500 hover:text-green-700"
        >
          <FaEdit size={20} />
        </button>
        <button
          onClick={handleDelete}
          className="text-red-400 hover:text-red-600"
        >
          <FaTrashAlt size={20} />
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-10">
          <div className="bg-gray-400 p-6 rounded-lg shadow-md w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Update Task</h2>
            <form onSubmit={handleUpdateSubmit}>
              <div className="mb-4">
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700"
                >
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={updatedTask.title}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700"
                >
                  Description
                </label>
                <textarea
                  name="description"
                  value={updatedTask.description}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="dueDate"
                  className="block text-sm font-medium text-gray-700"
                >
                  Date
                </label>
                <input
                  type="date"
                  name="dueDate"
                  value={updatedTask.dueDate}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="dueTime"
                  className="block text-sm font-medium text-gray-700"
                >
                  Time
                </label>
                <input
                  type="time"
                  name="dueTime"
                  value={updatedTask.dueTime}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded-md"
                >
                  Update Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Task;
