# Requirements Document

## Introduction

The MT5 Trading Strategy Executor is a comprehensive desktop trading platform that integrates with MetaTrader 5 to provide visual strategy building, automated trading execution, risk management, and market analysis capabilities. The system enables traders to create, test, and execute trading strategies through a node-based visual interface while maintaining robust risk controls and receiving real-time notifications.

## Glossary

- **MT5**: MetaTrader 5, a multi-asset trading platform
- **Node Editor**: Visual programming interface using connected nodes to build trading strategies
- **Simulator Mode**: Paper trading mode that simulates trades without risking real capital
- **IPC**: Inter-Process Communication between Electron and Node.js processes
- **WebSocket**: Real-time bidirectional communication protocol between Electron and Python bridge
- **Plugin**: Custom node module that extends the node editor functionality
- **Position**: An open trade in the market
- **Pending Order**: A limit order that hasn't been executed yet
- **SL**: Stop Loss - price level to automatically close a losing trade
- **TP**: Take Profit - price level to automatically close a winning trade
- **Pip**: Smallest price movement in forex trading
- **Symbol**: Trading instrument (e.g., EURUSD, BTCUSD, US30.cash)
- **Tick**: Minimum price change for a symbol
- **Volume**: Trade size in lots

## Requirements

### Requirement 1: MT5 Connection Management

**User Story:** As a trader, I want to connect to my MetaTrader 5 terminal, so that I can access real-time market data and execute trades.

#### Acceptance Criteria

1. WHEN a user provides MT5 login credentials (login, password, server), THE system SHALL establish a connection to the MT5 terminal
2. WHEN the MT5 connection is successful, THE system SHALL display account information including balance, equity, margin, and profit
3. WHEN the user disconnects from MT5, THE system SHALL stop all auto-refresh operations and clear displayed data
4. WHEN the MT5 connection fails, THE system SHALL display an error message with the failure reason
5. WHEN the system is connected to MT5, THE system SHALL auto-refresh account information every 5 seconds

### Requirement 2: Visual Strategy Builder (Node Editor)

**User Story:** As a trader, I want to build trading strategies visually using a node-based interface, so that I can create automated trading logic without writing code.

#### Acceptance Criteria

1. WHEN a user adds a node to the canvas, THE system SHALL create the node at the specified position with appropriate inputs and outputs
2. WHEN a user connects two nodes, THE system SHALL validate that the connection types are compatible (trigger-to-trigger or string-to-string)
3. WHEN a user executes a strategy, THE system SHALL process nodes in the correct order following the connection flow
4. WHEN a user deletes a node, THE system SHALL remove all connections to that node and add the deletion to the undo stack
5. WHEN a user presses Ctrl+Z, THE system SHALL restore the last deleted node with its connections
6. WHEN a user copies a node (Ctrl+C) and pastes (Ctrl+V), THE system SHALL create a duplicate node near the viewport center
7. WHEN a user pans the canvas (Space+drag or middle mouse), THE system SHALL move the viewport without affecting node positions
8. WHEN a user zooms the canvas (mouse wheel or Ctrl+drag), THE system SHALL scale the view while maintaining relative positions
9. WHEN a user saves a strategy graph, THE system SHALL serialize all nodes and connections to JSON format
10. WHEN a user loads a strategy graph, THE system SHALL restore all nodes and connections from the saved JSON

### Requirement 3: Trading Operations

**User Story:** As a trader, I want to execute market and limit orders with optional stop loss and take profit, so that I can enter positions with proper risk management.

#### Acceptance Criteria

1. WHEN a user executes a market order, THE system SHALL send the order to MT5 at the current market price
2. WHEN a user executes a limit order, THE system SHALL validate that the limit price is appropriate for the order type (BUY limit below ask, SELL limit above bid)
3. WHEN a user specifies a stop loss value greater than zero, THE system SHALL include the stop loss in the order request
4. WHEN a user specifies a take profit value greater than zero, THE system SHALL include the take profit in the order request
5. WHEN a user leaves stop loss or take profit as zero, THE system SHALL execute the order without those parameters
6. WHEN an order execution fails, THE system SHALL display the MT5 error code and message to the user
7. WHEN an order executes successfully, THE system SHALL display a success message with the ticket number and execution price
8. WHEN a user closes a position, THE system SHALL send a closing order at the current market price for the opposite direction
9. WHEN a user modifies a position's SL/TP, THE system SHALL update the position parameters without closing it
10. WHEN a user cancels a pending order, THE system SHALL remove the order from MT5

