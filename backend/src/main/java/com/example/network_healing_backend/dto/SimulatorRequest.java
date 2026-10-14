package com.example.network_healing_backend.dto;

import jakarta.validation.constraints.NotBlank;

public class SimulatorRequest {

    private Long deviceId;
    private String deviceCode;

    @NotBlank(message = "Fault type is required")
    private String faultType;

    private String service;

    public SimulatorRequest() {
    }

    public SimulatorRequest(Long deviceId, String faultType) {
        this.deviceId = deviceId;
        this.faultType = faultType;
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

    public String getFaultType() {
        return faultType;
    }

    public void setFaultType(String faultType) {
        this.faultType = faultType;
    }

    public String getService() {
        return service;
    }

    public void setService(String service) {
        this.service = service;
    }
}
