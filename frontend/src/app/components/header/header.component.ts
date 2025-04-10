import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

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
  userName: string = 'Tharusha Delpachitra';
  userInitials: string = 'TD';
  
  ngOnInit(): void {
    this.updateDateTime();
    // Update time every minute
    setInterval(() => this.updateDateTime(), 60000);
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
}