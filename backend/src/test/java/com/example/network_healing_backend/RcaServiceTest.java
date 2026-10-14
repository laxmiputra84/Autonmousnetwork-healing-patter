package com.example.network_healing_backend;

import com.example.network_healing_backend.dto.RcaRequest;
import com.example.network_healing_backend.dto.RcaResponse;
import com.example.network_healing_backend.entity.Alarm;
import com.example.network_healing_backend.entity.Device;
import com.example.network_healing_backend.entity.RcaResult;
import com.example.network_healing_backend.repository.AlarmRepository;
import com.example.network_healing_backend.repository.DeviceRepository;
import com.example.network_healing_backend.repository.RcaResultRepository;
import com.example.network_healing_backend.service.RcaService;
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
class RcaServiceTest {

    @Mock
    private RcaResultRepository rcaResultRepository;

    @Mock
    private DeviceRepository deviceRepository;

    @Mock
    private AlarmRepository alarmRepository;

    @InjectMocks
    private RcaService rcaService;

    private Device testDevice;
    private Alarm testAlarm;

    @BeforeEach
    void setUp() {
        testDevice = new Device();
        testDevice.setId(1L);
        testDevice.setDeviceName("Core-Router-Alpha");
        testDevice.setCpuUsage(95.0);
        testDevice.setMemoryUsage(45.0);
        testDevice.setLatency(5.0);
        testDevice.setPacketLoss(0.0);
        testDevice.setStatus("ONLINE");

        testAlarm = new Alarm();
        testAlarm.setId(10L);
        testAlarm.setDeviceId(1L);
        testAlarm.setService("BGP-Worker");
        testAlarm.setFaultType("CPU_OVERLOAD");
        testAlarm.setSeverity("HIGH");
    }

    @Test
    void testAnalyzeRootCauseCpuOverload() {
        when(alarmRepository.findById(10L)).thenReturn(Optional.of(testAlarm));
        when(deviceRepository.findById(1L)).thenReturn(Optional.of(testDevice));
        when(rcaResultRepository.save(any(RcaResult.class))).thenAnswer(i -> {
            RcaResult r = i.getArgument(0);
            r.setId(100L);
            return r;
        });

        RcaRequest req = new RcaRequest(1L, 10L);
        RcaResponse resp = rcaService.analyzeRootCause(req);

        assertNotNull(resp);
        assertEquals("Compute Exhaustion", resp.getCategory());
        assertEquals("RESTART_SERVICE", resp.getRecommendedAction());
        assertTrue(resp.getConfidence() >= 90.0);
    }

    @Test
    void testRuleBasedAnalysisDeviceOffline() {
        testDevice.setStatus("OFFLINE");
        testAlarm.setFaultType("DEVICE_DOWN");

        RcaResult rca = rcaService.performRuleBasedAnalysis(testDevice, testAlarm);
        assertEquals("Hardware/Kernel Failure", rca.getCategory());
        assertEquals("DEVICE_RECOVERY", rca.getRecommendedAction());
    }

    @Test
    void testRuleBasedAnalysisPacketLoss() {
        testDevice.setCpuUsage(25.0);
        testDevice.setPacketLoss(8.5);
        testAlarm.setFaultType("PACKET_LOSS");

        RcaResult rca = rcaService.performRuleBasedAnalysis(testDevice, testAlarm);
        assertEquals("Data Plane Congestion", rca.getCategory());
        assertEquals("REROUTE_TRAFFIC", rca.getRecommendedAction());
    }
}
