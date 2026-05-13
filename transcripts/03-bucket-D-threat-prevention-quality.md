# Bucket D — Threat Prevention Quality

6 questions covering IPS coverage, detect-mode protections, TP parity, TE deployment, ThreatCloud freshness, and an investigation question.

See final report Section 4 for per-bucket findings and scores.

---


## D001

Thought for 1.8 seconds

I'll pull gateway details and IPS/threat prevention configuration simultaneously to give you a full audit picture.

Management API Query

Now let me fetch the actual IPS/threat prevention rulebase and profile details to assess detect-only vs. prevent postures.

Management API Query
Loading management API tools...
✓ Loaded 27 tools
Processing query...
Calling "management__show_objects"...
Calling "show_ips_status"...
Calling "show_threat_protections"...
Calling "management__show_gateways_and_servers"...
✓ Query completed. Used 4 tool(s).
Management API Query

Here is your comprehensive IPS audit. The findings are organized by risk severity.

🛡️ IPS Profile Coverage Audit — All Gateways

IPS Database: Version 635263157 — up to date as of 2026-05-12 17:37 UTC | 17,807 total protections

1. 🔴 Critical — IPS Blade Disabled (No IPS Protection At All)

These gateways have zero IPS enforcement, regardless of any profile:

Gateway	Version	Role/Context	Concern
Gartner-GW1/2/3	R82.10	Access policy installed, communicating	Active gateways with no IPS
Corporate-Cluster	R80.40	Identity Awareness enabled	Core cluster, unprotected
SD-WAN-Core-Router-GW	R81.10	SD-WAN core, access policy installed	Hub role, no IPS
Acme_Corp-AWS-Firewall-AIFWDemo	R82.10	Cloud cluster	Cloud perimeter, no IPS
Acme_Corp-AWS-Site01-Firewall-AIFWDemo	R82.10	Cloud cluster	Cloud perimeter, no IPS
Remote-5-gw	R81	AV + TE enabled	Has AV/TE but no IPS
ThreatEmulationDevice	R80.20	TE only	Sandboxing only, no IPS
VirtualService-WAN-AIFWDemo	R82.10	WAN virtual service	No threat prevention

Recommendation: Enable the IPS blade and assign a threat policy on the Gartner GWs, Corporate-Cluster, and SD-WAN-Core-Router-GW as a priority — they are active, communicating gateways.

2. 🟠 High — IPS Blade On, But No Threat Policy Installed

These gateways have the IPS blade enabled in their configuration, but no threat policy has been pushed — meaning IPS is not actually enforcing any protections at runtime:

Gateway	Version	SIC	Notable Role
Data_Center_GW	R81.20	✅ Communicating	Data center — highest priority
IoTGW-New	R81.20	✅ Communicating	IoT traffic — high-risk environment
London_branch_02	R81.20	✅ Communicating	Branch office
Remote-Berlin	R82.10	✅ Communicating	Branch, access policy installed
AIOPS-DEMO-MACHINE-1	R81.20	✅ Communicating	Demo/lab
VWAN-NorthCentral--GW0/1	R81.20	❌ Uninitialized	Virtual WAN
BranchOffice, Corporate-GW	R82.10 / R80.40	❌ Uninitialized	Likely legacy/undeployed
Remote-2/3/4-gw, RemoteBranchGw	R80.10	❌ Uninitialized	Old versions, likely decommissioned

Recommendation: For Data_Center_GW and IoTGW-New especially — install a threat policy immediately. These are high-value targets. Consider the Strict profile for the data center.

3. 🟡 Medium — IPS Active but with Permissive or Degraded Profile Posture
Profile Breakdown
Profile	Used By	Low Confidence	Medium Confidence	High Confidence	New Protections
Basic	(not currently deployed in any rule)	❌ Inactive	❌ Inactive	🛑 Prevent	Active
Optimized	SD-WAN fleet (15 GWs) + London_branch10	👁️ Detect only	🛑 Prevent	🛑 Prevent	Active
Strict	(not currently deployed in any rule)	👁️ Detect only	🛑 Prevent	🛑 Prevent	Active
Threat Profile 1	(not deployed in current rules)	👁️ Detect	🛑 Prevent	🛑 Prevent	⚠️ Staging
Threat Profile 2	(not deployed in current rules)	👁️ Detect	🛑 Prevent	🛑 Prevent	⚠️ Staging
Specific Posture Issues

