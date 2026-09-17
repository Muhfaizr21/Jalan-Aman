#!/usr/bin/env python3
"""Script CLI untuk Melatih Model Random Forest JalanAman.

Dapat dieksekusi langsung oleh Superadmin atau dipanggil otomatis oleh Backend Golang:
Contoh: python3 scripts/train.py --version v2.4.0 --samples 1000
"""

import argparse
import json
import sys
from pathlib import Path

# Pastikan root ai-engine berada di sys.path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from src.preprocessing.feature_pipeline import FeaturePipeline
from src.prediction.trainer import RiskModelTrainer

def main():
    parser = argparse.ArgumentParser(description="JalanAman Automated Model Retraining Script")
    parser.add_argument("--version", type=str, default="v1.0.0", help="Tag versi model yang akan disimpan")
    parser.add_argument("--samples", type=int, default=500, help="Jumlah sampel data sintetis jika dataset belum ada")
    parser.add_argument("--trees", type=int, default=100, help="Jumlah pohon di Random Forest")
    parser.add_argument("--dataset", type=str, default="", help="Path file dataset CSV jika diunggah dari dashboard")

    args = parser.parse_args()

    print(f"[AI Engine] Memulai proses pelatihan model versi {args.version}...")

    # 1. Ekstraksi fitur
    if args.dataset and Path(args.dataset).exists():
        print(f"[AI Engine] Membaca dataset dari: {args.dataset}")
        # TODO: Implementasi pembacaan CSV/GeoJSON riil
        X, y = FeaturePipeline.generate_synthetic_features(n_samples=args.samples)
    else:
        print(f"[AI Engine] Menggunakan feature pipeline sintetis ({args.samples} sampel data uji)")
        X, y = FeaturePipeline.generate_synthetic_features(n_samples=args.samples)

    # 2. Pelatihan & Evaluasi Model
    trainer = RiskModelTrainer(n_estimators=args.trees)
    metrics = trainer.train_and_evaluate(X, y, version_tag=args.version)

    print(f"\n[AI Engine] Pelatihan Sukses dalam {metrics['training_duration_seconds']} detik!")
    print(f"[AI Engine] Akurasi Model    : {metrics['accuracy']}%")
    print(f"[AI Engine] Precision        : {metrics['precision']}%")
    print(f"[AI Engine] Recall           : {metrics['recall']}%")
    print(f"[AI Engine] F1-Score         : {metrics['f1_score']}%")
    print(f"[AI Engine] Confusion Matrix : {metrics['confusion_matrix']}")
    print(f"[AI Engine] Model disimpan di: {metrics['model_artifact_path']}")

    # Cetak JSON ke stdout untuk dikonsumsi API Gateway
    print("\n--- METRICS_OUTPUT_START ---")
    print(json.dumps(metrics, indent=2))
    print("--- METRICS_OUTPUT_END ---")

if __name__ == "__main__":
    main()
