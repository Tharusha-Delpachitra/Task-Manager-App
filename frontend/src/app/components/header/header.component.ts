import { Component, OnInit } from '@angular/core';
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

  constructor(private router: Router) { }
  
  ngOnInit(): void {
    this.updateDateTime();
    this.loadUserName();
    // Update time every minute
    setInterval(() => this.updateDateTime(), 60000);
  }

  loadUserName(): void {
    const storedUsername = sessionStorage.getItem('username');
    if (storedUsername) {
      this.userName = storedUsername;
      this.generateUserInitials(); // Generate initials after loading the username
    }
  }
  
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

  onLogout(): void {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('username');

    this.router.navigate(['/login']);
  }
}