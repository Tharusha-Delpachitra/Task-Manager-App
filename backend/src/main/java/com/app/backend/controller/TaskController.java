package com.app.backend.controller;

import com.app.backend.dto.TaskDto.TaskRequestDTO;
import com.app.backend.dto.TaskDto.TaskResponseDTO;
import com.app.backend.service.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing tasks.
 */
@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(origins = "http://localhost:4200")
public class TaskController {

    private final TaskService taskService;

    @Autowired
    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    /**
     * Retrieves all tasks belonging to the currently authenticated user.
     *
     * @return A {@link ResponseEntity} containing a list of {@link TaskResponseDTO} and an HTTP status of 200 (OK).
     */
    @GetMapping
    public ResponseEntity<List<TaskResponseDTO>> getAllTasks() {
        List<TaskResponseDTO> tasks = taskService.getAllTasks();
        return new ResponseEntity<>(tasks, HttpStatus.OK);
    }

    /**
     * Retrieves a specific task by its ID.
     * The task is retrieved only if it belongs to the currently authenticated user.
     *
     * @param id The ID of the task to retrieve.
     * @return A {@link ResponseEntity} containing the {@link TaskResponseDTO} and an HTTP status of 200 (OK) if the task is found and belongs to the user,
     * or an HTTP status of 404 (NOT FOUND) if the task does not exist or does not belong to the user.
     */
    @GetMapping("/{id}")
    public ResponseEntity<TaskResponseDTO> getTaskById(@PathVariable Long id) {
        Optional<TaskResponseDTO> task = taskService.getTaskById(id);
        if (task.isPresent()) {
            return new ResponseEntity<>(task.get(), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    /**
     * Creates a new task for the currently authenticated user.
     *
     * @param taskRequestDTO The {@link TaskRequestDTO} containing the details of the new task.
     * @return A {@link ResponseEntity} containing the {@link TaskResponseDTO} of the created task and an HTTP status of 201 (CREATED) upon successful creation,
     * or a {@link ResponseEntity} with an error message and an HTTP status of 400 (BAD REQUEST) if there is an issue with the request.
     */
    @PostMapping
    public ResponseEntity<?> createTask(@RequestBody TaskRequestDTO taskRequestDTO) {
        try {
            TaskResponseDTO createdTask = taskService.createTask(taskRequestDTO);
            return new ResponseEntity<>(createdTask, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    /**
     * Updates an existing task by its ID.
     * The task is updated only if it belongs to the currently authenticated user.
     *
     * @param id The ID of the task to update.
     * @param taskRequestDTO The {@link TaskRequestDTO} containing the updated details of the task.
     * @return A {@link ResponseEntity} containing the {@link TaskResponseDTO} of the updated task and an HTTP status of 200 (OK) if the task is found and updated,
     * or an HTTP status of 404 (NOT FOUND) if the task does not exist or does not belong to the user,
     * or a {@link ResponseEntity} with an error message and an HTTP status of 400 (BAD REQUEST) if there is an issue with the request.
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> updateTask(@PathVariable Long id, @RequestBody TaskRequestDTO taskRequestDTO) {
        try {
            Optional<TaskResponseDTO> updatedTask = taskService.updateTask(id, taskRequestDTO);
            if (updatedTask.isPresent()) {
                return new ResponseEntity<>(updatedTask.get(), HttpStatus.OK);
            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    /**
     * Deletes a task by its ID.
     * The task is deleted only if it belongs to the currently authenticated user.
     *
     * @param id The ID of the task to delete.
     * @return A {@link ResponseEntity} with an HTTP status of 204 (NO CONTENT) if the task was successfully deleted,
     * or an HTTP status of 404 (NOT FOUND) if the task does not exist or does not belong to the user.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long id) {
        boolean deleted = taskService.deleteTask(id);
        if (deleted) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}