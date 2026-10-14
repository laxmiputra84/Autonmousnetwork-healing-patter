import { NetworkDevice } from '@/types';

export const INITIAL_DEVICES: NetworkDevice[] = [
  {
    id: 'DEV-CR-01',
    name: 'Core-Router-Alpha-US-East',
    type: 'CORE_ROUTER',
    ip: '10.100.1.1',
    status: 'ONLINE',
    location: 'Virginia Data Center DC-01, Rack A4',
    firmware: 'IOS-XR-v7.9.2',
    uptime: '142d 18h 22m',
    cpuUsage: 28,
    memoryUsage: 45,
    temperature: 41,
    latencyMs: 4.2,
    packetLossPct: 0.0,
    lastSeen: 'Just now',
    activeAlarmsCount: 0,
    services: ['BGP-Routing', 'MPLS-Core', 'OSPF-Area0', 'Segment-Routing'],
    interfaces: [
      { name: 'HundredGigE0/0/0/0', ip: '10.100.1.1/30', speed: '100 Gbps', status: 'UP', trafficInMbps: 42100, trafficOutMbps: 38900, errors: 0 },
      { name: 'HundredGigE0/0/0/1', ip: '10.100.1.5/30', speed: '100 Gbps', status: 'UP', trafficInMbps: 51200, trafficOutMbps: 49800, errors: 0 },
      { name: 'TenGigE0/1/0/0', ip: '10.200.1.1/24', speed: '10 Gbps', status: 'UP', trafficInMbps: 3400, trafficOutMbps: 2900, errors: 0 }
    ]
  },
  {
    id: 'DEV-SW-04',
    name: 'Edge-Leaf-Switch-04',
    type: 'EDGE_SWITCH',
    ip: '10.100.4.12',
    status: 'DEGRADED',
    location: 'Frankfurt Pop-03, Row 12',
    firmware: 'NX-OS-9.3(8)',
    uptime: '48d 04h 11m',
    cpuUsage: 89,
    memoryUsage: 82,
    temperature: 58,
    latencyMs: 78.5,
    packetLossPct: 4.8,
    lastSeen: '12s ago',
    activeAlarmsCount: 1,
    services: ['VXLAN-EVPN', 'VLAN-Trunking', 'LACP-PortChannel', 'QoS-Policing'],
    interfaces: [
      { name: 'Eth1/1', ip: '10.100.4.12/24', speed: '40 Gbps', status: 'DEGRADED', trafficInMbps: 32000, trafficOutMbps: 28000, errors: 1420 },
      { name: 'Eth1/2', ip: '10.100.4.13/24', speed: '40 Gbps', status: 'UP', trafficInMbps: 18000, trafficOutMbps: 17400, errors: 12 }
    ]
  },
  {
    id: 'DEV-GN-5G-09',
    name: '5G-Cellular-gNodeB-Sector9',
    type: 'CELLULAR_GNODEB',
    ip: '172.16.89.201',
    status: 'ONLINE',
    location: 'Munich North Tower-88',
    firmware: 'vRAN-NR-24.1',
    uptime: '19d 11h 05m',
    cpuUsage: 44,
    memoryUsage: 51,
    temperature: 36,
    latencyMs: 11.2,
    packetLossPct: 0.01,
    lastSeen: 'Just now',
    activeAlarmsCount: 0,
    services: ['5G-NR-MIMO', 'O-RAN-Fronthaul', 'eCPRI-Transport', 'URLLC-Slice'],
    interfaces: [
      { name: 'eCPRI-0', ip: '172.16.89.201/29', speed: '25 Gbps', status: 'UP', trafficInMbps: 14500, trafficOutMbps: 8900, errors: 0 },
      { name: 'Backhaul-S1', ip: '172.16.89.202/29', speed: '10 Gbps', status: 'UP', trafficInMbps: 6200, trafficOutMbps: 5800, errors: 0 }
    ]
  },
  {
    id: 'DEV-FW-02',
    name: 'NextGen-Edge-Firewall-Primary',
    type: 'FIREWALL',
    ip: '192.168.1.1',
    status: 'ONLINE',
    location: 'Singapore Central DC, Cage B',
    firmware: 'PAN-OS-11.0.1',
    uptime: '210d 09h 40m',
    cpuUsage: 35,
    memoryUsage: 48,
    temperature: 42,
    latencyMs: 2.8,
    packetLossPct: 0.0,
    lastSeen: 'Just now',
    activeAlarmsCount: 0,
    services: ['BGP-Peering', 'IPSec-VPN-Mesh', 'DeepPacketInspection', 'Anti-DDoS-Filter'],
    interfaces: [
      { name: 'ae1 (WAN)', ip: '192.168.1.1/30', speed: '40 Gbps', status: 'UP', trafficInMbps: 26000, trafficOutMbps: 24500, errors: 0 },
      { name: 'ae2 (DMZ)', ip: '10.50.0.1/24', speed: '40 Gbps', status: 'UP', trafficInMbps: 12000, trafficOutMbps: 11800, errors: 0 }
    ]
  },
  {
    id: 'DEV-DC-GW-07',
    name: 'DC-Spine-Gateway-Tokyo',
    type: 'DATA_CENTER_GATEWAY',
    ip: '10.240.0.1',
    status: 'ONLINE',
    location: 'Tokyo Cloud Region TK-2',
    firmware: 'EOS-4.28.3F',
    uptime: '92d 14h 50m',
    cpuUsage: 31,
    memoryUsage: 42,
    temperature: 39,
    latencyMs: 5.6,
    packetLossPct: 0.0,
    lastSeen: 'Just now',
    activeAlarmsCount: 0,
    services: ['BGP-EVPN', 'SRv6-Tunneling', 'Telemetry-Streaming', 'Flow-Mirroring'],
    interfaces: [
      { name: 'Ethernet1/1', ip: '10.240.0.1/31', speed: '400 Gbps', status: 'UP', trafficInMbps: 142000, trafficOutMbps: 139000, errors: 0 },
      { name: 'Ethernet1/2', ip: '10.240.0.3/31', speed: '400 Gbps', status: 'UP', trafficInMbps: 110000, trafficOutMbps: 108000, errors: 0 }
    ]
  },
  {
    id: 'DEV-LB-03',
    name: 'Global-Traffic-LoadBalancer-EU',
    type: 'LOAD_BALANCER',
    ip: '10.180.20.5',
    status: 'ONLINE',
    location: 'London Colocation Metro-1',
    firmware: 'BIG-IP-17.1.0',
    uptime: '65d 02h 30m',
    cpuUsage: 52,
    memoryUsage: 61,
    temperature: 46,
    latencyMs: 6.1,
    packetLossPct: 0.0,
    lastSeen: 'Just now',
    activeAlarmsCount: 0,
    services: ['HTTP3-Proxy', 'SSL-Offloading', 'Anycast-DNS', 'HealthCheck-Prober'],
    interfaces: [
      { name: '1.1 (VLAN-Ext)', ip: '10.180.20.5/24', speed: '100 Gbps', status: 'UP', trafficInMbps: 68000, trafficOutMbps: 64000, errors: 0 }
    ]
  }
];
