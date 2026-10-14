import { HealingAction, RCACase } from '@/types';

export const INITIAL_HEALING_ACTIONS: HealingAction[] = [
  {
    id: 'ACT-6401',
    alarmId: 'ALM-8891',
    deviceId: 'DEV-SW-04',
    deviceName: 'Edge-Leaf-Switch-04',
    service: 'QoS-Policing',
    faultType: 'HIGH_LATENCY',
    rootCause: 'Egress buffer microburst causing TCP window shrink and latency escalation',
    action: 'REROUTE_TRAFFIC',
    status: 'IN_PROGRESS',
    progressPct: 65,
    startedAt: '2026-09-15T11:42:30Z',
    logs: [
      { timestamp: '11:42:30', level: 'INFO', text: 'Telemetry alarm ALM-8891 ingested by Autonomous Orchestrator' },
      { timestamp: '11:42:35', level: 'ACTION', text: 'Synthesizing dynamic path cost calculation over alternate Spine-02 link' },
      { timestamp: '11:42:42', level: 'ACTION', text: 'Applying BGP flowspec reroute policy to drain buffer on Eth1/1' },
      { timestamp: '11:42:50', level: 'INFO', text: 'Traffic diversion initiated (58% shifted to Eth1/2 alternate spine)' }
    ]
  },
  {
    id: 'ACT-6398',
    alarmId: 'ALM-8884',
    deviceId: 'DEV-CR-01',
    deviceName: 'Core-Router-Alpha-US-East',
    service: 'BGP-Routing',
    faultType: 'CONFIG_ERROR',
    rootCause: 'Mismatched route-map community filter committed during automated push',
    action: 'RESTORE_CONFIGURATION',
    status: 'SUCCESS',
    progressPct: 100,
    startedAt: '2026-09-15T10:15:10Z',
    completedAt: '2026-09-15T10:16:35Z',
    logs: [
      { timestamp: '10:15:10', level: 'INFO', text: 'RCA matched config drift hash with candidate checkpoint #492' },
      { timestamp: '10:15:30', level: 'ACTION', text: 'Executing rollback to Golden Configuration Checkpoint 492' },
      { timestamp: '10:16:10', level: 'INFO', text: 'Config syntax validated, committing dry-run check' },
      { timestamp: '10:16:35', level: 'SUCCESS', text: 'Configuration restored successfully. BGP neighbor session re-established.' }
    ]
  },
  {
    id: 'ACT-6391',
    alarmId: 'ALM-8879',
    deviceId: 'DEV-GN-5G-09',
    deviceName: '5G-Cellular-gNodeB-Sector9',
    service: 'O-RAN-Fronthaul',
    faultType: 'SERVICE_DOWN',
    rootCause: 'PTP daemon memory segmentation fault during high throughput period',
    action: 'RESTART_SERVICE',
    status: 'SUCCESS',
    progressPct: 100,
    startedAt: '2026-09-15T09:05:25Z',
    completedAt: '2026-09-15T09:06:20Z',
    logs: [
      { timestamp: '09:05:25', level: 'INFO', text: 'Process ptp4l crash detected on core 3' },
      { timestamp: '09:05:40', level: 'ACTION', text: 'Isolating process PID 19844 and issuing systemctl restart ptp4l' },
      { timestamp: '09:06:05', level: 'INFO', text: 'PTP lock re-acquired with grandmaster clock at <5ns jitter' },
      { timestamp: '09:06:20', level: 'SUCCESS', text: 'eCPRI carrier sync verified online and stable' }
    ]
  }
];

export const INITIAL_RCA_CASES: RCACase[] = [
  {
    id: 'RCA-4029',
    alarmId: 'ALM-8891',
    deviceId: 'DEV-SW-04',
    deviceName: 'Edge-Leaf-Switch-04',
    service: 'QoS-Policing',
    faultType: 'HIGH_LATENCY',
    severity: 'HIGH',
    status: 'MITIGATING',
    alarmTrigger: {
      code: 'ERR_QOS_LATENCY_EXCEEDED_50MS',
      detectedAt: '2026-09-15T11:42:10Z',
      metricThreshold: 'Latency > 50ms (Actual: 78.5ms)',
      actualMetric: '78.5ms latency / 4.8% drop'
    },
    eventAnalysis: {
      correlatedEventsCount: 4,
      confidenceScore: 0.96,
      telemetryDrift: '+1200% queue depth over 60s window',
      affectedSubnets: ['10.100.4.0/24', '10.100.4.128/25'],
      logsSummary: [
        'Queue buffer headroom exhausted on ASIC chip 0 port 1',
        'Drop tail policy dropping VoIP and high priority TCP segments',
        'Adjacent spine switch Spine-02 has 74% idle capacity available'
      ]
    },
    healthCheckDiagnostics: [
      { title: 'ASIC Memory & Temperature Check', status: 'PASSED', details: 'Core temp 58C (normal), ASIC memory OK', timestamp: '11:42:12' },
      { title: 'Port Link Layer Optics & CRC', status: 'PASSED', details: 'Optical RX/TX power in normal range (-4.2dBm)', timestamp: '11:42:15' },
      { title: 'Buffer Congestion & Queue Depth', status: 'FAILED', details: 'Egress buffer utilization pinned at 98.4%', timestamp: '11:42:18' },
      { title: 'Alternate Spine Route Health', status: 'PASSED', details: 'Eth1/2 path to Spine-02 is clean with 0% loss', timestamp: '11:42:20' }
    ],
    rootCause: {
      category: 'Network Congestion / Buffer Exhaustion',
      description: 'Localized microburst traffic stream exceeding single-port QoS burst allowance on Eth1/1.',
      confidencePct: 96,
      blastRadius: '2 Subnets, ~450 active enterprise sessions'
    },
    recommendedAction: {
      actionType: 'REROUTE_TRAFFIC',
      estimatedRecoveryTimeSec: 45,
      riskScore: 'LOW',
      automatedConfidence: 98,
      playbookId: 'PB-NET-TRAFFIC-DIVERSION-V3',
      executionSteps: [
        'Verify target spine Spine-02 health and headroom',
        'Inject dynamic BGP Weight/Local-Pref on Eth1/2',
        'Drain traffic from Eth1/1 until buffer drops below 20%',
        'Run synthetic probe to confirm latency normalizes < 10ms'
      ]
    }
  }
];
