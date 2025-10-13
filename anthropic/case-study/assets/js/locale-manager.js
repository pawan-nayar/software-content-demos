/* ========================================
   LOCALE MANAGER
   Multi-language support with browser TTS
   ======================================== */

   class LocaleManager {
    constructor() {
      this.currentLocale = 'en';
      this.availableLocales = {
        en: { 
          name: 'English', 
          nativeName: 'English', 
          flag: '🇺🇸',
          voiceLang: 'en-US'
        },
        es: { 
          name: 'Spanish', 
          nativeName: 'Español', 
          flag: '🇪🇸',
          voiceLang: 'es-ES'
        },
        zh: { 
          name: 'Chinese', 
          nativeName: '中文', 
          flag: '🇨🇳',
          voiceLang: 'zh-CN'
        },
        hi: { 
          name: 'Hindi', 
          nativeName: 'हिन्दी', 
          flag: '🇮🇳',
          voiceLang: 'hi-IN'
        },
        pt: { 
          name: 'Portuguese', 
          nativeName: 'Português', 
          flag: '🇧🇷',
          voiceLang: 'pt-BR'
        }
      };
      
      this.translations = {};
      this.listeners = [];
      
      this.init();
    }
    
    async init() {
      // Detect browser language or use saved preference
      const savedLocale = localStorage.getItem('preferredLocale');
      const browserLocale = navigator.language.split('-')[0];
      
      const initialLocale = savedLocale || 
                           (this.availableLocales[browserLocale] ? browserLocale : 'en');
      
      await this.loadLocale(initialLocale);
      this.setupUI();
    }
    
    async loadLocale(locale) {
      if (!this.availableLocales[locale]) {
        console.error(`Locale ${locale} not available`);
        return;
      }
      
      try {
        // Load translation file
        const response = await fetch(`assets/locales/${locale}.json`);
        if (!response.ok) throw new Error(`Failed to load ${locale}.json`);
        
        this.translations = await response.json();
        this.currentLocale = locale;
        
        // Save preference
        localStorage.setItem('preferredLocale', locale);
        
        // Update page
        this.updateContent();
        this.updateHTMLLang();
        
        // Notify listeners
        this.notifyListeners();
        
        console.log(`Locale changed to: ${locale}`);
      } catch (error) {
        console.error('Error loading locale:', error);
        
        // Fallback to English if current locale fails
        if (locale !== 'en') {
          console.log('Falling back to English...');
          await this.loadLocale('en');
        }
      }
    }
    
    setupUI() {
      // Create locale switcher if it doesn't exist
      const existingSwitcher = document.querySelector('.locale-switcher');
      if (existingSwitcher) {
        this.bindSwitcher(existingSwitcher);
        return;
      }
      
      // Create switcher
      const switcher = this.createSwitcherUI();
      
      // Insert in header
      const headerActions = document.querySelector('.header-actions');
      if (headerActions) {
        headerActions.insertBefore(switcher, headerActions.firstChild);
      }
    }
    
    createSwitcherUI() {
      const container = document.createElement('div');
      container.className = 'locale-switcher';
      
      const currentLocale = this.availableLocales[this.currentLocale];
      
      container.innerHTML = `
        <button class="locale-toggle" aria-expanded="false" aria-label="Select language">
          <span class="locale-icon">🌐</span>
          <span class="locale-current">
            <span class="locale-flag">${currentLocale.flag}</span>
            <span class="locale-code">${this.currentLocale}</span>
          </span>
          <span class="locale-arrow">▼</span>
        </button>
        
        <div class="locale-dropdown">
          <div class="locale-dropdown-header">
            <h3 class="locale-dropdown-title">Select Language</h3>
          </div>
          <ul class="locale-options">
            ${Object.entries(this.availableLocales).map(([code, locale]) => `
              <li>
                <button 
                  class="locale-option ${code === this.currentLocale ? 'active' : ''}" 
                  data-locale="${code}"
                  aria-label="Switch to ${locale.name}">
                  <span class="locale-option-flag">${locale.flag}</span>
                  <span class="locale-option-info">
                    <span class="locale-option-name">${locale.name}</span>
                    <span class="locale-option-native">${locale.nativeName}</span>
                  </span>
                  <span class="locale-option-code">${code}</span>
                  <span class="locale-option-check">✓</span>
                </button>
              </li>
            `).join('')}
          </ul>
        </div>
      `;
      
      this.bindSwitcher(container);
      return container;
    }
    
    bindSwitcher(container) {
      const toggle = container.querySelector('.locale-toggle');
      const dropdown = container.querySelector('.locale-dropdown');
      const options = container.querySelectorAll('.locale-option');
      
      // Toggle dropdown
      toggle.addEventListener('click', (e) => {
        e.stopPropagation();
        const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
        toggle.setAttribute('aria-expanded', !isExpanded);
        dropdown.classList.toggle('active');
      });
      
      // Close on outside click
      document.addEventListener('click', (e) => {
        if (!container.contains(e.target)) {
          toggle.setAttribute('aria-expanded', 'false');
          dropdown.classList.remove('active');
        }
      });
      
      // Handle locale selection
      options.forEach(option => {
        option.addEventListener('click', async (e) => {
          e.stopPropagation();
          const locale = option.dataset.locale;
          
          // Update UI immediately
          options.forEach(opt => opt.classList.remove('active'));
          option.classList.add('active');
          
          // Load new locale
          await this.loadLocale(locale);
          
          // Update toggle
          const currentLocale = this.availableLocales[locale];
          toggle.querySelector('.locale-flag').textContent = currentLocale.flag;
          toggle.querySelector('.locale-code').textContent = locale;
          
          // Close dropdown
          toggle.setAttribute('aria-expanded', 'false');
          dropdown.classList.remove('active');
        });
      });
      
      // Keyboard navigation
      toggle.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggle.click();
        }
      });
    }
    
    updateContent() {
      // Update all elements with data-i18n attribute
      document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.dataset.i18n;
        const translation = this.get(key);
        
        if (translation) {
          if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
            element.placeholder = translation;
          } else {
            element.textContent = translation;
          }
        }
      });
      
      // Update elements with data-i18n-html (for HTML content)
      document.querySelectorAll('[data-i18n-html]').forEach(element => {
        const key = element.dataset.i18nHtml;
        const translation = this.get(key);
        
        if (translation) {
          element.innerHTML = translation;
        }
      });
    }
    
    updateHTMLLang() {
      document.documentElement.lang = this.currentLocale;
    }
    
    get(key, defaultValue = '') {
      const keys = key.split('.');
      let value = this.translations;
      
      for (const k of keys) {
        if (value && typeof value === 'object' && k in value) {
          value = value[k];
        } else {
          return defaultValue || key;
        }
      }
      
      return value;
    }
    
    // Text-to-Speech functionality
    speak(text, options = {}) {
      if (!('speechSynthesis' in window)) {
        console.warn('Text-to-speech not supported in this browser');
        return;
      }
      
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      const localeInfo = this.availableLocales[this.currentLocale];
      
      utterance.lang = localeInfo.voiceLang;
      utterance.rate = options.rate || 1.0;
      utterance.pitch = options.pitch || 1.0;
      utterance.volume = options.volume || 1.0;
      
      // Try to find a native voice for the language
      const voices = window.speechSynthesis.getVoices();
      const nativeVoice = voices.find(voice => 
        voice.lang.startsWith(this.currentLocale) || 
        voice.lang === localeInfo.voiceLang
      );
      
      if (nativeVoice) {
        utterance.voice = nativeVoice;
      }
      
      // Event handlers
      if (options.onStart) utterance.onstart = options.onStart;
      if (options.onEnd) utterance.onend = options.onEnd;
      if (options.onError) utterance.onerror = options.onError;
      
      window.speechSynthesis.speak(utterance);
    }
    
    stopSpeaking() {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    }
    
    // Get available TTS voices for current locale
    getVoices() {
      if (!('speechSynthesis' in window)) return [];
      
      const voices = window.speechSynthesis.getVoices();
      const localeInfo = this.availableLocales[this.currentLocale];
      
      return voices.filter(voice => 
        voice.lang.startsWith(this.currentLocale) || 
        voice.lang === localeInfo.voiceLang
      );
    }
    
    // Register a listener for locale changes
    onChange(callback) {
      this.listeners.push(callback);
    }
    
    notifyListeners() {
      this.listeners.forEach(callback => {
        try {
          callback(this.currentLocale, this.translations);
        } catch (error) {
          console.error('Error in locale change listener:', error);
        }
      });
    }
    
    // Get current locale info
    getCurrentLocaleInfo() {
      return {
        code: this.currentLocale,
        ...this.availableLocales[this.currentLocale]
      };
    }
    
    // Format numbers according to locale
    formatNumber(number, options = {}) {
      return new Intl.NumberFormat(this.currentLocale, options).format(number);
    }
    
    // Format currency
    formatCurrency(amount, currency = 'USD') {
      return new Intl.NumberFormat(this.currentLocale, {
        style: 'currency',
        currency: currency
      }).format(amount);
    }
    
    // Format dates
    formatDate(date, options = {}) {
      return new Intl.DateTimeFormat(this.currentLocale, options).format(date);
    }
    
    // Pluralization helper
    plural(count, singular, plural) {
      // Simple pluralization - can be enhanced with proper plural rules per language
      return count === 1 ? singular : plural;
    }
  }
  
  // Initialize global instance
  const localeManager = new LocaleManager();
  
  // Export for use in other modules
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = LocaleManager;
  }