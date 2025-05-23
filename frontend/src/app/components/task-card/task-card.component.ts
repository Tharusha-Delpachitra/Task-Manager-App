import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

// Task interface representing the structure of a task object.
export interface Task {
  id: number;
  title: string;
  description: string;
  status: 'In Progress' | 'Completed' | 'Pending';
  createdAt: string;
}

@Component({
  selector: 'app-task-card',
  templateUrl: './task-card.component.html',
  styleUrls: ['./task-card.component.css'],
  standalone: true,
  imports: [CommonModule],
})
export class TaskCardComponent {
  @Input() task!: Task;
  @Output() edit = new EventEmitter<Task>();
  @Output() delete = new EventEmitter<number>();

  // Dynamically assigns a border color class based on task status.
  get borderClass(): string {
    switch (this.task.status) {
      case 'In Progress':
        return 'border-blue-500';
      case 'Completed':
        return 'border-green-500';
      case 'Pending':
        return 'border-yellow-500';
      default:
        return 'border-gray-500';
    }
  }

  // Dynamically assigns a background color class for status display.
  get statusBgClass(): string {
    switch (this.task.status) {
      case 'In Progress':
        return 'bg-blue-100';
      case 'Completed':
        return 'bg-green-100';
      case 'Pending':
        return 'bg-yellow-100';
      default:
        return 'bg-gray-100';
    }
  }

  // Dynamically assigns a text color class for status label.
  get statusTextClass(): string {
    switch (this.task.status) {
      case 'In Progress':
        return 'text-blue-800';
      case 'Completed':
        return 'text-green-800';
      case 'Pending':
        return 'text-yellow-800';
      default:
        return 'text-gray-800';
    }
  }

  /**
   * Emits the current task for editing.
   */
  onEdit(): void {
    this.edit.emit(this.task);
  }

  /**
   * Emits the task ID for deletion.
   */
  onDelete(): void {
    this.delete.emit(this.task.id);
  }
}
