package com.example.network_healing_backend.service;

import com.example.network_healing_backend.dto.*;
import com.example.network_healing_backend.entity.Alarm;
import com.example.network_healing_backend.entity.Device;
import com.example.network_healing_backend.entity.HealingAction;
import com.example.network_healing_backend.exception.ResourceNotFoundException;
import com.example.network_healing_backend.repository.AlarmRepository;
import com.example.network_healing_backend.repository.DeviceRepository;
import com.example.network_healing_backend.repository.HealingActionRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
public class HealingService {

    private static final Logger log = LoggerFactory.getLogger(HealingService.class);

    private final HealingActionRepository healingActionRepository;
    private final DeviceRepository deviceRepository;
    private final AlarmRepository alarmRepository;
    private final DeviceService deviceService;
    private final AlarmService alarmService;
    private final RcaService rcaService;
    private final RecoveryService recoveryService;

    public HealingService(HealingActionRepository healingActionRepository,
                          DeviceRepository deviceRepository,
                          AlarmRepository alarmRepository,
                          DeviceService deviceService,
                          AlarmService alarmService,
                          RcaService rcaService,
                          @Lazy RecoveryService recoveryService) {
        this.healingActionRepository = healingActionRepository;
        this.deviceRepository = deviceRepository;
        this.alarmRepository = alarmRepository;
        this.deviceService = deviceService;
        this.alarmService = alarmService;
        this.rcaService = rcaService;
        this.recoveryService = recoveryService;
    }

    public List<HealingResponse> getAllHealingActions() {
        return healingActionRepository.findAllByOrderByExecutedAtDesc().stream()
                .map(HealingResponse::fromEntity)
                .toList();
    }

    public HealingResponse getHealingActionById(Long id) {
        HealingAction action = healingActionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Healing Action not found with id: " + id));
        return HealingResponse.fromEntity(action);
    }

    public HealingResponse executeHealing(HealingRequest request) {
        Device device = null;
        Alarm alarm = null;

        if (request.getDeviceId() != null) {
            device = deviceRepository.findById(request.getDeviceId()).orElse(null);
        }
        if (request.getAlarmId() != null) {
            alarm = alarmRepository.findById(request.getAlarmId()).orElse(null);
            if (device == null && alarm != null && alarm.getDeviceId() != null) {
                device = deviceRepository.findById(alarm.getDeviceId()).orElse(null);
            }
        }

        HealingAction action = new HealingAction();
        action.setActionType(request.getActionType());
        action.setDescription(request.getDescription() != null ? request.getDescription() : "Executing autonomous action " + request.getActionType());
        action.setDeviceId(device != null ? device.getId() : request.getDeviceId());
        action.setDeviceCode(device != null ? device.getDeviceCode() : request.getDeviceCode());
        action.setDeviceName(device != null ? device.getDeviceName() : "Network-Device");
        action.setAlarmId(alarm != null ? alarm.getId() : request.getAlarmId());
        action.setAlarmCode(alarm != null ? alarm.getAlarmCode() : request.getAlarmCode());
        action.setRcaId(request.getRcaId());
        action.setStatus("IN_PROGRESS");
        action.setProgressPct(50);
        action.setExecutedAt(LocalDateTime.now());

        // Perform safe simulation layer remediation
        performSafeHealingSimulation(action, device, alarm);

        HealingAction saved = healingActionRepository.save(action);
        if (saved.getActionCode() == null) {
            saved.setActionCode("ACT-" + (1000 + saved.getId()));
            saved = healingActionRepository.save(saved);
        }

        log.info("Executed healing action: {} for device: {}, result: {}", 
                saved.getActionType(), saved.getDeviceName(), saved.getStatus());

        return HealingResponse.fromEntity(saved);
    }

