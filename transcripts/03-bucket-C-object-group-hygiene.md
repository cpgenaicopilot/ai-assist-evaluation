# Bucket C — Object & Group Hygiene

6 questions covering unused objects, duplicates, nested groups, dependency tracing, depth analysis, and an ambiguous name trap.

See final report Section 4 for per-bucket findings and scores.

---


## C001

Thought for 0.53 seconds
Management API Query

Here is a comprehensive breakdown of unused network objects in your environment that are candidates for cleanup:

🧹 Unused Object Cleanup Report

628 total unused objects were identified in the SMC User domain.

📊 Breakdown by Type
#	Type	Count
1	host	~610
2	data-center-object	4
3	group	2
4	access-role	2
5	network	1
6	address-range	1
7	security-zone	1
🔴 High-Priority Bulk Cleanup — Auto-Generated Demo Hosts (~600 objects)

The overwhelming majority are auto-generated hosts from an AI Firewall Demo environment, following the naming pattern AutoSec-<IP>-AIFWDemo / AutoSec_<IP>-AIFWDemo. All are tagged red and cover IPs in 203.x.x.x and 204.x.x.x public ranges._

⚠️ These are almost certainly safe to bulk-delete if the demo environment is no longer active. You can use SmartConsole's multi-select or script a bulk delete via the Management API filtered on the name pattern.

🟡 Individual Objects Requiring Manual Review

These non-auto-generated objects should be reviewed case-by-case before deletion:

Name	Type	Details
AD_Controller_Test1	host	172.17.28.20
Branch_PC	host	192.168.30.10
HQServer	host	192.168.1.10
Call Center	network	192.168.237.0/24
1.1.1.1-1.1.1.2	address-range	1.1.1.1 – 1.1.1.2
CME_Demo-CheckMates--VMssEastUs--GARTNERDEMO	group	Empty group
Corporate_Gateways	group	Empty group
Allowed Sources	data-center-object	Cloud-imported
Function=IP camera	data-center-object	Cloud-imported
Function=Media player	data-center-object	Cloud-imported
Function=Speaker	data-center-object	Cloud-imported
Chandler	access-role	Identity role
DevOps	access-role	Identity role
Finance	security-zone	Security zone
✅ Recommended Actions
Bulk-delete AutoSec-*-AIFWDemo hosts — Filter by name pattern in SmartConsole or via the Management API (delete host) in a scripted loop.
Individually review named objects — Confirm with the relevant teams that HQServer, Branch_PC, Call Center, etc. are truly obsolete before removing.
Delete empty groups — CME_Demo-CheckMates--VMssEastUs--GARTNERDEMO and Corporate_Gateways appear to be leftover from demo setups.
Verify identity/zone objects — Chandler, DevOps, and Finance may have been part of an Identity Awareness design that was never fully deployed.
Always take a database backup before bulk deletions, then Publish and Install Policy to finalize.*

💡 You can verify individual object usage further using the "Where Used" feature in SmartConsole (right-click → Where Used) to double-check before deletion.

23:28
chat dislike button
chat like button

---

## C002

Thought for 0.83 seconds
Policy Rulebase Analyzer

Here is a full breakdown of all duplicate and redundant network objects found in your policy. Note that the rulebase data I'm working from was last refreshed on May 5, 2026 at 15:15 UTC — any changes made after that date may not be reflected below.

