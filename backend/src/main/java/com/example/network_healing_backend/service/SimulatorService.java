package com.example.network_healing_backend.service;

import com.example.network_healing_backend.dto.AlarmRequest;
import com.example.network_healing_backend.dto.AlarmResponse;
import com.example.network_healing_backend.dto.NetworkEventRequest;
import com.example.network_healing_backend.dto.SimulatorRequest;
import com.example.network_healing_backend.dto.SimulatorResponse;
import com.example.network_healing_backend.entity.Alarm;
import com.example.network_healing_backend.entity.Device;
import com.example.network_healing_backend.exception.ResourceNotFoundException;
import com.example.network_healing_backend.repository.AlarmRepository;
import com.example.network_healing_backend.repository.DeviceRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
public class SimulatorService {

    private static final Logger log = LoggerFactory.getLogger(SimulatorService.class);

    private final DeviceRepository deviceRepository;
    private final AlarmRepository alarmRepository;
    private final DeviceService deviceService;
    private final AlarmService alarmService;
    private final NetworkEventService networkEventService;

    public SimulatorService(DeviceRepository deviceRepository,
                            AlarmRepository alarmRepository,
                            DeviceService deviceService,
                            AlarmService alarmService,
                            NetworkEventService networkEventService) {
        this.deviceRepository = deviceRepository;
        this.alarmRepository = alarmRepository;
        this.deviceService = deviceService;
        this.alarmService = alarmService;
        this.networkEventService = networkEventService;
    }

    /**
     * Injects synthetic fault into device, adjusts metrics, evaluates health, and generates alarm.
     */
    public SimulatorResponse injectFault(SimulatorRequest request) {
        Device device = resolveDevice(request);
        String faultType = request.getFaultType() != null ? request.getFaultType().toUpperCase() : "CPU_OVERLOAD";
        String service = request.getService() != null ? request.getService() : "ControlPlane-Core";

        String message;
        String rootCause;
        String recommendedAction;
        String severity = "HIGH";

        switch (faultType) {
            case "CPU_OVERLOAD":
            case "CPU_HIGH":
                device.setCpuUsage(96.5);
                message = String.format("Control plane CPU utilization spiked to 96.5%% on %s", service);
                rootCause = String.format("Thread contention and process runaway loop in %s", service);
                recommendedAction = "RESTART_SERVICE";
                severity = "HIGH";
                break;

            case "MEMORY_OVERLOAD":
            case "MEMORY_HIGH":
                device.setMemoryUsage(94.8);
                message = String.format("Heap buffer exhaustion alert: memory exceeded 94.8%% on %s", service);
                rootCause = String.format("Memory buffer leak in worker threads of %s", service);
                recommendedAction = "CLEAR_CACHE";
                severity = "HIGH";
                break;

            case "PACKET_LOSS":
                device.setPacketLoss(8.5);
                device.setLatency(72.0);
                message = String.format("High packet loss (8.5%%) and link error threshold breached on %s", service);
                rootCause = "Ingress queue drop exceeding ASIC profile threshold";
                recommendedAction = "REROUTE_TRAFFIC";
                severity = "CRITICAL";
                break;

            case "HIGH_LATENCY":
            case "LATENCY_HIGH":
                device.setLatency(148.0);
                device.setPacketLoss(3.2);
                message = String.format("Telemetry probe latency escalation (148.0 ms) detected on %s", service);
                rootCause = "Transceiver queue microburst buffer congestion";
                recommendedAction = "REROUTE_TRAFFIC";
                severity = "HIGH";
                break;

            case "DEVICE_DOWN":
            case "DEVICE_UNREACHABLE":
                device.setStatus("OFFLINE");
                device.setLatency(999.0);
                device.setPacketLoss(100.0);
                message = "Telemetry keepalive loss: Device unreachable on primary loopback address";
                rootCause = "Management control plane kernel crash and watchdog reset timeout";
                recommendedAction = "DEVICE_RECOVERY";
                severity = "CRITICAL";
                break;

            case "CONFIG_ERROR":
                device.setLatency(45.0);
                message = String.format("Syntax validation & BGP policy mismatch committed on %s", service);
                rootCause = "Invalid route policy prefix-list committed during push";
                recommendedAction = "RESTORE_CONFIGURATION";
                severity = "MEDIUM";
                break;

            case "TRAFFIC_SPIKE":
                device.setCpuUsage(88.0);
                device.setLatency(85.0);
                device.setPacketLoss(4.5);
                message = String.format("Severe ingress traffic surge (3.2x nominal capacity) on %s", service);
                rootCause = "Distributed microburst volume saturating spine uplinks";
                recommendedAction = "REROUTE_TRAFFIC";
                severity = "HIGH";
                break;

            default:
                device.setCpuUsage(85.0);
                message = String.format("Anomalous metric degradation observed on %s", service);
                rootCause = "Generic subsystem performance degradation";
                recommendedAction = "RESTART_SERVICE";
                break;
        }

        // Recalculate health and save device
        deviceService.evaluateHealth(device);
        deviceRepository.save(device);

        // Record telemetry event
        NetworkEventRequest eventReq = new NetworkEventRequest();
        eventReq.setDeviceId(device.getId());
        eventReq.setDeviceCode(device.getDeviceCode());
        eventReq.setDeviceName(device.getDeviceName());
        eventReq.setEventType(faultType);
        eventReq.setDescription(message);
        eventReq.setMetric(faultType);
        eventReq.setValue(device.getHealthScore());
        eventReq.setThreshold(75.0);
        eventReq.setSeverity(severity);
        networkEventService.recordEvent(eventReq);

        // Generate Alarm
        AlarmRequest alarmReq = new AlarmRequest();
        alarmReq.setDeviceId(device.getId());
        alarmReq.setDeviceCode(device.getDeviceCode());
        alarmReq.setDeviceName(device.getDeviceName());
        alarmReq.setService(service);
        alarmReq.setAlarmType(faultType);
        alarmReq.setSeverity(severity);
        alarmReq.setMessage(message);
        alarmReq.setStatus("ACTIVE");
        alarmReq.setSource("SIMULATOR");
        alarmReq.setFaultType(faultType);
        alarmReq.setRootCause(rootCause);
        alarmReq.setRecommendedAction(recommendedAction);
        AlarmResponse alarmResp = alarmService.createAlarm(alarmReq);

        SimulatorResponse response = new SimulatorResponse();
        response.setSuccess(true);
        response.setMessage(String.format("Fault '%s' injected into device %s. Alarm %s generated.", 
                faultType, device.getDeviceName(), alarmResp.getAlarmCode()));
        response.setFaultType(faultType);
        response.setDeviceId(device.getId());
        response.setDeviceCode(device.getDeviceCode());
        response.setDeviceName(device.getDeviceName());
        response.setAlarmId(alarmResp.getId());
        response.setAlarmCode(alarmResp.getAlarmCode());
        response.setNewHealthScore(device.getHealthScore());
        response.setNewStatus(device.getStatus());
        response.setGeneratedAlarm(alarmResp);

        log.info("Simulator injected fault: {} on device: {}", faultType, device.getDeviceName());
        return response;
    }

