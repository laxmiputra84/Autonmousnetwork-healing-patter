package com.example.network_healing_backend.dto;

public class RcaRequest {

    private Long deviceId;
    private String deviceCode;
    private Long alarmId;
    private String alarmCode;

    public RcaRequest() {
    }

    public RcaRequest(Long deviceId, Long alarmId) {
        this.deviceId = deviceId;
        this.alarmId = alarmId;
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
}
