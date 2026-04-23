# Informatica integration of Data Quality \- Version 2

# Introduction

Data quality in Informatica is the backbone of data management. This capability ties data catalog, data integration, data governance, and master data management together. Data Quality enables data admins, architects and data engineers to understand the shape (profile) of their data, cleanse and correct data through DQ rules, applying business logic, and transform/observe data into a quality bar that meets the organization's standards. Data quality has 3 main pillars.

1. **Discovery & Baseline (Data Profiling)** \- Every high-value customer insight begins with a "Lab Test." Through native Data Profiling, customers gain immediate transparency into the hidden patterns and flaws within their raw data.

2. **The Action Phase (Data Quality)** \- With the baseline established, Data Quality acts as the automated "Enforcement" layer, assessing, cleansing, standardizing, and enriching data in real-time.

3. **The Reliability Layer (Data Observability)** \- Data Observability serves as the continuous "Hospital Monitor," providing end-to-end visibility to catch anomalies before they impact the business.

---

## Customer Problem and Value Proposition

### 2.1 The Problem Today

**Data Cloud customers face a trust gap:**

- Identity Resolution produces match rates with an xx% gap due to unstandardized contact data
- Segmentation queries return incomplete results due to nulls, duplicates, and inconsistent formats
- Agentic Query/Metadata Search produces poor results when underlying data quality is unknown
- Data engineers spend xx+ hours/week manually profiling CRM data in external tools
- No visibility into data quality issues until downstream processes fail

**Current workarounds are painful:**

- Connect SF data to external DQ tools for validation
- Manually profile data in Jupyter notebooks or SQL queries
- Build custom validation logic in transforms (not reusable)
- React to quality issues post-failure instead of preventing them

### 2.2 The Solution: Native DQ Integration

**What we're building:** A unified Data Cloud experience where customers can profile, validate, and monitor data quality on their DMOs and DLOs without leaving the platform—powered by Informatica's enterprise-grade DQ engine, surfaced through AI-powered recommendations and conversational interfaces.

**Why it matters:**

- **For Marketing Managers:** See DQ scores in-context while building campaigns, decide if data is trustworthy before launching
- **For Marketing Ops Analysts:** Get AI-powered DQ recommendations and activate rules in one click—no Informatica rule engine knowledge required

---

## Personas

### Marketing Manager (Consumer) 👤
**Role:** Campaign strategist and segment builder  
**Technical Level:** Low — business user, not a data expert  
**Primary Need:** Visibility into data quality before using DMOs/DLOs for campaigns

**"I Can" Statements:**
- I can view DQ scores on my DMOs and DLOs in the Salesforce Catalog
- I can see which objects have been profiled and when
- I can understand data quality issues in plain English without technical jargon

### Marketing Ops Analyst (Action Taker) ⭐
**Role:** Data quality owner for marketing data  
**Technical Level:** Medium — understands data concepts, does not know Informatica DQ  
**Primary Need:** Simple way to improve DMO/DLO quality without learning a rule engine

**"I Can" Statements:**
- I can see AI-recommended DQ rules in the Catalog based on profiling results
- I can understand what each rule does in plain English before activating it
- I can schedule rules with one click — no Informatica DQ training required
- I can ask the DQ Assistant questions and activate rules conversationally
- I can view DQ scores after rules run to confirm improvement

---

## MVP Scope

### High Level Goals

| Title | Description | Phasing | Impact |
| :---- | :---- | :---- | :---- |
| **Existing customers of INFA + Salesforce D360** | Can view their profiling results and DQ scores from a single pane of glass in D360 | Phase 0 | Low |
| **Customers of D360 NEW to INFA** | Can view auto-profiling stats and run AI-recommended DQ rules from D360 Catalog — no rule engine knowledge needed | Phase 1 | High |

### Assumptions

* Data quality capability in D360 uses DQ rule engine from INFA
* Phase 1 is focused on data at rest
* The capability uses DQ headless agent
* Phase 1 scope is limited to DMOs and DLOs within Salesforce Data 360

### Out of Scope

