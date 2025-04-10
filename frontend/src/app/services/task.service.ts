// src/app/services/task.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Task } from '../components/task-card/task-card.component'; 

export interface TaskResponseDTO {
  id: number;
  title: string;
  description: string;
  status: string;
  createdAt: string;
  userId: number;
}

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

  getAllTasks(): Observable<Task[]> {
    return this.http.get<TaskResponseDTO[]>(this.apiUrl, { headers: this.getAuthHeaders() }).pipe(
      map(response => response.map(dto => this.mapTaskResponseToTask(dto)))
    );
  }

  getTaskById(id: number): Observable<Task> {
    return this.http.get<TaskResponseDTO>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() }).pipe(
      map(dto => this.mapTaskResponseToTask(dto))
    );
  }

  createTask(task: Omit<Task, 'id' | 'createdAt'>): Observable<TaskResponseDTO> {
    const taskRequest: TaskRequestDTO = {
      title: task.title,
      description: task.description,
      status: task.status
    };
    return this.http.post<TaskResponseDTO>(this.apiUrl, taskRequest, { headers: this.getAuthHeaders() });
  }

  updateTask(task: Omit<Task, 'createdAt'> & { id: number }): Observable<TaskResponseDTO> {
    const taskRequest: TaskRequestDTO = {
      title: task.title,
      description: task.description,
      status: task.status
    };
    return this.http.put<TaskResponseDTO>(`${this.apiUrl}/${task.id}`, taskRequest, { headers: this.getAuthHeaders() });
  }

  deleteTask(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }

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