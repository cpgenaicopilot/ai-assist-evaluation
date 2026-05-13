# Bucket I — Migration, Upgrade & Capacity

4 questions covering R80.40→R81.20 readiness, license compatibility, capacity scaling, deployment templates.

See final report Section 4 for per-bucket findings and scores.

---


## I001

Here’s a structured R80.40 to R81.20 migration readiness report template for your R80.40 gateways, based on Check Point best practices and official documentation. For a per-gateway report, you’ll need to gather some details from your environment, but here’s how to approach each requirement:

1. Compatibility
R80.40 gateways are supported for direct upgrade to R81.20 (see sk113113 and R81.20 Release Notes).
Pre-requisite: Ensure the latest Jumbo Hotfix Accumulator is installed on each gateway before upgrade.
2. License Status
Check via SmartUpdate or CLI:
Run cplic print on each gateway to verify license validity and expiration.
Ensure licenses are valid for R81.20 (contact your Check Point partner if unsure).
3. Estimated Downtime
Typical downtime per gateway:
Standalone gateway: 30–60 minutes.
Clustered gateway: 15–30 minutes per node (with minimal impact if using ClusterXL).
Note: Actual downtime may vary based on hardware, policy size, and environment complexity.
4. Recommended Migration Order
Best practice order:
Upgrade the Security Management Server first.
Upgrade standby cluster members (if applicable).
Upgrade active cluster members.
Upgrade standalone gateways last.
Rationale: This order minimizes risk and ensures management compatibility.
5. Risk Flags
Run the Pre-Upgrade Verifier on each gateway before migration.
The tool will flag:
Unsupported hardware or software.
Configuration issues (e.g., invalid policy names).
Deprecated features.
Review the generated upgrade report ($MDS_FWDIR/log/upgrade_report-<date>.html) for errors and warnings (details).
Common risks:
Outdated licenses.
Unsupported third-party add-ons.
Insufficient disk space.
Next Steps
Run the Pre-Upgrade Verifier on each gateway (instructions).
Check licenses using SmartUpdate or CLI.
Plan downtime and communicate with stakeholders.
Follow the recommended upgrade order.
Review and address all risk flags before proceeding.

For detailed, gateway-specific reports, use the Compliance Blade to generate best practice reports (how-to).

Would you like step-by-step instructions for any of these tasks, or a sample checklist to use per gateway?

Mermaid Error: Parse error on line 9: ... upgrade supported\n(sk113113, R81.20 RN -----------------------^ Expecting 'SQE', 'DOUBLECIRCLEEND', 'PE', '-)', 'STADIUMEND', 'SUBROUTINEEND', 'PIPE', 'CYLINDEREND', 'DIAMOND_STOP', 'TAGEND', 'TRAPEND', 'INVTRAPEND', 'UNICODE_TEXT', 'TEXT', 'TAGSTART', got 'PS'

Show Code
Just now
chat dislike button
chat like button

---

## I002

Thought for 0.82 seconds

I'll check your gateways and look up R82 licensing requirements at the same time!

Documentation Retrieval and Answer Generation

I'll check your gateways and look up R82 licensing requirements at the same time!I was unable to automatically retrieve your live gateway inventory (the Management API tool couldn't service that query). However, I can give you a complete, actionable guide on how to perform the license compatibility check yourself in SmartConsole, along with all the key R82 licensing and upgrade considerations you need to know.

R80.x → R82 License Compatibility Assessment
⚠️ Important: Upgrade Path Considerations by R80.x Version

Not all R80.x versions can upgrade directly to R82. Per sk113113:

Source Version	Direct Upgrade to R82	Notes
R80.40	✅ Yes	Supported
R80.30	✅ Yes (Note 3)	Prerequisites apply
R80.20 / R80.20SP	✅ Yes (Note 3)	Prerequisites apply
R80.10	✅ Yes (Note 3)	Prerequisites apply
R80	✅ Yes (Note 3)	Prerequisites apply

Note 3 typically means there are intermediate steps or Jumbo Hotfix requirements before the upgrade. Always verify the specific sk for your version.

1. How to Check License Status Per Gateway in SmartConsole

For each of your R80.x gateways:

Open SmartConsole and select the gateway object
Go to the Summary tab → click the License Status indicator (e.g., OK, Warning, Error)
The Device & License Information window shows:
Per-blade License Status
Expiration Dates
Quota information (in the Additional Info column)
The SKU tooltip shows the product/blade name
2. Key R82 Licensing Rules to Know
Scenario	Action Required
Same IP address after upgrade	Existing licenses remain valid — no re-issue needed
Different IP address after upgrade	You must re-issue licenses for the new IP via the Check Point User Center
Blade quota exceeded	Upgrade/purchase appropriate blade SKU
Expired licenses	Renew before or during upgrade
3. Common Blade SKUs to Audit

When reviewing each gateway, verify license coverage for these blades (which are the most commonly required for R82):

Blade	SKU Category
Firewall	Included in base gateway license
IPS	Threat Prevention SKU (e.g., CPSG-)
Application Control & URL Filtering	NGTX / NGTP bundle SKU
Anti-Bot / Anti-Virus	NGTX / NGTP bundle SKU
Threat Emulation (SandBlast)	NGTX bundle SKU
Mobile Access / Remote Access VPN	Specific SKU or included
Identity Awareness	Included in most bundles

💡 Tip: Check Point R82 uses the same licensing model as R81.x. If your gateways already run valid R81.x-compatible licenses, they are generally compatible with R82 as well — provided IPs don't change and SKU quotas are not exceeded.

4. Recommended Pre-Upgrade Licensing Steps
Run cplic print on each gateway CLI to list all installed licenses and their expiration dates:
Run cpinfo -y all for a comprehensive license and blade status summary.
Cross-reference with SmartConsole using the Device & License Information window (as described above).
Log into User Center to validate which licenses are tied to each gateway IP and check for any expiring SKUs.
Contact your Check Point reseller or TAC if you identify blades with Insufficient or Expired status — they can advise on the exact SKU needed for your specific appliance model and blade combination.
5. If IP Addresses Will Change During Upgrade

For migration-type upgrades (new hardware with a different IP):

Create the mdss.json configuration file before importing the database
Issue new licenses in User Center before or immediately after migration
Install new licenses using cplic put or via the Gaia Portal

📘 Reference: R82 Main SK (sk181127) | Upgrade Compatibility Map (sk113113)

Would you like me to guide you through checking a specific gateway's license status in detail, or help interpret the output of cplic print for a particular gateway?

Just now
chat dislike button
chat like button

---

## I003

Thought for 1.45 seconds

Great question — this kind of capacity assessment touches three data sources simultaneously. Let me query all of them in parallel right now.

Policy Rulebase Analyzer
Analyzing policy
Analysis complete
Management API Query
Log Query Analysis and Execution

Here is a consolidated capacity scaling assessment across all three dimensions — hardware tier, traffic load, and policy complexity. Data is current as of May 13, 2026 (last 7 days) for traffic, and policy rulebase data was last refreshed May 5, 2026.

🔍 Capacity Scaling Assessment
1. 🌐 Connection Count — Top Gateways (May 6–13, 2026)
Gateway	Connections (7d)	Throughput	Hardware Tier	Risk Signal
GW-32.12	5,710,861	~78.1 GB total	Open server (unregistered)	🔴 Extreme outlier
Gartner-GW1	923,842	N/A	Open server	🟡 High
SD-WAN-HQ-GW1	851,839	N/A	Open server (cluster member)	🟡 High
Gartner-GW3	635,537	N/A	Open server	🟡 Moderate-High
SD-WAN-Branch-New-York	246,406	N/A	Open server	🟢 Moderate
SD-WAN-Branch-Israel	240,350	N/A	Open server	🟢 Moderate
SD-WAN-Branch-Hungary	215,978	N/A	Open server	🟢 Moderate
SD-WAN-Branch-NewJersey	206,454	N/A	Open server	🟢 Moderate
SD-WAN-Core-Router-GW	184,191	N/A	Open server	🟢 Moderate
SD-WAN-Branch-Paris	193,508	N/A	Open server	🟢 Moderate

⚠️ GW-32.12 is an extreme outlier — ~5.7M connections and ~78.1 GB received in 7 days — but it does not appear in the management inventory. This may indicate a decommissioned gateway still forwarding logs, a renamed/untracked device, or a potential data anomaly. Immediate investigation is recommended.

