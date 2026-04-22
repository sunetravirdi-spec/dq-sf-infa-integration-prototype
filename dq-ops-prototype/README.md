# Data Quality Operations Analyst Prototype

React prototype for Marketing Ops Analyst user journey - viewing DQ scores, profiling results, and one-click rule scheduling.

## Features

### P0 Capabilities (Implemented)

1. **View DQ Scores in Catalog** ✅
   - Color-coded DQ badges (Excellent/Good/Needs Attention/Critical)
   - Filter by source (CRM, Marketing Cloud, Pardot)
   - Sort by name, DQ score, or type
   - Quick stats dashboard

2. **View Profiling Stats** ✅
   - Column-level profiling data
   - Null percentages
   - Unique value counts
   - Invalid record counts

3. **View Recommended Rules** ✅
   - AI-powered rule recommendations
   - Based on profiling analysis
   - Shows reason and impact for each rule
   - Column and dimension tagging

4. **One-Click Rule Scheduling** ✅
   - Schedule from Catalog (primary experience)
   - Pre-filled context from object
   - Schedule options: now, daily, weekly, monthly
   - Email notifications
   - Confirmation workflow

5. **View DQ by Dimension** ✅
   - Completeness, Accuracy, Consistency, Validity, Uniqueness
   - Visual progress bars
   - Color-coded scores

## Persona

**Marketing Ops Analyst - Tracy Potter**
- Sets up and maintains data quality automation
- Configures rules based on recommendations
- Monitors rule execution and fixes data issues

## Installation

```bash
cd dq-ops-prototype
npm install
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view the prototype.

## User Journey

### 1. Catalog List View
- View all DMOs, DLOs, and CIs with DQ scores
- Filter and sort objects
- See summary statistics

### 2. Object Detail Page
- **Profiling Tab:** Column-level profiling results
- **Recommended Rules Tab:** AI-powered rule suggestions
- **Dimensions Tab:** Score breakdown by quality dimension

### 3. One-Click Rule Scheduling
- Click "Apply Rule" on any recommended rule
- Modal opens with pre-filled context
- Select schedule (now/daily/weekly/monthly)
- Enable email notifications
- Confirm and schedule

## Components

- `App.js` - Main application container
- `CatalogList.js` - Data object catalog with filters
- `ObjectDetail.js` - Detailed object view with tabs
- `RuleScheduleModal.js` - One-click rule scheduling modal

## Mock Data

The prototype uses mock data for demonstration:
- 5 sample objects (Lead, Contact, Account, Campaign, Email_Engagement)
- Profiling data for Lead object
- 3 recommended rules with impact analysis
- Quality scores by dimension

## P1 Features (Not Implemented)

- Schedule from Flow of Work
- Remediation interface
- Active rules management
- Rule execution history

## Technical Stack

- React 18.2.0
- CSS3 (no external UI libraries)
- Responsive design
- Component-based architecture

## Based On

User Journey: `2026-04-22-user-journey-flow-dq-agents-business-users-catalog.md`
