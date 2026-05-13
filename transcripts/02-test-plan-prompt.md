# Prompt for Claude Chat: Content & Answer Quality Test Plan for Check Point AI Assist

## Purpose

Create a focused test plan that evaluates **only the content quality** of Check Point AI Assist — the substance of its answers, the depth of its reasoning, the accuracy of its analysis, and the practical value it delivers to a security administrator. Do **not** include UI testing, UX testing, performance testing, accessibility testing, functional UI testing, or anything else outside of "is the answer any good and is it useful?".

The output of this test plan will be executed by an LLM with live browser access to a Check Point Infinity Portal session, who will interact with AI Assist, capture screenshots of the responses, verify claims against the actual SmartConsole, and produce a final report.

Because the tester is an LLM, the test plan should describe **conversation flows and intent**, not word-by-word scripts. Specify what the admin is trying to learn, what context they bring, what follow-up directions make sense, and what success looks like — let the LLM tester phrase the actual messages naturally and adapt based on what AI Assist returns.

## Context the Test Plan Author Must Internalize

### What AI Assist Is

Check Point AI Assist is an AI copilot embedded in the Smart-1 Cloud Security Management console (inside portal.checkpoint.com). It has access to the live Check Point Management API and runs on a real customer security environment. It is used by network and security administrators who hold CCSA / CCSE / CCSM-level certifications. They expect answers in proper Check Point terminology (blades, rulebase, policy packages, gateways, clusters, SIC, policy installation, Access Control / Threat Prevention layers, NAT, VPN communities, IPS profiles, ThreatCloud, HTTPS Inspection, Inline Layers, Sub-Policies, Updatable Objects, hit count / last-hit-time, etc.).

### Response Structure

Each AI Assist response includes:
- A thinking phase (visible reasoning)
- A Management API Query phase showing which tools loaded and which API commands ran
- A formatted answer with tables, deep links to objects, summary sections, and (often) a proactive "Notable Gaps" or recommendation section
- A follow-up suggestion

Clickable entity links (gateway names, object names) open the actual object in SmartConsole in Read Only mode — this means the tester can verify any factual claim by clicking the link and comparing.

### Environment Available to the Tester

- A live Smart-1 Cloud management domain on the cp-all-demo tenant
- Approximately 18 gateways (mix of standalone, clusters, SD-WAN, VWAN, IoT, Threat Emulation devices) on versions R80.40 and R81.20
- ~14 policy packages including Corporate_Policy, AI_Assist_Demo, AIOPS_Policy, Branch_Office_Policy, SD-WAN_Gateways_Policy, IoT-Policy, demo_policy, policy_insight, Gartner-2026 variants, My_Corporate_Policy, NEW, CPWpolicy
- ~1456 network objects, ~590 services, ~11407 applications/categories, ~7 VPN communities, ~58 users/identities
- Browser automation connected to the live portal for capturing screenshots and reading response content

---

## What the Test Plan Must Produce

### 1. A Question Bank Organized by Intent

Generate questions grouped by the real-world intent behind them. For each question, specify:

- **The question's intent** (what the admin is actually trying to accomplish)
- **The phrasing direction** (what kind of language to use — terse SOC-style, narrative requesting summary, troubleshooting question, executive summary request, etc.) — but NOT the exact word-for-word text, since the LLM tester will phrase it naturally
- **Difficulty tier**: Basic / Intermediate / Advanced / Expert / Trap
- **Expected behavior**: what AI Assist should do (which API calls it likely needs, what shape the answer should take, what proactive insights would impress an admin, what would be a red flag)
- **Validation method**: where in SmartConsole the tester can verify the answer (e.g., "Open Gateways & Servers > select gateway > Blades tab", "Navigate to Security Policies > Corporate_Policy > count rules with Action=Accept", "Open Logs & Events with filter blade:IPS time:last 7 days")
- **Scoring focus**: which dimensions of answer quality this question is designed to stress-test (e.g., "tests whether AI grounds answers in real data vs. hallucinates", "tests ability to chain multiple API calls", "tests whether AI proactively flags risks")

