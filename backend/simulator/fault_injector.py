import random
from typing import Dict, Any

class FaultInjector:
    def __init__(self):
        self.active_fault = None
        self.fault_start_time = 0
        self.fault_types = [
            "Normal",
            "Overload",
            "Loose Connection",
            "Insulation Degradation",
            "Earth Leakage"
        ]

    def set_fault(self, fault_type: str):
        if fault_type in self.fault_types:
            self.active_fault = fault_type
            print(f"Fault Injected: {fault_type}")
        else:
            print(f"Unknown fault type: {fault_type}")

    def clear_fault(self):
        self.active_fault = None
        print("Fault Cleared")

    def apply_fault(self, reading: Dict[str, Any]) -> Dict[str, Any]:
        """
        Modifies the reading based on the active fault.
        """
        if not self.active_fault or self.active_fault == "Normal":
            reading["status"] = "Normal"
            return reading

        reading["status"] = self.active_fault

        if self.active_fault == "Overload":
            # High Current, High Temp, Voltage Drop
            reading["current"] *= random.uniform(1.5, 2.5)
            reading["temperature"] += random.uniform(10, 30)
            reading["voltage"] *= random.uniform(0.9, 0.95)
        
        elif self.active_fault == "Loose Connection":
            # Fluctuating Voltage, Arcing (High Temp spikes)
            if random.random() > 0.5:
                reading["voltage"] *= random.uniform(0.8, 0.9) # Drop
                reading["temperature"] += random.uniform(20, 50) # Heat spike
            
        elif self.active_fault == "Insulation Degradation":
            # Leakage current (simulated as slight current increase w/o load), temp rise over time
            reading["current"] += random.uniform(0.5, 2.0)
            reading["temperature"] += random.uniform(5, 10)

        return reading
