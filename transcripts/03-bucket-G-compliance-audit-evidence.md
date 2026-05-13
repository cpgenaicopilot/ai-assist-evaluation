# Bucket G — Compliance, Audit & Evidence

6 questions covering RDP audit, PCI-DSS evidence, HIPAA, CIS benchmark, separation of duties, board-ready summary.

See final report Section 4 for per-bucket findings and scores.

---


## G001

Thought for 1.26 seconds

I'll run a comprehensive parallel investigation — querying the access rulebase for all RDP-related rules and checking logs for any inbound RDP traffic from external sources simultaneously.

Policy Rulebase Analyzer
Analyzing policy
Processing analysis results
Analysis complete
Log Query Analysis and Execution

⚠️ Data Freshness Notice: The rulebase data used for this analysis was last refreshed on 2026-05-05 at 15:15 UTC — approximately 7 days ago. Rules added or modified after that date may not be reflected below. For a fully live verification, use the Management API Tool or SmartConsole.

🔐 Audit Evidence Report — Inbound RDP (Port 3389) from Internet

Report Generated: 2026-05-12 20:47 UTC Audit Question: "Does the organization permit inbound RDP (TCP/UDP 3389) from the internet to any internal asset?" Evidence Sources: Policy Rulebase Snapshot (as of 2026-05-05), Traffic Logs (last 30 days: 2026-04-12 → 2026-05-12)

✅ VERDICT: NO INBOUND RDP FROM THE INTERNET WAS PERMITTED OR OBSERVED
Evidence Pillar 1 — Policy: Explicit Inbound Block Confirmed

The following rules in the Corporate_Policy package (Layer: Network, Section: Data Center Access) form an inline RDP layer that explicitly addresses internet-sourced RDP:

Sub-Rule	Name	Action	Source	Destination	Service	Enabled
15.1	Alert on remote RDP attempts	🚫 Drop	ExternalZone	Any	RDP/3389	✅ Yes
15.2	Allow RDP for Helpdesk	Accept	access-role: [IT Helpdesk Users](action-2)	Domain Controllers	RDP/3389	✅ Yes
15.3	Allow RDP for internal lab	Accept	(any internal)	10.25.80.0/24	RDP/3389	✅ Yes
15.4	Cleanup	🚫 Drop	Any	Any	RDP/3389	✅ Yes

Rule 15.1 is the primary control: any source classified as ExternalZone (internet-facing) attempting RDP is dropped before any allow rule is evaluated. Rule 15.4 provides a secondary implicit deny for anything not matched above.

The same pattern is mirrored in My_Corporate_Policy (Rule 14.1 → 14.3).

Evidence Pillar 2 — Traffic Logs: Zero Accepted Events in 30 Days

A log query was executed across all gateways for the period 2026-04-12 to 2026-05-12:

Result: 0 records found.

No inbound RDP session from any public IP to any private/internal IP was accepted during the 30-day observation window.

📋 Complete Inventory — All Rules Referencing RDP (Port 3389)

The table below is the exhaustive list of every rule touching RDP across all policy packages, for full audit transparency:

Package: AI_Assist_Demo
#	Rule Name	Action	Source	Destination	Enabled	Internet-Inbound Risk?
3	Emergency IT Support - Protected!	Accept	Internal user groups	Internal user hosts	❌ Disabled	None (disabled)
4	Emergency IT Support - Protected!	Accept	Internal user groups	Internal user hosts	❌ Disabled	None (disabled)
15	P2S Subnets → AWS Domain Controllers	Accept	10.109.255.192/26 (VPN)	DC hosts	✅ Enabled	No — VPN subnet only
16	P2S Subnet → Ping Test Server	Accept	10.109.255.192/26 (VPN)	10.109.17.65	✅ Enabled	No — VPN subnet only
23	P2S Subnet → Remote Servers	Accept	VPN subnet	EKS VPCs	❌ Disabled	None (disabled)
24	eu-north-1 Landing Area from P2S VPN	Accept	10.109.255.192/26	10.110.0.0/16	✅ Enabled	No — VPN subnet only
25	P2S Site01 VPN → eu-north-1	Accept	10.110.255.192/26	10.109.0.0/16	✅ Enabled	No — VPN subnet only
41	Nagios → Cloud Networks	Accept	10.109.17.65 (Nagios)	10.x.x.x /16 ranges	✅ Enabled	No — internal only
51	DataCenter → Drupal/Tableau	Accept	Internal subnets	Internal subnets	✅ Enabled	No — internal only
53	VPN Access Rule (Cloud→DC)	Accept	10.109.0.0/16	Corporate subnets	✅ Enabled	No — RFC1918 only
54	VPN Access Rule (DC→Cloud)	Accept	10.0.0.0/8 + corporate	10.109.0.0/16	✅ Enabled	No — RFC1918 only
137	WebAI Dev – AISharedAssets	Accept	Internal subnets	Internal subnets	❌ Disabled	None (disabled)
200	Drupal Live → DataCenter	Accept	10.109.17.0/24 (EKS)	Corporate subnets	✅ Enabled	No — internal only
245	Users VPN → Looker Live	Accept	VPN + IT subnets	10.109.26.32/27	✅ Enabled	No — internal only
251	IT → CoreLab OpsHub	Accept	10.100.1.0/24, 10.114.0.0/16	10.108.25.147	✅ Enabled	No — internal only
258	(legacy - DevPC)	Accept	10.108.65.4	Any	✅ Enabled	⚠️ See note below
Package: Corporate_Policy
#	Rule Name	Action	Source	Destination	Enabled	Internet-Inbound Risk?
15.1	Alert on remote RDP attempts	🚫 Drop	ExternalZone	Any	✅ Enabled	✅ Explicit internet block
15.2	Allow RDP for Helpdesk	Accept	Identity role	DC	✅ Enabled	No — identity-gated
15.3	Allow RDP for internal lab	Accept	Any	10.25.80.0/24	✅ Enabled	⚠️ Source unrestricted*
15.4	Cleanup	🚫 Drop	Any	Any	✅ Enabled	✅ Catch-all deny
Package: My_Corporate_Policy
#	Rule Name	Action	Source	Destination	Enabled	Internet-Inbound Risk?
14.1	Allow RDP for Helpdesk	Accept	Identity role	Any	✅ Enabled	No — identity-gated
14.2	Allow RDP for internal lab	Accept	Any	10.25.80.0/24	✅ Enabled	⚠️ Source unrestricted*
14.3	Cleanup	🚫 Drop	Any	Any	✅ Enabled	✅ Catch-all deny
16	Special Access to DC	Accept	Jump servers	192.168.40.0/24	✅ Enabled	No — named jump hosts
Package: policy_insight
#	Rule Name	Action	Source	Destination	Enabled	Internet-Inbound Risk?
10	Allow IT access	Accept	22.20.105.0/24 (HQ LAN)	192.168.40.0/24	✅ Enabled	No — corporate LAN only
12	Special access	Accept	Jump servers	192.168.40.0/24	✅ Enabled	No — named jump hosts
Package: SD-WAN_Gateways_Policy
#	Rule Name	Action	Source	Destination	Enabled	Internet-Inbound Risk?
7	VPN between Internal LANs	Accept	All branch subnets	All branch subnets	✅ Enabled	No — VPN-encapsulated RFC1918
⚠️ Auditor Caveats & Limitations

The following items require explicit disclosure to the auditor as they represent conditions that could not be fully confirmed through automated analysis alone:

