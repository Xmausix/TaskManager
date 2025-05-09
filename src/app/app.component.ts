import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BoardComponent } from './components/board/board.component';
import { HeaderComponent } from './components/header/header.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, BoardComponent, HeaderComponent],
  template: `
    <div class="min-h-screen bg-gray-50">
      <app-header></app-header>
      <main class="container mx-auto px-4 py-6">
        <app-board></app-board>
      </main>
      <footer class="py-4 text-center text-gray-500 text-sm mt-auto">
        <p>© {{ currentYear }} Todo App | Made with Angular & Tailwind CSS</p>
      </footer>
    </div>
  `,
})
export class AppComponent {
  currentYear = new Date().getFullYear();
}