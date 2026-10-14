'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import {
  NetworkDevice,
  Alarm,
  RCACase,
  HealingAction,
  RecoveryRecord,
  FaultType,
  HealingActionType,
  AppSettings,
  ToastNotification,
  SimulatorState,
} from '@/types';
import { INITIAL_DEVICES } from '@/data/devices';
import { INITIAL_ALARMS } from '@/data/alarms';
import { INITIAL_HEALING_ACTIONS, INITIAL_RCA_CASES } from '@/data/healing';
import { INITIAL_RECOVERY_HISTORY } from '@/data/recovery';
import * as api from '@/lib/api';
import {
  mapBackendDevice,
  mapBackendAlarm,
  mapBackendRca,
  mapBackendHealing,
  mapBackendRecovery,
} from '@/lib/adapters';

const DEFAULT_SETTINGS: AppSettings = {
  theme: 'dark',
  autoRefresh: true,
  refreshIntervalSeconds: 5,
  soundAlerts: true,
  autonomousAutoExecute: true,
};

interface NetworkContextType {
  devices: NetworkDevice[];
  alarms: Alarm[];
  rcaCases: RCACase[];
  healingActions: HealingAction[];
  recoveryHistory: RecoveryRecord[];
  settings: AppSettings;
  toasts: ToastNotification[];
  simulatorState: SimulatorState;
  backendConnected: boolean;
  backendLoading: boolean;

  // Actions
  syncFromBackend: () => Promise<void>;
  injectFault: (deviceId: string, service: string, faultType: FaultType) => string;
  triggerAutonomousHeal: (alarmId: string) => void;
  advanceSimulationStep: () => void;
  resetSimulation: () => void;
  resetAllToFactory: () => void;
  dismissAlarm: (alarmId: string) => void;
  updateDevice: (device: Partial<NetworkDevice> & { id: string }) => void;
  addToast: (toast: Omit<ToastNotification, 'id' | 'timestamp'>) => void;
  removeToast: (id: string) => void;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
}

const NetworkContext = createContext<NetworkContextType | undefined>(undefined);

