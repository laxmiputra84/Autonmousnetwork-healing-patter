package com.example.network_healing_backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "healing_actions")
public class HealingAction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "action_code", length = 50)
    private String actionCode;

    @Column(name = "device_id")
    private Long deviceId;

    @Column(name = "device_code", length = 50)
    private String deviceCode;

    @Column(name = "device_name", length = 100)
    private String deviceName;

    @Column(name = "alarm_id")
    private Long alarmId;

    @Column(name = "alarm_code", length = 50)
    private String alarmCode;

    @Column(name = "rca_id")
    private Long rcaId;

    @Column(name = "action_type", nullable = false, length = 50)
    private String actionType; // RESTART_SERVICE, RESTORE_CONFIGURATION, REROUTE_TRAFFIC, etc.

    @Column(name = "description", length = 500)
    private String description;

    @Column(name = "status", nullable = false, length = 30)
    private String status = "QUEUED"; // QUEUED, IN_PROGRESS, VERIFYING, SUCCESS, FAILED

    @Column(name = "progress_pct")
    private Integer progressPct = 0;

    @Column(name = "result", length = 500)
    private String result;

    @Column(name = "logs", columnDefinition = "TEXT")
    private String logs;

    @Column(name = "executed_at")
    private LocalDateTime executedAt;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    public HealingAction() {
    }

    @PrePersist
    public void onPrePersist() {
        if (this.executedAt == null) {
            this.executedAt = LocalDateTime.now();
        }
        if (this.actionCode == null && this.id != null) {
            this.actionCode = "ACT-" + this.id;
        }
        if (this.status == null) {
            this.status = "QUEUED";
        }
    }

    // Getters and Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getActionCode() {
        return actionCode;
    }

    public void setActionCode(String actionCode) {
        this.actionCode = actionCode;
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

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Integer getProgressPct() {
        return progressPct;
    }

    public void setProgressPct(Integer progressPct) {
        this.progressPct = progressPct;
    }

    public String getResult() {
        return result;
    }

    public void setResult(String result) {
        this.result = result;
    }

    public String getLogs() {
        return logs;
    }

    public void setLogs(String logs) {
        this.logs = logs;
    }

    public LocalDateTime getExecutedAt() {
        return executedAt;
    }

    public void setExecutedAt(LocalDateTime executedAt) {
        this.executedAt = executedAt;
    }

    public LocalDateTime getCompletedAt() {
        return completedAt;
    }

    public void setCompletedAt(LocalDateTime completedAt) {
        this.completedAt = completedAt;
    }
}
