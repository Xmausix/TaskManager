import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Task, TaskPriority, TaskStatus } from '../../models/task.model';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <form (ngSubmit)="onSubmit()" #taskForm="ngForm" class="task-form">
      <div class="form-group">
        <label for="title" class="form-label">Title *</label>
        <input
          type="text"
          id="title"
          name="title"
          [(ngModel)]="newTask.title"
          required
          class="form-input"
          placeholder="What needs to be done?"
        />
      </div>

      <div class="form-group">
        <label for="description" class="form-label">Description</label>
        <textarea
          id="description"
          name="description"
          [(ngModel)]="newTask.description"
          class="form-input"
          rows="3"
          placeholder="Add details about this task..."
        ></textarea>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="form-group">
          <label for="priority" class="form-label">Priority</label>
          <select
            id="priority"
            name="priority"
            [(ngModel)]="newTask.priority"
            class="form-select"
          >
            <option [value]="TaskPriority.LOW">Low</option>
            <option [value]="TaskPriority.MEDIUM">Medium</option>
            <option [value]="TaskPriority.HIGH">High</option>
          </select>
        </div>

        <div class="form-group">
          <label for="dueDate" class="form-label">Due Date</label>
          <input
            type="date"
            id="dueDate"
            name="dueDate"
            [(ngModel)]="dueDate"
            class="form-input"
          />
        </div>
      </div>

      <div class="flex justify-end space-x-2 mt-4">
        <button
          type="button"
          class="btn btn-outline"
          (click)="resetForm()"
        >
          Clear
        </button>
        <button
          type="submit"
          [disabled]="!taskForm.form.valid"
          class="btn btn-primary"
          [ngClass]="{'opacity-50 cursor-not-allowed': !taskForm.form.valid}"
        >
          Add Task
        </button>
      </div>
    </form>
  `
})
export class TaskFormComponent {
  @Output() taskSubmitted = new EventEmitter<Task>();
  
  TaskPriority = TaskPriority;
  
  newTask: Partial<Task> = {
    title: '',
    description: '',
    priority: TaskPriority.MEDIUM,
  };
  
  dueDate: string = '';

  onSubmit(): void {
    const task: Task = {
      id: this.generateId(),
      title: this.newTask.title!,
      description: this.newTask.description,
      priority: this.newTask.priority!,
      status: TaskStatus.TODO,
      createdAt: new Date(),
      ...(this.dueDate ? { dueDate: new Date(this.dueDate) } : {})
    };
    
    this.taskSubmitted.emit(task);
    this.resetForm();
  }

  resetForm(): void {
    this.newTask = {
      title: '',
      description: '',
      priority: TaskPriority.MEDIUM,
    };
    this.dueDate = '';
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  }
}