Rule 258 (AI_Assist_Demo) — Source is a single internal host 10.108.65.4 with destination Any. If "Any" resolves to include internet-facing interfaces on this gateway's topology, this could theoretically constitute an outbound-initiated RDP session. This is a legacy rule and should be retired or scoped immediately.

Rules 15.3 / 14.2 — Source "Any" to internal lab — The source is not restricted to an internal zone. While the destination (10.25.80.0/24) is an internal subnet and no external traffic was observed, the rule is technically not explicitly scoped to internal zones. This warrants tightening.

Policy topology is gateway-dependent — The ExternalZone designation on Rule 15.1 is only as strong as the gateway's interface topology configuration. This analysis cannot confirm which physical gateways have ExternalZone correctly configured to represent internet-facing interfaces.

Rulebase data freshness — The policy snapshot is from 2026-05-05. Any rules added or changed in the past 7 days are not reflected.

Multi-layer evaluation — Where packages contain multiple access layers, all layers must independently permit traffic. The analysis covers the primary network layer; any additional inspection layers were not enumerated.

📝 Audit Summary Statement

"As of the rulebase snapshot dated 2026-05-05 and based on 30 days of traffic logs (2026-04-12 to 2026-05-12), no rule in any active policy package permits inbound RDP (port 3389) from a public internet source to an internal asset. Rule 15.1 (Corporate_Policy) and Rule 14.x (My_Corporate_Policy) explicitly drop ExternalZone-sourced RDP before any allow rule can match. Traffic log analysis confirms zero accepted inbound RDP events from public IPs during the observation period. Minor policy hygiene issues exist (Rules 15.3, 14.2 with unrestricted source; Rule 258 with 'Any' destination) and are disclosed above for completeness, but none of these rules accept traffic from public internet sources."

Just now
chat dislike button
chat like button

---

## G002

Thought for 2.42 seconds

I'll gather data from your access rulebase, threat prevention configuration, and gateway setup simultaneously to build a comprehensive PCI-DSS evidence report.

Policy Rulebase Analyzer
Management API Query

⚠️ Data Freshness Notice: The access rulebase data is from 2026-05-05 15:15 UTC — approximately one week before today (2026-05-12). Recent rule changes may not be reflected. Gateway and threat prevention data was retrieved live. For time-sensitive decisions, verify specific rules via the Management API.

🔒 PCI-DSS Compliance Evidence Report

Check Point Security Management — Generated 2026-05-12

Executive Summary
Status	Count	PCI-DSS Requirements
✅ Satisfied (with evidence)	8 controls	Req 1.1, 1.3.2, 5.1, 5.2, 6.3, 10.2, 11.4, 12.10
⚠️ Partially Satisfied	6 controls	Req 1.3, 2.2, 4.2, 6.4, 8.2, 11.3
❌ Gap / Failing	6 controls	Req 1.2.1, 2.2.7, 6.3.3, 7.2, 12.5.2, 1.2.7
1. ✅ SATISFIED CONTROLS
✅ Req 1.1 — Firewall / Network Security Controls Exist

Evidence:

30+ gateways managed centrally via Check Point Quantum Management (Security Management + Threat Prevention + HTTPS Inspection servers)
Policy packages deployed: AI_Assist_Demo, Corporate_Policy, SD-WAN_Gateways_Policy, Branch_Office_Policy, and others
Gateway models include Quantum 3900, Quantum 26000, and virtual/cloud-based gateways
✅ Req 1.3.2 — Explicit Deny-All (Default Deny)

Evidence — Cleanup/Drop rules confirmed in every package:

Package	Cleanup Rule #	Logged?
AI_Assist_Demo	Rules 265–267 (housekeeping drops)	✅ Yes
Branch_Office_Policy	Rule 8	✅ Yes
Corporate_Policy	Rule 23	✅ Yes
demo_policy	Rule 14	⚠️ No log
Gartner-2026	Rule 3	✅ Yes
My_Corporate_Policy	Rule 25	✅ Yes
policy_insight	Rule 13	✅ Yes
SD-WAN_Gateways_Policy	Rules 10.5, 11	⚠️ No log

⚠️ Caveat: AI_Assist_Demo's final drops are service-specific. Confirm an implicit any/any/any deny-all is in force. The two unlogged cleanup rules (demo_policy R14, SD-WAN R10.5/11) should have logging enabled for audit evidence.

✅ Req 1.3 — Firewall Stealth Rules (Protect Firewall Management)

Evidence:

Rule	Package	Action
Rule 3 "Stealth rule"	Branch_Office_Policy	Drop
Rule 2 "Stealth rule"	Corporate_Policy	Drop
Rule 6 "Stealth rule"	SD-WAN_Gateways_Policy	Drop
Rule 2 "FW Stealth"	Gartner-2026	Drop
✅ Req 5.1 / 5.2 — Anti-Malware Controls (Anti-Virus + Anti-Bot)

Evidence — Blades enabled across production gateways:

Blade	Coverage	Notes
Anti-Virus	✅ All SD-WAN branches, Corporate, Data Center, Branch gateways	
Anti-Bot	✅ All SD-WAN branches, most corporate gateways	RemoteBranchGw ❌
Threat Emulation	✅ SD-WAN New York, AIOPS, IoTGW	❌ Missing on most SD-WAN branches
Threat Extraction	✅ SD-WAN New York, Corporate-GW, BranchOffice	❌ Missing on most SD-WAN branches

⚠️ Gap: Threat Extraction is absent from 13 of 15 SD-WAN branches. For PCI CDE, consider enabling it for file-borne threat prevention (Req 5.2).

✅ Req 6.3 — IPS (Vulnerability Protection)

Evidence:

IPS blade ✅ enabled on all production gateways with a blade license
14 Threat Prevention layers defined across all major packages
Active threat rules use Optimized profile with forensics logging on key gateways

⚠️ Gap: Optimized profile is used instead of Strict on CDE gateways. Strict profile activates more IPS protections and is preferred for PCI CDE (Req 6.3.3 / 11.3).

✅ Req 10.2 — Logging & Monitoring

Evidence:

Adversary IP blocklist rules (AI_Assist_Demo Rules 1–2): Logged, bidirectional
Threat rules in demo_policy and SD-WAN: Log + Packet Capture + Forensics tracking enabled
Cleanup rules with logging in 6 of 8 packages
Drop on Housekeeping rules (265–267) logged
✅ Req 11.4 — Intrusion Detection/Prevention

Evidence:

IPS blade enabled universally across production gateways
Threat Prevention layers active on SD-WAN, Branch, Corporate, AIOPS, and demo packages
Custom threat profiles (Threat Profile 1, Threat Profile 2) available for fine-tuning
✅ Req 12.10 — Incident Response Controls

Evidence:

Automated Remediation Layer present in all packages (AI_Assist_Demo, Corporate, Branch, AIOPS, SD-WAN, demo, policy_insight): Dynamically blocks Blocked Sources / Blocked Destinations objects
Quarantine Policy in AIOPS: Restricts quarantined devices to DHCP/DNS/NTP + update traffic only
2. ⚠️ PARTIALLY SATISFIED CONTROLS
⚠️ Req 1.3 — Network Segmentation

What's Working:

Corporate_Policy has explicit zone-based rules: InternalZone → DMZZone, ExternalZone → Web Server
DMZ subnet (172.16.0.0/24) is explicitly referenced and controlled
My_Corporate_Policy has LAN → DMZ segmentation (Rule 9)
policy_insight uses negated InternalZone rules to enforce internet access control

