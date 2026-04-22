import React, { useState, useRef, useEffect } from 'react';
import './RuleSetupChat.css';

// Comprehensive DQ Rules Catalog
const allDQRules = [
  {
    id: 'rule-phone-validation',
    name: 'Phone Number Format Validation',
    description: 'Standardize phone numbers to consistent format',
    category: 'Consistency',
    affectedObjects: ['Lead', 'Contact', 'Account'],
    estimatedImpact: 2340
  },
  {
    id: 'rule-duplicate-detection',
    name: 'Duplicate Record Detection',
    description: 'Identify and flag potential duplicate records',
    category: 'Uniqueness',
    affectedObjects: ['Lead', 'Contact'],
    estimatedImpact: 456
  },
  {
    id: 'rule-date-validation',
    name: 'Date Range Validation',
    description: 'Ensure dates are within valid ranges',
    category: 'Validity',
    affectedObjects: ['Campaign', 'Opportunity'],
    estimatedImpact: 178
  },
  {
    id: 'rule-postal-code',
    name: 'Postal Code Format Validation',
    description: 'Validate postal codes match country format',
    category: 'Validity',
    affectedObjects: ['Lead', 'Contact', 'Account'],
    estimatedImpact: 891
  },
  {
    id: 'rule-website-format',
    name: 'Website URL Standardization',
    description: 'Standardize website URLs to consistent format',
    category: 'Consistency',
    affectedObjects: ['Account', 'Lead'],
    estimatedImpact: 634
  },
  {
    id: 'rule-state-code',
    name: 'State/Province Code Standardization',
    description: 'Standardize state codes to 2-letter abbreviations',
    category: 'Consistency',
    affectedObjects: ['Lead', 'Contact', 'Account'],
    estimatedImpact: 1120
  },
  {
    id: 'rule-industry-standardization',
    name: 'Industry Classification Standardization',
    description: 'Map industry values to standard taxonomy',
    category: 'Consistency',
    affectedObjects: ['Account', 'Lead'],
    estimatedImpact: 723
  },
  {
    id: 'rule-revenue-range',
    name: 'Revenue Value Validation',
    description: 'Validate revenue values are within expected ranges',
    category: 'Validity',
    affectedObjects: ['Account', 'Opportunity'],
    estimatedImpact: 267
  },
  {
    id: 'rule-lead-source',
    name: 'Lead Source Standardization',
    description: 'Standardize lead source values to predefined list',
    category: 'Consistency',
    affectedObjects: ['Lead', 'Campaign'],
    estimatedImpact: 1456
  },
  {
    id: 'rule-name-formatting',
    name: 'Name Format Standardization',
    description: 'Standardize name capitalization and formatting',
    category: 'Consistency',
    affectedObjects: ['Lead', 'Contact'],
    estimatedImpact: 589
  }
];

