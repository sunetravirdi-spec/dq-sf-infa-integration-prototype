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

**Capabilities:**
- **Auto Profiling:** Nightly batch profiling for all DMOs and DLOs (10K row sample); results in Catalog within 24 hours; no setup required
- **AI Recommendations:** Top 3 prioritized DQ rule recommendations per object in Catalog sidebar, generated from profiling results; plain English with impact count (e.g., "1,200 Lead records have invalid email addresses")
- **One-Click Rule Scheduling:** Analyst clicks [Set Up Rule] → AI chat opens pre-loaded with rule context → analyst confirms → rule is scheduled in Informatica DQ; no rule engine knowledge required
- **Conversational DQ Assistant:** Floating assistant accessible from anywhere in Catalog; handles "what needs attention?", "activate 1", "show DQ scores", cross-asset questions; conversational context within session
- **Post-Rule Score Visibility:** Updated DQ scores and dimension breakdowns refresh in Catalog after each rule run; per-DMO score table with failed record counts

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
