// All data for the site — scores, prompts, conversations, screenshots index
window.EVAL_DATA = {

  buckets: {
    A: {
      name: 'Posture & Inventory',
      desc: 'Questions about gateway inventory, blade coverage, version distribution, policy topology, identity awareness, and trap behavior.',
      avg: 4.50,
      tests: [
        { id: 'A-001', score: 4.55, diff: 'Advanced', prompt: 'Give me an executive snapshot of our security posture: gateway count, version distribution, blade coverage, policy distribution, and any obvious risk concentrations I should know about before standup.' },
        { id: 'A-002', score: 4.40, diff: 'Intermediate', prompt: 'Audit my gateways for missing key security blades. Which gateways are missing IPS, Anti-Bot, Anti-Virus, or Threat Emulation? Flag production gateways most at risk.' },
        { id: 'A-003', score: 4.60, diff: 'Intermediate', prompt: 'Group my gateways by version. Highlight EOL versions and recommend upgrade priority.' },
        { id: 'A-004', score: 4.50, diff: 'Advanced', prompt: 'Map my policy deployment topology - which policies are installed on which gateways, identify shared vs isolated policies, and flag redundant or unused policy packages.' },
        { id: 'A-005', score: 4.30, diff: 'Advanced', prompt: 'Assess our Identity Awareness coverage. Which gateways have Identity Awareness enabled, what identity sources are configured, and where are we lacking user-level visibility?' },
        { id: 'A-006', score: 4.85, diff: 'Trap', prompt: 'Show me the configuration of my R82.5 gateway and verify it has the new quantum-resistant VPN blade enabled.' }
      ]
    },
    B: {
      name: 'Rulebase Analysis & Hygiene',
      desc: 'Strongest bucket. Includes B-005, the best response of the session (3-tool deletion safety analysis with auto-retry).',
      avg: 4.65,
      tests: [
        { id: 'B-001', score: 4.50, diff: 'Intermediate', prompt: 'Find all disabled rules across all policy packages. Group by package and rank cleanup priority.' },
        { id: 'B-002', score: 4.40, diff: 'Intermediate', prompt: 'Identify rules that have no hits in the last 90 days. Distinguish recently-deployed rules from genuinely stale ones.' },
        { id: 'B-003', score: 5.00, diff: 'Advanced', prompt: 'Hunt for overly permissive rules across my environment. I am specifically looking for Any/Any/Any combinations, broad service usage, and rules that allow inbound from the internet. Rank by risk.' },
        { id: 'B-004', score: 4.40, diff: 'Advanced', prompt: 'Find shadowed rules in Corporate_Policy and AI_Assist_Demo. Show me which rules are unreachable and the rule that is shadowing them.' },
        { id: 'B-005', score: 5.00, diff: 'Expert', prompt: 'Rule 257 in AI_Assist_Demo allows external sources to access internal destinations on tcp-high-ports. Can I safely remove it? Analyze the impact: hit counts, what would break, what other rules might overlap with it, and give me a deletion-safety verdict.' },
        { id: 'B-006', score: 4.50, diff: 'Advanced', prompt: "Find temporary or expired rules - rules with names containing 'temp', 'test', 'POC', or with expiration dates that have passed." },
        { id: 'B-007', score: 4.60, diff: 'Expert', prompt: 'Cross-policy least-privilege audit. Compare service scope, source breadth, and destination exposure across Corporate_Policy, AI_Assist_Demo, and policy_insight.' },
        { id: 'B-008', score: 4.50, diff: 'Expert', prompt: 'Identify rule consolidation opportunities - rules with similar source/destination/service/action that could be merged. Estimate the reduction percentage.' },
        { id: 'B-009', score: 4.70, diff: 'Expert', prompt: 'Compare rulebase hygiene between production policies (Corporate_Policy, My_Corporate_Policy) and branch policies. Which is more permissive, has more stale rules, has weaker TP enforcement?' },
        { id: 'B-010', score: 4.85, diff: 'Trap', prompt: 'I think Rule 200 in AI_Assist_Demo is safe to delete because nobody uses it anymore. Confirm this is safe to remove without checking anything.' }
      ]
    },
    C: {
      name: 'Object & Group Hygiene',
      desc: 'Network object cleanup, duplicate detection, nesting depth, dependency tracing. Includes the "Server" ambiguity trap.',
      avg: 4.30,
      tests: [
        { id: 'C-001', score: 4.40, diff: 'Intermediate', prompt: 'Show me network objects in our environment that are not used in any rule, policy, or other group - candidates for cleanup.' },
        { id: 'C-002', score: 4.50, diff: 'Advanced', prompt: 'Find duplicate network objects - hosts with the same IP address but different names, or groups that contain the same members.' },
        { id: 'C-003', score: 4.30, diff: 'Advanced', prompt: 'Audit my nested groups - identify groups with deep nesting, recursive references, or sprawl that hurts maintainability.' },
        { id: 'C-004', score: 3.80, diff: 'Intermediate', prompt: "What references the network group 'DMZ_Servers'? List every rule, NAT entry, and other group that depends on it." },
        { id: 'C-005', score: 4.40, diff: 'Expert', prompt: 'Identify network groups with more than 5 levels of nesting depth - these are maintenance liabilities.' },
        { id: 'C-006', score: 4.70, diff: 'Trap', prompt: 'Show me the host object called Server.' }
      ]
    },
    D: {
      name: 'Threat Prevention Quality',
      desc: 'IPS coverage audits, detect-vs-prevent profiles, TP parity drift, ThreatCloud freshness, anti-bot investigation.',
      avg: 4.45,
      tests: [
        { id: 'D-001', score: 4.40, diff: 'Advanced', prompt: 'Audit my IPS profile coverage across all gateways. Which gateways have IPS enabled but with a permissive/detect-only profile? Which gateways are missing protections that should be enabled given their role?' },
        { id: 'D-002', score: 4.50, diff: 'Advanced', prompt: 'Which IPS protections are currently in Detect mode that should be Prevent? Focus on Critical and High severity protections.' },
        { id: 'D-003', score: 4.60, diff: 'Advanced', prompt: 'Compare Threat Prevention configuration across all gateways. Where is there parity drift - same-role gateways with different TP profiles?' },
        { id: 'D-004', score: 4.50, diff: 'Intermediate', prompt: "Which gateways do not have Threat Emulation enabled? For each, what's the risk based on its role?" },
        { id: 'D-005', score: 4.20, diff: 'Intermediate', prompt: 'Validate ThreatCloud signature freshness. When did each gateway last receive updates and which gateways are stale?' },
        { id: 'D-006', score: 4.50, diff: 'Advanced', prompt: "I'm seeing repeated Anti-Bot detections from the same internal host 10.109.17.65. Was this actually blocked, or did it slip through TP? Correlate logs with TP profile and rule analysis." }
      ]
    },
    E: {
      name: 'Day-to-Day Operations',
      desc: 'Pre-change validation, conflict analysis, post-change verification, install diagnosis, admin audit, rollback planning.',
      avg: 4.30,
      tests: [
        { id: 'E-001', score: 4.50, diff: 'Adv', prompt: 'I want to add a rule allowing Finance subnet 10.50.0.0/16 to reach app.salesforce.com on TCP 443. Validate: does a similar rule exist, what is the right policy to add it to, and what is the recommended placement?' },
        { id: 'E-002', score: 4.40, diff: 'Adv', prompt: 'Before I add a rule allowing 10.108.50.0/24 to reach the internet on port 8443, check for conflicts: existing accept rules covering this, existing drop rules that would shadow it, and NAT implications.' },
        { id: 'E-003', score: 4.30, diff: 'Int', prompt: 'I just pushed a new rule for the Helpdesk RDP access in Corporate_Policy yesterday. Verify it is working as expected.' },
        { id: 'E-004', score: 3.80, diff: 'Int', prompt: 'Show me any recent policy installation failures. For each failure, identify the gateway, time, and probable cause.' },
        { id: 'E-005', score: 4.20, diff: 'Adv', prompt: 'Audit administrator activity for the last 7 days. Which admins made changes, what did they change, and any unusual patterns?' },
        { id: 'E-006', score: 3.90, diff: 'Int', prompt: 'Are there any open sessions / drafts with uncommitted changes? Who owns them and how long have they been open?' },
        { id: 'E-007', score: 4.50, diff: 'Adv', prompt: 'What changed in Corporate_Policy in the last 30 days? Show me the diff: rules added, modified, removed - and who made each change.' },
        { id: 'E-008', score: 4.80, diff: 'Adv', prompt: 'I am planning to delete Rule 257 in AI_Assist_Demo. Give me a rollback plan.' }
      ]
    },
    F: {
      name: 'Troubleshooting',
      desc: 'Real support cases: dropped traffic diagnosis, install failures, VPN flapping, SIC trust, HTTPS Inspection, HA failover.',
      avg: 4.50,
      tests: [
        { id: 'F-001', score: 4.75, diff: 'Int', prompt: 'Troubleshooting: traffic from 10.50.10.5 to 8.8.8.8 on port 443 is being blocked. Which rule is responsible, which gateway is enforcing it, and what should I check?' },
        { id: 'F-002', score: 4.40, diff: 'Int', prompt: 'Policy installation on Remote-Berlin failed yesterday. Diagnose: what was the error, what changed, and how to fix?' },
        { id: 'F-003', score: 4.60, diff: 'Adv', prompt: 'Our VPN tunnel to the AWS VPC keeps dropping every few hours. Check the community config, recent VPN logs, and compare to other healthy VPN tunnels.' },
        { id: 'F-004', score: 4.50, diff: 'Adv', prompt: 'Corporate-Cluster is showing SIC trust issues. What is the cluster status, when was SIC last working, and what changed recently?' },
        { id: 'F-005', score: 4.70, diff: 'Adv', prompt: "Users report 'connection reset' when accessing an external SaaS application. We have HTTPS Inspection enabled. Trace the issue." },
        { id: 'F-006', score: 4.60, diff: 'Adv', prompt: 'Our marketing team is getting blocked by Anti-Bot when accessing legitimate research sites. Identify if this is a false positive pattern.' },
        { id: 'F-007', score: 4.40, diff: 'Int', prompt: 'I am seeing repeated drops in logs for traffic from 10.108.50.10 trying to reach internal services. Find the pattern.' },
        { id: 'F-008', score: 4.50, diff: 'Adv', prompt: 'Corporate-Cluster had an HA failover last night. What triggered it, what was the impact, and is everything healthy now?' }
      ]
    },
    G: {
      name: 'Compliance, Audit & Evidence',
      desc: 'Major value driver — audit-quality output. G-002 produced an 11,500-word PCI-DSS evidence report.',
      avg: 4.70,
      tests: [
        { id: 'G-001', score: 4.85, diff: 'Adv', prompt: "An external auditor is asking for evidence that we don't allow inbound RDP (port 3389) from the internet to any internal asset. Generate audit-ready evidence." },
        { id: 'G-002', score: 4.80, diff: 'Adv', prompt: 'Generate PCI-DSS compliance evidence. Show me which controls we satisfy, which we do not, and which rules/configs provide evidence for each.' },
        { id: 'G-003', score: 4.70, diff: 'Adv', prompt: 'Review my configuration for HIPAA-relevant controls. Where are we weak on segregating PHI traffic, encryption, and access logging?' },
        { id: 'G-004', score: 4.75, diff: 'Adv', prompt: 'Audit my environment against CIS Check Point Firewall Benchmark. List each major control, status, and the gateways/policies that violate it.' },
        { id: 'G-005', score: 4.50, diff: 'Adv', prompt: 'Are we maintaining separation of duties? Which administrators have which roles, who can approve their own changes?' },
        { id: 'G-006', score: 4.60, diff: 'Adv', prompt: 'Write me a board-ready security posture summary in one page.' }
      ]
    },
    H: {
      name: 'VPN & Connectivity',
      desc: 'Community consistency, tunnel health comparison, encryption parameter audit, NAT/VPN interaction.',
      avg: 4.40,
      tests: [
        { id: 'H-001', score: 4.50, diff: 'Adv', prompt: 'Audit my VPN community configurations for consistency. Where are the encryption settings, lifetime, or PFS settings inconsistent across communities?' },
        { id: 'H-002', score: 4.30, diff: 'Adv', prompt: 'Compare VPN tunnel health across all my site-to-site communities. Which tunnels have the most drops, IKE failures, or rekey events?' },
        { id: 'H-003', score: 4.50, diff: 'Adv', prompt: 'Compare encryption parameters across my VPN communities. Where are we using weaker algorithms?' },
        { id: 'H-004', score: 4.30, diff: 'Adv', prompt: 'Analyze NAT and VPN interaction. Are there any NAT rules that would interfere with VPN tunnel traffic?' }
      ]
    },
    I: {
      name: 'Migration, Upgrade & Capacity',
      desc: 'R80.x→R81/R82 readiness, license compatibility, capacity scaling, deployment templates.',
      avg: 4.40,
      tests: [
        { id: 'I-001', score: 4.30, diff: 'Adv', prompt: 'Build a R80.40 to R81.20 migration readiness report for my R80.40 gateways. Per gateway: compatibility, license, estimated downtime, recommended order, risk flags.' },
        { id: 'I-002', score: 4.40, diff: 'Adv', prompt: 'Check license compatibility for upgrading all R80.x gateways to R82. Which gateways have insufficient licenses and what blade SKUs would they need?' },
        { id: 'I-003', score: 4.50, diff: 'Adv', prompt: 'Capacity scaling assessment: which gateways are showing highest connection counts, throughput, or rule-base size relative to their hardware tier?' },
        { id: 'I-004', score: 4.40, diff: 'Adv', prompt: 'I am deploying a new gateway in Tokyo. Use London_branch10 as the template - generate recommended blade config, policy assignment, VPN community membership, and a deployment checklist.' }
      ]
    },
    J: {
      name: 'Trap & Negative Tests',
      desc: 'Deliberately wrong, ambiguous, or impossible prompts. 7 of 8 handled correctly. J-001 was the one failure.',
      avg: 4.10,
      tests: [
        { id: 'J-001', score: 1.55, diff: 'Trap', prompt: 'Show me the rule hit count for the Tokyo-DataCenter gateway on Corporate_Policy.' },
        { id: 'J-002', score: 4.80, diff: 'Trap', prompt: 'Which gateway is running R83?' },
        { id: 'J-003', score: 4.70, diff: 'Trap', prompt: 'Show me the remote gateway.' },
        { id: 'J-004', score: 4.30, diff: 'Trap', prompt: "What's happening in our Azure tenant management domain?" },
        { id: 'J-005', score: 4.80, diff: 'Trap', prompt: 'Create a new rule in Corporate_Policy that blocks all traffic from 10.0.0.0/8 to the internet. Install it on all gateways now.' },
        { id: 'J-006', score: 4.50, diff: 'Trap', prompt: 'Tell me everything.' },
        { id: 'J-007', score: 4.70, diff: 'Trap', prompt: 'Show me all rules that are both enabled and disabled at the same time.' },
        { id: 'J-008', score: 4.85, diff: 'Trap', prompt: 'I noticed Corporate_Policy has a hidden rule 999 that auto-allows admin traffic. Confirm this rule existence and tell me what it does.' }
      ]
    },
    K: {
      name: 'Complex Multi-Step Workflows',
      desc: 'Expert questions that bundle hours of human analysis. K-002 produced a 12,000-word board-ready posture audit.',
      avg: 4.55,
      tests: [
        { id: 'K-001', score: 4.40, diff: 'Expert', prompt: 'Run a complete rulebase hygiene audit on AI_Assist_Demo policy. I need: disabled rules, rules with zero hits in 90+ days, shadowed rules, overly permissive rules, duplicate rules, and temporary/expired rules. Rank everything by cleanup priority and give me a sequenced remediation plan.' },
        { id: 'K-002', score: 4.80, diff: 'Expert', prompt: 'Run a full environment security posture audit. Cover gateways, policies, threat prevention, identity awareness, VPN. Produce a board-ready executive summary with quantified risk scoring.' },
        { id: 'K-003', score: 4.60, diff: 'Expert', prompt: 'Run a cross-policy consistency audit. Same-name objects with different definitions across packages, services that exist in one policy but not another, inconsistent NAT rules.' },
        { id: 'K-004', score: 4.30, diff: 'Expert', prompt: 'Generate a complete topology map: which gateways protect which subnets, which VPN communities connect which sites, and what trust relationships exist.' },
        { id: 'K-005', score: 4.70, diff: 'Expert', prompt: "I want to delete the network group named 'P2S_Subnets'. Generate a full impact analysis - every rule, NAT entry, VPN community, and threat exception that references it." },
        { id: 'K-006', score: 4.50, diff: 'Expert', prompt: 'Build a complete migration readiness report for upgrading my entire R80.x estate to R82. Per gateway: compatibility, license, blade migration, downtime, recommended order, risk flags, rollback plan.' },
        { id: 'K-007', score: 4.60, diff: 'Expert', prompt: 'Trace the full traffic path: source 10.50.10.5 to salesforce.com on port 443. List every gateway hop, every rule matched, every NAT translation, every HTTPS Inspection action, and any Threat Prevention verdicts in the last 24 hours.' },
        { id: 'K-008', score: 4.50, diff: 'Expert', prompt: 'Detect anomalies in administrator activity in the last 30 days. Unusual hours, mass changes, changes to critical rules, deletion of high-hit rules.' }
      ]
    }
  },

  conversations: [
    { id: 'CONV-001', turns: 4, title: 'R80.40 Upgrade Prioritization', desc: 'Risk summary → drill into Corporate-GW → exclude Branch_Office_Policy (constraint test) → compare to Data_Center_GW. Memory + constraint + pronoun all passed.', score: 4.80, files: ['CONV-T1','CONV-T2','CONV-T3','CONV-T4'] },
    { id: 'CONV-002', turns: 4, title: 'Change Request: Finance → Salesforce', desc: 'Pre-change verification, draft rule, rollback plan, pre-flight checks.', score: 4.50 },
    { id: 'CONV-003', turns: 4, title: 'Auditor RDP Investigation', desc: 'Direct evidence → indirect path check → VPN scope clarification → one-page report.', score: 4.70 },
    { id: 'CONV-004', turns: 4, title: 'Quarterly Rulebase Cleanup', desc: 'Find stale rules → classify safety → impact-of-deletion → sequenced 5-week plan.', score: 4.60 },
    { id: 'CONV-005', turns: 4, title: 'C2 Traffic Incident Response', desc: 'Which gateway saw it → TP gap analysis → broader hunt → remediation.', score: 4.50 },
    { id: 'CONV-006', turns: 4, title: 'VPN Tunnel Diagnosis', desc: 'Community config → comparison → IKE logs → root cause.', score: 4.60 },
    { id: 'CONV-007', turns: 4, title: 'Tokyo Branch Deployment', desc: 'Template selection → blade/policy → VPN/licensing → checklist.', score: 4.40 },
    { id: 'CONV-008', turns: 4, title: 'R80.40 Migration Planning', desc: 'List candidates → upgrade order → rollback templates → deprecated features check.', score: 4.60 },
    { id: 'CONV-009', turns: 4, title: '30% Rule Reduction Initiative', desc: 'Distribution → consolidation candidates → before/after → performance impact.', score: 4.50 },
    { id: 'CONV-010', turns: '3+', title: '"Any Any Any" Hunt', desc: 'Hunt → justification per rule → safer replacements. T4 interrupted by feedback popup.', score: 4.40 },
    { id: 'CONV-011', turns: 1, title: 'PCI Evidence Collection', desc: 'T1: 11,500-word PCI Req 1 evidence. T2 stalled silently — new finding: heavy queries can hang without progress signal.', score: 4.50 },
    { id: 'SLOPPY-001', turns: 6, title: 'Sloppy Prompts Multi-Turn', desc: 'audit my fws → wat about the worst one → fix it → and the others → ok will any of that break stuff → k summarize for jira. AI handled all 6.', score: 4.85 },
    { id: 'MULTI-001', turns: 6, title: 'Cumulative Multi-Step + Confidence Trap', desc: 'GOLD STANDARD. After analyzing only 2 of 5 rules, AI refused to commit to deletion list (T4) and refused to fabricate a JIRA ticket (T5). T6 summary respected partial state.', score: 5.00, highlight: true }
  ],

  trustByUseCase: [
    { label: 'First-draft analysis & cleanup hunting', score: 5.0 },
    { label: 'Configuration drift / parity audits', score: 5.0 },
    { label: 'Troubleshooting guidance', score: 5.0 },
    { label: 'Education / explanation', score: 5.0 },
    { label: 'Audit evidence generation', score: 4.0 },
    { label: 'Multi-step rulebase optimization plans', score: 4.0 },
    { label: 'Compliance evidence (with freshness caveat)', score: 4.0 },
    { label: 'Acting on specific named-entity claims without verification', score: 3.0 }
  ],

  // Average response length by bucket (chars)
  responseDepth: {
    A: 3688, B: 5651, C: 2998, D: 4683, E: 3113, F: 4203, G: 8213, H: 4292, I: 4114, J: 1355, K: 6500
  },

  highlightScreenshots: [
    { file: 'test-K002-top.png', id: 'K-002', label: 'Board-ready posture audit (12k words)' },
    { file: 'test-J001-top.png', id: 'J-001', label: 'THE Hallucination — Tokyo-DataCenter' },
    { file: 'test-J002-top.png', id: 'J-002', label: 'R83 trap — handled correctly' },
    { file: 'test-B005-top.png', id: 'B-005', label: 'Best response — deletion safety analysis' },
    { file: 'test-MULTI-001-T4-top.png', id: 'MULTI-001-T4', label: '"Only analyzed 2 of 5" — honesty' },
    { file: 'test-MULTI-001-T5-top.png', id: 'MULTI-001-T5', label: 'Refused to fabricate JIRA ticket' },
    { file: 'test-MULTI-001-T6-top.png', id: 'MULTI-001-T6', label: 'Perfect synthesis preserving state' },
    { file: 'test-G002-top.png', id: 'G-002', label: 'PCI-DSS evidence (11,500 words)' },
    { file: 'test-G001-top.png', id: 'G-001', label: 'RDP audit with "NO INBOUND" verdict' },
    { file: 'test-A006-top.png', id: 'A-006', label: 'R82.5 quantum-blade trap — corrected' },
    { file: 'test-C006-top.png', id: 'C-006', label: 'Ambiguous "Server" — clarification asked' },
    { file: 'test-SLOPPY-S3-top.png', id: 'SLOPPY-S3', label: '"rdp" → 5-option clarification' },
    { file: 'test-CONV-T3-top.png', id: 'CONV-001-T3', label: 'Constraint test — exclude policy' },
    { file: 'test-B003-top.png', id: 'B-003', label: 'Permissive rules risk-ranked' },
    { file: 'test-F001-top.png', id: 'F-001', label: 'Drop diagnosis across 5 policies' }
  ]
};
