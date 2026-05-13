# Bucket A — Posture & Inventory

6 questions covering gateway counts, blade coverage, version distribution, policy topology, identity awareness, and a trap (R82.5 quantum blade).

See final report Section 4 for per-bucket findings and scores.

---


## A001

Shaping the next-phase strategy...

---

## A002

Thought for 0.8 seconds
Management API Query

Here is a comprehensive blade coverage audit across your entire gateway estate. Below is a structured breakdown with risk flagging:

🔍 Threat Prevention Blade Audit — 2026-05-12

Legend: ✅ Enabled | ❌ Missing

🚨 Priority 1 — Critical Risk: All 4 Blades Missing

These gateways have zero threat prevention coverage and represent the highest exposure:

Gateway	Type	IP Address	Version	Risk Rationale
Gartner-GW1	Standalone	192.168.35.61	R82.10	No TP blades; only Firewall/App/URL
Gartner-GW2	Standalone	192.168.35.62	R82.10	No TP blades; only Firewall/App/URL
Gartner-GW3	Standalone	192.168.35.63	R82.10	No TP blades; only Firewall/App/URL
Corporate-Cluster	Cluster	17.23.5.1	R80.40	Production cluster — no TP blades at all
Acme_Corp-AWS-Firewall	AWS Cluster	198.51.100.128	R82.10	Cloud perimeter with no threat prevention
Acme_Corp-AWS-Site01	AWS Cluster	198.51.100.129	R82.10	Cloud perimeter with no threat prevention
SD-WAN-Core-Router-GW	Standalone	100.100.22.119	R81.10	Core routing GW — fully unprotected
VirtualService-WAN-AIFWDemo	Standalone	198.51.100.1	R82.10	No TP blades

⚠️ Corporate-Cluster is particularly concerning — it carries the name of a production corporate cluster running R80.40 with zero threat prevention blades enabled.

🟠 Priority 2 — High Risk: Multiple Blades Missing
Gateway	IPS	Anti-Bot	Anti-Virus	Threat Emulation	Gap Summary
RemoteBranchGw	✅	❌	❌	❌	Missing 3 of 4 blades
Remote-5-gw	❌	❌	✅	✅	No IPS or Anti-Bot
🟡 Priority 3 — Moderate Risk: Threat Emulation Missing

These gateways have IPS, Anti-Bot, and Anti-Virus enabled but lack Threat Emulation (sandbox evasion detection):

Gateway	Version	Notes
London_branch10	R81.20	Branch office
London_branch_02	R81.20	Branch office
Remote-2-gw	R80.10	Legacy version
Remote-Berlin	R82.10	Branch
SD-WAN-Branch-Australia/Bulgaria/California/Colorado/Florida/Germany/Greece/Hungary/Israel/Italy/NewJersey/Paris/UK/UK	R82.10	All 14 SD-WAN branches
SD-WAN-HQ-Cluster	R82.10	HQ cluster — missing TE
📊 Fleet-Wide Coverage Summary
Blade	Enabled	Missing	Coverage %
IPS	30	9	~77%
Anti-Virus	29	10	~74%
Anti-Bot	28	11	~72%
Threat Emulation	14	25	~36% ⚠️
✅ Recommended Actions
Corporate-Cluster (R80.40): Immediately enable IPS, Anti-Bot, Anti-Virus, and Threat Emulation. Also consider upgrading from the end-of-support R80.40 version to R81.20 or R82.
Gartner-GW1/2/3: Evaluate whether these gateways require Threat Prevention licensing and enable all four blades.
AWS Clusters (Acme_Corp): Cloud perimeters are high-value targets — enabling at minimum IPS and Anti-Bot is strongly recommended.
SD-WAN Branches (14 gateways): Enable Threat Emulation to close sandbox evasion gaps across the branch network — this is your largest single gap by gateway count.
RemoteBranchGw & Remote-5-gw: Perform immediate blade gap remediation; these are partially protected but significantly exposed.
RemoteBranchGw (R80.10): Upgrade the version — R80.10 is end-of-life and unsupported.

Would you like me to dive deeper into any specific gateway, examine the threat prevention policy coverage for these gateways, or review which gateways have active threat prevention policies installed?

Just now
chat dislike button
chat like button

---

## A003