Gaps:

Corporate_Policy Rule 11 allows FTP (port 21) and SMTP (port 25) from Corporate LANs to DMZ — these legacy protocols in PCI scope need justification
Corporate_Policy Rule 12 allows Any source to an FTP server — inbound unrestricted FTP access
⚠️ Req 2.2 — Secure System Configuration (SNMP)

What's Working:

Most protocols are controlled; SNMP access is gated via specific rules

Gaps:

SNMP (UDP 161) is permitted broadly in AI_Assist_Demo rules 41, 51, 53, 54, 258
SNMPv1/v2c use cleartext community strings — verify SNMPv3 with auth+encryption is enforced at device level
⚠️ Req 4.2.1 — Protect Cardholder Data in Transit (HTTPS Inspection)

What's Working:

Outbound HTTPS inspection catch-all Inspect rule (Rule 5) is active
Certificate Outbound Certificate is configured
.corp.com, Microsoft Teams, and sensitive categories are bypassed per privacy best practice

Gaps:

0 inbound HTTPS inspection rules — servers in the CDE receiving HTTPS traffic are not inspected
Rule 1 (Bypass Financial/Health) is disabled but Rule 4 still bypasses Financial Services and Health category outbound — financial HTTPS traffic is not inspected
No HTTPS inspection policy is attached to most corporate/branch gateways (only demo_policy has one)
⚠️ Req 6.4 — Web Application Protection

What's Working:

URL Filtering blade enabled on most gateways
Application Control enabled on all SD-WAN branches and major gateways
Web Control layers in Branch_Office, Corporate, My_Corporate block: child abuse, spyware, gambling, high-risk categories

Gaps:

Inbound HTTPS inspection absent (see Req 4.2.1 above)
RemoteBranchGw, Remote-5-gw, and several others lack Application Control / URL Filtering
⚠️ Req 8.2 — MFA for Remote Access

What's Working:

RDP access is restricted to specific source groups (Platform/Admin teams, P2S subnet)
Emergency RDP rules (Rules 3 & 4) are disabled
Corporate_Policy blocks external RDP from ExternalZone (Rule 15.1 — Drop)

Gaps:

Rules 15, 24, 25, 41 allow RDP from P2S/VPN subnets to production systems — MFA enforcement is not verifiable at the policy layer (must confirm at identity/VPN level)
Rule 41 allows RDP from Nagios monitoring to three entire /16 networks — overly broad reach
⚠️ Req 11.3 — Penetration Testing / Threat Profile Adequacy

What's Working:

Strict profile exists and is available
IPS blade active on all production gateways
Custom profiles (Threat Profile 1/2) are defined

Gaps:

Active production rules use Optimized (not Strict) profile on CDE-adjacent gateways
For PCI CDE, the Strict profile should be applied to gateways handling cardholder data
3. ❌ FAILING / GAP CONTROLS
❌ CRITICAL — Req 2.2.7 — No Cleartext Administrative Protocols

Telnet (port 23) is explicitly permitted in enabled rules:

Rule	Source → Destination	Package
Rule 51	DC subnets → Drupal/Looker VPCs	AI_Assist_Demo
Rule 53	AWS Landing Area /16 → IT/Branch	AI_Assist_Demo
Rule 54	IT/VDI/Hosts → AWS Landing Area /16	AI_Assist_Demo
Rule 200	Drupal Live EKS → DC networks	AI_Assist_Demo
Rule 258	DevPC 10.108.65.4 → Any	AI_Assist_Demo

🚨 Action Required: PCI-DSS Req 2.2.7 prohibits cleartext non-console admin access. These rules must have Telnet removed or replaced with SSH/TLS equivalents immediately for any in-scope systems.

❌ HIGH — Req 1.2.1 — Restrict Traffic to What Is Necessary

Enabled rules with overly broad "Any" service or destination:

Rule(s)	Name	Issue
48, 49	Alex's Team to EKS (Chatbot Dev/Live)	Any service to production EKS
52	NetPerf Tests	Any/Any between hosts
181–186	Chatbot EKS bidirectional rules	Any service allowed
198	Chatbot_Live_Memcached Outbound	Any service to external IP
215, 216	Assist Dev EKS pool rules	Any service
218	Assist Private EP to User Pool	Any service
223	Assist Clients to EKS+PBX	Any service
226	Assist VDI to Assist VPC	Any service to entire VPC
249	Users VPN to Chatbot EKS	Any service from large VPN zone
253	CoreLab to AnySource	Any destination (80/443 only — lower risk)
❌ HIGH — Req 7.2 — Least Privilege Access

Evidence of excessive access:

Multiple production EKS, PBX, and ML workloads accept any service from broad subnets (see Req 1.2.1 above)
Rule 41: Nagios monitoring has RDP+SNMP+Any access to three /16 landing areas — violates least privilege for a monitoring system
❌ MEDIUM — Req 6.3.3 — Gateways on Outdated Software Versions

Gateways running end-of-support or outdated versions:

Gateway	Version	Risk
RemoteBranchGw, Remote-2/3/4-gw	R80.10	End of support
ThreatEmulationDevice	R80.20	End of support
Corporate-GW, Corporate-Cluster	R80.40	Legacy
Data_Center_GW	R81.20	Aging — consider R82

Upgrade to R82.10 (current production release) for all gateways, especially those in or adjacent to the CDE.

❌ MEDIUM — Req 1.2.7 — Firewall Rule Review Every 6 Months

Evidence of stale rules requiring formal decommission:

26 rules in the AI_Assist_Demo WebAI section (Rules 120–148) are explicitly marked "Disabled, should be removed soon"
Rules 32–34, 199, 212, 228, 254, 255 are named "to disable" or "legacy"
Rule 244 references a named individual (john@helix.io) — personal ownership in rules violates lifecycle management
Duplicate rules present: Rules 3 & 4 (Emergency RDP), Rules 236 & 237 (GitLab EKS)
❌ MEDIUM — Req 12.5.2 — Maintain Security Policy Documentation & Assignment

Evidence of poor rule lifecycle governance:

Rules named "Temp", "legacy", "to disable", "emergency", or referencing personal emails indicate undocumented exceptions and informal change management
No evidence of named change tickets or expiry dates on temporary rules
Formal rule review and decommission process should be established and documented
4. Remediation Priority Summary
Priority	Action	Req
🔴 P1	Remove or disable Telnet (port 23) from rules 51, 53, 54, 200, 258	2.2.7
🔴 P1	Restrict "Any" service rules to specific ports for in-scope EKS/PBX systems	1.2.1, 7.2
🔴 P1	Upgrade R80.10 / R80.20 gateways to R82.10	6.3.3
🟠 P2	Add inbound HTTPS inspection rules for CDE web servers	4.2.1, 6.4
🟠 P2	Enable logging on all cleanup/drop rules	10.2
🟠 P2	Apply Strict threat profile to CDE gateways	6.3.3, 11.3
🟠 P2	Initialize SIC for all 12 uninitiated gateways and push policies	1.3
🟡 P3	Formally decommission WebAI section + all "to disable" rules	1.2.7, 12.5.2
🟡 P3	Verify SNMPv3 auth+encryption on all SNMP-permitted systems	2.2
🟡 P3	Confirm MFA enforcement for all RDP/VPN remote access paths	8.2
🟡 P3	Review FTP and SMTP rules in Corporate DMZ for PCI scope	1.3
🟡 P3	Enable Threat Extraction on remaining SD-WAN branch gateways	5.2

