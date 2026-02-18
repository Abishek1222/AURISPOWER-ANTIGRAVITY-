import random
from typing import Dict, Any

class FaultInjector:
    def __init__(self):
        self.active_fault = None

    def set_fault(self, fault_type: str):
        self.active_fault = fault_type
        print(f"Manual Fault Override: {fault_type}")

    def clear_fault(self):
        self.active_fault = None
        print("Manual Fault Override Cleared")

    def apply_fault(self, reading: Dict[str, Any]) -> Dict[str, Any]:
        """
        If a manual fault is active, override the dataset's status.
        Otherwise, keep the dataset's own Fault_Type as-is.
        """
        if not self.active_fault:
            # No manual override — dataset status passes through untouched
            return reading

        # Manual override active — set status and distort readings
        reading["status"] = self.active_fault

        if self.active_fault == "Overvoltage":
            reading["voltage"] *= random.uniform(1.1, 1.2)
        elif self.active_fault == "Undervoltage":
            reading["voltage"] *= random.uniform(0.75, 0.85)
        elif self.active_fault == "Overcurrent":
            reading["current"] *= random.uniform(1.5, 2.5)
            reading["temperature"] += random.uniform(10, 30)
        elif self.active_fault == "Bearing Inner Race Fault":
            reading["vibration"] = round(random.uniform(6.0, 10.0), 2)
            reading["speed"] *= random.uniform(0.85, 0.95)
        elif self.active_fault == "Stator Winding Fault":
            reading["current"] *= random.uniform(1.3, 1.8)
            reading["power_factor"] = round(random.uniform(0.4, 0.6), 3)
        elif self.active_fault == "Rotor Bar Fault":
            reading["slip"] = round(random.uniform(10, 20), 2)
            reading["speed"] *= random.uniform(0.8, 0.9)
            reading["vibration"] = round(random.uniform(5.0, 9.0), 2)

        return reading
