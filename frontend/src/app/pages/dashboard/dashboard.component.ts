import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { HeaderComponent } from '../../components/header/header.component';
import { TaskCardComponent, Task } from '../../components/task-card/task-card.component';
import { TaskModalComponent } from '../../components/task-modal/task-modal.component';
import { TaskService } from '../../services/task.service';
import { TaskResponseDTO } from '../../services/task.service';
import { FormsModule } from '@angular/forms';

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

  ngOnInit(): void {
    this.loadTasks();
  }

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

  filterTasks(): void {
    if (!this.selectedStatus) {
      this.filteredTasks = [...this.tasks];
    } else {
      this.filteredTasks = this.tasks.filter(task => task.status === this.selectedStatus);
    }
  }

  updateTaskCounts(): void {
    this.taskCounts.all = this.tasks.length;
    this.taskCounts.pending = this.tasks.filter(task => task.status === 'Pending').length;
    this.taskCounts.inProgress = this.tasks.filter(task => task.status === 'In Progress').length;
    this.taskCounts.completed = this.tasks.filter(task => task.status === 'Completed').length;
  }

  onEditTask(task: Task): void {
    this.isEditMode = true;
    this.taskToEdit = { ...task };
    this.isModalVisible = true;
  }

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
      // Create a complete task object with the ID from taskToEdit for updating
      const updatedTask = {
        ...task,
        id: this.taskToEdit.id
      };
      
      // Use updateTask for editing existing tasks
      this.taskService.updateTask(updatedTask).subscribe(
        (response) => {
          // Update the task in the array
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
      // Use createTask for new tasks (existing code)
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