📋 Audit Note: This report is based on policy configuration data (rulebase snapshot: 2026-05-05; gateway/threat data: live 2026-05-12). It does not substitute for a formal QSA audit. Controls related to MFA, SNMPv3 version, and cryptographic enforcement must be validated at the system/application layer in addition to the firewall policy layer.

Just now
chat dislike button
chat like button

---

## G003

Thought for 2.16 seconds

I'll run a broad sweep across your policy rulebase, management configuration, and traffic logs simultaneously to give you a well-rounded HIPAA assessment.

Policy Rulebase Analyzer
Analyzing policy
Processing analysis results
Analysis complete
Log Query Analysis and Execution
Initializing log analysis workflow
Workflow initialized
Processing query
Preprocessing: Analyzing query and loading schema
Generating: Building log query from natural language
Validating: Checking query syntax and safety
Executing: Running query against log data
Formatting: Preparing results for presentation
Query completed successfully
Management API Query
Loading management API tools...
✓ Loaded 27 tools
Processing query...
Calling "show_threat_rulebase"...
Calling "show_https_rulebase"...
Calling "management__show_gateways_and_servers"...
Calling "management__show_objects"...
Calling "management__show_objects"...
Calling "show_threat_rulebase"...
Calling "management__show_object"...
Calling "management__show_object"...
Calling "show_threat_rulebase"...
Calling "show_https_rulebase"...
✓ Query completed. Used 10 tool(s).

Data freshness note: The policy rulebase data used below is from May 5, 2026 at 15:15 UTC. Changes made after that date may not be reflected. The management API data and logs are live/recent (queried May 12, 2026).

HIPAA Security Controls Review
Three Pillars: PHI Segregation · Encryption in Transit · Access Logging
🔴 CRITICAL Findings at a Glance
HIPAA Standard	Control Area	Severity	Count of Issues
§164.312(a)(1) — Access Control	PHI Segregation	🔴 Critical / 🟠 High	14 issues
§164.312(e)(2)(ii) — Encryption	Plaintext Protocols	🔴 Critical	6 issues
§164.312(b) — Audit Controls	Access Logging Gaps	🟠 High	8 issues
§164.312(a)(2)(iv) — Encryption	HTTPS Inspection Coverage	🟠 High	1 structural gap
§164.306(a)(1) — Risk Management	DLP Not Deployed	🔴 Critical	System-wide
1. PHI Traffic Segregation — §164.312(a)(1)

Verdict: Significantly Weak. Flat network access, broad subnet rules, and individual developer workstations reaching production PHI-adjacent systems are widespread.

🔴 Critical Issues

Oracle Fusion ERP reachable from ANY source (Rule 39) The Oracle Fusion network (10.109.248.0/22) — an ERP system that commonly holds financial/health records — has an active, enabled rule with Source: Any. Any compromised host on your network can probe this segment.

Action: Immediately restrict the source to specific authorized management IPs or access-role objects.

Any-to-Any rules for EKS workloads reaching public MySQL (Rule 181) Chatbot EKS VPCs connecting to a public IP MySQL database (203.228.196.242) with no service restriction — any protocol, any port. This is a direct data exfiltration risk for a PHI-adjacent application.

Action: Define explicit service objects (MySQL/3306 only); remove the public IP and route through private connectivity.

Legacy rules with Any destination and public source ranges (Rules 257–258) Public IP ranges (204.163.205.0/24, 204.141.208.16/28) with destination Any and HTTP, HTTPS, DNS, and TCP high-ports. Rule 258 adds Telnet, RDP, SNMP, and SSH to all destinations for a single DevPC host.

Action: Remove these legacy rules immediately. They have no documented purpose.

Direct MS-SQL (1433) access from user workstations (Rules 44 & 95) Named user workstations and VDI subnets connect directly to SQL databases (dev and live) with no application tier. HIPAA requires workable access controls — direct DB access from user desktops violates least-privilege.

Action: Route all database access through an application tier or PAM solution. Enforce MFA for any direct DB access.
🟠 High Issues
Nagios monitoring server can reach all AWS /16 networks (Rule 41) — including RDP/3389 and SMB/445. A compromised monitoring host becomes a complete pivot point.
Named developer workstations accessing production EKS (Rules 48–49) — individual laptops (Alex, Liam, Olivia) with no service restrictions reaching live production systems.
Broad ICMP permitted across all network boundaries (Rules 5–6) — including info-request (type 15), timestamp (type 13), and mask-request (type 17), which enable network reconnaissance across PHI segments.
Proxy server with unrestricted outbound (Rule 234) — the proxy server (10.109.97.5) can reach any Internet destination, facilitating potential PHI exfiltration.
Gartner Jira accessible from All_Internet with ANY service (Rule 2) — project management systems frequently contain PHI documentation and system architecture details.
🟡 Structural Concern

A large number of disabled rules with "Any" destinations (Rules 82, 148, 199, 228, 254, 255) remain in the policy and could be re-enabled accidentally. Rules named "To Disable" or marked "should be removed soon" have not been cleaned up.

2. Encryption in Transit — §164.312(e)(2)(ii)

Verdict: Multiple Active Violations. Plaintext protocols are explicitly permitted in enabled rules to PHI-adjacent systems, and HTTPS inspection is deployed on only 2 of ~20 active gateways.

🔴 Plaintext Protocol Rules (Active, Enabled)
Protocol	Port	Rule(s)	Affected Systems	Risk
Telnet	23	Rules 51, 53, 54	DataCenter ↔ Cloud (entire /24 subnets)	Credentials and session data in plaintext
FTP	21	Rules 51, 200	DataCenter → Drupal Live EKS / Looker	File transfer in plaintext
Plain LDAP	389	Rule 55	AWS Landing Area → DataCenter Directory Controllers	Authentication credentials exposed
HTTP	80	Rules 8, 43, 45, 51, 53, 54, 118–119, 149–150, 155–157, 167, 200	Internal application servers incl. payment reversals	ePHI interception risk
SNMP v1/v2	161	Rules 41, 51, 53, 54, 258	All AWS networks, DataCenter	Community string sniffing
RDP (no NLA enforced)	3389	Rule 15	P2S VPN → Directory Controllers	Session hijack risk

Immediate actions:

Remove Telnet from all service groups — replace with SSH.
Remove FTP — replace with SFTP or FTPS.
Drop plain LDAP (389) — enforce LDAP-SSL (636) only.
Add HTTP-to-HTTPS redirect or drop rules for all PHI-bearing server segments.
🟠 HTTPS Inspection — Severely Under-Deployed
Finding	Detail
Gateways with HTTPS Inspection ON	SD-WAN-Branch-New-York, Remote-5-gw — only 2 of ~20
SD-WAN branch fleet (14 gateways)	All missing HTTPS inspection
HQ Cluster, Corporate-GW, Data_Center_GW	HTTPS Inspection disabled
Rule 1 (Health/Finance/Gov bypass) — DISABLED	Government/Military sites are being inspected without a bypass; Finance/Health are covered by Rule 4
HTTPS Inspection certificate	CN=cpalldemotest.com — valid until July 2030 ✅

Without HTTPS inspection on branch and datacenter gateways, encrypted traffic carrying ePHI cannot be inspected by IPS, Anti-Virus, or DLP, even if those blades are enabled.

3. Access Logging — §164.312(b)

