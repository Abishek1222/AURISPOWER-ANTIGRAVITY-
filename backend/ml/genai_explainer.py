class GenAIExplainer:
    def __init__(self):
        self.risk_threshold = 0.7

    def explain(self, reading, anomaly_score, status):
        """
        Generates a human-readable explanation and preventive advice.
        """
        explanation = {
            "title": "System Healthy",
            "message": "All parameters are within normal operating ranges.",
            "risk_score": 10,
            "type": "success"
        }

        if status == 'Overload':
            explanation = {
                "title": "Critical Overload Detected",
                "message": f"Current usage ({reading['current']}A) exceeds safe limits. Risk of thermal runaway. Reduce load immediately.",
                "risk_score": 95,
                "type": "critical"
            }
        elif status == 'Loose Connection':
            explanation = {
                "title": "Loose Connection Suspected",
                "message": "Irregular voltage fluctuations detected. This often indicates a loose wire terminating at the breaker. Inspect immediately to prevent arcing.",
                "risk_score": 85,
                "type": "warning"
            }
        elif status == 'Insulation Degradation':
            explanation = {
                "title": "Insulation Breakdown",
                "message": "Leakage current is rising slowly. Insulation may be degrading due to heat or age. Schedule maintenance check.",
                "risk_score": 60,
                "type": "warning"
            }
        elif anomaly_score == -1: # Metadata anomaly detected by ML
            explanation = {
                "title": "Unusual Pattern Detected",
                "message": "AI has detected a deviation from normal operating patterns. Monitor system closely for potential developing faults.",
                "risk_score": 45,
                "type": "info"
            }

        return explanation