### Requirement 4: Simulator Mode

**User Story:** As a trader, I want to practice trading with simulated positions using real market data, so that I can test strategies without risking real capital.

#### Acceptance Criteria

1. WHEN a user enables simulator mode, THE system SHALL create and manage positions locally without sending orders to MT5
2. WHEN simulator mode is active and MT5 is connected, THE system SHALL use real MT5 market prices to calculate simulated position P&L
3. WHEN a simulated position reaches its take profit level, THE system SHALL automatically close the position and record the profit
4. WHEN a simulated position reaches its stop loss level, THE system SHALL automatically close the position and record the loss
5. WHEN a user opens a simulated position, THE system SHALL assign a ticket number starting from 1000000 to distinguish from real trades
6. WHEN a user resets the simulator, THE system SHALL clear all simulated positions and reset the balance to the specified initial amount
7. WHEN simulator mode is active, THE system SHALL display a visual indicator in the toolbar
8. WHEN a user toggles simulator mode with Ctrl+Shift+S, THE system SHALL enable or disable simulator mode immediately

### Requirement 5: Risk Management Controls

**User Story:** As a trader, I want automated risk management controls, so that I can prevent overtrading and limit my losses.

#### Acceptance Criteria

1. WHEN volume control is enabled and a user selects a symbol, THE system SHALL auto-populate the volume field with the configured limit for that symbol
2. WHEN overtrade control is enabled and the maximum position count is reached, THE system SHALL prevent opening new positions
3. WHEN overtrade control is enabled and the daily loss limit is reached, THE system SHALL prevent opening new positions for the remainder of the day
4. WHEN a user calculates volume loss, THE system SHALL compute the pip-based loss amount for the specified volume and stop loss
5. WHEN the calculated loss exceeds a threshold, THE system SHALL display a warning to the user before trade execution

### Requirement 6: Real-time Notifications

**User Story:** As a trader, I want to receive SMS or WhatsApp notifications for important trade events, so that I can stay informed even when away from my computer.

#### Acceptance Criteria

1. WHEN a user configures Twilio credentials, THE system SHALL validate and store the account SID, auth token, and phone number
2. WHEN a position hits take profit, THE system SHALL send a notification with position details if TP alerts are enabled
3. WHEN a position hits stop loss, THE system SHALL send a notification with position details if SL alerts are enabled
4. WHEN a new position is opened, THE system SHALL send a notification with entry details if position opened alerts are enabled
5. WHEN a Twilio alert fails to send, THE system SHALL log the error and display it to the user
6. WHEN a user sends a test alert, THE system SHALL immediately attempt to send a test message and report the result

### Requirement 7: Historical Data and Backtesting

**User Story:** As a trader, I want to import historical market data and test strategies against it, so that I can evaluate strategy performance before live trading.

#### Acceptance Criteria

1. WHEN a user imports historical data from MT5, THE system SHALL fetch OHLCV data for the specified symbol, timeframe, and date range
2. WHEN a user imports historical data from CSV, THE system SHALL parse the file and validate the data format
3. WHEN historical data is imported, THE system SHALL store it in local storage and enable backtest mode
4. WHEN backtest mode is active, THE system SHALL display a visual indicator in the toolbar
5. WHEN a user exits backtest mode, THE system SHALL clear the historical data and remove the indicator
6. WHEN historical data is available, THE system SHALL support 8 timeframes: M1, M5, M15, M30, H1, H4, D1, W1

### Requirement 8: Market Analysis and Sentiment

**User Story:** As a trader, I want to analyze market sentiment from news sources, so that I can make informed trading decisions.

#### Acceptance Criteria

1. WHEN a user requests sentiment analysis for keywords, THE system SHALL fetch news articles from Alpha Vantage News & Sentiment API
2. WHEN news articles are fetched, THE system SHALL analyze sentiment using keyword matching or Alpha Vantage sentiment scores
3. WHEN sentiment analysis completes, THE system SHALL display overall sentiment (bullish/bearish/neutral) and article count
4. WHEN sentiment analysis includes multiple keywords, THE system SHALL combine results from separate API calls to avoid AND logic limitations
5. WHEN no Alpha Vantage API key is configured, THE system SHALL display a warning message requesting configuration

