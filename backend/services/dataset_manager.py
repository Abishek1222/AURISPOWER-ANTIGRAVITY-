import os
import pandas as pd
from datetime import datetime

# Required columns that any uploaded dataset must have
REQUIRED_COLUMNS = [
    'Voltage (V)', 'Current (A)', 'Power (kW)', 'Temperature (°C)',
    'Vibration (mm/s)', 'Speed (RPM)', 'Slip', 'Power Factor', 'Fault_Type'
]

DATASETS_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 'Datasets')


class DatasetManager:
    """Manages dataset uploads, validation, and metadata."""

    def __init__(self):
        self.current_file = 'Industrial_MultiClass_Dataset_With_Slip.xlsx'
        self.upload_time = None
        self._cache_metadata()

    def _cache_metadata(self):
        """Load metadata about the current dataset."""
        path = os.path.join(DATASETS_DIR, self.current_file)
        try:
            df = self._read_file(path)
            self.row_count = len(df)
            self.fault_types = sorted(df['Fault_Type'].unique().tolist())
            self.columns = list(df.columns)
            self.preview = df.head(5).to_dict(orient='records')
        except Exception:
            self.row_count = 0
            self.fault_types = []
            self.columns = []
            self.preview = []

    @staticmethod
    def _read_file(path: str) -> pd.DataFrame:
        """Read Excel or CSV based on extension."""
        if path.endswith('.csv'):
            return pd.read_csv(path)
        return pd.read_excel(path)

    def validate_and_save(self, file_bytes: bytes, filename: str) -> dict:
        """
        Validates an uploaded file and saves it to the Datasets folder.
        Returns metadata dict on success, raises ValueError on failure.
        """
        # Determine format
        ext = os.path.splitext(filename)[1].lower()
        if ext not in ('.xlsx', '.xls', '.csv'):
            raise ValueError(f"Unsupported file type: {ext}. Use .xlsx or .csv")

        # Save to temp first, then validate
        save_path = os.path.join(DATASETS_DIR, filename)
        with open(save_path, 'wb') as f:
            f.write(file_bytes)

        # Validate columns
        try:
            df = self._read_file(save_path)
        except Exception as e:
            os.remove(save_path)
            raise ValueError(f"Cannot read file: {e}")

        missing = [c for c in REQUIRED_COLUMNS if c not in df.columns]
        if missing:
            os.remove(save_path)
            raise ValueError(f"Missing required columns: {missing}")

        # Update state
        self.current_file = filename
        self.upload_time = datetime.now().isoformat()
        self._cache_metadata()

        return self.get_info()

    def reset(self):
        """Revert to the default dataset."""
        self.current_file = 'Industrial_MultiClass_Dataset_With_Slip.xlsx'
        self.upload_time = None
        self._cache_metadata()
        return self.get_info()

    def get_current_path(self) -> str:
        return os.path.join(DATASETS_DIR, self.current_file)

    def get_info(self) -> dict:
        return {
            "filename": self.current_file,
            "rows": self.row_count,
            "columns": self.columns,
            "fault_types": self.fault_types,
            "fault_type_count": len(self.fault_types),
            "upload_time": self.upload_time,
            "preview": self.preview,
        }