2. 🖥️ Hardware Tier vs. Load — Key Findings
Gateway / Cluster	Hardware Tier	Version	Connection Load	Policy Installed	Concern
Corporate-Cluster	26000 Appliances	R80.40	Not in logs	None	🟡 Outdated version, no policy
Corporate-GW	23000 Appliances	R80.40	Not in logs	None	🟡 Outdated version, no policy
BranchOffice	3900 Appliances	R82.10	Not in logs	None	🟠 Low-tier, no logs seen
Remote-3-gw / Remote-4-gw	5000 Appliances	R80.10	Not in logs	None	🟠 Very old version (R80.10)
Remote-5-gw	5000 Appliances	R81	Not in logs	None	🟠 Old version
SD-WAN-HQ-Cluster	Open server	R82.10	851K+ connections	✅ SD-WAN policy	🟡 Shared load between 2 cluster members
Gartner-GW1/2/3	Open server	R82.10	Up to 923K connections	✅ Gartner-2026	🟡 No threat policy assigned
3. 📋 Policy Rulebase Size

The Policy Rulebase Analyzer returned no detailed rule count breakdown in this pass. For per-package rule depth, a targeted follow-up query per package is recommended.

Known policy-to-gateway assignments:

Policy Package	Gateways Using It	Type
SD-WAN_Gateways_Policy	14+ SD-WAN branch gateways + HQ Cluster	Access + Threat
Gartner-2026	Gartner-GW1, GW2, GW3	Access only
demo_policy	London_branch10	Access + Threat
NEW	Remote-Berlin	Access only

The SD-WAN_Gateways_Policy is the most broadly deployed package, applied to 14+ gateways. Any rulebase bloat in this package has the widest blast radius.

4. 🚨 Priority Scaling Concerns Summary
Priority	Gateway / Asset	Issue
🔴 Critical	GW-32.12	5.7M connections, ~78.1 GB throughput — not in inventory
🔴 Critical	Corporate-Cluster / Corporate-GW	High-end hardware (26K/23K), R80.40 EoL, no policy installed
🟠 High	Remote-3-gw, Remote-4-gw, Remote-5-gw	R80.10 (very old), no policy, ⚠️ SIC uninitialized
🟡 Medium	Gartner-GW1/2/3	High connection counts, no Threat Prevention policy
🟡 Medium	SD-WAN-HQ-Cluster	Highest cluster load, monitor for CPU/memory saturation
🟡 Medium	BranchOffice (3900)	Low-tier hardware, not generating visible traffic logs
📌 Recommended Next Steps
Investigate GW-32.12 — Identify what device this is, validate it's legitimate, and confirm it's sized appropriately for its load.
Review Corporate-Cluster & Corporate-GW — High-end appliances running R80.40 with no policy installed is a significant gap. Plan an upgrade to R82.10 and policy assignment.
Upgrade Remote branch gateways (R80.10) — R80.10 is end-of-life; these gateways are unmanaged and unprotected.
Add Threat Prevention to Gartner-GW1/2/3 — High connection volumes with no threat policy is an exposure risk.
Run rulebase size analysis per package — Particularly for SD-WAN_Gateways_Policy given its wide deployment scope. I can drill into any specific package on request.

Would you like me to drill into any specific gateway's traffic patterns, or run a detailed rulebase analysis for a particular policy package?

I have one report that might be useful for you:

General Overview - Connection logs across all gateways – capacity scaling assessment by connection count and throughput

Just now
chat dislike button
chat like button

---

## I004

Thought for 0.78 seconds

Sure! Let me start by pulling all the relevant configuration details for London_branch10 to use as a template.

Management API Query

I now have everything I need. Here is the full Tokyo gateway deployment plan, modelled on London_branch10.

🗼 Tokyo Gateway — Deployment Plan
Template: London_branch10 | R81.20 | demo_policy
1. 🛡️ Recommended Blade Configuration

Mirror London_branch10's blade set exactly. All eight blades below should be enabled at first install:

#	Blade	Rationale
1	🔥 Firewall	Core traffic enforcement — mandatory
2	🌍 URL Filtering	Block malicious/unwanted web destinations
3	🌐 Application Control	Enforce application-level policy
4	📄 Content Awareness	Classify and control data by content type
5	👤 Identity Awareness	Bind policy rules to users/machines, not just IPs
6	🤖 Anti-Bot	Detect and block C2 communications
7	🦠 Anti-Virus	Real-time file and traffic scanning
8	🛡️ IPS	Signature-based exploit and vulnerability prevention

