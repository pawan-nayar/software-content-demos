/* ========================================
   ANALYTICS
   Event tracking and user behavior analytics
   ======================================== */

   class Analytics {
    constructor(options = {}) {
      this.enabled = options.enabled !== false;
      this.debug = options.debug || false;
      this.sessionId = this.generateSessionId();
      this.events = [];
      this.sessionStart = Date.now();
      
      // Configuration
      this.config = {
        trackPageViews: true,
        trackClicks: true,
        trackFormSubmissions: true,
        trackScrollDepth: true,
        trackTimeOnPage: true,
        batchSize: 10, // Send events in batches
        batchInterval: 30000, // 30 seconds
        ...options
      };
      
      this.init();
    }
    
    init() {
      if (!this.enabled) {
        this.log('Analytics disabled');
        return;
      }
      
      this.log('Analytics initialized', { sessionId: this.sessionId });
      
      // Track page view
      if (this.config.trackPageViews) {
        this.trackPageView();
      }
      
      // Auto-track interactions
      if (this.config.trackClicks) {
        this.setupClickTracking();
      }
      
      if (this.config.trackFormSubmissions) {
        this.setupFormTracking();
      }
      
      if (this.config.trackScrollDepth) {
        this.setupScrollTracking();
      }
      
      if (this.config.trackTimeOnPage) {
        this.setupTimeTracking();
      }
      
      // Setup batch sending
      this.setupBatchSending();
      
      // Send remaining events on page unload
      window.addEventListener('beforeunload', () => {
        this.flush();
      });
    }
    
    generateSessionId() {
      return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    
    track(eventName, properties = {}) {
      if (!this.enabled) return;
      
      const event = {
        name: eventName,
        properties: {
          ...properties,
          sessionId: this.sessionId,
          timestamp: new Date().toISOString(),
          url: window.location.href,
          referrer: document.referrer,
          userAgent: navigator.userAgent,
          screenSize: `${window.screen.width}x${window.screen.height}`,
          viewportSize: `${window.innerWidth}x${window.innerHeight}`
        }
      };
      
      this.events.push(event);
      this.log('Event tracked:', event);
      
      // Auto-flush if batch size reached
      if (this.events.length >= this.config.batchSize) {
        this.flush();
      }
    }
    
    trackPageView() {
      this.track('page_view', {
        title: document.title,
        path: window.location.pathname
      });
    }
    
    setupClickTracking() {
      document.addEventListener('click', (e) => {
        const target = e.target.closest('a, button, [data-track]');
        if (!target) return;
        
        const trackData = {
          element: target.tagName.toLowerCase(),
          text: target.textContent.trim().substring(0, 100),
          id: target.id || undefined,
          class: target.className || undefined
        };
        
        // Special tracking for specific elements
        if (target.hasAttribute('data-track')) {
          trackData.trackLabel = target.getAttribute('data-track');
        }
        
        if (target.tagName === 'A') {
          trackData.href = target.href;
          trackData.external = !target.href.startsWith(window.location.origin);
        }
        
        if (target.tagName === 'BUTTON') {
          trackData.type = target.type;
        }
        
        this.track('click', trackData);
      });
    }
    
    setupFormTracking() {
      document.addEventListener('submit', (e) => {
        const form = e.target;
        if (form.tagName !== 'FORM') return;
        
        this.track('form_submit', {
          formId: form.id || undefined,
          formAction: form.action || undefined,
          formMethod: form.method || undefined
        });
      });
    }
    
    setupScrollTracking() {
      let maxScroll = 0;
      const milestones = [25, 50, 75, 100];
      const tracked = new Set();
      
      const trackScroll = () => {
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollPercent = Math.round((scrollTop / (documentHeight - windowHeight)) * 100);
        
        if (scrollPercent > maxScroll) {
          maxScroll = scrollPercent;
          
          // Track milestones
          milestones.forEach(milestone => {
            if (scrollPercent >= milestone && !tracked.has(milestone)) {
              tracked.add(milestone);
              this.track('scroll_depth', {
                depth: milestone,
                maxDepth: maxScroll
              });
            }
          });
        }
      };
      
      let scrollTimeout;
      window.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(trackScroll, 150);
      });
    }
    
    setupTimeTracking() {
      // Track time spent on page
      const trackEngagement = () => {
        const timeSpent = Math.round((Date.now() - this.sessionStart) / 1000);
        this.track('time_on_page', {
          seconds: timeSpent,
          engaged: document.hasFocus()
        });
      };
      
      // Track every 30 seconds
      setInterval(trackEngagement, 30000);
      
      // Track on visibility change
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
          trackEngagement();
        }
      });
    }
    
    setupBatchSending() {
      if (!this.config.batchInterval) return;
      
      setInterval(() => {
        if (this.events.length > 0) {
          this.flush();
        }
      }, this.config.batchInterval);
    }
    
    flush() {
      if (this.events.length === 0) return;
      
      const eventsToSend = [...this.events];
      this.events = [];
      
      this.log('Flushing events:', eventsToSend.length);
      
      // In a real implementation, send to analytics backend
      // For now, we'll just log or store locally
      this.sendEvents(eventsToSend);
    }
    
    sendEvents(events) {
      // Store in localStorage for demonstration
      try {
        const stored = JSON.parse(localStorage.getItem('analytics_events') || '[]');
        stored.push(...events);
        
        // Keep only last 100 events
        const trimmed = stored.slice(-100);
        localStorage.setItem('analytics_events', JSON.stringify(trimmed));
        
        this.log('Events stored locally:', events.length);
      } catch (error) {
        this.log('Error storing events:', error);
      }
      
      // In production, send to analytics endpoint:
      // fetch('/api/analytics', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(events)
      // });
    }
    
    // Specific event tracking methods
    
    trackToolSelection(tool) {
      this.track('tool_selected', { tool });
    }
    
    trackCalculatorUsage(calculatorType, inputs) {
      this.track('calculator_used', {
        type: calculatorType,
        ...inputs
      });
    }
    
    trackPromptJourneyStep(step, choice, path) {
      this.track('prompt_journey_step', {
        step,
        choice,
        path
      });
    }
    
    trackPromptJourneyComplete(path, finalStats) {
      this.track('prompt_journey_complete', {
        path,
        ...finalStats
      });
    }
    
    trackBusinessCaseGenerated(industry, teamSize) {
      this.track('business_case_generated', {
        industry,
        teamSize
      });
    }
    
    trackDownload(fileName, type) {
      this.track('download', {
        fileName,
        type
      });
    }
    
    trackLocaleChange(from, to) {
      this.track('locale_changed', {
        from,
        to
      });
    }
    
    trackTTSUsage(text, locale) {
      this.track('tts_used', {
        textLength: text.length,
        locale
      });
    }
    
    trackError(error, context = {}) {
      this.track('error', {
        message: error.message,
        stack: error.stack,
        ...context
      });
    }
    
    // Utility methods
    
    getSessionStats() {
      const stored = JSON.parse(localStorage.getItem('analytics_events') || '[]');
      const sessionEvents = stored.filter(e => e.properties.sessionId === this.sessionId);
      
      return {
        sessionId: this.sessionId,
        eventCount: sessionEvents.length,
        duration: Math.round((Date.now() - this.sessionStart) / 1000),
        events: sessionEvents
      };
    }
    
    getAllEvents() {
      return JSON.parse(localStorage.getItem('analytics_events') || '[]');
    }
    
    clearEvents() {
      localStorage.removeItem('analytics_events');
      this.events = [];
      this.log('Events cleared');
    }
    
    log(...args) {
      if (this.debug) {
        console.log('[Analytics]', ...args);
      }
    }
    
    // A/B Testing support
    
    getVariant(experimentName, variants = ['A', 'B']) {
      const key = `experiment_${experimentName}`;
      let variant = localStorage.getItem(key);
      
      if (!variant) {
        // Randomly assign variant
        variant = variants[Math.floor(Math.random() * variants.length)];
        localStorage.setItem(key, variant);
        
        this.track('experiment_assigned', {
          experiment: experimentName,
          variant
        });
      }
      
      return variant;
    }
    
    // Feature flags
    
    isFeatureEnabled(featureName) {
      const flags = {
        advancedAnalytics: true,
        newPromptJourney: true,
        betaFeatures: false
      };
      
      return flags[featureName] || false;
    }
  }
  
  // Global analytics instance
  const analytics = new Analytics({
    enabled: true,
    debug: false, // Set to true for development
    trackPageViews: true,
    trackClicks: true,
    trackFormSubmissions: true,
    trackScrollDepth: true,
    trackTimeOnPage: true
  });
  
  // Export for use in other modules
  if (typeof window !== 'undefined') {
    window.analytics = analytics;
  }
  
  // Expose helper functions for manual tracking
  window.trackEvent = (name, properties) => analytics.track(name, properties);
  window.trackToolSelection = (tool) => analytics.trackToolSelection(tool);
  window.trackCalculatorUsage = (type, inputs) => analytics.trackCalculatorUsage(type, inputs);
  window.trackDownload = (fileName, type) => analytics.trackDownload(fileName, type);
  
  // Development helpers
  if (analytics.debug) {
    window.getAnalyticsStats = () => analytics.getSessionStats();
    window.getAllAnalyticsEvents = () => analytics.getAllEvents();
    window.clearAnalytics = () => analytics.clearEvents();
  }
  
  // Error tracking
  window.addEventListener('error', (event) => {
    analytics.trackError(event.error || new Error(event.message), {
      source: 'window.error',
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno
    });
  });
  
  window.addEventListener('unhandledrejection', (event) => {
    analytics.trackError(new Error(event.reason), {
      source: 'unhandledrejection'
    });
  });