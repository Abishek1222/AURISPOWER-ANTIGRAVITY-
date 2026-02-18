import pandas as pd
import random
import os
from datetime import datetime
from typing import Dict, Any

# Path to the dataset: engine.py → simulator/ → backend/ → project root → Datasets/
DATASET_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 
                            'Datasets', 'Industrial_MultiClass_Dataset_With_Slip.xlsx')

class DatasetReplayEngine:
    """
    Replays rows from the real industrial dataset instead of generating random data.
    Cycles through the dataset continuously, one row per call.
    """
    def __init__(self, offset: int = 0):
        self.df = pd.read_excel(DATASET_PATH)
        self.index = offset % len(self.df)
        self.total_rows = len(self.df)

    def generate_reading(self) -> Dict[str, Any]:
        """
        Returns the next row from the dataset as a reading dict.
        Loops back to start when the dataset is exhausted.
        """
        row = self.df.iloc[self.index]
        self.index = (self.index + 1) % self.total_rows

        return {
            "timestamp": datetime.now().isoformat(),
            "voltage": round(float(row['Voltage (V)']), 2),
            "current": round(float(row['Current (A)']), 2),
            "power": round(float(row['Power (kW)']), 2),
            "temperature": round(float(row['Temperature (°C)']), 2),
            "vibration": round(float(row['Vibration (mm/s)']), 2),
            "speed": round(float(row['Speed (RPM)']), 1),
            "slip": round(float(row['Slip']) * 100, 2),        # Convert fraction → percentage
            "power_factor": round(float(row['Power Factor']), 3),
            "frequency": round(50.0 + random.uniform(-0.1, 0.1), 2),  # Simulated grid freq
            "status": str(row['Fault_Type']),
            "combination": str(row['Combination']),
        }


# Keep backward-compatible alias
ElectricalDataSimulator = DatasetReplayEngine
