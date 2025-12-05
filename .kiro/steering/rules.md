# Development Rules & Best Practices

## Code Style

### JavaScript
- Use ES6+ features (classes, arrow functions, async/await)
- Prefer `const` over `let`, avoid `var`
- Use template literals for string interpolation
- Class-based architecture for complex modules
- Descriptive variable and function names
- Add JSDoc comments for complex functions

### Python
- Follow PEP 8 style guidelines
- Use type hints where appropriate
- Docstrings for all classes and public methods
- Snake_case for variables and functions
- Class-based architecture (e.g., MT5Bridge, TradingSimulator)

### File Naming
- JavaScript: kebab-case (e.g., `node-editor.js`, `twilio-alerts.js`)
- Python: snake_case (e.g., `mt5_bridge.py`, `simulator.py`)
- JSON: snake_case (e.g., `app_settings.json`)

## Architecture Patterns

### Electron IPC Communication
- All MT5 operations go through IPC handlers in `main.js`
- Use `ipcMain.handle()` for async operations
- Return consistent response format: `{ success: boolean, data?: any, error?: string }`
- Log all MT5 API responses for debugging

### Settings Management
- Use unified `app_settings.json` for all application settings
- Settings structure:
  ```json
  {
    "general": { ... },
    "overtrade": { ... },
    "volumeControl": { ... },
    "twilio": { ... },
    "simulator": { ... },
    "aiAnalysis": { ... }
  }
  ```
- Load settings via `window.settingsManager`
- Save settings immediately after changes
- Provide backup/restore functionality

### WebSocket Communication
- Python bridge runs WebSocket server on port 8765
- Node.js client connects via `mt5-bridge.js`
- JSON message format for all communications
- Handle connection errors gracefully
- Auto-reconnect on disconnect

### Error Handling
- Always wrap MT5 API calls in try-catch
- Return error objects instead of throwing
- Log errors with context (timestamp, operation, parameters)
- Show user-friendly error messages via `showMessage()`
- Check for null/undefined before accessing properties

### State Management
- Global state in `renderer.js` for UI state
- Connection state tracked with `isConnected` flag
- Strategy execution state with `isStrategyRunning` flag
- Simulator mode state with `simulatorMode` flag
- Position data refreshed periodically when connected

## Feature Implementation

### Node Editor
- All nodes must have: id, type, x, y, inputs, outputs, params
- Node execution returns: `{ success: boolean, outputs: any[], error?: string }`
- Support for plugin nodes via `NodePluginManager`
- Canvas coordinates vs screen coordinates conversion
- Undo/redo for node deletion
- Copy/paste functionality

### Trading Operations
- Validate symbol before executing trades
- Check connection status before MT5 operations
- Support both market and limit orders
- Allow optional SL/TP (0 means no SL/TP)
- Normalize prices to symbol's tick size
- Log all trade executions with full details

### Simulator Mode
- Simulator works without MT5 connection for position management
- Uses real MT5 prices when connected
- Separate ticket numbering (starts at 1000000)
- Automatic TP/SL execution
- Balance tracking with initial balance setting
- Position data stored in `app_settings.json`

### Risk Management
- Volume control: per-symbol volume limits
- Overtrade protection: max positions, daily loss limits
- Calculate pip-based losses before trade execution
- Show warnings for high-risk trades
- Track position count and daily P&L

### Alerts & Notifications
- Twilio integration for SMS/WhatsApp
- Configurable alert types (TP, SL, position events)
- Alert history tracking
- Handle Twilio errors gracefully
- Test mode for alert configuration

## Data Persistence

### JSON Files
- `app_settings.json` - All application settings
- `simulator_positions.json` - Simulator positions (legacy, now in app_settings)
- `trade_journal.json` - Trade history
- `balance_history.json` - Balance tracking
- `chart_images.json` - Chart metadata

### File Operations
- Use `fs.promises` for async file operations
- Handle ENOENT errors (file not found)
- Validate JSON before parsing
- Pretty-print JSON with 2-space indent
- Create directories if they don't exist

## UI/UX Guidelines

### User Feedback
- Show loading states for async operations
- Display success/error messages via `showMessage()`
- Update UI immediately after state changes
- Disable buttons during operations
- Show timestamps for data updates

### Modal Dialogs
- Use consistent modal structure
- ESC key to close modals
- Click overlay to close (with confirmation if needed)
- Clear form fields when opening modals
- Validate inputs before submission

### Real-time Updates
- Auto-refresh account info every 5 seconds when connected
- Auto-refresh positions every 3 seconds
- Auto-refresh prices in trade modal
- Stop auto-refresh when disconnected
- Show last update timestamp

## Testing & Debugging

### Logging
- Use `console.log()` for info messages
- Use `console.error()` for errors
- Use `console.warn()` for warnings
- Log MT5 API responses with action name
- Capture logs in log modal for user access

### Error Messages
- Include operation context in error messages
- Show MT5 error codes when available
- Provide actionable suggestions
- Log full error stack for debugging

### Simulator Testing
- Test all trading operations in simulator mode first
- Verify P&L calculations with different symbols
- Test TP/SL execution
- Verify balance updates

## Security

### API Keys
- Store API keys in settings file (not in code)
- Never commit API keys to version control
- Validate API keys before use
- Handle missing/invalid keys gracefully

### User Data
- Don't log sensitive information (passwords, API keys)
- Validate all user inputs
- Sanitize data before display
- Use Electron's contextIsolation

## Performance

### Canvas Rendering
- Use requestAnimationFrame for smooth animations
- Only redraw when state changes
- Optimize node rendering for large graphs
- Use canvas transforms for pan/zoom

### Data Loading
- Load settings asynchronously
- Cache symbol lists
- Paginate large data sets
- Use debouncing for frequent operations

## Plugin Development

### Plugin Structure
```javascript
module.exports = {
  id: 'unique-plugin-id',
  title: 'Plugin Title',
  category: 'Category Name',
  inputs: ['input1', 'input2'],
  outputs: ['output1'],
  params: { param1: 'default' },
  execute: async (inputs, params) => {
    // Implementation
    return { success: true, outputs: [result] };
  }
};
```

### Plugin Guidelines
- Validate all inputs
- Handle errors gracefully
- Return consistent output format
- Document parameters
- Test with various input types
- Keep execution fast (< 1 second)
