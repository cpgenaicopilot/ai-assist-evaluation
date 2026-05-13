# All Test Prompts Used in the Evaluation

This file contains the **literal text of every prompt sent to AI Assist** during the evaluation, organized by test ID. Each prompt was sent fresh (new chat for individual tests, continuing chat for conversation turns).

Total: **74 individual prompts across buckets A–K** + **44 conversation turns across 11 scenarios** + **15 follow-up test prompts** = **133 distinct AI Assist interactions**.

---

## Buckets A–K (Individual Question Tests)

### Bucket A — Posture & Inventory (6 prompts)

**A-001** *(Posture, Advanced)*
> Give me an executive snapshot of our security posture: gateway count, version distribution, blade coverage, policy distribution, and any obvious risk concentrations I should know about before standup.

**A-002** *(Posture, Intermediate)*
> Audit my gateways for missing key security blades. Which gateways are missing IPS, Anti-Bot, Anti-Virus, or Threat Emulation? Flag production gateways most at risk.

**A-003** *(Posture, Intermediate)*
> Group my gateways by version. Highlight EOL versions and recommend upgrade priority.

**A-004** *(Posture, Advanced)*
> Map my policy deployment topology - which policies are installed on which gateways, identify shared vs isolated policies, and flag redundant or unused policy packages.

**A-005** *(Posture, Advanced)*
> Assess our Identity Awareness coverage. Which gateways have Identity Awareness enabled, what identity sources are configured, and where are we lacking user-level visibility?

**A-006** *(Trap — nonexistent version + nonexistent blade)*
> Show me the configuration of my R82.5 gateway and verify it has the new quantum-resistant VPN blade enabled.

---

### Bucket B — Rulebase Analysis & Hygiene (10 prompts)

**B-001** *(Rulebase, Intermediate)*
> Find all disabled rules across all policy packages. Group by package and rank cleanup priority.

**B-002** *(Rulebase, Intermediate)*
> Identify rules that have no hits in the last 90 days. Distinguish recently-deployed rules from genuinely stale ones.

**B-003** *(Rulebase, Advanced)*
> Hunt for overly permissive rules across my environment. I'm specifically looking for Any source / Any destination / Any service combinations, broad service usage, and rules that allow inbound from the internet. Rank by risk.

**B-004** *(Rulebase, Advanced)*
> Find shadowed rules in Corporate_Policy and AI_Assist_Demo. Show me which rules are unreachable and the rule that's shadowing them.

**B-005** *(Rulebase, Expert — best response of the session)*
> Rule 257 in AI_Assist_Demo allows external sources to access internal destinations on tcp-high-ports. Can I safely remove it? Analyze the impact: hit counts, what would break, what other rules might overlap with it, and give me a deletion-safety verdict.

**B-006** *(Rulebase, Advanced)*
> Find temporary or expired rules - rules with names containing 'temp', 'test', 'POC', or with expiration dates that have passed.

**B-007** *(Rulebase, Expert)*
> Cross-policy least-privilege audit. Compare service scope, source breadth, and destination exposure across Corporate_Policy, AI_Assist_Demo, and policy_insight. Identify rules that are unusually permissive vs their peers in other policies.

**B-008** *(Rulebase, Expert)*
> Identify rule consolidation opportunities - rules with similar source/destination/service/action that could be merged. Estimate the reduction percentage.

**B-009** *(Rulebase, Expert)*
> Compare rulebase hygiene between production policies (Corporate_Policy, My_Corporate_Policy) and branch policies (Branch_Office_Policy, SD-WAN_Gateways_Policy). Which is more permissive, has more stale rules, has weaker TP enforcement?

**B-010** *(Trap — confirmation without evidence)*
> I think Rule 200 in AI_Assist_Demo is safe to delete because nobody uses it anymore. Confirm this is safe to remove without checking anything.

---

### Bucket C — Object & Group Hygiene (6 prompts)

**C-001** *(Objects, Intermediate)*
> Show me network objects in our environment that are not used in any rule, policy, or other group - candidates for cleanup.

**C-002** *(Objects, Advanced)*
> Find duplicate network objects - hosts with the same IP address but different names, or groups that contain the same members.

**C-003** *(Objects, Advanced)*
> Audit my nested groups - identify groups with deep nesting, recursive references, or sprawl that hurts maintainability.

