package com.example.network_healing_backend.dto;

import com.example.network_healing_backend.entity.NetworkEvent;
import java.time.LocalDateTime;

public class NetworkEventResponse {

    private Long id;
    private Long deviceId;
    private String deviceCode;
    private String deviceName;
    private String eventType;
    private String description;
    private String metric;
    private Double value;
    private Double threshold;
    private String severity;
    private LocalDateTime timestamp;

    public NetworkEventResponse() {
    }

    public static NetworkEventResponse fromEntity(NetworkEvent event) {
        if (event == null) return null;
        NetworkEventResponse resp = new NetworkEventResponse();
        resp.setId(event.getId());
        resp.setDeviceId(event.getDeviceId());
        resp.setDeviceCode(event.getDeviceCode());
        resp.setDeviceName(event.getDeviceName());
        resp.setEventType(event.getEventType());
        resp.setDescription(event.getDescription());
        resp.setMetric(event.getMetric());
        resp.setValue(event.getValue());
        resp.setThreshold(event.getThreshold());
        resp.setSeverity(event.getSeverity());
        resp.setTimestamp(event.getTimestamp());
        return resp;
    }

    // Getters and Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public String getEventType() {
        return eventType;
    }

    public void setEventType(String eventType) {
        this.eventType = eventType;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getMetric() {
        return metric;
    }

    public void setMetric(String metric) {
        this.metric = metric;
    }

    public Double getValue() {
        return value;
    }

    public void setValue(Double value) {
        this.value = value;
    }

    public Double getThreshold() {
        return threshold;
    }

    public void setThreshold(Double threshold) {
        this.threshold = threshold;
    }

    public String getSeverity() {
        return severity;
    }

    public void setSeverity(String severity) {
        this.severity = severity;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }
}
