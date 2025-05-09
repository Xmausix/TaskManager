import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="bg-white shadow">
      <div class="container mx-auto px-4 py-6">
        <div class="flex flex-col md:flex-row justify-between items-center">
          <div class="mb-4 md:mb-0">
            <h1 class="text-3xl font-bold text-primary-600">
              <span class="text-accent-500">✓</span> TaskMaster
            </h1>
            <p class="text-gray-600 mt-1">Organize, prioritize, and track your tasks</p>
          </div>
          <div class="flex items-center space-x-2">
            <p class="text-sm text-gray-600">{{ today | date:'EEEE, MMMM d, y' }}</p>
          </div>
        </div>
      </div>
    </header>
  `
})
export class HeaderComponent {
  today = new Date();
}