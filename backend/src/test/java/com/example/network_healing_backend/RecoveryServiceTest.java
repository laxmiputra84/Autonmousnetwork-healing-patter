package com.example.network_healing_backend;

import com.example.network_healing_backend.dto.RecoveryRequest;
import com.example.network_healing_backend.dto.RecoveryResponse;
import com.example.network_healing_backend.entity.Device;
import com.example.network_healing_backend.entity.RecoveryPlan;
import com.example.network_healing_backend.repository.DeviceRepository;
import com.example.network_healing_backend.repository.RecoveryPlanRepository;
import com.example.network_healing_backend.service.DeviceService;
import com.example.network_healing_backend.service.RecoveryService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class RecoveryServiceTest {

    @Mock
    private RecoveryPlanRepository recoveryPlanRepository;

    @Mock
    private DeviceRepository deviceRepository;

    @Mock
    private DeviceService deviceService;

    @InjectMocks
    private RecoveryService recoveryService;

    @Test
    void testExecuteRecoverySuccess() {
        Device dev = new Device();
        dev.setId(1L);
        dev.setDeviceName("Core-Router-Alpha");
        dev.setStatus("DEGRADED");

        when(deviceRepository.findById(1L)).thenReturn(Optional.of(dev));
        when(recoveryPlanRepository.save(any(RecoveryPlan.class))).thenAnswer(i -> {
            RecoveryPlan p = i.getArgument(0);
            p.setId(200L);
            return p;
        });

        RecoveryRequest req = new RecoveryRequest();
        req.setDeviceId(1L);
        req.setPlanName("Failover Recovery Plan");
        req.setService("BGP");
        req.setFaultType("CONFIG_ERROR");

        RecoveryResponse resp = recoveryService.executeRecovery(req);
        assertNotNull(resp);
        assertEquals("SUCCESS", resp.getStatus());
        assertEquals("Core-Router-Alpha", resp.getDeviceName());
    }
}
