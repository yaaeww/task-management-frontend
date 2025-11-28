import { useState, useEffect } from "react";
import { TASK_STATUS } from "../utils/constants";

const TaskForm = ({ task, onSubmit, onCancel }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [status, setStatus] = useState(TASK_STATUS.PENDING);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || "");
      setDeadline(task.deadline ? task.deadline.split("T")[0] : "");
      setStatus(task.status);
    } else {
      resetForm();
    }
  }, [task]);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setDeadline("");
    setStatus(TASK_STATUS.PENDING);
    setErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    const taskData = {
      title,
      description,
      deadline: deadline || null,
      status,
    };

    try {
      if (task) {
        await onSubmit(task.id, taskData);
      } else {
        await onSubmit(taskData);
      }
      resetForm();
    } catch (error) {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        setErrors({ general: "An error occurred. Please try again." });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="task-form-container fade-in">
      <h3 className="task-form-title">
        <span>{task ? "✏️" : "➕"}</span>
        {task ? "Edit Task" : "Create New Task"}
      </h3>

      <form onSubmit={handleSubmit} className="task-form">
        <div className="form-group">
          <label htmlFor="title" className="form-label">
            Title *
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={`input-modern ${errors.title ? "input-error" : ""}`}
            placeholder="Enter task title"
            required
          />
          {errors.title && (
            <div className="error-message">
              <span>⚠️</span>
              {errors.title[0]}
            </div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="description" className="form-label">
            Description
          </label>
          <textarea
            id="description"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={`input-modern ${
              errors.description ? "input-error" : ""
            }`}
            placeholder="Enter task description (optional)"
          />
          {errors.description && (
            <div className="error-message">
              <span>⚠️</span>
              {errors.description[0]}
            </div>
          )}
        </div>

        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="deadline" className="form-label">
              Deadline
            </label>
            <input
              type="date"
              id="deadline"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className={`input-modern ${errors.deadline ? "input-error" : ""}`}
            />
            {errors.deadline && (
              <div className="error-message">
                <span>⚠️</span>
                {errors.deadline[0]}
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="status" className="form-label">
              Status
            </label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="input-modern"
            >
              <option value={TASK_STATUS.PENDING}>Pending</option>
              <option value={TASK_STATUS.IN_PROGRESS}>In Progress</option>
              <option value={TASK_STATUS.COMPLETED}>Completed</option>
            </select>
            {errors.status && (
              <div className="error-message">
                <span>⚠️</span>
                {errors.status[0]}
              </div>
            )}
          </div>
        </div>

        {errors.general && (
          <div className="alert-error">
            <div className="flex items-center space-x-2">
              <span>⚠️</span>
              <div>
                <strong>Error:</strong> {errors.general}
              </div>
            </div>
          </div>
        )}

        <div className="form-actions">
          <button
            type="button"
            onClick={onCancel}
            className="btn btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-primary"
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <div className="loading-spinner-sm mr-3"></div>
                Saving...
              </div>
            ) : task ? (
              "Update Task"
            ) : (
              "Create Task"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TaskForm;