🔍 Duplicate Network Object Analysis — AI_Assist_Demo
Summary Table
Severity	Type	Objects / Rules Affected
🔴 CRITICAL	Duplicate subnet (same IP, different names)	AWS eu-north-1 VPN GW Subnet vs Site01-Hub P2S Subnet → both 10.109.255.192/26 · Rules 26, 27, 114, 115+
🟠 HIGH	Same host IP in two groups	User-10.100.1.28 in both GRP-USR-PlatformTeam and GRP-USR-Administrators · Rules 3, 4
🟠 HIGH	Exact duplicate rule pair	Emergency IT Support - Protected! · Rules 3 & 4 (Rule 4 fully shadowed)
🟠 HIGH	Exact duplicate rule pair	GitLab Site01 EKS to OnlineMeetings Private Endpoints · Rules 236 & 237 (Rule 237 fully shadowed)
🟡 MEDIUM	Same group in both source & destination	Nagios-Hosts-AIFWDemo self-traffic with no service restriction · Rule 42
🔵 LOW	Naming inconsistency / functional duplicates	Two Nagios host objects with different naming conventions · Rules 41, 42, 51, 52, 200, 202, 258
1. 🔴 CRITICAL — Two Objects, Same Subnet (10.109.255.192/26)

These two objects are identical in value but have different names:

network:[AWS eu-north-1 VPN Gateway Subnet-AIFWDemo](action-1)
network:[Network_10.109.255.192-Site01-Hub-VPC-P2S_Subnet-AIFWDemo](action-2)

Both appear together in Rules 26, 27, 114, and 115 — resulting in the same /26 subnet listed twice as a source. This is confirmed by src_resolved showing 10.109.255.192/26, 10.109.255.192/26.

Recommended action: Determine the canonical name (the Site01-Hub variant is referenced far more widely), then retire the AWS eu-north-1 object and consolidate all references.

2. 🟠 HIGH — Host 10.100.1.28 is a Member of Two Groups

host:[User-10.100.1.28-AIFWDemo](action-3) exists simultaneously in:

GRP-USR-PlatformTeam-AIFWDemo
GRP-USR-Administrators-AIFWDemo

This causes the IP to appear twice in source expansion for Rules 3 and 4, and may grant unintended cumulative privileges if the two groups diverge in permissions.

Recommended action: Audit whether the dual membership is intentional, document it, or remove the redundant membership.

3. 🟠 HIGH — Exact Duplicate Rules

Pair 1 — Rules 3 & 4 (Emergency IT Support - Protected!)

Both are disabled, same source/destination/service (RDP TCP+UDP/3389). Rule 4 is completely shadowed by Rule 3 and will never be evaluated.
Recommended action: Delete Rule 4.

Pair 2 — Rules 236 & 237 (GitLab Site01 EKS to OnlineMeetings Private Endpoints)

Identical name, action (Accept), source (10.110.64.0/23), destination (two PE subnets), and service (HTTP/HTTPS). Rule 237 is completely shadowed.
Recommended action: Delete Rule 237. Investigate the root cause — likely a copy-paste error during policy editing.
4. 🟡 MEDIUM — Same Group in Source & Destination (Rule 42)

Rule 42 (DataCenter IT Network to ping_test_server) uses Nagios-Hosts-AIFWDemo in both source and destination, with no service restriction. All IPs in the source are also in the destination, creating a self-traffic rule with an unrestricted service wildcard.

Recommended action: Restrict Rule 42 to specific services (e.g., ICMP, SNMP) to reflect the actual monitoring intent.

5. 🔵 LOW — Nagios Host Naming Inconsistency

Two host objects serve the same functional role (Nagios monitoring) but use inconsistent naming prefixes (Nagios- vs Server-). They co-appear redundantly alongside their own parent group in Rules 41, 42, and 51.

Recommended action: Standardize the naming convention and reference these hosts exclusively via group:[Nagios-Hosts-AIFWDemo](action-6) in rules — avoid mixing individual host references with the group.

🛠️ Recommended Remediation Order
Merge the two 10.109.255.192/26 objects — highest impact, affects multiple active rules.
Delete Rules 4 and 237 — zero operational risk, immediate cleanup.
Audit User-10.100.1.28 dual group membership and document or resolve it.
Restrict Rule 42 to specific services to eliminate the no-service self-traffic entry.
Standardize Nagios host object naming and remove redundant individual references.
Just now
chat dislike button
chat like button

---

## C003

Thought for 1.7 seconds

