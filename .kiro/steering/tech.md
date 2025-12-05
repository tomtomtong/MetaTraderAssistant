# Technology Stack

## Architecture
Hybrid desktop application using Electron with Python bridge for MT5 integration.

## Frontend Stack
- **Electron**: ^28.0.0 - Desktop application framework
- **HTML/CSS/JavaScript**: UI implementation
- **Canvas API**: Node editor rendering and interactions
- **Chart.js**: Financial charting with candlestick support
  - chartjs-chart-financial: ^0.2.1
  - chartjs-adapter-date-fns: ^3.0.0
  - date-fns: ^4.1.0
- **WebSocket**: Real-time communication with Python bridge (ws: ^8.18.3)
- **JSON Files**: Data persistence for settings, positions, and history

## Backend Stack
- **Node.js**: Electron main process and IPC handling
- **Python 3.8+**: MT5 integration bridge
- **MetaTrader5 Python API**: >=5.0.45 - Direct MT5 terminal communication
- **WebSockets**: >=12.0 - Async communication between Electron and Python
- **Twilio**: ^5.10.5 (Node.js) / >=8.0.0 (Python) - SMS/WhatsApp alerts

## Data & Analysis Libraries
- **yfinance**: >=0.2.18 - Yahoo Finance data
- **requests**: >=2.25.0 - HTTP requests
- **firecrawl-py**: >=0.0.16 - Web scraping
- **matplotlib**: >=3.5.0 - Chart generation
- **feedparser**: >=6.0.10 - RSS feed parsing
- **textblob**: >=0.17.1 - Text processing
- **vaderSentiment**: >=3.3.2 - Sentiment analysis
- **nltk**: >=3.8 - Natural language processing

## Build System
- **electron-builder**: ^24.13.3 - Application packaging and distribution
- **npm scripts**: Development and build automation

## Common Commands

### Development
```bash
# Install dependencies
npm install
pip install -r requirements.txt

# Start development
npm start          # Launch application
npm run dev        # Launch with DevTools enabled

# Build for distribution
npm run build      # Build for current platform
npm run build:win  # Build for Windows
npm run dist       # Build without publishing
```

### Python Bridge
```bash
# Install Python dependencies
pip install -r requirements.txt

# Run bridge manually (if needed)
python mt5_bridge.py
```

## Communication Flow
```
Electron UI ↔ IPC (main.js) ↔ WebSocket (port 8765) ↔ Python Bridge (mt5_bridge.py) ↔ MT5 API
```

## File Organization
- **Frontend**: HTML/CSS/JS files in root
- **Backend**: main.js (Electron), mt5_bridge.py (Python)
- **Plugins**: plugins/examples/ - Custom node plugins
- **Charts**: charts/ - Generated chart images
- **Settings**: app_settings.json - Unified settings storage
- **Build**: electron-builder configuration in package.json