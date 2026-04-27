# INFA DQ Integration with Salesforce Data 360 - PRD

**Target Release:** 264 / 265
**Product Manager:** Sunetra Virdi
**Last Updated:** 2026-04-27

---

## 1. Executive Summary

Salesforce Data 360 integrates Informatica's enterprise-grade Data Quality engine to surface profiling stats and DQ scores directly in the Salesforce Catalog—without requiring users to learn or access Informatica. Business users can see data quality at a glance, and Marketing Ops Analysts can activate AI-recommended DQ rules in one click using a conversational assistant, with all Informatica configuration handled behind the scenes.

**Three Pillars:**
1. **Discovery** — Auto-profiling reveals data patterns, nulls, and format issues across DMOs and DLOs
2. **Enforcement** — AI-recommended DQ rules activate with one click; no rule engine knowledge required
3. **Observability** — Color-coded DQ scores visible in Catalog and inline in flow of work

---

## 2. Problem & Value Proposition

**Data Cloud customers face a trust gap:**
- Segmentation queries return incomplete results due to nulls, duplicates, and inconsistent formats
- Identity Resolution match rates are degraded by unstandardized contact data
- Business users have no visibility into data quality until downstream processes fail
- Context switching to Informatica IDMC requires technical expertise most users don't have

**What we're building:** A unified D360 experience where marketers can view DQ scores and activate rules directly in the Catalog—powered by Informatica DQ, fully abstracted.

---

## 3. Personas

| Persona | Technical Level | Primary Need |
|---------|----------------|--------------|
| **Marketing Manager** | Low | See color-coded DQ scores before campaign launch; no action required |
| **Marketing Ops Analyst** | Medium | Activate AI-recommended rules from Catalog; no IDMC knowledge needed |
| **Data Steward** *(future)* | High | Advanced rule configuration, cross-object governance |

---

## 4. MVP Scope

### Goal 1 (Phase 0): View DQ Scores — Existing INFA + D360 Customers

Surface existing Informatica profiling results and DQ scores inside D360 Catalog, no new setup required.

**Capabilities:**
- Color-coded DQ score badge per DMO/DLO in Catalog list view (Green 90–100%, Yellow 70–89%, Red <70%)
- Profiling stats at column level: Null %, Unique %, Invalid record count, Total records
- DQ score breakdown by dimension: Completeness, Accuracy, Validity, Consistency, Uniqueness
- "Last profiled" timestamp on all assets
- DQ score visible inline in flow of work (Marketing Cloud object picker), with tooltip and link to full report

### Goal 2 (Phase 1): Auto Profiling + AI-Powered DQ — New INFA Customers

Expand to D360 customers with no Informatica experience. 1-click setup agent handles connection; users never touch IDMC.

#### Capability 1: Automatic Profiling for All DMOs and DLOs

Profiling runs automatically for every DMO and DLO in D360 — no setup required.

- **Trigger:** Nightly batch job; also runs on DMO/DLO creation or refresh
- **Scope:** 100% of DMOs and DLOs in the customer's D360 org
- **Sample size:** 10K rows per object (configurable)
- **Output:** Profiling stats visible in Catalog within 24 hours
- **Stats surfaced:** Null %, Unique %, Invalid record count, Total records — per column

**"I Can" Statements:**
- I can view profiling stats for all my DMOs and DLOs in the Catalog without configuring anything
- I can see which columns have null values, invalid formats, and low uniqueness

#### Capability 2: AI-Powered DQ Recommendations (No Rule Engine Knowledge)

The system reads profiling results and generates plain-English DQ recommendations surfaced directly in the Catalog.

**How recommendations are generated:**
- High null % on required fields → "Null Value Check" rule recommended
- Invalid email/phone patterns → "Email Format Validation" or "Phone Format Validation"
- Inconsistent country/region values → "Country Code Standardization"
- Low uniqueness on ID fields → "Duplicate Detection"

**How they are displayed:**
- Top 3 prioritized recommendations always visible in Catalog sidebar
- Each card shows: priority badge, plain-English description, affected DMOs/DLOs, number of impacted records
- Expandable to see "What this rule does" — no jargon, examples included
- Refreshed after each profiling run

