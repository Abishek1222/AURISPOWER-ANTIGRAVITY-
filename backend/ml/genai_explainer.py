class GenAIExplainer:
    def __init__(self):
        self.explanations = {
            "Normal Operation": {
                "title": "System Healthy",
                "message": "All parameters are within normal operating ranges.",
                "risk_score": 10,
                "type": "success"
            },
            "Undervoltage": {
                "title": "Undervoltage Detected",
                "message": "Supply voltage has dropped below nominal levels. This can cause motors to draw excess current, leading to overheating. Check supply transformer and grid stability.",
                "risk_score": 70,
                "type": "warning"
            },
            "Overvoltage": {
                "title": "Overvoltage Detected",
                "message": "Supply voltage exceeds safe limits. Risk of insulation stress and component damage. Inspect voltage regulator and grid connection.",
                "risk_score": 75,
                "type": "warning"
            },
            "Voltage Unbalance": {
                "title": "Voltage Unbalance Detected",
                "message": "Phase voltages are unbalanced, causing negative-sequence currents. This leads to motor heating and torque pulsations. Check phase connections.",
                "risk_score": 65,
                "type": "warning"
            },
            "Overcurrent": {
                "title": "Overcurrent Alert",
                "message": "Current draw exceeds rated limits. Risk of thermal runaway and winding damage. Reduce load or check for mechanical binding.",
                "risk_score": 90,
                "type": "critical"
            },
            "Single Phasing": {
                "title": "Single Phasing Detected",
                "message": "One supply phase appears lost. Motor running on two phases with severe current imbalance. Immediate shutdown recommended to prevent winding burnout.",
                "risk_score": 95,
                "type": "critical"
            },
            "Stator Winding Fault": {
                "title": "Stator Winding Fault",
                "message": "Abnormal current patterns suggest inter-turn short or ground fault in stator windings. Schedule immediate inspection and insulation testing.",
                "risk_score": 85,
                "type": "critical"
            },
            "Rotor Bar Fault": {
                "title": "Rotor Bar Fault",
                "message": "Elevated slip and vibration indicate broken or cracked rotor bars. Motor efficiency is degraded. Plan maintenance before catastrophic failure.",
                "risk_score": 80,
                "type": "warning"
            },
            "Insulation Breakdown": {
                "title": "Insulation Breakdown",
                "message": "Leakage current and thermal signatures indicate insulation degradation. Risk of ground fault and arc flash. Perform insulation resistance test.",
                "risk_score": 85,
                "type": "critical"
            },
            "Bearing Inner Race Fault": {
                "title": "Bearing Fault Detected",
                "message": "High-frequency vibration signature matches bearing inner race defect. Continued operation risks seizure. Replace bearing at next maintenance window.",
                "risk_score": 75,
                "type": "warning"
            },
        }

    def explain(self, reading, anomaly_score, status):
        """
        Returns explanation based on the dataset's fault type.
        Falls back to ML anomaly detection if status is normal but ML detects deviation.
        """
        # Check if we have a specific explanation for this fault type
        if status in self.explanations:
            explanation = self.explanations[status].copy()
            # Enrich with actual reading values
            explanation["message"] += f" (V={reading['voltage']}V, I={reading['current']}A, PF={reading['power_factor']})"
            return explanation

        # ML-detected anomaly with unknown status
        if anomaly_score == -1:
            return {
                "title": f"Unusual Pattern: {status}",
                "message": f"AI detected deviation from normal. Status: {status}. Monitor closely.",
                "risk_score": 50,
                "type": "info"
            }

        # Default fallback
        return self.explanations["Normal Operation"].copy()