### Requirement 9: Plugin System

**User Story:** As a developer, I want to create custom nodes for the strategy builder, so that I can extend the platform with new functionality.

#### Acceptance Criteria

1. WHEN a user imports a plugin file, THE system SHALL validate the plugin structure (id, title, inputs, outputs, execute function)
2. WHEN a plugin is loaded successfully, THE system SHALL add a button to the node palette in the appropriate category
3. WHEN a user adds a plugin node to the canvas, THE system SHALL create the node with the plugin's defined inputs and outputs
4. WHEN a plugin node executes, THE system SHALL call the plugin's execute function with the node parameters and input data
5. WHEN a plugin execution fails, THE system SHALL log the error and display it to the user without crashing the application
6. WHEN the application starts, THE system SHALL auto-load built-in example plugins from the plugins/examples directory

### Requirement 10: Data Persistence and Settings

**User Story:** As a trader, I want my settings and data to be saved automatically, so that I don't lose my configuration when I close the application.

#### Acceptance Criteria

1. WHEN a user changes any setting, THE system SHALL immediately save the change to app_settings.json
2. WHEN the application starts, THE system SHALL load all settings from app_settings.json
3. WHEN a user backs up settings, THE system SHALL create a timestamped backup file with all current settings
4. WHEN a user restores settings from backup, THE system SHALL load the backup file and apply all settings
5. WHEN settings are corrupted or missing, THE system SHALL create default settings and log a warning
6. WHEN simulator positions change, THE system SHALL save the updated positions to app_settings.json
7. WHEN a user saves a strategy graph, THE system SHALL store it in local storage with a user-defined name
8. WHEN chart images are generated, THE system SHALL save them to the charts directory with a unique filename

### Requirement 11: Position and Order Management

**User Story:** As a trader, I want to view and manage all my open positions and pending orders, so that I can monitor and adjust my trades.

#### Acceptance Criteria

1. WHEN the system is connected to MT5, THE system SHALL auto-refresh open positions every 3 seconds
2. WHEN positions are displayed, THE system SHALL show ticket, symbol, type, volume, open price, current price, profit, SL, and TP
3. WHEN a user clicks modify on a position, THE system SHALL open a modal with current SL/TP values pre-filled
4. WHEN a user clicks close on a position, THE system SHALL request confirmation before closing
5. WHEN pending orders are displayed, THE system SHALL show ticket, symbol, type, volume, price, SL, TP, and expiration
6. WHEN a user modifies a pending order, THE system SHALL allow changing the price, SL, and TP
7. WHEN a user cancels a pending order, THE system SHALL request confirmation before canceling
8. WHEN closed positions are requested, THE system SHALL fetch positions closed within the specified number of days
9. WHEN closed positions are displayed, THE system SHALL show profit/loss, duration, and close time

### Requirement 12: Chart Visualization

**User Story:** As a trader, I want to view candlestick charts for my positions, so that I can analyze price action and market context.

#### Acceptance Criteria

1. WHEN a user requests a chart for a position, THE system SHALL fetch historical data for the position's symbol
2. WHEN historical data is available, THE system SHALL render a candlestick chart using Chart.js
3. WHEN a chart is displayed, THE system SHALL mark the entry price, stop loss, and take profit levels
4. WHEN a user saves a chart, THE system SHALL export it as a PNG image to the charts directory
5. WHEN a chart image is saved, THE system SHALL store the file path in chart_images.json for future reference

### Requirement 13: Scheduled Actions

**User Story:** As a trader, I want to schedule trades and modifications for future execution, so that I can plan my trading in advance.

#### Acceptance Criteria

1. WHEN a user schedules a trade, THE system SHALL store the trade parameters with the scheduled execution time
2. WHEN a user schedules a position modification, THE system SHALL store the modification parameters with the scheduled time
3. WHEN a scheduled action's time arrives, THE system SHALL execute the action automatically
4. WHEN a user views scheduled actions, THE system SHALL display all pending scheduled actions with their execution times
5. WHEN a user cancels a scheduled action, THE system SHALL remove it from the schedule

