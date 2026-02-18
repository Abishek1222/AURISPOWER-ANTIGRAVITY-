import logging
from datetime import datetime

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("NotificationService")

class NotificationService:
    def __init__(self):
        self.recipients = {
            "critical": ["admin@aurispower.com", "technician@aurispower.com"],
            "warning": ["supervisor@aurispower.com"],
        }
        self.alert_history = []
        self.max_history = 200  # Keep last 200 notifications

    def send_alert(self, severity, message, zone_name):
        """
        Simulates sending a notification and stores it in history.
        """
        recipients = self.recipients.get(severity, ["admin@aurispower.com"])
        
        notification = {
            "id": len(self.alert_history),
            "timestamp": datetime.now().isoformat(),
            "severity": severity,
            "zone": zone_name,
            "message": message,
            "recipients": recipients,
            "channel": "Email/SMS" if severity == "critical" else "Email",
        }

        self.alert_history.insert(0, notification)
        if len(self.alert_history) > self.max_history:
            self.alert_history = self.alert_history[:self.max_history]

        if severity == "critical":
            logger.error(f"[CRITICAL] Zone: {zone_name} | {message} | Sent to: {recipients}")
        else:
            logger.warning(f"[WARNING] Zone: {zone_name} | {message} | Sent to: {recipients}")

    def get_history(self):
        """Returns all stored notification history."""
        return self.alert_history

    def get_stats(self):
        """Returns summary stats about notifications."""
        total = len(self.alert_history)
        critical = sum(1 for n in self.alert_history if n["severity"] == "critical")
        warning = total - critical
        zones = {}
        for n in self.alert_history:
            zones[n["zone"]] = zones.get(n["zone"], 0) + 1
        return {
            "total": total,
            "critical": critical,
            "warning": warning,
            "by_zone": zones,
        }