**"I Can" Statements:**
- I can see AI-recommended DQ rules based on my profiling data, ranked by business impact
- I can understand what each rule checks in plain English before I activate it

#### Capability 3: One-Click Rule Scheduling (Zero Rule Engine Knowledge)

The analyst activates rules through Catalog — the system handles all Informatica DQ configuration behind the scenes.

**Entry points:**
1. **Catalog sidebar** — [Set Up Rule] on any recommendation card
2. **Asset detail page** — Data Quality tab shows per-object recommendations with [Set Up Rule]
3. **DQ Assistant chat** — "Activate rule 1" or "Set up email validation"

**Experience flow:**
1. Analyst clicks [Set Up Rule] → Conversational chat opens pre-loaded with rule context
2. Analyst can ask questions: "What will this fix?" "Which fields?" "How often does it run?"
3. Analyst confirms: clicks button or types "yes" / "activate" / "go ahead"
4. Rule is scheduled in Informatica DQ — analyst never sees the rule engine

**What is hidden from the analyst:** Informatica DQ rule syntax, asset connection setup, technical rule parameters

**What the analyst sees:**
- Business impact: "1,850 Lead records have invalid email addresses"
- Plain English: "This rule checks if emails follow the format name@domain.com"
- Schedule confirmation: "Will run daily at 2:00 AM, email summary after each run"

**"I Can" Statements:**
- I can schedule a DQ rule in one click from the Catalog without knowing Informatica DQ
- I can confirm what a rule will do before activating it through a conversational chat

#### Capability 4: Conversational DQ Assistant

Two AI chat experiences available in the Catalog.

**A. Contextual Rule Setup Chat** — opens per rule
- Pre-loaded with that rule's context
- Answers: "What does this rule check?", "Which columns?", "What if I have questions after it runs?"
- Two-step confirmation before activation

**B. General DQ Assistant** (floating 🤖, always accessible)
- Handles any DQ question across all DMOs/DLOs
- Natural language: "Show me all pending rules", "Activate rule 1", "What needs attention?", "Which DMOs have low scores?"
- Number-based commands: "activate 1" maps to top recommendation
- Conversational context: remembers pending activation within session

**"I Can" Statements:**
- I can ask any question about my data quality and get a plain-English answer
- I can activate rules conversationally without navigating through settings

#### Capability 5: DQ Score Visibility After Rules Run

Once rules execute, updated scores appear throughout the Catalog.

- **Catalog list view:** Color-coded DQ score badge per DMO/DLO (Green 90–100%, Yellow/Orange 70–89%, Red <70%)
- **Asset detail page — Data Quality tab:** Overall DQ score; score by dimension (Completeness, Accuracy, Consistency, Validity, Uniqueness); column-level breakdown with failed record counts
- **Profiling tab:** Column-level stats (Null %, Unique %, Invalid count)

**"I Can" Statements:**
- I can view updated DQ scores in the Catalog after rules run
- I can see which dimensions are failing and by how much
- I can drill into a specific DMO to see which columns are causing quality issues

---

## 5. User Journeys

*For full journey flows, acceptance criteria, and prototype details, see the [User Journey Flow doc](Data%20Quality%20INFA%20Integration/2026-04-22-user-journey-flow-dq-agents-business-users-catalog.md).*

### Goal 1: Marketing Manager Checks Data Quality Before Campaign

- Opens Salesforce Catalog → Explore Assets
- Sees stats dashboard: Total Assets, Profiled Assets, Needs Attention count
- Views color-coded DQ score badges on each asset in the table
- Filters by Source (e.g., Salesforce), sorts by DQ Score
- Clicks an asset → views Profiling Results tab and Data Quality tab
- In Marketing Cloud, selects a DMO and sees DQ score inline without leaving the flow

### Goal 2: Marketing Ops Analyst Activates a DQ Rule

- Opens Catalog → sees Top DQ Recommendations sidebar (always visible, right side)
- Expands a recommendation card: "Email Format Validation — 1,200 Lead records affected"
- Clicks [Set Up Rule] → AI chat opens in sidecar with full context pre-loaded
- Asks questions: "Which fields?", "Show me examples", "What happens if issues are found?"
- Types "confirm" → rule is scheduled; success alert appears; analyst never sees IDMC
- Alternatively: uses floating DQ Assistant, types "activate 1" → same conversational flow

