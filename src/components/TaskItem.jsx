import { TASK_STATUS, TASK_STATUS_LABELS } from "../utils/constants";

const TaskItem = ({ task, onEdit, onDelete, onStatusChange }) => {
  const formatDate = (dateString) => {
    if (!dateString) return "No deadline";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusClass = (status) => {
    switch (status) {
      case TASK_STATUS.COMPLETED:
        return "badge-completed";
      case TASK_STATUS.IN_PROGRESS:
        return "badge-in-progress";
      default:
        return "badge-todo";
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      await onStatusChange(task.id, newStatus);
    } catch (error) {
      console.error("Error updating task status:", error);
      // Anda bisa menambahkan toast notification di sini
    }
  };

  return (
    <div className="task-item">
      <div className="task-header">
        <div className="flex items-start justify-between w-full">
          <div className="flex-1 min-w-0">
            <h3 className="task-title line-clamp-2">{task.title}</h3>
            {task.description && (
              <p className="task-description line-clamp-2 mt-2">
                {task.description}
              </p>
            )}
          </div>
          <div className="task-actions-compact ml-4 flex-shrink-0">
            <select
              value={task.status}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="status-select"
            >
              <option value={TASK_STATUS.PENDING}>Pending</option>
              <option value={TASK_STATUS.IN_PROGRESS}>In Progress</option>
              <option value={TASK_STATUS.COMPLETED}>Completed</option>
            </select>

            <button
              onClick={() => onEdit(task)}
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
              onClick={() => onDelete(task.id)}
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
          </div>
        </div>
      </div>

      <div className="task-meta mt-3">
        <span className="task-deadline">
          <svg
            className="w-4 h-4 inline mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          {formatDate(task.deadline)}
        </span>
        <span className={`badge ${getStatusClass(task.status)}`}>
          {TASK_STATUS_LABELS[task.status]}
        </span>
      </div>
    </div>
  );
};

export default TaskItem;
