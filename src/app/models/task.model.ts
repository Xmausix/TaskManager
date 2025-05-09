export enum TaskPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high'
}

export enum TaskStatus {
  TODO = 'todo',
  IN_PROGRESS = 'in-progress',
  DONE = 'done'
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate?: Date;
  createdAt: Date;
  priority: TaskPriority;
  status: TaskStatus;
}

export interface TaskCategory {
  id: string;
  name: string;
  tasks: Task[];
}

export const DEFAULT_CATEGORIES: TaskCategory[] = [
  {
    id: 'todo',
    name: 'To Do',
    tasks: []
  },
  {
    id: 'in-progress',
    name: 'In Progress',
    tasks: []
  },
  {
    id: 'done',
    name: 'Done',
    tasks: []
  }
];