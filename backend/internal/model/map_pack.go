package model

import "time"

// OfflineMapPack merepresentasikan bundel data peta offline dan koridor keselamatan
type OfflineMapPack struct {
	PackID          string                 `json:"pack_id"`
	RegionName      string                 `json:"region_name"`
	Description     string                 `json:"description"`
	BoundingBox     []float64              `json:"bounding_box"` // [minLon, minLat, maxLon, maxLat]
	Center          []float64              `json:"center"`       // [lon, lat]
	ZoomRange       []int                  `json:"zoom_range"`   // [minZoom, maxZoom]
	EstimatedBytes  int64                  `json:"estimated_bytes"`
	Version         string                 `json:"version"`
	UpdatedAt       time.Time              `json:"updated_at"`
	Waypoints       []CorridorWaypoint     `json:"waypoints"`
	Corridors       []OfflineCorridor      `json:"corridors"`
	SafeHavens      []OfflineSafeHaven     `json:"safe_havens"`
	TileManifest    []string               `json:"tile_manifest"` // URL ubin peta untuk di-prefetch
}

// CorridorWaypoint adalah titik koordinat penting di sepanjang jalur rawan
type CorridorWaypoint struct {
	Name        string    `json:"name"`
	Coordinates []float64 `json:"coordinates"` // [lon, lat]
	Type        string    `json:"type"`        // 'checkpoint', 'pos_ronda', 'spbu_24h', 'polsek'
	Status      string    `json:"status"`      // 'siaga', 'rawan_malam', 'aman'
}

// OfflineCorridor mendefinisikan rute aman jalur Pantura Indramayu
type OfflineCorridor struct {
	ID          string      `json:"id"`
	Name        string      `json:"name"`
	RiskLevel   string      `json:"risk_level"` // 'low', 'medium', 'high'
	SafetyScore int         `json:"safety_score"`
	Path        [][]float64 `json:"path"` // Array of [lon, lat]
}

// OfflineSafeHaven mendefinisikan titik evakuasi 24 jam yang bisa diakses offline
type OfflineSafeHaven struct {
	ID          string    `json:"id"`
	Name        string    `json:"name"`
	Category    string    `json:"category"` // 'polsek', 'koramil', 'spbu', 'pos_ronda', 'puskesmas'
	Address     string    `json:"address"`
	Coordinates []float64 `json:"coordinates"` // [lon, lat]
	Phone       string    `json:"phone"`
	IsVerified  bool      `json:"is_verified"`
}
