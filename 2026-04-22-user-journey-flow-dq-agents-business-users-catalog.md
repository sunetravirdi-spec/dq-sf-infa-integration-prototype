# Data Quality User Journey Flow

**Date:** 2026-04-22  
**Last Updated:** 2026-04-22
**Author:** Sunetra Virdi  
**Persona:** Marketer
**Status:** Prototype Complete

---

## Overview

This document outlines the user journey for marketers to view and manage Data Quality across technical data assets (Snowflake Tables, Salesforce DMOs, Databricks Delta Tables, Data Lake Objects, and Custom Integrations) in the Salesforce Catalog.

**Current Implementation:** React prototype with full conversational AI assistant for DQ rule management.

---

## Persona-to-Capability Matrix with Priorities

| "I Can" Statement | Priority | Marketing Manager (P0) | Marketing Ops Analyst (P0) | Data Steward (Future) |
|-------------------|----------|------------------------|----------------------------|----------------------|
| **Goal 1: View DQ Scores** | | | | |
| View profiling stats in Data Catalog | **P0** | ✅ Primary | ✅ Yes | ✅ Yes |
| View DQ Score on DMOs, DLOs, CIs in catalog | **P0** | ✅ Primary | ✅ Yes | ✅ Yes |
| **Goal 2: Profiling & Rules** | | | | |
| View recommended DQ rules based on profiling | **P0** | ✅ Yes | ✅ Primary | ✅ Yes |
| Schedule DQ rule in one-click from Catalog | **P0** | ❌ No | ✅ PRIMARY | ✅ Yes |
| Schedule DQ rule in one-click from Flow of Work | **P1** | ❌ No | ✅ SECONDARY | ✅ Yes |
| View overall score by dimension | **P0** | ✅ Yes | ✅ Yes | ✅ Primary |
| View DQ score per DMO within catalog | **P0** | ✅ Yes | ✅ Yes | ✅ Primary |
| View DQ score in flow of work (post-rule) | **P0** | ✅ Primary | ✅ Yes | ✅ Yes |
| Remediate failed records | **P1** | ❌ No | ✅ PRIMARY | ✅ Yes |

### Persona Definitions

**Marketing Manager (P0)** 👤
- **Role:** Reviews data quality before campaign launches
- **Focus:** High-level DQ visibility, decision-making on data usage
- **Technical Level:** Low - needs visual indicators (color-coded scores)
- **Journey Focus:** Viewing DQ scores in catalog and flow of work

**Marketing Ops Analyst (P0)** ⭐
- **Role:** Sets up and maintains data quality automation
- **Focus:** Configuring rules, monitoring execution, fixing data issues
- **Technical Level:** Medium - understands DQ concepts, can schedule rules
- **Key Capability:** 
  - **Primary:** One-click DQ rule setup from Salesforce Catalog
  - **Secondary:** One-click DQ rule setup from Flow of Work (DMO/DLO)

**Data Steward (Future - Not P0)** 🔮
- **Role:** Owns data quality standards and governance policies
- **Focus:** Defining rules, monitoring compliance, strategic oversight
- **Technical Level:** High - can create complex rules, interpret profiling
- **Journey:** Advanced rule configuration, cross-object validation

---

## Goal 1: View Data Quality Scores in Catalog

### User Journey: Viewing Data Quality Score on Technical Assets

**Persona:** Marketing Manager reviewing data quality before a campaign launch

**Implementation Status:** ✅ Complete in Prototype

#### Journey Steps:

```
1. [ENTRY POINT] Marketer opens Salesforce Catalog → "Explore Assets"
   ↓
2. See dashboard with 5 stat cards at top:
   - Total Assets: 10
   - Profiled Assets: 4 (only Salesforce DMOs)
   - DQ Recommendations: 3
   - Excellent Quality: 2
   - Needs Attention: 1
   ↓
3. See table of technical assets with columns:
   - Asset Name (e.g., SFDC_ACCOUNT_TABLE, Account__c)
   - Type (Snowflake Table, Data Model Object, Databricks Delta Table, etc.)
   - Source (Snowflake, Salesforce, Databricks, Pardot, Marketing Cloud)
   - Owner (Data Engineering, Sales Team, Marketing Team, etc.)
   - **Profiling Stats** (✓ checkmark for Salesforce DMOs only)
   - **DQ Score** (Color-coded, only for profiled assets)
     • Green: 90-100% (Excellent) - 92%, 95%
     • Yellow/Orange: 70-89% (Good) - 78%, 85%
     • Red: <70% (Needs Attention) - 65%
     • Blank (—) for non-profiled assets
   ↓
4. Filter by Source (All, Snowflake, Salesforce, Databricks, Pardot, Marketing Cloud)
   ↓
5. Sort by Name, DQ Score, or Type
   ↓
6. Click on any asset → Opens detailed view with tabs:
   - Summary (Definition, Columns, Technical Mapping)
   - Profiling Results (if available)
   - Data Quality (Recommended rules)
   - Lineage (Visual diagram)
```

