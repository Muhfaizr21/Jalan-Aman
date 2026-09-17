package model

import (
	"errors"
	"strings"
	"time"
)

// IncidentSeverity mendefinisikan tingkat keparahan insiden
type IncidentSeverity string

const (
	SeverityLow      IncidentSeverity = "Low"
	SeverityModerate IncidentSeverity = "Moderate"
	SeverityHigh     IncidentSeverity = "High"
	SeverityCritical IncidentSeverity = "Critical"
)

// IncidentStatus mendefinisikan status verifikasi insiden
type IncidentStatus string

const (
	StatusPending  IncidentStatus = "Pending"
	StatusVerified IncidentStatus = "Verified"
	StatusRejected IncidentStatus = "Rejected"
)

// Incident merepresentasikan entitas domain Insiden (M dalam MVC)
type Incident struct {
	ID          string           `json:"id"`
	Category    string           `json:"category"`
	Title       string           `json:"title"`
	Description string           `json:"description"`
	Latitude    float64          `json:"latitude"`
	Longitude   float64          `json:"longitude"`
	Address     string           `json:"address"`
	Severity    IncidentSeverity `json:"severity"`
	Status      IncidentStatus   `json:"status"`
	ReporterID  string           `json:"reporter_id"`
	CreatedAt   time.Time        `json:"created_at"`
	UpdatedAt   time.Time        `json:"updated_at"`
}

// Validate melakukan validasi domain model
func (i *Incident) Validate() error {
	if strings.TrimSpace(i.Title) == "" {
		return errors.New("judul insiden wajib diisi")
	}
	if strings.TrimSpace(i.Category) == "" {
		return errors.New("kategori insiden wajib diisi")
	}
	if i.Latitude < -90 || i.Latitude > 90 {
		return errors.New("latitude berada di luar batas valid (-90 s/d 90)")
	}
	if i.Longitude < -180 || i.Longitude > 180 {
		return errors.New("longitude berada di luar batas valid (-180 s/d 180)")
	}
	return nil
}
