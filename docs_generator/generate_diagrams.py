import os
import matplotlib.pyplot as plt
import matplotlib.patches as patches

# Set base style
plt.rcParams['font.family'] = 'sans-serif'
plt.rcParams['font.sans-serif'] = ['Arial', 'DejaVu Sans', 'Helvetica']

out_dir = r"d:\Autonomous Network Healing Platform\docs_generator"
os.makedirs(out_dir, exist_ok=True)

# -------------------------------------------------------------
# FIGURE 1: 3-TIER SYSTEM ARCHITECTURE DIAGRAM
# -------------------------------------------------------------
fig, ax = plt.subplots(figsize=(10, 6.2), dpi=300)
ax.set_xlim(0, 100)
ax.set_ylim(0, 100)
ax.axis('off')

# Background canvas
bg_rect = patches.Rectangle((0, 0), 100, 100, facecolor='#F8FAFC', edgecolor='none')
ax.add_patch(bg_rect)

# Title Header
ax.text(50, 96.5, "Autonomous Network Healing Platform — Tiered System Architecture", 
        fontsize=12, fontweight='bold', ha='center', va='center', color='#0F172A')

# 1. Presentation Tier (Top)
p_box = patches.FancyBboxPatch((4, 73), 92, 19, boxstyle="round,pad=1", facecolor='#F0F9FF', edgecolor='#0284C7', linewidth=1.5)
ax.add_patch(p_box)
ax.text(6, 89.5, "PRESENTATION TIER (Next.js 14 App Router + React 18 + Tailwind CSS)", fontsize=9.5, fontweight='bold', color='#0369A1')

# Presentation subcomponents
ui_comps = [
    ("NOC Dashboard\n(KPIs, Charts)", 6, 75.5, 16, 11),
    ("Device Topology\nInventory Grid", 24.5, 75.5, 16, 11),
    ("Alarm & RCA\nDiagnostic Center", 43, 75.5, 16, 11),
    ("Autonomous Healing\nPlaybook Console", 61.5, 75.5, 16, 11),
    ("Fault Simulator &\nRecovery View", 80, 75.5, 16, 11)
]
for text, x, y, w, h in ui_comps:
    c_box = patches.FancyBboxPatch((x, y), w, h, boxstyle="round,pad=0.5", facecolor='#FFFFFF', edgecolor='#38BDF8', linewidth=1.2)
    ax.add_patch(c_box)
    ax.text(x + w/2, y + h/2, text, fontsize=7.5, fontweight='bold', ha='center', va='center', color='#0F172A')

# Arrow between Presentation and Application
ax.annotate('', xy=(50, 66.5), xytext=(50, 72.5),
            arrowprops=dict(arrowstyle="<->", color='#0284C7', lw=1.8))
ax.text(51.5, 69.5, "HTTP / REST JSON (SpringDoc OpenAPI / Swagger)", fontsize=8, color='#0284C7', fontweight='bold')

# 2. Application Tier (Middle)
a_box = patches.FancyBboxPatch((4, 27), 92, 38.5, boxstyle="round,pad=1", facecolor='#F1F5F9', edgecolor='#475569', linewidth=1.5)
ax.add_patch(a_box)
ax.text(6, 62.5, "APPLICATION TIER (Spring Boot 3.3.4 + Java 21 LTS REST API Core)", fontsize=9.5, fontweight='bold', color='#1E293B')

# Controllers layer
ax.text(6, 57.5, "REST Controllers: DashboardCtrl | DeviceCtrl | AlarmCtrl | RcaCtrl | HealingCtrl | RecoveryCtrl | SimulatorCtrl", 
        fontsize=8, fontweight='bold', color='#334155')