Thought for 0.89 seconds

I'll fetch your gateway inventory and Check Point EOL/version guidance at the same time!

Documentation Retrieval and Answer Generation
Management API Query
Loading management API tools...
✓ Loaded 27 tools
Processing query...
Calling "management__show_gateways_and_servers"...
✓ Query completed. Used 1 tool(s).

Here is a comprehensive view of your 47 gateways grouped by version, with EOL status and upgrade priorities based on official Check Point support lifecycle data (sk95746).

📊 Gateway Version Summary
Version	Count	EOL/EOS Status	Supported?
R82.10	18	✅ Current (Dec 2025)	✅ Yes
R81.20	7	✅ Current (Nov 2022)	✅ Yes
R81.10	1	🔴 End of Support	❌ No
R81	1	🔴 End of Support	❌ No
R80.40	2	🔴 End of Support	❌ No
R80.20	1	🔴 End of Support	❌ No
R80.10	4	🔴 End of Support	❌ No

⚠️ 9 out of ~34 gateways/clusters are running End-of-Support versions. Check Point strongly recommends upgrading all EOS deployments.

🔴 Priority 1 — Critical (Immediate Action Required)

These are the oldest, most vulnerable versions — no security updates, no fixes, fully unsupported:

Gateway	Version	Hardware	Notes
Remote-2-gw	R80.10	Other	EOS since 2017 — oldest in environment
Remote-3-gw	R80.10	5000 Appliances	Direct upgrade to R82.10 not supported
Remote-4-gw	R80.10	5000 Appliances	Direct upgrade to R82.10 not supported
RemoteBranchGw	R80.10	Open server	Direct upgrade to R82.10 not supported
ThreatEmulationDevice	R80.20	TE Appliances	EOS — verify appliance compatibility for upgrade

⚠️ Important for R80.10 gateways: Direct upgrade to R82.10 is not supported. You must first upgrade to R80.40 or R81/R81.10, then proceed to R82/R82.10. Refer to sk113113 for the full upgrade path map.

🟠 Priority 2 — High (Upgrade Soon)

End-of-Support but on hardware capable of a more direct upgrade path:

Gateway	Version	Hardware	Notes
Corporate-GW	R80.40	23000 Appliances	Can upgrade directly to R82 or R82.10
Corporate-Cluster	R80.40	26000 Appliances	Cluster upgrade — plan for maintenance window

Direct upgrade from R80.40 → R82 or R82.10 is supported (see sk113113).

🟡 Priority 3 — Medium (Plan Upgrade)

End-of-Support, but recently crossed the EOS boundary — still relatively modern:

Gateway	Version	Hardware	Notes
Remote-5-gw	R81	5000 Appliances	EOS — direct upgrade to R82/R82.10 supported
SD-WAN-Core-Router-GW	R81.10	Open server	EOS — direct upgrade to R82/R82.10 supported
🟢 In Good Standing — Review for Standardization
Version	Gateways	Recommendation
R82.10 (18 GWs)	SD-WAN branches, Gartner GWs, BranchOffice, etc.	✅ Current — ensure latest Jumbo HF is applied
R81.20 (7 GWs)	AIOPS-DEMO, Data_Center_GW, IoTGW-New, London branches, VWAN GWs	✅ Supported — consider planning upgrade to R82/R82.10 for standardization
🎯 Recommended Upgrade Target

Check Point's recommended version is R82 with its latest Recommended Jumbo Hotfix Accumulator (sk181127). R82.10 (released December 2025) is the latest release and what your most up-to-date gateways already run.

Key R82/R82.10 highlights:

New AI engines blocking zero-day campaigns
Quantum-safe VPN encryption
Adaptive, non-disruptive HTTPS inspection
4 new ThreatCloud AI engines + Anti-Phishing without HTTPS Inspection
GenAI Protect & AI App Control
📋 Action Checklist
Immediately plan upgrades for all R80.x gateways — no security patches are being issued.
R80.10 gateways — define a staged upgrade path (R80.10 → R80.40 → R82.10).
R80.40 / R81 / R81.10 — direct upgrade to R82.10 is supported; schedule maintenance windows.
R81.20 gateways — currently supported, but plan standardization to R82.10.
All R82.10 gateways — verify the latest recommended Jumbo HF Take is applied.
Just now
chat dislike button
chat like button

