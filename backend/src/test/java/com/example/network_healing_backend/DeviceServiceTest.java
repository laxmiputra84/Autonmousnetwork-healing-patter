package com.example.network_healing_backend;

import com.example.network_healing_backend.dto.DeviceRequest;
import com.example.network_healing_backend.dto.DeviceResponse;
import com.example.network_healing_backend.entity.Device;
import com.example.network_healing_backend.repository.DeviceRepository;
import com.example.network_healing_backend.service.DeviceService;
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
class DeviceServiceTest {

    @Mock
    private DeviceRepository deviceRepository;

    @InjectMocks
    private DeviceService deviceService;

    private Device testDevice;

    @BeforeEach
    void setUp() {
        testDevice = new Device();
        testDevice.setId(1L);
        testDevice.setDeviceCode("RTR-BLR-001");
        testDevice.setDeviceName("Core-Router-Alpha");
        testDevice.setIpAddress("10.100.1.1");
        testDevice.setDeviceType("ROUTER");
        testDevice.setStatus("ONLINE");
        testDevice.setCpuUsage(20.0);
        testDevice.setMemoryUsage(30.0);
        testDevice.setLatency(4.0);
        testDevice.setPacketLoss(0.0);
        testDevice.setHealthScore(100.0);
    }

    @Test
    void testGetAllDevices() {
        when(deviceRepository.findAll()).thenReturn(List.of(testDevice));
        List<DeviceResponse> responses = deviceService.getAllDevices();
        assertNotNull(responses);
        assertEquals(1, responses.size());
        assertEquals("Core-Router-Alpha", responses.get(0).getName());
    }

    @Test
    void testGetDeviceById() {
        when(deviceRepository.findById(1L)).thenReturn(Optional.of(testDevice));
        DeviceResponse response = deviceService.getDeviceById(1L);
        assertNotNull(response);
        assertEquals(1L, response.getId());
        assertEquals("10.100.1.1", response.getIp());
    }

    @Test
    void testHealthEvaluationNominal() {
        Device dev = new Device();
        dev.setStatus("ONLINE");
        dev.setCpuUsage(25.0);
        dev.setMemoryUsage(35.0);
        dev.setLatency(4.5);
        dev.setPacketLoss(0.0);

        deviceService.evaluateHealth(dev);
        assertEquals(100.0, dev.getHealthScore());
        assertEquals("ONLINE", dev.getStatus());
    }

    @Test
    void testHealthEvaluationDegradedHighCpu() {
        Device dev = new Device();
        dev.setStatus("ONLINE");
        dev.setCpuUsage(95.0);
        dev.setMemoryUsage(85.0);
        dev.setLatency(120.0);
        dev.setPacketLoss(6.0);

        deviceService.evaluateHealth(dev);
        assertTrue(dev.getHealthScore() < 50.0);
        assertEquals("DEGRADED", dev.getStatus());
    }

    @Test
    void testHealthEvaluationOffline() {
        Device dev = new Device();
        dev.setStatus("OFFLINE");
        dev.setCpuUsage(0.0);

        deviceService.evaluateHealth(dev);
        assertEquals(0.0, dev.getHealthScore());
    }

    @Test
    void testCreateDevice() {
        DeviceRequest req = new DeviceRequest();
        req.setDeviceName("Edge-Switch-01");
        req.setIpAddress("10.100.2.1");
        req.setDeviceType("SWITCH");

        when(deviceRepository.save(any(Device.class))).thenAnswer(invocation -> {
            Device d = invocation.getArgument(0);
            d.setId(2L);
            return d;
        });

        DeviceResponse resp = deviceService.createDevice(req);
        assertNotNull(resp);
        assertEquals("Edge-Switch-01", resp.getName());
    }
}