⚠️ Not on the template (leave disabled unless Tokyo requires it): Site-to-Site VPN, Threat Emulation, Threat Extraction, Zero-Phishing. Revisit once Tokyo's connectivity requirements are confirmed.

2. 📋 Policy Assignment
Setting	Value
Policy Package	demo_policy
Access Policy	Assign from demo_policy
Threat Prevention Policy	Assign from demo_policy

📝 If Tokyo has unique traffic or compliance requirements (different subnets, local regulation), consider cloning demo_policy into a Tokyo_policy package so rules can be tailored without impacting London or other gateways sharing the same package.

3. 🔒 VPN Community Membership

London_branch10 does not participate in any Site-to-Site VPN community and the VPN blade is disabled. Apply the same posture to Tokyo unless site-to-site connectivity is required:

Scenario	Action
No site-to-site VPN needed	Leave VPN blade disabled (matches template)
Tokyo ↔ HQ / other branches needed	Enable the Site-to-Site VPN blade, create or join an existing Star or Mesh VPN community, define the encryption domain (addresses_behind_gw or explicit range), and add the community to the access rulebase

💡 The template uses addresses_behind_gw as the VPN encryption domain — use the same convention if VPN is later enabled.

4. 🌐 Network Interface Template

Map London_branch10's interface layout to Tokyo's physical/virtual interfaces:

Role	London Template	Tokyo (Suggested)
External (WAN)	eth0 — ExternalZone	eth0 — ExternalZone — assign Tokyo WAN IP
Internal (LAN)	eth1 — 10.2.0.1/24 — InternalZone	eth1 — InternalZone — assign Tokyo LAN subnet
Management Tunnel	maas_tunnel — 100.100.19.253/24	Replicate if using the same management overlay; assign a unique IP in the management range

⚠️ Ensure the Tokyo LAN subnet does not overlap with London (10.2.0.0/24) or any other branch to avoid routing conflicts.

5. ✅ Deployment Checklist
Phase 1 — Pre-Deployment (Management Console)
 Create a new Simple Gateway object for Tokyo in SmartConsole
 Set OS: Gaia, Hardware: Open Server, Version: R81.20
 Assign the Tokyo WAN IP as the primary IPv4 address
 Configure interfaces (eth0 ExternalZone, eth1 InternalZone, maas_tunnel if applicable)
 Enable all 8 blades listed in Section 1
 Assign demo_policy (or a cloned Tokyo package) to the gateway
 Define anti-spoofing topology on all interfaces
 Confirm Tokyo's LAN subnet is unique and added to the routing/topology
Phase 2 — Gateway Appliance Setup
 Install Gaia R81.20 on the appliance/VM
 Apply the latest Jumbo Hotfix Accumulator (JHF) for R81.20
 Configure management IP, default gateway, and DNS
 Run cpconfig to set SIC one-time password
Phase 3 — SIC & Policy Push
 In SmartConsole, initialize SIC using the one-time password set on the appliance
 Verify SIC status shows ✅ Communicating
 Install Policy (demo_policy) from SmartConsole
 Confirm policy install success for both Access and Threat Prevention layers
Phase 4 — Post-Deployment Validation
 Verify traffic passing through Tokyo gateway in SmartConsole Logs & Monitor
 Confirm IPS, Anti-Bot, and Anti-Virus are producing events (not silently failing)
 Validate Identity Awareness is detecting users/machines correctly
 Test URL Filtering and Application Control on a sample workstation
 Run a connectivity test from Tokyo LAN to a known-good destination
 Confirm no anti-spoofing violations in logs (drop on Rule 0)
 If VPN is enabled: test tunnel establishment and encrypted traffic flow
Phase 5 — Housekeeping
 Add Tokyo gateway to appropriate gateway groups (if applicable)
 Apply descriptive tags and comments to the gateway object
 Update your asset inventory and network diagram
 Schedule regular policy review and IPS update checks

📅 Rulebase data freshness note: The policy rulebase snapshot I have is from 2026-05-05 at 15:15 UTC. If demo_policy has been modified since then, verify the current rule set in SmartConsole before assigning it to Tokyo. You can also clone it into a dedicated Tokyo_policy package to isolate any future changes.

Let me know if you'd like help reviewing the demo_policy rulebase, cloning it for Tokyo, or configuring VPN communities!

Just now
chat dislike button
chat like button

---
