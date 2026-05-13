# Bucket F — Troubleshooting

8 real support cases: dropped traffic, install failure, VPN flapping, SIC issues, HTTPS Inspection, false positive patterns, repeated drops, HA failover.

See final report Section 4 for per-bucket findings and scores.

---


## F001

Thought for 1.73 seconds

I'll run a parallel investigation — checking recent traffic logs for the drop event, and scanning the access rulebase for rules matching this traffic pattern.

Policy Rulebase Analyzer
Analyzing policy
Processing analysis results
Analysis complete
Log Query Analysis and Execution

Here's a consolidated breakdown of what I found across logs and policy analysis:

🔍 Troubleshooting: 10.50.10.5 → 8.8.8.8:443 (HTTPS)

Note on rulebase data freshness: The policy snapshot is from May 5, 2026. Rules added or modified after that date may not be reflected. For live validation, verify via the Management API. Note on logs: No matching drop events were found in the last 24 hours. Either the block occurred outside this window, logging is not enabled for the dropping rule, or the traffic hasn't been attempted recently.

🚫 Most Likely Blocking Rules

Based on the source IP (10.50.10.5), which is not a recognized internal subnet in most policy packages, traffic falls through to cleanup/deny rules across multiple packages:

#	Package	Rule	Rule Name	Action	Why It Fires
1	demo_policy	Rule 9	Block all web traffic	Drop	Explicitly drops Any → Any on HTTP/HTTPS (443). No earlier rule matches 10.50.10.5. Most likely culprit.
2	policy_insight	Rule 13	Cleanup rule	Drop	Rule 4 (10.0.0.0/8 → Internet) is disabled, so traffic falls to cleanup Drop.
3	Corporate_Policy	Rule 23 / 4.13	Cleanup	Drop	10.50.10.5 may not match InternalZone depending on interface topology.
4	AI_Assist_Demo	Rule 267	Housekeeping rule	Drop	10.50.10.5 is not in any AI_Assist_Demo source group (all are 10.100.x/10.108–114.x).
5	Branch_Office_Policy	Rule 8	Cleanup	Drop	Source not in Branch LAN (145.80.110.0/24).
✅ Packages Where Traffic Would Be Accepted
Package	Rule	Why Accepted
SD-WAN_Gateways_Policy	Rule 10.3	Any → Internet on port 443 — accepted on all SD-WAN branch gateways
AIOPS_Policy	Rule 1	Blanket Accept-All (Any/Any/Any) — ⚠️ overly permissive
🔎 What You Should Check

Identify the enforcing gateway

Confirm which gateway this traffic is passing through (check routing for 10.50.10.5).
The block is consistent with gateways enforcing demo_policy, Corporate_Policy, or AI_Assist_Demo. Use SmartConsole → Gateways & Servers to see which policy package is installed on each gateway.

Enable logging on the drop rule

If demo_policy Rule 9 or Corporate_Policy Rule 23 don't have logging enabled, drop events won't appear in logs. Ensure the Track column is set to Log on those rules.

Is 10.50.10.5 a legitimate internal host?

The subnet 10.50.0.0/x is not defined in any internal network group in the analyzed packages. If this host should have internet access, it needs to be added to the appropriate source group (e.g., the group used in Corporate_Policy or demo_policy internet-access rules).

Check policy_insight Rule 4 — it's DISABLED

This rule (Internet Access) would match 10.0.0.0/8 → non-internal on Any) and likely covers 10.50.10.5 — but it's disabled. If this host should have internet access, re-enabling and reviewing this rule (with appropriate service restriction) may be the fix.

Verify anti-spoofing

If the gateway has anti-spoofing configured and 10.50.10.5 doesn't belong to any defined topology, the traffic could be dropped at Rule 0 (before any user rules). Check for rule_number = 0 drops in SmartConsole logs.

Check HTTPS Inspection

If the gateway has HTTPS inspection enabled, a misconfigured bypass/inspect rule could also interfere. Verify the HTTPS inspection rulebase allows or bypasses this traffic appropriately.

Would you like me to dig deeper into any specific package, gateway, or rule?

Just now
chat dislike button
chat like button

