// ── Score data ───────────────────────────────────────────────────
export const DMO_SCORES = {
  Account:         { base: 92, fixed: 96, fields: [
    { name: 'Name',          score: 100, issue: null },
    { name: 'Website',       score: 71,  issue: 'Inconsistent format' },
    { name: 'Industry',      score: 58,  issue: 'Non-standard values' },
    { name: 'BillingCountry',score: 76,  issue: 'Mixed ISO/full names' },
    { name: 'AnnualRevenue', score: 63,  issue: '35% null rate' },
    { name: 'Phone',         score: 82,  issue: null },
  ]},
  Campaign:        { base: 65, fixed: 74, fields: [
    { name: 'Name',      score: 99, issue: null },
    { name: 'Status',    score: 72, issue: 'Null values' },
    { name: 'StartDate', score: 54, issue: 'Invalid date ranges' },
    { name: 'EndDate',   score: 61, issue: 'High null rate (15%)' },
    { name: 'Type',      score: 43, issue: 'Non-standard picklist values' },
  ]},
  Lead:            { base: 78, fixed: 83, fields: [
    { name: 'Email',   score: 74, issue: 'Invalid format (165 records)' },
    { name: 'Country', score: 48, issue: 'Inconsistent values (825 records)' },
    { name: 'Phone',   score: 62, issue: 'High null rate (25%)' },
    { name: 'Company', score: 88, issue: null },
    { name: 'Status',  score: 96, issue: null },
  ]},
  CampaignMember:  { base: 71, fixed: 79, fields: [
    { name: 'CampaignId', score: 64, issue: '847 orphaned records' },
    { name: 'LeadId',     score: 79, issue: 'Null references' },
    { name: 'Status',     score: 85, issue: null },
  ]},
};

// ── Score color helper ───────────────────────────────────────────
export function scoreClass(s) {
  if (s >= 90) return 'score-green';
  if (s >= 70) return 'score-amber';
  return 'score-red';
}
export function scoreIcon(s) {
  if (s >= 90) return '✓';
  if (s >= 70) return '⚠';
  return '✗';
}

// ── Chip sets ────────────────────────────────────────────────────
export const CHIPS_INITIAL = [
  'Check Campaign DMO health',
  'Check Account DMO health',
  'Create Campaign Lead Quality CI',
  'Drill into Lead field issues',
  'Apply DQ rules across all DMOs',
];
export const CHIPS_AFTER_DQ = [
  'Fix the failing fields',
  'Create Calculated Insight',
  'Apply bulk rules across all DMOs',
  'Schedule DQ monitoring',
];
export const CHIPS_AFTER_RULE = [
  'Create Calculated Insight',
  'Run DQ check again',
  'Set DQ threshold to 85%',
  'Notify marketing analyst',
];
export const CHIPS_AFTER_CI = [
  'Publish Campaign Lead Quality CI',
  'View excluded records',
  'Notify marketing analyst',
  'Schedule DQ monitoring',
];
export const CHIPS_AFTER_NOTIFY = [
  'Schedule DQ monitoring',
  'Check DQ trend (30 days)',
  'Create Calculated Insight',
];

// ── Response builder ─────────────────────────────────────────────
// Each response is { type, chips, ...payload }
// type drives the renderer in AgentPanel

