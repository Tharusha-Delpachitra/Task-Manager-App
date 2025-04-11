import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { HeaderComponent } from '../../components/header/header.component';
import { TaskCardComponent, Task } from '../../components/task-card/task-card.component';
import { TaskModalComponent } from '../../components/task-modal/task-modal.component';
import { TaskService } from '../../services/task.service';
import { TaskResponseDTO } from '../../services/task.service';
import { FormsModule } from '@angular/forms';

// Interface for tracking count of tasks by status.
interface TaskCounts {
  all: number;
  pending: number;
  inProgress: number;
  completed: number;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  standalone: true,
  imports: [CommonModule, SidebarComponent, HeaderComponent, TaskCardComponent, TaskModalComponent, FormsModule],
})

export class DashboardComponent implements OnInit {
  isModalVisible = false;
  isEditMode = false;
  taskToEdit: Task | null = null;
  tasks: Task[] = [];
  filteredTasks: Task[] = [];
  selectedStatus: string = '';
  taskCounts: TaskCounts = { all: 0, pending: 0, inProgress: 0, completed: 0 };

  constructor(private taskService: TaskService) {}

  /**
   * Initialize the component and load tasks.
   */
  ngOnInit(): void {
    this.loadTasks();
  }

  /**
   * Loads all tasks from the server and updates task counts and filtered tasks.
   */
  loadTasks(): void {
    this.taskService.getAllTasks().subscribe(
      (tasks) => {
        this.tasks = tasks;
        this.updateTaskCounts(); 
        this.filterTasks();
      },
      (error) => {
        console.error('Error loading tasks:', error);
      }
    );
  }

  /**
   * Filters tasks based on the selected status.
   */
  filterTasks(): void {
    if (!this.selectedStatus) {
      this.filteredTasks = [...this.tasks];
    } else {
      this.filteredTasks = this.tasks.filter(task => task.status === this.selectedStatus);
    }
  }

  /**
   * Updates the counts of tasks based on their status.
   */
  updateTaskCounts(): void {
    this.taskCounts.all = this.tasks.length;
    this.taskCounts.pending = this.tasks.filter(task => task.status === 'Pending').length;
    this.taskCounts.inProgress = this.tasks.filter(task => task.status === 'In Progress').length;
    this.taskCounts.completed = this.tasks.filter(task => task.status === 'Completed').length;
  }

  /**
   * Handles editing a task by opening the modal with the selected task.
   * @param task The task to edit 
   */
  onEditTask(task: Task): void {
    this.isEditMode = true;
    this.taskToEdit = { ...task };
    this.isModalVisible = true;
  }

  /**
   * Deletes a task by its ID and updates the task list.
   * @param taskId ID of the task to delete 
   */
  onDeleteTask(taskId: number): void {
    this.taskService.deleteTask(taskId).subscribe(
      () => {
        this.tasks = this.tasks.filter(task => task.id !== taskId);
        this.updateTaskCounts(); 
        this.filterTasks();
        alert('Task deleted successfully!');
      },
      (error) => {
        console.error('Error deleting task:', error);
        alert('Failed to delete task.');
      }
    );
  }

  /**
   * Prepares the modal for adding a new task. 
   */
  onAddTask(): void {
    this.isEditMode = false;
    this.taskToEdit = null;
    this.isModalVisible = true;
  }

  /**
   * Closes the task modal. 
   */
  onCloseModal(): void {
    this.isModalVisible = false;
  }

  /**
   * Saves a task (either creates a new task or updates an existing one).
   * @param task The task data to save (without ID and createdAt) 
   */
  onSaveTask(task: Omit<Task, 'id' | 'createdAt'>): void {
    if (this.isEditMode && this.taskToEdit) {
      const updatedTask = {
        ...task,
        id: this.taskToEdit.id
      };
      
      this.taskService.updateTask(updatedTask).subscribe(
        (response) => {
          this.tasks = this.tasks.map(t => 
            t.id === this.taskToEdit?.id ? this.mapResponseToFrontendTask(response) : t
          );
          this.updateTaskCounts();
          this.filterTasks();
          this.isModalVisible = false;
          alert('Task updated successfully!');
        },
        (error) => {
          console.error('Error updating task:', error);
          alert('Failed to update task.');
        }
      );
    } else {
      this.taskService.createTask(task).subscribe(
        (response) => {
          this.tasks = [...this.tasks, this.mapResponseToFrontendTask(response)];
          this.updateTaskCounts();
          this.filterTasks();
          this.isModalVisible = false;
          alert('Task added successfully!');
        },
        (error) => {
          console.error('Error creating task:', error);
          alert('Failed to add task.');
        }
      );
    }
  }

  /**
   * Converts a response DTO from the backend to a frontend Task object.
   * @param response The task response from the backend
   * @returns Task object compatible with frontend 
   */
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