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
        All distortion ranges are derived from the dataset:
          Voltage: 341–479V, Current: 8–30A, Power: 4–12kW,
          Temperature: 55–160°C, Vibration: 0.8–10mm/s,
          Speed: 1101–1470RPM, Slip: 0.02–0.27, PF: 0.40–0.92
        """
        if not self.active_fault:
            return reading

        reading["status"] = self.active_fault

        # --- Voltage faults ---
        if self.active_fault == "Overvoltage":
            reading["voltage"] = round(random.uniform(450, 479), 2)
        elif self.active_fault == "Undervoltage":
            reading["voltage"] = round(random.uniform(341, 370), 2)
        elif self.active_fault == "Voltage Unbalance":
            reading["voltage"] *= random.uniform(0.85, 0.95)
            reading["power_factor"] = round(random.uniform(0.55, 0.70), 3)
        elif self.active_fault == "Voltage Unbalance with Rotor Fault":
            reading["voltage"] *= random.uniform(0.85, 0.95)
            reading["vibration"] = round(random.uniform(5.0, 8.0), 2)
            reading["slip"] = round(random.uniform(10, 18), 2)
            reading["speed"] *= random.uniform(0.85, 0.92)

        # --- Current faults ---
        elif self.active_fault == "Overcurrent":
            reading["current"] = round(random.uniform(22, 30), 2)
            reading["temperature"] += random.uniform(15, 35)
        elif self.active_fault == "Single Phasing":
            reading["current"] = round(random.uniform(25, 30), 2)
            reading["voltage"] *= random.uniform(0.6, 0.75)
            reading["power_factor"] = round(random.uniform(0.40, 0.55), 3)

        # --- Stator faults ---
        elif self.active_fault == "Stator Winding Fault":
            reading["current"] *= random.uniform(1.3, 1.8)
            reading["power_factor"] = round(random.uniform(0.40, 0.60), 3)
        elif self.active_fault == "Stator Overheating":
            reading["temperature"] = round(random.uniform(130, 160), 2)
            reading["current"] *= random.uniform(1.1, 1.3)

        # --- Rotor faults ---
        elif self.active_fault == "Rotor Bar Fault":
            reading["slip"] = round(random.uniform(10, 20), 2)
            reading["speed"] *= random.uniform(0.80, 0.90)
            reading["vibration"] = round(random.uniform(5.0, 9.0), 2)
        elif self.active_fault == "Rotor Imbalance":
            reading["vibration"] = round(random.uniform(6.0, 10.0), 2)
            reading["speed"] *= random.uniform(0.90, 0.97)

        # --- Insulation faults ---
        elif self.active_fault == "Insulation Breakdown":
            reading["current"] *= random.uniform(1.2, 1.6)
            reading["temperature"] += random.uniform(20, 40)
            reading["power_factor"] = round(random.uniform(0.45, 0.60), 3)
        elif self.active_fault == "Insulation Breakdown with Ground Leakage":
            reading["current"] *= random.uniform(1.4, 2.0)
            reading["temperature"] += random.uniform(25, 50)
            reading["power_factor"] = round(random.uniform(0.40, 0.55), 3)
            reading["voltage"] *= random.uniform(0.75, 0.85)

        # --- Bearing faults ---
        elif self.active_fault == "Bearing Inner Race Fault":
            reading["vibration"] = round(random.uniform(6.0, 10.0), 2)
            reading["speed"] *= random.uniform(0.88, 0.95)
        elif self.active_fault == "Bearing Outer Race Fault":
            reading["vibration"] = round(random.uniform(5.5, 9.0), 2)
            reading["speed"] *= random.uniform(0.90, 0.96)
        elif self.active_fault == "Bearing Fault with Speed Drop":
            reading["vibration"] = round(random.uniform(6.0, 10.0), 2)
            reading["speed"] = round(random.uniform(1101, 1250), 2)
            reading["slip"] = round(random.uniform(12, 20), 2)
        elif self.active_fault == "Bearing Overheating":
            reading["temperature"] = round(random.uniform(130, 160), 2)
            reading["vibration"] = round(random.uniform(5.0, 8.0), 2)

        # --- Mechanical faults ---
        elif self.active_fault == "Mechanical Overload":
            reading["current"] = round(random.uniform(22, 30), 2)
            reading["power"] = round(random.uniform(9, 12), 2)
            reading["temperature"] += random.uniform(15, 30)
        elif self.active_fault == "Overload with Overheating":
            reading["current"] = round(random.uniform(24, 30), 2)
            reading["power"] = round(random.uniform(10, 12), 2)
            reading["temperature"] = round(random.uniform(140, 160), 2)
        elif self.active_fault == "Shaft Misalignment":
            reading["vibration"] = round(random.uniform(5.0, 9.0), 2)
            reading["speed"] *= random.uniform(0.92, 0.98)
            reading["power_factor"] = round(random.uniform(0.55, 0.70), 3)

        # --- System-level faults ---
        elif self.active_fault == "Cooling Failure":
            reading["temperature"] = round(random.uniform(135, 160), 2)
        elif self.active_fault == "Electrical and Mechanical Combined Failure":
            reading["voltage"] *= random.uniform(0.75, 0.85)
            reading["current"] *= random.uniform(1.5, 2.0)
            reading["vibration"] = round(random.uniform(7.0, 10.0), 2)
            reading["temperature"] += random.uniform(25, 45)
            reading["power_factor"] = round(random.uniform(0.40, 0.55), 3)
        elif self.active_fault == "Catastrophic System Failure":
            reading["voltage"] = round(random.uniform(341, 360), 2)
            reading["current"] = round(random.uniform(26, 30), 2)
            reading["power"] = round(random.uniform(10, 12), 2)
            reading["temperature"] = round(random.uniform(145, 160), 2)
            reading["vibration"] = round(random.uniform(8.0, 10.0), 2)
            reading["speed"] = round(random.uniform(1101, 1200), 2)
            reading["slip"] = round(random.uniform(18, 26.6), 2)
            reading["power_factor"] = round(random.uniform(0.40, 0.50), 3)

        # Round any float overrides
        for key in ['voltage', 'current', 'power', 'temperature']:
            if key in reading:
                reading[key] = round(float(reading[key]), 2)

        return reading
