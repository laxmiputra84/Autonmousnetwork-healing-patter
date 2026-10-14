package com.example.network_healing_backend.dto;

import java.util.List;

public class DashboardResponse {

    private long totalDevices;
    private long onlineDevices;
    private long offlineDevices;
    private long degradedDevices;
    private long activeAlarms;
    private long criticalAlarms;
    private long healingActions;
    private long successfulHealing;
    private long failedHealing;
    private double averageHealthScore;

    private List<AlarmResponse> recentAlarms;
    private List<HealingResponse> recentHealingActions;

    public DashboardResponse() {
    }

    public long getTotalDevices() {
        return totalDevices;
    }

    public void setTotalDevices(long totalDevices) {
        this.totalDevices = totalDevices;
    }

    public long getOnlineDevices() {
        return onlineDevices;
    }

    public void setOnlineDevices(long onlineDevices) {
        this.onlineDevices = onlineDevices;
    }

    public long getOfflineDevices() {
        return offlineDevices;
    }

    public void setOfflineDevices(long offlineDevices) {
        this.offlineDevices = offlineDevices;
    }

    public long getDegradedDevices() {
        return degradedDevices;
    }

    public void setDegradedDevices(long degradedDevices) {
        this.degradedDevices = degradedDevices;
    }

    public long getActiveAlarms() {
        return activeAlarms;
    }

    public void setActiveAlarms(long activeAlarms) {
        this.activeAlarms = activeAlarms;
    }

    public long getCriticalAlarms() {
        return criticalAlarms;
    }

    public void setCriticalAlarms(long criticalAlarms) {
        this.criticalAlarms = criticalAlarms;
    }

    public long getHealingActions() {
        return healingActions;
    }

    public void setHealingActions(long healingActions) {
        this.healingActions = healingActions;
    }

    public long getSuccessfulHealing() {
        return successfulHealing;
    }

    public void setSuccessfulHealing(long successfulHealing) {
        this.successfulHealing = successfulHealing;
    }

    public long getFailedHealing() {
        return failedHealing;
    }

    public void setFailedHealing(long failedHealing) {
        this.failedHealing = failedHealing;
    }

    public double getAverageHealthScore() {
        return averageHealthScore;
    }

    public void setAverageHealthScore(double averageHealthScore) {
        this.averageHealthScore = averageHealthScore;
    }

    public List<AlarmResponse> getRecentAlarms() {
        return recentAlarms;
    }

    public void setRecentAlarms(List<AlarmResponse> recentAlarms) {
        this.recentAlarms = recentAlarms;
    }

    public List<HealingResponse> getRecentHealingActions() {
        return recentHealingActions;
    }

    public void setRecentHealingActions(List<HealingResponse> recentHealingActions) {
        this.recentHealingActions = recentHealingActions;
    }
}
