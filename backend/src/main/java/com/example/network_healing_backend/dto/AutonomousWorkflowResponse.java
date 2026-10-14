package com.example.network_healing_backend.dto;

import java.time.LocalDateTime;

public class AutonomousWorkflowResponse {

    private boolean success;
    private Long alarmId;
    private String alarmCode;
    private Long deviceId;
    private String deviceCode;
    private String deviceName;
    private String triggerSeverity;
    private String detectedFault;
    private RcaResponse rcaAnalysis;
    private String selectedHealingAction;
    private HealingResponse healingExecution;
    private RecoveryResponse recoveryPlan; // populated if healing failed
    private boolean alarmResolved;
    private Double updatedHealthScore;
    private String updatedDeviceStatus;
    private String workflowSummary;
    private LocalDateTime timestamp;

    public AutonomousWorkflowResponse() {
        this.timestamp = LocalDateTime.now();
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
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

    public String getTriggerSeverity() {
        return triggerSeverity;
    }

    public void setTriggerSeverity(String triggerSeverity) {
        this.triggerSeverity = triggerSeverity;
    }

    public String getDetectedFault() {
        return detectedFault;
    }

    public void setDetectedFault(String detectedFault) {
        this.detectedFault = detectedFault;
    }

    public RcaResponse getRcaAnalysis() {
        return rcaAnalysis;
    }

    public void setRcaAnalysis(RcaResponse rcaAnalysis) {
        this.rcaAnalysis = rcaAnalysis;
    }

    public String getSelectedHealingAction() {
        return selectedHealingAction;
    }

    public void setSelectedHealingAction(String selectedHealingAction) {
        this.selectedHealingAction = selectedHealingAction;
    }

    public HealingResponse getHealingExecution() {
        return healingExecution;
    }

    public void setHealingExecution(HealingResponse healingExecution) {
        this.healingExecution = healingExecution;
    }

    public RecoveryResponse getRecoveryPlan() {
        return recoveryPlan;
    }

    public void setRecoveryPlan(RecoveryResponse recoveryPlan) {
        this.recoveryPlan = recoveryPlan;
    }

    public boolean isAlarmResolved() {
        return alarmResolved;
    }

    public void setAlarmResolved(boolean alarmResolved) {
        this.alarmResolved = alarmResolved;
    }

    public Double getUpdatedHealthScore() {
        return updatedHealthScore;
    }

    public void setUpdatedHealthScore(Double updatedHealthScore) {
        this.updatedHealthScore = updatedHealthScore;
    }

    public String getUpdatedDeviceStatus() {
        return updatedDeviceStatus;
    }

    public void setUpdatedDeviceStatus(String updatedDeviceStatus) {
        this.updatedDeviceStatus = updatedDeviceStatus;
    }

    public String getWorkflowSummary() {
        return workflowSummary;
    }

    public void setWorkflowSummary(String workflowSummary) {
        this.workflowSummary = workflowSummary;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }
}
