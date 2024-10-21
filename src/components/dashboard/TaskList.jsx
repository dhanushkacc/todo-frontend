import { useState, useEffect } from "react";
import axios from "axios";
import Task from "./Task";
import AddTask from "./AddTask";

const TaskList = () => {
  const [sortType, setSortType] = useState("createdAt");
  const [taskList, setTaskList] = useState([]);
  const [sortedTaskList, setSortedTaskList] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          alert("No token found. Please login again.");
          return;
        }

        const response = await axios.get("http://localhost:5000/tasks", {
          headers: {
            "x-auth-token": token,
          },
        });

        if (response.status === 200) {
          setTaskList(response.data);
        } else {
          alert("Failed to fetch tasks. Please try again.");
        }
      } catch (error) {
        console.error("Error fetching tasks:", error);
        alert("Server error. Please try again later.");
      }
    };

    fetchTasks();
  }, []);

  // Sort tasks 
  useEffect(() => {
    sortTasks(taskList);
  }, [taskList, sortType]);

  const handleSortChange = (e) => {
    setSortType(e.target.value);
  };

  const sortTasks = (tasks) => {
    let sortedTasks = [...tasks];
    switch (sortType) {
      case "createdAt":
        sortedTasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case "date":
        sortedTasks.sort((a, b) => new Date(b.dueDate) - new Date(a.dueDate));
        break;
      case "time":
        sortedTasks.sort((a, b) => {
          const dateA = new Date(a.dueDate);
          const dateB = new Date(b.dueDate);
          if (dateA.getTime() !== dateB.getTime()) {
            return dateB - dateA; // first sort with date
          }
          return (b.dueTime || "00:00").localeCompare(a.dueTime || "00:00"); // Then time
        });
        break;
      default:
        break;
    }
    setSortedTaskList(sortedTasks);
  };


  const handleTaskUpdated = (updatedTask) => {
    setTaskList((prevTaskList) =>
      prevTaskList.map((task) =>
        task._id === updatedTask._id ? updatedTask : task
      )
    );
  };


  const handleTaskDeleted = (taskId) => {
    setTaskList((prevTaskList) =>
      prevTaskList.filter((task) => task._id !== taskId)
    );
  };

  const handleTaskAdded = (newTask) => {
    setTaskList([newTask, ...taskList]);
  };


  const isDueToday = (dueDate) => {
    if (!dueDate) return false;
    const today = new Date().toISOString().substring(0, 10);
    const taskDate = new Date(dueDate).toISOString().substring(0, 10);
    return today === taskDate;
  };

  return (
    <div className="p-6 bg-green-50 rounded-lg shadow-md">
      <div className="mb-4">
        <h2 className="text-xl font-bold">Tasks</h2>
        <div className="flex justify-between items-center mt-4">
          <AddTask onTaskAdded={handleTaskAdded} />

          <div className="flex items-center">
            <label htmlFor="sort" className="mr-2 text-gray-700">
              Sort By:
            </label>
            <select
              id="sort"
              value={sortType}
              onChange={handleSortChange}
              className="border border-gray-300 rounded-md p-2"
            >
              <option value="createdAt">Latest Added</option>
              <option value="date">Date</option>
              <option value="time">Time</option>
            </select>
          </div>
        </div>
      </div>


      <ul className="mt-4">
        {sortedTaskList.map((task) => (
          <Task
            key={task._id}
            task={task}
            onTaskUpdated={handleTaskUpdated}
            onTaskDeleted={handleTaskDeleted}
            isDueToday={isDueToday(task.dueDate)}
          />
        ))}
      </ul>
    </div>
  );
};

export default TaskList;
