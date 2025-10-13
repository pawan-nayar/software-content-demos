/* ========================================
   BUSINESS CASE GENERATOR
   Elevator pitch & template generator
   ======================================== */

   class BusinessCaseGenerator {
    constructor(containerId) {
      this.container = document.getElementById(containerId);
      if (!this.container) {
        console.error(`Container ${containerId} not found`);
        return;
      }
      
      this.state = {
        industry: '',
        teamSize: '',
        useCase: '',
        timeSavings: '',
        customNotes: ''
      };
      
      this.templates = {
        elevator: {
          tech: "We're proposing Claude AI to accelerate our development workflow. {teamSize} can save approximately {timeSavings} on coding tasks, code reviews, and documentation. For ${cost}/month, we'll gain a senior-level AI assistant that works 24/7, reducing time-to-market and improving code quality.",
          
          finance: "We're evaluating Claude AI for {teamSize} to streamline {useCase}. Conservative estimates show {timeSavings} time savings, translating to ${savings} in annual productivity gains. The investment of ${cost}/month delivers measurable ROI through faster delivery and reduced error rates.",
          
          healthcare: "Claude AI can help {teamSize} with {useCase} while maintaining compliance standards. Expected {timeSavings} efficiency gain will reduce development cycles and improve documentation quality. At ${cost}/month, this is a cost-effective way to accelerate our digital initiatives.",
          
          retail: "We want to adopt Claude AI to help {teamSize} build and maintain our e-commerce systems faster. {timeSavings} productivity increase means faster feature delivery and better customer experiences. The ${cost}/month investment pays for itself through accelerated development.",
          
          education: "Claude AI can support {teamSize} in {useCase}, from curriculum development to administrative tools. We expect {timeSavings} time savings on routine tasks, letting our team focus on student outcomes. At ${cost}/month, it's an affordable productivity multiplier.",
          
          default: "We're proposing Claude AI to enhance {teamSize}'s productivity on {useCase}. Based on industry benchmarks, we expect {timeSavings} time savings on development tasks. The ${cost}/month investment will accelerate delivery, improve quality, and reduce repetitive work."
        }
      };
      
      this.objections = [
        {
          objection: "Why not just use free ChatGPT?",
          response: "Claude offers superior code quality, longer context windows (200K tokens vs 8K-32K), and privacy guarantees. For professional development, the $20/month is justified by fewer errors, better architecture suggestions, and no data training on your code."
        },
        {
          objection: "Can't developers just Google solutions?",
          response: "Claude provides contextual, project-specific guidance that's immediately applicable. Unlike generic search results, it understands your codebase, tech stack, and requirements, dramatically reducing time spent adapting solutions."
        },
        {
          objection: "What about security and data privacy?",
          response: "Claude Pro doesn't train on your data. For API usage, Anthropic offers enterprise agreements with strict data handling. We can implement additional safeguards like not sharing sensitive business logic or credentials."
        },
        {
          objection: "Will this replace developers?",
          response: "No—Claude augments developers, not replaces them. It handles boilerplate, documentation, and routine tasks, freeing developers for architecture, business logic, and creative problem-solving. Teams using AI assistants ship faster, not smaller."
        },
        {
          objection: "The cost seems high for the whole team.",
          response: "At $20/developer/month, if each person saves just 2-3 hours monthly, the ROI is positive. Most teams report 20-30% productivity gains. Compare this to recruiting costs ($50K+) or offshore development ($30-50/hour)."
        },
        {
          objection: "What if the AI gives wrong answers?",
          response: "Developers review all AI-generated code, just like code reviews. Claude is a tool that accelerates first drafts and provides suggestions—final implementation judgment stays with the team. The time saved on correct suggestions far outweighs review time."
        }
      ];
      
      this.init();
    }
    
    init() {
      this.render();
    }
    
    render() {
      this.container.innerHTML = `
        <div class="business-case-section">
          <div class="section-header">
            <h2>Build Your Business Case</h2>
            <p>Generate a customized pitch for management</p>
          </div>
          
          <!-- Input Form -->
          <div class="business-form card">
            <div class="form-grid">
              <div class="form-group">
                <label class="form-label">Industry</label>
                <select class="input-select" id="industry-select">
                  <option value="">Select industry...</option>
                  <option value="tech">Technology/Software</option>
                  <option value="finance">Finance/Banking</option>
                  <option value="healthcare">Healthcare</option>
                  <option value="retail">Retail/E-commerce</option>
                  <option value="education">Education</option>
                  <option value="default">Other</option>
                </select>
              </div>
              
              <div class="form-group">
                <label class="form-label">Team Size</label>
                <select class="input-select" id="team-size-select">
                  <option value="">Select team size...</option>
                  <option value="1-3 developers">1-3 developers</option>
                  <option value="4-10 developers">4-10 developers</option>
                  <option value="11-25 developers">11-25 developers</option>
                  <option value="25+ developers">25+ developers</option>
                </select>
              </div>
              
              <div class="form-group">
                <label class="form-label">Primary Use Case</label>
                <select class="input-select" id="use-case-select">
                  <option value="">Select use case...</option>
                  <option value="feature development">Feature development</option>
                  <option value="code reviews and refactoring">Code reviews and refactoring</option>
                  <option value="documentation">Documentation</option>
                  <option value="debugging and testing">Debugging and testing</option>
                  <option value="learning new technologies">Learning new technologies</option>
                </select>
              </div>
              
              <div class="form-group">
                <label class="form-label">Expected Time Savings</label>
                <select class="input-select" id="time-savings-select">
                  <option value="">Select estimate...</option>
                  <option value="15-20% productivity increase">15-20% productivity increase</option>
                  <option value="20-30% productivity increase">20-30% productivity increase</option>
                  <option value="30-40% productivity increase">30-40% productivity increase</option>
                </select>
              </div>
            </div>
            
            <div class="form-group">
              <label class="form-label">Additional Notes (Optional)</label>
              <textarea 
                class="input-field" 
                id="custom-notes" 
                rows="3" 
                placeholder="Any specific context or goals for your organization..."></textarea>
            </div>
            
            <button class="btn btn-primary btn-lg" id="generate-pitch">
              ✨ Generate Business Case
            </button>
          </div>
          
          <!-- Generated Output -->
          <div id="generated-output" style="display: none;">
            <div class="output-section card">
              <div class="output-header">
                <h3>📢 Your Elevator Pitch</h3>
                <button class="btn btn-sm btn-secondary" id="copy-pitch">📋 Copy</button>
              </div>
              <div class="elevator-pitch" id="elevator-pitch-text">
                <!-- Generated pitch will appear here -->
              </div>
            </div>
            
            <div class="output-section card">
              <div class="output-header">
                <h3>📊 One-Page Business Case</h3>
                <button class="btn btn-sm btn-primary" id="download-template">📥 Download Template</button>
              </div>
              <div class="business-template" id="business-template">
                <!-- Template will appear here -->
              </div>
            </div>
            
            <div class="output-section card">
              <h3>💬 Handling Objections</h3>
              <div class="objections-list">
                ${this.objections.map(obj => `
                  <details class="objection-item">
                    <summary class="objection-question">
                      <span class="objection-icon">❓</span>
                      "${obj.objection}"
                    </summary>
                    <div class="objection-answer">
                      <span class="answer-icon">💡</span>
                      <p>${obj.response}</p>
                    </div>
                  </details>
                `).join('')}
              </div>
            </div>
            
            <div class="output-section card">
              <h3>🎯 Success Metrics to Track</h3>
              <div class="metrics-grid">
                <div class="metric-box">
                  <div class="metric-icon">⏱️</div>
                  <div class="metric-name">Time to Completion</div>
                  <div class="metric-description">Track task completion time before and after Claude adoption</div>
                </div>
                <div class="metric-box">
                  <div class="metric-icon">🐛</div>
                  <div class="metric-name">Bug Reduction</div>
                  <div class="metric-description">Monitor defect rates and code quality metrics</div>
                </div>
                <div class="metric-box">
                  <div class="metric-icon">😊</div>
                  <div class="metric-name">Developer Satisfaction</div>
                  <div class="metric-description">Survey team happiness and engagement levels</div>
                </div>
                <div class="metric-box">
                  <div class="metric-icon">🚀</div>
                  <div class="metric-name">Velocity Increase</div>
                  <div class="metric-description">Measure sprint velocity and feature delivery speed</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
      
      this.addStyles();
      this.bindEvents();
    }
    
    addStyles() {
      const style = document.createElement('style');
      style.textContent = `
        .business-form {
          margin-bottom: var(--space-8);
        }
        
        .form-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: var(--space-6);
          margin-bottom: var(--space-6);
        }
        
        .form-group {
          display: flex;
          flex-direction: column;
          gap: var(--space-2);
        }
        
        .form-label {
          font-weight: 600;
          color: var(--color-text);
        }
        
        .btn-lg {
          width: 100%;
          padding: var(--space-4) var(--space-8);
          font-size: var(--text-lg);
        }
        
        .output-section {
          margin-bottom: var(--space-8);
        }
        
        .output-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--space-6);
        }
        
        .output-header h3 {
          margin: 0;
        }
        
        .elevator-pitch {
          background-color: var(--color-bg-alt);
          padding: var(--space-6);
          border-radius: var(--radius-md);
          border-left: 4px solid var(--color-primary);
          font-size: var(--text-lg);
          line-height: 1.8;
        }
        
        .business-template {
          background-color: var(--color-bg-alt);
          padding: var(--space-8);
          border-radius: var(--radius-md);
          border: 2px solid var(--color-border);
        }
        
        .template-section {
          margin-bottom: var(--space-6);
          padding-bottom: var(--space-6);
          border-bottom: 1px solid var(--color-border);
        }
        
        .template-section:last-child {
          border-bottom: none;
          margin-bottom: 0;
          padding-bottom: 0;
        }
        
        .template-section h4 {
          color: var(--color-primary);
          margin-bottom: var(--space-3);
        }
        
        .template-list {
          list-style: none;
          padding-left: 0;
        }
        
        .template-list li {
          padding: var(--space-2) 0;
          padding-left: var(--space-4);
          position: relative;
        }
        
        .template-list li::before {
          content: '▸';
          position: absolute;
          left: 0;
          color: var(--color-primary);
          font-weight: 700;
        }
        
        .objections-list {
          display: flex;
          flex-direction: column;
          gap: var(--space-4);
        }
        
        .objection-item {
          background-color: var(--color-bg-alt);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          overflow: hidden;
        }
        
        .objection-question {
          padding: var(--space-4) var(--space-6);
          cursor: pointer;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: var(--space-3);
          transition: background-color var(--transition-fast);
          user-select: none;
        }
        
        .objection-question:hover {
          background-color: var(--color-hover);
        }
        
        .objection-icon {
          font-size: var(--text-xl);
        }
        
        .objection-answer {
          padding: var(--space-4) var(--space-6);
          background-color: var(--color-bg);
          border-top: 1px solid var(--color-border);
          display: flex;
          gap: var(--space-3);
          align-items: flex-start;
        }
        
        .answer-icon {
          font-size: var(--text-xl);
          flex-shrink: 0;
        }
        
        .objection-answer p {
          margin: 0;
          color: var(--color-text-muted);
        }
        
        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: var(--space-6);
        }
        
        .metric-box {
          background-color: var(--color-bg-alt);
          padding: var(--space-6);
          border-radius: var(--radius-md);
          text-align: center;
        }
        
        .metric-icon {
          font-size: var(--text-4xl);
          margin-bottom: var(--space-3);
        }
        
        .metric-name {
          font-weight: 700;
          font-size: var(--text-lg);
          margin-bottom: var(--space-2);
          color: var(--color-text);
        }
        
        .metric-description {
          font-size: var(--text-sm);
          color: var(--color-text-muted);
        }
        
        @media (max-width: 768px) {
          .form-grid {
            grid-template-columns: 1fr;
          }
          
          .metrics-grid {
            grid-template-columns: 1fr;
          }
          
          .output-header {
            flex-direction: column;
            align-items: flex-start;
            gap: var(--space-3);
          }
        }
      `;
      
      this.container.appendChild(style);
    }
    
    bindEvents() {
      // Form inputs
      const industrySelect = document.getElementById('industry-select');
      const teamSizeSelect = document.getElementById('team-size-select');
      const useCaseSelect = document.getElementById('use-case-select');
      const timeSavingsSelect = document.getElementById('time-savings-select');
      const customNotes = document.getElementById('custom-notes');
      
      if (industrySelect) {
        industrySelect.addEventListener('change', (e) => {
          this.state.industry = e.target.value;
        });
      }
      
      if (teamSizeSelect) {
        teamSizeSelect.addEventListener('change', (e) => {
          this.state.teamSize = e.target.value;
        });
      }
      
      if (useCaseSelect) {
        useCaseSelect.addEventListener('change', (e) => {
          this.state.useCase = e.target.value;
        });
      }
      
      if (timeSavingsSelect) {
        timeSavingsSelect.addEventListener('change', (e) => {
          this.state.timeSavings = e.target.value;
        });
      }
      
      if (customNotes) {
        customNotes.addEventListener('input', (e) => {
          this.state.customNotes = e.target.value;
        });
      }
      
      // Generate button
      const generateBtn = document.getElementById('generate-pitch');
      if (generateBtn) {
        generateBtn.addEventListener('click', () => {
          if (this.validateInputs()) {
            this.generateBusinessCase();
          } else {
            alert('Please fill in all required fields');
          }
        });
      }
    }
    
    validateInputs() {
      const { industry, teamSize, useCase, timeSavings } = this.state;
      return industry && teamSize && useCase && timeSavings;
    }
    
    generateBusinessCase() {
      // Generate elevator pitch
      const pitch = this.generateElevatorPitch();
      
      // Generate template
      const template = this.generateTemplate();
      
      // Show output section
      const outputSection = document.getElementById('generated-output');
      if (outputSection) {
        outputSection.style.display = 'block';
        
        // Populate pitch
        const pitchElement = document.getElementById('elevator-pitch-text');
        if (pitchElement) {
          pitchElement.textContent = pitch;
        }
        
        // Populate template
        const templateElement = document.getElementById('business-template');
        if (templateElement) {
          templateElement.innerHTML = template;
        }
        
        // Scroll to output
        outputSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        
        // Bind output actions
        this.bindOutputActions();
      }
    }
    
    generateElevatorPitch() {
      const { industry, teamSize, useCase, timeSavings } = this.state;
      
      // Get template for industry
      const template = this.templates.elevator[industry] || this.templates.elevator.default;
      
      // Calculate estimated costs and savings
      const teamSizeNum = parseInt(teamSize.split('-')[0]) || 5;
      const monthlyCost = teamSizeNum * 20;
      const avgHourlyRate = 75;
      const hoursPerMonth = 160;
      const savingsPercent = parseInt(timeSavings) / 100 || 0.25;
      const hoursSaved = hoursPerMonth * savingsPercent * teamSizeNum;
      const annualSavings = Math.round(hoursSaved * avgHourlyRate * 12);
      
      // Replace placeholders
      let pitch = template
        .replace('{teamSize}', teamSize)
        .replace('{useCase}', useCase)
        .replace('{timeSavings}', timeSavings)
        .replace('${cost}', monthlyCost.toString())
        .replace('${savings}', annualSavings.toLocaleString());
      
      return pitch;
    }
    
    generateTemplate() {
      const { teamSize, useCase, timeSavings, customNotes } = this.state;
      
      const teamSizeNum = parseInt(teamSize.split('-')[0]) || 5;
      const monthlyCost = teamSizeNum * 20;
      const annualCost = monthlyCost * 12;
      
      return `
        <div class="template-section">
          <h4>📋 Executive Summary</h4>
          <p>This proposal recommends adopting Claude AI for our ${teamSize} development team to improve productivity in ${useCase}. Expected ROI is positive within the first quarter, with ${timeSavings} time savings on development tasks.</p>
          ${customNotes ? `<p><strong>Context:</strong> ${customNotes}</p>` : ''}
        </div>
        
        <div class="template-section">
          <h4>💰 Investment Required</h4>
          <ul class="template-list">
            <li>Monthly: ${monthlyCost.toLocaleString()} ($20 per developer)</li>
            <li>Annual: ${annualCost.toLocaleString()}</li>
            <li>No additional infrastructure or IT resources required</li>
            <li>Free tier available for trial period</li>
          </ul>
        </div>
        
        <div class="template-section">
          <h4>📈 Expected Benefits</h4>
          <ul class="template-list">
            <li>${timeSavings} productivity increase on ${useCase}</li>
            <li>Faster time-to-market for new features</li>
            <li>Improved code quality and reduced bugs</li>
            <li>Enhanced developer satisfaction and retention</li>
            <li>Knowledge sharing and onboarding acceleration</li>
          </ul>
        </div>
        
        <div class="template-section">
          <h4>⚙️ Implementation Plan</h4>
          <ul class="template-list">
            <li><strong>Week 1-2:</strong> Pilot with 2-3 developers, establish best practices</li>
            <li><strong>Week 3-4:</strong> Team training and gradual rollout</li>
            <li><strong>Month 2:</strong> Full team adoption, track metrics</li>
            <li><strong>Month 3:</strong> Review ROI and adjust usage patterns</li>
          </ul>
        </div>
        
        <div class="template-section">
          <h4>🔒 Risk Mitigation</h4>
          <ul class="template-list">
            <li>Data privacy: Claude Pro doesn't train on our data</li>
            <li>Security: Code review process ensures AI suggestions are vetted</li>
            <li>Dependency: Claude augments developers, doesn't replace expertise</li>
            <li>Cost control: Can scale up/down based on team size</li>
          </ul>
        </div>
        
        <div class="template-section">
          <h4>✅ Recommendation</h4>
          <p>Approve Claude AI adoption for ${teamSize} starting with a 3-month pilot. Success metrics will be tracked monthly, with a go/no-go decision after quarter one based on measurable productivity gains.</p>
        </div>
      `;
    }
    
    bindOutputActions() {
      // Copy pitch button
      const copyBtn = document.getElementById('copy-pitch');
      if (copyBtn) {
        copyBtn.addEventListener('click', () => {
          const pitchText = document.getElementById('elevator-pitch-text');
          if (pitchText) {
            navigator.clipboard.writeText(pitchText.textContent).then(() => {
              copyBtn.textContent = '✓ Copied!';
              setTimeout(() => {
                copyBtn.textContent = '📋 Copy';
              }, 2000);
            });
          }
        });
      }
      
      // Download template button
      const downloadBtn = document.getElementById('download-template');
      if (downloadBtn) {
        downloadBtn.addEventListener('click', () => {
          this.downloadTemplate();
        });
      }
    }
    
    downloadTemplate() {
      const pitch = this.generateElevatorPitch();
      const templateHTML = document.getElementById('business-template');
      
      if (!templateHTML) return;
      
      // Convert to plain text
      const templateText = this.htmlToText(templateHTML);
      
      const fullDocument = `
  CLAUDE AI BUSINESS CASE
  Generated: ${new Date().toLocaleDateString()}
  
  ========================================
  ELEVATOR PITCH
  ========================================
  
  ${pitch}
  
  ========================================
  DETAILED BUSINESS CASE
  ========================================
  
  ${templateText}
  
  ========================================
  OBJECTION HANDLING
  ========================================
  
  ${this.objections.map(obj => `
  Q: ${obj.objection}
  A: ${obj.response}
  `).join('\n')}
  
  ========================================
  SUCCESS METRICS
  ========================================
  
  1. Time to Completion
     Track task completion time before and after Claude adoption
  
  2. Bug Reduction
     Monitor defect rates and code quality metrics
  
  3. Developer Satisfaction
     Survey team happiness and engagement levels
  
  4. Velocity Increase
     Measure sprint velocity and feature delivery speed
  
  ========================================
  NEXT STEPS
  ========================================
  
  1. Review this business case with stakeholders
  2. Schedule pilot program with 2-3 developers
  3. Define success metrics and tracking method
  4. Set 3-month review date
  5. Plan team training and onboarding
  
  For more information: https://claude.ai
      `.trim();
      
      // Create download
      const blob = new Blob([fullDocument], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `claude-business-case-${new Date().toISOString().split('T')[0]}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
    
    htmlToText(element) {
      const clone = element.cloneNode(true);
      
      // Remove styles
      const styles = clone.querySelectorAll('style');
      styles.forEach(s => s.remove());
      
      // Convert to text
      let text = clone.textContent || clone.innerText;
      
      // Clean up whitespace
      text = text.replace(/\n\s*\n/g, '\n\n');
      text = text.trim();
      
      return text;
    }
  }
  
  // Auto-initialize
  document.addEventListener('DOMContentLoaded', () => {
    const businessCaseContainer = document.getElementById('business-case-container');
    if (businessCaseContainer) {
      window.businessCaseGenerator = new BusinessCaseGenerator('business-case-container');
    }
  });