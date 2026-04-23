import React, { useState } from 'react';
import './CatalogList.css';
import RuleSetupChat from './RuleSetupChat';
import DQAssistant from './DQAssistant';

const topDQRecommendations = [
  {
    id: 'top-1',
    name: 'Email Format Validation',
    description: 'Validate email format across all DMO objects with email fields',
    explanation: 'This rule checks if email addresses follow the standard format (example@domain.com). It looks for the @ symbol, a valid domain name, and proper structure. Any email that doesn\'t match this pattern will be flagged so you can review and correct it.',
    affectedObjects: ['Lead', 'Contact', 'Account'],
    impactedRecords: 1850,
    priority: 'High'
  },
  {
    id: 'top-2',
    name: 'Null Value Check',
    description: 'Flag records with critical null values in required fields',
    explanation: 'This rule identifies records where important fields are empty or missing. For example, if a Lead record is missing an email address or a Contact is missing a name, the rule will flag it. This helps ensure all required information is filled in.',
    affectedObjects: ['Lead', 'Contact', 'Campaign'],
    impactedRecords: 982,
    priority: 'High'
  },
  {
    id: 'top-3',
    name: 'Country Code Standardization',
    description: 'Standardize country codes to ISO format across all objects',
    explanation: 'This rule converts all country names to a consistent two-letter format (ISO 3166). For example, "USA", "United States", and "US" will all be standardized to "US". This makes it easier to filter, report, and analyze data by country.',
    affectedObjects: ['Lead', 'Contact', 'Account'],
    impactedRecords: 1425,
    priority: 'Medium'
  }
];

const mockCatalogData = [
  {
    id: 1,
    name: 'SFDC_LEAD_TABLE',
    type: 'Snowflake Table',
    source: 'Snowflake',
    owner: 'Data Engineering',
    dqScore: null,
    hasProfiling: false,
    businessObject: 'Lead',
    recordCount: 5500,
    lastProfiled: '2026-04-20'
  },
  {
    id: 2,
    name: 'Lead__c',
    type: 'Data Model Object',
    source: 'Salesforce',
    owner: 'Marketing Team',
    dqScore: 78,
    hasProfiling: true,
    businessObject: 'Lead',
    recordCount: 5500,
    lastProfiled: '2026-04-20'
  },
  {
    id: 3,
    name: 'SFDC_CONTACT_TABLE',
    type: 'Snowflake Table',
    source: 'Snowflake',
    owner: 'Data Engineering',
    dqScore: null,
    hasProfiling: false,
    businessObject: 'Contact',
    recordCount: 3000,
    lastProfiled: '2026-04-21'
  },
  {
    id: 4,
    name: 'Contact__c',
    type: 'Data Model Object',
    source: 'Salesforce',
    owner: 'Sales Team',
    dqScore: 85,
    hasProfiling: true,
    businessObject: 'Contact',
    recordCount: 3000,
    lastProfiled: '2026-04-21'
  },
  {
    id: 5,
    name: 'SFDC_ACCOUNT_TABLE',
    type: 'Snowflake Table',
    source: 'Snowflake',
    owner: 'Data Engineering',
    dqScore: null,
    hasProfiling: false,
    businessObject: 'Account',
    recordCount: 1500,
    lastProfiled: '2026-04-21'
  },
  {
    id: 6,
    name: 'Account__c',
    type: 'Data Model Object',
    source: 'Salesforce',
    owner: 'Sales Team',
    dqScore: 92,
    hasProfiling: true,
    businessObject: 'Account',
    recordCount: 1500,
    lastProfiled: '2026-04-21'
  },
  {
    id: 7,
    name: 'account_master_delta',
    type: 'Databricks Delta Table',
    source: 'Databricks',
    owner: 'Data Engineering',
    dqScore: null,
    hasProfiling: false,
    businessObject: 'Account',
    recordCount: 1500,
    lastProfiled: '2026-04-21'
  },
  {
    id: 8,
    name: 'marketing_campaigns_stream',
    type: 'Data Lake Object',
    source: 'Marketing Cloud',
    owner: 'Marketing Team',
    dqScore: null,
    hasProfiling: false,
    businessObject: 'Campaign',
    recordCount: 8200,
    lastProfiled: '2026-04-19'
  },
  {
    id: 9,
    name: 'Campaign__c',
    type: 'Data Model Object',
    source: 'Salesforce',
    owner: 'Marketing Team',
    dqScore: 65,
    hasProfiling: true,
    businessObject: 'Campaign',
    recordCount: 8200,
    lastProfiled: '2026-04-19'
  },
  {
    id: 10,
    name: 'pardot_email_events',
    type: 'Custom Integration',
    source: 'Pardot',
    owner: 'Marketing Ops',
    dqScore: 95,
    hasProfiling: false,
    businessObject: 'Email_Engagement',
    recordCount: 12000,
    lastProfiled: '2026-04-22'
  }
];