# Services / Engines
engines = [
    ("Telemetry & Device\nService\n• Health Matrix Scoring\n• Dynamic Metric Cache", 6, 31, 20.5, 23, '#E0F2FE', '#0284C7'),
    ("RCA Diagnostic\nRule Engine\n• Anomaly Correlation\n• Confidence Scoring", 29, 31, 20.5, 23, '#FEF3C7', '#D97706'),
    ("Autonomous Healing\nOrchestrator\n• Playbook Execution\n• Verification Loops", 52, 31, 20.5, 23, '#DCFCE7', '#16A34A'),
    ("Disaster Recovery &\nFault Simulator\n• Fallback Runbooks\n• Synthetic Injection", 75, 31, 21, 23, '#FEE2E2', '#DC2626')
]
for text, x, y, w, h, bg, border in engines:
    e_box = patches.FancyBboxPatch((x, y), w, h, boxstyle="round,pad=0.5", facecolor=bg, edgecolor=border, linewidth=1.2)
    ax.add_patch(e_box)
    ax.text(x + w/2, y + h/2, text, fontsize=7.2, fontweight='semibold', ha='center', va='center', color='#0F172A')

# Arrow between Application and Persistence
ax.annotate('', xy=(50, 20), xytext=(50, 26.5),
            arrowprops=dict(arrowstyle="<->", color='#475569', lw=1.8))
ax.text(51.5, 23, "Spring Data JPA 3.3 / Hibernate 6.5 ORM / HikariCP Pool", fontsize=8, color='#475569', fontweight='bold')

# 3. Persistence Tier (Bottom)
d_box = patches.FancyBboxPatch((4, 4), 92, 15, boxstyle="round,pad=1", facecolor='#FAF5FF', edgecolor='#9333EA', linewidth=1.5)
ax.add_patch(d_box)
ax.text(6, 16.5, "PERSISTENCE TIER (MySQL 8/9 Enterprise Relational Storage — Database: network_healing)", fontsize=9.5, fontweight='bold', color='#7E22CE')

# Relational Tables
tables = [
    ("devices\n(12 nodes)", 6, 6, 13.5, 8.5),
    ("alarms\n(Incident state)", 21.5, 6, 14.5, 8.5),
    ("network_events\n(Telemetry stream)", 38, 6, 16, 8.5),
    ("rca_results\n(Diagnostics)", 56, 6, 14, 8.5),
    ("healing_actions\n(Remediation logs)", 72, 6, 15, 8.5),
    ("recovery_plans\n(Runbooks)", 89, 6, 15, 8.5)
]
for text, x, y, w, h in tables:
    t_box = patches.FancyBboxPatch((x, y), w, h, boxstyle="round,pad=0.4", facecolor='#FFFFFF', edgecolor='#A855F7', linewidth=1.1)
    ax.add_patch(t_box)
    ax.text(x + w/2, y + h/2, text, fontsize=7.2, fontweight='bold', ha='center', va='center', color='#0F172A')

plt.tight_layout()
fig.savefig(os.path.join(out_dir, "figure1_architecture.png"), dpi=300, bbox_inches='tight')
plt.close(fig)
print("Figure 1 generated successfully.")

# -------------------------------------------------------------
# FIGURE 2: CLOSED-LOOP AUTONOMOUS SELF-HEALING LIFECYCLE
# -------------------------------------------------------------
fig, ax = plt.subplots(figsize=(10, 4.8), dpi=300)
ax.set_xlim(0, 100)
ax.set_ylim(0, 100)
ax.axis('off')

# Background canvas
bg_rect = patches.Rectangle((0, 0), 100, 100, facecolor='#F8FAFC', edgecolor='none')
ax.add_patch(bg_rect)

# Title
ax.text(50, 93, "Closed-Loop Autonomous Network Remediation Workflow Pipeline", 
        fontsize=11.5, fontweight='bold', ha='center', va='center', color='#0F172A')

