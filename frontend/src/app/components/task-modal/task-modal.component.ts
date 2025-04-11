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

  /**
   * Initializes the form with validation rules.
   */
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

  /**
   * Runs when input properties change.
   * Pre-fills or resets the form depending on editMode and taskToEdit. 
   */
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

  /**
   * Called when the save button is clicked.
   * Validates the form and emits the save event if valid.
   */
  onSave(): void {
    Object.keys(this.form.controls).forEach(field => {
      const control = this.form.get(field);
      control?.markAsTouched();
    });
    
    if (this.form.invalid) {
      console.log('Form is invalid:', this.form.errors);
      console.log('Title errors:', this.form.get('title')?.errors);
      console.log('Description errors:', this.form.get('description')?.errors);
      return;
    }

    this.save.emit(this.form.value);
    this.form.reset({ title: '', description: '', status: 'Pending' });
  }

  /**
   * Emits the close event when the modal should be closed. 
   */
  onClose(): void {
    this.close.emit();
  }

  /**
   * Closes the modal if the backdrop (outside the form) is clicked.
   * Prevents closing when clicking inside the modal content. 
   * @param event MouseEvent triggered by clicking on the backdrop
   */
  onBackdropClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('modal-backdrop')) {
      this.onClose();
    }
  }
}
