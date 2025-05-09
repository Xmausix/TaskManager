import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { TaskCategory, Task, TaskStatus } from '../../models/task.model';
import { TaskCardComponent } from '../task-card/task-card.component';

@Component({
  selector: 'app-task-column',
  standalone: true,
  imports: [CommonModule, DragDropModule, TaskCardComponent],
  template: `
    <div class="task-column">
      <h3 class="font-semibold text-lg mb-3 flex items-center">
        {{ category.name }}
        <span class="ml-2 bg-gray-200 text-gray-700 rounded-full px-2 py-0.5 text-xs">
          {{ category.tasks.length }}
        </span>
      </h3>
      
      <div
        cdkDropList
        [cdkDropListData]="category.tasks"
        [id]="category.id"
        [cdkDropListConnectedTo]="connectedLists"
        (cdkDropListDropped)="onDrop($event)"
        class="min-h-[150px]"
      >
        <div *ngIf="category.tasks.length === 0" class="text-center py-8 text-gray-400 italic">
          No tasks yet
        </div>
        
        <app-task-card
          *ngFor="let task of category.tasks"
          [task]="task"
          cdkDrag
          [cdkDragData]="task"
          (delete)="onTaskDelete(task.id)"
        ></app-task-card>
      </div>
    </div>
  `
})
export class TaskColumnComponent {
  @Input() category!: TaskCategory;
  @Output() taskDropped = new EventEmitter<{task: Task, newStatus: TaskStatus}>();
  @Output() taskDeleted = new EventEmitter<string>();

  get connectedLists(): string[] {
    return ['todo', 'in-progress', 'done'];
  }

  onDrop(event: CdkDragDrop<Task[]>): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );

      const task = event.item.data as Task;
      const newStatus = this.category.id as TaskStatus;
      
      this.taskDropped.emit({ task, newStatus });
    }
  }

  onTaskDelete(taskId: string): void {
    this.taskDeleted.emit(taskId);
  }
}