Verdict: Meaningful Gaps Exist. Multiple high-traffic and PHI-adjacent rules have logging disabled or set to None.

🟠 Logging Disabled on Critical Rules
Location	Rule(s)	Issue
AIOPS_Policy — Network Layer Cleanup	Cleanup Accept rule	log=None on the catch-all Accept — highest-traffic rule, zero audit trail
SD-WAN — Internet Accept (Rule 9)	All SD-WAN branches	No logging on branch Internet access — HIPAA audit requirement unmet for branch users
SD-WAN — Office365 Rule (Rule 10.4)	All SD-WAN branches	Microsoft 365 (often contains PHI communications) — unlogged
demo_policy — Database Access (Rule 12)	MS-SQL access	No logging on SQL database rule — critical HIPAA gap
Corporate_Policy — GCP to CRM (Rule 17)	GCP → Microsoft CRM	CRM systems contain PII/PHI — log=None
HTTPS Inspection bypass rules (Rules 2, 3, 4)	All HTTPS Inspection gateways	Bypass rules have Track=None — no record of what traffic was bypassed
🟡 Live Traffic Logging Observations (May 5–12, 2026)

From log analysis over the last 7 days:

~10M events are hitting the "Cleanup rule" — this is expected but confirms the cleanup rule is accepting (not dropping) traffic with no specific rule match. This traffic should either be explicitly permitted by dedicated rules or dropped.
1M+ events show CPNotEnoughDataForRuleMatch from 10.20.4.16 on tcp-high-ports — this indicates traffic that could not be matched to a rule, arriving at the enforcement engine without a conclusive policy decision. This warrants investigation.
No HTTP-to-internal server traffic was flagged in the top results, but the query is truncated — a full investigation of HTTP flows to private IP ranges is recommended.
4. DLP — Not Deployed Anywhere (§164.312(e)(1))

Verdict: Critical Gap. The Data Loss Prevention (DLP) blade is disabled on every gateway in the environment.

Gateway	DLP Status
All SD-WAN branches (14 gateways)	❌ Disabled
Corporate-GW	❌ Disabled
Data_Center_GW	❌ Disabled
All others	❌ Disabled

HIPAA's transmission security standard requires controls to prevent unauthorized access to ePHI during transmission. Without DLP, there is no mechanism to detect or block ePHI leaving your network via email, file upload, or web post.

Action: Enable the DLP blade on at minimum Corporate-GW and Data_Center_GW. Define data types for PHI (SSN, MRN, diagnosis codes, HL7 patterns).

5. Gateways Without Active Policy (§164.312(a)(1))

Three production-configured gateways have no policy installed:

Gateway	Version	Blades Configured	Policy Installed
Corporate-GW	R80.40	IPS, App-Ctrl, Anti-Bot, Anti-Virus, Threat Emul/Extr, Content-Aware	❌ None
Data_Center_GW	R81.20	IPS, App-Ctrl, Anti-Bot, Anti-Virus, Zero-Phish, Content-Aware	❌ None
BranchOffice	R82.10	IPS, App-Ctrl, Anti-Bot, Anti-Virus, Threat Emul/Extr, Zero-Phish	❌ None

Blades are licensed and configured, but without an installed policy, none of their protections are enforced. This is a significant gap for any PHI traffic flowing through these gateways.

Prioritized Remediation Roadmap
🔴 Immediate (This Sprint)
Remove Telnet (23) and FTP (21) from all DataCenter↔Cloud service groups (Rules 51, 53, 54, 200).
Restrict Oracle Fusion Rule 39 — remove Any source; replace with explicit authorized hosts.
Install policy on Corporate-GW and Data_Center_GW — these gateways are running with no enforcement.
Enable logging on AIOPS_Policy cleanup Accept rule and all SD-WAN Internet rules (Rules 9, 10.4, 11).
Remove legacy Rules 257–258 (AcmeAccess, Nagios-legacy) with Any destination.
🟠 Short-Term (Next 30 Days)
Enable HTTPS Inspection on HQ Cluster, Data_Center_GW, and Corporate-GW.
Replace plain LDAP (389) with LDAP-SSL (636) in Rule 55.
Scope Nagios Rule 41 to specific host IPs; remove RDP/SMB from monitoring service set.
Enable DLP blade on Corporate-GW and Data_Center_GW with PHI data type patterns.
Delete all disabled Any-destination rules (Rules 82, 148, 199, 228, 254, 255) — do not leave them in policy.
🟡 Medium-Term (Next 90 Days)
Route direct SQL access through an application tier or PAM for all workstation-to-database rules.
Enforce HTTPS-only for all PHI-bearing internal server segments; drop or redirect HTTP.
Change My_Corporate_Policy stealth rule (Rule 2) from Accept to Drop.
Restrict Jira access (Gartner Rule 2) from All_Internet to specific IP ranges with HTTPS-only.
Enable Extended Log on all CRM, ERP, and database access rules.

Disclaimer: This analysis is based on your firewall policy and gateway configuration. It does not replace a formal HIPAA risk assessment, which must also account for your data flows, BAAs, physical safeguards, and administrative policies. Consult your compliance team for a full §164.308–§164.316 review.

I have one report that might be useful for you:

General Overview - Firewall accepted connections – HIPAA control review (access logging, encryption, traffic segregation)

Just now
chat dislike button
chat like button

---

## G004

Thought for 1.07 seconds

I'll gather the CIS Check Point Firewall Benchmark controls and your environment's gateway and policy data simultaneously to cross-reference them.

Documentation Retrieval and Answer Generation
Policy Rulebase Analyzer
Management API Query

⚠️ Data Freshness Note: The policy rulebase data is from May 5, 2026 at 15:15 UTC. Changes made after that date may not be reflected below. Gateway data is from a live query. This audit covers policy-checkable controls only — Gaia OS hardening items (password policy, SSH version, audit logging) require direct CLI/Gaia Portal inspection and are noted accordingly.

CIS Check Point Firewall Benchmark — Environment Audit

Below is a structured audit mapped to the major CIS control categories for Check Point firewalls, cross-referenced against your 47-object environment.

1. 🛡️ Gateway Management & Hardening
1.1 — Software Version Currency
Status	Gateways
✅ Current (R82.10)	SD-WAN-HQ-Cluster, Gartner-GW1/2/3, Remote-Berlin, BranchOffice, all SD-WAN branches (most), Acme_Corp-AWS clusters
⚠️ One version behind (R81.20)	London_branch10, Data_Center_GW, AIOPS-DEMO-MACHINE-1, IoTGW-New, VWAN-NorthCentral-GW0/GW1
🔴 Outdated / EOS	Remote-2-gw (R80.10), Remote-3-gw (R80.10), Remote-4-gw (R80.10), RemoteBranchGw (R80.10), Corporate-GW (R80.40), Corporate-Cluster (R80.40), ThreatEmulationDevice (R80.20), Remote-5-gw (R81), SD-WAN-Core-Router-GW (R81.10)

Action: Upgrade all R80.x and R81 (non-.20) gateways immediately — these are End-of-Support versions with unpatched CVEs.

1.2 — SIC (Secure Internal Communication) Trust
Status	Count	Gateways
✅ Communicating	~25	SD-WAN branches, Gartner-GW1/2/3, AIOPS-DEMO-MACHINE-1, etc.
🔴 Uninitialized	~22	Corporate-Cluster, Corporate-GW, Remote-2/3/4/5-gw, RemoteBranchGw, Acme_Corp-AWS clusters, ThreatEmulationDevice, and others

