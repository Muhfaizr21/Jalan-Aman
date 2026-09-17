"""Pipeline Pelatihan Random Forest Classifier untuk Risiko Segmen Jalan."""

import json
import time
from pathlib import Path
from typing import Dict, Any, Tuple
import joblib
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split

from config.settings import get_settings
from .evaluator import ModelEvaluator

class RiskModelTrainer:
    """Melatih dan mengevaluasi model Random Forest untuk klasifikasi tingkat bahaya jalan."""

    FEATURE_NAMES = [
        "incident_density_radius",
        "lighting_quality_score",
        "road_width_and_class",
        "time_window_risk",
        "police_historical_rate",
        "user_feedback_score",
    ]

    def __init__(self, n_estimators: int = 100, max_depth: int = 15, random_state: int = 42):
        self.settings = get_settings()
        self.n_estimators = n_estimators
        self.max_depth = max_depth
        self.random_state = random_state
        self.model = RandomForestClassifier(
            n_estimators=self.n_estimators,
            max_depth=self.max_depth,
            random_state=self.random_state,
            n_jobs=-1
        )

    def train_and_evaluate(
        self, 
        X: np.ndarray, 
        y: np.ndarray, 
        version_tag: str = "v1.0.0"
    ) -> Dict[str, Any]:
        """Melatih model pada fitur X dan target y, mengevaluasi, lalu menyimpan ke registry jika lolos.

        Args:
            X: Matriks fitur dimensi (N, n_features).
            y: Vektor target biner (0 = Aman, 1 = Rawan/Bahaya).
            version_tag: Label versi model (misal 'v2.4.0').

        Returns:
            Dict metrik hasil evaluasi dan status registrasi model.
        """
        # 1. Train-Test Split (80% Train, 20% Test)
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=self.settings.rf_test_size, random_state=self.random_state, stratify=y
        )

        start_time = time.time()
        self.model.fit(X_train, y_train)
        duration_seconds = round(time.time() - start_time, 2)

        # 2. Prediksi pada data uji (Test Set)
        y_pred = self.model.predict(X_test)

        # 3. Hitung seluruh metrik
        metrics = ModelEvaluator.evaluate(
            y_true=y_test,
            y_pred=y_pred,
            feature_names=self.FEATURE_NAMES,
            feature_importances=self.model.feature_importances_,
        )

        metrics["training_duration_seconds"] = duration_seconds
        metrics["dataset_size"] = len(X)
        metrics["version"] = version_tag

        # 4. Simpan artefak model ke registry
        model_path, meta_path = self._save_artifact(version_tag, metrics)
        metrics["model_artifact_path"] = str(model_path)

        return metrics

    def _save_artifact(self, version: str, metrics: Dict[str, Any]) -> Tuple[Path, Path]:
        """Menyimpan file binari .joblib dan metadata ringkasan pelatihan."""
        registry_dir = self.settings.models_registry_dir
        registry_dir.mkdir(parents=True, exist_ok=True)

        model_file = registry_dir / f"risk_model_{version}.joblib"
        meta_file = registry_dir / f"metadata_{version}.json"

        # Simpan binary model
        joblib.dump(self.model, model_file)

        # Simpan metadata JSON untuk disinkronkan ke API Gateway
        with open(meta_file, "w", encoding="utf-8") as f:
            json.dump(metrics, f, indent=2)

        return model_file, meta_file
