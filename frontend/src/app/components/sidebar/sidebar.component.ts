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

  navItems = [
    { icon: 'fa-solid fa-home', label: 'Dashboard', link: '/dashboard', active: false },
    { icon: 'fa-solid fa-tasks', label: 'Tasks', link: '/tasks', active: true },
  ];

  constructor(private router: Router) { }

  onAddTask(): void {
    this.addTask.emit();
  }

  onLogout(): void {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('username');

    this.router.navigate(['/login']);
  }
}