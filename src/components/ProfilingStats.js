import React, { useState } from 'react';
import './ProfilingStats.css';

const mockProfilingColumns = [
  {
    name: 'EMPID',
    nullPercent: 0,
    nullCount: 0,
    distinctPercent: 100,
    distinctCount: 520,
    nonDistinctPercent: 0,
    nonDistinctCount: 0,
    patterns: 1,
    distribution: 100
  },
  {
    name: 'SNO',
    nullPercent: 0,
    nullCount: 0,
    distinctPercent: 100,
    distinctCount: 520,
    nonDistinctPercent: 0,
    nonDistinctCount: 0,
    patterns: 3,
    distribution: 100
  },
  {
    name: 'FIRSTNAME',
    nullPercent: 0,
    nullCount: 0,
    distinctPercent: 89.62,
    distinctCount: 466,
    nonDistinctPercent: 10.38,
    nonDistinctCount: 54,
    patterns: 6,
    distribution: 95
  },
  {
    name: 'LASTNAME',
    nullPercent: 0,
    nullCount: 0,
    distinctPercent: 95.38,
    distinctCount: 496,
    nonDistinctPercent: 4.62,
    nonDistinctCount: 24,
    patterns: 7,
    distribution: 98
  },
  {
    name: 'CITY',
    nullPercent: 0,
    nullCount: 0,
    distinctPercent: 5.96,
    distinctCount: 31,
    nonDistinctPercent: 94.04,
    nonDistinctCount: 489,
    patterns: 4,
    distribution: 25
  },
  {
    name: 'STATE',
    nullPercent: 5.58,
    nullCount: 29,
    distinctPercent: 3.46,
    distinctCount: 18,
    nonDistinctPercent: 90.96,
    nonDistinctCount: 473,
    patterns: 3,
    distribution: 20
  },
];

function ProfilingStats({ object }) {
  const [selectedColumn, setSelectedColumn] = useState(null);

  return (
    <div className="profiling-stats-view">
      <div className="profiling-controls">
        <div className="control-group">
          <label>View:</label>
          <select defaultValue="columns">
            <option value="columns">Columns and Rules</option>
            <option value="summary">Summary</option>
          </select>
        </div>

        <div className="control-group">
          <label>with:</label>
          <select defaultValue="all">
            <option value="all">All Statistics</option>
            <option value="null">Null Values</option>
            <option value="distinct">Distinct Values</option>
          </select>
        </div>

        <div className="search-box">
          <input type="text" placeholder="Find" />
          <button className="icon-btn">🔍</button>
        </div>

        <div className="action-buttons">
          <button className="icon-btn">🔽</button>
          <button className="icon-btn">⚙️</button>
        </div>
      </div>

      <div className="profiling-content">
        <div className="profiling-table-wrapper">
          <table className="profiling-data-table">
            <thead>
              <tr>
                <th>Columns</th>
                <th>Value Distribution</th>
                <th>% Null</th>
                <th># Null</th>
                <th>% Distinct</th>
                <th># Distinct</th>
                <th>% Non-distinct</th>
                <th># Non-distinct</th>
                <th># Patterns</th>
              </tr>
            </thead>
            <tbody>
              <tr className="group-header">
                <td colSpan="9">
                  <span className="expand-icon">▼</span> Columns
                </td>
              </tr>
              {mockProfilingColumns.map((col, idx) => (
                <tr
                  key={idx}
                  className={selectedColumn === col.name ? 'selected' : ''}
                  onClick={() => setSelectedColumn(col.name)}
                >
                  <td className="column-name-cell">
                    {col.name}
                  </td>
                  <td>
                    <div className="distribution-bar">
                      <div
                        className="bar-fill"
                        style={{ width: `${col.distribution}%` }}
                      ></div>
                    </div>
                  </td>
                  <td className={col.nullPercent > 0 ? 'warning-cell' : ''}>
                    {col.nullPercent}%
                  </td>
                  <td className={col.nullCount > 0 ? 'warning-cell' : ''}>
                    {col.nullCount}
                  </td>
                  <td>{col.distinctPercent}%</td>
                  <td>{col.distinctCount}</td>
                  <td>{col.nonDistinctPercent}%</td>
                  <td>{col.nonDistinctCount}</td>
                  <td>{col.patterns}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {selectedColumn && (
          <div className="profiling-details-panel">
            <div className="panel-header">
              <button className="tab-btn active">Details</button>
              <button className="tab-btn">Rules</button>
            </div>

            <div className="panel-section">
              <h4 className="section-title">
                Trend <span className="expand-icon">▼</span>
              </h4>

              <table className="trend-table">
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>Trend</th>
                    <th>% Change</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="type-null">Null</td>
                    <td>
                      <div className="trend-line">━━━━━</div>
                    </td>
                    <td>0%</td>
                  </tr>
                  <tr>
                    <td className="type-distinct">Distinct</td>
                    <td>
                      <div className="trend-line">━━━━━</div>
                    </td>
                    <td>0%</td>
                  </tr>
                  <tr>
                    <td>Non-distinct</td>
                    <td>
                      <div className="trend-line">━━━━━</div>
                    </td>
                    <td>0%</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="panel-section">
              <h4 className="section-title">
                Data Types (4) <span className="expand-icon">▼</span>
              </h4>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProfilingStats;
