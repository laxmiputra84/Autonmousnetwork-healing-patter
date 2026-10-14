package com.example.network_healing_backend.controller;

import com.example.network_healing_backend.dto.RecoveryRequest;
import com.example.network_healing_backend.dto.RecoveryResponse;
import com.example.network_healing_backend.service.RecoveryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recovery")
@Tag(name = "Recovery Plans", description = "Multi-step fallback disaster recovery plans and historical records")
public class RecoveryController {

    private final RecoveryService recoveryService;

    public RecoveryController(RecoveryService recoveryService) {
        this.recoveryService = recoveryService;
    }

    @GetMapping
    @Operation(summary = "Get all recovery plans and historical records")
    public ResponseEntity<List<RecoveryResponse>> getAllRecoveryPlans() {
        return ResponseEntity.ok(recoveryService.getAllRecoveryPlans());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get recovery plan details by ID")
    public ResponseEntity<RecoveryResponse> getRecoveryPlanById(@PathVariable Long id) {
        return ResponseEntity.ok(recoveryService.getRecoveryPlanById(id));
    }

    @PostMapping("/execute")
    @Operation(summary = "Execute a multi-step recovery plan")
    public ResponseEntity<RecoveryResponse> executeRecovery(@RequestBody RecoveryRequest request) {
        return ResponseEntity.ok(recoveryService.executeRecovery(request));
    }
}