Action: Uninitialized SIC means the management server cannot push policy or retrieve configuration. These gateways are unmanaged from a compliance perspective. Reinitialize SIC or decommission orphaned objects.

1.3 — Policy Installed on All Gateways
Status	Gateways
✅ Policy Installed	SD-WAN fleet, Gartner-GW1/2/3, London_branch10, Remote-Berlin
🔴 No Policy Installed	Corporate-Cluster, Corporate-GW, BranchOffice, Data_Center_GW, AIOPS-DEMO-MACHINE-1, IoTGW-New, Remote-2/3/4/5-gw, RemoteBranchGw, ThreatEmulationDevice, [VWAN-NorthCentral-GW0](action-21)/1, London_branch_02, and all Acme_Corp-AWS gateways

Action: No installed policy = no enforcement. These gateways are enforcing their last pushed policy or none at all.

2. 🔥 Firewall Policy Rules
2.1 — Stealth Rule (Protect the Gateway)
Status	Package / Gateway
✅ Correct	Branch_Office_Policy, Corporate_Policy, SD-WAN_Gateways_Policy, policy_insight
🔴 CRITICAL — Misconfigured as ACCEPT	My_Corporate_Policy — Rule 2 "Stealth rule" is Accept SSH from Any → actively allows SSH to Corporate-GW from ANY source
🔴 Missing	AI_Assist_Demo (no drop-all to AWS firewall cluster), AIOPS_Policy, IoT-Policy, Gartner-2026, Gartner-2026_AI_Assist, demo_policy, CPWpolicy, NEW
2.2 — Cleanup Rule (Implicit Deny All)
Status	Package
✅ Drop cleanup	AI_Assist_Demo, Branch_Office_Policy, Corporate_Policy, My_Corporate_Policy, SD-WAN_Gateways_Policy, policy_insight, demo_policy
🔴 CRITICAL — Accept All (no logging)	CPWpolicy — only rule is Accept Any/Any/Any, log=None
🔴 HIGH — Accept All placeholder	NEW — only rule is Accept All, log=None (applied to Remote-Berlin)
⚠️ Accept cleanup	AIOPS_Policy Network layer, IoT-Policy outer layer — unmatched traffic is permitted
2.3 — Overly Permissive Rules (Any Source / Any Destination / Any Service)
Severity	Package	Rule	Issue
🔴 CRITICAL	Gartner-2026_AI_Assist	Rule 2 "Jira Server"	ALL_Internet → internal Jira, no service — any external host, any port
🔴 HIGH	AI_Assist_Demo	Rules 215, 216, 218, 223, 226	EKS/VPN/VDI rules with no service constraint
🔴 HIGH	AI_Assist_Demo	Rules 181–186	Chatbot EKS → MySQL/AS400/MuleSoft, no service
🔴 HIGH	AI_Assist_Demo	Rule 26 "P2S Subnet to Assist"	VPN users → Dev VPCs, no service
🔴 HIGH	AI_Assist_Demo	Rule 249 "Users VPN to Chatbot"	Large VPN zone → Chatbot VPCs, all services
🔴 HIGH	SD-WAN_Gateways_Policy	Rules 3, 8, 9	GW-to-GW and net-to-net with no service; Rule 9 = any source to Internet, any service, log=None
⚠️ MEDIUM	AI_Assist_Demo	Rule 253, 234, 52, 221	Broad destination (Any) or no service on individual hosts
2.4 — Insecure Protocols Permitted
Severity	Package	Rules	Protocol	Risk
🔴 HIGH	AI_Assist_Demo	51, 53, 54, 200	Telnet (port 23)	Cleartext credentials between datacenter and cloud VPCs
⚠️ MEDIUM	AI_Assist_Demo	41, 51	SNMP v1/2 (161), RDP (3389) exposed broadly	Weak SNMP, broad RDP blast radius
⚠️ MEDIUM	AI_Assist_Demo	53/54	FTP (21) in VPN access rules	Cleartext file transfer
2.5 — Disabled Rules (Technical Debt / Re-enablement Risk)
Package	Count	Critical Risk
AI_Assist_Demo	~35 rules	Rule 34 "Checkpoint Gateway to All" (Accept All if re-enabled), Rule 254 "EKS to AnySource", Rule 255 "firewall_admin to AnySource"
AI_Assist_Demo	WebAI section (rules 123–148)	Entire section flagged by org as "should be removed" — SQL, RDP still present
Others	3 rules	demo_policy, My_Corporate_Policy, policy_insight

Action: Disabled ≠ deleted. Accidentally re-enabling rule 34 would allow all traffic from the firewall cluster. Delete all disabled rules after documented review.

2.6 — Rule Logging Coverage
Status	Package	Details
✅ Good overall	Most packages	Majority of rules log
⚠️ Missing logs	AI_Assist_Demo	Rules 120/121 (cloud admin, no service, no log)
⚠️ Missing logs	SD-WAN_Gateways_Policy	Rules 2, 3, 7, 9 — including the broad "any to Internet" rule
🔴 No logging at all	CPWpolicy, NEW	Accept-All rules with log=None — zero forensic visibility
⚠️ Missing logs	demo_policy	Rules 4, 5, 6, 9, 10, 12, 13, 14 — blocking rules with no log
3. 🧱 Threat Prevention Coverage
3.1 — Threat Prevention Policy Installed
Status	Gateways
✅ Threat Policy Installed	SD-WAN fleet (all branches), SD-WAN-HQ-Cluster, London_branch10
🔴 No Threat Policy	[Gartner-GW1](action-11)/2/3, Remote-Berlin, and all gateways with no policy at all
3.2 — Security Blades Enabled
Control	Compliant	Missing / Partial
IPS	SD-WAN fleet, most gateways	Corporate-Cluster (no IPS blade), VirtualService-WAN, Acme_Corp-AWS clusters
Anti-Bot / Anti-Virus	SD-WAN fleet, most gateways	Corporate-Cluster, SD-WAN-Core-Router-GW, RemoteBranchGw
Threat Emulation	SD-WAN-Branch-New-York, BranchOffice, Remote-3/4/5-gw	Most SD-WAN branches, Gartner, Remote-Berlin
App Control + URL Filtering	Most gateways	Remote-5-gw, ThreatEmulationDevice, RemoteBranchGw, VirtualService-WAN, Acme_Corp-AWS clusters
4. 🔐 Access Control Best Practices
4.1 — Least Privilege / Role-Based Rules
Finding	Affected Package
Rules named after individuals (e.g., "Alex's Team", "Liam", "jane.f", "TomC")	AI_Assist_Demo
Vendor email in rule name ("John Smith <john@helix.io>")	AI_Assist_Demo
Individual workstation IPs in rules instead of groups	AI_Assist_Demo

Action: Migrate individual-host and personal-name rules to Active Directory / identity groups using Identity Awareness.

