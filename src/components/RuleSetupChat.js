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
      const ruleName = rule.name.toLowerCase();
      if (ruleName.includes('email')) {
        return `**Email Format — Before & After:**\n\n❌ john.doe@gmailcom → Flagged (missing dot before com)\n❌ sarah@@company.com → Flagged (double @ symbol)\n❌ mike.smith@domain → Flagged (no .com/.org extension)\n✅ jane.doe@company.com → Passes\n\nInvalid emails are flagged in the DQ dashboard for your team to review and correct.\n\nWant to know which fields are checked, or how to fix in bulk?`;
      } else if (ruleName.includes('null') || ruleName.includes('missing') || ruleName.includes('required')) {
        return `**Null Value Check — Before & After:**\n\n❌ Lead #1234: Email = (empty) → Flagged\n❌ Contact #5678: FirstName = (empty) → Flagged\n❌ Account #9012: BillingCountry = (empty) → Flagged\n✅ Lead #3456: All required fields filled → Passes\n\nFlagged records show in your DQ dashboard with the specific missing fields highlighted.\n\nWant to know which fields are treated as required?`;
      } else if (ruleName.includes('country')) {
        return `**Country Code — Before & After:**\n\n❌ "United States" → ✅ US\n❌ "USA" → ✅ US\n❌ "America" → ✅ US\n❌ "United Kingdom" → ✅ GB\n❌ "Deutschland" → ✅ DE\n❌ "France" → ✅ FR\n\nAll country name variations are standardized to 2-letter ISO codes. This makes filtering and reporting by country consistent across Lead, Contact, and Account.\n\nWant to see the full mapping list or learn about state/province standardization too?`;
      } else if (ruleName.includes('phone')) {
        return `**Phone Format — Before & After:**\n\n❌ 555.123.4567 → ✅ +1-555-123-4567\n❌ (555) 123-4567 → ✅ +1-555-123-4567\n❌ 5551234567 → ✅ +1-555-123-4567\n✅ +1-555-123-4567 → Already correct\n\nAll formats standardized to E.164 international format, making it easier to run campaigns and integrate with dialers.\n\nWant to know which fields are checked?`;
      } else if (ruleName.includes('website') || ruleName.includes('url')) {
        return `**Website URL — Before & After:**\n\n❌ www.company.com → ✅ https://www.company.com\n❌ company.com → ✅ https://www.company.com\n❌ http://company.com/ → ✅ https://www.company.com\n✅ https://www.company.com → Already correct\n\nAll URLs are normalized to https:// with consistent trailing slash rules, so links in emails and reports always work.\n\nWant to activate this rule now?`;
      } else if (ruleName.includes('industry')) {
        return `**Industry Classification — Before & After:**\n\n❌ "Tech" → ✅ Technology\n❌ "Finance / Banking" → ✅ Financial Services\n❌ "Pharma" → ✅ Healthcare & Life Sciences\n❌ "IT Services" → ✅ Technology\n✅ "Retail" → Already standard\n\nNon-standard values are mapped to your org's approved industry taxonomy, making segmentation and reporting accurate.\n\nWant to activate this rule?`;
      } else if (ruleName.includes('duplicate')) {
        return `**Duplicate Detection — Examples:**\n\nRecord A: John Smith, john@acme.com, Acme Corp\nRecord B: J. Smith, john@acme.com, Acme Corp\n→ Flagged as likely duplicate (same email)\n\nRecord C: Jane Doe, 415-555-1234, Globex Inc\nRecord D: Jane M. Doe, 415-555-1234, Globex\n→ Flagged as likely duplicate (same phone + similar name)\n\nFlagged pairs appear in the DQ dashboard for you to review and merge or dismiss.\n\nWant to activate this rule?`;
      } else {
        return `**${rule.name} — Before & After:**\n\nThis rule scans your **${rule.affectedObjects.join(', ')}** records and flags any values that don't meet the quality standard.\n\n✅ Records that pass appear with a green DQ indicator\n❌ Records that fail are listed in the DQ dashboard with the specific issue highlighted\n\nAfter each run, your overall DQ score updates to reflect the improvement.\n\nWant to activate this rule now?`;
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
