import React, { useState } from 'react';
import './DataModelTab.css';

const DMO_OBJECTS = [
  {
    id: 1, name: 'Account__c', label: 'Account', apiName: 'ssot__Account__dlm',
    category: 'PROFILE', type: 'Standard', dataSpace: 'default',
    status: 'Ready', mappedStreams: 9, mappedLakeObjects: 9,
    source: 'Salesforce', owner: 'Sales Team', businessObject: 'Account',
    recordCount: 1500, lastProfiled: '2026-04-21',
    dqScore: 92, hasProfiling: true,
    tags: ['Financial Data.Account Info'],
    classifications: ['Data Categorization.Data Sensitivity.Restricted','Data Categorization.Data Compliance.CCPA','Data Categorization.Data Compliance.GDPR','Data Categorization.Data Compliance.HIPAA','Data Categorization.Data Compliance.PCI DSS'],
    fields: 122,
  },
  {
    id: 2, name: 'Lead__c', label: 'Lead', apiName: 'ssot__Lead__dlm',
    category: 'ENGAGEMENT', type: 'Standard', dataSpace: 'default',
    status: 'Ready', mappedStreams: 4, mappedLakeObjects: 4,
    source: 'Salesforce', owner: 'Marketing Team', businessObject: 'Lead',
    recordCount: 5500, lastProfiled: '2026-04-20',
    dqScore: 78, hasProfiling: true,
    tags: [],
    classifications: ['Data Categorization.Data Compliance.GDPR'],
    fields: 48,
  },
  {
    id: 3, name: 'Contact__c', label: 'Contact', apiName: 'ssot__Contact__dlm',
    category: 'PROFILE', type: 'Standard', dataSpace: 'default',
    status: 'Ready', mappedStreams: 5, mappedLakeObjects: 5,
    source: 'Salesforce', owner: 'Sales Team', businessObject: 'Contact',
    recordCount: 3000, lastProfiled: '2026-04-21',
    dqScore: 85, hasProfiling: true,
    tags: [],
    classifications: ['Data Categorization.Data Compliance.GDPR','Data Categorization.Data Compliance.CCPA'],
    fields: 64,
  },
  {
    id: 4, name: 'Campaign__c', label: 'Campaign', apiName: 'ssot__Campaign__dlm',
    category: 'OTHER', type: 'Standard', dataSpace: 'default',
    status: 'Ready', mappedStreams: 2, mappedLakeObjects: 2,
    source: 'Salesforce', owner: 'Marketing Team', businessObject: 'Campaign',
    recordCount: 8200, lastProfiled: '2026-04-19',
    dqScore: 65, hasProfiling: true,
    tags: [],
    classifications: [],
    fields: 32,
  },
  {
    id: 5, name: 'pardot_email_events', label: 'Email Engagement', apiName: 'ssot__EmailEngagement__dlm',
    category: 'ENGAGEMENT', type: 'Custom', dataSpace: 'default',
    status: 'Ready', mappedStreams: 1, mappedLakeObjects: 1,
    source: 'Pardot', owner: 'Marketing Ops', businessObject: 'Email_Engagement',
    recordCount: 12000, lastProfiled: '2026-04-22',
    dqScore: 95, hasProfiling: true,
    tags: [],
    classifications: [],
    fields: 18,
  },
];

const DQ_COLOR = (score) => {
  if (score >= 90) return '#2E844A';
  if (score >= 70) return '#B86403';
  return '#C23934';
};

const DQ_BG = (score) => {
  if (score >= 90) return '#E3F3E5';
  if (score >= 70) return '#FFF4E0';
  return '#FEECEC';
};

function DataModelTab({ onObjectClick }) {
  const [search, setSearch] = useState('');

  const filtered = DMO_OBJECTS.filter(o =>
    o.label.toLowerCase().includes(search.toLowerCase()) ||
    o.apiName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="data-model-tab">
      {/* Sub-header breadcrumb bar */}
      <div className="page-header">
        <div className="page-header-left">
          <span className="page-header-title">Data Model Objects</span>
        </div>
        <div className="page-header-right">
          <button className="btn-header">Create Data Model Object</button>
        </div>
      </div>

      {/* Summary stats */}
      <div className="dm-stats-bar">
        <div className="dm-stat">
          <span className="dm-stat-val">{DMO_OBJECTS.length}</span>
          <span className="dm-stat-label">Total Objects</span>
        </div>
        <div className="dm-stat">
          <span className="dm-stat-val">{DMO_OBJECTS.filter(o => o.hasProfiling).length}</span>
          <span className="dm-stat-label">Profiled</span>
        </div>
        <div className="dm-stat">
          <span className="dm-stat-val" style={{color:'#2E844A'}}>{DMO_OBJECTS.filter(o => o.dqScore >= 90).length}</span>
          <span className="dm-stat-label">Excellent Quality</span>
        </div>
        <div className="dm-stat">
          <span className="dm-stat-val" style={{color:'#C23934'}}>{DMO_OBJECTS.filter(o => o.dqScore < 70).length}</span>
          <span className="dm-stat-label">Needs Attention</span>
        </div>
      </div>

      {/* Search + table */}
      <div className="dm-table-wrapper">
        <div className="dm-table-toolbar">
          <div className="dm-search">
            <span>🔍</span>
            <input
              placeholder="Search objects…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        <table className="dm-table">
          <thead>
            <tr>
              <th>Label</th>
              <th>API Name</th>
              <th>Type</th>
              <th>Category</th>
              <th>Status</th>
              <th>Fields</th>
              <th>Mapped Streams</th>
              <th>DQ Score</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(obj => (
              <tr key={obj.id} className="dm-row" onClick={() => onObjectClick(obj)}>
                <td className="dm-label-cell">
                  <div className="dm-obj-icon">
                    {obj.category === 'PROFILE' ? '👤' : obj.category === 'ENGAGEMENT' ? '📧' : '📊'}
                  </div>
                  <span className="dm-obj-label">{obj.label}</span>
                </td>
                <td className="dm-api-name">{obj.apiName}</td>
                <td><span className="dm-type-badge">{obj.type}</span></td>
                <td><span className="dm-cat-badge">{obj.category}</span></td>
                <td>
                  <span className="dm-status-badge">
                    <span className="status-dot" />
                    {obj.status}
                  </span>
                </td>
                <td className="dm-num">{obj.fields}</td>
                <td className="dm-num">{obj.mappedStreams}</td>
                <td>
                  {obj.dqScore != null ? (
                    <span className="dm-dq-badge" style={{
                      background: DQ_BG(obj.dqScore),
                      color: DQ_COLOR(obj.dqScore)
                    }}>
                      {obj.dqScore}%
                    </span>
                  ) : <span className="dm-no-score">—</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DataModelTab;