* External data sources (Snowflake, Databricks, S3) — Phase 2+
* Data Quality on data in motion (data integration and pipeline)
* Cross-table validation and lookup rules
* Complex rules that require multiple DMOs
* Custom schedules (every other day or weekly)
* Manual rule creation in Informatica DQ interface
* Real-time profiling — batch only (nightly)
* Remediation / write-back to source systems

---

## Phase 0: Existing INFA + D360 Customers

#### Scope — I Can Statements

* As a marketer I can view the Data Quality Score on my DMOs, DLOs and CIs in the catalog
* As a marketer I can view Data Quality Score and Profiling stats in my objects from my flow of work

---

## Phase 1: Auto Profiling + AI-Powered DQ for New INFA Customers

**Core Innovation:** Marketing Ops Analysts improve data quality without ever touching the Informatica DQ rule engine.

### Capability 1: Automatic Profiling for All DMOs and DLOs

Profiling runs automatically for every DMO and DLO in D360 — no setup, no manual invocation required.

- **Trigger:** Nightly batch job; also runs on DMO/DLO creation or refresh
- **Scope:** 100% of DMOs and DLOs in the customer's D360 org
- **Sample size:** 10K rows per object (configurable)
- **Output:** Profiling stats visible in Catalog within 24 hours
- **Stats surfaced:** Null %, Unique %, Invalid record count, Total records — per column

**"I Can" Statements:**
- I can view profiling stats for all my DMOs and DLOs in the Catalog without configuring anything
- I can see which columns have null values, invalid formats, and low uniqueness

### Capability 2: AI-Powered DQ Recommendations (No Rule Engine Knowledge)

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

### Capability 3: One-Click Rule Scheduling (Zero Rule Engine Knowledge)

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

**What is hidden from the analyst:**
- Informatica DQ rule syntax and configuration
- Asset connection setup
- Technical rule parameters

**What the analyst sees:**
- Business impact: "1,850 Lead records have invalid email addresses"
- Plain English: "This rule checks if emails follow the format name@domain.com"
- Schedule confirmation: "Will run daily at 2:00 AM, email summary after each run"

**"I Can" Statements:**
- I can schedule a DQ rule in one click from the Catalog without knowing Informatica DQ
- I can confirm what a rule will do before activating it through a conversational chat

### Capability 4: Conversational DQ Assistant

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

### Capability 5: DQ Score Visibility After Rules Run

Once rules execute, updated scores appear throughout the Catalog.

- **Catalog list view:** Color-coded DQ score badge per DMO/DLO
  - Green (90–100%): Excellent
  - Yellow/Orange (70–89%): Good
  - Red (<70%): Needs Attention
- **Asset detail page — Data Quality tab:**
  - Overall DQ score
  - Score by dimension: Completeness, Accuracy, Consistency, Validity, Uniqueness
  - Column-level breakdown with failed record counts
- **Profiling tab:** Column-level stats (Null %, Unique %, Invalid count)

**"I Can" Statements:**
- I can view updated DQ scores in the Catalog after rules run
- I can see which dimensions (Completeness, Accuracy, etc.) are failing and by how much
- I can drill into a specific DMO to see which columns are causing quality issues

---

## Data 360 Setup and Connection

* Complete SaaS-ification and obfuscation of setup and auth steps
  * Customer using D360 already has D360 with connection built in — no separate IDMC authentication required
* 1-click setup agent handles connection between D360 and Informatica DQ rule engine
* Profiling and rule execution happen in INFA; results surface back to D360 Catalog automatically

---

## Requirements Summary

| Capability | Requirement | Phase |
| :---- | :---- | :---- |
| Auto Profiling | Nightly batch for all DMOs/DLOs, 10K row sample, results in Catalog within 24h | Phase 1 |
| AI Recommendations | Top 3 per object, ranked by impact, plain English, refreshed after each profiling run | Phase 1 |
| One-Click Scheduling | Full rule config hidden; analyst sees impact + plain English only | Phase 1 |
| Conversational AI | General assistant + per-rule chat; natural language + number commands | Phase 1 |
| DQ Score Display | Color-coded in list + detail view; breakdown by dimension and column | Phase 1 |
| Flow of Work | DQ score visible inline when selecting DMOs/DLOs in Marketing Cloud | Phase 1 |
