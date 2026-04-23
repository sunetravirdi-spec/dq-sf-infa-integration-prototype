import React, { useState, useRef, useEffect } from 'react';
import './DQAssistant.css';

function DQAssistant({ onClose, recommendations, catalogData }) {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [pendingRuleActivation, setPendingRuleActivation] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Initial greeting
    const initialMessages = [
      {
        id: 1,
        type: 'assistant',
        content: `Hi! I'm Claire, your Data Cloud Assistant. I can help you with:`
      },
      {
        id: 2,
        type: 'assistant',
        content: `• View and activate pending DQ recommendations\n• Answer questions about data quality across your assets\n• Explain DQ scores and profiling results\n• Help prioritize which rules to set up first\n• Show which assets need attention\n\nWhat would you like to know?`
      }
    ];
    setMessages(initialMessages);
  }, []);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputValue
    };

    setMessages(prev => [...prev, userMessage]);
    const userInput = inputValue;
    setInputValue('');
    setIsProcessing(true);

    setTimeout(() => {
      const response = generateResponse(userInput);
      const assistantMessage = {
        id: Date.now() + 1,
        type: 'assistant',
        content: response
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsProcessing(false);
    }, 800);
  };

  const generateResponse = (question) => {
    const lowerQ = question.toLowerCase().trim();

    // Check for confirmation if there's a pending rule
    if (pendingRuleActivation) {
      const isConfirmation =
        lowerQ === 'yes' ||
        lowerQ === 'confirm' ||
        lowerQ === 'yes confirm' ||
        lowerQ === 'go ahead' ||
        lowerQ === 'do it' ||
        lowerQ === 'activate' ||
        lowerQ === 'ok' ||
        lowerQ === 'sure';

      if (isConfirmation) {
        const rule = pendingRuleActivation;
        setPendingRuleActivation(null);

        // Simulate activation
        setTimeout(() => {
          alert(`✅ Rule "${rule.name}" has been activated!\n\n• Will run daily at 2:00 AM\n• DQ scores will update after each run\n• Email notifications enabled\n\nYou can view rule status in the Rules dashboard.`);
        }, 1000);

        return `✅ **${rule.name}** activated successfully!\n\n• Scheduled: Daily at 2:00 AM\n• Email notifications: ON\n• DQ tracking: Enabled\n\nFirst run tonight. You'll get a summary email.\n\nAnything else I can help with?`;
      }

      if (lowerQ === 'no' || lowerQ === 'cancel' || lowerQ === 'nevermind') {
        setPendingRuleActivation(null);
        return `No problem! Cancelled activation. What else can I help with?`;
      }
    }

    // What can I do / tasks questions
    if (lowerQ.includes('task') || lowerQ.includes('what can') || lowerQ.includes('what are') ||
        lowerQ.includes('what do') || lowerQ.includes('capabilities') || lowerQ.includes('can you do') ||
        lowerQ.includes('help me') || lowerQ.includes('what can i') || lowerQ.includes('how can you')) {
      return `**Here's what I can help you with:**\n\n1. **Set up a Data Quality rule**\n   Activate AI-recommended DQ rules on your DMOs — no rule engine knowledge needed. Say "show pending rules" to see what's ready to activate.\n\n2. **View DQ scores**\n   See quality scores across all profiled assets, broken down by dimension (Completeness, Accuracy, Consistency, Validity, Uniqueness).\n\n3. **Find assets that need attention**\n   Identify which DMOs or DLOs have low scores or missing profiling. Say "what needs attention?"\n\n4. **Prioritize rules**\n   Get a recommendation on which rules to set up first based on business impact. Say "which rules should I prioritize?"\n\n5. **Ask about a specific asset**\n   Get details on any object — DQ score, profiling status, owner, recommended rules. Say "tell me about Lead__c"\n\n6. **Check profiling status**\n   See which assets have been profiled and which haven't. Say "what's been profiled?"\n\nWhat would you like to do?`;
    }

    // Pending rules questions
    if (lowerQ.includes('pending') || lowerQ.includes('recommendation') ||
        lowerQ.includes('suggest') || (lowerQ.includes('what') && lowerQ.includes('rule'))) {
      return `**${recommendations.length} DQ Recommendations Pending:**\n\n${recommendations.map((r, i) =>
        `${i + 1}. **${r.name}** (${r.priority} Priority)\n   Impact: ${r.impactedRecords.toLocaleString()} records across ${r.affectedObjects.join(', ')}`
      ).join('\n\n')}\n\nWould you like to activate any of these rules?`;
    }

    // Activation requests
    if (lowerQ.includes('activate') || lowerQ.includes('set up') || lowerQ.includes('enable') || lowerQ.includes('start')) {
      // Check for number-based selection (activate 1, activate 2, etc.)
      const numberMatch = lowerQ.match(/\b([1-3])\b/);
      if (numberMatch) {
        const ruleIndex = parseInt(numberMatch[1]) - 1;
        if (ruleIndex >= 0 && ruleIndex < recommendations.length) {
          const ruleMatch = recommendations[ruleIndex];
          setPendingRuleActivation(ruleMatch);
          return `Perfect! Setting up **${ruleMatch.name}**.\n\n**This rule will:**\n• Check: ${ruleMatch.affectedObjects.join(', ')}\n• Impact: ${ruleMatch.impactedRecords.toLocaleString()} records\n• Run: Daily at 2:00 AM\n• Notify: Email summary after each run\n\nSay **"yes"** or **"confirm"** to activate!`;
        }
      }

      // Check for rule name match
      const ruleMatch = recommendations.find(r =>
        lowerQ.includes(r.name.toLowerCase()) ||
        (lowerQ.includes('email') && r.name.toLowerCase().includes('email')) ||
        (lowerQ.includes('null') && r.name.toLowerCase().includes('null')) ||
        (lowerQ.includes('country') && r.name.toLowerCase().includes('country'))
      );

      if (ruleMatch) {
        setPendingRuleActivation(ruleMatch);
        return `Perfect! Setting up **${ruleMatch.name}**.\n\n**This rule will:**\n• Check: ${ruleMatch.affectedObjects.join(', ')}\n• Impact: ${ruleMatch.impactedRecords.toLocaleString()} records\n• Run: Daily at 2:00 AM\n• Notify: Email summary after each run\n\nSay **"yes"** or **"confirm"** to activate!`;
      }

      return `Which rule would you like to activate?\n\n${recommendations.map((r, i) =>
        `${i + 1}. ${r.name}`
      ).join('\n')}\n\nJust tell me the number or name!`;
    }

    // DQ Score questions
    if (lowerQ.includes('score') || lowerQ.includes('quality')) {
      const profiled = catalogData.filter(d => d.dqScore !== null);
      const excellent = profiled.filter(d => d.dqScore >= 90).length;
      const good = profiled.filter(d => d.dqScore >= 70 && d.dqScore < 90).length;
      const needsAttention = profiled.filter(d => d.dqScore < 70).length;

      return `**DQ Score Summary:**\n\n✓ **${excellent} assets** with Excellent quality (90%+)\n⚠ **${good} assets** with Good quality (70-89%)\n❌ **${needsAttention} assets** Need Attention (<70%)\n\n**Assets needing attention:**\n${catalogData.filter(d => d.dqScore !== null && d.dqScore < 70).map(d => `• ${d.name}: ${d.dqScore}%`).join('\n')}\n\nWant to see recommended rules for these?`;
    }

    // Assets needing attention
    if (lowerQ.includes('attention') || lowerQ.includes('problem') || lowerQ.includes('issue')) {
      const needsAttention = catalogData.filter(d => d.dqScore !== null && d.dqScore < 70);

      if (needsAttention.length === 0) {
        return `Great news! No assets currently need attention. All profiled assets have DQ scores of 70% or higher.`;
      }

      return `**${needsAttention.length} Assets Need Attention:**\n\n${needsAttention.map(d =>
        `• **${d.name}** (${d.dqScore}%)\n  Owner: ${d.owner}`
      ).join('\n\n')}\n\nI recommend setting up the pending rules to improve these scores. Want to activate them?`;
    }

    // Profiled vs unprofiled
    if (lowerQ.includes('profil') || lowerQ.includes('not profil')) {
      const profiled = catalogData.filter(d => d.hasProfiling);
      const unprofiled = catalogData.filter(d => !d.hasProfiling);

      return `**Profiling Status:**\n\n✓ **${profiled.length} assets profiled:** ${profiled.map(d => d.name).join(', ')}\n\n⚪ **${unprofiled.length} assets not profiled:** ${unprofiled.map(d => d.name).join(', ')}\n\nOnly Salesforce DMOs are currently profiled. Want to set up profiling for other assets?`;
    }

    // Prioritization questions
    if (lowerQ.includes('priorit') || lowerQ.includes('first') || lowerQ.includes('start')) {
      const highPriority = recommendations.filter(r => r.priority === 'High');

      return `**Recommended Priority:**\n\nStart with **High Priority** rules first:\n\n${highPriority.map((r, i) =>
        `${i + 1}. **${r.name}**\n   Why: ${r.description}\n   Impact: ${r.impactedRecords.toLocaleString()} records`
      ).join('\n\n')}\n\nThese will give you the biggest quality improvement. Ready to activate them?`;
    }

    // DMO-specific questions
    const dmoMatch = catalogData.find(d => lowerQ.includes(d.name.toLowerCase()));
    if (dmoMatch) {
      if (dmoMatch.hasProfiling) {
        return `**${dmoMatch.name}** Details:\n\n• DQ Score: ${dmoMatch.dqScore}%\n• Source: ${dmoMatch.source}\n• Owner: ${dmoMatch.owner}\n• Profiling: ✓ Available\n\nWant to see specific column details or recommended rules for this asset?`;
      } else {
        return `**${dmoMatch.name}** Details:\n\n• Source: ${dmoMatch.source}\n• Owner: ${dmoMatch.owner}\n• Profiling: Not available yet\n\nThis asset hasn't been profiled. Would you like to schedule profiling for it?`;
      }
    }

    // General help
    if (lowerQ.includes('help') || lowerQ.length < 10) {
      return `I can help you with:\n\n• **"Show pending rules"** - See all recommendations\n• **"Activate [rule name]"** - Set up a specific rule\n• **"What needs attention?"** - See low-scoring assets\n• **"Show DQ scores"** - Summary of data quality\n• **"Which rules should I prioritize?"** - Get recommendations\n• **"Tell me about [asset name]"** - Asset details\n\nWhat would you like to explore?`;
    }

    // Default
    return `I understand you're asking about data quality. Here's what I can help with:\n\n• View **${recommendations.length} pending recommendations**\n• Check **DQ scores** across ${catalogData.filter(d => d.hasProfiling).length} profiled assets\n• Activate rules with one click\n• Prioritize which rules to set up first\n\nCould you rephrase your question or pick one from above?`;
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="dq-assistant">
      <div className="assistant-header">
        <div className="assistant-header-content">
          <div className="assistant-icon">🤖</div>
          <div>
            <h3>Data Cloud Assistant</h3>
            <p className="assistant-subtitle">Powered by Claire</p>
          </div>
        </div>
        <button className="close-assistant-btn" onClick={onClose}>✕</button>
      </div>

      <div className="assistant-messages">
        {messages.map(msg => (
          <div key={msg.id} className={`message ${msg.type}`}>
            <div className="message-avatar">
              {msg.type === 'assistant' ? '🤖' : '👤'}
            </div>
            <div className="message-content">
              {msg.content.split('\n').map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>
          </div>
        ))}
        {isProcessing && (
          <div className="message assistant">
            <div className="message-avatar">🤖</div>
            <div className="message-content typing">
              <span></span><span></span><span></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="assistant-input-area">
        <input
          type="text"
          className="assistant-input"
          placeholder="Ask about DQ rules, scores, or recommendations..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button
          className="send-btn"
          onClick={handleSendMessage}
          disabled={!inputValue.trim()}
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default DQAssistant;
