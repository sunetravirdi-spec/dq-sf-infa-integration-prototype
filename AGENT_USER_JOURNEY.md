# Data Cloud Agent — User Journey
**Persona:** Taylor Park, Marketing Analyst  
**Goal:** Create a trusted Calculated Insight for campaign lead quality using Account, Campaign, Lead, and CampaignMember DMOs  
**Entry point:** Data Cloud → Agent tab  
**Date:** 2026-04-24

---

## Journey Map

```
Open Agent → DQ Health Check → Field Drill-Down → Fix Rules → Set Gate → Create CI → Preview → Publish → Notify Analyst → Schedule Monitoring
```

---

## Step 1 — Open the Agent

**Where:** Any Data Cloud tab  
**Trigger:** Taylor clicks the "Agent" tab (first in nav) or the ✦ sparkle icon in the top-right nav.

**What Taylor sees:**
- Full-screen dark interface (Claude-style) with left sidebar and centered chat area
- Greeting from Data Cloud Agent: capabilities listed, 5 quick-action chips shown
- Chips: "Check Campaign DMO health", "Check Account DMO health", "Create Campaign Lead Quality CI", "Drill into Lead field issues", "Apply DQ rules across all DMOs"

**Taylor's thought:** *"I need to build a campaign lead quality CI. Let me check if my data is clean enough first."*

---

## Step 2 — DQ Health Check

**Taylor types (or clicks chip):** "Check Campaign DMO health"

**Agent responds with:**
- Score cards for all 4 DMOs:
  - Account: **92%** 🟢
  - Lead: **78%** 🟡 — Issues: Email, Country
  - Campaign: **65%** 🔴 — Issues: StartDate, Type
  - CampaignMember: **71%** 🟡 — Issues: CampaignId
- "Click a chip below to drill into field-level issues."

**Chips refresh to:** "Fix the failing fields", "Create Calculated Insight", "Drill deeper into Campaign", "Apply bulk rules"

**Taylor's thought:** *"Campaign is at 65% — that's the problem. Let me see which fields."*

---

## Step 3 — Field-Level Drill-Down

**Taylor types:** "Drill into Campaign field issues"

**Agent responds with a field table:**

| Field | Score | Issue |
|---|---|---|
| Name | 99% ✓ | — |
| Status | 72% ⚠ | Null values |
| StartDate | 54% 🔴 | Invalid date ranges |
| EndDate | 61% ⚠ | High null rate (15%) |
| Type | 43% 🔴 | Non-standard picklist values |

**Taylor's thought:** *"StartDate and Type are the worst. I need rules to fix these before I can create the CI."*

---

## Step 4 — Fix DQ Rules

**Taylor types:** "Apply DQ rules across all DMOs"

**Agent responds with before/after comparison:**

| DMO | Before | After | Δ |
|---|---|---|---|
| Account | 92% | 96% | +4% |
| Campaign | 65% | 74% | +9% |
| Lead | 78% | 83% | +5% |
| CampaignMember | 71% | 79% | +8% |

Rules applied: null checks, validity constraints, referential integrity, format standardization.

**Taylor's thought:** *"Better — but Campaign is still at 74%. Is that enough to create the CI?"*

---

## Step 5 — Set DQ Gate

**Taylor types:** "Set DQ threshold to 85%"

**Agent responds with gate check:**
- Account 96% — ✓ Pass
- Lead 83% — ✗ Fail (below 85%)
- Campaign 74% — ✗ Fail (below 85%)
- CampaignMember 79% — ✗ Fail (below 85%)

> *"⚠ Apply bulk rules first to bring Campaign and CampaignMember above 85%."*

**Taylor's thought:** *"OK, 3 DMOs still fail. But the agent said it can proceed with exclusions applied — let me try creating the CI and see what gets excluded."*

---

## Step 6 — Create the Calculated Insight

**Taylor clicks chip:** "Create Campaign Lead Quality CI"

**Agent runs a 3-step flow:**

**Step 1 — Gate check:**
Shows the same pass/fail breakdown. Notes: "3 DMOs below threshold. Proceeding with exclusions applied…"

