package com.example.network_healing_backend.controller;

import com.example.network_healing_backend.dto.AutonomousWorkflowResponse;
import com.example.network_healing_backend.dto.HealingRequest;
import com.example.network_healing_backend.dto.HealingResponse;
import com.example.network_healing_backend.service.HealingService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/healing")
@Tag(name = "Autonomous Healing", description = "Autonomous remediation playbooks and self-healing engine")
public class HealingController {

    private final HealingService healingService;

    public HealingController(HealingService healingService) {
        this.healingService = healingService;
    }

    @GetMapping
    @Operation(summary = "Get all autonomous healing action records")
    public ResponseEntity<List<HealingResponse>> getAllHealingActions() {
        return ResponseEntity.ok(healingService.getAllHealingActions());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get healing action execution details by ID")
    public ResponseEntity<HealingResponse> getHealingActionById(@PathVariable Long id) {
        return ResponseEntity.ok(healingService.getHealingActionById(id));
    }

    @PostMapping("/execute")
    @Operation(summary = "Manually or programmatically trigger an autonomous healing action")
    public ResponseEntity<HealingResponse> executeHealing(@Valid @RequestBody HealingRequest request) {
        return ResponseEntity.ok(healingService.executeHealing(request));
    }

    @PostMapping("/auto/{alarmId}")
    @Operation(summary = "Execute the complete autonomous workflow: Detect -> RCA -> Select Action -> Execute -> Verify -> Resolve/Recover")
    public ResponseEntity<AutonomousWorkflowResponse> executeAutonomousWorkflow(@PathVariable Long alarmId) {
        return ResponseEntity.ok(healingService.executeAutonomousWorkflow(alarmId));
    }
}
