import { Alarm } from '@/types';

export const INITIAL_ALARMS: Alarm[] = [
  {
    id: 'ALM-8891',
    deviceId: 'DEV-SW-04',
    deviceName: 'Edge-Leaf-Switch-04',
    service: 'QoS-Policing',
    severity: 'HIGH',
    status: 'OPEN',
    message: 'High buffer occupancy & packet drop threshold breached on Eth1/1 interface (4.8% loss)',
    faultType: 'HIGH_LATENCY',
    rootCause: 'Egress buffer microburst causing TCP window shrink and latency escalation (78.5ms)',
    recommendedAction: 'REROUTE_TRAFFIC',
    createdAt: '2026-09-15T11:42:10Z',
    updatedAt: '2026-09-15T11:42:10Z',
    metricsSnapshot: {
      latencyMs: 78.5,
      packetLossPct: 4.8,
      cpuPct: 89,
      memoryPct: 82
    }
  },
  {
    id: 'ALM-8884',
    deviceId: 'DEV-CR-01',
    deviceName: 'Core-Router-Alpha-US-East',
    service: 'BGP-Routing',
    severity: 'MEDIUM',
    status: 'RECOVERED',
    message: 'BGP Prefix flap detected on AS64512 peer link',
    faultType: 'CONFIG_ERROR',
    rootCause: 'Mismatched route-map community filter committed during automated push',
    recommendedAction: 'RESTORE_CONFIGURATION',
    createdAt: '2026-09-15T10:15:00Z',
    updatedAt: '2026-09-15T10:16:35Z',
    metricsSnapshot: {
      latencyMs: 4.2,
      packetLossPct: 0.0,
      cpuPct: 28,
      memoryPct: 45
    }
  },
  {
    id: 'ALM-8879',
    deviceId: 'DEV-GN-5G-09',
    deviceName: '5G-Cellular-gNodeB-Sector9',
    service: 'O-RAN-Fronthaul',
    severity: 'CRITICAL',
    status: 'RECOVERED',
    message: 'eCPRI transport sync synchronization loss (PTP Grandmaster drift)',
    faultType: 'SERVICE_DOWN',
    rootCause: 'PTP daemon memory segmentation fault during high throughput period',
    recommendedAction: 'RESTART_SERVICE',
    createdAt: '2026-09-15T09:05:12Z',
    updatedAt: '2026-09-15T09:06:20Z',
    metricsSnapshot: {
      latencyMs: 11.2,
      packetLossPct: 0.0,
      cpuPct: 44,
      memoryPct: 51
    }
  }
];
