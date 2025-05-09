import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { TaskService } from '../../services/task.service';
import { Task, TaskCategory, TaskStatus, TaskPriority } from '../../models/task.model';
import { TaskColumnComponent } from '../task-column/task-column.component';
import { TaskFormComponent } from '../task-form/task-form.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [CommonModule, DragDropModule, TaskColumnComponent, TaskFormComponent, FormsModule],
  template: `
    <div class="mb-6">
      <h2 class="text-2xl font-bold text-gray-800 mb-4">My Tasks</h2>
      <button 
        (click)="showForm = !showForm" 
        class="btn btn-primary mb-4 flex items-center"
      >
        <span class="mr-1">{{ showForm ? 'Cancel' : 'Add New Task' }}</span>
        <span>{{ showForm ? '✕' : '+' }}</span>
      </button>

      <div *ngIf="showForm" class="bg-white p-6 rounded-lg shadow-md mb-6 animate-fade-in">
        <app-task-form (taskSubmitted)="onTaskSubmitted($event)"></app-task-form>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <app-task-column
          *ngFor="let category of categories"
          [category]="category"
          (taskDropped)="onTaskDropped($event)"
          (taskDeleted)="onTaskDeleted($event)"
        ></app-task-column>
      </div>
    </div>
  `
})
export class BoardComponent implements OnInit {
  categories: TaskCategory[] = [];
  showForm = false;

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.taskService.categories$.subscribe(categories => {
      this.categories = categories;
    });
  }

  onTaskSubmitted(task: Task): void {
    this.taskService.addTask(task);
    this.showForm = false;
  }

  onTaskDropped(event: { task: Task, newStatus: TaskStatus }): void {
    this.taskService.moveTask(event.task.id, event.newStatus);
  }

  onTaskDeleted(taskId: string): void {
    this.taskService.deleteTask(taskId);
  }
}