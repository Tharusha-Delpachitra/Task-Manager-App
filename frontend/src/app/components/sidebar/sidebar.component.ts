import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class SidebarComponent {
  @Output() addTask = new EventEmitter<void>();

  constructor(private router: Router) { }

  /**
   * Emits an event to notify the DashboardComponent, HeaderComponent to open the task modal or trigger add-task logic.
   */
  onAddTask(): void {
    this.addTask.emit();
  }

  /**
   * Clears session data and redirects the user to the login page.
   */
  onLogout(): void {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('username');

    this.router.navigate(['/login']);
  }
}