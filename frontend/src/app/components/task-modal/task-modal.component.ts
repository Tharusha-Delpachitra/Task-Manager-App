import { Component, EventEmitter, Input, OnInit, Output, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Task } from '../task-card/task-card.component';

@Component({
  selector: 'app-task-modal',
  templateUrl: './task-modal.component.html',
  styleUrls: ['./task-modal.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
})
export class TaskModalComponent implements OnInit, OnChanges {
  @Input() isVisible = false;
  @Input() editMode = false;
  @Input() taskToEdit: Task | null = null;

  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<Omit<Task, 'id' | 'createdAt'>>();

  form!: FormGroup;
  statusOptions = ['Pending', 'In Progress', 'Completed'];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      title: ['', [
        Validators.required, 
        Validators.minLength(5),  
        Validators.maxLength(50)  
      ]],
      description: ['', [
        Validators.maxLength(200) 
      ]],
      status: ['Pending', Validators.required],
    });
  }

  ngOnChanges(): void {
    if (this.taskToEdit && this.editMode && this.form) {
      this.form.patchValue({
        title: this.taskToEdit.title,
        description: this.taskToEdit.description,
        status: this.taskToEdit.status,
      });
    } else if (!this.editMode && this.form) {
      this.form.reset({ title: '', description: '', status: 'Pending' });
    }
  }

  onSave(): void {
    // Mark all fields as touched to show validation errors
    Object.keys(this.form.controls).forEach(field => {
      const control = this.form.get(field);
      control?.markAsTouched();
    });
    
    // Check if form is valid before proceeding
    if (this.form.invalid) {
      console.log('Form is invalid:', this.form.errors);
      console.log('Title errors:', this.form.get('title')?.errors);
      console.log('Description errors:', this.form.get('description')?.errors);
      return; // Stop execution if form is invalid
    }
  
    // Only emit the save event if the form is valid
    this.save.emit(this.form.value);
    this.form.reset({ title: '', description: '', status: 'Pending' });
  }

  onClose(): void {
    this.close.emit();
  }

  onBackdropClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('modal-backdrop')) {
      this.onClose();
    }
  }
}
