# Data Cloud Agentic DQ Experience — User Journey
**Persona:** Marketing Analyst (e.g., Taylor Park)  
**Context:** Data Cloud · Data Model Object (DMO) detail view  
**Goal:** Understand and improve data quality so campaign segments are trustworthy

---

## Journey Overview

```
Catalog List → DMO Header (DQ Score + Agentforce Banner) → Profiling Tab (Dimension Scores) → Data Quality Tab (Rules) → Rule Setup Chat → Confirmation
```

---

## Step 1 — Land on Catalog List

**Where:** `/catalog` — the Data Objects table  
**What the analyst sees:**
- Table of DMOs, DLOs, and source tables with a DQ Score column
- Right sidebar: "Top DQ Recommendations" panel (AI-powered, prioritized by impact)
- Floating Claire assistant button (bottom-right)

**What Agentforce does:**
- Surfaces 3 cross-object recommendations ranked by impacted record count
- Each card is expandable — shows plain-English explanation of the rule

**Analyst action:** Notices `Campaign__c` has a DQ score of **65%** — lowest in the table. Clicks the row.

---

## Step 2 — Arrive at DMO Detail: Header

**Where:** DMO detail page, object header  
**What the analyst sees:**

| Element | Detail |
|---|---|
| Object icon + name | 📊 `Campaign__c` |
| Domain / Business Object / Status / Owner | Metadata grid |
| **DQ Score badge** | `65%` in amber — visible at a glance in the metadata row |
| **Agentforce Recommendation banner** | Purple-bordered strip below the metadata grid |

**Agentforce banner content:**
> ✦ **Agentforce Recommendation** — Focus on **Completeness** and **Consistency** to improve campaign targeting accuracy. [View recommended rules →]

**Why this matters to the analyst:**  
They don't need to navigate anywhere to understand what's wrong. The DMO header gives them a verdict and a path forward without clicking into tabs.

**Analyst action:** Reads the banner. Clicks "View recommended rules →" which jumps to the Data Quality tab. Or — they choose to understand the data first and click **Profiling Results**.

---

## Step 3 — Profiling Results Tab: Dimension Breakdown

**Where:** `Profiling Results` tab  
**What the analyst sees:**

**Summary stat cards (row 1):**
- Total Columns · Null Records · Invalid Records · DQ Score

**DQ Score by Dimension (row 2 — new):**

| Completeness | Validity | Consistency | Uniqueness | Accuracy |
|---|---|---|---|---|
| 58% 🔴 | 71% 🟡 | 64% 🔴 | 92% 🟢 | 68% 🟡 |

Each card has:
- Large colored score number (red / amber / blue / green)
- Mini progress bar color-coded to threshold
- Dimension label

**Below:** Per-column profiling table (Null %, Unique %, Invalid Count, Total Records)

**Why this matters:**  
The analyst can pinpoint *which quality dimension* is dragging the score down — no SQL, no external BI tool needed. Completeness and Consistency are clearly the weak spots for `Campaign__c`.

**Analyst action:** Confirms the banner was right. Clicks **Data Quality** tab.

---

## Step 4 — Data Quality Tab: Recommended Rules

**Where:** `Data Quality` tab  
**What the analyst sees:**
- Blue info banner: "AI-powered recommendations based on profiling analysis"
- Rule cards for each detected issue:

**Rule 1 — Date Range Validation**
- Column: `StartDate, EndDate` · Dimension: Validity
- Reason: End dates before start dates detected
- Impact: 112 records have invalid date ranges
- [Set Up Rule] button

**Rule 2 — Null Value Check**
- Column: `Status, StartDate` · Dimension: Completeness
- Reason: Critical campaign fields have null values
- Impact: 246 records are incomplete
- [Set Up Rule] button

**Why this matters:**  
Rules are pre-scoped to *this DMO's* specific issues — not a generic rule library. The analyst sees impact counts (not just percentages) which translates directly to "how many campaigns are broken."

**Analyst action:** Clicks **Set Up Rule** on "Null Value Check" — highest impact.

---

## Step 5 — Rule Setup Chat (Sidecar)

**Where:** Right-side chat panel slides in over the content  
**What the analyst sees:**

Claire (AI assistant) opens with a confirmation flow:

> **Claire:** I'll set up the "Null Value Check" rule for `Campaign__c`.
>
> **This rule will:**  
> • Check fields: Status, StartDate  
> • Impact: 246 records  
> • Run: Daily at 2:00 AM  
> • Notify: Email summary after each run  
>
> Reply **"yes"** to confirm or ask me anything about this rule.

Analyst can ask:
- "What happens to flagged records?" → Claire explains quarantine vs. alert behavior
- "Can I change the schedule?" → Claire offers alternatives
- "Show me an example" → Claire shows before/after data sample

**Analyst action:** Types "yes" — rule is activated.

---

## Step 6 — Confirmation

**What the analyst sees:**
> ✅ Rule "Null Value Check" has been activated!
> • Will run daily at 2:00 AM  
> • DQ scores will update after each run  
> • Email notifications enabled  
> You can view rule status in the Rules dashboard.

**Post-activation state:**
- DQ score on `Campaign__c` shows a "pending refresh" indicator
- Next-day score improves as flagged records are addressed
- Email summary lands in analyst's inbox with a breakdown

---

## Agentforce Touchpoints Summary

| Step | Agentforce Surface | Value Delivered |
|---|---|---|
| Catalog List | Right sidebar recommendations | Cross-object prioritization without digging |
| DMO Header | Recommendation banner | Instant verdict: what to fix, why it matters |
| DMO Header | DQ Score badge in metadata | At-a-glance health — no tab click required |
| Profiling Tab | Dimension score cards | Pinpoints *which* quality dimension is failing |
| Data Quality Tab | Rule cards with impact counts | Scoped, actionable — not a generic rule library |
| Rule Setup Chat | Claire AI confirmation flow | No rule-engine knowledge required to activate |

---

## Design Principles Applied

1. **Verdict before detail** — The banner gives the analyst a conclusion at the top of the page. Drilling into tabs is optional, not required.
2. **Impact in records, not percentages** — "246 records incomplete" is more meaningful to a campaign analyst than "Completeness: 58%."
3. **Dimension-level transparency** — The 5-dimension breakdown makes quality legible to non-engineers. Uniqueness at 92% tells the analyst deduplication isn't the problem.
4. **One-click activation** — The entire path from noticing a low score to scheduling a quality rule is 4 clicks: row → banner link → Set Up Rule → yes.
5. **Agentforce as guide, not gatekeeper** — The banner can be dismissed. Rules can be understood before confirming. The analyst stays in control.

---

## Out of Scope (Future)

- Automated remediation (not just flagging) of invalid records via Data Transform
- Cross-DMO impact visualization: how `Campaign__c` quality affects downstream `Email_Engagement` segments
- Trend chart: DQ score over time per dimension
- Segment preview showing how rule activation would change audience size
