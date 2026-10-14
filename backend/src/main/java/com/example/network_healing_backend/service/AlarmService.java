package com.example.network_healing_backend.service;

import com.example.network_healing_backend.dto.AlarmRequest;
import com.example.network_healing_backend.dto.AlarmResponse;
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
public class AlarmService {

    private static final Logger log = LoggerFactory.getLogger(AlarmService.class);

    private final AlarmRepository alarmRepository;
    private final DeviceRepository deviceRepository;

    public AlarmService(AlarmRepository alarmRepository, DeviceRepository deviceRepository) {
        this.alarmRepository = alarmRepository;
        this.deviceRepository = deviceRepository;
    }

    public List<AlarmResponse> getAlarms(String status, String severity) {
        List<Alarm> alarms;
        if (status != null && severity != null) {
            alarms = alarmRepository.findByStatusAndSeverity(status.toUpperCase(), severity.toUpperCase());
        } else if (status != null) {
            alarms = alarmRepository.findByStatus(status.toUpperCase());
        } else if (severity != null) {
            alarms = alarmRepository.findBySeverity(severity.toUpperCase());
        } else {
            alarms = alarmRepository.findAll();
        }

        return alarms.stream()
                .map(a -> {
                    Device dev = a.getDeviceId() != null ? deviceRepository.findById(a.getDeviceId()).orElse(null) : null;
                    return AlarmResponse.fromEntity(a, dev);
                })
                .toList();
    }

    public AlarmResponse getAlarmById(Long id) {
        Alarm alarm = findEntityById(id);
        Device dev = alarm.getDeviceId() != null ? deviceRepository.findById(alarm.getDeviceId()).orElse(null) : null;
        return AlarmResponse.fromEntity(alarm, dev);
    }

    public Alarm findEntityById(Long id) {
        return alarmRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Alarm not found with id: " + id));
    }

    public AlarmResponse createAlarm(AlarmRequest request) {
        Alarm alarm = new Alarm();
        alarm.setDeviceId(request.getDeviceId());
        alarm.setDeviceCode(request.getDeviceCode());
        alarm.setDeviceName(request.getDeviceName());
        alarm.setService(request.getService());
        alarm.setAlarmType(request.getAlarmType() != null ? request.getAlarmType() : "FAULT");
        alarm.setSeverity(request.getSeverity() != null ? request.getSeverity().toUpperCase() : "MEDIUM");
        alarm.setMessage(request.getMessage());
        alarm.setStatus(request.getStatus() != null ? request.getStatus().toUpperCase() : "ACTIVE");
        alarm.setSource(request.getSource() != null ? request.getSource() : "TELEMETRY");
        alarm.setFaultType(request.getFaultType());
        alarm.setRootCause(request.getRootCause());
        alarm.setRecommendedAction(request.getRecommendedAction());
        alarm.setDetectedAt(LocalDateTime.now());

        if (alarm.getDeviceId() != null && (alarm.getDeviceName() == null || alarm.getDeviceCode() == null)) {
            deviceRepository.findById(alarm.getDeviceId()).ifPresent(dev -> {
                if (alarm.getDeviceName() == null) alarm.setDeviceName(dev.getDeviceName());
                if (alarm.getDeviceCode() == null) alarm.setDeviceCode(dev.getDeviceCode());
                dev.setActiveAlarmsCount((dev.getActiveAlarmsCount() != null ? dev.getActiveAlarmsCount() : 0) + 1);
                deviceRepository.save(dev);
            });
        }

        Alarm saved = alarmRepository.save(alarm);
        if (saved.getAlarmCode() == null) {
            saved.setAlarmCode("ALM-" + (1000 + saved.getId()));
            saved = alarmRepository.save(saved);
        }

        log.info("Created alarm: {} on device: {}", saved.getAlarmCode(), saved.getDeviceName());
        Device dev = saved.getDeviceId() != null ? deviceRepository.findById(saved.getDeviceId()).orElse(null) : null;
        return AlarmResponse.fromEntity(saved, dev);
    }

    public AlarmResponse updateAlarm(Long id, AlarmRequest request) {
        Alarm alarm = findEntityById(id);
        if (request.getSeverity() != null) alarm.setSeverity(request.getSeverity().toUpperCase());
        if (request.getMessage() != null) alarm.setMessage(request.getMessage());
        if (request.getStatus() != null) alarm.setStatus(request.getStatus().toUpperCase());
        if (request.getService() != null) alarm.setService(request.getService());
        if (request.getAlarmType() != null) alarm.setAlarmType(request.getAlarmType());
        if (request.getFaultType() != null) alarm.setFaultType(request.getFaultType());
        if (request.getRootCause() != null) alarm.setRootCause(request.getRootCause());
        if (request.getRecommendedAction() != null) alarm.setRecommendedAction(request.getRecommendedAction());

        Alarm updated = alarmRepository.save(alarm);
        Device dev = updated.getDeviceId() != null ? deviceRepository.findById(updated.getDeviceId()).orElse(null) : null;
        return AlarmResponse.fromEntity(updated, dev);
    }

    public AlarmResponse acknowledgeAlarm(Long id) {
        Alarm alarm = findEntityById(id);
        alarm.setStatus("ACKNOWLEDGED");
        Alarm saved = alarmRepository.save(alarm);
        log.info("Alarm acknowledged: {}", saved.getAlarmCode());
        Device dev = saved.getDeviceId() != null ? deviceRepository.findById(saved.getDeviceId()).orElse(null) : null;
        return AlarmResponse.fromEntity(saved, dev);
    }

    public AlarmResponse resolveAlarm(Long id) {
        Alarm alarm = findEntityById(id);
        alarm.setStatus("RESOLVED");
        alarm.setResolvedAt(LocalDateTime.now());
        Alarm saved = alarmRepository.save(alarm);

        if (saved.getDeviceId() != null) {
            deviceRepository.findById(saved.getDeviceId()).ifPresent(dev -> {
                int count = dev.getActiveAlarmsCount() != null ? dev.getActiveAlarmsCount() : 1;
                dev.setActiveAlarmsCount(Math.max(0, count - 1));
                deviceRepository.save(dev);
            });
        }

        log.info("Alarm resolved: {}", saved.getAlarmCode());
        Device dev = saved.getDeviceId() != null ? deviceRepository.findById(saved.getDeviceId()).orElse(null) : null;
        return AlarmResponse.fromEntity(saved, dev);
    }

    public void deleteAlarm(Long id) {
        Alarm alarm = findEntityById(id);
        alarmRepository.delete(alarm);
        log.info("Alarm deleted: {}", id);
    }

    public Alarm saveEntity(Alarm alarm) {
        return alarmRepository.save(alarm);
    }
}
