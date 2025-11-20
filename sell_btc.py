"""
Script to sell 0.01 BTC with stop loss at 93000 and take profit at 90000
"""

import MetaTrader5 as mt5
import logging
from datetime import datetime

# Set up logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

def sell_btc():
    """Sell 0.01 BTC with stop loss at 93000 and take profit at 90000"""
    
    # Initialize MT5 connection
    if not mt5.initialize():
        logger.error(f"MT5 initialization failed: {mt5.last_error()}")
        return False
    
    logger.info("MT5 initialized successfully")
    
    # Trading parameters
    symbol = "BTCUSD"
    volume = 0.01
    order_type = "SELL"
    stop_loss = 93000.0
    take_profit = 90000.0
    
    # Get symbol info
    symbol_info = mt5.symbol_info(symbol)
    if symbol_info is None:
        logger.error(f"Symbol {symbol} not found")
        mt5.shutdown()
        return False
    
    logger.info(f"Symbol info found: {symbol_info.name}")
    
    # Make sure symbol is visible/selected in Market Watch
    if not symbol_info.visible:
        logger.info(f"Selecting symbol {symbol}")
        if not mt5.symbol_select(symbol, True):
            logger.error(f"Failed to select {symbol}")
            mt5.shutdown()
            return False
    
    # Get current tick data (price)
    tick = mt5.symbol_info_tick(symbol)
    if tick is None:
        logger.error(f"Failed to get tick for {symbol}")
        mt5.shutdown()
        return False
    
    # For SELL orders, use bid price
    price = tick.bid
    logger.info(f"Current price for {symbol}: bid={tick.bid}, ask={tick.ask}, using price={price}")
    
    # Validate stop loss and take profit
    # For SELL orders: SL should be above current price, TP should be below current price
    if stop_loss <= price:
        logger.warning(f"Stop loss ({stop_loss}) should be above current price ({price}) for SELL orders")
    
    if take_profit >= price:
        logger.warning(f"Take profit ({take_profit}) should be below current price ({price}) for SELL orders")
    
    # Normalize prices to symbol's tick size
    tick_size = symbol_info.trade_tick_size
    if tick_size > 0:
        price = round(price / tick_size) * tick_size
        stop_loss = round(stop_loss / tick_size) * tick_size
        take_profit = round(take_profit / tick_size) * tick_size
    
    # Prepare order request
    request = {
        "action": mt5.TRADE_ACTION_DEAL,
        "symbol": symbol,
        "volume": volume,
        "type": mt5.ORDER_TYPE_SELL,
        "price": price,
        "deviation": 20,
        "magic": 234000,
        "type_time": mt5.ORDER_TIME_GTC,
        "type_filling": mt5.ORDER_FILLING_IOC,
        "sl": stop_loss,
        "tp": take_profit,
    }
    
    logger.info(f"Sending SELL order request:")
    logger.info(f"  Symbol: {symbol}")
    logger.info(f"  Volume: {volume}")
    logger.info(f"  Price: {price}")
    logger.info(f"  Stop Loss: {stop_loss}")
    logger.info(f"  Take Profit: {take_profit}")
    
    # Send order
    result = mt5.order_send(request)
    
    if result is None:
        logger.error("Order send returned None - Check MT5 connection and trading permissions")
        mt5.shutdown()
        return False
    
    logger.info(f"Order result: retcode={result.retcode}, comment={result.comment}")
    
    # Check if order was successful
    if result.retcode != mt5.TRADE_RETCODE_DONE:
        error_msg = f"Order failed: {result.comment} (retcode: {result.retcode})"
        logger.error(error_msg)
        mt5.shutdown()
        return False
    
    logger.info(f"Order executed successfully!")
    logger.info(f"  Ticket: {result.order}")
    logger.info(f"  Price: {result.price}")
    logger.info(f"  Volume: {result.volume}")
    logger.info(f"  Stop Loss: {stop_loss}")
    logger.info(f"  Take Profit: {take_profit}")
    
    # Shutdown MT5 connection
    mt5.shutdown()
    return True

if __name__ == "__main__":
    logger.info("Starting BTC sell order script...")
    success = sell_btc()
    
    if success:
        logger.info("Script completed successfully")
    else:
        logger.error("Script failed")
        exit(1)

