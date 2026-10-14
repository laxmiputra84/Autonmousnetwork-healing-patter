package com.example.network_healing_backend.dto;

public class RecoveryRequest {

    private Long deviceId;
    private String deviceCode;
    private Long healingActionId;
    private String planName;
    private String steps;
    private String service;
    private String faultType;
    private String rootCause;
    private String healingActionType;
    private String technicianMode;

    public RecoveryRequest() {
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

    public Long getHealingActionId() {
        return healingActionId;
    }

    public void setHealingActionId(Long healingActionId) {
        this.healingActionId = healingActionId;
    }

    public String getPlanName() {
        return planName;
    }

    public void setPlanName(String planName) {
        this.planName = planName;
    }

    public String getSteps() {
        return steps;
    }

    public void setSteps(String steps) {
        this.steps = steps;
    }

    public String getService() {
        return service;
    }

    public void setService(String service) {
        this.service = service;
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

    public String getHealingActionType() {
        return healingActionType;
    }

    public void setHealingActionType(String healingActionType) {
        this.healingActionType = healingActionType;
    }

    public String getTechnicianMode() {
        return technicianMode;
    }

    public void setTechnicianMode(String technicianMode) {
        this.technicianMode = technicianMode;
    }
}
