"""Unit Test Komprehensif untuk Komponen AI Engine JalanAman."""

import unittest
import numpy as np
from pathlib import Path
import sys

# Tambahkan root path ai-engine
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from src.clustering.dbscan_clusterer import SpatialClusterer
from src.preprocessing.feature_pipeline import FeaturePipeline
from src.prediction.trainer import RiskModelTrainer
from src.prediction.evaluator import ModelEvaluator
from src.routing.astar_solver import SafeRouteSolver

class TestAIEngine(unittest.TestCase):

    def test_feature_pipeline(self):
        """Memverifikasi pembentukan matriks fitur X dan target y."""
        X, y = FeaturePipeline.generate_synthetic_features(n_samples=50)
        self.assertEqual(X.shape[0], 50)
        self.assertEqual(X.shape[1], 6)
        self.assertEqual(len(y), 50)
        self.assertTrue(set(np.unique(y)).issubset({0, 1}))

    def test_dbscan_clustering(self):
        """Memverifikasi algoritma spatial clustering DBSCAN."""
        # 4 titik berdekatan di Bandung (-6.91, 107.61) dan 1 titik jauh
        coords = np.array([
            [-6.9147, 107.6098],
            [-6.9150, 107.6101],
            [-6.9149, 107.6099],
            [-6.9152, 107.6102],
            [-6.9500, 107.6800],  # Titik terisolasi (noise)
        ])
        clusterer = SpatialClusterer(eps_km=0.5, min_samples=3)
        labels = clusterer.fit_predict(coords)
        
        self.assertEqual(len(labels), 5)
        # Titik pertama harus membentuk klaster >= 0
        self.assertGreaterEqual(labels[0], 0)
        # Titik terakhir harus dianggap noise (-1)
        self.assertEqual(labels[4], -1)

    def test_risk_model_trainer(self):
        """Memverifikasi proses pelatihan Random Forest dan perhitungan metrik."""
        X, y = FeaturePipeline.generate_synthetic_features(n_samples=100)
        trainer = RiskModelTrainer(n_estimators=10, max_depth=5)
        metrics = trainer.train_and_evaluate(X, y, version_tag="test_v1.0")

        self.assertIn("accuracy", metrics)
        self.assertIn("confusion_matrix", metrics)
        self.assertIn("feature_importance", metrics)
        self.assertGreater(metrics["accuracy"], 50.0)

    def test_safe_route_solver(self):
        """Memverifikasi penghitungan rute aman vs tercepat pada graf."""
        # Graf sederhana: Node A -> Node B (Rute Tercepat tapi Rawan) vs Node A -> Node C -> Node B (Rute Aman tapi Memutar)
        graph = {
            "NodeA": [
                {"to": "NodeB", "length_m": 500, "risk_score": 90},  # Dekat tapi Bahaya
                {"to": "NodeC", "length_m": 400, "risk_score": 10},  # Memutar tapi Aman
            ],
            "NodeC": [
                {"to": "NodeB", "length_m": 400, "risk_score": 10},
            ],
            "NodeB": []
        }

        solver = SafeRouteSolver(penalty_multiplier=3.0)
        
        # Mode Cepat: Memilih langsung A -> B
        fast_res = solver.solve(graph, "NodeA", "NodeB", mode="fastest")
        self.assertEqual(fast_res["path"], ["NodeA", "NodeB"])
        self.assertEqual(fast_res["total_distance_m"], 500)

        # Mode Aman: Memilih memutar A -> C -> B demi menghindari risiko 90
        safe_res = solver.solve(graph, "NodeA", "NodeB", mode="safe")
        self.assertEqual(safe_res["path"], ["NodeA", "NodeC", "NodeB"])
        self.assertEqual(safe_res["total_distance_m"], 800)
        self.assertEqual(safe_res["average_risk_score"], 10.0)

if __name__ == "__main__":
    unittest.main()
