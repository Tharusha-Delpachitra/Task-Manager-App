import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class HeaderComponent implements OnInit {
  currentDate: string = '';
  currentTime: string = '';
  userName: string = '';
  userInitials: string = '';

  @Output() addTask = new EventEmitter<void>();

  constructor(private router: Router) { }

  /**
   * Initializes the component.
   * Sets the current date/time and loads the user's name and initials.
   */
  ngOnInit(): void {
    this.updateDateTime();
    this.loadUserName();
    setInterval(() => this.updateDateTime(), 60000);
  }

  /**
   * Loads the username from session storage and generates initials.
   */
  loadUserName(): void {
    const storedUsername = sessionStorage.getItem('username');
    if (storedUsername) {
      this.userName = storedUsername;
      this.generateUserInitials(); 
    }
  }
  
  /**
   * Updates the current date and time based on the system clock. 
   */
  updateDateTime(): void {
    const now = new Date();
    this.currentDate = now.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    });
    
    this.currentTime = now.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  }

  /**
   * Generates initials from the user's full name. 
   */
  generateUserInitials(): void {
    if (this.userName) {
      const nameParts = this.userName.trim().split(' ');
      if (nameParts.length === 1) {
        this.userInitials = nameParts[0].charAt(0).toUpperCase();
      } else if (nameParts.length >= 2) {
        this.userInitials = (nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)).toUpperCase();
      }
    } else {
      this.userInitials = ''; 
    }
  }
  
  /**
   * Emits the addTask event to notify the DashboardComponent to open the task modal.
   */
  onAddTask(): void {
    this.addTask.emit();
  }

  /**
   * Clears session data and redirects the user to the login page..
   */
  onLogout(): void {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('username');

    this.router.navigate(['/login']);
  }
}