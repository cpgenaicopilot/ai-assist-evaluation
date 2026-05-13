# How to Set Up the Claude Project

This guide walks you through turning this folder into a shareable Claude Project where your team can explore the AI Assist evaluation and ask their own questions of the evidence.

## Step 1 — Create the Project

1. Go to https://claude.ai
2. Click **Projects** in the left sidebar → **Create Project**
3. Name it: **AI Assist Content Quality Evaluation**
4. Description: *"Evidence base and findings from the 2026-05 quality test of Check Point AI Assist on cp-all-demo. Explore raw transcripts, the executive report, and ask whatever you want about how AI Assist behaved."*

## Step 2 — Upload Project Knowledge

Upload every file in this folder into the Project's **Project Knowledge** section. The recommended order (so the side panel reads cleanly):

1. `00-README.md` — index of everything
2. `01-final-report.md` — primary report
3. `02-test-plan-prompt.md` — methodology
4. `03-bucket-A-posture-inventory.md` through `03-bucket-K-complex-multi-step-workflows.md` — 11 bucket transcript files
5. `04-conversation-transcripts.md`
6. `05-followup-tests.md`
7. Files in `screenshots/` — 19 curated PNGs (drag the whole folder)

**File size note**: every text file in this bundle is well under Claude Project's per-file limits. The total knowledge base is approximately 1 MB of text plus screenshots.

## Step 3 — Paste the System Prompt

In the Project's **Custom Instructions** field (Settings → Custom Instructions), paste the contents of this block:

```
You are the team's guide to the AI Assist content-quality evaluation conducted on 2026-05-12 to 2026-05-13 against the cp-all-demo Check Point tenant.

Your role:
- Help teammates explore the evidence in Project Knowledge — they may be product managers, engineers, security researchers, or executives
- Answer questions grounded in the test transcripts and final report, citing specific test IDs (e.g., B-005, J-001, CONV-001-T3, MULTI-001-T4) when relevant
- Show or describe specific screenshots when they illustrate a point, by referencing the file name (e.g., screenshots/test-J001-top.png)
- Distinguish between (a) what the report explicitly concludes, (b) what individual transcripts show, and (c) reasonable inferences from the evidence. Label your sources.

Guardrails:
- Do not invent test IDs, scores, or claims not present in the knowledge base
- When asked about transcripts you can't find in the knowledge base, say so explicitly — do not fabricate behavior
- The evaluation was a snapshot in time (mid-May 2026). The AI Assist product may have evolved since then. Caveat accordingly when users ask about "current" behavior
- Some findings are nuanced (e.g., the J-001 hallucination is contrasted with J-002 / J-008 / A-006 which were handled correctly). When asked about a finding, present the full context including counter-examples

Where to start when you don't know which file to read:
- For executive questions, scoring, recommendations: 01-final-report.md
- For methodology: 02-test-plan-prompt.md
- For a specific test ID: derive the bucket from the letter prefix and read the corresponding 03-bucket-*.md file
- For conversation memory questions: 04-conversation-transcripts.md or 05-followup-tests.md
- For "what exactly did you ask AI Assist" / "print the prompts": 06-all-prompts.md
- For "show me the screenshot for test X": 07-screenshot-index.md → reference the matching file in screenshots/
- For "how does AI Assist handle X" exploratory questions: search the bucket files broadly

Tone: knowledgeable, specific, willing to go deep into transcripts when asked. Treat the team as competent technical readers who want primary evidence, not just summaries.
```

## Step 4 — Share the Project

Once set up:

1. Click the **Share** button at the top right of the Project
2. Choose how to share:
   - **With specific people**: enter their Anthropic Claude email addresses
   - **With your whole organization**: select org-wide sharing if your plan supports it
3. Copy the share link and send it to the team

## Step 5 — Suggested First Questions for the Team

Send these along with the share link to help colleagues get oriented:

- **"Give me the 60-second summary of the evaluation."**
- **"What was the single most important finding and why does it matter?"**
- **"Show me an example of AI Assist's best work and an example of its worst."**
- **"What did the trap questions reveal about hallucination risk?"**
- **"How does AI Assist handle multi-step workflows when the user pushes it to make a commitment it can't justify?"** *(this is the MULTI-001 finding — gold standard behavior)*
- **"What's the difference between a good and a bad prompt for AI Assist?"** *(Section 10 subsection)*
- **"What should we prioritize fixing before going GA / wider rollout?"**

## What this Project enables

- **Product managers** can ask scoping and prioritization questions: *"Of the 5 recommendations, which one would unlock the biggest trust improvement?"*
- **Engineers** can dig into transcripts: *"Show me the actual API tool sequence in B-005 — what tools were called in what order?"*
- **Security researchers** can interrogate edge cases: *"How did the AI handle J-005 (the write-action request)? Was the refusal explanation accurate?"*
- **Executives** can ask trust-framing questions: *"Are we ready to deploy AI Assist to our enterprise customers? What's the residual risk?"*

The team gets the entire evidence base in one place and Claude becomes the search/synthesis layer over it.

---

## Optional: Refresh the Project later

If you want to re-run the evaluation in a few months to track progress:

1. Re-run the test plan from `02-test-plan-prompt.md` against the new AI Assist version
2. Bundle new transcripts the same way (see `bundle-responses2.js` in the parent directory)
3. Upload as a new set of files (e.g., `06-rerun-2026-09-...md`) so the Project preserves longitudinal evidence
4. Update `01-final-report.md` or add a `01b-rerun-report.md` for comparison

This lets the Project become a living regression test of the product.
