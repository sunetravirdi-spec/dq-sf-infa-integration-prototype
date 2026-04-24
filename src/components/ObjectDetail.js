import React, { useState } from 'react';
import './ObjectDetail.css';

const mockProfilingData = {
  1: { // Lead object
    columns: [
      { name: 'Email', nullPercent: 3, uniquePercent: 98, invalidCount: 165, totalRecords: 5500, dataType: 'Email', businessTerm: 'Contact Email', description: 'Primary email address for lead communication', dqScore: 74, dqIssue: 'Invalid format' },
      { name: 'Country', nullPercent: 15, uniquePercent: 5, invalidCount: 825, totalRecords: 5500, dataType: 'String', businessTerm: 'Geographic Country', description: 'Country location of the lead', dqScore: 48, dqIssue: 'Inconsistent values' },
      { name: 'Phone', nullPercent: 25, uniquePercent: 95, invalidCount: 193, totalRecords: 5500, dataType: 'Phone', businessTerm: 'Contact Phone', description: 'Primary contact phone number', dqScore: 62, dqIssue: 'High null rate' },
      { name: 'Company', nullPercent: 8, uniquePercent: 75, invalidCount: 44, totalRecords: 5500, dataType: 'String', businessTerm: 'Company Name', description: 'Name of the company or organization the lead works for', dqScore: 88, dqIssue: null },
      { name: 'Status', nullPercent: 2, uniquePercent: 8, invalidCount: 11, totalRecords: 5500, dataType: 'Picklist', businessTerm: 'Lead Status', description: 'Current stage in the lead lifecycle (New, Qualified, Converted, etc.)', dqScore: 96, dqIssue: null },
    ],
    recommendedRules: [
      {
        id: 'rule-1',
        name: 'Email Format Validation',
        column: 'Email',
        reason: '3% of records (165 records) have invalid email format patterns detected',
        impact: '165 records would fail validation',
        dimension: 'Validity'
      },
      {
        id: 'rule-2',
        name: 'Standardize Country Codes',
        column: 'Country',
        reason: '15 different country name formats detected (USA, US, United States, etc.)',
        impact: '825 records need standardization',
        dimension: 'Consistency'
      },
      {
        id: 'rule-3',
        name: 'Phone Number Format Validation',
        column: 'Phone',
        reason: 'Multiple phone number formats detected across records',
        impact: '193 records need formatting corrections',
        dimension: 'Consistency'
      }
    ]
  },
  2: { // Contact object
    columns: [
      { name: 'Email', nullPercent: 2, uniquePercent: 99, invalidCount: 60, totalRecords: 3000, dataType: 'Email', businessTerm: 'Contact Email', description: 'Email address for contact communication', dqScore: 82, dqIssue: 'Invalid format' },
      { name: 'FirstName', nullPercent: 1, uniquePercent: 85, invalidCount: 5, totalRecords: 3000, dataType: 'String', businessTerm: 'Given Name', description: 'First or given name of the contact', dqScore: 97, dqIssue: null },
      { name: 'LastName', nullPercent: 1, uniquePercent: 90, invalidCount: 8, totalRecords: 3000, dataType: 'String', businessTerm: 'Family Name', description: 'Last or family name of the contact', dqScore: 96, dqIssue: null },
      { name: 'Phone', nullPercent: 18, uniquePercent: 96, invalidCount: 87, totalRecords: 3000, dataType: 'Phone', businessTerm: 'Contact Phone', description: 'Primary phone number for the contact', dqScore: 69, dqIssue: 'High null rate' },
      { name: 'MailingCountry', nullPercent: 12, uniquePercent: 6, invalidCount: 234, totalRecords: 3000, dataType: 'String', businessTerm: 'Mailing Country', description: 'Country for mailing address', dqScore: 55, dqIssue: 'Inconsistent values' },
    ],
    recommendedRules: [
      {
        id: 'rule-4',
        name: 'Email Format Validation',
        column: 'Email',
        reason: '2% of records (60 records) have invalid email format',
        impact: '60 records would fail validation',
        dimension: 'Validity'
      },
      {
        id: 'rule-5',
        name: 'Phone Number Format Validation',
        column: 'Phone',
        reason: 'Multiple phone formats detected',
        impact: '87 records need formatting corrections',
        dimension: 'Consistency'
      }
    ]
  },
  3: { // Account object
    columns: [
      { name: 'Name', nullPercent: 0, uniquePercent: 100, invalidCount: 0, totalRecords: 1500, dataType: 'String', businessTerm: 'Organization Name', description: 'Official legal name of the organization or company', dqScore: 100, dqIssue: null },
      { name: 'Website', nullPercent: 22, uniquePercent: 98, invalidCount: 67, totalRecords: 1500, dataType: 'URL', businessTerm: 'Corporate Website', description: 'Primary website URL for the organization', dqScore: 71, dqIssue: 'Inconsistent format' },
      { name: 'Industry', nullPercent: 8, uniquePercent: 15, invalidCount: 189, totalRecords: 1500, dataType: 'Picklist', businessTerm: 'Industry Classification', description: 'Business industry category or sector', dqScore: 58, dqIssue: 'Non-standard values' },
      { name: 'BillingCountry', nullPercent: 5, uniquePercent: 8, invalidCount: 98, totalRecords: 1500, dataType: 'String', businessTerm: 'Billing Country', description: 'Country for billing address and invoicing', dqScore: 76, dqIssue: 'Inconsistent codes' },
      { name: 'AnnualRevenue', nullPercent: 35, uniquePercent: 92, invalidCount: 23, totalRecords: 1500, dataType: 'Currency', businessTerm: 'Annual Revenue', description: 'Total annual revenue in USD', dqScore: 63, dqIssue: 'High null rate' },
      { name: 'Phone', nullPercent: 12, uniquePercent: 97, invalidCount: 45, totalRecords: 1500, dataType: 'Phone', businessTerm: 'Primary Phone Number', description: 'Main contact phone number for the organization', dqScore: 82, dqIssue: null },
    ],
    recommendedRules: [
      {
        id: 'rule-6',
        name: 'Website URL Standardization',
        column: 'Website',
        reason: 'Multiple URL formats detected (with/without http, www, trailing slashes)',
        impact: '67 records need standardization',
        dimension: 'Consistency'
      },
      {
        id: 'rule-7',
        name: 'Industry Classification Standardization',
        column: 'Industry',
        reason: 'Non-standard industry values detected',
        impact: '189 records need mapping to standard taxonomy',
        dimension: 'Consistency'
      },
      {
        id: 'rule-8',
        name: 'Country Code Standardization',
        column: 'BillingCountry',
        reason: 'Multiple country name formats detected',
        impact: '98 records need standardization to ISO codes',
        dimension: 'Consistency'
      }
    ]
  },
  4: { // Campaign object
    columns: [
      { name: 'Name', nullPercent: 0, uniquePercent: 100, invalidCount: 0, totalRecords: 8200, dataType: 'String', businessTerm: 'Campaign Name', description: 'Name or title of the marketing campaign', dqScore: 99, dqIssue: null },
      { name: 'Status', nullPercent: 1, uniquePercent: 6, invalidCount: 45, totalRecords: 8200, dataType: 'Picklist', businessTerm: 'Campaign Status', description: 'Current status of the campaign (Planned, Active, Completed, etc.)', dqScore: 72, dqIssue: 'Null values' },
      { name: 'StartDate', nullPercent: 3, uniquePercent: 88, invalidCount: 112, totalRecords: 8200, dataType: 'Date', businessTerm: 'Campaign Start Date', description: 'Date when the campaign begins', dqScore: 54, dqIssue: 'Invalid date range' },
      { name: 'EndDate', nullPercent: 15, uniquePercent: 85, invalidCount: 89, totalRecords: 8200, dataType: 'Date', businessTerm: 'Campaign End Date', description: 'Date when the campaign concludes', dqScore: 61, dqIssue: 'High null rate' },
      { name: 'Type', nullPercent: 8, uniquePercent: 12, invalidCount: 234, totalRecords: 8200, dataType: 'Picklist', businessTerm: 'Campaign Type', description: 'Type or category of campaign (Email, Webinar, Conference, etc.)', dqScore: 43, dqIssue: 'Non-standard values' },
    ],
    recommendedRules: [
      {
        id: 'rule-9',
        name: 'Date Range Validation',
        column: 'StartDate, EndDate',
        reason: 'End dates before start dates detected',
        impact: '112 records have invalid date ranges',
        dimension: 'Validity'
      },
      {
        id: 'rule-10',
        name: 'Null Value Check',
        column: 'Status, StartDate',
        reason: 'Critical campaign fields have null values',
        impact: '246 records are incomplete',
        dimension: 'Completeness'
      }
    ]
  },
  5: { // Email_Engagement object
    columns: [
      { name: 'EmailId', nullPercent: 0, uniquePercent: 100, invalidCount: 0, totalRecords: 12000, dataType: 'String', businessTerm: 'Email Identifier', description: 'Unique identifier for the email message', dqScore: 100, dqIssue: null },
      { name: 'RecipientEmail', nullPercent: 0, uniquePercent: 87, invalidCount: 34, totalRecords: 12000, dataType: 'Email', businessTerm: 'Recipient Email Address', description: 'Email address of the recipient', dqScore: 91, dqIssue: null },
      { name: 'OpenedDate', nullPercent: 42, uniquePercent: 95, invalidCount: 0, totalRecords: 12000, dataType: 'DateTime', businessTerm: 'Email Open Date', description: 'Date and time when the email was opened', dqScore: 95, dqIssue: null },
      { name: 'ClickedDate', nullPercent: 68, uniquePercent: 98, invalidCount: 0, totalRecords: 12000, dataType: 'DateTime', businessTerm: 'Link Click Date', description: 'Date and time when a link in the email was clicked', dqScore: 93, dqIssue: null },
      { name: 'Status', nullPercent: 1, uniquePercent: 5, invalidCount: 12, totalRecords: 12000, dataType: 'Picklist', businessTerm: 'Email Status', description: 'Status of the email (Sent, Opened, Clicked, Bounced, etc.)', dqScore: 98, dqIssue: null },
    ],
    recommendedRules: [
      {
        id: 'rule-11',
        name: 'Email Format Validation',
        column: 'RecipientEmail',
        reason: 'Invalid email formats detected',
        impact: '34 records have invalid emails',
        dimension: 'Validity'
      }
    ]
  }
};