function CatalogList({ onObjectClick }) {
  const [filterSource, setFilterSource] = useState('All');
  const [sortBy, setSortBy] = useState('name');
  const [selectedRecommendation, setSelectedRecommendation] = useState(null);
  const [chatRule, setChatRule] = useState(null);
  const [showAssistant, setShowAssistant] = useState(false);

  const handleSetupRule = (rule) => {
    setChatRule(rule);
  };

  const handleCloseChat = () => {
    setChatRule(null);
  };

  const handleConfirmSetup = (rule) => {
    alert(`✅ Rule "${rule.name}" has been activated!\n\n• Will run daily at 2:00 AM\n• DQ scores will update after each run\n• Email notifications enabled\n\nYou can view rule status in the Rules dashboard.`);
    setChatRule(null);
  };

  const handleRecommendationClick = (rule) => {
    setSelectedRecommendation(selectedRecommendation?.id === rule.id ? null : rule);
  };

  const toggleAssistant = () => {
    setShowAssistant(!showAssistant);
  };


  const sources = ['All', ...new Set(mockCatalogData.map(obj => obj.source))];

  const filteredData = mockCatalogData
    .filter(obj => filterSource === 'All' || obj.source === filterSource)
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'dqScore') return b.dqScore - a.dqScore;
      if (sortBy === 'type') return a.type.localeCompare(b.type);
      return 0;
    });

  return (
    <div className="catalog-layout">
      {/* Main Content - Left Side */}
      <div className="catalog-main">
        <div className="catalog-header">
          <h2>Data Objects</h2>
          <p className="catalog-subtitle">View and manage data quality across all objects</p>
        </div>

        {/* Stats Cards at Top */}
        <div className="catalog-stats">
          <div className="stat-card">
            <div className="stat-value">{mockCatalogData.length}</div>
            <div className="stat-label">Total Assets</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{mockCatalogData.filter(o => o.hasProfiling).length}</div>
            <div className="stat-label">Profiled Assets</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{topDQRecommendations.length}</div>
            <div className="stat-label">DQ Recommendations</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">
              {mockCatalogData.filter(o => o.dqScore !== null && o.dqScore >= 90).length}
            </div>
            <div className="stat-label">Excellent Quality</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">
              {mockCatalogData.filter(o => o.dqScore !== null && o.dqScore < 70).length}
            </div>
            <div className="stat-label">Needs Attention</div>
          </div>
        </div>

      <div className="catalog-controls">
        <div className="filter-group">
          <label>Source:</label>
          <select value={filterSource} onChange={(e) => setFilterSource(e.target.value)}>
            {sources.map(source => (
              <option key={source} value={source}>{source === 'All' ? 'All Sources' : source}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Sort by:</label>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="name">Name</option>
            <option value="dqScore">DQ Score</option>
            <option value="type">Type</option>
          </select>
        </div>
      </div>

      <div className="catalog-table-container">
        <table className="catalog-table">
          <thead>
            <tr>
              <th>Asset Name</th>
              <th>Type</th>
              <th>Source</th>
              <th>Owner</th>
              <th>Profiling Stats</th>
              <th>DQ Score</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map(obj => (
              <tr key={obj.id} onClick={() => onObjectClick(obj)} className="catalog-row">
                <td className="object-name">
                  <strong>{obj.name}</strong>
                </td>
                <td>
                  <span className="type-badge-plain">
                    {obj.type}
                  </span>
                </td>
                <td>{obj.source}</td>
                <td>{obj.owner}</td>
                <td className="profiling-check">
                  {obj.hasProfiling && <span className="check-mark">✓</span>}
                </td>
                <td>
                  {obj.dqScore !== null ? (
                    <div className={`dq-score-badge ${
                      obj.dqScore >= 90 ? 'score-excellent' :
                      obj.dqScore >= 70 ? 'score-good' :
                      'score-needs-attention'
                    }`}>
                      {obj.dqScore}%
                    </div>
                  ) : (
                    <span className="no-score">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>

      {/* Recommendations Sidebar - Right Side */}
      <aside className="recommendations-sidebar">
        <div className="sidebar-header">
          <h3>Top DQ Recommendations</h3>
          <p className="sidebar-subtitle">AI-powered quality improvements</p>
        </div>

        <div className="recommendations-list">
          {topDQRecommendations.map(rule => (
            <div key={rule.id} className={`recommendation-card ${selectedRecommendation?.id === rule.id ? 'expanded' : ''}`}>
              <div
                className="recommendation-header-clickable"
                onClick={() => handleRecommendationClick(rule)}
              >
                <div className="recommendation-priority">
                  <span className={`priority-badge ${rule.priority.toLowerCase()}`}>
                    {rule.priority}
                  </span>
                </div>

                <h4 className="recommendation-title">{rule.name}</h4>
                <p className="recommendation-desc">{rule.description}</p>

                <div className="expand-indicator">
                  {selectedRecommendation?.id === rule.id ? '▼' : '▶'}
                </div>
              </div>

              {selectedRecommendation?.id === rule.id && (
                <div className="recommendation-details">
                  <div className="explanation-section">
                    <h5>What this rule does:</h5>
                    <p>{rule.explanation}</p>
                  </div>

                  <div className="recommendation-meta">
                    <div className="meta-item">
                      <span className="meta-label">Affected Objects:</span>
                      <span className="meta-value">{rule.affectedObjects.join(', ')}</span>
                    </div>
                    <div className="meta-item">
                      <span className="meta-label">Impacted Records:</span>
                      <span className="meta-value impact-number">{rule.impactedRecords.toLocaleString()}</span>
                    </div>
                  </div>

                  <button
                    className="btn-setup-rule"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSetupRule(rule);
                    }}
                  >
                    Set Up Rule
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </aside>

      {/* Chat Sidecar for Rule Setup */}
      {chatRule && (
        <RuleSetupChat
          rule={chatRule}
          onClose={handleCloseChat}
          onConfirmSetup={handleConfirmSetup}
        />
      )}

      {/* DQ Assistant - Floating Chat */}
      {!showAssistant && (
        <button className="dq-assistant-fab" onClick={toggleAssistant} title="Open Data Cloud Assistant - Powered by Claire">
          🤖
        </button>
      )}

      {showAssistant && (
        <DQAssistant
          onClose={toggleAssistant}
          recommendations={topDQRecommendations}
          catalogData={mockCatalogData}
        />
      )}
    </div>
  );
}

export default CatalogList;