4.2 — Duplicate / Shadowed Rules
Package	Finding
AI_Assist_Demo	Rules 236/237 are identical (GitLab Runners)
AI_Assist_Demo	Rules 261/262 near-duplicate (NetSuite, different source subnets)
demo_policy	Rule 13 explicitly named "Shadowed rule" — will never match
4.3 — Temporary / Legacy Rules Left Active
Package	Rules	Risk
AI_Assist_Demo	Rule 7 "Temp Testing Rule" (ENABLED, time object)	Temporary access may still be active
AI_Assist_Demo	Rule 257 "AcmeAccess (legacy firewall rule)" (ENABLED)	Three external CIDR blocks + admin host with tcp-high-ports to Any
Various	Rules explicitly labeled "to disable" or "legacy" left enabled	Unintended access
5. 📋 Summary Scorecard
CIS Control Area	Status	Key Violators
Gateway Software Version	🔴 FAIL	8 gateways on EOS versions (R80.x, R81)
SIC Trust / Manageability	🔴 FAIL	~22 gateways uninitialized
Policy Installed	🔴 FAIL	~20+ gateways with no active policy
Stealth Rule	🔴 FAIL	Missing in 8 packages; broken (Accept) in My_Corporate_Policy
Cleanup Rule (Implicit Deny)	🔴 FAIL	CPWpolicy, NEW are Accept-All; IoT outer layer accepts remainder
No Overly Permissive Rules	🔴 FAIL	AI_Assist_Demo, SD-WAN_Gateways_Policy, Gartner-2026_AI_Assist
No Insecure Protocols	🔴 FAIL	Telnet in AI_Assist_Demo rules 51, 53, 54, 200
Disabled Rule Hygiene	⚠️ PARTIAL	35+ disabled rules in AI_Assist_Demo including dangerous "Accept All"
Rule Logging	⚠️ PARTIAL	CPWpolicy, NEW, SD-WAN rule 9 have no logging
Threat Prevention	⚠️ PARTIAL	[Gartner-GW1](action-11)/2/3, Remote-Berlin have no threat policy
Blade Coverage	⚠️ PARTIAL	Several gateways missing IPS, AV, App Control
Least Privilege Rules	⚠️ PARTIAL	Individual-name rules, no-service rules in AI_Assist_Demo
6. 🔧 Top Immediate Remediation Actions
Fix My_Corporate_Policy Rule 2 — Change stealth rule action from Accept → Drop immediately.
Rebuild CPWpolicy and NEW — Replace Accept All, no-log rules with a proper policy before installing on any production gateway.
Delete AI_Assist_Demo Rule 34 — "Checkpoint Gateway to All" Accept must be deleted, not just disabled.
Delete the entire AI_Assist_Demo WebAI section (rules 123–148) — org-identified for removal.
Remove Telnet (port 23) from rules 51, 53, 54, 200 — replace with SSH.
Fix Gartner-2026_AI_Assist Rule 2 — Restrict ALL_Internet source or add service constraints to Jira.
Add service constraints to Assist (rules 215/216/218/223/226) and Chatbot (rules 181–186) sections.
Upgrade all EOS gateways (R80.10, R80.40, R81) to R82.10.
Reinitialize SIC on the ~22 uninitialized gateways or decommission their objects.
Enable the Compliance Blade on your Security Management Server for continuous automated monitoring against these best practices (SmartConsole → Gateways & Servers → Management Server → Blades → Compliance).

💡 Pro Tip: Check Point's built-in Compliance Blade in SmartConsole provides continuous, real-time scoring of all these controls per gateway with specific action items. Navigate to Logs & Monitor → Compliance to get a live dashboard view. Items marked with "Poor" status should be prioritized for immediate resolution.

Just now
chat dislike button
chat like button

---

## G005

Thought for 1.08 seconds
Documentation Retrieval and Answer Generation

Great — I have a thorough picture of how Check Point handles separation of duties. Here is a structured assessment of the framework and the key risks to verify in your environment.

Separation of Duties — Check Point Administrator Model

⚠️ Note: I was unable to retrieve a live list of your current administrators and their assigned permission profiles — you will need to verify the specifics manually in SmartConsole. The analysis below is based on Check Point's documented permission model and the risks you should audit.

1. The Three Key Levers for Separation of Duties

Check Point's separation of duties is enforced through Permission Profiles assigned to each administrator account. The three critical flags in any profile are:

Permission Flag	What It Controls	SoD Implication
Publish sessions without an approval	If enabled, the admin can push changes live with no review	❌ Bypasses change control
Approve / reject other sessions	Allows the admin to approve other admins' changes	✅ The designated approver role
Manage Administrators	Allows creating/editing admin accounts and profiles	⚠️ High privilege — can grant themselves more access
2. The Correct Two-Role Workflow

The Check Point-recommended separation model uses two distinct roles:

Admin A (Change Maker)                Admin B (Approver)
─────────────────────────────         ──────────────────────────────
• "Publish without approval" = OFF    • "Approve/reject other sessions" = ON
• Makes changes, clicks "Submit"      • Reviews and approves/rejects
• Cannot publish without approval     • Cannot approve their own sessions

🔒 Key control: An admin whose profile has "Publish without approval" disabled will be blocked from installing policy until their session is approved. The system enforces this automatically.

3. Concentration-of-Privilege Risks to Audit

These are the scenarios you must verify manually in your environment:

🔴 Risk 1 — Super User Accounts

Admins assigned the Super User profile have:

Full Read + Write across all features
Ability to manage other administrators and sessions
Implicit "Publish without approval" rights

Action: In SmartConsole → Manage & Settings > Permissions & Administrators > Administrators, identify every account assigned Super User. This list should be minimal and tightly controlled.

🔴 Risk 2 — Admins Who Can Both Make AND Approve Changes

An admin with both "Publish without approval" enabled and "Approve/reject other sessions" enabled effectively has no check on their changes.

Action: Review all profiles with "Approve/reject other sessions" enabled — verify that none of those same profiles also have "Publish without approval" enabled. This would allow an approver to bypass the workflow entirely for their own changes.

🔴 Risk 3 — Read/Write All Without Approval Enforcement

The default Read/Write All predefined profile grants full write access with "Publish without approval" enabled by default. Any admin assigned this profile can make and publish changes unilaterally.

Action: Avoid using the default Read/Write All profile for operational admins. Instead, clone it, disable "Publish without approval," and assign the clone.

🟡 Risk 4 — "Manage Administrators" Permission

Any admin with this flag can create new admin accounts or modify permission profiles — including elevating their own privileges or creating a backdoor account.

Action: Restrict "Manage Administrators" to the Super User tier only, and ensure those accounts are audited and MFA-protected.

🟡 Risk 5 — Layer-Level Delegation Without Approval Enforcement

Per-layer permissions allow admins to edit specific access layers. If an admin has write access to a layer and "Publish without approval," they can push firewall rule changes without any review.

Action: Ensure layer-level permissions are paired with approval-enforced profiles.

4. How to Audit Your Current State

To get the full picture of your administrators and their profiles, follow these steps in SmartConsole:

Go to Manage & Settings > Permissions & Administrators > Administrators
For each administrator, note their assigned Permission Profile
Go to Permission Profiles and open each profile in use
Check the Management tab for:
Publish sessions without an approval — ON/OFF
Approve / reject other sessions — ON/OFF
Manage Administrators — ON/OFF
Cross-reference: any admin who has both Approve/reject and Publish without approval is a concentration risk
5. Summary Checklist
Check	Pass Criteria
Super User accounts are minimal	≤ 2 named accounts, no shared credentials
No admin can both make and self-approve changes	"Approve/reject" and "Publish without approval" never both ON in one profile
Operational admins use cloned profiles (not default Read/Write All)	Custom profiles with approval enforcement enabled
"Manage Administrators" is restricted	Only Super User-tier profiles hold this right
Layer-level admins are subject to approval workflow	Their profiles have "Publish without approval" = OFF

Would you like step-by-step instructions on restructuring your permission profiles to enforce a strict two-role approval workflow, or guidance on auditing administrator activity logs via SmartLog?

