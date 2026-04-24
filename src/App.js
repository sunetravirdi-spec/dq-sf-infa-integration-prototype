import React, { useState } from 'react';
import './App.css';
import DataModelTab from './components/DataModelTab';
import ObjectDetail from './components/ObjectDetail';
import RuleSetupChat from './components/RuleSetupChat';
import CatalogList from './components/CatalogList';
import AgentPanel, { AgentPage } from './components/AgentPanel';

const NAV_TABS = [
  'Agent', 'Data Model', 'Unified Catalog', 'Home', 'Data Streams', 'Segments',
  'Activations', 'Activation Targets', 'Data Lake Objects', 'Data Transforms',
  'Calculated Insights', 'Search Indexes', 'More'
];

function App() {
  const [activeNav, setActiveNav] = useState('Agent');
  const [selectedObject, setSelectedObject] = useState(null);
  const [chatRule, setChatRule] = useState(null);
  const [agentOpen, setAgentOpen] = useState(false);

  return (
    <div className="App">
      {/* Global nav bar — matches Salesforce Data Cloud chrome */}
      <header className="global-nav">
        <div className="global-nav-inner">
          <div className="global-nav-left">
            <div className="sf-logo">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <ellipse cx="12" cy="12" rx="11" ry="8" fill="#009EDB"/>
                <ellipse cx="12" cy="12" rx="7" ry="5" fill="#fff"/>
              </svg>
            </div>
            <span className="app-name">Data Cloud</span>
            <nav className="top-nav">
              {NAV_TABS.map(tab => (
                <button
                  key={tab}
                  className={`top-nav-tab ${activeNav === tab ? 'active' : ''}`}
                  onClick={() => { setActiveNav(tab); setSelectedObject(null); if (tab === 'Agent') setAgentOpen(true); }}
                >
                  {tab}
                  {['Data Streams','Segments','Activations','Activation Targets','Data Model','Data Lake Objects','Data Transforms','Calculated Insights','Search Indexes','More'].includes(tab) && (
                    <span className="nav-chevron">▾</span>
                  )}
                </button>
              ))}
            </nav>
          </div>
          <div className="global-nav-right">
            <div className="nav-search">
              <span className="search-icon">🔍</span>
              <input placeholder="Search or ask anything…" readOnly />
            </div>
            <button className="ask-btn">Ask</button>
            <button
              className={`agent-nav-btn ${agentOpen ? 'active' : ''}`}
              onClick={() => setAgentOpen(o => !o)}
              title="Data Cloud Agent"
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M8 1L9.5 6H14.5L10.5 9L12 14L8 11L4 14L5.5 9L1.5 6H6.5L8 1Z" fill="white"/>
                <circle cx="12" cy="3" r="1.5" fill="white" opacity="0.7"/>
              </svg>
            </button>
            <div className="nav-icons">
              <span title="Setup">⚙</span>
              <span title="Help">?</span>
              <div className="user-avatar">SV</div>
            </div>
          </div>
        </div>
      </header>

      <main className="app-body">
        {activeNav === 'Data Model' && !selectedObject && (
          <DataModelTab onObjectClick={setSelectedObject} />
        )}
        {activeNav === 'Data Model' && selectedObject && (
          <ObjectDetail
            object={selectedObject}
            onBack={() => setSelectedObject(null)}
            onApplyRule={setChatRule}
          />
        )}
        {activeNav === 'Unified Catalog' && (
          <CatalogList onObjectClick={(obj) => { setSelectedObject(obj); setActiveNav('Data Model'); }} />
        )}
        {activeNav === 'Agent' && <AgentPage />}
        {activeNav !== 'Data Model' && activeNav !== 'Unified Catalog' && activeNav !== 'Agent' && (
          <div className="placeholder-tab">
            <p>{activeNav}</p>
            <span>This tab is not part of the DQ prototype.</span>
          </div>
        )}
        <AgentPanel open={agentOpen} onClose={() => setAgentOpen(false)} />
      </main>

      {chatRule && (
        <RuleSetupChat
          rule={chatRule}
          onClose={() => setChatRule(null)}
          onConfirmSetup={(rule) => {
            alert(`✅ Rule "${rule.name}" activated!\n\n• Runs daily at 2:00 AM\n• Email notifications enabled`);
            setChatRule(null);
          }}
        />
      )}
    </div>
  );
}

export default App;
