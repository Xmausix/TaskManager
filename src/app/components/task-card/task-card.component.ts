import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task, TaskPriority } from '../../models/task.model';

@Component({
  selector: 'app-task-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div 
      [ngClass]="['task-card', 'priority-' + task.priority]"
      (mouseenter)="showActions = true"
      (mouseleave)="showActions = false"
    >
      <div class="flex justify-between items-start">
        <h4 class="font-medium text-gray-900">{{ task.title }}</h4>
        <div 
          *ngIf="showActions" 
          class="flex space-x-1 opacity-0 transition-opacity duration-200"
          [ngClass]="{'opacity-100': showActions}"
        >
          <button 
            (click)="onDelete()"
            class="text-red-500 hover:text-red-700 p-1 rounded"
            title="Delete task"
          >
            ✕
          </button>
        </div>
      </div>

      <p *ngIf="task.description" class="text-gray-600 text-sm mt-1">
        {{ task.description }}
      </p>

      <div class="mt-3 flex justify-between items-center text-xs">
        <div class="flex space-x-2">
          <span 
            class="px-2 py-1 rounded-full" 
            [ngClass]="{
              'bg-green-100 text-green-800': task.priority === 'low',
              'bg-yellow-100 text-yellow-800': task.priority === 'medium',
              'bg-red-100 text-red-800': task.priority === 'high'
            }"
          >
            {{ getPriorityLabel(task.priority) }}
          </span>
        </div>
        
        <div *ngIf="task.dueDate" class="text-gray-500 flex items-center">
          <span class="mr-1">📅</span>
          <span>{{ task.dueDate | date:'MMM d' }}</span>
        </div>
      </div>
    </div>
  `
})
export class TaskCardComponent {
  @Input() task!: Task;
  @Output() delete = new EventEmitter<void>();
  
  showActions = false;

  getPriorityLabel(priority: TaskPriority): string {
    switch (priority) {
      case TaskPriority.LOW:
        return 'Low';
      case TaskPriority.MEDIUM:
        return 'Medium';
      case TaskPriority.HIGH:
        return 'High';
      default:
        return '';
    }
  }

  onDelete(): void {
    this.delete.emit();
  }
}