export const NetworkProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [devices, setDevices] = useState<NetworkDevice[]>(INITIAL_DEVICES);
  const [alarms, setAlarms] = useState<Alarm[]>(INITIAL_ALARMS);
  const [rcaCases, setRcaCases] = useState<RCACase[]>(INITIAL_RCA_CASES);
  const [healingActions, setHealingActions] = useState<HealingAction[]>(INITIAL_HEALING_ACTIONS);
  const [recoveryHistory, setRecoveryHistory] = useState<RecoveryRecord[]>(INITIAL_RECOVERY_HISTORY);
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [toasts, setToasts] = useState<ToastNotification[]>([]);
  const [backendConnected, setBackendConnected] = useState<boolean>(false);
  const [backendLoading, setBackendLoading] = useState<boolean>(false);
  const [simulatorState, setSimulatorState] = useState<SimulatorState>({
    isSimulating: false,
    currentStepIndex: 0,
    stepLogs: [],
  });

  const addToast = useCallback((toast: Omit<ToastNotification, 'id' | 'timestamp'>) => {
    const newToast: ToastNotification = {
      ...toast,
      id: `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: new Date().toLocaleTimeString(),
    };
    setToasts((prev) => [newToast, ...prev].slice(0, 5));
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const updateSettings = useCallback((newSettings: Partial<AppSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  }, []);

  const updateDevice = useCallback((deviceUpdate: Partial<NetworkDevice> & { id: string }) => {
    setDevices((prev) =>
      prev.map((d) => (d.id === deviceUpdate.id ? { ...d, ...deviceUpdate } : d))
    );
  }, []);

  // Sync data from Spring Boot REST API
  const syncFromBackend = useCallback(async () => {
    setBackendLoading(true);
    try {
      const isHealthy = await api.checkBackendHealth();
      if (!isHealthy) {
        setBackendConnected(false);
        setBackendLoading(false);
        return;
      }

      setBackendConnected(true);

      const [backendDevs, backendAlms, backendRcas, backendHeals, backendRecovs] = await Promise.all([
        api.fetchDevices().catch(() => []),
        api.fetchAlarms().catch(() => []),
        api.fetchRcaCases().catch(() => []),
        api.fetchHealingActions().catch(() => []),
        api.fetchRecoveryPlans().catch(() => []),
      ]);

      if (backendDevs && backendDevs.length > 0) {
        const mappedDevices = backendDevs.map(mapBackendDevice);
        // compute active alarm count
        if (backendAlms && backendAlms.length > 0) {
          const alarmCounts: Record<string, number> = {};
          backendAlms.forEach((a) => {
            if (a.status !== 'RESOLVED') {
              const dId = String(a.deviceId);
              alarmCounts[dId] = (alarmCounts[dId] || 0) + 1;
            }
          });
          mappedDevices.forEach((d) => {
            d.activeAlarmsCount = alarmCounts[d.id] || 0;
          });
        }
        setDevices(mappedDevices);
      }

      if (backendAlms && backendAlms.length > 0) {
        setAlarms(backendAlms.map(mapBackendAlarm));
      }

      if (backendRcas && backendRcas.length > 0) {
        setRcaCases(backendRcas.map(mapBackendRca));
      }

      if (backendHeals && backendHeals.length > 0) {
        setHealingActions(backendHeals.map(mapBackendHealing));
      }

      if (backendRecovs && backendRecovs.length > 0) {
        setRecoveryHistory(backendRecovs.map(mapBackendRecovery));
      }
    } catch (err) {
      console.warn('Backend sync failed, maintaining current state', err);
      setBackendConnected(false);
    } finally {
      setBackendLoading(false);
    }
  }, []);

  // Initial sync & periodic polling
  useEffect(() => {
    syncFromBackend();

    if (!settings.autoRefresh) return;
    const intervalSec = Math.max(2, settings.refreshIntervalSeconds || 5);
    const timer = setInterval(() => {
      syncFromBackend();
    }, intervalSec * 1000);

    return () => clearInterval(timer);
  }, [syncFromBackend, settings.autoRefresh, settings.refreshIntervalSeconds]);

  const getHealingActionForFault = (faultType: FaultType): HealingActionType => {
    switch (faultType) {
      case 'SERVICE_DOWN':
        return 'RESTART_SERVICE';
      case 'CONFIG_ERROR':
        return 'RESTORE_CONFIGURATION';
      case 'HIGH_LATENCY':
        return 'REROUTE_TRAFFIC';
      case 'DEVICE_UNREACHABLE':
        return 'DEVICE_RECOVERY';
      default:
        return 'RESTART_SERVICE';
    }
  };

  const getFaultDetails = (faultType: FaultType, service: string) => {
    switch (faultType) {
      case 'SERVICE_DOWN':
        return {
          severity: 'CRITICAL' as const,
          message: `Service process [${service}] exited unexpectedly with SIGSEGV (0x0B)`,
          rootCause: `Memory corruption exception in ${service} worker pool thread`,
          metricDrift: 'Process PID terminated, health heartbeat 0 req/sec',
        };
      case 'CONFIG_ERROR':
        return {
          severity: 'HIGH' as const,
          message: `Configuration syntax validation error & policy mismatch on ${service}`,
          rootCause: `Commit #8911 contained invalid route policy prefix-list filter`,
          metricDrift: 'BGP peering down, 4200 routes withdrawn',
        };
      case 'HIGH_LATENCY':
        return {
          severity: 'HIGH' as const,
          message: `Interface packet buffer overflow & latency spike (148ms) on ${service}`,
          rootCause: `Microburst ingress congestion exceeding queue profile threshold`,
          metricDrift: 'Queue depth 99.2%, packet loss 8.4%',
        };
      case 'DEVICE_UNREACHABLE':
        return {
          severity: 'CRITICAL' as const,
          message: `SNMP/Telemetry keepalive timeout: Device unreachable on primary loopback`,
          rootCause: `Kernel deadlock in management control plane processor`,
          metricDrift: 'ICMP echo 100% loss, telemetry stream disconnected',
        };
    }
  };

  // Inject a live fault (syncs to Spring Boot backend if connected)
  const injectFault = (deviceId: string, service: string, faultType: FaultType): string => {
    const targetDevice = devices.find((d) => d.id === deviceId) || devices[0];
    const faultInfo = getFaultDetails(faultType, service);
    const localAlarmId = `ALM-${Math.floor(1000 + Math.random() * 9000)}`;

    // Try backend fault injection if connected
    if (backendConnected) {
      let backendFaultType = 'CPU_OVERLOAD';
      if (faultType === 'HIGH_LATENCY') backendFaultType = 'HIGH_LATENCY';
      else if (faultType === 'CONFIG_ERROR') backendFaultType = 'INTERFACE_FAILURE';
      else if (faultType === 'DEVICE_UNREACHABLE') backendFaultType = 'DEVICE_DOWN';

      api
        .injectFault({
          deviceId: targetDevice.id,
          faultType: backendFaultType,
          severity: faultInfo.severity,
          durationSeconds: 60,
        })
        .then((res) => {
          addToast({
            type: 'error',
            title: `Backend Fault Injected: ${res.faultType}`,
            message: `${res.message}`,
            actionUrl: '/alarms',
          });
          syncFromBackend();
        })
        .catch((err) => {
          console.warn('Backend fault injection failed, fell back to local simulator', err);
        });
    }

    // Local state immediate update for instantaneous responsiveness
    const newAlarm: Alarm = {
      id: localAlarmId,
      deviceId: targetDevice.id,
      deviceName: targetDevice.name,
      service: service,
      severity: faultInfo.severity,
      status: 'OPEN',
      message: faultInfo.message,
      faultType: faultType,
      rootCause: faultInfo.rootCause,
      recommendedAction: getHealingActionForFault(faultType),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      metricsSnapshot: {
        latencyMs: faultType === 'HIGH_LATENCY' ? 148.2 : 45.0,
        packetLossPct: faultType === 'DEVICE_UNREACHABLE' ? 100 : faultType === 'HIGH_LATENCY' ? 8.4 : 0.0,
        cpuPct: 92,
        memoryPct: 88,
      },
    };

    setDevices((prev) =>
      prev.map((d) =>
        d.id === targetDevice.id
          ? {
              ...d,
              status: faultType === 'DEVICE_UNREACHABLE' ? 'OFFLINE' : 'DEGRADED',
              activeAlarmsCount: d.activeAlarmsCount + 1,
              latencyMs: faultType === 'HIGH_LATENCY' ? 148.2 : d.latencyMs,
              packetLossPct: faultType === 'DEVICE_UNREACHABLE' ? 100 : faultType === 'HIGH_LATENCY' ? 8.4 : d.packetLossPct,
              cpuUsage: 94,
            }
          : d
      )
    );

    setAlarms((prev) => [newAlarm, ...prev]);

    setSimulatorState({
      isSimulating: true,
      activeFaultId: localAlarmId,
      currentStepIndex: 1,
      stepLogs: [
        `[${new Date().toLocaleTimeString()}] Fault injected: ${faultType} on ${targetDevice.name} (${service})`,
        `[${new Date().toLocaleTimeString()}] Alarm ${localAlarmId} OPEN with severity ${faultInfo.severity}`,
      ],
    });

    addToast({
      type: 'error',
      title: `Fault Injected: ${faultType}`,
      message: `${targetDevice.name} (${service}) generated alarm ${localAlarmId}`,
      actionUrl: '/alarms',
    });

    return localAlarmId;
  };

  // Trigger Autonomous Healing Workflow (connects directly to Spring Boot POST /api/healing/auto/{alarmId})
  const triggerAutonomousHeal = (alarmId: string) => {
    const targetAlarm = alarms.find((a) => a.id === alarmId);
    if (!targetAlarm) return;

    const actionType = targetAlarm.recommendedAction || getHealingActionForFault(targetAlarm.faultType || 'SERVICE_DOWN');
    const actionId = `ACT-${Math.floor(1000 + Math.random() * 9000)}`;

    // Set UI to healing state immediately
    setAlarms((prev) =>
      prev.map((a) => (a.id === alarmId ? { ...a, status: 'HEALING', updatedAt: new Date().toISOString() } : a))
    );
    setDevices((prev) =>
      prev.map((d) => (d.id === targetAlarm.deviceId ? { ...d, status: 'RECOVERING' } : d))
    );

    addToast({
      type: 'info',
      title: 'Autonomous Healing Triggered',
      message: `Executing ${actionType} on ${targetAlarm.deviceName}`,
      actionUrl: '/healing',
    });

    // If backend connected, call Spring Boot's autonomous healing loop directly!
    if (backendConnected) {
      api
        .triggerAutonomousHeal(alarmId)
        .then((res) => {
          addToast({
            type: 'success',
            title: 'Backend Auto-Healing Complete!',
            message: res.workflowSummary || `Healed alarm ${res.alarmCode}`,
            actionUrl: '/recovery',
          });
          syncFromBackend();
        })
        .catch((err) => {
          console.warn('Backend auto-heal call failed, falling back to local simulation', err);
          simulateLocalHealing(actionId, alarmId, targetAlarm.deviceId, actionType, targetAlarm.faultType || 'SERVICE_DOWN');
        });
    } else {
      simulateLocalHealing(actionId, alarmId, targetAlarm.deviceId, actionType, targetAlarm.faultType || 'SERVICE_DOWN');
    }
  };

  const simulateLocalHealing = (
    actionId: string,
    alarmId: string,
    deviceId: string,
    actionType: HealingActionType,
    faultType: FaultType
  ) => {
    let currentPct = 15;
    const interval = setInterval(() => {
      currentPct += 25;
      if (currentPct >= 100) {
        clearInterval(interval);
        completeHealing(actionId, alarmId, deviceId, actionType, faultType);
      } else {
        setHealingActions((prev) =>
          prev.map((act) =>
            act.id === actionId
              ? {
                  ...act,
                  progressPct: currentPct,
                  logs: [
                    ...act.logs,
                    {
                      timestamp: new Date().toLocaleTimeString(),
                      level: 'INFO',
                      text: `Remediation execution step ${currentPct}%: verifying state transitions...`,
                    },
                  ],
                }
              : act
          )
        );
      }
    }, 1000);
  };

  const completeHealing = (
    actionId: string,
    alarmId: string,
    deviceId: string,
    actionType: HealingActionType,
    faultType: FaultType
  ) => {
    const completedAt = new Date().toISOString();
    const incidentId = `INC-${Math.floor(1000 + Math.random() * 9000)}`;
    const recId = `REC-${Math.floor(1000 + Math.random() * 9000)}`;
    const targetDevice = devices.find((d) => d.id === deviceId);
    const deviceName = targetDevice ? targetDevice.name : 'Network-Node';

    setHealingActions((prev) =>
      prev.map((act) =>
        act.id === actionId
          ? {
              ...act,
              status: 'SUCCESS',
              progressPct: 100,
              completedAt: completedAt,
              logs: [
                ...act.logs,
                {
                  timestamp: new Date().toLocaleTimeString(),
                  level: 'SUCCESS',
                  text: `Action ${actionType} completed. Synthetic health probe returned 200 OK.`,
                },
              ],
            }
          : act
      )
    );

    setAlarms((prev) =>
      prev.map((a) =>
        a.id === alarmId
          ? {
              ...a,
              status: 'RECOVERED',
              updatedAt: completedAt,
              metricsSnapshot: {
                latencyMs: 4.5,
                packetLossPct: 0.0,
                cpuPct: 32,
                memoryPct: 44,
              },
            }
          : a
      )
    );

    setRcaCases((prev) =>
      prev.map((r) => (r.alarmId === alarmId ? { ...r, status: 'RESOLVED' } : r))
    );

    setDevices((prev) =>
      prev.map((d) =>
        d.id === deviceId
          ? {
              ...d,
              status: 'ONLINE',
              activeAlarmsCount: Math.max(0, d.activeAlarmsCount - 1),
              cpuUsage: 32,
              latencyMs: 4.8,
              packetLossPct: 0.0,
            }
          : d
      )
    );

    const newRecoveryRecord: RecoveryRecord = {
      id: recId,
      incidentId: incidentId,
      deviceId: deviceId,
      deviceName: deviceName,
      service: 'Autonomous-Engine',
      faultType: faultType,
      rootCause: `Autonomous mitigation of ${faultType} fault`,
      healingAction: actionType,
      result: 'SUCCESS',
      verificationMessage: `Telemetry normalized: 0% packet loss, latency 4.8ms, all synthetic probes passing.`,
      mttrSeconds: 38,
      date: new Date().toISOString().replace('T', ' ').substring(0, 19),
      technicianMode: 'FULLY_AUTONOMOUS',
    };

    setRecoveryHistory((prev) => [newRecoveryRecord, ...prev]);

    setSimulatorState((prev) => ({
      ...prev,
      currentStepIndex: 5,
      stepLogs: [
        ...prev.stepLogs,
        `[${new Date().toLocaleTimeString()}] Verification successful: Telemetry normalized`,
        `[${new Date().toLocaleTimeString()}] System RECOVERED. Incident recorded as ${incidentId}`,
      ],
    }));

    addToast({
      type: 'success',
      title: 'Autonomous Recovery Complete!',
      message: `${deviceName} recovered successfully via ${actionType}`,
      actionUrl: '/recovery',
    });
  };

  const advanceSimulationStep = () => {
    setSimulatorState((prev) => {
      const nextIndex = Math.min(prev.currentStepIndex + 1, 5);
      const stepNames = [
        'FAULT_INJECTED',
        'ALARM_OPEN',
        'ANALYZING_RCA',
        'HEALING_EXECUTION',
        'VERIFYING_METRICS',
        'RECOVERED',
      ];

      const newLogs = [
        ...prev.stepLogs,
        `[${new Date().toLocaleTimeString()}] Advanced to phase: ${stepNames[nextIndex]}`,
      ];

      if (nextIndex === 3 && prev.activeFaultId) {
        triggerAutonomousHeal(prev.activeFaultId);
      }

      return {
        ...prev,
        currentStepIndex: nextIndex,
        stepLogs: newLogs,
      };
    });
  };

  const resetSimulation = () => {
    if (backendConnected) {
      api.resetSimulator().then(() => syncFromBackend()).catch(() => {});
    }
    setSimulatorState({
      isSimulating: false,
      activeFaultId: undefined,
      currentStepIndex: 0,
      stepLogs: [],
    });
  };

  const resetAllToFactory = () => {
    if (backendConnected) {
      api.resetSimulator().then(() => syncFromBackend()).catch(() => {});
    }
    setDevices(INITIAL_DEVICES);
    setAlarms(INITIAL_ALARMS);
    setRcaCases(INITIAL_RCA_CASES);
    setHealingActions(INITIAL_HEALING_ACTIONS);
    setRecoveryHistory(INITIAL_RECOVERY_HISTORY);
    setSettings(DEFAULT_SETTINGS);
    setSimulatorState({
      isSimulating: false,
      currentStepIndex: 0,
      stepLogs: [],
    });
    localStorage.clear();
    addToast({
      type: 'info',
      title: 'Platform Baseline Restored',
      message: 'All devices, alarms, and simulated telemetry reset to baseline.',
    });
  };

  const dismissAlarm = (alarmId: string) => {
    if (backendConnected) {
      api.resolveAlarm(alarmId).then(() => syncFromBackend()).catch(() => {});
    }
    setAlarms((prev) => prev.filter((a) => a.id !== alarmId));
    addToast({
      type: 'info',
      title: 'Alarm Dismissed',
      message: `Alarm ${alarmId} resolved/dismissed.`,
    });
  };

  return (
    <NetworkContext.Provider
      value={{
        devices,
        alarms,
        rcaCases,
        healingActions,
        recoveryHistory,
        settings,
        toasts,
        simulatorState,
        backendConnected,
        backendLoading,
        syncFromBackend,
        injectFault,
        triggerAutonomousHeal,
        advanceSimulationStep,
        resetSimulation,
        resetAllToFactory,
        dismissAlarm,
        updateDevice,
        addToast,
        removeToast,
        updateSettings,
      }}
    >
      {children}
    </NetworkContext.Provider>
  );
};

export const useNetwork = () => {
  const context = useContext(NetworkContext);
  if (!context) {
    throw new Error('useNetwork must be used within a NetworkProvider');
  }
  return context;
};