---

## 6. Out of Scope

- **Any DQ rule creation, editing, or advanced configuration must be done in Informatica IDMC** — D360 surfaces rules and scores only
- **DQ setup, connection management, and asset registration in Informatica** — handled by the 1-click setup agent; not exposed to the user
- External data sources (Snowflake, Databricks, S3) — Phase 2+
- Data in motion (pipelines, streaming) — batch only
- Cross-table / multi-DMO validation rules
- Custom rule schedules (daily at 2 AM only in Phase 1)
- Real-time or on-demand profiling triggers from D360
- Remediation / write-back to source systems
- Historical DQ score trends — Phase 2+
- Quarantine record management in D360
- OAuth SSO with IDMC — Phase 2+
- Data Steward persona (advanced governance) — future

---

## 7. API Requirements

### Goal 1 APIs — View DQ Scores (Read-Only)

To display profiling results and DQ scores for existing INFA customers in D360, the following IDMC APIs are required:

**Profiling Results:**
- `GET /profiling/assets/{assetId}/results` — Retrieve column-level profiling stats (Null %, Unique %, Invalid count, Total records, last profiled timestamp) for a given DMO or DLO
- `GET /profiling/assets` — List all profiled assets available in the customer's IDMC org

**DQ Scores:**
- `GET /dqscores/assets/{assetId}` — Retrieve overall DQ score and per-dimension breakdown (Completeness, Accuracy, Validity, Consistency, Uniqueness) for an asset
- `GET /dqscores/assets/{assetId}/columns` — Field-level DQ scores and failed record counts
- `GET /dqscores/assets` — Aggregate scores across all assets (for Catalog list view badges)

**Auth / Connection:**
- `POST /auth/token` — Obtain session token for D360-to-IDMC API calls (polling model; 24-hour cache acceptable for Phase 0)
- `GET /org/connection` — Validate that the customer's IDMC org is reachable and connected

### Goal 2 APIs — Auto Profiling + Rule Scheduling (Read + Write)

In addition to all Goal 1 APIs, the following are needed to support auto profiling and one-click rule activation:

**Auto Profiling:**
- `POST /profiling/jobs` — Schedule a profiling job for a given asset (invoked by D360 nightly batch agent)
- `GET /profiling/jobs/{jobId}/status` — Poll profiling job completion before surfacing results
- `POST /profiling/jobs/batch` — Trigger profiling across all DMOs/DLOs in one request (preferred over per-asset calls)

**AI Rule Recommendations:**
- `GET /rules/recommendations/{assetId}` — Retrieve Informatica-generated rule recommendations based on latest profiling results; must return rule type, affected columns, impacted record count, and plain-English description
- *(If IDMC does not provide recommendations natively, D360 generates them from profiling stats via internal ML; no additional IDMC API needed)*

**Rule Scheduling:**
- `POST /rules/schedules` — Create and schedule a DQ rule on a given asset; payload includes rule type, target asset ID, target columns, and schedule (daily)
- `GET /rules/schedules/{ruleId}/status` — Confirm rule is active and retrieve next run time
- `GET /rules/executions/{assetId}` — Retrieve results of the last rule run (pass/fail counts per column, updated DQ score) to refresh Catalog after execution

**1-Click Setup Connection:**
- `POST /connections` — Register D360 org with IDMC (invoked once by setup agent; not user-facing)
- `GET /connections/{connectionId}/health` — Health check for the D360↔IDMC connection

---

## 8. Open Questions

1. Does Informatica IDMC provide a native rule recommendations endpoint, or does D360 generate them from raw profiling stats?
2. What are IDMC API rate limits? Do we need request batching or a caching layer for score reads?
3. Multi-org: how do we handle customers with separate IDMC prod/sandbox environments?
4. Error handling: show cached (stale) scores with a warning banner, or hide scores when IDMC is unreachable?
5. Monetization: bundled with D360 + IDMC, or separate consumption model for Phase 1?
