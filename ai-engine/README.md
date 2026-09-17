# JalanAman AI Engine (Python 3.11)

Modul kecerdasan buatan terpusat untuk platform keselamatan navigasi **JalanAman**. Bertanggung jawab atas clustering spasial hotspot kriminalitas, klasifikasi risiko jalan berbasis Machine Learning, dan graph solver rute aman.

---

## 🏛️ Pola Arsitektur Clean Code

```
ai-engine/
├── config/
│   ├── __init__.py
│   └── settings.py               # [Settings] Konfigurasi terpusat & hyperparameter (DBSCAN eps, RF trees)
├── data/
│   ├── raw/                      # [Raw Data] File dataset mentah yang diunggah (.csv, .geojson)
│   └── processed/                # [Processed] Data hasil normalisasi & feature engineering
├── models/
│   └── registry/                 # [Model Registry] Serialized model (.joblib) & metadata JSON
├── src/
│   ├── clustering/
│   │   ├── __init__.py
│   │   └── dbscan_clusterer.py   # [DBSCAN] Spatial clustering (Haversine radian metric)
│   ├── prediction/
│   │   ├── __init__.py
│   │   ├── trainer.py            # [Random Forest] Training pipeline & model exporter
│   │   └── evaluator.py          # [Evaluation] Confusion Matrix, Akurasi, Feature Importance
│   ├── routing/
│   │   ├── __init__.py
│   │   └── astar_solver.py       # [Modified A*] Safe Routing vs Fastest Routing solver
│   └── preprocessing/
│       ├── __init__.py
│       └── feature_pipeline.py   # [Feature Eng] Temporal window risk, densitas insiden
├── scripts/
│   └── train.py                  # [CLI Tool] Script eksekusi retraining model
├── tests/
│   └── test_pipeline.py          # [Unit Tests] Pengujian pipeline end-to-end
├── .env.example
├── .gitignore
├── requirements.txt
└── README.md
```

---

## 🚀 Panduan Menjalankan AI Engine

### 1. Aktivasi Virtual Environment
```bash
cd ai-engine
source .venv/bin/activate
```

### 2. Menjalankan Pelatihan Model (CLI Retraining)
```bash
python scripts/train.py --version v1.0.0 --samples 1000 --trees 100
```

Output:
- Akurasi, Precision, Recall, F1-Score
- Matriks Konfusi (`true_positive`, `false_positive`, `false_negative`, `true_negative`)
- Bobot Feature Importance
- Model biner disimpan otomatis di `models/registry/risk_model_v1.0.0.joblib`
- Metadata metrik disimpan di `models/registry/metadata_v1.0.0.json`

### 3. Menjalankan Unit Tests
```bash
python -m unittest tests/test_pipeline.py
```
