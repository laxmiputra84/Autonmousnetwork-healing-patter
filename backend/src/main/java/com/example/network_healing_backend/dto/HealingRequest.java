package com.example.network_healing_backend.dto;

import jakarta.validation.constraints.NotBlank;

public class HealingRequest {

    private Long deviceId;
    private String deviceCode;
    private Long alarmId;
    private String alarmCode;
    private Long rcaId;

    @NotBlank(message = "Action type is required")
    private String actionType;

    private String description;

    public HealingRequest() {
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

    public Long getAlarmId() {
        return alarmId;
    }

    public void setAlarmId(Long alarmId) {
        this.alarmId = alarmId;
    }

    public String getAlarmCode() {
        return alarmCode;
    }

    public void setAlarmCode(String alarmCode) {
        this.alarmCode = alarmCode;
    }

    public Long getRcaId() {
        return rcaId;
    }

    public void setRcaId(Long rcaId) {
        this.rcaId = rcaId;
    }

    public String getActionType() {
        return actionType;
    }

    public void setActionType(String actionType) {
        this.actionType = actionType;
    }

    // Alias for frontend compatibility
    public String getAction() {
        return actionType;
    }

    public void setAction(String action) {
        if (this.actionType == null) {
            this.actionType = action;
        }
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
