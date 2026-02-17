import logging

# Configure logging to simulate "sending" notifications
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("NotificationService")

class NotificationService:
    def __init__(self):
        self.recipients = ["admin@aurispower.com", "technician@aurispower.com"]
        self.alert_history = []

    def send_alert(self, severity, message, zone_name):
        """
        Simulates sending an notification via Email/SMS.
        In a real system, this would use SMTP or Twilio API.
        """
        if severity == "critical":
            self._send_critical_alert(message, zone_name)
        elif severity == "warning":
            self._send_warning_alert(message, zone_name)
    
    def _send_critical_alert(self, message, zone_name):
        content = f"[CRITICAL ALERT] Zone: {zone_name} | Message: {message} | Sent to: {self.recipients}"
        logger.error(content)
        print(f"\n>>> 🚨 NOTIFICATION SENT: {content}\n") # Force print to console for demo
        self.alert_history.append({"timestamp": "now", "type": "Email/SMS", "content": content})

    def _send_warning_alert(self, message, zone_name):
        content = f"[WARNING] Zone: {zone_name} | Message: {message} | Sent to: Manager"
        logger.warning(content)
        print(f"\n>>> ⚠️ NOTIFICATION SENT: {content}\n")
