package view

import (
	"time"

	"github.com/Muhfaizr21/Jalan-Aman/backend/internal/model"
)

// IncidentResponse adalah DTO tampilan response ke client (V dalam MVC)
type IncidentResponse struct {
	ID          string                 `json:"id"`
	Category    string                 `json:"category"`
	Title       string                 `json:"title"`
	Description string                 `json:"description"`
	Location    LocationView           `json:"location"`
	Severity    model.IncidentSeverity `json:"severity"`
	Status      model.IncidentStatus   `json:"status"`
	ReportedAt  time.Time              `json:"reported_at"`
}

// LocationView adalah format representasi lokasi geografis
type LocationView struct {
	Latitude  float64 `json:"latitude"`
	Longitude float64 `json:"longitude"`
	Address   string  `json:"address,omitempty"`
}

// FormatIncident memformat model domain ke bentuk view respons DTO
func FormatIncident(m *model.Incident) IncidentResponse {
	if m == nil {
		return IncidentResponse{}
	}
	return IncidentResponse{
		ID:          m.ID,
		Category:    m.Category,
		Title:       m.Title,
		Description: m.Description,
		Location: LocationView{
			Latitude:  m.Latitude,
			Longitude: m.Longitude,
			Address:   m.Address,
		},
		Severity:   m.Severity,
		Status:     m.Status,
		ReportedAt: m.CreatedAt,
	}
}

// FormatIncidentList memformat list model domain ke list view respons DTO
func FormatIncidentList(list []*model.Incident) []IncidentResponse {
	result := make([]IncidentResponse, 0, len(list))
	for _, item := range list {
		result = append(result, FormatIncident(item))
	}
	return result
}
