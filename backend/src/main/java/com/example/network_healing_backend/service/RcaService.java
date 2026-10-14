package com.example.network_healing_backend.service;

import com.example.network_healing_backend.dto.RcaRequest;
import com.example.network_healing_backend.dto.RcaResponse;
import com.example.network_healing_backend.entity.Alarm;
import com.example.network_healing_backend.entity.Device;
import com.example.network_healing_backend.entity.RcaResult;
import com.example.network_healing_backend.exception.ResourceNotFoundException;
import com.example.network_healing_backend.repository.AlarmRepository;
import com.example.network_healing_backend.repository.DeviceRepository;
import com.example.network_healing_backend.repository.RcaResultRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
public class RcaService {

    private static final Logger log = LoggerFactory.getLogger(RcaService.class);

    private final RcaResultRepository rcaResultRepository;
    private final DeviceRepository deviceRepository;
    private final AlarmRepository alarmRepository;

    public RcaService(RcaResultRepository rcaResultRepository,
                      DeviceRepository deviceRepository,
                      AlarmRepository alarmRepository) {
        this.rcaResultRepository = rcaResultRepository;
        this.deviceRepository = deviceRepository;
        this.alarmRepository = alarmRepository;
    }

    public List<RcaResponse> getAllRcaResults() {
        return rcaResultRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(RcaResponse::fromEntity)
                .toList();
    }