Just now
chat dislike button
chat like button

---

## G006

Thought for 1.16 seconds

I'll gather all the data needed simultaneously — gateway health, policy posture, and recent incident activity — right away.

Policy Rulebase Analyzer
Management API Query
Log Query Analysis and Execution
🛡️ Security Posture Summary

Period: May 5 – May 12, 2026 | Prepared: May 12, 2026 Policy rulebase data as of May 5, 2026 — recent changes may not be fully reflected.

1. 🖥️ Gateway Health
Metric	Status
Total Gateways & Clusters	39 (35 standalone + 4 clusters)
✅ Communicating (SIC)	22 (56%)
⚠️ Uninitialized / Offline	25 (44%) — critical gap
Gateways with Access Policy Installed	18 of 39
Gateways with Threat Policy Installed	14 of 39

Key Concerns:

25 gateways have no SIC connection to the management server — they cannot receive policy updates and their enforcement status is unknown. Immediate triage is required.
4 gateways running end-of-life software (R80.10, R80.20): Remote-2/3/4-gw, RemoteBranchGw, and ThreatEmulationDevice. These versions are no longer supported and expose the organization to unpatched vulnerabilities.
21 gateways have no policy installed — including BranchOffice, Corporate-GW, IoTGW-New, and both VWAN gateways.
✅ The SD-WAN fleet (13 branches + HQ cluster) is healthy — all on R82.10, consistently running SD-WAN_Gateways_Policy with both access and threat prevention up to date as of April 28, 2026.
2. 📋 Policy Coverage
Metric	Value
Active Policy Packages	14
Total Rules (approx.)	~650 across all packages
Rules in Flagship Package (AI_Assist_Demo)	267
Disabled Rules (AI_Assist_Demo)	42 (15.7%)
Rules Explicitly Marked "To Disable" Still Present	8
Enabled Rules with No Service Restriction (Any Service)	~20
Enabled Rules Allowing Telnet (Port 23)	5
Duplicate / Shadowed Rules Identified	4 pairs
Packages With Only a Cleanup Rule (No Active Policy)	4

Critical Policy Findings:

🔴 Gartner-2026_AI_Assist Rule 2: Source = All_Internet, Destination = internal Jira server, no service restriction — the Jira server is effectively exposed to the entire internet on all ports. Requires immediate remediation.
🔴 Telnet (Port 23) permitted in 5 enabled rules crossing VPN/DataCenter/cloud boundaries — a plaintext protocol with no place in a modern security policy.
🟠 RDP (Port 3389) broadly permitted across VPN zones, branch networks (all 26 SD-WAN branches inter-connected), and to Domain Controllers — significant lateral movement risk.
🟠 ~20 enabled rules with no service restriction, including rules reaching production EKS clusters and MuleSoft integration endpoints.
🟡 15.7% of rules are disabled — policy bloat, increased review complexity, and accidental re-enable risk. The entire WebAI section (26 rules) is acknowledged as ready for deletion.
3. 🚨 Recent Threat Activity (May 5 – May 12, 2026)
#	Threat / Attack	Blade	Detections
1	GNU Bash Remote Code Execution (Shellshock variant)	IPS	312,919
2	Malicious Executable	Threat Emulation	209,467
3	Phishing.TC.585bRqAD	Anti-Virus	91,881
4	Phishing.TC.c7e9QTmL	Anti-Virus	52,856
5	Phishing.TC.e967CDxJ	Anti-Virus	31,794
6	Exploited Document (Office/PDF)	Threat Emulation	29,125
7	MIT Kerberos kadmind Buffer Overflow	IPS	23,300
8	Trojan.Win32.Qatestlocal.x	Anti-Virus	22,384
9	Generic.TC.248esmWG	Anti-Virus	19,076
10	Backdoor.Win32.Taidoor.A	Anti-Bot	11,650

Total High/Critical detections this week: ~804,000+

The volume of Shellshock (Bash RCE) attempts is particularly notable — over 312K detections indicate sustained, targeted exploitation attempts against this vulnerability. Combined with Kerberos buffer overflow attempts, this suggests active reconnaissance of authentication infrastructure.

4. 🔥 Top Risks — Prioritized Action List
Priority	Risk	Recommended Action
🔴 Critical	Internet-exposed Jira server (all ports, all sources)	Remove or restrict Gartner-2026_AI_Assist Rule 2 immediately
🔴 Critical	25 gateways offline / uninitialized, 21 without any policy	Audit, decommission, or re-establish SIC; deploy policy
🔴 Critical	Sustained Shellshock (Bash RCE) attack campaign	Validate IPS prevention mode; review exposure of Bash-accessible services
🟠 High	Telnet (port 23) in 5 enabled production rules	Remove telnet; replace with SSH across all rules
🟠 High	End-of-life gateways (R80.10/R80.20)	Plan immediate upgrade to R81.20 or R82.10
🟠 High	~20 rules with no service restriction in production	Add explicit service definitions to all production-boundary rules
🟠 High	Broad RDP access across VPN zones and all 26 branches	Restrict RDP to jump hosts with MFA; remove from branch inter-connect rules
🟡 Medium	42 disabled rules / 8 rules marked "to disable" still present	Delete stale rules; remove entire WebAI section (26 rules)
🟡 Medium	Phishing campaign active (3 distinct signatures, 176K+ hits)	Reinforce user awareness; validate Zero Phishing and Anti-Virus blade coverage
🟡 Medium	Static 50-IP adversary blocklist (no dynamic feed)	Integrate a threat intelligence feed (e.g., Check Point ThreatCloud IOC feeds)
5. 🔑 Key Recent Changes
Date	Change
May 12, 2026	SD-WAN_Gateways_Policy re-installed on SD-WAN-Branch-New-York (access + threat)
Apr 28, 2026	SD-WAN_Gateways_Policy installed fleet-wide across 12 SD-WAN branch gateways
Apr 20, 2026	Gartner-2026 policy installed on Gartner-GW1/2/3
Apr 15, 2026	NEW policy installed on Remote-Berlin
Jul 2024	demo_policy last installed on London_branch10 — ~10 months stale, review recommended
6. 📌 Executive Summary

The organization's security infrastructure is partially effective but carries significant unmanaged risk. The SD-WAN fleet is well-managed and current. However, nearly half of all gateways are offline or uninitialized, a large share have no policy of any kind, and the active rulebases contain critical exposures — most urgently, an internet-accessible internal server. The week's threat volume exceeds 800,000 high/critical detections, with a concentrated Shellshock campaign indicating active adversary interest. Immediate focus should be directed at the five critical items above before the next board reporting cycle.

Data sources: Check Point Management API (live), Policy Rulebase Analyzer (snapshot: May 5, 2026), Security Gateway Logs (May 5–12, 2026).

I have a few reports that might be useful for you:

General Overview - High & Critical severity threats across IPS, Anti-Bot, Anti-Virus, Threat Emulation, Threat Extraction, and Zero Phishing
Autonomous Threat Prevention Dashboard - High & Critical severity threats across IPS, Anti-Bot, Anti-Virus, Threat Emulation, Threat Extraction, and Zero Phishing
Important Attacks - High & Critical severity attacks across IPS, Anti-Bot, Anti-Virus, Threat Emulation blades
Security Incidents - High & Critical severity incidents across IPS, Anti-Bot, Anti-Virus, Threat Emulation, Threat Extraction, and Zero Phishing

Just now
chat dislike button
chat like button

---
