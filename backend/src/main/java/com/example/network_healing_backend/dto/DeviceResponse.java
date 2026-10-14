package com.example.network_healing_backend.dto;

import com.example.network_healing_backend.entity.Device;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class DeviceResponse {

    private Long id;
    private String deviceCode;
    private String deviceName;
    private String name;
    private String hostname;
    private String ipAddress;
    private String ip;
    private String deviceType;
    private String type;
    private String vendor;
    private String model;
    private String location;
    private String firmware;
    private String status;
    private Double healthScore;
    private Double cpuUsage;
    private Double memoryUsage;
    private Double temperature;
    private Double latency;
    private Double latencyMs;
    private Double packetLoss;
    private Double packetLossPct;
    private String uptime;
    private List<String> services;
    private Integer activeAlarmsCount;
    private LocalDateTime lastSeen;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public DeviceResponse() {
    }

    public static DeviceResponse fromEntity(Device device) {
        if (device == null) return null;
        DeviceResponse resp = new DeviceResponse();
        resp.setId(device.getId());
        resp.setDeviceCode(device.getDeviceCode() != null ? device.getDeviceCode() : "DEV-" + device.getId());
        resp.setDeviceName(device.getDeviceName());
        resp.setName(device.getDeviceName());
        resp.setHostname(device.getHostname());
        resp.setIpAddress(device.getIpAddress());
        resp.setIp(device.getIpAddress());
        resp.setDeviceType(device.getDeviceType());
        resp.setType(device.getDeviceType());
        resp.setVendor(device.getVendor());
        resp.setModel(device.getModel());
        resp.setLocation(device.getLocation());
        resp.setFirmware(device.getFirmware());
        resp.setStatus(device.getStatus());
        resp.setHealthScore(device.getHealthScore());
        resp.setCpuUsage(device.getCpuUsage());
        resp.setMemoryUsage(device.getMemoryUsage());
        resp.setTemperature(device.getTemperature());
        resp.setLatency(device.getLatency());
        resp.setLatencyMs(device.getLatency());
        resp.setPacketLoss(device.getPacketLoss());
        resp.setPacketLossPct(device.getPacketLoss());
        resp.setUptime(device.getUptime());
        resp.setActiveAlarmsCount(device.getActiveAlarmsCount() != null ? device.getActiveAlarmsCount() : 0);
        resp.setLastSeen(device.getLastSeen());
        resp.setCreatedAt(device.getCreatedAt());
        resp.setUpdatedAt(device.getUpdatedAt());

        if (device.getServices() != null && !device.getServices().isBlank()) {
            resp.setServices(Arrays.stream(device.getServices().split(","))
                    .map(String::trim)
                    .filter(s -> !s.isEmpty())
                    .toList());
        } else {
            resp.setServices(new ArrayList<>());
        }
        return resp;
    }

    // Getters and Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getHostname() {
        return hostname;
    }

    public void setHostname(String hostname) {
        this.hostname = hostname;
    }

    public String getIpAddress() {
        return ipAddress;
    }

    public void setIpAddress(String ipAddress) {
        this.ipAddress = ipAddress;
    }

    public String getIp() {
        return ip;
    }

    public void setIp(String ip) {
        this.ip = ip;
    }

    public String getDeviceType() {
        return deviceType;
    }

    public void setDeviceType(String deviceType) {
        this.deviceType = deviceType;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getVendor() {
        return vendor;
    }

    public void setVendor(String vendor) {
        this.vendor = vendor;
    }

    public String getModel() {
        return model;
    }

    public void setModel(String model) {
        this.model = model;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getFirmware() {
        return firmware;
    }

    public void setFirmware(String firmware) {
        this.firmware = firmware;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Double getHealthScore() {
        return healthScore;
    }

    public void setHealthScore(Double healthScore) {
        this.healthScore = healthScore;
    }

    public Double getCpuUsage() {
        return cpuUsage;
    }

    public void setCpuUsage(Double cpuUsage) {
        this.cpuUsage = cpuUsage;
    }

    public Double getMemoryUsage() {
        return memoryUsage;
    }

    public void setMemoryUsage(Double memoryUsage) {
        this.memoryUsage = memoryUsage;
    }

    public Double getTemperature() {
        return temperature;
    }

    public void setTemperature(Double temperature) {
        this.temperature = temperature;
    }

    public Double getLatency() {
        return latency;
    }

    public void setLatency(Double latency) {
        this.latency = latency;
    }

    public Double getLatencyMs() {
        return latencyMs;
    }

    public void setLatencyMs(Double latencyMs) {
        this.latencyMs = latencyMs;
    }

    public Double getPacketLoss() {
        return packetLoss;
    }

    public void setPacketLoss(Double packetLoss) {
        this.packetLoss = packetLoss;
    }

    public Double getPacketLossPct() {
        return packetLossPct;
    }

    public void setPacketLossPct(Double packetLossPct) {
        this.packetLossPct = packetLossPct;
    }

    public String getUptime() {
        return uptime;
    }

    public void setUptime(String uptime) {
        this.uptime = uptime;
    }

    public List<String> getServices() {
        return services;
    }

    public void setServices(List<String> services) {
        this.services = services;
    }

    public Integer getActiveAlarmsCount() {
        return activeAlarmsCount;
    }

    public void setActiveAlarmsCount(Integer activeAlarmsCount) {
        this.activeAlarmsCount = activeAlarmsCount;
    }

    public LocalDateTime getLastSeen() {
        return lastSeen;
    }

    public void setLastSeen(LocalDateTime lastSeen) {
        this.lastSeen = lastSeen;
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
}
