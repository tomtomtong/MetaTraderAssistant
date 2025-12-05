// AI Assistant Node - Uses OpenRouter and MT5 data for trading advice
const axios = require('axios');

class AIAssistant {
  constructor() {
    this.apiKey = '';
    this.model = 'anthropic/claude-3.5-sonnet';
    this.baseUrl = 'https://openrouter.ai/api/v1/chat/completions';
    this.useLmStudio = false;
    this.loadSettings();
  }

  loadSettings() {
    try {
      const fs = require('fs');
      const settings = JSON.parse(fs.readFileSync('app_settings.json', 'utf8'));
      
      // Check for LM Studio settings first (local API takes priority)
      if (settings.ai && settings.ai.lmStudio && settings.ai.lmStudio.enabled) {
        this.useLmStudio = true;
        this.apiKey = settings.ai.lmStudio.apiKey || 'lm-studio';
        this.model = settings.ai.lmStudio.model || '';
        this.baseUrl = settings.ai.lmStudio.baseUrl || 'http://localhost:1234/v1';
        // Ensure baseUrl ends with /chat/completions for LM Studio
        if (!this.baseUrl.endsWith('/chat/completions')) {
          this.baseUrl = this.baseUrl.replace(/\/$/, '') + '/chat/completions';
        }
        console.log('Using LM Studio local API:', this.baseUrl);
      } else if (settings.ai && settings.ai.openRouter && settings.ai.openRouter.enabled) {
        // Fallback to OpenRouter if LM Studio is not enabled
        this.useLmStudio = false;
        this.apiKey = settings.ai.openRouter.apiKey || '';
        this.model = settings.ai.openRouter.model || this.model;
        this.baseUrl = settings.ai.openRouter.baseUrl || 'https://openrouter.ai/api/v1';
        // Ensure baseUrl ends with /chat/completions
        if (!this.baseUrl.endsWith('/chat/completions')) {
          this.baseUrl = this.baseUrl.replace(/\/$/, '') + '/chat/completions';
        }
      } else if (settings.openrouter) {
        // Legacy support for old settings format
        this.useLmStudio = false;
        this.apiKey = settings.openrouter.apiKey || '';
        this.model = settings.openrouter.model || this.model;
        this.baseUrl = 'https://openrouter.ai/api/v1/chat/completions';
      }
    } catch (error) {
      console.log('No AI settings found, using defaults');
    }
  }

  saveSettings() {
    try {
      const fs = require('fs');
      let settings = {};
      try {
        settings = JSON.parse(fs.readFileSync('app_settings.json', 'utf8'));
      } catch (e) {
        // File doesn't exist, create new
      }
      
      settings.openrouter = {
        apiKey: this.apiKey,
        model: this.model
      };
      
      fs.writeFileSync('app_settings.json', JSON.stringify(settings, null, 2));
    } catch (error) {
      console.error('Failed to save OpenRouter settings:', error);
    }
  }

  async analyzeMarketData(symbols, question, mt5Bridge) {
    if (!this.useLmStudio && !this.apiKey) {
      throw new Error('AI API key not configured. Please configure OpenRouter or LM Studio in settings.');
    }

    // Fetch 3 months of data for each symbol
    const marketData = await this.fetchMarketData(symbols, mt5Bridge);
    
    // Build context for AI
    const context = this.buildMarketContext(marketData, question);
    
    // Call AI API (LM Studio or OpenRouter)
    const response = await this.callAI(context);
    
    return response;
  }

  async fetchMarketData(symbols, mt5Bridge) {
    const data = {};
    const now = new Date();
    const threeMonthsAgo = new Date(now.getTime() - (90 * 24 * 60 * 60 * 1000));
    
    for (const symbol of symbols) {
      try {
        // Fetch daily data for 3 months
        const response = await mt5Bridge.sendCommand({
          command: 'get_historical_data',
          symbol: symbol,
          timeframe: 'D1',
          start_date: threeMonthsAgo.toISOString().split('T')[0],
          end_date: now.toISOString().split('T')[0]
        });
        
        if (response && !response.error) {
          data[symbol] = this.analyzeSymbolData(response, symbol);
        }
      } catch (error) {
        console.error(`Failed to fetch data for ${symbol}:`, error);
      }
    }
    
    return data;
  }

  analyzeSymbolData(historicalData, symbol) {
    if (!historicalData || historicalData.length === 0) {
      return { symbol, error: 'No data available' };
    }

    const closes = historicalData.map(bar => bar.close);
    const highs = historicalData.map(bar => bar.high);
    const lows = historicalData.map(bar => bar.low);
    
    // Calculate key metrics
    const currentPrice = closes[closes.length - 1];
    const priceRange = Math.max(...highs) - Math.min(...lows);
    const avgPrice = closes.reduce((a, b) => a + b, 0) / closes.length;
    const volatility = this.calculateVolatility(closes);
    
    // Detect range pattern
    const isInRange = this.detectRangePattern(closes, highs, lows);
    
    // Calculate support and resistance
    const support = Math.min(...lows.slice(-30));
    const resistance = Math.max(...highs.slice(-30));
    
    // Trend analysis
    const trend = this.detectTrend(closes);
    
    return {
      symbol,
      currentPrice,
      priceRange,
      avgPrice,
      volatility,
      isInRange,
      support,
      resistance,
      trend,
      dataPoints: closes.length
    };
  }