const dimensionScores = {
  1: { completeness: 72, validity: 80, consistency: 61, uniqueness: 95, accuracy: 74 },
  2: { completeness: 85, validity: 89, consistency: 78, uniqueness: 96, accuracy: 82 },
  3: { completeness: 88, validity: 94, consistency: 87, uniqueness: 99, accuracy: 90 },
  4: { completeness: 58, validity: 71, consistency: 64, uniqueness: 92, accuracy: 68 },
  5: { completeness: 91, validity: 96, consistency: 94, uniqueness: 98, accuracy: 95 },
};

const dimensionLabels = {
  completeness: 'Completeness',
  validity: 'Validity',
  consistency: 'Consistency',
  uniqueness: 'Uniqueness',
  accuracy: 'Accuracy',
};

function getObjectDataId(object) {
  if (object.businessObject === 'Lead') return 1;
  if (object.businessObject === 'Contact') return 2;
  if (object.businessObject === 'Account') return 3;
  if (object.businessObject === 'Campaign') return 4;
  if (object.businessObject === 'Email_Engagement') return 5;
  return null;
}

function getDimScoreClass(score) {
  if (score >= 90) return 'dim-excellent';
  if (score >= 75) return 'dim-good';
  if (score >= 60) return 'dim-fair';
  return 'dim-poor';
}