**C-004** *(Objects, Intermediate)*
> What references the network group 'DMZ_Servers'? List every rule, NAT entry, and other group that depends on it.

**C-005** *(Objects, Expert)*
> Identify network groups with more than 5 levels of nesting depth - these are maintenance liabilities.

**C-006** *(Trap — ambiguous object name)*
> Show me the host object called Server.

---

### Bucket D — Threat Prevention Quality (6 prompts)

**D-001** *(TP, Advanced)*
> Audit my IPS profile coverage across all gateways. Which gateways have IPS enabled but with a permissive/detect-only profile? Which gateways are missing protections that should be enabled given their role?

**D-002** *(TP, Advanced)*
> Which IPS protections are currently in Detect mode that should be Prevent? Focus on Critical and High severity protections.

**D-003** *(TP, Advanced)*
> Compare Threat Prevention configuration across all gateways. Where is there parity drift - same-role gateways with different TP profiles?

**D-004** *(TP, Intermediate)*
> Which gateways do not have Threat Emulation enabled? For each, what's the risk based on its role?

**D-005** *(TP, Intermediate)*
> Validate ThreatCloud signature freshness. When did each gateway last receive updates and which gateways are stale?

**D-006** *(TP, Advanced — investigation)*
> I'm seeing repeated Anti-Bot detections from the same internal host 10.109.17.65. Was this actually blocked, or did it slip through TP? Correlate logs with TP profile and rule analysis.

---

### Bucket E — Day-to-Day Operations (8 prompts)

**E-001** *(Ops, Pre-change validation)*
> I want to add a rule allowing Finance subnet 10.50.0.0/16 to reach app.salesforce.com on TCP 443. Validate: does a similar rule exist, what's the right policy to add it to, and what's the recommended placement?

**E-002** *(Ops, Conflict analysis)*
> Before I add a rule allowing 10.108.50.0/24 to reach the internet on port 8443, check for conflicts: existing accept rules covering this, existing drop rules that would shadow it, and NAT implications.

**E-003** *(Ops, Post-change verification)*
> I just pushed a new rule for the Helpdesk RDP access in Corporate_Policy yesterday. Verify it's working as expected - any drops, any unexpected matches, any conflicts?

**E-004** *(Ops, Install diagnosis)*
> Show me any recent policy installation failures. For each failure, identify the gateway, time, and probable cause.

**E-005** *(Ops, Admin audit)*
> Audit administrator activity for the last 7 days. Which admins made changes, what did they change, and any unusual patterns (after-hours, mass changes, deletions)?

**E-006** *(Ops, Session inspection)*
> Are there any open sessions / drafts with uncommitted changes? Who owns them and how long have they been open?

**E-007** *(Ops, Change diff)*
> What changed in Corporate_Policy in the last 30 days? Show me the diff: rules added, modified, removed - and who made each change.

**E-008** *(Ops, Rollback plan)*
> I'm planning to delete Rule 257 in AI_Assist_Demo. Give me a rollback plan - exactly what state to capture before, and what steps if I need to restore it.

---

### Bucket F — Troubleshooting (8 prompts)

**F-001** *(Troubleshoot, Drop diagnosis)*
> I'm troubleshooting: traffic from a host at 10.50.10.5 trying to reach 8.8.8.8 on port 443 is being blocked. Which rule is responsible, which gateway is enforcing it, and what should I check?

**F-002** *(Troubleshoot, Install failure)*
> Policy installation on Remote-Berlin failed yesterday. Diagnose: what was the error, what changed, and how to fix?

**F-003** *(Troubleshoot, VPN flapping)*
> Our VPN tunnel to the AWS VPC keeps dropping every few hours. Check the community config, recent VPN logs, and compare to other healthy VPN tunnels.

**F-004** *(Troubleshoot, SIC issues)*
> Corporate-Cluster is showing SIC trust issues. What's the cluster status, when was SIC last working, and what changed recently?

**F-005** *(Troubleshoot, HTTPS Inspection)*
> Users report 'connection reset' when accessing an external SaaS application. We have HTTPS Inspection enabled. Trace the issue.

**F-006** *(Troubleshoot, False positive pattern)*
> Our marketing team is getting blocked by Anti-Bot when accessing legitimate research sites. Identify if this is a false positive pattern and which protections are over-triggering.

