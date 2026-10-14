package com.example.network_healing_backend.init;

import com.example.network_healing_backend.entity.*;
import com.example.network_healing_backend.repository.*;
import com.example.network_healing_backend.service.DeviceService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private final DeviceRepository deviceRepository;
    private final AlarmRepository alarmRepository;
    private final NetworkEventRepository networkEventRepository;
    private final RcaResultRepository rcaResultRepository;
    private final HealingActionRepository healingActionRepository;
    private final RecoveryPlanRepository recoveryPlanRepository;
    private final DeviceService deviceService;

    public DataInitializer(DeviceRepository deviceRepository,
                           AlarmRepository alarmRepository,
                           NetworkEventRepository networkEventRepository,
                           RcaResultRepository rcaResultRepository,
                           HealingActionRepository healingActionRepository,
                           RecoveryPlanRepository recoveryPlanRepository,
                           DeviceService deviceService) {
        this.deviceRepository = deviceRepository;
        this.alarmRepository = alarmRepository;
        this.networkEventRepository = networkEventRepository;
        this.rcaResultRepository = rcaResultRepository;
        this.healingActionRepository = healingActionRepository;
        this.recoveryPlanRepository = recoveryPlanRepository;
        this.deviceService = deviceService;
    }

    @Override
    public void run(String... args) {
        if (deviceRepository.count() > 0) {
            log.info("Database already initialized with {} devices. Skipping seed data generation.", deviceRepository.count());
            return;
        }

        log.info("Bootstrapping realistic production seed data for Autonomous Network Healing Platform...");

        // 1. Seed 12 Realistic Devices
        Device dev1 = createDevice("RTR-BLR-001", "Core-Router-Alpha-US-East", "rtr-cr-01.us-east.corp", "10.100.1.1", "CORE_ROUTER", "Cisco", "ASR-9000", "Virginia Data Center DC-01, Rack A4", "IOS-XR-v7.9.2", "ONLINE", 28.0, 45.0, 41.0, 4.2, 0.0, "142d 18h 22m", "BGP-Routing,MPLS-Core,OSPF-Area0,Segment-Routing");
        Device dev2 = createDevice("RTR-BLR-002", "Core-Router-Beta-EU-Central", "rtr-cr-02.eu-west.corp", "10.100.2.1", "CORE_ROUTER", "Juniper", "MX960", "Frankfurt DC-02, Rack B2", "Junos-21.4R3", "ONLINE", 32.0, 48.0, 43.0, 6.5, 0.0, "98d 14h 10m", "BGP-Routing,IS-IS,MPLS-Core,RSVP-TE");
        Device dev3 = createDevice("SW-BLR-001", "Edge-Leaf-Switch-04", "sw-leaf-04.fra.corp", "10.100.4.12", "EDGE_SWITCH", "Cisco", "Nexus-9300", "Frankfurt Pop-03, Row 12", "NX-OS-9.3(8)", "DEGRADED", 89.0, 82.0, 58.0, 78.5, 4.8, "48d 04h 11m", "VXLAN-EVPN,VLAN-Trunking,LACP-PortChannel,QoS-Policing");
        Device dev4 = createDevice("SW-BLR-002", "Distribution-Switch-Alpha", "sw-dist-01.sin.corp", "10.100.5.1", "SWITCH", "Arista", "7050X", "Singapore Pop-01, Rack C1", "EOS-4.27.1F", "ONLINE", 22.0, 36.0, 39.0, 5.1, 0.0, "115d 08h 15m", "VLAN-Trunking,MSTP,LACP-PortChannel");
        Device dev5 = createDevice("FW-BLR-001", "NextGen-Edge-Firewall-Primary", "fw-edge-01.sin.corp", "192.168.1.1", "FIREWALL", "Palo Alto", "PA-5250", "Singapore Central DC, Cage B", "PAN-OS-11.0.1", "ONLINE", 35.0, 48.0, 42.0, 2.8, 0.0, "210d 09h 40m", "BGP-Peering,IPSec-VPN-Mesh,DeepPacketInspection,Anti-DDoS-Filter");
        Device dev6 = createDevice("FW-BLR-002", "Perimeter-Firewall-Backup", "fw-edge-02.iad.corp", "192.168.2.1", "FIREWALL", "Fortinet", "FortiGate 1800F", "Virginia Data Center DC-01, Rack A6", "FortiOS-7.2.4", "ONLINE", 19.0, 33.0, 37.0, 3.4, 0.0, "65d 20h 05m", "IPSec-VPN,Threat-Prevention,NAT-Gateway");
        Device dev7 = createDevice("SRV-BLR-001", "DC-Spine-Gateway-Tokyo", "gw-spine-01.hnd.corp", "10.240.0.1", "DATA_CENTER_GATEWAY", "Arista", "7280R3", "Tokyo Cloud Region TK-2", "EOS-4.28.3F", "ONLINE", 31.0, 42.0, 39.0, 5.6, 0.0, "92d 14h 50m", "BGP-EVPN,SRv6-Tunneling,Telemetry-Streaming,Flow-Mirroring");
        Device dev8 = createDevice("SRV-BLR-002", "Edge-Compute-Node-Alpha", "srv-compute-01.lhr.corp", "10.200.40.10", "SERVER", "Dell", "PowerEdge R750", "London Pop-02, Rack F8", "Ubuntu-22.04-LTS", "ONLINE", 45.0, 62.0, 44.0, 8.2, 0.0, "75d 11h 20m", "K8s-Worker,Telemetry-Agent,Prometheus-Node");
        Device dev9 = createDevice("GW-BLR-001", "Global-Traffic-LoadBalancer-EU", "lb-global-01.lhr.corp", "10.180.20.5", "LOAD_BALANCER", "F5 Networks", "BIG-IP i10800", "London Colocation Metro-1", "BIG-IP-17.1.0", "ONLINE", 52.0, 61.0, 46.0, 6.1, 0.0, "65d 02h 30m", "HTTP3-Proxy,SSL-Offloading,Anycast-DNS,HealthCheck-Prober");
        Device dev10 = createDevice("AP-BLR-001", "5G-Cellular-gNodeB-Sector9", "gnb-cell-09.muc.corp", "172.16.89.201", "CELLULAR_GNODEB", "Ericsson", "vRAN-NR-24.1", "Munich North Tower-88", "vRAN-NR-24.1", "ONLINE", 44.0, 51.0, 36.0, 11.2, 0.0, "19d 11h 05m", "5G-NR-MIMO,O-RAN-Fronthaul,eCPRI-Transport,URLLC-Slice");
        Device dev11 = createDevice("AP-BLR-002", "Enterprise-Wi-Fi6-Gateway", "ap-gw-blr-01.corp", "172.20.10.1", "ACCESS_POINT", "Cisco", "Catalyst 9130", "Bangalore Tech Park Campus-4", "IOS-XE-17.6", "ONLINE", 25.0, 38.0, 35.0, 7.8, 0.0, "40d 05h 10m", "Wi-Fi6-OFDMA,WPA3-Enterprise,mDNS-Gateway");
        Device dev12 = createDevice("RTR-BLR-003", "Metro-Aggregation-Router", "rtr-metro-01.bom.corp", "10.150.1.1", "ROUTER", "Nokia", "7750 SR-1s", "Mumbai Metro POP-01", "TiMOS-22.10", "ONLINE", 38.0, 49.0, 40.0, 9.4, 0.0, "88d 19h 45m", "Segment-Routing,MPLS-L3VPN,SyncE");

        // 2. Seed 11 Realistic Alarms
        createAlarm("ALM-8891", dev3, "QoS-Policing", "HIGH_LATENCY", "HIGH", "High buffer occupancy & packet drop threshold breached on Eth1/1 interface (4.8% loss)", "ACTIVE", "HIGH_LATENCY", "Egress buffer microburst causing TCP window shrink and latency escalation (78.5ms)", "REROUTE_TRAFFIC");
        createAlarm("ALM-8884", dev1, "BGP-Routing", "CONFIG_ERROR", "MEDIUM", "BGP Prefix flap detected on AS64512 peer link", "RESOLVED", "CONFIG_ERROR", "Mismatched route-map community filter committed during automated push", "RESTORE_CONFIGURATION");
        createAlarm("ALM-8879", dev10, "O-RAN-Fronthaul", "SERVICE_DOWN", "CRITICAL", "eCPRI transport sync synchronization loss (PTP Grandmaster drift)", "RESOLVED", "SERVICE_DOWN", "PTP daemon memory segmentation fault during high throughput period", "RESTART_SERVICE");
        createAlarm("ALM-8875", dev5, "IPSec-VPN-Mesh", "SERVICE_DOWN", "HIGH", "IKE Phase 2 SA re-key timeout on primary tunnel group", "RESOLVED", "SERVICE_DOWN", "Crypto-engine key renegotiation race condition", "RESTART_SERVICE");
        createAlarm("ALM-8870", dev7, "SRv6-Tunneling", "HIGH_LATENCY", "MEDIUM", "Ingress policer token bucket overrun on Spine Port 4", "RESOLVED", "HIGH_LATENCY", "Hardware policing rate limit misconfiguration on Spine port 4", "REROUTE_TRAFFIC");
        createAlarm("ALM-8865", dev8, "K8s-Worker", "CPU_OVERLOAD", "HIGH", "Control plane CPU utilization spiked to 92.4% on worker pool", "RESOLVED", "CPU_OVERLOAD", "Runaway analytics query worker thread pool", "RESTART_SERVICE");
        createAlarm("ALM-8860", dev9, "HTTP3-Proxy", "MEMORY_OVERLOAD", "MEDIUM", "SSL offloader memory threshold breached (> 88%)", "RESOLVED", "MEMORY_OVERLOAD", "SSL session table cache compaction delayed", "CLEAR_CACHE");
        createAlarm("ALM-8855", dev2, "IS-IS", "PACKET_LOSS", "LOW", "Sub-optimal LSP path recalculation cycle took 1.2s", "RESOLVED", "PACKET_LOSS", "Transient link flap on redundant interface", "NO_ACTION");
        createAlarm("ALM-8850", dev11, "Wi-Fi6-OFDMA", "LATENCY_HIGH", "LOW", "BSS coloring collision detected on channel 48", "RESOLVED", "HIGH_LATENCY", "Adjacent AP frequency overlap", "RESTORE_CONFIGURATION");
        createAlarm("ALM-8845", dev12, "SyncE", "SERVICE_DOWN", "MEDIUM", "SyncE stratum reference clock switched to secondary", "RESOLVED", "SERVICE_DOWN", "Primary optical transceiver thermal recalibration", "RESTART_INTERFACE");
        createAlarm("ALM-8840", dev4, "MSTP", "CONFIG_ERROR", "LOW", "BPDU guard trigger on edge port Eth1/8", "RESOLVED", "CONFIG_ERROR", "End-user hub attached to designated port", "RESTORE_CONFIGURATION");

        // 3. Seed Realistic Network Events
        createEvent(dev3, "PACKET_LOSS", "Egress queue drop rate exceeded 4.0% threshold on Eth1/1", "packetLoss", 4.8, 2.0, "HIGH");
        createEvent(dev3, "LATENCY_HIGH", "Latency rose from 5.2ms to 78.5ms over 30-second window", "latency", 78.5, 50.0, "HIGH");
        createEvent(dev1, "CONFIG_CHANGE", "Automated policy push applied route-map filter #8911", "config", 1.0, 0.0, "MEDIUM");
        createEvent(dev10, "SERVICE_DOWN", "Process ptp4l heartbeat signal missing on core 3", "heartbeat", 0.0, 1.0, "CRITICAL");
        createEvent(dev5, "TRAFFIC_SPIKE", "Ingress traffic reached 38 Gbps on WAN interface ae1", "traffic", 38000.0, 30000.0, "MEDIUM");
        createEvent(dev8, "CPU_HIGH", "Analytics thread utilization reached 92.4%", "cpuUsage", 92.4, 80.0, "HIGH");
        createEvent(dev9, "MEMORY_HIGH", "Memory utilization crossed 88% watermark", "memoryUsage", 88.0, 80.0, "MEDIUM");

        // 4. Seed Realistic RCA Cases
        createRca(dev3, "ALM-8891", "QoS-Policing", "HIGH_LATENCY", "Egress buffer microburst causing TCP window shrink and latency escalation", "Data Plane Congestion", 98.0, "Queue depth 99.2%, packet loss 4.8%, latency spiked to 78.5ms", "Reroute transit traffic via secondary spine fabric", "REROUTE_TRAFFIC");
        createRca(dev1, "ALM-8884", "BGP-Routing", "CONFIG_ERROR", "Mismatched route-map community filter committed during automated push", "Configuration Policy Drift", 99.0, "BGP peering down, 4200 routes withdrawn. Checkpoint #492 diff match.", "Rollback to golden configuration checkpoint #492", "RESTORE_CONFIGURATION");
        createRca(dev10, "ALM-8879", "O-RAN-Fronthaul", "SERVICE_DOWN", "PTP daemon memory segmentation fault during high throughput period", "System Fault: SERVICE_DOWN", 98.5, "Process PID terminated unexpectedly with SIGSEGV (0x0B)", "Restart ptp4l service and verify grandmaster lock", "RESTART_SERVICE");
        createRca(dev5, "ALM-8875", "IPSec-VPN-Mesh", "SERVICE_DOWN", "Crypto-engine key renegotiation race condition", "Service Degradation", 96.0, "IKE Phase 2 SA renegotiation failed after 3 retries", "Restart crypto daemon and force immediate key renewal", "RESTART_SERVICE");
        createRca(dev7, "ALM-8870", "SRv6-Tunneling", "HIGH_LATENCY", "Hardware policing rate limit misconfiguration on Spine port 4", "Network Path Degraded", 95.0, "Round-trip latency elevated to 65ms on Spine Port 4", "Reroute transit SRv6 policy to Spine Port 2", "REROUTE_TRAFFIC");
        createRca(dev8, "ALM-8865", "K8s-Worker", "CPU_OVERLOAD", "Runaway analytics query worker thread pool", "Compute Exhaustion", 97.0, "Control plane CPU 92.4% (> 90.0% threshold)", "Restart worker service and clear task queues", "RESTART_SERVICE");

        // 5. Seed Realistic Healing Actions
        createHealingAction("ACT-6401", dev3, "ALM-8891", "REROUTE_TRAFFIC", "Dynamic path diversion over alternate spine fabric link", "IN_PROGRESS", 65, "Traffic diversion initiated (58% shifted to Eth1/2 alternate spine)");
        createHealingAction("ACT-6398", dev1, "ALM-8884", "RESTORE_CONFIGURATION", "Rollback to Golden Configuration Checkpoint 492", "SUCCESS", 100, "Configuration restored successfully. BGP neighbor session re-established.");
        createHealingAction("ACT-6391", dev10, "ALM-8879", "RESTART_SERVICE", "Isolating process PID 19844 and issuing systemctl restart ptp4l", "SUCCESS", 100, "PTP lock re-acquired with grandmaster clock at <5ns jitter. Carrier sync stable.");
        createHealingAction("ACT-6385", dev5, "ALM-8875", "RESTART_SERVICE", "Restarting IPSec daemon with fresh SA negotiation", "SUCCESS", 100, "120 IPSec tunnels re-established with zero packet drop.");
        createHealingAction("ACT-6379", dev7, "ALM-8870", "REROUTE_TRAFFIC", "Reprogramming SRv6 routing policy over alternate redundant spine", "SUCCESS", 100, "SRv6 path reprogrammed; latency normalized to 5.6ms.");
        createHealingAction("ACT-6372", dev8, "ALM-8865", "RESTART_SERVICE", "Graceful worker pool restart and process queue flush", "SUCCESS", 100, "Worker pool restored; CPU normalized to 24%.");

        // 6. Seed Realistic Recovery Plans
        createRecoveryPlan("REC-9042", "INC-8884", dev1, "BGP Configuration Convergence Recovery", "BGP-Routing", "CONFIG_ERROR", "Mismatched route-map filter", "RESTORE_CONFIGURATION", 85, "Synthetic BGP echo probe verified 100% convergence across all 14 peers. Zero route drops.");
        createRecoveryPlan("REC-9039", "INC-8879", dev10, "O-RAN Fronthaul Synchronization Recovery", "O-RAN-Fronthaul", "SERVICE_DOWN", "PTP daemon crash", "RESTART_SERVICE", 55, "PTP grandmaster locked, carrier jitter measured at 3.2ns (target < 10ns). Cell live.");
        createRecoveryPlan("REC-9021", "INC-8830", dev5, "IPSec Tunnel Mesh Reconvergence", "IPSec-VPN-Mesh", "SERVICE_DOWN", "Crypto key renegotiation timeout", "RESTART_SERVICE", 42, "IKE Phase 2 SAs re-established. 120 tunnels active with 0% packet loss.");
        createRecoveryPlan("REC-9015", "INC-8811", dev7, "SRv6 Path Reprogramming Recovery", "SRv6-Tunneling", "HIGH_LATENCY", "Policing rate limit misconfiguration", "REROUTE_TRAFFIC", 94, "Segment Routing path reprogrammed over alternate redundant link. Latency dropped to 5.6ms.");
        createRecoveryPlan("REC-9008", "INC-8802", dev8, "Worker Container Failover Procedure", "K8s-Worker", "CPU_OVERLOAD", "Runaway query thread pool", "RESTART_SERVICE", 62, "Container worker evacuated and rescheduled on node pool with nominal load.");
        createRecoveryPlan("REC-8995", "INC-8780", dev9, "SSL Offloader Cache Compaction", "HTTP3-Proxy", "MEMORY_OVERLOAD", "Stale session leak", "CLEAR_CACHE", 38, "SSL session cache pruned and memory pressure normalized to 38%.");

        log.info("Production seed data successfully initialized: 12 devices, 11 alarms, 7 events, 6 RCAs, 6 healing actions, 6 recovery records.");
    }

    private Device createDevice(String code, String name, String host, String ip, String type, String vendor, String model, String loc, String fw, String status, double cpu, double mem, double temp, double lat, double loss, String uptime, String services) {
        Device d = new Device();
        d.setDeviceCode(code);
        d.setDeviceName(name);
        d.setHostname(host);
        d.setIpAddress(ip);
        d.setDeviceType(type);
        d.setVendor(vendor);
        d.setModel(model);
        d.setLocation(loc);
        d.setFirmware(fw);
        d.setStatus(status);
        d.setCpuUsage(cpu);
        d.setMemoryUsage(mem);
        d.setTemperature(temp);
        d.setLatency(lat);
        d.setPacketLoss(loss);
        d.setUptime(uptime);
        d.setServices(services);
        d.setActiveAlarmsCount("DEGRADED".equalsIgnoreCase(status) ? 1 : 0);
        d.setLastSeen(LocalDateTime.now().minusMinutes(2));
        deviceService.evaluateHealth(d);
        return deviceRepository.save(d);
    }

    private Alarm createAlarm(String code, Device dev, String service, String type, String sev, String msg, String status, String faultType, String rootCause, String recAction) {
        Alarm a = new Alarm();
        a.setAlarmCode(code);
        if (dev != null) {
            a.setDeviceId(dev.getId());
            a.setDeviceCode(dev.getDeviceCode());
            a.setDeviceName(dev.getDeviceName());
        }
        a.setService(service);
        a.setAlarmType(type);
        a.setSeverity(sev);
        a.setMessage(msg);
        a.setStatus(status);
        a.setSource("TELEMETRY");
        a.setFaultType(faultType);
        a.setRootCause(rootCause);
        a.setRecommendedAction(recAction);
        a.setDetectedAt(LocalDateTime.now().minusHours(2));
        if ("RESOLVED".equalsIgnoreCase(status)) {
            a.setResolvedAt(LocalDateTime.now().minusHours(1));
        }
        return alarmRepository.save(a);
    }

    private void createEvent(Device dev, String type, String desc, String metric, double val, double thresh, String sev) {
        NetworkEvent e = new NetworkEvent();
        if (dev != null) {
            e.setDeviceId(dev.getId());
            e.setDeviceCode(dev.getDeviceCode());
            e.setDeviceName(dev.getDeviceName());
        }
        e.setEventType(type);
        e.setDescription(desc);
        e.setMetric(metric);
        e.setValue(val);
        e.setThreshold(thresh);
        e.setSeverity(sev);
        e.setTimestamp(LocalDateTime.now().minusMinutes(15));
        networkEventRepository.save(e);
    }

    private void createRca(Device dev, String alarmCode, String service, String faultType, String rootCause, String cat, double conf, String evid, String rec, String recAction) {
        RcaResult r = new RcaResult();
        r.setRcaCode("RCA-" + (1000 + (System.currentTimeMillis() % 9000)));
        if (dev != null) {
            r.setDeviceId(dev.getId());
            r.setDeviceCode(dev.getDeviceCode());
            r.setDeviceName(dev.getDeviceName());
        }
        r.setAlarmCode(alarmCode);
        r.setService(service);
        r.setFaultType(faultType);
        r.setRootCause(rootCause);
        r.setCategory(cat);
        r.setConfidence(conf);
        r.setEvidence(evid);
        r.setRecommendation(rec);
        r.setRecommendedAction(recAction);
        r.setRiskScore("LOW");
        r.setBlastRadius("Local Fabric Zone");
        r.setCreatedAt(LocalDateTime.now().minusHours(2));
        rcaResultRepository.save(r);
    }

    private void createHealingAction(String code, Device dev, String alarmCode, String actionType, String desc, String status, int progress, String logMsg) {
        HealingAction h = new HealingAction();
        h.setActionCode(code);
        if (dev != null) {
            h.setDeviceId(dev.getId());
            h.setDeviceCode(dev.getDeviceCode());
            h.setDeviceName(dev.getDeviceName());
        }
        h.setAlarmCode(alarmCode);
        h.setActionType(actionType);
        h.setDescription(desc);
        h.setStatus(status);
        h.setProgressPct(progress);
        h.setExecutedAt(LocalDateTime.now().minusHours(2));
        if ("SUCCESS".equalsIgnoreCase(status)) {
            h.setCompletedAt(LocalDateTime.now().minusHours(2).plusMinutes(2));
        }
        h.setResult(logMsg);
        h.setLogs(logMsg);
        healingActionRepository.save(h);
    }

    private void createRecoveryPlan(String code, String incId, Device dev, String planName, String service, String faultType, String rootCause, String actionType, int mttr, String verMsg) {
        RecoveryPlan p = new RecoveryPlan();
        p.setPlanCode(code);
        p.setIncidentId(incId);
        if (dev != null) {
            p.setDeviceId(dev.getId());
            p.setDeviceCode(dev.getDeviceCode());
            p.setDeviceName(dev.getDeviceName());
        }
        p.setPlanName(planName);
        p.setService(service);
        p.setFaultType(faultType);
        p.setRootCause(rootCause);
        p.setHealingActionType(actionType);
        p.setMttrSeconds(mttr);
        p.setStatus("SUCCESS");
        p.setResult("Verification passed. SLA restored.");
        p.setVerificationMessage(verMsg);
        p.setStartedAt(LocalDateTime.now().minusDays(1));
        p.setCompletedAt(LocalDateTime.now().minusDays(1).plusMinutes(3));
        recoveryPlanRepository.save(p);
    }
}
