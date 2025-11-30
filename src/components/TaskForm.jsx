import { useState, useEffect } from "react";

const TaskForm = ({ task, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    deadline: "",
    status: "pending",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || "",
        description: task.description || "",
        deadline: task.deadline ? task.deadline.split("T")[0] : "",
        status: task.status || "pending",
      });
    }
  }, [task]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    } else if (formData.title.length > 255) {
      newErrors.title = "Title must be less than 255 characters";
    }

    if (formData.description && formData.description.length > 1000) {
      newErrors.description = "Description must be less than 1000 characters";
    }

    if (formData.deadline) {
      const today = new Date().toISOString().split('T')[0];
      if (formData.deadline < today) {
        newErrors.deadline = "Deadline cannot be in the past";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Mark all fields as touched
    setTouched({
      title: true,
      description: true,
      deadline: true,
      status: true,
    });

    // Validate form
    if (!validateForm()) {
      console.log('❌ Form validation failed');
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      // PERBAIKAN: Format data yang sesuai dengan Laravel
      // Jangan kirim null, kirim empty string atau undefined
      const submitData = {
        title: formData.title.trim(),
        // Untuk field nullable, kirim empty string atau hapus field jika kosong
        ...(formData.description.trim() && { description: formData.description.trim() }),
        status: formData.status,
        ...(formData.deadline && { deadline: formData.deadline }),
      };

      console.log("🚀 Submitting task data:", submitData);

      await onSubmit(task?.id, submitData);
      
    } catch (error) {
      console.error("❌ Form submission error:", error);
      
      // Debug detail error dari Laravel
      if (error.response?.data) {
        console.log("📋 Laravel response:", error.response.data);
      }

      // Handle error response dari Laravel
      if (error.response?.data?.errors) {
        const laravelErrors = error.response.data.errors;
        console.log("🔍 Laravel validation errors:", laravelErrors);
        
        const formattedErrors = {};
        
        Object.keys(laravelErrors).forEach(key => {
          if (Array.isArray(laravelErrors[key])) {
            formattedErrors[key] = laravelErrors[key][0];
          } else {
            formattedErrors[key] = laravelErrors[key];
          }
        });
        
        setErrors(formattedErrors);
      } else if (error.response?.data?.message) {
        setErrors({ general: error.response.data.message });
      } else if (error.message) {
        setErrors({ general: error.message });
      } else {
        setErrors({ general: "Something went wrong. Please try again." });
      }
    } finally {
      setLoading(false);
    }
  };

  const shouldShowError = (fieldName) => {
    return touched[fieldName] && errors[fieldName];
  };

  // Reset form ketika cancel
  const handleCancel = () => {
    setFormData({
      title: "",
      description: "",
      deadline: "",
      status: "pending",
    });
    setErrors({});
    setTouched({});
    onCancel();
  };

  return (
    <div className="card fade-in">
      <div className="card-header">
        <h3 className="text-gradient">{task ? "Edit Task" : "Create New Task"}</h3>
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label htmlFor="title" className="form-label">
              Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`input-modern ${shouldShowError('title') ? "input-error" : ""}`}
              placeholder="Enter task title"
              required
              maxLength={255}
            />
            {shouldShowError('title') && (
              <div className="error-message">
                <svg className="w-4 h-4 inline mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                {errors.title}
              </div>
            )}
            <div className="text-xs text-text-muted mt-1">
              {formData.title.length}/255 characters
            </div>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="form-label">
              Description <span className="text-text-muted">(optional)</span>
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`input-modern ${shouldShowError('description') ? "input-error" : ""}`}
              placeholder="Enter task description"
              rows="3"
              maxLength={1000}
            />
            {shouldShowError('description') && (
              <div className="error-message">
                <svg className="w-4 h-4 inline mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                {errors.description}
              </div>
            )}
            <div className="text-xs text-text-muted mt-1">
              {formData.description.length}/1000 characters
            </div>
          </div>

          {/* Deadline */}
          <div>
            <label htmlFor="deadline" className="form-label">
              Deadline <span className="text-text-muted">(optional)</span>
            </label>
            <input
              type="date"
              id="deadline"
              name="deadline"
              value={formData.deadline}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`input-modern ${shouldShowError('deadline') ? "input-error" : ""}`}
              min={new Date().toISOString().split('T')[0]}
            />
            {shouldShowError('deadline') && (
              <div className="error-message">
                <svg className="w-4 h-4 inline mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                {errors.deadline}
              </div>
            )}
          </div>

          {/* Status */}
          <div>
            <label htmlFor="status" className="form-label">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="input-modern"
            >
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          {/* General Error */}
          {errors.general && (
            <div className="alert-error">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                {errors.general}
              </div>
            </div>
          )}

          {/* Tampilkan semua validation errors */}
          {Object.keys(errors).length > 0 && !errors.general && (
            <div className="alert-error">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                Please fix the errors above
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div className="form-actions">
            <button
              type="button"
              onClick={handleCancel}
              className="btn btn-secondary"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="loading-spinner-sm mr-2"></div>
                  {task ? "Updating..." : "Creating..."}
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
    </div>
  );
};

export default TaskForm;