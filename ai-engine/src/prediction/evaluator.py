"""Modul Evaluasi Kinerja Model Prediksi Risiko."""

from typing import Dict, Any, List
import numpy as np
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    confusion_matrix
)

class ModelEvaluator:
    """Menghitung metrik performa komprehensif untuk model klasifikasi risiko."""

    @staticmethod
    def evaluate(
        y_true: np.ndarray, 
        y_pred: np.ndarray, 
        feature_names: List[str] = None, 
        feature_importances: np.ndarray = None
    ) -> Dict[str, Any]:
        """Menghitung akurasi, precision, recall, f1, confusion matrix, dan feature importance.

        Args:
            y_true: Label aktual ground-truth (0 = Aman, 1 = Bahaya).
            y_pred: Label hasil prediksi model.
            feature_names: Nama-nama fitur input.
            feature_importances: Bobot importance dari Random Forest.

        Returns:
            Dict metrik siap disinkronkan ke dashboard Superadmin.
        """
        acc = float(accuracy_score(y_true, y_pred))
        prec = float(precision_score(y_true, y_pred, zero_division=0))
        rec = float(recall_score(y_true, y_pred, zero_division=0))
        f1 = float(f1_score(y_true, y_pred, zero_division=0))

        # Confusion matrix: [[TN, FP], [FN, TP]]
        cm = confusion_matrix(y_true, y_pred, labels=[0, 1])
        tn, fp, fn, tp = cm.ravel() if cm.size == 4 else (0, 0, 0, 0)

        # Feature Importance mapping
        importance_map = {}
        if feature_names is not None and feature_importances is not None:
            for name, imp in zip(feature_names, feature_importances):
                importance_map[name] = round(float(imp) * 100, 2)

        return {
            "accuracy": round(acc * 100, 2),
            "precision": round(prec * 100, 2),
            "recall": round(rec * 100, 2),
            "f1_score": round(f1 * 100, 2),
            "confusion_matrix": {
                "true_positive": int(tp),
                "false_positive": int(fp),
                "false_negative": int(fn),
                "true_negative": int(tn),
            },
            "feature_importance": importance_map,
        }
