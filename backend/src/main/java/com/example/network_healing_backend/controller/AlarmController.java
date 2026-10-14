package com.example.network_healing_backend.controller;

import com.example.network_healing_backend.dto.AlarmRequest;
import com.example.network_healing_backend.dto.AlarmResponse;
import com.example.network_healing_backend.dto.ApiResponse;
import com.example.network_healing_backend.service.AlarmService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/alarms")
@Tag(name = "Alarms", description = "Network alarm ingestion, filtering, acknowledgment, and resolution")
public class AlarmController {

    private final AlarmService alarmService;

    public AlarmController(AlarmService alarmService) {
        this.alarmService = alarmService;
    }

    @GetMapping
    @Operation(summary = "Get all alarms with optional severity and status filtering")
    public ResponseEntity<List<AlarmResponse>> getAlarms(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String severity) {
        return ResponseEntity.ok(alarmService.getAlarms(status, severity));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get alarm by ID")
    public ResponseEntity<AlarmResponse> getAlarmById(@PathVariable Long id) {
        return ResponseEntity.ok(alarmService.getAlarmById(id));
    }

    @PostMapping
    @Operation(summary = "Create or raise a new alarm")
    public ResponseEntity<AlarmResponse> createAlarm(@Valid @RequestBody AlarmRequest request) {
        AlarmResponse created = alarmService.createAlarm(request);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update alarm details")
    public ResponseEntity<AlarmResponse> updateAlarm(@PathVariable Long id, @RequestBody AlarmRequest request) {
        return ResponseEntity.ok(alarmService.updateAlarm(id, request));
    }

    @PutMapping("/{id}/acknowledge")
    @Operation(summary = "Acknowledge an active alarm")
    public ResponseEntity<AlarmResponse> acknowledgeAlarm(@PathVariable Long id) {
        return ResponseEntity.ok(alarmService.acknowledgeAlarm(id));
    }

    @PutMapping("/{id}/resolve")
    @Operation(summary = "Mark an alarm as resolved")
    public ResponseEntity<AlarmResponse> resolveAlarm(@PathVariable Long id) {
        return ResponseEntity.ok(alarmService.resolveAlarm(id));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete an alarm")
    public ResponseEntity<ApiResponse<String>> deleteAlarm(@PathVariable Long id) {
        alarmService.deleteAlarm(id);
        return ResponseEntity.ok(ApiResponse.ok("Alarm deleted successfully", "Alarm " + id + " removed"));
    }
}
