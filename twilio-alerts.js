/**
 * Twilio Alert Service for MT5 Trading Application
 * Sends SMS/WhatsApp notifications for take profit and other trading events
 */

const twilio = require('twilio');

class TwilioAlerts {
  constructor(accountSid = null, authToken = null, fromNumber = null) {
    /**
     * Initialize Twilio client
     * 
     * @param {string} accountSid - Twilio Account SID
     * @param {string} authToken - Twilio Auth Token
     * @param {string} fromNumber - Twilio phone number
     */
    this.accountSid = accountSid;
    this.authToken = authToken;
    this.fromNumber = fromNumber;
    
    if (!accountSid || !authToken || !fromNumber) {
      console.warn("Twilio credentials not fully configured. Alerts will be disabled.");
      this.client = null;
      this.enabled = false;
    } else {
      try {
        this.client = twilio(accountSid, authToken);
        this.enabled = true;
        console.log("Twilio client initialized successfully");
      } catch (error) {
        console.error(`Failed to initialize Twilio client: ${error}`);
        this.client = null;
        this.enabled = false;
      }
    }
  }
  
  isEnabled() {
    /**Check if Twilio alerts are enabled and configured*/
    return this.enabled && this.client !== null;
  }
  
  async sendSMS(toNumber, message) {
    /**
     * Send SMS notification
     * 
     * @param {string} toNumber - Recipient phone number (e.g., '+1234567890')
     * @param {string} message - Message content
     * @returns {Promise<Object>} Dict with success status and message details
     */
    if (!this.isEnabled()) {
      return { success: false, error: "Twilio not configured" };
    }
    
    try {
      const messageObj = await this.client.messages.create({
        body: message,
        from: this.fromNumber,
        to: toNumber
      });
      
      console.log(`SMS sent successfully to ${toNumber}, SID: ${messageObj.sid}`);
      return {
        success: true,
        sid: messageObj.sid,
        status: messageObj.status,
        message: "SMS sent successfully"
      };
      
    } catch (error) {
      console.error(`Failed to send SMS to ${toNumber}: ${error}`);
      return { success: false, error: error.message };
    }
  }
  
  async sendWhatsApp(toNumber, message) {
    /**
     * Send WhatsApp notification
     * 
     * @param {string} toNumber - Recipient WhatsApp number (e.g., 'whatsapp:+1234567890')
     * @param {string} message - Message content
     * @returns {Promise<Object>} Dict with success status and message details
     */
    if (!this.isEnabled()) {
      return { success: false, error: "Twilio not configured" };
    }
    
    // Ensure WhatsApp format
    if (!toNumber.startsWith('whatsapp:')) {
      toNumber = `whatsapp:${toNumber}`;
    }
    
    const fromWhatsApp = `whatsapp:${this.fromNumber}`;
    
    try {
      const messageObj = await this.client.messages.create({
        body: message,
        from: fromWhatsApp,
        to: toNumber
      });
      
      console.log(`WhatsApp sent successfully to ${toNumber}, SID: ${messageObj.sid}`);
      return {
        success: true,
        sid: messageObj.sid,
        status: messageObj.status,
        message: "WhatsApp sent successfully"
      };
      
    } catch (error) {
      console.error(`Failed to send WhatsApp to ${toNumber}: ${error}`);
      return { success: false, error: error.message };
    }
  }
  
  async sendTakeProfitAlert(positionData, toNumber, method = "sms") {
    /**
     * Send take profit alert notification
     * 
     * @param {Object} positionData - Dictionary containing position information
     * @param {string} toNumber - Recipient phone number
     * @param {string} method - 'sms' or 'whatsapp'
     * @returns {Promise<Object>} Dict with success status and message details
     */
    try {
      // Format the alert message
      const symbol = positionData.symbol || 'Unknown';
      const ticket = positionData.ticket || 'Unknown';
      const profit = positionData.profit || 0;
      const volume = positionData.volume || 0;
      const orderType = positionData.type || 'Unknown';
      const takeProfit = positionData.take_profit || 0;
      const currentPrice = positionData.current_price || 0;
      
      const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
      
      const message = `🎯 TAKE PROFIT HIT!

Symbol: ${symbol}
Ticket: ${ticket}
Type: ${orderType}
Volume: ${volume}
Profit: $${profit.toFixed(2)}
TP Level: ${takeProfit}
Current Price: ${currentPrice}

Time: ${timestamp}

MT5 Trader Alert`;
      
      if (method.toLowerCase() === "whatsapp") {
        return await this.sendWhatsApp(toNumber, message);
      } else {
        return await this.sendSMS(toNumber, message);
      }
      
    } catch (error) {
      console.error(`Failed to send take profit alert: ${error}`);
      return { success: false, error: error.message };
    }
  }
  
