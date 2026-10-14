package com.example.network_healing_backend;

import com.example.network_healing_backend.dto.AlarmRequest;
import com.example.network_healing_backend.dto.AlarmResponse;
import com.example.network_healing_backend.dto.SimulatorRequest;
import com.example.network_healing_backend.dto.SimulatorResponse;
import com.example.network_healing_backend.entity.Device;
import com.example.network_healing_backend.repository.AlarmRepository;
import com.example.network_healing_backend.repository.DeviceRepository;
import com.example.network_healing_backend.service.AlarmService;
import com.example.network_healing_backend.service.DeviceService;
import com.example.network_healing_backend.service.NetworkEventService;
import com.example.network_healing_backend.service.SimulatorService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class SimulatorServiceTest {

    @Mock
    private DeviceRepository deviceRepository;

    @Mock
    private AlarmRepository alarmRepository;

    @Mock
    private DeviceService deviceService;

    @Mock
    private AlarmService alarmService;

    @Mock
    private NetworkEventService networkEventService;

    @InjectMocks
    private SimulatorService simulatorService;

    private Device testDevice;

    @BeforeEach
    void setUp() {
        testDevice = new Device();
        testDevice.setId(1L);
        testDevice.setDeviceCode("RTR-BLR-001");
        testDevice.setDeviceName("Core-Router-Alpha");
        testDevice.setHealthScore(100.0);
        testDevice.setStatus("ONLINE");
    }

    @Test
    void testInjectFaultCpuOverload() {
        when(deviceRepository.findById(1L)).thenReturn(Optional.of(testDevice));

        AlarmResponse mockAlarm = new AlarmResponse();
        mockAlarm.setId(15L);
        mockAlarm.setAlarmCode("ALM-1015");
        when(alarmService.createAlarm(any(AlarmRequest.class))).thenReturn(mockAlarm);

        SimulatorRequest req = new SimulatorRequest(1L, "CPU_OVERLOAD");
        SimulatorResponse resp = simulatorService.injectFault(req);

        assertNotNull(resp);
        assertTrue(resp.isSuccess());
        assertEquals("CPU_OVERLOAD", resp.getFaultType());
        verify(networkEventService, times(1)).recordEvent(any());
        verify(alarmService, times(1)).createAlarm(any());
    }

    @Test
    void testResetAll() {
        when(deviceRepository.findAll()).thenReturn(List.of(testDevice));
        when(alarmRepository.findByStatus("ACTIVE")).thenReturn(List.of());

        SimulatorResponse resp = simulatorService.resetAll();
        assertNotNull(resp);
        assertTrue(resp.isSuccess());
        assertEquals(100.0, resp.getNewHealthScore());
    }
}