function RuleSetupChat({ rule, onClose, onConfirmSetup }) {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Initial greeting message
    const initialMessages = [
      {
        id: 1,
        type: 'assistant',
        content: `Setting up **${rule.name}**:`
      },
      {
        id: 2,
        type: 'assistant',
        content: `**Objects:** ${rule.affectedObjects.join(', ')}\n**Records:** ${rule.impactedRecords.toLocaleString()}\n**Schedule:** Daily at 2:00 AM\n**Notification:** Email summary after each run`
      },
      {
        id: 3,
        type: 'assistant',
        content: `Ask me:\n• "Show examples"\n• "Which fields?"\n• "What if issues found?"\n• "Other rules?"\n\nSay **"Confirm"** to activate!`
      }
    ];
    setMessages(initialMessages);
  }, [rule]);

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

    // Check for confirmation phrases
    const lowerInput = userInput.toLowerCase();

    // Exclude questions - if asking about other rules, schedule, fields, etc.
    const isQuestion = lowerInput.includes('?') ||
                       lowerInput.includes('other') ||
                       lowerInput.includes('more') ||
                       lowerInput.includes('what') ||
                       lowerInput.includes('which') ||
                       lowerInput.includes('how') ||
                       lowerInput.includes('when') ||
                       lowerInput.includes('can i') ||
                       lowerInput.includes('show me');

    const confirmationPhrases = [
      'yes, confirm',
      'yes confirm',
      'confirm',
      'yes, set up',
      'yes set up',
      'set it up',
      'activate it',
      'enable it',
      'go ahead',
      'proceed',
      "let's do it",
      'do it'
    ];

    const isConfirmation = !isQuestion && confirmationPhrases.some(phrase =>
      lowerInput.trim() === phrase ||
      (lowerInput.startsWith(phrase) && lowerInput.length < 20)
    );

    // Simulate AI response
    setTimeout(() => {
      if (isConfirmation) {
        const assistantMessage = {
          id: Date.now() + 1,
          type: 'assistant',
          content: `✓ **${rule.name}** activated!\n\n✓ Daily at 2:00 AM\n✓ Email notifications on\n✓ DQ tracking enabled\n\nFirst run tonight. You'll get a summary email.`
        };
        setMessages(prev => [...prev, assistantMessage]);
        setIsProcessing(false);

        // Trigger the actual setup after a brief moment
        setTimeout(() => {
          onConfirmSetup(rule);
        }, 2000);
      } else {
        const response = generateResponse(userInput, rule);
        const assistantMessage = {
          id: Date.now() + 1,
          type: 'assistant',
          content: response
        };
        setMessages(prev => [...prev, assistantMessage]);
        setIsProcessing(false);
      }
    }, 800);
  };

  const generateResponse = (question, rule) => {
    const lowerQ = question.toLowerCase().trim();

    // Check for "how many" or counting questions
    if (lowerQ.match(/how many (dmo|object)/)) {
      return `**${rule.affectedObjects.length} DMOs** will be impacted:\n• ${rule.affectedObjects.join('\n• ')}\n\nTotal records affected: **${rule.impactedRecords.toLocaleString()}**`;
    }

    // Check if asking about records across all rules vs this rule
    if (lowerQ.includes('all rules') || lowerQ.match(/across (all|every) rule/)) {
      return `The **${rule.impactedRecords.toLocaleString()} records** number is specific to this rule only.\n\nIf you set up multiple rules, each will have its own impact count. Some records might be flagged by multiple rules.\n\nWould you like to see the estimated impact of other available rules?`;
    }

    // Check if asking about total/cumulative impact
    if ((lowerQ.includes('total') || lowerQ.includes('cumulative')) && lowerQ.includes('record')) {
      return `This shows **${rule.impactedRecords.toLocaleString()} records** for the **${rule.name}** rule specifically.\n\nThe total across all recommended rules would be higher, but some records may be counted in multiple rules.\n\nWant to see a breakdown of other rules' impact?`;
    }

    // Generic DMO/object impact questions
    if (lowerQ.includes('dmo') || lowerQ.includes('object') ||
        (lowerQ.includes('impact') && !lowerQ.includes('all')) ||
        lowerQ.includes('affect')) {
      return `This rule will check:\n• **${rule.affectedObjects.join('**\n• **')}**\n\nAffecting approximately **${rule.impactedRecords.toLocaleString()} records** total.`;
    }

    // Check for questions about other/more rules - more flexible semantic matching
    const isAskingAboutRules =
      // Direct mentions of rules
      (lowerQ.includes('rule') && (
        lowerQ.includes('other') ||
        lowerQ.includes('more') ||
        lowerQ.includes('available') ||
        lowerQ.includes('else') ||
        lowerQ.includes('set up') ||
        lowerQ.includes('configure') ||
        lowerQ.includes('what') ||
        lowerQ.includes('show') ||
        lowerQ.includes('list') ||
        lowerQ.includes('see') ||
        lowerQ.includes('tell me')
      )) ||
      // Semantic variations
      lowerQ.match(/what (can|could|should) (i|we) (set|configure|add|enable|use)/) ||
      lowerQ.match(/show me (the |all )?rules/) ||
      lowerQ.match(/(what|which) rules/) ||
      lowerQ.includes('other options') ||
      lowerQ.includes('what else');

    if (isAskingAboutRules) {

      // Group rules by category
      const categories = {};
      allDQRules.forEach(r => {
        if (!categories[r.category]) {
          categories[r.category] = [];
        }
        categories[r.category].push(r);
      });

      let response = `**Available Rules:**\n\n`;

      Object.keys(categories).forEach(category => {
        response += `**${category}:**\n`;
        categories[category].forEach(r => {
          response += `• ${r.name} (${r.affectedObjects.join(', ')})\n`;
        });
        response += `\n`;
      });

      response += `**Want me to:**\n• Recommend which rules to prioritize?\n• Explain any specific rule in detail?\n• Suggest a sequence for setting them up?`;

      return response;
    }

    // Check for specific rule inquiries
    const specificRule = allDQRules.find(r =>
      lowerQ.includes(r.name.toLowerCase()) ||
      lowerQ.includes(r.id.replace('rule-', '').replace(/-/g, ' '))
    );

    if (specificRule) {
      return `**${specificRule.name}**\n${specificRule.description}\n\nAffects: ${specificRule.affectedObjects.join(', ')}\nImpact: ~${specificRule.estimatedImpact.toLocaleString()} records`;
    }

    // Check for category-based questions
    if (lowerQ.includes('consistency') || lowerQ.includes('standardization')) {
      const consistencyRules = allDQRules.filter(r => r.category === 'Consistency');
      let response = `**Consistency Rules:**\n`;
      consistencyRules.forEach(r => {
        response += `• ${r.name}\n`;
      });
      return response;
    }

    if (lowerQ.includes('validity') || lowerQ.includes('validation')) {
      const validityRules = allDQRules.filter(r => r.category === 'Validity');
      let response = `**Validation Rules:**\n`;
      validityRules.forEach(r => {
        response += `• ${r.name}\n`;
      });
      return response;
    }

    if (lowerQ.includes('duplicate')) {
      const uniquenessRules = allDQRules.filter(r => r.category === 'Uniqueness');
      let response = `**Duplicate Detection:**\n`;
      uniquenessRules.forEach(r => {
        response += `• ${r.name}\n`;
      });
      return response;
    }

    // Sample/example questions - more semantic matching
    const isAskingForExamples =
      lowerQ.includes('sample') ||
      lowerQ.includes('example') ||
      lowerQ.includes('improvement') ||
      lowerQ.match(/show (me )?(some |the )?example/) ||
      lowerQ.match(/what (does|will) (this|it) (do|fix|improve|change)/) ||
      lowerQ.includes('before and after') ||
      lowerQ.includes('see results') ||
      lowerQ.includes('demonstration');

    if (isAskingForExamples) {
      if (rule.id === 'top-1') {
        return `**Examples:**\n\n❌ john.doe@gmailcom → ✓ Flagged (missing dot)\n❌ sarah@@company.com → ✓ Flagged (double @)\n❌ mike.smith@domain → ✓ Flagged (no extension)\n\nInvalid emails will be flagged for your team to correct.\n\n**Would you like to see:**\n• Which specific email fields are checked?\n• How to fix these issues in bulk?`;
      } else if (rule.id === 'top-2') {
        return `**Examples:**\n\n**Lead #1234:** Missing Email, Company → Flagged\n**Contact #5678:** Missing First Name → Flagged\n\nRecords with empty required fields will be marked incomplete.\n\n**Want to know:**\n• Which fields are considered "required"?\n• How to prevent null values going forward?`;
      } else if (rule.id === 'top-3') {
        return `**Examples:**\n\n"United States", "USA", "America" → **US**\n"United Kingdom", "UK" → **GB**\n"Deutschland", "Germany" → **DE**\n\nAll variations standardized to ISO codes.\n\n**Interested in:**\n• See the full list of country mappings?\n• Learn about state/province standardization too?`;
      }
    }

    // Field/column questions - semantic variations
    const isAskingAboutFields =
      lowerQ.includes('field') ||
      lowerQ.includes('column') ||
      lowerQ.match(/what (does|will) (this|it) check/) ||
      lowerQ.match(/which (data|fields|columns|attributes)/) ||
      lowerQ.includes('validate') ||
      lowerQ.includes('where');

    if (isAskingAboutFields) {
      if (rule.id === 'top-1') {
        return `**Fields checked:**\n• Lead.Email\n• Contact.Email\n• Account.Email__c\n\nValidates: @ symbol, domain, extension\n\n**Follow-up:** Would you like to add other email fields to this rule?`;
      } else if (rule.id === 'top-2') {
        return `**Required Fields:**\n\n**Lead:** Email, Company, LastName\n**Contact:** Email, FirstName, LastName\n**Campaign:** Name, StartDate, Status\n\n**Question for you:** Should we add other fields like Phone or Address as required?`;
      } else if (rule.id === 'top-3') {
        return `**Fields checked:**\n• Lead.Country\n• Contact.MailingCountry\n• Account.BillingCountry\n• Account.ShippingCountry\n\n**Curious:** Do you also want to standardize State/Province codes?`;
      }
    }

    // Issue handling questions - semantic variations
    const isAskingAboutIssues =
      lowerQ.includes('issue') ||
      lowerQ.includes('fail') ||
      lowerQ.includes('problem') ||
      lowerQ.includes('error') ||
      lowerQ.match(/what (happen|occur)s? (if|when)/) ||
      lowerQ.match(/(find|found|detect) (issue|problem|error)/) ||
      lowerQ.includes('go wrong') ||
      lowerQ.includes('handle');

    if (isAskingAboutIssues) {
      return `**When issues are found:**\n\n1. Records are flagged with DQ issue marker\n2. You receive email summary with count\n3. Issues appear in DQ dashboard with filters\n4. You can create workflows to alert record owners\n\nThe rule only identifies issues - you control the fixes.\n\n**Want to discuss:**\n• Setting up automated workflows?\n• Creating tasks for data stewards?\n• Preventing bad data from entering in the first place?`;
    }

    // Schedule questions - semantic variations
    const isAskingAboutSchedule =
      lowerQ.includes('schedule') ||
      lowerQ.includes('timing') ||
      lowerQ.includes('frequency') ||
      lowerQ.match(/when (does|will) (this|it) run/) ||
      lowerQ.match(/how often/) ||
      lowerQ.match(/(can|could) (i|we) change (the )?(time|schedule)/) ||
      lowerQ.includes('daily') ||
      lowerQ.includes('weekly');

    if (isAskingAboutSchedule) {
      return `**Schedule Options:**\n\n✓ Daily at 2:00 AM (default)\n• Daily at 3:00 AM\n• Daily at 6:00 AM\n• Weekly on Mondays\n• After each data sync\n\n**Quick question:** When does your team usually review data issues - morning or afternoon? I can adjust the schedule so results are ready when you need them.`;
    }

    if (lowerQ.includes('score')) {
      return `**DQ Score Updates:**\n\nScores recalculate after each run:\n• Object-level: % records passing\n• Field-level: % values passing\n• Overall: Weighted average\n\nUpdates within 5 minutes. Historical trends tracked.\n\n**Curious:** What's your target DQ score? I can help prioritize rules to reach it faster.`;
    }

    // Check if question is ambiguous or needs clarification
    if (lowerQ.includes('impact') && lowerQ.length < 20) {
      return `I can help clarify the impact. Are you asking about:\n\n1. **How many DMOs** are affected?\n2. **How many records** will be checked?\n3. **What changes** will be made?\n4. **Impact across all rules** vs just this one?\n\nLet me know which you'd like to know more about!`;
    }

    if (lowerQ.includes('record') && !lowerQ.includes('how') && !lowerQ.includes('what')) {
      return `Are you asking:\n\n• How many records this rule will check?\n• Whether these records are unique to this rule?\n• If records can be fixed automatically?\n\nClarify and I'll give you the details!`;
    }

    // Default response - suggest clarification
    return `I want to make sure I answer your question correctly.\n\nFor **${rule.name}**, I can explain:\n• Specific DMOs and record counts\n• Example improvements\n• Which fields are checked\n• What happens when issues are found\n• Other available rules\n\nCould you rephrase or pick one from above?`;
  };

  const handleConfirm = () => {
    onConfirmSetup(rule);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="rule-setup-chat">
      <div className="chat-header">
        <div className="chat-header-content">
          <h3>Set Up Rule: {rule.name}</h3>
          <span className={`priority-badge ${rule.priority.toLowerCase()}`}>
            {rule.priority} Priority
          </span>
        </div>
        <button className="close-chat-btn" onClick={onClose}>✕</button>
      </div>

      <div className="chat-messages">
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

      <div className="chat-input-area">
        <input
          type="text"
          className="chat-input"
          placeholder="Ask a question about this rule..."
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

      <div className="chat-actions">
        <button className="btn-cancel" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}

export default RuleSetupChat;
