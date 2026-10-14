package com.example.network_healing_backend;

import com.example.network_healing_backend.dto.AutonomousWorkflowResponse;
import com.example.network_healing_backend.dto.HealingRequest;
import com.example.network_healing_backend.dto.HealingResponse;
import com.example.network_healing_backend.dto.RcaResponse;
import com.example.network_healing_backend.entity.Alarm;
import com.example.network_healing_backend.entity.Device;
import com.example.network_healing_backend.entity.HealingAction;
import com.example.network_healing_backend.repository.AlarmRepository;
import com.example.network_healing_backend.repository.DeviceRepository;
import com.example.network_healing_backend.repository.HealingActionRepository;
import com.example.network_healing_backend.service.*;
import org.junit.jupiter.api.BeforeEach;
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
class HealingServiceTest {

    @Mock
    private HealingActionRepository healingActionRepository;

    @Mock
    private DeviceRepository deviceRepository;

    @Mock
    private AlarmRepository alarmRepository;

    @Mock
    private DeviceService deviceService;

    @Mock
    private AlarmService alarmService;

    @Mock
    private RcaService rcaService;

    @Mock
    private RecoveryService recoveryService;

    @InjectMocks
    private HealingService healingService;

    private Device testDevice;
    private Alarm testAlarm;

    @BeforeEach
    void setUp() {
        testDevice = new Device();
        testDevice.setId(1L);
        testDevice.setDeviceName("Edge-Leaf-Switch-04");
        testDevice.setCpuUsage(95.0);
        testDevice.setHealthScore(40.0);
        testDevice.setStatus("DEGRADED");

        testAlarm = new Alarm();
        testAlarm.setId(10L);
        testAlarm.setDeviceId(1L);
        testAlarm.setAlarmCode("ALM-8891");
        testAlarm.setSeverity("HIGH");
        testAlarm.setStatus("ACTIVE");
    }

    @Test
    void testExecuteHealingSuccess() {
        when(deviceRepository.findById(1L)).thenReturn(Optional.of(testDevice));
        when(healingActionRepository.save(any(HealingAction.class))).thenAnswer(i -> {
            HealingAction h = i.getArgument(0);
            h.setId(50L);
            return h;
        });

        HealingRequest req = new HealingRequest();
        req.setDeviceId(1L);
        req.setActionType("RESTART_SERVICE");

        HealingResponse resp = healingService.executeHealing(req);
        assertNotNull(resp);
        assertEquals("SUCCESS", resp.getStatus());
        assertEquals(100, resp.getProgressPct());
    }

    @Test
    void testAutonomousWorkflowSuccess() {
        when(alarmRepository.findById(10L)).thenReturn(Optional.of(testAlarm));
        when(deviceRepository.findById(1L)).thenReturn(Optional.of(testDevice));

        RcaResponse rca = new RcaResponse();
        rca.setId(100L);
        rca.setRecommendedAction("RESTART_SERVICE");
        rca.setRootCause("High CPU exhaustion");
        when(rcaService.analyzeRootCause(any())).thenReturn(rca);

        when(healingActionRepository.save(any(HealingAction.class))).thenAnswer(i -> {
            HealingAction h = i.getArgument(0);
            h.setId(50L);
            h.setStatus("SUCCESS");
            return h;
        });

        // Simulating device restored to 100 health
        doAnswer(invocation -> {
            testDevice.setHealthScore(100.0);
            testDevice.setStatus("ONLINE");
            return null;
        }).when(deviceService).evaluateHealth(any(Device.class));

        AutonomousWorkflowResponse workflow = healingService.executeAutonomousWorkflow(10L);
        assertNotNull(workflow);
        assertTrue(workflow.isSuccess());
        assertTrue(workflow.isAlarmResolved());
        verify(alarmService, times(1)).resolveAlarm(10L);
    }
}
