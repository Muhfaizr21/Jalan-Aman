"""Konfigurasi dan Hyperparameter Sistem AI JalanAman.

Clean Code: Terpusat, strongly-typed, dan mendukung override via environment variable.
"""

import os
from dataclasses import dataclass
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

@dataclass
class AISettings:
    # 1. Parameter DBSCAN Spatial Clustering
    dbscan_eps_km: float = float(os.getenv("DBSCAN_EPS_KM", "0.35"))  # Radius 350m
    dbscan_min_samples: int = int(os.getenv("DBSCAN_MIN_SAMPLES", "4"))
    metric: str = "haversine"

    # 2. Parameter Random Forest Classifier
    rf_n_estimators: int = int(os.getenv("RF_N_ESTIMATORS", "100"))
    rf_max_depth: int = int(os.getenv("RF_MAX_DEPTH", "15"))
    rf_random_state: int = 42
    rf_test_size: float = 0.2

    # 3. Path Direktori Model & Data
    data_raw_dir: Path = BASE_DIR / "data" / "raw"
    data_processed_dir: Path = BASE_DIR / "data" / "processed"
    models_registry_dir: Path = BASE_DIR / "models" / "registry"

    # 4. Routing Engine Defaults
    risk_penalty_multiplier: float = 2.5  # Bobot penalti segmen merah pada A*

def get_settings() -> AISettings:
    return AISettings()