  calculateVolatility(closes) {
    const returns = [];
    for (let i = 1; i < closes.length; i++) {
      returns.push((closes[i] - closes[i-1]) / closes[i-1]);
    }
    
    const mean = returns.reduce((a, b) => a + b, 0) / returns.length;
    const variance = returns.reduce((sum, r) => sum + Math.pow(r - mean, 2), 0) / returns.length;
    return Math.sqrt(variance) * 100; // As percentage
  }

  detectRangePattern(closes, highs, lows) {
    // Check if price is oscillating within a range (last 30 days)
    const recentCloses = closes.slice(-30);
    const recentHighs = highs.slice(-30);
    const recentLows = lows.slice(-30);
    
    const rangeHigh = Math.max(...recentHighs);
    const rangeLow = Math.min(...recentLows);
    const rangeSize = rangeHigh - rangeLow;
    
    // Count how many times price touched the boundaries
    let upperTouches = 0;
    let lowerTouches = 0;
    const threshold = rangeSize * 0.05; // 5% threshold
    
    for (let i = 0; i < recentHighs.length; i++) {
      if (Math.abs(recentHighs[i] - rangeHigh) < threshold) upperTouches++;
      if (Math.abs(recentLows[i] - rangeLow) < threshold) lowerTouches++;
    }
    
    // Range pattern if multiple touches on both sides
    return upperTouches >= 2 && lowerTouches >= 2;
  }

  detectTrend(closes) {
    const recentCloses = closes.slice(-30);
    const firstHalf = recentCloses.slice(0, 15);
    const secondHalf = recentCloses.slice(15);
    
    const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;
    
    const change = ((secondAvg - firstAvg) / firstAvg) * 100;
    
    if (change > 2) return 'uptrend';
    if (change < -2) return 'downtrend';
    return 'sideways';
  }

  buildMarketContext(marketData, question) {
    let context = `You are an expert trading analyst. Analyze the following market data and answer the question.\n\n`;
    context += `Market Data (Last 3 Months):\n`;
    
    for (const [symbol, data] of Object.entries(marketData)) {
      if (data.error) {
        context += `\n${symbol}: ${data.error}\n`;
        continue;
      }
      
      context += `\n${symbol}:\n`;
      context += `- Current Price: ${data.currentPrice.toFixed(5)}\n`;
      context += `- Average Price: ${data.avgPrice.toFixed(5)}\n`;
      context += `- Support: ${data.support.toFixed(5)}\n`;
      context += `- Resistance: ${data.resistance.toFixed(5)}\n`;
      context += `- Volatility: ${data.volatility.toFixed(2)}%\n`;
      context += `- Trend: ${data.trend}\n`;
      context += `- In Range Pattern: ${data.isInRange ? 'YES' : 'NO'}\n`;
      context += `- Data Points: ${data.dataPoints} days\n`;
    }
    
    context += `\nQuestion: ${question}\n\n`;
    context += `Provide a clear, actionable answer based on the data above.`;
    
    return context;
  }

  async callAI(prompt) {
    try {
      const headers = {
        'Content-Type': 'application/json'
      };
      
      // LM Studio may not require Authorization header, but we include it if API key is provided
      if (this.apiKey && this.apiKey !== 'lm-studio') {
        headers['Authorization'] = `Bearer ${this.apiKey}`;
      }
      
      // For OpenRouter, add additional headers
      if (!this.useLmStudio) {
        headers['HTTP-Referer'] = 'https://mt5-trader.app';
        headers['X-Title'] = 'MT5 Trading Assistant';
      }
      
      const requestBody = {
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 1000,
        temperature: 0.7
      };
      
      // Only include model if specified (LM Studio can work without it)
      if (this.model) {
        requestBody.model = this.model;
      }
      
      const response = await axios.post(
        this.baseUrl,
        requestBody,
        {
          headers: headers,
          timeout: 60000 // 60 second timeout for local API
        }
      );
      
      return response.data.choices[0].message.content;
    } catch (error) {
      const apiName = this.useLmStudio ? 'LM Studio' : 'OpenRouter';
      if (error.response) {
        throw new Error(`${apiName} API error: ${error.response.data.error?.message || error.response.statusText}`);
      } else if (error.code === 'ECONNREFUSED') {
        throw new Error(`${apiName} connection refused. Make sure ${apiName} is running and accessible at ${this.baseUrl}`);
      } else if (error.code === 'ETIMEDOUT') {
        throw new Error(`${apiName} request timed out. Check your connection.`);
      }
      throw error;
    }
  }
  
  // Keep old method name for backward compatibility
  async callOpenRouter(prompt) {
    return this.callAI(prompt);
  }
}

module.exports = AIAssistant;