---

## F002

Thought for 1.23 seconds

I'll investigate this in parallel — querying the logs for the installation failure and fetching gateway details at the same time.

Management API Query
Log Query Analysis and Execution

Let me dig deeper — searching audit logs more broadly and also checking for any recent changes that could have caused the failure.

Log Query Analysis and Execution

Here is a full diagnostic summary based on all the data I gathered. I want to be transparent about what was and was not found.

🔍 Diagnosis: Policy Installation on Remote-Berlin
1. What Was Found — The Error

No explicit "Install Policy – Failure" audit log was found for 2026-05-11. This means one of the following:

The installation failure may have been triggered slightly outside the day boundary (i.e., very late May 10 or early May 12)
The failure event may not have been ingested into audit logs (e.g., it was initiated from SmartConsole but not fully recorded)
The gateway name referenced in your report may differ slightly from Remote-Berlin

⚠️ You should verify the exact timestamp of the failure in SmartConsole → Logs & Monitor → Audit Logs, filtering for Operation = Install Policy and Gateway = [Remote-Berlin](action-1).

2. What Was Observed on Remote-Berlin (May 11)
Time (UTC)	Operator	Operation	Status	Object
03:21:27	WEB_API	Run One Time Script	In Progress	Remote-Berlin
03:21:30	WEB_API	Run One Time Script	In Progress	Remote-Berlin
03:21:40	WEB_API	Run One Time Script	In Progress	Remote-Berlin
03:21:44	WEB_API	Run One Time Script	In Progress	Remote-Berlin

Four "Run One Time Script" operations were run against Remote-Berlin at ~03:21 UTC via WEB_API. These are all stuck in "In Progress" status — none completed successfully. This is a strong indicator of an issue with the gateway at that time (connectivity, daemon, or resource problem).

3. What Changed — Gateway State & Policy Status

From the current gateway state:

Item	Detail
Last policy install	NEW policy installed 2026-04-15 — nothing successfully pushed since
Threat Prevention policy	❌ Not installed at all — significant security gap given IPS, Anti-Bot, Anti-Virus are enabled
Last modification	Gateway object last modified 2026-04-15 by gisraeli@checkpoint.com
SIC Status	✅ Communicating (as of now)
Version	R82.10 on Gaia

The fact that no policy has been successfully installed since April 15 is notable — nearly a month gap.

4. How to Fix — Recommended Steps

Confirm the exact failure message in SmartConsole:

Go to Logs & Monitor → Audit Logs
Filter: Operation = Install Policy, Object = [Remote-Berlin](action-1), widen the date range if needed
The error detail column will show the exact reason (e.g., SIC failure, verification error, timeout)

Investigate the stuck scripts — The "Run One Time Script – In Progress" events from May 11 suggest the gateway may have been unresponsive or a daemon was hung:

SSH to Remote-Berlin (100.100.51.80) and run:

Re-verify SIC from SmartConsole:

Open the Remote-Berlin gateway object → Communication → click Test SIC Status
If SIC is broken, reset it with Reset and re-initialize

Re-attempt policy installation:

Once SIC and processes are confirmed healthy, go to Policy → Install Policy
Select the NEW package and target Remote-Berlin
Review the installation progress window for any real-time errors

Install the Threat Prevention policy — IPS, Anti-Bot, and Anti-Virus blades are enabled but the Threat Prevention policy has never been installed on this gateway. Push it immediately after resolving the access policy issue.

⚠️ What I Could Not Confirm
The exact error message of the installation failure (not captured in the available audit logs for that day)
What specific change triggered the failure — no policy changes or rule modifications were logged on May 11 that would explain a new failure
Whether the "Run One Time Script" operations are related to the policy installation or a separate automation

Would you like me to search a broader time window for the Install Policy audit event, or look into the Threat Prevention policy gap in more detail?

I have one report that might be useful for you:

Audit Overview - Remote-Berlin audit activity and policy-related changes yesterday (2026-05-11)

Just now
chat dislike button
chat like button

---

## F003

Thought for 0.94 seconds

I'll investigate this simultaneously across all three angles — VPN community config, recent VPN logs, and comparison with other tunnels. Running all three queries in parallel now.