The user wants to audit nested groups - looking for deep nesting, recursive references, or sprawl. This is best handled by the Management API Tool to fetch group objects and analyze their nesting, combined with the Policy Rulebase Analyzer to understand how these groups are used in the rulebase.

Let me use both tools simultaneously - the Management API to get group information and the Policy Rulebase Analyzer to understand group usage in policies.

I'll run both a group audit via the Management API and a rulebase analysis in parallel to get the full picture.

Policy Rulebase Analyzer
Management API Query

⚠️ Rulebase data freshness notice: The Policy Rulebase Analyzer snapshot was last refreshed on May 5, 2026 (~7 days ago). Recent group/rule changes since then may not be reflected in the rulebase portion of this report. The group membership data from the Management API is live.

🔍 Nested Group Audit Report — Full Analysis
1. 📊 Scope Summary
Metric	Value
Total groups	91
Groups with nested sub-groups	5
Maximum nesting depth detected	3 levels
Recursive references found	✅ None
Empty groups	⚠️ 6
Groups used in active policy rules	40+
Highest-impact shared object	Net_100.64.0.0 — member of 39 groups
2. 🏗️ Nesting Depth Analysis
⚠️ Deepest Chain — 3 Levels (Cloudflare Hierarchy)

Assessment: 3 levels is manageable, but note that both Cloudflare-AIFWDemo (L1) and A10 DX IPList-AIFWDemo (L2) are each independently referenced in 6 policy rules as traffic sources. This means the L2 group's scope is implicitly included wherever L1 is used — which can create unintended overlap between rules 102–109 and 151/158 if the CDN ranges overlap.

Recommendation: Document the L1/L2 rule overlap explicitly. Consider whether A10 DX IPList-AIFWDemo should appear standalone in rules, or exclusively through its parent Cloudflare-AIFWDemo, to avoid dual-path rule matching.

3. 🔁 Recursive Reference Check

✅ CLEAN — No recursive or circular group references found.

All membership chains terminate at leaf objects (hosts, networks, address-ranges, DNS domains). No group contains itself directly or indirectly.

4. 🕳️ Empty Groups — Cleanup Candidates
Group Name	Creator	Last Modified	Policy References
export_issue_cluster-node_280ff560-..._AcmeCorpSite01Firewall1	admin-api	2026-04-21	Rules 34, 256
export_issue_cluster-node_63a81643-..._AcmeCorpSite01Firewall2	admin-api	2026-04-21	Rules 34, 256
export_issue_fortinet-host_755c1628-..._firewall_admin	admin-api	2026-04-21	Rules 255, 256, 257
CME_Demo-CheckMates--VMssEastUs--GARTNERDEMO	WEB_API	2026-04-27	None
Dynamic Routing VPN Encryption Domain	gisraeli@checkpoint.com	2025-04-22	None
Security Gateways	WEB_API	2024-01-01	policy_insight rules 1, 2

🔴 Critical: The three export_issue_* groups are empty migration artifacts but are still actively referenced in policy rules (including some active rules). Because they are empty, they match no traffic — meaning any rule using them as source/destination is functionally a no-op or behaves unexpectedly. These should be resolved before the next policy push.*_

5. 🌐 Sprawl — Highly Shared Objects
Object	Type	Member of # Groups	Risk
Net_100.64.0.0 (100.64.0.0/24)	network	39 groups	High blast radius — any edit affects 39 groups simultaneously
Net_100.100.26.0 (100.100.26.0/24)	network	21 groups	Moderate blast radius

Both are MaaS tunnel networks distributed across per-gateway _maas_tunnel groups. While this is by design for SD-WAN infrastructure, treat both objects as read-only infrastructure — a mistaken edit propagates to dozens of VPN domain definitions instantly._