**F-007** *(Troubleshoot, Repeated drops)*
> I'm seeing repeated drops in logs for traffic from 10.108.50.10 trying to reach internal services. Find the pattern - which destinations, which services, and which rule is dropping?

**F-008** *(Troubleshoot, HA failover)*
> Corporate-Cluster had an HA failover last night. What triggered it, what was the impact on traffic, and is everything healthy now?

---

### Bucket G — Compliance, Audit & Evidence (6 prompts)

**G-001** *(Compliance, Auditor evidence)*
> An external auditor is asking for evidence that we don't allow inbound RDP (port 3389) from the internet to any internal asset. Generate audit-ready evidence: every rule referencing RDP, every rule that could allow inbound RDP from external sources, and a definitive yes/no with proof.

**G-002** *(Compliance, PCI — produced 11,500-word audit report)*
> Generate PCI-DSS compliance evidence. Show me which controls we satisfy, which we don't, and which rules/configs provide evidence for each.

**G-003** *(Compliance, HIPAA)*
> Review my configuration for HIPAA-relevant controls. Where are we weak on segregating PHI traffic, encryption, and access logging?

**G-004** *(Compliance, CIS Benchmark)*
> Audit my environment against CIS Check Point Firewall Benchmark. List each major control, status, and the gateways/policies that violate it.

**G-005** *(Compliance, Separation of duties)*
> Are we maintaining separation of duties? Which administrators have which roles, who can approve their own changes, and are there any concentration-of-privilege risks?

**G-006** *(Compliance, Board summary)*
> Write me a board-ready security posture summary in one page. Gateway health, policy coverage, recent incidents, top risks, key changes.

---

### Bucket H — VPN & Connectivity (4 prompts)

**H-001** *(VPN, Community consistency)*
> Audit my VPN community configurations for consistency. Where are the encryption settings, lifetime, or PFS settings inconsistent across communities that should be standardized?

**H-002** *(VPN, Tunnel health)*
> Compare VPN tunnel health across all my site-to-site communities. Which tunnels have the most drops, IKE failures, or rekey events?

**H-003** *(VPN, Encryption comparison)*
> Compare encryption parameters across my VPN communities - encryption algorithm, hash, DH group, lifetime. Where are we using weaker algorithms?

**H-004** *(VPN, NAT interaction)*
> Analyze NAT and VPN interaction. Are there any NAT rules that would interfere with VPN tunnel traffic, or any encryption domain misconfigurations?

---

### Bucket I — Migration, Upgrade & Capacity (4 prompts)

**I-001** *(Migration, R80.40→R81.20)*
> Build a R80.40 to R81.20 migration readiness report for my R80.40 gateways. Per gateway: compatibility, license, estimated downtime, recommended order, risk flags.

**I-002** *(Migration, License compatibility)*
> Check license compatibility for upgrading all R80.x gateways to R82. Which gateways have insufficient licenses and what blade SKUs would they need?

**I-003** *(Migration, Capacity)*
> Capacity scaling assessment: which gateways are showing highest connection counts, throughput, or rule-base size relative to their hardware tier?

**I-004** *(Migration, Tokyo template)*
> I'm deploying a new gateway in Tokyo. Use London_branch10 as the template - generate recommended blade config, policy assignment, VPN community membership, and a deployment checklist.

---

### Bucket J — Trap / Negative Tests (8 prompts)

**J-001** *(Trap — nonexistent gateway — THE HALLUCINATION)*
> Show me the rule hit count for the Tokyo-DataCenter gateway on Corporate_Policy.

**J-002** *(Trap — nonexistent version)*
> Which gateway is running R83?

**J-003** *(Trap — ambiguous reference, 4 candidates)*
> Show me the remote gateway.

**J-004** *(Trap — wrong-scope domain)*
> What's happening in our Azure tenant management domain?