Management API Query
Log Query Analysis and Execution

I'll investigate this simultaneously across all three angles — VPN community config, recent VPN logs, and comparison with other tunnels. Running all three queries in parallel now.Here is a full breakdown of what was found across all three investigation angles:

🔍 VPN Tunnel Investigation — AWS VPC Drop Issue
⚠️ Critical Finding: No AWS VPC Community Exists

The management configuration search did not find any VPN community connected to an AWS VPC. The only cloud community configured is GCP_Mesh (Google Cloud Platform). This is an important first-level finding — it means either:

The AWS tunnel is configured as an interoperable device within an existing community that isn't labeled "AWS"
The AWS tunnel was recently removed from the management config
The tunnel is being managed outside of SmartConsole (e.g., directly on the gateway CLI or via a 3rd-party tool)
1. 🛠️ VPN Communities Found — Full Comparison
Community	Type	Encryption	IKE Phase 1 Rekey	Phase 2 Rekey	PFS	IKEv	Notes
Gartner-2026	Mesh	AES-256 / AES-GCM-128	1440 min	3600 sec	✅	v2 only	Healthy config
GCP_Mesh	Mesh	AES-256 / AES-256	600 min	10800 sec	✅	v2 only	⚠️ Short Phase 1 rekey (600 min)
SDWAN_Star	Star	AES-256 / AES-GCM-128	1440 min	3600 sec	❌	v2 only	12 satellites, no PFS
Partner DC LAN	Mesh	AES-256 / AES-128	1440 min	3600 sec	❌	v1/v2	Legacy SHA-1
Site2Site	Mesh	AES-256 / AES-128	1440 min	3600 sec	❌	v1/v2	Legacy SHA-1
MyIntranet	Mesh	AES-256 / AES-128	1440 min	3600 sec	❌	v1/v2	No gateways assigned
2. 📋 VPN Event Logs (Last 24 Hours)

No VPN drop, IKE failure, or tunnel-down events were found in the logs for the last 24 hours. This could mean:

Logs are not being forwarded/ingested correctly for VPN events
The gateway hosting the AWS tunnel may not be sending logs to the management log server
The drop may have occurred outside the 24-hour window
3. 🔬 Configuration Red Flags to Investigate

Based on the config review and common AWS VPN tunnel drop root causes:

#	Issue	Detail	Recommendation
1	AWS community not found in SmartConsole	No community references AWS VGW or Transit Gateway	Verify the interoperable device and community assignment in SmartConsole
2	GCP_Mesh Phase 1 rekey = 600 min	Very short for a cloud tunnel; mismatches can cause drops	Align with AWS's default: 480 min (8 hrs) for Phase 1
3	Phase 2 rekey = 10800 sec (3 hrs) on GCP_Mesh	AWS default Phase 2 lifetime is 3600 sec (1 hr) — a mismatch here is a classic cause of every-few-hours drops	Set Phase 2 to 3600 sec to match AWS
4	IKEv1 used in legacy communities	Partner DC LAN, Site2Site use IKEv1	AWS recommends IKEv2 — ensure the AWS tunnel uses IKEv2
5	DPD (Dead Peer Detection) not visible	Not confirmed active on the relevant community	Verify DPD is enabled to detect and recover dropped tunnels
6	Permanent Tunnels not confirmed	Not all communities have permanent tunnels configured	Enable Permanent Tunnels on the AWS community to force renegotiation proactively
📌 Recommended Next Steps
Identify the correct community — Search SmartConsole for an interoperable device with the AWS VGW public IP (usually from 3.x.x.x, 52.x.x.x, or 54.x.x.x ranges) and confirm which community it belongs to.
Check Phase 2 lifetime alignment — AWS VGW hard-resets the SA at its own lifetime expiry. If your gateway's Phase 2 rekey timer doesn't align, the tunnel drops. Use vpn tu on the gateway CLI to inspect active tunnel SAs.
Review gateway logs directly — Run vpn debug ikeon on the gateway and check /var/log/vpnd.elg for IKE negotiation failures at the time of the drop.
Verify log ingestion — Confirm the gateway is sending logs to the management server (fw log -f or SmartConsole logs view) since no VPN events were returned from the log database.
Check NAT-T — If the Check Point gateway is behind NAT, ensure NAT Traversal (NAT-T) is enabled in the community, as AWS requires it in such cases.