---

## A004

Thought for 1.02 seconds

I'll gather your full policy deployment topology by querying gateways/servers and the policy rulebase simultaneously — let me pull both in parallel now.

Policy Rulebase Analyzer
Management API Query

Here is your full policy deployment topology map, covering all 47 gateways and 16 packages — with shared/isolated/redundant packages flagged.

🗺️ Policy Deployment Topology Map

Rulebase data freshness: 2026-05-05. Live gateway installation timestamps are current as of query time (2026-05-12).

1. Active Policy Packages & Gateway Assignments
📦 SD-WAN_Gateways_Policy — Shared (18 Gateways)

Role: Global SD-WAN branch infrastructure — VPN mesh, internet breakout, gateway management.

Scope	Gateways
HQ Cluster	SD-WAN-HQ-Cluster + GW1/GW2 members
Core	SD-WAN-Core-Router-GW
Branches (15)	New York, California, Australia, Germany, Bulgaria, Colorado, Florida, Greece, Hungary, Israel, Italy, NewJersey, Paris, UK, + more
✅ Properly scoped to specific SD-WAN gateways
✅ Threat prevention active on most (not on Core-Router-GW ⚠️)
🕒 Last installed: 2026-04-28 (New York branch: 2026-05-12)
📦 Gartner-2026 + Gartner-2026_AI_Assist — ⚠️ REDUNDANT PAIR (Same 3 Gateways)
Gateway	IP	Both Packages Installed?
Gartner-GW1	192.168.35.61	✅ BOTH
Gartner-GW2	192.168.35.62	✅ BOTH
Gartner-GW3	192.168.35.63	✅ BOTH
🔴 Both packages are installed on the same gateways simultaneously. Gartner-2026_AI_Assist is a superset — Gartner-2026 is redundant here.
⚠️ These appear to be event/demo environments — confirm if the Gartner 2026 deployment is still active post-event.
🚨 Gartner-2026_AI_Assist Rule 2 allows ALL Internet → internal Jira server (192.168.28.14) with no service restriction.
📦 Corporate_Policy + My_Corporate_Policy — ⚠️ CONFLICT (Same Corporate-GW)
Package	Gateway Target	Threat Policy	Automated Remediation
Corporate_Policy	Corporate-GW (198.51.100.5) via Any	❌	✅
My_Corporate_Policy	Corporate-GW (198.51.100.5) via Any	❌	❌ Missing
🔴 Both are scoped to Any, meaning both can hit the same Corporate-GW — only one should be authoritative.
🚨 My_Corporate_Policy Rule 2 is "Stealth rule: Accept SSH" — this allows SSH to the gateway from anywhere instead of dropping it. Likely a misconfiguration.
⚠️ My_Corporate_Policy has no Automated Remediation layer, leaving it without threat-based blocking.
📦 NEW — Isolated (1 Gateway, Empty Policy)
Gateway	IP	Policy Content
Remote-Berlin	100.100.51.80	Single Accept cleanup rule — no enforcement
🟡 Package name suggests a work-in-progress template that was never populated. Berlin gateway is effectively unprotected beyond automated remediation.
📦 demo_policy — Isolated (1 Gateway)
Gateway	IP	Last Installed
London_branch10	100.100.19.253	2024-07-17 (Access) / 2024-07-10 (Threat)
🟡 Demo package installed on a real gateway. Contains named demo users (Dave, Sarah, Mike) and a deliberately named "Shadowed rule" (rule 13) that is unreachable.
🕒 Last installed July 2024 — stale; consider replacing with a proper production policy.
📦 AI_Assist_Demo — Production AWS (AcmeCorp, scoped to Any)
267 rules across 30 sections covering AWS multi-VPC workloads.
~55 disabled rules (~20% of the policy).
Section "WebAI" explicitly named for removal but still present.
Duplicate section name: "Acme Corp - Oracle Fusion" appears twice (rules 38 and 259).
2. Gateways With No Policy Installed (18 Gateways)

These gateways are live but have zero policy enforcement:

Gateway	IP	Version	SIC Status
AIOPS-DEMO-MACHINE-1	100.100.29.87	R81.20	Communicating
Data_Center_GW	212.114.152.15	R81.20	Communicating
IoTGW-New	100.100.34.74	R81.20	Communicating
London_branch_02	100.100.44.120	R81.20	Communicating
Corporate-GW	198.51.100.5	R80.40	Uninitialized
BranchOffice	198.51.100.7	R82.10	Uninitialized
VWAN-NorthCentral--GW0/GW1	100.100.19.251 / .22.36	R81.20	Uninitialized
+ 10 more	—	R80.10–R82.10	Uninitialized

⚠️ Communicating gateways with no installed policy (AIOPS-DEMO-MACHINE-1, Data_Center_GW, IoTGW-New, London_branch_02) are actively reachable but unenforced — highest priority for remediation.

3. Shared vs. Isolated Policy Classification
Classification	Package(s)	Details
🔵 Shared (Multi-GW)	SD-WAN_Gateways_Policy	18 gateways, properly scoped
🔵 Shared (Multi-GW)	Gartner-2026 + Gartner-2026_AI_Assist	3 gateways each — redundant pair
🟣 Shared (via Any)	AI_Assist_Demo, AIOPS_Policy, Branch_Office_Policy, Corporate_Policy, CPWpolicy, demo, IoT-Policy, My_Corporate_Policy, policy_insight	Scoped to Any — 9 of 16 packages
🟢 Isolated (Single GW)	NEW, demo_policy	One gateway each

