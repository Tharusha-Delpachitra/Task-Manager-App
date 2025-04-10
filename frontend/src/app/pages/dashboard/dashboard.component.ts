import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { HeaderComponent } from '../../components/header/header.component';
import { TaskCardComponent, Task } from '../../components/task-card/task-card.component';
import { TaskModalComponent } from '../../components/task-modal/task-modal.component';
import { TaskService } from '../../services/task.service';
import { TaskResponseDTO } from '../../services/task.service'; // Import TaskResponseDTO

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  standalone: true,
  imports: [CommonModule, SidebarComponent, HeaderComponent, TaskCardComponent, TaskModalComponent],
})
export class DashboardComponent implements OnInit {
  isModalVisible = false;
  isEditMode = false;
  taskToEdit: Task | null = null;
  tasks: Task[] = [];

  constructor(private taskService: TaskService) { }

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.taskService.getAllTasks().subscribe(
      (tasks) => {
        this.tasks = tasks;
      },
      (error) => {
        console.error('Error loading tasks:', error);
        // Handle error (e.g., display a message to the user)
      }
    );
  }

  onEditTask(task: Task): void {
    this.isEditMode = true;
    this.taskToEdit = { ...task }; // Create a copy to avoid modifying the original directly
    this.isModalVisible = true;
  }

  onDeleteTask(taskId: number): void {
    this.taskService.deleteTask(taskId).subscribe(
      () => {
        this.tasks = this.tasks.filter(task => task.id !== taskId);
        // Optionally, show a success message
      },
      (error) => {
        console.error('Error deleting task:', error);
        // Handle error
      }
    );
  }

  onAddTask(): void {
    this.isEditMode = false;
    this.taskToEdit = null;
    this.isModalVisible = true;
  }

  onCloseModal(): void {
    this.isModalVisible = false;
  }

  onSaveTask(task: Omit<Task, 'id' | 'createdAt'>): void {
    if (this.isEditMode && this.taskToEdit) {
      // Update existing task
      const updatedTask: Omit<Task, 'createdAt'> & { id: number } = { ...task, id: this.taskToEdit.id };
      this.taskService.updateTask(updatedTask).subscribe(
        (response) => {
          this.tasks = this.tasks.map(t => (t.id === updatedTask.id ? this.mapResponseToFrontendTask(response) : t));
          this.isModalVisible = false;
          // Optionally, show a success message
        },
        (error) => {
          console.error('Error updating task:', error);
          // Handle error
        }
      );
    } else {
      // Add new task
      this.taskService.createTask(task).subscribe(
        (response) => {
          this.tasks = [...this.tasks, this.mapResponseToFrontendTask(response)];
          this.isModalVisible = false;
          // Optionally, show a success message
        },
        (error) => {
          console.error('Error creating task:', error);
          // Handle error
        }
      );
    }
  }

  // Helper function to map TaskResponseDTO back to frontend Task
  private mapResponseToFrontendTask(response: TaskResponseDTO): Task {
    return {
      id: response.id,
      title: response.title,
      description: response.description,
      status: response.status as 'In Progress' | 'Completed' | 'Pending',
      createdAt: response.createdAt
    };
  }
}