6. 📦 Oversized Groups — Sprawl Risk
Group	Members	Used In Rules	Concern
Adversaries IPSet-AIFWDemo	~50 hosts	Rules 1, 2 (threat block)	Static host list should be replaced with a dynamic IOC Feed
All_SD-WAN_Lans	25 networks	SD-WAN rule 7	Grants RDP + SSH mesh-wide across all branches — high risk
FWs	~20 gateways	SD-WAN rules 3, 6	Verify all gateway members are current
GRP-USR-PlatformTeam-AIFWDemo	21 hosts	Rules 3, 4 (duplicate)	Rule 4 is a disabled duplicate — clean up
Shodan	20 DNS domains	IoT policy	Periodic refresh needed as Shodan IP ranges change
7. 🔧 Groups Containing Gateway Objects
Group	# Gateways	Used As
FWs	~14	Install On column, SD-WAN inter-GW rules
FWs_External	~12 gateways + 2 networks	Install On / source
Corporate_Gateways	2	Policy install target
IoT Gateways	1	IoT policy install target
Playblocks_Gateways	2	VWAN policy target

Verify membership of FWs and FWs_External is current — decommissioned gateways left in these groups silently cause failed policy installs.

8. 🤖 Auto-Generated / CME-Managed Groups
Group	Tag	Action
CME_Demo-CheckMates--VMssEastUs--GARTNERDEMO	warn: auto-generated: CME	Do not edit manually
PrivateIPs	warn: auto-generated: CME	Do not edit manually

Editing CME-managed groups manually will cause CME to overwrite or conflict with your changes on the next sync cycle.

9. ✅ Prioritized Recommendations
Priority	Finding	Action
🔴 High	export_issue_* empty groups referenced in active rules	Remove from rules 34, 255–257, then delete the groups — they add no members and create opaque policy behavior
🔴 High	All_SD-WAN_Lans allows RDP + SSH across all 26 branch LANs	Restrict SSH/RDP to jump hosts or dedicated admin subnets only
🟡 Medium	Adversaries IPSet-AIFWDemo (~50 static hosts)	Replace with a Check Point IOC Feed or Threat Intelligence Feed object for automated updates
🟡 Medium	Net_100.64.0.0 in 39 groups	Tag as infrastructure read-only; restrict who can edit this object
🟡 Medium	L1/L2 dual-reference (Cloudflare + A10 DX both in rules)	Document or consolidate to avoid implicit overlap in ingress rules
🟡 Medium	Duplicate rules 3/4 referencing GRP-USR-* groups	Delete disabled rule 4
🟢 Low	Dynamic Routing VPN Encryption Domain empty group	Delete if not planned for use
🟢 Low	Security Gateways empty group (used in policy_insight rules)	Either populate with gateway objects or replace with FWs group
ℹ️ Info	Nagios-Hosts-AIFWDemo in both src and dst of Rule 42	Review if reflexive Nagios-to-Nagios any-service rule is intentional

Would you like me to drill deeper into any specific group hierarchy, trace all rules impacted by a particular group, or help you assess what would change if an empty group is removed from policy?

Just now
chat dislike button
chat like button

---

## C004

Thought for 0.96 seconds

I'll look up all references to DMZ_Servers using the Management API — checking rules, NAT entries, groups, and any other dependencies in one go.

Management API Query

I'll look up all references to DMZ_Servers using the Management API — checking rules, NAT entries, groups, and any other dependencies in one go.The object DMZ_Servers does not currently exist in your security management database. All search methods — including direct name lookup, wildcard group search, and where_used — returned no results.

Here's a summary of what was checked:

Check	Result
Group named DMZ_Servers	❌ Not found
Any object named DMZ_Servers	❌ Not found
where_used lookup	❌ 404 – Object not found
Groups containing DMZ	❌ No matches
Possible Explanations

Typo or naming variation — The group might be stored under a slightly different name. Common variations to try:

DMZ-Servers
DMZServers
DMZ_Server (singular)
DMZ_Hosts

Multi-Domain environment — If you're running a Multi-Domain setup, the object may live in a different domain than the one currently being queried. Let me know the domain name and I can search there.

