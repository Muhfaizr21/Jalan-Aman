"""Pipeline Ekstraksi Fitur & Transformasi Data JalanAman."""

from typing import Tuple, List, Dict, Any
import numpy as np

class FeaturePipeline:
    """Mengubah data mentah laporan insiden dan jalanan menjadi matriks fitur numerik siap latih."""

    @staticmethod
    def extract_time_window_risk(hour: int) -> float:
        """Menghitung faktor risiko waktu berdasarkan jam aktivitas.

        Jam 00.00 - 04.59 memiliki bobot risiko tertinggi (kejahatan malam/dini hari).
        """
        if 0 <= hour <= 4:
            return 1.0  # Sangat rawan
        elif 21 <= hour <= 23:
            return 0.75  # Rawan (larut malam)
        elif 18 <= hour <= 20:
            return 0.5  # Waspada (maghrib / malam awal)
        else:
            return 0.15  # Siang hari (risiko relatif rendah)

    @staticmethod
    def generate_synthetic_features(n_samples: int = 500, random_state: int = 42) -> Tuple[np.ndarray, np.ndarray]:
        """Menghasilkan dataset representatif untuk pengujian pipeline sebelum dataset eksternal diunggah.

        Fitur:
        0. Densitas Insiden Sekitar (0 - 20)
        1. Kualitas Penerangan Jalan (0 = Terang, 1 = Redup, 2 = Gelap)
        2. Lebar & Kelas Jalan (0 = Arteri, 1 = Kolektor, 2 = Gang/Lorong)
        3. Risiko Jam/Waktu (0.0 - 1.0)
        4. Tingkat Kejahatan Historis Polisi (0.0 - 1.0)
        5. Skor Ulasan Pengguna / Feedback (0.0 - 1.0)
        """
        rng = np.random.RandomState(random_state)

        incident_density = rng.poisson(lam=4.0, size=n_samples)
        lighting = rng.choice([0, 1, 2], p=[0.4, 0.35, 0.25], size=n_samples)
        road_class = rng.choice([0, 1, 2], p=[0.3, 0.4, 0.3], size=n_samples)
        hours = rng.randint(0, 24, size=n_samples)
        time_risk = np.array([FeaturePipeline.extract_time_window_risk(h) for h in hours])
        police_rate = rng.beta(a=2, b=5, size=n_samples)
        user_feedback = rng.uniform(0.1, 0.9, size=n_samples)

        X = np.column_stack([
            incident_density,
            lighting,
            road_class,
            time_risk,
            police_rate,
            user_feedback
        ])

        # Target biner: 1 jika kombinasi faktor bahaya melewati threshold
        risk_score_continuous = (
            0.30 * (incident_density / 10.0) +
            0.25 * (lighting / 2.0) +
            0.15 * (road_class / 2.0) +
            0.15 * time_risk +
            0.15 * police_rate
        )
        # Noise acak realitas lapangan
        noise = rng.normal(0, 0.05, size=n_samples)
        y = (risk_score_continuous + noise > 0.45).astype(int)

        return X, y
