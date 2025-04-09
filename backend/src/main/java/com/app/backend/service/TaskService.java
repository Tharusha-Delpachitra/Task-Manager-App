package com.app.backend.service;

import com.app.backend.dto.TaskDto.TaskRequestDTO;
import com.app.backend.dto.TaskDto.TaskResponseDTO;
import com.app.backend.model.Task;
import com.app.backend.model.User;
import com.app.backend.repository.TaskRepository;
import com.app.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

/**
 * Service class responsible for managing tasks.
 */
@Service
public class TaskService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;

    @Autowired
    public TaskService(TaskRepository taskRepository, UserRepository userRepository) {
        this.taskRepository = taskRepository;
        this.userRepository = userRepository;
    }

    /**
     * Retrieves the ID of the currently authenticated user.
     * It extracts the username from the Spring Security context and then fetches the corresponding user ID from the database.
     *
     * @return The ID of the current user.
     */
    private Long getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof org.springframework.security.core.userdetails.User) {
            org.springframework.security.core.userdetails.User principal = (org.springframework.security.core.userdetails.User) authentication.getPrincipal();
            String username = principal.getUsername();
            Optional<com.app.backend.model.User> userOptional = userRepository.findByUsername(username);
            if (userOptional.isPresent()) {
                return userOptional.get().getId();
            } else {
                throw new IllegalStateException("Authenticated user not found in the database.");
            }
        }
        throw new IllegalStateException("User not authenticated or principal is not UserDetails.");
    }

    /**
     * Retrieves all tasks belonging to the currently authenticated user.
     *
     * @return A list of {@link TaskResponseDTO} representing the user's tasks.
     */
    public List<TaskResponseDTO> getAllTasks() {
        Long currentUserId = getCurrentUserId();
        List<Task> tasks = taskRepository.findByUserId(currentUserId);
        List<TaskResponseDTO> taskResponseDTOs = new ArrayList<>();
        for (Task task : tasks) {
            taskResponseDTOs.add(convertToDTO(task));
        }
        return taskResponseDTOs;
    }

    /**
     * Retrieves a specific task by its ID, ensuring that the task belongs to the currently authenticated user.
     *
     * @param id The ID of the task to retrieve.
     * @return An {@link Optional} containing the {@link TaskResponseDTO} if the task exists and belongs to the user, otherwise an empty {@link Optional}.
     */
    public Optional<TaskResponseDTO> getTaskById(Long id) {
        Long currentUserId = getCurrentUserId();
        Optional<Task> taskOptional = taskRepository.findById(id);
        if (taskOptional.isPresent() && taskOptional.get().getUser().getId().equals(currentUserId)) {
            return Optional.of(convertToDTO(taskOptional.get()));
        }
        return Optional.empty();
    }

    /**
     * Creates a new task for the currently authenticated user.
     *
     * @param taskRequestDTO The {@link TaskRequestDTO} containing the details of the new task.
     * @return A {@link TaskResponseDTO} representing the newly created task.
     */
    public TaskResponseDTO createTask(TaskRequestDTO taskRequestDTO) {
        Long currentUserId = getCurrentUserId();
        Optional<User> userOptional = userRepository.findById(currentUserId);
        if (userOptional.isEmpty()) {
            throw new IllegalStateException("Current user not found in the database!");
        }
        User user = userOptional.get();
        Task task = new Task();
        task.setTitle(taskRequestDTO.getTitle());
        task.setDescription(taskRequestDTO.getDescription());
        task.setStatus(taskRequestDTO.getStatus());
        task.setUser(user);
        Task savedTask = taskRepository.save(task);
        return convertToDTO(savedTask);
    }

    /**
     * Updates an existing task by its ID, ensuring that the task belongs to the currently authenticated user.
     *
     * @param id The ID of the task to update.
     * @param taskRequestDTO The {@link TaskRequestDTO} containing the updated details of the task.
     * @return An {@link Optional} containing the {@link TaskResponseDTO} of the updated task if it exists and belongs to the user, otherwise an empty {@link Optional}.
     */
    public Optional<TaskResponseDTO> updateTask(Long id, TaskRequestDTO taskRequestDTO) {
        Long currentUserId = getCurrentUserId();
        Optional<Task> taskOptional = taskRepository.findById(id);
        if (taskOptional.isPresent() && taskOptional.get().getUser().getId().equals(currentUserId)) {
            Task existingTask = taskOptional.get();
            existingTask.setTitle(taskRequestDTO.getTitle());
            existingTask.setDescription(taskRequestDTO.getDescription());
            existingTask.setStatus(taskRequestDTO.getStatus());
            Task updatedTask = taskRepository.save(existingTask);
            return Optional.of(convertToDTO(updatedTask));
        }
        return Optional.empty();
    }

    /**
     * Deletes a task by its ID, ensuring that the task belongs to the currently authenticated user.
     *
     * @param id The ID of the task to delete.
     * @return true if the task was successfully deleted, false otherwise (if the task does not exist or does not belong to the user).
     */
    public boolean deleteTask(Long id) {
        Long currentUserId = getCurrentUserId();
        Optional<Task> taskOptional = taskRepository.findById(id);
        if (taskOptional.isPresent() && taskOptional.get().getUser().getId().equals(currentUserId)) {
            taskRepository.deleteById(id);
            return true;
        }
        return false;
    }

    /**
     * Converts a {@link Task} entity to a {@link TaskResponseDTO}.
     *
     * @param task The {@link Task} entity to convert.
     * @return The corresponding {@link TaskResponseDTO}.
     */
    private TaskResponseDTO convertToDTO(Task task) {
        TaskResponseDTO dto = new TaskResponseDTO();
        dto.setId(task.getId());
        dto.setTitle(task.getTitle());
        dto.setDescription(task.getDescription());
        dto.setStatus(task.getStatus());
        dto.setCreatedAt(task.getCreatedAt());
        dto.setUserId(task.getUser().getId());
        return dto;
    }
}