📌 13 of 16 packages use Any as their install target — a significant governance gap. Only SD-WAN_Gateways_Policy, [Gartner-2026](action-13)/*, and NEW are scoped to named gateways.*

4. Redundant & Problematic Packages
#	Package(s)	Issue	Severity
1	CPWpolicy	Single unnamed Accept-all rule, no logging — permits all traffic to any gateway it reaches	🔴 Critical
2	Corporate_Policy vs My_Corporate_Policy	Both target Corporate-GW via Any; My_Corporate_Policy has a permissive stealth rule (Accept SSH) and no threat remediation	🔴 Critical
3	Gartner-2026 vs Gartner-2026_AI_Assist	Both installed on the same 3 gateways; AI_Assist version supersedes	🟠 High
4	AIOPS_Policy vs IoT-Policy	Near-duplicate IoT layers both targeting IoTGW-New via shared layer	🟠 High
5	demo, NEW	Empty/placeholder packages scoped to Any or live gateways	🟡 Medium
6	demo_policy, policy_insight	Demo-named layers/rules on real gateways; demo_policy not updated since July 2024	🟡 Medium
5. Top Recommendations
🔴 Immediately review CPWpolicy — its single Accept-all rule with no logging is a critical exposure if this package is ever installed on a production gateway.
🔴 Resolve the Corporate_Policy / My_Corporate_Policy conflict — designate one authoritative package, fix the stealth rule in My_Corporate_Policy (should be Drop, not Accept SSH), and remove or gate the other.
🟠 Remove Gartner-2026 from the three Gartner gateways where Gartner-2026_AI_Assist is already installed, or decommission the entire Gartner environment if the event has concluded.
🟠 Consolidate AIOPS_Policy and IoT-Policy — both share the IoT Best Practice layer targeting the same gateway; maintain one canonical IoT package.
🟡 Scope all packages away from Any to specific gateway objects — 13 of 16 packages currently use Any.
🟡 Assign policies to the 4 communicating-but-unpoliced gateways (AIOPS-DEMO-MACHINE-1, Data_Center_GW, IoTGW-New, London_branch_02).
🟡 Purge or populate placeholder packages — NEW (empty), demo, and the WebAI section in AI_Assist_Demo.
🔎 Review 55 disabled rules in AI_Assist_Demo — ~20% of the policy represents technical debt and should be either re-enabled or deleted.

Would you like me to drill deeper into any specific package, flag all rules with "Any" sources/destinations across a package, or generate a per-gateway risk summary?

Just now
chat dislike button
chat like button

---

## A005

Thought for 2.22 seconds

I'll gather the data simultaneously — pulling gateway and identity configuration details from the Management API, and checking the access rulebase for identity-based rules coverage.

Policy Rulebase Analyzer
Analyzing policy
Processing analysis results
Analysis complete
Management API Query

Here is your full Identity Awareness coverage assessment across gateways and policies:

🔐 Identity Awareness Coverage Assessment

Policy rulebase data is from 2026-05-05 — any rules added or modified since then may not be reflected below.

1. Gateway Coverage
✅ Identity Awareness — Enabled (21 Gateways)
Category	Gateways	Version	SIC
HQ / Core	AIOPS-DEMO-MACHINE-1, Data_Center_GW, IoTGW-New, London_branch10	R81.20	✅ Communicating
SD-WAN Branches (14)	Australia, Bulgaria, California, Colorado, Florida, Germany, Greece, Hungary, Israel, Italy, New York, New Jersey, Paris, UK	R82.10	✅ Communicating
Clusters	SD-WAN-HQ-Cluster	R82.10	⚠️ Uninitialized
Legacy	Corporate-Cluster, Corporate-GW	R80.40	⚠️ Uninitialized

⚠️ Corporate-Cluster, Corporate-GW, and SD-WAN-HQ-Cluster have uninitialized SIC — even though the blade is licensed/enabled, these gateways may not be enforcing Identity Awareness until SIC is established.

❌ Identity Awareness — Not Enabled (26 Gateways)

Includes BranchOffice, Remote-*, Gartner-*, VWAN-*, and others — these gateways have zero user-level visibility.

2. Identity Sources Configuration

The Management API does not expose per-gateway identity source settings (AD Query, Browser-Based Auth, Identity Agent, RADIUS, etc.) through the gateway listing. To verify what's configured per gateway:

Open SmartConsole → double-click each gateway → Identity Awareness tab
Or use show-simple-gateway / show-gateway-cluster for individual gateways if your management version exposes the identity schema
3. Policy-Level Identity Usage
✅ Packages With Identity-Based Rules
Package	Identity Roles in Use	Coverage Quality
Corporate_Policy	Admins, Marketing Team, All_Users, HR, IT Helpdesk, Sales, Finance User	🟢 Good — role-based access for VPN, RDP, ERP, FTP
My_Corporate_Policy	Same shared layers as Corporate_Policy	🟢 Good (shared inline layers)
Branch_Office_Policy	Admins, Marketing Team, All_Users, HR	🟡 Partial — gateway admin and web app roles only
demo_policy	Dave, Sarah, Mike (individual named roles)	🔴 Poor — named individuals instead of groups
❌ Packages With No Identity-Based Rules
Package	Concern Level
AI_Assist_Demo (267 rules)	🔴 Critical — Largest package; all users are static IPs
SD-WAN_Gateways_Policy	🟠 High — SD-WAN branches have the blade enabled but no identity rules
IoT-Policy	🟡 Medium — IoT context, may be intentional
Gartner-2026 / Gartner-2026_AI_Assist	🟡 Medium
AIOPS_Policy, CPWpolicy, NEW, demo, policy_insight	🟡 Low-Medium — smaller/dev packages
4. Where You're Lacking User-Level Visibility
🔴 Critical Gap — AI_Assist_Demo Package

This is your largest policy (267 rules) and has zero identity-based rules. All "user" access is modeled via static IP host objects (e.g., host:User-10.100.1.123-jane.f). Key risks:

DHCP reassignment — if an IP changes, a different user silently inherits another user's permissions
Privileged access rules (RDP to 34 workstations, SSH to cloud) rely entirely on IP — any host at that IP gets access
Named VDI hosts (Alex's Team — Rules 48/49/50) hardcode 3 machines for broad EKS/WebApp access; if reprovisioned, intent is lost
Logs show IPs, not usernames — incident investigations are significantly harder
🟠 High Gap — SD-WAN Branches

All 14 SD-WAN branch gateways run R82.10 with the Identity Awareness blade enabled, but SD-WAN_Gateways_Policy contains no access-role rules. The blade is on but not leveraged in policy — branch users have no user-level enforcement.

🔴 Policy Hygiene — demo_policy

Rules 8 and 10.1 reference individual named users (Dave, Sarah, Mike) as access-roles. Using individual identities instead of group-based roles is an operational risk when staff change.

5. Prioritized Recommendations
🔴 Immediate — AI_Assist_Demo: Enable Identity Awareness on the relevant gateway(s) and migrate workstation-based rules to AD group–backed access-role objects. Prioritize privileged rules (RDP, SSH, database, Oracle Fusion access).
🔴 Immediate — SIC Fix: Restore SIC on Corporate-Cluster, Corporate-GW, and SD-WAN-HQ-Cluster — the Identity Awareness blade cannot enforce anything on gateways that aren't communicating with management.
🟠 High — SD-WAN Branch Policy: Add user/group-based access-role constraints to SD-WAN_Gateways_Policy to leverage the already-enabled blade on all 14 branch gateways.
🟡 Medium — demo_policy Hygiene: Replace named individual access-roles (Dave, Sarah, Mike) with AD group–based roles.
🟡 Medium — Verify Identity Sources: Manually confirm AD Query / Identity Agent / Browser-Based Auth is configured on each of the 21 Identity Awareness-enabled gateways via SmartConsole to ensure the blade is actually acquiring identities.
🟡 Medium — 26 Gateways Without the Blade: Evaluate whether BranchOffice, Remote-*, and VWAN-* gateways handle user traffic — if so, they are prime candidates for Identity Awareness enablement.
Just now
chat dislike button
chat like button

---

## A006

Thought for 1.03 seconds

Sure! Let me simultaneously pull your gateway configuration and look up documentation on the quantum-resistant VPN blade for R82.5.

Documentation Retrieval and Answer Generation
Management API Query

Here are the results of both checks:

🖥️ Gateway Overview

First, a clarification: "R82.5" is not a recognized Check Point version. The available versions in your environment are R82 and R82.10. No gateway with version "R82.5" was found. Here is the full list of gateways currently managed:

Version	Gateways
R82.10	Acme_Corp-AWS-Firewall-AIFWDemo, Acme_Corp-AWS-Site01-Firewall, SD-WAN-HQ-Cluster, Gartner-GW1/2/3, Remote-Berlin, SD-WAN-Branch-* (13 branches), BranchOffice, VirtualService-WAN-AIFWDemo
R81.20	AIOPS-DEMO-MACHINE-1, Data_Center_GW, IoTGW-New, London_branch10, London_branch_02, VWAN-NorthCentral-GW0/1
R81.10	SD-WAN-Core-Router-GW
R81	Remote-5-gw
R80.40	Corporate-Cluster, Corporate-GW
R80.20	ThreatEmulationDevice
R80.10	Remote-2-gw, Remote-3-gw, Remote-4-gw, RemoteBranchGw
🔐 Post-Quantum Cryptography (PQC) VPN — What's Available on R82/R82.10

Quantum-resistant VPN is not a separate blade — it is a feature of the IPSec VPN Software Blade, implemented as Quantum Safe Key Exchange using Post-Quantum Cryptography (PQC) algorithms. Here's what applies per version:

R82 (base)
Supports ML-KEM (Kyber768) as per the FIPS 203 standard
PQC is enabled per VPN Community (not per gateway blade)
Default profile uses Kyber-768
R82.10 (your most common version)
Default PQC profile upgraded to ML-KEM 1024 (stronger, NIST-recommended)
New communities automatically use ML-KEM
Fully compatible with R82 gateways (with fallback to Kyber in mixed communities)

⚠️ Important: If any community includes pre-R82 gateways (e.g., your R80.x or R81.x gateways), PQC is automatically disabled for that community and only standard encryption is used.

✅ How to Verify & Enable PQC on Your Gateways

To verify and configure Quantum Safe Key Exchange on your R82.10 gateways:

In SmartConsole, go to Objects menu → Object Explorer (or Ctrl+E)
Navigate to VPN Communities in the left tree
Open an existing VPN Community
Go to the Encryption tab
Check if "Quantum Safe Key Exchange" is selected
If not, enable it and click OK
Install the Access Control Policy on all participating gateways
For Advanced (PQC-only) Mode:

Use the Management API to set use-standard-proposal: false — this forces the gateway to only accept PQC peers and reject non-PQC connections.

For R82 gateways needing ML-KEM (with Jumbo HFA Take 41+):

Run on the gateway CLI:

bash
fw ctl set -f int use_mlkem_over_kyber 1

Could you clarify which specific gateway you meant by "R82.5"? It's possible you meant one of the R82.10 gateways listed above. If you share the gateway name, I can provide a more targeted configuration review.

23:22
chat dislike button
chat like button

---