**Step 2 — Exclusion report:**
- Campaign: 701 records excluded (StartDate invalid, Type non-standard)
- Lead: 823 records excluded (Country inconsistent, Phone null)
- CampaignMember: 323 records excluded (orphaned CampaignId references)
- **Total: 1,847 excluded (12.3% of 15,000 records)**

**Step 3 — CI Preview card:**
```
Campaign_Lead_Quality_by_Account
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Total Leads (DQ-filtered)   13,153
Conversion Rate             14.2%
Cost per Lead               $47
Lead Quality Score          78/100
```
Buttons: **[Publish CI]** · [View Exclusions]

**Taylor's thought:** *"14.2% conversion on clean data vs what would it be with dirty data included? Let me check."*

---

## Step 7 — Compare With/Without DQ Filter

**Taylor types:** "Show me the comparison with and without DQ filter"

**Agent responds:**

| Metric | With DQ Filter | Without Filter |
|---|---|---|
| Total Leads | 13,153 | 15,000 |
| Conversion Rate | **14.2%** | 11.8% |
| Cost per Lead | **$47** | $58 |
| Lead Quality Score | **78/100** | 62/100 |

**Taylor's thought:** *"The DQ filter actually improves the metrics — that's the data I want to act on. Publishing."*

---

## Step 8 — Publish the CI

**Taylor clicks:** [Publish CI]

**Agent responds:**
> ✅ **Campaign_Lead_Quality_by_Account** published successfully! The CI is now available in Calculated Insights and will refresh on every pipeline run.

**Chips refresh to:** "Notify marketing analyst", "Schedule DQ monitoring", "Check DQ trend (30 days)"

---

## Step 9 — Notify the Analyst

**Taylor clicks chip:** "Draft Slack message to analyst"

**Agent produces a ready-to-send draft:**
```
@channel 📊 Data Quality Alert — Campaign Lead Quality CI

DMO Scores: Account 92% ✓ | Lead 78% ⚠ | Campaign 65% ✗ | CampaignMember 71% ⚠

Top issues requiring transform fixes:
• Lead.Country — 825 records with inconsistent values
• Campaign.StartDate — 112 records with invalid date ranges
• Campaign.Type — 234 records with non-standard picklist values
• CampaignMember.CampaignId — 847 orphaned records

Action needed: Apply Data Cloud transform fixes before next pipeline run.
— Data Cloud Agent
```

Taylor copies and posts. Done.

---

## Step 10 — Schedule Monitoring

**Taylor types:** "Schedule DQ monitoring"

**Agent confirms:**
- Trigger: after every pipeline refresh
- Alert threshold: <85% on any critical field
- Action: block dependent CIs + notify analyst via Slack
- DMOs monitored: Account, Campaign, Lead, CampaignMember

---

## Agentforce Touchpoints Summary

| Step | Agent Action | Value |
|---|---|---|
| 1 | Greeting + chips | No blank slate — immediate direction |
| 2 | DQ health overview | Full picture in one response, no tab-switching |
| 3 | Field drill-down | Pinpoints exact fields, not just overall score |
| 4 | Bulk rule apply | One sentence fixes rules across 4 DMOs |
| 5 | Gate check | Clear pass/fail — no guessing what "good enough" means |
| 6 | CI creation flow | 3-step guided flow with real exclusion counts |
| 7 | Comparison table | Proves the DQ filter improves results, builds trust |
| 8 | Publish | One click, gated by data quality |
| 9 | Slack draft | Ready-to-send in one chip click |
| 10 | Monitoring | Self-service — no ticket to data engineering |

---

## Design Principles Applied

1. **Verdict before detail** — every response leads with the score or outcome, not the methodology
2. **Numbers in records, not percentages** — "1,847 excluded" is more actionable than "12.3% excluded"
3. **Progressive disclosure** — chips guide the next logical step without overwhelming the analyst
4. **DQ as a gate, not a wall** — CI can be created with exclusions even when DMOs fail; the gate prevents silent bad data, not all work
5. **Agent as colleague** — drafts messages, generates instructions, schedules jobs so Taylor doesn't need to context-switch

---

## Out of Scope (v1)

- Automated field remediation (transform is still a manual handoff)
- Real SAQL generation for the CI
- Cross-DMO lineage graph
- Per-field threshold overrides in the agent (UI only)
