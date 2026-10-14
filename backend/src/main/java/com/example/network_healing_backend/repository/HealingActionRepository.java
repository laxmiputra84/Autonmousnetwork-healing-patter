package com.example.network_healing_backend.repository;

import com.example.network_healing_backend.entity.HealingAction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface HealingActionRepository extends JpaRepository<HealingAction, Long> {

    Optional<HealingAction> findByActionCode(String actionCode);

    List<HealingAction> findByDeviceId(Long deviceId);

    List<HealingAction> findByAlarmId(Long alarmId);

    List<HealingAction> findByStatus(String status);

    long countByStatus(String status);

    List<HealingAction> findAllByOrderByExecutedAtDesc();
}