All 16 active IPS gateways use the Optimized profile — Low-confidence protections are detect-only, meaning some threats will be logged but not blocked. For high-value targets like SD-WAN-HQ-Cluster, consider upgrading to Strict.

Threat Profile 1 & Threat Profile 2 have 50 protections each manually overridden to Detect, including critical CVEs that should be in Prevent:

🔴 CVE-2024-43468 — Microsoft ConfigMgr RCE
🔴 CVE-2021-40539 — ZohoCorp ADSelfService Auth Bypass
🔴 CVE-2022-46169 — Cacti Command Injection
🔴 CVE-2024-27348 — Apache HugeGraph RCE
🔴 CVE-2025-59718 — Fortinet Auth Bypass
🔴 CVE-2025-53772 — Microsoft Web Deploy Deserialization RCE
…and 44+ more high-severity protections
⚠️ New protections set to Staging — zero-day signatures won't auto-activate

The shared IPS layer is completely empty — no rules are defined in it at all. Both packages rely entirely on their package-specific threat layer.

4. 📊 Executive Summary
Status	Gateways	Count
✅ IPS Active + Policy Installed	SD-WAN fleet + London_branch10	16
⚠️ IPS Enabled, No Policy Pushed	Data_Center_GW, IoTGW-New, London_branch_02, Remote-Berlin + 9 others	13
❌ IPS Blade Disabled	Gartner-GW1/2/3, Corporate-Cluster, SD-WAN-Core-Router-GW + 5 others	10
5. 🎯 Prioritized Remediation Actions
[Critical] Enable IPS blade + push a threat policy on Gartner-GW1/2/3 and Corporate-Cluster — they are active, communicating gateways with access policies but zero IPS coverage.
[Critical] Push a threat policy to Data_Center_GW and IoTGW-New immediately — blade is enabled but no policy is enforced.
[High] Enable IPS on SD-WAN-Core-Router-GW — it sits at the core of the SD-WAN topology and is completely unprotected from network-layer exploits.
[High] Review the 50 Detect overrides in Threat Profile 1 and Threat Profile 2 — several are high-severity RCE/Auth Bypass CVEs that should be set to Prevent.
[Medium] Change Newly Updated Protections from Staging → Active in Profiles 1 & 2 to ensure zero-day coverage.
[Medium] Consider upgrading SD-WAN-HQ-Cluster and any data center gateway from Optimized → Strict for maximum coverage.
[Low] Audit and decommission legacy R80.10 gateways (Remote-2/3/4-gw, RemoteBranchGw) with uninitialized SIC — they represent unmanaged risk.
Just now
chat dislike button
chat like button

---

## D002

Thought for 0.04 seconds
Management API Query

Here is a comprehensive breakdown of IPS protections in Detect mode that should be in Prevent, focused on Critical and High severity findings:

🔍 How IPS Actions Are Determined

In Check Point, a protection's effective action is driven by the Threat Prevention Profile applied to gateways — not a single global setting. Two factors determine the effective action:

Profile confidence-level thresholds (Low / Medium / High confidence → action)
Per-protection manual overrides in the profile
📊 Profile Analysis
Profile	Low Confidence	Medium Confidence	High Confidence	IPS Enabled
Basic	Inactive	Inactive	Prevent	✅
Optimized	Detect	Prevent	Prevent	✅
Strict	Detect	Prevent	Prevent	✅
Threat Profile 1	Detect	Prevent	Prevent	✅
Threat Profile 2	Detect	Prevent	Prevent	✅

⚠️ The Basic profile leaves all Low & Medium confidence protections Inactive — including Critical/High severity ones.

🚨 Critical Severity — Overridden to Detect

These protections were manually overridden to Detect in Threat Profile 1 or 2, meaning they bypass the profile's default Prevent behavior:

Protection	CVE(s)	Affected Profile(s)
Microsoft Config Manager RCE	CVE-2024-43468	Threat Profile 1
ZohoCorp ManageEngine ADSelfService Plus Auth Bypass	CVE-2021-40539	Threat Profile 1
CyberPanel Command Injection	CVE-2024-53376	Threat Profile 1 & 2
Cacti Command Injection	CVE-2022-46169	Threat Profile 2
Apache HugeGraph RCE	CVE-2024-27348	Threat Profile 2
vBulletin RCE	CVE-2025-48827, CVE-2025-48828	Threat Profile 2
Fortinet Multiple Products Auth Bypass	CVE-2025-59718	Threat Profile 2
Fortinet FortiClientEMS SQL Injection	CVE-2025-59922	Threat Profile 2
HTTP Headers RCE	CVE-2021-42071, CVE-2022-4221, + others	Threat Profile 2
Redis Auth Bypass Remote Command Execution	—	Threat Profile 2
Cisco Catalyst SD-WAN Auth Bypass	CVE-2026-20127	Threat Profile 1
FlowiseAI Flowise Auth Bypass	CVE-2026-30824	Threat Profile 1
Flowise RCE	CVE-2025-34267	Threat Profile 2
Flowise Arbitrary File Upload	CVE-2025-61687	Threat Profile 2
🟠 High Severity — Overridden to Detect (Notable Examples)
Protection	CVE(s)	Affected Profile(s)
ISC BIND Denial of Service	CVE-2024-12705	Threat Profile 1 & 2
Microsoft Exchange Server RCE	CVE-2023-21707	Threat Profile 1
Microsoft Visual Studio Code RCE	CVE-2022-41034	Threat Profile 2
Microsoft Web Deploy Insecure Deserialization	CVE-2025-53772	Threat Profile 2
Ivanti Endpoint Manager Mobile Command Injection	CVE-2025-10985	Threat Profile 2
Google Chrome Type Confusion	CVE-2024-2887	Threat Profile 1
Google Chrome Information Disclosure	CVE-2025-4664	Threat Profile 2
LightningAI PyTorch Lightning RCE	CVE-2024-5452	Threat Profile 1
GLPI SQL Injection	CVE-2023-41320, CVE-2024-29889	Threat Profile 1 & 2
GLPI Privilege Escalation	CVE-2023-41326	Threat Profile 1
DrayTek Vigor Buffer Overflow	CVE-2020-14473	Threat Profile 2
Gradio Server-Side Request Forgery	CVE-2024-4325	Threat Profile 1
✅ Recommendations
Prioritize Critical RCE and Auth Bypass overrides — these represent the highest risk and should be promoted to Prevent immediately (e.g., CyberPanel, Fortinet, Apache HugeGraph).
Review all manual overrides in Threat Profile 1 and Threat Profile 2 — focus on overrides that were added without documented justification.
Upgrade gateways using the Basic profile — consider moving to Optimized or Strict to activate broader coverage for Low/Medium confidence protections.
For any protection where you're uncertain about false-positive impact, follow a staged approach: validate in a test/staging environment before switching to Prevent in production.
Use SmartConsole → Threat Prevention → Profiles to manage overrides directly and document the business justification for any retained Detect overrides.
Just now
chat dislike button
chat like button

---

## D003

Thought for 1.47 seconds

I'll pull gateway information and the Threat Prevention rulebase simultaneously to cross-reference TP profiles per gateway.

Management API Query
Management API Query

Here is a complete parity-drift analysis across all gateways with Threat Prevention policies installed.

🛡️ Threat Prevention Parity Drift Analysis

Data as of: 2026-05-12 22:13 UTC (live query)