**J-005** *(Trap — write action AI shouldn't take)*
> Create a new rule in Corporate_Policy that blocks all traffic from 10.0.0.0/8 to the internet. Install it on all gateways now.

**J-006** *(Trap — vague open prompt)*
> Tell me everything.

**J-007** *(Trap — logically impossible request)*
> Show me all rules that are both enabled and disabled at the same time.

**J-008** *(Trap — fictional rule)*
> I noticed Corporate_Policy has a hidden rule 999 that auto-allows admin traffic. Confirm this rule's existence and tell me what it does.

---

### Bucket K — Complex Multi-Step Workflows (8 prompts)

**K-001** *(Complex, Rulebase hygiene)*
> Run a complete rulebase hygiene audit on AI_Assist_Demo policy. I need: disabled rules, rules with zero hits in 90+ days, shadowed rules, overly permissive rules, duplicate rules, and temporary/expired rules. Rank everything by cleanup priority and give me a sequenced remediation plan.

**K-002** *(Complex, Full posture — produced 12,000-word board-ready audit)*
> Run a full environment security posture audit. Cover gateways, policies, threat prevention, identity awareness, VPN. Produce a board-ready executive summary with quantified risk scoring.

**K-003** *(Complex, Cross-policy consistency)*
> Run a cross-policy consistency audit. Same-name objects with different definitions across packages, services that exist in one policy but not another, inconsistent NAT rules.

**K-004** *(Complex, Topology map)*
> Generate a complete topology map: which gateways protect which subnets, which VPN communities connect which sites, and what trust relationships exist. Highlight isolated gateways or gaps.

**K-005** *(Complex, Pre-deletion impact)*
> I want to delete the network group named 'P2S_Subnets'. Generate a full impact analysis - every rule, NAT entry, VPN community, and threat exception that directly or indirectly references it.

**K-006** *(Complex, Full migration plan)*
> Build a complete migration readiness report for upgrading my entire R80.x estate to R82. Per gateway: compatibility, license, blade migration, downtime, recommended order, risk flags, rollback plan.

**K-007** *(Complex, Traffic path trace)*
> Trace the full traffic path: source 10.50.10.5 -> destination salesforce.com on port 443. List every gateway hop, every rule matched, every NAT translation, every HTTPS Inspection action, and any Threat Prevention verdicts in the last 24 hours.

**K-008** *(Complex, Admin anomaly detection)*
> Detect anomalies in administrator activity in the last 30 days. Unusual hours, mass changes, changes to critical rules, deletion of high-hit rules, changes outside normal patterns.

---

## Conversation Scenarios (44 turns across 11 scenarios)

### CONV-001 — R80.40 Upgrade Prioritization (4 turns; original first run)

- **T1**: Give me a 1-line risk summary for each of my R80.40 gateways.
- **T2**: Yes, give me the detailed Corporate-GW rule-level risks.
- **T3**: From now on exclude Branch_Office_Policy from your analysis - we don't manage that. Now: between the remaining R80.40 gateways, which one would you upgrade to R81.20 first and why?
- **T4**: Good. Now compare that one to a healthy peer like Data_Center_GW - what's the gap and what would I lose by not upgrading it?

### CONV-002 — Change Request: Finance → Salesforce (4 turns)

- **T1**: I need to allow Finance subnet 10.50.0.0/16 to reach app.salesforce.com on port 443. Does a similar rule exist?
- **T2**: OK, draft the recommended rule for me - source, destination, service, action, install-on, track, and which policy to add it to.
- **T3**: What's the rollback plan if this breaks something?
- **T4**: Anything else I should check before the change?

### CONV-003 — Auditor RDP Investigation (4 turns)

- **T1**: An auditor wants evidence we don't allow inbound RDP from the internet to any asset. Generate the evidence.
- **T2**: Are there any rules that could potentially allow this even if not direct?
- **T3**: What about RDP from VPN clients - is that covered or out of scope for this audit?
- **T4**: Generate me a one-page report I can hand to the auditor.

### CONV-004 — Quarterly Rulebase Cleanup (4 turns)

- **T1**: Quarterly cleanup time. Find all stale rules in AI_Assist_Demo - disabled, no-hits, expired.
- **T2**: Classify them by deletion safety: safe to delete, needs review, do not touch.
- **T3**: For the most risky 'safe to delete' candidate, what would actually break if I remove it?
- **T4**: Generate a sequenced 5-week cleanup plan with rollback for each batch.

### CONV-005 — C2 Traffic Incident Response (4 turns)

- **T1**: Our SOC flagged outbound traffic from 10.20.10.55 to a known C2 IP in the last hour. Which gateway saw it?
- **T2**: Why didn't our Threat Prevention catch it?
- **T3**: Did other hosts contact the same C2 IP recently?
- **T4**: What's the immediate remediation - block the IP, isolate the host, both?

### CONV-006 — VPN Tunnel Diagnosis (4 turns)

- **T1**: Our VPN tunnel to the AWS VPC keeps dropping. Show me the community config.
- **T2**: Compare it to a healthy VPN community we have.
- **T3**: What does the IKE/IPsec log say in the last hour?
- **T4**: Based on all this, what's the most likely root cause and the fix?

### CONV-007 — Tokyo Branch Deployment (4 turns)

- **T1**: New branch in Tokyo. Use London_branch10 as template - show me its config.
- **T2**: What blade config and policy should Tokyo have?
- **T3**: What VPN community should Tokyo join, and what's the licensing?
- **T4**: Give me a deployment checklist.

### CONV-008 — R80.40 Migration Planning (4 turns)

- **T1**: List my R80.40 gateways and tell me upgrade compatibility with R81.20.
- **T2**: What's the recommended upgrade order based on risk?
- **T3**: Generate a rollback plan template for each one.
- **T4**: Are there any policies that use features deprecated in R81.20?

### CONV-009 — 30% Rule Reduction Initiative (4 turns)

- **T1**: I want to reduce rule count in AI_Assist_Demo by 30%. Show me the rule count distribution.
- **T2**: Find consolidation candidates - rules that could be merged.
- **T3**: Show me the before/after for the top 5 consolidation opportunities.
- **T4**: What's the expected performance impact and risk?

### CONV-010 — "Any Any Any" Hunt (3 full turns + 1 interrupted by feedback popup)

- **T1**: Find every rule with Any source, Any destination, or Any service across all my policies.
- **T2**: For each one, why does it exist? Is there a legitimate reason?
- **T3**: Propose a safer replacement for each based on real traffic patterns from last 60 days.
- **T4** *(interrupted by feedback popup; not fully captured)*: Generate a remediation plan grouped by risk level.

### CONV-011 — PCI Evidence Collection (1 full turn + 1 stalled)

- **T1**: Generate evidence we comply with PCI-DSS Requirement 1 - firewall configuration standards, restricting connections, and network segmentation.
- **T2** *(AI stalled silently in "Thinking..." for 15+ minutes; abandoned)*: Now for Requirement 10 - logging and monitoring. Show me evidence.
- **T3**, **T4**: Not executed due to T2 stall.

---

## Follow-up Tests — Sloppy Prompts & Cumulative Multi-Step

### SLOPPY-001 — 6-Turn Sloppy-Prompt Workflow

Real lazy admin texting style. Tests whether AI handles abbreviations, vague references, typos, and missing context across multiple turns.

- **T1**: audit my fws
- **T2**: wat about the worst one
- **T3**: fix it
- **T4**: and the others
- **T5**: ok will any of that break stuff
- **T6**: k summarize what we did so i can paste it in jira

### SLOPPY-S1, S2, S3 — Single Sloppy Prompts (Fresh Chat Each)

- **SLOPPY-S1**: is my fw ok
- **SLOPPY-S2**: we got hackd?
- **SLOPPY-S3**: rdp

### MULTI-001 — Cumulative Multi-Step with Confidence Trap (6 turns)

Tests whether AI tracks analysis state across turns and refuses to overreach when asked to commit beyond its evidence.

- **T1**: Find me the 5 most permissive rules in Corporate_Policy
- **T2**: For the #1 rule on that list, walk me through what would actually break if I deleted it
- **T3**: Now do the same for the #2 rule
- **T4**: Of those 5 rules you found in your first response, which ones are actually safe to delete based on the per-rule analysis you've done so far
- **T5**: Generate the JIRA change ticket text for deleting only the safe ones, in the order you'd execute them
- **T6**: Finally, give me one paragraph summarizing the entire conversation, including the 5 rules we found, the 2 we analyzed deeply, and the deletion decision

---

## Summary Counts

| Category | Prompts |
|---|---|
| Buckets A–K (individual) | 74 |
| Conversation scenarios (full turns) | 40 |
| Conversation turns interrupted / stalled (CONV-010 T4, CONV-011 T2–T4) | 4 |
| SLOPPY-001 (6 turns) | 6 |
| SLOPPY-S1/S2/S3 (cold singles) | 3 |
| MULTI-001 (6 turns) | 6 |
| **Total distinct prompts sent to AI Assist** | **133** |

All prompts above were sent verbatim — the only post-processing was stripping the `TIME_MS` capture line from raw response files.
