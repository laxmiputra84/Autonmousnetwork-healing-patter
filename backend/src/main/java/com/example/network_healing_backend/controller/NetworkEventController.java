package com.example.network_healing_backend.controller;

import com.example.network_healing_backend.dto.NetworkEventRequest;
import com.example.network_healing_backend.dto.NetworkEventResponse;
import com.example.network_healing_backend.service.NetworkEventService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/network-events")
@Tag(name = "Network Events", description = "Telemetry streaming events, metric breaches, and link changes")
public class NetworkEventController {

    private final NetworkEventService networkEventService;

    public NetworkEventController(NetworkEventService networkEventService) {
        this.networkEventService = networkEventService;
    }

    @GetMapping
    @Operation(summary = "Get all network events in reverse chronological order")
    public ResponseEntity<List<NetworkEventResponse>> getAllEvents() {
        return ResponseEntity.ok(networkEventService.getAllEvents());
    }

    @GetMapping("/device/{deviceId}")
    @Operation(summary = "Get network events for a specific device")
    public ResponseEntity<List<NetworkEventResponse>> getEventsByDeviceId(@PathVariable Long deviceId) {
        return ResponseEntity.ok(networkEventService.getEventsByDeviceId(deviceId));
    }

    @PostMapping
    @Operation(summary = "Record a new telemetry network event")
    public ResponseEntity<NetworkEventResponse> recordEvent(@Valid @RequestBody NetworkEventRequest request) {
        NetworkEventResponse created = networkEventService.recordEvent(request);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }
}
