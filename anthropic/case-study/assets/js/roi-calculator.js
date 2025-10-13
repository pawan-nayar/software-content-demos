/* ========================================
   ROI CALCULATOR
   Financial impact calculator with real-time updates
   ======================================== */

   class ROICalculator {
    constructor(containerId) {
      this.container = document.getElementById(containerId);
      if (!this.container) {
        console.error(`Container ${containerId} not found`);
        return;
      }
      
      // Default values
      this.state = {
        teamSize: 5,
        avgHourlyRate: 75,
        hoursPerWeek: 40,
        timeSavedPercent: 25,
        tool: 'pro',
        apiUsage: 1000000,
        period: 'monthly'
      };
      
      // Pricing data
      this.pricing = {
        pro: {
          monthly: 20,
          yearly: 200
        },
        code: {
          costPer1MTokens: 15
        },
        api: {
          input: 3,
          output: 15
        }
      };
      
      this.init();
    }
    
    init() {
      this.render();
      this.calculate();
    }
    
    render() {
      this.container.innerHTML = `
        <div class="roi-calculator">
          <div class="calculator-header">
            <h2 class="calculator-title">ROI Calculator</h2>
            <p class="calculator-subtitle">Calculate potential time and cost savings with Claude</p>
          </div>
          
          <div class="calculator-layout">
            <div class="calculator-inputs">
              <div class="input-group">
                <label class="input-label">
                  Team Size
                  <span class="input-tooltip" title="Number of developers using Claude">?</span>
                </label>
                <div class="input-wrapper">
                  <input 
                    type="range" 
                    class="input-range" 
                    id="team-size" 
                    min="1" 
                    max="50" 
                    value="${this.state.teamSize}"
                    style="background: linear-gradient(to right, var(--color-primary) 0%, var(--color-primary) ${(this.state.teamSize - 1) / 49 * 100}%, var(--color-border) ${(this.state.teamSize - 1) / 49 * 100}%, var(--color-border) 100%)">
                </div>
                <span class="range-value" id="team-size-value">${this.state.teamSize} developer${this.state.teamSize > 1 ? 's' : ''}</span>
              </div>
              
              <div class="input-group">
                <label class="input-label">
                  Average Hourly Rate
                  <span class="input-tooltip" title="Blended hourly rate for your team">?</span>
                </label>
                <div class="input-wrapper">
                  <span class="input-prefix">$</span>
                  <input 
                    type="number" 
                    class="input-field has-prefix" 
                    id="hourly-rate" 
                    min="20" 
                    max="300" 
                    step="5"
                    value="${this.state.avgHourlyRate}">
                </div>
              </div>
              
              <div class="input-group">
                <label class="input-label">
                  Hours Worked Per Week
                  <span class="input-tooltip" title="Average coding hours per developer">?</span>
                </label>
                <div class="input-wrapper">
                  <input 
                    type="number" 
                    class="input-field" 
                    id="hours-per-week" 
                    min="10" 
                    max="60" 
                    step="5"
                    value="${this.state.hoursPerWeek}">
                  <span class="input-suffix">hrs/week</span>
                </div>
              </div>
              
              <div class="input-group">
                <label class="input-label">
                  Estimated Time Savings
                  <span class="input-tooltip" title="Percentage of time saved using Claude">?</span>
                </label>
                <div class="input-wrapper">
                  <input 
                    type="range" 
                    class="input-range" 
                    id="time-saved" 
                    min="5" 
                    max="50" 
                    value="${this.state.timeSavedPercent}"
                    style="background: linear-gradient(to right, var(--color-primary) 0%, var(--color-primary) ${(this.state.timeSavedPercent - 5) / 45 * 100}%, var(--color-border) ${(this.state.timeSavedPercent - 5) / 45 * 100}%, var(--color-border) 100%)">
                </div>
                <span class="range-value" id="time-saved-value">${this.state.timeSavedPercent}%</span>
              </div>
              
              <div class="input-group">
                <label class="input-label">Claude Tool</label>
                <select class="input-select" id="tool-select">
                  <option value="pro" ${this.state.tool === 'pro' ? 'selected' : ''}>Claude Pro ($20/month)</option>
                  <option value="code" ${this.state.tool === 'code' ? 'selected' : ''}>Claude Code (Pay-per-use)</option>
                  <option value="api" ${this.state.tool === 'api' ? 'selected' : ''}>Claude API (Pay-per-use)</option>
                </select>
              </div>
              
              ${this.state.tool !== 'pro' ? `
                <div class="input-group">
                  <label class="input-label">
                    Monthly Token Usage
                    <span class="input-tooltip" title="Estimated tokens per month">?</span>
                  </label>
                  <div class="input-wrapper">
                    <input 
                      type="number" 
                      class="input-field" 
                      id="api-usage" 
                      min="100000" 
                      max="10000000" 
                      step="100000"
                      value="${this.state.apiUsage}">
                    <span class="input-suffix">tokens</span>
                  </div>
                </div>
              ` : ''}
              
              <div class="input-group">
                <label class="input-label">Calculation Period</label>
                <select class="input-select" id="period-select">
                  <option value="monthly" ${this.state.period === 'monthly' ? 'selected' : ''}>Monthly</option>
                  <option value="yearly" ${this.state.period === 'yearly' ? 'selected' : ''}>Yearly</option>
                </select>
              </div>
            </div>
            
            <div class="calculator-results" id="calculator-results">
            </div>
          </div>
          
          <div class="calculator-actions">
            <button class="btn btn-secondary" id="reset-calculator">Reset to Defaults</button>
            <button class="btn btn-primary" id="export-results">📥 Export Results</button>
          </div>
        </div>
      `;
      
      this.bindEvents();
    }
    
    bindEvents() {
      const teamSize = document.getElementById('team-size');
      if (teamSize) {
        teamSize.addEventListener('input', (e) => {
          this.state.teamSize = parseInt(e.target.value);
          document.getElementById('team-size-value').textContent = 
            `${this.state.teamSize} developer${this.state.teamSize > 1 ? 's' : ''}`;
          e.target.style.background = `linear-gradient(to right, var(--color-primary) 0%, var(--color-primary) ${(this.state.teamSize - 1) / 49 * 100}%, var(--color-border) ${(this.state.teamSize - 1) / 49 * 100}%, var(--color-border) 100%)`;
          this.calculate();
        });
      }
      
      const hourlyRate = document.getElementById('hourly-rate');
      if (hourlyRate) {
        hourlyRate.addEventListener('input', (e) => {
          this.state.avgHourlyRate = parseFloat(e.target.value) || 0;
          this.calculate();
        });
      }
      
      const hoursPerWeek = document.getElementById('hours-per-week');
      if (hoursPerWeek) {
        hoursPerWeek.addEventListener('input', (e) => {
          this.state.hoursPerWeek = parseFloat(e.target.value) || 0;
          this.calculate();
        });
      }
      
      const timeSaved = document.getElementById('time-saved');
      if (timeSaved) {
        timeSaved.addEventListener('input', (e) => {
          this.state.timeSavedPercent = parseInt(e.target.value);
          document.getElementById('time-saved-value').textContent = `${this.state.timeSavedPercent}%`;
          e.target.style.background = `linear-gradient(to right, var(--color-primary) 0%, var(--color-primary) ${(this.state.timeSavedPercent - 5) / 45 * 100}%, var(--color-border) ${(this.state.timeSavedPercent - 5) / 45 * 100}%, var(--color-border) 100%)`;
          this.calculate();
        });
      }
      
      const toolSelect = document.getElementById('tool-select');
      if (toolSelect) {
        toolSelect.addEventListener('change', (e) => {
          this.state.tool = e.target.value;
          this.render();
          this.calculate();
        });
      }
      
      const apiUsage = document.getElementById('api-usage');
      if (apiUsage) {
        apiUsage.addEventListener('input', (e) => {
          this.state.apiUsage = parseInt(e.target.value) || 0;
          this.calculate();
        });
      }
      
      const periodSelect = document.getElementById('period-select');
      if (periodSelect) {
        periodSelect.addEventListener('change', (e) => {
          this.state.period = e.target.value;
          this.calculate();
        });
      }
      
      const resetBtn = document.getElementById('reset-calculator');
      if (resetBtn) {
        resetBtn.addEventListener('click', () => {
          this.state = {
            teamSize: 5,
            avgHourlyRate: 75,
            hoursPerWeek: 40,
            timeSavedPercent: 25,
            tool: 'pro',
            apiUsage: 1000000,
            period: 'monthly'
          };
          this.render();
          this.calculate();
        });
      }
      
      const exportBtn = document.getElementById('export-results');
      if (exportBtn) {
        exportBtn.addEventListener('click', () => {
          this.exportResults();
        });
      }
    }
    
    calculate() {
      const { teamSize, avgHourlyRate, hoursPerWeek, timeSavedPercent, tool, apiUsage, period } = this.state;
      
      const multiplier = period === 'yearly' ? 12 : 1;
      const hoursPerMonth = (hoursPerWeek * 52) / 12;
      const hoursSavedPerDev = hoursPerMonth * (timeSavedPercent / 100);
      const totalHoursSaved = hoursSavedPerDev * teamSize * multiplier;
      const valueSaved = totalHoursSaved * avgHourlyRate;
      
      let claudeCost = 0;
      if (tool === 'pro') {
        claudeCost = period === 'yearly' 
          ? this.pricing.pro.yearly * teamSize 
          : this.pricing.pro.monthly * teamSize * multiplier;
      } else if (tool === 'code') {
        const tokensPerMonth = apiUsage;
        const costPerMonth = (tokensPerMonth / 1000000) * this.pricing.code.costPer1MTokens;
        claudeCost = costPerMonth * teamSize * multiplier;
      } else if (tool === 'api') {
        const inputTokens = apiUsage * 0.6;
        const outputTokens = apiUsage * 0.4;
        const costPerMonth = 
          (inputTokens / 1000000) * this.pricing.api.input +
          (outputTokens / 1000000) * this.pricing.api.output;
        claudeCost = costPerMonth * multiplier;
      }
      
      const netSavings = valueSaved - claudeCost;
      const roi = ((netSavings / claudeCost) * 100).toFixed(0);
      const monthlySavings = valueSaved / multiplier;
      const monthlyCost = claudeCost / multiplier;
      const monthlyNet = monthlySavings - monthlyCost;
      const paybackMonths = monthlyCost / monthlyNet;
      
      this.renderResults({
        totalHoursSaved: totalHoursSaved.toFixed(0),
        valueSaved: valueSaved.toFixed(0),
        claudeCost: claudeCost.toFixed(0),
        netSavings: netSavings.toFixed(0),
        roi,
        paybackMonths: paybackMonths.toFixed(1),
        period,
        hoursSavedPerDev: (hoursSavedPerDev * multiplier).toFixed(0)
      });
    }
    
    renderResults(results) {
      const resultsContainer = document.getElementById('calculator-results');
      if (!resultsContainer) return;
      
      const periodLabel = results.period === 'yearly' ? 'Annual' : 'Monthly';
      
      resultsContainer.innerHTML = `
        <div class="results-header">
          <h3 class="results-title">${periodLabel} Impact</h3>
          <p class="results-period">Based on your team configuration</p>
        </div>
        
        <div class="results-main">
          <div class="result-metric">
            <span class="result-value">$${parseInt(results.netSavings).toLocaleString()}</span>
            <span class="result-label">Net Savings</span>
          </div>
          
          <div class="result-metric">
            <span class="result-value">${results.roi}%</span>
            <span class="result-label">ROI</span>
          </div>
        </div>
        
        <div class="results-breakdown">
          <h4 class="breakdown-title">Detailed Breakdown</h4>
          <ul class="breakdown-list">
            <li class="breakdown-item">
              <span class="breakdown-item-label">Time Saved</span>
              <span class="breakdown-item-value">${parseInt(results.totalHoursSaved).toLocaleString()} hrs</span>
            </li>
            <li class="breakdown-item">
              <span class="breakdown-item-label">Value of Time</span>
              <span class="breakdown-item-value">$${parseInt(results.valueSaved).toLocaleString()}</span>
            </li>
            <li class="breakdown-item">
              <span class="breakdown-item-label">Claude Cost</span>
              <span class="breakdown-item-value">-$${parseInt(results.claudeCost).toLocaleString()}</span>
            </li>
            <li class="breakdown-item">
              <span class="breakdown-item-label">Hours Saved/Dev</span>
              <span class="breakdown-item-value">${results.hoursSavedPerDev} hrs</span>
            </li>
          </ul>
        </div>
        
        <div class="calculator-chart">
          <h4 class="chart-title">Investment Payback</h4>
          <div class="payback-display">
            <span class="payback-value">${results.paybackMonths}</span>
            <span class="payback-label">months to payback</span>
          </div>
        </div>
      `;
    }
    
    exportResults() {
      const results = this.getCalculationResults();
      
      const reportText = `
  Claude ROI Calculator Results
  Generated: ${new Date().toLocaleDateString()}
  
  === CONFIGURATION ===
  Team Size: ${this.state.teamSize} developers
  Hourly Rate: $${this.state.avgHourlyRate}/hour
  Hours/Week: ${this.state.hoursPerWeek}
  Time Saved: ${this.state.timeSavedPercent}%
  Tool: ${this.state.tool.toUpperCase()}
  Period: ${this.state.period}
  
  === RESULTS ===
  Net Savings: $${results.netSavings}
  ROI: ${results.roi}%
  Time Saved: ${results.totalHoursSaved} hours
  Value of Time: $${results.valueSaved}
  Claude Cost: $${results.claudeCost}
  Payback Period: ${results.paybackMonths} months
      `.trim();
      
      const blob = new Blob([reportText], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `claude-roi-report-${new Date().toISOString().split('T')[0]}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
    
    getCalculationResults() {
      const { teamSize, avgHourlyRate, hoursPerWeek, timeSavedPercent, tool, apiUsage, period } = this.state;
      
      const multiplier = period === 'yearly' ? 12 : 1;
      const hoursPerMonth = (hoursPerWeek * 52) / 12;
      const hoursSavedPerDev = hoursPerMonth * (timeSavedPercent / 100);
      const totalHoursSaved = hoursSavedPerDev * teamSize * multiplier;
      const valueSaved = totalHoursSaved * avgHourlyRate;
      
      let claudeCost = 0;
      if (tool === 'pro') {
        claudeCost = period === 'yearly' 
          ? this.pricing.pro.yearly * teamSize 
          : this.pricing.pro.monthly * teamSize * multiplier;
      } else if (tool === 'code') {
        const costPerMonth = (apiUsage / 1000000) * this.pricing.code.costPer1MTokens;
        claudeCost = costPerMonth * teamSize * multiplier;
      } else if (tool === 'api') {
        const inputTokens = apiUsage * 0.6;
        const outputTokens = apiUsage * 0.4;
        const costPerMonth = 
          (inputTokens / 1000000) * this.pricing.api.input +
          (outputTokens / 1000000) * this.pricing.api.output;
        claudeCost = costPerMonth * multiplier;
      }
      
      const netSavings = valueSaved - claudeCost;
      const roi = ((netSavings / claudeCost) * 100).toFixed(0);
      const monthlySavings = valueSaved / multiplier;
      const monthlyCost = claudeCost / multiplier;
      const monthlyNet = monthlySavings - monthlyCost;
      const paybackMonths = monthlyCost / monthlyNet;
      
      return {
        totalHoursSaved: totalHoursSaved.toFixed(0),
        valueSaved: valueSaved.toFixed(0),
        claudeCost: claudeCost.toFixed(0),
        netSavings: netSavings.toFixed(0),
        roi,
        paybackMonths: paybackMonths.toFixed(1)
      };
    }
  }
  
  // Auto-initialize
  document.addEventListener('DOMContentLoaded', () => {
    const roiContainer = document.getElementById('roi-calculator-container');
    if (roiContainer) {
      window.roiCalculator = new ROICalculator('roi-calculator-container');
    }
  });