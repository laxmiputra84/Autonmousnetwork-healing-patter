package com.example.network_healing_backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import java.time.LocalDateTime;

@Entity
@Table(name = "devices")
public class Device {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "device_code", unique = true, length = 50)
    private String deviceCode;

    @NotBlank(message = "Device name is required")
    @Column(name = "device_name", nullable = false, length = 100)
    private String deviceName;

    @Column(name = "hostname", length = 100)
    private String hostname;

    @NotBlank(message = "IP address is required")
    @Column(name = "ip_address", nullable = false, length = 50)
    private String ipAddress;

    @Column(name = "device_type", length = 50)
    private String deviceType;

    @Column(name = "vendor", length = 50)
    private String vendor;

    @Column(name = "model", length = 50)
    private String model;

    @Column(name = "location", length = 150)
    private String location;

    @Column(name = "firmware", length = 50)
    private String firmware;

    @Column(name = "status", nullable = false, length = 30)
    private String status = "ONLINE";

    @Min(0) @Max(100)
    @Column(name = "health_score")
    private Double healthScore = 100.0;

    @Min(0) @Max(100)
    @Column(name = "cpu_usage")
    private Double cpuUsage = 15.0;

    @Min(0) @Max(100)
    @Column(name = "memory_usage")
    private Double memoryUsage = 30.0;

    @Column(name = "temperature")
    private Double temperature = 38.0;

    @Column(name = "latency")
    private Double latency = 5.0; // in ms

    @Min(0) @Max(100)
    @Column(name = "packet_loss")
    private Double packetLoss = 0.0; // in %

    @Column(name = "uptime", length = 50)
    private String uptime = "30d 12h 00m";

    @Column(name = "services", length = 500)
    private String services;

    @Column(name = "active_alarms_count")
    private Integer activeAlarmsCount = 0;

    @Column(name = "last_seen")
    private LocalDateTime lastSeen;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public Device() {
    }

    @PrePersist
    public void onPrePersist() {
        LocalDateTime now = LocalDateTime.now();
        if (this.createdAt == null) {
            this.createdAt = now;
        }
        if (this.updatedAt == null) {
            this.updatedAt = now;
        }
        if (this.lastSeen == null) {
            this.lastSeen = now;
        }
        if (this.healthScore == null) {
            this.healthScore = 100.0;
        }
        if (this.status == null) {
            this.status = "ONLINE";
        }
    }

    @PreUpdate
    public void onPreUpdate() {
        this.updatedAt = LocalDateTime.now();
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

    // Alias for legacy or frontend compatibility
    public String getName() {
        return deviceName;
    }

    public void setName(String name) {
        this.deviceName = name;
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

    // Alias for frontend compatibility
    public String getIp() {
        return ipAddress;
    }

    public void setIp(String ip) {
        this.ipAddress = ip;
    }

    public String getDeviceType() {
        return deviceType;
    }

    public void setDeviceType(String deviceType) {
        this.deviceType = deviceType;
    }

    // Alias for frontend compatibility
    public String getType() {
        return deviceType;
    }

    public void setType(String type) {
        this.deviceType = type;
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
        return latency;
    }

    public void setLatencyMs(Double latencyMs) {
        this.latency = latencyMs;
    }

    public Double getPacketLoss() {
        return packetLoss;
    }

    public void setPacketLoss(Double packetLoss) {
        this.packetLoss = packetLoss;
    }

    public Double getPacketLossPct() {
        return packetLoss;
    }

    public void setPacketLossPct(Double packetLossPct) {
        this.packetLoss = packetLossPct;
    }

    public String getUptime() {
        return uptime;
    }

    public void setUptime(String uptime) {
        this.uptime = uptime;
    }

    public String getServices() {
        return services;
    }

    public void setServices(String services) {
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