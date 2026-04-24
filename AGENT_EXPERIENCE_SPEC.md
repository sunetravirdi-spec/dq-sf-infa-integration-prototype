# Data Cloud Agent Experience — Product Spec
**Feature:** Data Cloud Agent (Agentforce-powered)  
**Surface:** Data Cloud · Data Model tab · Agent tab  
**Persona:** Marketing Analyst  
**Date:** 2026-04-24  
**Status:** Prototype

---

## Overview

The Data Cloud Agent is a conversational AI assistant embedded directly in the Data Cloud UI. It allows marketing analysts to assess DMO data quality, create and apply DQ rules, build DQ-gated Calculated Insights, and notify their team — all through natural language, without needing to understand the underlying rule engine or SAQL.

---

## Problem Statement

Marketing analysts working with Data Cloud face three friction points before they can trust a Calculated Insight for segmentation:

1. **No visibility** into which DMO fields are failing and why — they must navigate multiple tabs to piece together a quality picture.
2. **No guardrails** — Calculated Insights can be built and published on top of dirty data, leading to unreliable segment counts and wasted campaign spend.
3. **No clear path** from "data is bad" to "data is fixed" — analysts either escalate to data engineering or guess at transform changes.

The agent removes all three blockers in a single conversational thread.

---

## Goals

| Goal | Success Metric |
|---|---|
| Analyst can assess full DMO health in <30 seconds | Time-to-insight from opening agent |
| DQ gate blocks CI creation when threshold not met | 0 CIs published below 85% threshold |
| Analyst can activate a DQ rule without leaving the agent | Rule activation rate from agent vs. UI |
| Analyst can draft analyst notification in 1 click | Draft acceptance rate |

---

## Agent Capabilities

### Topic 1 — DQ Assessment
The agent runs a quality check across Account, Campaign, Lead, and CampaignMember DMOs and returns:
- Overall DQ score per DMO (color-coded: green ≥90%, amber 70–89%, red <70%)
- Top failing fields per DMO with issue descriptions
- Field-level drill-down: score, null %, invalid count, failure reason

**Trigger phrases:**
- "Check Campaign DMO health"
- "Show me DQ scores for all DMOs"
- "Drill into Lead field issues"
- "What fields are failing on Account?"

### Topic 2 — DQ Rule Creation
The agent creates or updates DQ rules on specific fields and shows the before/after score impact.

**Supported rule types:**
- Null/completeness check (e.g. AnnualRevenue not null)
- Validity check (e.g. Status must be in allowed picklist)
- Referential integrity (e.g. CampaignMember.CampaignId references active Campaign)
- Format validation (e.g. email format, ISO country codes)

**Trigger phrases:**
- "Fix AnnualRevenue completeness on Account"
- "Add a validity rule for Lead Status"
- "Apply DQ rules across all DMOs"
- "Set DQ threshold to 85%"

### Topic 3 — DQ-Gated Calculated Insight Creation
The agent creates a Calculated Insight only after verifying all source DMOs pass the configured threshold. If any DMO fails, it blocks publication and shows what needs to be fixed.

**Flow:**
1. DQ gate check (pass/fail per DMO at configured threshold)
2. Exclusion report (records excluded due to DQ failures, grouped by DMO + reason)
3. CI preview (metrics: lead count, conversion rate, cost per lead, quality score)
4. Conditional publish — [Publish CI] button only enabled when all DMOs pass

**Trigger phrases:**
- "Create Calculated Insight for Campaign Lead Quality"
- "Create Campaign_Lead_Quality_by_Account CI"
- "Preview the CI before publishing"

### Topic 4 — Analyst Notification
The agent drafts Slack messages and emails to the marketing analyst summarizing DQ findings, failing fields, and recommended transform fixes.

**Trigger phrases:**
- "Draft Slack message to analyst"
- "Draft email to marketing analyst"
- "Generate transform fix instructions"

