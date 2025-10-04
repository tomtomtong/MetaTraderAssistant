# MT5 Trading Strategy Executor - Complete Documentation

## Overview

An Electron desktop application for executing trading strategies on MetaTrader 5 with historical data import capabilities and a node-based strategy builder.

## Quick Start

1. Install dependencies: `npm install`
2. Start the application: `npm start`
3. Connect to MT5 using your credentials
4. Build strategies using the node editor
5. Import historical data for backtesting
6. Execute trades or test strategies

## Core Features

### Trading Features
- Connect to MetaTrader 5 terminal
- View real-time account information
- Execute trading strategies with customizable parameters
- Monitor and close open positions
- Auto-refresh account and position data
- Symbol input with dropdown and MT5 symbol fetching

### Strategy Builder
- Node-based strategy builder with trigger system
- Manual and period triggers for strategy execution
- Technical indicators (Moving Average, RSI)
- Conditional checks with live price comparison
- Logic gates (AND, OR) for complex conditions
- Trade signal nodes for order execution

### Historical Data Import
- Import data from MT5 (8 timeframes: M1-W1)
- Import from CSV files (offline capability)
- Backtest mode with visual indicators
- Data persistence across sessions
- Sample CSV file included

### Risk Management
- Pip-based loss calculation using real MT5 contract data
- Volume loss warnings with detailed breakdowns
- Position modification (stop loss/take profit)
- Confirmation dialogs for critical actions

## Node System

### Trigger Nodes
**Manual Trigger**: Execute on-demand with button click
- No inputs, trigger output
- Green execute button when enabled
- Perfect for testing strategies

**Period Trigger**: Automatic execution at intervals
- No inputs, trigger output
- Configurable intervals (seconds/minutes/hours)
- Pulsing indicator when active

### Processing Nodes
**Moving Average**: Calculate MA indicator
- Trigger input/output
- Configurable period parameter

**RSI**: Calculate Relative Strength Index
- Trigger input/output
- Configurable period parameter

**Conditional Check**: Price-based conditions
- Trigger input/output
- Symbol, operator, and price parameters
- "Get Current Price" button for live data

**Logic Gates**: AND/OR operations
- Two trigger inputs, one trigger output
- Combine multiple conditions

### Action Nodes
**Trade Signal**: Execute trading orders
- Trigger input, no outputs
- Action (BUY/SELL), symbol, and volume parameters

**Trailing Trade**: Execute orders with automatic trailing stop loss
- Trigger input, no outputs
- Action (BUY/SELL), symbol, volume, trail distance, and trail step parameters
- Trail distance: Distance in pips between current price and stop loss
- Trail step: Minimum price movement in pips before adjusting stop loss
- Automatically adjusts stop loss as price moves favorably

## Historical Data Import

### Import from MT5
1. Click "Import History" button
2. Enter symbol (e.g., EURUSD)
3. Select timeframe (M1, M5, M15, M30, H1, H4, D1, W1)
4. Set date range or bar count
5. Click "Import Data"

### Import from CSV
1. Click "Import History" button
2. Switch to "From CSV" tab
3. Upload CSV file (Date,Time,Open,High,Low,Close,Volume format)
4. Enter symbol name
5. Click "Import Data"

### Backtest Mode
- Visual indicator (📊 Backtest Mode) appears after import
- Data persists across application restarts
- "Clear History" button to remove data
- Safe testing environment for strategies

## Setup & Installation

### Prerequisites
- MetaTrader 5 installed
- Python 3.8+ with MetaTrader5 and websockets packages
- Node.js (for Electron)

### Installation Steps
1. `pip install -r requirements.txt`
2. `npm install`
3. `npm start`

### MT5 Integration
The application uses a Python bridge (`mt5_bridge.py`) that connects to MT5 and communicates with the Electron app via WebSocket on port 8765.

## Architecture

```
UI (HTML/CSS/JS)
    ↓
Event Handlers (renderer.js)
    ↓
Import Module (history-import.js)
    ↓
API Layer (preload.js)
    ↓
IPC (main.js)
    ↓
Bridge (mt5-bridge.js)
    ↓
WebSocket
    ↓
Python Bridge (mt5_bridge.py)
    ↓
MetaTrader 5 API
```

## Key Files

