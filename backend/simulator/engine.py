import random
import time
import math
from datetime import datetime
from typing import Dict, Any

class ElectricalDataSimulator:
    def __init__(self):
        self.base_voltage = 230.0  # Volts
        self.base_current = 10.0   # Amps
        self.base_temp = 35.0      # Celsius
        self.frequency = 50.0      # Hz
        self.noise_level = 0.05    # 5% random noise

    def generate_reading(self) -> Dict[str, Any]:
        """
        Generates a single time-step of electrical data.
        """
        # Add random noise
        voltage_noise = random.uniform(-self.base_voltage * self.noise_level, self.base_voltage * self.noise_level)
        current_noise = random.uniform(-self.base_current * self.noise_level, self.base_current * self.noise_level)
        temp_noise = random.uniform(-1.0, 1.0)

        voltage = self.base_voltage + voltage_noise
        current = self.base_current + current_noise
        
        # Power Calculation (P = V * I * pf), assuming power factor ~0.9
        power_factor = random.uniform(0.85, 0.95)
        power = voltage * current * power_factor
        
        temperature = self.base_temp + (current * 0.5) + temp_noise # Temp rises with current

        # Motor metrics
        vibration = round(random.uniform(0.5, 3.0), 2)       # mm/s (normal range)
        synchronous_speed = 1500  # RPM for 4-pole, 50Hz motor
        slip = round(random.uniform(2.0, 5.0), 2)            # percentage
        speed = round(synchronous_speed * (1 - slip / 100), 1)  # RPM with slip applied

        return {
            "timestamp": datetime.now().isoformat(),
            "voltage": round(voltage, 2),
            "current": round(current, 2),
            "power": round(power, 2),
            "power_factor": round(power_factor, 3),
            "temperature": round(temperature, 2),
            "frequency": round(self.frequency + random.uniform(-0.1, 0.1), 2),
            "vibration": vibration,
            "slip": slip,
            "speed": speed,
            "status": "Normal" # Default status, will be overridden by fault injector
        }

if __name__ == "__main__":
    sim = ElectricalDataSimulator()
    while True:
        print(sim.generate_reading())
        time.sleep(1)
