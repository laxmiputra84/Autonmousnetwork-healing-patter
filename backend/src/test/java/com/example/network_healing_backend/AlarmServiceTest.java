package com.example.network_healing_backend;

import com.example.network_healing_backend.dto.AlarmRequest;
import com.example.network_healing_backend.dto.AlarmResponse;
import com.example.network_healing_backend.entity.Alarm;
import com.example.network_healing_backend.entity.Device;
import com.example.network_healing_backend.repository.AlarmRepository;
import com.example.network_healing_backend.repository.DeviceRepository;
import com.example.network_healing_backend.service.AlarmService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AlarmServiceTest {

    @Mock
    private AlarmRepository alarmRepository;

    @Mock
    private DeviceRepository deviceRepository;

    @InjectMocks
    private AlarmService alarmService;

    private Alarm testAlarm;
    private Device testDevice;

    @BeforeEach
    void setUp() {
        testDevice = new Device();
        testDevice.setId(1L);
        testDevice.setDeviceCode("RTR-BLR-001");
        testDevice.setDeviceName("Core-Router-Alpha");
        testDevice.setActiveAlarmsCount(1);

        testAlarm = new Alarm();
        testAlarm.setId(10L);
        testAlarm.setAlarmCode("ALM-8891");
        testAlarm.setDeviceId(1L);
        testAlarm.setDeviceName("Core-Router-Alpha");
        testAlarm.setSeverity("HIGH");
        testAlarm.setStatus("ACTIVE");
        testAlarm.setMessage("Buffer overrun on interface Eth1/1");
        testAlarm.setDetectedAt(LocalDateTime.now());
    }

    @Test
    void testGetAlarmsFiltered() {
        when(alarmRepository.findByStatusAndSeverity("ACTIVE", "HIGH")).thenReturn(List.of(testAlarm));
        List<AlarmResponse> responses = alarmService.getAlarms("ACTIVE", "HIGH");
        assertNotNull(responses);
        assertEquals(1, responses.size());
        assertEquals("HIGH", responses.get(0).getSeverity());
    }

    @Test
    void testAcknowledgeAlarm() {
        when(alarmRepository.findById(10L)).thenReturn(Optional.of(testAlarm));
        when(alarmRepository.save(any(Alarm.class))).thenReturn(testAlarm);

        AlarmResponse resp = alarmService.acknowledgeAlarm(10L);
        assertNotNull(resp);
        assertEquals("ACKNOWLEDGED", resp.getStatus());
    }

    @Test
    void testResolveAlarm() {
        when(alarmRepository.findById(10L)).thenReturn(Optional.of(testAlarm));
        when(alarmRepository.save(any(Alarm.class))).thenReturn(testAlarm);
        when(deviceRepository.findById(1L)).thenReturn(Optional.of(testDevice));

        AlarmResponse resp = alarmService.resolveAlarm(10L);
        assertNotNull(resp);
        assertEquals("RESOLVED", resp.getStatus());
        verify(deviceRepository, times(1)).save(testDevice);
        assertEquals(0, testDevice.getActiveAlarmsCount());
    }
}
