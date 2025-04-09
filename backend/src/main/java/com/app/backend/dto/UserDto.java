package com.app.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * (DTOs) Data Transfer Objects for user-related requests and responses.
 */
public class UserDto {

    /**
     * Represents the request object for user registration.
     */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RegistrationRequest {
        private String username;
        private String password;
    }

    /**
     * Represent the request object for user login.
     */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class LoginRequest {
        private String username;
        private String password;
    }

    /**
     * Represents the response object after successful user login, containing the JWT token.
     */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class LoginResponse {
        private String token;
        private String username;
    }
}

