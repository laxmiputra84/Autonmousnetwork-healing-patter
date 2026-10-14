import { RecoveryRecord, NetworkHealthPoint } from '@/types';

export const INITIAL_RECOVERY_HISTORY: RecoveryRecord[] = [
  {
    id: 'REC-9042',
    incidentId: 'INC-8884',
    deviceId: 'DEV-CR-01',
    deviceName: 'Core-Router-Alpha-US-East',
    service: 'BGP-Routing',
    faultType: 'CONFIG_ERROR',
    rootCause: 'Mismatched route-map community filter committed during automated push',
    healingAction: 'RESTORE_CONFIGURATION',
    result: 'SUCCESS',
    verificationMessage: 'Synthetic BGP echo probe verified 100% convergence across all 14 peers. Zero route drops.',
    mttrSeconds: 85,
    date: '2026-09-15 10:16:35',
    technicianMode: 'FULLY_AUTONOMOUS'
  },
  {
    id: 'REC-9039',
    incidentId: 'INC-8879',
    deviceId: 'DEV-GN-5G-09',
    deviceName: '5G-Cellular-gNodeB-Sector9',
    service: 'O-RAN-Fronthaul',
    faultType: 'SERVICE_DOWN',
    rootCause: 'PTP daemon memory segmentation fault during high throughput period',
    healingAction: 'RESTART_SERVICE',
    result: 'SUCCESS',
    verificationMessage: 'PTP grandmaster locked, carrier jitter measured at 3.2ns (target < 10ns). Cell live.',
    mttrSeconds: 55,
    date: '2026-09-15 09:06:20',
    technicianMode: 'FULLY_AUTONOMOUS'
  },
  {
    id: 'REC-9021',
    incidentId: 'INC-8830',
    deviceId: 'DEV-FW-02',
    deviceName: 'NextGen-Edge-Firewall-Primary',
    service: 'IPSec-VPN-Mesh',
    faultType: 'SERVICE_DOWN',
    rootCause: 'Crypto-engine key renegotiation race condition',
    healingAction: 'RESTART_SERVICE',
    result: 'SUCCESS',
    verificationMessage: 'IKE Phase 2 SAs re-established. 120 tunnels active with 0% packet loss.',
    mttrSeconds: 42,
    date: '2026-09-14 22:18:04',
    technicianMode: 'FULLY_AUTONOMOUS'
  },
  {
    id: 'REC-9015',
    incidentId: 'INC-8811',
    deviceId: 'DEV-DC-GW-07',
    deviceName: 'DC-Spine-Gateway-Tokyo',
    service: 'SRv6-Tunneling',
    faultType: 'HIGH_LATENCY',
    rootCause: 'Hardware policing rate limit misconfiguration on Spine port 4',
    healingAction: 'REROUTE_TRAFFIC',
    result: 'SUCCESS',
    verificationMessage: 'Segment Routing path reprogrammed over alternate redundant link. Latency dropped to 5.6ms.',
    mttrSeconds: 94,
    date: '2026-09-14 16:40:12',
    technicianMode: 'SUPERVISED_AI'
  },
  {
    id: 'REC-8998',
    incidentId: 'INC-8765',
    deviceId: 'DEV-LB-03',
    deviceName: 'Global-Traffic-LoadBalancer-EU',
    service: 'HTTP3-Proxy',
    faultType: 'DEVICE_UNREACHABLE',
    rootCause: 'Kernel TCP stack deadlocked under SYN flood anomaly',
    healingAction: 'DEVICE_RECOVERY',
    result: 'SUCCESS',
    verificationMessage: 'Device hardware BMC reset performed, health probe OK, proxy VIP listening on :443.',
    mttrSeconds: 128,
    date: '2026-09-14 08:12:30',
    technicianMode: 'FULLY_AUTONOMOUS'
  }
];

export const NETWORK_HEALTH_CHART_DATA: NetworkHealthPoint[] = [
  { time: '06:00', healthScore: 99.8, latency: 4.8, packetLoss: 0.01, activeAlarms: 0, healedIncidents: 1 },
  { time: '07:00', healthScore: 99.7, latency: 5.1, packetLoss: 0.02, activeAlarms: 0, healedIncidents: 1 },
  { time: '08:00', healthScore: 96.2, latency: 18.4, packetLoss: 0.8, activeAlarms: 1, healedIncidents: 2 },
  { time: '09:00', healthScore: 94.1, latency: 24.2, packetLoss: 1.4, activeAlarms: 1, healedIncidents: 3 },
  { time: '10:00', healthScore: 98.6, latency: 8.9, packetLoss: 0.1, activeAlarms: 1, healedIncidents: 4 },
  { time: '11:00', healthScore: 97.4, latency: 14.1, packetLoss: 0.5, activeAlarms: 2, healedIncidents: 4 },
  { time: '12:00', healthScore: 99.4, latency: 5.2, packetLoss: 0.01, activeAlarms: 1, healedIncidents: 5 },
];