export function getResponse(input, state) {
  const q = input.toLowerCase();

  // ── DQ health overview ────────────────────────────────────────
  if (/(health|dq check|dq score|quality score|quality check|score.*all|all.*score)/.test(q) && !/(account|campaign|lead)/.test(q)) {
    return { type: 'dmo_scores', dmos: ['Account','Campaign','Lead','CampaignMember'], chips: CHIPS_AFTER_DQ };
  }
  if (/(account).*(health|dq|score|quality)|(health|dq|score|quality).*(account)/.test(q)) {
    return { type: 'dmo_scores', dmos: ['Account'], chips: CHIPS_AFTER_DQ };
  }
  if (/(campaign).*(health|dq|score|quality)|(health|dq|score|quality).*(campaign)/.test(q)) {
    return { type: 'dmo_scores', dmos: ['Campaign'], chips: CHIPS_AFTER_DQ };
  }
  if (/(lead).*(health|dq|score|quality)|(health|dq|score|quality).*(lead)/.test(q)) {
    return { type: 'dmo_scores', dmos: ['Lead'], chips: CHIPS_AFTER_DQ };
  }

  // ── Field-level drill down ────────────────────────────────────
  if (/(drill|field.level|field issue|which field|failing field|lead dmo)/.test(q)) {
    return { type: 'field_table', dmo: 'Lead', chips: CHIPS_AFTER_DQ };
  }
  if (/account.*(field|drill|issue)/.test(q)) {
    return { type: 'field_table', dmo: 'Account', chips: CHIPS_AFTER_DQ };
  }
  if (/campaign.*(field|drill|issue)/.test(q)) {
    return { type: 'field_table', dmo: 'Campaign', chips: CHIPS_AFTER_DQ };
  }

  // ── Fix rules ────────────────────────────────────────────────
  if (/annualrevenue|fix account|account.*null/.test(q)) {
    return { type: 'rule_added', dmo: 'Account', field: 'AnnualRevenue', rule: 'Null/zero check with SMB default enrichment ($50,000)', before: 92, after: 96, affected: 525, chips: CHIPS_AFTER_RULE };
  }
  if (/(fix lead|lead status|status.*lead|lead.*validit)/.test(q)) {
    return { type: 'rule_added', dmo: 'Lead', field: 'Status', rule: 'Accepted values: Open, Working, Converted, Unqualified', before: 78, after: 83, affected: 193, chips: CHIPS_AFTER_RULE };
  }
  if (/(campaignmember|referential|campaign.*id|orphan)/.test(q)) {
    return { type: 'rule_added', dmo: 'CampaignMember', field: 'CampaignId', rule: 'Referential integrity — each member must reference an active Campaign', before: 71, after: 79, affected: 847, chips: CHIPS_AFTER_RULE };
  }
  if (/(isconverted|converted.*null)/.test(q)) {
    return { type: 'rule_added', dmo: 'Lead', field: 'IsConverted', rule: 'Non-null completeness check', before: 78, after: 81, affected: 312, chips: CHIPS_AFTER_RULE };
  }
  if (/(budgetedcost|budget.*campaign|campaign.*budget)/.test(q)) {
    return { type: 'rule_added', dmo: 'Campaign', field: 'BudgetedCost', rule: 'Non-null and ≥ 0 validity check', before: 65, after: 69, affected: 234, chips: CHIPS_AFTER_RULE };
  }
  if (/(bulk rule|apply.*all|all.*dmo|all four|across all)/.test(q)) {
    return { type: 'bulk_rules', chips: CHIPS_AFTER_RULE };
  }
  if (/(threshold|85%|minimum.*dq|dq.*minimum|gate)/.test(q)) {
    return { type: 'threshold', chips: CHIPS_AFTER_CI };
  }

  // ── CI creation ──────────────────────────────────────────────
  if (/(calculated insight|create ci|campaign lead quality|ci.*campaign|campaign.*ci)/.test(q)) {
    return { type: 'ci_flow', step: state.ciStep || 1, chips: CHIPS_AFTER_CI };
  }
  if (/(publish|yes.*publish|go ahead|confirm.*publish)/.test(q) && state.ciStep >= 3) {
    return { type: 'ci_published', chips: CHIPS_AFTER_NOTIFY };
  }
  if (/(preview|compare|with.*without|without.*dq)/.test(q)) {
    return { type: 'ci_compare', chips: CHIPS_AFTER_CI };
  }
  if (/(excluded|exclusion|which record)/.test(q)) {
    return { type: 'exclusions', chips: CHIPS_AFTER_CI };
  }

  // ── Notify ───────────────────────────────────────────────────
  if (/(slack|message analyst|draft slack|send slack)/.test(q)) {
    return { type: 'slack_draft', chips: CHIPS_AFTER_NOTIFY };
  }
  if (/(email|draft email|send email)/.test(q)) {
    return { type: 'email_draft', chips: CHIPS_AFTER_NOTIFY };
  }
  if (/(transform|fix instruction|transform logic|fix.*field)/.test(q)) {
    return { type: 'transform_instructions', chips: CHIPS_AFTER_NOTIFY };
  }

  // ── Monitoring ───────────────────────────────────────────────
  if (/(schedule|monitor|every pipeline|pipeline.*run)/.test(q)) {
    return { type: 'monitoring_set', chips: CHIPS_AFTER_NOTIFY };
  }
  if (/(trend|30 day|history|over time|last month)/.test(q)) {
    return { type: 'trend_report', chips: CHIPS_INITIAL };
  }

  // ── Fallback ────────────────────────────────────────────────
  return { type: 'fallback', chips: CHIPS_INITIAL };
}
