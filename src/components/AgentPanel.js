import React, { useState, useEffect, useRef } from 'react';
import './AgentPanel.css';
import { getResponse, scoreClass, scoreIcon, DMO_SCORES, CHIPS_INITIAL } from './agentResponses';

function renderMessage(msg, onAction) {
  const r = msg.response;
  if (!r) return <p style={{margin:0}}>{msg.text}</p>;

  if (r.type === 'dmo_scores') {
    return (
      <div>
        <p style={{margin:'0 0 0.5rem 0'}}>Here are the current DQ scores:</p>
        <div className="score-cards">
          {r.dmos.map(dmo => {
            const d = DMO_SCORES[dmo];
            const topIssue = d.fields.filter(f => f.issue).slice(0,2).map(f => f.name).join(', ');
            return (
              <div className="score-card" key={dmo}>
                <div>
                  <div className="score-card-name">{dmo}</div>
                  {topIssue && <div className="score-card-issues">Issues: {topIssue}</div>}
                </div>
                <span className={`score-badge ${scoreClass(d.base)}`}>{scoreIcon(d.base)} {d.base}%</span>
              </div>
            );
          })}
        </div>
        <p style={{margin:'0.625rem 0 0',fontSize:'0.75rem',color:'#5C5C5C'}}>Click a chip below to drill into field-level issues.</p>
      </div>
    );
  }

  if (r.type === 'field_table') {
    const d = DMO_SCORES[r.dmo];
    return (
      <div>
        <p style={{margin:'0 0 0.5rem 0'}}>Field-level breakdown for <strong>{r.dmo}</strong> (overall: <span className={`score-badge ${scoreClass(d.base)}`} style={{padding:'0.1rem 0.4rem',borderRadius:'3px',fontSize:'0.75rem'}}>{d.base}%</span>):</p>
        <table className="field-table">
          <thead><tr><th>Field</th><th>Score</th><th>Issue</th></tr></thead>
          <tbody>
            {d.fields.map(f => (
              <tr key={f.name}>
                <td style={{fontWeight:600}}>{f.name}</td>
                <td><span className="field-score" style={{color: f.score>=90?'#2E844A':f.score>=70?'#B86403':'#C23934'}}>{scoreIcon(f.score)} {f.score}%</span></td>
                <td style={{color:'#5C5C5C',fontSize:'0.75rem'}}>{f.issue || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (r.type === 'fallback') {
    return (
      <div>
        <p style={{margin:'0 0 0.5rem 0'}}>I can help you with:</p>
        <p style={{margin:'0.25rem 0',fontSize:'0.8125rem'}}>• <strong>DMO health checks</strong> — "Check Campaign DMO health"</p>
        <p style={{margin:'0.25rem 0',fontSize:'0.8125rem'}}>• <strong>Field-level DQ drill-down</strong> — "Drill into Lead field issues"</p>
        <p style={{margin:'0.25rem 0',fontSize:'0.8125rem'}}>• <strong>DQ rules</strong> — "Fix AnnualRevenue on Account"</p>
        <p style={{margin:'0.25rem 0',fontSize:'0.8125rem'}}>• <strong>Calculated Insights</strong> — "Create Campaign Lead Quality CI"</p>
        <p style={{margin:'0.25rem 0',fontSize:'0.8125rem'}}>• <strong>Notify analyst</strong> — "Draft Slack message to analyst"</p>
        <p style={{margin:'0.25rem 0',fontSize:'0.8125rem'}}>• <strong>Monitoring</strong> — "Schedule DQ monitoring"</p>
      </div>
    );
  }

  if (r.type === 'rule_added') {
    return (
      <div>
        <p style={{margin:'0 0 0.5rem 0'}}>✅ Rule added to <strong>{r.dmo}</strong> — <em>{r.field}</em></p>
        <p style={{margin:'0 0 0.625rem 0',fontSize:'0.8125rem',color:'#5C5C5C'}}>Rule: {r.rule}</p>
        <div className="score-cards">
          <div className="score-card">
            <div><div className="score-card-name">{r.dmo} DQ Score</div><div className="score-card-issues">{r.affected.toLocaleString()} records affected</div></div>
            <div style={{display:'flex',gap:'0.375rem',alignItems:'center'}}>
              <span className={`score-badge ${scoreClass(r.before)}`}>{r.before}%</span>
              <span style={{color:'#5C5C5C',fontSize:'0.75rem'}}>→</span>
              <span className={`score-badge ${scoreClass(r.after)}`}>{r.after}%</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (r.type === 'bulk_rules') {
    const rows = [['Account',92,96],['Campaign',65,74],['Lead',78,83],['CampaignMember',71,79]];
    return (
      <div>
        <p style={{margin:'0 0 0.5rem 0'}}>✅ Bulk rules applied across all 4 DMOs. Before / After:</p>
        <table className="compare-table">
          <thead><tr><th>DMO</th><th>Before</th><th>After</th><th>Δ</th></tr></thead>
          <tbody>{rows.map(([dmo,b,a]) => (
            <tr key={dmo}><td style={{fontWeight:600}}>{dmo}</td>
              <td><span className={`score-badge ${scoreClass(b)}`}>{b}%</span></td>
              <td><span className={`score-badge ${scoreClass(a)}`}>{a}%</span></td>
              <td className="val-better">+{a-b}%</td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    );
  }

  if (r.type === 'threshold') {
    const checks = [['Account',96,true],['Lead',83,false],['Campaign',74,false],['CampaignMember',79,false]];
    return (
      <div>
        <p style={{margin:'0 0 0.5rem 0'}}>DQ gate set to <strong>85%</strong>. Current status:</p>
        <div className="gate-check">
          {checks.map(([dmo,score,pass]) => (
            <div className="gate-row" key={dmo}>
              <span style={{fontWeight:600}}>{dmo}</span>
              <span style={{fontSize:'0.8125rem',color:'#5C5C5C'}}>{score}%</span>
              <span className={pass ? 'gate-pass' : 'gate-fail'}>{pass ? '✓ Pass' : '✗ Fail'}</span>
            </div>
          ))}
        </div>
        <p style={{margin:'0.625rem 0 0',fontSize:'0.75rem',color:'#B86403'}}>⚠ Apply bulk rules first to bring Campaign and CampaignMember above 85%.</p>
      </div>
    );
  }

  if (r.type === 'ci_flow') {
    if (r.step === 1) {
      const checks = [['Account',96,true],['Lead',83,false],['Campaign',74,false],['CampaignMember',71,false]];
      return (
        <div>
          <p style={{margin:'0 0 0.5rem 0'}}>Checking DQ gate (threshold: 85%) before creating <strong>Campaign_Lead_Quality_by_Account</strong>:</p>
          <div className="gate-check">
            {checks.map(([dmo,score,pass]) => (
              <div className="gate-row" key={dmo}>
                <span style={{fontWeight:600}}>{dmo}</span>
                <span style={{fontSize:'0.8125rem',color:'#5C5C5C'}}>{score}%</span>
                <span className={pass ? 'gate-pass' : 'gate-fail'}>{pass ? '✓ Pass' : '✗ Fail'}</span>
              </div>
            ))}
          </div>
          <p style={{margin:'0.625rem 0 0',fontSize:'0.8125rem',color:'#5C5C5C'}}>3 DMOs below threshold. Proceeding with exclusions applied…</p>
        </div>
      );
    }
    if (r.step === 2) {
      return (
        <div>
          <p style={{margin:'0 0 0.375rem 0'}}>Records excluded due to DQ failures:</p>
          <div className="score-cards">
            {[['Campaign',701],['Lead',823],['CampaignMember',323]].map(([dmo,cnt]) => (
              <div className="score-card" key={dmo}><div className="score-card-name">{dmo}</div><span className="score-badge score-red">{cnt.toLocaleString()} excluded</span></div>
            ))}
          </div>
          <p style={{margin:'0.5rem 0 0',fontSize:'0.8125rem',color:'#5C5C5C'}}>Total: <strong>1,847 records excluded</strong> (12.3% of 15,000). Building CI preview…</p>
        </div>
      );
    }
    if (r.step >= 3) {
      return (
        <div>
          <div className="ci-preview-card">
            <div className="ci-preview-title">CI Preview — Campaign_Lead_Quality_by_Account</div>
            <div className="ci-metrics">
              <div className="ci-metric"><span className="ci-metric-val">13,153</span><span className="ci-metric-label">Total Leads (DQ-filtered)</span></div>
              <div className="ci-metric"><span className="ci-metric-val">14.2%</span><span className="ci-metric-label">Conversion Rate</span></div>
              <div className="ci-metric"><span className="ci-metric-val">$47</span><span className="ci-metric-label">Cost per Lead</span></div>
              <div className="ci-metric"><span className="ci-metric-val">78/100</span><span className="ci-metric-label">Lead Quality Score</span></div>
            </div>
          </div>
          <div className="bubble-actions">
            <button className="bubble-btn bubble-btn-primary" onClick={() => onAction('publish')}>Publish CI</button>
            <button className="bubble-btn bubble-btn-secondary" onClick={() => onAction('View excluded records')}>View Exclusions</button>
          </div>
        </div>
      );
    }
  }

  if (r.type === 'ci_published') {
    return <p style={{margin:0}}>✅ <strong>Campaign_Lead_Quality_by_Account</strong> published successfully! The CI is now available in Calculated Insights and will refresh on every pipeline run.</p>;
  }

  if (r.type === 'ci_compare') {
    return (
      <div>
        <p style={{margin:'0 0 0.5rem 0'}}>Impact of DQ filter on CI results:</p>
        <table className="compare-table">
          <thead><tr><th>Metric</th><th>With DQ Filter</th><th>Without Filter</th></tr></thead>
          <tbody>
            <tr><td>Total Leads</td><td className="val-better">13,153</td><td className="val-worse">15,000</td></tr>
            <tr><td>Conversion Rate</td><td className="val-better">14.2%</td><td className="val-worse">11.8%</td></tr>
            <tr><td>Cost per Lead</td><td className="val-better">$47</td><td className="val-worse">$58</td></tr>
            <tr><td>Lead Quality Score</td><td className="val-better">78/100</td><td className="val-worse">62/100</td></tr>
          </tbody>
        </table>
      </div>
    );
  }

  if (r.type === 'exclusions') {
    return (
      <div>
        <p style={{margin:'0 0 0.5rem 0'}}>Exclusion breakdown for <strong>Campaign_Lead_Quality_by_Account</strong>:</p>
        <table className="field-table">
          <thead><tr><th>DMO</th><th>Records</th><th>Reason</th></tr></thead>
          <tbody>
            <tr><td>Campaign</td><td>701</td><td style={{color:'#5C5C5C',fontSize:'0.75rem'}}>StartDate invalid range, Type non-standard</td></tr>
            <tr><td>Lead</td><td>823</td><td style={{color:'#5C5C5C',fontSize:'0.75rem'}}>Country inconsistent, Phone null</td></tr>
            <tr><td>CampaignMember</td><td>323</td><td style={{color:'#5C5C5C',fontSize:'0.75rem'}}>Orphaned CampaignId references</td></tr>
          </tbody>
        </table>
        <p style={{margin:'0.5rem 0 0',fontSize:'0.75rem',color:'#5C5C5C'}}>Total excluded: 1,847 (12.3% of 15,000 records)</p>
      </div>
    );
  }

  if (r.type === 'slack_draft') {
    const draft = `@channel 📊 Data Quality Alert — Campaign Lead Quality CI

DMO Scores:  Account 92% ✓ | Lead 78% ⚠ | Campaign 65% ✗ | CampaignMember 71% ⚠

Top issues requiring transform fixes:
• Lead.Country — 825 records with inconsistent values (USA/US/United States)
• Campaign.StartDate — 112 records with invalid date ranges
• Campaign.Type — 234 records with non-standard picklist values
• CampaignMember.CampaignId — 847 orphaned records

Action needed: Apply Data Cloud transform fixes before next pipeline run.
CI creation is blocked until Campaign and CampaignMember reach 85%.

— Data Cloud Agent`;
    return <div><p style={{margin:'0 0 0.5rem 0'}}>Draft Slack message:</p><div className="draft-box">{draft}</div></div>;
  }

  if (r.type === 'email_draft') {
    const draft = `Subject: Action Required — Data Quality Issues Blocking Campaign Lead Quality CI

Hi Taylor,

I've completed a DQ assessment on the Account, Campaign, Lead, and CampaignMember DMOs.

Summary:
  Account:        92% ✓
  Lead:           78% ⚠  (below 85% gate)
  Campaign:       65% ✗  (below 85% gate)
  CampaignMember: 71% ⚠  (below 85% gate)

Fields requiring transform fixes:
  • Lead.Country         — standardize to ISO 2-letter codes
  • Campaign.StartDate   — validate EndDate > StartDate
  • Campaign.Type        — enforce standard picklist values
  • CampaignMember.CampaignId — add referential integrity check

Please apply these fixes in Data Cloud Transforms before the next scheduled pipeline run.

— Data Cloud Agent`;
    return <div><p style={{margin:'0 0 0.5rem 0'}}>Draft email:</p><div className="draft-box">{draft}</div></div>;
  }

  if (r.type === 'transform_instructions') {
    return (
      <div>
        <p style={{margin:'0 0 0.5rem 0'}}>Transform fixes needed:</p>
        <table className="field-table">
          <thead><tr><th>DMO</th><th>Field</th><th>Problem</th><th>Fix</th></tr></thead>
          <tbody>
            <tr><td>Lead</td><td style={{fontWeight:600}}>Country</td><td style={{color:'#C23934',fontSize:'0.75rem'}}>Mixed formats</td><td style={{fontSize:'0.75rem'}}>MAP to ISO 3166-1 alpha-2</td></tr>
            <tr><td>Campaign</td><td style={{fontWeight:600}}>StartDate</td><td style={{color:'#C23934',fontSize:'0.75rem'}}>End before start</td><td style={{fontSize:'0.75rem'}}>VALIDATE EndDate &gt; StartDate</td></tr>
            <tr><td>Campaign</td><td style={{fontWeight:600}}>Type</td><td style={{color:'#C23934',fontSize:'0.75rem'}}>Non-standard</td><td style={{fontSize:'0.75rem'}}>ENFORCE picklist allowlist</td></tr>
            <tr><td>CampaignMember</td><td style={{fontWeight:600}}>CampaignId</td><td style={{color:'#C23934',fontSize:'0.75rem'}}>Orphaned refs</td><td style={{fontSize:'0.75rem'}}>JOIN to active Campaigns only</td></tr>
          </tbody>
        </table>
      </div>
    );
  }

  if (r.type === 'monitoring_set') {
    return (
      <div>
        <p style={{margin:'0 0 0.375rem 0'}}>✅ DQ monitoring scheduled:</p>
        <p style={{margin:'0.25rem 0',fontSize:'0.8125rem'}}>• <strong>Trigger:</strong> After every pipeline refresh</p>
        <p style={{margin:'0.25rem 0',fontSize:'0.8125rem'}}>• <strong>Threshold:</strong> Alert if any critical field drops below 85%</p>
        <p style={{margin:'0.25rem 0',fontSize:'0.8125rem'}}>• <strong>Action:</strong> Block dependent CIs + notify analyst via Slack</p>
        <p style={{margin:'0.25rem 0',fontSize:'0.8125rem'}}>• <strong>DMOs monitored:</strong> Account, Campaign, Lead, CampaignMember</p>
      </div>
    );
  }

  if (r.type === 'trend_report') {
    return (
      <div>
        <p style={{margin:'0 0 0.5rem 0'}}>DQ score trend — last 4 weeks:</p>
        <div className="draft-box" style={{fontFamily:'monospace',fontSize:'0.75rem'}}>
{`Week    Account   Campaign  Lead
W1      88%       61%       74%
W2      89%       62%       76%
W3      91%       63%       77%
W4      92% ↑     65% ↑     78% ↑

▲ All DMOs improving. Campaign slowest (+4% over 4 weeks).
  At this rate Campaign reaches 85% in ~5 weeks.
  Apply bulk rules to accelerate to this week.`}
        </div>
      </div>
    );
  }

  return <p style={{margin:0}}>{msg.text}</p>;
}

const SPARKLE_SVG = (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M8 1L9.5 6H14.5L10.5 9L12 14L8 11L4 14L5.5 9L1.5 6H6.5L8 1Z" fill="white"/>
    <circle cx="12" cy="3" r="1.5" fill="white" opacity="0.7"/>
  </svg>
);
const SPARKLE_SVG_DARK = (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M8 1L9.5 6H14.5L10.5 9L12 14L8 11L4 14L5.5 9L1.5 6H6.5L8 1Z" fill="#8B6FBC"/>
    <circle cx="12" cy="3" r="1.5" fill="#8B6FBC" opacity="0.6"/>
  </svg>
);

function AgentPanel({ open, onClose }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [chips, setChips] = useState(CHIPS_INITIAL);
  const [agentState, setAgentState] = useState({ ciStep: 0 });
  const bottomRef = useRef(null);

  useEffect(() => {
    setMessages([{
      id: 1, from: 'agent', text: '',
      response: { type: 'greeting' }
    }]);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  function sendMessage(text) {
    if (!text.trim()) return;
    const userMsg = { id: Date.now(), from: 'user', text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setTyping(true);

    setTimeout(() => {
      const nextCiStep = agentState.ciStep;
      const resp = getResponse(text, { ciStep: nextCiStep });

      if (resp.type === 'ci_flow') {
        const newStep = nextCiStep + 1;
        setAgentState({ ciStep: newStep });
        resp.step = newStep;
      }

      const agentMsg = { id: Date.now() + 1, from: 'agent', text: '', response: resp };
      setMessages(prev => [...prev, agentMsg]);
      setChips(resp.chips || CHIPS_INITIAL);
      setTyping(false);
    }, 700);
  }

  return (
    <div className={`agent-panel ${open ? 'open' : ''}`}>
      <div className="agent-header">
        <div className="agent-header-left">
          <div className="agent-avatar">{SPARKLE_SVG}</div>
          <div>
            <div className="agent-title">Data Cloud Agent</div>
            <div className="agent-subtitle">Powered by Agentforce</div>
          </div>
        </div>
        <button className="agent-close" onClick={onClose}>✕</button>
      </div>

      <div className="agent-messages">
        {messages.map(msg => {
          if (msg.response?.type === 'greeting') {
            return (
              <div key={msg.id} className="msg-row agent">
                <div className="msg-avatar">{SPARKLE_SVG}</div>
                <div className="msg-bubble">
                  <p style={{margin:'0 0 0.375rem 0'}}>Hi! I'm your <strong>Data Cloud Agent</strong>.</p>
                  <p style={{margin:'0 0 0.25rem 0',fontSize:'0.8125rem'}}>I can help you:</p>
                  <p style={{margin:'0.1rem 0',fontSize:'0.8125rem'}}>• Check DMO data quality health</p>
                  <p style={{margin:'0.1rem 0',fontSize:'0.8125rem'}}>• Add DQ rules and fix failing fields</p>
                  <p style={{margin:'0.1rem 0',fontSize:'0.8125rem'}}>• Create DQ-gated Calculated Insights</p>
                  <p style={{margin:'0.1rem 0',fontSize:'0.8125rem'}}>• Notify your marketing analyst</p>
                  <p style={{margin:'0.375rem 0 0',fontSize:'0.8125rem',color:'#6B4EAA'}}>Pick a suggestion below or type your question.</p>
                </div>
              </div>
            );
          }
          return (
            <div key={msg.id} className={`msg-row ${msg.from}`}>
              {msg.from === 'agent' && <div className="msg-avatar">{SPARKLE_SVG}</div>}
              <div className="msg-bubble">
                {msg.from === 'agent' ? renderMessage(msg, sendMessage) : msg.text}
              </div>
            </div>
          );
        })}
        {typing && (
          <div className="msg-row agent">
            <div className="msg-avatar">{SPARKLE_SVG}</div>
            <div className="msg-bubble">
              <div className="typing-bubble"><span/><span/><span/></div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="chips-row">
        {chips.map(c => (
          <button key={c} className="chip" onClick={() => sendMessage(c)}>{c}</button>
        ))}
      </div>

      <div className="agent-input-row">
        <input
          className="agent-input"
          placeholder="Ask about DMO health, rules, calculated insights…"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(input); } }}
        />
        <button className="agent-send" onClick={() => sendMessage(input)} disabled={!input.trim()}>Send</button>
      </div>
    </div>
  );
}

// ── Full-screen Claude-style Agent Page ─────────────────────────
const HISTORY = [
  { id: 'h1', label: 'Campaign DQ health check', active: true },
  { id: 'h2', label: 'Lead field issues drill-down', active: false },
  { id: 'h3', label: 'Bulk DQ rules — all DMOs', active: false },
  { id: 'h4', label: 'Campaign Lead Quality CI', active: false },
];

export function AgentPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [chips, setChips] = useState(CHIPS_INITIAL);
  const [agentState, setAgentState] = useState({ ciStep: 0 });
  const bottomRef = useRef(null);

  useEffect(() => {
    setMessages([{ id: 1, from: 'agent', text: '', response: { type: 'greeting' } }]);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  function sendMessage(text) {
    if (!text.trim()) return;
    setMessages(prev => [...prev, { id: Date.now(), from: 'user', text }]);
    setInput('');
    setTyping(true);
    setTimeout(() => {
      const nextCiStep = agentState.ciStep;
      const resp = getResponse(text, { ciStep: nextCiStep });
      if (resp.type === 'ci_flow') { const s = nextCiStep + 1; setAgentState({ ciStep: s }); resp.step = s; }
      setMessages(prev => [...prev, { id: Date.now() + 1, from: 'agent', text: '', response: resp }]);
      setChips(resp.chips || CHIPS_INITIAL);
      setTyping(false);
    }, 700);
  }

  return (
    <div className="agent-page">
      <div className="agent-sidebar">
        <div className="agent-sidebar-header">
          <div className="agent-sidebar-logo">
            <div className="agent-sidebar-logo-icon">{SPARKLE_SVG_DARK}</div>
            <div>
              <div className="agent-sidebar-logo-text">Data Cloud Agent</div>
              <div className="agent-sidebar-logo-sub">Powered by Agentforce</div>
            </div>
          </div>
          <button className="new-chat-btn" onClick={() => { setMessages([{ id: Date.now(), from: 'agent', text: '', response: { type: 'greeting' } }]); setChips(CHIPS_INITIAL); setAgentState({ ciStep: 0 }); }}>
            ✦ New conversation
          </button>
        </div>
        <div className="agent-sidebar-section" style={{marginTop:'0.75rem'}}>Recent</div>
        {HISTORY.map(h => (
          <div key={h.id} className={`agent-history-item ${h.active ? 'active' : ''}`}>{h.label}</div>
        ))}
      </div>

      <div className="agent-main">
        <div className="agent-main-header">
          <div>
            <div className="agent-main-title">Data Cloud Agent</div>
            <div className="agent-main-subtitle">DQ assessment · Rule creation · Calculated Insights</div>
          </div>
        </div>

        <div className="agent-messages">
          {messages.map(msg => {
            if (msg.response?.type === 'greeting') {
              return (
                <div key={msg.id} className="msg-row agent">
                  <div className="msg-avatar">{SPARKLE_SVG_DARK}</div>
                  <div className="msg-bubble">
                    <p style={{margin:'0 0 0.375rem 0'}}>Hi! I'm your <strong>Data Cloud Agent</strong>.</p>
                    <p style={{margin:'0 0 0.25rem 0'}}>I can help you:</p>
                    <p style={{margin:'0.1rem 0'}}>• Check DMO data quality health</p>
                    <p style={{margin:'0.1rem 0'}}>• Add DQ rules and fix failing fields</p>
                    <p style={{margin:'0.1rem 0'}}>• Create DQ-gated Calculated Insights</p>
                    <p style={{margin:'0.1rem 0'}}>• Notify your marketing analyst</p>
                    <p style={{margin:'0.375rem 0 0',color:'#6B4EAA',fontSize:'0.8125rem'}}>Pick a suggestion below or type your question.</p>
                  </div>
                </div>
              );
            }
            return (
              <div key={msg.id} className={`msg-row ${msg.from}`}>
                {msg.from === 'agent' && <div className="msg-avatar">{SPARKLE_SVG_DARK}</div>}
                <div className="msg-bubble">
                  {msg.from === 'agent' ? renderMessage(msg, sendMessage) : msg.text}
                </div>
              </div>
            );
          })}
          {typing && (
            <div className="msg-row agent">
              <div className="msg-avatar">{SPARKLE_SVG_DARK}</div>
              <div className="msg-bubble"><div className="typing-bubble"><span/><span/><span/></div></div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        <div className="chips-row">
          {chips.map(c => <button key={c} className="chip" onClick={() => sendMessage(c)}>{c}</button>)}
        </div>

        <div className="agent-page-input-wrapper">
          <div className="agent-input-row">
            <input className="agent-input" placeholder="Ask about DMO health, rules, calculated insights…"
              value={input} onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(input); } }}
            />
            <button className="agent-send" onClick={() => sendMessage(input)} disabled={!input.trim()}>Send</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AgentPanel;
