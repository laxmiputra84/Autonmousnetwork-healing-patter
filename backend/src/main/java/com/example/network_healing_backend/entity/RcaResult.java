package com.example.network_healing_backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "rca_results")
public class RcaResult {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "rca_code", length = 50)
    private String rcaCode;

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

    @Column(name = "service", length = 100)
    private String service;

    @Column(name = "fault_type", length = 50)
    private String faultType;

    @Column(name = "root_cause", length = 500)
    private String rootCause;

    @Column(name = "category", length = 100)
    private String category;

    @Column(name = "confidence")
    private Double confidence = 95.0; // percentage

    @Column(name = "evidence", columnDefinition = "TEXT")
    private String evidence;

    @Column(name = "recommendation", length = 500)
    private String recommendation;

    @Column(name = "recommended_action", length = 50)
    private String recommendedAction;

    @Column(name = "risk_score", length = 20)
    private String riskScore = "LOW";

    @Column(name = "blast_radius", length = 100)
    private String blastRadius = "Local Fabric Zone";

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    public RcaResult() {
    }

    @PrePersist
    public void onPrePersist() {
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
        if (this.rcaCode == null && this.id != null) {
            this.rcaCode = "RCA-" + this.id;
        }
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
}
