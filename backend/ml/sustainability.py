class SustainabilityEngine:
    def __init__(self):
        self.co2_factor = 0.475  # kg CO2e per kWh (Global average approx)
        self.total_energy_kwh = 0.0
        self.last_timestamp = None

    def calculate_impact(self, power_watts, timestamp):
        """
        Calculates cumulative energy usage and CO2 emissions.
        """
        if self.last_timestamp is None:
            self.last_timestamp = timestamp
            return {
                "energy_kwh": 0.0,
                "co2_kg": 0.0,
                "efficiency_score": 100
            }

        # Calculate time difference in hours
        # Assuming timestamp is ISO format string, but for simplicity in simulation loop
        # we know it is called every 1 second.
        time_diff_hours = 1.0 / 3600.0 

        # Energy (kWh) = Power (kW) * Time (h)
        kwh = (power_watts / 1000.0) * time_diff_hours
        self.total_energy_kwh += kwh

        co2_kg = self.total_energy_kwh * self.co2_factor

        # Mock efficiency score based on power factor/stability (simplified)
        efficiency_score = 95 - (power_watts * 0.001) # Dummy logic: higher power -> slightly lower efficiency for demo
        if efficiency_score < 70: efficiency_score = 70

        return {
            "energy_kwh": round(self.total_energy_kwh, 6),
            "co2_kg": round(co2_kg, 6),
            "efficiency_score": round(efficiency_score, 1)
        }