    /**
     * Complete Autonomous Workflow Implementation:
     * detectAlarm() -> analyzeRootCause() -> selectHealingAction() -> executeHealing() -> verifyHealth()
     * if successful: resolve alarm
     * else: create and execute recovery plan
     */
    public AutonomousWorkflowResponse executeAutonomousWorkflow(Long alarmId) {
        Alarm alarm = alarmRepository.findById(alarmId)
                .orElseThrow(() -> new ResourceNotFoundException("Alarm not found with id: " + alarmId));

        Device device = null;
        if (alarm.getDeviceId() != null) {
            device = deviceRepository.findById(alarm.getDeviceId()).orElse(null);
        }

        AutonomousWorkflowResponse workflow = new AutonomousWorkflowResponse();
        workflow.setAlarmId(alarm.getId());
        workflow.setAlarmCode(alarm.getAlarmCode());
        workflow.setDeviceId(device != null ? device.getId() : null);
        workflow.setDeviceCode(device != null ? device.getDeviceCode() : null);
        workflow.setDeviceName(device != null ? device.getDeviceName() : alarm.getDeviceName());
        workflow.setTriggerSeverity(alarm.getSeverity());
        workflow.setDetectedFault(alarm.getFaultType() != null ? alarm.getFaultType() : alarm.getMessage());

        // Step 1 & 2: Analyze Root Cause
        alarm.setStatus("ANALYZING");
        alarmRepository.save(alarm);
        RcaRequest rcaReq = new RcaRequest(device != null ? device.getId() : null, alarm.getId());
        RcaResponse rca = rcaService.analyzeRootCause(rcaReq);
        workflow.setRcaAnalysis(rca);

        // Step 3: Select Action
        String selectedAction = rca.getRecommendedAction() != null ? rca.getRecommendedAction() : "RESTART_SERVICE";
        workflow.setSelectedHealingAction(selectedAction);

        // Step 4: Execute Action (Safe Simulation)
        HealingRequest healReq = new HealingRequest();
        healReq.setDeviceId(device != null ? device.getId() : null);
        healReq.setAlarmId(alarm.getId());
        healReq.setRcaId(rca.getId());
        healReq.setActionType(selectedAction);
        healReq.setDescription("Autonomous mitigation playbook triggered for " + rca.getRootCause());

        HealingResponse healResp = executeHealing(healReq);
        workflow.setHealingExecution(healResp);

        // Step 5: Verify Health & Complete Workflow
        if (device != null) {
            device = deviceRepository.findById(device.getId()).orElse(device);
        }

        boolean isHealthy = "SUCCESS".equalsIgnoreCase(healResp.getStatus()) && (device == null || device.getHealthScore() >= 75.0);

        if (isHealthy) {
            alarmService.resolveAlarm(alarm.getId());
            workflow.setSuccess(true);
            workflow.setAlarmResolved(true);
            workflow.setUpdatedHealthScore(device != null ? device.getHealthScore() : 100.0);
            workflow.setUpdatedDeviceStatus(device != null ? device.getStatus() : "ONLINE");
            workflow.setWorkflowSummary(String.format("Autonomous healing successfully resolved %s (%s). Action '%s' restored health to %.1f%%.",
                    alarm.getAlarmCode(), alarm.getMessage(), selectedAction, device != null ? device.getHealthScore() : 100.0));
        } else {
            // Escalate to Recovery Engine
            workflow.setSuccess(false);
            workflow.setAlarmResolved(false);
            RecoveryRequest recReq = new RecoveryRequest();
            recReq.setDeviceId(device != null ? device.getId() : null);
            recReq.setHealingActionId(healResp.getId());
            recReq.setPlanName("Fallback Disaster Recovery Plan for " + alarm.getAlarmCode());
            recReq.setSteps("1. Isolate primary link\n2. Shift traffic to redundant spine\n3. Cold restart hardware controller\n4. Synchronize state");
            recReq.setService(alarm.getService());
            recReq.setFaultType(alarm.getFaultType());
            recReq.setRootCause(rca.getRootCause());
            recReq.setHealingActionType(selectedAction);

            RecoveryResponse recResp = recoveryService.executeRecovery(recReq);
            workflow.setRecoveryPlan(recResp);
            workflow.setUpdatedHealthScore(device != null ? device.getHealthScore() : 50.0);
            workflow.setUpdatedDeviceStatus(device != null ? device.getStatus() : "DEGRADED");
            workflow.setWorkflowSummary(String.format("Primary healing failed or partial. Escalated to recovery plan %s.", recResp.getPlanCode()));
        }

        return workflow;
    }

    /**
     * Safe Simulation Layer:
     * Does NOT execute real destructive operating system commands.
     * Accurately transitions simulated device telemetry to normal healthy ranges.
     */
    private void performSafeHealingSimulation(HealingAction action, Device device, Alarm alarm) {
        StringBuilder logBuilder = new StringBuilder();
        logBuilder.append("Telemetry trigger ingested by Autonomous Healing Engine\n");

        String actionType = action.getActionType() != null ? action.getActionType().toUpperCase() : "RESTART_SERVICE";

        switch (actionType) {
            case "RESTART_SERVICE":
                logBuilder.append("Isolating failing worker PID threads\n");
                logBuilder.append("Dispatching graceful microservice restart command\n");
                logBuilder.append("Process initialized with PID allocation, worker pool active\n");
                if (device != null) {
                    device.setCpuUsage(24.5);
                    device.setMemoryUsage(35.0);
                }
                break;

            case "RESTORE_CONFIGURATION":
                logBuilder.append("Matching configuration drift hash against checkpoint repository\n");
                logBuilder.append("Rolling back syntax diff to Golden Checkpoint #492\n");
                logBuilder.append("BGP prefix-list community policy restored and committed\n");
                break;

            case "REROUTE_TRAFFIC":
            case "REDUCE_TRAFFIC":
                logBuilder.append("Calculating alternate cost-metric path over secondary fabric\n");
                logBuilder.append("Applying BGP FlowSpec dynamic diversion policy\n");
                logBuilder.append("Draining congested ingress queue; traffic successfully shifted\n");
                if (device != null) {
                    device.setLatency(4.8);
                    device.setPacketLoss(0.0);
                }
                break;

            case "CLEAR_CACHE":
                logBuilder.append("Executing memory compaction and cache eviction\n");
                logBuilder.append("Flushed 4.2 GB stale buffers; kernel memory pressure normalized\n");
                if (device != null) {
                    device.setMemoryUsage(32.0);
                }
                break;

            case "DEVICE_RECOVERY":
            case "RESET_CONNECTION":
            case "RESTART_INTERFACE":
                logBuilder.append("Issuing out-of-band IPMI telemetry reset\n");
                logBuilder.append("Subsystem warm reboot completed; link optics locked\n");
                if (device != null) {
                    device.setStatus("ONLINE");
                    device.setCpuUsage(28.0);
                    device.setMemoryUsage(38.0);
                    device.setLatency(5.2);
                    device.setPacketLoss(0.0);
                }
                break;

            default:
                logBuilder.append("Executing generic remediation playbook: ").append(actionType).append("\n");
                break;
        }

        if (device != null) {
            deviceService.evaluateHealth(device);
            deviceRepository.save(device);
        }

        logBuilder.append("Post-heal telemetry health check verified: Metrics in nominal range\n");

        action.setStatus("SUCCESS");
        action.setProgressPct(100);
        action.setCompletedAt(LocalDateTime.now());
        action.setResult("Autonomous mitigation verified successfully. Device restored to nominal state.");
        action.setLogs(logBuilder.toString());
    }
}
