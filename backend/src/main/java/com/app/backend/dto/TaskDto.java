package com.app.backend.dto;

import lombok.Data;

import java.time.LocalDate;

/**
 * (DTOs) Data Transfer Objects for user-related requests and responses.
 */
public class TaskDto {

    /**
     * Represents the request object for creating or updating a task.
     */
    @Data
    public static class TaskRequestDTO {
        private String title;
        private String description;
        private String status;
    }

    /**
     * Represents the response object containing the details of a task.
     */
    @Data
    public static class TaskResponseDTO {
        private Long id;
        private String title;
        private String description;
        private String status;
        private LocalDate createdAt;;
        private Long userId;
    }
}
