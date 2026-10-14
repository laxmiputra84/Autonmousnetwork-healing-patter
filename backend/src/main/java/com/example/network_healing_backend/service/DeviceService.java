package com.example.network_healing_backend.service;

import com.example.network_healing_backend.dto.DeviceRequest;
import com.example.network_healing_backend.dto.DeviceResponse;
import com.example.network_healing_backend.entity.Device;
import com.example.network_healing_backend.exception.ResourceNotFoundException;
import com.example.network_healing_backend.repository.DeviceRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
public class DeviceService {

    private static final Logger log = LoggerFactory.getLogger(DeviceService.class);

    private final DeviceRepository deviceRepository;

    public DeviceService(DeviceRepository deviceRepository) {
        this.deviceRepository = deviceRepository;
    }

    public List<DeviceResponse> getAllDevices() {
        return deviceRepository.findAll().stream()
                .map(DeviceResponse::fromEntity)
                .toList();
    }

    public DeviceResponse getDeviceById(Long id) {
        Device device = findEntityById(id);
        return DeviceResponse.fromEntity(device);
    }

    public Device findEntityById(Long id) {
        return deviceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Device not found with id: " + id));
    }

    public Device findByDeviceCode(String code) {
        return deviceRepository.findByDeviceCode(code).orElse(null);
    }

    public DeviceResponse createDevice(DeviceRequest request) {
        Device device = new Device();
        mapRequestToEntity(request, device);
        evaluateHealth(device);
        Device saved = deviceRepository.save(device);
        if (saved.getDeviceCode() == null || saved.getDeviceCode().isBlank()) {
            saved.setDeviceCode("DEV-" + saved.getId());
            saved = deviceRepository.save(saved);
        }
        log.info("Created device: {} ({})", saved.getDeviceName(), saved.getDeviceCode());
        return DeviceResponse.fromEntity(saved);
    }

    public DeviceResponse updateDevice(Long id, DeviceRequest request) {
        Device device = findEntityById(id);
        mapRequestToEntity(request, device);
        evaluateHealth(device);
        Device updated = deviceRepository.save(device);
        log.info("Updated device: {} with status {}", updated.getDeviceName(), updated.getStatus());
        return DeviceResponse.fromEntity(updated);
    }

    public void deleteDevice(Long id) {
        Device device = findEntityById(id);
        deviceRepository.delete(device);
        log.info("Deleted device id: {}", id);
    }

    public Device saveEntity(Device device) {
        evaluateHealth(device);
        return deviceRepository.save(device);
    }

    /**
     * Automatic Health Evaluation Mechanism
     * Base Score = 100
     * - CPU > 80: decrease by 25
     * - Memory > 80: decrease by 20
     * - Latency > 50ms: decrease by 20, > 100ms: decrease by 35
     * - Packet loss > 2%: decrease by 15, > 5%: decrease by 30
     * - Device OFFLINE: score = 0
     * Updates status to ONLINE / DEGRADED / OFFLINE accordingly.
     */
    public void evaluateHealth(Device device) {
        if (device == null) return;

        if ("OFFLINE".equalsIgnoreCase(device.getStatus())) {
            device.setHealthScore(0.0);
            return;
        }

        double score = 100.0;
        double cpu = device.getCpuUsage() != null ? device.getCpuUsage() : 20.0;
        double mem = device.getMemoryUsage() != null ? device.getMemoryUsage() : 30.0;
        double latency = device.getLatency() != null ? device.getLatency() : 5.0;
        double loss = device.getPacketLoss() != null ? device.getPacketLoss() : 0.0;

        if (cpu > 90) {
            score -= 35;
        } else if (cpu > 80) {
            score -= 20;
        }

        if (mem > 90) {
            score -= 30;
        } else if (mem > 80) {
            score -= 15;
        }

        if (latency > 100) {
            score -= 30;
        } else if (latency > 50) {
            score -= 15;
        }

        if (loss > 5.0) {
            score -= 35;
        } else if (loss > 2.0) {
            score -= 15;
        }

        score = Math.max(0.0, Math.min(100.0, Math.round(score * 10.0) / 10.0));
        device.setHealthScore(score);

        if (score < 40.0) {
            device.setStatus("DEGRADED");
        } else if (score < 75.0 && !"MAINTENANCE".equalsIgnoreCase(device.getStatus())) {
            device.setStatus("DEGRADED");
        } else if (!"MAINTENANCE".equalsIgnoreCase(device.getStatus()) && !"OFFLINE".equalsIgnoreCase(device.getStatus())) {
            device.setStatus("ONLINE");
        }
    }

    private void mapRequestToEntity(DeviceRequest req, Device dev) {
        if (req.getDeviceCode() != null) dev.setDeviceCode(req.getDeviceCode());
        if (req.getDeviceName() != null) dev.setDeviceName(req.getDeviceName());
        if (req.getHostname() != null) dev.setHostname(req.getHostname());
        if (req.getIpAddress() != null) dev.setIpAddress(req.getIpAddress());
        if (req.getDeviceType() != null) dev.setDeviceType(req.getDeviceType());
        if (req.getVendor() != null) dev.setVendor(req.getVendor());
        if (req.getModel() != null) dev.setModel(req.getModel());
        if (req.getLocation() != null) dev.setLocation(req.getLocation());
        if (req.getFirmware() != null) dev.setFirmware(req.getFirmware());
        if (req.getStatus() != null) dev.setStatus(req.getStatus());
        if (req.getCpuUsage() != null) dev.setCpuUsage(req.getCpuUsage());
        if (req.getMemoryUsage() != null) dev.setMemoryUsage(req.getMemoryUsage());
        if (req.getTemperature() != null) dev.setTemperature(req.getTemperature());
        if (req.getLatency() != null) dev.setLatency(req.getLatency());
        if (req.getPacketLoss() != null) dev.setPacketLoss(req.getPacketLoss());
        if (req.getUptime() != null) dev.setUptime(req.getUptime());
        if (req.getServices() != null) dev.setServices(req.getServices());
        dev.setLastSeen(LocalDateTime.now());
    }
}