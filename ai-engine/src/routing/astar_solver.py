"""Modified A-Star Safe Routing Algorithm.

Menghitung rute teraman vs tercepat dengan mempertimbangkan penalti bobot
risiko kejahatan pada tiap segmen jalan dalam graf jaringan jalan.
"""

import heapq
from typing import Dict, List, Tuple, Optional, Any

class SafeRouteSolver:
    """Graph Solver yang mencari rute terbaik berdasarkan jarak dan bobot risiko."""

    def __init__(self, penalty_multiplier: float = 2.5):
        """Inisialisasi solver.

        Args:
            penalty_multiplier: Faktor pengali penalti saat melewati segmen berisiko tinggi.
        """
        self.penalty_multiplier = penalty_multiplier

    def solve(
        self,
        graph: Dict[str, List[Dict[str, Any]]],
        start_node: str,
        target_node: str,
        mode: str = "safe"
    ) -> Optional[Dict[str, Any]]:
        """Mencari jalur optimal menggunakan algoritma Dijkstra / A*.

        Args:
            graph: Representasi adjacency list graf jalanan:
                   { "nodeA": [{"to": "nodeB", "length_m": 250, "risk_score": 75}, ...] }
            start_node: ID simpul asal.
            target_node: ID simpul tujuan.
            mode: 'safe' (mengutamakan keselamatan) atau 'fastest' (murni jarak minimum).

        Returns:
            Dict jalur terbaik, total jarak, estimasi waktu, dan rata-rata skor risiko.
        """
        multiplier = self.penalty_multiplier if mode == "safe" else 0.0

        # Priority queue menampung: (total_cost, current_node, path, total_length, total_risk_sum)
        pq: List[Tuple[float, str, List[str], float, float]] = [(0.0, start_node, [start_node], 0.0, 0.0)]
        visited: Dict[str, float] = {}

        while pq:
            cost, current, path, length_accum, risk_accum = heapq.heappop(pq)

            if current == target_node:
                avg_risk = round(risk_accum / max(1, len(path) - 1), 1)
                # Estimasi waktu tempuh (rata-rata kecepatan 30 km/jam = 500 m/menit)
                duration_minutes = round(length_accum / 500.0, 1)

                return {
                    "mode": mode,
                    "path": path,
                    "total_distance_m": round(length_accum, 1),
                    "estimated_minutes": duration_minutes,
                    "average_risk_score": avg_risk,
                }

            if current in visited and visited[current] <= cost:
                continue
            visited[current] = cost

            for edge in graph.get(current, []):
                next_node = edge["to"]
                edge_len = float(edge["length_m"])
                edge_risk = float(edge.get("risk_score", 0.0))

                # Formula Bobot Aman: length * (1 + (risk / 100) * multiplier)
                edge_cost = edge_len * (1.0 + (edge_risk / 100.0) * multiplier)

                heapq.heappush(
                    pq,
                    (cost + edge_cost, next_node, path + [next_node], length_accum + edge_len, risk_accum + edge_risk)
                )

        return None
