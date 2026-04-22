import React, { useState } from 'react';
import './App.css';
import CatalogList from './components/CatalogList';
import ObjectDetail from './components/ObjectDetail';
import RuleSetupChat from './components/RuleSetupChat';

function App() {
  const [selectedObject, setSelectedObject] = useState(null);
  const [chatRule, setChatRule] = useState(null);
  const [activeView, setActiveView] = useState('explore');

  const handleObjectClick = (object) => {
    setSelectedObject(object);
  };

  const handleBackToCatalog = () => {
    setSelectedObject(null);
  };

  const handleApplyRule = (rule) => {
    setChatRule(rule);
  };

  const handleCloseChat = () => {
    setChatRule(null);
  };

  const handleConfirmSetup = (rule) => {
    alert(`✅ Rule "${rule.name}" has been activated!\n\n• Will run daily at 2:00 AM\n• DQ scores will update after each run\n• Email notifications enabled\n\nYou can view rule status in the Rules dashboard.`);
    setChatRule(null);
  };

  return (
    <div className="App">
      <header className="app-header">
        <div className="header-content">
          <div className="header-left">
            <div className="app-logo">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="3" width="7" height="7" fill="#8B6FBC"/>
                <rect x="3" y="13" width="7" height="7" fill="#8B6FBC"/>
                <rect x="13" y="3" width="7" height="7" fill="#8B6FBC"/>
              </svg>
              <span>Makana Health</span>
            </div>
            <h1>Catalog</h1>
          </div>

          <div className="user-info">
            <div className="user-avatar">TP</div>
          </div>
        </div>
      </header>

      <main className="app-main">
        <aside className="sidebar">
          <div className="sidebar-title">Salesforce Catalog</div>
          <ul className="sidebar-menu">
            <li className={`sidebar-item ${activeView === 'explore' ? 'active' : ''}`} onClick={() => setActiveView('explore')}>
              Explore Assets
            </li>
            <li className="sidebar-item">Explore Lineage</li>
            <li className="sidebar-item">Curate</li>
            <li className="sidebar-item">Insights</li>
          </ul>
        </aside>

        <div className="content-area">
          {!selectedObject ? (
            <CatalogList onObjectClick={handleObjectClick} />
          ) : (
            <ObjectDetail
              object={selectedObject}
              onBack={handleBackToCatalog}
              onApplyRule={handleApplyRule}
            />
          )}
        </div>
      </main>

      {chatRule && (
        <RuleSetupChat
          rule={chatRule}
          onClose={handleCloseChat}
          onConfirmSetup={handleConfirmSetup}
        />
      )}
    </div>
  );
}

export default App;
