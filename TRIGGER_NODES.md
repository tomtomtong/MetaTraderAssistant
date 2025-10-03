# Trigger Flow Nodes

This document explains how to use the trigger flow nodes in the MT5 Strategy Builder.

## Overview

Trigger nodes are special nodes that initiate the execution of your trading strategy flow. They have no inputs and provide a trigger output that can be connected to other nodes to start the execution chain.

## Node Types

### 1. Manual Trigger ⚡

**Purpose**: Execute your strategy on-demand with a single click.

**Features**:
- Green "▶ EXECUTE" button appears at the bottom of the node
- Click the button to manually trigger the connected flow
- Useful for testing strategies or executing trades at specific moments
- Can be enabled/disabled via properties panel

**Parameters**:
- `enabled` (boolean): Enable or disable the trigger
- `description` (string): Optional description of what this trigger does

**Use Cases**:
- Manual strategy execution when you see a trading opportunity
- Testing your node flow before automating it
- One-time trade executions based on your analysis

### 2. Period Trigger ⏱️

**Purpose**: Automatically execute your strategy at regular intervals.

**Features**:
- Pulsing green indicator shows when the trigger is active
- Automatically executes connected nodes at specified intervals
- Configurable time units (seconds, minutes, hours)
- Can be started/stopped via the enabled parameter

**Parameters**:
- `enabled` (boolean): Start or stop the periodic execution
- `interval` (number): How often to trigger (e.g., 60)
- `unit` (string): Time unit - "seconds", "minutes", or "hours"

**Use Cases**:
- Automated strategy execution every X minutes/hours
- Regular market monitoring and analysis
- Scheduled trading based on time intervals
- Backtesting with time-based execution

## How to Use

### Adding a Trigger Node

1. Click on either "⚡ Manual Trigger" or "⏱️ Period Trigger" in the left sidebar
2. The node will appear on the canvas
3. Connect the trigger output (green socket) to other nodes

### Configuring a Manual Trigger

1. Select the manual trigger node
2. In the properties panel (right sidebar):
   - Set `enabled` to "Enabled" to activate the button
   - Add a description if desired
3. Click the green "▶ EXECUTE" button on the node to trigger execution

### Configuring a Period Trigger

1. Select the period trigger node
2. In the properties panel (right sidebar):
   - Set `interval` to your desired number (e.g., 60)
   - Set `unit` to "seconds", "minutes", or "hours"
   - Set `enabled` to "Enabled" to start automatic execution
3. The node will show a pulsing green indicator when active
4. Set `enabled` to "Disabled" to stop automatic execution

## Example Workflows

### Example 1: Manual Trading Strategy

```
Manual Trigger → Market Data → Moving Average → Compare → Trade Signal
```

Click the manual trigger button when you want to check if conditions are met and execute a trade.

### Example 2: Automated Monitoring

```
Period Trigger (5 minutes) → Market Data → RSI → Compare → Trade Signal
```

Automatically checks RSI every 5 minutes and executes trades when conditions are met.

### Example 3: Multiple Triggers

You can have multiple trigger nodes in the same canvas:
- Manual trigger for immediate execution
- Period trigger (1 hour) for long-term strategy
- Period trigger (5 minutes) for short-term strategy

## Visual Indicators

### Manual Trigger
- **Green button**: Trigger is enabled and ready to execute
- **Node border**: Green tint indicates it's a trigger node

### Period Trigger
- **Solid green dot**: Trigger is enabled and running
- **Pulsing circle**: Animation shows the trigger is actively running
- **Gray dot**: Trigger is disabled

## Best Practices

1. **Start with Manual Triggers**: Test your strategy flow with manual triggers before automating
2. **Reasonable Intervals**: Don't set period triggers too frequently (avoid < 10 seconds) to prevent overloading
3. **Enable/Disable**: Use the enabled parameter to pause triggers without deleting them
4. **Multiple Strategies**: Use different triggers for different strategies on the same canvas
5. **Save Your Work**: Save your graph with triggers configured for later use

## Tips

- Period triggers continue running even when the node is not selected
- All period triggers are automatically stopped when you clear the canvas
- Trigger execution shows a message indicating how many nodes are connected
- If connected to MT5, triggers will execute the full strategy flow
- You can have multiple triggers connected to the same nodes

## Troubleshooting

**Manual trigger button not appearing?**
- Check that `enabled` is set to "Enabled" in properties

**Period trigger not executing?**
- Verify `enabled` is set to "Enabled"
- Check that interval is a positive number
- Ensure you're connected to MT5 if executing trades

**Trigger executes but nothing happens?**
- Make sure the trigger output is connected to other nodes
- Check that your strategy flow is properly configured
- Verify MT5 connection if executing trades
