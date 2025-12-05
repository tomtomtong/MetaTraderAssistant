# Product Overview

MT5 Trading Strategy Executor is an Electron desktop application that provides a comprehensive trading platform for MetaTrader 5. The application enables users to build visual trading strategies using a node-based editor, import historical data for backtesting, execute trades with advanced risk management, and receive real-time alerts.

## Core Value Proposition

- **Visual Strategy Building**: Node-based drag-and-drop interface for creating trading strategies without coding
- **MT5 Integration**: Direct connection to MetaTrader 5 for real-time trading and data access
- **Simulator Mode**: Paper trading with simulated positions using real market data
- **Historical Backtesting**: Import and test strategies against historical data from MT5 or CSV files
- **Risk Management**: Built-in pip-based loss calculations, volume limits, and overtrade protection
- **Real-time Alerts**: SMS/WhatsApp notifications via Twilio for trade events
- **Market Analysis**: Sentiment analysis and news integration for informed trading decisions

## Key Features

### Strategy Building
- Node editor with triggers, indicators (MA, RSI), conditional logic, and trade execution
- Plugin system for custom nodes (HTTP requests, data sources, transformations)
- Visual canvas with pan/zoom, copy/paste, and undo functionality
- Auto-connect feature for rapid strategy building
- Save/load strategy graphs

### Trading & Execution
- Market and limit order execution
- Position management (modify SL/TP, close positions)
- Pending order management (modify, cancel)
- Scheduled actions for delayed execution
- Real-time price updates with auto-refresh
- Support for forex, indices, and other MT5 instruments

### Risk Management
- Volume control with per-symbol limits
- Overtrade protection (max positions, daily loss limits)
- Pip-based loss calculations
- Stop loss and take profit reminders
- Position monitoring with alerts

### Data & Analysis
- Historical data import from MT5 (8 timeframes) or CSV files
- Chart generation with candlestick visualization
- Sentiment analysis using Alpha Vantage and other sources
- Yahoo Finance integration for additional market data
- Trade journal for performance tracking
- Balance history tracking

### Simulator Mode
- Paper trading without risking real capital
- Simulated positions using real MT5 market data
- Automatic TP/SL execution in simulator
- Separate balance tracking
- Hotkey toggle (Ctrl+Shift+S)

### Notifications
- Twilio SMS/WhatsApp alerts
- Configurable alert types (TP hit, SL hit, position opened/closed)
- Custom message templates
- Alert history tracking

### User Interface
- Resizable panels for flexible workspace
- Dark theme optimized for trading
- Tutorial system for new users
- Settings backup and restore
- Comprehensive logging system

## Target Users

Forex and financial market traders who want to:
- Build and test trading strategies visually without coding
- Automate trading execution with MetaTrader 5
- Practice trading with a simulator before risking real capital
- Backtest strategies against historical data
- Manage risk with proper position sizing and limits
- Receive instant notifications for important trade events
- Analyze market sentiment and news for better decisions