💡 Can you confirm the name of the interoperable device or the public IP of the AWS Virtual Private Gateway? That will allow a more targeted lookup to find the exact community and configuration details driving the drops.

Just now
chat dislike button
chat like button

---

## F004

Thought for 0.92 seconds

I'll check the cluster status via the Management API and query the logs for SIC-related events simultaneously.

Management API Query
Log Query Analysis and Execution

Here is a full breakdown of the Corporate-Cluster SIC situation:

🔍 Corporate-Cluster — SIC Trust & Cluster Status Report
1. Current Cluster Status
Component	SIC Status	Notes
Corporate-Cluster (VIP 17.23.5.1)	⚠️ Uninitialized	Management cannot communicate with the cluster object
Member A (17.23.5.2)	✅ Initialized	Certificate created, but full comms not confirmed
Member B (17.23.5.3)	✅ Initialized	Certificate created, but full comms not confirmed
Policy Installed	❌ None	No policy is currently pushed to this cluster

Key distinction: Both individual members show SIC as Initialized (certificates exist), but the cluster-level object is Uninitialized — meaning the management server cannot fully communicate with the cluster VIP. Policy installation will fail until this is resolved.

2. What Changed Recently — The Likely Root Cause

Audit logs from 2026-05-03 at 08:46 reveal a highly significant event:

Timestamp	Operation	Action	Target	Status
2026-05-03 08:46:39	Run One Time Script	Forgot Passcode	Corporate-Cluster	❌ Failure
2026-05-03 08:46:39	Run One Time Script	Forgot Passcode	Member A	❌ Failure
2026-05-03 08:46:39	Run One Time Script	Forgot Passcode	Member B	⏳ In Progress → ❌ Failure
2026-05-03 08:46:40–47	Run One Time Script	Forgot Passcode	Member B	❌ Failure (repeated)

🔑 The "Forgot Passcode" operation is the SIC reset/re-initialization script used when the gateway's SIC activation key is lost or needs to be reset. The fact that it failed across all cluster objects is the smoking gun — SIC was never successfully re-established after this reset attempt, leaving the cluster in an uninitialized/broken SIC state.

3. When Was SIC Last Working?
The last modification to both member objects was 2026-01-18 by System, suggesting the cluster was last in a known-good state around that time.
The SIC break is directly tied to the failed passcode reset on 2026-05-03.
No successful policy installation appears in the last 30 days.
4. Recommended Remediation Steps

To restore SIC on the cluster, you should:

Reset SIC on the cluster object in SmartConsole:
Right-click Corporate-Cluster → Communication → Reset
Set a new one-time activation key
Re-initialize SIC on each gateway member via cpconfig on the gateway CLI:
Run cpconfig → Select Secure Internal Communication → Enter the same activation key set in SmartConsole
Test connectivity from SmartConsole — the SIC status should change to Communicating
Re-install the policy once SIC is confirmed

⚠️ Note: The cluster is running R80.40, which is an older version. After restoring SIC, consider planning an upgrade to R81.20 or R82 for long-term supportability.

If you need step-by-step guidance on the SIC reset process or the cpconfig procedure, I can provide detailed instructions.

I have one report that might be useful for you:

Audit Overview - Corporate-Cluster audit activity

Just now
chat dislike button
chat like button

---

## F005

Thought for 0.66 seconds

Sure! Let me simultaneously pull relevant logs and check the HTTPS Inspection rulebase to trace the issue.

Log Query Analysis and Execution
Management API Query

Good data gathered. Now let me dig deeper — checking for any HTTPS-related error events in the logs and also querying the access rulebase for any blocks on HTTPS/TLS traffic.

Log Query Analysis and Execution

Here is a comprehensive trace of the issue based on what was found:

🔍 HTTPS Inspection — Connection Reset Trace
1. Log Analysis Results

