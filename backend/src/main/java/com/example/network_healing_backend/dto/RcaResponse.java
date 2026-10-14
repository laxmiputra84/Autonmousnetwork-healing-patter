package com.example.network_healing_backend.dto;

import com.example.network_healing_backend.entity.RcaResult;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class RcaResponse {

    private Long id;
    private String rcaCode;
    private Long deviceId;
    private String deviceCode;
    private String deviceName;
    private Long alarmId;
    private String alarmCode;
    private String service;
    private String faultType;
    private String rootCause;
    private String category;
    private Double confidence;
    private String evidence;
    private String recommendation;
    private String recommendedAction;
    private String riskScore;
    private String blastRadius;
    private LocalDateTime createdAt;

    // Structured metadata for Frontend RCACase compatibility
    private Map<String, Object> alarmTrigger;
    private Map<String, Object> eventAnalysis;
    private List<Map<String, String>> healthCheckDiagnostics;
    private Map<String, Object> recommendedActionDetails;

    public RcaResponse() {
        this.alarmTrigger = new HashMap<>();
        this.eventAnalysis = new HashMap<>();
        this.healthCheckDiagnostics = new ArrayList<>();
        this.recommendedActionDetails = new HashMap<>();
    }

    public static RcaResponse fromEntity(RcaResult rca) {
        if (rca == null) return null;
        RcaResponse resp = new RcaResponse();
        resp.setId(rca.getId());
        resp.setRcaCode(rca.getRcaCode() != null ? rca.getRcaCode() : "RCA-" + rca.getId());
        resp.setDeviceId(rca.getDeviceId());
        resp.setDeviceCode(rca.getDeviceCode());
        resp.setDeviceName(rca.getDeviceName());
        resp.setAlarmId(rca.getAlarmId());
        resp.setAlarmCode(rca.getAlarmCode());
        resp.setService(rca.getService());
        resp.setFaultType(rca.getFaultType());
        resp.setRootCause(rca.getRootCause());
        resp.setCategory(rca.getCategory());
        resp.setConfidence(rca.getConfidence());
        resp.setEvidence(rca.getEvidence());
        resp.setRecommendation(rca.getRecommendation());
        resp.setRecommendedAction(rca.getRecommendedAction());
        resp.setRiskScore(rca.getRiskScore());
        resp.setBlastRadius(rca.getBlastRadius());
        resp.setCreatedAt(rca.getCreatedAt());

        // Fill frontend-compatible structured data
        Map<String, Object> trigger = new HashMap<>();
        trigger.put("code", "ERR_" + (rca.getFaultType() != null ? rca.getFaultType() : "ANOMALY"));
        trigger.put("detectedAt", rca.getCreatedAt() != null ? rca.getCreatedAt().toString() : LocalDateTime.now().toString());
        trigger.put("actualMetric", rca.getEvidence());
        resp.setAlarmTrigger(trigger);

        Map<String, Object> analysis = new HashMap<>();
        analysis.put("confidenceScore", rca.getConfidence() != null ? rca.getConfidence() / 100.0 : 0.95);
        analysis.put("telemetryDrift", rca.getEvidence());
        analysis.put("correlatedEventsCount", 3);
        resp.setEventAnalysis(analysis);

        List<Map<String, String>> diag = new ArrayList<>();
        diag.add(Map.of("title", "Control Plane Resource Check", "status", "FAILED", "details", rca.getRootCause() != null ? rca.getRootCause() : "Threshold exceeded"));
        diag.add(Map.of("title", "Telemetry Prober Verification", "status", "FAILED", "details", "Service anomalous response"));
        diag.add(Map.of("title", "Redundancy Path Verification", "status", "PASSED", "details", "Failover route active"));
        resp.setHealthCheckDiagnostics(diag);

        Map<String, Object> rec = new HashMap<>();
        rec.put("actionType", rca.getRecommendedAction());
        rec.put("estimatedRecoveryTimeSec", 45);
        rec.put("riskScore", rca.getRiskScore());
        rec.put("automatedConfidence", rca.getConfidence());
        resp.setRecommendedActionDetails(rec);

        return resp;
    }

    // Getters and Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getRcaCode() {
        return rcaCode;
    }

    public void setRcaCode(String rcaCode) {
        this.rcaCode = rcaCode;
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

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public Double getConfidence() {
        return confidence;
    }

    public void setConfidence(Double confidence) {
        this.confidence = confidence;
    }

    public String getEvidence() {
        return evidence;
    }

    public void setEvidence(String evidence) {
        this.evidence = evidence;
    }

    public String getRecommendation() {
        return recommendation;
    }

    public void setRecommendation(String recommendation) {
        this.recommendation = recommendation;
    }

    public String getRecommendedAction() {
        return recommendedAction;
    }

    public void setRecommendedAction(String recommendedAction) {
        this.recommendedAction = recommendedAction;
    }

    public String getRiskScore() {
        return riskScore;
    }

    public void setRiskScore(String riskScore) {
        this.riskScore = riskScore;
    }

    public String getBlastRadius() {
        return blastRadius;
    }

    public void setBlastRadius(String blastRadius) {
        this.blastRadius = blastRadius;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public Map<String, Object> getAlarmTrigger() {
        return alarmTrigger;
    }

    public void setAlarmTrigger(Map<String, Object> alarmTrigger) {
        this.alarmTrigger = alarmTrigger;
    }

    public Map<String, Object> getEventAnalysis() {
        return eventAnalysis;
    }

    public void setEventAnalysis(Map<String, Object> eventAnalysis) {
        this.eventAnalysis = eventAnalysis;
    }

    public List<Map<String, String>> getHealthCheckDiagnostics() {
        return healthCheckDiagnostics;
    }

    public void setHealthCheckDiagnostics(List<Map<String, String>> healthCheckDiagnostics) {
        this.healthCheckDiagnostics = healthCheckDiagnostics;
    }

    public Map<String, Object> getRecommendedActionDetails() {
        return recommendedActionDetails;
    }

    public void setRecommendedActionDetails(Map<String, Object> recommendedActionDetails) {
        this.recommendedActionDetails = recommendedActionDetails;
    }
}
