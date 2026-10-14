package com.example.network_healing_backend.repository;

import com.example.network_healing_backend.entity.Alarm;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AlarmRepository extends JpaRepository<Alarm, Long> {

    Optional<Alarm> findByAlarmCode(String alarmCode);

    List<Alarm> findByDeviceId(Long deviceId);

    List<Alarm> findByStatus(String status);

    List<Alarm> findBySeverity(String severity);

    List<Alarm> findByStatusAndSeverity(String status, String severity);

    long countByStatus(String status);

    long countBySeverity(String severity);

    long countByStatusAndSeverity(String status, String severity);

    @Query("SELECT a FROM Alarm a WHERE " +
           "(:status IS NULL OR a.status = :status) AND " +
           "(:severity IS NULL OR a.severity = :severity) " +
           "ORDER BY a.detectedAt DESC")
    List<Alarm> findByStatusAndSeverityFilter(@Param("status") String status, @Param("severity") String severity);
}