No explicit Drop/Block/Reject logs were found in the last 24 hours for outbound HTTPS traffic from the HTTPS Inspection, Application Control, or URL Filtering blades.

This is a significant clue on its own — "connection reset" symptoms without hard-block logs are a strong indicator of an HTTPS Inspection interception failure (e.g., certificate validation error on the client side or a protocol mismatch), rather than a policy-level block. These often appear silently from the gateway's perspective.

2. HTTPS Inspection Rulebase — Findings

Here's the current outbound HTTPS inspection policy and its implications:

#	Rule Name	Status	Action	Destination	Site Categories
1	Health, Finance & Gov HTTPS Rule	🔴 Disabled	Bypass	Internet	Financial, Health, Gov/Military
2	Bypass corporate sites	🟢 Enabled	Bypass	.corp.com	Any
3	Bypass MS Teams/Skype	🟢 Enabled	Bypass	Microsoft Teams Worldwide	Any
4	Bypass sensitive categories	🟢 Enabled	Bypass	Internet	Health, Financial Services
5	Predefined Cleanup Rule	🟢 Enabled	Inspect	Internet	Any

Rule 5 (Inspect-All) is the catch-all — any HTTPS traffic that doesn't match a bypass rule is actively inspected.

3. Root Cause Analysis

Based on the evidence, here are the most likely causes ranked by probability:

🔴 Most Likely — SaaS App Uses Certificate Pinning

Many SaaS applications (e.g., Google Workspace, Salesforce, Dropbox, Zoom) use certificate pinning — they reject any TLS certificate that isn't their own. When the gateway intercepts the connection and presents the Outbound Certificate instead of the app's real cert, the client or the server rejects it → connection reset.

What to check: Identify the specific SaaS application and verify if it uses certificate pinning or mutual TLS (mTLS).

🟠 Likely — SaaS App Not Bypassed

The SaaS application falls under Rule 5 (Inspect), meaning its traffic is being intercepted. If the SaaS vendor's servers do not tolerate inspection (e.g., they validate the upstream certificate chain), the server-side TLS handshake will fail → TCP RST sent back to the client.

What to do:

In SmartConsole, navigate to Security Policies → HTTPS Inspection
Add a new Bypass rule above Rule 5 targeting the SaaS application's domain/IP/Updatable Object
Install policy
🟡 Possible — Outbound Certificate Not Trusted by Clients

If the Outbound Certificate used by the gateway is not distributed to client machines as a trusted CA, clients will reject the intercepted certificate and reset the connection.

What to check: Confirm the HTTPS Inspection CA certificate is deployed via GPO or MDM to all client machines.

🟡 Possible — Rule 1 is Disabled

Rule 1 (bypass for Health, Finance, Government) is currently disabled. If the SaaS application falls under a Government or Government-adjacent category, it would fall through to Rule 5 (Inspect) instead of being bypassed.

What to do: Re-enable Rule 1 if appropriate, or verify whether the SaaS app's URL category is being classified under a bypassed category.

🟡 Possible — No Logging on Active Rules (Blind Spot)

Rules 2–5 all have Track: None — meaning there are no logs being generated for inspected or bypassed connections. This explains why logs show no records and makes it very difficult to trace specific failures.

What to do: Temporarily set Track: Log on Rule 5 (Inspect) to capture which connections are being intercepted, then reproduce the issue and review SmartConsole logs.

4. Recommended Actions
Identify the SaaS application — Get the exact domain(s) affected from the users.
Enable logging on Rule 5 — Set Track: Log temporarily to gain visibility.
Add a Bypass rule for the SaaS app — Place it above Rule 5 targeting the specific domain, IP range, or Check Point Updatable Object (if available for that app).
Verify CA distribution — Confirm the Outbound Certificate CA is trusted by all client endpoints.
Re-evaluate Rule 1 — Consider re-enabling the Government/Finance/Health bypass if relevant to the SaaS category.
Reproduce and verify — After adding the bypass, ask users to retry and confirm resolution.

💡 Pro Tip: Check Point maintains a library of Updatable Objects for popular SaaS platforms (Microsoft 365, Google, Zoom, Salesforce, etc.) that automatically stay up to date with vendor IP/domain changes — ideal for building accurate bypass rules without manual maintenance.