Object was deleted — It may have been removed from the policy at some point. Historical references would no longer appear.

Different object type — It could be defined as a network, host, or address-range rather than a group.

To continue, let me know:

The exact name or a name variation you'd like me to try, or
The domain name to search within (for Multi-Domain environments).
Just now
chat dislike button
chat like button

---

## C005

Thought for 6.52 seconds

I'll query both the Management API (for live group object data) and the Policy Rulebase Analyzer (to cross-reference groups used in rules) simultaneously to get a comprehensive picture.

Policy Rulebase Analyzer
Management API Query
Network Group Nesting Depth Analysis

⚠️ Data Freshness Notice: The Policy Rulebase Analyzer snapshot is from May 5, 2026 — recent group changes (up to May 12) may not be reflected. The Management API results are live.

✅ Bottom Line: No Groups Exceed 5 Levels of Nesting

After a full recursive analysis of all 91 network groups in this environment, no group exceeds 5 levels of nesting depth. The deepest chain found is 4 levels.

🏆 Groups Ranked by Nesting Depth
Rank	Group Name	Max Depth	Maintenance Risk
1	Cloudflare-AIFWDemo	4	🟡 Monitor
2	A10 DX IPList-AIFWDemo	3	🟢 Acceptable
3	FWs	2	🟢 Acceptable
—	All remaining 88 groups	1 (flat)	✅ Healthy
🔗 Deepest Nesting Chain Visualized
📋 Policy Rulebase — Rules Referencing Deep Groups

The two deepest groups are actively used in production rules:

Group	Referenced In	Rules	Purpose
Cloudflare-AIFWDemo	AI_Assist_Demo / AcmeCorp-Network Policy	102, 104, 106, 108, 151, 158	Cloudflare ingress to Tyk, SafeLinks, OnlineMeetings
A10 DX IPList-AIFWDemo	AI_Assist_Demo / AcmeCorp-Network Policy	103, 105, 107, 109, 151, 158	A10 regional IPs to same production services
📌 Summary Statistics
Metric	Value
Total groups analyzed	91
Groups with depth > 5	0 ✅
Groups with depth 4	1 (Cloudflare-AIFWDemo)
Groups with depth 3	1 (A10 DX IPList-AIFWDemo)
Groups with depth 2	1 (FWs)
Flat groups (depth = 1)	88
💡 Recommendations
Cloudflare-AIFWDemo (Depth 4) — While below your 5-level threshold, this group is used in 6 production inbound rules. Audit its membership in SmartConsole periodically to ensure no stale or unauthorized IPs have been added at any nesting tier.
Duplicate Members — DataEx CorporateOffice PublicIP-AIFWDemo and Helix-204.85.179.130-AIFWDemo appear both in Cloudflare-AIFWDemo directly and inside A10 DX IPList-AIFWDemo (a child). This redundancy is harmless functionally but worth cleaning up for clarity.
Proactive Governance — Set an internal policy cap at 5 levels of nesting depth and enforce it during change reviews to prevent future maintenance liabilities as the group inventory grows.
Just now
chat dislike button
chat like button

---

## C006

Thought for 0.01 seconds
Management API Query

It looks like there is no host object with the exact name "Server" in the management system. However, 64 host objects containing "Server" in their name were found.

Here are some notable matches to help you narrow it down:

#	Name	IP Address
1	DNS Server	10.0.0.138
2	ERP Server	10.0.0.60
3	FileServer	10.33.11.1
4	FTP Server	172.16.0.3
5	HR Server	10.0.0.69
6	Jump Server	10.10.0.10
7	Proxy Server	151.20.4.142
8	Public FTP Server	151.20.4.15
9	Jira_server	192.168.28.14

To help locate the right object, could you:

Confirm the exact name of the host object you're looking for?
Or provide the IP address associated with it so I can search more precisely?
Just now
chat dislike button
chat like button

---
