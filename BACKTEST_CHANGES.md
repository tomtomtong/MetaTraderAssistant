# Backtest Mode UI Changes

## Summary
Combined "Import History" and backtest mode into a unified "Backtest" button with clearer user flow.

## Changes Made

### 1. Button Renamed
- **Before**: "Import History" button
- **After**: "Backtest" button
- Users now click "Backtest" to enter backtest mode

### 2. Modal Updated
- **Modal ID**: Changed from `importHistoryModal` to `backtestModal`
- **Title**: Changed from "Import Historical Data" to "Backtest Mode - Select Data Source"
- **Primary Button**: Changed from "Import Data" to "Start Backtest"

### 3. Function Names Updated
- `showImportHistoryModal()` → `showBacktestModal()`
- `hideImportHistoryModal()` → `hideBacktestModal()`
- All references updated throughout the codebase

### 4. User Messages Updated
- Success messages now say "Backtest mode activated" instead of "Successfully imported"
- Clear button renamed from "Clear History" to "Exit Backtest"
- Confirmation dialog says "Exit backtest mode" instead of "Clear imported historical data"

### 5. Visual Indicators
- Backtest mode indicator: `📊 Backtest Mode` (unchanged)
- Exit button: "Exit Backtest" (updated from "Clear History")

## User Flow

1. **Click "Backtest" button** → Opens data selection modal
2. **Choose data source**:
   - From MT5: Select symbol, timeframe, date range
   - From CSV: Upload file and specify symbol
3. **Click "Start Backtest"** → Loads data and activates backtest mode
4. **Visual feedback**: 
   - `📊 Backtest Mode` indicator appears
   - "Exit Backtest" button appears
5. **Test strategies** using the loaded historical data
6. **Click "Exit Backtest"** → Clears data and returns to normal mode

## Benefits

- **Clearer intent**: Users understand they're entering backtest mode, not just importing data
- **Unified workflow**: Single button for the entire backtest process
- **Better UX**: More intuitive naming that matches user expectations
- **Consistent messaging**: All text reflects the backtest concept

## Files Modified

- `index.html` - Button and modal updates
- `history-import.js` - Function renames and message updates
- `renderer.js` - Event listener updates
