package com.example.network_healing_backend;

import com.example.network_healing_backend.dto.DashboardResponse;
import com.example.network_healing_backend.repository.AlarmRepository;
import com.example.network_healing_backend.repository.DeviceRepository;
import com.example.network_healing_backend.repository.HealingActionRepository;
import com.example.network_healing_backend.service.DashboardService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class DashboardServiceTest {

    @Mock
    private DeviceRepository deviceRepository;

    @Mock
    private AlarmRepository alarmRepository;

    @Mock
    private HealingActionRepository healingActionRepository;

    @InjectMocks
    private DashboardService dashboardService;

    @Test
    void testGetDashboardMetrics() {
        when(deviceRepository.count()).thenReturn(25L);
        when(deviceRepository.countByStatus("ONLINE")).thenReturn(21L);
        when(deviceRepository.countByStatus("OFFLINE")).thenReturn(2L);
        when(deviceRepository.countByStatus("DEGRADED")).thenReturn(2L);
        when(alarmRepository.countByStatus("ACTIVE")).thenReturn(7L);
        when(alarmRepository.countBySeverity("CRITICAL")).thenReturn(2L);
        when(healingActionRepository.count()).thenReturn(15L);
        when(healingActionRepository.countByStatus("SUCCESS")).thenReturn(12L);
        when(healingActionRepository.countByStatus("FAILED")).thenReturn(3L);
        when(deviceRepository.getAverageHealthScore()).thenReturn(91.4);
        when(alarmRepository.findAll()).thenReturn(List.of());
        when(healingActionRepository.findAll()).thenReturn(List.of());

        DashboardResponse resp = dashboardService.getDashboardMetrics();

        assertNotNull(resp);
        assertEquals(25L, resp.getTotalDevices());
        assertEquals(21L, resp.getOnlineDevices());
        assertEquals(2L, resp.getOfflineDevices());
        assertEquals(2L, resp.getDegradedDevices());
        assertEquals(7L, resp.getActiveAlarms());
        assertEquals(2L, resp.getCriticalAlarms());
        assertEquals(15L, resp.getHealingActions());
        assertEquals(12L, resp.getSuccessfulHealing());
        assertEquals(3L, resp.getFailedHealing());
        assertEquals(91.4, resp.getAverageHealthScore());
    }
}
