package com.example.network_healing_backend.dto;

public class SimulatorResponse {

    private boolean success;
    private String message;
    private String faultType;
    private Long deviceId;
    private String deviceCode;
    private String deviceName;
    private Long alarmId;
    private String alarmCode;
    private Double newHealthScore;
    private String newStatus;
    private AlarmResponse generatedAlarm;

    public SimulatorResponse() {
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getFaultType() {
        return faultType;
    }

    public void setFaultType(String faultType) {
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

    public Double getNewHealthScore() {
        return newHealthScore;
    }

    public void setNewHealthScore(Double newHealthScore) {
        this.newHealthScore = newHealthScore;
    }

    public String getNewStatus() {
        return newStatus;
    }

    public void setNewStatus(String newStatus) {
        this.newStatus = newStatus;
    }

    public AlarmResponse getGeneratedAlarm() {
        return generatedAlarm;
    }

    public void setGeneratedAlarm(AlarmResponse generatedAlarm) {
        this.generatedAlarm = generatedAlarm;
    }
}
