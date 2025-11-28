export const API_BASE_URL = 'http://localhost:8000/api';

export const TASK_STATUS = {
  PENDING: 'pending',
  IN_PROGRESS: 'in-progress',
  COMPLETED: 'completed'
};

export const TASK_STATUS_LABELS = {
  [TASK_STATUS.PENDING]: 'Pending',
  [TASK_STATUS.IN_PROGRESS]: 'In Progress',
  [TASK_STATUS.COMPLETED]: 'Completed'
};

export const TASK_STATUS_COLORS = {
  [TASK_STATUS.PENDING]: 'bg-yellow-100 text-yellow-800',
  [TASK_STATUS.IN_PROGRESS]: 'bg-blue-100 text-blue-800',
  [TASK_STATUS.COMPLETED]: 'bg-green-100 text-green-800'
};