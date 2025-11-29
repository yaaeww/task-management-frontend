import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { taskService } from "../services/taskService";
import TaskForm from "./TaskForm";
import TaskList from "./TaskList";

const Dashboard = () => {
  const { user, logout, isLoading: authLoading } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [userDropdown, setUserDropdown] = useState(false);
  const [viewMode, setViewMode] = useState("table");
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      console.log("🔄 Loading tasks from backend...");
      const response = await taskService.getAllTasks();
      console.log("✅ Tasks loaded:", response.tasks);
      setTasks(response.tasks || []);
    } catch (error) {
      console.error("❌ Error loading tasks:", error);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (taskData) => {
    try {
      console.log("📝 Creating task:", taskData);
      const response = await taskService.createTask(taskData);
      console.log("✅ Task created:", response.task);
      setTasks([response.task, ...tasks]);
      setShowForm(false);
    } catch (error) {
      console.error("❌ Error creating task:", error);
      throw error;
    }
  };

  const handleUpdateTask = async (taskId, taskData) => {
    try {
      console.log("📝 Updating task:", taskId, taskData);
      const response = await taskService.updateTask(taskId, taskData);
      console.log("✅ Task updated:", response.task);
      setTasks(
        tasks.map((task) => (task.id === taskId ? response.task : task))
      );
      setEditingTask(null);
    } catch (error) {
      console.error("❌ Error updating task:", error);
      throw error;
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm("Are you sure you want to delete this task?")) {
      return;
    }

    try {
      console.log("🗑️ Deleting task:", taskId);
      await taskService.deleteTask(taskId);
      setTasks(tasks.filter((task) => task.id !== taskId));
    } catch (error) {
      console.error("❌ Error deleting task:", error);
    }
  };

  const handleStatusChange = async (taskId, status) => {
    try {
      console.log("🔄 Updating task status:", taskId, status);
      const response = await taskService.updateTaskStatus(taskId, status);
      setTasks(
        tasks.map((task) => (task.id === taskId ? response.task : task))
      );
    } catch (error) {
      console.error("❌ Error updating task status:", error);
    }
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const handleLogout = async () => {
    if (isLoggingOut || authLoading) return;

    console.log("🔄 Starting logout process...");
    setIsLoggingOut(true);

    try {
      await logout();
      console.log("✅ Logout completed successfully");
    } catch (error) {
      console.error("❌ Logout failed:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".user-dropdown")) {
        setUserDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Hitung jumlah tasks berdasarkan status - SESUAI BACKEND
  const getTasksByStatus = (status) => {
    return tasks.filter((task) => task.status === status).length;
  };

  const totalTasks = tasks.length;
  const pendingTasks = getTasksByStatus("pending");
  const inProgressTasks = getTasksByStatus("in-progress");
  const completedTasks = getTasksByStatus("completed");

  // Debug info untuk memastikan perhitungan benar
  useEffect(() => {
    console.log("📊 Task Statistics:", {
      total: totalTasks,
      pending: pendingTasks,
      inProgress: inProgressTasks,
      completed: completedTasks,
      allTasks: tasks,
    });
  }, [tasks, totalTasks, pendingTasks, inProgressTasks, completedTasks]);

  // Show loading while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="loading-spinner"></div>
        <span className="ml-3 text-text-primary">Loading...</span>
      </div>
    );
  }

  // Show loading while fetching tasks
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="loading-spinner"></div>
        <span className="ml-3 text-text-primary">Loading tasks...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-container">
          <div className="header-content">
            {/* App Title and User Dropdown Side by Side */}
            <div className="header-main">
              <div className="app-title-section">
                <div className="app-logo">
                  <span className="text-white font-bold text-sm">T</span>
                </div>
                <h1 className="app-title">
                  Task<span className="text-gradient">Manager</span>
                </h1>
              </div>

              {/* User Dropdown */}
              <div className="relative user-dropdown">
                <button
                  onClick={() => setUserDropdown(!userDropdown)}
                  className="user-dropdown-trigger"
                  disabled={isLoggingOut}
                >
                  <div className="user-avatar">
                    <span className="text-white text-sm font-medium">
                      {user?.name?.charAt(0)?.toUpperCase()}
                    </span>
                  </div>
                  <div className="user-info">
                    <p className="user-name">{user?.name}</p>
                    <p className="user-email">{user?.email}</p>
                  </div>
                  <svg
                    className={`dropdown-chevron ${
                      userDropdown ? "rotate-180" : ""
                    } ${isLoggingOut ? "opacity-50" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {userDropdown && (
                  <div className="user-dropdown-menu">
                    <div className="user-dropdown-header">
                      <p className="signed-in-as">Signed in as</p>
                      <p className="user-email-dropdown">{user?.email}</p>
                    </div>

                    <div className="dropdown-items">
                      <button
                        onClick={handleLogout}
                        className="logout-btn"
                        disabled={isLoggingOut}
                      >
                        {isLoggingOut ? (
                          <div className="flex items-center justify-center">
                            <div className="loading-spinner-sm mr-3"></div>
                            <span>Signing out...</span>
                          </div>
                        ) : (
                          <>
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                              />
                            </svg>
                            <span>Sign out</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* View Mode Toggle */}
            <div className="header-actions">
              <div className="view-toggle">
                <button
                  onClick={() => setViewMode("table")}
                  className={`view-toggle-btn ${
                    viewMode === "table" ? "active" : ""
                  }`}
                >
                  Table
                </button>
                <button
                  onClick={() => setViewMode("card")}
                  className={`view-toggle-btn ${
                    viewMode === "card" ? "active" : ""
                  }`}
                >
                  Cards
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="dashboard-main flex-1">
        <div className="container">
          {/* Stats Overview - SESUAI BACKEND */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon stat-icon-total">
                <svg
                  className="w-4 h-4 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <div className="stat-number">{totalTasks}</div>
              <div className="stat-label">Total Tasks</div>
            </div>

            <div className="stat-card">
              <div className="stat-icon stat-icon-todo">
                <svg
                  className="w-4 h-4 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="stat-number">{pendingTasks}</div>
              <div className="stat-label">Pending</div>
            </div>

            <div className="stat-card">
              <div className="stat-icon stat-icon-progress">
                <svg
                  className="w-4 h-4 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <div className="stat-number">{inProgressTasks}</div>
              <div className="stat-label">In Progress</div>
            </div>

            <div className="stat-card">
              <div className="stat-icon stat-icon-completed">
                <svg
                  className="w-4 h-4 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="stat-number">{completedTasks}</div>
              <div className="stat-label">Completed</div>
            </div>
          </div>

          {/* Header with Actions */}
          <div className="content-header">
            <div className="content-title">
              <h2>Task Management</h2>
              <p>Manage your tasks and track progress efficiently</p>
            </div>
            <div className="content-actions">
              <button
                onClick={() => {
                  setEditingTask(null);
                  setShowForm(true);
                }}
                className="btn btn-primary"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                <span>New Task</span>
              </button>
            </div>
          </div>

          {/* Task Form */}
          {showForm && (
            <div className="fade-in">
              <TaskForm
                task={editingTask}
                onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
                onCancel={() => {
                  setShowForm(false);
                  setEditingTask(null);
                }}
              />
            </div>
          )}

          {/* Task Content */}
          {tasks.length > 0 ? (
            viewMode === "table" ? (
              // Table View
              <div className="card">
                <div className="card-body p-0">
                  <div className="table-container">
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Task</th>
                          <th>Status</th>
                          <th className="hidden md:table-cell">Deadline</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {tasks.map((task) => (
                          <tr key={task.id}>
                            <td>
                              <div>
                                <div className="font-medium text-text-primary text-sm sm:text-base">
                                  {task.title}
                                </div>
                                {task.description && (
                                  <div className="text-xs sm:text-sm text-text-secondary mt-1 line-clamp-2">
                                    {task.description}
                                  </div>
                                )}
                              </div>
                            </td>
                            <td>
                              <span
                                className={`badge ${
                                  task.status === "completed"
                                    ? "badge-completed"
                                    : task.status === "in-progress"
                                    ? "badge-in-progress"
                                    : "badge-todo"
                                }`}
                              >
                                {task.status === "completed"
                                  ? "Completed"
                                  : task.status === "in-progress"
                                  ? "In Progress"
                                  : "Pending"}
                              </span>
                            </td>
                            <td className="hidden md:table-cell">
                              <span className="text-xs sm:text-sm text-text-secondary">
                                {task.deadline
                                  ? new Date(task.deadline).toLocaleDateString()
                                  : "No deadline"}
                              </span>
                            </td>
                            <td>
                              <div className="task-actions">
                                <button
                                  onClick={() => handleEditTask(task)}
                                  className="task-action-btn"
                                  title="Edit task"
                                >
                                  <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                    />
                                  </svg>
                                </button>
                                <button
                                  onClick={() => handleDeleteTask(task.id)}
                                  className="task-action-btn task-action-btn-danger"
                                  title="Delete task"
                                >
                                  <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                    />
                                  </svg>
                                </button>
                                <select
                                  value={task.status}
                                  onChange={(e) =>
                                    handleStatusChange(task.id, e.target.value)
                                  }
                                  className="status-select"
                                >
                                  <option value="pending">Pending</option>
                                  <option value="in-progress">
                                    In Progress
                                  </option>
                                  <option value="completed">Completed</option>
                                </select>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            ) : (
              // Card View
              <TaskList
                tasks={tasks}
                onEdit={handleEditTask}
                onDelete={handleDeleteTask}
                onStatusChange={handleStatusChange}
              />
            )
          ) : (
            // Empty State
            <div className="card">
              <div className="empty-state">
                <div className="empty-state-icon">📋</div>
                <h3 className="empty-state-title">No tasks yet</h3>
                <p className="empty-state-description">
                  Get started by creating your first task to organize your work
                </p>
                <button
                  onClick={() => setShowForm(true)}
                  className="btn btn-primary"
                >
                  Create Task
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="dashboard-footer">
        <div className="footer-container">
          <div className="footer-content">
            <div className="footer-left">
              <div className="footer-brand">
                <div className="app-logo-small">
                  <span className="text-white font-bold text-xs">T</span>
                </div>
                <span className="footer-app-name">
                  Task<span className="text-gradient">Manager</span>
                </span>
              </div>
              <p className="footer-tagline">
                Manage your tasks efficiently and boost productivity
              </p>
            </div>
            
            <div className="footer-right">
              <div className="footer-stats">
                <div className="footer-stat">
                  <span className="footer-stat-number">{totalTasks}</span>
                  <span className="footer-stat-label">Total Tasks</span>
                </div>
                <div className="footer-stat">
                  <span className="footer-stat-number">{completedTasks}</span>
                  <span className="footer-stat-label">Completed</span>
                </div>
              </div>
              
              <div className="footer-links">
                <span className="footer-copyright">
                  © {new Date().getFullYear()} TaskManager. All rights reserved.
                </span>
                <div className="footer-tech">
                  <span className="tech-badge">React</span>
                  <span className="tech-badge">Laravel</span>
                  <span className="tech-badge">Tailwind</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;