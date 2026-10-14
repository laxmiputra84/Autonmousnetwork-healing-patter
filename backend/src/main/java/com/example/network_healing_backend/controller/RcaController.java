package com.example.network_healing_backend.controller;

import com.example.network_healing_backend.dto.RcaRequest;
import com.example.network_healing_backend.dto.RcaResponse;
import com.example.network_healing_backend.service.RcaService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rca")
@Tag(name = "Root Cause Analysis", description = "AI & rule-based root cause analysis diagnostics engine")
public class RcaController {

    private final RcaService rcaService;

    public RcaController(RcaService rcaService) {
        this.rcaService = rcaService;
    }

    @PostMapping("/analyze")
    @Operation(summary = "Perform real rule-based RCA analysis for an alarm or device anomaly")
    public ResponseEntity<RcaResponse> analyzeRootCause(@RequestBody RcaRequest request) {
        return ResponseEntity.ok(rcaService.analyzeRootCause(request));
    }

    @GetMapping
    @Operation(summary = "Get historical RCA diagnostic cases")
    public ResponseEntity<List<RcaResponse>> getAllRca() {
        return ResponseEntity.ok(rcaService.getAllRcaResults());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get RCA case details by ID")
    public ResponseEntity<RcaResponse> getRcaById(@PathVariable Long id) {
        return ResponseEntity.ok(rcaService.getRcaById(id));
    }

    @GetMapping("/device/{deviceId}")
    @Operation(summary = "Get RCA cases by device ID")
    public ResponseEntity<List<RcaResponse>> getRcaByDeviceId(@PathVariable Long deviceId) {
        return ResponseEntity.ok(rcaService.getRcaByDeviceId(deviceId));
    }

    @GetMapping("/alarm/{alarmId}")
    @Operation(summary = "Get RCA cases by alarm ID")
    public ResponseEntity<List<RcaResponse>> getRcaByAlarmId(@PathVariable Long alarmId) {
        return ResponseEntity.ok(rcaService.getRcaByAlarmId(alarmId));
    }
}