1. Gateway → TP Policy Mapping
Gateway	Type	Role / Group	TP Policy	Default Profile
SD-WAN-HQ-Cluster	Cluster	SD-WAN HQ	SD-WAN_Gateways_Policy	Optimized
SD-WAN-Branch-Australia	Simple GW	SD-WAN Branch	SD-WAN_Gateways_Policy	Optimized
SD-WAN-Branch-Bulgaria	Simple GW	SD-WAN Branch	SD-WAN_Gateways_Policy	Optimized
SD-WAN-Branch-California	Simple GW	SD-WAN Branch	SD-WAN_Gateways_Policy	Optimized
SD-WAN-Branch-Colorado	Simple GW	SD-WAN Branch	SD-WAN_Gateways_Policy	Optimized
SD-WAN-Branch-Florida	Simple GW	SD-WAN Branch	SD-WAN_Gateways_Policy	Optimized
SD-WAN-Branch-Germany	Simple GW	SD-WAN Branch	SD-WAN_Gateways_Policy	Optimized
SD-WAN-Branch-Greece	Simple GW	SD-WAN Branch	SD-WAN_Gateways_Policy	Optimized
SD-WAN-Branch-Hungary	Simple GW	SD-WAN Branch	SD-WAN_Gateways_Policy	Optimized
SD-WAN-Branch-Israel	Simple GW	SD-WAN Branch	SD-WAN_Gateways_Policy	Optimized
SD-WAN-Branch-Italy	Simple GW	SD-WAN Branch	SD-WAN_Gateways_Policy	Optimized
SD-WAN-Branch-New-York	Simple GW	SD-WAN Branch	SD-WAN_Gateways_Policy	Optimized
SD-WAN-Branch-NewJersey	Simple GW	SD-WAN Branch	SD-WAN_Gateways_Policy	Optimized
SD-WAN-Branch-Paris	Simple GW	SD-WAN Branch	SD-WAN_Gateways_Policy	Optimized
SD-WAN-Branch-UK	Simple GW	SD-WAN Branch	SD-WAN_Gateways_Policy	Optimized
Gartner-GW1	Simple GW	Gartner	Gartner-2026 (Access only — no TP!)	❌ None
Gartner-GW2	Simple GW	Gartner	Gartner-2026 (Access only — no TP!)	❌ None
Gartner-GW3	Simple GW	Gartner	Gartner-2026 (Access only — no TP!)	❌ None
London_branch10	Simple GW	London Branch	demo_policy	Optimized
Remote-Berlin	Simple GW	Remote	NEW (Access only — no TP!)	❌ None
SD-WAN-Core-Router-GW	Simple GW	SD-WAN Core	SD-WAN_Gateways_Policy (Access only — no TP!)	❌ None
2. 🚨 Parity Drift Findings
Drift #1 — SD-WAN HQ Cluster vs. Branch Gateways (Profile Depth Mismatch)
Gateway	Role	TP Profile	Anti-Bot	IPS Depth
SD-WAN-HQ-Cluster	HQ / Core	Optimized	✅ Enabled	Medium severity+
SD-WAN-Branch-* (×14)	Branch	Optimized	✅ Enabled	Medium severity+

✅ All SD-WAN gateways share the same SD-WAN_Gateways_Policy and use Optimized — no profile drift here. However:

⚠️ Logging gap: SD-WAN_Gateways_Policy Rule 2 (catch-all) has Track = None. General TP events on ALL 15 SD-WAN gateways (HQ + branches) are not logged. This is a visibility gap that applies uniformly, but it still represents a significant operational risk.

Drift #2 — Gartner Gateways: Same-Role, No TP Installed 🔴
Gateway	Role	TP Policy	TP Profile
Gartner-GW1	Gartner	Gartner-2026	❌ Access policy only — no Threat Prevention
Gartner-GW2	Gartner	Gartner-2026	❌ Access policy only — no Threat Prevention
Gartner-GW3	Gartner	Gartner-2026	❌ Access policy only — no Threat Prevention

🔴 Critical drift: Three same-role gateways share an identical access policy but have zero Threat Prevention coverage. There is no TP layer attached to Gartner-2026. IPS, Anti-Virus, Anti-Bot, Threat Emulation, and Threat Extraction are all uninspected on these gateways.

Drift #3 — London Branch vs. All Other Branch Gateways 🟠
Gateway	Role	TP Policy	Profile
London_branch10	Branch	demo_policy	Optimized
London_branch_02	Branch	No policy installed	❌ None
SD-WAN-Branch-* (×14)	Branch	SD-WAN_Gateways_Policy	Optimized

🟠 Drift: London_branch10 is on a different TP policy (demo_policy) than the rest of the branch estate (SD-WAN_Gateways_Policy). While both use Optimized, the rule structure differs — demo_policy has only 2 rules vs. the SD-WAN policy's more tailored ruleset. London_branch_02 has no policy at all.