### Requirement 14: Symbol Search and Selection

**User Story:** As a trader, I want to search for trading symbols with autocomplete, so that I can quickly find and select instruments to trade.

#### Acceptance Criteria

1. WHEN a user types in the symbol input, THE system SHALL fetch matching symbols from MT5 if connected
2. WHEN matching symbols are found, THE system SHALL display them in a dropdown with autocomplete
3. WHEN a user selects a symbol, THE system SHALL fetch and display current market data for that symbol
4. WHEN a symbol is selected in the trade modal, THE system SHALL auto-refresh the current bid/ask prices
5. WHEN a user searches for a symbol, THE system SHALL support both exact matches and partial matches

### Requirement 15: Logging and Debugging

**User Story:** As a trader, I want to view application logs and MT5 API responses, so that I can troubleshoot issues and understand system behavior.

#### Acceptance Criteria

1. WHEN any console message is logged, THE system SHALL capture it in the log entries array
2. WHEN a user opens the log modal, THE system SHALL display the most recent 100 log entries
3. WHEN an MT5 API call is made, THE system SHALL log the action, request parameters, and response
4. WHEN a user clears the log, THE system SHALL remove all log entries from memory
5. WHEN a user copies the log, THE system SHALL copy all log entries to the clipboard in text format
6. WHEN log entries are displayed, THE system SHALL show timestamp, type (info/error/warning), source, and message

### Requirement 16: User Interface and Experience

**User Story:** As a trader, I want an intuitive and responsive user interface, so that I can efficiently manage my trading activities.

#### Acceptance Criteria

1. WHEN a user resizes panels, THE system SHALL save the panel sizes and restore them on next launch
2. WHEN a user toggles the bottom panel, THE system SHALL show or hide the positions/orders section
3. WHEN a modal is displayed, THE system SHALL allow closing it with ESC key or by clicking the overlay
4. WHEN an async operation is in progress, THE system SHALL display a loading indicator
5. WHEN an operation completes, THE system SHALL display a success or error message for 3 seconds
6. WHEN the tutorial is active, THE system SHALL guide the user through key features step by step
7. WHEN a user hovers over a connection line, THE system SHALL highlight it for deletion
8. WHEN strategy execution is in progress, THE system SHALL disable node interactions and show the currently executing node

### Requirement 17: Node Types and Functionality

**User Story:** As a trader, I want a variety of node types for building strategies, so that I can create complex trading logic.

#### Acceptance Criteria

1. WHEN a trigger node executes, THE system SHALL initiate the strategy execution flow
2. WHEN a conditional check node executes, THE system SHALL evaluate the condition and pass or block the trigger based on the result
3. WHEN an AND gate receives multiple triggers, THE system SHALL only pass the trigger when all inputs have been triggered
4. WHEN an OR gate receives multiple triggers, THE system SHALL pass the trigger when any input has been triggered
5. WHEN a trade signal node executes, THE system SHALL open a position with the specified parameters
6. WHEN a close position node executes, THE system SHALL close the specified position or all positions
7. WHEN a modify position node executes, THE system SHALL update the SL/TP of the specified position
8. WHEN a string input node executes, THE system SHALL output the configured string value
9. WHEN a string output node executes, THE system SHALL display the input string in a popup or console
10. WHEN a string contains node executes, THE system SHALL check if the input string contains the keyword and pass or block accordingly
11. WHEN an LLM node executes, THE system SHALL call the configured AI model with the prompt and input data
12. WHEN a Firecrawl node executes, THE system SHALL scrape the specified URL and output the content
13. WHEN a Python script node executes, THE system SHALL run the Python code and return the result
14. WHEN a sentiment node executes, THE system SHALL fetch and analyze news sentiment for the specified keywords
15. WHEN a yFinance data node executes, THE system SHALL fetch market data from Yahoo Finance
16. WHEN an Alpha Vantage data node executes, THE system SHALL fetch market data from Alpha Vantage API
17. WHEN an MT5 data node executes, THE system SHALL fetch market data from the connected MT5 terminal
18. WHEN an end strategy node executes, THE system SHALL stop all trigger execution and optionally display a message
