package com.example.network_healing_backend.dto;

import jakarta.validation.constraints.NotBlank;

public class DeviceRequest {

    private String deviceCode;

    @NotBlank(message = "Device name is required")
    private String deviceName;

    private String hostname;

    @NotBlank(message = "IP address is required")
    private String ipAddress;

    private String deviceType;
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
    private Double packetLoss;
    private String uptime;
    private String services;

    public DeviceRequest() {
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

    // Support name alias
    public String getName() {
        return deviceName;
    }

    public void setName(String name) {
        if (this.deviceName == null) {
            this.deviceName = name;
        }
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

    // Support ip alias
    public String getIp() {
        return ipAddress;
    }

    public void setIp(String ip) {
        if (this.ipAddress == null) {
            this.ipAddress = ip;
        }
    }

    public String getDeviceType() {
        return deviceType;
    }

    public void setDeviceType(String deviceType) {
        this.deviceType = deviceType;
    }

    // Support type alias
    public String getType() {
        return deviceType;
    }

    public void setType(String type) {
        if (this.deviceType == null) {
            this.deviceType = type;
        }
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

    public Double getPacketLoss() {
        return packetLoss;
    }

    public void setPacketLoss(Double packetLoss) {
        this.packetLoss = packetLoss;
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
}
