import numpy as np
from sklearn.ensemble import IsolationForest
import joblib
import os

class AnomalyDetector:
    def __init__(self):
        self.model = IsolationForest(contamination=0.1, random_state=42)
        self.is_fitted = False
        self.data_buffer = []

    def train(self, data):
        """
        Train the model with historical data.
        data: list of [voltage, current, power, temperature]
        """
        if len(data) < 50:
            return # Not enough data to train
        
        X = np.array(data)
        self.model.fit(X)
        self.is_fitted = True
        print("Anomaly Detector Trained")

    def predict(self, reading):
        """
        Predict if the current reading is an anomaly.
        Returns -1 for anomaly, 1 for normal.
        """
        if not self.is_fitted:
            # Buffer data for initial training
            self.data_buffer.append([
                reading['voltage'], 
                reading['current'], 
                reading['power'], 
                reading['temperature']
            ])
            
            if len(self.data_buffer) >= 100:
                self.train(self.data_buffer)
                self.data_buffer = [] # Clear buffer after training
            
            return 1 # Assume normal until trained

        X = np.array([[
            reading['voltage'], 
            reading['current'], 
            reading['power'], 
            reading['temperature']
        ]])
        
        return self.model.predict(X)[0]
