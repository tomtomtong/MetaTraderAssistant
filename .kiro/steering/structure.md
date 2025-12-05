# Project Structure

## Root Directory Layout
```
mt5-trader/
├── Frontend Files (UI)
├── Backend Files (Electron + Python)
├── Configuration & Data Files
├── Plugins
├── Charts
└── Build Output
```

## Frontend Files
- `index.html` - Main UI structure and layout
- `renderer.js` - Main application logic and UI controllers
- `node-editor.js` - Node-based strategy builder engine with canvas rendering
- `node-plugin-manager.js` - Plugin system for custom nodes
- `history-import.js` - Historical data import (MT5 and CSV)
- `symbol-input.js` - Symbol input with autocomplete
- `overtrade-control.js` - Risk management controls
- `volume-control.js` - Volume limit management per symbol
- `sentiment-analyzer.js` - Market sentiment analysis
- `twilio-alerts.js` - SMS/WhatsApp notification system
- `settings-manager.js` - Unified settings management
- `settings-backup.js` - Settings backup/restore functionality
- `migrate-settings.js` - Settings migration utilities
- `resizable-panels.js` - UI panel resizing
- `tutorial.js` / `tutorial.css` - User tutorial system
- `styles.css` - Application styling and themes
- `config.js` - Configuration constants

## Backend Files
- `main.js` - Electron main process, window management, and IPC handlers
- `preload.js` - Secure API bridge between renderer and main
- `mt5-bridge.js` - WebSocket client for Python communication
- `mt5_bridge.py` - Python bridge for MT5 API integration
- `simulator.py` - Trading simulator for paper trading
- `market_news_sentiment_analyzer.py` - News sentiment analysis
- `ai-assistant-node.js` - AI assistant integration

## Configuration & Data Files
- `package.json` - Node.js dependencies and build scripts
- `requirements.txt` - Python dependencies
- `app_settings.json` - Unified settings storage (all app settings)
- `simulator_positions.json` - Simulator position data
- `trade_journal.json` - Trade history journal
- `balance_history.json` - Balance tracking
- `chart_images.json` - Chart image metadata

## Plugins
- `plugins/examples/` - Example plugin implementations
  - `http-request.js` - HTTP request node
  - `alphavantage-data.js` - Alpha Vantage market data
  - `alphavantage-sentiment.js` - Alpha Vantage sentiment
  - `delay-node.js` - Delay execution node
  - `hello-world.js` - Basic example plugin
  - `math-calculator.js` - Math operations
  - `text-transformer.js` - Text manipulation

## Charts
- `charts/` - Generated chart images (PNG format)
  - Named: `chart_{SYMBOL}_{TICKET}_{TIMESTAMP}.png`

## Build & Distribution
- `dist/` - Build output directory (generated)
- `node_modules/` - Node.js dependencies (generated)
- `__pycache__/` - Python bytecode cache (generated)

## Development Files
- `.kiro/` - Kiro IDE configuration and steering docs
- `.git/` - Git version control
- `.gitignore` - Git ignore patterns

## Key Architectural Patterns

### Module Organization
- **Single Responsibility**: Each JS file handles one major feature area
- **Separation of Concerns**: UI logic separate from business logic
- **Event-Driven**: Heavy use of event listeners and callbacks
- **Plugin Architecture**: Extensible node system via plugin manager

### File Naming Conventions
- Kebab-case for JavaScript files: `node-editor.js`, `history-import.js`
- Snake_case for Python files: `mt5_bridge.py`, `simulator.py`
- Descriptive names indicating functionality

### Code Organization Within Files
- Class-based approach for complex modules (NodeEditor, MT5Bridge, TradingSimulator)
- Global state management in renderer.js
- Modular functions for specific features
- Clear separation between setup, event handling, and business logic
- IPC handlers in main.js for all Electron-Python communication