  async sendStopLossAlert(positionData, toNumber, method = "sms") {
    /**
     * Send stop loss alert notification
     * 
     * @param {Object} positionData - Dictionary containing position information
     * @param {string} toNumber - Recipient phone number
     * @param {string} method - 'sms' or 'whatsapp'
     * @returns {Promise<Object>} Dict with success status and message details
     */
    try {
      const symbol = positionData.symbol || 'Unknown';
      const ticket = positionData.ticket || 'Unknown';
      const profit = positionData.profit || 0;
      const volume = positionData.volume || 0;
      const orderType = positionData.type || 'Unknown';
      const stopLoss = positionData.stop_loss || 0;
      const currentPrice = positionData.current_price || 0;
      
      const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
      
      const message = `🛑 STOP LOSS HIT!

Symbol: ${symbol}
Ticket: ${ticket}
Type: ${orderType}
Volume: ${volume}
Loss: $${profit.toFixed(2)}
SL Level: ${stopLoss}
Current Price: ${currentPrice}

Time: ${timestamp}

MT5 Trader Alert`;
      
      if (method.toLowerCase() === "whatsapp") {
        return await this.sendWhatsApp(toNumber, message);
      } else {
        return await this.sendSMS(toNumber, message);
      }
      
    } catch (error) {
      console.error(`Failed to send stop loss alert: ${error}`);
      return { success: false, error: error.message };
    }
  }
  
  async sendPositionOpenedAlert(positionData, toNumber, method = "sms") {
    /**
     * Send position opened alert notification
     * 
     * @param {Object} positionData - Dictionary containing position information
     * @param {string} toNumber - Recipient phone number
     * @param {string} method - 'sms' or 'whatsapp'
     * @returns {Promise<Object>} Dict with success status and message details
     */
    try {
      const symbol = positionData.symbol || 'Unknown';
      const ticket = positionData.ticket || 'Unknown';
      const volume = positionData.volume || 0;
      const orderType = positionData.type || 'Unknown';
      const openPrice = positionData.price || positionData.open_price || 0;
      const stopLoss = positionData.sl || positionData.stop_loss || 0;
      const takeProfit = positionData.tp || positionData.take_profit || 0;
      
      const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
      
      const message = `📈 POSITION OPENED!

Symbol: ${symbol}
Ticket: ${ticket}
Type: ${orderType}
Volume: ${volume}
Entry Price: ${openPrice}
Stop Loss: ${stopLoss > 0 ? stopLoss : 'None'}
Take Profit: ${takeProfit > 0 ? takeProfit : 'None'}

Time: ${timestamp}

MT5 Trader Alert`;
      
      if (method.toLowerCase() === "whatsapp") {
        return await this.sendWhatsApp(toNumber, message);
      } else {
        return await this.sendSMS(toNumber, message);
      }
      
    } catch (error) {
      console.error(`Failed to send position opened alert: ${error}`);
      return { success: false, error: error.message };
    }
  }
  
  async sendCustomAlert(message, toNumber, method = "sms") {
    /**
     * Send custom alert message
     * 
     * @param {string} message - Custom message content
     * @param {string} toNumber - Recipient phone number
     * @param {string} method - 'sms' or 'whatsapp'
     * @returns {Promise<Object>} Dict with success status and message details
     */
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const formattedMessage = `${message}\n\nTime: ${timestamp}\nMT5 Trader Alert`;
    
    if (method.toLowerCase() === "whatsapp") {
      return await this.sendWhatsApp(toNumber, formattedMessage);
    } else {
      return await this.sendSMS(toNumber, formattedMessage);
    }
  }
}

module.exports = TwilioAlerts;