Organize the bank into these intent buckets, each populated with enough questions to thoroughly cover the area:

**Bucket A — Posture & Inventory Awareness** (≥6 questions): What does my environment look like right now? Gateway inventory, blade coverage, policy distribution, version distribution, license tier, object counts, identity sources.

**Bucket B — Rulebase Analysis & Hygiene** (≥10 questions, ≥5 of them Advanced/Expert): Shadowed rules, disabled rules, no-hit rules, overly permissive rules, "Any Any Accept" hunts, expired temporary rules, rule consolidation opportunities, cross-policy rule consistency, least-privilege evaluation, the practical "what would break if I delete this rule" question.

**Bucket C — Object & Group Hygiene** (≥6 questions): Unused objects, duplicate objects (same IP different name), nested group analysis, object dependency tracing ("what references this group"), group sprawl analysis.

**Bucket D — Threat Prevention Quality** (≥6 questions, ≥3 Advanced): IPS profile coverage, protections in Detect that should be Prevent, Anti-Bot detection patterns, Threat Emulation status, ThreatCloud signature freshness, gateway-by-gateway threat prevention parity check.

**Bucket E — Day-to-Day Operations** (≥8 questions): Pre-change validation ("if I add a rule allowing X to Y, will it conflict with anything?"), post-change verification, policy installation status & failures, session/draft change inspection, administrator activity audit, recent change diff.

**Bucket F — Troubleshooting Real Cases** (≥8 questions): "Why is this traffic being dropped?", "Why did this policy install fail?", "User can't reach X", VPN flapping diagnosis, SIC trust issues, HA failover analysis, repeated drops investigation, HTTPS Inspection issues, Threat Prevention false positives.

**Bucket G — Compliance, Audit & Evidence** (≥6 questions): "Show me evidence that no rule allows inbound RDP from internet", CIS Check Point Firewall Benchmark compliance, PCI/HIPAA/GDPR-relevant control evidence, separation of duties, audit-friendly export of specific findings, board-ready posture summary.

**Bucket H — VPN & Connectivity** (≥4 questions): VPN community config consistency, tunnel health, encryption settings comparison across communities, gateway routing/NAT interaction questions.

**Bucket I — Migration, Upgrade & Capacity Planning** (≥4 Advanced questions): R80.40 → R81.20 upgrade readiness per gateway, capacity/scaling questions, blade compatibility matrices, license compatibility, deployment templates derived from existing gateways.

**Bucket J — Trap Questions / Negative Testing** (≥8 questions): Questions about objects/gateways/policies that don't exist, ambiguous references that match multiple objects, questions that imply a wrong assumption ("which gateway is running R82?"), questions that ask for write actions AI Assist shouldn't perform, questions in scope but outside the current management domain, questions about a feature AI Assist doesn't support, very broad open-ended questions where AI should ask for clarification, questions with internal contradictions, leading questions that try to elicit hallucinated agreement.

**Bucket K — Complex Multi-Step Analytical Workflows** (≥8 Expert questions): These are the questions that most stress-test reasoning chains:
- Full rulebase hygiene audit (combine shadowing + hit-count + permissiveness analysis with prioritized cleanup plan)
- Full security posture audit across the entire environment (gateways + policies + threat prevention + identity + VPN) producing a board-ready executive summary
- Cross-policy consistency audit (same-name objects with different definitions, missing standard services, inconsistent NAT)
- Topology / connectivity map generation (which GW protects which subnet, which VPN community connects which sites, isolated gateways flagged)
- Pre-deletion impact analysis ("if I delete this object, what rules, NAT, VPN communities, and threat exceptions break?")
- Migration readiness report (per-gateway compatibility + license + estimated downtime + recommended order + risk flags)
- Traffic path trace (source → destination through the entire policy/NAT/inspection/threat prevention stack with logs from the last 24 hours)
- Anomaly detection on administrator activity (unusual hours, mass changes, high-risk targets)

Total minimum: ~70 individual questions plus the conversation scenarios below.