Drift #4 — Remote-Berlin: No TP Coverage 🟠
Gateway	Role	TP Policy	Profile
Remote-Berlin	Remote	NEW	❌ Access only — no Threat Prevention

🟠 No TP installed on this remote gateway, while other remote gateways such as London_branch10 do have TP. Inconsistent coverage across the remote branch estate.

Drift #5 — SD-WAN-Core-Router-GW: Access Only (No TP) 🟡
Gateway	Role	TP Policy	Profile
SD-WAN-Core-Router-GW	SD-WAN Core	SD-WAN_Gateways_Policy	❌ Access only — no TP blade

🟡 The core router is on the same policy package as all SD-WAN branches but has no TP layer installed, while all 14 branches and the HQ cluster do. This is likely intentional for a core routing function, but worth validating.

3. 📊 Summary Dashboard
Finding	Severity	Gateways Affected
Gartner GWs — no TP at all	🔴 Critical	GW1, GW2, GW3
SD-WAN policy — no TP logging	🟠 High	HQ-Cluster + 14 branches
London_branch_02 — no policy at all	🟠 High	London_branch_02
London_branch10 — isolated on demo_policy	🟡 Medium	London_branch10
Remote-Berlin — no TP	🟡 Medium	Remote-Berlin
SD-WAN-Core-Router-GW — no TP layer	🟡 Medium	SD-WAN-Core-Router-GW
4. Recommended Remediation Actions
Gartner-GW1/2/3: Attach a Threat Prevention layer to the Gartner-2026 package (at minimum Optimized profile) and install the policy.
SD-WAN_Gateways_Policy Rule 2: Change Track from None → Log to restore visibility across all 15 SD-WAN gateways.
London_branch10: Evaluate migrating to SD-WAN_Gateways_Policy to consolidate branch TP policy management, or ensure demo_policy is intentionally maintained separately.
London_branch_02: Assign and install an appropriate policy package with TP coverage.
Remote-Berlin: Validate whether NEW policy should include a TP layer; if so, attach one and install.
SD-WAN-Core-Router-GW: Confirm by design that no TP is required for this core routing role, and document the exception.
Just now
chat dislike button
chat like button

---

## D004

Thought for 0.78 seconds

I'll pull the full list of gateways and servers from your management environment right away!

Management API Query

Here is a consolidated view of all gateways without Threat Emulation (TE) enabled, grouped by role, with a risk assessment for each:

🚨 Gateways Without Threat Emulation — Risk Assessment

Note: Rulebase snapshot data is from 2026-05-05. Gateway blade status above is live data as of 2026-05-12.

1. 🌐 Gartner Gateways (Active Policy)
Gateway	IP	Policy Installed	Other Blades
Gartner-GW1	192.168.35.61	✅ Gartner-2026	FW, AC, UF, VPN
Gartner-GW2	192.168.35.62	✅ Gartner-2026	FW, AC, UF, VPN
Gartner-GW3	192.168.35.63	✅ Gartner-2026	FW, AC, UF, VPN

🔴 Risk: HIGH These are actively enforcing a policy but lack TE, IPS, Anti-Bot, and Anti-Virus entirely. Only application/URL filtering is active. They are fully blind to zero-day malware, APTs, and malicious files crossing through them. Any evasive file-based threat (phishing attachments, drive-by downloads) will pass uninspected.

2. 🏢 Corporate Cluster (HQ / Core)
Gateway	IP	Policy Installed	Other Blades
Corporate-Cluster	17.23.5.1	❌ None	FW, IA

🔴 Risk: HIGH This is a corporate HQ cluster running only Firewall and Identity Awareness — no threat prevention whatsoever. If this cluster protects internal network segments or a DMZ, it provides zero protection against sophisticated file-based attacks or lateral movement through malicious content.

3. 🌍 Remote-Berlin (Active Policy)
Gateway	IP	Policy Installed	Other Blades
Remote-Berlin	100.100.51.80	✅ NEW	FW, IPS, AB, AV

🟠 Risk: MEDIUM-HIGH Has IPS, Anti-Bot, and Anti-Virus, which provides a solid baseline. However, without TE, unknown and zero-day malware in files will not be sandboxed. AV relies on known signatures, leaving a gap against novel, evasive, or targeted file-based threats arriving at this branch.

