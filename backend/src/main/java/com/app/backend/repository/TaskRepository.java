package com.app.backend.repository;

import com.app.backend.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

/**
 * Spring Data JPA repository for the {@link Task} entity.
 * It provides methods for performing CRUD operations on the 'tasks' table.
 */
@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByUserId(Long userId);
}