### 2. Conversation Flow Scenarios (Not Word-By-Word Scripts)

Generate at least 12 conversation flows. Each flow describes a real admin task end-to-end. For each, specify:

- **Workflow title and the real-world trigger** (e.g., "Quarterly Rulebase Cleanup triggered by compliance calendar")
- **Starting context** (what the admin knows, what they don't, what they're trying to achieve, what time pressure or stakeholder pressure exists)
- **The conversation arc** as a sequence of intents (turn 1 intent, turn 2 intent, etc.) — describe **what the admin is trying to learn or accomplish at each turn**, not the literal words. Example: "Turn 1: ask for a broad inventory framing the scope. Turn 2: based on what AI returned, drill into the weakest item. Turn 3: ask for a comparison against a peer item to establish whether the weakness is local or systemic." The LLM tester will phrase each turn naturally based on the actual AI response.
- **Branching guidance**: if AI gives Answer Style X, the tester should push in direction Y; if AI gives Answer Style Z, push in direction W. Cover at least one branch per scenario where the admin pivots or corrects course based on the answer.
- **Pronoun and reference traps**: explicitly include turns that test conversational memory ("the gateway you mentioned earlier", "go back to the policy from turn 2", "exclude what we excluded before")
- **Constraint introduction mid-conversation**: at least one turn should add a constraint that should apply retroactively or going forward ("from now on, only look at production policies", "ignore the lab gateways from here on")
- **Success criteria for the whole conversation**: what would make this conversation valuable to a real admin vs. a frustrating dead-end

Mandatory conversation themes (pick at minimum these 12):

1. **Monday morning posture review before standup** — broad → drill → compare → prioritize → request standup-ready summary
2. **Change request: open a specific access path** — current-state verification → object existence → recommended rule → NAT/HTTPS-Inspection implications → rollback plan
3. **The auditor's RDP-from-internet question** — find evidence → verify with logs → produce auditor-friendly export
4. **Quarterly rulebase cleanup deep dive** — find candidates → classify by safety → impact-of-deletion check on a tricky one → sequenced cleanup plan
5. **Incident investigation: outbound to a known C2** — which GW saw it → which rule allowed it → why threat prevention didn't catch it → broader hunt for related activity
6. **VPN tunnel flapping diagnosis** — community config → compare to working community → IKE/IPsec logs → root cause → fix
7. **New branch gateway deployment planning** — template selection from existing GW → blade/policy/VPN config → license → tailored deployment checklist
8. **R80.40 → R81.20 migration readiness** — list affected GWs → per-GW compatibility → upgrade order → rollback template → deprecated feature scan
9. **Rulebase optimization with 30% reduction goal** — distribution analysis → consolidation candidates → before/after proposal → performance impact → change request export
10. **The "Any Any Any" hunt before a new CISO arrives** — discovery → per-rule justification → safer replacement based on real traffic → remediation plan
11. **Compliance officer asks for PCI / HIPAA / GDPR evidence** — control framework mapping → policy/object/log evidence per control → gaps and remediation
12. **M&A network consolidation** — compare two rulebases → identify overlaps and conflicts → propose consolidation plan with risk flags

In each scenario, also evaluate: does AI Assist proactively volunteer the next obvious step? Does it remember scope across turns? Does it gracefully recover from a correction? Does the quality degrade after turn 6?

### 3. Answer Quality Scoring Rubric

Every answer (single-turn or in a conversation) is scored on the following dimensions using a 1–5 scale. The test plan must define each criterion precisely so two evaluators score the same answer similarly.

