"""Spatial Clustering Module menggunakan Algoritma DBSCAN.

Mendeteksi hotspot/zona rawan kriminalitas berdasarkan densitas insiden
menggunakan metrik jarak Haversine (lingkaran bumi).
"""

from typing import Dict, List, Any
import numpy as np
from sklearn.cluster import DBSCAN

class SpatialClusterer:
    """Mengelompokkan koordinat insiden geografis ke dalam klaster zona rawan."""

    # Jari-jari bumi dalam kilometer untuk normalisasi metrik Haversine
    EARTH_RADIUS_KM = 6371.0088

    def __init__(self, eps_km: float = 0.35, min_samples: int = 4):
        """Inisialisasi clusterer.

        Args:
            eps_km: Radius jarak maksimum antar titik dalam kilometer (default 350m).
            min_samples: Jumlah titik minimum untuk membentuk klaster inti.
        """
        self.eps_km = eps_km
        self.min_samples = min_samples
        # Konversi eps kilometer ke radian untuk metrik Haversine
        self.eps_radians = eps_km / self.EARTH_RADIUS_KM
        self.model = DBSCAN(
            eps=self.eps_radians,
            min_samples=self.min_samples,
            metric="haversine"
        )

    def fit_predict(self, coordinates: np.ndarray) -> np.ndarray:
        """Menjalankan clustering pada array koordinat [[lat, lon], ...].

        Args:
            coordinates: Array NumPy berdimensi (N, 2) berisi latitude dan longitude (derajat).

        Returns:
            Array label klaster (-1 untuk noise/titik terisolasi, >= 0 untuk ID klaster).
        """
        if len(coordinates) == 0:
            return np.array([])

        # Sklearn haversine membutuhkan urutan [latitude, longitude] dalam radian
        coords_rad = np.radians(coordinates)
        labels = self.model.fit_predict(coords_rad)
        return labels

    def summarize_clusters(self, coordinates: np.ndarray, labels: np.ndarray) -> List[Dict[str, Any]]:
        """Menghitung ringkasan statistik tiap klaster (centroid, jumlah insiden, level risiko).

        Args:
            coordinates: Array koordinat asli (derajat).
            labels: Array label hasil prediksi DBSCAN.

        Returns:
            List dictionary berisi metadata tiap zona rawan terdeteksi.
        """
        unique_labels = set(labels)
        summaries = []

        for label in unique_labels:
            if label == -1:
                # Titik noise tidak dihitung sebagai klaster zona rawan terpusat
                continue

            cluster_points = coordinates[labels == label]
            center_lat = float(np.mean(cluster_points[:, 0]))
            center_lon = float(np.mean(cluster_points[:, 1]))
            point_count = int(len(cluster_points))

            # Penentuan level risiko berbasis densitas insiden
            if point_count >= 10:
                risk_tier = "Bahaya"
            elif point_count >= 6:
                risk_tier = "Berisiko"
            else:
                risk_tier = "Waspada"

            summaries.append({
                "cluster_id": int(label),
                "center_latitude": center_lat,
                "center_longitude": center_lon,
                "incident_count": point_count,
                "risk_tier": risk_tier,
            })

        return sorted(summaries, key=lambda x: x["incident_count"], reverse=True)
