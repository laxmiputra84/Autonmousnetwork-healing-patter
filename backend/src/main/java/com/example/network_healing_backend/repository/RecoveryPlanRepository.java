package com.example.network_healing_backend.repository;

import com.example.network_healing_backend.entity.RecoveryPlan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RecoveryPlanRepository extends JpaRepository<RecoveryPlan, Long> {

    Optional<RecoveryPlan> findByPlanCode(String planCode);

    List<RecoveryPlan> findByDeviceId(Long deviceId);

    List<RecoveryPlan> findByStatus(String status);

    List<RecoveryPlan> findAllByOrderByStartedAtDesc();
}
