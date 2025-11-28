import { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import { taskService } from '../services/taskService'
import TaskList from './TaskList'
import TaskForm from './TaskForm'

const Dashboard = () => {
  const { user, logout } = useAuth()
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingTask, setEditingTask] = useState(null)

  useEffect(() => {
    loadTasks()
  }, [])

  const loadTasks = async () => {
    try {
      const response = await taskService.getAllTasks()
      setTasks(response.tasks)
    } catch (error) {
      console.error('Error loading tasks:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateTask = async (taskData) => {
    try {
      const response = await taskService.createTask(taskData)
      setTasks([response.task, ...tasks])
      setShowForm(false)
    } catch (error) {
      console.error('Error creating task:', error)
      throw error
    }
  }

  const handleUpdateTask = async (taskId, taskData) => {
    try {
      const response = await taskService.updateTask(taskId, taskData)
      setTasks(tasks.map(task => task.id === taskId ? response.task : task))
      setEditingTask(null)
    } catch (error) {
      console.error('Error updating task:', error)
      throw error
    }
  }

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) {
      return
    }

    try {
      await taskService.deleteTask(taskId)
      setTasks(tasks.filter(task => task.id !== taskId))
    } catch (error) {
      console.error('Error deleting task:', error)
    }
  }

  const handleStatusChange = async (taskId, status) => {
    try {
      const response = await taskService.updateTaskStatus(taskId, status)
      setTasks(tasks.map(task => task.id === taskId ? response.task : task))
    } catch (error) {
      console.error('Error updating task status:', error)
    }
  }

  const handleEditTask = (task) => {
    setEditingTask(task)
    setShowForm(true)
  }

  const handleLogout = async () => {
    await logout()
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading-spinner"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Task Management</h1>
          <div className="flex items-center space-x-4">
            <span className="text-gray-700">Hello, {user?.name}</span>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">Your Tasks</h2>
          <button
            onClick={() => {
              setEditingTask(null)
              setShowForm(true)
            }}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm"
          >
            Add New Task
          </button>
        </div>

        {showForm && (
          <TaskForm
            task={editingTask}
            onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
            onCancel={() => {
              setShowForm(false)
              setEditingTask(null)
            }}
          />
        )}

        <TaskList
          tasks={tasks}
          onEdit={handleEditTask}
          onDelete={handleDeleteTask}
          onStatusChange={handleStatusChange}
        />
      </main>
    </div>
  )
}

export default Dashboard