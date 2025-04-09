package com.app.backend.controller;

import com.app.backend.dto.UserDto;
import com.app.backend.model.User;
import com.app.backend.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * REST controller for handling authentication-related requests, such as user registration and login.
 */
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    /**
     *
     * @param request The registration request containing username and password.
     * @return A {@link ResponseEntity} with a success message or an error message.
     */
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody UserDto.RegistrationRequest request) {
        try {
            User user = authService.registerUser(request);
            return ResponseEntity.ok().body("User registered successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /**
     *
     * @param request The login request containing username and password.
     * @return A {@link ResponseEntity} with the login response including the JWT token or an error message.
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody UserDto.LoginRequest request) {
        try {
            UserDto.LoginResponse response = authService.loginUser(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Authentication failed: " + e.getMessage());
        }
    }
}