| Dimension | Weight | What it Measures |
|---|---|---|
| **Factual Correctness** | 25% | Are the specific claims about gateways, rules, objects, policies, blade states, hit counts, etc. correct when verified against SmartConsole? |
| **Grounding & Honesty** | 20% | Is the answer based on real API data (visible in the Management API Query phase) vs. hallucinated? When AI doesn't know, does it say so? Does it conflate assumptions with facts? |
| **Technical Accuracy** | 15% | Is Check Point terminology used correctly? Are concepts described accurately (e.g., not confusing Inline Layer with Sub-Policy, not confusing SIC with VPN)? |
| **Depth & Completeness** | 15% | Does the answer cover what an expert admin would expect, or only the surface? Does it surface the "obvious next concern" the admin would have? |
| **Practical Usefulness** | 10% | Would a real admin save meaningful time? Would they trust this enough to act on it? Or is it generic chatbot fluff? |
| **Proactiveness & Insight** | 10% | Does the answer go beyond literal Q&A — flag risks, suggest cleanup, propose next steps, identify patterns the admin didn't ask about but should know? |
| **Clarity of Reasoning** | 5% | Is the thinking phase coherent? Does the answer explain why, not just what? |

Compute a weighted total per answer (out of 5). For each tested question, the report records the score and a one-line justification per dimension.

In addition to per-answer scoring, compute aggregates:

- **Hallucination rate**: % of answers containing at least one verifiably-false specific claim
- **Honest "I don't know" rate**: % of negative/ambiguous prompts where AI correctly declines or asks for clarification instead of guessing
- **Proactive value rate**: % of answers that surfaced a useful insight the admin didn't ask about
- **Trust score**: subjective overall — would the tester let this AI inform a real production change?

### 4. Ground Truth Validation Methodology

For every answer that contains factual claims about the customer's environment:

1. **List every verifiable claim** the answer makes (e.g., "AIOPS-DEMO-MACHINE-1 has IPS enabled", "Corporate_Policy contains 47 rules", "Remote-Berlin has no Threat Emulation").
2. **For each claim, specify the SmartConsole navigation path** to verify it. The test plan should include a navigation cheat-sheet, e.g.:
   - Gateway blade state → Gateways & Servers > select gateway > Blades tab > Network Security tab + Threat Prevention tab
   - Rule existence/properties → Security Policies > select policy > scan rulebase or use search box for specific match
   - Object properties → Objects pane (right side) > Network Objects / Services / etc. > search > open
   - Policy installation targets → Security Policies > Manage Policies and Layers > select package > Installation Targets
   - Recent administrator activity → Sessions menu / Audit logs in Logs & Events
   - Threat Prevention profile per gateway → Threat Prevention policy view > select rule > Profile column
   - Log verification → Logs & Events > apply blade/source/destination/service/time filters
3. **Classify each verification result**: Exact Match / Minor Discrepancy (cosmetic) / Material Discrepancy (admin would be misled) / Hallucination (claim has no basis in product data)
4. **For every Material Discrepancy or Hallucination, capture a side-by-side screenshot** showing the AI claim and the actual product state.

The report aggregates: total claims verified, accuracy rate per bucket, list of all Material Discrepancies and Hallucinations with full evidence.

### 5. Stress Tests Inside the Plan

Embed these specific stress tests anywhere appropriate in the question bank or conversations — they're not a separate bucket, but the plan should explicitly call them out:

- **Repeat the same question twice in one conversation** — does the answer drift? Does it acknowledge it already answered?
- **Ask an obviously wrong premise** ("Show me the rules in the R82 gateway" — there is no R82 in this environment) — does AI correct the premise or play along?
- **Ask the same question under two different framings** (executive-style vs. SOC-style vs. terse-search-style) — is the substance consistent?
- **Inject irrelevant context** — does it ignore it cleanly or get confused?
- **Ask AI to estimate confidence** ("how sure are you about this?") — does it give a calibrated answer or always say "very confident"?
- **Ask AI to disagree with itself** ("Earlier you said X — argue the opposite") — does it cave instantly, defend correctly, or get incoherent?

### 6. Final Report Structure

The report produced after running the test plan must include:

