/* ========================================
   DECISION TREE
   Interactive tool recommendation engine
   ======================================== */

   class DecisionTree {
    constructor(containerId) {
      this.container = document.getElementById(containerId);
      if (!this.container) {
        console.error(`Container ${containerId} not found`);
        return;
      }
      
      this.currentStep = 0;
      this.answers = {};
      this.recommendation = null;
      
      this.steps = [
        {
          id: 'team-size',
          question: 'How many developers will use Claude?',
          type: 'single',
          options: [
            { value: 'solo', label: 'Just me', icon: '👤' },
            { value: 'small', label: '2-5 developers', icon: '👥' },
            { value: 'medium', label: '6-20 developers', icon: '👥👥' },
            { value: 'large', label: '20+ developers', icon: '🏢' }
          ]
        },
        {
          id: 'use-case',
          question: 'What\'s your primary use case?',
          type: 'single',
          options: [
            { value: 'learning', label: 'Learning & exploration', icon: '📚' },
            { value: 'prototyping', label: 'Quick prototyping', icon: '⚡' },
            { value: 'production', label: 'Production applications', icon: '🚀' },
            { value: 'automation', label: 'Workflow automation', icon: '🤖' }
          ]
        },
        {
          id: 'integration',
          question: 'Do you need to integrate Claude into existing systems?',
          type: 'single',
          options: [
            { value: 'no', label: 'No, standalone use only', icon: '❌' },
            { value: 'maybe', label: 'Maybe in the future', icon: '🤔' },
            { value: 'yes', label: 'Yes, API integration needed', icon: '✅' }
          ]
        },
        {
          id: 'volume',
          question: 'Expected usage volume?',
          type: 'single',
          options: [
            { value: 'low', label: 'Light (<100 msgs/day)', icon: '🌱' },
            { value: 'medium', label: 'Moderate (100-500 msgs/day)', icon: '🌿' },
            { value: 'high', label: 'Heavy (500+ msgs/day)', icon: '🌳' }
          ]
        },
        {
          id: 'budget',
          question: 'What\'s your budget priority?',
          type: 'single',
          options: [
            { value: 'free', label: 'Free tier only', icon: '💚' },
            { value: 'cost-effective', label: 'Cost-effective paid', icon: '💰' },
            { value: 'performance', label: 'Performance over cost', icon: '⚡' },
            { value: 'flexible', label: 'Flexible budget', icon: '💎' }
          ]
        }
      ];
      
      this.init();
    }
    
    init() {
      this.render();
    }
    
    render() {
      if (this.currentStep >= this.steps.length) {
        this.showRecommendation();
        return;
      }
      
      const step = this.steps[this.currentStep];
      
      this.container.innerHTML = `
        <div class="decision-tree">
          <div class="decision-progress">
            <div class="progress-header">
              <span class="progress-label">Question ${this.currentStep + 1} of ${this.steps.length}</span>
              <span class="progress-count">${Math.round((this.currentStep / this.steps.length) * 100)}% Complete</span>
            </div>
            <div class="progress-bar-container">
              <div class="progress-bar" style="width: ${(this.currentStep / this.steps.length) * 100}%"></div>
            </div>
          </div>
          
          <div class="decision-step">
            <h3 class="decision-question">${step.question}</h3>
            
            <div class="decision-options">
              ${step.options.map(option => `
                <button 
                  class="decision-option ${this.answers[step.id] === option.value ? 'selected' : ''}"
                  data-value="${option.value}"
                  aria-label="${option.label}">
                  <div class="option-icon">${option.icon}</div>
                  <div class="option-label">${option.label}</div>
                </button>
              `).join('')}
            </div>
          </div>
          
          <div class="decision-actions">
            ${this.currentStep > 0 ? `
              <button class="btn btn-secondary" id="decision-back">
                ← Back
              </button>
            ` : '<div></div>'}
            
            <button 
              class="btn btn-primary" 
              id="decision-next"
              ${!this.answers[step.id] ? 'disabled' : ''}>
              ${this.currentStep === this.steps.length - 1 ? 'Get Recommendation' : 'Next →'}
            </button>
          </div>
        </div>
      `;
      
      this.bindEvents();
    }
    
    bindEvents() {
      // Option selection
      const options = this.container.querySelectorAll('.decision-option');
      options.forEach(option => {
        option.addEventListener('click', () => {
          const value = option.dataset.value;
          const step = this.steps[this.currentStep];
          
          // Update answer
          this.answers[step.id] = value;
          
          // Update UI
          options.forEach(opt => opt.classList.remove('selected'));
          option.classList.add('selected');
          
          // Enable next button
          const nextBtn = document.getElementById('decision-next');
          if (nextBtn) nextBtn.disabled = false;
        });
      });
      
      // Navigation
      const backBtn = document.getElementById('decision-back');
      if (backBtn) {
        backBtn.addEventListener('click', () => {
          this.currentStep--;
          this.render();
        });
      }
      
      const nextBtn = document.getElementById('decision-next');
      if (nextBtn) {
        nextBtn.addEventListener('click', () => {
          this.currentStep++;
          this.render();
        });
      }
    }
    
    calculateRecommendation() {
      const { teamSize, useCase, integration, volume, budget } = this.answers;
      
      // Scoring system for each tool
      const scores = {
        pro: 0,
        code: 0,
        api: 0
      };
      
      // Team size scoring
      if (teamSize === 'solo' || teamSize === 'small') {
        scores.pro += 3;
        scores.code += 2;
      } else if (teamSize === 'medium') {
        scores.pro += 2;
        scores.code += 2;
        scores.api += 2;
      } else {
        scores.api += 3;
        scores.pro += 1;
      }
      
      // Use case scoring
      if (useCase === 'learning' || useCase === 'prototyping') {
        scores.pro += 3;
        scores.code += 2;
      } else if (useCase === 'production') {
        scores.api += 3;
        scores.code += 2;
      } else if (useCase === 'automation') {
        scores.api += 3;
        scores.code += 1;
      }
      
      // Integration scoring
      if (integration === 'no') {
        scores.pro += 3;
      } else if (integration === 'maybe') {
        scores.pro += 2;
        scores.code += 2;
      } else {
        scores.api += 3;
      }
      
      // Volume scoring
      if (volume === 'low') {
        scores.pro += 2;
        scores.code += 2;
      } else if (volume === 'medium') {
        scores.pro += 1;
        scores.code += 2;
        scores.api += 2;
      } else {
        scores.api += 3;
      }
      
      // Budget scoring
      if (budget === 'free') {
        scores.pro += 3;
      } else if (budget === 'cost-effective') {
        scores.pro += 2;
        scores.code += 1;
      } else if (budget === 'performance') {
        scores.api += 2;
        scores.pro += 2;
      } else {
        scores.api += 1;
        scores.pro += 1;
        scores.code += 1;
      }
      
      // Find highest score
      const sortedTools = Object.entries(scores)
        .sort((a, b) => b[1] - a[1]);
      
      const recommended = sortedTools[0][0];
      
      return {
        recommended,
        scores,
        allTools: sortedTools
      };
    }
    
    showRecommendation() {
      const result = this.calculateRecommendation();
      this.recommendation = result;
      
      const toolInfo = {
        pro: {
          name: 'Claude Pro',
          icon: '💎',
          price: '$20/month',
          description: 'Best for individual developers who want the most capable model with a simple interface.',
          pros: [
            'Highest intelligence (Opus 4.1)',
            'Clean, distraction-free UI',
            'No setup required',
            'Includes Artifacts feature',
            'Free tier available'
          ],
          cons: [
            'No API access',
            'Rate limits on free tier',
            'Not suitable for automation'
          ],
          bestFor: 'Learning, prototyping, interactive development'
        },
        code: {
          name: 'Claude Code',
          icon: '⌨️',
          price: 'Pay-per-use',
          description: 'Best for developers who want agentic coding directly in their terminal.',
          pros: [
            'Terminal-based workflow',
            'Agentic code generation',
            'Multi-file editing',
            'Direct integration with dev tools',
            'No subscription needed'
          ],
          cons: [
            'Command-line only',
            'Requires API setup',
            'Pay-per-use pricing'
          ],
          bestFor: 'Solo developers, CLI enthusiasts, quick coding tasks'
        },
        api: {
          name: 'Claude API',
          icon: '🔌',
          price: 'Pay-per-use',
          description: 'Best for production applications, team integrations, and high-volume usage.',
          pros: [
            'Full programmatic control',
            'Scalable for any volume',
            'Multiple models available',
            'Integration flexibility',
            'Cost-effective at scale'
          ],
          cons: [
            'Requires development work',
            'Need to handle authentication',
            'More complex setup'
          ],
          bestFor: 'Production apps, automation, team workflows'
        }
      };
      
      const recommended = toolInfo[result.recommended];
      const alternatives = result.allTools.slice(1).map(([tool]) => toolInfo[tool]);
      
      this.container.innerHTML = `
        <div class="decision-result">
          <div class="result-header-main">
            <div class="result-icon-large">${recommended.icon}</div>
            <h2 class="result-title-main">We Recommend: ${recommended.name}</h2>
            <p class="result-subtitle">${recommended.description}</p>
          </div>
          
          <div class="result-card recommended-card">
            <div class="card-badge">RECOMMENDED FOR YOU</div>
            
            <div class="tool-details">
              <div class="tool-header">
                <span class="tool-icon">${recommended.icon}</span>
                <div>
                  <h3 class="tool-name">${recommended.name}</h3>
                  <p class="tool-price">${recommended.price}</p>
                </div>
              </div>
              
              <div class="tool-pros-cons">
                <div class="pros-section">
                  <h4>✅ Strengths</h4>
                  <ul>
                    ${recommended.pros.map(pro => `<li>${pro}</li>`).join('')}
                  </ul>
                </div>
                
                <div class="cons-section">
                  <h4>⚠️ Considerations</h4>
                  <ul>
                    ${recommended.cons.map(con => `<li>${con}</li>`).join('')}
                  </ul>
                </div>
              </div>
              
              <div class="best-for">
                <strong>Best for:</strong> ${recommended.bestFor}
              </div>
            </div>
          </div>
          
          <div class="alternatives-section">
            <h3>Other Options to Consider</h3>
            
            <div class="alternatives-grid">
              ${alternatives.map(alt => `
                <div class="alternative-card">
                  <div class="alt-header">
                    <span class="alt-icon">${alt.icon}</span>
                    <div>
                      <h4>${alt.name}</h4>
                      <p class="alt-price">${alt.price}</p>
                    </div>
                  </div>
                  <p class="alt-description">${alt.description}</p>
                  <p class="alt-best-for"><strong>Best for:</strong> ${alt.bestFor}</p>
                </div>
              `).join('')}
            </div>
          </div>
          
          <div class="result-actions">
            <button class="btn btn-primary" id="start-over">
              🔄 Start Over
            </button>
            <button class="btn btn-secondary" id="view-comparison">
              📊 View Full Comparison
            </button>
          </div>
        </div>
      `;
      
      // Bind result actions
      const startOverBtn = document.getElementById('start-over');
      if (startOverBtn) {
        startOverBtn.addEventListener('click', () => {
          this.reset();
        });
      }
      
      const viewComparisonBtn = document.getElementById('view-comparison');
      if (viewComparisonBtn) {
        viewComparisonBtn.addEventListener('click', () => {
          const comparisonSection = document.getElementById('tool-comparison');
          if (comparisonSection) {
            comparisonSection.scrollIntoView({ behavior: 'smooth' });
          }
        });
      }
    }
    
    reset() {
      this.currentStep = 0;
      this.answers = {};
      this.recommendation = null;
      this.render();
    }
    
    getRecommendation(answers) {
      this.answers = answers;
      return this.calculateRecommendation();
    }
  }
  
  // Auto-initialize
  document.addEventListener('DOMContentLoaded', () => {
    const decisionTreeContainer = document.getElementById('decision-tree-container');
    if (decisionTreeContainer) {
      window.decisionTree = new DecisionTree('decision-tree-container');
    }
  });