package com.example.network_healing_backend.dto;

import com.example.network_healing_backend.entity.RecoveryPlan;
import java.time.LocalDateTime;

public class RecoveryResponse {

    private Long id;
    private String planCode;
    private String incidentId;
    private Long deviceId;
    private String deviceCode;
    private String deviceName;
    private Long healingActionId;
    private String planName;
    private String service;
    private String faultType;
    private String rootCause;
    private String healingAction;
    private String healingActionType;
    private String steps;
    private String status;
    private String result;
    private String verificationMessage;
    private Integer mttrSeconds;
    private String technicianMode;
    private String date;
    private LocalDateTime startedAt;
    private LocalDateTime completedAt;

    public RecoveryResponse() {
    }

    public static RecoveryResponse fromEntity(RecoveryPlan plan) {
        if (plan == null) return null;
        RecoveryResponse resp = new RecoveryResponse();
        resp.setId(plan.getId());
        resp.setPlanCode(plan.getPlanCode() != null ? plan.getPlanCode() : "REC-" + plan.getId());
        resp.setIncidentId(plan.getIncidentId());
        resp.setDeviceId(plan.getDeviceId());
        resp.setDeviceCode(plan.getDeviceCode());
        resp.setDeviceName(plan.getDeviceName());
        resp.setHealingActionId(plan.getHealingActionId());
        resp.setPlanName(plan.getPlanName());
        resp.setService(plan.getService());
        resp.setFaultType(plan.getFaultType());
        resp.setRootCause(plan.getRootCause());
        resp.setHealingAction(plan.getHealingActionType());
        resp.setHealingActionType(plan.getHealingActionType());
        resp.setSteps(plan.getSteps());
        resp.setStatus(plan.getStatus());
        resp.setResult(plan.getResult() != null ? plan.getResult() : plan.getStatus());
        resp.setVerificationMessage(plan.getVerificationMessage());
        resp.setMttrSeconds(plan.getMttrSeconds() != null ? plan.getMttrSeconds() : 60);
        resp.setTechnicianMode(plan.getTechnicianMode());
        resp.setStartedAt(plan.getStartedAt());
        resp.setCompletedAt(plan.getCompletedAt());
        resp.setDate(plan.getStartedAt() != null ? plan.getStartedAt().toString() : LocalDateTime.now().toString());

        return resp;
    }

    // Getters and Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getPlanCode() {
        return planCode;
    }

    public void setPlanCode(String planCode) {
        this.planCode = planCode;
    }

    public String getIncidentId() {
        return incidentId;
    }

    public void setIncidentId(String incidentId) {
        this.incidentId = incidentId;
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

    public String getHealingAction() {
        return healingAction;
    }

    public void setHealingAction(String healingAction) {
        this.healingAction = healingAction;
    }

    public String getHealingActionType() {
        return healingActionType;
    }

    public void setHealingActionType(String healingActionType) {
        this.healingActionType = healingActionType;
    }

    public String getSteps() {
        return steps;
    }

    public void setSteps(String steps) {
        this.steps = steps;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getResult() {
        return result;
    }

    public void setResult(String result) {
        this.result = result;
    }

    public String getVerificationMessage() {
        return verificationMessage;
    }

    public void setVerificationMessage(String verificationMessage) {
        this.verificationMessage = verificationMessage;
    }

    public Integer getMttrSeconds() {
        return mttrSeconds;
    }

    public void setMttrSeconds(Integer mttrSeconds) {
        this.mttrSeconds = mttrSeconds;
    }

    public String getTechnicianMode() {
        return technicianMode;
    }

    public void setTechnicianMode(String technicianMode) {
        this.technicianMode = technicianMode;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public LocalDateTime getStartedAt() {
        return startedAt;
    }

    public void setStartedAt(LocalDateTime startedAt) {
        this.startedAt = startedAt;
    }

    public LocalDateTime getCompletedAt() {
        return completedAt;
    }

    public void setCompletedAt(LocalDateTime completedAt) {
        this.completedAt = completedAt;
    }
}
