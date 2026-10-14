export type DeviceStatus = 'ONLINE' | 'OFFLINE' | 'DEGRADED' | 'RECOVERING';

export type AlarmSeverity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export type AlarmStatus = 'OPEN' | 'ANALYZING' | 'HEALING' | 'RECOVERED' | 'FAILED' | 'ESCALATED';

export type FaultType = 'SERVICE_DOWN' | 'CONFIG_ERROR' | 'HIGH_LATENCY' | 'DEVICE_UNREACHABLE';

export type HealingActionType = 
  | 'RESTART_SERVICE' 
  | 'RESTORE_CONFIGURATION' 
  | 'REROUTE_TRAFFIC' 
  | 'DEVICE_RECOVERY'
  | 'ROLLBACK_FIRMWARE'
  | 'CLEAR_INTERFACE_BUFFER';

export interface DeviceInterface {
  name: string;
  ip: string;
  speed: string;
  status: 'UP' | 'DOWN' | 'DEGRADED';
  trafficInMbps: number;
  trafficOutMbps: number;
  errors: number;
}

export interface NetworkDevice {
  id: string;
  name: string;
  type: 'CORE_ROUTER' | 'EDGE_SWITCH' | 'CELLULAR_GNODEB' | 'FIREWALL' | 'DATA_CENTER_GATEWAY' | 'LOAD_BALANCER';
  ip: string;
  status: DeviceStatus;
  location: string;
  firmware: string;
  uptime: string;
  cpuUsage: number; // percentage
  memoryUsage: number; // percentage
  temperature: number; // Celsius
  latencyMs: number;
  packetLossPct: number;
  lastSeen: string;
  activeAlarmsCount: number;
  services: string[];
  interfaces?: DeviceInterface[];
}

export interface Alarm {
  id: string;
  deviceId: string;
  deviceName: string;
  service: string;
  severity: AlarmSeverity;
  status: AlarmStatus;
  message: string;
  faultType?: FaultType;
  rootCause?: string;
  recommendedAction?: HealingActionType;
  createdAt: string;
  updatedAt: string;
  metricsSnapshot?: {
    latencyMs: number;
    packetLossPct: number;
    cpuPct: number;
    memoryPct: number;
  };
}

export interface RCAStep {
  title: string;
  status: 'PASSED' | 'FAILED' | 'WARNING' | 'IN_PROGRESS' | 'PENDING';
  details: string;
  timestamp: string;
}

export interface RCACase {
  id: string;
  alarmId: string;
  deviceId: string;
  deviceName: string;
  service: string;
  faultType: FaultType;
  severity: AlarmSeverity;
  status: 'ANALYZING' | 'COMPLETED' | 'MITIGATING' | 'RESOLVED';
  
  // Pipeline flow items
  alarmTrigger: {
    code: string;
    detectedAt: string;
    metricThreshold: string;
    actualMetric: string;
  };
  eventAnalysis: {
    correlatedEventsCount: number;
    confidenceScore: number;
    telemetryDrift: string;
    affectedSubnets: string[];
    logsSummary: string[];
  };
  healthCheckDiagnostics: RCAStep[];
  rootCause: {
    category: string;
    description: string;
    confidencePct: number;
    blastRadius: string;
  };
  recommendedAction: {
    actionType: HealingActionType;
    estimatedRecoveryTimeSec: number;
    riskScore: 'LOW' | 'MEDIUM' | 'HIGH';
    automatedConfidence: number;
    playbookId: string;
    executionSteps: string[];
  };
}

export interface HealingAction {
  id: string;
  alarmId: string;
  deviceId: string;
  deviceName: string;
  service: string;
  faultType: FaultType;
  rootCause: string;
  action: HealingActionType;
  status: 'QUEUED' | 'IN_PROGRESS' | 'VERIFYING' | 'SUCCESS' | 'FAILED';
  progressPct: number;
  startedAt: string;
  completedAt?: string;
  logs: Array<{
    timestamp: string;
    level: 'INFO' | 'WARN' | 'ACTION' | 'SUCCESS' | 'ERROR';
    text: string;
  }>;
}

export interface RecoveryRecord {
  id: string;
  incidentId: string;
  deviceId: string;
  deviceName: string;
  service: string;
  faultType: FaultType;
  rootCause: string;
  healingAction: HealingActionType;
  result: 'SUCCESS' | 'FAILED' | 'FALLBACK_TRIGGERED';
  verificationMessage: string;
  mttrSeconds: number; // Mean Time to Recovery
  date: string;
  technicianMode: 'FULLY_AUTONOMOUS' | 'SUPERVISED_AI';
}

export interface NetworkHealthPoint {
  time: string;
  healthScore: number;
  latency: number;
  packetLoss: number;
  activeAlarms: number;
  healedIncidents: number;
}

export interface SimulatorState {
  isSimulating: boolean;
  activeFaultId?: string;
  currentStepIndex: number; // 0: Fault Injected, 1: Alarm Open, 2: Analyzing RCA, 3: Healing Action, 4: Verifying, 5: Recovered
  stepLogs: string[];
}

export interface AppSettings {
  theme: 'dark' | 'light' | 'cyberpunk';
  autoRefresh: boolean;
  refreshIntervalSeconds: number;
  soundAlerts: boolean;
  autonomousAutoExecute: boolean;
}

export interface ToastNotification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: string;
  actionUrl?: string;
}
