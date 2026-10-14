package com.example.network_healing_backend.service;

import com.example.network_healing_backend.dto.RecoveryRequest;
import com.example.network_healing_backend.dto.RecoveryResponse;
import com.example.network_healing_backend.entity.Device;
import com.example.network_healing_backend.entity.RecoveryPlan;
import com.example.network_healing_backend.exception.ResourceNotFoundException;
import com.example.network_healing_backend.repository.DeviceRepository;
import com.example.network_healing_backend.repository.RecoveryPlanRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
public class RecoveryService {

    private static final Logger log = LoggerFactory.getLogger(RecoveryService.class);

    private final RecoveryPlanRepository recoveryPlanRepository;
    private final DeviceRepository deviceRepository;
    private final DeviceService deviceService;

    public RecoveryService(RecoveryPlanRepository recoveryPlanRepository,
                           DeviceRepository deviceRepository,
                           DeviceService deviceService) {
        this.recoveryPlanRepository = recoveryPlanRepository;
        this.deviceRepository = deviceRepository;
        this.deviceService = deviceService;
    }

    public List<RecoveryResponse> getAllRecoveryPlans() {
        return recoveryPlanRepository.findAllByOrderByStartedAtDesc().stream()
                .map(RecoveryResponse::fromEntity)
                .toList();
    }

    public RecoveryResponse getRecoveryPlanById(Long id) {
        RecoveryPlan plan = recoveryPlanRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Recovery Plan not found with id: " + id));
        return RecoveryResponse.fromEntity(plan);
    }

    public RecoveryResponse executeRecovery(RecoveryRequest request) {
        Device device = null;
        if (request.getDeviceId() != null) {
            device = deviceRepository.findById(request.getDeviceId()).orElse(null);
        } else if (request.getDeviceCode() != null) {
            device = deviceRepository.findByDeviceCode(request.getDeviceCode()).orElse(null);
        }

        RecoveryPlan plan = new RecoveryPlan();
        plan.setDeviceId(device != null ? device.getId() : request.getDeviceId());
        plan.setDeviceCode(device != null ? device.getDeviceCode() : request.getDeviceCode());
        plan.setDeviceName(device != null ? device.getDeviceName() : "Network Hardware");
        plan.setHealingActionId(request.getHealingActionId());
        plan.setPlanName(request.getPlanName() != null ? request.getPlanName() : "Automated Disaster Recovery Procedure");
        plan.setService(request.getService());
        plan.setFaultType(request.getFaultType());
        plan.setRootCause(request.getRootCause());
        plan.setHealingActionType(request.getHealingActionType());
        plan.setSteps(request.getSteps() != null ? request.getSteps() : 
                "Step 1: Drain traffic\nStep 2: Graceful microcode reset\nStep 3: Reprogram FIB tables\nStep 4: Verify convergence");
        plan.setTechnicianMode(request.getTechnicianMode() != null ? request.getTechnicianMode() : "FULLY_AUTONOMOUS");
        plan.setStartedAt(LocalDateTime.now());
        plan.setStatus("IN_PROGRESS");

        // Safe recovery execution simulation
        if (device != null) {
            device.setStatus("ONLINE");
            device.setCpuUsage(20.0);
            device.setMemoryUsage(30.0);
            device.setLatency(4.0);
            device.setPacketLoss(0.0);
            deviceService.evaluateHealth(device);
            deviceRepository.save(device);
        }

        plan.setStatus("SUCCESS");
        plan.setResult("Full system state recovered and verified via synthetic end-to-end telemetry probes.");
        plan.setVerificationMessage("All redundant paths converged with zero packet drop. SLA restored.");
        plan.setMttrSeconds(55);
        plan.setCompletedAt(LocalDateTime.now());

        RecoveryPlan saved = recoveryPlanRepository.save(plan);
        if (saved.getPlanCode() == null) {
            saved.setPlanCode("REC-" + (1000 + saved.getId()));
            saved = recoveryPlanRepository.save(saved);
        }

        log.info("Recovery plan executed: {} for device {}", saved.getPlanCode(), saved.getDeviceName());
        return RecoveryResponse.fromEntity(saved);
    }
}