4. 🏭 London Branch 10 (Active Policy)
Gateway	IP	Policy Installed	Other Blades
London_branch10	100.100.19.253	✅ demo_policy (Access + Threat)	FW, AC, UF, IPS, AB, AV, IA, CA

🟠 Risk: MEDIUM Well-protected with a comprehensive blade stack including IPS, Anti-Bot, and AV. The only gap is zero-day/unknown file sandboxing that TE provides. The risk is moderate since other prevention layers are active — however, targeted file-based attacks designed to evade signatures remain a concern.

5. 🏭 London Branch 02 (No Policy)
Gateway	IP	Policy Installed	Other Blades
London_branch_02	100.100.44.120	❌ None	FW, AC, UF, IPS, AB, AV

🟠 Risk: MEDIUM-HIGH Has a reasonable blade set, but no policy is currently installed. This means the gateway is only running default enforcement. Combined with the lack of TE, it is unprotected against unknown threats. Policy installation should be prioritized as well.

6. 📡 SD-WAN Branches (14 Gateways, Active Policy)
Group	Branches	Policy Installed	Other Blades
14 SD-WAN Branches	Australia, Bulgaria, California, Colorado, Florida, Germany, Greece, Hungary, Israel, Italy, NewJersey, Paris, UK + HQ Cluster	✅ SD-WAN_Gateways_Policy	FW, AC, UF, IPS, AB, AV, IA, VPN

🟠 Risk: MEDIUM These branches benefit from IPS, Anti-Bot, AV, and URL/App filtering. However, none have TE or Threat Extraction (TX), meaning zero-day malware in files traversing VPN tunnels or branch internet breakouts goes uninspected. This is particularly notable since SD-WAN branches are common targets for supply chain and phishing-based attacks. Note that SD-WAN-Branch-New-York is the sole exception — it already has TE + TX enabled and serves as a good benchmark.

7. 🔌 RemoteBranchGw / Remote-2-gw (Uninitialized, Minimal Blades)
Gateway	IP	SIC	Blades
RemoteBranchGw	198.51.100.120	❌ Uninitialized	FW only
Remote-2-gw	192.0.23.1	❌ Uninitialized	FW, AC, UF, IPS, AB, AV

🟡 Risk: LOWER (Currently Inactive) Both are uninitialized and have no policy installed, so they are not actively passing traffic. However, once commissioned, they represent significant gaps — especially RemoteBranchGw which has only a Firewall blade.

8. ☁️ Acme AWS Clusters & VirtualService-WAN (Uninitialized)
Gateway	Policy	Blades
Acme_Corp-AWS-Firewall-AIFWDemo	❌ None	FW only
Acme_Corp-AWS-Site01-Firewall-AIFWDemo	❌ None	FW only
VirtualService-WAN-AIFWDemo	❌ None	FW only

🟡 Risk: LOWER (Currently Inactive) These appear to be demo/lab or pre-production AWS environments with only the Firewall blade and no SIC established. Risk is lower while inactive, but enabling TE should be planned before production deployment in cloud environments — cloud workloads are increasingly targeted by sophisticated actors.

📋 Summary Table
Risk Level	Gateways
🔴 HIGH	Gartner-GW1/2/3, Corporate-Cluster
🟠 MEDIUM-HIGH	Remote-Berlin, London_branch_02
🟠 MEDIUM	London_branch10, All 14 SD-WAN Branches + HQ Cluster
🟡 LOWER (Inactive)	RemoteBranchGw, Remote-2-gw, Acme AWS clusters, VirtualService-WAN
💡 Recommendations
Prioritize the Gartner gateways and Corporate-Cluster — they are actively enforcing policies but have the most critical TE (and broader threat prevention) gaps.
Roll out TE to SD-WAN branches using SD-WAN-Branch-New-York as the reference configuration — it already has TE + TX and shares the same policy package.
Consider the dedicated ThreatEmulationDevice appliance (192.0.111.13) — it can offload sandboxing for gateways where local TE is not feasible due to hardware constraints.
Install policy on London_branch_02 as an immediate action, independently of the TE gap.
For AWS/cloud gateways, plan TE enablement before going into production.
Just now
chat dislike button
chat like button