Would you like guidance on how to create a bypass rule for a specific SaaS application, or how to deploy the HTTPS Inspection CA certificate to endpoints?

Just now
chat dislike button
chat like button

---

## F006

Thought for 1.77 seconds

I'll investigate this from two angles simultaneously — querying the logs for Anti-Bot blocking events related to your marketing team, and pulling the threat prevention rulebase configuration.

Log Query Analysis and Execution
Management API Query

The first query returned no records when filtering specifically on marketing group membership — let me broaden the log search to capture all Anti-Bot blocks that may involve marketing users (who may not be tagged with a "marketing" group in logs).

Log Query Analysis and Execution

Here is a comprehensive analysis of the Anti-Bot situation across logs and policy configuration.

🤖 Anti-Bot Investigation — Marketing Team False Positive Analysis

Log data covers: May 5–12, 2026 | Policy data: Live read from Standard Threat Prevention

1. 🔍 Marketing-Specific Log Findings

No Anti-Bot block events were found that are directly attributed to marketing team users or group membership in the logs. This means one of three things:

Marketing users are not authenticated/identified in the logs (identity awareness may not be tagging them)
The affected machines' usernames are not appearing in log records
The blocks are occurring but mapped to IPs without user identity context

To identify the specific marketing machines, you should correlate the blocking events below with the IP range or hostnames used by your marketing team.

2. 📊 Top Anti-Bot Blocking Events (Tenant-Wide, May 5–12)
#	Resource / Domain	Protection Name	Confidence	Severity	Hit Count
1	uspe.qeajypus.top (long URL)	dga-WpefV.TC.69feXvpS	High	Low	9,860
2	192.168.196.118/ogkrl.php	Backdoor.Win32.Taidoor.A	High	Critical	4,194
3	sc1.checkpoint.com/…TestAntiBotBlade	Check Point - Testing Bot	High	Medium	3,728
4	uspe.qeajypus.top (DNS)	dga-WpefV.TC.69feXvpS	High	Low	2,438
5	a.top4top.io/m_1725zobal2.mp3	Crypter.TC.eb	High	Critical	2,373
6	ted-boker.co.za (full URL)	Infecting URL.RS.TC.49ccZaXa	High	High	2,192
7	ted-boker.co.za (domain)	Infecting URL.RS.TC.49ccZaXa	High	Medium	1,996
3. 🧠 False Positive Assessment

Based on the log data, the blocks observed do NOT appear to be false positives — here's why:

Protection	Verdict	Reason
dga-WpefV.TC.69feXvpS	⚠️ Investigate	DGA (Domain Generation Algorithm) — uspe.qeajypus.top has characteristics of algorithmically-generated C2 domains. Could be a research tool using DGA-like naming.
Backdoor.Win32.Taidoor.A	🔴 True Positive	Known RAT (Remote Access Trojan) calling back to an internal IP — this is a real infection on Win7-Taylor (user: Jason Taylor), NOT a false positive.
Check Point - Testing Bot	🟡 Test Traffic	This is Check Point's own Anti-Bot test URL. Likely automated testing or a security tool — not a false positive, but expected noise.
Crypter.TC.eb	🔴 True Positive	Crypter/packer traffic — highly suspicious. Not a research site.
Infecting URL.RS.TC.49ccZaXa	⚠️ Investigate	ted-boker.co.za appears to be a compromised e-commerce site. Could be legitimate browsing of a site with injected malicious content.
4. ⚙️ Policy Configuration — Contributing Factors
Profiles Applied to Marketing Traffic

If marketing users fall under the general network scope (no dedicated rule), they are most likely hitting Rule 4 — Recommended Protections with the Optimized profile:

Setting	Value	Impact
Severity Threshold	Medium or above	Low-severity threats are blocked (the DGA hit above is Low severity but still blocked)
Confidence Medium/High	Prevent	Blocks aggressively on any medium+ confidence hit
Confidence Low	Detect only	Low-confidence hits are logged, not blocked
Auto-activate new protections	✅ Yes	New protections activate immediately — could cause sudden new blocks
⚠️ Critical Policy Risk — Global Exception #5

