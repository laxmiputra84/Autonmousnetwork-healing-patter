/**
 * Autonomous Network Healing Platform - API Client
 * Connects frontend directly to Spring Boot REST backend on http://localhost:8080/api
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';
const DEFAULT_TIMEOUT_MS = 6000;

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT_MS);

  try {
    const res = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...options.headers,
      },
    });

    if (!res.ok) {
      const errorText = await res.text();
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { message: errorText || `HTTP ${res.status}: ${res.statusText}` };
      }
      throw new Error(errorData.message || `Request failed with status ${res.status}`);
    }

    return (await res.json()) as T;
  } finally {
    clearTimeout(id);
  }
}

// ==========================================
// Health & Diagnostic Checks
// ==========================================
export async function checkBackendHealth(): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE_URL}/dashboard`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      cache: 'no-store',
    });
    return res.ok;
  } catch {
    return false;
  }
}

// ==========================================
// Dashboard
// ==========================================
export interface BackendDashboardData {
  totalDevices: number;
  onlineDevices: number;
  offlineDevices: number;
  degradedDevices: number;
  activeAlarms: number;
  criticalAlarms: number;
  healingActions: number;
  successfulHealing: number;
  failedHealing: number;
  averageHealthScore: number;
  devicesDistribution: Array<{ status: string; count: number }>;
  alarmsSeverityDistribution: Array<{ severity: string; count: number }>;
  healingActionsTypeDistribution: Array<{ type: string; count: number }>;
  recentAlarms: any[];
  recentHealingActions: any[];
}

export async function fetchDashboard(): Promise<BackendDashboardData> {
  return request<BackendDashboardData>('/dashboard');
}

// ==========================================
// Device Management
// ==========================================
export interface BackendDevice {
  id: number;
  deviceCode: string;
  deviceName: string;
  hostname: string;
  ipAddress: string;
  deviceType: string;
  vendor: string;
  model: string;
  location: string;
  status: string;
  healthScore: number;
  cpuUsage: number;
  memoryUsage: number;
  latency: number;
  packetLoss: number;
  uptime: string;
  lastSeen: string;
  createdAt: string;
  updatedAt: string;
}

export async function fetchDevices(): Promise<BackendDevice[]> {
  return request<BackendDevice[]>('/devices');
}

export async function fetchDevice(id: number | string): Promise<BackendDevice> {
  return request<BackendDevice>(`/devices/${id}`);
}

export async function createDevice(device: Partial<BackendDevice>): Promise<BackendDevice> {
  return request<BackendDevice>('/devices', {
    method: 'POST',
    body: JSON.stringify(device),
  });
}

export async function updateDevice(id: number | string, device: Partial<BackendDevice>): Promise<BackendDevice> {
  return request<BackendDevice>(`/devices/${id}`, {
    method: 'PUT',
    body: JSON.stringify(device),
  });
}

export async function deleteDevice(id: number | string): Promise<void> {
  return request<void>(`/devices/${id}`, {
    method: 'DELETE',
  });
}

// ==========================================
// Alarm Management
// ==========================================
export interface BackendAlarm {
  id: number;
  alarmCode: string;
  deviceId: number;
  deviceCode: string;
  deviceName: string;
  service: string;
  alarmType: string;
  severity: string;
  message: string;
  status: string;
  source: string;
  faultType?: string;
  rootCause?: string;
  recommendedAction?: string;
  detectedAt?: string;
  resolvedAt?: string;
  createdAt?: string;
  updatedAt?: string;
  metricsSnapshot?: Record<string, any>;
}

export async function fetchAlarms(params?: { status?: string; severity?: string }): Promise<BackendAlarm[]> {
  const query = new URLSearchParams();
  if (params?.status) query.append('status', params.status);
  if (params?.severity) query.append('severity', params.severity);
  const qStr = query.toString();
  return request<BackendAlarm[]>(`/alarms${qStr ? `?${qStr}` : ''}`);
}

export async function fetchAlarm(id: number | string): Promise<BackendAlarm> {
  return request<BackendAlarm>(`/alarms/${id}`);
}

export async function acknowledgeAlarm(id: number | string): Promise<BackendAlarm> {
  return request<BackendAlarm>(`/alarms/${id}/acknowledge`, {
    method: 'PUT',
  });
}

export async function resolveAlarm(id: number | string): Promise<BackendAlarm> {
  return request<BackendAlarm>(`/alarms/${id}/resolve`, {
    method: 'PUT',
  });
}

// ==========================================
// Root Cause Analysis (RCA)
// ==========================================
export interface BackendRcaResult {
  id: number;
  rcaCode: string;
  deviceId: number;
  deviceCode: string;
  deviceName: string;
  alarmId?: number;
  alarmCode?: string;
  service: string;
  faultType: string;
  rootCause: string;
  category: string;
  confidence: number;
  evidence: string;
  recommendation: string;
  recommendedAction: string;
  riskScore: string;
  blastRadius: string;
  createdAt: string;
  alarmTrigger?: Record<string, any>;
  eventAnalysis?: Record<string, any>;
  healthCheckDiagnostics?: any[];
  recommendedActionDetails?: Record<string, any>;
}

export async function fetchRcaCases(): Promise<BackendRcaResult[]> {
  return request<BackendRcaResult[]>('/rca');
}

export async function fetchRcaCase(id: number | string): Promise<BackendRcaResult> {
  return request<BackendRcaResult>(`/rca/${id}`);
}

export async function triggerRca(deviceId: number | string, alarmId?: number | string): Promise<BackendRcaResult> {
  return request<BackendRcaResult>('/rca/analyze', {
    method: 'POST',
    body: JSON.stringify({ deviceId: Number(deviceId), alarmId: alarmId ? Number(alarmId) : null }),
  });
}

// ==========================================
// Autonomous Healing Engine
// ==========================================
export interface BackendHealingAction {
  id: number;
  actionCode: string;
  deviceId: number;
  deviceCode: string;
  deviceName: string;
  alarmId?: number;
  alarmCode?: string;
  rcaId?: number;
  actionType: string;
  action: string;
  service?: string;
  faultType?: string;
  rootCause?: string;
  description: string;
  status: string;
  progressPct: number;
  result?: string;
  executedAt?: string;
  completedAt?: string;
  startedAt?: string;
  logs?: any;
}

export interface BackendAutonomousWorkflowResponse {
  success: boolean;
  alarmId: number;
  alarmCode: string;
  deviceId: number;
  deviceCode: string;
  deviceName: string;
  triggerSeverity: string;
  detectedFault: string;
  rcaAnalysis: BackendRcaResult;
  selectedHealingAction: string;
  healingExecution: BackendHealingAction;
  alarmResolved: boolean;
  updatedHealthScore: number;
  updatedDeviceStatus: string;
  workflowSummary: string;
  timestamp: string;
}

export async function fetchHealingActions(): Promise<BackendHealingAction[]> {
  return request<BackendHealingAction[]>('/healing');
}

export async function fetchHealingAction(id: number | string): Promise<BackendHealingAction> {
  return request<BackendHealingAction>(`/healing/${id}`);
}

export async function triggerAutonomousHeal(alarmId: number | string): Promise<BackendAutonomousWorkflowResponse> {
  return request<BackendAutonomousWorkflowResponse>(`/healing/auto/${alarmId}`, {
    method: 'POST',
  });
}

export async function executeHealingAction(payload: {
  deviceId: number | string;
  alarmId?: number | string;
  actionType: string;
  action?: string;
}): Promise<BackendHealingAction> {
  return request<BackendHealingAction>('/healing/execute', {
    method: 'POST',
    body: JSON.stringify({
      deviceId: Number(payload.deviceId),
      alarmId: payload.alarmId ? Number(payload.alarmId) : null,
      actionType: payload.actionType || payload.action,
      action: payload.action || payload.actionType,
    }),
  });
}

// ==========================================
// Recovery Engine
// ==========================================
export interface BackendRecoveryPlan {
  id: number;
  planCode: string;
  deviceId: number;
  deviceCode: string;
  deviceName: string;
  alarmId?: number;
  alarmCode?: string;
  action: string;
  description: string;
  status: string;
  logs?: string;
  createdAt: string;
  executedAt?: string;
  completedAt?: string;
}

export async function fetchRecoveryPlans(): Promise<BackendRecoveryPlan[]> {
  return request<BackendRecoveryPlan[]>('/recovery');
}

export async function executeRecoveryPlan(payload: {
  deviceId: number | string;
  alarmId?: number | string;
  action: string;
  description?: string;
}): Promise<BackendRecoveryPlan> {
  return request<BackendRecoveryPlan>('/recovery/execute', {
    method: 'POST',
    body: JSON.stringify({
      deviceId: Number(payload.deviceId),
      alarmId: payload.alarmId ? Number(payload.alarmId) : null,
      action: payload.action,
      description: payload.description,
    }),
  });
}

// ==========================================
// Fault Simulator
// ==========================================
export interface BackendSimulatorResponse {
  success: boolean;
  message: string;
  faultType?: string;
  deviceId?: number;
  deviceCode?: string;
  deviceName?: string;
  alarmId?: number;
  alarmCode?: string;
  newHealthScore?: number;
  newStatus?: string;
  generatedAlarm?: BackendAlarm;
}

export async function injectFault(payload: {
  deviceId: number | string;
  faultType: string;
  severity?: string;
  durationSeconds?: number;
}): Promise<BackendSimulatorResponse> {
  return request<BackendSimulatorResponse>('/simulator/fault', {
    method: 'POST',
    body: JSON.stringify({
      deviceId: Number(payload.deviceId),
      faultType: payload.faultType,
      severity: payload.severity || 'HIGH',
      durationSeconds: payload.durationSeconds || 60,
    }),
  });
}

export async function injectTraffic(payload: {
  deviceId: number | string;
  trafficIncreasePct?: number;
}): Promise<BackendSimulatorResponse> {
  return request<BackendSimulatorResponse>('/simulator/traffic', {
    method: 'POST',
    body: JSON.stringify({
      deviceId: Number(payload.deviceId),
      trafficIncreasePct: payload.trafficIncreasePct || 100,
    }),
  });
}

export async function resetSimulator(): Promise<BackendSimulatorResponse> {
  return request<BackendSimulatorResponse>('/simulator/reset', {
    method: 'POST',
  });
}
