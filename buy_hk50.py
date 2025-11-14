"""
Simple script to execute a buy order for 0.5 lots of HK50.cash
when price drops below 26400. Executes once and closes the program
"""

import MetaTrader5 as mt5
import sys
import time

def buy_hk50():
    """Execute buy order for 0.5 lots of HK50.cash when price drops below 26400"""
    
    # Initialize MT5 connection
    if not mt5.initialize():
        print(f"MT5 initialization failed: {mt5.last_error()}")
        sys.exit(1)
    
    print("Connected to MT5 successfully")
    
    # Symbol and order parameters
    symbol = "HK50.cash"
    order_type = "BUY"
    volume = 0.5
    target_price = 26400.0  # Buy when price drops below this
    sl = 0  # No stop loss
    tp = 0  # No take profit
    
    # Get symbol info - this validates the symbol exists
    symbol_info = mt5.symbol_info(symbol)
    if symbol_info is None:
        print(f"Symbol {symbol} not found")
        mt5.shutdown()
        sys.exit(1)
    
    print(f"Symbol info found: {symbol_info.name}, visible: {symbol_info.visible}")
    
    # Make sure symbol is visible/selected in Market Watch
    if not symbol_info.visible:
        print(f"Selecting symbol {symbol}")
        if not mt5.symbol_select(symbol, True):
            print(f"Failed to select {symbol}")
            mt5.shutdown()
            sys.exit(1)
    
    print(f"Monitoring {symbol} - waiting for price to drop below {target_price}")
    print("Press Ctrl+C to cancel")
    
    # Monitor price until it drops below target
    while True:
        # Get current tick data (price)
        tick = mt5.symbol_info_tick(symbol)
        if tick is None:
            print(f"Failed to get tick for {symbol}")
            mt5.shutdown()
            sys.exit(1)
        
        current_price = tick.bid  # Use bid price for buy orders (price we can buy at)
        
        # Print current status
        print(f"Current price: {current_price} (target: < {target_price})", end='\r')
        
        # Check if price has dropped below target
        if current_price < target_price:
            print(f"\nPrice dropped below {target_price}! Current price: {current_price}")
            break
        
        # Wait before checking again (check every second)
        time.sleep(1)
    
    # Price condition met - get fresh tick data for order execution
    tick = mt5.symbol_info_tick(symbol)
    if tick is None:
        print(f"Failed to get tick for {symbol}")
        mt5.shutdown()
        sys.exit(1)
    
    # Use ask price for the actual buy order
    price = tick.ask
    print(f"Executing buy order at ask price: {price}")
    
    # Prepare order request
    request = {
        "action": mt5.TRADE_ACTION_DEAL,
        "symbol": symbol,
        "volume": volume,
        "type": mt5.ORDER_TYPE_BUY,
        "price": price,
        "deviation": 20,
        "magic": 234000,
        "type_time": mt5.ORDER_TIME_GTC,
        "type_filling": mt5.ORDER_FILLING_IOC,
    }
    
    # Add SL/TP only if specified
    if sl and sl > 0:
        request["sl"] = sl
    if tp and tp > 0:
        request["tp"] = tp
    
    print(f"Executing order: {symbol} {order_type} {volume} lots")
    print(f"Sending order request: {request}")
    
    # Send order
    result = mt5.order_send(request)
    
    if result is None:
        print("Order send returned None - Check MT5 connection and trading permissions")
        mt5.shutdown()
        sys.exit(1)
    
    print(f"Order result: retcode={result.retcode}, comment={result.comment}")
    
    # Check if order was successful
    if result.retcode != mt5.TRADE_RETCODE_DONE:
        error_msg = f"Order failed: {result.comment} (retcode: {result.retcode})"
        print(error_msg)
        mt5.shutdown()
        sys.exit(1)
    
    print(f"Order executed successfully!")
    print(f"  Ticket: {result.order}")
    print(f"  Price: {result.price}")
    print(f"  Volume: {volume} lots")
    print(f"  Symbol: {symbol}")
    
    # Shutdown MT5 connection
    mt5.shutdown()
    print("MT5 connection closed")
    print("Program completed successfully")

if __name__ == "__main__":
    try:
        buy_hk50()
    except KeyboardInterrupt:
        print("\n\nMonitoring cancelled by user")
        mt5.shutdown()
        print("MT5 connection closed")
        sys.exit(0)

