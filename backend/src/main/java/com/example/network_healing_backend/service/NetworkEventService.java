package com.example.network_healing_backend.service;

import com.example.network_healing_backend.dto.NetworkEventRequest;
import com.example.network_healing_backend.dto.NetworkEventResponse;
import com.example.network_healing_backend.entity.Device;
import com.example.network_healing_backend.entity.NetworkEvent;
import com.example.network_healing_backend.repository.DeviceRepository;
import com.example.network_healing_backend.repository.NetworkEventRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
public class NetworkEventService {

    private static final Logger log = LoggerFactory.getLogger(NetworkEventService.class);

    private final NetworkEventRepository networkEventRepository;
    private final DeviceRepository deviceRepository;

    public NetworkEventService(NetworkEventRepository networkEventRepository, DeviceRepository deviceRepository) {
        this.networkEventRepository = networkEventRepository;
        this.deviceRepository = deviceRepository;
    }

    public List<NetworkEventResponse> getAllEvents() {
        return networkEventRepository.findAllByOrderByTimestampDesc().stream()
                .map(NetworkEventResponse::fromEntity)
                .toList();
    }

    public List<NetworkEventResponse> getEventsByDeviceId(Long deviceId) {
        return networkEventRepository.findByDeviceIdOrderByTimestampDesc(deviceId).stream()
                .map(NetworkEventResponse::fromEntity)
                .toList();
    }

    public NetworkEventResponse recordEvent(NetworkEventRequest req) {
        NetworkEvent event = new NetworkEvent();
        event.setDeviceId(req.getDeviceId());
        event.setDeviceCode(req.getDeviceCode());
        event.setDeviceName(req.getDeviceName());
        event.setEventType(req.getEventType());
        event.setDescription(req.getDescription());
        event.setMetric(req.getMetric());
        event.setValue(req.getValue());
        event.setThreshold(req.getThreshold());
        event.setSeverity(req.getSeverity() != null ? req.getSeverity().toUpperCase() : "MEDIUM");
        event.setTimestamp(LocalDateTime.now());

        if (event.getDeviceId() != null && (event.getDeviceName() == null || event.getDeviceCode() == null)) {
            deviceRepository.findById(event.getDeviceId()).ifPresent(d -> {
                if (event.getDeviceName() == null) event.setDeviceName(d.getDeviceName());
                if (event.getDeviceCode() == null) event.setDeviceCode(d.getDeviceCode());
            });
        }

        NetworkEvent saved = networkEventRepository.save(event);
        log.info("Recorded NetworkEvent: {} for device: {}", saved.getEventType(), saved.getDeviceName());
        return NetworkEventResponse.fromEntity(saved);
    }
}
