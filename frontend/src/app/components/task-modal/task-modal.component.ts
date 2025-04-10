import { Component, EventEmitter, Input, OnInit, Output, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Task } from '../task-card/task-card.component';

@Component({
  selector: 'app-task-modal',
  templateUrl: './task-modal.component.html',
  styleUrls: ['./task-modal.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class TaskModalComponent implements OnInit, OnChanges {
  @Input() isVisible = false;
  @Input() editMode = false;
  @Input() taskToEdit: Task | null = null;

  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<Omit<Task, 'id' | 'createdAt'>>(); 

  task: { title: string; description: string; status: string } = {
    title: '',
    description: '',
    status: 'Pending',
  };

  statusOptions = ['Pending', 'In Progress', 'Completed'];

  ngOnInit(): void {
    this.resetForm();
  }

  ngOnChanges(): void {
    if (this.taskToEdit && this.editMode) {
      this.task = {
        title: this.taskToEdit.title,
        description: this.taskToEdit.description,
        status: this.taskToEdit.status as 'Pending' | 'In Progress' | 'Completed',
      };
    } else if (!this.editMode) {
      this.resetForm();
    }
  }

  resetForm(): void {
    this.task = {
      title: '',
      description: '',
      status: 'Pending',
    };
  }

  onClose(): void {
    this.close.emit();
  }

  onSave(): void {
    if (this.task.title.trim() === '') {
      return; 
    }

    const taskToEmit: Omit<Task, 'id' | 'createdAt'> = {
      title: this.task.title,
      description: this.task.description,
      status: this.task.status as 'Pending' | 'In Progress' | 'Completed',
    };

    this.save.emit(taskToEmit);
    this.resetForm(); 
  }

  onBackdropClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('modal-backdrop')) {
      this.onClose();
    }
  }
}