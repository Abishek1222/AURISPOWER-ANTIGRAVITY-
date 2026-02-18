import numpy as np
from sklearn.ensemble import IsolationForest

class AnomalyDetector:
    def __init__(self):
        self.model = IsolationForest(contamination=0.1, random_state=42)
        self.is_fitted = False
        self.data_buffer = []

    def _extract_features(self, reading):
        """Extract all 8 numerical features from a reading."""
        return [
            reading['voltage'],
            reading['current'],
            reading['power'],
            reading['temperature'],
            reading['vibration'],
            reading['speed'],
            reading['slip'],
            reading['power_factor'],
        ]

    def train(self, data):
        if len(data) < 50:
            return
        X = np.array(data)
        self.model.fit(X)
        self.is_fitted = True
        print("Anomaly Detector Trained")

    def predict(self, reading):
        """
        Predict if the current reading is an anomaly.
        Returns -1 for anomaly, 1 for normal.
        """
        features = self._extract_features(reading)

        if not self.is_fitted:
            self.data_buffer.append(features)
            if len(self.data_buffer) >= 100:
                self.train(self.data_buffer)
                self.data_buffer = []
            return 1  # Assume normal until trained

        X = np.array([features])
        return self.model.predict(X)[0]
