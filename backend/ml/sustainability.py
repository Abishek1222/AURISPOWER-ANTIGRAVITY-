class SustainabilityEngine:
    def __init__(self):
        self.co2_factor = 0.475  # kg CO2e per kWh (Global average approx)
        self.total_energy_kwh = 0.0
        self.last_timestamp = None

    def calculate_impact(self, power_kw, timestamp):
        """
        Calculates cumulative energy usage and CO2 emissions.
        power_kw: power in kilowatts (dataset already provides kW)
        """
        if self.last_timestamp is None:
            self.last_timestamp = timestamp
            return {
                "energy_kwh": 0.0,
                "co2_kg": 0.0,
                "efficiency_score": 100
            }

        # Each call ~1 second apart
        time_diff_hours = 1.0 / 3600.0

        # Energy (kWh) = Power (kW) * Time (h)
        kwh = power_kw * time_diff_hours
        self.total_energy_kwh += kwh

        co2_kg = self.total_energy_kwh * self.co2_factor

        # Efficiency based on actual power draw vs nominal
        efficiency_score = max(70, 95 - (power_kw * 1.5))

        return {
            "energy_kwh": round(self.total_energy_kwh, 6),
            "co2_kg": round(co2_kg, 6),
            "efficiency_score": round(efficiency_score, 1)
        }