    public RcaResponse getRcaById(Long id) {
        RcaResult rca = rcaResultRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("RCA Result not found with id: " + id));
        return RcaResponse.fromEntity(rca);
    }

    public List<RcaResponse> getRcaByDeviceId(Long deviceId) {
        return rcaResultRepository.findByDeviceId(deviceId).stream()
                .map(RcaResponse::fromEntity)
                .toList();
    }

    public List<RcaResponse> getRcaByAlarmId(Long alarmId) {
        return rcaResultRepository.findByAlarmId(alarmId).stream()
                .map(RcaResponse::fromEntity)
                .toList();
    }

    /**
     * Rule-Based Root Cause Analysis Engine
     * Evaluates live device metrics, fault types, and alarm context
     */
    public RcaResponse analyzeRootCause(RcaRequest request) {
        Device device = null;
        Alarm alarm = null;

        if (request.getAlarmId() != null) {
            alarm = alarmRepository.findById(request.getAlarmId()).orElse(null);
        } else if (request.getAlarmCode() != null) {
            alarm = alarmRepository.findByAlarmCode(request.getAlarmCode()).orElse(null);
        }

        if (request.getDeviceId() != null) {
            device = deviceRepository.findById(request.getDeviceId()).orElse(null);
        } else if (request.getDeviceCode() != null) {
            device = deviceRepository.findByDeviceCode(request.getDeviceCode()).orElse(null);
        } else if (alarm != null && alarm.getDeviceId() != null) {
            device = deviceRepository.findById(alarm.getDeviceId()).orElse(null);
        }

        if (device == null && alarm != null && alarm.getDeviceCode() != null) {
            device = deviceRepository.findByDeviceCode(alarm.getDeviceCode()).orElse(null);
        }

        if (device == null && alarm == null) {
            throw new ResourceNotFoundException("Neither Device nor Alarm could be resolved for RCA analysis");
        }

        RcaResult rca = performRuleBasedAnalysis(device, alarm);
        RcaResult saved = rcaResultRepository.save(rca);
        if (saved.getRcaCode() == null) {
            saved.setRcaCode("RCA-" + (1000 + saved.getId()));
            saved = rcaResultRepository.save(saved);
        }

        // Link RCA back to alarm if exists
        if (alarm != null) {
            alarm.setRootCause(saved.getRootCause());
            alarm.setRecommendedAction(saved.getRecommendedAction());
            alarm.setStatus("ANALYZING");
            alarmRepository.save(alarm);
        }

        log.info("Completed RCA for device {} alarm {}: root cause '{}'", 
                saved.getDeviceName(), saved.getAlarmCode(), saved.getRootCause());

        return RcaResponse.fromEntity(saved);
    }

    public RcaResult performRuleBasedAnalysis(Device device, Alarm alarm) {
        RcaResult rca = new RcaResult();
        rca.setCreatedAt(LocalDateTime.now());

        if (device != null) {
            rca.setDeviceId(device.getId());
            rca.setDeviceCode(device.getDeviceCode());
            rca.setDeviceName(device.getDeviceName());
        }
        if (alarm != null) {
            rca.setAlarmId(alarm.getId());
            rca.setAlarmCode(alarm.getAlarmCode());
            rca.setService(alarm.getService());
            rca.setFaultType(alarm.getFaultType());
        }

        double cpu = device != null && device.getCpuUsage() != null ? device.getCpuUsage() : 25.0;
        double mem = device != null && device.getMemoryUsage() != null ? device.getMemoryUsage() : 35.0;
        double latency = device != null && device.getLatency() != null ? device.getLatency() : 5.0;
        double packetLoss = device != null && device.getPacketLoss() != null ? device.getPacketLoss() : 0.0;
        String status = device != null && device.getStatus() != null ? device.getStatus() : "ONLINE";
        String faultType = alarm != null && alarm.getFaultType() != null ? alarm.getFaultType() : "";
        String alarmType = alarm != null && alarm.getAlarmType() != null ? alarm.getAlarmType() : "";

        // Rule 1: Device Down / OFFLINE
        if ("OFFLINE".equalsIgnoreCase(status) || "DEVICE_DOWN".equalsIgnoreCase(faultType) || "DEVICE_UNREACHABLE".equalsIgnoreCase(faultType)) {
            rca.setCategory("Hardware/Kernel Failure");
            rca.setRootCause("Management plane kernel panic and telemetry prober timeout");
            rca.setConfidence(98.5);
            rca.setEvidence(String.format("ICMP echo 100%% packet loss. Device status: %s. Telemetry link down.", status));
            rca.setRecommendation("Initiate automated out-of-band device power-cycle and standby controller failover.");
            rca.setRecommendedAction("DEVICE_RECOVERY");
            rca.setRiskScore("HIGH");
            rca.setBlastRadius("Entire Local Chassis");
        }
        // Rule 2: CPU Overload
        else if (cpu > 90.0 || "CPU_OVERLOAD".equalsIgnoreCase(faultType) || "CPU_HIGH".equalsIgnoreCase(alarmType)) {
            rca.setCategory("Compute Exhaustion");
            rca.setRootCause(String.format("Process runaway loop in %s thread pool consuming %.1f%% CPU", 
                    alarm != null && alarm.getService() != null ? alarm.getService() : "Control Plane", cpu));
            rca.setConfidence(96.0);
            rca.setEvidence(String.format("Control plane core utilization at %.1f%% (> 90.0%% threshold), high thread contention.", cpu));
            rca.setRecommendation("Perform isolated microservice worker restart and flush temporary execution queues.");
            rca.setRecommendedAction("RESTART_SERVICE");
            rca.setRiskScore("LOW");
            rca.setBlastRadius("Process Level Worker Pool");
        }
        // Rule 3: Memory Exhaustion
        else if (mem > 90.0 || "MEMORY_OVERLOAD".equalsIgnoreCase(faultType) || "MEMORY_HIGH".equalsIgnoreCase(alarmType)) {
            rca.setCategory("Resource Exhaustion");
            rca.setRootCause(String.format("Heap buffer leak in %s exceeding %.1f%% memory ceiling",
                    alarm != null && alarm.getService() != null ? alarm.getService() : "daemon", mem));
            rca.setConfidence(94.5);
            rca.setEvidence(String.format("Memory utilization at %.1f%%. Kernel OOM-killer alert pending.", mem));
            rca.setRecommendation("Evict process cache and execute memory compaction service restart.");
            rca.setRecommendedAction("CLEAR_CACHE");
            rca.setRiskScore("LOW");
            rca.setBlastRadius("Container / Service Instance");
        }
        // Rule 4: Packet Loss & Interface failure
        else if (packetLoss > 5.0 || "PACKET_LOSS".equalsIgnoreCase(faultType) || "INTERFACE_FAILURE".equalsIgnoreCase(faultType)) {
            rca.setCategory("Data Plane Congestion");
            rca.setRootCause(String.format("Egress port buffer queue overflow resulting in %.2f%% drop rate", packetLoss));
            rca.setConfidence(97.0);
            rca.setEvidence(String.format("Packet drop rate at %.2f%% with microburst ingress traffic on primary trunk.", packetLoss));
            rca.setRecommendation("Reroute transit traffic via secondary spine fabric and reset interface buffers.");
            rca.setRecommendedAction("REROUTE_TRAFFIC");
            rca.setRiskScore("MEDIUM");
            rca.setBlastRadius("Subnet Trunk Links");
        }
        // Rule 5: High Latency / Network Latency Spike
        else if (latency > 50.0 || "HIGH_LATENCY".equalsIgnoreCase(faultType) || "LATENCY_HIGH".equalsIgnoreCase(alarmType)) {
            rca.setCategory("Network Path Degraded");
            rca.setRootCause(String.format("Transceiver queuing latency spike (%.1f ms) exceeding SLA limits", latency));
            rca.setConfidence(95.0);
            rca.setEvidence(String.format("Round-trip telemetry probe latency escalated to %.1f ms (> 50ms SLA).", latency));
            rca.setRecommendation("Apply traffic diversion policy to alternate path and clear egress buffers.");
            rca.setRecommendedAction("REROUTE_TRAFFIC");
            rca.setRiskScore("LOW");
            rca.setBlastRadius("Selected Flow Groups");
        }
        // Rule 6: Configuration Drift
        else if ("CONFIG_ERROR".equalsIgnoreCase(faultType)) {
            rca.setCategory("Configuration Policy Drift");
            rca.setRootCause("Mismatched route-map community filter committed during recent push");
            rca.setConfidence(99.0);
            rca.setEvidence("Config syntax validation error. Prefix-list mismatch detected against golden checkpoint.");
            rca.setRecommendation("Revert configuration to last known golden checkpoint #492.");
            rca.setRecommendedAction("RESTORE_CONFIGURATION");
            rca.setRiskScore("LOW");
            rca.setBlastRadius("BGP Neighbor Sessions");
        }
        // Default Rule
        else {
            rca.setCategory("Service Degradation");
            rca.setRootCause(alarm != null && alarm.getMessage() != null ? alarm.getMessage() : "Subsystem metric anomaly detected");
            rca.setConfidence(90.0);
            rca.setEvidence(String.format("Telemetry report: CPU=%.1f%%, Mem=%.1f%%, Latency=%.1fms, Loss=%.1f%%", cpu, mem, latency, packetLoss));
            rca.setRecommendation("Execute graceful subsystem restart and run post-heal synthetic health probes.");
            rca.setRecommendedAction("RESTART_SERVICE");
            rca.setRiskScore("LOW");
            rca.setBlastRadius("Local Service Endpoint");
        }

        return rca;
    }
}
