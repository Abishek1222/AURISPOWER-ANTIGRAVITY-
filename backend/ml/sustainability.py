class SustainabilityEngine:
    def __init__(self):
        self.co2_factor = 0.475  # kg CO2e per kWh (Global average approx)
        self.total_energy_kwh = 0.0
        self.last_timestamp = None

    def calculate_impact(self, power_kw, timestamp, power_factor=None):
        """
        Calculates cumulative energy usage and CO2 emissions.
        power_kw: power in kilowatts (dataset already provides kW)
        power_factor: from the dataset (range 0.40–0.92), used for efficiency
        """
        if self.last_timestamp is None:
            self.last_timestamp = timestamp
            return {
                "energy_kwh": 0.0,
                "co2_kg": 0.0,
                "efficiency_score": round((power_factor or 0.85) * 100, 1)
            }

        # Each call ~1 second apart
        time_diff_hours = 1.0 / 3600.0

        # Energy (kWh) = Power (kW) * Time (h)
        kwh = power_kw * time_diff_hours
        self.total_energy_kwh += kwh

        co2_kg = self.total_energy_kwh * self.co2_factor

        # Efficiency derived from the dataset's actual Power Factor
        efficiency_score = round((power_factor or 0.85) * 100, 1)

        return {
            "energy_kwh": round(self.total_energy_kwh, 6),
            "co2_kg": round(co2_kg, 6),
            "efficiency_score": efficiency_score
        }
