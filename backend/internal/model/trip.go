package model

import (
	"errors"
	"strings"
	"time"
)

type TripStatus string

const (
	TripStatusActive    TripStatus = "active"
	TripStatusCompleted TripStatus = "completed"
	TripStatusCancelled TripStatus = "cancelled"
)

// Trip merepresentasikan rekam jejak sesi perjalanan yang terlindungi di PostgreSQL
type Trip struct {
	ID                    string     `json:"id"`
	UserID                string     `json:"user_id"`
	OriginName            string     `json:"origin_name"`
	DestinationName       string     `json:"destination_name"`
	OriginLat             float64    `json:"origin_lat"`
	OriginLng             float64    `json:"origin_lng"`
	DestLat               float64    `json:"dest_lat"`
	DestLng               float64    `json:"dest_lng"`
	Status                TripStatus `json:"status"` // 'active', 'completed', 'cancelled'
	IsEncrypted           bool       `json:"is_encrypted"`
	Mode                  string     `json:"mode"` // 'walk', 'motor'
	DistanceKm            float64    `json:"distance_km"`
	DurationMinutes       int        `json:"duration_minutes"`
	SafetyScore           int        `json:"safety_score"`
	ProtectionHighlights  string     `json:"protection_highlights"`
	AvoidedHazardsCount   int        `json:"avoided_hazards_count"`
	AvoidedDarkAreasCount int        `json:"avoided_dark_areas_count"`
	StartTime             time.Time  `json:"start_time"`
	ArrivedAt             *time.Time `json:"arrived_at,omitempty"`
	CreatedAt             time.Time  `json:"created_at"`
}

// TripStats adalah rangkuman statistik perjalanan terlindungi per periode
type TripStats struct {
	TotalCompleted        int     `json:"total_completed"`
	TotalDistanceKm       float64 `json:"total_distance_km"`
	AverageSafetyScore    float64 `json:"average_safety_score"`
	AvoidedHazardsCount   int     `json:"avoided_hazards_count"`
	AvoidedDarkAreasCount int     `json:"avoided_dark_areas_count"`
}

// TripHistoryResponse adalah DTO respons untuk riwayat dan statistik perjalanan
type TripHistoryResponse struct {
	Period      string     `json:"period"`
	PeriodLabel string     `json:"period_label"`
	Stats       TripStats  `json:"stats"`
	Trips       []*Trip    `json:"trips"`
}

// TripTelemetry merepresentasikan titik koordinat live GPS perjalanan
type TripTelemetry struct {
	ID               string    `json:"id"`
	TripID           string    `json:"trip_id"`
	UserID           string    `json:"user_id"`
	Latitude         float64   `json:"latitude"`
	Longitude        float64   `json:"longitude"`
	EncryptedPayload string    `json:"encrypted_payload,omitempty"` // Mil-Grade 256 ciphertext
	SpeedKmh         float64   `json:"speed_kmh"`
	RecordedAt       time.Time `json:"recorded_at"`
}

// StartTripRequest adalah request DTO untuk memulai rute perjalanan
type StartTripRequest struct {
	OriginName      string  `json:"origin_name"`
	DestinationName string  `json:"destination_name"`
	OriginLat       float64 `json:"origin_lat"`
	OriginLng       float64 `json:"origin_lng"`
	DestLat         float64 `json:"dest_lat"`
	DestLng         float64 `json:"dest_lng"`
}

func (r *StartTripRequest) Validate() error {
	if strings.TrimSpace(r.OriginName) == "" {
		return errors.New("lokasi asal (origin_name) wajib diisi")
	}
	if strings.TrimSpace(r.DestinationName) == "" {
		return errors.New("lokasi tujuan (destination_name) wajib diisi")
	}
	if r.OriginLat < -90 || r.OriginLat > 90 || r.OriginLng < -180 || r.OriginLng > 180 {
		return errors.New("koordinat asal tidak valid")
	}
	if r.DestLat < -90 || r.DestLat > 90 || r.DestLng < -180 || r.DestLng > 180 {
		return errors.New("koordinat tujuan tidak valid")
	}
	return nil
}

// RecordTelemetryRequest adalah request DTO untuk memperbarui koordinat GPS live
type RecordTelemetryRequest struct {
	TripID    string  `json:"trip_id"`
	Latitude  float64 `json:"latitude"`
	Longitude float64 `json:"longitude"`
	SpeedKmh  float64 `json:"speed_kmh"`
}

func (r *RecordTelemetryRequest) Validate() error {
	if strings.TrimSpace(r.TripID) == "" {
		return errors.New("trip_id wajib diisi")
	}
	if r.Latitude < -90 || r.Latitude > 90 || r.Longitude < -180 || r.Longitude > 180 {
		return errors.New("koordinat telemetri tidak valid")
	}
	return nil
}