#### "I Can" Statements:

✅ **As a marketer I can view the Data Quality Score on technical data assets in the catalog**

**Acceptance Criteria:** ✅ Implemented
- ✅ DQ Score displayed as color-coded badge (only for profiled assets)
- ✅ Green (Excellent), Yellow/Orange (Good), Red (Needs Attention)
- ✅ Sortable by Name, Type, DQ Score
- ✅ Filterable by Source system
- ✅ Profiling Stats indicator (✓) shows which assets have been profiled
- ✅ Shows technical assets (tables, objects) not just business concepts
- ✅ Clear distinction between profiled vs. non-profiled assets

---

### User Journey: Viewing DQ Score in Flow of Work

**Persona:** Campaign Manager building a customer segment in Marketing Cloud

#### Journey Steps:

```
1. [ENTRY POINT] Marketer is in Marketing Cloud / Flow of Work
   ↓
2. Selecting data objects for campaign segmentation
   ↓
3. Each object shows **DQ Score inline** (without leaving flow)
   ↓
4. Hover over score → See tooltip with:
   - Profiling stats summary
   - Last profiled date
   - Link to detailed DQ report
   ↓
5. Decision: Use object or find alternative based on DQ
```

#### "I Can" Statement:

✅ **As a marketer I can view Data Quality Score and Profiling stats in my objects from my flow of work**

**Acceptance Criteria:**
- DQ Score visible inline in Marketing Cloud object picker
- Tooltip shows profiling stats summary
- One-click link to full DQ report in Catalog
- No context switching required to see basic DQ info

---

## Goal 2: View Profiling Results & Recommended DQ Rules

### User Journey: View Data Profiling Results from CRM

**Persona:** Marketing Operations Analyst auditing lead data quality

#### Journey Steps:

```
1. [ENTRY POINT] Open Salesforce Catalog → Filter "Source: CRM"
   ↓
2. See all objects with CRM as source
   ↓
3. Click on object (e.g., "Lead" DMO) → Opens object detail page
   ↓
4. Navigate to "Data Quality" tab
   ↓
5. View **Data Profiling Results**:
   - Column-level statistics
   - Null % per column
   - Unique value counts
   - Data type distributions
   - Pattern analysis (e.g., email format compliance)
   ↓
6. Expand any column to see detailed profiling
```

#### "I Can" Statement:

✅ **I can view Data Profiling results from Salesforce Catalog for all objects with source as CRM**

**Acceptance Criteria:**
- Filter objects by source = "CRM"
- Profiling results visible at column level
- Shows: nulls, uniqueness, patterns, distributions
- Last profiled timestamp displayed

---

### User Journey: View Recommended DQ Rules

**Persona:** Data Steward setting up quality gates for marketing data

#### Journey Steps:

```
1. [ENTRY POINT] In object detail page → "Data Quality" tab
   ↓
2. After viewing profiling results, scroll to **"Recommended Rules"** section
   ↓
3. See AI-generated rule recommendations based on profiling:
   
   Example for "Email" column:
   • Rule: "Email format validation"
     Reason: 3% of records have invalid email format
     Impact: 1,200 records would fail
     [Apply Rule] button
   
   Example for "Country" column:
   • Rule: "Standardize country codes"
     Reason: 15 different formats found (USA, US, United States)
     Impact: 5,000 records need standardization
     [Apply Rule] button
   ↓
4. Review each recommended rule
   ↓
5. Click [Apply Rule] → Opens rule configuration modal
```

#### "I Can" Statement:

✅ **I can view recommended Data Quality rules that apply to specific columns of my DMOs, based on profiling stats**

