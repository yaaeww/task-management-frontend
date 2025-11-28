import { TASK_STATUS, TASK_STATUS_LABELS, TASK_STATUS_COLORS } from '../utils/constants'

const TaskItem = ({ task, onEdit, onDelete, onStatusChange }) => {
  const formatDate = (dateString) => {
    if (!dateString) return 'No deadline'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getStatusColor = (status) => {
    return TASK_STATUS_COLORS[status] || 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{task.title}</h3>
          {task.description && (
            <p className="text-gray-600 mb-3">{task.description}</p>
          )}
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <span>Deadline: {formatDate(task.deadline)}</span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
              {TASK_STATUS_LABELS[task.status]}
            </span>
          </div>
        </div>
        
        <div className="flex space-x-2 ml-4">
          <select
            value={task.status}
            onChange={(e) => onStatusChange(task.id, e.target.value)}
            className="text-sm border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value={TASK_STATUS.PENDING}>Pending</option>
            <option value={TASK_STATUS.IN_PROGRESS}>In Progress</option>
            <option value={TASK_STATUS.COMPLETED}>Completed</option>
          </select>
          
          <button
            onClick={() => onEdit(task)}
            className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
          >
            Edit
          </button>
          
          <button
            onClick={() => onDelete(task.id)}
            className="text-red-600 hover:text-red-900 text-sm font-medium"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}

export default TaskItem