steps = [
    ("1. Telemetry & Alarm\nDetection", "Ingests latency, CPU,\npacket loss, link down.\nThreshold trigger.", 4, 38, 16, 44, '#FEF2F2', '#EF4444'),
    ("2. Rule-Based Root\nCause Analysis", "Correlates metrics,\ncomputes confidence,\ninfers root cause.", 23, 38, 16, 44, '#FFFBEB', '#F59E0B'),
    ("3. Action Selection\n& Playbook Match", "Selects playbook:\nRESTART_SERVICE,\nREROUTE, RESTORE.", 42, 38, 16, 44, '#EFF6FF', '#3B82F6'),
    ("4. Autonomous\nExecution", "Executes safe action,\nupdates telemetry\n& device metrics.", 61, 38, 16, 44, '#F5F3FF', '#8B5CF6'),
    ("5. Health Verification\n& Resolution", "Probes health score.\nSuccess -> RESOLVED\nFailure -> Fallback.", 80, 38, 16, 44, '#ECFDF5', '#10B981')
]

for title, desc, x, y, w, h, bg, border in steps:
    box = patches.FancyBboxPatch((x, y), w, h, boxstyle="round,pad=0.8", facecolor=bg, edgecolor=border, linewidth=1.5)
    ax.add_patch(box)
    ax.text(x + w/2, y + h - 9, title, fontsize=7.8, fontweight='bold', ha='center', va='center', color='#0F172A')
    ax.plot([x + 1.5, x + w - 1.5], [y + h - 18, y + h - 18], color=border, lw=1)
    ax.text(x + w/2, y + 12, desc, fontsize=6.8, ha='center', va='center', color='#334155')

# Forward arrows
for i in range(4):
    x_start = steps[i][2] + steps[i][4] + 0.3
    x_end = steps[i+1][2] - 0.3
    y_mid = 60
    ax.annotate('', xy=(x_end, y_mid), xytext=(x_start, y_mid),
                arrowprops=dict(arrowstyle="->", color='#0284C7', lw=2.2))

# Fallback loop (bottom)
fallback_box = patches.FancyBboxPatch((32, 6), 36, 20, boxstyle="round,pad=0.6", facecolor='#FFF1F2', edgecolor='#E11D48', linewidth=1.3, linestyle='--')
ax.add_patch(fallback_box)
ax.text(50, 18, "DISASTER RECOVERY FALLBACK (If Healing Verification Fails)", fontsize=7.5, fontweight='bold', ha='center', color='#BE123C')
ax.text(50, 10, "Triggers secondary runbook (REC-xxxx) with synthetic probes & manual escalation", fontsize=6.5, ha='center', color='#475569')

# Feedback arrows to fallback
ax.annotate('', xy=(68, 16), xytext=(88, 37.5),
            arrowprops=dict(arrowstyle="->", color='#E11D48', lw=1.5, linestyle='--'))
ax.text(82, 23, "Verify Fail", fontsize=6.5, color='#BE123C', fontweight='bold')

plt.tight_layout()
fig.savefig(os.path.join(out_dir, "figure2_closed_loop.png"), dpi=300, bbox_inches='tight')
plt.close(fig)
print("Figure 2 generated successfully.")

# -------------------------------------------------------------
# FIGURE 3: DATABASE ENTITY-RELATIONSHIP SCHEMA DIAGRAM
# -------------------------------------------------------------
fig, ax = plt.subplots(figsize=(10, 5.8), dpi=300)
ax.set_xlim(0, 100)
ax.set_ylim(0, 100)
ax.axis('off')

# Background canvas
bg_rect = patches.Rectangle((0, 0), 100, 100, facecolor='#F8FAFC', edgecolor='none')
ax.add_patch(bg_rect)

# Title
ax.text(50, 96, "MySQL Relational Entity-Relationship Diagram (ERD) — network_healing", 
        fontsize=11.5, fontweight='bold', ha='center', va='center', color='#0F172A')

# Tables layout:
# Top row: devices (center-left), alarms (center-right)
# Bottom row: network_events, rca_results, healing_actions, recovery_plans