**Acceptance Criteria:**
- Recommendations appear after profiling runs
- Each recommendation shows:
  - Rule type
  - Reason (based on profiling insights)
  - Impact (# records affected)
  - Apply button
- AI-powered suggestions based on patterns detected

---

### User Journey: Schedule DQ Rule from Catalog with AI Assistant (PRIMARY)

**Persona:** Marketing Ops Analyst setting up automated quality checks

**Priority:** P0

**Implementation Status:** ✅ Complete in Prototype

#### Journey Steps - Method 1: From Recommendations Sidebar

```
1. [ENTRY POINT] In Salesforce Catalog → Explore Assets page
   ↓
2. See "Top DQ Recommendations" sidebar on right (always visible)
   
   Shows 3 recommendations:
   • Email Format Validation (HIGH priority)
   • Null Value Check (HIGH priority)
   • Country Code Standardization (MEDIUM priority)
   
   Each shows: priority badge, affected objects, impacted records
   ↓
3. Click on a recommendation card → Expands to show details:
   - "What this rule does" explanation in plain English
   - Affected Objects list
   - Impacted Records count
   - [Set Up Rule] button
   ↓
4. Click [Set Up Rule] → AI Chat opens in right sidecar
   
   Chat provides:
   - Rule overview (objects, records, schedule, notifications)
   - Ask questions: "Show me examples", "Which fields?", "What if issues found?"
   - Natural conversation about the rule
   ↓
5. User can ask questions:
   "How many DMOs will be impacted?" → Shows specific DMOs and record count
   "Show me examples" → Shows before/after examples
   "Which fields?" → Lists specific fields to be checked
   ↓
6. When ready, user types: "confirm" or "yes" or "set it up"
   ↓
7. Chat confirms activation with checkmarks ✓
   ↓
8. Success alert appears
   ↓
9. Rule is now active and scheduled
```

#### Journey Steps - Method 2: From Asset Detail Page

```
1. [ENTRY POINT] Click on an asset → Opens detail page
   ↓
2. Navigate to "Data Quality" tab
   ↓
3. See "Recommended Data Quality Rules" section
   
   Each rule card shows:
   - Rule name
   - Column affected
   - Dimension (Validity, Consistency, etc.)
   - Reason (based on profiling)
   - Impact (# records)
   - [Set Up Rule] button
   ↓
4. Click [Set Up Rule] → Same AI Chat experience as Method 1
```

#### Journey Steps - Method 3: General DQ Assistant (NEW!)

```
1. [ENTRY POINT] From anywhere in Catalog, click floating 🤖 button (bottom-right)
   ↓
2. DQ Assistant chat window opens
   
   Initial greeting shows capabilities:
   • View pending DQ recommendations
   • Answer questions about data quality
   • Explain DQ scores and profiling
   • Help prioritize rules
   • Show assets needing attention
   ↓
3. User can ask natural questions:
   "What pending rules do I have?" → Lists all 3 recommendations
   "activate 1" → Starts setup for Email Format Validation
   "Which rules should I prioritize?" → Shows High Priority rules first
   "What needs attention?" → Shows assets with DQ score < 70%
   "Tell me about Account__c" → Shows asset details
   "Show DQ scores" → Summary of excellent/good/needs attention
   ↓
4. Conversational activation:
   User: "activate 1"
   Assistant: Shows rule details, asks for confirmation
   User: "yes" or "confirm"
   Assistant: ✓ Rule activated!
```

#### "I Can" Statement:

✅ **I can schedule a DQ rule in one-click from the Catalog using natural conversation**

**Acceptance Criteria:** ✅ Implemented
- ✅ Multiple entry points: sidebar recommendations, asset detail page, floating assistant
- ✅ AI chat provides conversational rule setup experience
- ✅ Pre-filled with context (objects, columns, schedule)
- ✅ Natural language interaction - can ask questions before confirming
- ✅ Understands commands like "activate 1", "set up email rule", "confirm"
- ✅ Shows plain English explanations of what rule does
- ✅ Two-step confirmation (select rule → confirm activation)
- ✅ Success feedback with alert
- ✅ General DQ Assistant for broader questions beyond specific rules
- ✅ Context-aware: knows about all assets, scores, and recommendations

---

### User Journey: Schedule DQ Rule in One Click from Flow of Work (SECONDARY)

**Persona:** Marketing Ops Analyst working in Marketing Cloud

**Priority:** P0 (Secondary Experience)

#### Journey Steps:

```
1. [ENTRY POINT] Marketing Ops Analyst in Marketing Cloud / Flow of Work
   ↓
2. Selecting DMO/DLO for campaign (e.g., "Lead" object)
   ↓
3. See DQ Score badge with warning icon (e.g., 78% - Yellow)
   ↓
4. Click on DQ Score badge → Inline panel opens
   
   Shows:
   - Overall DQ Score: 78%
   - Dimension breakdown
   - Failed records: 1,200 / 5,500
   - **Recommended Rules section**
   ↓
5. See recommended rule in inline panel:
   
   • Email Format Validation
     Impact: 1,200 records (3% failure rate)
     [Apply Rule] button
   ↓
6. Click [Apply Rule] → Same modal as Catalog experience
   ↓
7. Schedule rule with pre-filled context
   ↓
8. Confirmation → Can continue working in flow
```

#### "I Can" Statement:

✅ **I can schedule a DQ rule in one-click from my Flow of Work (DMO/DLO)**

**Acceptance Criteria:**
- Accessible from Marketing Cloud DMO/DLO picker
- Inline panel shows recommended rules without leaving flow
- Same one-click scheduling experience as Catalog
- Pre-fills context from current object
- No context switching required
- Can continue campaign building after scheduling

---

### User Journey: View DQ Scores After Rule Runs

**Persona:** Data Governance Lead monitoring data quality metrics

#### Journey Steps:

```
1. [ENTRY POINT] Rule has run (scheduled or on-demand)
   ↓
2. Navigate to Catalog → Object detail page
   ↓
3. View **Overall DQ Score by Dimension**:
   
   Dimensions:
   • Completeness: 95% ✅
   • Accuracy: 78% ⚠️
   • Consistency: 82% ⚠️
   • Validity: 91% ✅
   • Uniqueness: 99% ✅
   
   ↓
4. Drill down into specific dimension (e.g., "Accuracy")
   ↓
5. See **DQ Score per DMO**:
   
   | DMO          | Accuracy Score | Failed Records |
   |--------------|----------------|----------------|
   | Lead         | 78%            | 1,200 / 5,500  |
   | Contact      | 85%            | 450 / 3,000    |
   | Account      | 92%            | 120 / 1,500    |
   
   ↓
6. Click on DMO → See failed records breakdown by rule
```

#### "I Can" Statements:

✅ **Once the DQ rule is run, I can view overall score by dimension and DQ score for each DMO within the catalog**

**Acceptance Criteria:**
- Overall score visible at catalog level
- Score broken down by data quality dimension
- Per-DMO scores visible in table format
- Click-through to see failed records details

---

✅ **I can view DQ score within my flow of work as well**

**Acceptance Criteria:**
- DQ score accessible from Marketing Cloud
- Score updates reflect latest rule run results
- Inline display without context switching

---

### User Journey: Remediate Data Quality Issues (Recommended - Out of Scope)

**Persona:** Marketing Analyst fixing data quality issues

#### Journey Steps:

```
1. [ENTRY POINT] After viewing failed records in D360
   ↓
2. See list of records that failed DQ rules with details:
   
   | Record ID | Field      | Failed Rule         | Current Value      | Suggested Fix       |
   |-----------|------------|---------------------|-------------------|---------------------|
   | 001XX...  | Email      | Format validation   | john@gmailcom     | john@gmail.com      |
   | 002XX...  | Country    | Standardization     | USA               | US                  |
   | 003XX...  | Phone      | Format validation   | 555.123.4567      | +1-555-123-4567     |
   
   ↓
3. Options for remediation:
   • [Accept Suggestion] → Applies suggested fix
   • [Edit Manually] → Opens edit form
   • [Ignore] → Marks as exception
   • [Bulk Apply] → Apply suggested fix to all similar failures
   ↓
4. Click [Accept Suggestion] → Record updated
   ↓
5. Re-run DQ rule → Score improves
```

#### "I Can" Statement:

🔴 **[Recommend remediation] I can remediate quality of my data based on failed records stored in D360**

**Status:** Out of scope for initial release

**Reason:** 
- Requires write-back capabilities to source systems
- Data governance approval workflows needed
- Complex impact analysis for bulk updates

**Future Consideration:**
- Phase 2: View-only remediation recommendations
- Phase 3: Controlled remediation with approval workflows

---

---

## Prototype Implementation Summary

### ✅ What's Built

**1. Catalog Asset List (Explore Assets)**
- 10 technical assets across 5 source systems
- Stats dashboard (Total Assets, Profiled Assets, DQ Recommendations, Quality metrics)
- Filterable by source, sortable by name/type/score
- Profiling Stats indicator (✓) for Salesforce DMOs
- Color-coded DQ scores (only for profiled assets)

**2. Asset Detail Pages**
- **Summary Tab:**
  - Definition (what the asset contains)
  - Columns table (Name, Data Type, Business Term, Description)
  - Technical Mapping / Related Assets (shows other tables for same business object)
- **Profiling Results Tab:**
  - Statistics cards (Total Columns, Null Records, Invalid Records, DQ Score)
  - Column-level profiling table (Null %, Unique %, Invalid Count, Total Records)
- **Data Quality Tab:**
  - AI-powered recommended rules based on profiling
  - Rule cards with Column, Dimension, Reason, Impact
  - [Set Up Rule] buttons for one-click activation
- **Lineage Tab:**
  - Visual diagram placeholder

**3. Top DQ Recommendations Sidebar**
- Always visible on main catalog page (right side)
- 3 prioritized recommendations with expandable details
- Shows priority, description, affected objects, impacted records
- Clickable to expand and see "What this rule does" explanation
- [Set Up Rule] button on each

**4. Rule Setup Chat (Contextual)**
- Opens when clicking [Set Up Rule] from recommendations or asset detail
- Conversational interface for single rule
- Pre-loaded with rule context (name, objects, records, schedule)
- Can ask questions: examples, fields, schedule, what if issues
- Plain English explanations with follow-up suggestions
- Two-step confirmation (select → confirm)
- Semantic understanding (not just exact phrases)

**5. DQ Assistant (General - NEW!)**
- Floating 🤖 button always accessible (bottom-right)
- General-purpose conversational AI for all DQ questions
- **Capabilities:**
  - "Show pending rules" → Lists all recommendations
  - "activate 1" → Activates rule by number
  - "What needs attention?" → Shows low-scoring assets
  - "Show DQ scores" → Summary dashboard
  - "Which rules to prioritize?" → Suggests High Priority first
  - "Tell me about [asset]" → Asset-specific details
  - "What's profiled?" → Shows profiled vs. unprofiled assets
- **Natural Language Understanding:**
  - Recognizes numbers ("activate 1", "set up 2")
  - Understands intent ("what should I start with?")
  - Conversational context (remembers pending activation)
  - Flexible confirmations ("yes", "confirm", "go ahead", "ok")

**6. Data Model**
- 10 assets mapped to 5 business objects
- Business objects: Account, Lead, Contact, Campaign, Email_Engagement
- Technical assets include: Snowflake tables, Salesforce DMOs, Databricks Delta tables, DLO, Custom Integration
- Full profiling data for each business object (columns with business terms, data types, descriptions)
- 3 recommended rules per profiled object

### 🎯 Key Innovations

1. **Technical Assets First:** Shows actual tables/objects, not just business concepts
2. **Profiling Indicator:** Clear ✓ mark shows which assets have profiling stats
3. **Conversational AI:** Two chat experiences (contextual + general)
4. **Number-based Commands:** "activate 1" works naturally
5. **Always Accessible:** Floating DQ Assistant available everywhere
6. **Context-Aware:** Chat knows about all assets, scores, and recommendations
7. **Plain English:** Explanations avoid jargon, show before/after examples
8. **Multiple Entry Points:** Sidebar, asset detail, floating button
9. **Related Assets:** Shows which technical tables map to same business object
10. **Business Terms:** Columns include both technical names and business terminology

---

## Out of Scope (Current Prototype)

❌ **Actual rule execution** - Simulated with alerts
❌ **Flow of Work integration** - Catalog-only experience
❌ **Write-back/remediation** - View and schedule only
❌ **Cross-table validation** - Single-object rules only
❌ **Real-time profiling** - Uses mock data
❌ **Custom schedules** - Fixed daily at 2 AM
❌ **Multi-user collaboration** - Single-user experience
❌ **Historical trending** - Current state only

---