function ObjectDetail({ object, onBack, onApplyRule }) {
  const [activeTab, setActiveTab] = useState('summary');
  const [bannerDismissed, setBannerDismissed] = useState(false);

  // Map business object to profiling data
  const getProfilingData = () => {
    if (object.businessObject === 'Lead') return mockProfilingData[1];
    if (object.businessObject === 'Contact') return mockProfilingData[2];
    if (object.businessObject === 'Account') return mockProfilingData[3];
    if (object.businessObject === 'Campaign') return mockProfilingData[4];
    if (object.businessObject === 'Email_Engagement') return mockProfilingData[5];
    return { columns: [], recommendedRules: [] };
  };

  const profilingData = getProfilingData();
  const dataId = getObjectDataId(object);
  const dimScores = dataId ? dimensionScores[dataId] : null;
  const worstDimensions = dimScores
    ? Object.entries(dimScores)
        .sort(([, a], [, b]) => a - b)
        .slice(0, 2)
        .filter(([, score]) => score < 85)
    : [];

  const totalNullRecords = profilingData.columns.reduce((sum, col) =>
    sum + Math.round((col.nullPercent / 100) * col.totalRecords), 0
  );

  const totalInvalidRecords = profilingData.columns.reduce((sum, col) =>
    sum + col.invalidCount, 0
  );

  return (
    <div className="object-detail">
      <div className="breadcrumb">
        <a href="/" onClick={(e) => { e.preventDefault(); onBack(); }}>Assets</a>
        <span>›</span>
        <a href="/" onClick={(e) => { e.preventDefault(); onBack(); }}>{object.source}</a>
        <span>›</span>
        <span>{object.name}</span>
      </div>

      <div className="object-header">
        <div className="object-title-row">
          <div className="object-title">
            <div className="object-icon">
              {object.type === 'DMO' ? '📊' : object.type === 'DLO' ? '🗄️' : '🔗'}
            </div>
            <h2>{object.name}</h2>
          </div>

          <div className="object-actions">
            <button className="btn btn-secondary">Edit</button>
            <button className="btn btn-secondary">Copy</button>
            <button className="btn btn-primary">Full Refresh</button>
          </div>
        </div>

        <div className="object-meta-grid">
          <div className="meta-item">
            <div className="meta-label">Domain</div>
            <div className="meta-value">
              <a href="/" className="meta-link">Sales & Marketing</a>
            </div>
          </div>

          <div className="meta-item">
            <div className="meta-label">Business Object</div>
            <div className="meta-value">
              {object.businessObject && (
                <a href="/" className="meta-link">{object.businessObject}</a>
              )}
              {!object.businessObject && '—'}
            </div>
          </div>

          <div className="meta-item">
            <div className="meta-label">Status</div>
            <div className="meta-value">Published</div>
          </div>

          <div className="meta-item">
            <div className="meta-label">Last Modified By</div>
            <div className="meta-value">{object.owner}, {object.lastProfiled}</div>
          </div>
          {object.dqScore !== null && (
            <div className="meta-item">
              <div className="meta-label">DQ Score</div>
              <div className="meta-value">
                <span className={`dq-header-score ${object.dqScore >= 90 ? 'score-excellent' : object.dqScore >= 70 ? 'score-good' : 'score-poor'}`}>
                  {object.dqScore}%
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Agentforce recommendation banner */}
        {!bannerDismissed && object.dqScore !== null && worstDimensions.length > 0 && (
          <div className="agentforce-banner">
            <div className="agentforce-banner-left">
              <div className="agentforce-sparkle-icon">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M8 1L9.5 6H14.5L10.5 9L12 14L8 11L4 14L5.5 9L1.5 6H6.5L8 1Z" fill="#8B6FBC"/>
                  <circle cx="12" cy="3" r="1.5" fill="#8B6FBC" opacity="0.6"/>
                  <circle cx="14" cy="7" r="1" fill="#8B6FBC" opacity="0.4"/>
                </svg>
              </div>
              <div className="agentforce-banner-body">
                <span className="agentforce-banner-label">Agentforce Recommendation</span>
                <span className="agentforce-banner-text">
                  Focus on{' '}
                  {worstDimensions.map(([dim], i) => (
                    <span key={dim}>
                      <strong>{dimensionLabels[dim]}</strong>
                      {i < worstDimensions.length - 1 ? ' and ' : ''}
                    </span>
                  ))}
                  {' '}to improve campaign targeting accuracy.{' '}
                  <button
                    className="agentforce-banner-action"
                    onClick={() => { setActiveTab('dataQuality'); }}
                  >
                    View recommended rules →
                  </button>
                </span>
              </div>
            </div>
            <button className="agentforce-banner-dismiss" onClick={() => setBannerDismissed(true)} title="Dismiss">✕</button>
          </div>
        )}
      </div>

      <div className="tabs">
        <button
          className={`tab ${activeTab === 'summary' ? 'active' : ''}`}
          onClick={() => setActiveTab('summary')}
        >
          Summary
        </button>
        <button
          className={`tab ${activeTab === 'profiling' ? 'active' : ''}`}
          onClick={() => setActiveTab('profiling')}
        >
          Profiling Results
        </button>
        <button
          className={`tab ${activeTab === 'dataQuality' ? 'active' : ''}`}
          onClick={() => setActiveTab('dataQuality')}
        >
          Data Quality
        </button>
        <button
          className={`tab ${activeTab === 'lineage' ? 'active' : ''}`}
          onClick={() => setActiveTab('lineage')}
        >
          Lineage
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'summary' && (
          <>
            {/* Definition Section */}
            <div className="definition-section">
              <h3>Definition</h3>
              <p>
                {object.businessObject === 'Account' && 'Technical table storing account data. Organizations or companies that are customers, prospects, or partners. Tracks business relationships, contact information, revenue, industry classification, and account hierarchy.'}
                {object.businessObject === 'Lead' && 'Technical table storing lead data. Potential customers who have shown interest in your products or services. Tracks contact information, lead source, status, and qualification criteria before conversion to opportunities.'}
                {object.businessObject === 'Contact' && 'Technical table storing contact data. Individual people associated with accounts. Tracks personal information, communication preferences, roles, and relationships within organizations.'}
                {object.businessObject === 'Campaign' && 'Technical table storing campaign data. Marketing initiatives designed to generate leads and opportunities. Tracks campaign metrics, costs, responses, and ROI across different marketing channels.'}
                {object.businessObject === 'Email_Engagement' && 'Technical table storing email engagement data. Email interaction data from marketing automation platforms. Tracks opens, clicks, bounces, and engagement metrics for email campaigns.'}
              </p>
            </div>

            {/* Columns Section */}
            <div className="columns-section">
              <div className="section-header collapsible">
                <h3>Columns ({profilingData.columns.length})</h3>
              </div>
              <div className="columns-table-container">
                <table className="columns-table">
                  <thead>
                    <tr>
                      <th>Column Name</th>
                      <th>Data Type</th>
                      <th>Business Term</th>
                      <th>Description</th>
                      <th>DQ Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {profilingData.columns.map((col, idx) => (
                      <tr key={idx}>
                        <td className="column-name">{col.name}</td>
                        <td><span className="data-type-badge">{col.dataType}</span></td>
                        <td>
                          {col.businessTerm && (
                            <a href="/" className="business-term-link">{col.businessTerm}</a>
                          )}
                          {!col.businessTerm && <span className="no-term">—</span>}
                        </td>
                        <td className="column-description">{col.description || '—'}</td>
                        <td className="col-dq-cell">
                          {col.dqScore != null ? (
                            <div className="col-dq-wrapper">
                              <div className="col-dq-bar-track">
                                <div
                                  className="col-dq-bar-fill"
                                  style={{
                                    width: `${col.dqScore}%`,
                                    background: col.dqScore >= 90 ? '#2E844A' : col.dqScore >= 70 ? '#FFB75D' : '#EA001E',
                                  }}
                                />
                              </div>
                              <span
                                className="col-dq-score"
                                style={{
                                  color: col.dqScore >= 90 ? '#2E844A' : col.dqScore >= 70 ? '#B86403' : '#C23934',
                                }}
                              >
                                {col.dqScore}%
                              </span>
                              {col.dqIssue && (
                                <span className="col-dq-issue" title={col.dqIssue}>⚠</span>
                              )}
                            </div>
                          ) : <span className="no-term">—</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Technical Mapping Section - Related Assets */}
            {object.businessObject && (
              <div className="technical-mapping-section">
                <div className="section-header collapsible">
                  <h3>Related Assets</h3>
                </div>
                <div className="mapping-table-container">
                  <table className="mapping-table">
                    <thead>
                      <tr>
                        <th>Asset</th>
                        <th>Type</th>
                      </tr>
                    </thead>
                    <tbody>
                      {object.businessObject === 'Account' && (
                        <>
                          <tr>
                            <td className="asset-name">SFDC_ACCOUNT_TABLE</td>
                            <td><span className="type-badge-small snowflake">Snowflake Table</span></td>
                          </tr>
                          <tr>
                            <td className="asset-name">Account__c</td>
                            <td><span className="type-badge-small dmo">Data Model Object</span></td>
                          </tr>
                          <tr>
                            <td className="asset-name">account_master_delta</td>
                            <td><span className="type-badge-small databricks">Databricks Delta Table</span></td>
                          </tr>
                        </>
                      )}
                      {object.businessObject === 'Lead' && (
                        <>
                          <tr>
                            <td className="asset-name">SFDC_LEAD_TABLE</td>
                            <td><span className="type-badge-small snowflake">Snowflake Table</span></td>
                          </tr>
                          <tr>
                            <td className="asset-name">Lead__c</td>
                            <td><span className="type-badge-small dmo">Data Model Object</span></td>
                          </tr>
                        </>
                      )}
                      {object.businessObject === 'Contact' && (
                        <>
                          <tr>
                            <td className="asset-name">SFDC_CONTACT_TABLE</td>
                            <td><span className="type-badge-small snowflake">Snowflake Table</span></td>
                          </tr>
                          <tr>
                            <td className="asset-name">Contact__c</td>
                            <td><span className="type-badge-small dmo">Data Model Object</span></td>
                          </tr>
                        </>
                      )}
                      {object.businessObject === 'Campaign' && (
                        <>
                          <tr>
                            <td className="asset-name">marketing_campaigns_stream</td>
                            <td><span className="type-badge-small dlo">Data Lake Object</span></td>
                          </tr>
                          <tr>
                            <td className="asset-name">Campaign__c</td>
                            <td><span className="type-badge-small dmo">Data Model Object</span></td>
                          </tr>
                        </>
                      )}
                      {object.businessObject === 'Email_Engagement' && (
                        <>
                          <tr>
                            <td className="asset-name">pardot_email_events</td>
                            <td><span className="type-badge-small ci">Custom Integration</span></td>
                          </tr>
                        </>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

          </>
        )}

        {activeTab === 'profiling' && (
          <div className="profiling-section">
            <div className="section-header">
              <div>
                <h3>Data Profiling Statistics</h3>
                <p className="section-subtitle">
                  Last profiled: {object.lastProfiled} · {object.recordCount.toLocaleString()} total records
                </p>
              </div>
            </div>

            <div className="profiling-stats">
              <div className="stat-card">
                <div className="stat-label">Total Columns</div>
                <div className="stat-value">{profilingData.columns.length}</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Null Records</div>
                <div className="stat-value">{totalNullRecords.toLocaleString()}</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Invalid Records</div>
                <div className="stat-value">{totalInvalidRecords.toLocaleString()}</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">DQ Score</div>
                <div className="stat-value">{object.dqScore}%</div>
              </div>
            </div>

            {/* DQ Dimension Scores */}
            {dimScores && (
              <div className="dimension-scores-section">
                <h4 className="dimension-scores-title">DQ Score by Dimension</h4>
                <div className="dimension-scores-grid">
                  {Object.entries(dimScores).map(([dim, score]) => (
                    <div key={dim} className={`dimension-card ${getDimScoreClass(score)}`}>
                      <div className="dimension-score-value">{score}%</div>
                      <div className="dimension-score-bar-track">
                        <div className="dimension-score-bar-fill" style={{ width: `${score}%` }} />
                      </div>
                      <div className="dimension-score-label">{dimensionLabels[dim]}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="profiling-table-container">
              <table className="profiling-table">
                <thead>
                  <tr>
                    <th>Column Name</th>
                    <th>Data Type</th>
                    <th>Null %</th>
                    <th>Unique %</th>
                    <th>Invalid Count</th>
                    <th>Total Records</th>
                  </tr>
                </thead>
                <tbody>
                  {profilingData.columns.map((col, idx) => (
                    <tr key={idx}>
                      <td className="column-name">{col.name}</td>
                      <td>{col.dataType}</td>
                      <td>
                        <span className={col.nullPercent > 20 ? 'warning-text' : ''}>
                          {col.nullPercent}%
                        </span>
                      </td>
                      <td>{col.uniquePercent}%</td>
                      <td>
                        <span className={col.invalidCount > 500 ? 'error-text' : ''}>
                          {col.invalidCount.toLocaleString()}
                        </span>
                      </td>
                      <td>{col.totalRecords.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'dataQuality' && (
          <div className="rules-section">
            <div className="section-header">
              <div>
                <h3>Recommended Data Quality Rules</h3>
                <p className="section-subtitle">
                  AI-powered recommendations based on profiling analysis
                </p>
              </div>
            </div>

            <div className="rules-intro">
              <p>
                💡 Based on the profiling analysis above, we recommend setting up the following data quality rules.
                Click "Set Up Rule" to schedule automated quality checks with one click.
              </p>
            </div>

            <div className="rules-grid">
              {profilingData.recommendedRules.map(rule => (
                <div key={rule.id} className="rule-card">
                  <div className="rule-header">
                    <div className="rule-title-section">
                      <h4>{rule.name}</h4>
                      <div className="rule-tags">
                        <span className="rule-tag column">Column: {rule.column}</span>
                        <span className="rule-tag dimension">Dimension: {rule.dimension}</span>
                      </div>
                    </div>
                    <button
                      className="btn btn-setup"
                      onClick={() => onApplyRule({ ...rule, objectName: object.name, affectedObjects: [object.name], impactedRecords: parseInt(rule.impact.match(/\d+/)?.[0] || 0), priority: 'High', id: rule.id, description: rule.reason, explanation: `This rule helps maintain data quality by ${rule.reason.toLowerCase()}` })}
                    >
                      Set Up Rule
                    </button>
                  </div>

                  <div className="rule-details">
                    <div className="rule-detail-row">
                      <strong>Reason:</strong>
                      <span>{rule.reason}</span>
                    </div>
                    <div className="rule-detail-row">
                      <strong>Impact:</strong>
                      <span className="rule-impact-highlight">{rule.impact}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {profilingData.recommendedRules.length === 0 && (
              <div className="empty-state">
                <p>No recommended rules at this time.</p>
                <p>All columns meet quality thresholds.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'lineage' && (
          <div className="lineage-placeholder">
            <div className="lineage-diagram">
              <div className="lineage-node source">
                <span className="node-icon">🗄️</span>
                <span className="node-label">Salesforce CRM</span>
              </div>
              <div className="lineage-arrow">→</div>
              <div className="lineage-node transform">
                <span className="node-icon">⚙️</span>
                <span className="node-label">ETL Process</span>
              </div>
              <div className="lineage-arrow">→</div>
              <div className="lineage-node current">
                <span className="node-icon">📊</span>
                <span className="node-label">{object.name}</span>
              </div>
              <div className="lineage-arrow">→</div>
              <div className="lineage-node destination">
                <span className="node-icon">📈</span>
                <span className="node-label">Analytics Dashboard</span>
              </div>
            </div>
            <p className="lineage-note">Full lineage visualization coming soon</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ObjectDetail;