    /**
     * Injects synthetic traffic surge
     */
    public SimulatorResponse injectTraffic(SimulatorRequest request) {
        request.setFaultType("TRAFFIC_SPIKE");
        if (request.getService() == null) {
            request.setService("DataPlane-Fabric");
        }
        return injectFault(request);
    }

    /**
     * Resets all devices in database to clean 100% nominal state and resolves active alarms.
     */
    public SimulatorResponse resetAll() {
        List<Device> devices = deviceRepository.findAll();
        for (Device dev : devices) {
            dev.setStatus("ONLINE");
            dev.setCpuUsage(18.0 + (Math.random() * 10.0));
            dev.setMemoryUsage(30.0 + (Math.random() * 15.0));
            dev.setLatency(3.5 + (Math.random() * 3.0));
            dev.setPacketLoss(0.0);
            dev.setActiveAlarmsCount(0);
            dev.setLastSeen(LocalDateTime.now());
            deviceService.evaluateHealth(dev);
            deviceRepository.save(dev);
        }

        // Mark active alarms as RESOLVED
        List<Alarm> activeAlarms = alarmRepository.findByStatus("ACTIVE");
        for (Alarm alarm : activeAlarms) {
            alarm.setStatus("RESOLVED");
            alarm.setResolvedAt(LocalDateTime.now());
            alarmRepository.save(alarm);
        }

        SimulatorResponse response = new SimulatorResponse();
        response.setSuccess(true);
        response.setMessage("All devices and active simulated alarms reset to healthy nominal baseline (100% health).");
        response.setNewStatus("ONLINE");
        response.setNewHealthScore(100.0);

        log.info("System simulation reset completed for {} devices", devices.size());
        return response;
    }

    private Device resolveDevice(SimulatorRequest req) {
        Device device = null;
        if (req.getDeviceId() != null) {
            device = deviceRepository.findById(req.getDeviceId()).orElse(null);
        }
        if (device == null && req.getDeviceCode() != null) {
            device = deviceRepository.findByDeviceCode(req.getDeviceCode()).orElse(null);
        }
        if (device == null) {
            // Pick first device or throw
            device = deviceRepository.findAll().stream().findFirst()
                    .orElseThrow(() -> new ResourceNotFoundException("No devices available to simulate fault on"));
        }
        return device;
    }
}
