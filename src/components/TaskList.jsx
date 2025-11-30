import TaskItem from "./TaskItem";

const TaskList = ({
  tasks,
  onEdit,
  onDelete,
  onStatusChange,
  loading = false,
}) => {
  if (loading) {
    return (
      <div className="empty-state">
        <div className="loading-spinner-lg mx-auto mb-4"></div>
        <p className="empty-state-description">Loading tasks...</p>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">📋</div>
        <h3 className="empty-state-title">No tasks yet</h3>
        <p className="empty-state-description">
          Get started by creating your first task to organize your work
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onEdit={onEdit}
          onDelete={onDelete}
          onStatusChange={onStatusChange}
        />
      ))}
    </div>
  );
};

export default TaskList;
