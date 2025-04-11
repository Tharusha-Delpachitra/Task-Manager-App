import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Task } from '../components/task-card/task-card.component'; 

// Expected format from API when receiving task data
export interface TaskResponseDTO {
  id: number;
  title: string;
  description: string;
  status: string;
  createdAt: string;
  userId: number;
}

// Format to send when creating/updating a task
interface TaskRequestDTO {
  title: string;
  description: string;
  status: string;
}

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = 'http://localhost:8080/api/tasks';

  constructor(private http: HttpClient) { }

  /**
   * Adds JWT token from session storage into the request headers.
   * @returns HttpHeaders with Authorization header if token exists.
   */
  private getAuthHeaders(): HttpHeaders {
    const token = sessionStorage.getItem('token'); 
    if (token) {
      return new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      });
    }

    return new HttpHeaders({ 'Content-Type': 'application/json' });
  }

  /**
   * Fetches all tasks from the backend.
   * @returns An observable of an array of Task objects. 
   */
  getAllTasks(): Observable<Task[]> {
    return this.http.get<TaskResponseDTO[]>(this.apiUrl, { headers: this.getAuthHeaders() }).pipe(
      map(response => response.map(dto => this.mapTaskResponseToTask(dto)))
    );
  }

  /**
   * Fetches a single task by its ID.
   * @param id - ID of the task to retrieve.
   * @returns An observable of the Task object.
   */
  getTaskById(id: number): Observable<Task> {
    return this.http.get<TaskResponseDTO>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() }).pipe(
      map(dto => this.mapTaskResponseToTask(dto))
    );
  }

  /**
   * Creates a new task.
   * @param task - Task object without ID or createdAt.
   * @returns An observable of the created TaskResponseDTO. 
   */
  createTask(task: Omit<Task, 'id' | 'createdAt'>): Observable<TaskResponseDTO> {
    const taskRequest: TaskRequestDTO = {
      title: task.title,
      description: task.description,
      status: task.status
    };
    return this.http.post<TaskResponseDTO>(this.apiUrl, taskRequest, { headers: this.getAuthHeaders() });
  }

  /**
   * Updates an existing task.
   * @param task - Task object with updated details.
   * @returns An observable of the updated TaskResponseDTO. 
   */
  updateTask(task: Omit<Task, 'createdAt'> & { id: number }): Observable<TaskResponseDTO> {
    const taskRequest: TaskRequestDTO = {
      title: task.title,
      description: task.description,
      status: task.status
    };
    return this.http.put<TaskResponseDTO>(`${this.apiUrl}/${task.id}`, taskRequest, { headers: this.getAuthHeaders() });
  }

  /**
   * Deletes a task by its ID.
   * @param id - ID of the task to delete.
   * @returns An observable of type void. 
   */
  deleteTask(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }

  /**
   ** Converts a TaskResponseDTO from the backend to the frontend Task model.
   * @param dto - TaskResponseDTO object from the API.
   * @returns Converted Task object.
   */
  private mapTaskResponseToTask(dto: TaskResponseDTO): Task {
    return {
      id: dto.id,
      title: dto.title,
      description: dto.description,
      status: dto.status as 'In Progress' | 'Completed' | 'Pending',
      createdAt: dto.createdAt
    };
  }
}