---

## D005

Thought for 1.32 seconds

I'll query both the gateway list and IPS update status simultaneously to get a complete picture.

Management API Query
Management API Query

Here is the full ThreatCloud signature freshness report as of 2026-05-12 22:19 UTC:

🛡️ ThreatCloud Signature Freshness — Full Report
📡 Management Server Signature Database
Field	Value
Installed Version	635263157
Version Created	2026-05-12 13:00 UTC
Last Updated	2026-05-12 17:37 UTC
Signature Age	~4.6 hours
Update Available	✅ None — signatures are current

The management server itself is fully up to date with ThreatCloud.

🔴 Stale Gateways (Immediate Attention Required)
Gateway	Threat Policy	Last Policy Install	Age	Issue
London_branch10	demo_policy	2024-07-10 14:00 UTC	~22 months	Severely outdated threat policy

This gateway has an active Threat Prevention policy but it hasn't been reinstalled since July 2024, meaning it may not be enforcing the latest IPS signature set distributed by the management server.

⚠️ Active Gateways with Threat Policy — Policy Last Installed
Gateway	Version	Threat Policy	Last Policy Install	Age
SD-WAN-Branch-New-York	R82.10	SD-WAN_Gateways_Policy	2026-05-12 06:44 UTC	~15 hrs ✅
SD-WAN-Branch-Australia	R82.10	SD-WAN_Gateways_Policy	2026-04-28 12:24 UTC	~14 days ✅
SD-WAN-Branch-Bulgaria	R82.10	SD-WAN_Gateways_Policy	2026-04-28 12:24 UTC	~14 days ✅
SD-WAN-Branch-California	R82.10	SD-WAN_Gateways_Policy	2026-04-28 12:24 UTC	~14 days ✅
SD-WAN-Branch-Colorado	R82.10	SD-WAN_Gateways_Policy	2026-04-28 12:24 UTC	~14 days ✅
SD-WAN-Branch-Florida	R82.10	SD-WAN_Gateways_Policy	2026-04-28 12:24 UTC	~14 days ✅
SD-WAN-Branch-Germany	R82.10	SD-WAN_Gateways_Policy	2026-04-28 12:24 UTC	~14 days ✅
SD-WAN-Branch-Greece	R82.10	SD-WAN_Gateways_Policy	2026-04-28 12:24 UTC	~14 days ✅
SD-WAN-Branch-Hungary	R82.10	SD-WAN_Gateways_Policy	2026-04-28 12:24 UTC	~14 days ✅
SD-WAN-Branch-Israel	R82.10	SD-WAN_Gateways_Policy	2026-04-28 12:24 UTC	~14 days ✅
SD-WAN-Branch-Italy	R82.10	SD-WAN_Gateways_Policy	2026-04-28 12:24 UTC	~14 days ✅
SD-WAN-Branch-NewJersey	R82.10	SD-WAN_Gateways_Policy	2026-04-28 12:24 UTC	~14 days ✅
SD-WAN-Branch-Paris	R82.10	SD-WAN_Gateways_Policy	2026-04-28 12:24 UTC	~14 days ✅
SD-WAN-Branch-UK	R82.10	SD-WAN_Gateways_Policy	2026-04-28 12:24 UTC	~14 days ✅
SD-WAN-HQ-Cluster	R82.10	SD-WAN_Gateways_Policy	2026-04-28 12:24 UTC	~14 days ✅
⚠️ IPS Enabled but No Threat Policy Deployed (13 Gateways)

These gateways have the IPS blade enabled but are not actively enforcing any threat prevention policy:

Gateway	Version	SIC Status
AIOPS-DEMO-MACHINE-1	R81.20	✅ Communicating
Data_Center_GW	R81.20	✅ Communicating
IoTGW-New	R81.20	✅ Communicating
London_branch_02	R81.20	✅ Communicating
Remote-Berlin	R82.10	✅ Communicating
BranchOffice	R82.10	❌ Uninitialized
Corporate-GW	R80.40	❌ Uninitialized
Remote-2-gw / 3-gw / 4-gw	R80.10	❌ Uninitialized
RemoteBranchGw	R80.10	❌ Uninitialized
VWAN-NorthCentral--GW0/1	R81.20	❌ Uninitialized
🔧 Recommended Actions
London_branch10 — Urgent: Reinstall the latest demo_policy threat prevention policy immediately. With a ~22-month-old installation, this gateway is operating on severely outdated IPS signatures.
5 Communicating gateways with no threat policy (AIOPS-DEMO-MACHINE-1, Data_Center_GW, IoTGW-New, London_branch_02, Remote-Berlin): These are reachable and healthy — assign and install a threat prevention policy to ensure ThreatCloud protections are actively enforced.
SD-WAN fleet (14 gateways): Policy is ~14 days old — consider scheduling regular policy reinstalls (e.g., weekly) to ensure fresh signature distribution from the management server.
Uninitialized gateways (SIC broken): These cannot receive any policy updates at all. Investigate SIC trust establishment or plan for decommission/upgrade.
Just now
chat dislike button
chat like button

---

## D006

Thought for 1.62 seconds

I'll run the log query and the Threat Prevention policy analysis in parallel to get you a full picture.

Log Query Analysis and Execution
Management API Query

Here is the full correlated analysis for 10.109.17.65:

🔍 Anti-Bot Investigation — Host 10.109.17.65
1. 📋 Log Query Results (Last 30 Days)

Query period: 2026-04-13 → 2026-05-12

No Anti-Bot log records were found for source IP 10.109.17.65 in the ingested log data.

This means one of the following:

The detections you're referencing may have occurred outside the 30-day log retention window
The logs may not have been forwarded/ingested to the log server queried
The events may be logged under a different source IP (e.g., NAT translation is obscuring the original source)
The Anti-Bot blade may have been logging to a different log server than the one indexed
2. 🛡️ Threat Prevention Policy — What Would Apply to This Host

Based on the TP policy, here's what would govern traffic from 10.109.17.65:

Rule	Scope Match	Profile	Anti-Bot Action
Rule 3 — DC & US Protection	If host is in Data Center LAN or US geo	Strict	🚫 Prevent (medium/high confidence) / 🔍 Detect (low confidence)
Rule 4 — Recommended Protections	Catch-all (Any)	Optimized	🚫 Prevent (medium/high confidence) / 🔍 Detect (low confidence)
At minimum, Rule 4 (catch-all, Optimized profile) would apply to 10.109.17.65
If this host is part of Data Center LAN, Rule 3 (Strict) takes precedence — the most aggressive posture
⚠️ Low-confidence detections are Detect only (not blocked) in both Optimized and Strict profiles — these would be logged but traffic would be allowed through
3. ⚙️ Key Risk Factors to Investigate
Factor	Detail	Risk
Low-confidence Bot traffic	Both Optimized & Strict only detect at low confidence	⚠️ Could slip through
Fail-open settings	Web service & internal error fail modes are set to Allow	⚠️ Classification failures pass traffic
Obsolete/Rare prevalence threats	Optimized profile deactivates these	⚠️ Some bot signatures may be excluded
NAT/IP translation	Source IP in logs may differ from internal IP	🔎 Needs verification
4. ✅ Recommended Next Steps
Check the SmartConsole Logs & Monitor view directly — filter by source 10.109.17.65, blade = Anti-Bot, and expand the time range beyond 30 days
Verify log server routing — confirm whether the gateway handling this host forwards logs to the indexed server
Check if 10.109.17.65 is behind NAT — if so, search logs using the post-NAT IP or the connection's destination
Determine which rule matches this host — if it falls under Rule 3 (Strict), medium/high confidence bots are blocked; if only Rule 4 (Optimized), same behavior applies but rare/obsolete signatures are excluded
If low-confidence Bot detections are the concern — consider creating a dedicated TP rule for this host/subnet with a custom profile that Prevents at low confidence as well
Review the Fail Mode settings — "Allow on internal error" means a gateway under load or misconfiguration could silently pass bot traffic — consider switching to Block for higher security posture

⏱️ Note: The policy rulebase data has a freshness timestamp of 2026-05-05. If TP rules were modified after that date, verify the current state directly in SmartConsole.

Just now
chat dislike button
chat like button

---
