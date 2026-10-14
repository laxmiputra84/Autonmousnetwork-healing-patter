package com.example.network_healing_backend.controller;

import com.example.network_healing_backend.dto.SimulatorRequest;
import com.example.network_healing_backend.dto.SimulatorResponse;
import com.example.network_healing_backend.service.SimulatorService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/simulator")
@Tag(name = "Fault Simulator", description = "Synthetic network fault injection, traffic spikes, and state resets")
public class SimulatorController {

    private final SimulatorService simulatorService;

    public SimulatorController(SimulatorService simulatorService) {
        this.simulatorService = simulatorService;
    }

    @PostMapping("/fault")
    @Operation(summary = "Inject a synthetic fault (CPU_OVERLOAD, MEMORY_OVERLOAD, PACKET_LOSS, HIGH_LATENCY, DEVICE_DOWN, etc.)")
    public ResponseEntity<SimulatorResponse> injectFault(@Valid @RequestBody SimulatorRequest request) {
        return ResponseEntity.ok(simulatorService.injectFault(request));
    }

    @PostMapping("/traffic")
    @Operation(summary = "Inject sudden microburst traffic spike")
    public ResponseEntity<SimulatorResponse> injectTraffic(@RequestBody SimulatorRequest request) {
        return ResponseEntity.ok(simulatorService.injectTraffic(request));
    }

    @PostMapping("/reset")
    @Operation(summary = "Reset network topology and devices to nominal healthy 100% baseline")
    public ResponseEntity<SimulatorResponse> resetSimulation() {
        return ResponseEntity.ok(simulatorService.resetAll());
    }
}