erd_tables = [
    ("devices (PK: id)", 
     "PK id : BIGINT\n• device_code : VARCHAR(50)\n• device_name : VARCHAR(100)\n• ip_address : VARCHAR(45)\n• device_type : VARCHAR(50)\n• status : VARCHAR(20)\n• health_score : DOUBLE\n• cpu_usage, memory_usage\n• latency, packet_loss\n• active_alarms_count : INT", 
     4, 46, 26, 44, '#EFF6FF', '#2563EB'),
    
    ("alarms (PK: id)", 
     "PK id : BIGINT\nFK device_id : BIGINT\n• alarm_code : VARCHAR(50)\n• alarm_type : VARCHAR(50)\n• severity : VARCHAR(20)\n• status : VARCHAR(20)\n• fault_type : VARCHAR(50)\n• root_cause : TEXT\n• recommended_action : VARCHAR\n• detected_at, resolved_at", 
     36, 46, 28, 44, '#FEF2F2', '#DC2626'),
    
    ("rca_results (PK: id)",
     "PK id : BIGINT\nFK device_id, FK alarm_id\n• rca_code : VARCHAR(50)\n• category : VARCHAR(100)\n• root_cause : TEXT\n• confidence : DOUBLE (94-99%)\n• recommended_action : VARCHAR\n• risk_score, blast_radius",
     68, 46, 28, 44, '#FFFBEB', '#D97706'),
    
    ("network_events (PK: id)",
     "PK id : BIGINT\nFK device_id : BIGINT\n• event_type : VARCHAR(50)\n• metric_name : VARCHAR(50)\n• metric_value, threshold_val\n• severity : VARCHAR(20)\n• timestamp : DATETIME",
     4, 4, 26, 36, '#F8FAFC', '#64748B'),
    
    ("healing_actions (PK: id)",
     "PK id : BIGINT\nFK device_id, FK alarm_id, rca_id\n• action_code : VARCHAR(50)\n• action_type : VARCHAR(50)\n• status : VARCHAR(20)\n• progress_pct : INT (0-100)\n• result_summary : TEXT\n• executed_at, completed_at",
     36, 4, 28, 36, '#ECFDF5', '#059669'),
    
    ("recovery_plans (PK: id)",
     "PK id : BIGINT\nFK device_id : BIGINT\n• plan_code : VARCHAR(50)\n• incident_code : VARCHAR(50)\n• recovery_strategy : VARCHAR\n• est_downtime_sec : INT\n• verification_probe : VARCHAR\n• status : VARCHAR(20)",
     68, 4, 28, 36, '#FAF5FF', '#7C3AED')
]

for title, fields, x, y, w, h, bg, border in erd_tables:
    box = patches.FancyBboxPatch((x, y), w, h, boxstyle="round,pad=0.6", facecolor=bg, edgecolor=border, linewidth=1.3)
    ax.add_patch(box)
    ax.text(x + 2, y + h - 5, title, fontsize=7.8, fontweight='bold', va='center', color='#0F172A')
    ax.plot([x + 1, x + w - 1], [y + h - 8, y + h - 8], color=border, lw=1)
    ax.text(x + 2, y + (h - 10)/2, fields, fontsize=6.6, va='center', color='#334155', linespacing=1.25)

# Connectors (1 to Many)
# devices -> alarms
ax.annotate('1..N', xy=(36, 68), xytext=(30, 68),
            arrowprops=dict(arrowstyle="->", color='#2563EB', lw=1.5))

# alarms -> rca_results
ax.annotate('1..1', xy=(68, 68), xytext=(64, 68),
            arrowprops=dict(arrowstyle="->", color='#DC2626', lw=1.5))

# devices -> network_events
ax.annotate('1..N', xy=(17, 40), xytext=(17, 46),
            arrowprops=dict(arrowstyle="->", color='#64748B', lw=1.5))

# alarms -> healing_actions
ax.annotate('1..N', xy=(50, 40), xytext=(50, 46),
            arrowprops=dict(arrowstyle="->", color='#059669', lw=1.5))

# devices -> recovery_plans
ax.annotate('1..N', xy=(82, 40), xytext=(82, 46),
            arrowprops=dict(arrowstyle="->", color='#7C3AED', lw=1.5))

plt.tight_layout()
fig.savefig(os.path.join(out_dir, "figure3_er_diagram.png"), dpi=300, bbox_inches='tight')
plt.close(fig)
print("Figure 3 generated successfully.")
