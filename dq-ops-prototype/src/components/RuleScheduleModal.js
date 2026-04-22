import React, { useState } from 'react';
import './RuleScheduleModal.css';

function RuleScheduleModal({ rule, onClose, onSchedule }) {
  const [schedule, setSchedule] = useState('now');
  const [notify, setNotify] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSchedule({
      ruleName: rule.name,
      ruleId: rule.id,
      objectName: rule.objectName,
      column: rule.column,
      schedule,
      notify
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Schedule Data Quality Rule</h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="rule-summary">
              <div className="summary-row">
                <span className="summary-label">Rule:</span>
                <span className="summary-value">{rule.name}</span>
              </div>
              <div className="summary-row">
                <span className="summary-label">Object:</span>
                <span className="summary-value">{rule.objectName}</span>
              </div>
              <div className="summary-row">
                <span className="summary-label">Column:</span>
                <span className="summary-value">{rule.column}</span>
              </div>
              <div className="summary-row">
                <span className="summary-label">Impact:</span>
                <span className="summary-value impact">{rule.impact}</span>
              </div>
            </div>

            <div className="form-group">
              <label>Schedule</label>
              <div className="schedule-options">
                <label className="radio-option">
                  <input
                    type="radio"
                    name="schedule"
                    value="now"
                    checked={schedule === 'now'}
                    onChange={(e) => setSchedule(e.target.value)}
                  />
                  <span>Run now</span>
                </label>

                <label className="radio-option">
                  <input
                    type="radio"
                    name="schedule"
                    value="daily"
                    checked={schedule === 'daily'}
                    onChange={(e) => setSchedule(e.target.value)}
                  />
                  <span>Daily at 2:00 AM</span>
                </label>

                <label className="radio-option">
                  <input
                    type="radio"
                    name="schedule"
                    value="weekly"
                    checked={schedule === 'weekly'}
                    onChange={(e) => setSchedule(e.target.value)}
                  />
                  <span>Weekly (Monday at 2:00 AM)</span>
                </label>

                <label className="radio-option">
                  <input
                    type="radio"
                    name="schedule"
                    value="monthly"
                    checked={schedule === 'monthly'}
                    onChange={(e) => setSchedule(e.target.value)}
                  />
                  <span>Monthly (1st day at 2:00 AM)</span>
                </label>
              </div>
            </div>

            <div className="form-group">
              <label className="checkbox-option">
                <input
                  type="checkbox"
                  checked={notify}
                  onChange={(e) => setNotify(e.target.checked)}
                />
                <span>Email me when rule execution completes</span>
              </label>
            </div>

            <div className="info-box">
              <strong>📊 What happens next:</strong>
              <ul>
                <li>Rule will be executed according to schedule</li>
                <li>Results will appear in DQ Dashboard</li>
                <li>Failed records will be stored in D360</li>
                <li>You can modify or disable this rule anytime</li>
              </ul>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Schedule Rule
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RuleScheduleModal;
