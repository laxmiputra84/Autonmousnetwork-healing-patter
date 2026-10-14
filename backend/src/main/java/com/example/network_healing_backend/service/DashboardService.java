package com.example.network_healing_backend.service;

import com.example.network_healing_backend.dto.AlarmResponse;
import com.example.network_healing_backend.dto.DashboardResponse;
import com.example.network_healing_backend.dto.HealingResponse;
import com.example.network_healing_backend.entity.Alarm;
import com.example.network_healing_backend.entity.Device;
import com.example.network_healing_backend.entity.HealingAction;
import com.example.network_healing_backend.repository.AlarmRepository;
import com.example.network_healing_backend.repository.DeviceRepository;
import com.example.network_healing_backend.repository.HealingActionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly = true)
public class DashboardService {

    private final DeviceRepository deviceRepository;
    private final AlarmRepository alarmRepository;
    private final HealingActionRepository healingActionRepository;

    public DashboardService(DeviceRepository deviceRepository,
                            AlarmRepository alarmRepository,
                            HealingActionRepository healingActionRepository) {
        this.deviceRepository = deviceRepository;
        this.alarmRepository = alarmRepository;
        this.healingActionRepository = healingActionRepository;
    }

    /**
     * Calculates live dashboard telemetry & incident metrics directly from database
     */
    public DashboardResponse getDashboardMetrics() {
        DashboardResponse resp = new DashboardResponse();

        long totalDevices = deviceRepository.count();
        long onlineDevices = deviceRepository.countByStatus("ONLINE");
        long offlineDevices = deviceRepository.countByStatus("OFFLINE");
        long degradedDevices = deviceRepository.countByStatus("DEGRADED");

        long activeAlarms = alarmRepository.countByStatus("ACTIVE");
        long criticalAlarms = alarmRepository.countBySeverity("CRITICAL");

        long totalHealingActions = healingActionRepository.count();
        long successfulHealing = healingActionRepository.countByStatus("SUCCESS");
        long failedHealing = healingActionRepository.countByStatus("FAILED");

        Double avgHealth = deviceRepository.getAverageHealthScore();
        if (avgHealth == null) {
            avgHealth = totalDevices > 0 ? 100.0 : 0.0;
        }

        resp.setTotalDevices(totalDevices);
        resp.setOnlineDevices(onlineDevices);
        resp.setOfflineDevices(offlineDevices);
        resp.setDegradedDevices(degradedDevices);
        resp.setActiveAlarms(activeAlarms);
        resp.setCriticalAlarms(criticalAlarms);
        resp.setHealingActions(totalHealingActions);
        resp.setSuccessfulHealing(successfulHealing);
        resp.setFailedHealing(failedHealing);
        resp.setAverageHealthScore(Math.round(avgHealth * 10.0) / 10.0);

        // Fetch up to 5 recent alarms
        List<Alarm> recentAlarmsList = alarmRepository.findAll().stream()
                .sorted((a1, a2) -> a2.getDetectedAt().compareTo(a1.getDetectedAt()))
                .limit(5)
                .toList();

        resp.setRecentAlarms(recentAlarmsList.stream()
                .map(a -> {
                    Device dev = a.getDeviceId() != null ? deviceRepository.findById(a.getDeviceId()).orElse(null) : null;
                    return AlarmResponse.fromEntity(a, dev);
                })
                .toList());

        // Fetch up to 5 recent healing actions
        List<HealingAction> recentActionsList = healingActionRepository.findAll().stream()
                .sorted((h1, h2) -> h2.getExecutedAt().compareTo(h1.getExecutedAt()))
                .limit(5)
                .toList();

        resp.setRecentHealingActions(recentActionsList.stream()
                .map(HealingResponse::fromEntity)
                .toList());

        return resp;
    }
}
