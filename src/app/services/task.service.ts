import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Task, TaskCategory, TaskStatus, DEFAULT_CATEGORIES } from '../models/task.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private readonly STORAGE_KEY = 'todo-app-tasks';
  private categories = new BehaviorSubject<TaskCategory[]>(DEFAULT_CATEGORIES);
  
  categories$ = this.categories.asObservable();

  constructor() {
    this.loadFromLocalStorage();
  }

  private saveToLocalStorage(): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.categories.value));
  }

  private loadFromLocalStorage(): void {
    const savedData = localStorage.getItem(this.STORAGE_KEY);
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        
        // Convert string dates back to Date objects
        parsedData.forEach((category: TaskCategory) => {
          category.tasks.forEach((task: Task) => {
            if (task.dueDate) {
              task.dueDate = new Date(task.dueDate);
            }
            if (task.createdAt) {
              task.createdAt = new Date(task.createdAt);
            }
          });
        });
        
        this.categories.next(parsedData);
      } catch (error) {
        console.error('Failed to parse tasks from localStorage:', error);
      }
    }
  }

  getCategories(): TaskCategory[] {
    return this.categories.value;
  }

  addTask(task: Task): void {
    const categories = this.categories.value;
    const categoryIndex = categories.findIndex(c => c.id === task.status);
    
    if (categoryIndex !== -1) {
      // Add to the beginning of the array for better visibility
      categories[categoryIndex].tasks.unshift(task);
      this.categories.next([...categories]);
      this.saveToLocalStorage();
    }
  }

  updateTask(updatedTask: Task): void {
    let categories = this.categories.value;
    
    // First, find and remove the task from its old category
    categories = categories.map(category => {
      return {
        ...category,
        tasks: category.tasks.filter(task => task.id !== updatedTask.id)
      };
    });
    
    // Then, add the updated task to its new (or same) category
    const targetCategoryIndex = categories.findIndex(c => c.id === updatedTask.status);
    if (targetCategoryIndex !== -1) {
      categories[targetCategoryIndex].tasks.push(updatedTask);
    }
    
    this.categories.next(categories);
    this.saveToLocalStorage();
  }

  deleteTask(taskId: string): void {
    const categories = this.categories.value.map(category => {
      return {
        ...category,
        tasks: category.tasks.filter(task => task.id !== taskId)
      };
    });
    
    this.categories.next(categories);
    this.saveToLocalStorage();
  }

  moveTask(taskId: string, newStatus: TaskStatus): void {
    const categories = this.categories.value;
    let taskToMove: Task | undefined;
    
    // Find the task and remove it from its current category
    for (const category of categories) {
      const taskIndex = category.tasks.findIndex(t => t.id === taskId);
      if (taskIndex !== -1) {
        taskToMove = { ...category.tasks[taskIndex], status: newStatus };
        category.tasks.splice(taskIndex, 1);
        break;
      }
    }
    
    // Add the task to its new category
    if (taskToMove) {
      const targetCategory = categories.find(c => c.id === newStatus);
      if (targetCategory) {
        targetCategory.tasks.push(taskToMove);
        this.categories.next([...categories]);
        this.saveToLocalStorage();
      }
    }
  }
}