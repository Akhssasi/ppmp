package com.ppmp.modules.task.repository;

import com.ppmp.modules.task.entity.Task;
import com.ppmp.shared.enums.TaskStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface TaskRepository extends JpaRepository<Task, UUID> {

    List<Task> findByProjectIdOrderByCreatedAtAsc(UUID projectId);

    List<Task> findByProjectIdAndStatusOrderByCreatedAtAsc(UUID projectId, TaskStatus status);

    Optional<Task> findByIdAndProjectId(UUID id, UUID projectId);

    long countByProjectId(UUID projectId);

    long countByProjectIdAndStatus(UUID projectId, TaskStatus status);

    long countByAssignedToId(UUID assignedToId);

    @Modifying
    @Query("UPDATE Task t SET t.status = :status WHERE t.id = :taskId AND t.project.id = :projectId")
    int updateStatus(@Param("taskId") UUID taskId, @Param("projectId") UUID projectId, @Param("status") TaskStatus status);

    @Query("SELECT t.status, COUNT(t) FROM Task t WHERE t.project.id = :projectId GROUP BY t.status")
    List<Object[]> countByStatusForProject(@Param("projectId") UUID projectId);

    @Query("SELECT COUNT(t) FROM Task t WHERE t.project.owner.id = :ownerId")
    long countByOwnerId(@Param("ownerId") UUID ownerId);

    @Query("SELECT COUNT(t) FROM Task t WHERE t.project.owner.id = :ownerId AND t.status = com.ppmp.shared.enums.TaskStatus.DONE")
    long countDoneByOwnerId(@Param("ownerId") UUID ownerId);

    @Query("SELECT COUNT(t) FROM Task t WHERE t.project.owner.id = :ownerId AND t.status = com.ppmp.shared.enums.TaskStatus.IN_PROGRESS")
    long countInProgressByOwnerId(@Param("ownerId") UUID ownerId);
}