1. **Executive verdict** (one paragraph): would a real Check Point admin find AI Assist trustworthy and time-saving today?
2. **Overall content quality score** (weighted aggregate across all answers)
3. **Per-bucket scoring dashboard** (A through K) with average score, hallucination rate, and proactive-value rate per bucket
4. **Conversation scenario results** (per-scenario score with the standout strengths and failures)
5. **Hallucination ledger** — every Material Discrepancy / Hallucination with the AI claim, the real value, the screenshot, and severity
6. **Strengths and weaknesses summary** grounded in specific examples (cite question IDs and screenshots)
7. **Trust-impact analysis** — for each weakness, what kind of admin decision would be at risk if it relies on this answer
8. **Recommendations** prioritized by impact on admin trust and daily productivity
9. **Appendix**: every question, the answer captured (or screenshot of it), the validation result, and the per-dimension scores

### 7. Screenshot Policy

The tester has live browser access and can capture screenshots at any moment. Screenshots are mandatory throughout:

- For every answer being scored — capture the full AI Assist response panel (thinking, API query, and rendered answer)
- For every Material Discrepancy or Hallucination — side-by-side: AI claim vs. SmartConsole reality
- For every clickable link verification — the link in the response, and the object dialog that opens after clicking
- For every conversation scenario — at least one screenshot per turn
- For every Trap question — the actual response, so the report can show how AI handled the trap

Every screenshot in the report must have a caption tying it to the test ID and what is being demonstrated. Annotate with red boxes/arrows where the issue lives.

### 8. Test Case Format

Each individual test case in the plan follows this structure:

```
Test ID: [Bucket]-[Number]  (e.g., B-007 for Rulebase Hygiene #7, K-003 for Complex Workflow #3)
Bucket: A through K (one of the intent buckets above)
Difficulty: Basic / Intermediate / Advanced / Expert / Trap
Admin Intent: [What the admin is trying to accomplish — one sentence]
Phrasing Direction: [Style guidance, not the literal text — the LLM tester will phrase it]
Expected Behavior: [What an excellent answer looks like — depth, structure, proactive flags. What a red-flag answer looks like.]
Validation Method: [Specific SmartConsole navigation path or log filter to verify]
Scoring Focus: [Which rubric dimensions this question is designed to stress]
Screenshot Required: Yes — [what to capture]
Result Fields (filled by tester): Score per dimension, weighted total, claims verified, discrepancies, notes
```

For conversation scenarios:

```
Scenario ID: CONV-[Number]
Title: [Real-world trigger]
Starting Context: [What the admin knows, doesn't know, is trying to achieve]
Turn-By-Turn Intent: [List of intents, with branching guidance — not literal text]
Memory & Constraint Tests: [Which turns specifically test pronouns, references, mid-conversation constraints]
Success Criteria: [What makes this conversation valuable to a real admin]
Result Fields: Per-turn score, conversation-level coherence score, memory accuracy, screenshots per turn
```

---

## Important Instructions for the Test Plan Author

- Focus exclusively on **content and answer quality**. Do NOT include UI testing, UX styling, performance benchmarks, accessibility, functional UI flows, button-click verification, or anything outside of "is the answer good and useful?".
- The tester is an LLM with live browser access. Do not specify exact word-by-word messages — describe **intent and conversation flow** so the LLM can phrase naturally and adapt to what AI Assist actually returned.
- Every question and conversation must reflect a **real Check Point admin's day-to-day reality**, drawn from change tickets, audit requests, incident response, capacity planning, compliance evidence, troubleshooting calls, and rulebase governance. If a question wouldn't pass the "would a real CCSE-certified admin ask this on a Tuesday morning?" smell test, drop it.
- A meaningful portion of the question bank (≥30%) must be **complex, multi-step, analytically demanding** — the kind of question that stresses reasoning chains, tool orchestration, and synthesis. Not just lookups.
- Use real Check Point terminology throughout. Avoid generic chatbot test inputs.
- Every Material Discrepancy or Hallucination must be backed by a side-by-side screenshot in the final report — the test plan must make this explicit.
- The plan should be immediately executable by an LLM-tester operating against the live portal — no setup gymnastics, no abstract instructions.
- Quantify everything that can be quantified: hallucination rate, per-bucket accuracy, proactive-value rate, conversation coherence score, trust score.
- The end goal of the test is to answer: **how beneficial is AI Assist for a real Check Point administrator today?** — every test case should contribute concretely toward that verdict.
