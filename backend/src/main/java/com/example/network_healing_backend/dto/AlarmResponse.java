package com.example.network_healing_backend.dto;

import com.example.network_healing_backend.entity.Alarm;
import com.example.network_healing_backend.entity.Device;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

public class AlarmResponse {

    private Long id;
    private String alarmCode;
    private Long deviceId;
    private String deviceCode;
    private String deviceName;
    private String service;
    private String alarmType;
    private String severity;
    private String message;
    private String status;
    private String source;
    private String faultType;
    private String rootCause;
    private String recommendedAction;
    private LocalDateTime detectedAt;
    private LocalDateTime resolvedAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Map<String, Object> metricsSnapshot;

    public AlarmResponse() {
        this.metricsSnapshot = new HashMap<>();
    }

    public static AlarmResponse fromEntity(Alarm alarm) {
        return fromEntity(alarm, null);
    }

    public static AlarmResponse fromEntity(Alarm alarm, Device device) {
        if (alarm == null) return null;
        AlarmResponse resp = new AlarmResponse();
        resp.setId(alarm.getId());
        resp.setAlarmCode(alarm.getAlarmCode() != null ? alarm.getAlarmCode() : "ALM-" + alarm.getId());
        resp.setDeviceId(alarm.getDeviceId());
        resp.setDeviceCode(alarm.getDeviceCode());
        resp.setDeviceName(alarm.getDeviceName());
        resp.setService(alarm.getService());
        resp.setAlarmType(alarm.getAlarmType());
        resp.setSeverity(alarm.getSeverity());
        resp.setMessage(alarm.getMessage());
        resp.setStatus(alarm.getStatus());
        resp.setSource(alarm.getSource());
        resp.setFaultType(alarm.getFaultType());
        resp.setRootCause(alarm.getRootCause());
        resp.setRecommendedAction(alarm.getRecommendedAction());
        resp.setDetectedAt(alarm.getDetectedAt());
        resp.setResolvedAt(alarm.getResolvedAt());
        resp.setCreatedAt(alarm.getCreatedAt());
        resp.setUpdatedAt(alarm.getUpdatedAt());

        Map<String, Object> metrics = new HashMap<>();
        if (device != null) {
            metrics.put("latencyMs", device.getLatency());
            metrics.put("packetLossPct", device.getPacketLoss());
            metrics.put("cpuPct", device.getCpuUsage());
            metrics.put("memoryPct", device.getMemoryUsage());
        } else {
            metrics.put("latencyMs", 25.0);
            metrics.put("packetLossPct", 0.0);
            metrics.put("cpuPct", 45.0);
            metrics.put("memoryPct", 50.0);
        }
        resp.setMetricsSnapshot(metrics);

        return resp;
    }

    // Getters and Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getAlarmCode() {
        return alarmCode;
    }

    public void setAlarmCode(String alarmCode) {
        this.alarmCode = alarmCode;
    }

    public Long getDeviceId() {
        return deviceId;
    }

    public void setDeviceId(Long deviceId) {
        this.deviceId = deviceId;
    }

    public String getDeviceCode() {
        return deviceCode;
    }

    public void setDeviceCode(String deviceCode) {
        this.deviceCode = deviceCode;
    }

    public String getDeviceName() {
        return deviceName;
    }

    public void setDeviceName(String deviceName) {
        this.deviceName = deviceName;
    }

    public String getService() {
        return service;
    }

    public void setService(String service) {
        this.service = service;
    }

    public String getAlarmType() {
        return alarmType;
    }

    public void setAlarmType(String alarmType) {
        this.alarmType = alarmType;
    }

    public String getSeverity() {
        return severity;
    }

    public void setSeverity(String severity) {
        this.severity = severity;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getSource() {
        return source;
    }

    public void setSource(String source) {
        this.source = source;
    }

    public String getFaultType() {
        return faultType;
    }

    public void setFaultType(String faultType) {
        this.faultType = faultType;
    }

    public String getRootCause() {
        return rootCause;
    }

    public void setRootCause(String rootCause) {
        this.rootCause = rootCause;
    }

    public String getRecommendedAction() {
        return recommendedAction;
    }

    public void setRecommendedAction(String recommendedAction) {
        this.recommendedAction = recommendedAction;
    }

    public LocalDateTime getDetectedAt() {
        return detectedAt;
    }

    public void setDetectedAt(LocalDateTime detectedAt) {
        this.detectedAt = detectedAt;
    }

    public LocalDateTime getResolvedAt() {
        return resolvedAt;
    }

    public void setResolvedAt(LocalDateTime resolvedAt) {
        this.resolvedAt = resolvedAt;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public Map<String, Object> getMetricsSnapshot() {
        return metricsSnapshot;
    }

    public void setMetricsSnapshot(Map<String, Object> metricsSnapshot) {
        this.metricsSnapshot = metricsSnapshot;
    }
}
