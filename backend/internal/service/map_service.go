package service

import (
	"context"
	"fmt"
	"math"
	"time"

	"github.com/Muhfaizr21/Jalan-Aman/backend/internal/model"
)

// MapService menyediakan layanan bundel peta luring dan geofencing koridor
type MapService interface {
	GetIndramayuOfflinePack(ctx context.Context) (*model.OfflineMapPack, error)
}

type mapService struct{}

// NewMapService membuat instance MapService baru
func NewMapService() MapService {
	return &mapService{}
}

// lonLatToTileXY mengonversi koordinat WGS84 ke nomor ubin Slippy Map (x, y)
func lonLatToTileXY(lon, lat float64, zoom int) (int, int) {
	n := math.Pow(2.0, float64(zoom))
	x := int(math.Floor((lon + 180.0) / 360.0 * n))
	latRad := lat * math.Pi / 180.0
	y := int(math.Floor((1.0 - math.Log(math.Tan(latRad)+(1.0/math.Cos(latRad)))/math.Pi) / 2.0 * n))
	return x, y
}

func (s *mapService) GetIndramayuOfflinePack(ctx context.Context) (*model.OfflineMapPack, error) {
	// Bounding Box Indramayu - Pantura Jatibarang
	minLon, minLat := 108.20, -6.48
	maxLon, maxLat := 108.45, -6.25

	// Generate Tile URLs untuk ESRI World Imagery di zoom level 12 hingga 14
	tileManifest := make([]string, 0)
	for z := 12; z <= 14; z++ {
		minX, maxY := lonLatToTileXY(minLon, minLat, z)
		maxX, minY := lonLatToTileXY(maxLon, maxLat, z)

		if minX > maxX {
			minX, maxX = maxX, minX
		}
		if minY > maxY {
			minY, maxY = maxY, minY
		}

		// Batasi per zoom level agar efisien (maks 30 tile esensial per zoom)
		count := 0
		for x := minX; x <= maxX; x++ {
			for y := minY; y <= maxY; y++ {
				tileManifest = append(tileManifest, fmt.Sprintf("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/%d/%d/%d", z, y, x))
				count++
				if count > 25 {
					break
				}
			}
			if count > 25 {
				break
			}
		}
	}

	pack := &model.OfflineMapPack{
		PackID:         "indramayu-pantura-v1",
		RegionName:     "Indramayu & Pantura Jatibarang Corridor",
		Description:    "Paket peta luring darurat jalur rawan Pantura Losarang, Kandanghaur, Lohbener, hingga Stasiun Jatibarang & Alun-Alun Indramayu.",
		BoundingBox:    []float64{minLon, minLat, maxLon, maxLat},
		Center:         []float64{108.3188, -6.4012}, // Jatibarang - Lohbener junction
		ZoomRange:      []int{11, 16},
		EstimatedBytes: 1932735283, // ~1.8 GB visual metric representation
		Version:        "2026.09.1",
		UpdatedAt:      time.Now(),
		Waypoints: []model.CorridorWaypoint{
			{Name: "Pos Ronda Siaga Patrol Pantura", Coordinates: []float64{108.0051, -6.3150}, Type: "pos_ronda", Status: "siaga"},
			{Name: "Polsek Kandanghaur 24 Jam", Coordinates: []float64{108.1523, -6.3562}, Type: "polsek", Status: "siaga"},
			{Name: "SPBU Pantura Losarang (Zona Terang)", Coordinates: []float64{108.2312, -6.4021}, Type: "spbu_24h", Status: "siaga"},
			{Name: "Simpang Celeng Lohbener", Coordinates: []float64{108.2845, -6.3768}, Type: "checkpoint", Status: "rawan_malam"},
			{Name: "Pos Polantas Pasar Jatibarang", Coordinates: []float64{108.3188, -6.4712}, Type: "polsek", Status: "siaga"},
			{Name: "Alun-Alun Indramayu Kota", Coordinates: []float64{108.3242, -6.3264}, Type: "checkpoint", Status: "aman"},
		},
		Corridors: []model.OfflineCorridor{
			{
				ID:          "corridor-pantura-main",
				Name:        "Jalur Arteri Pantura Jatibarang - Lohbener",
				RiskLevel:   "medium",
				SafetyScore: 84,
				Path: [][]float64{
					{108.3188, -6.4712},
					{108.3050, -6.4420},
					{108.2845, -6.3768},
					{108.2312, -6.4021},
					{108.1523, -6.3562},
				},
			},
			{
				ID:          "corridor-lohbener-kota",
				Name:        "Jalur Penghubung Lohbener - Indramayu Kota",
				RiskLevel:   "low",
				SafetyScore: 92,
				Path: [][]float64{
					{108.2845, -6.3768},
					{108.2990, -6.3540},
					{108.3120, -6.3380},
					{108.3242, -6.3264},
				},
			},
		},
		SafeHavens: []model.OfflineSafeHaven{
			{
				ID:          "sh-offline-01",
				Name:        "Polsek Jatibarang (Siaga 24 Jam)",
				Category:    "polsek",
				Address:     "Jl. Mayor Dasuki No. 88, Jatibarang, Indramayu",
				Coordinates: []float64{108.3165, -6.4690},
				Phone:       "0234-351110",
				IsVerified:  true,
			},
			{
				ID:          "sh-offline-02",
				Name:        "Koramil 1615/Jatibarang",
				Category:    "koramil",
				Address:     "Jl. Siliwangi No. 12, Jatibarang, Indramayu",
				Coordinates: []float64{108.3190, -6.4665},
				Phone:       "0234-351210",
				IsVerified:  true,
			},
			{
				ID:          "sh-offline-03",
				Name:        "SPBU 34.452.01 Pantura Losarang",
				Category:    "spbu",
				Address:     "Jalur Utama Pantura Km 68, Losarang, Indramayu",
				Coordinates: []float64{108.2312, -6.4021},
				Phone:       "0234-505123",
				IsVerified:  true,
			},
			{
				ID:          "sh-offline-04",
				Name:        "RSUD Indramayu (IGD 24 Jam)",
				Category:    "puskesmas",
				Address:     "Jl. Murahnara No. 7, Sindangkerta, Indramayu",
				Coordinates: []float64{108.3280, -6.3315},
				Phone:       "0234-272655",
				IsVerified:  true,
			},
		},
		TileManifest: tileManifest,
	}

	return pack, nil
}