### Frontend
- `index.html` - Main UI structure
- `renderer.js` - Main application logic
- `node-editor.js` - Node-based strategy builder
- `history-import.js` - Historical data import functionality
- `symbol-input.js` - Symbol input with autocomplete
- `styles.css` - Application styling

### Backend
- `main.js` - Electron main process
- `preload.js` - Secure API bridge
- `mt5-bridge.js` - WebSocket client
- `mt5_bridge.py` - Python MT5 integration

### Documentation
- `README.md` - Main project documentation
- `SETUP.md` - Installation and setup guide
- `TRIGGER_NODES.md` - Node system documentation
- `PIP_CALCULATION_SPEC.md` - Risk calculation details

## Usage Examples

### Simple Moving Average Strategy
1. Add "Period Trigger" (5 minutes)
2. Add "Moving Average" (period: 20)
3. Add "Conditional Check" (price > MA)
4. Add "Trade Signal" (BUY, EURUSD, 0.1)
5. Connect nodes and enable trigger

### RSI Oversold Strategy
1. Add "Manual Trigger"
2. Add "RSI" (period: 14)
3. Add "Conditional Check" (RSI < 30)
4. Add "Trade Signal" (BUY, EURUSD, 0.1)
5. Connect nodes and click execute

### Trailing Stop Strategy
1. Add "Manual Trigger"
2. Add "Moving Average" (period: 20)
3. Add "Conditional Check" (price > MA)
4. Add "Trailing Trade" (BUY, EURUSD, 0.1, trail: 50 pips, step: 10 pips)
5. Connect nodes and execute - stop loss will trail price automatically

### Backtesting Workflow
1. Import historical data (EURUSD, H1, last 30 days)
2. Build strategy with nodes
3. Execute strategy against historical data
4. Review results and refine
5. Clear history when done

## Risk Management

### Pip-Based Calculations
The application uses proper pip-based loss calculations:
- Retrieves real contract data from MT5
- Converts tick values to pip values
- Calculates accurate loss for 1% price moves
- Supports all symbol types (forex, metals, indices)

### Position Management
- Close positions with confirmation
- Modify stop loss and take profit levels
- Real-time position monitoring
- Account balance and equity tracking

## Troubleshooting

### Common Issues
- **Connection failed**: Check MT5 is running and credentials are correct
- **Import failed**: Verify MT5 connection or CSV format
- **Nodes not executing**: Check trigger connections and MT5 status
- **Performance issues**: Reduce historical data size or clear old data

### Debug Tools
- "Show Log" button for console output
- Browser developer tools (F12)
- MT5 terminal logs
- Python bridge console output

## CSV Format

```csv
Date,Time,Open,High,Low,Close,Volume
2024-01-01,00:00:00,1.0850,1.0865,1.0845,1.0860,1000
2024-01-01,01:00:00,1.0860,1.0875,1.0855,1.0870,1200
```

Requirements:
- Header row (optional, auto-detected)
- Date: YYYY-MM-DD format
- Time: HH:MM:SS format (optional)
- Numeric values for OHLCV data

## Performance Guidelines

### Dataset Sizes
- Small (< 1,000 bars): Excellent performance
- Medium (1,000-5,000 bars): Good performance
- Large (5,000-10,000 bars): Acceptable performance
- Very large (> 10,000 bars): May be slow

### Best Practices
- Start with smaller datasets for testing
- Use appropriate timeframes for your strategy
- Clear historical data when not needed
- Monitor browser memory usage
- Test strategies before live trading

## Security

- Data stored locally in browser localStorage
- No server transmission of trading data
- User-controlled data deletion
- Input validation throughout
- Secure IPC communication

## Future Enhancements

- Advanced backtesting metrics and reports
- Multiple symbol support
- Strategy comparison tools
- Walk-forward analysis
- Monte Carlo simulation
- Export capabilities
- Mobile responsive design

## Support

For issues or questions:
1. Check this documentation
2. Use "Show Log" button in the application
3. Check browser console (F12)
4. Review MT5 terminal logs
5. Verify all dependencies are installed

## Disclaimer

Trading involves risk. This software is provided as-is without guarantees. Always test thoroughly on demo accounts before using with real money. The developers are not responsible for any trading losses.

## License

Same as main project license.

---

**Version**: 1.0.0  
**Status**: Production Ready  
**Last Updated**: 2024