There is a global exception (Exception #5) that sets Anti-Bot to Inactive for the entire All_Internet scope. If this exception is active and matching, it may be suppressing legitimate Anti-Bot enforcement rather than causing over-triggering. You should verify whether this exception is enabled or disabled.

🔒 Locked Exception — Requires Attention

Exception #3 (Exception Rule for frequently matched) is locked by roige@checkpoint.com, downgrading Anti-Bot from Prevent → Detect. This may be the intentional tuning for over-triggering scenarios — you should coordinate with that administrator.

5. ✅ Recommended Actions

Identify marketing machines by IP/hostname — Cross-reference your marketing team's IP range or device names against the blocked resources above (especially uspe.qeajypus.top and ted-boker.co.za).

Investigate Win7-Taylor / Jason Taylor immediately — The Backdoor.Win32.Taidoor.A blocks are not a false positive. This machine shows signs of a real bot infection and should be isolated and remediated.

Review the DGA detection on uspe.qeajypus.top — If marketing researchers are using tools that generate DGA-like domain queries, you can create a scoped exception in the threat prevention rulebase specifically for the marketing source group, downgrading to Detect rather than Prevent.

Audit Global Exception #5 — Verify whether the "Inactive" Anti-Bot exception for All_Internet is intentionally active. If it is enabled, it may be masking broader Anti-Bot coverage gaps.

Coordinate with roige@checkpoint.com — The locked Exception #3 suggests intentional tuning was already applied. Understanding the context of that change may explain the marketing team's experience.

Enable Identity Awareness logging for marketing — The absence of user attribution in most log entries makes it difficult to isolate marketing-specific traffic. Ensuring Identity Awareness properly tags marketing group members will help pinpoint their blocks.

💡 Bottom line: The Anti-Bot blocks seen in logs are largely legitimate true positives, not false positives. The marketing team's complaint is more likely due to a compromised machine or a shared network segment being flagged, rather than the policy over-triggering on research sites. The priority action is investigating Jason Taylor's machine for active bot infection.

I have a few reports that might be useful for you:

Important Attacks - Anti-Bot blocked traffic — identifying over-triggering protections and false positive patterns
Threat Prevention - Anti-Bot blocked incidents - false positive & over-triggering analysis
Cyber Attack View Gateway - Anti-Bot blocked traffic — identifying over-triggering protections and potential false positives
Infected Hosts - Anti-Bot blocked traffic — infected hosts overview for false positive analysis

Just now
chat dislike button
chat like button

---

## F007

Thought for 1.41 seconds

Let me query the logs for dropped traffic from that source IP right away.

Log Query Analysis and Execution

The query returned no records for dropped traffic from 10.108.50.10. Let me broaden the search — looking at all traffic from that IP (regardless of action) and also expanding the timeframe — to confirm whether this host has any log presence at all.

Log Query Analysis and Execution

Let me query the logs for dropped traffic from that source IP right away.The query returned no records for dropped traffic from 10.108.50.10. Let me broaden the search — looking at all traffic from that IP (regardless of action) and also expanding the timeframe — to confirm whether this host has any log presence at all.Both queries returned no records for 10.108.50.10. Here's a clear summary of what was found and what this means:

🔍 Investigation Results for 10.108.50.10
What Was Queried
Query	Scope	Result
Dropped/Blocked/Rejected traffic from 10.108.50.10	All time up to now	❌ No records
All connection traffic (any action) from 10.108.50.10	All time up to now	❌ No records
Possible Explanations

Logs not yet ingested — There may be a delay between gateway enforcement and log ingestion into the management platform. If the drops are very recent, wait a few minutes and retry.

IP is behind NAT — The gateway may be logging the post-NAT IP rather than 10.108.50.10. Check if this host is being NATted to a different address, and search for that translated IP instead.

Traffic not reaching the gateway — The drops may be occurring at a layer below the Check Point gateway (e.g., a switch ACL, a router, or another inline device), which would mean no log entry would appear here.

Wrong log source / gateway — The logs being queried are tied to a specific gateway/log server. If the traffic is enforced by a different gateway not connected to this management instance, logs won't appear here.

Anti-spoofing drop (Rule 0) — If the source IP is appearing on the wrong interface, the gateway may be dropping it silently as a spoofed packet before logging it normally. These can appear as "Drop on Rule 0" and may require a separate query.

Recommended Next Steps
Verify the source IP — Confirm 10.108.50.10 is the actual IP seen at the gateway interface (not behind NAT).
Check for "Rule 0" drops — Ask me to search specifically for anti-spoofing drops tied to this IP.
Confirm the enforcing gateway — Identify which gateway is supposed to be handling this traffic and ensure it's sending logs to this management server.
Check SmartConsole logs directly — Open Logs & Monitor → New Tab → Logs, filter by src:10.108.50.10 with action Drop, and verify if entries appear there but not yet ingested here.

Would you like me to run a search for Rule 0 / anti-spoofing drops, or investigate a different IP that might be the post-NAT address?

Just now
chat dislike button
chat like button

---

## F008

Thought for 1.43 seconds

I'll look into this from two angles simultaneously — querying the logs for the failover event and checking the current gateway status.

Log Query Analysis and Execution
Management API Query

Here's a full picture of what I found — combining log data and live management state:

Corporate-Cluster — HA Failover Investigation
1. 🔍 What Triggered the Failover?

No log records were returned for the failover event from the ingested logs for the night of 2026-05-11. This could mean:

The HA event logs were generated by the cluster members' OS/kernel (CCP — Cluster Control Protocol) and may not have been forwarded to the log server.
Logs from the cluster may be associated with individual member names (e.g., [Corporate-Cluster](action-1)-member-A) rather than the cluster VIP object Corporate-Cluster.
The Cluster SIC is uninitialized at the management level — this may be causing gaps in log forwarding.

To definitively determine the failover trigger, run the following on each cluster member via CLI:

bash
cphaprob stat          # Current HA state
cphaprob -a if         # Interface/problem status
cat $FWDIR/log/messages | grep -i failover
2. 💥 Impact on Traffic

I could not retrieve traffic-impact data from logs for the same reason above. However, for a ClusterXL High Availability failover, the typical impact is:

Active connections passing through the formerly-Active member are dropped and must be re-established by clients (unless full connection sync was active).
New connections are re-routed to the newly-Active member, usually within seconds.
Duration of impact depends on how quickly CCP detected the failure and promoted the Standby member.
3. 🩺 Is Everything Healthy Now?

Based on the management API, there are several concerns that warrant attention:

Area	Status	Detail
Cluster SIC	🔴 Uninitialized	Management server cannot communicate with the cluster VIP — this is a significant issue
Member A SIC	🟡 Initialized	SIC trust established at member level
Member B SIC	🟡 Initialized	SIC trust established at member level
Policy	❌ None installed	No access or threat prevention policy has been pushed to this cluster
Gateway Version	⚠️ R80.40	End-of-support version — upgrade to R81.20 or R82 is strongly recommended
Live HA State	⚠️ Unknown	Active/Standby state cannot be determined via Management API alone
4. 📋 Recommended Next Steps
Verify live HA state — SSH into both members and run cphaprob stat to confirm which is Active and which is Standby, and whether sync is healthy.
Check cluster sync — Run fw ctl pstat to verify state synchronization is functioning.
Reinitialize cluster SIC — The uninitialized SIC at the cluster level needs to be resolved in SmartConsole (right-click the cluster → Communication → Reset).
Push a policy — No policy is currently installed on this cluster; this should be rectified immediately.
Review system logs on members — Check /var/log/messages on both members around the time of the failover for CCP events, interface flaps, or daemon crashes.
Consider upgrading — R80.40 is outdated; upgrading to R81.20+ will bring significant stability and security improvements.

⚠️ Note: The Management API provides configuration-level state only. For real-time HA health (Active/Standby/Down), CLI access to the cluster members is required.

Would you like guidance on resolving the SIC issue, pushing a policy, or interpreting cphaprob output?

Just now
chat dislike button
chat like button

---