### Topic 5 — DQ Monitoring
The agent schedules recurring DQ checks and shows score trends over time.

**Trigger phrases:**
- "Schedule DQ monitoring after every pipeline run"
- "Show me the DQ trend for the last 30 days"

---

## DQ Gate

The DQ gate is a configurable threshold (default: 85%) applied to all source DMOs before a Calculated Insight can be published. 

| Behaviour | Detail |
|---|---|
| Gate threshold | Configurable per CI (default 85%) |
| Gate scope | All DMOs referenced in the CI query |
| Gate check timing | On CI creation attempt |
| Gate failure action | Block publish, show failing DMOs + fields |
| Override | Allowed per-DMO for specific field exemptions (e.g. Enterprise segment bypasses AnnualRevenue rule) |

---

## UI Spec

### Agent Tab (full-screen)
- **Layout:** Left sidebar (260px) + main chat area
- **Sidebar:** Agentforce logo, "New conversation" button, recent conversation history
- **Main area:** Dark navy background (#1e1e3a), message thread centered at max 820px width
- **Input:** Full-width rounded input bar at bottom, Send button
- **Chips:** Context-sensitive quick-action chips above input, refresh after each response

### Agent Panel (side drawer)
- **Trigger:** Sparkle icon (✦) in global nav — visible on all tabs
- **Width:** 480px, slides in from right
- **Header:** Dark navy, Agentforce logo, close button
- **Persists:** Chat history preserved when switching tabs

### Message Types (rich content)
| Type | Rendered as |
|---|---|
| DQ score overview | Score cards with color-coded badges per DMO |
| Field-level breakdown | Table: Field / Score / Issue |
| Rule added | Score card showing before → after |
| Bulk rules | Comparison table: all 4 DMOs before/after |
| DQ gate check | Gate rows: DMO / Score / Pass/Fail |
| CI preview | Metric card: leads / conv rate / CPL / quality score |
| CI compare | Table: With DQ filter vs. Without |
| Slack draft | Pre-formatted draft-box |
| Email draft | Pre-formatted draft-box |
| Transform instructions | Table: DMO / Field / Problem / Fix |
| Trend report | Text sparkline (4 weeks) |

---

## Agent Variable Reference

| Variable | Type | Default | Purpose |
|---|---|---|---|
| `dq_threshold` | Integer | 85 | Minimum DQ score to allow CI creation |
| `target_ci_name` | String | — | Name of the CI being created |
| `analyst_contact` | String | — | Slack handle or email of marketing analyst |
| `dmo_list` | Array | [Account, Campaign, Lead, CampaignMember] | DMOs in scope |
| `critical_fields` | Array | — | Fields gated by DQ rules |
| `dq_gate_enabled` | Boolean | true | Whether to block CI on DQ failure |

---

## Agentforce Action Mapping

| Utterance Group | Agentforce Action |
|---|---|
| DQ health check | `RunDataQualityAssessment` |
| Field-level drill | `GetFieldLevelDQStats` |
| Add rule | `CreateDataQualityRule` |
| Bulk rules | `ApplyBulkDQRules` |
| Set threshold | `SetDQGateThreshold` |
| Create CI | `CreateCalculatedInsight` (DQ-gated) |
| Preview CI | `PreviewCalculatedInsight` |
| Publish CI | `PublishCalculatedInsight` |
| Slack draft | `DraftSlackMessage` |
| Email draft | `DraftEmail` |
| Transform instructions | `GenerateTransformInstructions` |
| Schedule monitoring | `ScheduleDQMonitor` |
| Trend report | `GetDQTrendReport` |

---

## Out of Scope (v1)

- Automated field remediation (flagging only, not auto-fixing)
- Cross-DMO impact visualization (lineage graph)
- DQ score history charts (text sparkline only in v1)
- Custom threshold per-field (threshold applies at DMO level only)
- Real SAQL CI generation (prototype uses mock data)
