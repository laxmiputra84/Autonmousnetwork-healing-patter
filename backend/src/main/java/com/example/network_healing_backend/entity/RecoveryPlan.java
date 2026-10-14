package com.example.network_healing_backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "recovery_plans")
public class RecoveryPlan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "plan_code", length = 50)
    private String planCode;

    @Column(name = "incident_id", length = 50)
    private String incidentId;

    @Column(name = "device_id")
    private Long deviceId;

    @Column(name = "device_code", length = 50)
    private String deviceCode;

    @Column(name = "device_name", length = 100)
    private String deviceName;

    @Column(name = "healing_action_id")
    private Long healingActionId;

    @Column(name = "plan_name", length = 150)
    private String planName;

    @Column(name = "service", length = 100)
    private String service;

    @Column(name = "fault_type", length = 50)
    private String faultType;

    @Column(name = "root_cause", length = 500)
    private String rootCause;

    @Column(name = "healing_action_type", length = 50)
    private String healingActionType;

    @Column(name = "steps", columnDefinition = "TEXT")
    private String steps;

    @Column(name = "status", nullable = false, length = 30)
    private String status = "PLANNED"; // PLANNED, IN_PROGRESS, SUCCESS, FAILED, FALLBACK_TRIGGERED

    @Column(name = "technician_mode", length = 50)
    private String technicianMode = "FULLY_AUTONOMOUS";

    @Column(name = "verification_message", length = 500)
    private String verificationMessage;

    @Column(name = "mttr_seconds")
    private Integer mttrSeconds = 60;

    @Column(name = "started_at")
    private LocalDateTime startedAt;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    @Column(name = "result", length = 500)
    private String result;

    public RecoveryPlan() {
    }

    @PrePersist
    public void onPrePersist() {
        if (this.startedAt == null) {
            this.startedAt = LocalDateTime.now();
        }
        if (this.planCode == null && this.id != null) {
            this.planCode = "REC-" + this.id;
        }
        if (this.incidentId == null) {
            this.incidentId = "INC-" + (System.currentTimeMillis() % 10000);
        }
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

    public String getTechnicianMode() {
        return technicianMode;
    }

    public void setTechnicianMode(String technicianMode) {
        this.technicianMode = technicianMode;
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

    public String getResult() {
        return result;
    }

    public void setResult(String result) {
        this.result = result;
    }
}
