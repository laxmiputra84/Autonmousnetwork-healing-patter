package com.example.network_healing_backend.dto;

import com.example.network_healing_backend.entity.HealingAction;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class HealingResponse {

    private Long id;
    private String actionCode;
    private Long deviceId;
    private String deviceCode;
    private String deviceName;
    private Long alarmId;
    private String alarmCode;
    private Long rcaId;
    private String actionType;
    private String action; // Alias for frontend
    private String service;
    private String faultType;
    private String rootCause;
    private String description;
    private String status;
    private Integer progressPct;
    private String result;
    private LocalDateTime executedAt;
    private LocalDateTime completedAt;
    private String startedAt; // string for frontend
    private List<Map<String, String>> logs;

    public HealingResponse() {
        this.logs = new ArrayList<>();
    }

    public static HealingResponse fromEntity(HealingAction action) {
        if (action == null) return null;
        HealingResponse resp = new HealingResponse();
        resp.setId(action.getId());
        resp.setActionCode(action.getActionCode() != null ? action.getActionCode() : "ACT-" + action.getId());
        resp.setDeviceId(action.getDeviceId());
        resp.setDeviceCode(action.getDeviceCode());
        resp.setDeviceName(action.getDeviceName());
        resp.setAlarmId(action.getAlarmId());
        resp.setAlarmCode(action.getAlarmCode());
        resp.setRcaId(action.getRcaId());
        resp.setActionType(action.getActionType());
        resp.setAction(action.getActionType());
        resp.setDescription(action.getDescription());
        resp.setStatus(action.getStatus());
        resp.setProgressPct(action.getProgressPct() != null ? action.getProgressPct() : 0);
        resp.setResult(action.getResult());
        resp.setExecutedAt(action.getExecutedAt());
        resp.setCompletedAt(action.getCompletedAt());
        resp.setStartedAt(action.getExecutedAt() != null ? action.getExecutedAt().toString() : null);

        List<Map<String, String>> logList = new ArrayList<>();
        if (action.getLogs() != null && !action.getLogs().isBlank()) {
            String[] lines = action.getLogs().split("\n");
            for (String line : lines) {
                if (!line.isBlank()) {
                    String time = action.getExecutedAt() != null ? 
                            action.getExecutedAt().format(DateTimeFormatter.ofPattern("HH:mm:ss")) : "00:00:00";
                    String level = "INFO";
                    if (line.toLowerCase().contains("success")) level = "SUCCESS";
                    else if (line.toLowerCase().contains("failed") || line.toLowerCase().contains("error")) level = "ERROR";
                    else if (line.toLowerCase().contains("execut") || line.toLowerCase().contains("trigger")) level = "ACTION";

                    logList.add(Map.of("timestamp", time, "level", level, "text", line));
                }
            }
        } else {
            String time = action.getExecutedAt() != null ? 
                    action.getExecutedAt().format(DateTimeFormatter.ofPattern("HH:mm:ss")) : "00:00:00";
            logList.add(Map.of("timestamp", time, "level", "INFO", "text", "Healing orchestrator received trigger"));
            if ("SUCCESS".equalsIgnoreCase(action.getStatus())) {
                logList.add(Map.of("timestamp", time, "level", "SUCCESS", "text", "Autonomous mitigation verified successfully"));
            }
        }
        resp.setLogs(logList);

        return resp;
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

    public String getAction() {
        return action;
    }

    public void setAction(String action) {
        this.action = action;
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

    public String getStartedAt() {
        return startedAt;
    }

    public void setStartedAt(String startedAt) {
        this.startedAt = startedAt;
    }

    public List<Map<String, String>> getLogs() {
        return logs;
    }

    public void setLogs(List<Map<String, String>> logs) {
        this.logs = logs;
    }
}
